import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CharacterIllustration } from '@/assets/characters/CharacterIllustration';
import { getCharacter } from '@/constants/characters';
import type { CharacterId } from '@/types';
import { colors, radii } from '@/constants/theme';

interface CharacterCardProps {
  id: CharacterId;
  selected: boolean;
  onSelect: (id: CharacterId) => void;
}

export function CharacterCard({ id, selected, onSelect }: CharacterCardProps) {
  const scale = useSharedValue(selected ? 1.05 : 1);
  const meta = getCharacter(id);

  useEffect(() => {
    scale.value = withSpring(selected ? 1.05 : 1);
  }, [selected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`Select ${meta.name}`}
        onPress={() => onSelect(id)}
        style={[
          styles.card,
          selected && {
            borderColor: meta.accent,
            shadowColor: meta.glow,
            shadowOpacity: 0.9,
          },
        ]}
      >
        <CharacterIllustration id={id} size={88} />
        <Text style={styles.name}>{meta.name}</Text>
        <Text style={styles.tagline}>{meta.tagline}</Text>
        {selected ? (
          <View style={[styles.check, { backgroundColor: meta.accent }]}>
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '48%', marginBottom: 14 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    padding: 14,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 3,
    minHeight: 160,
  },
  name: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  tagline: {
    marginTop: 2,
    fontSize: 12,
    color: colors.inkMuted,
  },
  check: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
