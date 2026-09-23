export type CharacterId =
  | 'character_01'
  | 'character_02'
  | 'character_03'
  | 'character_04'
  | 'character_05';

export interface UserProfile {
  uid: string;
  name: string;
  age: number;
  location: string;
  lastPeriodDate: string | null;
  averageCycleLength: number | null;
  characterId: CharacterId;
  createdAt: string;
  updatedAt: string;
  email?: string | null;
  photoURL?: string | null;
}

export interface CycleRecord {
  id: string;
  periodStartDate: string;
  periodEndDate: string;
  cycleLength: number;
  periodLength: number;
  createdAt: string;
  updatedAt: string;
}

export type FlowLevel = 'Light' | 'Normal' | 'Heavy';
export type InfectionRisk = 'Low' | 'Moderate' | 'Elevated';

export interface ScanRecord {
  id: string;
  uid: string;
  imageData?: string;
  flowLevel?: FlowLevel;
  infectionRisk?: InfectionRisk;
  result?: string;
  confidence?: number;
  createdAt: unknown;
}

export interface ScanResult {
  id: string;
  imageUri?: string | null;
  flowLevel: FlowLevel;
  infectionRisk: InfectionRisk;
  indicators: string[];
  confidence: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  disclaimer: string;
  result?: string;
}

export interface CyclePrediction {
  currentCycleDay: number | null;
  averageCycleLength: number;
  averagePeriodLength: number;
  nextPeriodDate: Date | null;
  expectedPeriodEnd: Date | null;
  predictionWindowStart: Date | null;
  predictionWindowEnd: Date | null;
  daysUntilNextPeriod: number | null;
  progressRatio: number;
  hasData: boolean;
}

export interface PersonalDetailsInput {
  name: string;
  age: string;
  location: string;
  lastPeriodDate?: string | null;
  averageCycleLength?: string | null;
}

export type AuthProviderType = 'email';
