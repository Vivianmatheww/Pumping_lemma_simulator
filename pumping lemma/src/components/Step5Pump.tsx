import React from 'react';
import { motion } from 'framer-motion';
import type { LemmaType } from '../types';
import { buildPumpedBlocks } from '../logic';
import StringVisualizer from './StringVisualizer';

interface Step5Props {
  s: string;
  lemmaType: LemmaType;
  splitUV: number;
  splitVX: number;
  splitXY: number;
  splitYZ: number;
  multiplier: number;
  onMultiplierChange: (i: number) => void;
  onEvaluate: () => void;
  isActive: boolean;
  isDisabled: boolean;
}

const Step5Pump: React.FC<Step5Props> = ({
  s, lemmaType, splitUV, splitVX, splitXY, splitYZ,
  multiplier, onMultiplierChange, onEvaluate,
  isActive, isDisabled,
}) => {
  const blocks = buildPumpedBlocks(s, lemmaType, splitUV, splitVX, splitXY, splitYZ, multiplier);
  const pumpTargets = lemmaType === 'RL'
    ? <span className="part-y">y</span>
    : <><span className="part-v">v</span> and <span className="part-y">y</span></>;

  const pumpedStr = blocks.map(b => b.char).join('') || 'ε';

  return (
    <div className={`step-card ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
      <div className="step-header">
        <span className="step-badge">04</span>
        <h2>PUMP IT!</h2>
      </div>
      <p className="step-desc">
        The lemma says <span className="math">xy<sup>i</sup>z</span> must be in L for all{' '}
        <span className="math">i ≥ 0</span>. Duplicate or remove the {pumpTargets} section(s)
        by changing <span className="math">i</span>. Find an <span className="math">i</span> that breaks the language!
      </p>

      <div className="pump-controls">
        <div className="pump-i-display">
          <span className="pump-i-label">i =</span>
          <motion.span
            className="pump-i-value"
            key={multiplier}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            {multiplier}
          </motion.span>
        </div>
        <input
          type="range"
          min={0}
          max={5}
          value={multiplier}
          onChange={(e) => onMultiplierChange(parseInt(e.target.value))}
          disabled={isDisabled}
          id="pump-slider"
          className="pump-slider"
        />
        <div className="pump-ticks">
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className={`pump-tick ${multiplier === i ? 'active' : ''}`}
              onClick={() => onMultiplierChange(i)}
            >
              {i}
            </span>
          ))}
        </div>
      </div>

      <div className="pumped-string-label">
        Pumped string{' '}
        <span className="math">
          {lemmaType === 'RL' ? `xy${multiplier > 1 ? multiplier : ''}z` : `uv${multiplier > 1 ? multiplier : ''}xy${multiplier > 1 ? multiplier : ''}z`}
        </span>
        :
      </div>

      <StringVisualizer blocks={blocks} />

      <div className="string-raw">
        = <span className="math">{pumpedStr}</span> (length: {blocks.length})
      </div>

      <motion.button
        className="cyber-btn"
        onClick={onEvaluate}
        disabled={isDisabled}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ marginTop: '1.5rem' }}
        id="btn-step-5"
      >
        Evaluate →
      </motion.button>
    </div>
  );
};

export default Step5Pump;
