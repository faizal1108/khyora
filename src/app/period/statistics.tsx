import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-gifted-charts';
import { format, parseISO } from 'date-fns';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { GlassCard } from '@/components/common/GlassCard';
import { StatCard } from '@/components/cards/HealthStatusCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useCycles } from '@/hooks/useCycles';
import { colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function PeriodStatisticsScreen() {
  const { cycles, prediction, isLoading } = useCycles();
  const router = useRouter();
  const width = Dimensions.get('window').width - 80;

  const chartData = useMemo(() => {
    const sorted = [...cycles].sort((a, b) =>
      a.periodStartDate.localeCompare(b.periodStartDate),
    );
    return sorted.map((cycle) => ({
      value: cycle.cycleLength,
      label: format(parseISO(cycle.periodStartDate), 'MMM'),
      dataPointText: String(cycle.cycleLength),
    }));
  }, [cycles]);

  const periodChart = useMemo(() => {
    const sorted = [...cycles].sort((a, b) =>
      a.periodStartDate.localeCompare(b.periodStartDate),
    );
    return sorted.map((cycle) => ({
      value: cycle.periodLength,
      label: format(parseISO(cycle.periodStartDate), 'MMM'),
    }));
  }, [cycles]);

  if (isLoading) return <LoadingScreen />;

  if (!cycles.length) {
    return (
      <AnimatedBackground>
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
          <EmptyState
            title="No statistics yet"
            description="Log a few periods to see cycle trends."
            actionLabel="Add Period"
            onAction={() => router.push('/period/add-cycle')}
          />
        </SafeAreaView>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.row}>
            <StatCard
              label="Average Cycle Length"
              value={prediction.averageCycleLength}
              suffix="days"
            />
          </View>
          <View style={[styles.row, { marginTop: 12 }]}>
            <StatCard
              label="Average Period Length"
              value={prediction.averagePeriodLength}
              suffix="days"
            />
            <StatCard
              label="Current Cycle Day"
              value={prediction.currentCycleDay ?? '—'}
            />
          </View>

          <GlassCard style={{ marginTop: 16 }}>
            <Text style={styles.chartTitle}>Cycle History</Text>
            {chartData.length > 0 ? (
              <LineChart
                data={chartData}
                width={width}
                height={180}
                color={colors.primary}
                thickness={3}
                dataPointsColor={colors.primaryDeep}
                startFillColor={colors.primarySoft}
                endFillColor="transparent"
                areaChart
                yAxisColor={colors.inkSoft}
                xAxisColor={colors.inkSoft}
                yAxisTextStyle={{ color: colors.inkMuted }}
                xAxisLabelTextStyle={{ color: colors.inkMuted, fontSize: 10 }}
                noOfSections={4}
                curved
              />
            ) : null}
          </GlassCard>

          <GlassCard style={{ marginTop: 16 }}>
            <Text style={styles.chartTitle}>Period Length History</Text>
            {periodChart.length > 0 ? (
              <LineChart
                data={periodChart}
                width={width}
                height={160}
                color={colors.secondary}
                thickness={3}
                dataPointsColor={colors.secondaryDeep}
                yAxisColor={colors.inkSoft}
                xAxisColor={colors.inkSoft}
                yAxisTextStyle={{ color: colors.inkMuted }}
                xAxisLabelTextStyle={{ color: colors.inkMuted, fontSize: 10 }}
                noOfSections={4}
              />
            ) : null}
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  row: { flexDirection: 'row', gap: 12 },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 12,
  },
});
