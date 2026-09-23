import type { FlowLevel, InfectionRisk, ScanResult } from '@/types';
import { apiRequest } from './client';

export interface ScanListItem {
  id: string;
  flowLevel: FlowLevel;
  infectionRisk: InfectionRisk;
  fileSize: number;
  createdAt: string;
}

interface CreateScanResponse {
  success: boolean;
  scanId: string;
  flowLevel: FlowLevel;
  infectionRisk: InfectionRisk;
  indicators: string[];
  confidence: number;
  notes: string;
  disclaimer: string;
  createdAt: string;
}

interface ScanDetailResponse {
  id: string;
  image: string;
  mimeType: string;
  flowLevel: FlowLevel;
  infectionRisk: InfectionRisk;
  indicators: string[];
  confidence: number;
  notes: string;
  disclaimer: string;
  createdAt: string;
}

const detailCache = new Map<string, ScanResult>();

function mapDetailToScanResult(data: ScanDetailResponse): ScanResult {
  const createdAt =
    typeof data.createdAt === 'string' ? data.createdAt : new Date(data.createdAt).toISOString();
  return {
    id: data.id,
    imageUri: data.image,
    flowLevel: data.flowLevel,
    infectionRisk: data.infectionRisk,
    indicators: data.indicators,
    confidence: data.confidence,
    notes: data.notes,
    disclaimer: data.disclaimer,
    createdAt,
    updatedAt: createdAt,
  };
}

function mapListItemToScanSummary(item: ScanListItem): ScanResult {
  const createdAt =
    typeof item.createdAt === 'string'
      ? item.createdAt
      : new Date(item.createdAt).toISOString();
  return {
    id: item.id,
    imageUri: null,
    flowLevel: item.flowLevel,
    infectionRisk: item.infectionRisk,
    indicators: [],
    confidence: 0,
    notes: '',
    disclaimer: '',
    createdAt,
    updatedAt: createdAt,
  };
}

export async function createScan(payload: {
  image: string;
  fileName: string;
  mimeType: string;
}): Promise<ScanResult> {
  const data = await apiRequest<CreateScanResponse>('/api/scans', {
    method: 'POST',
    json: payload,
  });

  const scan: ScanResult = {
    id: data.scanId,
    imageUri: payload.image,
    flowLevel: data.flowLevel,
    infectionRisk: data.infectionRisk,
    indicators: data.indicators,
    confidence: data.confidence,
    notes: data.notes,
    disclaimer: data.disclaimer,
    createdAt: data.createdAt,
    updatedAt: data.createdAt,
  };

  detailCache.set(scan.id, scan);
  return scan;
}

export async function listScansFromApi(): Promise<ScanResult[]> {
  const items = await apiRequest<ScanListItem[]>('/api/scans');
  return items.map(mapListItemToScanSummary);
}

export async function getScanFromApi(scanId: string): Promise<ScanResult | null> {
  const cached = detailCache.get(scanId);
  if (cached?.imageUri) {
    return cached;
  }

  const data = await apiRequest<ScanDetailResponse>(`/api/scans/${scanId}`);
  const scan = mapDetailToScanResult(data);
  detailCache.set(scanId, scan);
  return scan;
}

export function clearScanCache(): void {
  detailCache.clear();
}
