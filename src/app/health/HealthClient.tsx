"use client";

import { useState, useMemo } from "react";
import { type Listing } from "@/lib/supabase";
import FilterBar from "@/components/FilterBar";
import ListingGrid from "@/components/ListingGrid";
import ListingPanel from "@/components/ListingPanel";
import { useLanguage } from "@/lib/LanguageContext";
import { t, isZh } from "@/lib/i18n";
import { translateTag } from "@/lib/tagTranslations";

export default function HealthClient({
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
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    district: "",
  });
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activePrice, setActivePrice] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [showPrices, setShowPrices] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const filtered = useMemo(() => {
    return listings.filter((listing) => {
      if (activeTags.length > 0) {
        const listingTags = listing.tags || [];
        if (!activeTags.some((t) => listingTags.includes(t))) return false;
      }
      if (activePrice && listing.price !== activePrice) return false;
      if (filters.category && !listing.category?.includes(filters.category)) return false;
      if (filters.district) {
        const listingDistricts = listing.district_en?.split(",").map((d) => d.trim()) || [];
        if (!listingDistricts.includes(filters.district)) return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const searchable = [
          listing.name_en, listing.name_zh,
          listing.description_en, listing.description_zh,
          listing.district_en, listing.district_zh,
          ...(listing.tags || []),
        ].filter(Boolean).join(" ").toLowerCase();
        return searchable.includes(q);
      }
      return true;
    });
  }, [listings, filters, activeTags, activePrice]);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
      <h1 className="text-3xl font-bold mb-1">
        {t("health", language)}
      </h1>
      <p className="text-[#6B6890] text-sm mb-6">
        {filtered.length} / {listings.length} {isZh(language) ? "LGBTQ+ 友善醫療服務提供者及支援組織" : "LGBTQ+-affirming healthcare providers and support organizations"}
      </p>

      <FilterBar
        categories={["Healthcare & Support", "NGOs"]}
        districts={districts}
        onFilter={setFilters}
      />

      {/* Tag filter — multi-select */}
      <div className="mt-3">
        <button
          onClick={() => setShowTags(!showTags)}
          className="flex items-center gap-2 text-sm font-medium text-[#6B6890] hover:text-[#7B68EE] transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showTags ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {activeTags.length > 0
            ? `${isZh(language) ? "標籤" : "Tags"} (${activeTags.length})`
            : isZh(language) ? "篩選標籤" : "Filter by Tags"}
          {activeTags.length > 0 && (
            <span
              onClick={(e) => { e.stopPropagation(); setActiveTags([]); }}
              className="ml-1 text-xs bg-[#F0EEFF] text-[#7B68EE] rounded-full px-1.5 py-0.5 hover:bg-[#E0DDFF] cursor-pointer"
            >
              {isZh(language) ? "清除" : "Clear"}
            </span>
          )}
        </button>
        {showTags && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  activeTags.includes(tag)
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
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
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
        <ListingGrid listings={filtered} onSelect={setSelectedListing} />
      </div>

      {selectedListing && (
        <ListingPanel
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}
