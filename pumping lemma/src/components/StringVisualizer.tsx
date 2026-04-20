import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Block } from '../types';

interface StringVisualizerProps {
  blocks: Block[];
  label?: string;
}

const blockVariants = {
  hidden: { scale: 0.3, opacity: 0, y: 12 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      type: 'spring' as const,
      stiffness: 400,
      damping: 22,
    },
  }),
  exit: { scale: 0.4, opacity: 0, y: -10, transition: { duration: 0.15 } },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.03 },
  },
};

const StringVisualizer: React.FC<StringVisualizerProps> = ({ blocks, label }) => {
  return (
    <div className="visualizer-wrapper">
      {label && <span className="visualizer-label">{label}</span>}
      <motion.div
        className="string-visualizer"
        layout
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {blocks.length === 0 ? (
            <motion.span
              key="empty"
              className="empty-epsilon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              ε (empty)
            </motion.span>
          ) : (
            blocks.map((block, i) => (
              <motion.div
                key={block.id}
                className={`block type-${block.char} part-block-${block.type}`}
                custom={i}
                variants={blockVariants}
                layout
                layoutId={block.id}
                whileHover={{ y: -4, scale: 1.1 }}
                title={`Part: ${block.type.toUpperCase()}`}
              >
                <span className="block-char">{block.char}</span>
                <span className="block-label">{block.type}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default StringVisualizer;
