import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LemmaType, LangKey, LemmaState, EvaluationResult } from './types';
import { RL_LANGS, CFL_LANGS } from './constants';
import { evaluateResult } from './logic';
import Step0LangSelect from './components/Step0LangSelect';
import Step1PickP from './components/Step1PickP';
import Step2PickString from './components/Step2PickString';
import Step3Partition from './components/Step3Partition';
import Step5Pump from './components/Step5Pump';
import Step6Result from './components/Step6Result';
import './App.css';

const INITIAL_STATE: LemmaState = {
  lemmaType: 'RL',
  lang: 'A',
  p: 4,
  s: '',
  splitUV: 0,
  splitVX: 0,
  splitXY: 0,
  splitYZ: 1,
  multiplier: 1,
  isPartitionValid: false,
  activeStep: 0,
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 28 },
  },
};

function App() {
  const [state, setState] = useState<LemmaState>(INITIAL_STATE);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [sessionKey, setSessionKey] = useState(0);

  const updateState = useCallback((patch: Partial<LemmaState>) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);

  // Step 0: Lock in language
  const handleLemmaTypeChange = (t: LemmaType) => {
    const langs = t === 'RL' ? RL_LANGS : CFL_LANGS;
    updateState({ lemmaType: t, lang: langs[0].key, activeStep: 0 });
  };

  const handleLangChange = (l: LangKey) => {
    updateState({ lang: l, activeStep: 0 });
  };

  const handleStep0Confirm = () => {
    updateState({ activeStep: 1 });
  };

  // Step 1: Lock in p
  const handleStep1Confirm = (p: number) => {
    updateState({ p, s: '', splitUV: 0, splitVX: 0, splitXY: 0, splitYZ: 1, multiplier: 1, activeStep: 2 });
  };

  // Step 2: Validate & lock string
  const handleStep2Confirm = (s: string) => {
    const len = s.length;
    updateState({
      s,
      splitUV: 0,
      splitVX: 0,
      splitXY: 0,
      splitYZ: Math.min(1, len),
      activeStep: 3,
    });
  };

  // Step 3: Update splits with clamping
  const handleSplitChange = (key: 'splitUV' | 'splitVX' | 'splitXY' | 'splitYZ', val: number) => {
    setState(prev => {
      let { splitUV, splitVX, splitXY, splitYZ } = prev;
      const len = prev.s.length;

      if (key === 'splitUV') splitUV = Math.min(val, splitVX);
      if (key === 'splitVX') { splitVX = Math.max(val, splitUV); splitXY = Math.max(splitXY, splitVX); }
      if (key === 'splitXY') { splitXY = Math.max(val, prev.lemmaType === 'CFL' ? splitVX : 0); splitYZ = Math.max(splitYZ, splitXY + 1); }
      if (key === 'splitYZ') splitYZ = Math.max(val, splitXY + 1);

      splitUV = Math.max(0, Math.min(splitUV, len));
      splitVX = Math.max(splitUV, Math.min(splitVX, len));
      splitXY = Math.max(splitVX, Math.min(splitXY, len));
      splitYZ = Math.max(splitXY + 1, Math.min(splitYZ, len));

      // Check rule validity
      let isPartitionValid = false;
      if (prev.lemmaType === 'RL') {
        const xyLen = splitXY; const yLen = splitYZ - splitXY;
        isPartitionValid = xyLen + yLen <= prev.p && yLen >= 1;
      } else {
        const vLen = splitVX - splitUV; const xLen = splitXY - splitVX; const yLen = splitYZ - splitXY;
        isPartitionValid = vLen + xLen + yLen <= prev.p && vLen + yLen >= 1;
      }

      return { ...prev, splitUV, splitVX, splitXY, splitYZ, isPartitionValid, activeStep: Math.min(prev.activeStep, 3) };
    });
  };

  const handleStep3Confirm = () => {
    updateState({ activeStep: 5, multiplier: 1 });
    setEvalResult(null);
  };

  // Step 5: Pump
  const handleMultiplierChange = (i: number) => {
    updateState({ multiplier: i });
    setEvalResult(null);
  };

  const handleEvaluate = () => {
    const res = evaluateResult(
      state.s, state.lang, state.lemmaType,
      state.splitUV, state.splitVX, state.splitXY, state.splitYZ, state.multiplier
    );
    setEvalResult(res);
    updateState({ activeStep: 6 });
  };

  const handleRestart = () => {
    setState(INITIAL_STATE);
    setEvalResult(null);
    setSessionKey(k => k + 1);
  };

  const langLabel =
    state.lang === 'A' ? 'L = { 0ⁿ1ⁿ | n ≥ 0 }' :
    state.lang === 'B' ? 'L = { 0ⁿ1²ⁿ | n ≥ 0 }' :
    state.lang === 'C' ? 'L = { w | #0 = #1 }' :
    state.lang === 'D' ? 'L = { 0ⁿ1ⁿ2ⁿ | n ≥ 0 }' :
    state.lang === 'E' ? 'L = { ww | w ∈ {0,1}* }' :
    'L = { w | #0 = #1 = #2 }';

  return (
    <div className="app-container">
      {/* Ambient glow orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <motion.header
        className="app-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="header-badge">TOC Interactive</div>
        <h1 className="app-title">
          <span className="title-accent">PUMPING LEMMA</span>
          <span className="title-sub"> SIMULATOR</span>
        </h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={state.lang}
            className="header-subtitle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            Proving <span className="math">{langLabel}</span> is Not {state.lemmaType === 'RL' ? 'Regular' : 'Context-Free'}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="progress-track">
          {['Lang', 'p', 'String', 'Partition', 'Pump', 'Result'].map((label, i) => {
            const stepNums = [0, 1, 2, 3, 5, 6];
            const stepNum = stepNums[i];
            const done = state.activeStep > stepNum;
            const active = state.activeStep === stepNum;
            const connectorFilled = i < 5 && state.activeStep > stepNums[i];
            return (
              <div key={label} className="progress-step-wrapper">
                <div className={`progress-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                  <div className="progress-dot">{done ? '✓' : i + 1}</div>
                  <span className="progress-label">{label}</span>
                </div>
                {i < 5 && (
                  <div className={`progress-connector ${connectorFilled ? 'filled' : ''}`} />
                )}
              </div>
            );
          })}
        </div>
      </motion.header>

      <main key={sessionKey} className="steps-container">
        <AnimatePresence initial={false}>
          <motion.div key="step0" variants={cardVariants} initial="hidden" animate="visible" layout>
            <Step0LangSelect
              lemmaType={state.lemmaType}
              lang={state.lang}
              onLemmaTypeChange={handleLemmaTypeChange}
              onLangChange={handleLangChange}
              onConfirm={handleStep0Confirm}
              isActive={state.activeStep === 0}
            />
          </motion.div>

          {state.activeStep >= 1 && (
            <motion.div key="step1" variants={cardVariants} initial="hidden" animate="visible" layout>
              <Step1PickP
                onConfirm={handleStep1Confirm}
                isActive={state.activeStep === 1}
                isDisabled={state.activeStep < 1}
              />
            </motion.div>
          )}

          {state.activeStep >= 2 && (
            <motion.div key="step2" variants={cardVariants} initial="hidden" animate="visible" layout>
              <Step2PickString
                lang={state.lang}
                p={state.p}
                onConfirm={handleStep2Confirm}
                isActive={state.activeStep === 2}
                isDisabled={state.activeStep < 2}
              />
            </motion.div>
          )}

          {state.activeStep >= 3 && (
            <motion.div key="step3" variants={cardVariants} initial="hidden" animate="visible" layout>
              <Step3Partition
                s={state.s}
                p={state.p}
                lemmaType={state.lemmaType}
                splitUV={state.splitUV}
                splitVX={state.splitVX}
                splitXY={state.splitXY}
                splitYZ={state.splitYZ}
                onSplitChange={handleSplitChange}
                onConfirm={handleStep3Confirm}
                isActive={state.activeStep === 3}
                isDisabled={state.activeStep < 3}
              />
            </motion.div>
          )}

          {state.activeStep >= 5 && (
            <motion.div key="step5" variants={cardVariants} initial="hidden" animate="visible" layout>
              <Step5Pump
                s={state.s}
                lemmaType={state.lemmaType}
                splitUV={state.splitUV}
                splitVX={state.splitVX}
                splitXY={state.splitXY}
                splitYZ={state.splitYZ}
                multiplier={state.multiplier}
                onMultiplierChange={handleMultiplierChange}
                onEvaluate={handleEvaluate}
                isActive={state.activeStep === 5}
                isDisabled={state.activeStep < 5}
              />
            </motion.div>
          )}

          {state.activeStep >= 6 && evalResult && (
            <motion.div key="step6" variants={cardVariants} initial="hidden" animate="visible" layout>
              <Step6Result
                result={evalResult}
                multiplier={state.multiplier}
                lemmaType={state.lemmaType}
                lang={state.lang}
                onRestart={handleRestart}
                isActive={state.activeStep === 6}
                isDisabled={state.activeStep < 6}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
