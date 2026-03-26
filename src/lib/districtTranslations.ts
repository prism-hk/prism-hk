import type { Language } from "./i18n";
import { isZh } from "./i18n";

const districtMap: Record<string, { zh: string; zhHans: string }> = {
  // Hong Kong Island
  "Central and Western": { zh: "中西區", zhHans: "中西区" },
  "Eastern": { zh: "東區", zhHans: "东区" },
  "Southern": { zh: "南區", zhHans: "南区" },
  "Wan Chai": { zh: "灣仔區", zhHans: "湾仔区" },
  // Kowloon
  "Kowloon City": { zh: "九龍城區", zhHans: "九龙城区" },
  "Yau Tsim Mong": { zh: "油尖旺區", zhHans: "油尖旺区" },
  "Sham Shui Po": { zh: "深水埗區", zhHans: "深水埗区" },
  "Wong Tai Sin": { zh: "黃大仙區", zhHans: "黄大仙区" },
  "Kwun Tong": { zh: "觀塘區", zhHans: "观塘区" },
  // New Territories
  "Tai Po": { zh: "大埔區", zhHans: "大埔区" },
  "Yuen Long": { zh: "元朗區", zhHans: "元朗区" },
  "Tuen Mun": { zh: "屯門區", zhHans: "屯门区" },
  "North": { zh: "北區", zhHans: "北区" },
  "Sai Kung": { zh: "西貢區", zhHans: "西贡区" },
  "Sha Tin": { zh: "沙田區", zhHans: "沙田区" },
  "Tsuen Wan": { zh: "荃灣區", zhHans: "荃湾区" },
  "Kwai Tsing": { zh: "葵青區", zhHans: "葵青区" },
  "Islands": { zh: "離島區", zhHans: "离岛区" },
  // Extra values in the data
  "Online": { zh: "線上", zhHans: "线上" },
  "Lantau Island": { zh: "大嶼山", zhHans: "大屿山" },
};

/**
 * Translate a district string, handling comma-separated multi-district values.
 */
export function translateDistrict(district: string, language: Language): string {
  if (!isZh(language)) return district;

  // Handle comma-separated districts
  if (district.includes(",")) {
    return district
      .split(",")
      .map((d) => d.trim())
      .map((d) => translateSingle(d, language))
      .join("、");
  }

  return translateSingle(district, language);
}

function translateSingle(district: string, language: Language): string {
  const entry = districtMap[district];
  if (!entry) return district;
  return language === "zh-Hans" ? entry.zhHans : entry.zh;
}
