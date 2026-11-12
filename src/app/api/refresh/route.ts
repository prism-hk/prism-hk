import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Refreshes every page that reads from the Google Sheet (events, board,
// articles, listings). Pages otherwise refresh hourly, so call this after
// editing the Sheet to see changes straight away.
//   Bookmarkable: /api/refresh?secret=YOUR_CRON_SECRET
const PATHS = ["/", "/events", "/events.ics", "/board", "/directory", "/health", "/emergency", "/learn/resources"];

function authorised(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true;
  const header = request.headers.get("authorization");
  const query = request.nextUrl.searchParams.get("secret");
  return header === `Bearer ${cronSecret}` || query === cronSecret;
}

function refresh(request: NextRequest) {
  if (!authorised(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  for (const path of PATHS) revalidatePath(path);
  return NextResponse.json({ success: true, refreshed: PATHS });
}

export const GET = refresh;
export const POST = refresh;
