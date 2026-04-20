import React from 'react';
import { motion } from 'framer-motion';
import type { LemmaType, LangKey } from '../types';
import { RL_LANGS, CFL_LANGS } from '../constants';

interface Step0Props {
  lemmaType: LemmaType;
  lang: LangKey;
  onLemmaTypeChange: (t: LemmaType) => void;
  onLangChange: (l: LangKey) => void;
  onConfirm: () => void;
  isActive: boolean;
}

const Step0LangSelect: React.FC<Step0Props> = ({
  lemmaType, lang, onLemmaTypeChange, onLangChange, onConfirm, isActive,
}) => {
  const langs = lemmaType === 'RL' ? RL_LANGS : CFL_LANGS;

  return (
    <div className={`step-card ${isActive ? 'active' : ''}`}>
      <div className="step-header">
        <span className="step-badge">00</span>
        <h2>Choose Target Language</h2>
      </div>
      <p className="step-desc">Select the lemma variant and the language you want to prove non-regular.</p>

      <div className="toggle-row">
        {(['RL', 'CFL'] as LemmaType[]).map((t) => (
          <motion.label
            key={t}
            className={`radio-chip ${lemmaType === t ? 'active' : ''}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <input
              type="radio"
              name="lemma-type"
              value={t}
              checked={lemmaType === t}
              onChange={() => onLemmaTypeChange(t)}
              style={{ display: 'none' }}
            />
            {t === 'RL' ? '📦 Regular (xyz)' : '🔁 Context-Free (uvxyz)'}
          </motion.label>
        ))}
      </div>

      <div className="input-row">
        <label className="input-label">Language:</label>
        <select
          className="cyber-select"
          value={lang}
          onChange={(e) => onLangChange(e.target.value as LangKey)}
        >
          {langs.map((l) => (
            <option key={l.key} value={l.key}>{l.label}</option>
          ))}
        </select>
        <motion.button
          className="cyber-btn"
          onClick={onConfirm}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="btn-step-0"
        >
          Lock In →
        </motion.button>
      </div>
    </div>
  );
};

export default Step0LangSelect;
