import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts } from '@/constants/typography';

const BRAND_PRIMARY = '#1F5A3D';
const BRAND_PRIMARY_DARK = '#163F2B';
const BRAND_MUTED = '#4A6B58';
const BACKGROUND = '#FAF9F6';
const GLASS_FILL = 'rgba(255, 255, 255, 0.72)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.92)';

/** First onboarding slide index — keep in sync if pager slides are added later. */
const ACTIVE_PAGE_INDEX = 0;
const TOTAL_ONBOARDING_PAGES = 3;

const STARTUP_ILLUSTRATION = require('../../../assets/startup_page_2d_ill.webp');

export default function StartupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const horizontalPadding = Math.max(20, screenWidth * 0.06);
  const illustrationMaxHeight = Math.min(screenHeight * 0.36, 320);
  const illustrationWidth = screenWidth - horizontalPadding * 2 - 32;

  const onGetStarted = () => {
    router.replace('/auth/login');
  };

  const bottomInset = insets.bottom + (Platform.OS === 'android' ? 28 : 20);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[BACKGROUND, '#F5F8F4', BACKGROUND]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobMid]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + 12,
            paddingBottom: bottomInset + 16,
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <View style={styles.upper}>
          <View style={styles.illustrationShell}>
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(231, 241, 234, 0.55)']}
              style={styles.illustrationGlow}
            />
            <View style={styles.illustrationCard}>
              {Platform.OS === 'ios' ? (
                <BlurView intensity={36} tint="light" style={StyleSheet.absoluteFill} />
              ) : (
                <View style={styles.androidGlass} />
              )}
              <LinearGradient
                colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
                style={styles.illustrationShine}
                pointerEvents="none"
              />
              <Image
                source={STARTUP_ILLUSTRATION}
                style={{
                  width: illustrationWidth,
                  height: illustrationMaxHeight,
                }}
                resizeMode="contain"
                accessibilityLabel="Khyora wellness illustration"
              />
            </View>
          </View>
        </View>

        <View style={styles.lowerGlassWrap}>
          <View style={styles.lowerGlass}>
            {Platform.OS === 'ios' ? (
              <BlurView intensity={52} tint="light" style={StyleSheet.absoluteFill} />
            ) : (
              <View style={styles.androidGlass} />
            )}
            <LinearGradient
              colors={['rgba(255,255,255,0.65)', 'rgba(255,255,255,0.12)']}
              style={styles.lowerShine}
              pointerEvents="none"
            />

            <View style={styles.lowerContent}>
              <Text style={styles.title}>
                Understand Your{'\n'}Body Better
              </Text>
              <Text style={styles.description}>
                Track your cycle, understand your patterns, and reflect on your wellbeing
                with Khyora.
              </Text>

              <View style={styles.dotsRow}>
                {Array.from({ length: TOTAL_ONBOARDING_PAGES }).map((_, index) => {
                  const active = index === ACTIVE_PAGE_INDEX;
                  return (
                    <View
                      key={index}
                      style={[styles.dot, active ? styles.dotActive : styles.dotInactive]}
                    />
                  );
                })}
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Get Started"
                onPress={onGetStarted}
                style={({ pressed }) => [
                  styles.buttonShadow,
                  pressed && styles.buttonPressed,
                ]}
              >
                <LinearGradient
                  colors={[BRAND_PRIMARY, BRAND_PRIMARY_DARK]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonLabel}>Get Started</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.22,
  },
  blobTop: {
    width: 220,
    height: 220,
    top: -40,
    right: -50,
    backgroundColor: '#A8C9B4',
  },
  blobMid: {
    width: 160,
    height: 160,
    top: '28%',
    left: -70,
    backgroundColor: '#C5DEC9',
    opacity: 0.18,
  },
  blobBottom: {
    width: 260,
    height: 260,
    bottom: -80,
    right: -90,
    backgroundColor: '#8FB39E',
    opacity: 0.16,
  },
  upper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 0,
  },
  illustrationShell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationGlow: {
    position: 'absolute',
    width: '92%',
    height: '88%',
    borderRadius: 32,
    opacity: 0.9,
  },
  illustrationCard: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: GLASS_FILL,
    shadowColor: BRAND_PRIMARY_DARK,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  illustrationShine: {
    ...StyleSheet.absoluteFill,
    borderRadius: 28,
  },
  androidGlass: {
    ...StyleSheet.absoluteFill,
    backgroundColor: GLASS_FILL,
  },
  lowerGlassWrap: {
    width: '100%',
  },
  lowerGlass: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: GLASS_FILL,
    shadowColor: BRAND_PRIMARY_DARK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  lowerShine: {
    ...StyleSheet.absoluteFill,
    borderRadius: 28,
  },
  lowerContent: {
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 22,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'center',
    color: BRAND_PRIMARY_DARK,
    letterSpacing: -0.3,
  },
  description: {
    marginTop: 12,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    color: BRAND_MUTED,
    maxWidth: 320,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 22,
    marginBottom: 22,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(31, 90, 61, 0.22)',
  },
  dotInactive: {
    width: 8,
  },
  dotActive: {
    width: 28,
    backgroundColor: BRAND_PRIMARY,
  },
  buttonShadow: {
    width: '100%',
    borderRadius: 999,
    shadowColor: BRAND_PRIMARY_DARK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 5,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  button: {
    minHeight: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  buttonLabel: {
    fontFamily: fonts.accent,
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
