import { z } from "zod";

const MAX_STAT_VALUE = 2_147_483_647;

function toNumber(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : Number(trimmed);
  }

  return value;
}

const clientRequestIdSchema = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z
    .string()
    .uuid("Request ID must be a valid UUID.")
    .transform((value) => value.toLowerCase())
    .optional(),
);

const winnerIdSchema = z.preprocess(
  (value) => (value === "" || value === null ? null : value),
  z
    .string({ error: "Select a valid winning team." })
    .trim()
    .min(1, "Select a valid winning team.")
    .nullable()
    .optional(),
);

const performanceSchema = z.object({
  playerId: z
    .string({ error: "Select a player." })
    .trim()
    .min(1, "Select a player."),
  runs: z.preprocess(
    toNumber,
    z
      .number({ error: "Runs must be a number." })
      .int("Runs must be a whole number.")
      .min(0, "Runs cannot be negative.")
      .max(MAX_STAT_VALUE, "Runs are too large."),
  ),
  wickets: z.preprocess(
    toNumber,
    z
      .number({ error: "Wickets must be a number." })
      .int("Wickets must be a whole number.")
      .min(0, "Wickets cannot be negative.")
      .max(MAX_STAT_VALUE, "Wickets are too large."),
  ),
});

export const matchInputSchema = z
  .object({
    clientRequestId: clientRequestIdSchema,
    teamAId: z
      .string({ error: "Select the first team." })
      .trim()
      .min(1, "Select the first team."),
    teamBId: z
      .string({ error: "Select the second team." })
      .trim()
      .min(1, "Select the second team."),
    winnerId: winnerIdSchema,
    performances: z.array(performanceSchema).max(200).default([]),
  })
  .superRefine((data, context) => {
    if (data.teamAId === data.teamBId) {
      context.addIssue({
        code: "custom",
        path: ["teamBId"],
        message: "Choose two different teams.",
      });
    }

    if (
      data.winnerId &&
      data.winnerId !== data.teamAId &&
      data.winnerId !== data.teamBId
    ) {
      context.addIssue({
        code: "custom",
        path: ["winnerId"],
        message: "Winner must be one of the participating teams.",
      });
    }

    const seenPlayerIds = new Set<string>();

    data.performances.forEach((performance, index) => {
      if (seenPlayerIds.has(performance.playerId)) {
        context.addIssue({
          code: "custom",
          path: ["performances", index, "playerId"],
          message: "This player already has a performance in this match.",
        });
      }

      seenPlayerIds.add(performance.playerId);
    });
  });

export type MatchInput = z.infer<typeof matchInputSchema>;
