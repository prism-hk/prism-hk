"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { t, isZh, type Language } from "@/lib/i18n";

const COMMUNITY_ORGS = [
  { name: "Hong Kong Pride", zh: "香港同志遊行", zhHans: "香港同志游行", url: "https://www.hkpride.net", emoji: "\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}" },
  { name: "Pink Alliance", zh: "粉紅聯盟", zhHans: "粉红联盟", url: "https://www.pinkalliance.hk", emoji: "\u{1F496}" },
  { name: "AIDS Concern", zh: "關懷愛滋", zhHans: "关怀爱滋", url: "https://aidsconcern.org.hk", emoji: "\u{2764}\u{FE0F}" },
  { name: "Les Peches", zh: "Les Peches", zhHans: "Les Peches", url: "https://www.instagram.com/lespeches.hk", emoji: "\u{1F351}" },
  { name: "Out in HK", zh: "Out in HK", zhHans: "Out in HK", url: "https://www.outinhk.com", emoji: "\u{1F308}" },
];

function orgDisplayName(org: typeof COMMUNITY_ORGS[number], language: Language) {
  if (language === "en") return org.name;
  if (language === "zh") return org.zh;
  if (language === "zh-Hans") return org.zhHans;
  return org.name;
}

function orgSubName(org: typeof COMMUNITY_ORGS[number], language: Language) {
  if (language === "en") return null;
  if (language === "zh") return org.name !== org.zh ? org.name : null;
  if (language === "zh-Hans") return org.name !== org.zhHans ? org.name : null;
  return org.zh;
}

export default function EventsClient() {
  const { language } = useLanguage();

  const descEn = "The PRISM community events calendar is launching soon. In the meantime, check out these organizations for upcoming events.";
  const descZh = "PRISM 社區活動日曆即將推出。在此期間，歡迎瀏覽以下組織的活動資訊。";
  const descZhHans = "PRISM 社区活动日历即将推出。在此期间，欢迎浏览以下组织的活动资讯。";

  const desc = language === "en" ? descEn
    : language === "zh" ? descZh
    : language === "zh-Hans" ? descZhHans
    : `${descEn}\n${descZh}`;

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#F0EEFF] text-[#7B68EE] rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
          {t("comingSoon", language)}
        </div>
        <h1 className="text-4xl font-bold mb-3">
          {t("events", language)}
        </h1>
        <p className="text-[#6B6890] max-w-lg mx-auto whitespace-pre-line">
          {desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {COMMUNITY_ORGS.map((org) => (
          <a
            key={org.name}
            href={org.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E8E6F0] hover:border-[#A78BFA] hover:shadow-md transition-all"
          >
            <span className="text-2xl">{org.emoji}</span>
            <div>
              <div className="font-semibold text-sm text-[#1E1B3A]">{orgDisplayName(org, language)}</div>
              {orgSubName(org, language) && (
                <div className="text-xs text-[#6B6890]">{orgSubName(org, language)}</div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
