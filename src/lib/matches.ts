import { Prisma } from "@prisma/client";
import {
  buildMatchRequestId,
  matchRequestMatchesExisting,
} from "@/lib/match-idempotency";
import { prisma } from "@/lib/prisma";
import type { MatchInput } from "@/lib/validations/match";

const matchInclude = {
  teamA: {
    select: {
      id: true,
      name: true,
    },
  },
  teamB: {
    select: {
      id: true,
      name: true,
    },
  },
  winner: {
    select: {
      id: true,
      name: true,
    },
  },
  performances: {
    include: {
      player: {
        select: {
          id: true,
          name: true,
          role: true,
          teamId: true,
        },
      },
    },
  },
} satisfies Prisma.MatchInclude;

export type MatchWithDetails = Prisma.MatchGetPayload<{
  include: typeof matchInclude;
}>;

export class MatchTeamNotFoundError extends Error {
  constructor() {
    super("One or both teams were not found.");
    this.name = "MatchTeamNotFoundError";
  }
}

export class MatchPlayerNotFoundError extends Error {
  constructor() {
    super("One or more players were not found.");
    this.name = "MatchPlayerNotFoundError";
  }
}

export class PlayerNotEligibleError extends Error {
  constructor(readonly playerId: string) {
    super("A player does not belong to either participating team.");
    this.name = "PlayerNotEligibleError";
  }
}

export class DuplicatePlayerPerformanceError extends Error {
  constructor() {
    super("A player already has a performance in this match.");
    this.name = "DuplicatePlayerPerformanceError";
  }
}

export class MatchIdempotencyConflictError extends Error {
  constructor() {
    super("The request ID was already used for a different match.");
    this.name = "MatchIdempotencyConflictError";
  }
}

export class MatchReferenceChangedError extends Error {
  constructor() {
    super("A referenced team or player changed during the request.");
    this.name = "MatchReferenceChangedError";
  }
}

export type CreateMatchResult = {
  match: MatchWithDetails;
  replayed: boolean;
};

function resolveExistingMatch(
  existing: MatchWithDetails,
  input: MatchInput,
): CreateMatchResult {
  if (!matchRequestMatchesExisting(input, existing)) {
    throw new MatchIdempotencyConflictError();
  }

  return { match: existing, replayed: true };
}

function assertUniquePlayerPerformances(input: MatchInput): void {
  const playerIds = input.performances.map(
    (performance) => performance.playerId,
  );

  if (new Set(playerIds).size !== playerIds.length) {
    throw new DuplicatePlayerPerformanceError();
  }
}

async function validateReferences(
  tx: Prisma.TransactionClient,
  input: MatchInput,
): Promise<void> {
  const teams = await tx.team.findMany({
    where: {
      id: {
        in: [input.teamAId, input.teamBId],
      },
    },
    select: { id: true },
  });

  if (teams.length !== 2) {
    throw new MatchTeamNotFoundError();
  }

  const playerIds = input.performances.map(
    (performance) => performance.playerId,
  );

  if (playerIds.length === 0) {
    return;
  }

  const players = await tx.player.findMany({
    where: {
      id: {
        in: playerIds,
      },
    },
    select: {
      id: true,
      teamId: true,
    },
  });

  if (players.length !== playerIds.length) {
    throw new MatchPlayerNotFoundError();
  }

  const ineligiblePlayer = players.find(
    (player) =>
      player.teamId !== input.teamAId && player.teamId !== input.teamBId,
  );

  if (ineligiblePlayer) {
    throw new PlayerNotEligibleError(ineligiblePlayer.id);
  }
}

export async function createMatch(
  input: MatchInput,
): Promise<CreateMatchResult> {
  const requestId = buildMatchRequestId(input);
  const existing = await prisma.match.findUnique({
    where: { id: requestId },
    include: matchInclude,
  });

  if (existing) {
    return resolveExistingMatch(existing, input);
  }

  assertUniquePlayerPerformances(input);

  try {
    return await prisma.$transaction(
      async (tx) => {
        const existingInTransaction = await tx.match.findUnique({
          where: { id: requestId },
          include: matchInclude,
        });

        if (existingInTransaction) {
          return resolveExistingMatch(existingInTransaction, input);
        }

        await validateReferences(tx, input);

        const match = await tx.match.create({
          data: {
            id: requestId,
            teamAId: input.teamAId,
            teamBId: input.teamBId,
            winnerId: input.winnerId ?? null,
            performances: {
              create: input.performances.map((performance) => ({
                playerId: performance.playerId,
                runs: performance.runs,
                wickets: performance.wickets,
              })),
            },
          },
          include: matchInclude,
        });

        for (const performance of input.performances) {
          await tx.player.update({
            where: { id: performance.playerId },
            data: {
              matchesPlayed: { increment: 1 },
              totalRuns: { increment: performance.runs },
              totalWickets: { increment: performance.wickets },
            },
          });
        }

        return { match, replayed: false };
      },
      {
        maxWait: 5_000,
        timeout: 15_000,
      },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const existingAfterConflict = await prisma.match.findUnique({
          where: { id: requestId },
          include: matchInclude,
        });

        if (existingAfterConflict) {
          return resolveExistingMatch(existingAfterConflict, input);
        }

        throw new DuplicatePlayerPerformanceError();
      }

      if (error.code === "P2003" || error.code === "P2025") {
        throw new MatchReferenceChangedError();
      }
    }

    throw error;
  }
}

export async function listMatches(): Promise<MatchWithDetails[]> {
  return prisma.match.findMany({
    include: matchInclude,
    orderBy: {
      playedAt: "desc",
    },
    take: 100,
  });
}

export async function countMatches(): Promise<number> {
  return prisma.match.count();
}

export function serializeMatch(match: MatchWithDetails) {
  return {
    id: match.id,
    playedAt: match.playedAt.toISOString(),
    teamA: match.teamA,
    teamB: match.teamB,
    winner: match.winner,
    performances: match.performances.map(
      ({ id, runs, wickets, player }) => ({
        id,
        runs,
        wickets,
        player,
      }),
    ),
  };
}
