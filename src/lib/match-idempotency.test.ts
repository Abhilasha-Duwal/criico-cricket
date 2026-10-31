import { describe, expect, it } from "vitest";
import {
  buildMatchRequestId,
  matchRequestMatchesExisting,
} from "./match-idempotency";
import type { MatchInput } from "./validations/match";

const baseInput: MatchInput = {
  teamAId: "team-a",
  teamBId: "team-b",
  winnerId: "team-a",
  performances: [
    { playerId: "player-1", runs: 42, wickets: 1 },
    { playerId: "player-2", runs: 10, wickets: 3 },
  ],
};

describe("buildMatchRequestId", () => {
  it("uses the client request ID when supplied", () => {
    const clientRequestId = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";

    expect(
      buildMatchRequestId({
        ...baseInput,
        clientRequestId,
      }),
    ).toBe(clientRequestId);
  });

  it("is deterministic regardless of performance order", () => {
    const reversed = {
      ...baseInput,
      performances: [...baseInput.performances].reverse(),
    };

    expect(buildMatchRequestId(baseInput)).toBe(
      buildMatchRequestId(reversed),
    );
  });

  it("changes when a performance changes", () => {
    const changed = {
      ...baseInput,
      performances: [
        { playerId: "player-1", runs: 43, wickets: 1 },
        { playerId: "player-2", runs: 10, wickets: 3 },
      ],
    };

    expect(buildMatchRequestId(baseInput)).not.toBe(
      buildMatchRequestId(changed),
    );
  });

  it("changes when the winner changes", () => {
    expect(buildMatchRequestId(baseInput)).not.toBe(
      buildMatchRequestId({ ...baseInput, winnerId: null }),
    );
  });
});

describe("matchRequestMatchesExisting", () => {
  it("matches an existing match with reordered performances", () => {
    expect(
      matchRequestMatchesExisting(baseInput, {
        teamAId: "team-a",
        teamBId: "team-b",
        winnerId: "team-a",
        performances: [...baseInput.performances].reverse(),
      }),
    ).toBe(true);
  });

  it("does not match different performance totals", () => {
    expect(
      matchRequestMatchesExisting(baseInput, {
        teamAId: "team-a",
        teamBId: "team-b",
        winnerId: "team-a",
        performances: [
          { playerId: "player-1", runs: 99, wickets: 1 },
          { playerId: "player-2", runs: 10, wickets: 3 },
        ],
      }),
    ).toBe(false);
  });
});
