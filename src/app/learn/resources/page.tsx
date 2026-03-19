import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Educational Resources — PRISM HK 教育資源",
  description: "LGBTQ+ educational resources for Hong Kong. 香港 LGBTQ+ 教育資源。",
};

const RESOURCES = [
  {
    title: "Know Your Rights",
    zh: "認識你的權利",
    desc: "Understanding LGBTQ+ legal protections and rights in Hong Kong.",
    descZh: "了解香港 LGBTQ+ 法律保障及權利。",
    emoji: "⚖️",
    url: "https://www.equallove.hk",
  },
  {
    title: "Coming Out Resources",
    zh: "出櫃資源",
    desc: "Guides and support for coming out to family, friends, and colleagues.",
    descZh: "向家人、朋友及同事出櫃的指南及支援。",
    emoji: "💬",
    url: null,
  },
  {
    title: "Mental Health & Wellbeing",
    zh: "精神健康",
    desc: "LGBTQ+-affirming mental health resources, therapists, and support groups.",
    descZh: "LGBTQ+ 友善精神健康資源、治療師及支援小組。",
    emoji: "🧠",
    url: null,
  },
  {
    title: "Sexual Health",
    zh: "性健康",
    desc: "HIV/STI testing, PrEP information, and sexual health clinics in HK.",
    descZh: "HIV/STI 檢測、PrEP 資訊及香港性健康診所。",
    emoji: "❤️",
    url: "https://www.aidsconcern.org.hk",
  },
  {
    title: "Workplace Inclusion",
    zh: "職場共融",
    desc: "Resources for creating LGBTQ+-inclusive workplaces and ERGs.",
    descZh: "建立 LGBTQ+ 共融職場及員工資源小組的資源。",
    emoji: "💼",
    url: null,
  },
  {
    title: "For Allies & Families",
    zh: "盟友與家人",
    desc: "How to support LGBTQ+ friends, family members, and colleagues.",
    descZh: "如何支持 LGBTQ+ 朋友、家人及同事。",
    emoji: "🤝",
    url: null,
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
      <h1 className="text-4xl font-bold mb-2">
        Educational Resources{" "}
        <span className="text-[#6B6890] font-medium text-2xl">教育資源</span>
      </h1>
      <p className="text-[#6B6890] mb-10">
        Learn more about LGBTQ+ topics, rights, and support in Hong Kong.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RESOURCES.map((res) => (
          <div
            key={res.title}
            className="bg-white rounded-xl border border-[#E8E6F0] p-5 hover:border-[#A78BFA] hover:shadow-md transition-all"
          >
            <span className="text-2xl">{res.emoji}</span>
            <h3 className="font-bold mt-2 text-sm text-[#1E1B3A]">
              {res.title}{" "}
              <span className="text-[#6B6890] font-medium">{res.zh}</span>
            </h3>
            <p className="text-xs text-[#6B6890] mt-1.5 leading-relaxed">{res.desc}</p>
            <p className="text-xs text-[#6B6890] mt-0.5 leading-relaxed">{res.descZh}</p>
            {res.url && (
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs text-[#7B68EE] font-medium hover:underline"
              >
                Learn more →
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 bg-gradient-to-r from-[#F3F0FF] to-[#FCE4EC] rounded-2xl p-6 text-center">
        <p className="text-sm text-[#6B6890] mb-3">
          Know a resource that should be listed here?
        </p>
        <a
          href="/get-involved"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B68EE] text-white rounded-xl font-semibold text-sm hover:bg-[#6B5CE7] transition-colors"
        >
          Suggest a Resource 建議資源
        </a>
      </div>
    </div>
  );
}
