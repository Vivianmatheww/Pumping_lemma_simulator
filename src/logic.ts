import type { LangKey, LemmaType, EvaluationResult, Block, BlockType } from './types';

export function validateString(val: string, lang: LangKey, p: number): string | null {
  const count0 = (val.match(/0/g) || []).length;
  const count1 = (val.match(/1/g) || []).length;
  const count2 = (val.match(/2/g) || []).length;

  if (lang === 'A') {
    if (!/^(0+)(1+)$/.test(val)) return 'Invalid format! Must be 0s followed by 1s.';
    if (count0 !== count1) return `Count of 0s (${count0}) ≠ Count of 1s (${count1})`;
  } else if (lang === 'B') {
    if (!/^(0+)(1+)$/.test(val)) return 'Invalid format! Must be 0s followed by 1s.';
    if (count1 !== 2 * count0) return `Count of 1s (${count1}) must be exactly double 0s (${count0})`;
  } else if (lang === 'C') {
    if (!/^[01]+$/.test(val)) return 'Must contain only 0s and 1s.';
    if (count0 !== count1) return `Total 0s (${count0}) ≠ Total 1s (${count1})`;
  } else if (lang === 'D') {
    if (!/^(0+)(1+)(2+)$/.test(val)) return 'Invalid format! Must be contiguous 0s, 1s, 2s.';
    if (count0 !== count1 || count1 !== count2)
      return `Counts must be equal! (0s:${count0}, 1s:${count1}, 2s:${count2})`;
  } else if (lang === 'E') {
    if (!/^[01]+$/.test(val)) return 'Must contain only 0s and 1s.';
    if (val.length % 2 !== 0) return 'Length must be even for ww.';
    const half1 = val.substring(0, val.length / 2);
    const half2 = val.substring(val.length / 2);
    if (half1 !== half2) return 'First half does not match second half!';
  } else if (lang === 'F') {
    if (!/^[012]+$/.test(val)) return 'Must contain only 0s, 1s, and 2s.';
    if (count0 !== count1 || count1 !== count2) return `Counts must be equal! (0s:${count0}, 1s:${count1}, 2s:${count2})`;
  }

  if (val.length < p) return `String too short! Length is ${val.length}, but p is ${p}.`;
  return null;
}

export function getStringExample(lang: LangKey, p: number): string {
  if (lang === 'A') return '0'.repeat(p) + '1'.repeat(p);
  if (lang === 'B') return '0'.repeat(p) + '1'.repeat(p * 2);
  if (lang === 'C') return '0'.repeat(p) + '1'.repeat(p);
  if (lang === 'D') return '0'.repeat(p) + '1'.repeat(p) + '2'.repeat(p);
  if (lang === 'E') { const w = '0'.repeat(Math.ceil(p / 2)) + '1'; return w + w; }
  if (lang === 'F') return '0'.repeat(p) + '1'.repeat(p) + '2'.repeat(p);
  return '';
}

export function buildBlocks(
  s: string,
  lemmaType: LemmaType,
  splitUV: number, splitVX: number, splitXY: number, splitYZ: number
): Block[] {
  return s.split('').map((char, i) => {
    let type: BlockType = 'z';
    if (lemmaType === 'CFL') {
      if (i < splitUV) type = 'u';
      else if (i < splitVX) type = 'v';
      else if (i < splitXY) type = 'x';
      else if (i < splitYZ) type = 'y';
    } else {
      if (i < splitXY) type = 'x';
      else if (i < splitYZ) type = 'y';
    }
    return { char, type, pump: false, id: `orig-${i}` };
  });
}

