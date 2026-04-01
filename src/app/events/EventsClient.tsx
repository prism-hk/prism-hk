"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { t, isZh, type Language } from "@/lib/i18n";
import { type PrismEvent } from "@/lib/events";
import { translateTag } from "@/lib/tagTranslations";

const COMMUNITY_ORGS = [
  { name: "Hong Kong Pride", zh: "香港同志遊行", url: "https://www.hkpride.net", emoji: "🏳️‍🌈" },
  { name: "Pink Alliance", zh: "粉紅聯盟", url: "https://www.pinkalliance.hk", emoji: "💖" },
  { name: "AIDS Concern", zh: "關懷愛滋", url: "https://aidsconcern.org.hk", emoji: "❤️" },
  { name: "Les Peches", zh: "Les Peches", url: "https://www.instagram.com/lespeches.hk", emoji: "🍑" },
  { name: "Out in HK", zh: "Out in HK", url: "https://www.outinhk.com", emoji: "🌈" },
];

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  // Handle DD/MM/YYYY format
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const date = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }
  return dateStr;
}

function formatTime(time: string | null): string {
  if (!time) return "";
  // Handle HH:MM:SS format
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

export default function EventsClient({ events = [] }: { events?: PrismEvent[] }) {
  const { language } = useLanguage();

  const upcomingEvents = events.filter((e) => {
    if (!e.date) return true;
    const parts = e.date.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      const eventDate = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
      return eventDate >= new Date(new Date().toDateString());
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          {t("events", language)}
        </h1>
        <p className="text-[#6B6890] text-sm">
          {isZh(language)
            ? "香港 LGBTQ+ 社區活動"
            : "LGBTQ+ events happening in Hong Kong"}
        </p>
      </div>

      {/* Event cards */}
      {upcomingEvents.length > 0 ? (
        <div className="space-y-4 mb-16">
          {upcomingEvents.map((event, i) => {
            const name = isZh(language) && event.name_zh ? event.name_zh : event.name_en;
            const org = isZh(language) && event.org_zh ? event.org_zh : event.org_en;

            return (
              <div
                key={i}
                className="bg-white border border-[#E8E6F0] rounded-2xl p-6 hover:border-[#A78BFA] hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Date badge */}
                  <div className="flex-shrink-0 bg-gradient-to-br from-[#7B68EE] to-[#E879F9] text-white rounded-xl px-4 py-3 text-center min-w-[80px]">
                    {event.date ? (
                      <>
                        <div className="text-2xl font-bold">{event.date.split("/")[0]}</div>
                        <div className="text-xs uppercase tracking-wider opacity-80">
                          {new Date(`2026-${event.date.split("/")[1]}-01`).toLocaleDateString("en", { month: "short" })}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm font-medium">TBD</div>
                    )}
                  </div>

                  {/* Event details */}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-[#1E1B3A]">{name}</h2>
                    {org && (
                      <p className="text-sm text-[#7B68EE] font-medium mt-0.5">
                        {isZh(language) ? "主辦：" : "by "}{org}
                      </p>
                    )}
                    {event.description && (
                      <p className="text-sm text-[#6B6890] mt-2">{event.description}</p>
                    )}

                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-[#6B6890]">
                      {(event.start_time || event.end_time) && (
                        <span className="flex items-center gap-1">
                          🕐 {formatTime(event.start_time)}{event.end_time ? ` – ${formatTime(event.end_time)}` : ""}
                        </span>
                      )}
                      {event.district && (
                        <span className="flex items-center gap-1">📍 {event.district}</span>
                      )}
                      {event.address && (
                        <span className="flex items-center gap-1">{event.address}</span>
                      )}
                      {event.price && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                          {event.price}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5F4FA] text-[#6B6890]">
                            {translateTag(tag, language)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-3 mt-3">
                      {event.link && (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-[#7B68EE] hover:text-[#6B5CE7] transition-colors"
                        >
                          {isZh(language) ? "了解更多" : "Learn more"} →
                        </a>
                      )}
                      {event.instagram && (
                        <a
                          href={event.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-[#6B6890] hover:text-[#7B68EE] transition-colors"
                        >
                          Instagram →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#F3F0FF] to-[#FCE4EC] rounded-2xl p-8 text-center mb-16">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="font-bold text-lg text-[#1E1B3A] mb-1">
            {isZh(language) ? "即將推出" : "No upcoming events"}
          </h3>
          <p className="text-sm text-[#6B6890] max-w-md mx-auto">
            {isZh(language)
              ? "暫時沒有活動。請稍後再來或提交你的活動！"
              : "Check back soon or submit your own event!"}
          </p>
        </div>
      )}

      {/* Submit event CTA */}
      <div className="text-center mb-16">
        <a
          href="https://forms.gle/XyjEMGrbT7baWZen7"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7B68EE] to-[#E879F9] text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all"
        >
          {isZh(language) ? "提交活動" : "Submit an Event"} →
        </a>
      </div>

      {/* Community orgs */}
      <div>
        <h2 className="text-xl font-bold text-[#1E1B3A] mb-1">
          {isZh(language) ? "社區組織" : "Community Organizations"}
        </h2>
        <p className="text-sm text-[#6B6890] mb-6">
          {isZh(language)
            ? "關注以下組織以獲取更多活動資訊"
            : "Follow these organizations for more events"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMMUNITY_ORGS.map((org) => (
            <a
              key={org.name}
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E8E6F0] hover:border-[#A78BFA] hover:shadow-md transition-all"
            >
              <span className="text-2xl">{org.emoji}</span>
              <div>
                <div className="font-semibold text-sm text-[#1E1B3A]">
                  {isZh(language) ? org.zh : org.name}
                </div>
                {isZh(language) && org.name !== org.zh && (
                  <div className="text-xs text-[#6B6890]">{org.name}</div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
