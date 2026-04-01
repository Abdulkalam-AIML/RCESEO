import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      whileHover={{ scale: 1.05, x: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-orange-200 dark:border-orange-500/30 text-orange-500 dark:text-orange-400 rounded-full font-bold text-sm shadow-sm transition-all hover:bg-orange-50 dark:hover:bg-orange-500/10 group"
    >
      <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
      <span>Back</span>
    </motion.button>
  );
};

export default BackButton;
