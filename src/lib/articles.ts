const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1zKolQNmY8g_oDPBPiiQLmFeNC6KFmz7xXCNgBvAtWhY";
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

export type Article = {
  topic: string;
  title_en: string;
  title_zh: string | null;
  title_zhHans: string | null;
  language: string; // "English", "Chinese", "English, Chinese"
  url: string;
  tags: string[];
};

export type ArticleGroup = {
  topic: string;
  articles: Article[];
};

const TOPIC_EMOJIS: Record<string, string> = {
  "LGBTQ+ Concepts": "🏳️‍🌈",
  "Know Your Rights": "⚖️",
  "Coming Out Resources": "💬",
  "Sexual Health": "❤️",
  "Mental Health & Wellbeing": "🧠",
  "Transgender Resources": "🏳️‍⚧️",
  "For Allies & Families": "🤝",
  "Workplace Inclusion": "💼",
  "Family Planning": "👨‍👩‍👧",
};

export function getTopicEmoji(topic: string): string {
  return TOPIC_EMOJIS[topic] || "📚";
}

// Canonical display order for Educational Resources sections, regardless of
// sheet row order. Workplace Inclusion is pinned last per Blake's request.
const TOPIC_ORDER = [
  "LGBTQ+ Concepts",
  "Know Your Rights",
  "Coming Out Resources",
  "Sexual Health",
  "Mental Health & Wellbeing",
  "Transgender Resources",
  "For Allies & Families",
  "Family Planning",
  "Workplace Inclusion",
];

function topicRank(topic: string): number {
  const i = TOPIC_ORDER.indexOf(topic);
  // Workplace Inclusion always sorts last. Unknown topics fall just before it.
  if (i === -1) return TOPIC_ORDER.length - 0.5;
  return i;
}

export async function getArticles(): Promise<ArticleGroup[]> {
  if (!API_KEY) return [];

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Articles?key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];

    const data = await res.json();
    const rows: string[][] = data.values || [];
    if (rows.length < 2) return [];

    const headers = rows[0].map((h: string) => h.toLowerCase().trim());

    // Group by topic, preserving order of first appearance. A topic row with no
    // URL still registers an (empty) group so the section renders with a
    // "coming soon" note rather than disappearing entirely.
    const groups: ArticleGroup[] = [];
    const seen = new Map<string, ArticleGroup>();

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const get = (col: string) => {
        const idx = headers.findIndex((h: string) => h.includes(col));
        return idx >= 0 ? (row[idx] || "").trim() : "";
      };

      const topic = get("topic");
      if (!topic) continue;

      let group = seen.get(topic);
      if (!group) {
        group = { topic, articles: [] };
        seen.set(topic, group);
        groups.push(group);
      }

      const url = get("url");
      if (!url) continue;

      group.articles.push({
        topic,
        title_en: get("title (english)") || get("title"),
        title_zh: get("title (traditional chinese)") || null,
        title_zhHans: get("title (simplified chinese)") || null,
        language: get("language"),
        url,
        tags: (get("tags") || "").split(",").map((t: string) => t.trim()).filter(Boolean),
      });
    }

    groups.sort((a, b) => topicRank(a.topic) - topicRank(b.topic));

    return groups;
  } catch (e) {
    console.error("Error fetching articles:", e);
    return [];
  }
}
