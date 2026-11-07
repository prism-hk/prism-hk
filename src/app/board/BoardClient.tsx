"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { bilingualText, type Language } from "@/lib/i18n";
import type { BoardCategory, BoardKind, BoardPost } from "@/lib/board";

// Paste the Tally form link here once it exists. Until then the button points to the contact page.
const SUBMIT_FORM_URL = "";

export type OrgInfo = {
  name_en: string;
  name_zh: string | null;
  name_zhHans: string | null;
  logo: string | null;
};

function tx(en: string, zh: string, zhHans: string, language: Language): string {
  if (language === "en") return en;
  if (language === "zh") return zh;
  if (language === "zh-Hans") return zhHans;
  return `${en} ${zh}`;
}

type Label = { en: string; zh: string; zhHans: string };

const CATEGORIES: { id: BoardCategory; label: Label }[] = [
  { id: "space", label: { en: "Spaces", zh: "場地", zhHans: "场地" } },
  { id: "speaker", label: { en: "Speakers", zh: "講者", zhHans: "讲者" } },
  { id: "reach", label: { en: "Reach & Promotion", zh: "宣傳推廣", zhHans: "宣传推广" } },
  { id: "sponsorship", label: { en: "Sponsorship", zh: "贊助", zhHans: "赞助" } },
  { id: "volunteers", label: { en: "Volunteers", zh: "義工", zhHans: "义工" } },
  { id: "participants", label: { en: "Participants", zh: "參加者", zhHans: "参加者" } },
  { id: "other", label: { en: "Other", zh: "其他", zhHans: "其他" } },
];

const KINDS: { id: BoardKind | ""; label: Label }[] = [
  { id: "", label: { en: "All", zh: "全部", zhHans: "全部" } },
  { id: "ask", label: { en: "Looking for", zh: "尋找中", zhHans: "寻找中" } },
  { id: "offer", label: { en: "Offering", zh: "提供中", zhHans: "提供中" } },
];

function label(l: Label, language: Language) {
  return tx(l.en, l.zh, l.zhHans, language);
}

function formatDate(iso: string, language: Language): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const locale = language === "en" || language === "both" ? "en-AU" : language === "zh" ? "zh-HK" : "zh-CN";
  return date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

