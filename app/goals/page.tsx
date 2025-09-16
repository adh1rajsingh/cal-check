"use client";
import { useGoals } from '../../hooks/useGoals';

export default function GoalsPage() {
  const { goals, ready, removeGoal, refresh } = useGoals();

  return (
    <main className="mx-auto max-w-5xl px-6 pb-32">
      <header className="pt-10 md:pt-16 mb-10 space-y-4">
        <h1 className="font-serif text-4xl tracking-tight">Your Goals</h1>
        <p className="text-base-subtler max-w-prose">Overview of all goal calendars you have created on this device.</p>
      </header>
      {!ready && <p className="text-sm text-base-subtler">Loading...</p>}
      {ready && goals.length === 0 && (
        <p className="text-sm text-base-subtler">No goals yet. Create one on the homepage.</p>
      )}
      {ready && goals.length > 0 && (
        <div className="space-y-8">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map(g => (
              <li key={g.id} className="group relative rounded-xl ring-1 ring-base-border bg-white shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
                <div className="space-y-1">
                  <a href={`/c/${g.id}`} className="font-medium tracking-tight text-base-text hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm">{g.title}</a>
                  <p className="text-xs text-base-subtler">{g.start} → {g.end}</p>
                </div>
                <div className="h-2 rounded-full bg-base-border/60 overflow-hidden">
                  <div className="h-full bg-accent transition-all" style={{ width: (g.pct * 100).toFixed(1) + '%' }} />
                </div>
                <p className="text-xs text-base-subtler">{g.completed}/{g.total} ({Math.round(g.pct * 100)}%)</p>
                <div className="flex gap-3 mt-auto">
                  <a href={`/c/${g.id}`} className="text-xs font-medium text-accent hover:text-accent-hover">Open</a>
                  <button type="button" onClick={() => removeGoal(g.id)} className="text-xs text-base-subtler hover:text-danger ml-auto" aria-label={`Delete goal ${g.title}`}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex gap-4 text-xs">
            <button type="button" onClick={() => refresh()} className="px-3 py-1.5 rounded-md border border-base-border hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">Refresh</button>
          </div>
        </div>
      )}
    </main>
  );
}
