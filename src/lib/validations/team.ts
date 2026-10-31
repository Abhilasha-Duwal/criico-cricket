import { z } from "zod";

export const teamInputSchema = z.object({
  name: z
    .string({ error: "Team name is required." })
    .trim()
    .min(2, "Team name must be at least 2 characters.")
    .max(80, "Team name must be at most 80 characters."),
});

export type TeamInput = z.infer<typeof teamInputSchema>;
