import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { GlassCard } from '@/components/common/GlassCard';
import { InputField } from '@/components/common/InputField';
import { DatePickerField } from '@/components/common/DatePicker';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile } from '@/services/firebase/firestore';
import { validatePersonalDetails } from '@/utils/validation';
import { colors } from '@/constants/theme';

export default function EditProfileScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(profile?.name ?? '');
  const [age, setAge] = useState(String(profile?.age ?? ''));
  const [location, setLocation] = useState(profile?.location ?? '');
  const [lastPeriodDate, setLastPeriodDate] = useState<string | null>(
    profile?.lastPeriodDate ?? null,
  );
  const [averageCycleLength, setAverageCycleLength] = useState(
    profile?.averageCycleLength ? String(profile.averageCycleLength) : '',
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    if (!user) return;
    const nextErrors = validatePersonalDetails({
      name,
      age,
      location,
      averageCycleLength,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await updateUserProfile(user.uid, {
        name: name.trim(),
        age: Number(age),
        location: location.trim(),
        lastPeriodDate,
        averageCycleLength: averageCycleLength.trim()
          ? Number(averageCycleLength)
          : null,
      });
      await refreshProfile();
      Alert.alert('Saved', 'Profile updated.');
      router.back();
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
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <GlassCard>
              <InputField label="Name" value={name} onChangeText={setName} error={errors.name} />
              <InputField
                label="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                error={errors.age}
              />
              <InputField
                label="Location"
                value={location}
                onChangeText={setLocation}
                error={errors.location}
              />
              <DatePickerField
                label="Last Period Date"
                value={lastPeriodDate}
                onChange={setLastPeriodDate}
                optional
                maximumDate={new Date()}
              />
              <InputField
                label="Average Cycle Length"
                value={averageCycleLength}
                onChangeText={setAverageCycleLength}
                keyboardType="number-pad"
                error={errors.averageCycleLength}
              />
              <PrimaryButton label="Save Changes" onPress={onSave} loading={loading} />
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
});
