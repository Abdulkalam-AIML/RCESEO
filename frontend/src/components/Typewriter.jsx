import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Typewriter = ({ phrases, delay = 2400 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, delay + 800);
    return () => clearInterval(timer);
  }, [phrases.length, delay]);

  return (
    <div style={{ height: '1.15em', position: 'relative', overflow: 'hidden', display: 'inline-block', verticalAlign: 'bottom', minWidth: '200px' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 40, opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -40, opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            left: 0,
            // Use brand primary color — not hardcoded green
            color: 'var(--primary)',
            textShadow: '0 0 40px var(--primary-glow)',
          }}
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default Typewriter;
