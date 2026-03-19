const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1zKolQNmY8g_oDPBPiiQLmFeNC6KFmz7xXCNgBvAtWhY";
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

export type SheetRow = Record<string, string>;

// Column header mapping (case-insensitive)
const COLUMN_MAP: Record<string, string> = {
  "status": "status",
  "name (en)": "name_en",
  "name (english)": "name_en",
  "name en": "name_en",
  "name_en": "name_en",
  "english name": "name_en",
  "name (中文)": "name_zh",
  "name (zh)": "name_zh",
  "name zh": "name_zh",
  "name_zh": "name_zh",
  "chinese name": "name_zh",
  "type": "category",
  "category": "category",
  "tags": "tags",
  "price": "price",
  "district (en)": "district_en",
  "district en": "district_en",
  "district_en": "district_en",
  "district": "district_en",
  "district (中文)": "district_zh",
  "district (zh)": "district_zh",
  "district zh": "district_zh",
  "district_zh": "district_zh",
  "region": "region",
  "address": "address",
  "latitude": "latitude",
  "lat": "latitude",
  "longitude": "longitude",
  "lng": "longitude",
  "lon": "longitude",
  "hours": "hours",
  "opening hours": "hours",
  "website": "website",
  "url": "website",
  "facebook": "facebook",
  "instagram": "instagram",
  "linkedin": "linkedin",
  "phone": "phone",
  "whatsapp": "whatsapp",
  "email": "email",
  "description (en)": "description_en",
  "description en": "description_en",
  "description_en": "description_en",
  "description": "description_en",
  "description (中文)": "description_zh",
  "description (zh)": "description_zh",
  "description zh": "description_zh",
  "description_zh": "description_zh",
  "verified": "verified",
  "last checked": "last_checked",
  "last_checked": "last_checked",
  "last checked/updated": "last_checked",
  "organization": "name_en",
  "focus area": "description_en",
  "shelter": "shelter",
  "languages": "languages",
  "service hours": "hours",
  "telephone": "phone",
};

function normalizeHeader(header: string): string {
  const lower = header.toLowerCase().trim();
  return COLUMN_MAP[lower] || lower.replace(/[^a-z0-9]/g, "_");
}

export async function readSheet(
  sheetName: string = "Directory"
): Promise<{ headers: string[]; rows: SheetRow[]; rawHeaders: string[] }> {
  if (!API_KEY) {
    throw new Error("GOOGLE_SHEETS_API_KEY is not set");
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheetName)}?key=${API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 0 } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets API error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const values: string[][] = data.values || [];

  if (values.length < 2) {
    return { headers: [], rows: [], rawHeaders: [] };
  }

  const rawHeaders = values[0];
  const headers = rawHeaders.map(normalizeHeader);

  const rows: SheetRow[] = [];
  for (let i = 1; i < values.length; i++) {
    const row: SheetRow = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[i]?.[j]?.trim() || "";
    }
    // Skip completely empty rows
    if (Object.values(row).every((v) => !v)) continue;
    rows.push(row);
  }

  return { headers, rows, rawHeaders };
}
