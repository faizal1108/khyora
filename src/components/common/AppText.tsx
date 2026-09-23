import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { TextVariant, textVariants } from '@/constants/typography';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
}

export function AppText({ variant = 'body', style, ...props }: AppTextProps) {
  return <Text style={[textVariants[variant] as TextStyle, style]} {...props} />;
}
