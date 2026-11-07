import { decodeHtmlEntities } from "./htmlEntities";

const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1zKolQNmY8g_oDPBPiiQLmFeNC6KFmz7xXCNgBvAtWhY";
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

// Name of the tab in the PRISM Google Sheet. See board-sheet-setup.md.
const TAB = "Board";

// Listings with no "Expires" date drop off this many days after "Posted".
const DEFAULT_LIFETIME_DAYS = 60;

export type BoardKind = "ask" | "offer";

export type BoardCategory =
  | "space"
  | "speaker"
  | "reach"
  | "sponsorship"
  | "volunteers"
  | "participants"
  | "other";

export type BoardPost = {
  id: string;
  kind: BoardKind;
  category: BoardCategory;
  org: string;
  title_en: string;
  title_zh: string | null;
  title_zhHans: string | null;
  description_en: string | null;
  description_zh: string | null;
  description_zhHans: string | null;
  needed_by: string | null; // ISO date (yyyy-mm-dd)
  posted: string | null; // ISO date
  expires: string | null; // ISO date
  contact: string | null;
  link: string | null;
};

const CATEGORY_ALIASES: Record<string, BoardCategory> = {
  space: "space", spaces: "space", venue: "space", venues: "space",
  speaker: "speaker", speakers: "speaker",
  reach: "reach", audience: "reach", promotion: "reach", "audience/reach": "reach", "reach & promotion": "reach",
  sponsorship: "sponsorship", sponsor: "sponsorship", funding: "sponsorship",
  volunteer: "volunteers", volunteers: "volunteers",
  participant: "participants", participants: "participants", players: "participants", members: "participants",
};

// Tally options are trilingual ("Spaces / 場地 / 场地"), so keep only the English part before matching.
function englishPart(value: string): string {
  return value.replace(/[^\x00-\x7F]/g, "").replace(/[\/|]+/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

function parseCategory(value: string): BoardCategory {
  return CATEGORY_ALIASES[englishPart(value)] || "other";
}

function parseKind(value: string): BoardKind | null {
  const v = englishPart(value);
  if (["ask", "asks", "request", "need", "looking for", "seeking"].includes(v)) return "ask";
  if (["offer", "offers", "offering", "available"].includes(v)) return "offer";
  return null;
}

// Accepts d/m/yyyy (how the Events tab is written) and yyyy-mm-dd (how Tally and Make.com write dates).
function parseDate(value: string): Date | null {
  const v = value.trim();
  if (!v) return null;
  const dmy = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const d = new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
    return isNaN(d.getTime()) ? null : d;
  }
  const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function toIso(d: Date | null): string | null {
  if (!d) return null;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export async function getBoardPosts(): Promise<BoardPost[]> {
  if (!API_KEY) return [];

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${TAB}?key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return []; // Tab missing or sheet unreachable: show the empty state rather than erroring

    const data = await res.json();
    const rows: string[][] = data.values || [];
    if (rows.length < 2) return [];

    const headers = rows[0].map((h: string) => h.toLowerCase().trim());
    const today = new Date(new Date().toDateString());
    const posts: BoardPost[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      // Exact header match first, then a "starts with" match, so "Title" doesn't grab "Title (Traditional Chinese)".
      const get = (...names: string[]) => {
        for (const name of names) {
          let idx = headers.indexOf(name);
          if (idx < 0) idx = headers.findIndex((h) => h.startsWith(name + " ("));
          if (idx >= 0 && row[idx]) return decodeHtmlEntities(row[idx].trim());
        }
        return "";
      };

      // Only rows you have approved go live.
      if (get("status").toLowerCase() !== "published") continue;

      const kind = parseKind(get("type", "kind"));
      const title = get("title (english)", "title");
      const org = get("organisation", "organization", "org");
      if (!kind || !title || !org) continue;

      const posted = parseDate(get("posted", "date posted", "submitted at"));
      let expires = parseDate(get("expires", "expiry"));
      if (!expires && posted) {
        expires = new Date(posted);
        expires.setDate(expires.getDate() + DEFAULT_LIFETIME_DAYS);
      }
      if (expires && expires < today) continue;

      const neededBy = parseDate(get("needed by", "date needed"));
      // Asks for a date that has already passed are no longer useful.
      if (kind === "ask" && neededBy && neededBy < today) continue;

      const link = get("link", "website");

      posts.push({
        id: `row-${i + 1}`,
        kind,
        category: parseCategory(get("category")),
        org,
        title_en: title,
        title_zh: get("title (traditional chinese)") || null,
        title_zhHans: get("title (simplified chinese)") || null,
        description_en: get("description (english)", "description") || null,
        description_zh: get("description (traditional chinese)") || null,
        description_zhHans: get("description (simplified chinese)") || null,
        needed_by: toIso(neededBy),
        posted: toIso(posted),
        expires: toIso(expires),
        contact: get("contact", "email") || null,
        link: link && /^https?:\/\//.test(link) ? link : null,
      });
    }

    // Newest first; undated posts after dated ones.
    return posts.sort((a, b) => (b.posted || "").localeCompare(a.posted || ""));
  } catch (e) {
    console.error("Error fetching board posts:", e);
    return [];
  }
}
