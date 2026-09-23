import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppText } from '@/components/common/AppText';
import { GlassCard } from '@/components/common/GlassCard';
import { colors } from '@/constants/theme';
import { fonts } from '@/constants/typography';
import type { FlowLevel, InfectionRisk, ScanResult } from '@/types';
import { SecondaryButton } from '@/components/common/PrimaryButton';
import { formatDisplayDate } from '@/utils/dates';

function statusColor(level: FlowLevel | InfectionRisk): string {
  if (level === 'Low' || level === 'Normal' || level === 'Light') return colors.success;
  if (level === 'Moderate' || level === 'Heavy') return colors.warning;
  return colors.danger;
}

const DASHBOARD = {
  card: '#FFFFFF',
  border: 'rgba(31, 90, 61, 0.10)',
  ink: '#163F2B',
  muted: '#6B7D72',
  primary: '#1F5A3D',
};

export function HealthStatusCard({
  scan,
  onView,
  onViewHistory,
  emptyAction,
  dashboardTheme = false,
}: {
  scan?: ScanResult | null;
  onView?: () => void;
  onViewHistory?: () => void;
  emptyAction?: () => void;
  dashboardTheme?: boolean;
}) {
  if (dashboardTheme) {
    const cardStyle = [styles.dashboardCard, !scan && styles.dashboardCardEmpty];
    if (!scan) {
      return (
        <View style={cardStyle}>
          <AppText variant="h3" style={styles.dashboardTitle}>No health scan yet</AppText>
          <AppText variant="bodyMedium" style={styles.dashboardBody}>
            Track your first scan to see your health insights here.
          </AppText>
          {emptyAction ? (
            <SecondaryButton label="Scan New Pad" onPress={emptyAction} style={{ marginTop: 12 }} />
          ) : null}
        </View>
      );
    }

    return (
      <View style={cardStyle}>
        <AppText variant="h3" style={styles.dashboardTitle}>Recent Health Analysis</AppText>
        <AppText variant="caption" style={styles.dashboardMeta}>
          {formatDisplayDate(scan.createdAt, 'd MMMM yyyy')}
        </AppText>
        <StatusRow label="Flow Level" value={scan.flowLevel} dashboardTheme />
        <StatusRow label="Infection Risk" value={scan.infectionRisk} dashboardTheme />
        <View style={styles.dashboardActions}>
          {onView ? (
            <SecondaryButton label="View Result" onPress={onView} style={{ flex: 1 }} />
          ) : null}
          {onViewHistory ? (
            <Pressable accessibilityRole="button" onPress={onViewHistory} style={styles.historyLink}>
              <Text style={styles.historyLinkText}>View History →</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  }

  if (!scan) {
    return (
      <GlassCard elevated accent="lavender">
        <AppText variant="h3">No health scan yet</AppText>
        <AppText variant="bodyMedium" style={styles.body}>
          Track your first scan to see your health insights here.
        </AppText>
        {emptyAction ? (
          <SecondaryButton label="Scan New Pad" onPress={emptyAction} style={{ marginTop: 12 }} />
        ) : null}
      </GlassCard>
    );
  }

  return (
    <GlassCard elevated accent="rose">
      <AppText variant="h3">Last Health Scan</AppText>
      <AppText variant="caption" style={styles.meta}>
        {formatDisplayDate(scan.createdAt, 'd MMMM yyyy')}
      </AppText>
      <StatusRow label="Flow Level" value={scan.flowLevel} />
      <StatusRow label="Infection Risk" value={scan.infectionRisk} />
      {onView ? (
        <SecondaryButton label="View Full Result" onPress={onView} style={{ marginTop: 12 }} />
      ) : null}
    </GlassCard>
  );
}

function StatusRow({
  label,
  value,
  dashboardTheme = false,
}: {
  label: string;
  value: FlowLevel | InfectionRisk;
  dashboardTheme?: boolean;
}) {
  const dotColor = dashboardTheme ? DASHBOARD.primary : statusColor(value);
  return (
    <View style={styles.row}>
      <AppText variant="label" style={dashboardTheme ? styles.dashboardLabel : undefined}>{label}</AppText>
      <View style={styles.badge}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
        <AppText variant="bodyMedium" style={dashboardTheme ? styles.dashboardValue : styles.rowValue}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

export function ScanResultCard({ scan }: { scan: ScanResult }) {
  return (
    <GlassCard>
      <Text style={styles.title}>Health Scan Result</Text>
      {scan.imageUri ? (
        <Image
          source={{ uri: scan.imageUri }}
          style={styles.scanImage}
          accessibilityLabel="Health scan image"
        />
      ) : null}
      <StatusRow label="Flow Level" value={scan.flowLevel} />
      <StatusRow label="Infection Risk" value={scan.infectionRisk} />
      <Text style={[styles.title, { marginTop: 16, fontSize: 16 }]}>Detected Indicators</Text>
      {scan.indicators.map((item) => (
        <Text key={item} style={styles.indicator}>
          • {item}
        </Text>
      ))}
      <Text style={styles.disclaimer}>{scan.disclaimer}</Text>
    </GlassCard>
  );
}

export function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <GlassCard style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        {value}
        {suffix ? <Text style={styles.suffix}> {suffix}</Text> : null}
      </Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  meta: {
    color: colors.inkMuted,
    marginBottom: 12,
    fontSize: 13,
  },
  body: {
    color: colors.inkMuted,
    lineHeight: 21,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  rowLabel: {
    color: colors.inkMuted,
    fontSize: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rowValue: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 14,
  },
  indicator: {
    color: colors.ink,
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  disclaimer: {
    marginTop: 16,
    color: colors.inkMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  scanImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: colors.primaryMuted,
  },
  statCard: {
    flex: 1,
    minWidth: '46%',
  },
  statLabel: {
    color: colors.inkMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  statValue: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
  },
  suffix: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.inkMuted,
  },
  dashboardCard: {
    backgroundColor: DASHBOARD.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: DASHBOARD.border,
    padding: 20,
    shadowColor: DASHBOARD.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  dashboardCardEmpty: {
    marginBottom: 4,
  },
  dashboardTitle: {
    color: DASHBOARD.ink,
  },
  dashboardBody: {
    color: DASHBOARD.muted,
  },
  dashboardMeta: {
    color: DASHBOARD.muted,
    marginBottom: 12,
  },
  dashboardLabel: {
    color: DASHBOARD.muted,
  },
  dashboardValue: {
    color: DASHBOARD.ink,
    fontWeight: '700',
  },
  dashboardActions: {
    marginTop: 14,
    gap: 10,
  },
  historyLink: {
    alignSelf: 'center',
    paddingVertical: 6,
  },
  historyLinkText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: DASHBOARD.primary,
    fontWeight: '600',
  },
});
