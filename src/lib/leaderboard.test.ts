import { describe, expect, it } from "vitest";
import {
  buildLeaderboard,
  serializeLeaderboard,
  type LeaderboardEntry,
} from "./leaderboard";
import type { PlayerWithTeam } from "./players";

function makePlayer({
  id,
  name,
  role,
  teamName,
  matchesPlayed,
  totalRuns,
  totalWickets,
}: {
  id: string;
  name: string;
  role: PlayerWithTeam["role"];
  teamName: string;
  matchesPlayed: number;
  totalRuns: number;
  totalWickets: number;
}): PlayerWithTeam {
  return {
    id,
    name,
    role,
    basePrice: 0,
    matchesPlayed,
    totalRuns,
    totalWickets,
    teamId: `team-${teamName}`,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    team: {
      id: `team-${teamName}`,
      name: teamName,
    },
  } as unknown as PlayerWithTeam;
}

describe("buildLeaderboard", () => {
  it("sorts players by impact score descending and assigns ranks", () => {
    const leaderboard = buildLeaderboard([
      makePlayer({
        id: "player-1",
        name: "Bowler",
        role: "BOWLER",
        teamName: "Lions",
        matchesPlayed: 10,
        totalRuns: 20,
        totalWickets: 3,
      }),
      makePlayer({
        id: "player-2",
        name: "Batter",
        role: "BATTER",
        teamName: "Tigers",
        matchesPlayed: 10,
        totalRuns: 100,
        totalWickets: 2,
      }),
    ]);

    expect(leaderboard.map((entry) => entry.player.name)).toEqual([
      "Batter",
      "Bowler",
    ]);
    expect(leaderboard.map((entry) => entry.rank)).toEqual([1, 2]);
    expect(leaderboard[0].impactScore).toBeCloseTo(196);
    expect(leaderboard[1].impactScore).toBeCloseTo(114);
  });

  it("breaks impact score ties by player name", () => {
    const leaderboard = buildLeaderboard([
      makePlayer({
        id: "player-2",
        name: "Zara",
        role: "BATTER",
        teamName: "Tigers",
        matchesPlayed: 10,
        totalRuns: 100,
        totalWickets: 2,
      }),
      makePlayer({
        id: "player-1",
        name: "Aarav",
        role: "BATTER",
        teamName: "Lions",
        matchesPlayed: 10,
        totalRuns: 100,
        totalWickets: 2,
      }),
    ]);

    expect(leaderboard.map((entry) => entry.player.name)).toEqual([
      "Aarav",
      "Zara",
    ]);
    expect(leaderboard.map((entry) => entry.rank)).toEqual([1, 2]);
  });

  it("returns an empty leaderboard when there are no players", () => {
    expect(buildLeaderboard([])).toEqual([]);
  });
});

describe("serializeLeaderboard", () => {
  it("returns only the required player fields", () => {
    const entries = buildLeaderboard([
      makePlayer({
        id: "player-1",
        name: "Aarav",
        role: "BATTER",
        teamName: "Lions",
        matchesPlayed: 10,
        totalRuns: 100,
        totalWickets: 2,
      }),
    ]);

    const serialized = serializeLeaderboard(entries);

    expect(serialized).toEqual([
      {
        rank: 1,
        impactScore: 196,
        player: {
          id: "player-1",
          name: "Aarav",
          team: {
            id: "team-Lions",
            name: "Lions",
          },
          role: "BATTER",
          matchesPlayed: 10,
          totalRuns: 100,
          totalWickets: 2,
        },
      },
    ]);
    expect(serialized[0].player).not.toHaveProperty("basePrice");
    expect(serialized[0].player).not.toHaveProperty("createdAt");
    expect(serialized[0].player).not.toHaveProperty("updatedAt");
    expect(serialized[0].player).not.toHaveProperty("teamId");
  });

  it("returns an empty array for an empty leaderboard", () => {
    expect(serializeLeaderboard([] as LeaderboardEntry[])).toEqual([]);
  });
});
