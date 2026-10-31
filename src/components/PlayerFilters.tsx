import Link from "next/link";
import {
  PLAYER_ROLE_LABELS,
  PLAYER_ROLES,
} from "@/lib/player-constants";
import type { TeamOption } from "./PlayerFormFields";

type PlayerFiltersProps = {
  teams: TeamOption[];
  teamId?: string;
  role?: string;
  error?: string;
};

const selectClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-500";

export default function PlayerFilters({
  teams,
  teamId,
  role,
  error,
}: PlayerFiltersProps) {
  return (
    <form
      method="get"
      action="/dashboard"
      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] sm:items-end">
        <label className="space-y-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span>Team</span>
          <select
            name="teamId"
            defaultValue={teamId ?? ""}
            className={selectClassName}
          >
            <option value="">All teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span>Role</span>
          <select
            name="role"
            defaultValue={role ?? ""}
            className={selectClassName}
          >
            <option value="">All roles</option>
            {PLAYER_ROLES.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {PLAYER_ROLE_LABELS[roleOption]}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-white"
        >
          Apply filters
        </button>

        {teamId || role ? (
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-700 px-4 py-2 text-center text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Clear
          </Link>
        ) : null}
      </div>

      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
    </form>
  );
}
