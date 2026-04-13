"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { isZh } from "@/lib/i18n";

type UserType = {
  value: string;
  en: string;
  zh: string;
  zhHans: string;
};

type ServiceType = {
  value: string;
  en: string;
  zh: string;
  zhHans: string;
};

type Route = {
  path: string;
  category?: string;
  tags?: string[];
};

const USER_TYPES: UserType[] = [
  { value: "support", en: "in need of support", zh: "需要支援", zhHans: "需要支援" },
  { value: "student", en: "a student", zh: "學生", zhHans: "学生" },
  { value: "new-to-hk", en: "new to Hong Kong", zh: "新來港人士", zhHans: "新来港人士" },
  { value: "professional", en: "a professional", zh: "專業人士", zhHans: "专业人士" },
  { value: "curious", en: "curious / an ally", zh: "好奇者／盟友", zhHans: "好奇者／盟友" },
  { value: "party", en: "a party-goer", zh: "派對愛好者", zhHans: "派对爱好者" },
  { value: "family", en: "a family person", zh: "家庭人士", zhHans: "家庭人士" },
  { value: "exploring", en: "just exploring", zh: "隨便看看", zhHans: "随便看看" },
];

const SERVICE_TYPES: ServiceType[] = [
  { value: "support-svc", en: "support", zh: "支援", zhHans: "支援" },
  { value: "community", en: "community", zh: "社區", zhHans: "社区" },
  { value: "hangouts", en: "hangouts", zh: "聚會場所", zhHans: "聚会场所" },
  { value: "activities", en: "activities", zh: "活動", zhHans: "活动" },
  { value: "learning", en: "learning", zh: "學習資源", zhHans: "学习资源" },
];

// Routing matrix: [userType][serviceType] → route config
// Based on the Google Sheet "User Type + Service Type" tab (April 2026)
// Tags use OR operator — listings matching ANY tag will show
const ROUTE_MATRIX: Record<string, Record<string, Route | null>> = {
  support: {
    "support-svc": { path: "/directory", tags: ["emergency", "sti-testing"] },
    community: null,
    hangouts: null,
    activities: null,
    learning: { path: "/learn/resources" },
  },
  student: {
    "support-svc": { path: "/directory", category: "Healthcare & Support", tags: ["university", "children-youth"] },
    community: { path: "/directory", category: "Community & Student Group", tags: ["university", "children-youth"] },
    hangouts: { path: "/directory", category: "Businesses", tags: ["cafe", "non-alcoholic", "sports", "hobby", "family-friendly", "children-youth", "pet-friendly"] },
    activities: { path: "/events", tags: ["non-alcoholic", "cafe", "sports", "hobby", "family-friendly", "children-youth", "volunteering", "pet-friendly"] },
    learning: { path: "/learn/resources" },
  },
  "new-to-hk": {
    "support-svc": { path: "/directory", category: "Healthcare & Support" },
    community: { path: "/directory", category: "Community & Student Group", tags: ["social", "english", "multilingual"] },
    hangouts: { path: "/directory", category: "Businesses", tags: ["bar", "cafe", "non-alcoholic", "sports", "hobby", "english", "multilingual"] },
    activities: { path: "/events", tags: ["english", "multilingual"] },
    learning: { path: "/learn/resources" },
  },
  professional: {
    "support-svc": { path: "/directory", category: "Healthcare & Support", tags: ["legal-aid"] },
    community: { path: "/directory", category: "Community & Student Group", tags: ["professional", "volunteering"] },
    hangouts: null,
    activities: { path: "/events", tags: ["professional"] },
    learning: { path: "/learn/resources" },
  },
  curious: {
    "support-svc": null,
    community: { path: "/directory", category: "Community & Student Group" },
    hangouts: { path: "/directory", category: "Businesses", tags: ["cafe", "non-alcoholic", "sports", "hobby", "family-friendly", "children-youth", "pet-friendly"] },
    activities: { path: "/events", tags: ["education"] },
    learning: { path: "/learn/resources" },
  },
  party: {
    "support-svc": { path: "/directory", category: "Healthcare & Support", tags: ["harm-reduction"] },
    community: { path: "/directory", category: "Community & Student Group", tags: ["social"] },
    hangouts: { path: "/directory", category: "Businesses", tags: ["bar", "party", "entertainment"] },
    activities: { path: "/events", tags: ["party", "entertainment"] },
    learning: { path: "/learn/resources", tags: ["harm-reduction"] },
  },
  family: {
    "support-svc": { path: "/directory", category: "Healthcare & Support", tags: ["children-youth", "family-planning"] },
    community: { path: "/directory", category: "Community & Student Group", tags: ["university", "children-youth", "family-friendly", "pet-friendly"] },
    hangouts: { path: "/directory", category: "Businesses", tags: ["cafe", "non-alcoholic", "sports", "hobby", "family-friendly", "children-youth", "pet-friendly"] },
    activities: { path: "/events", tags: ["non-alcoholic", "cafe", "sports", "hobby", "family-friendly", "children-youth", "volunteering", "pet-friendly"] },
    learning: { path: "/learn/resources" },
  },
  exploring: {
    "support-svc": { path: "/directory" },
    community: { path: "/directory" },
    hangouts: { path: "/directory" },
    activities: { path: "/events" },
    learning: { path: "/learn/resources" },
  },
};

