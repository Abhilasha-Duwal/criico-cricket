import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import {
  PLAYER_ROLE_BADGE_CLASSES,
  PLAYER_ROLE_LABELS,
} from "@/lib/player-constants";
import type { PlayerWithTeam } from "@/lib/players";

type PlayerTableProps = {
  players: PlayerWithTeam[];
  hasFilters: boolean;
};

function RoleBadge({ role }: { role: PlayerWithTeam["role"] }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${PLAYER_ROLE_BADGE_CLASSES[role]}`}
    >
      {PLAYER_ROLE_LABELS[role]}
    </span>
  );
}

export default function PlayerTable({
  players,
  hasFilters,
}: PlayerTableProps) {
  if (players.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12 text-center">
        <p className="font-semibold text-slate-200">
          {hasFilters ? "No players match these filters." : "No players yet."}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          {hasFilters
            ? "Try a different team or role, or clear the filters."
            : "Use the Add player form to create your first player."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 md:block">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Player</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Team</th>
              <th className="px-4 py-3 text-right font-semibold">Base price</th>
              <th className="px-4 py-3 text-right font-semibold">Matches</th>
              <th className="px-4 py-3 text-right font-semibold">Runs</th>
              <th className="px-4 py-3 text-right font-semibold">Wickets</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {players.map((player) => (
              <tr key={player.id} className="hover:bg-slate-900/70">
                <td className="px-4 py-4">
                  <Link
                    href={`/dashboard/players/${player.id}`}
                    className="font-semibold text-slate-100 hover:text-emerald-300"
                  >
                    {player.name}
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <RoleBadge role={player.role} />
                </td>
                <td className="px-4 py-4 text-slate-300">
                  {player.team.name}
                </td>
                <td className="px-4 py-4 text-right text-slate-300">
                  {formatCurrency(player.basePrice.toString())}
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
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-3 text-sm font-semibold">
                    <Link
                      href={`/dashboard/players/${player.id}`}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/players/${player.id}/edit`}
                      className="text-slate-300 hover:text-white"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {players.map((player) => (
          <article
            key={player.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
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
              <RoleBadge role={player.role} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Base price</dt>
                <dd className="mt-1 font-medium text-slate-200">
                  {formatCurrency(player.basePrice.toString())}
                </dd>
              </div>
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

            <div className="mt-4 flex gap-4 border-t border-slate-800 pt-3 text-sm font-semibold">
              <Link
                href={`/dashboard/players/${player.id}`}
                className="text-emerald-400 hover:text-emerald-300"
              >
                View details
              </Link>
              <Link
                href={`/dashboard/players/${player.id}/edit`}
                className="text-slate-300 hover:text-white"
              >
                Edit
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
