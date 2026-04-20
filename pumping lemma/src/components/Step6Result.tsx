import React from 'react';
import { motion } from 'framer-motion';
import type { EvaluationResult, LangKey, LemmaType } from '../types';
import { LANGUAGES } from '../constants';

interface Step6Props {
  result: EvaluationResult | null;
  multiplier: number;
  lemmaType: LemmaType;
  lang: LangKey;
  onRestart: () => void;
  isActive: boolean;
  isDisabled: boolean;
}

const LANG_NAMES: Record<LangKey, string> = {
  A: 'L = { 0ⁿ1ⁿ }',
  B: 'L = { 0ⁿ1²ⁿ }',
  C: 'L = { w | #0 = #1 }',
  D: 'L = { 0ⁿ1ⁿ2ⁿ }',
  E: 'L = { ww }',
  F: 'L = { w | #0 = #1 = #2 }',
};

const Step6Result: React.FC<Step6Props> = ({
  result, multiplier, lemmaType, lang, onRestart, isActive, isDisabled,
}) => {
  if (!result) return null;

  const { finalStr, inLanguage, reasonContext, count0, count1, count2 } = result;
  const langDesc = LANGUAGES.find(l => l.key === lang);

  let verdict: { text: string; cls: string; emoji: string; tip?: string } = {
    text: 'Wait for it...',
    cls: 'neutral',
    emoji: '⏳',
  };

  if (inLanguage && multiplier === 1) {
    verdict = {
      text: 'String Still In Language!',
      cls: 'neutral',
      emoji: '⚠️',
      tip: `You pumped with i=1 (${lemmaType === 'RL' ? 'xy¹z = s' : 'uv¹xy¹z = s'}). Try i=0 or i≥2 to find a contradiction.`,
    };
  } else if (inLanguage) {
    verdict = {
      text: 'Proof Failed!',
      cls: 'fail',
      emoji: '❌',
      tip: `This partition is always pumpable. The DFA chose a "safe" decomposition. Try a different string or different i.`,
    };
  } else {
    verdict = {
      text: 'PROOF COMPLETE!',
      cls: 'success',
      emoji: '✅',
    };
  }

  return (
    <div className={`step-card result-card ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
      <div className="step-header">
        <span className="step-badge" style={{ background: verdict.cls === 'success' ? 'rgba(16,185,129,0.2)' : undefined }}>05</span>
        <h2>The Verdict</h2>
      </div>

      <div className="eval-stats">
        <div className="eval-stat-row">
          <span className="eval-stat-label">Pumped String:</span>
          <code className="eval-stat-value math">{finalStr || 'ε'}</code>
        </div>
        <div className="eval-stat-row">
          <span className="eval-stat-label">Length:</span>
          <code className="eval-stat-value">{finalStr.length}</code>
        </div>
        {['A','B','C','E'].includes(lang) && (
          <div className="eval-stat-row">
            <span className="eval-stat-label">Counts:</span>
            <code className="eval-stat-value">0s={count0}, 1s={count1}</code>
          </div>
        )}
        {['D', 'F'].includes(lang) && (
          <div className="eval-stat-row">
            <span className="eval-stat-label">Counts:</span>
            <code className="eval-stat-value">0s={count0}, 1s={count1}, 2s={count2}</code>
          </div>
        )}
        <div className="eval-stat-row">
          <span className="eval-stat-label">In {LANG_NAMES[lang]}?</span>
          <code className={`eval-stat-value eval-in-lang ${inLanguage ? 'yes' : 'no'}`}>
            {inLanguage ? 'YES ✓' : 'NO ✗'}
          </code>
        </div>
      </div>

      <motion.div
        className={`verdict-box ${verdict.cls}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
      >
        <span className="verdict-emoji">{verdict.emoji}</span>
        <h1 className="verdict-text">{verdict.text}</h1>

        {verdict.cls === 'success' && (
          <motion.p
            className="verdict-proof"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <strong>Contradiction:</strong> The pumped string{' '}
            <span className="math">{lemmaType === 'RL' ? `xy⁰z` : `uv⁰xy⁰z`}</span>{' '}
            is NOT in <span className="math">{LANG_NAMES[lang]}</span> because{' '}
            {reasonContext} This contradicts the Pumping Lemma, proving <strong>{langDesc?.label}</strong> is NOT {lemmaType === 'RL' ? 'regular' : 'context-free'}.
          </motion.p>
        )}

        {verdict.tip && (
          <p className="verdict-tip">{verdict.tip}</p>
        )}
      </motion.div>

      <motion.button
        className="cyber-btn outline"
        onClick={onRestart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ marginTop: '1.5rem' }}
        id="btn-restart"
      >
        ↩ Simulate Again
      </motion.button>
    </div>
  );
};

export default Step6Result;
