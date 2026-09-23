import {
  MAX_AGE,
  MAX_CYCLE_LENGTH,
  MIN_AGE,
  MIN_CYCLE_LENGTH,
} from '@/constants/theme';

const MIN_PASSWORD_LENGTH = 8;

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateLoginFields(email: string, password: string): Record<string, string> {
  const errors: Record<string, string> = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = 'Please enter your email.';
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Please enter your password.';
  }

  return errors;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Please enter your password.';
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return 'Password must contain at least 8 characters.';
  }
  return null;
}

export function validateSignupFields(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!input.name.trim()) {
    errors.name = 'Please enter your name.';
  }

  const trimmedEmail = input.email.trim();
  if (!trimmedEmail) {
    errors.email = 'Please enter your email.';
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  const pwdError = validatePassword(input.password);
  if (pwdError) {
    errors.password = pwdError;
  }

  if (!input.confirmPassword) {
    errors.confirm = 'Please confirm your password.';
  } else if (input.password !== input.confirmPassword) {
    errors.confirm = 'Passwords do not match.';
  }

  return errors;
}

export function validatePersonalDetails(input: {
  name: string;
  age: string;
  location: string;
  averageCycleLength?: string | null;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  const trimmedName = input.name.trim();
  if (!trimmedName) {
    errors.name = 'Please enter your name.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name should be at least 2 characters.';
  }

  const age = Number(input.age);
  if (!input.age.trim() || Number.isNaN(age) || age < MIN_AGE || age > MAX_AGE) {
    errors.age = `Age should be between ${MIN_AGE} and ${MAX_AGE}.`;
  }

  const trimmedLocation = input.location.trim();
  if (!trimmedLocation) {
    errors.location = 'Please enter your location.';
  } else if (trimmedLocation.length < 2) {
    errors.location = 'Location should be at least 2 characters.';
  }

  if (input.averageCycleLength && input.averageCycleLength.trim()) {
    const cycle = Number(input.averageCycleLength);
    if (
      Number.isNaN(cycle) ||
      cycle < MIN_CYCLE_LENGTH ||
      cycle > MAX_CYCLE_LENGTH
    ) {
      errors.averageCycleLength = `Cycle length should be between ${MIN_CYCLE_LENGTH} and ${MAX_CYCLE_LENGTH} days.`;
    }
  }

  return errors;
}
