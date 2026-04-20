export type LemmaType = 'RL' | 'CFL';

export type LangKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type BlockType = 'u' | 'v' | 'x' | 'y' | 'z';

export interface Language {
  key: LangKey;
  label: string;
  description: string;
  lemmaType: LemmaType;
}

export interface LemmaState {
  lemmaType: LemmaType;
  lang: LangKey;
  p: number;
  s: string;
  splitUV: number;
  splitVX: number;
  splitXY: number;
  splitYZ: number;
  multiplier: number;
  isPartitionValid: boolean;
  activeStep: number; // 0-6 which step is unlocked/active
}

export interface Block {
  char: string;
  type: BlockType;
  pump: boolean;
  id: string;
}

export interface PartitionInfo {
  uStr: string;
  vStr: string;
  xStr: string;
  yStr: string;
  zStr: string;
}

export interface EvaluationResult {
  finalStr: string;
  inLanguage: boolean;
  reasonContext: string;
  count0: number;
  count1: number;
  count2: number;
}
