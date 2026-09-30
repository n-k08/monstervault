import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface Props {
  message: string;
  type?: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', show, onClose, duration = 3000 }: Props) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, duration);
      return () => clearTimeout(t);
    }
  }, [show, onClose, duration]);

  const colors = {
    success: 'border-[#39FF14] bg-[#39FF14]/10',
    error: 'border-red-500 bg-red-500/10',
    info: 'border-blue-400 bg-blue-400/10',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-lg border font-medium text-sm text-white ${colors[type]}`}
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
