import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { differenceInCalendarDays } from 'date-fns';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { GlassCard } from '@/components/common/GlassCard';
import { DatePickerField } from '@/components/common/DatePicker';
import { InputField } from '@/components/common/InputField';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { useCycles } from '@/hooks/useCycles';
import { colors, DEFAULT_CYCLE_LENGTH } from '@/constants/theme';
import { parseDate, toISODate } from '@/utils/dates';

export default function AddCycleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { cycles, saveCycle, saving } = useCycles();

  const existing = useMemo(
    () => cycles.find((c) => c.id === params.id),
    [cycles, params.id],
  );

  const [start, setStart] = useState<string | null>(
    existing?.periodStartDate ?? toISODate(new Date()),
  );
  const [end, setEnd] = useState<string | null>(existing?.periodEndDate ?? null);
  const [cycleLength, setCycleLength] = useState(
    String(existing?.cycleLength ?? DEFAULT_CYCLE_LENGTH),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const periodLength = useMemo(() => {
    const s = parseDate(start);
    const e = parseDate(end);
    if (!s || !e) return null;
    return differenceInCalendarDays(e, s) + 1;
  }, [start, end]);

  const onSave = async () => {
    const nextErrors: Record<string, string> = {};
    if (!start) nextErrors.start = 'Start date is required.';
    if (!end) nextErrors.end = 'End date is required.';
    const s = parseDate(start);
    const e = parseDate(end);
    if (s && e && e < s) nextErrors.end = 'End date must be after start date.';
    const cycle = Number(cycleLength);
    if (!cycle || cycle < 15 || cycle > 60) {
      nextErrors.cycleLength = 'Enter a reasonable cycle length.';
    }
    if (periodLength != null && (periodLength < 1 || periodLength > 14)) {
      nextErrors.end = 'Period length should be between 1 and 14 days.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || !start || !end || periodLength == null) return;

    try {
      await saveCycle({
        id: existing?.id,
        periodStartDate: start,
        periodEndDate: end,
        cycleLength: cycle,
        periodLength,
      });
      Alert.alert('Saved', 'Period logged successfully.');
      router.back();
    } catch (error) {
      Alert.alert(
        'Unable to save period',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  };

  return (
    <AnimatedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>{existing ? 'Edit Period' : 'Log Period'}</Text>
            <GlassCard>
              <DatePickerField
                label="When did your period start?"
                value={start}
                onChange={setStart}
                maximumDate={new Date()}
                error={errors.start}
              />
              <DatePickerField
                label="When did your period end?"
                value={end}
                onChange={setEnd}
                maximumDate={new Date()}
                error={errors.end}
              />
              <Text style={styles.meta}>
                Period Length{'\n'}
                <Text style={styles.metaValue}>
                  {periodLength != null ? `${periodLength} days` : '—'}
                </Text>
              </Text>
              <InputField
                label="Cycle Length"
                value={cycleLength}
                onChangeText={setCycleLength}
                keyboardType="number-pad"
                error={errors.cycleLength}
              />
              <PrimaryButton
                label="Save Period"
                onPress={onSave}
                loading={saving}
              />
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 16,
  },
  meta: {
    color: colors.inkMuted,
    fontSize: 14,
    marginBottom: 16,
  },
  metaValue: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '800',
  },
});
