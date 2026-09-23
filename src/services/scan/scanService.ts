import type { FlowLevel, InfectionRisk, ScanResult } from '@/types';
import { DISCLAIMERS } from '@/constants/theme';

export interface ScanAnalyzeInput {
  imageUri: string;
  capturedAt?: Date;
}

export interface ScanService {
  analyze(input: ScanAnalyzeInput): Promise<Omit<ScanResult, 'id' | 'createdAt' | 'updatedAt'>>;
}

/**
 * Deterministic mock analyzer.
 * Replace this implementation with a real ML/API client later without changing UI.
 */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const mockScanService: ScanService = {
  async analyze(input) {
    // Simulate processing latency
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const seed = hashString(input.imageUri + (input.capturedAt?.toISOString() ?? ''));
    const flowOptions: FlowLevel[] = ['Light', 'Normal', 'Heavy'];
    const riskOptions: InfectionRisk[] = ['Low', 'Low', 'Moderate', 'Elevated'];
    const flowLevel = flowOptions[seed % flowOptions.length];
    const infectionRisk = riskOptions[seed % riskOptions.length];

    const indicators: string[] = [];
    if (flowLevel === 'Heavy') indicators.push('Higher than typical saturation detected');
    if (flowLevel === 'Light') indicators.push('Light absorption pattern detected');
    if (flowLevel === 'Normal') indicators.push('Typical color distribution');
    if (infectionRisk === 'Low') indicators.push('No unusual discoloration flagged');
    if (infectionRisk === 'Moderate') indicators.push('Mild irregular tint patterns');
    if (infectionRisk === 'Elevated') indicators.push('Irregular visual markers — seek clinical review if symptoms persist');

    indicators.push('Visual characteristics evaluated');

    return {
      imageUri: input.imageUri,
      flowLevel,
      infectionRisk,
      indicators,
      confidence: 0.72 + (seed % 20) / 100,
      notes: 'Mock analysis for development. Connect a real ML backend via scanService.',
      disclaimer: DISCLAIMERS.scan,
    };
  },
};

export const scanService: ScanService = mockScanService;
