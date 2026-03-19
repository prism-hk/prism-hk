import { NextRequest, NextResponse } from "next/server";
import { syncFromSheets } from "@/lib/sync";
import { syncEmergencyServices } from "@/lib/emergency";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  // Verify cron secret or allow manual trigger
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const sheetName = (body as { sheetName?: string }).sheetName || undefined;

    const [listingsResult, emergencyResult] = await Promise.all([
      syncFromSheets(sheetName),
      syncEmergencyServices(),
    ]);

    // Revalidate pages that show listings
    revalidatePath("/directory");
    revalidatePath("/health");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      listings: listingsResult,
      emergency: emergencyResult,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Also support GET for easy testing
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && secret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [listingsResult, emergencyResult] = await Promise.all([
      syncFromSheets(),
      syncEmergencyServices(),
    ]);

    revalidatePath("/directory");
    revalidatePath("/health");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      listings: listingsResult,
      emergency: emergencyResult,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
