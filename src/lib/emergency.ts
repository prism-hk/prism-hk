import { getServiceClient } from "./supabase";

export type EmergencyService = {
  id: string;
  sheet_row_id: number;
  name_en: string;
  description_en: string | null;
  hours: string | null;
  phone: string | null;
  website: string | null;
  category: string;
  tags: string[];
  // Legacy aliases for backwards compatibility
  organization: string;
  focus_area: string | null;
  service_hours: string | null;
  telephone: string | null;
};

export async function getEmergencyServices(): Promise<EmergencyService[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .or("tags.cs.{emergency-services},tags.cs.{sti-testing}")
    .order("sheet_row_id");

  if (error) {
    console.error("Error fetching emergency services:", error);
    return [];
  }

  // Map listings fields to legacy EmergencyService shape for backwards compat
  return (data || []).map((row) => ({
    ...row,
    organization: row.name_en,
    focus_area: row.description_en,
    service_hours: row.hours,
    telephone: row.phone,
  }));
}
