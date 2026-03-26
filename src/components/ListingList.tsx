"use client";

import type { Listing } from "@/lib/supabase";
import { getCategoryInfo } from "@/lib/categories";
import { useLanguage } from "@/lib/LanguageContext";
import { bilingualText, t, isZh } from "@/lib/i18n";
import { translateTag } from "@/lib/tagTranslations";
import { translateDistrict } from "@/lib/districtTranslations";

export default function ListingList({ listings }: { listings: Listing[] }) {
  const { language } = useLanguage();

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[#6B6890] text-lg">
          {t("noResults", language)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {listings.map((listing) => {
        const categoryInfo = getCategoryInfo(listing.category);
        const name = bilingualText(listing.name_en, listing.name_zh, language);
        const description = bilingualText(listing.description_en, listing.description_zh, language);
        const district = listing.district_en
          ? (isZh(language) ? translateDistrict(listing.district_en, language) : listing.district_en)
          : null;

        const hasWebsite = !!listing.website;
        const Wrapper = hasWebsite ? "a" : "div";
        const wrapperProps = hasWebsite
          ? { href: listing.website!, target: "_blank" as const, rel: "noopener noreferrer" }
          : {};

        return (
          <Wrapper
            key={listing.id}
            {...wrapperProps}
            className="flex items-center gap-4 bg-white border border-[#E8E6F0] rounded-xl px-4 py-3 hover:border-[#A78BFA] transition-colors cursor-pointer"
          >
            {/* Category badge */}
            <span
              className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${categoryInfo.gradient} text-sm shrink-0`}
            >
              {categoryInfo.emoji}
            </span>

            {/* Name + description */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[#1E1B3A] truncate whitespace-pre-line">
                {name}
              </div>
              {description && (
                <p className="text-xs text-[#6B6890] truncate">{description}</p>
              )}
            </div>

            {/* Tags */}
            <div className="hidden md:flex flex-wrap gap-1 shrink-0 max-w-[200px]">
              {listing.tags?.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5F4FA] text-[#6B6890]">
                  {translateTag(tag, language)}
                </span>
              ))}
            </div>

            {/* Price */}
            {listing.price && (
              <span className="hidden sm:inline text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 shrink-0">
                {isZh(language) && listing.price === "Free" ? "免費" : listing.price}
              </span>
            )}

            {/* District */}
            {district && (
              <span className="hidden sm:inline text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F0EEFF] text-[#7B68EE] shrink-0">
                {district}
              </span>
            )}

            {/* Arrow */}
            {hasWebsite && (
              <svg className="w-4 h-4 text-[#6B6890] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </Wrapper>
        );
      })}
    </div>
  );
}
