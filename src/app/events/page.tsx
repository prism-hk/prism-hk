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
    logo: "https://static.wixstatic.com/media/afab4e_b469c7b78dd84f8292b26e6bcd7ee981~mv2.jpg/v1/fill/w_400,h_400,al_c,q_80/Pink%20Alliance%20Logo_Horizontal_20240310.jpg",
  },
  {
    name: "AIDS Concern",
    url: "https://aidsconcern.org.hk",
    logo: "https://aidsconcern.org.hk/wp-content/uploads/2018/02/aids-concern-logo.png",
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
