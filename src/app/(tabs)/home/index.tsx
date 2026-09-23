import React, { useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';
import { CycleProgress } from '@/components/charts/CycleProgress';
import { HealthStatusCard } from '@/components/cards/HealthStatusCard';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { CharacterIllustration } from '@/assets/characters/CharacterIllustration';
import { useAuth } from '@/hooks/useAuth';
import { useCycles } from '@/hooks/useCycles';
import { useScanHistory } from '@/hooks/useScanHistory';
import type { CyclePrediction } from '@/types';
import { fonts } from '@/constants/typography';
import { getGreeting } from '@/utils/dates';
import { formatDisplayDate } from '@/utils/dates';

const BRAND_PRIMARY = '#1F5A3D';
const BRAND_DARK = '#163F2B';
const BG = '#F1F7F3';
const BG_SOFT = '#F7FAF8';
const CARD = '#FFFFFF';
const SOFT_GREEN = '#E5F0E9';
const TEXT_SECONDARY = '#6B7D72';
const TEXT_MUTED = '#91A097';
const BORDER = 'rgba(31, 90, 61, 0.10)';

const CONTENT_HORIZONTAL_PADDING = 20;

function getCycleCenterCopy(prediction: CyclePrediction) {
  if (!prediction.hasData || prediction.daysUntilNextPeriod === null) {
    return {
      title: 'Cycle',
      main: '—',
      subtitle: 'Add a period to begin',
    };
  }
  if (prediction.daysUntilNextPeriod <= 0) {
    return {
      title: 'Period',
      main: 'Today',
      subtitle: prediction.currentCycleDay
        ? `Day ${prediction.currentCycleDay}`
        : 'Take care of you',
    };
  }
  return {
    title: 'Period in',
    main: `${prediction.daysUntilNextPeriod} Days`,
    subtitle: prediction.currentCycleDay
      ? `Cycle day ${prediction.currentCycleDay}`
      : formatDisplayDate(prediction.nextPeriodDate),
  };
}

export default function HomeScreen() {
  const { profile } = useAuth();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const quickActionWidth = (windowWidth - CONTENT_HORIZONTAL_PADDING * 2) / 2;
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const {
    prediction,
    isLoading: cyclesLoading,
    isError: cyclesError,
    refetch: refetchCycles,
    isRefetching: cyclesRefetching,
  } = useCycles();
  const {
    latestScan,
    isLoading: scansLoading,
    refetch: refetchScans,
    isRefetching: scansRefetching,
  } = useScanHistory();

  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }, []);

  const cycleCenter = getCycleCenterCopy(prediction);

  if ((cyclesLoading || scansLoading) && !profile) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  if (!profile) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
          <ErrorState message="Profile not found. Please complete onboarding." />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.blobA} />
      <View style={styles.blobB} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={cyclesRefetching || scansRefetching}
              onRefresh={() => {
                refetchCycles();
                refetchScans();
              }}
              tintColor={BRAND_PRIMARY}
            />
          }
        >
          <View style={styles.headerRow}>
            <View style={styles.headerTextCol}>
              <Text style={styles.greeting}>
                {getGreeting()}, {profile.name}
              </Text>
              <Text style={styles.greetingSub}>How are you feeling today?</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open profile"
              onPress={() => router.push('/(tabs)/profile')}
              style={styles.avatarButton}
            >
              <CharacterIllustration id={profile.characterId} size={44} />
            </Pressable>
          </View>

          <View style={styles.weekStrip}>
            {weekDays.map((day) => {
              const selected = isSameDay(day, selectedDate);
              return (
                <Pressable
                  key={day.toISOString()}
                  accessibilityRole="button"
                  accessibilityLabel={format(day, 'EEEE d')}
                  onPress={() => setSelectedDate(day)}
                  style={styles.weekDayCell}
                >
                  <Text style={[styles.weekDayLabel, selected && styles.weekDayLabelSelected]}>
                    {format(day, 'EEEEE')}
                  </Text>
                  <View style={[styles.weekDatePill, selected && styles.weekDatePillSelected]}>
                    <Text style={[styles.weekDateText, selected && styles.weekDateTextSelected]}>
                      {format(day, 'dd')}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {cyclesError ? (
            <ErrorState
              message="Unable to load cycle data."
              onRetry={() => refetchCycles()}
            />
          ) : (
            <View style={styles.mainCard}>
              <View style={styles.progressWrap}>
                <CycleProgress
                  day={prediction.currentCycleDay}
                  progress={prediction.progressRatio}
                  size={200}
                  trackColor={SOFT_GREEN}
                  progressColor={BRAND_PRIMARY}
                  centerTitle={cycleCenter.title}
                  centerMain={cycleCenter.main}
                  centerSubtitle={cycleCenter.subtitle}
                />
              </View>

              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: BRAND_DARK }]} />
                  <Text style={styles.legendText}>Period</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: BRAND_PRIMARY }]} />
                  <Text style={styles.legendText}>Ovulation</Text>
                </View>
              </View>

              <Text style={styles.nextPeriodLabel}>Next period</Text>
              <Text style={styles.nextPeriodDate}>
                {prediction.nextPeriodDate
                  ? formatDisplayDate(prediction.nextPeriodDate)
                  : 'Add a period to begin'}
              </Text>
            </View>
          )}

          <Text style={styles.sectionHeading}>Quick Actions</Text>
          <View style={styles.quickGridFrame}>
            <View style={styles.grid}>
              <QuickAction
                width={quickActionWidth}
                icon="scan-outline"
                label="Scan New Pad"
                subtitle="Pad health scan"
                showRightDivider
                showBottomDivider
                onPress={() => router.push('/scan/camera')}
              />
              <QuickAction
                width={quickActionWidth}
                icon="heart-outline"
                label="Health Analysis"
                subtitle="View insights"
                showBottomDivider
                onPress={() => router.push('/(tabs)/analysis')}
              />
              <QuickAction
                width={quickActionWidth}
                icon="calendar-outline"
                label="Period Tracker"
                subtitle="Log & calendar"
                showRightDivider
                onPress={() => router.push('/(tabs)/period')}
              />
              <QuickAction
                width={quickActionWidth}
                icon="bar-chart-outline"
                label="View Reports"
                subtitle="Your trends"
                onPress={() => router.push('/reports')}
              />
            </View>
          </View>

          <Text style={styles.sectionHeading}>Recent Health Analysis</Text>
          <HealthStatusCard
            dashboardTheme
            scan={latestScan}
            onView={
              latestScan
                ? () => router.push({ pathname: '/scan/result', params: { id: latestScan.id } })
                : undefined
            }
            onViewHistory={() => router.push('/(tabs)/analysis')}
            emptyAction={() => router.push('/scan/camera')}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function QuickAction({
  width,
  icon,
  label,
  subtitle,
  showRightDivider,
  showBottomDivider,
  onPress,
}: {
  width: number;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle: string;
  showRightDivider?: boolean;
  showBottomDivider?: boolean;
  onPress: () => void;
}) {
  return (
    <View
      style={[
        styles.actionCell,
        { width },
        showRightDivider && styles.actionCellRightLine,
        showBottomDivider && styles.actionCellBottomLine,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [styles.actionCard, pressed && styles.actionPressed]}
      >
        <View style={styles.actionIconWrap}>
          <Ionicons name={icon} size={22} color={BRAND_PRIMARY} />
        </View>
        <Text style={styles.actionLabel} numberOfLines={2}>{label}</Text>
        <Text style={styles.actionSubtitle} numberOfLines={1}>{subtitle}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  blobA: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -60,
    right: -40,
    backgroundColor: 'rgba(31, 90, 61, 0.08)',
  },
  blobB: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    top: 120,
    left: -70,
    backgroundColor: 'rgba(22, 63, 43, 0.06)',
  },
  content: {
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    paddingBottom: 120,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  headerTextCol: {
    flex: 1,
  },
  greeting: {
    fontFamily: fonts.heading,
    fontSize: 26,
    lineHeight: 32,
    color: BRAND_DARK,
  },
  greetingSub: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontSize: 15,
    color: TEXT_SECONDARY,
  },
  avatarButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: BRAND_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: BG_SOFT,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
  },
  weekDayCell: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  weekDayLabel: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 6,
  },
  weekDayLabelSelected: {
    color: BRAND_DARK,
  },
  weekDatePill: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  weekDatePillSelected: {
    backgroundColor: BRAND_DARK,
  },
  weekDateText: {
    fontFamily: fonts.accent,
    fontSize: 14,
    color: BRAND_DARK,
  },
  weekDateTextSelected: {
    color: '#FFFFFF',
  },
  mainCard: {
    backgroundColor: CARD,
    borderRadius: 30,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: BRAND_DARK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  progressWrap: {
    marginVertical: 4,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  nextPeriodLabel: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: TEXT_MUTED,
  },
  nextPeriodDate: {
    marginTop: 4,
    fontFamily: fonts.heading,
    fontSize: 18,
    color: BRAND_DARK,
  },
  sectionHeading: {
    marginTop: 22,
    marginBottom: 12,
    fontFamily: fonts.title,
    fontSize: 18,
    color: BRAND_DARK,
  },
  quickGridFrame: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    overflow: 'hidden',
    shadowColor: BRAND_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionCell: {
    minWidth: 0,
  },
  actionCellRightLine: {
    borderRightWidth: 1,
    borderRightColor: BORDER,
  },
  actionCellBottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  actionCard: {
    backgroundColor: CARD,
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: 124,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SOFT_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontFamily: fonts.accent,
    fontSize: 14,
    color: BRAND_DARK,
    textAlign: 'center',
  },
  actionSubtitle: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 11,
    color: TEXT_MUTED,
    textAlign: 'center',
  },
});
