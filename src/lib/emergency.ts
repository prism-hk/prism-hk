import { getServiceClient } from "./supabase";
import { readSheet } from "./sheets";

export type EmergencyService = {
  id: string;
  sheet_row_id: number;
  organization: string;
  focus_area: string | null;
  shelter: string | null;
  languages: string | null;
  service_hours: string | null;
  telephone: string | null;
  website: string | null;
};

export async function getEmergencyServices(): Promise<EmergencyService[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("emergency_services")
    .select("*")
    .order("sheet_row_id");

  if (error) {
    console.error("Error fetching emergency services:", error);
    return [];
  }
  return data || [];
}

export async function syncEmergencyServices(): Promise<{
  rows_processed: number;
  rows_upserted: number;
  errors: { row: number; error: string }[];
}> {
  const errors: { row: number; error: string }[] = [];
  let rows_upserted = 0;

  const { rows } = await readSheet("Emergency Services");
  const supabase = getServiceClient();

  // Column mapping for this sheet
  const HEADER_MAP: Record<string, string> = {
    organization: "organization",
    focus_area: "focus_area",
    shelter: "shelter",
    languages: "languages",
    service_hours: "service_hours",
    telephone: "telephone",
    website: "website",
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const org = row.organization || "";

    if (!org) continue;

    try {
      const { error } = await supabase
        .from("emergency_services")
        .upsert(
          {
            sheet_row_id: 20000 + i + 2,
            organization: org,
            focus_area: row.focus_area || null,
            shelter: row.shelter || null,
            languages: row.languages || null,
            service_hours: row.service_hours || null,
            telephone: row.telephone || null,
            website: row.website || null,
            synced_at: new Date().toISOString(),
          },
          { onConflict: "sheet_row_id" }
        );

      if (error) {
        errors.push({ row: i + 2, error: error.message });
      } else {
        rows_upserted++;
      }
    } catch (err) {
      errors.push({
        row: i + 2,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { rows_processed: rows.length, rows_upserted, errors };
}
