"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { CATEGORIES } from "@/lib/categories";
import { isZh } from "@/lib/i18n";

const IDENTITIES = {
  en: [
    { value: "individual", label: "an LGBTQ+ individual" },
    { value: "ally", label: "an ally" },
    { value: "business", label: "a business owner" },
    { value: "healthcare", label: "a healthcare provider" },
    { value: "researcher", label: "a researcher" },
  ],
  zh: [
    { value: "individual", label: "LGBTQ+ 人士" },
    { value: "ally", label: "盟友" },
    { value: "business", label: "商戶經營者" },
    { value: "healthcare", label: "醫療服務提供者" },
    { value: "researcher", label: "研究人員" },
  ],
  "zh-Hans": [
    { value: "individual", label: "LGBTQ+ 人士" },
    { value: "ally", label: "盟友" },
    { value: "parent", label: "家长/家人" },
    { value: "business", label: "雇主/同事" },
    { value: "educator", label: "教育工作者" },
    { value: "healthcare", label: "医疗提供者" },
    { value: "researcher", label: "研究人员/记者" },
  ],
};

const NEEDS = {
  en: [
    { value: "Business", label: "friendly businesses" },
    { value: "Community", label: "community groups" },
    { value: "Healthcare", label: "healthcare" },
    { value: "NGO", label: "legal support" },
    { value: "events", label: "events" },
    { value: "all", label: "everything" },
  ],
  zh: [
    { value: "Business", label: "友善商戶" },
    { value: "Community", label: "社區組織" },
    { value: "Healthcare", label: "醫療服務" },
    { value: "NGO", label: "法律支援" },
    { value: "events", label: "活動" },
    { value: "all", label: "全部" },
  ],
  "zh-Hans": [
    { value: "all", label: "全部" },
    { value: "Community", label: "社区" },
    { value: "Healthcare", label: "医疗" },
    { value: "NGO", label: "法律权利" },
    { value: "mental-health", label: "心理健康" },
    { value: "events", label: "活动" },
    { value: "Business", label: "职场资源" },
  ],
};

export default function SmartDispatcher() {
  const { language } = useLanguage();
  const router = useRouter();
  const [identity, setIdentity] = useState("individual");
  const [need, setNeed] = useState("all");

  const lang = isZh(language) ? (language === "zh-Hans" ? "zh-Hans" : "zh") : "en";
  const identities = IDENTITIES[lang];
  const needs = NEEDS[lang];

  const iAmLabel = isZh(language) ? "我是" : "I am";
  const lookingForLabel = language === "zh-Hans" ? "，想寻找" : language === "zh" ? "，想尋找" : " looking for ";
  const exploreLabel = isZh(language) ? "探索" : "Explore";

  function handleExplore() {
    if (need === "events") {
      router.push("/events");
      return;
    }

    const params = new URLSearchParams();
    if (need !== "all") {
      params.set("category", need);
    }

    const query = params.toString();
    router.push(`/directory${query ? `?${query}` : ""}`);
  }

  return (
    <div className="relative z-20 max-w-2xl mx-auto px-4 -mt-8">
      <div className="bg-white rounded-2xl shadow-lg border border-[#E8E6F0] p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap text-[#1E1B3A]">
          {/* "I am" */}
          <span className="text-sm font-medium whitespace-nowrap">{iAmLabel}</span>

          {/* Identity dropdown */}
          <select
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            className="rounded-lg border border-[#E8E6F0] bg-[#FAFAFF] px-3 py-2 text-sm font-medium text-[#7B68EE] focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] cursor-pointer"
          >
            {identities.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* "looking for" */}
          <span className="text-sm font-medium whitespace-nowrap">{lookingForLabel}</span>

          {/* Need dropdown */}
          <select
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            className="rounded-lg border border-[#E8E6F0] bg-[#FAFAFF] px-3 py-2 text-sm font-medium text-[#7B68EE] focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] cursor-pointer"
          >
            {needs.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Explore button */}
        <div className="mt-5 text-center sm:text-left">
          <button
            onClick={handleExplore}
            className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#7B68EE] to-[#E879F9] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {exploreLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
