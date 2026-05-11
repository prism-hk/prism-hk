"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { t, type Language } from "@/lib/i18n";

function tx(en: string, zh: string, zhHans: string, language: Language): string {
  if (language === "en") return en;
  if (language === "zh") return zh;
  if (language === "zh-Hans") return zhHans;
  return `${en} ${zh}`;
}

const OBJECTIVES = [
  {
    image: "/obj-protest.png",
    en: "Equal platform for all voices",
    zh: "為所有聲音提供平等平台",
    zhHans: "为所有声音提供平等平台",
    descEn: "We connect queer-owned and affirming businesses, NGOs, corporate allies, health and support services, faith groups, community organizations, and individuals to create shared visibility and access.",
    descZh: "我們連繫酷兒經營及友善的商戶、非政府組織、企業盟友、醫療支援服務、宗教團體、社區組織及個人，創造共同的可見性與資源共享。",
    descZhHans: "我们连系酷儿经营及友善的商户、非政府组织、企业盟友、医疗支援服务、宗教团体、社区组织及个人，创造共同的可见性与资源共享。",
  },
  {
    image: "/obj-megaphone.png",
    en: "Year-round unity",
    zh: "全年團結",
    zhHans: "全年团结",
    descEn: "We strengthen ties across local Chinese-speaking, ethnic minority, and expat queer communities through an inclusive calendar of events and ongoing programming.",
    descZh: "我們通過包容的活動日曆和持續的節目，加強本地華語、少數族裔和外籍酷兒社群之間的聯繫。",
    descZhHans: "我们通过包容的活动日历和持续的节目，加强本地华语、少数族裔和外籍酷儿社群之间的联系。",
    reverse: true,
  },
  {
    image: "/obj-welcome.png",
    en: "Sustainable ecosystem",
    zh: "可持續生態系統",
    zhHans: "可持续生态系统",
    descEn: "We invest in enduring digital tools and signature events that go beyond Pride season, building a lasting infrastructure for queer empowerment in Hong Kong.",
    descZh: "我們投資於持久的數碼工具和標誌性活動，超越驕傲季節，為香港酷兒賦權建設持久的基礎設施。",
    descZhHans: "我们投资于持久的数码工具和标志性活动，超越骄傲季节，为香港酷儿赋权建设持久的基础设施。",
  },
];

type FAQ = {
  qEn: string; qZh: string; qZhHans: string;
  aEn: React.ReactNode; aZh: React.ReactNode; aZhHans: React.ReactNode;
};

const FAQS: FAQ[] = [
  {
    qEn: "How are organizations listed?",
    qZh: "機構如何被列入？",
    qZhHans: "机构如何被列入？",
    aEn: "PRISM lists partner organizations and events sourced from those led by or catering to the LGBTQ+ community.",
    aZh: "PRISM 收錄由 LGBTQ+ 社區領導或為其服務的合作機構及活動。",
    aZhHans: "PRISM 收录由 LGBTQ+ 社区领导或为其服务的合作机构及活动。",
  },
  {
    qEn: "What about government or emergency listings?",
    qZh: "政府或緊急服務的列表呢？",
    qZhHans: "政府或紧急服务的列表呢？",
    aEn: "Some listings (e.g., government entities, emergency services) are exempt from signing the PRISM Pledge for practical reasons. They have 60 days after launch to align where applicable.",
    aZh: "部分列表（例如政府機構、緊急服務）基於實際原因可豁免簽署 PRISM 承諾。在啟動後有 60 天時間調整。",
    aZhHans: "部分列表（例如政府机构、紧急服务）基于实际原因可豁免签署 PRISM 承诺。在启动后有 60 天时间调整。",
  },
  {
    qEn: "What is the PRISM Pledge?",
    qZh: "PRISM 承諾是什麼？",
    qZhHans: "PRISM 承诺是什么？",
    aEn: (
      <>
        <p>All new partners must sign the Pledge, affirming:</p>
        <ul className="mt-2 space-y-1 text-sm text-[#1E1B3A]">
          {[
            "Leadership includes/supports LGBTQ+ individuals",
            "No discrimination in hiring",
            "Equal treatment of LGBTQ+ customers",
            "Transgender facility access rights",
            "Equal benefits (e.g., parental leave for same-sex marriages)",
          ].map((line) => (
            <li key={line} className="flex gap-2"><span className="text-[#7B68EE]">✓</span><span>{line}</span></li>
          ))}
        </ul>
      </>
    ),
    aZh: (
      <>
        <p>所有新合作夥伴須簽署承諾：</p>
        <ul className="mt-2 space-y-1 text-sm text-[#1E1B3A]">
          {[
            "管理層包括/支持 LGBTQ+ 人士",
            "招聘無歧視",
            "平等對待 LGBTQ+ 顧客",
            "跨性別設施使用權",
            "同等福利（如同性婚姻的育嬰假）",
          ].map((line) => (
            <li key={line} className="flex gap-2"><span className="text-[#7B68EE]">✓</span><span>{line}</span></li>
          ))}
        </ul>
      </>
    ),
    aZhHans: (
      <>
        <p>所有新合作伙伴须签署承诺：</p>
        <ul className="mt-2 space-y-1 text-sm text-[#1E1B3A]">
          {[
            "管理层包括/支持 LGBTQ+ 人士",
            "招聘无歧视",
            "平等对待 LGBTQ+ 顾客",
            "跨性别设施使用权",
            "同等福利（如同性婚姻的育婴假）",
          ].map((line) => (
            <li key={line} className="flex gap-2"><span className="text-[#7B68EE]">✓</span><span>{line}</span></li>
          ))}
        </ul>
      </>
    ),
  },
  {
    qEn: "How do you ensure accountability?",
    qZh: "你們如何確保問責？",
    qZhHans: "你们如何确保问责？",
    aEn: "We encourage organizations to submit their Equal Opportunity Policy, Code of Conduct, or similar documents. We may delist partners based on credible complaints to protect the community.",
    aZh: "我們鼓勵機構提交其平等機會政策、行為守則或類似文件。我們可能基於可信投訴將合作夥伴除名，以保護社區。",
    aZhHans: "我们鼓励机构提交其平等机会政策、行为守则或类似文件。我们可能基于可信投诉将合作伙伴除名，以保护社区。",
  },
];

