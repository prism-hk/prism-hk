import { getSheetsClient } from "./sheets-auth";

const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1zKolQNmY8g_oDPBPiiQLmFeNC6KFmz7xXCNgBvAtWhY";
const API_KEY = "AIzaSyAruoZCvwELngTPpym_qncSAOmIv_S3pNk";

const JS_RENDERED_HOSTS = [
  "yourtessera.com",
  "eventbrite.com",
  "eventbrite.hk",
  "ra.co",
  "bookwhen.com",
  "art-mate.net",
  "urbtix.hk",
  "dragontitty.org",
];

type ScrapedEvent = {
  name: string;
  date: string;
  endDate: string;
  location: string;
  district: string;
  description: string;
  url: string;
  image: string;
};

type Source = {
  url: string;
  org: string;
  sheetRow: number;
  statusCol: string | null;
};

export type ScrapeResult = {
  appended: number;
  failed: number;
  needsFeed: number;
  sources: number;
  log: string[];
};

function normaliseName(name: string): string {
  return (name || "")
    .toLowerCase()
    .replace(/[‘’“”"']/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normaliseDate(value: string): string {
  if (!value) return "";
  const s = String(value).trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${String(+m[2]).padStart(2, "0")}-${String(+m[3]).padStart(2, "0")}`;
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (m) {
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${y}-${String(+m[2]).padStart(2, "0")}-${String(+m[1]).padStart(2, "0")}`;
  }
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  return s;
}

function isLikelyJsRendered(url: string): boolean {
  try {
    const u = new URL(url);
    return JS_RENDERED_HOSTS.some((h) => u.hostname.endsWith(h));
  } catch {
    return false;
  }
}

function extractJsonLdEvents(html: string): Record<string, unknown>[] {
  const events: Record<string, unknown>[] = [];
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        const nodes = (item as { "@graph"?: unknown[] })["@graph"] ? ([] as unknown[]).concat((item as { "@graph": unknown[] })["@graph"]) : [item];
        for (const n of nodes as Record<string, unknown>[]) {
          const type = n["@type"];
          if (!type) continue;
          const types = Array.isArray(type) ? type : [type];
          if (types.some((t) => String(t).toLowerCase().includes("event"))) {
            events.push(n);
          }
        }
      }
    } catch {}
  }
  return events;
}

