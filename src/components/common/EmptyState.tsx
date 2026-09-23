import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { PrimaryButton, SecondaryButton } from '@/components/common/PrimaryButton';
import { GlassCard } from '@/components/common/GlassCard';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: EmptyStateProps) {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} style={styles.btn} />
      ) : null}
      {secondaryLabel && onSecondary ? (
        <SecondaryButton label={secondaryLabel} onPress={onSecondary} style={styles.btn} />
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center' },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  btn: { alignSelf: 'stretch', marginTop: 8 },
});
