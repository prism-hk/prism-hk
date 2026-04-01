const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1zKolQNmY8g_oDPBPiiQLmFeNC6KFmz7xXCNgBvAtWhY";
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

export type PrismEvent = {
  name_en: string;
  name_zh: string | null;
  org_en: string;
  org_zh: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  link: string | null;
  description: string | null;
  price: string | null;
  district: string | null;
  address: string | null;
  instagram: string | null;
  tags: string[];
};

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
        org_en: get("organization name (english)") || get("organization"),
        org_zh: get("organization name (traditional chinese)") || null,
        date: get("date"),
        start_time: get("start time") || null,
        end_time: get("end time") || null,
        link: get("link") || null,
        description: get("description") || null,
        price: get("price") || null,
        district: get("district") || null,
        address: get("address") || null,
        instagram: get("instagram") || null,
        tags: (get("tags") || "").split(",").map((t: string) => t.trim()).filter(Boolean),
      });
    }

    return events;
  } catch (e) {
    console.error("Error fetching events:", e);
    return [];
  }
}
