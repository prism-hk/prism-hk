import Hero from "@/components/Hero";
import { getPublishedListings, getCategoryStats, getDistinctDistricts } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import HomeContent from "@/components/HomeContent";
import { getEvents } from "@/lib/events";
import { getBoardPosts } from "@/lib/board";
import type { OrgInfo } from "@/app/board/BoardClient";

export const revalidate = 300;

export default async function HomePage() {
  const [listings, categoryStats, districts, events, boardPosts] = await Promise.all([
    getPublishedListings(),
    getCategoryStats(),
    getDistinctDistricts(),
    getEvents(),
    getBoardPosts(),
  ]);

  // Latest Community Board posts, with directory names/logos for their organisations
  const latestBoardPosts = boardPosts.slice(0, 4);
  const boardOrgs: Record<string, OrgInfo> = {};
  for (const l of listings) {
    const key = l.name_en.toLowerCase().trim();
    if (latestBoardPosts.some((p) => p.org.toLowerCase().trim() === key)) {
      boardOrgs[key] = { name_en: l.name_en, name_zh: l.name_zh, name_zhHans: l.name_zh_hans, logo: l.logo };
    }
  }

  const featured = (() => {
    const pinned = listings.filter((l) => l.featured);
    if (pinned.length >= 3) return pinned.slice(0, 6);
    const verified = listings.filter((l) => l.verified && !l.featured);
    return [...pinned, ...verified].slice(0, 6);
  })();
  // Newly listed: most recently added rows (created_at is set on first insert
  // and survives sheet re-syncs, so it tracks when Blake appended the org)
  const newest = [...listings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);
  const categoriesWithListings = categoryStats.filter((c) => c.count > 0).length;

  return (
    <>
      {/* 1. Hero + SmartDispatcher */}
      <Hero
        listingsCount={listings.length}
        categoriesCount={7}
        districtsCount={districts.length || 18}
      />
      {/* 2-6. Categories, 18 Districts, Featured, Events, CTA */}
      <HomeContent
        categoryStats={categoryStats}
        events={events}
        boardPosts={latestBoardPosts}
        boardOrgs={boardOrgs}
        featured={featured}
        newest={newest}
        listingsCount={listings.length}
        districtsCount={districts.length || 18}
        categoriesCount={7}
      />
    </>
  );
}
