import Link from "next/link";
import { notFound } from "next/navigation";
import EditPlayerForm from "@/components/EditPlayerForm";
import { requireUser } from "@/lib/auth";
import { getPlayerById } from "@/lib/players";
import { listTeams } from "@/lib/teams";

type EditPlayerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPlayerPage({
  params,
}: EditPlayerPageProps) {
  await requireUser();

  const { id } = await params;
  const [player, teams] = await Promise.all([
    getPlayerById(id),
    listTeams(),
  ]);

  if (!player) {
    notFound();
  }

  const teamOptions = teams.map((team) => ({
    id: team.id,
    name: team.name,
  }));

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link
        href={`/dashboard/players/${player.id}`}
        className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
      >
        &larr; Back to player
      </Link>

      <div className="mt-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Edit player
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          {player.name}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Update player details and team assignment.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
        <EditPlayerForm
          player={{
            id: player.id,
            name: player.name,
            role: player.role,
            basePrice: player.basePrice.toFixed(2),
            matchesPlayed: player.matchesPlayed,
            totalRuns: player.totalRuns,
            totalWickets: player.totalWickets,
            teamId: player.teamId,
          }}
          teams={teamOptions}
        />
      </div>
    </main>
  );
}
