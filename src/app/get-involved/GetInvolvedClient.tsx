"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { t, isZh, type Language } from "@/lib/i18n";

function tx(en: string, zh: string, zhHans: string, language: Language): string {
  if (language === "en") return en;
  if (language === "zh") return zh;
  if (language === "zh-Hans") return zhHans;
  return `${en} ${zh}`;
}

type Contribute = {
  icon: React.ReactNode;
  iconBg: string;
  titleEn: string; titleZh: string; titleZhHans: string;
  descEn: string; descZh: string; descZhHans: string;
  url: string;
};

const CONTRIBUTE: Contribute[] = [
  {
    icon: <img src="/icon-org.png" alt="" aria-hidden className="w-7 h-7 object-contain" />,
    iconBg: "bg-[#EDEAFF]",
    titleEn: "Organization", titleZh: "提交機構", titleZhHans: "提交机构",
    descEn: "Know an LGBTQ+-friendly business, healthcare provider, or community group? Submit it for review.",
    descZh: "認識 LGBTQ+ 友善的商戶、醫療服務或社區組織？提交以供審核。",
    descZhHans: "认识 LGBTQ+ 友善的商户、医疗服务或社区组织？提交以供审核。",
    url: "https://tally.so/r/pb4loy",
  },
  {
    icon: <img src="/icon-event.png" alt="" aria-hidden className="w-7 h-7 object-contain" />,
    iconBg: "bg-[#E0F2FE]",
    titleEn: "Event", titleZh: "提交活動", titleZhHans: "提交活动",
    descEn: "Organizing or know about an upcoming LGBTQ+ event in Hong Kong? Let us know.",
    descZh: "正在籌辦或知道即將舉行的香港 LGBTQ+ 活動？告訴我們。",
    descZhHans: "正在筹办或知道即将举行的香港 LGBTQ+ 活动？告诉我们。",
    url: "https://tally.so/r/9q2zbQ",
  },
  {
    icon: <img src="/icon-article.png" alt="" aria-hidden className="w-7 h-7 object-contain" />,
    iconBg: "bg-[#FFEDD5]",
    titleEn: "Article", titleZh: "提交文章", titleZhHans: "提交文章",
    descEn: "Have a story, resource, or piece of writing relevant to Hong Kong's LGBTQ+ community? Share it with us.",
    descZh: "有與香港 LGBTQ+ 社區相關的故事、資源或文章？歡迎與我們分享。",
    descZhHans: "有与香港 LGBTQ+ 社区相关的故事、资源或文章？欢迎与我们分享。",
    url: "https://forms.gle/MxWPavkHaGV25z8c6",
  },
];

