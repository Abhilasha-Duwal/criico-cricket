import { describe, expect, it } from "vitest";
import {
  buildPageHref,
  getPageNumbers,
  getPaginationMeta,
  parsePage,
} from "./pagination";

describe("parsePage", () => {
  it("returns a positive integer page", () => {
    expect(parsePage("3")).toBe(3);
    expect(parsePage(["4", "5"])).toBe(4);
  });

  it("falls back to the first page for missing or invalid values", () => {
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("")).toBe(1);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-2")).toBe(1);
    expect(parsePage("1.5")).toBe(1);
    expect(parsePage("abc")).toBe(1);
  });
});

describe("getPaginationMeta", () => {
  it("calculates the visible item range", () => {
    expect(getPaginationMeta(23, 2, 10)).toEqual({
      totalItems: 23,
      page: 2,
      pageSize: 10,
      totalPages: 3,
      start: 11,
      end: 20,
    });
  });

  it("clamps a page beyond the available pages", () => {
    expect(getPaginationMeta(23, 99, 10)).toMatchObject({
      page: 3,
      start: 21,
      end: 23,
    });
  });

  it("handles an empty result set", () => {
    expect(getPaginationMeta(0, 1, 10)).toMatchObject({
      page: 1,
      totalPages: 1,
      start: 0,
      end: 0,
    });
  });
});

describe("buildPageHref", () => {
  it("preserves filters and omits the first page parameter", () => {
    expect(
      buildPageHref("/dashboard", { teamId: "team-1", role: "BATTER" }, 1),
    ).toBe("/dashboard?teamId=team-1&role=BATTER");
  });

  it("adds the page parameter and hash for later pages", () => {
    expect(
      buildPageHref(
        "/dashboard/matches",
        { page: "3", teamId: "team-1" },
        2,
        "match-history",
      ),
    ).toBe("/dashboard/matches?teamId=team-1&page=2#match-history");
  });

  it("supports repeated query values", () => {
    expect(
      buildPageHref("/dashboard", { role: ["BATTER", "BOWLER"] }, 2),
    ).toBe("/dashboard?role=BATTER&role=BOWLER&page=2");
  });
});

describe("getPageNumbers", () => {
  it("lists every page when there are seven or fewer", () => {
    expect(getPageNumbers(2, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("collapses gaps for longer page ranges", () => {
    expect(getPageNumbers(5, 10)).toEqual([
      1,
      "ellipsis",
      4,
      5,
      6,
      "ellipsis",
      10,
    ]);
  });
});
