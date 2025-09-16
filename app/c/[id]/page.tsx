"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { computeDays, useCalendarMetrics, CalendarData } from '../../../hooks/useCalendar';
import { useGoals } from '../../../hooks/useGoals';

function loadCalendar(id: string): CalendarData | null {
  try {
    const raw = localStorage.getItem(`calcheck:${id}`);
    if (!raw) return null;
    return JSON.parse(raw) as CalendarData;
  } catch {
    return null;
  }
}

function saveCalendar(data: CalendarData) {
  try { localStorage.setItem(`calcheck:${data.id}`, JSON.stringify(data)); } catch {}
}

export default function CalendarPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const { refresh } = useGoals();

  useEffect(() => {
    if (!id) return;
    const c = loadCalendar(id);
    if (!c) { router.replace('/'); return; }
    setCalendar(c);
  }, [id, router]);

  const dayIsos = useMemo(() => computeDays(calendar), [calendar]);
  const metrics = useCalendarMetrics(calendar);

  function toggleDay(iso: string) {
    if (!calendar) return;
    const checked = calendar.checked.includes(iso)
      ? calendar.checked.filter(d => d !== iso)
      : [...calendar.checked, iso];
    const next = { ...calendar, checked };
    setCalendar(next);
    saveCalendar(next);
    refresh();
  }

  if (!calendar) return <main className="p-12 text-center">Loading...</main>;

  return (
    <main className="mx-auto max-w-6xl px-6 pb-32">
      <header className="pt-10 md:pt-16 mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight">{calendar.title}</h1>
          <p className="text-base-subtler text-sm">{format(parseISO(calendar.start), 'MMM d, yyyy')} – {format(parseISO(calendar.end), 'MMM d, yyyy')}</p>
          <div className="flex flex-wrap gap-4 text-sm text-base-subtler">
            <span><strong className="text-base-text">{metrics.total}</strong> days</span>
            <span><strong className="text-base-text">{metrics.completed}</strong> completed</span>
            <span><strong className="text-base-text">{metrics.remaining}</strong> remaining</span>
          </div>
        </div>
        <div className="w-full md:w-80 space-y-2">
          <div className="h-3 rounded-full bg-base-border/60 overflow-hidden">
            <div className="h-full bg-accent transition-all duration-500" style={{ width: metrics.pct + '%' }} />
          </div>
          <p className="text-xs text-base-subtler">Progress {metrics.completed}/{metrics.total}</p>
        </div>
      </header>
      <section className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(46px, 1fr))' }} aria-label="Calendar days">
        {dayIsos.map(iso => {
          const checked = calendar.checked.includes(iso);
          const dayNum = iso.slice(-2).replace(/^0/, '');
          return (
            <button
              key={iso}
              onClick={() => toggleDay(iso)}
              aria-pressed={checked}
              aria-label={`${format(parseISO(iso), 'MMM d, yyyy')} ${checked ? 'completed' : 'not completed'}`}
              className={`relative group aspect-square flex items-center justify-center rounded-md border text-sm font-medium select-none transition-colors motion-safe:duration-300
                ${checked ? 'bg-accent text-white border-accent shadow-sm' : 'bg-base-surface border-base-border hover:bg-accent/10'} focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`}
            >
              <span>{dayNum}</span>
              {checked && (
                <span className="absolute inset-0 flex items-center justify-center text-[0.65rem] font-semibold tracking-wide opacity-0 group-[aria-pressed=true]:opacity-100 transition-opacity text-white/80">✓</span>
              )}
            </button>
          );
        })}
      </section>
    </main>
  );
}
