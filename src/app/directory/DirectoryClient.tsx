"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { type Listing } from "@/lib/supabase";
import { type PrismEvent } from "@/lib/events";
import { type Article } from "@/lib/articles";
import ListingCard from "@/components/ListingCard";
import ListingPanel from "@/components/ListingPanel";
import { CATEGORIES, getCategoryName } from "@/lib/categories";
import { useLanguage } from "@/lib/LanguageContext";
import { t, isZh } from "@/lib/i18n";
import { translateTag } from "@/lib/tagTranslations";
import { translateDistrict } from "@/lib/districtTranslations";

const TAG_GROUPS: { label: string; zh: string; zhHans: string; tags: string[] }[] = [
  { label: "Identity", zh: "身份", zhHans: "身份", tags: ["men", "women", "transgender", "bisexual", "asexual-aromantic", "children-youth", "elderly", "family-friendly"] },
  { label: "Type of Place", zh: "場所類型", zhHans: "场所类型", tags: ["bar", "cafe", "restaurant", "sauna", "beach", "clinic", "shelter", "university", "fitness", "sports"] },
  { label: "Services & Support", zh: "服務與支援", zhHans: "服务与支援", tags: ["mental-health", "sexual-health", "sti-testing", "prep-provider", "legal-aid", "domestic-violence", "harm-reduction", "family-planning", "emergency", "sliding-scale-fees", "telehealth-available", "walk-in", "appointment-only"] },
  { label: "Activities & Interests", zh: "活動與興趣", zhHans: "活动与兴趣", tags: ["arts", "drag", "entertainment", "party", "social", "hobby", "education", "volunteering"] },
  { label: "Language", zh: "語言", zhHans: "语言", tags: ["cantonese", "english", "multilingual"] },
  { label: "Organization Type", zh: "機構類型", zhHans: "机构类型", tags: ["lgbtq-led", "lgbtq-friendly", "advocacy", "professional", "religion", "donations"] },
  { label: "Amenities", zh: "設施", zhHans: "设施", tags: ["pet-friendly", "non-alcoholic", "wheelchair-accessible"] },
];

const PAGE_SIZE_OPTIONS = [10, 30, 50, 100];
const PRICE_TIERS = ["Free", "$", "$$", "$$$", "$$$$"];

function priceToTier(price: string | null): number | null {
  if (!price) return null;
  const p = price.trim();
  if (p === "Free" || /^free$/i.test(p)) return 0;
  if (p === "$") return 1;
  if (p === "$$") return 2;
  if (p === "$$$") return 3;
  if (p === "$$$$") return 4;
  return null;
}

