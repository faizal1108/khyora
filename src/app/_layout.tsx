import '../../global.css';
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { QueryProvider } from '@/context/QueryProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { useNetwork } from '@/hooks/useNetwork';
import { colors } from '@/constants/theme';
import { View } from 'react-native';
import { useAppFonts } from '@/hooks/useAppFonts';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, profileLoading, firebaseReady } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { isOffline } = useNetwork();

  useEffect(() => {
    if (loading || profileLoading) return;

    const segmentList = segments as string[];
    const inAuth = segmentList[0] === 'auth';
    const authScreen = segmentList[1];
    const inOnboarding =
      inAuth &&
      (authScreen === 'personal-details' || authScreen === 'character-selection');

    if (!firebaseReady) {
      if (!inAuth) router.replace('/auth/login');
      return;
    }

    if (!user) {
      if (!inAuth || inOnboarding) {
        router.replace('/auth/login');
      }
      return;
    }

    if (user && !profile) {
      if (!inOnboarding) {
        router.replace('/auth/personal-details');
      }
      return;
    }

    if (user && profile) {
      if (inAuth) {
        router.replace('/(tabs)/home');
      }
    }
  }, [user, profile, loading, profileLoading, segments, firebaseReady, router]);

  if (loading || (user && profileLoading && !profile && segments[0] !== 'auth')) {
    return <LoadingScreen message="Preparing Khyora..." />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <OfflineBanner visible={isOffline} />
      {children}
    </View>
  );
}

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <AuthGate>
                <StatusBar style="dark" />
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="auth/startup" />
                  <Stack.Screen name="auth/login" />
                  <Stack.Screen name="auth/signup" />
                  <Stack.Screen name="auth/personal-details" />
                  <Stack.Screen name="auth/character-selection" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="period/calendar" options={{ headerShown: true, title: 'Calendar', headerTintColor: colors.ink }} />
                  <Stack.Screen name="period/add-cycle" options={{ headerShown: true, title: 'Log Period', headerTintColor: colors.ink }} />
                  <Stack.Screen name="period/statistics" options={{ headerShown: true, title: 'Statistics', headerTintColor: colors.ink }} />
                  <Stack.Screen name="scan/camera" options={{ headerShown: true, title: 'Scan New Pad', headerTintColor: colors.ink }} />
                  <Stack.Screen name="scan/result" options={{ headerShown: true, title: 'Scan Result', headerTintColor: colors.ink }} />
                  <Stack.Screen name="reports/index" options={{ headerShown: true, title: 'Reports', headerTintColor: colors.ink }} />
                  <Stack.Screen name="profile/edit" options={{ headerShown: true, title: 'Edit Profile', headerTintColor: colors.ink }} />
                  <Stack.Screen name="profile/change-character" options={{ headerShown: true, title: 'Change Character', headerTintColor: colors.ink }} />
                </Stack>
              </AuthGate>
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
