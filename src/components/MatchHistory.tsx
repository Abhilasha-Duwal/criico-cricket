import { formatDate } from "@/lib/format";
import type { MatchWithDetails } from "@/lib/matches";
import { PLAYER_ROLE_LABELS } from "@/lib/player-constants";

type MatchHistoryProps = {
  matches: MatchWithDetails[];
};

type TeamPerformanceProps = {
  teamName: string;
  performances: MatchWithDetails["performances"];
};

function TeamPerformance({ teamName, performances }: TeamPerformanceProps) {
  const sortedPerformances = [...performances].sort((left, right) =>
    left.player.name.localeCompare(right.player.name),
  );
  const totalRuns = sortedPerformances.reduce(
    (total, performance) => total + performance.runs,
    0,
  );
  const totalWickets = sortedPerformances.reduce(
    (total, performance) => total + performance.wickets,
    0,
  );

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h4 className="font-semibold text-slate-100">{teamName}</h4>
        <p className="text-xs text-slate-400">
          {totalRuns} runs &middot; {totalWickets} wickets
        </p>
      </div>

      {sortedPerformances.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          No player performances recorded.
        </p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-2 pr-3 font-semibold">Player</th>
                <th className="py-2 pr-3 font-semibold">Role</th>
                <th className="py-2 pr-3 text-right font-semibold">Runs</th>
                <th className="py-2 text-right font-semibold">Wickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sortedPerformances.map((performance) => (
                <tr key={performance.id}>
                  <td className="py-2 pr-3 font-medium text-slate-200">
                    {performance.player.name}
                  </td>
                  <td className="py-2 pr-3 text-slate-400">
                    {PLAYER_ROLE_LABELS[performance.player.role]}
                  </td>
                  <td className="py-2 pr-3 text-right text-slate-300">
                    {performance.runs}
                  </td>
                  <td className="py-2 text-right text-slate-300">
                    {performance.wickets}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function MatchHistory({ matches }: MatchHistoryProps) {
  return (
    <section id="match-history" className="mt-10">
      <div>
        <h2 className="text-xl font-semibold">Recorded matches</h2>
        <p className="mt-1 text-sm text-slate-400">
          Recent matches and the player performances that updated aggregate
          statistics.
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-10 text-center">
          <p className="font-semibold text-slate-200">No matches recorded yet.</p>
          <p className="mt-2 text-sm text-slate-400">
            Use the form above to record the first match.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {matches.map((match) => (
            <article
              key={match.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {formatDate(match.playedAt)}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-100">
                    {match.teamA.name} vs {match.teamB.name}
                  </h3>
                </div>
                <p className="rounded-full border border-emerald-900 bg-emerald-950/50 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {match.winner
                    ? `${match.winner.name} won`
                    : "No winner recorded"}
                </p>
              </header>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <TeamPerformance
                  teamName={match.teamA.name}
                  performances={match.performances.filter(
                    (performance) =>
                      performance.player.teamId === match.teamAId,
                  )}
                />
                <TeamPerformance
                  teamName={match.teamB.name}
                  performances={match.performances.filter(
                    (performance) =>
                      performance.player.teamId === match.teamBId,
                  )}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
