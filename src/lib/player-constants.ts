export const PLAYER_ROLES = [
  "BATTER",
  "BOWLER",
  "ALL_ROUNDER",
  "WICKET_KEEPER",
] as const;

export type PlayerRoleValue = (typeof PLAYER_ROLES)[number];

export const PLAYER_ROLE_LABELS: Record<PlayerRoleValue, string> = {
  BATTER: "Batter",
  BOWLER: "Bowler",
  ALL_ROUNDER: "All-rounder",
  WICKET_KEEPER: "Wicket keeper",
};

export const PLAYER_ROLE_BADGE_CLASSES: Record<PlayerRoleValue, string> = {
  BATTER: "border-emerald-800 bg-emerald-950/60 text-emerald-300",
  BOWLER: "border-sky-800 bg-sky-950/60 text-sky-300",
  ALL_ROUNDER: "border-amber-800 bg-amber-950/60 text-amber-300",
  WICKET_KEEPER: "border-violet-800 bg-violet-950/60 text-violet-300",
};

export function isPlayerRole(value: string): value is PlayerRoleValue {
  return (PLAYER_ROLES as readonly string[]).includes(value);
}
