import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const teamListInclude = {
  _count: {
    select: {
      players: true,
    },
  },
} satisfies Prisma.TeamInclude;

export type TeamWithPlayerCount = Prisma.TeamGetPayload<{
  include: typeof teamListInclude;
}>;

export class DuplicateTeamError extends Error {
  constructor() {
    super("A team with this name already exists.");
    this.name = "DuplicateTeamError";
  }
}

export async function listTeams(): Promise<TeamWithPlayerCount[]> {
  return prisma.team.findMany({
    include: teamListInclude,
    orderBy: { name: "asc" },
  });
}

export async function createTeam(name: string): Promise<TeamWithPlayerCount> {
  const existingTeam = await prisma.team.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
    select: { id: true },
  });

  if (existingTeam) {
    throw new DuplicateTeamError();
  }

  try {
    return await prisma.team.create({
      data: { name },
      include: teamListInclude,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new DuplicateTeamError();
    }

    throw error;
  }
}

export type DeleteTeamResult =
  | { status: "deleted" }
  | { status: "not_found" }
  | { status: "has_players"; playerCount: number }
  | { status: "in_use" };

export async function deleteTeam(id: string): Promise<DeleteTeamResult> {
  const team = await prisma.team.findUnique({
    where: { id },
    select: {
      id: true,
      _count: {
        select: {
          players: true,
          matchesAsTeamA: true,
          matchesAsTeamB: true,
        },
      },
    },
  });

  if (!team) {
    return { status: "not_found" };
  }

  if (team._count.players > 0) {
    return {
      status: "has_players",
      playerCount: team._count.players,
    };
  }

  if (team._count.matchesAsTeamA > 0 || team._count.matchesAsTeamB > 0) {
    return { status: "in_use" };
  }

  try {
    await prisma.team.delete({ where: { id } });
    return { status: "deleted" };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return { status: "in_use" };
    }

    throw error;
  }
}

export function serializeTeam(team: TeamWithPlayerCount) {
  return {
    id: team.id,
    name: team.name,
    createdAt: team.createdAt,
    playerCount: team._count.players,
  };
}