const TEAM = [
  {
    name: "Blake Chan",
    pronouns: "he/him/his",
    photo: "/team-blake.jpg",
    initials: "BC",
    gradient: "from-[#7B68EE] to-[#A78BFA]",
    bioEn: "Born and raised in Hong Kong, Blake is an LGBTQ+ advocate and DEI professional passionate about creating spaces of equity and belonging. He previously worked at Community Business, where he led the 2025 LGBTQ+ Inclusion Index for Hong Kong and Singapore, helping organizations build more inclusive workplaces. Grounded in both community and corporate advocacy, Blake is committed to amplifying diverse voices and driving meaningful progress across Asia.",
    bioZh: "Blake 在香港出生長大，是一位 LGBTQ+ 倡導者和 DEI 專業人士，致力於創造平等和歸屬感的空間。他曾在 Community Business 工作，負責領導 2025 年香港和新加坡 LGBTQ+ 包容指數，幫助機構建立更具包容性的工作環境。紮根於社區和企業倡議，Blake 致力於擴大多元聲音，推動亞洲有意義的進步。",
    bioZhHans: "Blake 在香港出生长大，是一位 LGBTQ+ 倡导者和 DEI 专业人士，致力于创造平等和归属感的空间。他曾在 Community Business 工作，负责领导 2025 年香港和新加坡 LGBTQ+ 包容指数，帮助机构建立更具包容性的工作环境。扎根于社区和企业倡议，Blake 致力于扩大多元声音，推动亚洲有意义的进步。",
  },
  {
    name: "Becky Isjwara",
    pronouns: "she/her",
    photo: "/team-becky.jpg",
    initials: "BI",
    gradient: "from-[#E879F9] to-[#F472B6]",
    website: "https://beckyisj.com",
    bioEn: "Becky is an LGBTQ+ professional who spent her early career in Hong Kong, where she founded her university's first LGBTQ+ network at HKUST. She co-led Interbank Hong Kong in 2024–2025, a peer organisation for LGBTQ+ networks across the city's financial services sector, and mentors LGBTQ+ students in the city. She builds and maintains the PRISM platform.",
    bioZh: "Becky 是一位 LGBTQ+ 專業人士，職業生涯早期在香港發展。她在香港科技大學創立了校內首個 LGBTQ+ 網絡，並於 2024–2025 年共同領導 Interbank Hong Kong——一個連繫本港金融服務業 LGBTQ+ 網絡的同儕組織，同時擔任本港 LGBTQ+ 學生的導師。她負責建設及維護 PRISM 平台。",
    bioZhHans: "Becky 是一位 LGBTQ+ 专业人士，职业生涯早期在香港发展。她在香港科技大学创立了校内首个 LGBTQ+ 网络，并于 2024–2025 年共同领导 Interbank Hong Kong——一个连系本港金融服务业 LGBTQ+ 网络的同侪组织，同时担任本港 LGBTQ+ 学生的导师。她负责建设及维护 PRISM 平台。",
  },
];

