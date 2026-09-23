import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from 'firebase/auth';
import {
  loginWithEmail,
  logout as firebaseLogout,
  resetPassword as firebaseResetPassword,
  signupWithEmail,
  subscribeToAuth,
} from '@/services/firebase/auth';
import { isFirebaseConfigured } from '@/services/firebase/config';
import { getUserProfile } from '@/services/firebase/firestore';
import type { UserProfile } from '@/types';
import { mapFirebaseError } from '@/utils/errors';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  firebaseReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
  setProfileLocal: (profile: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const firebaseReady = isFirebaseConfigured();

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return null;
    }
    setProfileLoading(true);
    try {
      const next = await getUserProfile(user.uid);
      setProfile(next);
      return next;
    } catch {
      setProfile(null);
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }

    const unsub = subscribeToAuth(async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        setProfileLoading(true);
        try {
          const nextProfile = await getUserProfile(nextUser.uid);
          setProfile(nextProfile);
        } catch {
          setProfile(null);
        } finally {
          setProfileLoading(false);
          setLoading(false);
        }
      } else {
        setProfile(null);
        setProfileLoading(false);
        setLoading(false);
      }
    });

    return unsub;
  }, [firebaseReady]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      throw new Error(mapFirebaseError(error, 'Unable to log in.'));
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    try {
      await signupWithEmail(email, password);
    } catch (error) {
      throw new Error(mapFirebaseError(error, 'Unable to create account.'));
    }
  }, []);

  const logout = useCallback(async () => {
    await firebaseLogout();
    setProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await firebaseResetPassword(email);
    } catch (error) {
      throw new Error(mapFirebaseError(error, 'Unable to send reset email.'));
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      profileLoading,
      firebaseReady,
      login,
      signup,
      logout,
      resetPassword,
      refreshProfile,
      setProfileLocal: setProfile,
    }),
    [
      user,
      profile,
      loading,
      profileLoading,
      firebaseReady,
      login,
      signup,
      logout,
      resetPassword,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
