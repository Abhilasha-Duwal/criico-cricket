import type { TeamWithPlayerCount } from "@/lib/teams";
import AddTeamForm from "./AddTeamForm";
import DeleteTeamButton from "./DeleteTeamButton";

type TeamManagerProps = {
  teams: TeamWithPlayerCount[];
};

export default function TeamManager({ teams }: TeamManagerProps) {
  return (
    <section
      id="team-manager"
      className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Teams</h2>
        <p className="mt-1 text-sm text-slate-400">
          Create teams and assign players to them.
        </p>
      </div>

      <div className="mt-4">
        <AddTeamForm />
      </div>

      <div className="mt-5 space-y-2">
        {teams.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-700 px-3 py-4 text-sm text-slate-400">
            No teams yet. Create one to start adding players.
          </p>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-200">
                  {team.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {team._count.players} player
                  {team._count.players === 1 ? "" : "s"}
                </p>
              </div>
              <DeleteTeamButton
                teamId={team.id}
                teamName={team.name}
                playerCount={team._count.players}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
