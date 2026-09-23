import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, radii } from '@/constants/theme';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  labelStyle?: object;
}

export function InputField({ label, error, hint, style, labelStyle, ...props }: InputFieldProps) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.inkSoft}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(232, 132, 154, 0.25)',
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.ink,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    marginTop: 6,
    color: colors.danger,
    fontSize: 13,
  },
  hint: {
    marginTop: 6,
    color: colors.inkMuted,
    fontSize: 13,
  },
});
