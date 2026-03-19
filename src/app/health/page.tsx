import { getPublishedListings, getDistinctDistricts } from "@/lib/supabase";
import { getEmergencyServices } from "@/lib/emergency";
import HealthClient from "./HealthClient";

export const revalidate = 300;

export const metadata = {
  title: "Health & Support — PRISM HK 健康支援",
  description: "LGBTQ+-affirming healthcare providers and emergency services in Hong Kong. 香港 LGBTQ+ 友善醫療服務及緊急服務。",
};

export default async function HealthPage() {
  const [allListings, districts, emergencyServices] = await Promise.all([
    getPublishedListings(),
    getDistinctDistricts(),
    getEmergencyServices(),
  ]);

  // Pre-filter to Healthcare + relevant NGOs
  const healthListings = allListings.filter(
    (l) => l.category === "Healthcare" || l.category === "NGO"
  );

  return (
    <HealthClient
      listings={healthListings}
      districts={districts}
      emergencyServices={emergencyServices}
    />
  );
}
