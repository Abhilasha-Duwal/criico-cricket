import { describe, expect, it } from "vitest";
import { calculateImpactScore } from "./impact-score";

describe("calculateImpactScore", () => {
  it("calculates a normal batter score with the batter run multiplier", () => {
    expect(
      calculateImpactScore({
        role: "BATTER",
        runs: 100,
        wickets: 2,
        matchesPlayed: 10,
      }),
    ).toBeCloseTo(196);
  });

  it("applies the bowler wicket multiplier", () => {
    expect(
      calculateImpactScore({
        role: "BOWLER",
        runs: 20,
        wickets: 3,
        matchesPlayed: 10,
      }),
    ).toBeCloseTo(114);
  });

  it("adds the wicketkeeper bonus without applying the bowler multiplier", () => {
    expect(
      calculateImpactScore({
        role: "WICKET_KEEPER",
        runs: 10,
        wickets: 5,
        matchesPlayed: 10,
      }),
    ).toBeCloseTo(142);
  });

  it("subtracts 50 below five matches and adds 100 above twenty matches", () => {
    expect(
      calculateImpactScore({
        role: "BATTER",
        runs: 100,
        wickets: 2,
        matchesPlayed: 4,
      }),
    ).toBeCloseTo(146);

    expect(
      calculateImpactScore({
        role: "BATTER",
        runs: 100,
        wickets: 2,
        matchesPlayed: 21,
      }),
    ).toBeCloseTo(296);
  });

  it("uses no experience adjustment at exactly five and exactly twenty matches", () => {
    expect(
      calculateImpactScore({
        role: "BATTER",
        runs: 100,
        wickets: 2,
        matchesPlayed: 5,
      }),
    ).toBeCloseTo(196);

    expect(
      calculateImpactScore({
        role: "BATTER",
        runs: 100,
        wickets: 2,
        matchesPlayed: 20,
      }),
    ).toBeCloseTo(196);
  });

  it("uses the normal base formula for all-rounders", () => {
    expect(
      calculateImpactScore({
        role: "ALL_ROUNDER",
        runs: 100,
        wickets: 2,
        matchesPlayed: 10,
      }),
    ).toBeCloseTo(160);
  });

  it("returns zero for invalid input", () => {
    expect(
      calculateImpactScore({
        role: "BATTER",
        runs: Number.NaN,
        wickets: 2,
        matchesPlayed: 10,
      }),
    ).toBe(0);

    expect(
      calculateImpactScore({
        role: "BATTER",
        runs: 100,
        wickets: -1,
        matchesPlayed: 10,
      }),
    ).toBe(0);

    expect(
      calculateImpactScore({
        role: "CAPTAIN" as never,
        runs: 100,
        wickets: 2,
        matchesPlayed: 10,
      }),
    ).toBe(0);

    expect(calculateImpactScore(undefined as never)).toBe(0);
  });
});
