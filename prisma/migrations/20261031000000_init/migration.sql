-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PlayerRole" AS ENUM ('BATTER', 'BOWLER', 'ALL_ROUNDER', 'WICKET_KEEPER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "PlayerRole" NOT NULL,
    "basePrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
    "totalRuns" INTEGER NOT NULL DEFAULT 0,
    "totalWickets" INTEGER NOT NULL DEFAULT 0,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "teamAId" TEXT NOT NULL,
    "teamBId" TEXT NOT NULL,
    "winnerId" TEXT,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_performances" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "runs" INTEGER NOT NULL DEFAULT 0,
    "wickets" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "player_performances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");

-- CreateIndex
CREATE INDEX "players_teamId_idx" ON "players"("teamId");

-- CreateIndex
CREATE INDEX "players_role_idx" ON "players"("role");

-- CreateIndex
CREATE INDEX "matches_teamAId_idx" ON "matches"("teamAId");

-- CreateIndex
CREATE INDEX "matches_teamBId_idx" ON "matches"("teamBId");

-- CreateIndex
CREATE INDEX "matches_winnerId_idx" ON "matches"("winnerId");

-- CreateIndex
CREATE INDEX "matches_playedAt_idx" ON "matches"("playedAt");

-- CreateIndex
CREATE INDEX "player_performances_playerId_idx" ON "player_performances"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "player_performances_matchId_playerId_key" ON "player_performances"("matchId", "playerId");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_teamAId_fkey" FOREIGN KEY ("teamAId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_teamBId_fkey" FOREIGN KEY ("teamBId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_performances" ADD CONSTRAINT "player_performances_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_performances" ADD CONSTRAINT "player_performances_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddCheckConstraint
ALTER TABLE "players"
    ADD CONSTRAINT "players_basePrice_non_negative" CHECK ("basePrice" >= 0),
    ADD CONSTRAINT "players_matchesPlayed_non_negative" CHECK ("matchesPlayed" >= 0),
    ADD CONSTRAINT "players_totalRuns_non_negative" CHECK ("totalRuns" >= 0),
    ADD CONSTRAINT "players_totalWickets_non_negative" CHECK ("totalWickets" >= 0);

-- AddCheckConstraint
ALTER TABLE "matches"
    ADD CONSTRAINT "matches_teams_differ" CHECK ("teamAId" <> "teamBId"),
    ADD CONSTRAINT "matches_winner_is_participant" CHECK ("winnerId" IS NULL OR "winnerId" IN ("teamAId", "teamBId"));

-- AddCheckConstraint
ALTER TABLE "player_performances"
    ADD CONSTRAINT "player_performances_runs_non_negative" CHECK ("runs" >= 0),
    ADD CONSTRAINT "player_performances_wickets_non_negative" CHECK ("wickets" >= 0);

