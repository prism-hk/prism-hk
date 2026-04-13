import Hero from "@/components/Hero";
import { getPublishedListings, getCategoryStats, getDistinctDistricts } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import HomeContent from "@/components/HomeContent";
import { getEvents } from "@/lib/events";

export const revalidate = 300;

export default async function HomePage() {
  const [listings, categoryStats, districts, events] = await Promise.all([
    getPublishedListings(),
    getCategoryStats(),
    getDistinctDistricts(),
    getEvents(),
  ]);

  const featured = listings.filter((l) => l.verified).slice(0, 6);
  const categoriesWithListings = categoryStats.filter((c) => c.count > 0).length;

  return (
    <>
      {/* 1. Hero + SmartDispatcher */}
      <Hero
        listingsCount={listings.length}
        categoriesCount={categoriesWithListings || CATEGORIES.length}
        districtsCount={districts.length || 18}
      />
      {/* 2-6. Categories, 18 Districts, Featured, Events, CTA */}
      <HomeContent
        categoryStats={categoryStats}
        events={events}
        featured={featured}
        listingsCount={listings.length}
        districtsCount={districts.length || 18}
        categoriesCount={categoriesWithListings || CATEGORIES.length}
      />
    </>
  );
}
