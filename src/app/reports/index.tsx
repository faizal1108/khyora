import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { GlassCard } from '@/components/common/GlassCard';
import { StatCard } from '@/components/cards/HealthStatusCard';
import { PrimaryButton, SecondaryButton } from '@/components/common/PrimaryButton';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useCycles } from '@/hooks/useCycles';
import { useScanHistory } from '@/hooks/useScanHistory';
import { colors, DISCLAIMERS } from '@/constants/theme';
import { formatShortDate } from '@/utils/dates';
import { useRouter } from 'expo-router';

export default function ReportsScreen() {
  const { cycles, prediction, isLoading: cyclesLoading } = useCycles();
  const { scans, isLoading: scansLoading } = useScanHistory();
  const router = useRouter();

  if (cyclesLoading || scansLoading) {
    return <LoadingScreen message="Building reports..." />;
  }

  const heavyScans = scans.filter((s) => s.flowLevel === 'Heavy').length;
  const elevatedRisk = scans.filter((s) => s.infectionRisk === 'Elevated').length;

  return (
    <AnimatedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Health Reports</Text>

          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={styles.section}>Period Summary</Text>
            <Text style={styles.line}>Logged cycles: {cycles.length}</Text>
            <Text style={styles.line}>
              Average cycle: {prediction.averageCycleLength} days
            </Text>
            <Text style={styles.line}>
              Average period: {prediction.averagePeriodLength} days
            </Text>
            <Text style={styles.line}>
              Next estimate:{' '}
              {prediction.nextPeriodDate
                ? formatShortDate(prediction.nextPeriodDate)
                : '—'}
            </Text>
          </GlassCard>

          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={styles.section}>Scan Summary</Text>
            <Text style={styles.line}>Total scans: {scans.length}</Text>
            <Text style={styles.line}>Heavy flow readings: {heavyScans}</Text>
            <Text style={styles.line}>Elevated risk flags: {elevatedRisk}</Text>
          </GlassCard>

          <View style={styles.row}>
            <StatCard
              label="Cycle Day"
              value={prediction.currentCycleDay ?? '—'}
            />
            <StatCard label="Scans" value={scans.length} />
          </View>

          <GlassCard style={{ marginTop: 16 }}>
            <Text style={styles.section}>Cycle Trends</Text>
            <Text style={styles.body}>
              Review detailed charts in Period Statistics and individual scan reports in
              Health Analysis.
            </Text>
            <SecondaryButton
              label="Open Statistics"
              onPress={() => router.push('/period/statistics')}
              style={{ marginTop: 12 }}
            />
          </GlassCard>

          <PrimaryButton
            label="Export Report"
            onPress={() =>
              Alert.alert(
                'Coming soon',
                'PDF export architecture is ready. Generation will be added in a future update.',
              )
            }
            style={{ marginTop: 20 }}
          />
          <Text style={styles.disclaimer}>{DISCLAIMERS.scan}</Text>
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
  section: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 10,
  },
  line: {
    color: colors.inkMuted,
    marginBottom: 6,
    fontSize: 15,
  },
  body: {
    color: colors.inkMuted,
    lineHeight: 21,
  },
  row: { flexDirection: 'row', gap: 12 },
  disclaimer: {
    marginTop: 16,
    color: colors.inkMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});
