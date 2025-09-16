import { useMemo } from 'react';
import { eachDayOfInterval, parseISO, differenceInCalendarDays, format } from 'date-fns';

export interface CalendarData {
  id: string;
  title: string;
  start: string; // yyyy-MM-dd
  end: string;   // yyyy-MM-dd
  checked: string[]; // yyyy-MM-dd
  createdAt: string;
}

export function computeDays(data: CalendarData | null) {
  if (!data) return [] as string[];
  return eachDayOfInterval({ start: parseISO(data.start), end: parseISO(data.end) })
    .map(d => format(d, 'yyyy-MM-dd'));
}

export function useCalendarMetrics(data: CalendarData | null) {
  return useMemo(() => {
    if (!data) return { total: 0, completed: 0, remaining: 0, pct: 0 };
    const total = differenceInCalendarDays(parseISO(data.end), parseISO(data.start)) + 1;
    const completed = data.checked.length;
    const remaining = total - completed;
    const pct = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, remaining, pct };
  }, [data]);
}
