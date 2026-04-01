import Hero from "@/components/Hero";
import SmartDispatcher from "@/components/SmartDispatcher";
import { getPublishedListings, getCategoryStats, getDistinctDistricts } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import FeaturedListings from "@/components/FeaturedListings";
import HomeContent from "@/components/HomeContent";
import { getEvents, type PrismEvent } from "@/lib/events";

export const revalidate = 300; // ISR every 5 minutes

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
      <Hero
        listingsCount={listings.length}
        categoriesCount={categoriesWithListings || CATEGORIES.length}
        districtsCount={districts.length || 18}
      />
      <SmartDispatcher />

      <section className="max-w-5xl mx-auto px-6 py-16">
        <FeaturedListings listings={featured} />
      </section>

      <HomeContent categoryStats={categoryStats} events={events} />
    </>
  );
}
