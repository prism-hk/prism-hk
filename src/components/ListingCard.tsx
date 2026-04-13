"use client";

import type { Listing } from "@/lib/supabase";
import { getCategoryInfo, getAvatarColor, getInitials } from "@/lib/categories";
import { useLanguage } from "@/lib/LanguageContext";
import { bilingualText, t, isZh } from "@/lib/i18n";
import { translateTag } from "@/lib/tagTranslations";
import { translateDistrict } from "@/lib/districtTranslations";

export default function ListingCard({ listing, onSelect }: { listing: Listing; onSelect?: (listing: Listing) => void }) {
  const { language } = useLanguage();
  const categories = listing.category.split(",").map((c) => c.trim()).filter(Boolean);
  const categoryInfos = categories.map((c) => getCategoryInfo(c));
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
        {/* Avatar / Logo */}
        {listing.logo ? (
          <img
            src={listing.logo}
            alt={listing.name_en}
            className="w-12 h-12 min-w-[48px] rounded-xl object-cover bg-[#F5F4FA]"
            onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling?.classList.remove("hidden"); }}
          />
        ) : null}
        <div
          className={`w-12 h-12 min-w-[48px] rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-semibold text-sm ${listing.logo ? "hidden" : ""}`}
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
            {categoryInfos.map((catInfo, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${catInfo.gradient} text-white`}
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
            {listing.whatsapp && (
              <ContactIcon
                href={listing.whatsapp.startsWith("http") ? listing.whatsapp : `https://wa.me/${listing.whatsapp.replace(/\D/g, "")}`}
                label="WhatsApp"
                icon={
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
