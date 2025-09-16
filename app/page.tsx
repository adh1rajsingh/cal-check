"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { differenceInCalendarDays, isAfter, isBefore, parseISO } from 'date-fns';
import { useGoals } from '../hooks/useGoals';

function generateId(len = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function Home() {
  const router = useRouter();
  const { goals, addGoal, removeGoal, ready } = useGoals();
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [error, setError] = useState<string | null>(null);

  const totalDays = (() => {
    try {
      return differenceInCalendarDays(parseISO(end), parseISO(start)) + 1;
    } catch {
      return 0;
    }
  })();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError('Title required');
    const s = parseISO(start);
    const eDate = parseISO(end);
    if (isBefore(eDate, s)) return setError('End date cannot be before start');
    if (differenceInCalendarDays(eDate, s) > 366) return setError('Limit to 1 year span for now');

    const id = generateId();
    const payload = { id, title: title.trim(), start, end, checked: [] as string[], createdAt: new Date().toISOString() };
    try { localStorage.setItem(`calcheck:${id}`, JSON.stringify(payload)); } catch {}
    addGoal(payload);
    router.push(`/c/${id}`);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pb-32">
      <section className="pt-10 md:pt-16">
        <header className="mb-10 space-y-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight">Cal Check</h1>
          <p className="text-base-subtler max-w-prose mx-auto">Create focused goal calendars and track several journeys side by side.</p>
        </header>
        <form onSubmit={handleSubmit} className="bg-base-surface/80 backdrop-blur rounded-xl shadow-sm ring-1 ring-base-border p-6 md:p-8 space-y-6 mb-14">
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="title">Goal Title</label>
            <input id="title" value={title} onChange={e => setTitle(e.target.value)} required
              placeholder="e.g. 30 Days of Coding" className="w-full rounded-md border border-base-border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="start">Start Date</label>
              <input id="start" type="date" value={start} max={end} onChange={e => setStart(e.target.value)} className="w-full rounded-md border border-base-border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="end">End Date</label>
              <input id="end" type="date" value={end} min={start} onChange={e => setEnd(e.target.value)} className="w-full rounded-md border border-base-border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition" />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-base-subtler">
            <span>{totalDays > 0 ? `${totalDays} day${totalDays === 1 ? '' : 's'}` : 'Select dates'}</span>
            {isAfter(parseISO(end), parseISO(start)) && totalDays > 0 && totalDays <= 366 && (
              <span className="text-accent">Looks good</span>
            )}
          </div>
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          <div className="pt-2">
            <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-accent text-white px-5 py-2.5 font-medium shadow-sm hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent transition-colors">
              Create Calendar
            </button>
          </div>
        </form>

        {ready && goals.length > 0 && (
          <section aria-label="Existing goals" className="space-y-6">
            <h2 className="font-serif text-2xl tracking-tight">Your Goals</h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          </section>
        )}
      </section>
    </main>
  );
}
