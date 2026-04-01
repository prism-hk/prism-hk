import { getPublishedListings, getDistinctDistricts } from "@/lib/supabase";
import HealthClient from "./HealthClient";

export const revalidate = 300;

export const metadata = {
  title: "Healthcare & Support — PRISM HK 醫療支援",
  description: "LGBTQ+-affirming healthcare providers and support services in Hong Kong. 香港 LGBTQ+ 友善醫療支援服務。",
};

export default async function HealthPage() {
  const [allListings, districts] = await Promise.all([
    getPublishedListings(),
    getDistinctDistricts(),
  ]);

  // Pre-filter to Healthcare & Support + NGOs (contains match)
  const healthListings = allListings.filter(
    (l) => l.category?.includes("Healthcare") || l.category?.includes("NGO")
  );

  // Extract tags and prices from health listings only
  const tags = [...new Set(healthListings.flatMap((l) => l.tags || []).filter(Boolean))].sort();
  const prices = [...new Set(healthListings.map((l) => l.price).filter(Boolean))] as string[];

  return (
    <HealthClient
      listings={healthListings}
      districts={districts}
      tags={tags}
      prices={prices.sort()}
    />
  );
}
