import { calculateImpactScore } from "@/lib/impact-score";
import type { PlayerWithTeam } from "@/lib/players";

export type LeaderboardEntry = {
  rank: number;
  impactScore: number;
  player: PlayerWithTeam;
};

export type LeaderboardPlayer = {
  id: string;
  name: string;
  team: {
    id: string;
    name: string;
  };
  role: PlayerWithTeam["role"];
  matchesPlayed: number;
  totalRuns: number;
  totalWickets: number;
};

export type SerializedLeaderboardEntry = {
  rank: number;
  impactScore: number;
  player: LeaderboardPlayer;
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

export function serializeLeaderboard(
  entries: LeaderboardEntry[],
): SerializedLeaderboardEntry[] {
  return entries.map(({ rank, impactScore, player }) => ({
    rank,
    impactScore,
    player: {
      id: player.id,
      name: player.name,
      team: {
        id: player.team.id,
        name: player.team.name,
      },
      role: player.role,
      matchesPlayed: player.matchesPlayed,
      totalRuns: player.totalRuns,
      totalWickets: player.totalWickets,
    },
  }));
}
