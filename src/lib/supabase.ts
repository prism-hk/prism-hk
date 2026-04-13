import { createClient } from "@supabase/supabase-js";

// Server-side client with service key (for sync operations)
export function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

// Browser-side client with anon key (for reading published listings)
export function getBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type Listing = {
  id: string;
  sheet_row_id: number;
  status: string;
  name_en: string;
  name_zh: string | null;
  category: string;
  tags: string[];
  price: string | null;
  district_en: string | null;
  district_zh: string | null;
  region: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  hours: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  description_en: string | null;
  description_zh: string | null;
  logo: string | null;
  verified: boolean;
  last_checked: string | null;
  synced_at: string;
  created_at: string;
};

export async function getPublishedListings(): Promise<Listing[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "Published")
    .order("category")
    .order("name_en");

  if (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
  return data || [];
}

export async function getListingsByCategory(category: string): Promise<Listing[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "Published")
    .eq("category", category)
    .order("name_en");

  if (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
  return data || [];
}

export async function getListingsCount(): Promise<number> {
  const supabase = getServiceClient();
  const { count } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("status", "Published");
  return count || 0;
}

export async function getCategoryStats(): Promise<{ category: string; count: number }[]> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("listings")
    .select("category")
    .eq("status", "Published");

  if (!data) return [];

  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.category] = (counts[row.category] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getDistinctTags(): Promise<string[]> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("listings")
    .select("tags")
    .eq("status", "Published");

  if (!data) return [];
  const allTags = data
    .flatMap((r) => r.tags || [])
    .filter(Boolean);
  return [...new Set(allTags)].sort();
}

export async function getDistinctPrices(): Promise<string[]> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("listings")
    .select("price")
    .eq("status", "Published")
    .not("price", "is", null);

  if (!data) return [];
  const prices = [...new Set(data.map((r) => r.price).filter(Boolean))] as string[];
  return prices.sort();
}

export async function getDistinctDistricts(): Promise<string[]> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("listings")
    .select("district_en")
    .eq("status", "Published")
    .not("district_en", "is", null);

  if (!data) return [];
  // Split comma-separated districts into individual tags
  const allDistricts = data
    .map((r) => r.district_en)
    .filter(Boolean)
    .flatMap((d: string) => d.split(",").map((s: string) => s.trim()))
    .filter(Boolean);
  return [...new Set(allDistricts)].sort();
}
