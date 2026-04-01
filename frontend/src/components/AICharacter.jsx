import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AICharacter = ({ mode = 'login' }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none overflow-hidden">
      {/* Human/AI Silhouette Base */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative group"
      >
        {/* Animated Hand/Signboard Container */}
        <div className="relative z-10 perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, type: 'spring', damping: 15 }}
              className="glass-premium p-8 rounded-[32px] border-[#00FF87]/20 shadow-[0_20px_50px_rgba(0,255,135,0.15)] min-w-[240px] text-center"
            >
               <motion.div
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="w-12 h-12 bg-gradient-to-br from-[#FF6A00] to-[#FFB347] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-orange-500/30"
               >
                 <span className="text-white text-xs font-black">AI</span>
               </motion.div>
               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
                 {mode === 'login' ? 'Welcome Back' : 'Join the Elite'}
               </h3>
               <p className="text-orange-500 font-bold text-[10px] tracking-[0.3em] uppercase">
                 {mode === 'login' ? 'Authentication Required' : 'Optimization Access'}
               </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Decorative Floating Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -right-10 w-24 h-24 bg-[#00FF87]/10 rounded-full blur-[40px] -z-10"
        />
      </motion.div>
    </div>
  );
};

export default AICharacter;
