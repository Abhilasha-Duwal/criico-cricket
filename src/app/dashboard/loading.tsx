export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="h-4 w-40 rounded bg-slate-800" />
      <div className="mt-4 h-10 w-72 max-w-full rounded bg-slate-800" />
      <div className="mt-3 h-4 w-56 rounded bg-slate-800" />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 rounded-2xl border border-slate-800 bg-slate-900/50"
          />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="h-16 rounded-2xl bg-slate-900/50" />
          <div className="h-72 rounded-2xl border border-slate-800 bg-slate-900/50" />
        </div>
        <div className="space-y-6">
          <div className="h-80 rounded-2xl border border-slate-800 bg-slate-900/50" />
          <div className="h-64 rounded-2xl border border-slate-800 bg-slate-900/50" />
        </div>
      </div>
    </main>
  );
}
