"use client";

import { useLanguage } from "@/lib/LanguageContext";
import type { Language } from "@/lib/i18n";

const options: { value: Language; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "zh", label: "繁中" },
  { value: "zh-Hans", label: "简中" },
];

export default function LangToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="fixed top-[6.25rem] right-4 z-40 flex bg-white rounded-full shadow-md border border-[#E8E6F0] overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLanguage(opt.value)}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            language === opt.value
              ? "bg-[#7B68EE] text-white"
              : "bg-transparent text-[#6B6890] hover:text-[#1E1B3A]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
