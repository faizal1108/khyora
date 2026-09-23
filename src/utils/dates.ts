import {
  addDays,
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
  startOfDay,
} from 'date-fns';

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? startOfDay(parsed) : null;
}

export function formatDisplayDate(value: string | Date | null | undefined, pattern = 'd MMMM'): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? parseDate(value) : value;
  if (!date) return '—';
  return format(date, pattern);
}

export function formatShortDate(value: string | Date | null | undefined): string {
  return formatDisplayDate(value, 'd MMM');
}

export function daysBetween(start: Date, end: Date): number {
  return differenceInCalendarDays(startOfDay(end), startOfDay(start));
}

export function addDaysSafe(date: Date, amount: number): Date {
  return addDays(startOfDay(date), amount);
}

export function getGreeting(now = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
