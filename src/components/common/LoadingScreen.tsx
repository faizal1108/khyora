import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <View style={styles.container} accessibilityLabel={message}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  text: {
    marginTop: 16,
    color: colors.inkMuted,
    fontSize: 16,
  },
});
