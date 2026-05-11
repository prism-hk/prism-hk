import type { Metadata } from "next";
import { getEvents } from "@/lib/events";
import { getPublishedListings } from "@/lib/supabase";
import EventsClient from "./EventsClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Events — PRISM HK 活動",
  description: "LGBTQ+ community events in Hong Kong. 香港 LGBTQ+ 社區活動。",
};

const COMMUNITY_ORG_NAMES = [
  "Hong Kong Pride",
  "Pink Alliance",
  "AIDS Concern",
  "Les Peches",
  "Out in HK",
];

const COMMUNITY_ORG_FALLBACKS: Record<string, string> = {
  "Hong Kong Pride": "https://www.hkpride.net",
  "Pink Alliance": "https://www.pinkalliance.hk",
  "AIDS Concern": "https://aidsconcern.org.hk",
  "Les Peches": "https://www.instagram.com/lespeches.hk",
  "Out in HK": "https://www.outinhk.com",
};

export default async function EventsPage() {
  const [events, listings] = await Promise.all([getEvents(), getPublishedListings()]);

  const communityOrgs = COMMUNITY_ORG_NAMES.map((name) => {
    const match = listings.find(
      (l) => l.name_en.toLowerCase() === name.toLowerCase()
    );
    return {
      name,
      logo: match?.logo ?? null,
      url: match?.website ?? COMMUNITY_ORG_FALLBACKS[name] ?? "#",
    };
  });

  return <EventsClient events={events} communityOrgs={communityOrgs} />;
}
