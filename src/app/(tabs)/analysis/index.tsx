import React from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { AppText } from '@/components/common/AppText';
import { GlassCard } from '@/components/common/GlassCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useScanHistory } from '@/hooks/useScanHistory';
import { colors } from '@/constants/theme';
import { fonts } from '@/constants/typography';
import { formatScanDateHeading, formatScanTime } from '@/utils/formatScanDate';

function ScanHistoryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.historyRow}>
      <AppText variant="label" style={styles.rowLabel}>{label}</AppText>
      <AppText variant="bodyMedium" style={styles.rowValue} numberOfLines={2}>
        {value}
      </AppText>
    </View>
  );
}

export default function AnalysisScreen() {
  const router = useRouter();
  const { scans, isLoading, isError, refetch, isRefetching } = useScanHistory();

  if (isLoading) return <LoadingScreen message="Loading scan history..." />;

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
          <GlassCard elevated style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <Ionicons name="heart" size={22} color={colors.primaryDeep} />
            </View>
            <AppText variant="display" style={styles.title}>Health Analysis</AppText>
            <AppText variant="subtitle">Review your pad scan timeline and trends</AppText>
          </GlassCard>

          <AppText variant="h3" style={styles.sectionLabel}>Scan History</AppText>

          {isError ? (
            <ErrorState
              message="Unable to load scan history"
              onRetry={() => refetch()}
            />
          ) : null}

          {!isError && scans.length === 0 ? (
            <GlassCard elevated>
              <EmptyState
                title="No health scans yet"
                description="Complete a pad scan to start building your health analysis timeline."
                actionLabel="Scan New Pad"
                onAction={() => router.push('/scan/camera')}
              />
            </GlassCard>
          ) : null}

          {!isError &&
            scans.map((scan) => (
              <Pressable
                key={scan.id}
                accessibilityRole="button"
                accessibilityLabel={`Open scan from ${formatScanDateHeading(scan.createdAt)}`}
                onPress={() =>
                  router.push({ pathname: '/scan/result', params: { id: scan.id } })
                }
              >
                <GlassCard elevated accent="rose" style={styles.item}>
                  <View style={styles.itemHeader}>
                    <AppText variant="h3" style={styles.date}>
                      {formatScanDateHeading(scan.createdAt)}
                    </AppText>
                    <Ionicons name="chevron-forward" size={18} color={colors.inkSoft} />
                  </View>
                  <ScanHistoryRow label="Flow Level" value={scan.flowLevel} />
                  <ScanHistoryRow label="Infection Risk" value={scan.infectionRisk} />
                  <View style={styles.divider} />
                  <ScanHistoryRow label="Scan time" value={formatScanTime(scan.createdAt)} />
                </GlassCard>
              </Pressable>
            ))}
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 108, gap: 14 },
  heroCard: {
    alignItems: 'flex-start',
    gap: 6,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassEdge,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
  },
  sectionLabel: {
    marginTop: 4,
    marginBottom: 2,
  },
  item: {
    marginBottom: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  date: {
    fontSize: 17,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 6,
  },
  rowLabel: {
    flex: 1,
    fontFamily: fonts.body,
  },
  rowValue: {
    flex: 1,
    textAlign: 'right',
    color: colors.ink,
    fontFamily: fonts.accent,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.65)',
    marginVertical: 12,
  },
});
