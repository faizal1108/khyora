import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { GlassCard } from '@/components/common/GlassCard';
import { CharacterIllustration } from '@/assets/characters/CharacterIllustration';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { useAuth } from '@/hooks/useAuth';
import { colors, DISCLAIMERS } from '@/constants/theme';
import { formatDisplayDate } from '@/utils/dates';
import { getCharacter } from '@/constants/characters';

export default function ProfileScreen() {
  const { profile, logout } = useAuth();
  const router = useRouter();

  if (!profile) return null;

  const character = getCharacter(profile.characterId);

  const onLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  return (
    <AnimatedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <CharacterIllustration id={profile.characterId} size={120} />
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.meta}>
              Age: {profile.age} · {profile.location}
            </Text>
            <Text style={styles.companion}>Companion: {character.name}</Text>
          </View>

          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={styles.rowLabel}>Average Cycle</Text>
            <Text style={styles.rowValue}>
              {profile.averageCycleLength ? `${profile.averageCycleLength} days` : '—'}
            </Text>
            <Text style={[styles.rowLabel, { marginTop: 12 }]}>Last Period</Text>
            <Text style={styles.rowValue}>
              {formatDisplayDate(profile.lastPeriodDate)}
            </Text>
          </GlassCard>

          <MenuItem
            icon="create-outline"
            label="Edit Profile"
            onPress={() => router.push('/profile/edit')}
          />
          <MenuItem
            icon="happy-outline"
            label="Change Character"
            onPress={() => router.push('/profile/change-character')}
          />
          <MenuItem
            icon="notifications-outline"
            label="Notification Settings"
            onPress={() =>
              Alert.alert('Coming soon', 'Notification preferences will be available soon.')
            }
          />
          <MenuItem
            icon="shield-checkmark-outline"
            label="Privacy"
            onPress={() => Alert.alert('Privacy', DISCLAIMERS.privacy)}
          />

          <PrimaryButton label="Logout" onPress={onLogout} style={{ marginTop: 20 }} />
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      <GlassCard style={styles.menuItem}>
        <View style={styles.menuRow}>
          <Ionicons name={icon} size={22} color={colors.primaryDeep} />
          <Text style={styles.menuLabel}>{label}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.inkSoft} />
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 20 },
  name: {
    marginTop: 8,
    fontSize: 26,
    fontWeight: '800',
    color: colors.ink,
  },
  meta: {
    marginTop: 4,
    color: colors.inkMuted,
  },
  companion: {
    marginTop: 4,
    color: colors.secondaryDeep,
    fontWeight: '600',
  },
  rowLabel: {
    color: colors.inkMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  rowValue: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  menuItem: { marginBottom: 10, paddingVertical: 16 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
  },
});
