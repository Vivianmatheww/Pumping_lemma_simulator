import React from 'react';
import { motion } from 'framer-motion';
import type { LemmaType } from '../types';
import { buildBlocks } from '../logic';
import StringVisualizer from './StringVisualizer';

interface Step3Props {
  s: string;
  p: number;
  lemmaType: LemmaType;
  splitUV: number;
  splitVX: number;
  splitXY: number;
  splitYZ: number;
  onSplitChange: (key: 'splitUV' | 'splitVX' | 'splitXY' | 'splitYZ', val: number) => void;
  onConfirm: () => void;
  isActive: boolean;
  isDisabled: boolean;
}

interface RuleStatus {
  label: string;
  current: number;
  limit: number;
  pass: boolean;
}

const Step3Partition: React.FC<Step3Props> = ({
  s, p, lemmaType,
  splitUV, splitVX, splitXY, splitYZ,
  onSplitChange, onConfirm,
  isActive, isDisabled,
}) => {
  const len = s.length;

  // Compute rule status
  let rule1: RuleStatus, rule2: RuleStatus;
  if (lemmaType === 'RL') {
    const xyLen = splitXY;
    const yLen = splitYZ - splitXY;
    rule1 = { label: '|xy| ≤ p', current: xyLen + yLen, limit: p, pass: xyLen + yLen <= p };
    rule2 = { label: '|y| ≥ 1', current: yLen, limit: 1, pass: yLen >= 1 };
  } else {
    const vLen = splitVX - splitUV;
    const xLen = splitXY - splitVX;
    const yLen = splitYZ - splitXY;
    rule1 = { label: '|vxy| ≤ p', current: vLen + xLen + yLen, limit: p, pass: vLen + xLen + yLen <= p };
    rule2 = { label: '|vy| ≥ 1', current: vLen + yLen, limit: 1, pass: vLen + yLen >= 1 };
  }

  const isValid = rule1.pass && rule2.pass;
  const blocks = buildBlocks(s, lemmaType, splitUV, splitVX, splitXY, splitYZ);

  const sliders = [
    ...(lemmaType === 'CFL' ? [
      { key: 'splitUV' as const, label: 'Split between U and V', val: splitUV },
      { key: 'splitVX' as const, label: 'Split between V and X', val: splitVX },
    ] : []),
    { key: 'splitXY' as const, label: `Split between ${lemmaType === 'RL' ? 'X' : 'X'} and Y`, val: splitXY },
    { key: 'splitYZ' as const, label: 'Split between Y and Z', val: splitYZ },
  ];

  return (
    <div className={`step-card ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
      <div className="step-header">
        <span className="step-badge">03</span>
        <h2>The Partition</h2>
      </div>
      <p className="step-desc">
        The DFA picks a decomposition <span className="math">s = {lemmaType === 'RL' ? 'xyz' : 'uvxyz'}</span>.
        Slide the splits to set the partition. Both rules must be satisfied.
      </p>

      <div className="rules-box">
        {[rule1, rule2].map((r, i) => (
          <motion.div
            key={i}
            className={`rule ${r.pass ? 'pass' : 'fail'}`}
            layout
            transition={{ duration: 0.2 }}
          >
            <span className="rule-name">{r.label}</span>
            <span className="rule-value">
              {r.current} {i === 0 ? `/ ${r.limit}` : `≥ ${r.limit}`}
            </span>
          </motion.div>
        ))}
      </div>

      <StringVisualizer blocks={blocks} />

      <div className="sliders-container">
        {sliders.map(({ key, label, val }) => (
          <div className="slider-row" key={key}>
            <label className="slider-label">
              {label}: <span className="slider-val">{val}</span>
            </label>
            <input
              type="range"
              min={0}
              max={len}
              value={val}
              onChange={(e) => onSplitChange(key, parseInt(e.target.value))}
              disabled={isDisabled}
              id={`slider-${key}`}
            />
          </div>
        ))}
      </div>

      <motion.button
        className="cyber-btn"
        onClick={onConfirm}
        disabled={!isValid || isDisabled}
        whileHover={{ scale: isValid ? 1.05 : 1 }}
        whileTap={{ scale: isValid ? 0.95 : 1 }}
        id="btn-step-3"
      >
        {isValid ? 'Confirm Partition →' : '⚠ Invalid — Adjust Splits'}
      </motion.button>
    </div>
  );
};

export default Step3Partition;
