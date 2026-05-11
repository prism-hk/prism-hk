export type Language = "en" | "zh" | "zh-Hans" | "both";

export const ui = {
  en: {
    // Nav
    home: "Home",
    directory: "Explore",
    health: "Healthcare & Support",
    emergencyServices: "Emergency Services",
    events: "Events",
    learn: "Learn",
    more: "More",
    aboutUs: "About Us",
    educationalResources: "Educational Resources",
    getInvolved: "Get Involved",
    support: "Support Us",
    contact: "Contact Us",

    // Hero
    heroTitle: "PRISM",
    heroSubtitle: "Find LGBTQ+-friendly businesses, community groups, healthcare, NGOs, and events across all 18 districts of Hong Kong.",
    listings: "Listings",
    districts: "Districts",
    categories: "Categories",

    // Directory
    search: "Search businesses, groups, services...",
    all: "All",
    verified: "Verified",
    noResults: "No listings found matching your search.",

    // Categories
    Business: "Businesses",
    Businesses: "Businesses",
    Community: "Community & Student Groups",
    Healthcare: "Healthcare & Support",
    "Healthcare & Support": "Healthcare & Support",
    NGO: "NGOs",
    NGOs: "NGOs",
    "Religious Organization": "Religious Organizations",
    Religious: "Religious Organizations",
    Government: "Government",
    Media: "Media",
    Other: "Other",

    // Health / Emergency
    emergencyTitle: "Crisis & Emergency Resources",
    emergencyDesc: "If you or someone you know needs immediate support:",
    samaritans: "The Samaritans — 24hr hotline",
    mindHK: "Mind HK — Mental health support",
    emergencyPageTitle: "Emergency Services Directory",
    emergencyPageDesc: "If you or someone you know needs immediate support:",
    emergencySearch: "Search emergency services...",

    // Events
    comingSoon: "Coming Soon",
    eventsDesc: "Community events calendar launching soon. In the meantime, check out these organizations:",

    // Get Involved
    getInvolvedTitle: "Get Involved",
    submitListing: "Submit a Listing",
    submitEvent: "Submit an Event",
    volunteer: "Volunteer",
    donate: "Make a Donation",

    // Support
    supportTitle: "Support PRISM",
    supportDesc: "PRISM is a volunteer-run project. Your support helps keep the directory and events calendar updated and accessible.",
    feedback: "Submit Feedback",

    // Learn
    learnTitle: "About PRISM",
    learnDesc: "PRISM is an LGBTQ+ directory and community platform for Hong Kong. We connect people with affirming businesses, healthcare providers, community groups, NGOs, and events across all 18 districts.",
    learn_whoTitle: "Who are we?",
    learn_whoBody1: "PRISM is Hong Kong's central LGBTQ+ directory and events calendar, designed to make it easy to find trusted resources, inclusive services, and community events across all 18 districts. We bring together what's often fragmented, so community members can quickly access support, connection, and opportunities in one place.",
    learn_whoBody2: "We are a community-driven initiative, built by LGBTQ+ advocates and volunteers who believe visibility and access are the foundation of a stronger, more connected community.",
    learn_missionTitle: "Mission Statement",
    learn_missionBody: "PRISM is building Hong Kong's go-to platform for queer resources, connecting people to healthcare, community, culture, events and employment with full visibility across all 18 districts. We're here to make it easier for everyone in the LGBTQ+ community to find support, belonging, and opportunity.",
    learn_objectivesTitle: "Our Objectives",
    learn_pledgeTitle: "How does this work?",
    learn_pledgeBody1: "PRISM lists partner organizations and events sourced from those led by or catering to LGBTQ+ community members. Initial listings, including government entities and emergency listings (which may be exempt from signing), have not signed the PRISM Pledge for practical reasons but will have 60 days after PRISM's official launch to align where applicable. Going forward, new additions will sign the Pledge before listing, ensuring all partners affirm:",
    learn_pledgeBody2: "We encourage organizations to submit their Equal Opportunity Policy, Code of Conduct or similar documents. We may delist partners at our discretion based on credible complaints to protect the community. This fosters authentic, lasting collaborations.",
    learn_teamTitle: "Meet Our Team",

    // Educational Resources
    resourcesTitle: "Educational Resources",
    resourcesDesc: "Learn more about LGBTQ+ topics, rights, and support in Hong Kong.",
    knowYourRights: "Know Your Rights",
    comingOutResources: "Coming Out Resources",
    mentalHealth: "Mental Health & Wellbeing",
    sexualHealth: "Sexual Health",
    workplaceInclusion: "Workplace Inclusion",
    forAllies: "For Allies & Families",
    suggestResource: "Suggest a Resource",

    // Footer
    footerTagline: "Hong Kong's LGBTQ+ directory.",
    footerWavelength: "Find your wavelength.",
    footerBuiltWith: "Built with love for the community.",
  },
  zh: {
    home: "首頁",
    directory: "探索",
    health: "醫療及支援",
    emergencyServices: "緊急支援",
    events: "活動",
    learn: "了解更多",
    more: "更多",
    aboutUs: "關於我們",
    educationalResources: "教育資源",
    getInvolved: "參與",
    support: "支持我們",
    contact: "聯絡我們",

    heroTitle: "PRISM",
    heroSubtitle: "探索香港十八區的 LGBTQ+ 友善商戶、社區組織、醫療服務、NGO 及活動。",
    listings: "機構",
    districts: "地區",
    categories: "類別",

    search: "搜索商戶、組織、服務...",
    all: "全部",
    verified: "已驗證",
    noResults: "找不到符合搜索條件的機構。",

    Business: "商戶",
    Businesses: "商戶",
    Community: "社區",
    Healthcare: "醫療及支援",
    "Healthcare & Support": "醫療及支援",
    NGO: "非政府組織",
    NGOs: "非政府組織",
    "Religious Organization": "宗教組織",
    Religious: "宗教組織",
    Government: "政府機構",
    Media: "媒體",
    Other: "其他",

    emergencyTitle: "危機及緊急資源",
    emergencyDesc: "如果你或身邊的人需要即時支援：",
    samaritans: "撒瑪利亞防止自殺會 — 24小時熱線",
    mindHK: "Mind HK — 精神健康支援",
    emergencyPageTitle: "緊急服務資料庫",
    emergencyPageDesc: "如果你或身邊的人需要即時支援：",
    emergencySearch: "搜索緊急服務...",

    comingSoon: "即將推出",
    eventsDesc: "社區活動日曆即將推出。在此期間，歡迎瀏覽以下組織：",

    getInvolvedTitle: "參與",
    submitListing: "提交機構",
    submitEvent: "提交活動",
    volunteer: "成為義工",
    donate: "捐款",

    supportTitle: "支持 PRISM",
    supportDesc: "PRISM 是由義工營運。你的支持有助保持資料庫及活動日曆持續更新並免費開放。",
    feedback: "提交意見",

    learnTitle: "關於 PRISM",
    learnDesc: "PRISM 是一個服務香港的 LGBTQ+ 資料庫及社區平台。我們將大眾連繫到遍佈十八區的友善商戶、醫療服務提供者、社區組織、非政府組織及活動。",
    learn_whoTitle: "我們是誰？",
    learn_whoBody1: "PRISM 是香港的中央 LGBTQ+ 機構目錄及活動日曆，讓你輕鬆找到全港十八區值得信賴的資源、共融服務和社區活動。我們把經常分散的資訊整合在一起，讓社區成員能一站式獲得支援、連繫和機會。",
    learn_whoBody2: "我們是一個由社區驅動的倡議，由 LGBTQ+ 倡導者和義工共同建立。我們相信可見度與觸達是建立更強大、更緊密連繫社區的基石。",
    learn_missionTitle: "使命宣言",
    learn_missionBody: "PRISM 正在建設香港首選的酷兒資源平台，連接人們至醫療、社區、文化、活動和就業資源，覆蓋全港十八區。我們致力讓 LGBTQ+ 社區中的每個人都能更容易地找到支持、歸屬感和機會。",
    learn_objectivesTitle: "我們的目標",
    learn_pledgeTitle: "這是如何運作的？",
    learn_pledgeBody1: "PRISM 列出由 LGBTQ+ 社群成員主導或服務社群的合作機構和活動。初始上架的機構（包括政府機構和緊急服務，它們可能獲豁免簽署）因實際原因尚未簽署 PRISM 承諾，但將在 PRISM 正式推出後 60 天內按適用情況達成一致。往後，新加入的機構將在上架前簽署承諾，確認所有合作夥伴肯定以下原則：",
    learn_pledgeBody2: "我們鼓勵機構提交其平等機會政策、行為準則或類似文件。我們可能根據可信投訴酌情將合作夥伴除名，以保護社區。這有助促進真實、持久的合作關係。",
    learn_teamTitle: "認識我們的團隊",

    resourcesTitle: "教育資源",
    resourcesDesc: "了解更多有關香港 LGBTQ+ 議題、權利及支援的資訊。",
    knowYourRights: "認識你的權利",
    comingOutResources: "出櫃資源",
    mentalHealth: "精神健康",
    sexualHealth: "性健康",
    workplaceInclusion: "職場共融",
    forAllies: "盟友與家人",
    suggestResource: "建議資源",

    footerTagline: "香港 LGBTQ+ 資料庫。",
    footerWavelength: "尋找你的頻率。",
    footerBuiltWith: "用愛為社區而建。",
  },
  "zh-Hans": {
    home: "主页",
    directory: "探索",
    health: "医疗及支援",
    emergencyServices: "紧急支援",
    events: "活动",
    learn: "了解更多",
    more: "更多",
    aboutUs: "关于我们",
    educationalResources: "教育资源",
    getInvolved: "参与",
    support: "支持我们",
    contact: "联络我们",

    heroTitle: "PRISM",
    heroSubtitle: "探索全港十八区的 LGBTQ+ 友善商户、社区组织、医疗服务、非政府组织及活动。",
    listings: "机构",
    districts: "地区",
    categories: "类别",

    search: "搜索商户、组织、服务…",
    all: "全部",
    verified: "已验证",
    noResults: "找不到符合搜索条件的机构。",

    Business: "商户",
    Businesses: "商户",
    Community: "社区",
    Healthcare: "医疗及支援",
    "Healthcare & Support": "医疗及支援",
    NGO: "非政府组织",
    NGOs: "非政府组织",
    "Religious Organization": "宗教组织",
    Religious: "宗教组织",
    Government: "政府机构",
    Media: "媒体",
    Other: "其他",

    emergencyTitle: "危机及紧急资源",
    emergencyDesc: "如果你或身边的人需要即时支援：",
    samaritans: "撒玛利亚防止自杀会 — 24 小时热线",
    mindHK: "Mind HK — 精神健康支援",
    emergencyPageTitle: "紧急服务资料库",
    emergencyPageDesc: "如果你或身边的人需要即时支援：",
    emergencySearch: "搜索紧急服务…",

    comingSoon: "即将推出",
    eventsDesc: "社区活动日历即将推出。在此期间，欢迎浏览以下组织：",

    getInvolvedTitle: "参与",
    submitListing: "提交机构",
    submitEvent: "提交活动",
    volunteer: "成为义工",
    donate: "捐款",

    supportTitle: "支持 PRISM",
    supportDesc: "PRISM 是由义工营运。你支持有助保持资料库及活动日历持续更新并免费开放。",
    feedback: "提交意见",

    learnTitle: "关于 PRISM",
    learnDesc: "PRISM 是一个服务香港的 LGBTQ+ 资料库及社区平台。我们将大众连系到遍布十八区的友善商户、医疗服务提供者、社区组织、非政府组织及活动。",
    learn_whoTitle: "我们是谁？",
    learn_whoBody1: "PRISM 是香港的中央 LGBTQ+ 机构目录及活动日历，让你轻松找到全港十八区值得信赖的资源、共融服务和社区活动。我们把经常分散的信息整合在一起，让社区成员能一站式获得支援、联系和机会。",
    learn_whoBody2: "我们是一个由社区驱动的倡议，由 LGBTQ+ 倡导者和义工共同建立。我们相信可见度与触达是建立更强大、更紧密联系社区的基石。",
    learn_missionTitle: "使命宣言",
    learn_missionBody: "PRISM 正在建设香港首选的酷儿资源平台，连接人们至医疗、社区、文化、活动和就业资源，覆盖全港十八区。我们致力让 LGBTQ+ 社区中的每个人都能更容易地找到支持、归属感和机会。",
    learn_objectivesTitle: "我们的目标",
    learn_pledgeTitle: "这是如何运作的？",
    learn_pledgeBody1: "PRISM 列出由 LGBTQ+ 社群成员主导或服务社群的合作机构和活动。初始上架的机构（包括政府机构和紧急服务，它们可能获豁免签署）因实际原因尚未签署 PRISM 承诺，但将在 PRISM 正式推出后 60 天内按适用情况达成一致。往后，新加入的机构将在上架前签署承诺，确认所有合作伙伴肯定以下原则：",
    learn_pledgeBody2: "我们鼓励机构提交其平等机会政策、行为准则或类似文件。我们可能根据可信投诉酌情将合作伙伴除名，以保护社区。这有助促进真实、持久的合作关系。",
    learn_teamTitle: "认识我们的团队",

    resourcesTitle: "教育资源",
    resourcesDesc: "了解更多有关香港 LGBTQ+ 议题、权利及支援的资讯。",
    knowYourRights: "认识你的权利",
    comingOutResources: "出柜资源",
    mentalHealth: "精神健康",
    sexualHealth: "性健康",
    workplaceInclusion: "职场共融",
    forAllies: "盟友与家人",
    suggestResource: "建议资源",

    footerTagline: "香港 LGBTQ+ 资料库。",
    footerWavelength: "寻找你的频率。",
    footerBuiltWith: "用爱为社区而建。",
  },
} as const;

export function t(key: keyof typeof ui.en, lang: Language): string {
  if (lang === "both") {
    const en = ui.en[key];
    const zh = ui.zh[key];
    if (en === zh) return en;
    return `${en} ${zh}`;
  }
  if (lang === "zh-Hans") return ui["zh-Hans"][key] || ui.zh[key];
  return lang === "zh" ? ui.zh[key] : ui.en[key];
}

/** Returns true for any Chinese language variant */
export function isZh(lang: Language): boolean {
  return lang === "zh" || lang === "zh-Hans";
}

export function bilingualText(
  en: string | null | undefined,
  zh: string | null | undefined,
  lang: Language,
  zhHans?: string | null | undefined
): string {
  const enText = en || "";
  const zhText = zh || "";
  const zhHansText = zhHans || "";

  if (lang === "en") return enText || zhText || zhHansText;
  if (lang === "zh-Hans") return zhHansText || zhText || enText;
  if (lang === "zh") return zhText || enText;
  if (!zhText) return enText;
  if (!enText) return zhText;
  if (enText === zhText) return enText;
  return `${enText}\n${zhText}`;
}
