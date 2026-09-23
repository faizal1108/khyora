import React, { useState } from 'react';
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
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputField } from '@/components/common/InputField';
import { useAuth } from '@/hooks/useAuth';
import { fonts } from '@/constants/typography';
import { validateLoginFields } from '@/utils/validation';

const BRAND_PRIMARY = '#1F5A3D';
const BRAND_DARK = '#163F2B';
const TEXT_SECONDARY = '#6B7D72';
const INPUT_BG = '#F9FBF9';
const INPUT_BORDER = 'rgba(31, 90, 61, 0.15)';
const PAGE_BG = '#F5F8F4';

export default function LoginScreen() {
  const { login, resetPassword, firebaseReady } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const headerHeight = Math.min(Math.max(screenHeight * 0.34, 240), 320);

  const onLogin = async () => {
    const nextErrors = validateLoginFields(email, password);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    if (!firebaseReady) {
      Alert.alert(
        'Firebase not configured',
        'Add your Firebase credentials to .env. See README for setup.',
      );
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/');
    } catch (error) {
      Alert.alert('Login failed', error instanceof Error ? error.message : 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrors({ email: 'Please enter your email.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    }
    try {
      await resetPassword(email);
      Alert.alert('Password reset', 'Password reset email sent. Please check your inbox.');
    } catch (error) {
      Alert.alert('Reset failed', error instanceof Error ? error.message : 'Unable to reset password.');
    }
  };

  const loginLabelStyle = {
    color: TEXT_SECONDARY,
    fontSize: 13,
    fontFamily: fonts.body,
    fontWeight: '400' as const,
    marginBottom: 6,
  };

  const loginInputStyle = {
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
        <View style={styles.headerBlobC} />

        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          <View style={styles.topRow}>
            <Text style={styles.topPrompt}>Don&apos;t have an account?</Text>
            <Link href="/auth/signup" asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Get Started"
                style={({ pressed }) => [styles.getStartedBtn, pressed && styles.getStartedPressed]}
              >
                <Text style={styles.getStartedLabel}>Get Started</Text>
              </Pressable>
            </Link>
          </View>

          <View style={styles.brandWrap}>
            <Text style={styles.brand}>Khyora</Text>
          </View>
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter your details below</Text>

            {!firebaseReady ? (
              <Text style={styles.warn}>
                Firebase env vars are missing. The UI works, but auth needs .env setup.
              </Text>
            ) : null}

            <InputField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="user@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email}
              labelStyle={loginLabelStyle}
              style={loginInputStyle}
            />

            <View style={styles.passwordField}>
              <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••••"
                secureTextEntry={!showPassword}
                error={errors.password}
                labelStyle={loginLabelStyle}
                style={[loginInputStyle, styles.passwordInput]}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeButton}
                hitSlop={12}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={BRAND_PRIMARY}
                />
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sign In"
              onPress={onLogin}
              disabled={loading}
              style={({ pressed }) => [
                styles.signInShadow,
                (pressed || loading) && styles.signInPressed,
              ]}
            >
              <LinearGradient
                colors={[BRAND_DARK, BRAND_PRIMARY]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.signInButton}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.signInLabel}>Sign In</Text>
                )}
              </LinearGradient>
            </Pressable>

            <Text style={styles.forgotLink} onPress={onReset}>
              Forgot your password?
            </Text>
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
    paddingHorizontal: 20,
  },
  headerBlobA: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -40,
    right: -30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerBlobB: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    bottom: 24,
    left: -20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerBlobC: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    top: '42%',
    right: '28%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  topPrompt: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.88)',
  },
  getStartedBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  getStartedPressed: {
    opacity: 0.88,
  },
  getStartedLabel: {
    fontFamily: fonts.accent,
    fontSize: 13,
    color: '#FFFFFF',
  },
  brandWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 36,
  },
  brand: {
    fontFamily: fonts.heading,
    fontSize: 36,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  sheet: {
    flex: 1,
    marginTop: -30,
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
    fontSize: 28,
    lineHeight: 34,
    color: BRAND_DARK,
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: TEXT_SECONDARY,
    textAlign: 'center',
  },
  warn: {
    color: '#C17A3A',
    marginBottom: 12,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.body,
    textAlign: 'center',
  },
  passwordField: {
    position: 'relative',
    marginBottom: 0,
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 38,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInShadow: {
    marginTop: 8,
    borderRadius: 28,
    shadowColor: BRAND_DARK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  signInPressed: {
    opacity: 0.92,
  },
  signInButton: {
    minHeight: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInLabel: {
    fontFamily: fonts.accent,
    fontSize: 17,
    color: '#FFFFFF',
  },
  forgotLink: {
    marginTop: 22,
    textAlign: 'center',
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: BRAND_DARK,
  },
});