export default function GetInvolvedClient() {
  const { language } = useLanguage();

  return (
    <div className="pt-32 pb-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <h1 className="text-4xl font-bold mb-2">{t("getInvolvedTitle", language)}</h1>
        <p className="text-[#6B6890]">
          {tx(
            "Help grow Hong Kong's LGBTQ+ directory. Submit an organization, event, or article.",
            "協助擴展香港 LGBTQ+ 資料庫。提交機構、活動或文章。",
            "协助扩展香港 LGBTQ+ 资料库。提交机构、活动或文章。",
            language
          )}
        </p>
      </div>

      {/* Contribute Content */}
      <section className="max-w-5xl mx-auto px-6 mb-16">
        <h2 className="text-2xl font-bold text-[#1E1B3A] mb-5">
          {tx("Contribute Content", "貢獻內容", "贡献内容", language)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTRIBUTE.map((c) => (
            <div key={c.titleEn} className="flex flex-col">
              <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center mb-4`}>
                {c.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1E1B3A] mb-1.5">
                {tx(c.titleEn, c.titleZh, c.titleZhHans, language)}
              </h3>
              <p className="text-sm text-[#6B6890] mb-4 flex-1">
                {tx(c.descEn, c.descZh, c.descZhHans, language)}
              </p>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start inline-flex items-center gap-1.5 px-5 py-2 bg-[#7B68EE] hover:bg-[#6B5CE7] text-white rounded-lg font-semibold text-sm transition-colors"
              >
                {tx("Submit", "提交", "提交", language)} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Support */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-[#1E1B3A] mb-5">
          {tx("Support PRISM", "支持 PRISM", "支持 PRISM", language)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SupportRow
            illustration={
              <div className="w-28 h-28 rounded-full bg-white border border-[#E8E6F0] flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/prism-logo.png" alt="" className="w-16 h-16 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              </div>
            }
            title={tx("Volunteer With PRISM", "加入 PRISM 義工團隊", "加入 PRISM 义工团队", language)}
            desc={tx(
              "Help build Hong Kong's LGBTQ+ directory. Fill out the form to join our volunteer team.",
              "協助建立香港 LGBTQ+ 目錄。填寫表格加入我們的義工團隊。",
              "协助建立香港 LGBTQ+ 目录。填写表格加入我们的义工团队。",
              language
            )}
            ctaLabel={tx("Open form", "開啟表格", "开启表格", language)}
            ctaHref="https://forms.gle/feTGk1BpQVCY4woSA"
            ctaColor="bg-[#7B68EE] hover:bg-[#6B5CE7]"
          />
          <SupportRow
            illustration={
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/donation.png" alt="" aria-hidden className="w-28 h-28 object-contain shrink-0" />
            }
            title={tx("Buy Us a Coffee", "請我們喝杯咖啡", "请我们喝杯咖啡", language)}
            desc={tx(
              "PRISM is volunteer-run. Your support helps keep the platform running and accessible to all.",
              "PRISM 由義工運營。你的支持有助保持平台持續運作，向所有人開放。",
              "PRISM 由义工运营。你的支持有助保持平台持续运作，向所有人开放。",
              language
            )}
            ctaLabel={tx("Donate via PayMe", "透過 PayMe 捐款", "通过 PayMe 捐款", language)}
            ctaHref="https://payme.hsbc/03ac86ea2d804ce9964d878c722a975b"
            ctaColor="bg-[#7B68EE] hover:bg-[#6B5CE7]"
          />
          <SupportRow
            illustration={
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/partner.png" alt="" aria-hidden className="w-28 h-28 object-contain shrink-0" />
            }
            title={tx("Partner With Us", "成為合作夥伴", "成为合作伙伴", language)}
            desc={tx(
              "Organizations can partner with PRISM for events, visibility, and community impact. Fill out the form to get in touch.",
              "機構可與 PRISM 合作舉辦活動、提高曝光率及促進社區影響。填寫表格與我們聯絡。",
              "机构可与 PRISM 合作举办活动、提高曝光率及促进社区影响。填写表格与我们联络。",
              language
            )}
            ctaLabel={tx("Open form", "開啟表格", "开启表格", language)}
            ctaHref="https://forms.gle/XyjEMGrbT7baWZen7"
            ctaColor="bg-[#7B68EE] hover:bg-[#6B5CE7]"
          />
        </div>
      </section>

      {/* Support Partner Organizations — full-width */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1E1B3A] mb-3">
              {tx("Support Partner Organizations", "支持合作機構", "支持合作机构", language)}
            </h2>
            <p className="text-sm text-[#6B6890] mb-5">
              {tx(
                "Looking for more ways to give back? Browse partner organizations open to donations or volunteer work.",
                "想以更多方式回饋？瀏覽接受捐款或義工服務的合作機構。",
                "想以更多方式回馈？浏览接受捐款或义工服务的合作机构。",
                language
              )}
            </p>
            <a
              href="/directory?tag=volunteering"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg font-semibold text-sm transition-colors"
            >
              {tx("View Organizations", "查看機構", "查看机构", language)} →
            </a>
          </div>
          <div className="flex justify-center md:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/obj-welcome.png" alt="" aria-hidden className="w-64 h-64 object-contain" />
          </div>
        </div>
      </section>

      {/* Spread the Word — full-width gradient banner */}
      <section className="bg-gradient-to-r from-[#7B68EE] via-[#E879F9] via-[#F472B6] to-[#FB923C] py-12 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {tx("Spread the Word", "傳播訊息", "传播讯息", language)}
        </h2>
        <p className="text-sm opacity-90 mb-5">
          {tx(
            "Share PRISM with friends, colleagues, and on social media.",
            "與朋友、同事分享 PRISM，也歡迎在社交媒體上傳播。",
            "与朋友、同事分享 PRISM，也欢迎在社交媒体上传播。",
            language
          )}
        </p>
        <div className="flex justify-center gap-5">
          <a href="https://www.instagram.com/prism.lgbt.hk" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
          </a>
          <a href="https://www.facebook.com/prism.lgbt.hk" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
          </a>
          <a href="https://www.linkedin.com/company/prism-lgbt" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="LinkedIn">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
          </a>
        </div>
      </section>

      {/* Submit Feedback — small footer block */}
      <section className="bg-[#F3F2F7] py-10">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-base font-bold text-[#1E1B3A] mb-1">
              {tx("Spotted something off?", "發現問題？", "发现问题？", language)}
            </h3>
            <p className="text-sm text-[#6B6890]">
              {tx(
                "Share thoughts, suggestions, or report issues — your feedback shapes PRISM.",
                "分享想法、建議或報告問題 — 你的意見塑造 PRISM。",
                "分享想法、建议或报告问题 — 你的意见塑造 PRISM。",
                language
              )}
            </p>
          </div>
          <a
            href="https://forms.gle/G2J1u9rupXvdydBs8"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2 bg-[#7B68EE] hover:bg-[#6B5CE7] text-white rounded-lg font-semibold text-sm transition-colors"
          >
            {tx("Submit Feedback", "提交意見", "提交意见", language)} →
          </a>
        </div>
      </section>
    </div>
  );
}

function SupportRow({
  illustration, title, desc, ctaLabel, ctaHref, ctaColor,
}: {
  illustration: React.ReactNode; title: string; desc: string;
  ctaLabel: string; ctaHref: string; ctaColor: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="mb-4">{illustration}</div>
      <h3 className="text-lg font-bold text-[#1E1B3A] mb-1.5">{title}</h3>
      <p className="text-sm text-[#6B6890] mb-4 flex-1">{desc}</p>
      <a
        href={ctaHref}
        target={ctaHref.startsWith("http") ? "_blank" : undefined}
        rel={ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
        className={`self-start inline-flex items-center gap-1.5 px-5 py-2 ${ctaColor} text-white rounded-lg font-semibold text-sm transition-colors`}
      >
        {ctaLabel} →
      </a>
    </div>
  );
}