async function scrape(source: Source): Promise<ScrapedEvent[]> {
  if (/\.ics(\?|$)/i.test(source.url) || source.url.startsWith("webcal:")) {
    return scrapeIcs(source);
  }
  if (/\.(rss|xml)(\?|$)/i.test(source.url) || /\/feed\/?$/.test(source.url)) {
    return scrapeRss(source);
  }
  const res = await fetch(source.url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PRISM-HK/1.0; +https://prism.lgbt)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const jsonLdEvents = extractJsonLdEvents(html);
  if (jsonLdEvents.length === 0 && isLikelyJsRendered(source.url)) {
    const err = new Error("JS-rendered page — needs RSS/ICS feed");
    (err as Error & { code?: string }).code = "NEEDS_FEED";
    throw err;
  }
  return jsonLdEvents.map((e) => {
    const loc = e.location as { name?: string; address?: { streetAddress?: string; addressLocality?: string } } | undefined;
    return {
      name: String((e.name as string) || "").trim(),
      date: String((e.startDate as string) || ""),
      endDate: String((e.endDate as string) || ""),
      location: loc?.name || loc?.address?.streetAddress || "",
      district: loc?.address?.addressLocality || "",
      description: typeof e.description === "string" ? e.description : "",
      url: String((e.url as string) || source.url),
      image: Array.isArray(e.image) ? String(e.image[0]) : String(e.image || ""),
    };
  });
}

async function scrapeIcs(source: Source): Promise<ScrapedEvent[]> {
  const url = source.url.replace(/^webcal:/, "https:");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const events: ScrapedEvent[] = [];
  for (const b of text.split(/BEGIN:VEVENT/).slice(1)) {
    const get = (key: string) => {
      const m = b.match(new RegExp(`${key}[^:]*:([^\\r\\n]+)`));
      return m ? m[1].trim() : "";
    };
    const summary = get("SUMMARY");
    const dtStart = get("DTSTART");
    if (!summary || !dtStart) continue;
    events.push({
      name: summary,
      date: parseIcsDate(dtStart),
      endDate: parseIcsDate(get("DTEND")),
      location: get("LOCATION"),
      district: "",
      description: get("DESCRIPTION").replace(/\\n/g, "\n").replace(/\\,/g, ","),
      url: get("URL") || source.url,
      image: "",
    });
  }
  return events;
}

function parseIcsDate(s: string): string {
  if (!s) return "";
  const m = s.match(/(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?/);
  if (!m) return "";
  const [, Y, M, D, h = "00", mi = "00", ss = "00"] = m;
  return `${Y}-${M}-${D}T${h}:${mi}:${ss}`;
}

async function scrapeRss(source: Source): Promise<ScrapedEvent[]> {
  const res = await fetch(source.url, { headers: { "User-Agent": "PRISM-HK/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  return xml
    .split(/<item[\s>]/)
    .slice(1)
    .map((chunk) => {
      const get = (tag: string) => {
        const m = chunk.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
        return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
      };
      return {
        name: get("title"),
        date: get("pubDate") || get("dc:date") || "",
        endDate: "",
        location: "",
        district: "",
        description: get("description"),
        url: get("link"),
        image: "",
      };
    })
    .filter((e) => e.name && e.date);
}

function formatDate(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function formatTime(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function buildEventRow(e: ScrapedEvent & { org: string }): string[] {
  return [
    e.name, "", "",
    e.org, "", "",
    formatDate(e.date), formatTime(e.date), formatTime(e.endDate),
    "", "", "",
    e.district || "", "", e.url || "",
    "", "", "",
    e.location || "", "", "",
    "", "", "",
    (e.description || "").slice(0, 500),
    "", "",
    e.image || "", "",
    "scraper", "auto-scraped",
  ].map(String);
}

async function getExistingEventKeys(): Promise<Set<string>> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Events?key=${API_KEY}`;
  const res = await fetch(url);
  const data = (await res.json()) as { values?: string[][] };
  const rows = data.values || [];
  const existing = new Set<string>();
  for (const row of rows.slice(1)) {
    const name = normaliseName(row[0] || "");
    const date = normaliseDate(row[6] || "");
    if (name) existing.add(`${name}|${date}`);
  }
  return existing;
}

async function getScraperSources(): Promise<Source[]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Scrapers?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = (await res.json()) as { values?: string[][] };
  const rows = data.values || [];
  if (rows.length < 2) return [];
  const sources: Source[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const orgA = (row[0] || "").trim();
    const urlA = (row[1] || "").trim();
    const statusA = (row[2] || "").trim().toLowerCase();
    if (urlA && !["done", "skip", "disabled"].includes(statusA)) {
      sources.push({ url: urlA, org: orgA, sheetRow: i + 1, statusCol: "C" });
    }
    const orgD = (row[3] || "").trim();
    const urlD = (row[4] || "").trim();
    if (urlD) {
      sources.push({ url: urlD, org: orgD, sheetRow: i + 1, statusCol: null });
    }
  }
  return sources;
}

export async function runEventScraper(): Promise<ScrapeResult> {
  const log: string[] = [];
  const sheets = getSheetsClient();
  const existing = await getExistingEventKeys();
  const sources = await getScraperSources();
  log.push(`Sources: ${sources.length}, existing events: ${existing.size}`);

  let appended = 0;
  let failed = 0;
  let needsFeed = 0;

  for (const source of sources) {
    try {
      const events = await scrape(source);
      if (events.length === 0) {
        log.push(`${source.org}: empty`);
        if (source.statusCol) {
          await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `Scrapers!${source.statusCol}${source.sheetRow}`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [["Empty"]] },
          });
        }
        continue;
      }
      let newCount = 0;
      for (const event of events) {
        const dateKey = normaliseDate(event.date);
        const nameKey = normaliseName(event.name);
        if (!nameKey || !dateKey) continue;
        const key = `${nameKey}|${dateKey}`;
        if (existing.has(key)) continue;
        await sheets.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: "Events!A:A",
          valueInputOption: "USER_ENTERED",
          insertDataOption: "INSERT_ROWS",
          requestBody: { values: [buildEventRow({ ...event, org: source.org })] },
        });
        existing.add(key);
        appended++;
        newCount++;
      }
      log.push(`${source.org}: +${newCount}`);
      if (source.statusCol) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `Scrapers!${source.statusCol}${source.sheetRow}`,
          valueInputOption: "USER_ENTERED",
          requestBody: { values: [["OK"]] },
        });
      }
    } catch (err) {
      const e = err as Error & { code?: string };
      if (e.code === "NEEDS_FEED") {
        log.push(`${source.org}: needs feed`);
        needsFeed++;
        if (source.statusCol) {
          await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `Scrapers!${source.statusCol}${source.sheetRow}`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [["Needs Feed"]] },
          });
        }
      } else {
        log.push(`${source.org}: ${e.message}`);
        failed++;
        if (source.statusCol) {
          await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `Scrapers!${source.statusCol}${source.sheetRow}`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [[`Failed: ${e.message.slice(0, 60)}`]] },
          });
        }
      }
    }
  }

  return { appended, failed, needsFeed, sources: sources.length, log };
}
