"use client";

import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { t, isZh, type Language } from "@/lib/i18n";
import { type PrismEvent } from "@/lib/events";
import { translateTag } from "@/lib/tagTranslations";
import { translateDistrict } from "@/lib/districtTranslations";
import EventPanel from "@/components/EventPanel";

export type CommunityOrg = {
  name: string;
  logo: string | null;
  url: string;
};

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  }
  return null;
}

function formatTime(time: string | null): string {
  if (!time) return "";
  const raw = time.trim().toLowerCase();
  const ampmMatch = raw.match(/(am|pm)\s*$/);
  const explicitAmPm = ampmMatch ? ampmMatch[1].toUpperCase() : null;
  const numeric = raw.replace(/\s*(am|pm)\s*$/, "").trim();
  const parts = numeric.split(":");
  if (parts.length >= 2) {
    let h = parseInt(parts[0]);
    const m = parts[1].replace(/\D+$/, "").padStart(2, "0").slice(0, 2);
    if (isNaN(h)) return time;
    if (explicitAmPm === "PM" && h < 12) h += 12;
    if (explicitAmPm === "AM" && h === 12) h = 0;
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  }
  return time;
}

function formatShortDate(d: Date, language: Language): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return isZh(language) ? `${mm}/${dd}` : `${mm}/${dd}`;
}

function priceBadgeClasses(price: string | null): string {
  if (!price) return "bg-emerald-50 text-emerald-700";
  const p = price.toLowerCase();
  if (p.includes("free") || p === "免費" || p === "免费") return "bg-emerald-50 text-emerald-700";
  if (p.includes("various") || p.includes("不一") || p.includes("多種")) return "bg-amber-50 text-amber-700";
  const dollars = (price.match(/\$/g) || []).length;
  if (dollars >= 4) return "bg-rose-50 text-rose-700";
  if (dollars >= 2) return "bg-orange-50 text-orange-700";
  return "bg-emerald-50 text-emerald-700";
}

function getEventName(event: PrismEvent, language: Language): string {
  if (language === "zh") return event.name_zh || event.name_en;
  if (language === "zh-Hans") return event.name_zhHans || event.name_zh || event.name_en;
  return event.name_en;
}

function getEventOrg(event: PrismEvent, language: Language): string {
  if (language === "zh") return event.org_zh || event.org_en;
  if (language === "zh-Hans") return event.org_zhHans || event.org_zh || event.org_en;
  return event.org_en;
}

function getEventDescription(event: PrismEvent, language: Language): string | null {
  if (language === "zh") return event.description_zh || event.description_en;
  if (language === "zh-Hans") return event.description_zhHans || event.description_zh || event.description_en;
  return event.description_en;
}

function getEventVenue(event: PrismEvent, language: Language): string | null {
  if (language === "zh") return event.venue_zh || event.venue_en;
  if (language === "zh-Hans") return event.venue_zhHans || event.venue_zh || event.venue_en;
  return event.venue_en;
}

const WEEKDAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAYS_ZH = ["一", "二", "三", "四", "五", "六", "日"];

