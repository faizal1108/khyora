import { FirebaseError } from 'firebase/app';

const ERROR_MAP: Record<string, string> = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must contain at least 8 characters.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network unavailable. Check your connection.',
  'auth/missing-email': 'Please enter your email.',
  'auth/operation-not-allowed': 'Email/password sign-in is not enabled yet.',
  unavailable: 'Firebase is unavailable right now. Please try again.',
  'permission-denied': 'You do not have permission to perform this action.',
};

export function mapFirebaseError(error: unknown, fallback?: string): string {
  if (error instanceof FirebaseError) {
    return ERROR_MAP[error.code] ?? fallback ?? 'Something went wrong. Please try again.';
  }

  if (error instanceof Error) {
    if (ERROR_MAP[error.message]) {
      return ERROR_MAP[error.message];
    }
    if (error.message.includes('Network')) {
      return 'Network unavailable. Check your connection.';
    }
    return error.message;
  }

  return fallback ?? 'Something went wrong. Please try again.';
}

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
