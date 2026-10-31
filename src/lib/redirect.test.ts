import { describe, expect, it } from "vitest";
import { safeNextPath } from "./redirect";

describe("safeNextPath", () => {
  it("allows an internal dashboard path with query and hash", () => {
    expect(safeNextPath("/dashboard/matches?team=1#history")).toBe(
      "/dashboard/matches?team=1#history",
    );
  });

  it("falls back for missing, external, protocol-relative, or backslash paths", () => {
    expect(safeNextPath(undefined)).toBe("/dashboard");
    expect(safeNextPath("https://evil.example")).toBe("/dashboard");
    expect(safeNextPath("//evil.example")).toBe("/dashboard");
    expect(safeNextPath("/\\evil.example")).toBe("/dashboard");
  });

  it("rejects login and register destinations to avoid redirect loops", () => {
    expect(safeNextPath("/login")).toBe("/dashboard");
    expect(safeNextPath("/login?next=/dashboard")).toBe("/dashboard");
    expect(safeNextPath("/register/complete")).toBe("/dashboard");
  });

  it("uses the first value when the query parameter is repeated", () => {
    expect(safeNextPath(["/dashboard/leaderboard", "/login"])).toBe(
      "/dashboard/leaderboard",
    );
  });

  it("supports a custom fallback", () => {
    expect(safeNextPath("https://evil.example", "/dashboard/players")).toBe(
      "/dashboard/players",
    );
  });
});
