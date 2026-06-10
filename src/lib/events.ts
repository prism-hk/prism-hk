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
  featured: boolean;
};

// Keep backward-compatible alias
export type { PrismEvent as PrismEventLegacy };

import { decodeHtmlEntities } from "./htmlEntities";

function parseLogoUrl(value: string | null): string | null {
  if (!value) return null;
  if (/^https?:\/\/(res\.cloudinary\.com|lh\d\.googleusercontent\.com)\//.test(value)) {
    return value;
  }
  const driveMatch = value.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
  if (driveMatch) return `https://lh3.googleusercontent.com/d/${driveMatch[1]}=w600`;
  if (value.startsWith("http")) return value;
  return null;
}

function parseDateDMY(str: string): Date | null {
  const parts = str.split("/");
  if (parts.length !== 3) return null;
  const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  return isNaN(d.getTime()) ? null : d;
}

function formatDateDMY(d: Date): string {
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function expandRecurring(event: PrismEvent): PrismEvent[] {
  const rule = (event.recurring || "").toLowerCase().trim();
  if (!rule) return [event];

  const seed = parseDateDMY(event.date);
  if (!seed) return [event];

  const stepDays: Record<string, number> = {
    weekly: 7, "every week": 7,
    biweekly: 14, fortnightly: 14, "every 2 weeks": 14,
  };
  const today = new Date(new Date().toDateString());
  const horizon = new Date(today);
  horizon.setMonth(horizon.getMonth() + 6);

  const occurrences: PrismEvent[] = [];
  if (stepDays[rule]) {
    const step = stepDays[rule];
    let d = new Date(seed);
    while (d < today) d = new Date(d.getTime() + step * 86400000);
    while (d <= horizon) {
      occurrences.push({ ...event, date: formatDateDMY(d) });
      d = new Date(d.getTime() + step * 86400000);
    }
  } else if (rule.includes("monthly") || rule === "every month") {
    let d = new Date(seed);
    while (d < today) d = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
    while (d <= horizon) {
      occurrences.push({ ...event, date: formatDateDMY(d) });
      d = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
    }
  } else {
    // Patterns like "second tuesday of every month", "1st friday monthly",
    // "third sunday" — pick the Nth weekday of each month from seed onwards
    const nthMatch = rule.match(
      /(first|second|third|fourth|fifth|1st|2nd|3rd|4th|5th|last)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/
    );
    if (nthMatch) {
      const ordinals: Record<string, number> = {
        first: 1, "1st": 1, second: 2, "2nd": 2, third: 3, "3rd": 3,
        fourth: 4, "4th": 4, fifth: 5, "5th": 5, last: -1,
      };
      const weekdays: Record<string, number> = {
        sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
        thursday: 4, friday: 5, saturday: 6,
      };
      const n = ordinals[nthMatch[1]];
      const targetDow = weekdays[nthMatch[2]];

      const pickNth = (year: number, month: number): Date | null => {
        if (n === -1) {
          // last occurrence of weekday in the month
          const last = new Date(year, month + 1, 0);
          const offset = (last.getDay() - targetDow + 7) % 7;
          return new Date(year, month, last.getDate() - offset);
        }
        const first = new Date(year, month, 1);
        const offset = (targetDow - first.getDay() + 7) % 7;
        const day = 1 + offset + (n - 1) * 7;
        const d = new Date(year, month, day);
        return d.getMonth() === month ? d : null;
      };

      const start = seed < today ? today : seed;
      const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
      while (cursor <= horizon) {
        const d = pickNth(cursor.getFullYear(), cursor.getMonth());
        if (d && d >= today && d <= horizon && d >= seed) {
          occurrences.push({ ...event, date: formatDateDMY(d) });
        }
        cursor.setMonth(cursor.getMonth() + 1);
      }
    } else {
      return [event];
    }
  }

  return occurrences.length ? occurrences : [event];
}

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
        return idx >= 0 ? decodeHtmlEntities((row[idx] || "").trim()) : "";
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
        image: parseLogoUrl(get("logo/image")) || parseLogoUrl(get("image")) || parseLogoUrl(get("logo")) || null,
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
        featured: ["yes", "true", "1", "✓", "x"].includes((get("featured") || "").toLowerCase().trim()),
      });
    }

    // Expand recurring events into their upcoming occurrences
    const expanded = events.flatMap(expandRecurring);

    // Dedupe exact duplicates (same name + same date). Recurring events keep
    // their distinct dates, so genuine repeats on different days survive.
    const seen = new Set<string>();
    const deduped: PrismEvent[] = [];
    for (const e of expanded) {
      const nameKey = (e.name_en || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
      const key = `${nameKey}|${(e.date || "").trim()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(e);
    }
    return deduped;
  } catch (e) {
    console.error("Error fetching events:", e);
    return [];
  }
}
