"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { type Listing } from "@/lib/supabase";
import FilterBar from "@/components/FilterBar";
import ListingGrid from "@/components/ListingGrid";
import ListingList from "@/components/ListingList";
import { CATEGORIES } from "@/lib/categories";
import { useLanguage } from "@/lib/LanguageContext";
import { t, isZh } from "@/lib/i18n";

type Filters = {
  search: string;
  category: string;
  district: string;
};

export default function DirectoryClient({
  listings,
  districts,
}: {
  listings: Listing[];
  districts: string[];
}) {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialTag = searchParams.get("tag") || "";
  const initialTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const allInitialTags = initialTag ? [initialTag] : initialTags;

  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: initialCategory,
    district: "",
  });
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return listings.filter((listing) => {
      // Tag filter from URL param (e.g. ?tag=volunteering or ?tags=bar,cafe)
      if (allInitialTags.length > 0) {
        const listingTags = listing.tags || [];
        if (!allInitialTags.some((t) => listingTags.includes(t))) {
          return false;
        }
      }

      // Category filter (contains match for multi-category listings)
      if (filters.category && !listing.category?.includes(filters.category)) {
        return false;
      }

      // District filter (check if any of the listing's comma-separated districts match)
      if (filters.district) {
        const listingDistricts = listing.district_en
          ?.split(",")
          .map((d) => d.trim()) || [];
        if (!listingDistricts.includes(filters.district)) {
          return false;
        }
      }

      // Search filter
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const searchable = [
          listing.name_en,
          listing.name_zh,
          listing.description_en,
          listing.description_zh,
          listing.district_en,
          listing.district_zh,
          listing.category,
          ...(listing.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchable.includes(q);
      }

      return true;
    });
  }, [listings, filters, allInitialTags]);

  const categories = CATEGORIES.map((c) => c.id);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
      <div className="flex items-end justify-between mb-1">
        <div>
          <h1 className="text-3xl font-bold">
            {t("directory", language)}
          </h1>
          <p className="text-[#6B6890] text-sm mt-1">
            {filtered.length} / {listings.length} {isZh(language) ? "香港 LGBTQ+ 友善機構" : language === "both" ? "LGBTQ+-friendly listings across Hong Kong 香港 LGBTQ+ 友善機構" : "LGBTQ+-friendly listings across Hong Kong"}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-[#F5F4FA] rounded-lg p-1">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-white shadow-sm text-[#7B68EE]" : "text-[#6B6890] hover:text-[#7B68EE]"}`}
            aria-label="Grid view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-white shadow-sm text-[#7B68EE]" : "text-[#6B6890] hover:text-[#7B68EE]"}`}
            aria-label="List view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-6">
        <FilterBar
          categories={categories}
          districts={districts}
          onFilter={setFilters}
          initialCategory={initialCategory}
        />
      </div>

      <div className="mt-6">
        {view === "grid" ? (
          <ListingGrid listings={filtered} />
        ) : (
          <ListingList listings={filtered} />
        )}
      </div>
    </div>
  );
}
