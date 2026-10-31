import { z } from "zod";
import { PLAYER_ROLES } from "@/lib/player-constants";

function toNumber(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : Number(trimmed);
  }

  return value;
}

const basePriceSchema = z.preprocess(
  toNumber,
  z
    .number({ error: "Base price must be a number." })
    .finite("Base price must be a valid number.")
    .min(0, "Base price cannot be negative.")
    .max(9_999_999_999.99, "Base price is too large."),
);

const matchesPlayedSchema = z.preprocess(
  toNumber,
  z
    .number({ error: "Matches played must be a number." })
    .int("Matches played must be a whole number.")
    .min(0, "Matches played cannot be negative.")
    .max(2_147_483_647, "Matches played is too large."),
);

const totalRunsSchema = z.preprocess(
  toNumber,
  z
    .number({ error: "Total runs must be a number." })
    .int("Total runs must be a whole number.")
    .min(0, "Total runs cannot be negative.")
    .max(2_147_483_647, "Total runs is too large."),
);

const totalWicketsSchema = z.preprocess(
  toNumber,
  z
    .number({ error: "Total wickets must be a number." })
    .int("Total wickets must be a whole number.")
    .min(0, "Total wickets cannot be negative.")
    .max(2_147_483_647, "Total wickets is too large."),
);

export const playerInputSchema = z.object({
  name: z
    .string({ error: "Player name is required." })
    .trim()
    .min(2, "Player name must be at least 2 characters.")
    .max(100, "Player name must be at most 100 characters."),
  role: z.enum(PLAYER_ROLES, { error: "Select a valid player role." }),
  basePrice: basePriceSchema,
  matchesPlayed: matchesPlayedSchema,
  totalRuns: totalRunsSchema,
  totalWickets: totalWicketsSchema,
  teamId: z
    .string({ error: "Select a team." })
    .trim()
    .min(1, "Select a team."),
});

export type PlayerInput = z.infer<typeof playerInputSchema>;

const optionalTeamIdSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().optional(),
);

const optionalRoleSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.enum(PLAYER_ROLES, { error: "Select a valid player role." }).optional(),
);

export const playerFilterSchema = z.object({
  teamId: optionalTeamIdSchema,
  role: optionalRoleSchema,
});

export type PlayerFilters = z.infer<typeof playerFilterSchema>;
