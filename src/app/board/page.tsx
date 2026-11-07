import type { Metadata } from "next";
import { getBoardPosts } from "@/lib/board";
import { getPublishedListings } from "@/lib/supabase";
import BoardClient, { type OrgInfo } from "./BoardClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Community Board | PRISM HK 社區交流板",
  description:
    "Spaces, speakers, reach, sponsorship, volunteers and participants: what Hong Kong's LGBTQ+ community groups are looking for and offering. 香港 LGBTQ+ 社區組織的需求與提供。",
};

export default async function BoardPage() {
  const [posts, listings] = await Promise.all([getBoardPosts(), getPublishedListings()]);

  // Link each post to its organisation's directory entry (and logo) when the names match.
  const orgs: Record<string, OrgInfo> = {};
  for (const l of listings) {
    orgs[l.name_en.toLowerCase().trim()] = {
      name_en: l.name_en,
      name_zh: l.name_zh,
      name_zhHans: l.name_zh_hans,
      logo: l.logo,
    };
  }

  return <BoardClient posts={posts} orgs={orgs} />;
}
