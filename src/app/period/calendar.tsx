import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { CycleCalendar } from '@/components/calendar/CycleCalendar';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useCycles } from '@/hooks/useCycles';
import { colors } from '@/constants/theme';

export default function PeriodCalendarScreen() {
  const { cycles, prediction, isLoading } = useCycles();

  if (isLoading) return <LoadingScreen />;

  return (
    <AnimatedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.subtitle}>
            Previous, current, and predicted periods at a glance.
          </Text>
          <CycleCalendar cycles={cycles} prediction={prediction} />
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  subtitle: {
    color: colors.inkMuted,
    marginBottom: 16,
    lineHeight: 20,
  },
});
