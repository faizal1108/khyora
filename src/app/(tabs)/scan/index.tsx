import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { GlassCard } from '@/components/common/GlassCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { colors, DISCLAIMERS } from '@/constants/theme';

export default function ScanTabScreen() {
  const router = useRouter();

  return (
    <AnimatedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.content}>
          <Text style={styles.title}>Health Scan</Text>
          <Text style={styles.subtitle}>
            Capture a pad photo for screening insights.
          </Text>

          <GlassCard style={styles.card}>
            <View style={styles.iconWrap}>
              <Ionicons name="scan" size={40} color={colors.primaryDeep} />
            </View>
            <Text style={styles.cardTitle}>Scan New Pad</Text>
            <Text style={styles.cardBody}>
              Place the pad inside the frame and capture a clear photo.
            </Text>
            <PrimaryButton
              label="Open Camera"
              onPress={() => router.push('/scan/camera')}
              style={{ marginTop: 16 }}
            />
            <Text style={styles.disclaimer}>{DISCLAIMERS.scan}</Text>
          </GlassCard>
        </View>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 24,
    color: colors.inkMuted,
    fontSize: 15,
  },
  card: { alignItems: 'center' },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
  },
  cardBody: {
    marginTop: 8,
    textAlign: 'center',
    color: colors.inkMuted,
    lineHeight: 21,
  },
  disclaimer: {
    marginTop: 16,
    fontSize: 12,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
