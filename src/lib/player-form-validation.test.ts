import { describe, expect, it } from "vitest";
import {
  getPlayerFormErrorMessage,
  readPlayerFormValues,
  validatePlayerFormValues,
  type PlayerFormValues,
} from "./player-form-validation";
import { NEGATIVE_TOTAL_RUNS_MESSAGE } from "./validations/player";

const validValues: PlayerFormValues = {
  name: "Test Player",
  role: "BATTER",
  basePrice: "100.00",
  matchesPlayed: "10",
  totalRuns: "250",
  totalWickets: "3",
  teamId: "team-1",
};

describe("validatePlayerFormValues", () => {
  it("returns parsed numeric values for valid input", () => {
    const result = validatePlayerFormValues(validValues);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.basePrice).toBe(100);
      expect(result.data.matchesPlayed).toBe(10);
      expect(result.data.totalRuns).toBe(250);
      expect(result.data.totalWickets).toBe(3);
    }
  });

  it("returns the required toast message for negative total runs", () => {
    const result = validatePlayerFormValues({
      ...validValues,
      totalRuns: "-5",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.message).toBe(NEGATIVE_TOTAL_RUNS_MESSAGE);
      expect(result.fieldErrors.totalRuns).toContain(
        NEGATIVE_TOTAL_RUNS_MESSAGE,
      );
    }
  });

  it("returns field errors for negative matches, wickets, and base price", () => {
    const result = validatePlayerFormValues({
      ...validValues,
      basePrice: "-1",
      matchesPlayed: "-1",
      totalWickets: "-1",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.fieldErrors.basePrice).toContain(
        "Base price cannot be negative.",
      );
      expect(result.fieldErrors.matchesPlayed).toContain(
        "Matches played cannot be negative.",
      );
      expect(result.fieldErrors.totalWickets).toContain(
        "Total wickets cannot be negative.",
      );
    }
  });
});

describe("getPlayerFormErrorMessage", () => {
  it("prioritizes the negative total runs message over a generic server error", () => {
    expect(
      getPlayerFormErrorMessage(
        { totalRuns: [NEGATIVE_TOTAL_RUNS_MESSAGE] },
        "Please fix the highlighted fields.",
      ),
    ).toBe(NEGATIVE_TOTAL_RUNS_MESSAGE);
  });

  it("returns the fallback when total runs is valid", () => {
    expect(
      getPlayerFormErrorMessage(
        { basePrice: ["Base price cannot be negative."] },
        "Please fix the highlighted fields.",
      ),
    ).toBe("Please fix the highlighted fields.");
  });
});

describe("readPlayerFormValues", () => {
  it("reads all player fields from FormData", () => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(validValues)) {
      formData.set(key, value);
    }

    expect(readPlayerFormValues(formData)).toEqual(validValues);
  });
});
