import { memo } from 'react';
import type { CanColorConfig } from '../../types/monster';

interface Props {
  canColor: CanColorConfig;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  collected?: boolean;
  personalImage?: string | null;
  className?: string;
}

const dims = {
  sm: { w: 50, h: 104, clawScale: 0.5 },
  md: { w: 76, h: 156, clawScale: 0.78 },
  lg: { w: 108, h: 220, clawScale: 1.1 },
  xl: { w: 140, h: 285, clawScale: 1.4 },
};

function MonsterCanVisualComponent({
  canColor,
  name,
  size = 'md',
  collected = false,
  personalImage,
  className = '',
}: Props) {
  const { w, h, clawScale } = dims[size];
  const rimHeight = Math.max(5, Math.round(h * 0.05));
  const bodyHeight = h - rimHeight * 2;
  const uniqueId = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

  // If uncollected, subtly desaturate and darken to create a clean blueprint/stealth look
  const bodyMainColor = collected ? canColor.main : '#16191f';
  const clawColor = collected ? canColor.claw : '#4b5563';
  const accentColor = collected ? canColor.accent : '#374151';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none group transition-transform duration-200 ${className}`}
      style={{ width: w, height: h }}
      title={`${name} ${collected ? '(Collected)' : '(Not Collected)'}`}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Metallic rim gradient */}
          <linearGradient id={`rim-grad-${uniqueId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8E939A" />
            <stop offset="20%" stopColor="#DDE2E7" />
            <stop offset="45%" stopColor="#B3B9C1" />
            <stop offset="70%" stopColor="#F0F4F8" />
            <stop offset="100%" stopColor="#7B8087" />
          </linearGradient>

          {/* Can body cylindrical shading gradient */}
          <linearGradient id={`can-body-grad-${uniqueId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={bodyMainColor} stopOpacity="0.88" />
            <stop offset="18%" stopColor={bodyMainColor} />
            <stop offset="40%" stopColor={bodyMainColor} />
            <stop offset="75%" stopColor={bodyMainColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor={bodyMainColor} stopOpacity="0.75" />
          </linearGradient>

          {/* Vertical gloss sheen */}
          <linearGradient id={`sheen-${uniqueId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="15%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="28%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
          </linearGradient>

          {/* Glow filter for claws */}
          <filter id={`claw-glow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Body clip path for custom photo masking */}
          <clipPath id={`can-body-clip-${uniqueId}`}>
            <rect x={w * 0.08} y={rimHeight} width={w * 0.84} height={bodyHeight} rx={5} />
          </clipPath>
        </defs>

        {/* Ambient Drop Shadow */}
        <ellipse
          cx={w * 0.5}
          cy={h - 1}
          rx={w * 0.38}
          ry={3.5}
          fill="rgba(0,0,0,0.65)"
          filter="blur(2px)"
        />

        {/* Top Rim Bevel (Lid Rim) */}
        <rect
          x={w * 0.14}
          y={1}
          width={w * 0.72}
          height={rimHeight * 0.9}
          rx={rimHeight * 0.45}
          fill={`url(#rim-grad-${uniqueId})`}
        />
        {/* Pull tab hint */}
        <ellipse
          cx={w * 0.5}
          cy={2.5}
          rx={w * 0.16}
          ry={1.2}
          fill="rgba(0, 0, 0, 0.35)"
        />

        {/* Can Main Body */}
        {personalImage ? (
          <g clipPath={`url(#can-body-clip-${uniqueId})`}>
            <rect
              x={w * 0.08}
              y={rimHeight}
              width={w * 0.84}
              height={bodyHeight}
              rx={5}
              fill="#111"
            />
            <image
              href={personalImage}
              x={w * 0.08}
              y={rimHeight}
              width={w * 0.84}
              height={bodyHeight}
              preserveAspectRatio="xMidYMid slice"
            />
            {/* Cylindrical shine over image */}
            <rect
              x={w * 0.08}
              y={rimHeight}
              width={w * 0.84}
              height={bodyHeight}
              fill={`url(#sheen-${uniqueId})`}
              pointerEvents="none"
            />
          </g>
        ) : (
          <rect
            x={w * 0.08}
            y={rimHeight}
            width={w * 0.84}
            height={bodyHeight}
            rx={5}
            fill={`url(#can-body-grad-${uniqueId})`}
          />
        )}

        {/* Can Edge Trim / Bevel Accent */}
        <rect
          x={w * 0.08}
          y={rimHeight}
          width={w * 0.84}
          height={bodyHeight}
          rx={5}
          fill="none"
          stroke={accentColor}
          strokeWidth="0.8"
          strokeOpacity={collected ? 0.6 : 0.25}
        />

        {/* Cylindrical Metallic Specular Reflection Layer */}
        {!personalImage && (
          <rect
            x={w * 0.08}
            y={rimHeight}
            width={w * 0.84}
            height={bodyHeight}
            rx={5}
            fill={`url(#sheen-${uniqueId})`}
            pointerEvents="none"
          />
        )}

        {/* Authentic Jagged Monster 3-Claw Emblem */}
        {!personalImage && (
          <g
            transform={`translate(${w * 0.5 - 19 * clawScale}, ${h * 0.44 - 24 * clawScale}) scale(${clawScale})`}
            fill={clawColor}
            filter={collected ? `url(#claw-glow-${uniqueId})` : undefined}
            opacity={collected ? 0.95 : 0.45}
          >
            {/* Left claw slash */}
            <path d="M7.8 2.2 C7.5 1.5 6.4 1.2 5.5 1.6 C4.6 2 4.1 3 4.3 3.9 L6.1 14.5 C6.3 15.3 5.4 16.2 4.5 15.8 L2.5 14.8 C1.8 14.5 1 15 0.9 15.8 L0.1 23.5 C-0.1 24.5 0.6 25.4 1.6 25.5 L3.9 25.8 C4.7 25.9 5.3 26.6 5.2 27.4 L4.1 37.8 C3.9 39.2 5.5 40.1 6.6 39.2 L11.2 34.6 C11.8 34 12.1 33.1 12 32.2 L9.6 15.4 C9.4 14.5 10.2 13.8 11.1 14.2 L12.5 14.8 C13.3 15.1 14.1 14.5 14 13.7 L13.1 6.5 C12.9 5.2 12.1 4.2 10.9 3.8 Z" />

            {/* Middle claw slash (towering & jagged) */}
            <path d="M19.8 0.4 C18.7 0.1 17.6 0.8 17.3 1.9 L15.6 12.4 C15.4 13.4 14.3 13.9 13.4 13.3 L12.2 12.4 C11.4 11.8 10.3 12.3 10.2 13.3 L9.6 21.8 C9.5 22.8 10.3 23.6 11.3 23.7 L14.5 23.9 C15.4 24 16 24.8 15.9 25.7 L14.4 43.8 C14.3 45.4 16.3 46.3 17.5 45.1 L23.5 39.2 C24.1 38.6 24.4 37.7 24.3 36.8 L22.4 16.8 C22.3 15.8 23.3 15 24.3 15.5 L26.2 16.5 C27.1 17 28.1 16.3 28 15.3 L26.8 5.6 C26.6 3.8 25.4 2.2 23.6 1.4 Z" />

            {/* Right claw slash */}
            <path d="M32.5 3.8 C31.6 3.3 30.5 3.8 30.2 4.8 L28.8 13.8 C28.6 14.8 27.5 15.3 26.6 14.7 L25.5 13.9 C24.7 13.4 23.7 14 23.6 15 L23.1 22.8 C23 23.8 23.8 24.7 24.8 24.8 L27.2 25.1 C28.1 25.2 28.7 26 28.5 26.9 L26.8 36.2 C26.5 37.5 28.1 38.4 29.1 37.5 L33.6 33.2 C34.2 32.7 34.5 31.8 34.4 31 L32.6 16.2 C32.5 15.3 33.4 14.6 34.3 15.1 L35.6 15.8 C36.4 16.2 37.4 15.6 37.3 14.7 L36.5 8.6 C36.3 6.6 34.6 4.9 32.5 3.8 Z" />
          </g>
        )}

        {/* Bottom Rim (Base chime) */}
        <rect
          x={w * 0.14}
          y={h - rimHeight}
          width={w * 0.72}
          height={rimHeight * 0.9}
          rx={rimHeight * 0.45}
          fill={`url(#rim-grad-${uniqueId})`}
        />

        {/* Bottom Shadow Line */}
        <line
          x1={w * 0.16}
          y1={h - 1}
          x2={w * 0.84}
          y2={h - 1}
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="1"
        />

        {/* Subtle Horizontal Grip Ridges on top and bottom of can */}
        <line
          x1={w * 0.12}
          y1={rimHeight + 3}
          x2={w * 0.88}
          y2={rimHeight + 3}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.6"
        />
        <line
          x1={w * 0.12}
          y1={h - rimHeight - 3}
          x2={w * 0.88}
          y2={h - rimHeight - 3}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="0.6"
        />
      </svg>

      {/* Name label text on large & extra-large can displays */}
      {(size === 'lg' || size === 'xl') && !personalImage && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center w-[84%] pointer-events-none px-1"
          style={{
            color: collected ? accentColor : '#9ca3af',
            textShadow: collected ? `0 0 10px ${accentColor}80` : 'none',
          }}
        >
          <p className="text-[9px] font-black uppercase tracking-wider truncate">
            {name.replace('Monster Energy', '').trim()}
          </p>
        </div>
      )}

      {/* Collected checkmark badge */}
      {collected && (
        <div
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg border border-black/40 animate-in zoom-in duration-200"
          style={{
            backgroundColor: '#39FF14',
            color: '#000',
            boxShadow: '0 0 10px rgba(57,255,20,0.7)',
          }}
        >
          ✓
        </div>
      )}
    </div>
  );
}

export default memo(MonsterCanVisualComponent);
