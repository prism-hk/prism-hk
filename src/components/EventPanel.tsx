"use client";

import { useEffect } from "react";
import { type PrismEvent } from "@/lib/events";
import { useLanguage } from "@/lib/LanguageContext";
import { isZh, type Language } from "@/lib/i18n";
import { translateTag } from "@/lib/tagTranslations";

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

export default function EventPanel({
  event,
  onClose,
}: {
  event: PrismEvent;
  onClose: () => void;
}) {
  const { language } = useLanguage();
  const name = getEventName(event, language);
  const org = getEventOrg(event, language);
  const description = getEventDescription(event, language);
  const venue = getEventVenue(event, language);
  const eventDate = parseDate(event.date);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl animate-[slideIn_250ms_ease-out] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-[#1E1B3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header gradient */}
        <div className="p-6 pb-8 bg-gradient-to-br from-[#F0EEFF] to-[#FCE4EC]">
          <div className="pr-10">
            {/* Date badge */}
            {eventDate && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7B68EE] to-[#E879F9] text-white rounded-xl px-4 py-2 mb-4">
                <span className="text-2xl font-bold tabular-nums">{eventDate.getDate()}</span>
                <div className="text-left leading-tight">
                  <div className="text-xs font-medium opacity-90">
                    {eventDate.toLocaleDateString(isZh(language) ? "zh-HK" : "en", { month: "long" })}
                  </div>
                  <div className="text-[10px] opacity-70">
                    {eventDate.toLocaleDateString(isZh(language) ? "zh-HK" : "en", { weekday: "long", year: "numeric" })}
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-xl font-bold text-[#1E1B3A] leading-snug">
              {name}
            </h2>
            {/* Show alternate language name */}
            {event.name_zh && !isZh(language) && (
              <p className="text-sm text-[#6B6890] mt-1">{event.name_zh}</p>
            )}
            {event.name_en && isZh(language) && name !== event.name_en && (
              <p className="text-sm text-[#6B6890] mt-1">{event.name_en}</p>
            )}
          </div>

          {/* Org + pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {org && (
              <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-[#7B68EE] text-white">
                {org}
              </span>
            )}
            {event.district && (
              <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-[#F0EEFF] text-[#7B68EE]">
                📍 {event.district}
              </span>
            )}
            {event.price && (
              <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                {event.price}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8">
          {/* Description */}
          {description && (
            <div className="mt-6 mb-6">
              <p className="text-sm text-[#1E1B3A] leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          {/* Details */}
          <div className="space-y-3 mb-6">
            {(event.start_time || event.end_time) && (
              <DetailRow
                icon={<ClockIcon />}
                label={isZh(language) ? "時間" : "Time"}
                value={`${formatTime(event.start_time)}${event.end_time ? ` – ${formatTime(event.end_time)}` : ""}`}
              />
            )}
            {venue && (
              <DetailRow
                icon={<LocationIcon />}
                label={isZh(language) ? "場地" : "Venue"}
                value={venue}
              />
            )}
            {event.phone && (
              <DetailRow
                icon={<PhoneIcon />}
                label={isZh(language) ? "電話" : "Phone"}
                value={event.phone}
                href={`tel:${event.phone}`}
              />
            )}
            {event.whatsapp && (
              <DetailRow
                icon={<WhatsAppIcon />}
                label="WhatsApp"
                value={event.whatsapp}
                href={event.whatsapp.startsWith("http") ? event.whatsapp : `https://wa.me/${event.whatsapp.replace(/\D/g, "")}`}
              />
            )}
            {event.email && (
              <DetailRow
                icon={<EmailIcon />}
                label={isZh(language) ? "電郵" : "Email"}
                value={event.email}
                href={`mailto:${event.email}`}
              />
            )}
          </div>

          {/* Social links */}
          {(event.instagram || event.facebook || event.linkedin) && (
            <div className="flex items-center gap-3 mb-6">
              {event.instagram && (
                <a href={event.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#6B6890] hover:text-[#E1306C] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {event.facebook && (
                <a href={event.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#6B6890] hover:text-[#1877F2] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {event.linkedin && (
                <a href={event.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#6B6890] hover:text-[#0A66C2] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
            </div>
          )}

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium text-[#6B6890] mb-2">
                {isZh(language) ? "標籤" : "Tags"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-[#F5F4FA] text-[#6B6890]"
                  >
                    {translateTag(tag, language)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#7B68EE] to-[#E879F9] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-[transform,box-shadow] hover:scale-[1.01] active:scale-[0.96]"
            >
              {isZh(language) ? "了解更多 / 報名" : "Learn More / RSVP"} →
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function DetailRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="text-[#7B68EE] mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-[#6B6890] font-medium">{label}</p>
        <p className="text-sm text-[#1E1B3A] whitespace-pre-line">{value}</p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:bg-[#F8F7FF] rounded-lg p-1 -m-1 transition-colors">
        {content}
      </a>
    );
  }
  return content;
}

function LocationIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
