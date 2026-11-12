import { getEvents } from "@/lib/events";

export const revalidate = 3600; // 1 hour; use /api/refresh after editing the Sheet

function to24Hour(time: string | null): string {
  if (!time) return "000000";
  const raw = time.trim().toLowerCase();
  const ampmMatch = raw.match(/(am|pm)\s*$/);
  const explicitAmPm = ampmMatch ? ampmMatch[1].toUpperCase() : null;
  const numeric = raw.replace(/\s*(am|pm)\s*$/, "").trim();
  const parts = numeric.split(":");
  if (parts.length < 2) return "000000";
  let h = parseInt(parts[0]);
  const m = parts[1].replace(/\D+$/, "").padStart(2, "0").slice(0, 2);
  if (isNaN(h)) return "000000";
  if (explicitAmPm === "PM" && h < 12) h += 12;
  if (explicitAmPm === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}${m}00`;
}

function parseDate(str: string): string | null {
  const parts = str.split("/");
  if (parts.length !== 3) return null;
  const [d, mo, y] = parts;
  return `${y}${mo.padStart(2, "0")}${d.padStart(2, "0")}`;
}

function escapeIcs(s: string): string {
  return s.replace(/[,;\\]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
}

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let remaining = line;
  chunks.push(remaining.slice(0, 75));
  remaining = remaining.slice(75);
  while (remaining.length > 0) {
    chunks.push(" " + remaining.slice(0, 74));
    remaining = remaining.slice(74);
  }
  return chunks.join("\r\n");
}

export async function GET() {
  const events = await getEvents();
  // DTSTAMP is fixed per event (not "now") so the feed is byte-identical until
  // the events themselves change. A changing timestamp forced a billed Vercel
  // ISR Write on every regeneration.

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PRISM HK//Events Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:PRISM HK Events",
    "X-WR-CALDESC:LGBTQ+ events across Hong Kong, curated by PRISM",
    "X-WR-TIMEZONE:Asia/Hong_Kong",
  ];

  for (const event of events) {
    const dateStr = parseDate(event.date);
    if (!dateStr) continue;

    const start = to24Hour(event.start_time);
    const end = to24Hour(event.end_time) || start;
    const venue = event.venue_en || event.district || "";
    const description = event.description_en || "";
    const uid = `${dateStr}-${start}-${event.name_en.slice(0, 30).replace(/\s/g, "")}@prism.lgbt`;

    lines.push("BEGIN:VEVENT");
    lines.push(foldLine(`UID:${uid}`));
    lines.push(`DTSTAMP:${dateStr}T000000Z`);
    lines.push(`DTSTART;TZID=Asia/Hong_Kong:${dateStr}T${start}`);
    lines.push(`DTEND;TZID=Asia/Hong_Kong:${dateStr}T${end}`);
    lines.push(foldLine(`SUMMARY:${escapeIcs(event.name_en)}`));
    if (venue) lines.push(foldLine(`LOCATION:${escapeIcs(venue)}`));
    if (description) lines.push(foldLine(`DESCRIPTION:${escapeIcs(description)}`));
    if (event.link) lines.push(foldLine(`URL:${event.link}`));
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  return new Response(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