export default function DirectoryClient({
  listings,
  districts,
  tags,
  prices,
  events = [],
  articles = [],
}: {
  listings: Listing[];
  districts: string[];
  tags: string[];
  prices: string[];
  events?: PrismEvent[];
  articles?: Article[];
}) {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialTag = searchParams.get("tag") || "";
  const initialTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const allInitialTags = initialTag ? [initialTag] : initialTags;
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [activeDistricts, setActiveDistricts] = useState<string[]>([]);
  const [districtMode, setDistrictMode] = useState<"and" | "or">("or");
  const [activeTags, setActiveTags] = useState<string[]>(allInitialTags);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 4]);
  const [tagMode, setTagMode] = useState<"and" | "or">(allInitialTags.length > 1 ? "or" : "and");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(30);

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  }

  function toggleDistrict(d: string) {
    setActiveDistricts((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
    setPage(1);
  }

  function resetFilters() {
    setSearch("");
    setCategory("");
    setActiveDistricts([]);
    setActiveTags([]);
    setPriceRange([0, 4]);
    setPage(1);
  }

  const filtered = useMemo(() => {
    return listings.filter((listing) => {
      if (activeTags.length > 0) {
        const listingTags = listing.tags || [];
        if (tagMode === "or") {
          if (!activeTags.some((t) => listingTags.includes(t))) return false;
        } else {
          if (!activeTags.every((t) => listingTags.includes(t))) return false;
        }
      }
      if (priceRange[0] !== 0 || priceRange[1] !== 4) {
        const tier = priceToTier(listing.price);
        // Listings without a known price (null/"Various") stay visible — the
        // slider only excludes listings whose price falls outside the range
        if (tier !== null && (tier < priceRange[0] || tier > priceRange[1])) {
          return false;
        }
      }
      if (category && !listing.category?.includes(category)) return false;
      if (activeDistricts.length > 0) {
        const listingDistricts = listing.district_en?.split(",").map((d) => d.trim()) || [];
        if (districtMode === "or") {
          if (!activeDistricts.some((d) => listingDistricts.includes(d))) return false;
        } else {
          if (!activeDistricts.every((d) => listingDistricts.includes(d))) return false;
        }
      }
      if (search) {
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, "");
        const q = search.toLowerCase();
        const qNorm = normalize(search);
        const searchable = [
          listing.name_en, listing.name_zh, listing.name_zh_hans,
          listing.description_en, listing.description_zh, listing.description_zh_hans,
          listing.district_en, listing.district_zh,
          listing.address, listing.address_zh, listing.address_zh_hans,
          listing.category, ...(listing.tags || []),
        ].filter(Boolean).join(" ").toLowerCase();
        const searchableNorm = normalize(searchable);
        if (!searchable.includes(q) && !searchableNorm.includes(qNorm)) return false;
      }
      return true;
    }).sort((a, b) => {
      // Featured first, then alphabetical by name. Fixes bug where multi-category
      // listings got pushed to the end of single-category filter results (the
      // Supabase query sorted by the raw category string).
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (a.name_en || "").localeCompare(b.name_en || "");
    });
  }, [listings, search, category, activeDistricts, districtMode, activeTags, priceRange, tagMode]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const hasActiveFilters = search || category || activeDistricts.length > 0 || activeTags.length > 0 || priceRange[0] !== 0 || priceRange[1] !== 4;

  const filterSidebar = (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder={isZh(language) ? "搜索空間、服務..." : "Search spaces, services..."}
          className="w-full px-3 py-2 rounded-lg border border-[#E8E6F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE]"
        />
      </div>

      {/* District */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-[#1E1B3A]">{isZh(language) ? "地區" : "District"}</p>
          <div className="flex items-center gap-2">
            {activeDistricts.length > 1 && (
              <div
                className="inline-flex bg-[#F5F4FA] rounded-md p-0.5"
                title={isZh(language)
                  ? "AND：必須屬於全部地區；OR：只需屬於任一地區"
                  : "AND: must match all districts; OR: match any"}
              >
                <button
                  onClick={() => setDistrictMode("and")}
                  className={`px-1.5 py-0.5 text-[9px] font-semibold rounded ${
                    districtMode === "and" ? "bg-white shadow-sm text-[#7B68EE]" : "text-[#6B6890]"
                  }`}
                >
                  AND
                </button>
                <button
                  onClick={() => setDistrictMode("or")}
                  className={`px-1.5 py-0.5 text-[9px] font-semibold rounded ${
                    districtMode === "or" ? "bg-white shadow-sm text-[#7B68EE]" : "text-[#6B6890]"
                  }`}
                >
                  OR
                </button>
              </div>
            )}
            {activeDistricts.length > 0 && (
              <button onClick={() => { setActiveDistricts([]); setPage(1); }} className="text-[10px] text-[#7B68EE] hover:underline">
                {isZh(language) ? "清除" : "Clear"}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {districts.map((d) => {
            const active = activeDistricts.includes(d);
            return (
              <button
                key={d}
                onClick={() => toggleDistrict(d)}
                className={`px-2 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  active
                    ? "bg-[#7B68EE] text-white border-[#7B68EE]"
                    : "bg-white border-[#E8E6F0] text-[#6B6890] hover:border-[#A78BFA]"
                }`}
              >
                {isZh(language) ? translateDistrict(d, language) : d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price range — dual slider: Free → $$$$ */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-[#1E1B3A]">{isZh(language) ? "價格" : "Price"}</p>
          {(priceRange[0] !== 0 || priceRange[1] !== 4) && (
            <button onClick={() => { setPriceRange([0, 4]); setPage(1); }} className="text-[10px] text-[#7B68EE] hover:underline">
              {isZh(language) ? "清除" : "Clear"}
            </button>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-[#6B6890] mb-1 tabular-nums">
          <span className="font-medium text-[#1E1B3A]">
            {isZh(language) && priceRange[0] === 0 ? "免費" : PRICE_TIERS[priceRange[0]]}
          </span>
          <span className="font-medium text-[#1E1B3A]">
            {isZh(language) && priceRange[1] === 0 ? "免費" : PRICE_TIERS[priceRange[1]]}
          </span>
        </div>
        <div className="relative h-6 flex items-center">
          <div className="absolute left-0 right-0 h-1 bg-[#E8E6F0] rounded-full" />
          <div
            className="absolute h-1 bg-[#7B68EE] rounded-full"
            style={{ left: `${(priceRange[0] / 4) * 100}%`, right: `${100 - (priceRange[1] / 4) * 100}%` }}
          />
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={priceRange[0]}
            onChange={(e) => { const v = Number(e.target.value); setPriceRange([Math.min(v, priceRange[1]), priceRange[1]]); setPage(1); }}
            className="absolute left-0 right-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#7B68EE] [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#7B68EE]"
          />
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={priceRange[1]}
            onChange={(e) => { const v = Number(e.target.value); setPriceRange([priceRange[0], Math.max(v, priceRange[0])]); setPage(1); }}
            className="absolute left-0 right-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#7B68EE] [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#7B68EE]"
          />
        </div>
      </div>

      {/* Tags — grouped */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-[#1E1B3A]">
            {isZh(language) ? "標籤" : "Tags"}
            {activeTags.length > 0 && (
              <span
                onClick={() => setTagMode(tagMode === "and" ? "or" : "and")}
                title={isZh(language) ? (tagMode === "and" ? "AND：必須符合所有標籤。點擊切換到 OR（符合任一標籤）" : "OR：符合任一標籤即可。點擊切換到 AND（必須全部符合）") : (tagMode === "and" ? "AND: match ALL selected tags. Click to switch to OR (match any)" : "OR: match ANY selected tag. Click to switch to AND (match all)")}
                className="ml-2 text-[10px] bg-[#F0EEFF] text-[#7B68EE] rounded-full px-1.5 py-0.5 cursor-pointer hover:bg-[#E0DDFF]"
              >
                {tagMode === "and" ? "AND" : "OR"}
              </span>
            )}
          </p>
          {activeTags.length > 0 && (
            <button onClick={() => { setActiveTags([]); setPage(1); }} className="text-[10px] text-[#7B68EE] hover:underline">
              {isZh(language) ? "清除" : "Clear"}
            </button>
          )}
        </div>
        <div className="space-y-3">
          {TAG_GROUPS.map((group) => {
            const availableTags = group.tags.filter((t) => tags.includes(t));
            if (availableTags.length === 0) return null;
            const groupLabel = language === "zh-Hans" ? group.zhHans : language === "zh" ? group.zh : group.label;
            return (
              <div key={group.label}>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#6B6890] mb-1">{groupLabel}</p>
                <div className="flex flex-wrap gap-1">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                        activeTags.includes(tag)
                          ? "bg-[#7B68EE] text-white border-[#7B68EE]"
                          : "bg-white border-[#E8E6F0] text-[#6B6890] hover:border-[#A78BFA]"
                      }`}
                    >
                      {translateTag(tag, language)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full py-2 text-xs font-medium text-[#7B68EE] bg-[#F0EEFF] rounded-lg hover:bg-[#E0DDFF] transition-colors"
        >
          {isZh(language) ? "重置所有篩選" : "Reset all"}
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-28 pb-20">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1E1B3A]">
          {t("directory", language)}
        </h1>
        <p className="text-[#6B6890] text-sm mt-1">
          {isZh(language) ? "香港 LGBTQ+ 友善空間及支援" : "LGBTQ+-friendly spaces and support across Hong Kong"}
        </p>
      </div>

      <div className="flex gap-6">
        {/* ── Left sidebar (desktop) ── */}
        <aside className="hidden lg:block w-[260px] shrink-0">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#1E1B3A]">{isZh(language) ? "篩選" : "Filter"}</h2>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-[10px] text-[#7B68EE] hover:underline">
                  {isZh(language) ? "重置" : "Reset all"}
                </button>
              )}
            </div>
            {filterSidebar}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => { setCategory(""); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !category ? "bg-[#7B68EE] text-white" : "bg-white text-[#6B6890] border border-[#E8E6F0] hover:border-[#A78BFA]"
              }`}
            >
              {isZh(language) ? "全部" : "All"}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setCategory(category === cat.id ? "" : cat.id); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === cat.id ? "bg-[#7B68EE] text-white" : "bg-white text-[#6B6890] border border-[#E8E6F0] hover:border-[#A78BFA]"
                }`}
              >
                <img src={cat.icon} alt="" className="w-4 h-4 object-contain" /> {getCategoryName(cat, language)}
              </button>
            ))}
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border border-[#E8E6F0] text-sm text-[#6B6890] hover:border-[#A78BFA]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {isZh(language) ? "篩選" : "Filters"}
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#7B68EE]" />}
          </button>

          {/* Mobile filters */}
          {showMobileFilters && (
            <div className="lg:hidden mb-6 p-4 bg-[#FAFAFE] rounded-xl border border-[#E8E6F0]">
              {filterSidebar}
            </div>
          )}

          {/* Cross-surface search results (events + articles + form/info pages) */}
          {search && (() => {
            const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, "");
            const q = search.toLowerCase();
            const qNorm = normalize(search);
            const matchesText = (text: string) => {
              const t = text.toLowerCase();
              return t.includes(q) || normalize(t).includes(qNorm);
            };
            const matchedEvents = events.filter((e) => {
              const bag = [e.name_en, e.name_zh, e.name_zhHans, e.org_en, e.org_zh, e.description_en, e.description_zh, ...e.tags].filter(Boolean).join(" ");
              return bag && matchesText(bag);
            }).slice(0, 3);
            const matchedArticles = articles.filter((a) => {
              const bag = [a.title_en, a.title_zh, a.title_zhHans, a.topic, ...a.tags].filter(Boolean).join(" ");
              return bag && matchesText(bag);
            }).slice(0, 3);

            // Form / utility pages — surface when the user searches for these intents
            const PAGE_HITS = [
              { url: "/get-involved", titleEn: "Get Involved", titleZh: "參與我們", emoji: "🙌", keywords: "get involved volunteer volunteering help join contribute participate 義工 義務 加入 參與 参与 志愿 投身" },
              { url: "/get-involved#partner", titleEn: "Partner With Us", titleZh: "成為合作夥伴", emoji: "🤝", keywords: "partner partnership organization submit add listing org collaborate 合作 夥伴 伙伴 提交 加入" },
              { url: "/get-involved#donate", titleEn: "Buy Us a Coffee / Donate", titleZh: "贊助我們", emoji: "☕", keywords: "donate donation support fund payme money give contribute 捐 贊助 资助 支持" },
              { url: "/contact", titleEn: "Contact Us", titleZh: "聯絡我們", emoji: "📬", keywords: "contact email feedback message question reach out 聯絡 联系 反饋 意見 意见" },
              { url: "/contact#feedback", titleEn: "Send Feedback", titleZh: "提交意見", emoji: "💬", keywords: "feedback bug issue complaint suggestion idea 意見 反饋 反馈 建議 建议" },
              { url: "/learn", titleEn: "About Us", titleZh: "關於我們", emoji: "ℹ️", keywords: "about pledge mission team objectives prism 關於 关于 使命 團隊 团队 承諾 承诺" },
              { url: "/learn/resources", titleEn: "Educational Resources", titleZh: "教育資源", emoji: "📚", keywords: "education educational learn resources article reading rights know your rights 教育 資源 资源 文章 權利 权利" },
            ];
            const matchedPages = PAGE_HITS.filter((p) => matchesText(`${p.titleEn} ${p.titleZh} ${p.keywords}`)).slice(0, 4);

            if (matchedEvents.length === 0 && matchedArticles.length === 0 && matchedPages.length === 0) return null;
            return (
              <div className="mb-4 space-y-3">
                {matchedEvents.length > 0 && (
                  <div className="p-3 rounded-xl border border-[#E8E6F0] bg-white">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-[#6B6890] mb-2">
                      {isZh(language) ? "符合的活動" : "Matching events"}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {matchedEvents.map((e, i) => {
                        const evName = language === "zh-Hans" ? (e.name_zhHans || e.name_zh || e.name_en) : language === "zh" ? (e.name_zh || e.name_en) : e.name_en;
                        return (
                          <a key={i} href="/events" className="text-sm text-[#1E1B3A] hover:text-[#7B68EE] transition-colors">
                            📅 {evName} <span className="text-[#6B6890] text-xs">· {e.date}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
                {matchedArticles.length > 0 && (
                  <div className="p-3 rounded-xl border border-[#E8E6F0] bg-white">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-[#6B6890] mb-2">
                      {isZh(language) ? "符合的文章" : "Matching articles"}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {matchedArticles.map((a, i) => {
                        const title = language === "zh-Hans" ? (a.title_zhHans || a.title_zh || a.title_en) : language === "zh" ? (a.title_zh || a.title_en) : a.title_en;
                        return (
                          <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#1E1B3A] hover:text-[#7B68EE] transition-colors">
                            📖 {title} <span className="text-[#6B6890] text-xs">· {a.topic}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
                {matchedPages.length > 0 && (
                  <div className="p-3 rounded-xl border border-[#E8E6F0] bg-white">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-[#6B6890] mb-2">
                      {isZh(language) ? "頁面" : "On this site"}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {matchedPages.map((p, i) => (
                        <a key={i} href={p.url} className="text-sm text-[#1E1B3A] hover:text-[#7B68EE] transition-colors">
                          {p.emoji} {isZh(language) ? p.titleZh : p.titleEn}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Results count + page size */}
          <div className="flex items-center justify-between mb-3 text-xs text-[#6B6890]">
            <span className="tabular-nums">
              {filtered.length} {isZh(language) ? "個結果" : "Results"}
            </span>
            <label className="flex items-center gap-2">
              <span>{isZh(language) ? "顯示" : "Show"}</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
                className="px-2 py-1 rounded-md border border-[#E8E6F0] bg-white text-xs focus:outline-none focus:border-[#7B68EE]"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
                <option value={filtered.length || 1}>{isZh(language) ? "全部" : "All"}</option>
              </select>
            </label>
          </div>

          {/* Card grid — 3 columns */}
          {paged.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {paged.map((listing) => (
                <ListingCard key={listing.id} listing={listing} onSelect={setSelectedListing} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E8E6F0] py-16 text-center">
              <svg className="w-14 h-14 mx-auto mb-3 text-[#E8E6F0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-[#6B6890] text-sm">
                {isZh(language) ? "找不到符合條件的機構。" : "No listings found matching your filters."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg text-[#6B6890] hover:bg-[#F0EEFF] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1]) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-[#6B6890] text-sm">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-[#7B68EE] text-white"
                          : "text-[#6B6890] hover:bg-[#F0EEFF]"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg text-[#6B6890] hover:bg-[#F0EEFF] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Slide-out panel */}
      {selectedListing && (
        <ListingPanel listing={selectedListing} events={events} onClose={() => setSelectedListing(null)} />
      )}
    </div>
  );
}
