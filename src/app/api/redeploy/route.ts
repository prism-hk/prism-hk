import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Verify auth
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hookUrl = process.env.DEPLOY_HOOK_URL;
  if (!hookUrl) {
    return NextResponse.json(
      { success: false, error: "DEPLOY_HOOK_URL not configured in environment variables" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(hookUrl, { method: "POST" });
    const data = await res.json();

    return NextResponse.json({
      success: true,
      deployId: data?.job?.id || data?.id || null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to trigger redeploy",
      },
      { status: 500 }
    );
  }
}
