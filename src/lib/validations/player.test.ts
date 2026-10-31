import { describe, expect, it } from "vitest";
import {
  NEGATIVE_TOTAL_RUNS_MESSAGE,
  playerInputSchema,
} from "./player";

const validPlayer = {
  name: "Test Player",
  role: "BATTER",
  basePrice: "100.00",
  matchesPlayed: "10",
  totalRuns: "250",
  totalWickets: "3",
  teamId: "team-1",
};

function parse(overrides: Record<string, unknown> = {}) {
  return playerInputSchema.safeParse({
    ...validPlayer,
    ...overrides,
  });
}

describe("playerInputSchema", () => {
  it("accepts valid player values", () => {
    const result = parse();

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.basePrice).toBe(100);
      expect(result.data.matchesPlayed).toBe(10);
      expect(result.data.totalRuns).toBe(250);
      expect(result.data.totalWickets).toBe(3);
    }
  });

  it("rejects negative total runs with the required message", () => {
    const result = parse({ totalRuns: "-1" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["totalRuns"],
            message: NEGATIVE_TOTAL_RUNS_MESSAGE,
          }),
        ]),
      );
    }
  });

  it("rejects negative matches played", () => {
    const result = parse({ matchesPlayed: "-1" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["matchesPlayed"],
            message: "Matches played cannot be negative.",
          }),
        ]),
      );
    }
  });

  it("rejects negative total wickets", () => {
    const result = parse({ totalWickets: "-1" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["totalWickets"],
            message: "Total wickets cannot be negative.",
          }),
        ]),
      );
    }
  });

  it("rejects negative base price", () => {
    const result = parse({ basePrice: "-0.01" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["basePrice"],
            message: "Base price cannot be negative.",
          }),
        ]),
      );
    }
  });
});
