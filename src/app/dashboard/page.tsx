export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
        Protected route
      </p>
      <h1 className="mt-4 text-3xl font-bold">Dashboard</h1>
      <p className="mt-3 text-slate-400">
        You can see this page because the session cookie is present. Cricket
        management features will be added in a later step.
      </p>
    </main>
  );
}