export function buildPumpedBlocks(
  s: string,
  lemmaType: LemmaType,
  splitUV: number, splitVX: number, splitXY: number, splitYZ: number,
  multiplier: number
): Block[] {
  const blocks: Block[] = [];

  if (lemmaType === 'RL') {
    const xStr = s.substring(0, splitXY);
    const yStr = s.substring(splitXY, splitYZ);
    const zStr = s.substring(splitYZ);
    xStr.split('').forEach((c, i) => blocks.push({ char: c, type: 'x', pump: false, id: `x-${i}` }));
    for (let rep = 0; rep < multiplier; rep++) {
      yStr.split('').forEach((c, i) => blocks.push({ char: c, type: 'y', pump: true, id: `y-${rep}-${i}` }));
    }
    zStr.split('').forEach((c, i) => blocks.push({ char: c, type: 'z', pump: false, id: `z-${i}` }));
  } else {
    const uStr = s.substring(0, splitUV);
    const vStr = s.substring(splitUV, splitVX);
    const xStr = s.substring(splitVX, splitXY);
    const yStr = s.substring(splitXY, splitYZ);
    const zStr = s.substring(splitYZ);
    uStr.split('').forEach((c, i) => blocks.push({ char: c, type: 'u', pump: false, id: `u-${i}` }));
    for (let rep = 0; rep < multiplier; rep++) {
      vStr.split('').forEach((c, i) => blocks.push({ char: c, type: 'v', pump: true, id: `v-${rep}-${i}` }));
    }
    xStr.split('').forEach((c, i) => blocks.push({ char: c, type: 'x', pump: false, id: `xi-${i}` }));
    for (let rep = 0; rep < multiplier; rep++) {
      yStr.split('').forEach((c, i) => blocks.push({ char: c, type: 'y', pump: true, id: `y-${rep}-${i}` }));
    }
    zStr.split('').forEach((c, i) => blocks.push({ char: c, type: 'z', pump: false, id: `zi-${i}` }));
  }

  return blocks;
}

export function evaluateResult(
  s: string,
  lang: LangKey,
  lemmaType: LemmaType,
  splitUV: number, splitVX: number, splitXY: number, splitYZ: number,
  multiplier: number
): EvaluationResult {
  let finalStr = '';
  if (lemmaType === 'RL') {
    finalStr = s.substring(0, splitXY) +
               s.substring(splitXY, splitYZ).repeat(multiplier) +
               s.substring(splitYZ);
  } else {
    finalStr = s.substring(0, splitUV) +
               s.substring(splitUV, splitVX).repeat(multiplier) +
               s.substring(splitVX, splitXY) +
               s.substring(splitXY, splitYZ).repeat(multiplier) +
               s.substring(splitYZ);
  }

  const count0 = (finalStr.match(/0/g) || []).length;
  const count1 = (finalStr.match(/1/g) || []).length;
  const count2 = (finalStr.match(/2/g) || []).length;

  let inLanguage = false;
  let reasonContext = '';

  if (lang === 'A') {
    if (count0 === count1 && !finalStr.includes('10')) inLanguage = true;
    else if (count0 !== count1) reasonContext = `it breaks equal balance of 0s and 1s (${count0} vs ${count1}).`;
    else reasonContext = '0s and 1s are out of order.';
  } else if (lang === 'B') {
    if (count1 === 2 * count0 && !finalStr.includes('10')) inLanguage = true;
    else if (count1 !== 2 * count0) reasonContext = `1s (${count1}) are no longer double the 0s (${count0}).`;
    else reasonContext = '0s and 1s are out of order.';
  } else if (lang === 'C') {
    if (count0 === count1) inLanguage = true;
    else reasonContext = `total 0s (${count0}) ≠ total 1s (${count1}).`;
  } else if (lang === 'D') {
    if (count0 === count1 && count1 === count2 && /^0*1*2*$/.test(finalStr)) inLanguage = true;
    else if (count0 !== count1 || count1 !== count2) reasonContext = 'counts are no longer perfectly equal!';
    else reasonContext = 'characters are out of order!';
  } else if (lang === 'E') {
    const half1 = finalStr.substring(0, finalStr.length / 2);
    const half2 = finalStr.substring(finalStr.length / 2);
    if (finalStr.length % 2 === 0 && half1 === half2) inLanguage = true;
    else if (finalStr.length % 2 !== 0) reasonContext = 'the string length is odd, so it cannot split evenly in half.';
    else reasonContext = `first half (${half1}) does not match second half (${half2}).`;
  } else if (lang === 'F') {
    if (count0 === count1 && count1 === count2) inLanguage = true;
    else reasonContext = `total 0s (${count0}), 1s (${count1}), and 2s (${count2}) are not equal.`;
  }

  return { finalStr, inLanguage, reasonContext, count0, count1, count2 };
}