export default function SmartDispatcher({ inline }: { inline?: boolean } = {}) {
  const { language } = useLanguage();
  const router = useRouter();
  const [userType, setUserType] = useState("exploring");
  const [serviceType, setServiceType] = useState("community");

  const lang = isZh(language) ? (language === "zh-Hans" ? "zhHans" : "zh") : "en";

  // Filter service types to only show available ones for current user type
  const availableServices = useMemo(() => {
    const matrix = ROUTE_MATRIX[userType] || {};
    return SERVICE_TYPES.filter((s) => {
      return matrix[s.value] !== null && matrix[s.value] !== undefined;
    });
  }, [userType]);

  // Reset service type if current selection is unavailable
  const effectiveService = availableServices.find((s) => s.value === serviceType)
    ? serviceType
    : availableServices[0]?.value || "community";

  const iAmLabel = isZh(language) ? "我是" : "I am";
  const lookingForLabel = language === "zh-Hans" ? "，想寻找" : language === "zh" ? "，想尋找" : " looking for ";
  const exploreLabel = isZh(language) ? "探索" : "Explore";

  function handleExplore() {
    const route = ROUTE_MATRIX[userType]?.[effectiveService] || { path: "/directory" };

    const params = new URLSearchParams();
    if (route.category) {
      params.set("category", route.category);
    }
    if (route.tags && route.tags.length === 1) {
      params.set("tag", route.tags[0]);
    } else if (route.tags && route.tags.length > 1) {
      params.set("tags", route.tags.join(","));
    }

    const query = params.toString();
    router.push(`${route.path}${query ? `?${query}` : ""}`);
  }

  return (
    <div className={inline ? "" : "relative z-20 max-w-5xl mx-auto px-6 -mt-4 mb-8"}>
      <div className={inline ? "" : "max-w-lg"}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap text-[#1E1B3A]">
          {/* "I am" */}
          <span className="text-base font-medium whitespace-nowrap">{iAmLabel}</span>

          {/* User type dropdown */}
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="rounded-lg border border-[#E8E6F0] bg-[#FAFAFF] px-3 py-2 text-base font-medium text-[#7B68EE] focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] cursor-pointer"
          >
            {USER_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt[lang]}
              </option>
            ))}
          </select>

          {/* "looking for" */}
          <span className="text-base font-medium whitespace-nowrap">{lookingForLabel}</span>

          {/* Service type dropdown */}
          <select
            value={effectiveService}
            onChange={(e) => setServiceType(e.target.value)}
            className="rounded-lg border border-[#E8E6F0] bg-[#FAFAFF] px-3 py-2 text-base font-medium text-[#7B68EE] focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] cursor-pointer"
          >
            {availableServices.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt[lang]}
              </option>
            ))}
          </select>
        </div>

        {/* Explore button */}
        <div className="mt-5">
          <button
            onClick={handleExplore}
            className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#7B68EE] to-[#E879F9] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-[transform,box-shadow] hover:scale-[1.02] active:scale-[0.96]"
          >
            {exploreLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
