import React from 'react';
import { motion } from 'framer-motion';

const MeshBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Primary Glows */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#FF6A00]/10 dark:bg-[#FF6A00]/5 blur-[120px]" 
      />
      
      <motion.div 
        animate={{ 
          x: [0, -80, 0],
          y: [0, 120, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#FFB347]/10 dark:bg-[#FFB347]/5 blur-[100px]" 
      />

      <motion.div 
        animate={{ 
          x: [0, 50, 0],
          y: [0, -100, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-[120px]" 
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
    </div>
  );
};

export default MeshBackground;
