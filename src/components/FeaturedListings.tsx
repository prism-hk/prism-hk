"use client";

import { useState } from "react";
import { type Listing } from "@/lib/supabase";
import { useLanguage } from "@/lib/LanguageContext";
import ListingCard from "./ListingCard";
import ListingPanel from "./ListingPanel";

const headings = {
  en: { title: "Featured Listings", subtitle: "Verified LGBTQ+-friendly organizations across Hong Kong", empty: "No featured listings yet. Check back soon!" },
  zh: { title: "精選機構", subtitle: "經驗證的香港 LGBTQ+ 友善機構", empty: "暫無精選機構，請稍後再來！" },
  "zh-Hans": { title: "精选机构", subtitle: "经验证的香港 LGBTQ+ 友善机构", empty: "暂无精选机构，请稍后再来！" },
};

export default function FeaturedListings({ listings }: { listings: Listing[] }) {
  const { language } = useLanguage();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const h = language === "zh-Hans" ? headings["zh-Hans"] : language === "zh" ? headings.zh : headings.en;

  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-[#1E1B3A]">
          {h.title}
        </h2>
        <p className="text-[#6B6890] mt-2 text-sm">
          {h.subtitle}
        </p>
      </div>
      {listings.length === 0 ? (
        <div className="bg-[#F8F7FF] rounded-2xl py-12 text-center">
          <img src="/empty-search.png" alt="" className="w-16 h-16 mx-auto mb-4 opacity-60" />
          <p className="text-[#6B6890] text-sm">{h.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onSelect={setSelectedListing} />
          ))}
        </div>
      )}
      {selectedListing && (
        <ListingPanel listing={selectedListing} onClose={() => setSelectedListing(null)} />
      )}
    </>
  );
}
