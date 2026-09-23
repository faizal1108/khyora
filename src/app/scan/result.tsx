import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { ScanResultCard } from '@/components/cards/HealthStatusCard';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { PrimaryButton, SecondaryButton } from '@/components/common/PrimaryButton';
import { useScanHistory } from '@/hooks/useScanHistory';
import type { ScanResult } from '@/types';
import { colors } from '@/constants/theme';

export default function ScanResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { scans, getScan } = useScanHistory();
  const [scan, setScan] = useState<ScanResult | null>(
    scans.find((s) => s.id === id) ?? null,
  );
  const [loading, setLoading] = useState(!scan);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    if (!id) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const next = await getScan(id);
        if (mounted) {
          setScan(next);
          if (!next) setError('Scan result not found.');
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unable to load scan result.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, getScan]);

  if (loading) return <LoadingScreen message="Loading result..." />;

  return (
    <AnimatedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          {error || !scan ? (
            <ErrorState message={error ?? 'Scan result not found.'} />
          ) : (
            <>
              <ScanResultCard scan={scan} />
              <PrimaryButton
                label="Back to Home"
                onPress={() => router.replace('/(tabs)/home')}
                style={{ marginTop: 20 }}
              />
              <SecondaryButton
                label="Scan Another"
                onPress={() => router.replace('/scan/camera')}
                style={{ marginTop: 12 }}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
});
