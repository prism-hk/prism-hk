"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { t, type Language } from "@/lib/i18n";

function tx(en: string, zh: string, zhHans: string, language: Language): string {
  if (language === "en") return en;
  if (language === "zh") return zh;
  if (language === "zh-Hans") return zhHans;
  return `${en} ${zh}`;
}

const RESOURCES = [
  {
    titleEn: "Know Your Rights",
    titleZh: "認識你的權利",
    titleZhHans: "认识你的权利",
    descEn: "Understanding LGBTQ+ legal protections and rights in Hong Kong.",
    descZh: "了解香港 LGBTQ+ 法律保障及權利。",
    descZhHans: "了解更多有关香港 LGBTQ+ 法律权利的资讯。",
    emoji: "\u{2696}\u{FE0F}",
    url: "https://www.aoshearman.com/en/insights/the-recognition-and-treatment-of-relationships-under-hong-kong-law-2026",
  },
  {
    titleEn: "Coming Out Resources",
    titleZh: "出櫃資源",
    titleZhHans: "出柜资源",
    descEn: "Guides and support for coming out to family, friends, and colleagues.",
    descZh: "向家人、朋友及同事出櫃的指南及支援。",
    descZhHans: "为正在出柜或考虑出柜的人士提供的资源。",
    emoji: "\u{1F4AC}",
    url: null,
  },
  {
    titleEn: "Mental Health & Wellbeing",
    titleZh: "精神健康",
    titleZhHans: "精神健康",
    descEn: "LGBTQ+-affirming mental health resources, therapists, and support groups.",
    descZh: "LGBTQ+ 友善精神健康資源、治療師及支援小組。",
    descZhHans: "LGBTQ+ 友善的心理健康支援及辅导服务。",
    emoji: "\u{1F9E0}",
    url: null,
  },
  {
    titleEn: "Sexual Health",
    titleZh: "性健康",
    titleZhHans: "性健康",
    descEn: "HIV/STI testing, PrEP information, and sexual health clinics in HK.",
    descZh: "HIV/STI 檢測、PrEP 資訊及香港性健康診所。",
    descZhHans: "性健康资讯、检测及支援服务。",
    emoji: "\u{2764}\u{FE0F}",
    url: "https://www.aidsconcern.org.hk",
  },
  {
    titleEn: "Workplace Inclusion",
    titleZh: "職場共融",
    titleZhHans: "职场共融",
    descEn: "Resources for creating LGBTQ+-inclusive workplaces and ERGs.",
    descZh: "建立 LGBTQ+ 共融職場及員工資源小組的資源。",
    descZhHans: "为雇主及雇员提供的职场 LGBTQ+ 共融指南。",
    emoji: "\u{1F4BC}",
    url: null,
  },
  {
    titleEn: "For Allies & Families",
    titleZh: "盟友與家人",
    titleZhHans: "盟友与家人",
    descEn: "How to support LGBTQ+ friends, family members, and colleagues.",
    descZh: "如何支持 LGBTQ+ 朋友、家人及同事。",
    descZhHans: "为盟友及家庭成员提供的资源。",
    emoji: "\u{1F91D}",
    url: null,
  },
];

export default function ResourcesClient() {
  const { language } = useLanguage();

  const learnMoreText = language === "en" ? "Learn more" : language === "zh" ? "了解更多" : language === "zh-Hans" ? "了解更多" : "Learn more 了解更多";
  const knowResourceText = tx(
    "Know a resource that should be listed here?",
    "知道應該列於此處的資源嗎？",
    "知道应该列于此处的资源吗？",
    language
  );

  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
      <h1 className="text-4xl font-bold mb-2">
        {t("resourcesTitle", language)}
      </h1>
      <p className="text-[#6B6890] mb-10">
        {t("resourcesDesc", language)}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RESOURCES.map((res) => (
          <div
            key={res.titleEn}
            className="bg-white rounded-xl border border-[#E8E6F0] p-5 hover:border-[#A78BFA] hover:shadow-md transition-all"
          >
            <span className="text-2xl">{res.emoji}</span>
            <h3 className="font-bold mt-2 text-sm text-[#1E1B3A]">
              {tx(res.titleEn, res.titleZh, res.titleZhHans, language)}
            </h3>
            <p className="text-xs text-[#6B6890] mt-1.5 leading-relaxed">
              {tx(res.descEn, res.descZh, res.descZhHans, language)}
            </p>
            {res.url && (
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs text-[#7B68EE] font-medium hover:underline"
              >
                {learnMoreText} &rarr;
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 bg-gradient-to-r from-[#F0EEFF] to-[#FCE4EC] rounded-2xl p-6 text-center">
        <p className="text-sm text-[#6B6890] mb-3">
          {knowResourceText}
        </p>
        <a
          href="/get-involved"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B68EE] text-white rounded-xl font-semibold text-sm hover:bg-[#6B5CE7] transition-colors"
        >
          {t("suggestResource", language)}
        </a>
      </div>
    </div>
  );
}
