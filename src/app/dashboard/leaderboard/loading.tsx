export default function LeaderboardLoading() {
  return (
    <main className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="h-4 w-40 rounded bg-slate-800" />
      <div className="mt-4 h-10 w-72 max-w-full rounded bg-slate-800" />
      <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-800" />

      <div className="mt-6 h-24 rounded-2xl border border-slate-800 bg-slate-900/50" />

      <div className="mt-6 hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-4 md:block">
        <div className="h-10 rounded bg-slate-800" />
        {[0, 1, 2, 3, 4].map((item) => (
          <div key={item} className="mt-4 h-12 rounded bg-slate-900" />
        ))}
      </div>

      <div className="mt-6 space-y-3 md:hidden">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-40 rounded-2xl border border-slate-800 bg-slate-900/50"
          />
        ))}
      </div>
    </main>
  );
}
