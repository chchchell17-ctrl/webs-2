import React from 'react';
import type { DialogueExpression } from '../../types/game.ts';

interface AinaIllustrationProps {
  expression?: DialogueExpression;
  holdingPhone?: boolean;
  className?: string;
}

export const AinaIllustration: React.FC<AinaIllustrationProps> = ({
  expression = 'happy',
  holdingPhone = false,
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
      aria-label={`Aina (${expression})`}
    >
      <defs>
        <linearGradient id="aina-hijab-outer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F9A8D4" />
          <stop offset="52%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>
        <linearGradient id="aina-hijab-fold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBCFE8" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
        <linearGradient id="aina-underscarf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDF2F8" />
          <stop offset="100%" stopColor="#F9A8D4" />
        </linearGradient>
        <linearGradient id="aina-hoodie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DDD6FE" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="aina-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE2C8" />
          <stop offset="100%" stopColor="#F3C39E" />
        </linearGradient>
      </defs>

      {/* Soft Aura */}
      <circle cx="80" cy="88" r="70" fill="#FDF2F8" opacity="0.7" />

      {/* Outer Tudung Back & Crown Silhouette (Natural dome well above forehead) */}
      <path
        d="M31 92 C29 22, 131 22, 129 92 L134 146 C134 156, 26 156, 26 146 Z"
        fill="url(#aina-hijab-outer)"
        stroke="#FFFFFF"
        strokeWidth="3"
      />

      {/* Hoodie Shoulders & Torso */}
      <path
        d="M32 166 C34 128, 52 118, 80 118 C108 118, 126 128, 128 166 Z"
        fill="url(#aina-hoodie)"
        stroke="#FFFFFF"
        strokeWidth="3"
      />

      {/* Star Emblem on Hoodie (lower chest so tudung drape sits above) */}
      <circle cx="80" cy="150" r="9.5" fill="#FFFFFF" opacity="0.94" />
      <path
        d="M80 143.5 L82 148 L86.8 148.6 L83.2 151.9 L84.1 156.6 L80 154.2 L75.9 156.6 L76.8 151.9 L73.2 148.6 L78 148 Z"
        fill="#F59E0B"
      />

      {/* Face Oval (Centered neatly below forehead crown) */}
      <ellipse
        cx="80"
        cy="79"
        rx="29"
        ry="31.5"
        fill="url(#aina-skin)"
        stroke="#F472B6"
        strokeWidth="2"
      />

      {/* Tidy Anak Tudung (Underscarf) cleanly along top forehead hairline */}
      <path
        d="M50 70 C50 47, 110 47, 110 70 C97 57, 63 57, 50 70 Z"
        fill="url(#aina-underscarf)"
        stroke="#F472B6"
        strokeWidth="1.5"
      />

      {/* Outer Tudung Cheek Wrap Framing Face Sides & Under Chin */}
      <path
        d="M44 76 C44 42, 116 42, 116 76 C116 53, 102 41, 80 41 C58 41, 44 53, 44 76 Z"
        fill="url(#aina-hijab-outer)"
      />
      <path
        d="M49 62 C44 82, 49 107, 80 112 C111 107, 116 82, 111 62 C117 72, 121 94, 117 110 C108 124, 93 128, 80 128 C67 128, 52 124, 43 110 C39 94, 43 72, 49 62 Z"
        fill="url(#aina-hijab-outer)"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Graceful Asymmetric Tudung Front Drape over Chin & Upper Chest */}
      <path
        d="M42 104 Q80 124 118 104 Q124 128 84 140 Q42 135 42 104 Z"
        fill="url(#aina-hijab-fold)"
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />
      <path
        d="M52 111 Q80 127 110 112"
        fill="none"
        stroke="#BE185D"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* Cute Gold Star Brooch Pin at Left Temple Fold */}
      <g transform="translate(107, 62)">
        <circle cx="0" cy="0" r="6" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.8" />
        <path
          d="M0 -3.5 L1 -0.8 L3.8 -0.6 L1.6 1.1 L2.3 3.7 L0 2.2 L-2.3 3.7 L-1.6 1.1 L-3.8 -0.6 L-1 -0.8 Z"
          fill="#D97706"
        />
      </g>

      {/* Cheeks */}
      <ellipse cx="60" cy="87" rx="5.2" ry="3.1" fill="#FDA4AF" opacity="0.72" />
      <ellipse cx="100" cy="87" rx="5.2" ry="3.1" fill="#FDA4AF" opacity="0.72" />

      {/* Eyebrows */}
      {isWorried ? (
        <>
          <path d="M60 66 Q66 63 72 67" fill="none" stroke="#6B3A26" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M100 66 Q94 63 88 67" fill="none" stroke="#6B3A26" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : isSurprised ? (
        <>
          <path d="M60 62 Q66 58 72 62" fill="none" stroke="#6B3A26" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M88 62 Q94 58 100 62" fill="none" stroke="#6B3A26" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M60 65 Q66 62 72 65" fill="none" stroke="#6B3A26" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M88 65 Q94 62 100 65" fill="none" stroke="#6B3A26" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}

      {/* Eyes */}
      <circle cx="67" cy="76" r="5" fill="#1E293B" />
      <circle cx="93" cy="76" r="5" fill="#1E293B" />
      <circle cx="65.4" cy="74.3" r="1.9" fill="#FFFFFF" />
      <circle cx="91.4" cy="74.3" r="1.9" fill="#FFFFFF" />

      {/* Mouth */}
      {isWorried ? (
        <path d="M73 96 Q80 91 87 96" fill="none" stroke="#9A3412" strokeWidth="2.6" strokeLinecap="round" />
      ) : isSurprised ? (
        <ellipse cx="80" cy="95" rx="4.5" ry="5.5" fill="#BE123C" />
      ) : isCelebrating ? (
        <path d="M71 91 Q80 102 89 91 Z" fill="#FB7185" stroke="#9A3412" strokeWidth="1.9" />
      ) : (
        <path d="M72 92 Q80 99 88 92" fill="none" stroke="#9A3412" strokeWidth="2.6" strokeLinecap="round" />
      )}

      {/* Optional Held Smartphone */}
      {holdingPhone && (
        <g transform="translate(108, 108) rotate(8)">
          <rect
            x="0"
            y="0"
            width="28"
            height="46"
            rx="6"
            fill="#0F172A"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          <rect x="3" y="5" width="22" height="34" rx="3" fill="#BAE6FD" />
          <rect x="6" y="10" width="16" height="8" rx="2" fill="#FDE047" />
          <rect x="6" y="21" width="16" height="4" rx="2" fill="#0284C7" />
          <rect x="6" y="28" width="12" height="4" rx="2" fill="#E11D48" />
          <ellipse cx="4" cy="26" rx="5.5" ry="7.5" fill="url(#aina-skin)" stroke="#F472B6" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
};
