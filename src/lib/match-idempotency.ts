import { createHash } from "node:crypto";
import type { MatchInput } from "@/lib/validations/match";

export type MatchRequestSnapshot = {
  teamAId: string;
  teamBId: string;
  winnerId: string | null;
  performances: Array<{
    playerId: string;
    runs: number;
    wickets: number;
  }>;
};

function comparePerformances(
  left: MatchRequestSnapshot["performances"][number],
  right: MatchRequestSnapshot["performances"][number],
) {
  if (left.playerId < right.playerId) {
    return -1;
  }

  if (left.playerId > right.playerId) {
    return 1;
  }

  return 0;
}

function normalizeSnapshot(input: MatchInput): MatchRequestSnapshot {
  return {
    teamAId: input.teamAId,
    teamBId: input.teamBId,
    winnerId: input.winnerId ?? null,
    performances: [...input.performances]
      .map((performance) => ({
        playerId: performance.playerId,
        runs: performance.runs,
        wickets: performance.wickets,
      }))
      .sort(comparePerformances),
  };
}

export function buildMatchRequestId(input: MatchInput): string {
  if (input.clientRequestId) {
    return input.clientRequestId;
  }

  const snapshot = normalizeSnapshot(input);
  const digest = createHash("sha256")
    .update(JSON.stringify({ version: 1, ...snapshot }))
    .digest("hex");

  return `match_${digest}`;
}

export function matchRequestMatchesExisting(
  input: MatchInput,
  existing: MatchRequestSnapshot,
): boolean {
  const requested = normalizeSnapshot(input);
  const saved: MatchRequestSnapshot = {
    teamAId: existing.teamAId,
    teamBId: existing.teamBId,
    winnerId: existing.winnerId ?? null,
    performances: [...existing.performances]
      .map((performance) => ({
        playerId: performance.playerId,
        runs: performance.runs,
        wickets: performance.wickets,
      }))
      .sort(comparePerformances),
  };

  return JSON.stringify(requested) === JSON.stringify(saved);
}
