import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
} from 'firebase/auth';
import { getFirebaseAuth } from './config';
import { mapFirebaseError } from '@/utils/errors';

export function subscribeToAuth(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

/** @alias subscribeToAuth */
export const subscribeToAuthState = subscribeToAuth;

export function getCurrentUser(): User | null {
  return getFirebaseAuth().currentUser;
}

export async function signupWithEmail(email: string, password: string): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
    return result.user;
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Unable to create account.'));
  }
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
    return result.user;
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Unable to log in.'));
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(getFirebaseAuth());
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Unable to log out.'));
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Unable to send reset email.'));
  }
}
