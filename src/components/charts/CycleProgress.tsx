import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/constants/theme';

interface CycleProgressProps {
  day: number | null;
  progress: number;
  size?: number;
  trackColor?: string;
  progressColor?: string;
  centerTitle?: string;
  centerMain?: string;
  centerSubtitle?: string;
}

export function CycleProgress({
  day,
  progress,
  size = 160,
  trackColor = colors.primaryMuted,
  progressColor = colors.primary,
  centerTitle,
  centerMain,
  centerSubtitle,
}: CycleProgressProps) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, progress));
  const offset = circumference * (1 - clamped);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.labelWrap}>
        {centerTitle || centerMain || centerSubtitle ? (
          <>
            {centerTitle ? <Text style={styles.centerTitle}>{centerTitle}</Text> : null}
            <Text style={[styles.day, styles.dayCompact]}>{centerMain ?? (day ?? '—')}</Text>
            <Text style={styles.caption}>{centerSubtitle ?? 'Day'}</Text>
          </>
        ) : (
          <>
            <Text style={styles.day}>{day ?? '—'}</Text>
            <Text style={styles.caption}>Day</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  centerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkMuted,
    marginBottom: 2,
  },
  day: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
  },
  dayCompact: {
    fontSize: 28,
    lineHeight: 32,
  },
  caption: {
    fontSize: 14,
    color: colors.inkMuted,
    fontWeight: '600',
  },
});
