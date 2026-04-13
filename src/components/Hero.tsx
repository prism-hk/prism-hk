"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { isZh } from "@/lib/i18n";

type HeroProps = {
  listingsCount: number;
  categoriesCount: number;
  districtsCount: number;
};

const CYCLING_TAGS = [
  { en: "lgbtq-friendly", zh: "LGBTQ+ 友善" },
  { en: "community", zh: "社區" },
  { en: "healthcare", zh: "醫療" },
  { en: "social", zh: "社交" },
  { en: "professional", zh: "專業" },
  { en: "education", zh: "教育" },
  { en: "entertainment", zh: "娛樂" },
  { en: "mental-health", zh: "精神健康" },
  { en: "arts", zh: "藝術" },
  { en: "volunteering", zh: "義工" },
];

export default function Hero({
  listingsCount,
  categoriesCount,
  districtsCount,
}: HeroProps) {
  const { language } = useLanguage();
  const [tagIndex, setTagIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTagIndex((prev) => (prev + 1) % CYCLING_TAGS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-28 pb-8 bg-[#FAFAFE]">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
          {/* Left — text */}
          <div className="flex-1 pt-2">
            <p className="text-sm font-semibold text-[#7B68EE] tracking-wide mb-2">
              Find Your Wavelength
            </p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-[#1E1B3A]">
              {isZh(language)
                ? "探索香港 LGBTQ+ 資源與活動"
                : "Explore LGBTQ+ resources and events"}
            </h1>
          </div>

          {/* Right — cycling tag pills */}
          <div className="flex-shrink-0 hidden md:flex items-center gap-2 pt-8 flex-wrap max-w-[300px]">
            {CYCLING_TAGS.slice(0, 8).map((tag, i) => (
              <span
                key={tag.en}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-700 ${
                  i === tagIndex % 8
                    ? "bg-[#7B68EE] text-white border-[#7B68EE] shadow-md shadow-[#7B68EE]/20"
                    : "bg-white text-[#6B6890] border-[#E8E6F0]"
                }`}
              >
                {isZh(language) ? tag.zh : tag.en}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
