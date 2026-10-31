import {
  buildLeaderboard,
  serializeLeaderboard,
  type LeaderboardEntry,
  type SerializedLeaderboardEntry,
} from "@/lib/leaderboard";
import { getPaginationMeta, type PaginationMeta } from "@/lib/pagination";
import { listPlayers } from "@/lib/players";

export type PaginatedLeaderboard = PaginationMeta & {
  entries: LeaderboardEntry[];
};

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const players = await listPlayers();

  return buildLeaderboard(players);
}

export async function getLeaderboardPage(
  { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {},
): Promise<PaginatedLeaderboard> {
  const leaderboard = await getLeaderboard();
  const meta = getPaginationMeta(leaderboard.length, page, pageSize);
  const entries = leaderboard.slice(
    (meta.page - 1) * meta.pageSize,
    meta.page * meta.pageSize,
  );

  return {
    ...meta,
    entries,
  };
}

export async function getSerializedLeaderboard(): Promise<
  SerializedLeaderboardEntry[]
> {
  const leaderboard = await getLeaderboard();

  return serializeLeaderboard(leaderboard);
}
