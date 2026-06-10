"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { t, isZh, type Language } from "@/lib/i18n";
import { type ArticleGroup, type Article, getTopicEmoji } from "@/lib/articles";

// Topic heading labels for each language
const TOPIC_LABELS: Record<string, { en: string; zh: string; zhHans: string }> = {
  "LGBTQ+ Concepts": { en: "LGBTQ+ Concepts", zh: "LGBTQ+ 概念", zhHans: "LGBTQ+ 概念" },
  "Know Your Rights": { en: "Know Your Rights", zh: "了解你的權利", zhHans: "了解你的权利" },
  "Coming Out Resources": { en: "Coming Out Resources", zh: "出櫃資源", zhHans: "出柜资源" },
  "Sexual Health": { en: "Sexual Health", zh: "性健康", zhHans: "性健康" },
  "Mental Health & Wellbeing": { en: "Mental Health & Wellbeing", zh: "精神健康及身心健康", zhHans: "精神健康及身心健康" },
  "Transgender Resources": { en: "Transgender Resources", zh: "跨性別資源", zhHans: "跨性别资源" },
  "For Allies & Families": { en: "For Allies & Families", zh: "支持者及家庭", zhHans: "支持者及家庭" },
  "Workplace Inclusion": { en: "Workplace Inclusion", zh: "職場共融", zhHans: "职场共融" },
  "Family Planning": { en: "Family Planning", zh: "家庭計劃", zhHans: "家庭计划" },
};

function getTopicLabel(topic: string, language: Language): string {
  const label = TOPIC_LABELS[topic];
  if (!label) return topic;
  return language === "zh-Hans" ? label.zhHans : language === "zh" ? label.zh : label.en;
}

// Topic descriptions for each language
const TOPIC_DESCRIPTIONS: Record<string, { en: string; zh: string; zhHans: string }> = {
  "LGBTQ+ Concepts": {
    en: "Understanding LGBTQ+ identities, terminology, and community.",
    zh: "了解 LGBTQ+ 身份認同、術語及社區。",
    zhHans: "了解 LGBTQ+ 身份认同、术语及社区。",
  },
  "Know Your Rights": {
    en: "Understanding LGBTQ+ legal protections and rights in Hong Kong.",
    zh: "了解香港 LGBTQ+ 法律保障及權利。",
    zhHans: "了解香港 LGBTQ+ 法律保障及权利。",
  },
  "Coming Out Resources": {
    en: "Guides and support for coming out to family, friends, and colleagues.",
    zh: "向家人、朋友及同事出櫃的指南及支援。",
    zhHans: "向家人、朋友及同事出柜的指南及支援。",
  },
  "Sexual Health": {
    en: "HIV/STI testing, PrEP information, and sexual health resources.",
    zh: "HIV/STI 檢測、PrEP 資訊及性健康資源。",
    zhHans: "HIV/STI 检测、PrEP 资讯及性健康资源。",
  },
  "Mental Health & Wellbeing": {
    en: "LGBTQ+-affirming mental health resources and support.",
    zh: "LGBTQ+ 友善精神健康資源及支援。",
    zhHans: "LGBTQ+ 友善精神健康资源及支援。",
  },
  "Transgender Resources": {
    en: "Resources for transgender and gender-diverse individuals.",
    zh: "跨性別及性別多元人士的資源。",
    zhHans: "跨性别及性别多元人士的资源。",
  },
  "For Allies & Families": {
    en: "How to support LGBTQ+ friends, family members, and colleagues.",
    zh: "如何支持 LGBTQ+ 朋友、家人及同事。",
    zhHans: "如何支持 LGBTQ+ 朋友、家人及同事。",
  },
  "Workplace Inclusion": {
    en: "Resources for creating LGBTQ+-inclusive workplaces.",
    zh: "建立 LGBTQ+ 共融職場的資源。",
    zhHans: "建立 LGBTQ+ 共融职场的资源。",
  },
  "Family Planning": {
    en: "Resources for LGBTQ+ family planning and parenting.",
    zh: "LGBTQ+ 家庭計劃及育兒資源。",
    zhHans: "LGBTQ+ 家庭计划及育儿资源。",
  },
};

function getArticleTitle(article: Article, language: Language): string {
  if (language === "zh") return article.title_zh || article.title_en;
  if (language === "zh-Hans") return article.title_zhHans || article.title_zh || article.title_en;
  return article.title_en;
}

function isArticleRelevant(article: Article, language: Language): boolean {
  const lang = article.language.toLowerCase();
  if (!lang) return true; // no language specified = show always
  if (lang.includes("english") && lang.includes("chinese")) return true; // bilingual
  if (isZh(language)) return lang.includes("chinese");
  return lang.includes("english");
}

export default function ResourcesClient({ groups = [] }: { groups?: ArticleGroup[] }) {
  const { language } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-4xl font-bold mb-2">
        {t("resourcesTitle", language)}
      </h1>
      <p className="text-[#6B6890] mb-10">
        {t("resourcesDesc", language)}
      </p>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map((group) => {
            const relevantArticles = group.articles.filter((a) => isArticleRelevant(a, language));
            // Show all articles as fallback if none match the current language
            const articlesToShow = relevantArticles.length > 0 ? relevantArticles : group.articles;
            const desc = TOPIC_DESCRIPTIONS[group.topic];
            const emoji = getTopicEmoji(group.topic);

            return (
              <div key={group.topic} className="bg-white rounded-xl border border-[#E8E6F0] p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <h3 className="font-bold text-[#1E1B3A]">{getTopicLabel(group.topic, language)}</h3>
                    {desc && (
                      <p className="text-xs text-[#6B6890] mt-0.5">
                        {language === "zh-Hans" ? desc.zhHans : language === "zh" ? desc.zh : desc.en}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 ml-9">
                  {articlesToShow.map((article, i) => (
                    <a
                      key={i}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 group"
                    >
                      <span className="text-[#7B68EE] shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </span>
                      <span className="text-sm text-[#1E1B3A] group-hover:text-[#7B68EE] transition-colors">
                        {getArticleTitle(article, language)}
                      </span>
                      {article.language && !article.language.toLowerCase().includes("english") && !article.language.toLowerCase().includes("chinese") ? null : (
                        <span className="text-[10px] text-[#6B6890] shrink-0">
                          {article.language.includes("English") && article.language.includes("Chinese") ? "EN/中" : article.language.includes("Chinese") ? "中" : "EN"}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <FallbackResources language={language} />
      )}

      <div className="mt-12 bg-gradient-to-r from-[#F0EEFF] to-[#FCE4EC] rounded-2xl px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold text-[#1E1B3A] mb-4">
            {language === "zh-Hans" ? "知道应该列于此处的资源吗？" : language === "zh" ? "知道應該列於此處的資源嗎？" : "Know a resource that should be listed here?"}
          </h2>
          <a
            href="/get-involved"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B68EE] text-white rounded-xl font-semibold text-sm hover:bg-[#6B5CE7] transition-colors"
          >
            {t("suggestResource", language)}
          </a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lightbulb-box.png"
          alt=""
          aria-hidden="true"
          className="w-40 h-40 md:w-48 md:h-48 object-contain shrink-0"
        />
      </div>
    </div>
  );
}

// Fallback if sheet fails to load
function FallbackResources({ language }: { language: Language }) {
  return (
    <div className="text-center text-[#6B6890] py-10">
      <p className="text-sm">
        {isZh(language) ? "資源加載中..." : "Loading resources..."}
      </p>
    </div>
  );
}