export default function LearnClient() {
  const { language } = useLanguage();

  return (
    <div className="pt-32 pb-20">
      {/* Header: logo + title + intro */}
      <section className="max-w-5xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/prism-logo.png" alt="PRISM" className="w-32 h-32 object-contain shrink-0" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3 text-center md:text-left">
              {tx("About PRISM", "關於 PRISM", "关于 PRISM", language)}
            </h1>
            <div className="text-sm text-[#1E1B3A] leading-relaxed space-y-3">
              <p>{t("learn_whoBody1", language)}</p>
              <p>{t("learn_whoBody2", language)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prism meaning — full-width gradient band */}
      <section className="bg-gradient-to-r from-[#F0EEFF] to-[#FCE4EC] py-12 mb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm md:text-base text-[#1E1B3A] leading-relaxed">
            {tx(
              "Prism symbolizes diversity and unity. Like a prism refracts light into colors, it reflects the LGBTQ+ community's richness and available resources. Light recombines into a single beam, symbolizing collective strength and shared purpose. Prism also embodies precision and progress, reminding us that light represents individuals and community working together.",
              "Prism 象徵多元與團結。正如棱鏡將光折射成色彩，它反映了 LGBTQ+ 社區的豐富與可用資源。光線重新組合為一束，象徵集體力量和共同目標。Prism 也體現精確與進步，提醒我們光既代表個體又代表共同努力的社區。",
              "Prism 象征多元与团结。正如棱镜将光折射成色彩，它反映了 LGBTQ+ 社区的丰富与可用资源。光线重新组合为一束，象征集体力量和共同目标。Prism 也体现精确与进步，提醒我们光既代表个体又代表共同努力的社区。",
              language
            )}
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-center text-[#1E1B3A] mb-10">
          {t("learn_missionTitle", language)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-lg font-bold text-[#1E1B3A] mb-3">
              {tx("Platform for queer resources", "酷兒資源平台", "酷儿资源平台", language)}
            </h3>
            <p className="text-sm text-[#6B6890] leading-relaxed">
              {t("learn_missionBody", language)}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mission-group.jpg" alt="" aria-hidden className="w-full h-64 object-cover rounded-2xl" />
        </div>
      </section>

      {/* Our Objectives */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-center text-[#1E1B3A] mb-10">
          {t("learn_objectivesTitle", language)}
        </h2>
        <div className="space-y-14">
          {OBJECTIVES.map((item, i) => (
            <div key={item.en} className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${item.reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" aria-hidden className="w-full max-w-[280px] mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-[#1E1B3A] mb-2">
                  {tx(item.en, item.zh, item.zhHans, language)}
                </h3>
                <p className="text-sm text-[#6B6890] leading-relaxed">
                  {tx(item.descEn, item.descZh, item.descZhHans, language)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-center text-[#1E1B3A] mb-8">
          {tx("How does this work?", "如何運作？", "如何运作？", language)}
        </h2>
        <FAQList faqs={FAQS} language={language} />
      </section>

      {/* Meet Our Team */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-[#1E1B3A] mb-8">
          {t("learn_teamTitle", language)}
        </h2>
        <div className="space-y-8">
          {TEAM.map((m) => (
            <div key={m.name} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photo} alt={m.name} className="w-full max-w-[200px] aspect-square object-cover rounded-2xl" />
              ) : (
                <div className={`w-full max-w-[200px] aspect-square rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-white font-bold text-5xl`}>
                  {m.initials}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-[#1E1B3A]">{m.name}</h3>
                {m.pronouns && <p className="text-xs text-[#6B6890] mb-3">{m.pronouns}</p>}
                <p className="text-sm text-[#1E1B3A] leading-relaxed">
                  {tx(m.bioEn, m.bioZh, m.bioZhHans, language)}
                </p>
                {"website" in m && m.website && (
                  <a
                    href={m.website as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#7B68EE] hover:underline mt-3"
                  >
                    {tx("Work with her", "與她合作", "与她合作", language)} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Want to contribute? */}
      <section className="bg-[#F3F2F7] py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1E1B3A] mb-3">
              {tx("Want to contribute?", "想參與？", "想参与？", language)}
            </h2>
            <p className="text-sm text-[#6B6890] mb-5">
              {tx(
                "PRISM is a community project. We welcome listing submissions, event tips, and volunteers.",
                "PRISM 是一個社區項目。我們歡迎提交機構、活動資訊及義工參與。",
                "PRISM 是一个社区项目。我们欢迎提交机构、活动资讯及义工参与。",
                language
              )}
            </p>
            <a
              href="/get-involved"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B68EE] hover:bg-[#6B5CE7] text-white rounded-lg font-semibold text-sm transition-colors"
            >
              {t("getInvolved", language)} →
            </a>
          </div>
          <div className="flex justify-center md:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/partner.png" alt="" aria-hidden className="w-64 h-64 object-contain" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQList({ faqs, language }: { faqs: FAQ[]; language: Language }) {
  const [open, setOpen] = useState<number | null>(0);
  const getQ = (f: FAQ) => language === "zh-Hans" ? f.qZhHans : language === "zh" ? f.qZh : f.qEn;
  const getA = (f: FAQ) => language === "zh-Hans" ? f.aZhHans : language === "zh" ? f.aZh : f.aEn;
  return (
    <div className="divide-y divide-[#E8E6F0] border-y border-[#E8E6F0]">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 py-5 text-left text-base font-bold text-[#1E1B3A] hover:text-[#7B68EE] transition-colors"
              aria-expanded={isOpen}
            >
              <span>{getQ(f)}</span>
              <span className="text-2xl text-[#6B6890] shrink-0 leading-none">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div className="pb-5 text-sm text-[#1E1B3A] leading-relaxed">
                {getA(f)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
