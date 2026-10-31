import { requireUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Protected route
          </p>
          <h1 className="mt-4 text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="mt-2 text-slate-400">{user.email}</p>
        </div>

        <LogoutButton />
      </div>

      <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold">Authentication is working</h2>
        <p className="mt-2 text-slate-400">
          Your session is verified on the server. Cricket management features
          will be added in a later step.
        </p>
      </div>
    </main>
  );
}
