"use client";

import { useState, useMemo } from "react";
import { type Listing } from "@/lib/supabase";
import { useLanguage } from "@/lib/LanguageContext";
import ListingCard from "@/components/ListingCard";
import ListingPanel from "@/components/ListingPanel";

export default function EmergencyClient({ listings }: { listings: Listing[] }) {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const filtered = useMemo(() => {
    if (!search) return listings;
    const q = search.toLowerCase();
    return listings.filter((listing) => {
      const searchable = [
        listing.name_en, listing.name_zh,
        listing.description_en, listing.description_zh,
        listing.phone,
        ...(listing.tags || []),
      ].filter(Boolean).join(" ").toLowerCase();
      return searchable.includes(q);
    });
  }, [listings, search]);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#DC2626] to-[#B91C1C] text-white rounded-2xl p-6 mb-8">
        <h1 className="text-2xl font-bold mb-1">
          {language === "zh-Hans"
            ? "紧急服务资料库"
            : language === "zh"
              ? "緊急服務目錄"
              : "Emergency Services Directory"}
        </h1>
        <p className="text-sm opacity-80">
          {language === "zh-Hans"
            ? "如果你或身边的人需要即时支援，请联络以下服务。"
            : language === "zh"
              ? "如果你或身邊的人需要即時支援，請聯絡以下服務。"
              : "If you or someone you know needs immediate support, contact these services."}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6890]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={language === "zh-Hans" ? "搜索紧急服务…" : language === "zh" ? "搜索緊急服務..." : "Search emergency services..."}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E6F0] rounded-xl text-sm text-[#1E1B3A] placeholder-[#6B6890] focus:outline-none focus:border-[#7B68EE] focus:ring-1 focus:ring-[#7B68EE]"
        />
      </div>

      {/* Count */}
      <p className="text-xs text-[#6B6890] mb-4">{filtered.length} services</p>

      {/* Listings Grid — same format as directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((listing) => (
          <ListingCard key={listing.id} listing={listing} onSelect={setSelectedListing} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[#6B6890] py-12">No services found.</p>
      )}

      {selectedListing && (
        <ListingPanel listing={selectedListing} onClose={() => setSelectedListing(null)} />
      )}
    </div>
  );
}
