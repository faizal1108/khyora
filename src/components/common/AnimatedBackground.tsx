import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';

export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [drift]);

  const blobA = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * 24 },
      { translateY: drift.value * -18 },
      { scale: 1 + drift.value * 0.08 },
    ],
  }));

  const blobB = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * -20 },
      { translateY: drift.value * 22 },
      { scale: 1.05 - drift.value * 0.06 },
    ],
  }));

  const blobC = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * 14 },
      { translateY: drift.value * 10 },
      { scale: 0.95 + drift.value * 0.05 },
    ],
  }));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.background, colors.backgroundWarm, '#F7F0FF', colors.background]}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.blob, styles.blobRose, blobA]} />
      <Animated.View style={[styles.blob, styles.blobLavender, blobB]} />
      <Animated.View style={[styles.blob, styles.blobPeach, blobC]} />
      <View style={styles.vignette} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.4,
  },
  blobRose: {
    width: 260,
    height: 260,
    top: -60,
    right: -50,
    backgroundColor: colors.primarySoft,
  },
  blobLavender: {
    width: 240,
    height: 240,
    bottom: 100,
    left: -60,
    backgroundColor: colors.secondarySoft,
  },
  blobPeach: {
    width: 180,
    height: 180,
    top: '42%',
    right: -40,
    backgroundColor: colors.primaryMuted,
    opacity: 0.55,
  },
  vignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 245, 247, 0.12)',
  },
});
