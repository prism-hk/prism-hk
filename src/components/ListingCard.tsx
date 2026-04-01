"use client";

import type { Listing } from "@/lib/supabase";
import { getCategoryInfo, getAvatarColor, getInitials } from "@/lib/categories";
import { useLanguage } from "@/lib/LanguageContext";
import { bilingualText, t, isZh } from "@/lib/i18n";
import { translateTag } from "@/lib/tagTranslations";
import { translateDistrict } from "@/lib/districtTranslations";

export default function ListingCard({ listing, onSelect }: { listing: Listing; onSelect?: (listing: Listing) => void }) {
  const { language } = useLanguage();
  const categoryInfo = getCategoryInfo(listing.category);
  const avatarGradient = getAvatarColor(listing.name_en);
  const initials = getInitials(listing.name_en);

  const name = bilingualText(listing.name_en, listing.name_zh, language);
  const description = bilingualText(
    listing.description_en,
    listing.description_zh,
    language
  );

  return (
    <div
      onClick={() => onSelect?.(listing)}
      className="listing-card block bg-white border border-[#E8E6F0] rounded-xl p-4 transition-all duration-200 cursor-pointer"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className={`w-12 h-12 min-w-[48px] rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-semibold text-sm`}
        >
          {initials}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#1E1B3A] text-sm leading-snug whitespace-pre-line">
            {name}
          </h3>
          {description && (
            <p className="text-[#6B6890] text-xs mt-1 line-clamp-2 whitespace-pre-line">
              {description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${categoryInfo.gradient} text-white`}
            >
              {categoryInfo.emoji}{" "}
              {language === "zh-Hans"
                ? (categoryInfo.zhHans || categoryInfo.zh)
                : language === "zh"
                  ? categoryInfo.zh
                  : categoryInfo.en}
            </span>
            {listing.district_en && (
              <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F0EEFF] text-[#7B68EE]">
                {isZh(language)
                  ? translateDistrict(listing.district_en, language)
                  : listing.district_en}
              </span>
            )}
            {listing.price && (
              <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                {isZh(language) && listing.price === "Free" ? "免費" : listing.price}
              </span>
            )}
            {listing.verified && (
              <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                {t("verified", language)} ✓
              </span>
            )}
          </div>
          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {listing.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-[#F5F4FA] text-[#6B6890]"
                >
                  {translateTag(tag, language)}
                </span>
              ))}
            </div>
          )}

          {/* Contact Icons */}
          <div className="flex items-center gap-2.5 mt-2.5">
            {listing.website && (
              <ContactIcon
                href={listing.website}
                label="Website"
                icon={
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                }
              />
            )}
            {listing.instagram && (
              <ContactIcon
                href={listing.instagram.startsWith("http") ? listing.instagram : listing.instagram.includes("instagram.com") ? `https://${listing.instagram}` : `https://instagram.com/${listing.instagram.replace(/^@/, "")}`}
                label="Instagram"
                icon={
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                }
              />
            )}
            {listing.facebook && (
              <ContactIcon
                href={listing.facebook}
                label="Facebook"
                icon={
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                }
              />
            )}
            {listing.phone && (
              <ContactIcon
                href={`tel:${listing.phone}`}
                label="Phone"
                icon={
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                }
              />
            )}
            {listing.email && (
              <ContactIcon
                href={`mailto:${listing.email}`}
                label="Email"
                icon={
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactIcon({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className="text-[#6B6890] hover:text-[#7B68EE] transition-colors"
    >
      {icon}
    </a>
  );
}
