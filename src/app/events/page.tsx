import type { Metadata } from "next";
import { getEvents } from "@/lib/events";
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

  const communityOrgs = COMMUNITY_ORGS.map((org) => {
    const match = listings.find(
      (l) => l.name_en.toLowerCase() === org.name.toLowerCase()
    );
    return {
      name: org.name,
      logo: match?.logo ?? org.logo,
      url: match?.website ?? org.url,
    };
  });

  return <EventsClient events={eventsWithFallback} communityOrgs={communityOrgs} />;
}
