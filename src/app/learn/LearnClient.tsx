"use client";

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
    emoji: "\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}",
    en: "Equal platform for all voices",
    zh: "為所有聲音提供平等平台",
    zhHans: "为所有声音提供平等平台",
    descEn: "We connect queer-owned and affirming businesses, NGOs, corporate allies, health and support services, faith groups, community organizations, and individuals to create shared visibility and access.",
    descZh: "我們連繫酷兒經營及友善的商戶、非政府組織、企業盟友、醫療支援服務、宗教團體、社區組織及個人，創造共同的可見性與資源共享。",
    descZhHans: "我们连系酷儿经营及友善的商户、非政府组织、企业盟友、医疗支援服务、宗教团体、社区组织及个人，创造共同的可见性与资源共享。",
  },
  {
    emoji: "\u{1F4C5}",
    en: "Year-round unity",
    zh: "全年團結",
    zhHans: "全年团结",
    descEn: "We strengthen ties across local Chinese-speaking, ethnic minority, and expat queer communities through an inclusive calendar of events and ongoing programming.",
    descZh: "我們通過包容的活動日曆和持續的節目，加強本地華語、少數族裔和外籍酷兒社群之間的聯繫。",
    descZhHans: "我们通过包容的活动日历和持续的节目，加强本地华语、少数族裔和外籍酷儿社群之间的联系。",
  },
  {
    emoji: "\u{1F30F}",
    en: "Sustainable ecosystem",
    zh: "可持續生態系統",
    zhHans: "可持续生态系统",
    descEn: "We invest in enduring digital tools and signature events that go beyond Pride season, building a lasting infrastructure for queer empowerment in Hong Kong.",
    descZh: "我們投資於持久的數碼工具和標誌性活動，超越驕傲季節，為香港酷兒賦權建設持久的基礎設施。",
    descZhHans: "我们投资于持久的数码工具和标志性活动，超越骄傲季节，为香港酷儿赋权建设持久的基础设施。",
  },
];

const TEAM = [
  {
    name: "Blake Chan",
    pronouns: "he/him/his",
    gradient: "from-[#7B68EE] to-[#A78BFA]",
    initials: "BC",
    bioEn: "Born and raised in Hong Kong, Blake is an LGBTQ+ advocate and DEI professional passionate about creating spaces of equity and belonging. He previously worked at Community Business, where he led the 2025 LGBTQ+ Inclusion Index for Hong Kong and Singapore, helping organizations build more inclusive workplaces. Grounded in both community and corporate advocacy, Blake is committed to amplifying diverse voices and driving meaningful progress across Asia.",
    bioZh: "Blake 在香港出生長大，是一位 LGBTQ+ 倡導者和 DEI 專業人士，致力於創造平等和歸屬感的空間。他曾在 Community Business 工作，負責領導 2025 年香港和新加坡 LGBTQ+ 包容指數，幫助機構建立更具包容性的工作環境。紮根於社區和企業倡議，Blake 致力於擴大多元聲音，推動亞洲有意義的進步。",
    bioZhHans: "Blake 在香港出生长大，是一位 LGBTQ+ 倡导者和 DEI 专业人士，致力于创造平等和归属感的空间。他曾在 Community Business 工作，负责领导 2025 年香港和新加坡 LGBTQ+ 包容指数，帮助机构建立更具包容性的工作环境。扎根于社区和企业倡议，Blake 致力于扩大多元声音，推动亚洲有意义的进步。",
  },
  {
    name: "Becky Isjwara",
    pronouns: "she/her",
    gradient: "from-[#E879F9] to-[#F472B6]",
    initials: "BI",
    website: "https://beckyisj.com",
    bioEn: "Becky is an LGBTQ+ professional who spent her early career in Hong Kong, where she founded her university's first LGBTQ+ network at HKUST. She co-led Interbank Hong Kong in 2024\u20132025, a peer organisation for LGBTQ+ networks across the city's financial services sector, and mentors LGBTQ+ students in the city. She builds and maintains the PRISM platform.",
    bioZh: "Becky 是一位 LGBTQ+ 專業人士，職業生涯早期在香港發展。她在香港科技大學創立了校內首個 LGBTQ+ 網絡，並於 2024\u20132025 年共同領導 Interbank Hong Kong——一個連繫本港金融服務業 LGBTQ+ 網絡的同儕組織，同時擔任本港 LGBTQ+ 學生的導師。她負責建設及維護 PRISM 平台。",
    bioZhHans: "Becky 是一位 LGBTQ+ 专业人士，职业生涯早期在香港发展。她在香港科技大学创立了校内首个 LGBTQ+ 网络，并于 2024\u20132025 年共同领导 Interbank Hong Kong——一个连系本港金融服务业 LGBTQ+ 网络的同侪组织，同时担任本港 LGBTQ+ 学生的导师。她负责建设及维护 PRISM 平台。",
  },
];

