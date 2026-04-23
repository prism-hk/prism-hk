"use client";

import { useEffect } from "react";
import { type Listing } from "@/lib/supabase";
import { type PrismEvent } from "@/lib/events";
import { getCategoryInfo } from "@/lib/categories";
import { useLanguage } from "@/lib/LanguageContext";
import { bilingualText, isZh } from "@/lib/i18n";
import { translateTag } from "@/lib/tagTranslations";
import { translateDistrict } from "@/lib/districtTranslations";

export default function ListingPanel({
  listing,
  events = [],
  onClose,
}: {
  listing: Listing;
  events?: PrismEvent[];
  onClose: () => void;
}) {
  const { language } = useLanguage();
  const categories = listing.category.split(",").map((c) => c.trim()).filter(Boolean);
  const categoryInfos = categories.map((c) => getCategoryInfo(c));
  const categoryInfo = categoryInfos[0];
  const name = bilingualText(listing.name_en, listing.name_zh, language, listing.name_zh_hans);
  const description = bilingualText(
    listing.description_en,
    listing.description_zh,
    language,
    listing.description_zh_hans
  );
  const address = bilingualText(
    listing.address,
    listing.address_zh,
    language,
    listing.address_zh_hans
  );

  // Close on Escape
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
        <div
          className="p-6 pb-8"
          style={{ background: `linear-gradient(135deg, ${categoryInfo.gradient.includes("pink") ? "#F0EEFF" : "#F0FFF8"} 0%, #FAFAFE 100%)` }}
        >
          <div className="pr-10">
            {listing.logo && (
              <img
                src={listing.logo}
                alt={listing.name_en}
                className="w-16 h-16 rounded-xl object-cover bg-white shadow-sm mb-3 outline outline-1 outline-black/5"
              />
            )}
            <h2 className="text-xl font-bold text-[#1E1B3A] leading-snug whitespace-pre-line">
              {name}
            </h2>
            {/* Show both languages if available */}
            {listing.name_zh && !isZh(language) && (
              <p className="text-sm text-[#6B6890] mt-1">{listing.name_zh}</p>
            )}
            {listing.name_en && isZh(language) && (
              <p className="text-sm text-[#6B6890] mt-1">{listing.name_en}</p>
            )}
          </div>

          {/* Category + District pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {categoryInfos.map((catInfo, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r ${catInfo.gradient} text-white`}
              >
                {catInfo.emoji}{" "}
                {language === "zh-Hans"
                  ? (catInfo.zhHans || catInfo.zh)
                  : language === "zh"
                    ? catInfo.zh
                    : catInfo.en}
              </span>
            ))}
            {listing.district_en && (
              <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-[#F0EEFF] text-[#7B68EE]">
                {isZh(language)
                  ? translateDistrict(listing.district_en, language)
                  : listing.district_en}
              </span>
            )}
            {listing.price && (
              <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                {isZh(language) && listing.price === "Free" ? "免費" : listing.price}
              </span>
            )}
            {listing.verified && (
              <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700">
                {isZh(language) ? "已驗證" : "Verified"} ✓
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8">
          {/* Description */}
          {description && (
            <div className="mb-6">
              <p className="text-sm text-[#1E1B3A] leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          {/* Details */}
          <div className="space-y-3 mb-6">
            {address && (
              <DetailRow
                icon={<LocationIcon />}
                label={isZh(language) ? "地址" : "Address"}
                value={address}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              />
            )}
            {listing.hours && (
              <DetailRow
                icon={<ClockIcon />}
                label={isZh(language) ? "營業時間" : "Hours"}
                value={listing.hours}
              />
            )}
            {listing.phone && (
              <DetailRow
                icon={<PhoneIcon />}
                label={isZh(language) ? "電話" : "Phone"}
                value={listing.phone}
                href={`tel:${listing.phone}`}
              />
            )}
            {listing.email && (
              <DetailRow
                icon={<EmailIcon />}
                label={isZh(language) ? "電郵" : "Email"}
                value={listing.email}
                href={`mailto:${listing.email}`}
              />
            )}
            {listing.whatsapp && (
              <DetailRow
                icon={<WhatsAppIcon />}
                label="WhatsApp"
                value={listing.whatsapp}
                href={listing.whatsapp.startsWith("http") ? listing.whatsapp : `https://wa.me/${listing.whatsapp.replace(/\D/g, "")}`}
              />
            )}
          </div>

          {/* Social links — icons */}
          {(listing.instagram || listing.facebook || listing.linkedin) && (
            <div className="flex items-center gap-3 mb-6">
              {listing.instagram && (
                <a
                  href={listing.instagram.startsWith("http") ? listing.instagram : listing.instagram.includes("instagram.com") ? `https://${listing.instagram}` : `https://instagram.com/${listing.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-[#6B6890] hover:text-[#7B68EE] transition-colors p-1.5 -m-1.5"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {listing.facebook && (
                <a
                  href={listing.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-[#6B6890] hover:text-[#7B68EE] transition-colors p-1.5 -m-1.5"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {listing.linkedin && (
                <a
                  href={listing.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-[#6B6890] hover:text-[#7B68EE] transition-colors p-1.5 -m-1.5"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
            </div>
          )}

          {/* Upcoming events hosted by this org */}
          {(() => {
            const today = new Date(new Date().toDateString());
            const orgNames = [listing.name_en, listing.name_zh, listing.name_zh_hans]
              .filter(Boolean)
              .map((n) => (n as string).toLowerCase().trim());
            const upcoming = events
              .filter((e) => {
                const orgMatches = [e.org_en, e.org_zh, e.org_zhHans]
                  .filter(Boolean)
                  .some((o) => orgNames.includes((o as string).toLowerCase().trim()));
                if (!orgMatches) return false;
                const parts = e.date.split("/");
                if (parts.length !== 3) return true;
                const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                return d >= today;
              })
              .slice(0, 4);
            if (upcoming.length === 0) return null;
            return (
              <div className="mb-6">
                <p className="text-xs font-medium text-[#6B6890] mb-2">
                  {isZh(language) ? "即將舉行的活動" : "Upcoming events"}
                </p>
                <div className="space-y-2">
                  {upcoming.map((ev, i) => {
                    const evName = language === "zh-Hans" ? (ev.name_zhHans || ev.name_zh || ev.name_en) : language === "zh" ? (ev.name_zh || ev.name_en) : ev.name_en;
                    return (
                      <a
                        key={i}
                        href="/events"
                        className="flex items-center gap-3 p-2 rounded-lg bg-[#F8F7FF] hover:bg-[#F0EEFF] transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7B68EE] to-[#E879F9] text-white flex flex-col items-center justify-center text-[10px] leading-tight shrink-0">
                          <span className="font-bold text-sm">{ev.date.split("/")[0]}</span>
                          <span className="opacity-80">{ev.date.split("/")[1]}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1E1B3A] truncate">{evName}</p>
                          {ev.start_time && <p className="text-[10px] text-[#6B6890]">{ev.start_time}</p>}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium text-[#6B6890] mb-2">
                {isZh(language) ? "標籤" : "Tags"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {listing.tags.map((tag) => (
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

          {/* Last updated */}
          {listing.last_checked && (
            <p className="text-xs text-[#6B6890]/60 mb-6">
              {isZh(language) ? "最後更新：" : "Last updated: "}{listing.last_checked}
            </p>
          )}

          {/* Visit Website CTA */}
          {listing.website && (
            <a
              href={listing.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#7B68EE] to-[#F5C55A] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-[transform,box-shadow] hover:scale-[1.01] active:scale-[0.96]"
            >
              {isZh(language) ? "訪問網站" : "Visit Website"} →
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

function DetailRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
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

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs font-medium text-[#7B68EE] hover:text-[#6B5CE7] transition-colors"
    >
      {label} →
    </a>
  );
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

function EmailIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
