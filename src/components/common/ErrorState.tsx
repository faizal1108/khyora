import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { GlassCard } from '@/components/common/GlassCard';
import { SecondaryButton } from '@/components/common/PrimaryButton';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <SecondaryButton label="Try again" onPress={onRetry} /> : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center' },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: colors.inkMuted,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
});
