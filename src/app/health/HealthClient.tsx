"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { type Listing } from "@/lib/supabase";
import FilterBar from "@/components/FilterBar";
import ListingGrid from "@/components/ListingGrid";
import ListingPanel from "@/components/ListingPanel";
import { useLanguage } from "@/lib/LanguageContext";
import { t, isZh } from "@/lib/i18n";
import { translateTag } from "@/lib/tagTranslations";

const TAG_GROUPS: { label: string; zh: string; zhHans: string; tags: string[] }[] = [
  { label: "Identity", zh: "身份", zhHans: "身份", tags: ["men", "women", "transgender", "bisexual", "asexual-aromantic", "children-youth", "elderly", "family-friendly"] },
  { label: "Services & Support", zh: "服務與支援", zhHans: "服务与支援", tags: ["mental-health", "sexual-health", "sti-testing", "prep-provider", "legal-aid", "domestic-violence", "harm-reduction", "family-planning", "emergency", "sliding-scale-fees", "telehealth-available", "walk-in", "appointment-only"] },
  { label: "Language", zh: "語言", zhHans: "语言", tags: ["cantonese", "english", "multilingual"] },
];

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
  const searchParams = useSearchParams();
  const initialFilters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    district: searchParams.get("district") || "",
  };
  const initialTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const initialPrice = searchParams.get("price") || "";

  const [filters, setFilters] = useState(initialFilters);
  const [activeTags, setActiveTags] = useState<string[]>(initialTags);
  const [activePrice, setActivePrice] = useState(initialPrice);
  const [showTags, setShowTags] = useState(initialTags.length > 0);
  const [showPrices, setShowPrices] = useState(!!initialPrice);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  // Keep the URL in sync with the active filters so the page is shareable.
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.district) params.set("district", filters.district);
    if (activeTags.length) params.set("tags", activeTags.join(","));
    if (activePrice) params.set("price", activePrice);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }, [filters, activeTags, activePrice]);

  async function shareFilters() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {}
  }

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.district ? 1 : 0) +
    activeTags.length +
    (activePrice ? 1 : 0);

  const filtered = useMemo(() => {
    return listings.filter((listing) => {
      if (activeTags.length > 0) {
        const listingTags = listing.tags || [];
        if (!activeTags.every((t) => listingTags.includes(t))) return false;
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

  const filterPanel = (
    <div className="space-y-4">
      <FilterBar
        categories={["Healthcare & Support", "NGOs"]}
        districts={districts}
        onFilter={setFilters}
        initialSearch={initialFilters.search}
        initialCategory={initialFilters.category}
        initialDistrict={initialFilters.district}
      />

      {/* Tag filter */}
      <div>
        <button
          onClick={() => setShowTags(!showTags)}
          className="flex items-center gap-2 text-sm font-medium text-[#6B6890] hover:text-[#7B68EE] transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${showTags ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="mt-2 space-y-3">
            {TAG_GROUPS.map((group) => {
              const availableTags = group.tags.filter((t) => tags.includes(t));
              if (availableTags.length === 0) return null;
              const groupLabel = language === "zh-Hans" ? group.zhHans : language === "zh" ? group.zh : group.label;
              return (
                <div key={group.label}>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-[#6B6890] mb-1.5">{groupLabel}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {availableTags.map((tag) => (
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
                </div>
              );
            })}
            {(() => {
              const groupedTags = TAG_GROUPS.flatMap((g) => g.tags);
              const ungrouped = tags.filter((t) => !groupedTags.includes(t));
              if (ungrouped.length === 0) return null;
              return (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-[#6B6890] mb-1.5">{isZh(language) ? "其他" : "Other"}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ungrouped.map((tag) => (
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
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Price filter */}
      {prices.length > 0 && (
        <div>
          <button
            onClick={() => setShowPrices(!showPrices)}
            className="flex items-center gap-2 text-sm font-medium text-[#6B6890] hover:text-[#7B68EE] transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform ${showPrices ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-28 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1E1B3A]">{t("health", language)}</h1>
        <p className="text-[#6B6890] text-sm mt-1">
          {filtered.length} / {listings.length} {isZh(language) ? "LGBTQ+ 友善醫療服務提供者及支援組織" : "LGBTQ+-affirming healthcare providers and support organizations"}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[260px] shrink-0">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#1E1B3A]">{isZh(language) ? "篩選" : "Filter"}</h2>
            </div>
            {filterPanel}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Results count + share */}
          <div className="flex items-center justify-between mb-3 text-xs text-[#6B6890]">
            <span className="tabular-nums">
              {filtered.length} {isZh(language) ? "個結果" : "Results"}
            </span>
            <button
              onClick={shareFilters}
              title={isZh(language) ? "複製連結（含目前篩選）" : "Copy a link to these filters"}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E8E6F0] font-semibold text-[#7B68EE] hover:border-[#A78BFA] hover:shadow-sm transition-[border-color,box-shadow] whitespace-nowrap"
            >
              {shareCopied
                ? (isZh(language) ? "已複製連結 ✓" : "Link copied ✓")
                : (isZh(language) ? "🔗 分享篩選結果" : "🔗 Share filters")}
            </button>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border border-[#E8E6F0] text-sm text-[#6B6890] hover:border-[#A78BFA]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {isZh(language) ? "篩選" : "Filters"}
            {activeCount > 0 && <span className="text-[10px] bg-[#7B68EE] text-white rounded-full px-1.5 py-0.5">{activeCount}</span>}
          </button>

          {mobileFiltersOpen && (
            <div className="lg:hidden mb-6 p-4 bg-[#FAFAFE] rounded-xl border border-[#E8E6F0]">
              {filterPanel}
            </div>
          )}

          <ListingGrid listings={filtered} onSelect={setSelectedListing} />
        </main>
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
