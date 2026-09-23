import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '@/components/common/GlassCard';
import { DISCLAIMERS, colors } from '@/constants/theme';
import type { CyclePrediction } from '@/types';
import { formatDisplayDate, formatShortDate } from '@/utils/dates';

export function PredictionCard({ prediction }: { prediction: CyclePrediction }) {
  if (!prediction.hasData || !prediction.nextPeriodDate) {
    return null;
  }

  return (
    <GlassCard>
      <Text style={styles.eyebrow}>Your next period</Text>
      <Text style={styles.date}>{formatDisplayDate(prediction.nextPeriodDate)}</Text>
      <Text style={styles.countdown}>
        {prediction.daysUntilNextPeriod != null && prediction.daysUntilNextPeriod >= 0
          ? `in ${prediction.daysUntilNextPeriod} days`
          : 'Period window may have started'}
      </Text>

      <View style={styles.divider} />

      <Text style={styles.section}>Estimated cycle window</Text>
      <Text style={styles.window}>
        {formatShortDate(prediction.predictionWindowStart)} –{' '}
        {formatShortDate(prediction.predictionWindowEnd)}
      </Text>
      <Text style={styles.meta}>Based on your recent cycle history</Text>
      <Text style={styles.disclaimer}>{DISCLAIMERS.prediction}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    marginTop: 6,
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
  },
  countdown: {
    marginTop: 4,
    color: colors.primaryDeep,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(232,132,154,0.2)',
    marginVertical: 16,
  },
  section: {
    color: colors.inkMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  window: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  meta: {
    marginTop: 8,
    color: colors.inkSoft,
    fontSize: 13,
  },
  disclaimer: {
    marginTop: 12,
    color: colors.inkMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});
