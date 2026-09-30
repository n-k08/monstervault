import { motion } from 'framer-motion';

interface Props {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export default function CircularProgress({ value, size = 180, strokeWidth = 10, label }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="url(#greenGrad)" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#39FF14" />
            <stop offset="100%" stopColor="#00E676" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-3xl font-black"
          style={{ color: '#39FF14', textShadow: '0 0 12px rgba(57,255,20,0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(value)}%
        </motion.span>
        {label && <span className="text-xs text-gray-400 mt-1">{label}</span>}
      </div>
    </div>
  );
}
