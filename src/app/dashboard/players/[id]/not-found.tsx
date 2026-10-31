import Link from "next/link";

export default function PlayerNotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Player not found
        </p>
        <h1 className="mt-3 text-2xl font-bold">
          This player does not exist.
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          The player may have been removed or the link may be incorrect.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
