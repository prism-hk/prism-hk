"use client";

import { useState, useEffect, useCallback } from "react";
import { CATEGORIES, getCategoryName } from "@/lib/categories";
import { useLanguage } from "@/lib/LanguageContext";
import { bilingualText, t, isZh } from "@/lib/i18n";

type FilterBarProps = {
  categories: string[];
  districts: string[];
  onFilter: (filters: {
    search: string;
    category: string;
    district: string;
  }) => void;
  initialCategory?: string;
  initialSearch?: string;
  initialDistrict?: string;
};

export default function FilterBar({
  categories,
  districts,
  onFilter,
  initialCategory = "",
  initialSearch = "",
  initialDistrict = "",
}: FilterBarProps) {
  const { language } = useLanguage();
  const [search, setSearch] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeDistrict, setActiveDistrict] = useState(initialDistrict);
  const [showDistricts, setShowDistricts] = useState(false);

  const notify = useCallback(
    (s: string, cat: string, dist: string) => {
      onFilter({ search: s, category: cat, district: dist });
    },
    [onFilter]
  );

  useEffect(() => {
    notify(search, activeCategory, activeDistrict);
  }, [search, activeCategory, activeDistrict, notify]);

  // Build pill list: "All" + each category from CATEGORIES that exists in the provided categories list
  const pills = [
    { id: "", en: "All", zh: "全部", zhHans: "全部" },
    ...CATEGORIES.filter((c) => categories.includes(c.id)).map((c) => ({
      id: c.id,
      en: c.en,
      zh: c.zh,
      zhHans: c.zhHans,
    })),
  ];

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6890]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search", language)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E6F0] rounded-xl text-sm text-[#1E1B3A] placeholder-[#6B6890] focus:outline-none focus:border-[#7B68EE] focus:ring-1 focus:ring-[#7B68EE] transition-colors"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {pills.map((pill) => {
          const isActive = activeCategory === pill.id;
          const label = language === "zh-Hans" ? pill.zhHans : bilingualText(pill.en, pill.zh, language);

          return (
            <button
              key={pill.id}
              onClick={() => setActiveCategory(pill.id)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                isActive
                  ? "pill-active"
                  : "bg-white border-[#E8E6F0] text-[#6B6890] hover:border-[#A78BFA] hover:text-[#7B68EE]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* District filter */}
      {districts.length > 0 && (
        <div>
          <button
            onClick={() => setShowDistricts(!showDistricts)}
            className="flex items-center gap-2 text-sm font-medium text-[#6B6890] hover:text-[#7B68EE] transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showDistricts ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {activeDistrict
              ? `District: ${activeDistrict}`
              : language === "zh-Hans"
                ? "筛选地区"
                : language === "zh"
                  ? "篩選地區"
                  : "Filter by District"}
            {activeDistrict && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDistrict("");
                }}
                className="ml-1 text-xs bg-[#F0EEFF] text-[#7B68EE] rounded-full px-1.5 py-0.5 hover:bg-[#E0DDFF] cursor-pointer"
              >
                ✕
              </span>
            )}
          </button>

          {showDistricts && (
            <div className="mt-2 flex flex-wrap gap-2">
              {districts.map((district) => {
                const isActive = activeDistrict === district;
                return (
                  <button
                    key={district}
                    onClick={() => {
                      setActiveDistrict(isActive ? "" : district);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      isActive
                        ? "bg-[#7B68EE] text-white border-[#7B68EE]"
                        : "bg-white border-[#E8E6F0] text-[#6B6890] hover:border-[#A78BFA] hover:text-[#7B68EE]"
                    }`}
                  >
                    {district}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
