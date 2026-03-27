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
import { translateTag } from "@/lib/tagTranslations";

type Filters = {
  search: string;
  category: string;
  district: string;
};

export default function DirectoryClient({
  listings,
  districts,
  tags,
  prices,
}: {
  listings: Listing[];
  districts: string[];
  tags: string[];
  prices: string[];
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
  const [activeTag, setActiveTag] = useState("");
  const [activePrice, setActivePrice] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [showPrices, setShowPrices] = useState(false);

  const filtered = useMemo(() => {
    return listings.filter((listing) => {
      // Tag filter from URL param (e.g. ?tag=volunteering or ?tags=bar,cafe)
      if (allInitialTags.length > 0) {
        const listingTags = listing.tags || [];
        if (!allInitialTags.some((t) => listingTags.includes(t))) {
          return false;
        }
      }

      // Tag filter from UI
      if (activeTag) {
        if (!(listing.tags || []).includes(activeTag)) return false;
      }

      // Price filter
      if (activePrice) {
        if (listing.price !== activePrice) return false;
      }

      // Category filter
      if (filters.category && !listing.category?.includes(filters.category)) {
        return false;
      }

      // District filter
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
  }, [listings, filters, allInitialTags, activeTag, activePrice]);

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

      {/* Tag filter */}
      <div className="mt-3">
        <button
          onClick={() => setShowTags(!showTags)}
          className="flex items-center gap-2 text-sm font-medium text-[#6B6890] hover:text-[#7B68EE] transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showTags ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {activeTag
            ? `${isZh(language) ? "標籤" : "Tag"}: ${translateTag(activeTag, language)}`
            : isZh(language) ? "篩選標籤" : "Filter by Tag"}
          {activeTag && (
            <span
              onClick={(e) => { e.stopPropagation(); setActiveTag(""); }}
              className="ml-1 text-xs bg-[#F0EEFF] text-[#7B68EE] rounded-full px-1.5 py-0.5 hover:bg-[#E0DDFF] cursor-pointer"
            >
              ✕
            </span>
          )}
        </button>
        {showTags && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  activeTag === tag
                    ? "bg-[#7B68EE] text-white border-[#7B68EE]"
                    : "bg-white border-[#E8E6F0] text-[#6B6890] hover:border-[#A78BFA] hover:text-[#7B68EE]"
                }`}
              >
                {translateTag(tag, language)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price filter */}
      {prices.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowPrices(!showPrices)}
            className="flex items-center gap-2 text-sm font-medium text-[#6B6890] hover:text-[#7B68EE] transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showPrices ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {activePrice
              ? `${isZh(language) ? "價格" : "Price"}: ${activePrice}`
              : isZh(language) ? "篩選價格" : "Filter by Price"}
            {activePrice && (
              <span
                onClick={(e) => { e.stopPropagation(); setActivePrice(""); }}
                className="ml-1 text-xs bg-[#F0EEFF] text-[#7B68EE] rounded-full px-1.5 py-0.5 hover:bg-[#E0DDFF] cursor-pointer"
              >
                ✕
              </span>
            )}
          </button>
          {showPrices && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {prices.map((price) => (
                <button
                  key={price}
                  onClick={() => setActivePrice(activePrice === price ? "" : price)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    activePrice === price
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-white border-[#E8E6F0] text-[#6B6890] hover:border-amber-300 hover:text-amber-700"
                  }`}
                >
                  {isZh(language) && price === "Free" ? "免費" : price}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
