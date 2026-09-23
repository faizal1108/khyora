import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { colors, radii } from '@/constants/theme';
import { parseDate, toISODate } from '@/utils/dates';

// Fallback simple date picker without community package if not installed
// We'll implement a lightweight version using built-in DateTimePicker when available,
// and a text-based fallback.

interface DatePickerProps {
  label: string;
  value: string | null;
  onChange: (isoDate: string | null) => void;
  optional?: boolean;
  error?: string;
  maximumDate?: Date;
}

export function DatePickerField({
  label,
  value,
  onChange,
  optional,
  error,
  maximumDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseDate(value) ?? new Date();

  const onPick = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setOpen(false);
    if (date) onChange(toISODate(date));
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {optional ? <Text style={styles.optional}>  Optional</Text> : null}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(true)}
        style={[styles.input, error ? styles.inputError : null]}
      >
        <Text style={value ? styles.value : styles.placeholder}>
          {value ? format(parseDate(value)!, 'd MMMM yyyy') : 'Select Date'}
        </Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {open && Platform.OS === 'android' ? (
        <DateTimePicker
          value={selected}
          mode="date"
          display="default"
          maximumDate={maximumDate}
          onChange={onPick}
        />
      ) : null}

      {open && Platform.OS !== 'android' ? (
        <Modal transparent animationType="slide" visible={open}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{label}</Text>
              <DateTimePicker
                value={selected}
                mode="date"
                display="spinner"
                maximumDate={maximumDate}
                onChange={onPick}
              />
              <View style={styles.modalActions}>
                {optional ? (
                  <Pressable
                    onPress={() => {
                      onChange(null);
                      setOpen(false);
                    }}
                  >
                    <Text style={styles.clear}>Clear</Text>
                  </Pressable>
                ) : (
                  <View />
                )}
                <Pressable onPress={() => setOpen(false)}>
                  <Text style={styles.done}>Done</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  optional: {
    color: colors.inkMuted,
    fontWeight: '400',
  },
  input: {
    minHeight: 52,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(232, 132, 154, 0.25)',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  inputError: { borderColor: colors.danger },
  value: { color: colors.ink, fontSize: 16 },
  placeholder: { color: colors.inkSoft, fontSize: 16 },
  error: { marginTop: 6, color: colors.danger, fontSize: 13 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(45,42,50,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  clear: { color: colors.inkMuted, fontSize: 16, fontWeight: '600' },
  done: { color: colors.primaryDeep, fontSize: 16, fontWeight: '700' },
});
