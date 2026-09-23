import { Timestamp } from 'firebase/firestore';
import { format, isToday, isValid, isYesterday } from 'date-fns';

export function toDateFromScanTimestamp(value: unknown): Date | null {
  if (value == null) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return isValid(parsed) ? parsed : null;
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as Timestamp).toDate === 'function'
  ) {
    return (value as Timestamp).toDate();
  }
  return null;
}

export function formatScanDate(value: unknown): string {
  const date = toDateFromScanTimestamp(value);
  if (!date) return '—';
  if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`;
  if (isYesterday(date)) return `Yesterday, ${format(date, 'h:mm a')}`;
  return format(date, 'd MMM yyyy');
}

export function formatScanDateHeading(value: unknown): string {
  const date = toDateFromScanTimestamp(value);
  if (!date) return '—';
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'd MMM yyyy');
}

export function formatScanTime(value: unknown): string {
  const date = toDateFromScanTimestamp(value);
  if (!date) return '—';
  return format(date, 'h:mm a');
}
