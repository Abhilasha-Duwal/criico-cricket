import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <div className="space-y-2">
          <Link href="/" className="text-sm font-medium text-emerald-400">
            Criico Cricket
          </Link>
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-sm text-slate-400">
            Authentication will be implemented in a later step.
          </p>
        </div>

        <form method="post" className="space-y-4">
          <label className="block space-y-2 text-sm font-medium">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500"
            />
          </label>

          <button
            type="button"
            className="w-full rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
