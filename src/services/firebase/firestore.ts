import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './config';
import type { CharacterId, CycleRecord, UserProfile } from '@/types';
import { mapFirebaseError } from '@/utils/errors';
import { toISODate } from '@/utils/dates';
import { DEFAULT_CYCLE_LENGTH, DEFAULT_PERIOD_LENGTH } from '@/constants/theme';
import { addDaysSafe, parseDate } from '@/utils/dates';

function stampToISO(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') return value;
  return new Date().toISOString();
}

function isOnboardingComplete(data: Record<string, unknown>): boolean {
  return (
    typeof data.characterId === 'string' &&
    Boolean(data.characterId) &&
    typeof data.age === 'number' &&
    typeof data.location === 'string' &&
    Boolean(String(data.location).trim()) &&
    typeof data.name === 'string' &&
    Boolean(String(data.name).trim())
  );
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(getFirebaseDb(), 'users', uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    if (!isOnboardingComplete(data)) return null;
    return {
      uid,
      name: data.name,
      age: data.age,
      location: data.location,
      lastPeriodDate: data.lastPeriodDate ?? null,
      averageCycleLength: data.averageCycleLength ?? null,
      characterId: data.characterId,
      createdAt: stampToISO(data.createdAt),
      updatedAt: stampToISO(data.updatedAt),
      email: data.email ?? null,
      photoURL: data.photoURL ?? null,
    };
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Unable to load profile.'));
  }
}

export async function saveUserProfile(
  uid: string,
  profile: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'> & {
    email?: string | null;
  },
): Promise<UserProfile> {
  try {
    const ref = doc(getFirebaseDb(), 'users', uid);
    const existing = await getDoc(ref);
    const now = new Date().toISOString();
    const payload = {
      uid,
      name: profile.name.trim(),
      age: profile.age,
      location: profile.location.trim(),
      lastPeriodDate: profile.lastPeriodDate ?? null,
      averageCycleLength: profile.averageCycleLength ?? null,
      characterId: profile.characterId,
      email: profile.email ?? null,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    };

    await setDoc(ref, payload, { merge: true });

    if (profile.lastPeriodDate && !existing.exists()) {
      await seedInitialCycle(uid, profile.lastPeriodDate, profile.averageCycleLength);
    }

    return {
      uid,
      name: payload.name,
      age: payload.age,
      location: payload.location,
      lastPeriodDate: payload.lastPeriodDate,
      averageCycleLength: payload.averageCycleLength,
      characterId: payload.characterId as CharacterId,
      email: payload.email,
      createdAt: existing.exists() ? stampToISO(existing.data()?.createdAt) : now,
      updatedAt: now,
    };
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Unable to save profile.'));
  }
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>,
): Promise<void> {
  try {
    await updateDoc(doc(getFirebaseDb(), 'users', uid), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Unable to update profile.'));
  }
}

async function seedInitialCycle(
  uid: string,
  lastPeriodDate: string,
  averageCycleLength: number | null,
): Promise<void> {
  const start = parseDate(lastPeriodDate);
  if (!start) return;

  const periodLength = DEFAULT_PERIOD_LENGTH;
  const cycleLength = averageCycleLength ?? DEFAULT_CYCLE_LENGTH;
  const end = addDaysSafe(start, periodLength - 1);
  const cycleId = `cycle_${toISODate(start)}`;

  await setDoc(doc(getFirebaseDb(), 'users', uid, 'cycles', cycleId), {
    periodStartDate: toISODate(start),
    periodEndDate: toISODate(end),
    cycleLength,
    periodLength,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function listCycles(uid: string): Promise<CycleRecord[]> {
  try {
    const q = query(
      collection(getFirebaseDb(), 'users', uid, 'cycles'),
      orderBy('periodStartDate', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        periodStartDate: data.periodStartDate,
        periodEndDate: data.periodEndDate,
        cycleLength: data.cycleLength,
        periodLength: data.periodLength,
        createdAt: stampToISO(data.createdAt),
        updatedAt: stampToISO(data.updatedAt),
      };
    });
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Unable to load cycle data.'));
  }
}

export async function saveCycle(
  uid: string,
  cycle: Omit<CycleRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
): Promise<CycleRecord> {
  try {
    const id = cycle.id ?? `cycle_${cycle.periodStartDate}`;
    const ref = doc(getFirebaseDb(), 'users', uid, 'cycles', id);
    const existing = await getDoc(ref);
    const now = new Date().toISOString();

    await setDoc(
      ref,
      {
        periodStartDate: cycle.periodStartDate,
        periodEndDate: cycle.periodEndDate,
        cycleLength: cycle.cycleLength,
        periodLength: cycle.periodLength,
        updatedAt: serverTimestamp(),
        ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
      },
      { merge: true },
    );

    await updateDoc(doc(getFirebaseDb(), 'users', uid), {
      lastPeriodDate: cycle.periodStartDate,
      averageCycleLength: cycle.cycleLength,
      updatedAt: serverTimestamp(),
    });

    return {
      id,
      periodStartDate: cycle.periodStartDate,
      periodEndDate: cycle.periodEndDate,
      cycleLength: cycle.cycleLength,
      periodLength: cycle.periodLength,
      createdAt: existing.exists() ? stampToISO(existing.data()?.createdAt) : now,
      updatedAt: now,
    };
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Unable to save period.'));
  }
}

export async function deleteCycle(uid: string, cycleId: string): Promise<void> {
  try {
    await deleteDoc(doc(getFirebaseDb(), 'users', uid, 'cycles', cycleId));
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Unable to delete period.'));
  }
}
