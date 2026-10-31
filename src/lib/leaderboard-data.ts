import {
  buildLeaderboard,
  serializeLeaderboard,
  type LeaderboardEntry,
  type SerializedLeaderboardEntry,
} from "@/lib/leaderboard";
import { listPlayers } from "@/lib/players";

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const players = await listPlayers();

  return buildLeaderboard(players);
}

export async function getSerializedLeaderboard(): Promise<
  SerializedLeaderboardEntry[]
> {
  const leaderboard = await getLeaderboard();

  return serializeLeaderboard(leaderboard);
}
