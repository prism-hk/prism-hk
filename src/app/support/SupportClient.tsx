"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { t, type Language } from "@/lib/i18n";

function tx(en: string, zh: string, zhHans: string, language: Language): string {
  if (language === "en") return en;
  if (language === "zh") return zh;
  if (language === "zh-Hans") return zhHans;
  return `${en} ${zh}`;
}

export default function SupportClient() {
  const { language } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
      <h1 className="text-4xl font-bold mb-2">
        {t("supportTitle", language)}
      </h1>
      <p className="text-[#6B6890] mb-10">
        {t("supportDesc", language)}
      </p>

      <div className="space-y-6">
        {/* Spread the Word */}
        <div className="bg-white rounded-2xl border border-[#E8E6F0] p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E879F9] to-[#F472B6] flex items-center justify-center text-xl shrink-0">
              {"\u{1F4E2}"}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">
                {tx("Spread the Word", "推廣", "推广", language)}
              </h2>
              <p className="text-sm text-[#6B6890]">
                {tx(
                  "Share PRISM with friends, colleagues, and on social media.",
                  "與朋友、同事分享 PRISM，並在社交媒體上推廣。",
                  "与朋友、同事分享 PRISM，并在社交媒体上推广。",
                  language
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Donate */}
        <div className="bg-gradient-to-br from-[#F3F0FF] to-[#FCE4EC] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7B68EE] to-[#A78BFA] flex items-center justify-center text-xl shrink-0">
              {"\u{2615}"}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">
                {tx("Buy Us a Coffee", "請我們喝杯咖啡", "请我们喝杯咖啡", language)}
              </h2>
              <p className="text-sm text-[#6B6890] mb-4">
                {tx(
                  "PRISM is volunteer-run. Your support helps keep the platform running and accessible to all.",
                  "PRISM 由義工運營。你的支持有助保持平台持續運作，向所有人開放。",
                  "PRISM 由义工运营。你的支持有助保持平台持续运作，向所有人开放。",
                  language
                )}
              </p>
              <a
                href="/directory?tag=donations"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B68EE] text-white rounded-xl font-semibold text-sm hover:bg-[#6B5CE7] transition-colors"
              >
                {tx("Donate", "捐款", "捐款", language)} &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Volunteer */}
        <div className="bg-white rounded-2xl border border-[#E8E6F0] p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFA726] to-[#FB923C] flex items-center justify-center text-xl shrink-0">
              {"\u{1F64B}"}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">
                {tx("Volunteer", "義工", "义工", language)}
              </h2>
              <p className="text-sm text-[#6B6890] mb-4">
                {tx(
                  "Help with research, verification, translation, outreach, or events.",
                  "協助研究、驗證、翻譯、推廣或活動工作。",
                  "协助研究、验证、翻译、推广或活动工作。",
                  language
                )}
              </p>
              <a
                href="https://docs.google.com/forms/d/1n8tA9-VG89JvDtIB281fkvxgDIFlHOQ3N4wuFKTfsOw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFA726] hover:bg-[#F59E0B] text-white rounded-xl font-semibold text-sm transition-colors"
              >
                {tx("Apply to Volunteer", "申請成為義工", "申请成为义工", language)} &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Partner With Us */}
        <div className="bg-white rounded-2xl border border-[#E8E6F0] p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center text-xl shrink-0">
              {"\u{1F91D}"}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">
                {tx("Partner With Us", "合作", "合作", language)}
              </h2>
              <p className="text-sm text-[#6B6890]">
                {tx(
                  "Organizations can partner with PRISM for events and visibility.",
                  "組織可以與 PRISM 合作舉辦活動及提升可見度。",
                  "组织可以与 PRISM 合作举办活动及提升可见度。",
                  language
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Feedback */}
        <div className="bg-white rounded-2xl border border-[#E8E6F0] p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center text-xl shrink-0">
              {"\u{1F4AC}"}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">
                {t("feedback", language)}
              </h2>
              <p className="text-sm text-[#6B6890] mb-4">
                {tx(
                  "Suggestions, corrections, or ideas to improve PRISM.",
                  "建議、更正或改善 PRISM 的想法。",
                  "建议、更正或改善 PRISM 的想法。",
                  language
                )}
              </p>
              <a
                href="https://forms.gle/G2J1u9rupXvdydBs8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#38BDF8] hover:bg-[#2AABEB] text-white rounded-xl font-semibold text-sm transition-colors"
              >
                {t("feedback", language)} &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Get in Touch */}
        <div className="bg-white rounded-2xl border border-[#E8E6F0] p-6 text-center">
          <h3 className="font-bold mb-2">
            {tx("Get in Touch", "聯絡我們", "联络我们", language)}
          </h3>
          <p className="text-sm text-[#6B6890] mb-4">
            {tx(
              "For partnerships, sponsorships, or general enquiries:",
              "如有合作、贊助或一般查詢：",
              "如有合作、赞助或一般查询：",
              language
            )}
          </p>
          <a
            href="mailto:support@prism.lgbt"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B68EE] text-white rounded-xl font-semibold text-sm hover:bg-[#6B5CE7] transition-colors"
          >
            support@prism.lgbt
          </a>
        </div>
      </div>
    </div>
  );
}
