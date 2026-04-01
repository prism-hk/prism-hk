"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { useAccessibility } from "@/lib/AccessibilityContext";
import type { Language } from "@/lib/i18n";

const langOptions: { value: Language; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "zh", label: "繁中" },
  { value: "zh-Hans", label: "简中" },
];

export default function LangToggle() {
  const { language, setLanguage } = useLanguage();
  const { fontSize, setFontSize, darkMode, setDarkMode } = useAccessibility();

  return (
    <div
      className="fixed top-[6.25rem] right-4 z-40 flex items-center bg-white dark:bg-[#1E1B3A] rounded-full shadow-md border border-[#E8E6F0] dark:border-[#3A3660] overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Font size */}
      <button
        onClick={() => setFontSize("small")}
        className={`px-2 py-1.5 text-[10px] font-medium transition-colors ${
          fontSize === "small" ? "bg-[#7B68EE] text-white" : "text-[#6B6890] hover:text-[#1E1B3A]"
        }`}
        aria-label="Small text"
      >A</button>
      <button
        onClick={() => setFontSize("default")}
        className={`px-2 py-1.5 text-xs font-medium transition-colors ${
          fontSize === "default" ? "bg-[#7B68EE] text-white" : "text-[#6B6890] hover:text-[#1E1B3A]"
        }`}
        aria-label="Default text"
      >A</button>
      <button
        onClick={() => setFontSize("large")}
        className={`px-2 py-1.5 text-sm font-medium transition-colors ${
          fontSize === "large" ? "bg-[#7B68EE] text-white" : "text-[#6B6890] hover:text-[#1E1B3A]"
        }`}
        aria-label="Large text"
      >A</button>

      {/* Divider */}
      <div className="w-px h-5 bg-[#E8E6F0] dark:bg-[#3A3660]" />

      {/* Dark mode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-2 py-1.5 text-xs transition-colors text-[#6B6890] hover:text-[#1E1B3A]"
        aria-label="Toggle dark mode"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-[#E8E6F0] dark:bg-[#3A3660]" />

      {/* Language */}
      {langOptions.map((opt) => (
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
