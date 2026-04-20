import type { Language } from './types';

export const LANGUAGES: Language[] = [
  { key: 'A', label: 'L = { 0ⁿ1ⁿ | n ≥ 0 }', description: '0ⁿ1ⁿ (equal 0s and 1s in order)', lemmaType: 'RL' },
  { key: 'B', label: 'L = { 0ⁿ1²ⁿ | n ≥ 0 }', description: '0ⁿ1²ⁿ (double 1s for every 0)', lemmaType: 'RL' },
  { key: 'C', label: 'L = { w | w has equal 0s and 1s }', description: 'Equal number of 0s and 1s (any order)', lemmaType: 'RL' },
  { key: 'D', label: 'L = { 0ⁿ1ⁿ2ⁿ | n ≥ 0 }', description: '0ⁿ1ⁿ2ⁿ (equal counts in order)', lemmaType: 'CFL' },
  { key: 'E', label: 'L = { ww | w ∈ {0,1}* }', description: 'ww (copy language, even-length mirror)', lemmaType: 'CFL' },
  { key: 'F', label: 'L = { w | w has equal 0s, 1s, and 2s }', description: 'Equal number of 0s, 1s, 2s (any order)', lemmaType: 'CFL' },
];

export const RL_LANGS = LANGUAGES.filter(l => l.lemmaType === 'RL');
export const CFL_LANGS = LANGUAGES.filter(l => l.lemmaType === 'CFL');

export const PART_COLORS: Record<string, string> = {
  u: 'var(--color-u)',
  v: 'var(--color-v)',
  x: 'var(--color-x)',
  y: 'var(--color-y)',
  z: 'var(--color-z)',
};
