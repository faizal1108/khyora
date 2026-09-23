import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { PrimaryButton, SecondaryButton } from '@/components/common/PrimaryButton';
import { CycleCalendar } from '@/components/calendar/CycleCalendar';
import { PredictionCard } from '@/components/cards/PredictionCard';
import { StatCard } from '@/components/cards/HealthStatusCard';
import { useCycles } from '@/hooks/useCycles';
import { colors } from '@/constants/theme';

export default function PeriodScreen() {
  const router = useRouter();
  const {
    cycles,
    prediction,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useCycles();

  if (isLoading) return <LoadingScreen message="Loading cycle data..." />;

  return (
    <AnimatedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
              tintColor={colors.primary}
            />
          }
        >
          <Text style={styles.title}>Period Tracker</Text>

          {isError ? (
            <ErrorState
              message="Unable to load cycle data."
              onRetry={() => refetch()}
            />
          ) : null}

          {!isError && cycles.length === 0 && !prediction.hasData ? (
            <EmptyState
              title="Start tracking your cycle"
              description="Add your last period date to begin personalized cycle tracking."
              actionLabel="Add Period"
              onAction={() => router.push('/period/add-cycle')}
            />
          ) : (
            <>
              <View style={styles.statsRow}>
                <StatCard
                  label="Cycle Day"
                  value={prediction.currentCycleDay ?? '—'}
                />
                <StatCard
                  label="Avg Cycle"
                  value={prediction.averageCycleLength}
                  suffix="days"
                />
              </View>

              <View style={{ height: 16 }} />
              <PredictionCard prediction={prediction} />
              <View style={{ height: 16 }} />
              <CycleCalendar cycles={cycles} prediction={prediction} />

              <PrimaryButton
                label="Log Period"
                onPress={() => router.push('/period/add-cycle')}
                style={{ marginTop: 20 }}
              />
              <SecondaryButton
                label="View Statistics"
                onPress={() => router.push('/period/statistics')}
                style={{ marginTop: 12 }}
              />
              <SecondaryButton
                label="Full Calendar"
                onPress={() => router.push('/period/calendar')}
                style={{ marginTop: 12 }}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
