const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1zKolQNmY8g_oDPBPiiQLmFeNC6KFmz7xXCNgBvAtWhY";
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

export type PrismEvent = {
  name_en: string;
  name_zh: string | null;
  name_zhHans: string | null;
  org_en: string;
  org_zh: string | null;
  org_zhHans: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  recurring: string | null;
  link: string | null;
  description_en: string | null;
  description_zh: string | null;
  description_zhHans: string | null;
  image: string | null;
  price: string | null;
  district: string | null;
  region: string | null;
  venue_en: string | null;
  venue_zh: string | null;
  venue_zhHans: string | null;
  phone: string | null;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  email: string | null;
  tags: string[];
};

// Keep backward-compatible alias
export type { PrismEvent as PrismEventLegacy };

export async function getEvents(): Promise<PrismEvent[]> {
  if (!API_KEY) return [];

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Events?key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];

    const data = await res.json();
    const rows: string[][] = data.values || [];
    if (rows.length < 2) return [];

    const headers = rows[0].map((h: string) => h.toLowerCase().trim());
    const events: PrismEvent[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const get = (col: string) => {
        const idx = headers.findIndex((h: string) => h.includes(col));
        return idx >= 0 ? (row[idx] || "").trim() : "";
      };

      const name = get("event name (english)") || get("event name");
      if (!name) continue;

      events.push({
        name_en: name,
        name_zh: get("event name (traditional chinese)") || null,
        name_zhHans: get("event name (simplified chinese)") || null,
        org_en: get("organization name (english)") || get("organization"),
        org_zh: get("organization name (traditional chinese)") || null,
        org_zhHans: get("organization name (simplied chinese)") || get("organization name (simplified chinese)") || null,
        date: get("date"),
        start_time: get("start time") || null,
        end_time: get("end time") || null,
        recurring: get("recurring event") || null,
        link: get("link") || null,
        description_en: get("description") || null,
        description_zh: get("description (traditional chinese)") || null,
        description_zhHans: get("description (simplied chinese)") || get("description (simplified chinese)") || null,
        image: get("logo/image") || null,
        price: get("price") || null,
        district: get("district") || null,
        region: get("region") || null,
        venue_en: get("venue (english)") || null,
        venue_zh: get("venue (traditional chinese)") || null,
        venue_zhHans: get("venue (simplifed chinese)") || get("venue (simplified chinese)") || null,
        phone: get("phone") || null,
        whatsapp: get("whatsapp") || null,
        facebook: get("facebook") || null,
        instagram: get("instagram") || null,
        linkedin: get("linkedin") || null,
        email: get("email") || null,
        tags: (get("tags") || "").split(",").map((t: string) => t.trim()).filter(Boolean),
      });
    }

    return events;
  } catch (e) {
    console.error("Error fetching events:", e);
    return [];
  }
}
