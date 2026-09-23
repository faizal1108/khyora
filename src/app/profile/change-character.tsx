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
import { updateUserProfile } from '@/services/firebase/firestore';
import type { CharacterId } from '@/types';

export default function ChangeCharacterScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const [selected, setSelected] = useState<CharacterId>(
    profile?.characterId ?? 'character_03',
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateUserProfile(user.uid, { characterId: selected });
      await refreshProfile();
      Alert.alert('Updated', 'Your companion has been changed.');
      router.back();
    } catch (error) {
      Alert.alert(
        'Unable to update',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.subtitle}>Pick a new companion for your journey.</Text>
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
          <PrimaryButton label="Save Character" onPress={onSave} loading={loading} />
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  subtitle: {
    color: colors.inkMuted,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
