"use client";

import { useState, useMemo } from "react";
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

const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_ZH = ["日", "一", "二", "三", "四", "五", "六"];

export default function EventsClient({ events = [] }: { events?: PrismEvent[] }) {
  const { language } = useLanguage();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const today = new Date(new Date().toDateString());

  const upcomingEvents = useMemo(() =>
    events.filter((e) => {
      const d = parseDate(e.date);
      return !d || d >= today;
    }).sort((a, b) => {
      const da = parseDate(a.date);
      const db = parseDate(b.date);
      if (!da) return 1;
      if (!db) return -1;
      return da.getTime() - db.getTime();
    }),
    [events]
  );

  // Calendar helpers
  const calendarDays = useMemo(() => {
    const { year, month } = calMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [calMonth]);

  const eventsOnDay = (day: number) => {
    return events.filter((e) => {
      const d = parseDate(e.date);
      return d && d.getFullYear() === calMonth.year && d.getMonth() === calMonth.month && d.getDate() === day;
    });
  };

  const monthLabel = new Date(calMonth.year, calMonth.month).toLocaleDateString(
    isZh(language) ? "zh-HK" : "en-GB",
    { month: "long", year: "numeric" }
  );

  const weekdays = isZh(language) ? WEEKDAYS_ZH : WEEKDAYS_EN;

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
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

      {/* List view */}
      {view === "list" && (
        <>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4 mb-16">
              {upcomingEvents.map((event, i) => (
                <EventCard key={i} event={event} language={language} />
              ))}
            </div>
          ) : (
            <EmptyState language={language} />
          )}
        </>
      )}

      {/* Calendar view */}
      {view === "calendar" && (
        <div className="mb-16">
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

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-px mb-1">
            {weekdays.map((d) => (
              <div key={d} className="text-center text-[10px] uppercase tracking-wider text-[#6B6890] font-semibold py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
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
                      <a
                        key={j}
                        href={ev.link || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-[9px] md:text-[10px] leading-tight bg-gradient-to-r from-[#7B68EE] to-[#E879F9] text-white rounded px-1 py-0.5 mb-0.5 truncate hover:opacity-80 transition-opacity"
                      >
                        {name}
                      </a>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Events for this month listed below calendar */}
          {(() => {
            const monthEvents = events.filter((e) => {
              const d = parseDate(e.date);
              return d && d.getFullYear() === calMonth.year && d.getMonth() === calMonth.month;
            });
            if (monthEvents.length === 0) return null;
            return (
              <div className="mt-8 space-y-3">
                <h3 className="text-sm font-semibold text-[#6B6890]">
                  {isZh(language) ? "本月活動" : "This month"}
                </h3>
                {monthEvents.map((event, i) => (
                  <EventCard key={i} event={event} language={language} compact />
                ))}
              </div>
            );
          })()}
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

function EventCard({ event, language, compact }: { event: PrismEvent; language: Language; compact?: boolean }) {
  const name = getEventName(event, language);
  const org = getEventOrg(event, language);
  const description = getEventDescription(event, language);
  const venue = getEventVenue(event, language);
  const eventDate = parseDate(event.date);

  return (
    <div className={`bg-white border border-[#E8E6F0] rounded-2xl ${compact ? "p-4" : "p-6"} hover:border-[#A78BFA] hover:shadow-md transition-all`}>
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Date badge */}
        {eventDate && (
          <div className={`flex-shrink-0 bg-gradient-to-br from-[#7B68EE] to-[#E879F9] text-white rounded-xl ${compact ? "px-3 py-2" : "px-4 py-3"} text-center min-w-[70px]`}>
            <div className={`${compact ? "text-xl" : "text-2xl"} font-bold`}>{eventDate.getDate()}</div>
            <div className="text-[10px] uppercase tracking-wider opacity-80">
              {eventDate.toLocaleDateString(isZh(language) ? "zh-HK" : "en", { month: "short" })}
            </div>
          </div>
        )}

        {/* Event details */}
        <div className="flex-1 min-w-0">
          <h2 className={`${compact ? "text-sm" : "text-lg"} font-bold text-[#1E1B3A]`}>{name}</h2>
          {org && (
            <p className="text-sm text-[#7B68EE] font-medium mt-0.5">
              {isZh(language) ? "主辦：" : "by "}{org}
            </p>
          )}
          {!compact && description && (
            <p className="text-sm text-[#6B6890] mt-2 whitespace-pre-line line-clamp-4">{description}</p>
          )}

          <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#6B6890]">
            {(event.start_time || event.end_time) && (
              <span className="flex items-center gap-1">
                🕐 {formatTime(event.start_time)}{event.end_time ? ` – ${formatTime(event.end_time)}` : ""}
              </span>
            )}
            {(venue || event.district) && (
              <span className="flex items-center gap-1">
                📍 {venue || event.district}
              </span>
            )}
            {event.price && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                {event.price}
              </span>
            )}
          </div>

          {!compact && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {event.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5F4FA] text-[#6B6890]">
                  {translateTag(tag, language)}
                </span>
              ))}
            </div>
          )}

          {/* Links row */}
          <div className="flex items-center gap-3 mt-2">
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
              <a href={event.instagram} target="_blank" rel="noopener noreferrer" className="text-[#6B6890] hover:text-[#E1306C] transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            )}
            {event.facebook && (
              <a href={event.facebook} target="_blank" rel="noopener noreferrer" className="text-[#6B6890] hover:text-[#1877F2] transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
          </div>
        </div>
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
