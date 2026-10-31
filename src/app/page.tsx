import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-10 px-6 py-16">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Criico Cricket
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Cricket team management, simplified.
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Manage teams, players, matches, and performances from one place.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
        >
          Create account
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
        >
          Open dashboard
        </Link>
      </div>

      <p className="text-sm text-slate-500">
        Next.js, Prisma, and PostgreSQL are configured and ready.
      </p>
    </main>
  );
}
