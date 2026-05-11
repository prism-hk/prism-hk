#!/usr/bin/env node
/**
 * Check configured sources for new events and auto-append them to the Events
 * tab of the PRISM Google Sheet. Updates the "Scrape Status" column on the
 * Scrapers tab so Blake can see which sources work.
 *
 * Sources are read from the Scrapers tab:
 *   - Columns A-C: Organization, RSS/ICS URL, Status
 *   - Columns D-E: Organization, RSS/ICS URL (the "Pending" backlog block)
 *
 * Supports any page that exposes schema.org Event JSON-LD, plus ICS/RSS feeds.
 * Pages that load events via JS (Tessera, Eventbrite org pages, RA.co,
 * Bookwhen) are marked Status="Needs Feed" — those need an RSS/ICS link.
 *
 * Dedup is tolerant: normalised name + date (handles d/m/yyyy, d/mm/yyyy,
 * yyyy-mm-dd) so manually-pasted rows aren't re-appended.
 *
 * Run: node scripts/check-events.js
 * Dry run: node scripts/check-events.js --dry-run
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });
const { google } = require("googleapis");

const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1zKolQNmY8g_oDPBPiiQLmFeNC6KFmz7xXCNgBvAtWhY";
const API_KEY = "AIzaSyAruoZCvwELngTPpym_qncSAOmIv_S3pNk";

function getSheetsWriteClient() {
  const b64 = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_B64;
  if (!b64) return null;
  const sa = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
  const auth = new google.auth.JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

function normaliseName(name) {
  return (name || "")
    .toLowerCase()
    .replace(/[‘’“”"']/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normaliseDate(value) {
  if (!value) return "";
  const s = String(value).trim();
  // yyyy-mm-dd or ISO
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${String(+m[2]).padStart(2, "0")}-${String(+m[3]).padStart(2, "0")}`;
  // d/m/yyyy or dd/mm/yyyy
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

async function getExistingEvents() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Events?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const rows = data.values || [];
  const existing = new Set();
  for (const row of rows.slice(1)) {
    const name = normaliseName(row[0]);
    const date = normaliseDate(row[6]);
    if (name) existing.add(`${name}|${date}`);
  }
  return existing;
}

async function getScraperSources() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Scrapers?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const rows = data.values || [];
  if (rows.length < 2) return [];

  const sources = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    // Primary block: A=org, B=url, C=status
    const orgA = (row[0] || "").trim();
    const urlA = (row[1] || "").trim();
    const statusA = (row[2] || "").trim().toLowerCase();
    if (urlA && !["done", "skip", "disabled"].includes(statusA)) {
      sources.push({ url: urlA, org: orgA, sheetRow: i + 1, statusCol: "C" });
    }
    // Pending block: D=org, E=url
    const orgD = (row[3] || "").trim();
    const urlD = (row[4] || "").trim();
    if (urlD) {
      sources.push({ url: urlD, org: orgD, sheetRow: i + 1, statusCol: null });
    }
  }
  return sources;
}

function extractJsonLdEvents(html) {
  const events = [];
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        const node = item["@graph"] ? [].concat(item["@graph"]) : [item];
        for (const n of node) {
          const type = n["@type"];
          if (!type) continue;
          const types = Array.isArray(type) ? type : [type];
          if (types.some((t) => String(t).toLowerCase().includes("event"))) {
            events.push(n);
          }
        }
      }
    } catch {
      // skip invalid JSON-LD block
    }
  }
  return events;
}

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

function isLikelyJsRendered(url) {
  try {
    const u = new URL(url);
    return JS_RENDERED_HOSTS.some((h) => u.hostname.endsWith(h));
  } catch {
    return false;
  }
}

async function scrape(source) {
  if (/\.ics(\?|$)/i.test(source.url) || source.url.startsWith("webcal:")) {
    return await scrapeIcs(source);
  }
  if (/\.(rss|xml)(\?|$)/i.test(source.url) || /\/feed\/?$/.test(source.url)) {
    return await scrapeRss(source);
  }

  const res = await fetch(source.url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PRISM-HK/1.0; +https://prism.lgbt)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const jsonLdEvents = extractJsonLdEvents(html);
  if (jsonLdEvents.length === 0 && isLikelyJsRendered(source.url)) {
    const err = new Error("JS-rendered page (no JSON-LD events) — needs RSS/ICS feed");
    err.code = "NEEDS_FEED";
    throw err;
  }
  return jsonLdEvents.map((e) => ({
    name: (e.name || "").trim(),
    date: e.startDate || "",
    endDate: e.endDate || "",
    location: e.location?.name || e.location?.address?.streetAddress || "",
    district: e.location?.address?.addressLocality || "",
    description: typeof e.description === "string" ? e.description : "",
    url: e.url || source.url,
    image: Array.isArray(e.image) ? e.image[0] : e.image || "",
  }));
}

async function scrapeIcs(source) {
  const url = source.url.replace(/^webcal:/, "https:");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const events = [];
  const blocks = text.split(/BEGIN:VEVENT/).slice(1);
  for (const b of blocks) {
    const get = (key) => {
      const m = b.match(new RegExp(`${key}[^:]*:([^\\r\\n]+)`));
      return m ? m[1].trim() : "";
    };
    const dtStart = get("DTSTART");
    const dtEnd = get("DTEND");
    const summary = get("SUMMARY");
    const desc = get("DESCRIPTION");
    const loc = get("LOCATION");
    const eUrl = get("URL");
    if (!summary || !dtStart) continue;
    events.push({
      name: summary,
      date: parseIcsDate(dtStart),
      endDate: parseIcsDate(dtEnd),
      location: loc,
      district: "",
      description: desc.replace(/\\n/g, "\n").replace(/\\,/g, ","),
      url: eUrl || source.url,
      image: "",
    });
  }
  return events;
}

function parseIcsDate(s) {
  if (!s) return "";
  const m = s.match(/(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?/);
  if (!m) return "";
  const [, Y, M, D, h = "00", mi = "00", ss = "00"] = m;
  return `${Y}-${M}-${D}T${h}:${mi}:${ss}`;
}

async function scrapeRss(source) {
  const res = await fetch(source.url, { headers: { "User-Agent": "PRISM-HK/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  const items = xml.split(/<item[\s>]/).slice(1);
  return items
    .map((chunk) => {
      const get = (tag) => {
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

function formatDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function formatTime(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// Events sheet column order — must match headers in Events!1:1
function buildEventRow(e) {
  return [
    e.name,                  // A  Event Name (English)
    "",                      // B  TC
    "",                      // C  SC
    e.org,                   // D  Org English
    "",                      // E  Org TC
    "",                      // F  Org SC
    formatDate(e.date),      // G  Date
    formatTime(e.date),      // H  Start
    formatTime(e.endDate),   // I  End
    "",                      // J  Recurring
    "",                      // K  Tags
    "",                      // L  Price
    e.district || "",        // M  District
    "",                      // N  Region
    e.url || "",             // O  Event URL
    "", "", "",              // P,Q,R FB/IG/LinkedIn
    e.location || "",        // S  Venue EN
    "", "",                  // T,U Venue TC/SC
    "", "", "",              // V,W,X Phone/WA/Email
    (e.description || "").slice(0, 500), // Y Desc EN
    "", "",                  // Z, AA Desc TC/SC
    e.image || "",           // AB Logo path
    "",                      // AC Logo
    "scraper",               // AD Submitter
    "auto-scraped",          // AE Role
  ];
}

async function appendEventRow(sheets, values) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "Events!A:A",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values.map(String)] },
  });
}

async function updateScraperStatus(sheets, row, statusCol, value) {
  if (!statusCol) return;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Scrapers!${statusCol}${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[value]] },
  });
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  console.log(`Checking event sources${dryRun ? " (dry run)" : ""}...\n`);

  const sheets = dryRun ? null : getSheetsWriteClient();
  if (!sheets && !dryRun) {
    console.warn("⚠️  No service account configured — falling back to dry-run output.\n");
  }

  const existing = await getExistingEvents();
  console.log(`Found ${existing.size} existing events.`);

  const sources = await getScraperSources();
  console.log(`Sources: ${sources.length}\n`);

  let appended = 0;
  let failed = 0;
  let needsFeed = 0;

  for (const source of sources) {
    process.stdout.write(`• ${source.org || "(no name)"} — ${source.url}\n`);
    try {
      const events = await scrape(source);
      if (events.length === 0) {
        console.log("    (no events found)");
        if (sheets) await updateScraperStatus(sheets, source.sheetRow, source.statusCol, "Empty");
        continue;
      }
      let newCount = 0;
      for (const event of events) {
        const dateKey = normaliseDate(event.date);
        const nameKey = normaliseName(event.name);
        if (!nameKey || !dateKey) continue;
        const key = `${nameKey}|${dateKey}`;
        if (existing.has(key)) continue;
        const row = buildEventRow({ ...event, org: source.org });
        if (sheets) {
          await appendEventRow(sheets, row);
        } else {
          console.log("    [dry] would append:", event.name, dateKey);
        }
        existing.add(key);
        appended++;
        newCount++;
      }
      console.log(`    ✓ ${newCount} new event(s)`);
      if (sheets) await updateScraperStatus(sheets, source.sheetRow, source.statusCol, "OK");
    } catch (err) {
      if (err.code === "NEEDS_FEED") {
        console.log(`    ⚠️  Needs RSS/ICS feed — page is JS-rendered`);
        if (sheets) await updateScraperStatus(sheets, source.sheetRow, source.statusCol, "Needs Feed");
        needsFeed++;
      } else {
        console.log(`    ✗ ${err.message}`);
        if (sheets) await updateScraperStatus(sheets, source.sheetRow, source.statusCol, `Failed: ${err.message.slice(0, 60)}`);
        failed++;
      }
    }
  }

  console.log(`\nDone. Appended: ${appended}, Failed: ${failed}, Needs feed: ${needsFeed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
