import Link from "next/link";
import MatchHistory from "@/components/MatchHistory";
import MatchRecorder from "@/components/MatchRecorder";
import { requireUser } from "@/lib/auth";
import { countMatches, listMatches } from "@/lib/matches";
import { listPlayers } from "@/lib/players";
import { listTeams } from "@/lib/teams";

export default async function MatchesPage() {
  await requireUser();

  const [teams, players, matches, matchCount] = await Promise.all([
    listTeams(),
    listPlayers(),
    listMatches(),
    countMatches(),
  ]);

  const teamOptions = teams.map((team) => ({
    id: team.id,
    name: team.name,
  }));

  const playerOptions = players.map((player) => ({
    id: player.id,
    name: player.name,
    role: player.role,
    teamId: player.teamId,
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
          >
            &larr; Back to dashboard
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Match management
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Record a match
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Choose two teams, record each player&apos;s runs and wickets, and
            save the match and aggregate updates in one transaction.
          </p>
        </div>

        <Link
          href="/dashboard/leaderboard"
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
        >
          View leaderboard
        </Link>
      </div>

      <section className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Teams
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-100">
            {teams.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Players
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-100">
            {players.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Matches
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-100">
            {matchCount}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">New match</h2>
          <p className="mt-1 text-sm text-slate-400">
            Select players who took part, then enter their runs and wickets.
            Unselected players are not included in the match.
          </p>
        </div>

        <MatchRecorder teams={teamOptions} players={playerOptions} />
      </section>

      <MatchHistory matches={matches} />
    </main>
  );
}
