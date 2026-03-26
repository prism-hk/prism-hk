"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { isZh, t } from "@/lib/i18n";
import { CATEGORIES, getCategoryName } from "@/lib/categories";

const i18n = {
  en: {
    upcomingEvents: "Upcoming Events",
    eventsSubtitle: "LGBTQ+ events happening in Hong Kong",
    comingSoon: "Coming Soon",
    comingSoonDesc: "Our events calendar is launching soon. In the meantime, check out these community organizations hosting events across Hong Kong.",
    submitEvent: "Submit an Event",
    browseByCategory: "Browse by Category",
  },
  zh: {
    upcomingEvents: "即將舉行的活動",
    eventsSubtitle: "香港 LGBTQ+ 活動",
    comingSoon: "即將推出",
    comingSoonDesc: "社區活動日曆即將推出。在此期間，歡迎瀏覽以下組織：",
    submitEvent: "提交活動",
    browseByCategory: "按類別瀏覽",
  },
  "zh-Hans": {
    upcomingEvents: "即将举行的活动",
    eventsSubtitle: "香港 LGBTQ+ 活动",
    comingSoon: "即将推出",
    comingSoonDesc: "社区活动日历即将推出。在此期间，欢迎浏览以下组织：",
    submitEvent: "提交活动",
    browseByCategory: "按类别浏览",
  },
};

function getText(key: keyof typeof i18n.en, language: string): string {
  if (language === "zh-Hans") return i18n["zh-Hans"][key];
  if (language === "zh") return i18n.zh[key];
  return i18n.en[key];
}

export default function HomeContent({
  categoryStats,
}: {
  categoryStats: { category: string; count: number }[];
}) {
  const { language } = useLanguage();

  return (
    <>
      {/* Upcoming Events */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#1E1B3A]">
            {getText("upcomingEvents", language)}
          </h2>
          <p className="text-[#6B6890] mt-2 text-sm">
            {getText("eventsSubtitle", language)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#F3F0FF] to-[#FCE4EC] rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="font-bold text-lg text-[#1E1B3A] mb-1">
            {getText("comingSoon", language)}
          </h3>
          <p className="text-sm text-[#6B6890] mb-5 max-w-md mx-auto">
            {getText("comingSoonDesc", language)}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Hong Kong Pride", url: "https://www.hkpride.net" },
              { name: "Pink Alliance", url: "https://www.pinkalliance.hk" },
              { name: "AIDS Concern", url: "https://aidsconcern.org.hk" },
              { name: "Les Peches", url: "https://www.instagram.com/lespeches.hk" },
              { name: "Out in HK", url: "https://www.outinhk.com" },
            ].map((org) => (
              <a
                key={org.name}
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/80 backdrop-blur rounded-xl text-sm font-medium text-[#7B68EE] hover:bg-white hover:shadow-md transition-all"
              >
                {org.name} →
              </a>
            ))}
          </div>
          <div className="mt-6">
            <a
              href="https://forms.gle/XyjEMGrbT7baWZen7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B68EE] text-white rounded-xl font-semibold text-sm hover:bg-[#6B5CE7] transition-colors"
            >
              {getText("submitEvent", language)} →
            </a>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#1E1B3A]">
            {getText("browseByCategory", language)}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const stat = categoryStats.find((s) => s.category === cat.id || s.category.includes(cat.id) || cat.id.includes(s.category));
            const count = stat?.count || categoryStats.filter((s) => s.category.includes(cat.id) || cat.id.includes(s.category)).reduce((sum, s) => sum + s.count, 0);
            const name = getCategoryName(cat, language);
            return (
              <a
                key={cat.id}
                href={`/directory?category=${cat.id}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E8E6F0] hover:border-[#A78BFA] hover:shadow-md transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-lg`}
                >
                  {cat.emoji}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#1E1B3A]">
                    {name}
                  </div>
                  {count > 0 ? (
                    <div className="text-xs text-[#6B6890]">
                      {count}
                    </div>
                  ) : null}
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