function contactHref(contact: string): string | null {
  const c = contact.trim();
  if (/^https?:\/\//.test(c)) return c;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) return `mailto:${c}`;
  // A phone number on its own: open WhatsApp, assuming Hong Kong (+852) for 8-digit local numbers.
  if (/^\+?[\d\s-]{8,20}$/.test(c)) {
    const digits = c.replace(/\D/g, "");
    return `https://wa.me/${digits.length === 8 ? `852${digits}` : digits}`;
  }
  return null;
}

export default function BoardClient({
  posts,
  orgs,
}: {
  posts: BoardPost[];
  orgs: Record<string, OrgInfo>;
}) {
  const { language } = useLanguage();
  const [kind, setKind] = useState<BoardKind | "">("");
  const [category, setCategory] = useState<BoardCategory | "">("");

  const byKind = useMemo(() => posts.filter((p) => !kind || p.kind === kind), [posts, kind]);
  const visible = useMemo(() => byKind.filter((p) => !category || p.category === category), [byKind, category]);

  // Only show category chips that have something in them.
  const counts = useMemo(() => {
    const c: Partial<Record<BoardCategory, number>> = {};
    for (const p of byKind) c[p.category] = (c[p.category] || 0) + 1;
    return c;
  }, [byKind]);

  const submitHref = SUBMIT_FORM_URL || "/contact";
  const submitIsExternal = submitHref.startsWith("http");

  return (
    <div className="pt-32 pb-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-[#1E1B3A] mb-2">
            {tx("Community Board", "社區交流板", "社区交流板", language)}
          </h1>
          <p className="text-[#6B6890]">
            {tx(
              "What Hong Kong's LGBTQ+ groups are looking for, and what they can offer. Find a space, a speaker, volunteers, or people to join you.",
              "香港 LGBTQ+ 組織正在尋找甚麼，又可以提供甚麼。在這裡尋找場地、講者、義工或一同參與的人。",
              "香港 LGBTQ+ 组织正在寻找什么，又可以提供什么。在这里寻找场地、讲者、义工或一同参与的人。",
              language
            )}
          </p>
        </div>
        <a
          href={submitHref}
          target={submitIsExternal ? "_blank" : undefined}
          rel={submitIsExternal ? "noopener noreferrer" : undefined}
          className="self-start md:self-auto shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#7B68EE] hover:bg-[#6B5CE7] active:scale-[0.96] text-white rounded-lg font-semibold text-sm transition-[colors,transform] duration-150"
        >
          {tx("Post an ask or offer", "發佈需求或提供", "发布需求或提供", language)} →
        </a>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto px-6 mb-8 space-y-4">
        <div className="inline-flex p-1 rounded-lg border border-[#E8E6F0] bg-white" role="tablist">
          {KINDS.map((k) => (
            <button
              key={k.id || "all"}
              role="tab"
              aria-selected={kind === k.id}
              onClick={() => setKind(k.id)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                kind === k.id ? "bg-[#7B68EE] text-white" : "text-[#6B6890] hover:text-[#7B68EE]"
              }`}
            >
              {label(k.label, language)}
            </button>
          ))}
        </div>

        {byKind.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <Chip active={!category} onClick={() => setCategory("")}>
              {tx("All categories", "所有類別", "所有类别", language)}
            </Chip>
            {CATEGORIES.filter((c) => counts[c.id]).map((c) => (
              <Chip key={c.id} active={category === c.id} onClick={() => setCategory(category === c.id ? "" : c.id)}>
                {label(c.label, language)} <span className="opacity-60">{counts[c.id]}</span>
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="max-w-5xl mx-auto px-6">
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8E6F0] bg-white px-6 py-14 text-center">
            <p className="text-lg font-semibold text-[#1E1B3A] mb-1">
              {posts.length === 0
                ? tx("Nothing posted yet", "暫時未有內容", "暂时未有内容", language)
                : tx("Nothing matches these filters", "沒有符合篩選條件的內容", "没有符合筛选条件的内容", language)}
            </p>
            <p className="text-sm text-[#6B6890]">
              {tx(
                "Is your group looking for something, or able to offer it? Post it here for the community to see.",
                "你的組織正在尋找甚麼，或可以提供甚麼？在這裡發佈，讓社區看到。",
                "你的组织正在寻找什么，或可以提供什么？在这里发布，让社区看到。",
                language
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {visible.map((p) => (
              <PostCard key={p.id} post={p} org={orgs[p.org.toLowerCase().trim()]} language={language} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
        active ? "bg-[#7B68EE] text-white border-[#7B68EE]" : "bg-white border-[#E8E6F0] text-[#6B6890] hover:border-[#A78BFA]"
      }`}
    >
      {children}
    </button>
  );
}

function PostCard({ post, org, language }: { post: BoardPost; org?: OrgInfo; language: Language }) {
  const [expanded, setExpanded] = useState(false);
  const title = bilingualText(post.title_en, post.title_zh, language, post.title_zhHans);
  const description = bilingualText(post.description_en, post.description_zh, language, post.description_zhHans);
  const orgName = org ? bilingualText(org.name_en, org.name_zh, language, org.name_zhHans) : post.org;
  const cat = CATEGORIES.find((c) => c.id === post.category)!;
  const href = post.contact ? contactHref(post.contact) : null;
  const isAsk = post.kind === "ask";

  return (
    <article className="listing-card flex flex-col rounded-2xl border border-[#E8E6F0] bg-white p-5">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold text-white ${
            isAsk ? "bg-[#F59E0B]" : "bg-[#10B981]"
          }`}
        >
          {isAsk ? tx("Looking for", "尋找中", "寻找中", language) : tx("Offering", "提供中", "提供中", language)}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F0EEFF] text-[#7B68EE]">
          {label(cat.label, language)}
        </span>
      </div>

      <h2 className="text-lg font-bold text-[#1E1B3A] mb-1.5 whitespace-pre-line">{title}</h2>

      {/* Organisation, linked to its directory entry when it has one */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        {org?.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={org.logo} alt="" className="w-6 h-6 rounded-full object-cover border border-[#E8E6F0]" />
        )}
        {org ? (
          <Link
            href={`/directory?search=${encodeURIComponent(org.name_en)}`}
            className="font-medium text-[#7B68EE] hover:underline"
          >
            {orgName}
          </Link>
        ) : (
          <span className="font-medium text-[#6B6890]">{orgName}</span>
        )}
      </div>

      {description && (
        <div className="mb-4 flex-1">
          <p className={`text-sm text-[#6B6890] whitespace-pre-line ${expanded ? "" : "line-clamp-4"}`}>{description}</p>
          {description.length > 220 && (
            <button onClick={() => setExpanded(!expanded)} className="mt-1 text-xs font-semibold text-[#7B68EE] hover:underline">
              {expanded ? tx("Show less", "收起", "收起", language) : tx("Read more", "閱讀更多", "阅读更多", language)}
            </button>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8E6F0]">
        <p className="text-xs text-[#6B6890]">
          {post.needed_by
            ? `${isAsk ? tx("Needed by", "需要日期", "需要日期", language) : tx("Available until", "提供至", "提供至", language)}: ${formatDate(post.needed_by, language)}`
            : post.posted
            ? `${tx("Posted", "發佈於", "发布于", language)}: ${formatDate(post.posted, language)}`
            : ""}
        </p>
        <div className="flex items-center gap-2">
          {post.link && (
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-[#E8E6F0] text-xs font-semibold text-[#7B68EE] hover:border-[#A78BFA] transition-colors"
            >
              {tx("Details", "詳情", "详情", language)}
            </a>
          )}
          {post.contact &&
            (href ? (
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#7B68EE] hover:bg-[#6B5CE7] text-white text-xs font-semibold transition-colors"
              >
                {tx("Get in touch", "聯絡", "联络", language)} →
              </a>
            ) : (
              <span className="text-xs text-[#1E1B3A]">{post.contact}</span>
            ))}
        </div>
      </div>
    </article>
  );
}
