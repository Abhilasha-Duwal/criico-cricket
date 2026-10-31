import type { PlayerRole } from "@prisma/client";

const PLAYER_ROLES: readonly PlayerRole[] = [
  "BATTER",
  "BOWLER",
  "ALL_ROUNDER",
  "WICKET_KEEPER",
];

export type ImpactScoreInput = {
  role: PlayerRole;
  runs: number;
  wickets: number;
  matchesPlayed: number;
};

function isValidRole(value: unknown): value is PlayerRole {
  return (
    typeof value === "string" &&
    (PLAYER_ROLES as readonly string[]).includes(value)
  );
}

function toNonNegativeNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }

  return value;
}

export function calculateImpactScore(input: ImpactScoreInput): number {
  if (!input || !isValidRole(input.role)) {
    return 0;
  }

  const runs = toNonNegativeNumber(input.runs);
  const wickets = toNonNegativeNumber(input.wickets);
  const matchesPlayed = toNonNegativeNumber(input.matchesPlayed);

  if (runs === null || wickets === null || matchesPlayed === null) {
    return 0;
  }

  let score = runs * 1.2 + wickets * 20;

  if (input.role === "BATTER") {
    score = runs * 1.3 * 1.2 + wickets * 20;
  } else if (input.role === "BOWLER") {
    score = runs * 1.2 + wickets * 1.5 * 20;
  }

  if (matchesPlayed < 5) {
    score -= 50;
  } else if (matchesPlayed > 20) {
    score += 100;
  }

  if (input.role === "WICKET_KEEPER") {
    score += 30;
  }

  return score;
}
