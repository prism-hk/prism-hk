"use client";

import { useState, useMemo } from "react";
import { type Listing } from "@/lib/supabase";
import { type EmergencyService } from "@/lib/emergency";
import FilterBar from "@/components/FilterBar";
import ListingGrid from "@/components/ListingGrid";
import { useLanguage } from "@/lib/LanguageContext";

export default function HealthClient({
  listings,
  districts,
  emergencyServices,
}: {
  listings: Listing[];
  districts: string[];
  emergencyServices: EmergencyService[];
}) {
  const { language } = useLanguage();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    district: "",
  });
  const [showAllEmergency, setShowAllEmergency] = useState(false);

  const filtered = useMemo(() => {
    return listings.filter((listing) => {
      if (filters.category && listing.category !== filters.category) return false;
      if (filters.district && listing.district_en !== filters.district) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const searchable = [
          listing.name_en, listing.name_zh,
          listing.description_en, listing.description_zh,
          listing.district_en, listing.district_zh,
          ...(listing.tags || []),
        ].filter(Boolean).join(" ").toLowerCase();
        return searchable.includes(q);
      }
      return true;
    });
  }, [listings, filters]);

  const displayedEmergency = showAllEmergency
    ? emergencyServices
    : emergencyServices.slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
      {/* Emergency Services Directory */}
      <div className="bg-gradient-to-br from-[#DC2626] to-[#B91C1C] text-white rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-1">
          {language === "zh" ? "緊急服務目錄" : "Emergency Services Directory"}
          {language === "both" && <span className="text-sm font-medium opacity-90 ml-2">緊急服務目錄</span>}
        </h2>
        <p className="text-sm opacity-80 mb-5">
          {language === "zh"
            ? "如果你或身邊的人需要即時支援："
            : "If you or someone you know needs immediate support:"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {displayedEmergency.map((svc) => (
            <div
              key={svc.id}
              className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm leading-tight">{svc.organization}</div>
                  {svc.focus_area && (
                    <div className="text-xs opacity-70 mt-0.5">{svc.focus_area}</div>
                  )}
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-xs opacity-80">
                    {svc.service_hours && (
                      <span>🕐 {svc.service_hours.split("\n")[0]}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {svc.telephone && (
                    <a
                      href={`tel:${svc.telephone}`}
                      className="inline-flex items-center gap-1 bg-white/20 rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-white/30 transition-colors"
                    >
                      📞 {svc.telephone}
                    </a>
                  )}
                  {svc.website && (
                    <a
                      href={svc.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] underline opacity-70 hover:opacity-100"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {emergencyServices.length > 6 && (
          <button
            onClick={() => setShowAllEmergency(!showAllEmergency)}
            className="mt-4 text-sm font-medium opacity-80 hover:opacity-100 underline underline-offset-2 transition-opacity"
          >
            {showAllEmergency
              ? `Show less`
              : `Show all ${emergencyServices.length} services`}
          </button>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-1">
        Health & Support{" "}
        <span className="text-[#6B6890] font-medium text-xl">健康支援</span>
      </h1>
      <p className="text-[#6B6890] text-sm mb-6">
        LGBTQ+-affirming healthcare providers and support organizations
      </p>

      <FilterBar
        categories={["Healthcare", "NGO"]}
        districts={districts}
        onFilter={setFilters}
      />

      <div className="mt-6">
        <ListingGrid listings={filtered} />
      </div>
    </div>
  );
}
