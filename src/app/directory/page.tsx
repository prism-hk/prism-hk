import { Suspense } from "react";
import { getPublishedListings, getDistinctDistricts, getDistinctTags, getDistinctPrices } from "@/lib/supabase";
import { getEvents } from "@/lib/events";
import { getArticles } from "@/lib/articles";
import DirectoryClient from "./DirectoryClient";

export const revalidate = 300;

export const metadata = {
  title: "Directory — PRISM HK 資料庫",
  description: "Explore LGBTQ+-friendly spaces and support across Hong Kong. 探索香港各區 LGBTQ+ 友善空間及支援。",
};

export default async function DirectoryPage() {
  const [listings, districts, tags, prices, events, articleGroups] = await Promise.all([
    getPublishedListings(),
    getDistinctDistricts(),
    getDistinctTags(),
    getDistinctPrices(),
    getEvents(),
    getArticles(),
  ]);
  const articles = articleGroups.flatMap((g) => g.articles);

  return (
    <Suspense>
      <DirectoryClient listings={listings} districts={districts} tags={tags} prices={prices} events={events} articles={articles} />
    </Suspense>
  );
}
