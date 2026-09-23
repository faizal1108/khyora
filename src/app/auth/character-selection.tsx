import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { CharacterCard } from '@/components/character/CharacterCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { CHARACTERS } from '@/constants/characters';
import { colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { saveUserProfile } from '@/services/firebase/firestore';
import type { CharacterId } from '@/types';
import { ONBOARDING_DRAFT_KEY } from '@/constants/storage';

export default function CharacterSelectionScreen() {
  const [selected, setSelected] = useState<CharacterId>('character_03');
  const [loading, setLoading] = useState(false);
  const { user, setProfileLocal, refreshProfile } = useAuth();
  const router = useRouter();

  const onContinue = async () => {
    if (!user) {
      Alert.alert('Session expired', 'Please log in again.');
      router.replace('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem(ONBOARDING_DRAFT_KEY);
      if (!raw) {
        Alert.alert('Missing details', 'Please complete personal details first.');
        router.replace('/auth/personal-details');
        return;
      }

      const draft = JSON.parse(raw) as {
        name: string;
        age: number;
        location: string;
        lastPeriodDate: string | null;
        averageCycleLength: number | null;
      };

      const profile = await saveUserProfile(user.uid, {
        name: draft.name,
        age: draft.age,
        location: draft.location,
        lastPeriodDate: draft.lastPeriodDate,
        averageCycleLength: draft.averageCycleLength,
        characterId: selected,
        email: user.email,
      });

      setProfileLocal(profile);
      await AsyncStorage.removeItem(ONBOARDING_DRAFT_KEY);
      await refreshProfile();
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert(
        'Unable to save profile',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Choose your companion</Text>
          <Text style={styles.subtitle}>
            Which character would you like to see throughout your journey?
          </Text>

          <View style={styles.grid}>
            {CHARACTERS.map((character) => (
              <CharacterCard
                key={character.id}
                id={character.id}
                selected={selected === character.id}
                onSelect={setSelected}
              />
            ))}
          </View>

          <PrimaryButton label="Continue" onPress={onContinue} loading={loading} />
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.inkMuted,
    marginBottom: 20,
    fontSize: 15,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
