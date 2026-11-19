import React from 'react';
import type { DialogueExpression } from '../../types/game.ts';

interface ByteIllustrationProps {
  expression?: DialogueExpression;
  pose?: 'idle' | 'waving' | 'investigating';
  className?: string;
}

export const ByteIllustration: React.FC<ByteIllustrationProps> = ({
  expression = 'happy',
  pose = 'idle',
  className = 'w-full h-full',
}) => {
  const isWorried = expression === 'worried' || expression === 'thinking';
  const isSurprised = expression === 'surprised';
  const isCelebrating = expression === 'celebrating' || expression === 'excited';

  return (
    <svg
      viewBox="0 0 160 175"
      className={className}
      role="img"
      aria-label={`Byte the Robot (${expression})`}
    >
      <defs>
        <linearGradient id="byte-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>
        <linearGradient id="byte-visor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1E3A5F" />
        </linearGradient>
        <linearGradient id="byte-accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="byte-amber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Soft Aura */}
      <circle cx="80" cy="92" r="68" fill="#E0F2FE" opacity="0.65" />

      {/* Top Antenna with Glowing Bulb */}
      <line x1="80" y1="22" x2="80" y2="38" stroke="#0284C7" strokeWidth="4.5" strokeLinecap="round" />
      <circle
        cx="80"
        cy="17"
        r="7.5"
        fill={isWorried ? '#FB923C' : 'url(#byte-amber)'}
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />
      {isCelebrating && (
        <circle cx="80" cy="17" r="12" fill="#FDE047" opacity="0.35" />
      )}

      {/* Left Arm */}
      <path
        d={pose === 'waving' ? 'M38 112 Q18 82 26 62' : 'M38 116 Q24 128 32 142'}
        fill="none"
        stroke="#0284C7"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle
        cx={pose === 'waving' ? 26 : 32}
        cy={pose === 'waving' ? 60 : 142}
        r="7"
        fill="#FFFFFF"
        stroke="#0284C7"
        strokeWidth="3"
      />

      {/* Right Arm */}
      <path
        d={pose === 'investigating' ? 'M122 114 Q142 98 134 78' : 'M122 116 Q136 128 128 142'}
        fill="none"
        stroke="#0284C7"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle
        cx={pose === 'investigating' ? 134 : 128}
        cy={pose === 'investigating' ? 76 : 142}
        r="7"
        fill="#FFFFFF"
        stroke="#0284C7"
        strokeWidth="3"
      />

      {/* Optional Magnifying Glass when investigating */}
      {pose === 'investigating' && (
        <g transform="translate(132, 62)">
          <circle cx="0" cy="0" r="12" fill="#BAE6FD" fillOpacity="0.5" stroke="#F59E0B" strokeWidth="3.5" />
          <line x1="-8" y1="8" x2="-15" y2="16" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {/* Ear Audio Pods */}
      <rect x="24" y="58" width="12" height="28" rx="6" fill="url(#byte-accent)" stroke="#FFFFFF" strokeWidth="2" />
      <rect x="124" y="58" width="12" height="28" rx="6" fill="url(#byte-accent)" stroke="#FFFFFF" strokeWidth="2" />

      {/* Robot Body */}
      <rect
        x="42"
        y="104"
        width="76"
        height="52"
        rx="22"
        fill="url(#byte-shell)"
        stroke="#FFFFFF"
        strokeWidth="3"
      />
      {/* Chest Detective Core */}
      <rect
        x="56"
        y="115"
        width="48"
        height="28"
        rx="10"
        fill="#BAE6FD"
        stroke="#0284C7"
        strokeWidth="2"
      />
      <circle cx="80" cy="129" r="8" fill="url(#byte-amber)" stroke="#FFFFFF" strokeWidth="2" />
      <path
        d="M80 124 L81.8 127.6 L85.6 128 L82.8 130.6 L83.6 134.4 L80 132.4 L76.4 134.4 L77.2 130.6 L74.4 128 L78.2 127.6 Z"
        fill="#FFFFFF"
      />

      {/* Robot Rounded Head */}
      <rect
        x="34"
        y="36"
        width="92"
        height="68"
        rx="28"
        fill="url(#byte-shell)"
        stroke="#FFFFFF"
        strokeWidth="3.5"
      />

      {/* Glossy Visor Screen */}
      <rect
        x="44"
        y="46"
        width="72"
        height="48"
        rx="18"
        fill="url(#byte-visor)"
        stroke="#38BDF8"
        strokeWidth="2.5"
      />

      {/* Visor Highlight Streak */}
      <path
        d="M52 52 Q80 48 106 53"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.22"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Digital Eyes */}
      {isWorried ? (
        <>
          <rect x="57" y="63" width="12" height="8" rx="4" fill="#FDE047" />
          <rect x="91" y="63" width="12" height="8" rx="4" fill="#FDE047" />
          <path d="M56 59 L70 62" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M104 59 L90 62" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : isSurprised ? (
        <>
          <circle cx="63" cy="67" r="7" fill="#38BDF8" />
          <circle cx="97" cy="67" r="7" fill="#38BDF8" />
          <circle cx="63" cy="67" r="3" fill="#FFFFFF" />
          <circle cx="97" cy="67" r="3" fill="#FFFFFF" />
        </>
      ) : isCelebrating ? (
        <>
          <path d="M56 68 Q63 59 70 68" fill="none" stroke="#4ADE80" strokeWidth="4" strokeLinecap="round" />
          <path d="M90 68 Q97 59 104 68" fill="none" stroke="#4ADE80" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x="57" y="60" width="12" height="14" rx="6" fill="#38BDF8" />
          <rect x="91" y="60" width="12" height="14" rx="6" fill="#38BDF8" />
          <circle cx="61" cy="64" r="2.2" fill="#FFFFFF" />
          <circle cx="95" cy="64" r="2.2" fill="#FFFFFF" />
        </>
      )}

      {/* Digital Smile / Mouth */}
      {isWorried ? (
        <path d="M71 82 Q80 77 89 82" fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      ) : isSurprised ? (
        <circle cx="80" cy="82" r="4.5" fill="#FDE047" />
      ) : (
        <path d="M69 79 Q80 87 91 79" fill="none" stroke="#34D399" strokeWidth="3.2" strokeLinecap="round" />
      )}
    </svg>
  );
};
