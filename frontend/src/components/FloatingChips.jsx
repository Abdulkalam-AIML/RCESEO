import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target, Cpu } from 'lucide-react';

const FloatingChips = () => {
  const chips = [
    { icon: Sparkles, label: "SEO Score 98", color: "#FF6A00", top: "15%", left: "10%", delay: 0 },
    { icon: TrendingUp, label: "Google Rank #1", color: "#FFB347", top: "25%", right: "15%", delay: 2 },
    { icon: Target, label: "Keywords Optimized", color: "#4F46E5", bottom: "30%", left: "15%", delay: 4 },
    { icon: Cpu, label: "AI Rewrite Gen", color: "#10B981", bottom: "20%", right: "12%", delay: 6 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden">
      {chips.map((chip, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.8],
            y: [0, -40, 0],
            x: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 12, 
            delay: chip.delay, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{ 
            position: 'absolute', 
            top: chip.top, 
            left: chip.left, 
            right: chip.right,
            bottom: chip.bottom
          }}
          className="glass-premium px-6 py-3 rounded-full flex items-center gap-3 shadow-xl shadow-black/5"
        >
          <chip.icon size={16} style={{ color: chip.color }} />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0F172A] dark:text-white">
            {chip.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingChips;
