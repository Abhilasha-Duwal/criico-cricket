import { Prisma } from "@prisma/client";
import { calculateImpactScore } from "@/lib/impact-score";
import { getPaginationMeta, type PaginationMeta } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import type { PlayerInput } from "@/lib/validations/player";

const playerInclude = {
  team: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.PlayerInclude;

export type PlayerWithTeam = Prisma.PlayerGetPayload<{
  include: typeof playerInclude;
}>;

export class TeamNotFoundError extends Error {
  constructor() {
    super("Team not found.");
    this.name = "TeamNotFoundError";
  }
}

function playerData(input: PlayerInput): Prisma.PlayerUncheckedCreateInput {
  return {
    name: input.name,
    role: input.role,
    basePrice: new Prisma.Decimal(input.basePrice).toFixed(2),
    matchesPlayed: input.matchesPlayed,
    totalRuns: input.totalRuns,
    totalWickets: input.totalWickets,
    teamId: input.teamId,
  };
}

async function ensureTeamExists(teamId: string): Promise<void> {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { id: true },
  });

  if (!team) {
    throw new TeamNotFoundError();
  }
}

function isPrismaError(error: unknown, code: string): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === code
  );
}

export type PlayerListFilters = {
  teamId?: string;
  role?: PlayerInput["role"];
};

export type PaginatedPlayers = PaginationMeta & {
  players: PlayerWithTeam[];
  totalRuns: number;
  totalWickets: number;
};

function playerWhere(filters: PlayerListFilters): Prisma.PlayerWhereInput {
  const where: Prisma.PlayerWhereInput = {};

  if (filters.teamId) {
    where.teamId = filters.teamId;
  }

  if (filters.role) {
    where.role = filters.role;
  }

  return where;
}

export async function listPlayers(
  filters: PlayerListFilters = {},
): Promise<PlayerWithTeam[]> {
  return prisma.player.findMany({
    where: playerWhere(filters),
    include: playerInclude,
    orderBy: { name: "asc" },
  });
}

export async function listPlayersPage(
  filters: PlayerListFilters & { page?: number; pageSize?: number } = {},
): Promise<PaginatedPlayers> {
  const where = playerWhere(filters);
  const aggregate = await prisma.player.aggregate({
    where,
    _count: { _all: true },
    _sum: {
      totalRuns: true,
      totalWickets: true,
    },
  });
  const meta = getPaginationMeta(
    aggregate._count._all,
    filters.page ?? 1,
    filters.pageSize ?? 10,
  );
  const players = await prisma.player.findMany({
    where,
    include: playerInclude,
    orderBy: { name: "asc" },
    skip: (meta.page - 1) * meta.pageSize,
    take: meta.pageSize,
  });

  return {
    ...meta,
    players,
    totalRuns: aggregate._sum.totalRuns ?? 0,
    totalWickets: aggregate._sum.totalWickets ?? 0,
  };
}

export async function getPlayerById(
  id: string,
): Promise<PlayerWithTeam | null> {
  return prisma.player.findUnique({
    where: { id },
    include: playerInclude,
  });
}

export async function createPlayer(
  input: PlayerInput,
): Promise<PlayerWithTeam> {
  await ensureTeamExists(input.teamId);

  try {
    return await prisma.player.create({
      data: playerData(input),
      include: playerInclude,
    });
  } catch (error) {
    if (isPrismaError(error, "P2003")) {
      throw new TeamNotFoundError();
    }

    throw error;
  }
}

export async function updatePlayer(
  id: string,
  input: PlayerInput,
): Promise<PlayerWithTeam | null> {
  const existingPlayer = await prisma.player.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingPlayer) {
    return null;
  }

  await ensureTeamExists(input.teamId);

  try {
    return await prisma.player.update({
      where: { id },
      data: playerData(input),
      include: playerInclude,
    });
  } catch (error) {
    if (isPrismaError(error, "P2003")) {
      throw new TeamNotFoundError();
    }

    if (isPrismaError(error, "P2025")) {
      return null;
    }

    throw error;
  }
}

export function serializePlayer(player: PlayerWithTeam) {
  return {
    ...player,
    basePrice: Number(player.basePrice),
    impactScore: calculateImpactScore({
      role: player.role,
      runs: player.totalRuns,
      wickets: player.totalWickets,
      matchesPlayed: player.matchesPlayed,
    }),
  };
}
