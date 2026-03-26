"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { t, ui, isZh } from "@/lib/i18n";

type HeroProps = {
  listingsCount: number;
  categoriesCount: number;
  districtsCount: number;
};

export default function Hero({
  listingsCount,
  categoriesCount,
  districtsCount,
}: HeroProps) {
  const { language } = useLanguage();

  const stats = [
    {
      value: listingsCount,
      label: t("listings", language),
    },
    {
      value: districtsCount,
      label: t("districts", language),
    },
    {
      value: categoriesCount,
      label: t("categories", language),
    },
    {
      value: "24/7",
      label: isZh(language) ? "全天候" : "Online",
    },
  ];

  return (
    <section className="hero-gradient relative overflow-hidden pt-28 pb-20">
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
        {/* Title */}
        <h1
          className="text-5xl md:text-7xl mb-3"
          style={{ fontFamily: "'This Appeal', sans-serif", letterSpacing: "0.3em", paddingLeft: "0.3em", textShadow: "0 2px 30px rgba(0,0,0,0.3), 0 1px 8px rgba(0,0,0,0.2)" }}
        >
          PRISM
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-white max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-line" style={{ textShadow: "0 1px 12px rgba(0,0,0,0.2)" }}>
          {isZh(language)
            ? (language === "zh-Hans" ? ui["zh-Hans"].heroSubtitle : ui.zh.heroSubtitle)
            : ui.en.heroSubtitle}
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-3xl md:text-4xl font-bold"
                style={{ textShadow: "0 2px 15px rgba(0,0,0,0.25)" }}
              >
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString()
                  : stat.value}
              </div>
              <div className="text-xs md:text-sm uppercase tracking-wider text-white/70 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
