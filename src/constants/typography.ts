import { TextStyle } from 'react-native';
import { colors } from '@/constants/theme';

export const fonts = {
  display: 'Livvic_900Black',
  heading: 'Livvic_700Bold',
  title: 'Livvic_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  accent: 'Poppins_600SemiBold',
  label: 'Poppins_500Medium',
} as const;

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'subtitle'
  | 'body'
  | 'bodyMedium'
  | 'label'
  | 'caption'
  | 'button';

export const textVariants: Record<TextVariant, TextStyle> = {
  display: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
  },
  h1: {
    fontFamily: fonts.heading,
    fontSize: 26,
    lineHeight: 32,
    color: colors.ink,
  },
  h2: {
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 28,
    color: colors.ink,
  },
  h3: {
    fontFamily: fonts.title,
    fontSize: 18,
    lineHeight: 24,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
  bodyMedium: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkMuted,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkMuted,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.inkSoft,
  },
  button: {
    fontFamily: fonts.accent,
    fontSize: 16,
    lineHeight: 22,
    color: colors.white,
  },
};
