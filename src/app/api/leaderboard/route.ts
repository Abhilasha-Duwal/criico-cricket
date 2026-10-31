import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { buildLeaderboard } from "@/lib/leaderboard";
import { listPlayers, serializePlayer } from "@/lib/players";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getCurrentUser())) {
    return apiError("Authentication required.", 401);
  }

  try {
    const players = await listPlayers();
    const leaderboard = buildLeaderboard(players);

    return NextResponse.json({
      leaderboard: leaderboard.map(({ rank, impactScore, player }) => ({
        rank,
        impactScore,
        player: serializePlayer(player),
      })),
    });
  } catch (error) {
    console.error("Load leaderboard failed:", error);

    return apiError("Unable to load leaderboard. Please try again.", 500);
  }
}
