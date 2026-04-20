import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Step1Props {
  onConfirm: (p: number) => void;
  isActive: boolean;
  isDisabled: boolean;
}

const Step1PickP: React.FC<Step1Props> = ({ onConfirm, isActive, isDisabled }) => {
  const [pVal, setPVal] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    const val = parseInt(pVal);
    if (isNaN(val) || val < 1 || val > 20) {
      setError('Choose a value between 1 and 20.');
      return;
    }
    setError('');
    onConfirm(val);
  };

  return (
    <div className={`step-card ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
      <div className="step-header">
        <span className="step-badge">01</span>
        <h2>Set the Stage</h2>
      </div>
      <p className="step-desc">
        The Pumping Lemma states: <em>If L is regular, there exists some pumping length</em>{' '}
        <span className="math">p ≥ 1</span>. You play the <strong>Adversary</strong> — assume L is regular and pick any&nbsp;
        <span className="math">p</span> the DFA might claim.
      </p>

      <div className="input-row">
        <label className="input-label">p =</label>
        <input
          type="number"
          className="cyber-input"
          min={1}
          max={20}
          placeholder="e.g. 4"
          value={pVal}
          onChange={(e) => { setPVal(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          id="p-input"
          style={{ maxWidth: 120 }}
        />
        <motion.button
          className="cyber-btn"
          onClick={handleConfirm}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="btn-step-1"
        >
          Lock in p →
        </motion.button>
      </div>
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default Step1PickP;
