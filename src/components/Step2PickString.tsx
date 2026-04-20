import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { LangKey } from '../types';
import { validateString, getStringExample } from '../logic';

interface Step2Props {
  lang: LangKey;
  p: number;
  onConfirm: (s: string) => void;
  isActive: boolean;
  isDisabled: boolean;
}

const Step2PickString: React.FC<Step2Props> = ({ lang, p, onConfirm, isActive, isDisabled }) => {
  const [val, setVal] = useState('');
  const [error, setError] = useState('');
  const example = getStringExample(lang, p);

  const handleConfirm = () => {
    const trimmed = val.trim();
    const err = validateString(trimmed, lang, p);
    if (err) { setError(err); return; }
    setError('');
    onConfirm(trimmed);
  };

  return (
    <div className={`step-card ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
      <div className="step-header">
        <span className="step-badge">02</span>
        <h2>Define Your String</h2>
      </div>
      <p className="step-desc">
        Pick a string <span className="math">s ∈ L</span> with <span className="math">|s| ≥ {p}</span>. You are choosing the string — pick one that is <em>difficult</em> for any partition to pump.
      </p>

      <div className="helper-box">
        <span className="helper-label">💡 Hint:</span> Try <span className="math">{example}</span>
      </div>

      <div className="input-row" style={{ marginTop: '1rem' }}>
        <label className="input-label">s =</label>
        <input
          type="text"
          className="cyber-input"
          placeholder={`e.g. ${example}`}
          value={val}
          onChange={(e) => { setVal(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          id="s-input"
          disabled={isDisabled}
        />
        <motion.button
          className="cyber-btn"
          onClick={handleConfirm}
          disabled={isDisabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="btn-step-2"
        >
          Validate →
        </motion.button>
      </div>
      {error && <p className="error-msg">⚠ {error}</p>}
    </div>
  );
};

export default Step2PickString;
