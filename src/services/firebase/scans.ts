import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './config';
import type { FlowLevel, InfectionRisk, ScanResult } from '@/types';
import { mapFirebaseError } from '@/utils/errors';

function stampToISO(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string') return value;
  return new Date().toISOString();
}

function mapDocToScanResult(id: string, data: Record<string, unknown>): ScanResult {
  const flowLevel = (data.flowLevel as FlowLevel) ?? 'Normal';
  const infectionRisk = (data.infectionRisk as InfectionRisk) ?? 'Low';
  const createdAt = data.createdAt != null ? stampToISO(data.createdAt) : new Date().toISOString();
  const indicators = Array.isArray(data.indicators)
    ? (data.indicators as string[])
    : [];
  return {
    id,
    imageUri: typeof data.imageData === 'string' ? data.imageData : null,
    flowLevel,
    infectionRisk,
    indicators,
    confidence: typeof data.confidence === 'number' ? data.confidence : 0,
    notes: typeof data.notes === 'string' ? data.notes : '',
    disclaimer: typeof data.disclaimer === 'string' ? data.disclaimer : '',
    createdAt,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : createdAt,
    result: typeof data.result === 'string' ? data.result : undefined,
  };
}

export async function listScans(uid: string): Promise<ScanResult[]> {
  try {
    const scansRef = collection(getFirebaseDb(), 'users', uid, 'scans');
    const q = query(scansRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const scans = snapshot.docs.map((d) => mapDocToScanResult(d.id, d.data()));
    if (__DEV__) {
      console.log('[ScanHistory] UID:', uid);
      console.log('[ScanHistory] Scan count:', scans.length);
    }
    return scans;
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Unable to load scan history.'));
  }
}

export async function getScan(uid: string, scanId: string): Promise<ScanResult | null> {
  try {
    const snap = await getDoc(doc(getFirebaseDb(), 'users', uid, 'scans', scanId));
    if (!snap.exists()) return null;
    return mapDocToScanResult(snap.id, snap.data());
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Unable to load scan.'));
  }
}

export type CreateScanPayload = {
  uid: string;
  flowLevel: FlowLevel;
  infectionRisk: InfectionRisk;
  confidence: number;
  result?: string;
  imageData?: string;
  indicators?: string[];
  notes?: string;
  disclaimer?: string;
};

export async function createScanRecord(payload: CreateScanPayload): Promise<ScanResult> {
  try {
    const { uid, imageData, ...rest } = payload;
    const docRef = await addDoc(collection(getFirebaseDb(), 'users', uid, 'scans'), {
      uid,
      flowLevel: rest.flowLevel,
      infectionRisk: rest.infectionRisk,
      confidence: rest.confidence,
      result: rest.result ?? `${rest.flowLevel} flow, ${rest.infectionRisk} infection risk`,
      indicators: rest.indicators ?? [],
      notes: rest.notes ?? '',
      disclaimer: rest.disclaimer ?? '',
      ...(imageData ? { imageData } : {}),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const now = new Date().toISOString();
    return {
      id: docRef.id,
      imageUri: imageData ?? null,
      flowLevel: rest.flowLevel,
      infectionRisk: rest.infectionRisk,
      indicators: rest.indicators ?? [],
      confidence: rest.confidence,
      notes: rest.notes ?? '',
      disclaimer: rest.disclaimer ?? '',
      createdAt: now,
      updatedAt: now,
      result: rest.result,
    };
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Unable to save scan.'));
  }
}
