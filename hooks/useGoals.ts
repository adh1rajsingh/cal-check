import { useEffect, useState, useCallback } from 'react';
import { CalendarData } from './useCalendar';
import { parseISO, differenceInCalendarDays } from 'date-fns';

export interface GoalMeta {
  id: string;
  title: string;
  start: string;
  end: string;
  createdAt: string;
  // derived
  total: number;
  completed: number;
  remaining: number;
  pct: number;
}

const INDEX_KEY = 'calcheck:index';

function deriveMeta(cal: CalendarData): GoalMeta {
  const total = differenceInCalendarDays(parseISO(cal.end), parseISO(cal.start)) + 1;
  const completed = cal.checked.length;
  const remaining = total - completed;
  const pct = total > 0 ? completed / total : 0;
  return { id: cal.id, title: cal.title, start: cal.start, end: cal.end, createdAt: cal.createdAt, total, completed, remaining, pct };
}

export function loadCalendar(id: string): CalendarData | null {
  try {
    const raw = localStorage.getItem(`calcheck:${id}`);
    if (!raw) return null;
    return JSON.parse(raw) as CalendarData;
  } catch {
    return null;
  }
}

export function useGoals() {
  const [goals, setGoals] = useState<GoalMeta[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(INDEX_KEY);
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        const metas: GoalMeta[] = ids.map(id => {
          const c = loadCalendar(id);
            if (c) return deriveMeta(c);
            return null;
        }).filter(Boolean) as GoalMeta[];
        setGoals(metas.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch {}
    setReady(true);
  }, []);

  const saveIndex = useCallback((ids: string[]) => {
    try { localStorage.setItem(INDEX_KEY, JSON.stringify(ids)); } catch {}
  }, []);

  const refresh = useCallback(() => {
    try {
      const raw = localStorage.getItem(INDEX_KEY);
      if (!raw) { setGoals([]); return; }
      const ids: string[] = JSON.parse(raw);
      const metas: GoalMeta[] = ids.map(id => {
        const c = loadCalendar(id);
        return c ? deriveMeta(c) : null;
      }).filter(Boolean) as GoalMeta[];
      setGoals(metas.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {}
  }, []);

  const addGoal = useCallback((cal: CalendarData) => {
    try {
      const raw = localStorage.getItem(INDEX_KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      if (!ids.includes(cal.id)) {
        const next = [cal.id, ...ids];
        saveIndex(next);
      }
      refresh();
    } catch {}
  }, [refresh, saveIndex]);

  const removeGoal = useCallback((id: string) => {
    try {
      const raw = localStorage.getItem(INDEX_KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const next = ids.filter(g => g !== id);
      saveIndex(next);
      localStorage.removeItem(`calcheck:${id}`);
      refresh();
    } catch {}
  }, [refresh, saveIndex]);

  return { goals, ready, addGoal, removeGoal, refresh } as const;
}
