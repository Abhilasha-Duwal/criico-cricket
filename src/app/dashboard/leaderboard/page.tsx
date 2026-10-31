import Link from "next/link";
import LeaderboardTable from "@/components/LeaderboardTable";
import { requireUser } from "@/lib/auth";
import { getLeaderboard } from "@/lib/leaderboard-data";

export default async function LeaderboardPage() {
  await requireUser();

  const leaderboard = await getLeaderboard();

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
            Leaderboard
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Player impact rankings
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Players are ranked by Impact Score, calculated from runs, wickets,
            role adjustments, experience, and the wicketkeeper bonus.
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-400">
        <p>
          <span className="font-semibold text-slate-200">Formula:</span>{" "}
          role-adjusted runs and wickets, plus the experience adjustment, plus
          the wicketkeeper bonus.
        </p>
        <p className="mt-2">
          <span className="font-semibold text-slate-200">Example:</span> a
          batter with 100 runs, 2 wickets, and 10 matches scores{" "}
          <span className="font-semibold text-emerald-300">196</span>.
        </p>
      </section>

      <section className="mt-6">
        {leaderboard.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12 text-center">
            <p className="font-semibold text-slate-200">
              No players to rank yet.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Add players from the dashboard to generate the leaderboard.
            </p>
            <Link
              href="/dashboard"
              className="mt-5 inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Go to dashboard
            </Link>
          </div>
        ) : (
          <LeaderboardTable entries={leaderboard} />
        )}
      </section>
    </main>
  );
}
