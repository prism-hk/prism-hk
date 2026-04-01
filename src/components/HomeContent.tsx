"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { isZh, t } from "@/lib/i18n";
import { CATEGORIES, getCategoryName } from "@/lib/categories";
import { type PrismEvent } from "@/lib/events";
import { translateTag } from "@/lib/tagTranslations";

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
}: {
  categoryStats: { category: string; count: number }[];
  events?: PrismEvent[];
}) {
  const { language } = useLanguage();

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
      {/* Upcoming Events */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="text-center mb-10">
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
              const name = isZh(language) && event.name_zh ? event.name_zh : event.name_en;
              const org = isZh(language) && event.org_zh ? event.org_zh : event.org_en;
              const eventDate = parseDate(event.date);

              return (
                <div
                  key={i}
                  className="bg-white border border-[#E8E6F0] rounded-2xl p-5 hover:border-[#A78BFA] hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Date badge */}
                    {eventDate && (
                      <div className="flex-shrink-0 bg-gradient-to-br from-[#7B68EE] to-[#E879F9] text-white rounded-xl px-4 py-3 text-center min-w-[70px]">
                        <div className="text-2xl font-bold tabular-nums">{eventDate.getDate()}</div>
                        <div className="text-[10px] uppercase tracking-wider opacity-80">
                          {eventDate.toLocaleDateString("en", { month: "short" })}
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
                      {event.description && (
                        <p className="text-sm text-[#6B6890] mt-1">{event.description}</p>
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
                      {event.link && (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sm font-medium text-[#7B68EE] hover:text-[#6B5CE7] mt-2 transition-colors"
                        >
                          {isZh(language) ? "了解更多" : "Learn more"} →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* See all + submit */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/events"
                className="px-5 py-2.5 bg-white border border-[#E8E6F0] text-[#7B68EE] rounded-full font-semibold text-sm hover:border-[#A78BFA] hover:shadow-md transition-all"
              >
                {isZh(language) ? "查看所有活動" : "View all events"} →
              </Link>
              <a
                href="https://forms.gle/XyjEMGrbT7baWZen7"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-[#7B68EE] to-[#E879F9] text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all"
              >
                {isZh(language) ? "提交活動" : "Submit an Event"} →
              </a>
            </div>
          </div>
        ) : (
          /* Fallback: Coming Soon */
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
                  className="px-4 py-2 bg-white/80 backdrop-blur rounded-xl text-sm font-medium text-[#7B68EE] hover:bg-white hover:shadow-md transition-all"
                >
                  {org.name} →
                </a>
              ))}
            </div>
            <div className="mt-6">
              <a
                href="https://forms.gle/XyjEMGrbT7baWZen7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B68EE] text-white rounded-xl font-semibold text-sm hover:bg-[#6B5CE7] transition-colors"
              >
                {isZh(language) ? "提交活動" : "Submit an Event"} →
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Browse by Category */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#1E1B3A]">
            {isZh(language) ? "按類別瀏覽" : "Browse by Category"}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const stat = categoryStats.find((s) => s.category === cat.id || s.category.includes(cat.id) || cat.id.includes(s.category));
            const count = stat?.count || categoryStats.filter((s) => s.category.includes(cat.id) || cat.id.includes(s.category)).reduce((sum, s) => sum + s.count, 0);
            const name = getCategoryName(cat, language);
            return (
              <a
                key={cat.id}
                href={`/directory?category=${cat.id}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E8E6F0] hover:border-[#A78BFA] hover:shadow-md transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-lg`}
                >
                  {cat.emoji}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#1E1B3A]">
                    {name}
                  </div>
                  {count > 0 ? (
                    <div className="text-xs text-[#6B6890] tabular-nums">
                      {count}
                    </div>
                  ) : null}
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
