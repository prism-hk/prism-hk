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
    { value: districtsCount, label: t("districts", language) },
    { value: listingsCount, label: t("listings", language) },
    { value: categoriesCount, label: t("categories", language) },
    { value: "24/7", label: isZh(language) ? "全天候" : "Online" },
  ];

  return (
    <section className="relative overflow-hidden pt-28 pb-16 bg-[#FAFAFE]">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
          {/* Left side — text */}
          <div className="flex-1 max-w-lg pt-2">
            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-[1.15] bg-gradient-to-r from-[#7B68EE] via-[#E879F9] to-[#F472B6] bg-clip-text text-transparent">
              Connect, Care,{"\n"}and Celebrate
            </h1>

            <p className="mt-5 text-[#6B6890] text-sm leading-relaxed max-w-sm">
              {isZh(language)
                ? (language === "zh-Hans" ? ui["zh-Hans"].heroSubtitle : ui.zh.heroSubtitle)
                : ui.en.heroSubtitle}
            </p>
          </div>

          {/* Right side — 2x2 stats grid */}
          <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-full md:w-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#E8DFFF]/60 rounded-2xl px-6 py-5 text-center min-w-[120px]"
              >
                <div className="text-3xl font-bold text-[#7B68EE]">
                  {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                </div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-[#6B6890] font-semibold mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
