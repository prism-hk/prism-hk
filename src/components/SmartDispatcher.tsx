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
  { value: "everything", en: "everything", zh: "全部", zhHans: "全部" },
  { value: "community", en: "community", zh: "社區", zhHans: "社区" },
  { value: "hangouts", en: "hangouts", zh: "聚會場所", zhHans: "聚会场所" },
  { value: "activities", en: "activities", zh: "活動", zhHans: "活动" },
  { value: "learning", en: "learning", zh: "學習資源", zhHans: "学习资源" },
  { value: "jobs", en: "jobs", zh: "工作機會", zhHans: "工作机会" },
];

// Routing matrix: [userType][serviceType] → route config
// Based on the Google Sheet "User Type + Service Type" tab
const ROUTE_MATRIX: Record<string, Record<string, Route | null>> = {
  support: {
    everything: { path: "/directory", tags: ["emergency-services", "sti-testing"] },
    community: null,
    hangouts: null,
    activities: null,
    learning: { path: "/learn/resources" },
    jobs: null,
  },
  student: {
    everything: { path: "/directory" },
    community: { path: "/directory", category: "Community & Student Group", tags: ["university", "high-school"] },
    hangouts: { path: "/directory", category: "Businesses", tags: ["cafe", "non-alcoholic", "sports", "hobby", "family-friendly", "youth"] },
    activities: { path: "/events" },
    learning: { path: "/learn/resources" },
    jobs: { path: "/directory", tags: ["internship"] },
  },
  "new-to-hk": {
    everything: { path: "/directory" },
    community: { path: "/directory", category: "Community & Student Group", tags: ["social", "english", "multilingual"] },
    hangouts: { path: "/directory", category: "Businesses", tags: ["bar", "cafe", "non-alcoholic", "sports", "hobby"] },
    activities: { path: "/events" },
    learning: { path: "/learn/resources" },
    jobs: null,
  },
  professional: {
    everything: { path: "/directory" },
    community: { path: "/directory", category: "Community & Student Group", tags: ["employee-resource-group", "professional-networking", "volunteering"] },
    hangouts: null,
    activities: { path: "/directory", tags: ["volunteering", "professional-networking"] },
    learning: { path: "/learn/resources" },
    jobs: { path: "/directory", tags: ["jobs"] },
  },
  curious: {
    everything: { path: "/directory" },
    community: { path: "/directory", category: "Community & Student Group" },
    hangouts: { path: "/directory", category: "Businesses", tags: ["cafe", "non-alcoholic", "sports", "hobby", "family-friendly"] },
    activities: { path: "/directory", tags: ["education"] },
    learning: { path: "/learn/resources" },
    jobs: null,
  },
  party: {
    everything: { path: "/directory" },
    community: { path: "/directory", category: "Community & Student Group", tags: ["social"] },
    hangouts: { path: "/directory", category: "Businesses", tags: ["bar", "party", "entertainment"] },
    activities: { path: "/events" },
    learning: { path: "/learn/resources" },
    jobs: null,
  },
  family: {
    everything: { path: "/directory" },
    community: { path: "/directory", category: "Community & Student Group", tags: ["family-friendly", "pet-friendly"] },
    hangouts: { path: "/directory", category: "Businesses", tags: ["cafe", "non-alcoholic", "sports", "hobby", "family-friendly", "children", "youth", "pet-friendly"] },
    activities: { path: "/directory", tags: ["family-friendly", "pet-friendly", "volunteering"] },
    learning: { path: "/learn/resources" },
    jobs: null,
  },
  exploring: {
    everything: { path: "/directory" },
    community: { path: "/directory" },
    hangouts: { path: "/directory" },
    activities: { path: "/directory" },
    learning: { path: "/directory" },
    jobs: { path: "/directory" },
  },
};

export default function SmartDispatcher() {
  const { language } = useLanguage();
  const router = useRouter();
  const [userType, setUserType] = useState("exploring");
  const [serviceType, setServiceType] = useState("everything");

  const lang = isZh(language) ? (language === "zh-Hans" ? "zhHans" : "zh") : "en";

  // Filter service types to only show available ones for current user type
  const availableServices = useMemo(() => {
    const matrix = ROUTE_MATRIX[userType] || {};
    return SERVICE_TYPES.filter((s) => {
      if (s.value === "everything") return true;
      return matrix[s.value] !== null && matrix[s.value] !== undefined;
    });
  }, [userType]);

  // Reset service type if current selection is unavailable
  const effectiveService = availableServices.find((s) => s.value === serviceType)
    ? serviceType
    : "everything";

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
    <div className="relative z-20 max-w-5xl mx-auto px-6 -mt-4 mb-8">
      <div className="max-w-lg">
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
            className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#7B68EE] to-[#E879F9] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {exploreLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
