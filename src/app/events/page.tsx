import type { Metadata } from "next";
import { getEvents, type PrismEvent } from "@/lib/events";
import { getPublishedListings } from "@/lib/supabase";
import EventsClient from "./EventsClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Events — PRISM HK 活動",
  description: "LGBTQ+ community events in Hong Kong. 香港 LGBTQ+ 社區活動。",
};

const COMMUNITY_ORGS: { name: string; url: string; logo: string }[] = [
  {
    name: "Hong Kong Pride",
    url: "https://www.hkpride.net",
    logo: "https://hkpride.net/wp-content/uploads/2025/09/HkprideLogoH-150x150.jpg",
  },
  {
    name: "Pink Alliance",
    url: "https://www.pinkalliance.hk",
    logo: "/community-orgs/pink-alliance.jpg",
  },
  {
    name: "AIDS Concern",
    url: "https://aidsconcern.org.hk",
    logo: "/community-orgs/aids-concern.jpg",
  },
  {
    name: "Les Peches",
    url: "https://www.instagram.com/lespeches.hk",
    logo: "/community-orgs/les-peches.jpg",
  },
  {
    name: "Out in HK",
    url: "https://www.instagram.com/out_in_hk",
    logo: "/community-orgs/out-in-hk.jpg",
  },
];

export default async function EventsPage() {
  const [events, listings] = await Promise.all([getEvents(), getPublishedListings()]);

  // Org name → logo lookup, used to fill in missing event images from the
  // hosting org's logo. Falls through to hardcoded community-org logos if
  // the listing has no logo of its own.
  const orgLogoMap = new Map<string, string>();
  for (const l of listings) {
    if (l.logo) orgLogoMap.set(l.name_en.toLowerCase(), l.logo);
  }
  for (const org of COMMUNITY_ORGS) {
    if (!orgLogoMap.has(org.name.toLowerCase())) {
      orgLogoMap.set(org.name.toLowerCase(), org.logo);
    }
  }

  const eventsWithFallback = events.map((e) => {
    if (e.image) return { ...e, imageIsLogo: false };
    const fallback = orgLogoMap.get(e.org_en.toLowerCase()) ?? null;
    return { ...e, image: fallback, imageIsLogo: !!fallback };
  });

  const dedupedEvents = dedupeEvents(eventsWithFallback);

  return <EventsClient events={dedupedEvents} />;
}

type EventWithFallback = PrismEvent & { imageIsLogo: boolean };

function dedupeKey(e: EventWithFallback): string {
  return [
    (e.name_en || "").trim().toLowerCase(),
    e.date,
    (e.start_time || "").trim().toLowerCase(),
  ].join("|");
}

function len(s: string | null | undefined): number {
  return s ? s.length : 0;
}

function scoreEvent(e: EventWithFallback): number {
  let score = 0;
  if (e.image && !e.imageIsLogo) score += 10;
  else if (e.image) score += 1;
  score += len(e.venue_en) / 20;
  score += len(e.description_en) / 100;
  if (e.end_time) score += 2;
  if (e.price) score += 1;
  if (e.district) score += 1;
  if (e.region) score += 1;
  if (e.link) score += 1;
  score += (e.tags?.length ?? 0) * 0.5;
  for (const k of ["phone", "whatsapp", "facebook", "instagram", "linkedin", "email"] as const) {
    if (e[k]) score += 1;
  }
  return score;
}

function mergeEvents(winner: EventWithFallback, loser: EventWithFallback): EventWithFallback {
  const out = { ...winner };
  const keys = Object.keys(loser) as (keyof EventWithFallback)[];
  for (const k of keys) {
    const w = out[k];
    const l = loser[k];
    if (w == null || w === "" || (Array.isArray(w) && w.length === 0)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (out as any)[k] = l;
    } else if (typeof w === "string" && typeof l === "string" && l.length > w.length) {
      // Longer string wins for descriptive fields
      if (k === "venue_en" || k === "venue_zh" || k === "venue_zhHans" ||
          k === "description_en" || k === "description_zh" || k === "description_zhHans") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (out as any)[k] = l;
      }
    }
  }
  if (out.imageIsLogo && loser.image && !loser.imageIsLogo) {
    out.image = loser.image;
    out.imageIsLogo = false;
  }
  return out;
}

function dedupeEvents(events: EventWithFallback[]): EventWithFallback[] {
  const groups = new Map<string, EventWithFallback[]>();
  for (const e of events) {
    const key = dedupeKey(e);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  }
  const out: EventWithFallback[] = [];
  for (const group of groups.values()) {
    if (group.length === 1) {
      out.push(group[0]);
      continue;
    }
    const sorted = [...group].sort((a, b) => scoreEvent(b) - scoreEvent(a));
    let merged = sorted[0];
    for (let i = 1; i < sorted.length; i++) {
      merged = mergeEvents(merged, sorted[i]);
    }
    out.push(merged);
  }
  return out;
}
