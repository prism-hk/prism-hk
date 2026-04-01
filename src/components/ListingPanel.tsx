"use client";

import { useEffect } from "react";
import { type Listing } from "@/lib/supabase";
import { getCategoryInfo } from "@/lib/categories";
import { useLanguage } from "@/lib/LanguageContext";
import { bilingualText, isZh } from "@/lib/i18n";
import { translateTag } from "@/lib/tagTranslations";
import { translateDistrict } from "@/lib/districtTranslations";

export default function ListingPanel({
  listing,
  onClose,
}: {
  listing: Listing;
  onClose: () => void;
}) {
  const { language } = useLanguage();
  const categoryInfo = getCategoryInfo(listing.category);
  const name = bilingualText(listing.name_en, listing.name_zh, language);
  const description = bilingualText(
    listing.description_en,
    listing.description_zh,
    language
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
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r ${categoryInfo.gradient} text-white`}
            >
              {categoryInfo.emoji}{" "}
              {language === "zh-Hans"
                ? (categoryInfo.zhHans || categoryInfo.zh)
                : language === "zh"
                  ? categoryInfo.zh
                  : categoryInfo.en}
            </span>
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
            {listing.address && (
              <DetailRow
                icon={<LocationIcon />}
                label={isZh(language) ? "地址" : "Address"}
                value={listing.address}
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

          {/* Social links */}
          {(listing.instagram || listing.facebook || listing.linkedin) && (
            <div className="flex items-center gap-3 mb-6">
              {listing.instagram && (
                <SocialLink
                  href={listing.instagram.startsWith("http") ? listing.instagram : listing.instagram.includes("instagram.com") ? `https://${listing.instagram}` : `https://instagram.com/${listing.instagram.replace(/^@/, "")}`}
                  label="Instagram"
                />
              )}
              {listing.facebook && (
                <SocialLink href={listing.facebook} label="Facebook" />
              )}
              {listing.linkedin && (
                <SocialLink href={listing.linkedin} label="LinkedIn" />
              )}
            </div>
          )}

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

          {/* Visit Website CTA */}
          {listing.website && (
            <a
              href={listing.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#7B68EE] to-[#F5C55A] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
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
