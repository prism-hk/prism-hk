"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { t, isZh, type Language } from "@/lib/i18n";

function tx(en: string, zh: string, zhHans: string, language: Language): string {
  if (language === "en") return en;
  if (language === "zh") return zh;
  if (language === "zh-Hans") return zhHans;
  return `${en} ${zh}`;
}

const CARDS = [
  {
    emoji: "🏪",
    gradient: "from-[#7B68EE] to-[#A78BFA]",
    titleEn: "Submit an Organization",
    titleZh: "提交機構",
    titleZhHans: "提交机构",
    descEn: "Know an LGBTQ+-friendly business, healthcare provider, or community group? Submit it for review.",
    descZh: "認識 LGBTQ+ 友善的商戶、醫療服務或社區組織？提交以供審核。",
    descZhHans: "认识 LGBTQ+ 友善的商户、医疗服务或社区组织？提交以供审核。",
    embedUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfMs6oTt4jcQhA1MFijKAoxuuNJjU1MbcjtWHH-Y62HQWv8Ew/viewform?embedded=true",
  },
  {
    emoji: "📅",
    gradient: "from-[#E879F9] to-[#F472B6]",
    titleEn: "Submit an Event",
    titleZh: "提交活動",
    titleZhHans: "提交活动",
    descEn: "Organizing or know about an upcoming LGBTQ+ event in Hong Kong? Let us know.",
    descZh: "正在籌辦或知道即將舉行的香港 LGBTQ+ 活動？告訴我們。",
    descZhHans: "正在筹办或知道即将举行的香港 LGBTQ+ 活动？告诉我们。",
    embedUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc7r_5loinRfdOmb8A4tbvAvuiAWRPwnzFMn7FiaI8QjiAx8w/viewform?embedded=true",
  },
  {
    emoji: "📝",
    gradient: "from-[#22C55E] to-[#16A34A]",
    titleEn: "Submit an Article",
    titleZh: "提交文章",
    titleZhHans: "提交文章",
    descEn: "Have a story, resource, or piece of writing relevant to Hong Kong's LGBTQ+ community? Share it with us.",
    descZh: "有與香港 LGBTQ+ 社區相關的故事、資源或文章？歡迎與我們分享。",
    descZhHans: "有与香港 LGBTQ+ 社区相关的故事、资源或文章？欢迎与我们分享。",
    embedUrl: "https://docs.google.com/forms/d/e/1FAIpQLSchBcUWWx7sOxPZpZQWFEc2xsZqdBhwrhZpI5UAUkXbtofLfg/viewform?embedded=true",
  },
];

