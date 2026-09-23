import type { CharacterId } from '@/types';

export interface CharacterMeta {
  id: CharacterId;
  name: string;
  tagline: string;
  accent: string;
  glow: string;
}

export const CHARACTERS: CharacterMeta[] = [
  {
    id: 'character_01',
    name: 'Luma',
    tagline: 'Warm & gentle',
    accent: '#E8849A',
    glow: 'rgba(232, 132, 154, 0.45)',
  },
  {
    id: 'character_02',
    name: 'Nova',
    tagline: 'Calm & steady',
    accent: '#B8A4D4',
    glow: 'rgba(184, 164, 212, 0.45)',
  },
  {
    id: 'character_03',
    name: 'Mira',
    tagline: 'Bright & curious',
    accent: '#7BC4A0',
    glow: 'rgba(123, 196, 160, 0.45)',
  },
  {
    id: 'character_04',
    name: 'Sora',
    tagline: 'Soft & playful',
    accent: '#E8B86D',
    glow: 'rgba(232, 184, 109, 0.45)',
  },
  {
    id: 'character_05',
    name: 'Aya',
    tagline: 'Wise & grounded',
    accent: '#9A84BC',
    glow: 'rgba(154, 132, 188, 0.45)',
  },
];

export function getCharacter(id: CharacterId): CharacterMeta {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}
