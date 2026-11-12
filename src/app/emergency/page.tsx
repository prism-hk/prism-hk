import { getServiceClient } from "@/lib/supabase";
import EmergencyClient from "./EmergencyClient";

export const revalidate = 3600; // 1 hour; use /api/refresh after editing the Sheet

export const metadata = {
  title: "Emergency Services — PRISM HK 緊急服務",
  description: "Emergency and crisis support services for the LGBTQ+ community in Hong Kong. 香港 LGBTQ+ 社區緊急及危機支援服務。",
};

export default async function EmergencyPage() {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "Published")
    .or("tags.cs.{emergency-services},tags.cs.{sti-testing}")
    .order("name_en");

  return <EmergencyClient listings={data || []} />;
}
