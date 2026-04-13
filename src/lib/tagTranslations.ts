import type { Language } from "./i18n";
import { isZh } from "./i18n";

const tagMap: Record<string, { zh: string; zhHans: string }> = {
  "advocacy": { zh: "倡議", zhHans: "倡议" },
  "appointment-only": { zh: "需預約", zhHans: "需预约" },
  "arts": { zh: "藝術", zhHans: "艺术" },
  "asexual-aromantic": { zh: "無性戀/無浪漫", zhHans: "无性恋/无浪漫" },
  "bar": { zh: "酒吧", zhHans: "酒吧" },
  "beach": { zh: "海灘", zhHans: "海滩" },
  "bisexual": { zh: "雙性戀", zhHans: "双性恋" },
  "cafe": { zh: "咖啡店", zhHans: "咖啡店" },
  "cantonese": { zh: "粵語", zhHans: "粤语" },
  "domestic-violence": { zh: "家暴支援", zhHans: "家暴支援" },
  "donations": { zh: "接受捐款", zhHans: "接受捐款" },
  "drag": { zh: "變裝", zhHans: "变装" },
  "education": { zh: "教育", zhHans: "教育" },
  "elderly": { zh: "長者", zhHans: "长者" },
  "emergency": { zh: "緊急", zhHans: "紧急" },
  "english": { zh: "英語", zhHans: "英语" },
  "entertainment": { zh: "娛樂", zhHans: "娱乐" },
  "family-friendly": { zh: "適合家庭", zhHans: "适合家庭" },
  "family-planning": { zh: "家庭計劃", zhHans: "家庭计划" },
  "fitness": { zh: "健身", zhHans: "健身" },
  "harm-reduction": { zh: "減害", zhHans: "减害" },
  "hobby": { zh: "興趣", zhHans: "兴趣" },
  "legal-aid": { zh: "法律援助", zhHans: "法律援助" },
  "lgbtq-friendly": { zh: "LGBTQ+ 友善", zhHans: "LGBTQ+ 友善" },
  "lgbtq-led": { zh: "LGBTQ+ 主導", zhHans: "LGBTQ+ 主导" },
  "men": { zh: "男性", zhHans: "男性" },
  "mental-health": { zh: "精神健康", zhHans: "精神健康" },
  "multilingual": { zh: "多語言", zhHans: "多语言" },
  "non-alcoholic": { zh: "無酒精", zhHans: "无酒精" },
  "party": { zh: "派對", zhHans: "派对" },
  "pet-friendly": { zh: "寵物友善", zhHans: "宠物友善" },
  "prep-provider": { zh: "PrEP 提供者", zhHans: "PrEP 提供者" },
  "professional": { zh: "專業", zhHans: "专业" },
  "religion": { zh: "宗教", zhHans: "宗教" },
  "restaurant": { zh: "餐廳", zhHans: "餐厅" },
  "sauna": { zh: "桑拿", zhHans: "桑拿" },
  "sexual-health": { zh: "性健康", zhHans: "性健康" },
  "shelter": { zh: "庇護所", zhHans: "庇护所" },
  "sliding-scale-fees": { zh: "浮動收費", zhHans: "浮动收费" },
  "social": { zh: "社交", zhHans: "社交" },
  "sports": { zh: "運動", zhHans: "运动" },
  "sti-testing": { zh: "性病檢測", zhHans: "性病检测" },
  "telehealth-available": { zh: "可遙距診症", zhHans: "可远程诊疗" },
  "transgender": { zh: "跨性別", zhHans: "跨性别" },
  "university": { zh: "大學", zhHans: "大学" },
  "volunteering": { zh: "義工", zhHans: "义工" },
  "walk-in": { zh: "免預約", zhHans: "免预约" },
  "women": { zh: "女性", zhHans: "女性" },
};

export function translateTag(tag: string, language: Language): string {
  if (!isZh(language)) return tag;
  const entry = tagMap[tag];
  if (!entry) return tag;
  return language === "zh-Hans" ? entry.zhHans : entry.zh;
}
