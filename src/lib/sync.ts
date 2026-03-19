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

// Map Blake's sheet categories to our standard categories
const CATEGORY_MAP: Record<string, string> = {
  "health & support": "Healthcare",
  "health": "Healthcare",
  "healthcare": "Healthcare",
  "community & student group": "Community",
  "community": "Community",
  "business": "Business",
  "ngo": "NGO",
  "non-profit & social enterprise": "NGO",
  "government": "Government",
  "media": "Media",
  "religious organisation": "Community",
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

  for (const sheet of sheetsToSync) {
    let rows: SheetRow[];
    try {
      const result = await readSheet(sheet.name);
      rows = result.rows;
    } catch (err) {
      errors.push({
        row: 0,
        error: `Failed to read sheet "${sheet.name}": ${err instanceof Error ? err.message : String(err)}`,
      });
      continue;
    }

    total_processed += rows.length;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (!row.name_en) {
        continue;
      }

      try {
        const transformed = transformRow(row, sheet.offset + i + 2);

        // Emergency Services: force category and tag
        if (sheet.name === "Emergency Services") {
          transformed.category = "Healthcare";
          transformed.status = "Published";
          if (!transformed.tags.includes("emergency-services")) {
            transformed.tags = [...transformed.tags, "emergency-services"];
          }
        }

        const { error } = await supabase
          .from("listings")
          .upsert(transformed, { onConflict: "sheet_row_id" });

        if (error) {
          errors.push({ row: sheet.offset + i + 2, error: error.message });
        } else {
          rows_upserted++;
        }
      } catch (err) {
        errors.push({
          row: sheet.offset + i + 2,
          error: err instanceof Error ? err.message : String(err),
        });
      }
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
