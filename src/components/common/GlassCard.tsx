import React from 'react';
import { Platform, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, radii } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
  accessibilityLabel?: string;
  padded?: boolean;
  elevated?: boolean;
  accent?: 'rose' | 'lavender' | 'none';
}

export function GlassCard({
  children,
  style,
  onPress,
  accessibilityLabel,
  padded = true,
  elevated = false,
  accent = 'none',
}: GlassCardProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const accentColors =
    accent === 'rose'
      ? [colors.primarySoft, 'rgba(255,255,255,0)']
      : accent === 'lavender'
        ? [colors.secondarySoft, 'rgba(255,255,255,0)']
        : null;

  const shell = (
    <View
      style={[
        styles.outer,
        elevated && styles.elevated,
        onPress ? styles.fill : style,
      ]}
    >
      {Platform.OS === 'ios' ? (
        <BlurView intensity={48} tint="light" style={StyleSheet.absoluteFill} />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.androidGlass,
            elevated && styles.androidGlassElevated,
          ]}
        />
      )}
      <LinearGradient
        colors={[colors.glassHighlight, 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.shine}
        pointerEvents="none"
      />
      {accentColors ? (
        <LinearGradient
          colors={accentColors as [string, string]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.accentStrip}
          pointerEvents="none"
        />
      ) : null}
      <View style={[styles.inner, padded && styles.padded]}>{children}</View>
    </View>
  );

  if (!onPress) return shell;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[style, animatedStyle]}
    >
      {shell}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 6,
    backgroundColor: colors.card,
  },
  elevated: {
    backgroundColor: colors.cardElevated,
    shadowRadius: 24,
    elevation: 8,
  },
  androidGlass: {
    backgroundColor: colors.card,
  },
  androidGlassElevated: {
    backgroundColor: colors.cardElevated,
  },
  shine: {
    ...StyleSheet.absoluteFill,
    opacity: 0.85,
  },
  accentStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    opacity: 0.9,
  },
  fill: {
    width: '100%',
    flex: 1,
  },
  inner: {
    position: 'relative',
  },
  padded: {
    padding: 20,
  },
});
