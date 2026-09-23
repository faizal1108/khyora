import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

export function OfflineBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.title}>You&apos;re offline</Text>
      <Text style={styles.body}>
        Your recent data is available locally. We&apos;ll sync when you&apos;re back online.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warningSoft,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 184, 109, 0.4)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 13,
  },
  body: {
    color: colors.inkMuted,
    fontSize: 12,
    marginTop: 2,
  },
});
