"use client";

import SmartDispatcher from "./SmartDispatcher";
import { useLanguage } from "@/lib/LanguageContext";
import { isZh } from "@/lib/i18n";

type HeroProps = {
  listingsCount: number;
  categoriesCount: number;
  districtsCount: number;
};

export default function Hero({}: HeroProps) {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-28 pb-4 bg-[#FAFAFE]">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
          {/* Left — text + SmartDispatcher */}
          <div className="flex-1 pt-4 md:pt-8">
            <p className="text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-[#7B68EE] via-[#E879F9] to-[#F5C55A] bg-clip-text text-transparent">
              Find Your Wavelength
            </p>
            <h1 className="text-3xl md:text-[2.8rem] font-bold leading-[1.15] text-[#1E1B3A] mb-8">
              {isZh(language)
                ? "探索香港 LGBTQ+ 資源與活動。"
                : "Explore LGBTQ+ resources and events."}
            </h1>

            {/* SmartDispatcher integrated into hero */}
            <SmartDispatcher inline />
          </div>

          {/* Right — photo collage (exported from Figma) */}
          <div className="flex-shrink-0 hidden md:block">
            <img src="/hero-collage.png" alt="" className="w-[380px] h-auto object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
