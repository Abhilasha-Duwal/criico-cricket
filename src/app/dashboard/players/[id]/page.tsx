import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { formatCurrency, formatDate, formatImpactScore } from "@/lib/format";
import { calculateImpactScore } from "@/lib/impact-score";
import {
  PLAYER_ROLE_BADGE_CLASSES,
  PLAYER_ROLE_LABELS,
} from "@/lib/player-constants";
import { getPlayerById } from "@/lib/players";

type PlayerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlayerDetailPage({
  params,
}: PlayerDetailPageProps) {
  await requireUser();

  const { id } = await params;
  const player = await getPlayerById(id);

  if (!player) {
    notFound();
  }

  const impactScore = calculateImpactScore({
    role: player.role,
    runs: player.totalRuns,
    wickets: player.totalWickets,
    matchesPlayed: player.matchesPlayed,
  });

  const stats = [
    { label: "Impact score", value: formatImpactScore(impactScore) },
    { label: "Base price", value: formatCurrency(player.basePrice.toString()) },
    { label: "Matches played", value: player.matchesPlayed.toLocaleString("en-IN") },
    { label: "Total runs", value: player.totalRuns.toLocaleString("en-IN") },
    {
      label: "Total wickets",
      value: player.totalWickets.toLocaleString("en-IN"),
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
          >
            &larr; Back to dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {player.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${PLAYER_ROLE_BADGE_CLASSES[player.role]}`}
            >
              {PLAYER_ROLE_LABELS[player.role]}
            </span>
            <span className="text-sm text-slate-400">{player.team.name}</span>
          </div>
        </div>

        <Link
          href={`/dashboard/players/${player.id}/edit`}
          className="rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Edit player
        </Link>
      </div>

      <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {stat.label}
            </p>
            <p className="mt-2 text-xl font-bold text-slate-100">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold">Player information</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">Name</dt>
              <dd className="font-medium text-slate-200">{player.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">Role</dt>
              <dd className="font-medium text-slate-200">
                {PLAYER_ROLE_LABELS[player.role]}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">Team</dt>
              <dd className="font-medium text-slate-200">
                {player.team.name}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">Created</dt>
              <dd className="font-medium text-slate-200">
                {formatDate(player.createdAt)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">Last updated</dt>
              <dd className="font-medium text-slate-200">
                {formatDate(player.updatedAt)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold">Career summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">Base price</dt>
              <dd className="font-medium text-slate-200">
                {formatCurrency(player.basePrice.toString())}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">Matches played</dt>
              <dd className="font-medium text-slate-200">
                {player.matchesPlayed}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">Total runs</dt>
              <dd className="font-medium text-slate-200">{player.totalRuns}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">Total wickets</dt>
              <dd className="font-medium text-slate-200">
                {player.totalWickets}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
