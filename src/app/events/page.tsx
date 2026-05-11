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

  return <EventsClient events={events} communityOrgs={communityOrgs} />;
}