export default function LearnClient() {
  const { language } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
      <h1 className="text-4xl font-bold mb-2">
        {t("learnTitle", language)}
      </h1>

      <div className="mt-8 space-y-10">
        {/* Who are we? */}
        <section>
          <h2 className="text-xl font-bold mb-3">
            {tx("Who are we?", "我們是誰？", "我们是谁？", language)}
          </h2>
          <p className="text-[#1E1B3A] leading-relaxed">
            {tx(
              "PRISM is a community-driven initiative creating lasting infrastructure and fostering community building for Hong Kong's LGBTQ+ community. We're a small, passionate team of LGBTQ+ advocates and volunteers dedicated to making a real difference.",
              "PRISM 是一個由社區驅動的倡議，致力於為香港 LGBTQ+ 社區建設持久的基礎設施和促進社區建設。我們是一支充滿熱情的小型 LGBTQ+ 倡導者和義工團隊，致力於產生真正的改變。",
              "PRISM 是一个由社区驱动的倡议，致力于为香港 LGBTQ+ 社区建设持久的基础设施和促进社区建设。我们是一支充满热情的小型 LGBTQ+ 倡导者和义工团队，致力于产生真正的改变。",
              language
            )}
          </p>
        </section>

        {/* Prism meaning */}
        <section className="bg-gradient-to-r from-[#F0EEFF] to-[#FCE4EC] rounded-2xl p-6">
          <p className="text-sm text-[#1E1B3A] leading-relaxed">
            {tx(
              "Prism represents both diversity and unity. Just as a prism refracts light into a spectrum of colors, it reflects the rich diversity within the LGBTQ+ community and the array of resources available to support it. When viewed in reverse, light recombines into a single beam, symbolizing collective strength, shared purpose, and the unification of our community. As a scientific instrument, Prism also embodies precision, progress, and insight, reminding us that light is both particles and waves, representing individuals and community, working together to illuminate change.",
              "Prism 代表多元與團結。正如棱鏡將光折射成光譜色彩，它反映了 LGBTQ+ 社區內豐富的多樣性和可用的支援資源。反過來看，光重新合併為一束，象徵著集體力量、共同目標和社區的統一。作為科學儀器，Prism 也體現了精確、進步和洞察力，提醒我們光既是粒子也是波——代表個體和社區，共同照亮變革之路。",
              "Prism 代表多元与团结。正如棱镜将光折射成光谱色彩，它反映了 LGBTQ+ 社区内丰富的多样性和可用的支援资源。反过来看，光重新合并为一束，象征着集体力量、共同目标和社区的统一。作为科学仪器，Prism 也体现了精确、进步和洞察力，提醒我们光既是粒子也是波——代表个体和社区，共同照亮变革之路。",
              language
            )}
          </p>
        </section>

        {/* Mission Statement */}
        <section>
          <h2 className="text-xl font-bold mb-3">
            {tx("Mission Statement", "使命宣言", "使命宣言", language)}
          </h2>
          <p className="text-[#1E1B3A] leading-relaxed">
            {tx(
              "PRISM is building Hong Kong's go-to platform for queer resources, connecting people to healthcare, community, culture, events and employment with full visibility across all 18 districts. We're here to make it easier for everyone in the LGBTQ+ community to find support, belonging, and opportunity.",
              "PRISM 正在建設香港首選的酷兒資源平台，連接人們至醫療、社區、文化、活動和就業資源，覆蓋全港十八區。我們致力讓 LGBTQ+ 社區中的每個人都能更容易地找到支持、歸屬感和機會。",
              "PRISM 正在建设香港首选的酷儿资源平台，连接人们至医疗、社区、文化、活动和就业资源，覆盖全港十八区。我们致力让 LGBTQ+ 社区中的每个人都能更容易地找到支持、归属感和机会。",
              language
            )}
          </p>
        </section>

        {/* Our Objectives */}
        <section>
          <h2 className="text-xl font-bold mb-3">
            {tx("Our Objectives", "我們的目標", "我们的目标", language)}
          </h2>
          <div className="grid gap-4">
            {OBJECTIVES.map((item) => (
              <div
                key={item.en}
                className="flex gap-3 p-4 bg-white rounded-xl border border-[#E8E6F0]"
              >
                <span className="text-xl shrink-0">{item.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-[#1E1B3A]">
                    {tx(item.en, item.zh, item.zhHans, language)}
                  </p>
                  <p className="text-xs text-[#6B6890] mt-1 leading-relaxed">
                    {tx(item.descEn, item.descZh, item.descZhHans, language)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Meet Our Team */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            {tx("Meet Our Team", "認識我們的團隊", "认识我们的团队", language)}
          </h2>
          <div className="grid gap-6">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl border border-[#E8E6F0] p-6"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                    {member.initials}
                  </div>
                  <div>
                    <p className="font-bold text-[#1E1B3A]">{member.name}</p>
                    {member.pronouns && (
                      <p className="text-xs text-[#6B6890]">{member.pronouns}</p>
                    )}
                  </div>
                </div>
                {member.bioEn && (
                  <p className="text-sm text-[#6B6890] leading-relaxed">
                    {tx(member.bioEn, member.bioZh, member.bioZhHans, language)}
                  </p>
                )}
                {"website" in member && member.website && (
                  <a
                    href={member.website as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#7B68EE] hover:underline mt-2"
                  >
                    {tx("Work with her", "與她合作", "与她合作", language)} &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-[#F0EEFF] to-[#FCE4EC] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">
            {tx("Want to contribute?", "想參與？", "想参与？", language)}
          </h2>
          <p className="text-sm text-[#6B6890] mb-4">
            {tx(
              "PRISM is a community project. We welcome listing submissions, event tips, and volunteers.",
              "PRISM 是一個社區項目。我們歡迎提交機構、活動資訊及義工參與。",
              "PRISM 是一个社区项目。我们欢迎提交机构、活动资讯及义工参与。",
              language
            )}
          </p>
          <a
            href="/get-involved"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B68EE] text-white rounded-xl font-semibold text-sm hover:bg-[#6B5CE7] transition-colors"
          >
            {t("getInvolved", language)}
          </a>
        </section>
      </div>
    </div>
  );
}
