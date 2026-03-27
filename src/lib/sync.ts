import { getServiceClient } from "./supabase";
import { readSheet, type SheetRow } from "./sheets";

type SyncResult = {
  rows_processed: number;
  rows_upserted: number;
  errors: { row: number; error: string }[];
  duration_ms: number;
};

function parseTags(value: string): string[] {
  if (!value) return [];
  return value
    .split(/[,;|]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

// Map sheet categories to our standard category IDs (must match categories.ts)
const CATEGORY_MAP: Record<string, string> = {
  "health & support": "Healthcare & Support",
  "health": "Healthcare & Support",
  "healthcare": "Healthcare & Support",
  "healthcare & support": "Healthcare & Support",
  "community & student group": "Community & Student Group",
  "community & student groups": "Community & Student Group",
  "community": "Community & Student Group",
  "business": "Businesses",
  "businesses": "Businesses",
  "ngo": "NGOs",
  "ngos": "NGOs",
  "non-profit & social enterprise": "NGOs",
  "government": "Government",
  "media": "Media",
  "religious organisation": "Religious Organization",
  "religious organization": "Religious Organization",
  "religious organizations": "Religious Organization",
  "embassy / consulate": "Government",
};

function parseFirstCategory(value: string): string {
  const first = value.split(",")[0].trim().toLowerCase();
  return CATEGORY_MAP[first] || value.split(",")[0].trim() || "Other";
}

function parseBoolean(value: string): boolean {
  return ["yes", "true", "1", "verified"].includes(value.toLowerCase().trim());
}

function transformRow(row: SheetRow, rowIndex: number) {
  return {
    sheet_row_id: rowIndex,
    status: row.status || "Published",
    name_en: row.name_en || "",
    name_zh: row.name_zh || null,
    category: parseFirstCategory(row.category || "Other"),
    tags: parseTags(row.tags || ""),
    price: row.price || null,
    district_en: row.district_en || null,
    district_zh: row.district_zh || null,
    region: row.region || null,
    address: row.address || null,
    latitude: row.latitude ? parseFloat(row.latitude) : null,
    longitude: row.longitude ? parseFloat(row.longitude) : null,
    hours: row.hours || null,
    website: row.website || null,
    facebook: row.facebook || null,
    instagram: row.instagram || null,
    linkedin: row.linkedin || null,
    phone: row.phone || null,
    whatsapp: row.whatsapp || null,
    email: row.email || null,
    description_en: row.description_en || null,
    description_zh: row.description_zh || null,
    verified: parseBoolean(row.verified || ""),
    last_checked: row.last_checked || null,
    synced_at: new Date().toISOString(),
  };
}

// Sheets to sync — each gets a unique row ID offset to avoid collisions
const SHEETS_TO_SYNC = [
  { name: "Directory", offset: 0 },
  { name: "Testing Services", offset: 10000 },
  { name: "Emergency Services", offset: 20000 },
];

// Batch size for upserts (Supabase handles up to ~1000 rows per call)
const BATCH_SIZE = 200;

export async function syncFromSheets(sheetName?: string): Promise<SyncResult> {
  const start = Date.now();
  const errors: { row: number; error: string }[] = [];
  let rows_upserted = 0;
  let total_processed = 0;

  const supabase = getServiceClient();

  // If a specific sheet is given, only sync that one
  const sheetsToSync = sheetName
    ? [{ name: sheetName, offset: 0 }]
    : SHEETS_TO_SYNC;

  // Track all sheet_row_ids we upsert, so we can delete stale rows after
  const allUpsertedIds: number[] = [];

  // Fetch all sheets in parallel
  const sheetResults = await Promise.allSettled(
    sheetsToSync.map(async (sheet) => {
      const result = await readSheet(sheet.name);
      return { sheet, rows: result.rows };
    })
  );

  for (const result of sheetResults) {
    if (result.status === "rejected") {
      errors.push({ row: 0, error: `Failed to read sheet: ${result.reason}` });
      continue;
    }

    const { sheet, rows } = result.value;
    total_processed += rows.length;

    // Transform all rows into batch
    const batch: ReturnType<typeof transformRow>[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.name_en) continue;

      const transformed = transformRow(row, sheet.offset + i + 2);

      // Emergency Services: force category and tag
      if (sheet.name === "Emergency Services") {
        transformed.category = "Healthcare & Support";
        transformed.status = "Published";
        if (!transformed.tags.includes("emergency-services")) {
          transformed.tags = [...transformed.tags, "emergency-services"];
        }
      }

      batch.push(transformed);
    }

    // Upsert in batches
    for (let i = 0; i < batch.length; i += BATCH_SIZE) {
      const chunk = batch.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from("listings")
        .upsert(chunk, { onConflict: "sheet_row_id" });

      if (error) {
        errors.push({ row: 0, error: `Batch upsert error (${sheet.name}): ${error.message}` });
      } else {
        rows_upserted += chunk.length;
        allUpsertedIds.push(...chunk.map((r) => r.sheet_row_id));
      }
    }
  }

  // Delete stale rows: listings in Supabase whose sheet_row_id no longer exists in any sheet
  // Only do this on full sync (not single-sheet sync) to avoid accidentally deleting other sheets' rows
  if (!sheetName && allUpsertedIds.length > 0) {
    try {
      const { error: deleteError, count } = await supabase
        .from("listings")
        .delete({ count: "exact" })
        .not("sheet_row_id", "in", `(${allUpsertedIds.join(",")})`);

      if (deleteError) {
        errors.push({ row: 0, error: `Stale cleanup error: ${deleteError.message}` });
      } else if (count && count > 0) {
        console.log(`Cleaned up ${count} stale listings`);
      }
    } catch (err) {
      errors.push({ row: 0, error: `Stale cleanup failed: ${err instanceof Error ? err.message : String(err)}` });
    }
  }

  const duration_ms = Date.now() - start;

  // Log to sync_log
  try {
    await supabase.from("sync_log").insert({
      synced_at: new Date().toISOString(),
      rows_processed: total_processed,
      rows_upserted,
      errors: errors.length > 0 ? errors : null,
      duration_ms,
    });
  } catch {
    // Non-critical — don't fail sync if logging fails
  }

  return {
    rows_processed: total_processed,
    rows_upserted,
    errors,
    duration_ms,
  };
}
