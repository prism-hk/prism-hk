#!/usr/bin/env node
/**
 * Check Meetup.com groups for new events not yet in the Google Sheet Events tab.
 *
 * Usage: node scripts/check-meetup.js
 *
 * Add new Meetup groups to MEETUP_GROUPS below.
 * Output: paste-ready rows for the Events tab in Google Sheets.
 */

const SHEET_ID = "1zKolQNmY8g_oDPBPiiQLmFeNC6KFmz7xXCNgBvAtWhY";
const API_KEY = "AIzaSyAruoZCvwELngTPpym_qncSAOmIv_S3pNk";

// Meetup groups to scrape — add more here
const MEETUP_GROUPS = [
  { slug: "fruits-in-suits-fins", org: "Fruits in Suits" },
];

async function getExistingEvents() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Events?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const rows = data.values || [];
  // Extract event names + dates for dedup
  const existing = new Set();
  for (const row of rows.slice(1)) {
    const name = (row[0] || "").trim().toLowerCase();
    const date = (row[6] || "").trim();
    if (name) existing.add(`${name}|${date}`);
  }
  return existing;
}

async function scrapeMeetup(slug) {
  const url = `https://www.meetup.com/${slug}/events/`;
  const res = await fetch(url);
  const html = await res.text();

  // Extract event data from JSON-LD
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLdMatch) {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      const events = Array.isArray(data) ? data : [data];
      return events
        .filter(e => e["@type"] === "Event" || e["@type"] === "SocialEvent")
        .map(e => ({
          name: e.name,
          date: e.startDate,
          endDate: e.endDate,
          location: e.location?.name || e.location?.address?.streetAddress || "",
          district: e.location?.address?.addressLocality || "",
          description: e.description || "",
          url: e.url || "",
        }));
    } catch (err) {
      // fallback
    }
  }

  // Fallback: basic regex extraction
  const titleMatch = html.match(/eventCard.*?<h2[^>]*>(.*?)<\/h2>/s);
  const dateMatch = html.match(/datetime="([^"]+)"/);
  if (titleMatch && dateMatch) {
    return [{
      name: titleMatch[1].replace(/<[^>]+>/g, "").trim(),
      date: dateMatch[1],
      endDate: "",
      location: "",
      district: "",
      description: "",
      url: `https://www.meetup.com/${slug}/events/`,
    }];
  }

  return [];
}

function formatDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function formatTime(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

async function main() {
  console.log("Checking Meetup groups for new events...\n");

  const existing = await getExistingEvents();
  console.log(`Found ${existing.size} existing events in sheet.\n`);

  let newEvents = [];

  for (const group of MEETUP_GROUPS) {
    console.log(`Checking ${group.slug}...`);
    const events = await scrapeMeetup(group.slug);

    for (const event of events) {
      const date = formatDate(event.date);
      const key = `${event.name.toLowerCase().trim()}|${date}`;

      if (existing.has(key)) {
        console.log(`  ✓ Already in sheet: ${event.name} (${date})`);
      } else {
        console.log(`  ★ NEW: ${event.name} (${date})`);
        newEvents.push({ ...event, org: group.org, formattedDate: date });
      }
    }
  }

  if (newEvents.length === 0) {
    console.log("\n✅ No new events to add!");
    return;
  }

  console.log(`\n=== ${newEvents.length} new event(s) — paste into Events sheet ===\n`);
  console.log("Columns: Event Name (EN) | Event Name (TC) | Event Name (SC) | Org Name (EN) | ... | Date | Start Time | End Time | ... | Link | Description | ... | Tags | ... | District");
  console.log("");

  for (const e of newEvents) {
    console.log(`Event Name (EN): ${e.name}`);
    console.log(`Organization: ${e.org}`);
    console.log(`Date: ${e.formattedDate}`);
    console.log(`Start Time: ${formatTime(e.date)}`);
    console.log(`End Time: ${formatTime(e.endDate)}`);
    console.log(`Link: ${e.url}`);
    console.log(`Location: ${e.location}`);
    console.log(`District: ${e.district}`);
    console.log(`Description: ${e.description.substring(0, 200)}...`);
    console.log("");
  }
}

main().catch(console.error);
