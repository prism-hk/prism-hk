import { NextRequest, NextResponse } from "next/server";
import { runEventScraper } from "@/lib/scrapeEvents";
import { revalidatePath } from "next/cache";

export const maxDuration = 300;

async function handle(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const querySecret = request.nextUrl.searchParams.get("secret");
  const authorised =
    !cronSecret ||
    authHeader === `Bearer ${cronSecret}` ||
    querySecret === cronSecret;
  if (!authorised) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runEventScraper();
    revalidatePath("/events");
    revalidatePath("/");
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