export default function GetInvolvedClient() {
  const { language } = useLanguage();

  const pageDescEn = "Help grow Hong Kong\u2019s LGBTQ+ directory. Submit an organization, event, or article.";
  const pageDescZh = "協助擴展香港 LGBTQ+ 資料庫。提交機構、活動或文章。";
  const pageDescZhHans = "协助扩展香港 LGBTQ+ 资料库。提交机构、活动或文章。";

  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-4xl font-bold mb-2">
        {t("getInvolvedTitle", language)}
      </h1>
      <p className="text-[#6B6890] mb-10">
        {tx(pageDescEn, pageDescZh, pageDescZhHans, language)}
      </p>

      <div className="space-y-6">
        {CARDS.map((card) => (
          <FormEmbed
            key={card.titleEn}
            title={tx(card.titleEn, card.titleZh, card.titleZhHans, language)}
            desc={tx(card.descEn, card.descZh, card.descZhHans, language)}
            emoji={card.emoji}
            gradient={card.gradient}
            formUrl={card.embedUrl}
            language={language}
          />
        ))}

        {/* Volunteer */}
        <div className="bg-white rounded-2xl border border-[#E8E6F0] p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFA726] to-[#FB923C] flex items-center justify-center text-xl shrink-0">
              {"\u{1F91D}"}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">
                {tx("Volunteer", "義工", "义工", language)}
              </h2>
              <p className="text-sm text-[#6B6890] mb-4">
                {tx(
                  "Please apply for volunteering opportunities at the following organizations.",
                  "請到以下機構申請義工機會。",
                  "请到以下机构申请义工机会。",
                  language
                )}
              </p>
              <a
                href="/directory?tag=volunteering"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFA726] hover:bg-[#F59E0B] text-white rounded-xl font-semibold text-sm transition-colors"
              >
                {tx("View Organizations", "查看機構", "查看机构", language)} &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Donate */}
        <div className="bg-white rounded-2xl border border-[#E8E6F0] p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center text-xl shrink-0">
              {"\u{1F49C}"}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">
                {tx("Donate", "捐款", "捐款", language)}
              </h2>
              <p className="text-sm text-[#6B6890] mb-4">
                {tx(
                  "Support organizations that accept donations.",
                  "支持接受捐款的機構。",
                  "支持接受捐款的机构。",
                  language
                )}
              </p>
              <a
                href="/directory?tag=donations"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#38BDF8] hover:bg-[#2AABEB] text-white rounded-xl font-semibold text-sm transition-colors"
              >
                {tx("View Organizations", "查看機構", "查看机构", language)} &rarr;
              </a>
            </div>
          </div>
        </div>
        {/* Spread the Word */}
        <div className="bg-gradient-to-r from-[#F0EEFF] to-[#FCE4EC] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7B68EE] to-[#E879F9] flex items-center justify-center text-xl shrink-0">
              📢
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">
                {tx("Spread the Word", "傳播訊息", "传播讯息", language)}
              </h2>
              <p className="text-sm text-[#6B6890] mb-4">
                {tx(
                  "Share PRISM with friends, colleagues, and on social media.",
                  "與朋友、同事分享 PRISM，也歡迎在社交媒體上傳播。",
                  "与朋友、同事分享 PRISM，也欢迎在社交媒体上传播。",
                  language
                )}
              </p>
              <div className="flex items-center gap-3">
                <a href="https://www.instagram.com/prism.lgbt.hk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#6B6890] hover:text-[#E1306C] transition-colors shadow-sm" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://www.facebook.com/prism.lgbt.hk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#6B6890] hover:text-[#1877F2] transition-colors shadow-sm" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/prism-lgbt" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#6B6890] hover:text-[#0A66C2] transition-colors shadow-sm" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback form */}
        <FormEmbed
          title={tx("Submit Feedback", "提交意見", "提交意见", language)}
          desc={tx("Help us improve PRISM. Share your thoughts, suggestions, or report issues.", "幫助我們改進 PRISM。分享你的想法、建議或報告問題。", "帮助我们改进 PRISM。分享你的想法、建议或报告问题。", language)}
          emoji="💬"
          gradient="from-[#A78BFA] to-[#7C3AED]"
          formUrl="https://docs.google.com/forms/d/e/1FAIpQLScnSQ3Gcg4nAGnI9IfsshSyp8thtpSl7d3ms3h0N4xmlQlUuw/viewform?embedded=true"
          language={language}
        />
      </div>
    </div>
  );
}

function FormEmbed({ title, desc, emoji, gradient, formUrl, language }: {
  title: string; desc: string; emoji: string; gradient: string; formUrl: string; language: Language;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#E8E6F0] p-6">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shrink-0`}>
          {emoji}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-1">{title}</h2>
          <p className="text-sm text-[#6B6890] mb-4">{desc}</p>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B68EE] hover:bg-[#6B5CE7] text-white rounded-xl font-semibold text-sm transition-colors`}
          >
            {showForm
              ? (isZh(language) ? "隱藏表格" : "Hide form")
              : (isZh(language) ? "填寫表格" : "Open form")}
            <svg className={`w-4 h-4 transition-transform ${showForm ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      {showForm && (
        <div className="mt-4 rounded-xl overflow-hidden border border-[#E8E6F0]">
          <iframe
            src={formUrl}
            className="w-full border-0"
            style={{ height: "600px" }}
            title={title}
          />
        </div>
      )}
    </div>
  );
}
