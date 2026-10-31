import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { getSerializedLeaderboard } from "@/lib/leaderboard-data";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getCurrentUser())) {
    return apiError("Authentication required.", 401);
  }

  try {
    const leaderboard = await getSerializedLeaderboard();

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Load leaderboard failed:", error);

    return apiError("Unable to load leaderboard. Please try again.", 500);
  }
}
