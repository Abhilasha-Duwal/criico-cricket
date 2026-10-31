import Link from "next/link";
import { formatImpactScore } from "@/lib/format";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import {
  PLAYER_ROLE_BADGE_CLASSES,
  PLAYER_ROLE_LABELS,
} from "@/lib/player-constants";

type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
};

function rankClassName(rank: number): string {
  if (rank === 1) {
    return "border-amber-700 bg-amber-950/60 text-amber-300";
  }

  if (rank === 2) {
    return "border-slate-600 bg-slate-800 text-slate-200";
  }

  if (rank === 3) {
    return "border-orange-800 bg-orange-950/60 text-orange-300";
  }

  return "border-slate-800 bg-slate-950/60 text-slate-400";
}

export default function LeaderboardTable({
  entries,
}: LeaderboardTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 md:block">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Rank</th>
              <th className="px-4 py-3 font-semibold">Player</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Team</th>
              <th className="px-4 py-3 text-right font-semibold">Matches</th>
              <th className="px-4 py-3 text-right font-semibold">Runs</th>
              <th className="px-4 py-3 text-right font-semibold">Wickets</th>
              <th className="px-4 py-3 text-right font-semibold">
                Impact score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {entries.map(({ rank, impactScore, player }) => (
              <tr key={player.id} className="hover:bg-slate-900/70">
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex min-w-9 justify-center rounded-full border px-2.5 py-1 text-xs font-bold ${rankClassName(rank)}`}
                  >
                    {rank}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/dashboard/players/${player.id}`}
                    className="font-semibold text-slate-100 hover:text-emerald-300"
                  >
                    {player.name}
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${PLAYER_ROLE_BADGE_CLASSES[player.role]}`}
                  >
                    {PLAYER_ROLE_LABELS[player.role]}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-300">
                  {player.team.name}
                </td>
                <td className="px-4 py-4 text-right text-slate-300">
                  {player.matchesPlayed}
                </td>
                <td className="px-4 py-4 text-right text-slate-300">
                  {player.totalRuns}
                </td>
                <td className="px-4 py-4 text-right text-slate-300">
                  {player.totalWickets}
                </td>
                <td className="px-4 py-4 text-right font-bold text-emerald-300">
                  {formatImpactScore(impactScore)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {entries.map(({ rank, impactScore, player }) => (
          <article
            key={player.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex min-w-9 justify-center rounded-full border px-2.5 py-1 text-xs font-bold ${rankClassName(rank)}`}
                >
                  {rank}
                </span>
                <div>
                  <Link
                    href={`/dashboard/players/${player.id}`}
                    className="font-semibold text-slate-100 hover:text-emerald-300"
                  >
                    {player.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-400">
                    {player.team.name}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${PLAYER_ROLE_BADGE_CLASSES[player.role]}`}
              >
                {PLAYER_ROLE_LABELS[player.role]}
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-800 pt-3">
              <dl className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-slate-500">Matches</dt>
                  <dd className="mt-1 font-medium text-slate-200">
                    {player.matchesPlayed}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Runs</dt>
                  <dd className="mt-1 font-medium text-slate-200">
                    {player.totalRuns}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Wickets</dt>
                  <dd className="mt-1 font-medium text-slate-200">
                    {player.totalWickets}
                  </dd>
                </div>
              </dl>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Impact
                </p>
                <p className="mt-1 text-lg font-bold text-emerald-300">
                  {formatImpactScore(impactScore)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