export default function EventsClient({
  events = [],
  communityOrgs = [],
}: {
  events?: PrismEvent[];
  communityOrgs?: CommunityOrg[];
}) {
  const { language } = useLanguage();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedEvent, setSelectedEvent] = useState<PrismEvent | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const param = new URLSearchParams(window.location.search).get("event");
    if (!param) return;
    const [name, date] = decodeURIComponent(param).split("|");
    const match = events.find((e) => e.name_en === name && e.date === date);
    if (match) setSelectedEvent(match);
  }, [events]);

  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string>("");
  const [activeDistricts, setActiveDistricts] = useState<string[]>([]);
  const [districtMode, setDistrictMode] = useState<"and" | "or">("or");
  const toggleDistrict = (d: string) =>
    setActiveDistricts((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  const [pageSize, setPageSize] = useState<number>(12);

  const today = new Date(new Date().toDateString());

  const allTags = useMemo(() => {
    const s = new Set<string>();
    events.forEach((e) => e.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [events]);

  const allDistricts = useMemo(() => {
    const s = new Set<string>();
    events.forEach((e) => { if (e.district) s.add(e.district); });
    return Array.from(s).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    const normalizedQ = q.replace(/[^a-z0-9一-鿿]+/g, "");
    return events.filter((e) => {
      if (activeTag && !e.tags.includes(activeTag)) return false;
      if (activeDistricts.length > 0) {
        const listingDistricts = (e.district || "").split(",").map((x) => x.trim()).filter(Boolean);
        if (districtMode === "or") {
          if (!activeDistricts.some((d) => listingDistricts.includes(d))) return false;
        } else {
          if (!activeDistricts.every((d) => listingDistricts.includes(d))) return false;
        }
      }
      if (q) {
        const bag = [
          e.name_en, e.name_zh, e.name_zhHans,
          e.org_en, e.org_zh, e.org_zhHans,
          e.description_en, e.description_zh, e.description_zhHans,
          e.venue_en, e.venue_zh, e.venue_zhHans,
          e.district, ...e.tags,
        ].filter(Boolean).join(" ").toLowerCase();
        const bagNorm = bag.replace(/[^a-z0-9一-鿿]+/g, "");
        if (!bag.includes(q) && !bagNorm.includes(normalizedQ)) return false;
      }
      return true;
    });
  }, [events, search, activeTag, activeDistricts, districtMode]);

  const upcomingEvents = useMemo(() =>
    filteredEvents.filter((e) => {
      const d = parseDate(e.date);
      return !d || d >= today;
    }).sort((a, b) => {
      const da = parseDate(a.date);
      const db = parseDate(b.date);
      if (!da) return 1;
      if (!db) return -1;
      return da.getTime() - db.getTime();
    }),
    [filteredEvents]
  );

  const activeFilterCount =
    (activeTag ? 1 : 0) + activeDistricts.length + (search ? 1 : 0);
  const resetFilters = () => {
    setSearch("");
    setActiveTag("");
    setActiveDistricts([]);
  };

  // Calendar helpers
  const calendarDays = useMemo(() => {
    const { year, month } = calMonth;
    const rawDay = new Date(year, month, 1).getDay();
    const firstDay = (rawDay + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [calMonth]);

  const eventsOnDay = (day: number) => {
    return filteredEvents.filter((e) => {
      const d = parseDate(e.date);
      return d && d.getFullYear() === calMonth.year && d.getMonth() === calMonth.month && d.getDate() === day;
    });
  };

  const monthLabel = new Date(calMonth.year, calMonth.month).toLocaleDateString(
    isZh(language) ? "zh-HK" : "en-GB",
    { month: "long", year: "numeric" }
  );

  const weekdays = isZh(language) ? WEEKDAYS_ZH : WEEKDAYS_EN;

  const filterSidebar = (
    <FilterSidebar
      language={language}
      search={search}
      setSearch={setSearch}
      allTags={allTags}
      activeTag={activeTag}
      setActiveTag={setActiveTag}
      allDistricts={allDistricts}
      activeDistricts={activeDistricts}
      toggleDistrict={toggleDistrict}
      setActiveDistricts={setActiveDistricts}
      districtMode={districtMode}
      setDistrictMode={setDistrictMode}
      activeFilterCount={activeFilterCount}
      resetFilters={resetFilters}
    />
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      {/* Header + view toggle */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            {t("events", language)}
          </h1>
          <p className="text-[#6B6890] text-sm">
            {isZh(language)
              ? "香港 LGBTQ+ 社區活動"
              : "LGBTQ+ events happening in Hong Kong"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile filter button */}
          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E6F0] bg-white text-xs font-medium text-[#6B6890] hover:border-[#A78BFA] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {isZh(language) ? "篩選" : "Filters"}
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#7B68EE] text-white text-[9px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-1 bg-[#F5F4FA] rounded-lg p-1">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                view === "list" ? "bg-white shadow-sm text-[#7B68EE]" : "text-[#6B6890] hover:text-[#7B68EE]"
              }`}
            >
              {isZh(language) ? "列表" : "List"}
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                view === "calendar" ? "bg-white shadow-sm text-[#7B68EE]" : "text-[#6B6890] hover:text-[#7B68EE]"
              }`}
            >
              {isZh(language) ? "日曆" : "Calendar"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-28">{filterSidebar}</div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {view === "list" && (
            <>
              {upcomingEvents.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4 text-xs text-[#6B6890]">
                    <span className="tabular-nums">
                      {upcomingEvents.length} {isZh(language) ? "個活動" : upcomingEvents.length === 1 ? "event" : "events"}
                    </span>
                    <label className="flex items-center gap-2">
                      <span>{isZh(language) ? "顯示" : "Show"}</span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="px-2 py-1 rounded-md border border-[#E8E6F0] bg-white text-xs focus:outline-none focus:border-[#7B68EE]"
                      >
                        {[12, 24, 48, 96].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                        <option value={upcomingEvents.length}>{isZh(language) ? "全部" : "All"}</option>
                      </select>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">
                    {upcomingEvents.slice(0, pageSize).map((event, i) => (
                      <EventCard
                        key={i}
                        event={event}
                        language={language}
                        onClick={() => setSelectedEvent(event)}
                      />
                    ))}
                  </div>
                  {upcomingEvents.length > pageSize && (
                    <div className="text-center mb-12">
                      <button
                        onClick={() => setPageSize((n) => n + 12)}
                        className="px-5 py-2 rounded-full border border-[#E8E6F0] text-sm text-[#6B6890] hover:border-[#A78BFA] hover:text-[#7B68EE] transition-colors"
                      >
                        {isZh(language) ? "載入更多" : "Load more"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState language={language} />
              )}
            </>
          )}

          {view === "calendar" && (
            <div className="mb-12">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCalMonth((prev) => {
                    const d = new Date(prev.year, prev.month - 1);
                    return { year: d.getFullYear(), month: d.getMonth() };
                  })}
                  className="p-2 rounded-lg text-[#6B6890] hover:text-[#7B68EE] hover:bg-[#F0EEFF] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-lg font-bold text-[#1E1B3A]">{monthLabel}</h2>
                <button
                  onClick={() => setCalMonth((prev) => {
                    const d = new Date(prev.year, prev.month + 1);
                    return { year: d.getFullYear(), month: d.getMonth() };
                  })}
                  className="p-2 rounded-lg text-[#6B6890] hover:text-[#7B68EE] hover:bg-[#F0EEFF] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-px mb-1">
                {weekdays.map((d) => (
                  <div key={d} className="text-center text-[10px] uppercase tracking-wider text-[#6B6890] font-semibold py-2">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-px bg-[#E8E6F0] rounded-xl overflow-hidden">
                {calendarDays.map((day, i) => {
                  if (day === null) {
                    return <div key={`empty-${i}`} className="bg-[#FAFAFE] min-h-[80px] md:min-h-[100px]" />;
                  }

                  const dayEvents = eventsOnDay(day);
                  const isToday =
                    today.getFullYear() === calMonth.year &&
                    today.getMonth() === calMonth.month &&
                    today.getDate() === day;

                  return (
                    <div
                      key={day}
                      className={`bg-white min-h-[80px] md:min-h-[100px] p-1.5 ${
                        isToday ? "ring-2 ring-inset ring-[#7B68EE]" : ""
                      }`}
                    >
                      <div className={`text-xs font-medium mb-1 ${
                        isToday ? "text-[#7B68EE] font-bold" : "text-[#6B6890]"
                      }`}>
                        {day}
                      </div>
                      {dayEvents.map((ev, j) => {
                        const name = getEventName(ev, language);
                        return (
                          <button
                            key={j}
                            onClick={() => setSelectedEvent(ev)}
                            className="block w-full text-left text-[9px] md:text-[10px] leading-tight bg-gradient-to-r from-[#7B68EE] to-[#E879F9] text-white rounded px-1 py-0.5 mb-0.5 truncate hover:opacity-80 transition-opacity cursor-pointer"
                          >
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Community Organizations */}
          {communityOrgs.length > 0 && (
            <section className="mt-16 mb-8">
              <h2 className="text-2xl font-bold text-[#1E1B3A] mb-1">
                {isZh(language) ? "社區組織" : "Community Organizations"}
              </h2>
              <p className="text-sm text-[#6B6890] mb-6">
                {isZh(language) ? "關注這些組織以了解更多活動" : "Follow these organizations for more events"}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
                {communityOrgs.map((org) => (
                  <a
                    key={org.name}
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className="w-20 h-20 rounded-full bg-white border border-[#E8E6F0] overflow-hidden flex items-center justify-center p-3 group-hover:border-[#A78BFA] group-hover:shadow-md transition-[border-color,box-shadow]">
                      {org.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={org.logo}
                          alt={org.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-[#7B68EE]">
                          {org.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#1E1B3A] text-center group-hover:text-[#7B68EE] transition-colors">
                      {org.name}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Floating Submit Event CTA */}
      <a
        href="https://tally.so/r/9q2zbQ"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#7B68EE] to-[#E879F9] text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-[box-shadow,transform]"
      >
        {isZh(language) ? "提交活動" : "Submit an Event"} →
      </a>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setFilterOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] h-full bg-white overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1E1B3A]">
                {isZh(language) ? "篩選" : "Filters"}
              </h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="p-1 text-[#6B6890] hover:text-[#7B68EE]"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {filterSidebar}
          </div>
        </div>
      )}

      {selectedEvent && (
        <EventPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}

function FilterSidebar({
  language, search, setSearch,
  allTags, activeTag, setActiveTag,
  allDistricts, activeDistricts, toggleDistrict, setActiveDistricts,
  districtMode, setDistrictMode,
  activeFilterCount, resetFilters,
}: {
  language: Language;
  search: string;
  setSearch: (s: string) => void;
  allTags: string[];
  activeTag: string;
  setActiveTag: (t: string) => void;
  allDistricts: string[];
  activeDistricts: string[];
  toggleDistrict: (d: string) => void;
  setActiveDistricts: (d: string[]) => void;
  districtMode: "and" | "or";
  setDistrictMode: (m: "and" | "or") => void;
  activeFilterCount: number;
  resetFilters: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wider font-semibold text-[#6B6890]">
          {isZh(language) ? "篩選" : "Filters"}
        </p>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-[11px] text-[#7B68EE] hover:underline"
          >
            {isZh(language) ? "清除" : "Clear"}
          </button>
        )}
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={isZh(language) ? "搜尋活動..." : "Search events..."}
        className="w-full px-3 py-2 rounded-lg border border-[#E8E6F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE]"
      />

      {allTags.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[#6B6890] mb-2">
            {isZh(language) ? "標籤" : "Tag"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTag("")}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                !activeTag ? "bg-[#7B68EE] text-white border-[#7B68EE]" : "bg-white border-[#E8E6F0] text-[#6B6890] hover:border-[#A78BFA]"
              }`}
            >
              {isZh(language) ? "全部" : "All"}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  activeTag === tag ? "bg-[#7B68EE] text-white border-[#7B68EE]" : "bg-white border-[#E8E6F0] text-[#6B6890] hover:border-[#A78BFA]"
                }`}
              >
                {translateTag(tag, language)}
              </button>
            ))}
          </div>
        </div>
      )}

      {allDistricts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#6B6890]">
              {isZh(language) ? "地區" : "District"}
            </p>
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
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveDistricts([])}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                activeDistricts.length === 0 ? "bg-[#7B68EE] text-white border-[#7B68EE]" : "bg-white border-[#E8E6F0] text-[#6B6890] hover:border-[#A78BFA]"
              }`}
            >
              {isZh(language) ? "全部" : "All"}
            </button>
            {allDistricts.map((d) => {
              const active = activeDistricts.includes(d);
              return (
                <button
                  key={d}
                  onClick={() => toggleDistrict(d)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    active ? "bg-[#7B68EE] text-white border-[#7B68EE]" : "bg-white border-[#E8E6F0] text-[#6B6890] hover:border-[#A78BFA]"
                  }`}
                >
                  {isZh(language) ? translateDistrict(d, language) : d}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <a
        href="webcal://prism.lgbt/events.ics"
        className="block text-center px-3 py-2 rounded-lg border border-[#E8E6F0] text-xs font-medium text-[#6B6890] hover:border-[#A78BFA] hover:text-[#7B68EE] transition-colors"
        title={isZh(language) ? "訂閱以在你的日曆中看到所有 PRISM 活動" : "Subscribe to see all PRISM events in your calendar"}
      >
        📅 {isZh(language) ? "訂閱日曆" : "Subscribe to Calendar"}
      </a>
    </div>
  );
}

function EventCard({
  event,
  language,
  onClick,
}: {
  event: PrismEvent;
  language: Language;
  onClick: () => void;
}) {
  const name = getEventName(event, language);
  const org = getEventOrg(event, language);
  const description = getEventDescription(event, language);
  const venue = getEventVenue(event, language);
  const eventDate = parseDate(event.date);

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#E8E6F0] rounded-2xl overflow-hidden hover:border-[#A78BFA] hover:shadow-md transition-[border-color,box-shadow] cursor-pointer flex flex-col"
    >
      {/* Image */}
      <div className="aspect-[16/10] bg-[#F5F4FA] flex items-center justify-center text-[11px] text-[#A29FB8] overflow-hidden">
        {event.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover opacity-0 transition-opacity duration-300"
            onLoad={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "1"; }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <span>{isZh(language) ? "活動 / 組織圖片" : "event / organization image"}</span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-base font-bold text-[#1E1B3A] line-clamp-2">{name}</h2>
        {org && (
          <p className="text-sm text-[#7B68EE] font-medium mt-0.5">
            {isZh(language) ? "主辦：" : "by "}{org}
          </p>
        )}
        {description && (
          <p className="text-xs text-[#6B6890] mt-2 whitespace-pre-line line-clamp-3">{description}</p>
        )}

        <div className="mt-3 space-y-1.5 text-xs text-[#6B6890]">
          {eventDate && (
            <div className="flex items-center gap-1.5">
              <span aria-hidden>🕐</span>
              <span>
                {formatShortDate(eventDate, language)}
                {event.start_time && ` ${formatTime(event.start_time)}`}
                {event.end_time && ` – ${formatTime(event.end_time)}`}
              </span>
            </div>
          )}
          {(venue || event.district) && (
            <div className="flex items-start gap-1.5">
              <span aria-hidden>📍</span>
              <span className="line-clamp-1">{venue || event.district}</span>
            </div>
          )}
        </div>

        {event.price && (
          <div className="mt-3">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${priceBadgeClasses(event.price)}`}>
              {event.price}
            </span>
          </div>
        )}

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#F0EEF8]">
            {event.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-[#F5F4FA] text-[#6B6890]">
                {translateTag(tag, language)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ language }: { language: Language }) {
  return (
    <div className="bg-gradient-to-br from-[#F3F0FF] to-[#FCE4EC] rounded-2xl p-8 text-center mb-16">
      <div className="text-4xl mb-3">📅</div>
      <h3 className="font-bold text-lg text-[#1E1B3A] mb-1">
        {isZh(language) ? "暫無活動" : "No upcoming events"}
      </h3>
      <p className="text-sm text-[#6B6890] max-w-md mx-auto">
        {isZh(language)
          ? "請稍後再來或提交你的活動！"
          : "Check back soon or submit your own event!"}
      </p>
    </div>
  );
}
