import { calculateImpactScore } from "@/lib/impact-score";
import type { PlayerWithTeam } from "@/lib/players";

export type LeaderboardEntry = {
  rank: number;
  impactScore: number;
  player: PlayerWithTeam;
};

export function buildLeaderboard(
  players: PlayerWithTeam[],
): LeaderboardEntry[] {
  return players
    .map((player) => ({
      player,
      impactScore: calculateImpactScore({
        role: player.role,
        runs: player.totalRuns,
        wickets: player.totalWickets,
        matchesPlayed: player.matchesPlayed,
      }),
    }))
    .sort(
      (left, right) =>
        right.impactScore - left.impactScore ||
        left.player.name.localeCompare(right.player.name),
    )
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}
