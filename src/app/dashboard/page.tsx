import AddPlayerForm from "@/components/AddPlayerForm";
import PlayerFilters from "@/components/PlayerFilters";
import PlayerTable from "@/components/PlayerTable";
import TeamManager from "@/components/TeamManager";
import { requireUser } from "@/lib/auth";
import { listPlayers } from "@/lib/players";
import { listTeams } from "@/lib/teams";
import { playerFilterSchema } from "@/lib/validations/player";
import LogoutButton from "./LogoutButton";

type DashboardPageProps = {
  searchParams: Promise<{
    teamId?: string | string[];
    role?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const parsedFilters = playerFilterSchema.safeParse({
    teamId: firstValue(params.teamId),
    role: firstValue(params.role),
  });

  const filters = parsedFilters.success ? parsedFilters.data : {};
  const filterError = parsedFilters.success
    ? undefined
    : "Invalid filter selection. Showing all players.";

  const [teams, players] = await Promise.all([
    listTeams(),
    listPlayers(filters),
  ]);

  const teamOptions = teams.map((team) => ({
    id: team.id,
    name: team.name,
  }));

  const totalRuns = players.reduce(
    (total, player) => total + player.totalRuns,
    0,
  );
  const totalWickets = players.reduce(
    (total, player) => total + player.totalWickets,
    0,
  );

  const stats = [
    { label: "Teams", value: teams.length },
    { label: "Players", value: players.length },
    { label: "Runs", value: totalRuns },
    { label: "Wickets", value: totalWickets },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Player management
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome, {user.name}
          </h1>
          <p className="mt-2 text-sm text-slate-400">{user.email}</p>
        </div>

        <LogoutButton />
      </header>

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-100">
              {stat.value.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Players</h2>
              <p className="mt-1 text-sm text-slate-400">
                View, filter, and edit every player in the auction pool.
              </p>
            </div>
            <a
              href="#add-player"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Add player
            </a>
          </div>

          <PlayerFilters
            teams={teamOptions}
            teamId={filters.teamId}
            role={filters.role}
            error={filterError}
          />

          <PlayerTable
            players={players}
            hasFilters={Boolean(filters.teamId || filters.role)}
          />
        </section>

        <aside className="space-y-6">
          <section
            id="add-player"
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
          >
            <h2 className="text-lg font-semibold">Add player</h2>
            <p className="mt-1 text-sm text-slate-400">
              New players are created with a server action and validated on the
              server.
            </p>
            <div className="mt-4">
              <AddPlayerForm teams={teamOptions} />
            </div>
          </section>

          <TeamManager teams={teams} />
        </aside>
      </div>
    </main>
  );
}
