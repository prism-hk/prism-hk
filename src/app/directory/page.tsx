import { Suspense } from "react";
import { getPublishedListings, getDistinctDistricts, getDistinctTags, getDistinctPrices } from "@/lib/supabase";
import DirectoryClient from "./DirectoryClient";

export const revalidate = 300;

export const metadata = {
  title: "Directory — PRISM HK 目錄",
  description: "Browse LGBTQ+-friendly listings across Hong Kong. 瀏覽香港各區 LGBTQ+ 友善商戶。",
};

export default async function DirectoryPage() {
  const [listings, districts, tags, prices] = await Promise.all([
    getPublishedListings(),
    getDistinctDistricts(),
    getDistinctTags(),
    getDistinctPrices(),
  ]);

  return (
    <Suspense>
      <DirectoryClient listings={listings} districts={districts} tags={tags} prices={prices} />
    </Suspense>
  );
}
