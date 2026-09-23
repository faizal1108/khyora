import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/common/GlassCard';
import { colors } from '@/constants/theme';
import type { CyclePrediction, CycleRecord } from '@/types';
import { parseDate } from '@/utils/dates';

interface CycleCalendarProps {
  cycles: CycleRecord[];
  prediction: CyclePrediction;
}

type DayKind = 'previous' | 'current' | 'predicted' | null;

export function CycleCalendar({ cycles, prediction }: CycleCalendarProps) {
  const [month, setMonth] = useState(startOfMonth(new Date()));

  const marks = useMemo(() => {
    const map = new Map<string, DayKind>();
    const sorted = [...cycles].sort((a, b) =>
      b.periodStartDate.localeCompare(a.periodStartDate),
    );

    sorted.forEach((cycle, index) => {
      const start = parseDate(cycle.periodStartDate);
      const end = parseDate(cycle.periodEndDate);
      if (!start || !end) return;
      const kind: DayKind = index === 0 ? 'current' : 'previous';
      eachDayOfInterval({ start, end }).forEach((d) => {
        map.set(format(d, 'yyyy-MM-dd'), kind);
      });
    });

    if (prediction.nextPeriodDate && prediction.expectedPeriodEnd) {
      eachDayOfInterval({
        start: prediction.nextPeriodDate,
        end: prediction.expectedPeriodEnd,
      }).forEach((d) => {
        const key = format(d, 'yyyy-MM-dd');
        if (!map.has(key)) map.set(key, 'predicted');
      });
    }

    return map;
  }, [cycles, prediction]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });

  return (
    <GlassCard>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Previous month"
          onPress={() => setMonth((m) => subMonths(m, 1))}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.month}>{format(month, 'MMMM yyyy')}</Text>
        <Pressable
          accessibilityLabel="Next month"
          onPress={() => setMonth((m) => addMonths(m, 1))}
          hitSlop={12}
        >
          <Ionicons name="chevron-forward" size={22} color={colors.ink} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <Text key={d} style={styles.weekday}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const kind = marks.get(key) ?? null;
          const inMonth = isSameMonth(day, month);
          const today = isSameDay(day, new Date());

          return (
            <View key={key} style={styles.cell}>
              <View
                style={[
                  styles.dayBubble,
                  kind === 'previous' && styles.previous,
                  kind === 'current' && styles.current,
                  kind === 'predicted' && styles.predicted,
                  today && styles.today,
                  !inMonth && styles.outMonth,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    (kind === 'previous' || kind === 'current') && styles.dayTextOn,
                    !inMonth && styles.outMonthText,
                  ]}
                >
                  {format(day, 'd')}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        <LegendDot color={colors.secondary} label="Previous Period" solid />
        <LegendDot color={colors.primary} label="Current Cycle" solid />
        <LegendDot color={colors.primarySoft} label="Predicted Period" solid={false} />
      </View>
    </GlassCard>
  );
}

function LegendDot({
  color,
  label,
  solid,
}: {
  color: string;
  label: string;
  solid: boolean;
}) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          {
            backgroundColor: solid ? color : 'transparent',
            borderColor: color,
            borderStyle: solid ? 'solid' : 'dashed',
          },
        ]}
      />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  month: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    color: colors.inkMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    marginBottom: 6,
  },
  dayBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previous: {
    backgroundColor: colors.secondary,
  },
  current: {
    backgroundColor: colors.primary,
  },
  predicted: {
    borderWidth: 1.5,
    borderColor: colors.primarySoft,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(245, 181, 196, 0.2)',
  },
  today: {
    borderWidth: 1.5,
    borderColor: colors.ink,
  },
  outMonth: {
    opacity: 0.35,
  },
  dayText: {
    fontSize: 13,
    color: colors.ink,
    fontWeight: '600',
  },
  dayTextOn: {
    color: colors.white,
  },
  outMonthText: {
    color: colors.inkSoft,
  },
  legend: {
    marginTop: 12,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  legendLabel: {
    color: colors.inkMuted,
    fontSize: 13,
  },
});
