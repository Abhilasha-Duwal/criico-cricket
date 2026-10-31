
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import {
  PLAYER_ROLE_BADGE_CLASSES,
  PLAYER_ROLE_LABELS,
} from "@/lib/player-constants";
import type { SerializedPlayer } from "@/lib/players";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

type PlayerTableProps = {
  players: SerializedPlayer[];
  hasFilters: boolean;
};

function RoleBadge({ role }: { role: SerializedPlayer["role"] }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${PLAYER_ROLE_BADGE_CLASSES[role]}`}
    >
      {PLAYER_ROLE_LABELS[role]}
    </span>
  );
}


function DeletePlayerButton({ player }: { player: SerializedPlayer }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);

      const response = await fetch(`/api/players/${player.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to delete player.");
        return;
      }

      toast.success("Player deleted successfully.");
      setShowConfirm(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong while deleting the player.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-player-title"
            aria-describedby="delete-player-description"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>

              <div>
                <h2
                  id="delete-player-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Delete player?
                </h2>

                <p
                  id="delete-player-description"
                  className="mt-2 text-sm text-gray-600"
                >
                  Are you sure you want to delete{" "}
                  <strong>{player.name}</strong>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {deleting ? "Deleting..." : "Delete player"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
                    <DeletePlayerButton player={player} />
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
              <DeletePlayerButton player={player} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
