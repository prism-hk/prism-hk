"use client";

import { useState, useMemo } from "react";
import { type EmergencyService } from "@/lib/emergency";
import { useLanguage } from "@/lib/LanguageContext";

export default function EmergencyClient({ services }: { services: EmergencyService[] }) {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return services;
    const q = search.toLowerCase();
    return services.filter((svc) =>
      [svc.organization, svc.focus_area, svc.telephone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [services, search]);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#DC2626] to-[#B91C1C] text-white rounded-2xl p-6 mb-8">
        <h1 className="text-2xl font-bold mb-1">
          {language === "zh" ? "緊急服務目錄" : "Emergency Services Directory"}
          {language === "both" && <span className="text-lg font-medium opacity-90 ml-2">緊急服務目錄</span>}
        </h1>
        <p className="text-sm opacity-80">
          {language === "zh"
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
          placeholder={language === "zh" ? "搜尋緊急服務..." : "Search emergency services..."}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E6F0] rounded-xl text-sm text-[#1E1B3A] placeholder-[#6B6890] focus:outline-none focus:border-[#7B68EE] focus:ring-1 focus:ring-[#7B68EE]"
        />
      </div>

      {/* Count */}
      <p className="text-xs text-[#6B6890] mb-4">{filtered.length} services</p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((svc) => (
          <div
            key={svc.id}
            className="bg-white border border-[#E8E6F0] rounded-xl p-4 hover:border-[#A78BFA] hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-[#1E1B3A] leading-tight">
                  {svc.organization}
                </h3>
                {svc.focus_area && (
                  <p className="text-xs text-[#6B6890] mt-1">{svc.focus_area}</p>
                )}
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-[#6B6890]">
                  {svc.service_hours && (
                    <span className="flex items-center gap-1">
                      <span>🕐</span> {svc.service_hours.split("\n")[0]}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                {svc.telephone && (
                  <a
                    href={`tel:${svc.telephone}`}
                    className="inline-flex items-center gap-1 bg-[#DC2626] text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-[#B91C1C] transition-colors"
                  >
                    📞 {svc.telephone}
                  </a>
                )}
                {svc.website && (
                  <a
                    href={svc.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#7B68EE] hover:underline"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[#6B6890] py-12">No services found.</p>
      )}
    </div>
  );
}
