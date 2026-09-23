import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputField } from '@/components/common/InputField';
import { DatePickerField } from '@/components/common/DatePicker';
import { validatePersonalDetails } from '@/utils/validation';
import { ONBOARDING_DRAFT_KEY } from '@/constants/storage';
import { fonts } from '@/constants/typography';

const BRAND_PRIMARY = '#1F5A3D';
const BRAND_DARK = '#163F2B';
const TEXT_SECONDARY = '#6B7D72';
const INPUT_BG = '#F9FBF9';
const INPUT_BORDER = 'rgba(31, 90, 61, 0.15)';
const PAGE_BG = '#F1F7F3';

export default function PersonalDetailsScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [lastPeriodDate, setLastPeriodDate] = useState<string | null>(null);
  const [averageCycleLength, setAverageCycleLength] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const headerHeight = Math.min(Math.max(screenHeight * 0.22, 160), 220);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(ONBOARDING_DRAFT_KEY);
        if (!raw) return;
        const draft = JSON.parse(raw) as { name?: string };
        if (draft.name) {
          setName(draft.name);
        }
      } catch {
        // ignore draft read errors
      }
    })();
  }, []);

  const onContinue = async () => {
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
      await AsyncStorage.setItem(
        ONBOARDING_DRAFT_KEY,
        JSON.stringify({
          name: name.trim(),
          age: Number(age),
          location: location.trim(),
          lastPeriodDate,
          averageCycleLength: averageCycleLength.trim()
            ? Number(averageCycleLength)
            : null,
        }),
      );
      router.push('/auth/character-selection');
    } catch {
      Alert.alert('Unable to continue', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldLabelStyle = {
    color: TEXT_SECONDARY,
    fontSize: 13,
    fontFamily: fonts.body,
    fontWeight: '400' as const,
    marginBottom: 6,
  };

  const fieldInputStyle = {
    backgroundColor: INPUT_BG,
    borderColor: INPUT_BORDER,
    color: BRAND_DARK,
    borderRadius: 16,
    minHeight: 56,
    paddingRight: 16,
    fontFamily: fonts.body,
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={[BRAND_DARK, BRAND_PRIMARY]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerBlobA} />
        <View style={styles.headerBlobB} />
        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          <Text style={styles.brand}>Khyora</Text>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <KeyboardAvoidingView
          style={styles.sheetInner}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          <ScrollView
            contentContainerStyle={[
              styles.sheetScroll,
              { paddingBottom: Math.max(insets.bottom, 16) + 24 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Tell us a little about you</Text>
            <Text style={styles.subtitle}>
              This helps personalize your cycle insights.
            </Text>

            <InputField
              label="Name"
              value={name}
              onChangeText={(value) => {
                setName(value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="Sarah"
              error={errors.name}
              labelStyle={fieldLabelStyle}
              style={fieldInputStyle}
            />
            <InputField
              label="Age"
              value={age}
              onChangeText={(value) => {
                setAge(value);
                if (errors.age) setErrors((prev) => ({ ...prev, age: '' }));
              }}
              keyboardType="number-pad"
              placeholder="21"
              error={errors.age}
              labelStyle={fieldLabelStyle}
              style={fieldInputStyle}
            />
            <InputField
              label="Current Location"
              value={location}
              onChangeText={(value) => {
                setLocation(value);
                if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
              }}
              placeholder="Chennai, India"
              error={errors.location}
              labelStyle={fieldLabelStyle}
              style={fieldInputStyle}
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
              onChangeText={(value) => {
                setAverageCycleLength(value);
                if (errors.averageCycleLength) {
                  setErrors((prev) => ({ ...prev, averageCycleLength: '' }));
                }
              }}
              keyboardType="number-pad"
              placeholder="28 days"
              hint="Optional"
              error={errors.averageCycleLength}
              labelStyle={fieldLabelStyle}
              style={fieldInputStyle}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue"
              onPress={onContinue}
              disabled={loading}
              style={({ pressed }) => [
                styles.primaryShadow,
                (pressed || loading) && styles.primaryPressed,
              ]}
            >
              <LinearGradient
                colors={[BRAND_DARK, BRAND_PRIMARY]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButton}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryLabel}>Continue</Text>
                )}
              </LinearGradient>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  header: {
    width: '100%',
    overflow: 'hidden',
  },
  headerSafe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerBlobA: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    top: -30,
    right: -20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerBlobB: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    bottom: 10,
    left: -20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  brand: {
    fontFamily: fonts.heading,
    fontSize: 32,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  sheet: {
    flex: 1,
    marginTop: -28,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: BRAND_DARK,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(31, 90, 61, 0.12)',
    marginTop: 12,
    marginBottom: 4,
  },
  sheetInner: {
    flex: 1,
  },
  sheetScroll: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    lineHeight: 32,
    color: BRAND_DARK,
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: TEXT_SECONDARY,
    textAlign: 'center',
  },
  primaryShadow: {
    marginTop: 12,
    borderRadius: 28,
    shadowColor: BRAND_DARK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryPressed: {
    opacity: 0.92,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontFamily: fonts.accent,
    fontSize: 17,
    color: '#FFFFFF',
  },
});
