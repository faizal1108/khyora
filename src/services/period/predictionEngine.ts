import {
  DEFAULT_CYCLE_LENGTH,
  DEFAULT_PERIOD_LENGTH,
} from '@/constants/theme';
import type { CyclePrediction, CycleRecord, UserProfile } from '@/types';
import { addDaysSafe, daysBetween, parseDate } from '@/utils/dates';
import { differenceInCalendarDays, startOfDay } from 'date-fns';

function computeAverageCycleLength(
  cycles: CycleRecord[],
  profile: UserProfile | null,
): number {
  if (cycles.length >= 2) {
    const sorted = [...cycles].sort((a, b) =>
      a.periodStartDate.localeCompare(b.periodStartDate),
    );
    const lengths: number[] = [];
    for (let i = 1; i < sorted.length; i += 1) {
      const prev = parseDate(sorted[i - 1].periodStartDate);
      const curr = parseDate(sorted[i].periodStartDate);
      if (prev && curr) {
        const gap = daysBetween(prev, curr);
        if (gap >= 15 && gap <= 60) lengths.push(gap);
      }
    }
    if (lengths.length) {
      return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
    }
  }

  if (cycles.length === 1 && cycles[0].cycleLength) {
    return cycles[0].cycleLength;
  }

  return profile?.averageCycleLength ?? DEFAULT_CYCLE_LENGTH;
}

function computeAveragePeriodLength(cycles: CycleRecord[]): number {
  if (!cycles.length) return DEFAULT_PERIOD_LENGTH;
  const total = cycles.reduce((sum, c) => sum + (c.periodLength || DEFAULT_PERIOD_LENGTH), 0);
  return Math.round(total / cycles.length);
}

export function calculatePrediction(
  cycles: CycleRecord[],
  profile: UserProfile | null,
  now = new Date(),
): CyclePrediction {
  const averageCycleLength = computeAverageCycleLength(cycles, profile);
  const averagePeriodLength = computeAveragePeriodLength(cycles);
  const today = startOfDay(now);

  const latest =
    cycles.length > 0
      ? [...cycles].sort((a, b) => b.periodStartDate.localeCompare(a.periodStartDate))[0]
      : null;

  const latestStart =
    parseDate(latest?.periodStartDate) ?? parseDate(profile?.lastPeriodDate ?? null);

  if (!latestStart) {
    return {
      currentCycleDay: null,
      averageCycleLength,
      averagePeriodLength,
      nextPeriodDate: null,
      expectedPeriodEnd: null,
      predictionWindowStart: null,
      predictionWindowEnd: null,
      daysUntilNextPeriod: null,
      progressRatio: 0,
      hasData: false,
    };
  }

  let currentCycleDay = differenceInCalendarDays(today, latestStart) + 1;
  if (currentCycleDay < 1) currentCycleDay = 1;

  const nextPeriodDate = addDaysSafe(latestStart, averageCycleLength);
  const expectedPeriodEnd = addDaysSafe(nextPeriodDate, averagePeriodLength - 1);
  const predictionWindowStart = addDaysSafe(nextPeriodDate, -1);
  const predictionWindowEnd = addDaysSafe(nextPeriodDate, 2);
  const daysUntilNextPeriod = differenceInCalendarDays(nextPeriodDate, today);
  const progressRatio = Math.min(1, Math.max(0, currentCycleDay / averageCycleLength));

  return {
    currentCycleDay,
    averageCycleLength,
    averagePeriodLength,
    nextPeriodDate,
    expectedPeriodEnd,
    predictionWindowStart,
    predictionWindowEnd,
    daysUntilNextPeriod,
    progressRatio,
    hasData: true,
  };
}
