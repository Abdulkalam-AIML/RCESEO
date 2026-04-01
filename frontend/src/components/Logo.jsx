import { motion } from 'framer-motion';

/**
 * Logo component — renders the official RCE SEO Optimizer logo.
 * size: pixel width (height auto)
 * glow: whether to show the orange brand glow halo
 * className: extra tailwind classes
 */
const Logo = ({ size = 40, glow = false, className = '' }) => (
  <motion.img
    src="/logo.png"
    alt="RCE SEO Optimizer"
    width={size}
    height={size}
    initial={glow ? { scale: 0.95 } : {}}
    animate={glow ? { 
      scale: [0.95, 1.05, 0.95],
      filter: [
        'drop-shadow(0 0 10px rgba(0,255,135,0.55))',
        'drop-shadow(0 0 25px rgba(0,255,135,0.35))',
        'drop-shadow(0 0 10px rgba(0,255,135,0.55))'
      ]
    } : {}}
    transition={glow ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
    className={`object-contain select-none ${className}`}
    draggable={false}
  />
);

export default Logo;
