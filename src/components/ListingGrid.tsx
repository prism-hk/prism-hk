"use client";

import type { Listing } from "@/lib/supabase";
import { getCategoryInfo, getCategoryName, CATEGORIES } from "@/lib/categories";
import { useLanguage } from "@/lib/LanguageContext";
import { bilingualText, t } from "@/lib/i18n";
import ListingCard from "./ListingCard";

export default function ListingGrid({ listings, onSelect }: { listings: Listing[]; onSelect?: (listing: Listing) => void }) {
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

  // Group listings by category, preserving CATEGORIES order
  const grouped = new Map<string, Listing[]>();

  // Initialize with known category order (contains match for multi-category listings)
  const placed = new Set<string>();
  for (const cat of CATEGORIES) {
    const items = listings.filter((l) => l.category?.includes(cat.id));
    if (items.length > 0) {
      grouped.set(cat.id, items);
      items.forEach((l) => placed.add(l.id));
    }
  }

  // Add any remaining listings not matched to known categories
  const otherListings = listings.filter((l) => !placed.has(l.id));
  if (otherListings.length > 0) {
    const otherGrouped = new Map<string, Listing[]>();
    for (const l of otherListings) {
      const existing = otherGrouped.get(l.category) || [];
      existing.push(l);
      otherGrouped.set(l.category, existing);
    }
    for (const [cat, items] of otherGrouped) {
      grouped.set(cat, items);
    }
  }

  return (
    <div className="space-y-10">
      {Array.from(grouped.entries()).map(([categoryId, items]) => {
        const info = getCategoryInfo(categoryId);
        const categoryName = getCategoryName(info as any, language);

        return (
          <section key={categoryId}>
            {/* Category Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-2xl">{info.emoji}</span>
              <h2 className="text-lg font-bold text-[#1E1B3A]">
                {categoryName}
              </h2>
              <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-[#F0EEFF] text-[#7B68EE] text-xs font-semibold">
                {items.length}
              </span>
            </div>

            {/* Listing Grid */}
            <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
              {items.map((listing) => (
                <ListingCard key={listing.id} listing={listing} onSelect={onSelect} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
