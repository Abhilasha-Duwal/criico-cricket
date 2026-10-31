"use client";

import Link from "next/link";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-red-900 bg-red-950/30 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
          Dashboard error
        </p>
        <h1 className="mt-3 text-2xl font-bold">
          We could not load your players.
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Check the server connection and try again.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-white"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
