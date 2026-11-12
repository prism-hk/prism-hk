import type { Metadata } from "next";
import { getArticles } from "@/lib/articles";
import ResourcesClient from "./ResourcesClient";

export const revalidate = 3600; // 1 hour; use /api/refresh after editing the Sheet

export const metadata: Metadata = {
  title: "Educational Resources — PRISM HK 教育資源",
  description: "LGBTQ+ educational resources for Hong Kong. 香港 LGBTQ+ 教育資源。",
};

export default async function ResourcesPage() {
  const groups = await getArticles();
  return <ResourcesClient groups={groups} />;
}
