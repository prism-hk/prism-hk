"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { isZh, t } from "@/lib/i18n";
import { CATEGORIES, getCategoryName } from "@/lib/categories";
import { type PrismEvent } from "@/lib/events";
import { type Listing } from "@/lib/supabase";
import ListingCard from "./ListingCard";
import ListingPanel from "./ListingPanel";
import EventPanel from "./EventPanel";

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
  const parts = time.split(":");
  if (parts.length >= 2) {
    const h = parseInt(parts[0]);
    const m = parts[1];
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  }
  return time;
}

export default function HomeContent({
  categoryStats,
  events = [],
  featured = [],
  listingsCount,
  districtsCount,
  categoriesCount,
}: {
  categoryStats: { category: string; count: number }[];
  events?: PrismEvent[];
  featured?: Listing[];
  listingsCount: number;
  districtsCount: number;
  categoriesCount: number;
}) {
  const { language } = useLanguage();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<PrismEvent | null>(null);

  const today = new Date(new Date().toDateString());
  const upcomingEvents = events
    .filter((e) => {
      const d = parseDate(e.date);
      return !d || d >= today;
    })
    .sort((a, b) => {
      const da = parseDate(a.date);
      const db = parseDate(b.date);
      if (!da) return 1;
      if (!db) return -1;
      return da.getTime() - db.getTime();
    })
    .slice(0, 3);

  return (
    <>
      {/* ── 1. Category Icons ── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {CATEGORIES.map((cat) => {
            const name = getCategoryName(cat, language);
            return (
              <a
                key={cat.id}
                href={`/directory?category=${cat.id}`}
                className="flex flex-col items-center gap-2 group active:scale-[0.98]"
              >
                <div className="w-16 h-16 rounded-full border-2 border-[#1E1B3A]/15 flex items-center justify-center group-hover:border-[#7B68EE] group-hover:scale-105 transition-[transform,border-color]">
                  <img src={cat.icon} alt="" className="w-7 h-7 object-contain" />
                </div>
                <span className="text-xs font-medium text-[#6B6890] group-hover:text-[#7B68EE] transition-colors text-center max-w-[80px]">
                  {name}
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* ── 2. 18 Districts 1 Community ── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1E1B3A]">
            {isZh(language) ? "18 區 1 個社區" : "18 Districts 1 Community"}
          </h2>
          <p className="text-[#6B6890] mt-2 text-sm max-w-lg mx-auto">
            {isZh(language)
              ? "在全港十八區找到 LGBTQ+ 活動與支援 — 就在 PRISM。"
              : "You'll find LGBTQ+ events and support across all 18 districts of Hong Kong — right here at PRISM."}
          </p>
        </div>

        {/* Photo row */}
        <div className="flex justify-center gap-3 md:gap-4 mb-10">
          {["/hero-2.png", "/hero-3.png", "/hero-4.png", "/hero-6.png"].map((src, i) => (
            <div key={i} className="w-[140px] md:w-[180px] h-[100px] md:h-[130px] rounded-2xl overflow-hidden shadow-sm outline outline-1 outline-black/5">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[#6B6890] mb-6">
          {isZh(language)
            ? "全港十八區的 LGBTQ+ 資源與支援。"
            : "LGBTQ+ resources and support in every corner of Hong Kong."}
        </p>

        {/* Stats row */}
        <div className="flex justify-center gap-8 md:gap-16">
          {[
            { value: listingsCount, label: isZh(language) ? "機構" : "Listings", color: "text-[#7B68EE]" },
            { value: districtsCount, label: isZh(language) ? "地區" : "Districts", color: "text-[#E879F9]" },
            { value: categoriesCount, label: isZh(language) ? "類別" : "Categories", color: "text-[#F472B6]" },
            { value: "24/7", label: isZh(language) ? "全天候" : "Online", color: "text-[#7B68EE]" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`text-3xl md:text-4xl font-bold ${stat.color} tabular-nums`}>
                {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
              </div>
              <div className="text-xs uppercase tracking-wider text-[#6B6890] font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Featured Listings ── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1E1B3A]">
            {isZh(language) ? "精選機構" : "Featured Listings"}
          </h2>
          <p className="text-[#6B6890] mt-2 text-sm">
            {isZh(language)
              ? "經驗證的香港 LGBTQ+ 友善機構"
              : "Verified LGBTQ+-friendly organizations across Hong Kong"}
          </p>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onSelect={setSelectedListing} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8E6F0] py-14 text-center">
            <img src="/empty-search.png" alt="" className="w-20 h-20 mx-auto mb-4 object-contain" />
            <p className="text-[#6B6890] text-sm">
              {isZh(language) ? "暫無精選機構，請稍後再來！" : "No featured listings yet. Check back soon!"}
            </p>
          </div>
        )}
      </section>

      {/* ── 4. Upcoming Events ── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1E1B3A]">
            {isZh(language) ? "即將舉行的活動" : "Upcoming Events"}
          </h2>
          <p className="text-[#6B6890] mt-2 text-sm">
            {isZh(language) ? "香港 LGBTQ+ 活動" : "LGBTQ+ events happening in Hong Kong"}
          </p>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map((event, i) => {
              const name = language === "zh-Hans"
                ? (event.name_zhHans || event.name_zh || event.name_en)
                : language === "zh" ? (event.name_zh || event.name_en) : event.name_en;
              const org = language === "zh-Hans"
                ? (event.org_zhHans || event.org_zh || event.org_en)
                : language === "zh" ? (event.org_zh || event.org_en) : event.org_en;
              const eventDate = parseDate(event.date);

              return (
                <div
                  key={i}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white border border-[#E8E6F0] rounded-2xl p-5 hover:border-[#A78BFA] hover:shadow-md transition-[border-color,box-shadow] cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-start gap-4">
                    {eventDate && (
                      <div className="flex-shrink-0 bg-gradient-to-br from-[#7B68EE] to-[#E879F9] text-white rounded-xl px-4 py-3 text-center min-w-[70px]">
                        <div className="text-2xl font-bold tabular-nums">{eventDate.getDate()}</div>
                        <div className="text-[10px] uppercase tracking-wider opacity-80">
                          {eventDate.toLocaleDateString(isZh(language) ? "zh-HK" : "en", { month: "short" })}
                        </div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1E1B3A]">{name}</h3>
                      {org && (
                        <p className="text-sm text-[#7B68EE] font-medium mt-0.5">
                          {isZh(language) ? "主辦：" : "by "}{org}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#6B6890]">
                        {(event.start_time || event.end_time) && (
                          <span>🕐 {formatTime(event.start_time)}{event.end_time ? ` – ${formatTime(event.end_time)}` : ""}</span>
                        )}
                        {event.district && <span>📍 {event.district}</span>}
                        {event.price && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">{event.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/events"
                className="px-5 py-2.5 bg-white border border-[#E8E6F0] text-[#7B68EE] rounded-full font-semibold text-sm hover:border-[#A78BFA] hover:shadow-md transition-[border-color,box-shadow]"
              >
                {isZh(language) ? "查看所有活動" : "View all events"} →
              </Link>
              <a
                href="https://forms.gle/XyjEMGrbT7baWZen7"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-[#7B68EE] to-[#E879F9] text-white rounded-full font-semibold text-sm hover:shadow-lg transition-[box-shadow]"
              >
                {isZh(language) ? "提交活動" : "Submit an Event"} →
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#F3F0FF] to-[#FCE4EC] rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-bold text-lg text-[#1E1B3A] mb-1">
              {isZh(language) ? "即將推出" : "Coming Soon"}
            </h3>
            <p className="text-sm text-[#6B6890] mb-5 max-w-md mx-auto">
              {isZh(language)
                ? "社區活動日曆即將推出。在此期間，歡迎瀏覽以下組織："
                : "Our events calendar is launching soon. In the meantime, check out these community organizations hosting events across Hong Kong."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Hong Kong Pride", url: "https://www.hkpride.net" },
                { name: "Pink Alliance", url: "https://www.pinkalliance.hk" },
                { name: "AIDS Concern", url: "https://aidsconcern.org.hk" },
                { name: "Les Peches", url: "https://www.instagram.com/lespeches.hk" },
                { name: "Out in HK", url: "https://www.outinhk.com" },
              ].map((org) => (
                <a
                  key={org.name}
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/80 backdrop-blur rounded-xl text-sm font-medium text-[#7B68EE] hover:bg-white hover:shadow-md transition-[background-color,box-shadow]"
                >
                  {org.name} →
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── 5. Gradient CTA Banner ── */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-[#7B68EE] via-[#E879F9] to-[#F472B6] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Find Your Wavelength
          </h2>
          <p className="text-sm opacity-90 mb-6">
            {isZh(language) ? "在社交媒體上關注我們！" : "Follow us on socials too!"}
          </p>
          <div className="flex justify-center gap-4">
            <a href="https://www.instagram.com/prism.lgbt.hk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.facebook.com/prism.lgbt.hk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/prism-lgbt" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Slide-out panels */}
      {selectedListing && (
        <ListingPanel listing={selectedListing} onClose={() => setSelectedListing(null)} />
      )}
      {selectedEvent && (
        <EventPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
}
