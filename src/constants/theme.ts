export const colors = {
  primary: '#E8849A',
  primarySoft: '#F5B5C4',
  primaryDeep: '#D46A82',
  primaryMuted: '#FCE8EE',
  secondary: '#B8A4D4',
  secondarySoft: '#D4C8E8',
  secondaryDeep: '#9A84BC',
  secondaryMuted: '#F0EBF7',
  background: '#FFF5F7',
  backgroundWarm: '#FFF9FA',
  card: 'rgba(255, 255, 255, 0.62)',
  cardElevated: 'rgba(255, 255, 255, 0.82)',
  cardSolid: '#FFFFFF',
  glassHighlight: 'rgba(255, 255, 255, 0.55)',
  glassEdge: 'rgba(255, 255, 255, 0.92)',
  ink: '#2D2A32',
  inkMuted: '#7A7480',
  inkSoft: '#A39DA8',
  success: '#7BC4A0',
  successSoft: '#E5F6EE',
  warning: '#E8B86D',
  warningSoft: '#FBF3E3',
  danger: '#E8928A',
  dangerSoft: '#FCECEA',
  white: '#FFFFFF',
  border: 'rgba(255, 255, 255, 0.65)',
  shadow: 'rgba(212, 106, 130, 0.18)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const DISCLAIMERS = {
  prediction:
    'Period predictions are estimates and may vary from cycle to cycle.',
  scan:
    'Health scan results are screening and AI-generated insights, not a medical diagnosis. Consult a healthcare professional for medical advice.',
  privacy:
    'Your health data is stored securely and is only accessible to your account.',
} as const;

export const DEFAULT_CYCLE_LENGTH = 28;
export const DEFAULT_PERIOD_LENGTH = 5;
export const MIN_AGE = 13;
export const MAX_AGE = 60;
export const MIN_CYCLE_LENGTH = 21;
export const MAX_CYCLE_LENGTH = 45;
export const MIN_PERIOD_LENGTH = 1;
export const MAX_PERIOD_LENGTH = 10;
