export type FlowLevel = 'Light' | 'Normal' | 'Heavy';
export type InfectionRisk = 'Low' | 'Moderate' | 'Elevated';

export interface AnalysisResult {
  flowLevel: FlowLevel;
  infectionRisk: InfectionRisk;
  indicators: string[];
  confidence: number;
  notes: string;
  disclaimer: string;
}

function hashBuffer(buffer: Buffer): number {
  let hash = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    hash = (hash << 5) - hash + buffer[i];
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Mock analyzer — replace with real ML service later. */
export function analyzeScanImage(buffer: Buffer): AnalysisResult {
  const seed = hashBuffer(buffer);
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
  if (infectionRisk === 'Elevated') {
    indicators.push('Irregular visual markers — seek clinical review if symptoms persist');
  }
  indicators.push('Visual characteristics evaluated');

  return {
    flowLevel,
    infectionRisk,
    indicators,
    confidence: 0.72 + (seed % 20) / 100,
    notes: 'Screening insight generated on server. Not a medical diagnosis.',
    disclaimer:
      'Health scan results are screening and AI-generated insights, not a medical diagnosis. Consult a healthcare professional for medical advice.',
  };
}
