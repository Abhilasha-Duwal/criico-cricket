import { describe, expect, it } from "vitest";
import { matchInputSchema } from "./match";

const validMatch = {
  teamAId: "team-a",
  teamBId: "team-b",
  winnerId: "team-a",
  performances: [
    { playerId: "player-1", runs: 42, wickets: 1 },
    { playerId: "player-2", runs: 10, wickets: 3 },
  ],
};

function parse(overrides: Record<string, unknown> = {}) {
  return matchInputSchema.safeParse({
    ...validMatch,
    ...overrides,
  });
}

describe("matchInputSchema", () => {
  it("accepts a valid match with a winner", () => {
    const result = parse();

    expect(result.success).toBe(true);
  });

  it("accepts no winner and an empty performance list", () => {
    const result = parse({
      winnerId: null,
      performances: [],
    });

    expect(result.success).toBe(true);
  });

  it("accepts numeric strings for runs and wickets", () => {
    const result = parse({
      performances: [{ playerId: "player-1", runs: "12", wickets: "2" }],
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.performances[0]).toEqual({
        playerId: "player-1",
        runs: 12,
        wickets: 2,
      });
    }
  });

  it("rejects a team playing against itself", () => {
    const result = parse({ teamBId: "team-a" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ["teamBId"] }),
        ]),
      );
    }
  });

  it("rejects a winner that is not a participating team", () => {
    const result = parse({ winnerId: "team-c" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ["winnerId"] }),
        ]),
      );
    }
  });

  it("rejects negative runs and wickets", () => {
    const result = parse({
      performances: [{ playerId: "player-1", runs: -1, wickets: -2 }],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ["performances", 0, "runs"] }),
          expect.objectContaining({ path: ["performances", 0, "wickets"] }),
        ]),
      );
    }
  });

  it("rejects duplicate player performances", () => {
    const result = parse({
      performances: [
        { playerId: "player-1", runs: 10, wickets: 1 },
        { playerId: "player-1", runs: 20, wickets: 2 },
      ],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["performances", 1, "playerId"],
          }),
        ]),
      );
    }
  });

  it("rejects an invalid client request ID", () => {
    const result = parse({ clientRequestId: "not-a-uuid" });

    expect(result.success).toBe(false);
  });
});
