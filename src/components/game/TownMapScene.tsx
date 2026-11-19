import React from 'react';
import { TOWN_PATH_NODES, WALKABLE_SEGMENTS } from '../../data/townData.ts';

interface TownMapSceneProps {
  highlightPathway?: boolean;
  hqIlluminated?: boolean;
  hqDoorOpen?: boolean;
  redFlagIlluminated?: boolean;
  redFlagDoorOpen?: boolean;
  ainaIlluminated?: boolean;
  ainaDoorOpen?: boolean;
  cafeIlluminated?: boolean;
  cafeDoorOpen?: boolean;
  adviceIlluminated?: boolean;
  adviceDoorOpen?: boolean;
  showRustleBehindTree?: boolean;
}

const LANTERN_POSITIONS: Array<{ x: number; y: number }> = [
  { x: 112, y: 312 },
  { x: 318, y: 266 },
  { x: 598, y: 274 },
  { x: 874, y: 292 },
  { x: 326, y: 446 },
  { x: 644, y: 454 },
  { x: 750, y: 448 },
  { x: 874, y: 462 },
];

const MEADOW_WILDFLOWERS: Array<{ x: number; y: number; c1: string; c2: string }> = [
  { x: 146, y: 396, c1: '#F472B6', c2: '#FEF08A' },
  { x: 196, y: 458, c1: '#FBBF24', c2: '#FFFFFF' },
  { x: 244, y: 358, c1: '#A78BFA', c2: '#FEF08A' },
  { x: 516, y: 398, c1: '#FB7185', c2: '#FEF08A' },
  { x: 552, y: 356, c1: '#38BDF8', c2: '#FFFFFF' },
  { x: 794, y: 382, c1: '#F472B6', c2: '#FEF08A' },
  { x: 618, y: 516, c1: '#FBBF24', c2: '#FFFFFF' },
  { x: 428, y: 526, c1: '#F472B6', c2: '#FFFFFF' },
  { x: 896, y: 526, c1: '#A78BFA', c2: '#FEF08A' },
  { x: 1094, y: 470, c1: '#FB7185', c2: '#FEF08A' },
];

export const TownMapScene: React.FC<TownMapSceneProps> = ({
  highlightPathway = false,
  hqIlluminated = false,
  hqDoorOpen = false,
  redFlagIlluminated = false,
  redFlagDoorOpen = false,
  ainaIlluminated = false,
  ainaDoorOpen = false,
  cafeIlluminated = false,
  cafeDoorOpen = false,
  adviceIlluminated = false,
  adviceDoorOpen = false,
  showRustleBehindTree = false,
}) => {
  return (
    <svg
      viewBox="0 0 1200 572"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      aria-hidden="true"
    >
      <defs>
        {/* Luminous Frutiger Aero Sky */}
        <linearGradient id="tm-sky" x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0%" stopColor="#005EDB" />
          <stop offset="32%" stopColor="#0FA4FF" />
          <stop offset="68%" stopColor="#5BE2FF" />
          <stop offset="100%" stopColor="#D7FAFF" />
        </linearGradient>

        {/* Sunlit Horizon Haze */}
        <linearGradient id="tm-horizon-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0F9FF" stopOpacity="0" />
          <stop offset="65%" stopColor="#E0F9FF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.72" />
        </linearGradient>

        {/* Golden Sun Corona & Core */}
        <radialGradient id="tm-sun-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="28%" stopColor="#FEF08A" stopOpacity="0.88" />
          <stop offset="62%" stopColor="#FDE047" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tm-sun-core" cx="42%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#FEF9C3" />
          <stop offset="100%" stopColor="#FACC15" />
        </radialGradient>

        {/* Translucent Aero Digital Globe */}
        <radialGradient id="tm-globe" cx="34%" cy="28%" r="68%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.96" />
          <stop offset="28%" stopColor="#A5F3FC" stopOpacity="0.86" />
          <stop offset="68%" stopColor="#0EA5E9" stopOpacity="0.74" />
          <stop offset="100%" stopColor="#0369A1" stopOpacity="0.88" />
        </radialGradient>
        <linearGradient id="tm-city-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
          <stop offset="48%" stopColor="#7DD3FC" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.55" />
        </linearGradient>

        {/* Atmospheric Layered Hills & Lush Meadow */}
        <linearGradient id="tm-hill-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="55%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="tm-hill-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A3E635" />
          <stop offset="40%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
        <linearGradient id="tm-meadow-main" x1="0.1" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor="#BEF264" />
          <stop offset="26%" stopColor="#4ADE80" />
          <stop offset="68%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
        <radialGradient id="tm-meadow-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.34" />
          <stop offset="55%" stopColor="#BEF264" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
        </radialGradient>

        {/* Crystal Turquoise Stream */}
        <linearGradient id="tm-stream" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="35%" stopColor="#06B6D4" />
          <stop offset="72%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id="tm-stream-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.72" />
          <stop offset="42%" stopColor="#A5F3FC" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.68" />
        </linearGradient>

        {/* Warm Cobblestone Road */}
        <linearGradient id="tm-road-curb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="tm-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="55%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Warm Lantern & Window Glows */}
        <radialGradient id="tm-lantern-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#FDE047" stopOpacity="0.58" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tm-win-warm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="55%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <linearGradient id="tm-win-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0F9FF" />
          <stop offset="55%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Building Gradients (Glossy 3D Shading) */}
        <linearGradient id="tm-hq-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="48%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="tm-hq-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id="tm-redflag-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDA4AF" />
          <stop offset="45%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
        <linearGradient id="tm-redflag-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF5F5" />
          <stop offset="100%" stopColor="#FECDD3" />
        </linearGradient>
        <linearGradient id="tm-aina-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0ABFC" />
          <stop offset="48%" stopColor="#C026D3" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
        <linearGradient id="tm-aina-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDF4FF" />
          <stop offset="100%" stopColor="#E9D5FF" />
        </linearGradient>
        <linearGradient id="tm-cafe-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        <linearGradient id="tm-cafe-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FED7AA" />
        </linearGradient>
        <linearGradient id="tm-advice-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#99F6E4" />
          <stop offset="50%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
        <linearGradient id="tm-advice-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0FDFA" />
          <stop offset="100%" stopColor="#CCFBF1" />
        </linearGradient>
        <linearGradient id="tm-arcade-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D8B4FE" />
          <stop offset="50%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id="tm-arcade-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <radialGradient id="tm-dome-glass" cx="32%" cy="24%" r="76%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.94" />
          <stop offset="32%" stopColor="#A5F3FC" stopOpacity="0.72" />
          <stop offset="72%" stopColor="#22D3EE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0D9488" stopOpacity="0.72" />
        </radialGradient>

        {/* Lush Sunlit Tree Canopy */}
        <radialGradient id="tm-tree-leaf" cx="32%" cy="24%" r="72%">
          <stop offset="0%" stopColor="#ECFCCB" />
          <stop offset="36%" stopColor="#84CC16" />
          <stop offset="74%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#14532D" />
        </radialGradient>
        <linearGradient id="tm-tree-trunk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="55%" stopColor="#92400E" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        {/* Tropical Hibiscus Petal Gradient */}
        <radialGradient id="tm-hibiscus" cx="40%" cy="35%" r="68%">
          <stop offset="0%" stopColor="#FBCFE8" />
          <stop offset="48%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#DB2777" />
        </radialGradient>

        {/* Soft Ambient Drop Shadows */}
        <filter id="tm-soft-shadow" x="-16%" y="-16%" width="132%" height="145%">
          <feDropShadow dx="0" dy="7" stdDeviation="5.5" floodColor="#0C4A6E" floodOpacity="0.24" />
        </filter>
        <filter id="tm-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ==================== 1. LUMINOUS SKY & HORIZON ==================== */}
      <rect width="1200" height="315" fill="url(#tm-sky)" />
      <rect y="120" width="1200" height="140" fill="url(#tm-horizon-mist)" />

      {/* Distant Misty Cyan Mountain Range */}
      <path
        d="M0,185 Q120,136 260,174 Q420,130 570,168 Q710,138 860,172 Q990,144 1110,168 L1200,152 L1200,240 L0,240 Z"
        fill="#7DD3FC"
        opacity="0.42"
      />

      {/* Distant Futuristic Frutiger Aero Glass City & Lake Reflection (Right Horizon) */}
      <g opacity="0.72">
        {/* Lake shimmer beneath skyline */}
        <ellipse cx="1095" cy="186" rx="108" ry="12" fill="#E0F2FE" opacity="0.55" />
        <g fill="url(#tm-city-glass)" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.65">
          <rect x="1028" y="132" width="13" height="54" rx="2" />
          <rect x="1044" y="112" width="16" height="74" rx="2" />
          <polygon points="1052,90 1056,112 1048,112" />
          <rect x="1064" y="122" width="14" height="64" rx="2" />
          <rect x="1082" y="96" width="20" height="90" rx="3" />
          <line x1="1092" y1="74" x2="1092" y2="96" stroke="#FFFFFF" strokeWidth="1.6" />
          <rect x="1106" y="114" width="16" height="72" rx="2" />
          <rect x="1126" y="128" width="15" height="58" rx="2" />
          <rect x="1145" y="138" width="14" height="48" rx="2" />
        </g>
      </g>

      {/* Luminous Translucent Frutiger Aero Digital Globe (Upper Left) */}
      <g transform="translate(178, 114)">
        {/* Outer atmospheric aura */}
        <circle cx="0" cy="0" r="82" fill="#A5F3FC" opacity="0.2" />
        <circle cx="0" cy="0" r="66" fill="url(#tm-globe)" stroke="#FFFFFF" strokeWidth="2.2" strokeOpacity="0.88" />
        {/* Soft translucent continent shapes */}
        <path
          d="M-36,-18 Q-20,-34 -2,-26 Q10,-16 2,2 Q-12,18 -30,10 Q-44,0 -36,-18 Z"
          fill="#6EE7B7"
          opacity="0.34"
        />
        <path
          d="M14,-34 Q36,-30 44,-8 Q38,14 22,22 Q12,10 18,-6 Q8,-18 14,-34 Z"
          fill="#A7F3D0"
          opacity="0.3"
        />
        {/* Globe grid meridians & parallels */}
        <ellipse cx="0" cy="0" rx="66" ry="20" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.48" />
        <ellipse cx="0" cy="0" rx="66" ry="44" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.34" />
        <ellipse cx="0" cy="0" rx="28" ry="66" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.45" />
        <line x1="0" y1="-66" x2="0" y2="66" stroke="#FFFFFF" strokeWidth="1.1" opacity="0.42" />
        {/* Animated Orbital Light Rings */}
        <g className="animate-globe-orbit">
          <ellipse
            cx="0"
            cy="2"
            rx="90"
            ry="19"
            fill="none"
            stroke="#E0F9FF"
            strokeWidth="2.4"
            opacity="0.82"
          />
          <circle cx="88" cy="-1" r="4" fill="#FFFFFF" filter="url(#tm-soft-glow)" />
          <circle cx="-86" cy="6" r="3" fill="#FEF08A" />
        </g>
        <ellipse
          cx="0"
          cy="2"
          rx="78"
          ry="14"
          transform="rotate(11)"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          opacity="0.52"
        />
        {/* Glossy Glass Specular Highlight */}
        <ellipse cx="-22" cy="-28" rx="23" ry="12" transform="rotate(-24 -22 -28)" fill="#FFFFFF" opacity="0.62" />
      </g>

      {/* Golden Sunburst & Volumetric Sunbeams (Upper Right) */}
      <g>
        <g className="animate-sun-pulse" style={{ transformOrigin: '1086px 66px' }}>
          <circle cx="1086" cy="66" r="118" fill="url(#tm-sun-halo)" />
        </g>
        <g className="animate-sun-rays" style={{ transformOrigin: '1086px 66px' }} opacity="0.28">
          <polygon points="1086,66 840,178 892,220" fill="#FFFBEB" />
          <polygon points="1086,66 968,248 1024,264" fill="#FFFBEB" />
          <polygon points="1086,66 810,74 824,116" fill="#FFFBEB" />
          <polygon points="1086,66 1196,214 1142,242" fill="#FFFBEB" />
        </g>
        <circle cx="1086" cy="66" r="34" fill="url(#tm-sun-core)" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.85" />
      </g>

      {/* Volumetric Drifting Fluffy Clouds */}
      <g className="animate-cloud-slow" opacity="0.95">
        <g transform="translate(320, 62)">
          <ellipse cx="0" cy="10" rx="58" ry="16" fill="#DBEAFE" opacity="0.55" />
          <ellipse cx="0" cy="6" rx="56" ry="18" fill="#FFFFFF" />
          <circle cx="-24" cy="-4" r="20" fill="#FFFFFF" />
          <circle cx="4" cy="-12" r="26" fill="#FFFFFF" />
          <circle cx="30" cy="-2" r="18" fill="#FFFFFF" />
        </g>
        <g transform="translate(758, 48)" opacity="0.92">
          <ellipse cx="0" cy="11" rx="68" ry="17" fill="#DBEAFE" opacity="0.5" />
          <ellipse cx="0" cy="6" rx="66" ry="19" fill="#FFFFFF" />
          <circle cx="-28" cy="-4" r="22" fill="#FFFFFF" />
          <circle cx="4" cy="-12" r="27" fill="#FFFFFF" />
          <circle cx="34" cy="-3" r="20" fill="#FFFFFF" />
        </g>
      </g>
      <g className="animate-cloud-wide" opacity="0.88">
        <g transform="translate(534, 96)">
          <ellipse cx="0" cy="8" rx="48" ry="14" fill="#E0F2FE" opacity="0.55" />
          <ellipse cx="0" cy="4" rx="48" ry="15" fill="#FFFFFF" />
          <circle cx="-18" cy="-5" r="17" fill="#FFFFFF" />
          <circle cx="6" cy="-10" r="21" fill="#FFFFFF" />
          <circle cx="28" cy="-3" r="15" fill="#FFFFFF" />
        </g>
        <g transform="translate(966, 110)">
          <ellipse cx="0" cy="8" rx="56" ry="15" fill="#E0F2FE" opacity="0.5" />
          <ellipse cx="0" cy="4" rx="56" ry="16" fill="#FFFFFF" />
          <circle cx="-24" cy="-5" r="18" fill="#FFFFFF" />
          <circle cx="4" cy="-11" r="22" fill="#FFFFFF" />
          <circle cx="30" cy="-3" r="16" fill="#FFFFFF" />
        </g>
      </g>

      {/* Glossy Rising Frutiger Aero Bubbles in Sky */}
      <g className="animate-bubble-rise" opacity="0.7">
        <circle cx="88" cy="134" r="12" fill="rgba(255,255,255,0.22)" stroke="#FFFFFF" strokeWidth="1.6" />
        <ellipse cx="84" cy="129" rx="4" ry="2.2" transform="rotate(-30 84 129)" fill="#FFFFFF" />
        <circle cx="634" cy="124" r="9.5" fill="rgba(255,255,255,0.24)" stroke="#FFFFFF" strokeWidth="1.4" />
        <circle cx="631" cy="120" r="2.5" fill="#FFFFFF" />
        <circle cx="886" cy="142" r="11" fill="rgba(255,255,255,0.2)" stroke="#FFFFFF" strokeWidth="1.4" />
        <circle cx="882" cy="138" r="3" fill="#FFFFFF" />
      </g>

      {/* ==================== 2. LAYERED ROLLING HILLS & MEADOW ==================== */}
      {/* Far Emerald Rolling Hills */}
      <path
        d="M0,186 Q155,134 345,174 Q525,126 705,168 Q890,134 1070,172 Q1145,152 1200,168 L1200,320 L0,320 Z"
        fill="url(#tm-hill-far)"
      />
      {/* Soft distant trees along hillcrest */}
      <g fill="#15803D" opacity="0.55">
        <circle cx="86" cy="166" r="12" />
        <circle cx="102" cy="168" r="10" />
        <circle cx="514" cy="146" r="11" />
        <circle cx="530" cy="148" r="9" />
        <circle cx="922" cy="154" r="12" />
        <circle cx="940" cy="156" r="9" />
      </g>

      {/* Mid Sunlit Lime-Emerald Hills */}
      <path
        d="M0,218 Q210,164 420,204 Q620,164 835,198 Q1030,164 1200,204 L1200,340 L0,340 Z"
        fill="url(#tm-hill-mid)"
      />
      {/* Sunlit Crest Rim Highlight */}
      <path
        d="M0,218 Q210,164 420,204 Q620,164 835,198 Q1030,164 1200,204"
        fill="none"
        stroke="#D9F99D"
        strokeWidth="3"
        opacity="0.52"
      />

      {/* Main Town Meadow */}
      <path
        d="M0,235 Q300,206 600,224 Q900,204 1200,232 L1200,572 L0,572 Z"
        fill="url(#tm-meadow-main)"
      />

      {/* Warm Sunlit Dappled Meadow Patches */}
      <ellipse cx="520" cy="365" rx="360" ry="96" fill="url(#tm-meadow-glow)" />
      <ellipse cx="220" cy="480" rx="240" ry="78" fill="url(#tm-meadow-glow)" />
      <ellipse cx="965" cy="488" rx="190" ry="62" fill="url(#tm-meadow-glow)" />

      {/* Meadow Grass Tufts */}
      <g stroke="#15803D" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.34">
        <path d="M168,388 Q164,378 160,376 M168,388 Q170,376 175,375" />
        <path d="M292,438 Q288,428 284,426 M292,438 Q294,426 299,425" />
        <path d="M488,332 Q484,322 480,320 M488,332 Q490,320 495,319" />
        <path d="M582,420 Q578,410 574,408 M582,420 Q584,408 589,407" />
        <path d="M842,350 Q838,340 834,338 M842,350 Q844,338 849,337" />
        <path d="M446,542 Q442,532 438,530 M446,542 Q448,530 453,529" />
      </g>

      {/* Scattered Meadow Wildflowers */}
      {MEADOW_WILDFLOWERS.map((fl, i) => (
        <g key={`wf-${i}`} transform={`translate(${fl.x}, ${fl.y})`}>
          <circle cx="-4" cy="-2" r="3.4" fill={fl.c1} />
          <circle cx="4" cy="-2" r="3.4" fill={fl.c1} />
          <circle cx="-2.5" cy="3.2" r="3.4" fill={fl.c1} />
          <circle cx="2.5" cy="3.2" r="3.4" fill={fl.c1} />
          <circle cx="0" cy="0" r="2.5" fill={fl.c2} />
        </g>
      ))}

      {/* ==================== 3. CRYSTAL TURQUOISE STREAM & AQUATIC LIFE ==================== */}
      {/* Lush Riverbank Grass Border & Shadow */}
      <path
        d="M1210,308 C1068,326 982,372 912,410 C840,448 780,480 700,578 L802,578 C874,500 936,460 1022,420 C1090,388 1152,368 1210,360 Z"
        fill="#0F766E"
        opacity="0.32"
      />
      {/* Main Stream Body */}
      <path
        d="M1210,316 C1074,334 990,378 920,415 C846,454 786,486 710,578 L790,578 C862,500 926,460 1014,418 C1084,386 1148,365 1210,356 Z"
        fill="url(#tm-stream)"
        stroke="#CFFAFE"
        strokeWidth="3.5"
      />
      {/* Stream Specular Sky Sheen */}
      <path
        d="M1200,328 C1078,346 1002,388 932,425 C864,460 806,494 734,574 L768,574 C836,498 896,464 972,426 C1042,392 1116,362 1200,345 Z"
        fill="url(#tm-stream-sheen)"
      />

      {/* Animated Flowing Water Ribbons & Sparkles */}
      <g className="animate-stream-shimmer" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M1118,344 Q1088,358 1058,368" />
        <path d="M1022,388 Q994,404 964,418" />
        <path d="M902,446 Q878,462 854,478" />
        <path d="M842,490 Q818,506 794,524" />
        <path d="M776,540 Q758,556 740,570" />
        <circle cx="1090" cy="356" r="2.2" fill="#FFFFFF" stroke="none" />
        <circle cx="988" cy="404" r="2.4" fill="#FFFFFF" stroke="none" />
        <circle cx="818" cy="508" r="2.2" fill="#FFFFFF" stroke="none" />
      </g>

      {/* Lily Pads & Layered Pink Lotus in Stream */}
      <g transform="translate(836, 530)">
        <ellipse cx="0" cy="2" rx="24" ry="10" fill="#0369A1" opacity="0.28" />
        <ellipse cx="0" cy="0" rx="22" ry="9" fill="#22C55E" stroke="#15803D" strokeWidth="1.4" />
        <path d="M0,0 L20,-4 L16,5 Z" fill="#06B6D4" />
        <g transform="translate(-3, -6)">
          <ellipse cx="-8" cy="2" rx="7.5" ry="4.5" fill="#F472B6" />
          <ellipse cx="8" cy="2" rx="7.5" ry="4.5" fill="#F472B6" />
          <ellipse cx="-4" cy="-2" rx="6" ry="6.5" fill="#F9A8D4" />
          <ellipse cx="4" cy="-2" rx="6" ry="6.5" fill="#F9A8D4" />
          <ellipse cx="0" cy="-1" rx="5.5" ry="7" fill="#FCE7F3" />
          <circle cx="0" cy="1" r="2.6" fill="#FDE047" />
        </g>
      </g>
      <g transform="translate(1078, 366)">
        <ellipse cx="0" cy="0" rx="16" ry="6.5" fill="#4ADE80" stroke="#15803D" strokeWidth="1.2" />
        <circle cx="-2" cy="-2" r="3" fill="#F9A8D4" />
      </g>

      {/* Smoothly Swimming Colorful Tropical Fish */}
      <g className="animate-fish-right">
        <g transform="translate(768, 528)">
          <ellipse cx="0" cy="0" rx="9" ry="5.2" fill="#FB923C" stroke="#FFFFFF" strokeWidth="1.3" />
          <polygon points="-8.5,0 -16,-5 -16,5" fill="#F97316" />
          <line x1="-1" y1="-4.6" x2="-1" y2="4.6" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="4" cy="-1" r="1.3" fill="#0F172A" />
        </g>
      </g>
      <g className="animate-fish-left">
        <g transform="translate(1042, 392)">
          <ellipse cx="0" cy="0" rx="8.5" ry="4.8" fill="#FACC15" stroke="#FFFFFF" strokeWidth="1.2" />
          <polygon points="-7.5,0 -14,-4.5 -14,4.5" fill="#38BDF8" />
          <circle cx="3.6" cy="-1" r="1.2" fill="#0F172A" />
        </g>
      </g>

      {/* ==================== 4. COBBLESTONE PATHWAY NETWORK & PLAZA ==================== */}
      {/* Soft Path Ambient Shadow */}
      <g stroke="#14532D" strokeWidth="42" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.22">
        {WALKABLE_SEGMENTS.map(([aId, bId]) => {
          const a = TOWN_PATH_NODES[aId];
          const b = TOWN_PATH_NODES[bId];
          return (
            <line
              key={`shadow-${aId}-${bId}`}
              x1={(a.x / 100) * 1200}
              y1={(a.y / 100) * 572 + 4}
              x2={(b.x / 100) * 1200}
              y2={(b.y / 100) * 572 + 4}
            />
          );
        })}
      </g>
      {/* Sandstone Curb Border */}
      <g stroke="url(#tm-road-curb)" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.72">
        {WALKABLE_SEGMENTS.map(([aId, bId]) => {
          const a = TOWN_PATH_NODES[aId];
          const b = TOWN_PATH_NODES[bId];
          return (
            <line
              key={`curb-${aId}-${bId}`}
              x1={(a.x / 100) * 1200}
              y1={(a.y / 100) * 572}
              x2={(b.x / 100) * 1200}
              y2={(b.y / 100) * 572}
            />
          );
        })}
      </g>
      {/* Warm Golden Sandstone Surface */}
      <g stroke="url(#tm-road)" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {WALKABLE_SEGMENTS.map(([aId, bId]) => {
          const a = TOWN_PATH_NODES[aId];
          const b = TOWN_PATH_NODES[bId];
          return (
            <line
              key={`road-${aId}-${bId}`}
              x1={(a.x / 100) * 1200}
              y1={(a.y / 100) * 572}
              x2={(b.x / 100) * 1200}
              y2={(b.y / 100) * 572}
            />
          );
        })}
      </g>
      {/* Cobblestone Center Highlight & Subtle Mortar Joints */}
      <g stroke="#FEF3C7" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.82">
        {WALKABLE_SEGMENTS.map(([aId, bId]) => {
          const a = TOWN_PATH_NODES[aId];
          const b = TOWN_PATH_NODES[bId];
          return (
            <line
              key={`inner-${aId}-${bId}`}
              x1={(a.x / 100) * 1200}
              y1={(a.y / 100) * 572}
              x2={(b.x / 100) * 1200}
              y2={(b.y / 100) * 572}
            />
          );
        })}
      </g>
      <g stroke="#D97706" strokeWidth="14" strokeDasharray="3 18" strokeLinecap="round" fill="none" opacity="0.22">
        {WALKABLE_SEGMENTS.map(([aId, bId]) => {
          const a = TOWN_PATH_NODES[aId];
          const b = TOWN_PATH_NODES[bId];
          return (
            <line
              key={`cobble-${aId}-${bId}`}
              x1={(a.x / 100) * 1200}
              y1={(a.y / 100) * 572}
              x2={(b.x / 100) * 1200}
              y2={(b.y / 100) * 572}
            />
          );
        })}
      </g>

      {/* Cobblestone Plaza Center Mosaic at (45%, 84.5%) => (540, 483) */}
      <g transform="translate(540, 486)">
        <ellipse cx="0" cy="4" rx="76" ry="31" fill="#14532D" opacity="0.24" />
        <ellipse cx="0" cy="0" rx="74" ry="29" fill="#FDE68A" stroke="#B45309" strokeWidth="3" />
        <ellipse cx="0" cy="-2" rx="58" ry="22" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.2" strokeDasharray="10 6" />
        <ellipse cx="0" cy="-2" rx="34" ry="12" fill="#FFFBEB" stroke="#FBBF24" strokeWidth="1.6" />
        {/* Stepping stones on lower edge */}
        <ellipse cx="-26" cy="5" rx="11" ry="5" fill="#FDBA74" opacity="0.65" />
        <ellipse cx="24" cy="-6" rx="11" ry="5" fill="#FDBA74" opacity="0.65" />
        <ellipse cx="4" cy="9" rx="10" ry="4.5" fill="#FDBA74" opacity="0.65" />
      </g>

      {/* Foreground Stepping Stones Circle at Bottom Center */}
      <g transform="translate(520, 548)" opacity="0.88">
        <ellipse cx="-32" cy="4" rx="18" ry="8" fill="#E7E5E4" stroke="#78716C" strokeWidth="1.6" />
        <ellipse cx="4" cy="-3" rx="22" ry="9" fill="#F5F5F4" stroke="#78716C" strokeWidth="1.6" />
        <ellipse cx="38" cy="5" rx="16" ry="7" fill="#E7E5E4" stroke="#78716C" strokeWidth="1.6" />
      </g>

      {/* Arched Stone Bridge over the Stream between bridge-west & bridge-east */}
      <g transform="translate(810, 467)">
        {/* Bridge Water Shadow */}
        <path d="M-56,16 Q0,-8 56,16 L56,30 Q0,6 -56,30 Z" fill="#0369A1" opacity="0.38" />
        {/* Stone Arch Face */}
        <path
          d="M-58,8 Q0,-18 58,8 L55,23 Q0,-3 -55,23 Z"
          fill="#FDE68A"
          stroke="#92400E"
          strokeWidth="2.4"
        />
        {/* Parapet Railings & Lantern Posts */}
        <path d="M-54,-4 Q0,-28 54,-4" fill="none" stroke="#FEF3C7" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M-54,-4 Q0,-28 54,-4" fill="none" stroke="#B45309" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="-58" y="-15" width="12" height="23" rx="3" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.8" />
        <rect x="46" y="-15" width="12" height="23" rx="3" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.8" />
        <rect x="-5" y="-23" width="10" height="16" rx="3" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.8" />
        {/* Warm Glowing Lanterns on Bridge Ends */}
        <circle cx="-52" cy="-21" r="14" fill="url(#tm-lantern-halo)" className="animate-lantern-glow" />
        <circle cx="-52" cy="-21" r="4.5" fill="#FEF08A" stroke="#D97706" strokeWidth="1.2" />
        <circle cx="52" cy="-21" r="14" fill="url(#tm-lantern-halo)" className="animate-lantern-glow" />
        <circle cx="52" cy="-21" r="4.5" fill="#FEF08A" stroke="#D97706" strokeWidth="1.2" />
      </g>

      {/* Pathway Tutorial Highlight Overlay (Scene 11) */}
      {highlightPathway && (
        <g strokeLinecap="round" strokeLinejoin="round">
          {WALKABLE_SEGMENTS.map(([aId, bId]) => {
            const a = TOWN_PATH_NODES[aId];
            const b = TOWN_PATH_NODES[bId];
            return (
              <line
                key={`glow-${aId}-${bId}`}
                x1={(a.x / 100) * 1200}
                y1={(a.y / 100) * 572}
                x2={(b.x / 100) * 1200}
                y2={(b.y / 100) * 572}
                stroke="#FEF08A"
                strokeWidth="22"
                strokeDasharray="12 10"
                opacity="0.78"
              />
            );
          })}
        </g>
      )}

      {/* ==================== 5. WARM GARDEN LANTERN POSTS ==================== */}
      {LANTERN_POSITIONS.map((lp, idx) => (
        <g key={`lantern-${idx}`} transform={`translate(${lp.x}, ${lp.y})`}>
          <ellipse cx="0" cy="14" rx="8" ry="3" fill="#14532D" opacity="0.3" />
          <line x1="0" y1="14" x2="0" y2="-10" stroke="#78350F" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="0" cy="-14" r="15" fill="url(#tm-lantern-halo)" className="animate-lantern-glow" />
          <rect x="-4.5" y="-19" width="9" height="10" rx="2.5" fill="#FEF9C3" stroke="#92400E" strokeWidth="1.5" />
          <polygon points="-6,-19 0,-24 6,-19" fill="#92400E" />
        </g>
      ))}

      {/* ==================== 6. LUSH SHADE TREES ==================== */}
      {[
        { x: 54, y: 230, scale: 1.05 },
        { x: 306, y: 212, scale: 0.85 },
        { x: 598, y: 204, scale: 0.82 },
        { x: 868, y: 214, scale: 0.82 },
        { x: 1150, y: 232, scale: 1.04 },
      ].map((tree, idx) => (
        <g key={`tree-${idx}`} transform={`translate(${tree.x}, ${tree.y}) scale(${tree.scale})`}>
          <ellipse cx="0" cy="86" rx="34" ry="9" fill="#14532D" opacity="0.28" />
          <path d="M-9,84 L-7,34 L7,34 L9,84 Z" fill="url(#tm-tree-trunk)" stroke="#451A03" strokeWidth="1.8" />
          <circle cx="-18" cy="18" r="27" fill="url(#tm-tree-leaf)" />
          <circle cx="18" cy="20" r="26" fill="url(#tm-tree-leaf)" />
          <circle cx="0" cy="-4" r="31" fill="url(#tm-tree-leaf)" />
          <ellipse cx="-9" cy="-16" rx="11" ry="6" fill="#ECFCCB" opacity="0.48" />
        </g>
      ))}

      {/* ==================== 7. ALL SEVEN STORYBOOK BUILDINGS ==================== */}

      {/* 1. DETECTIVE HQ — (16.5%, 44.5%) => (198, 252) */}
      <g transform="translate(198, 252)" filter="url(#tm-soft-shadow)">
        {hqIlluminated && (
          <ellipse cx="0" cy="4" rx="112" ry="84" fill="#FEF08A" opacity="0.46" />
        )}
        <ellipse cx="0" cy="52" rx="86" ry="18" fill="#14532D" opacity="0.3" />
        {/* Flowering Hedges */}
        <circle cx="-68" cy="41" r="16" fill="#22C55E" />
        <circle cx="-62" cy="36" r="10" fill="#84CC16" />
        <circle cx="68" cy="41" r="16" fill="#22C55E" />
        <circle cx="62" cy="36" r="10" fill="#84CC16" />
        <circle cx="-70" cy="40" r="3" fill="#FDE047" />
        <circle cx="70" cy="40" r="3" fill="#F472B6" />

        {/* Walls & Trim */}
        <rect x="-64" y="-8" width="128" height="60" rx="12" fill="url(#tm-hq-wall)" stroke="#1E40AF" strokeWidth="2.4" />
        <rect x="-64" y="42" width="128" height="10" rx="4" fill="#BFDBFE" opacity="0.7" />
        {/* Striped Sapphire Awning Roof */}
        <path
          d="M-78,-4 L-58,-44 L58,-44 L78,-4 Z"
          fill="url(#tm-hq-roof)"
          stroke="#1E3A8A"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <line x1="-26" y1="-44" x2="-34" y2="-4" stroke="#E0F2FE" strokeWidth="7" opacity="0.45" />
        <line x1="0" y1="-44" x2="0" y2="-4" stroke="#E0F2FE" strokeWidth="7" opacity="0.45" />
        <line x1="26" y1="-44" x2="34" y2="-4" stroke="#E0F2FE" strokeWidth="7" opacity="0.45" />
        <path d="M-74,-6 L74,-6" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.5" />

        {/* Gleaming Golden Magnifying Glass Rooftop Monument */}
        <g transform="translate(0, -56)">
          <line x1="-15" y1="15" x2="-31" y2="31" stroke="#92400E" strokeWidth="8.5" strokeLinecap="round" />
          <circle cx="0" cy="0" r="23" fill="#BAE6FD" stroke="#F59E0B" strokeWidth="6" />
          <circle cx="0" cy="0" r="17" fill="#E0F2FE" opacity="0.55" />
          <ellipse cx="-6" cy="-7" rx="8" ry="4.5" transform="rotate(-30 -6 -7)" fill="#FFFFFF" opacity="0.88" />
        </g>

        {/* Warm Glowing Mullioned Windows */}
        <rect x="-50" y="9" width="25" height="23" rx="6" fill="url(#tm-win-warm)" stroke="#0284C7" strokeWidth="2.2" />
        <line x1="-37.5" y1="9" x2="-37.5" y2="32" stroke="#0284C7" strokeWidth="1.5" opacity="0.65" />
        <line x1="-50" y1="20.5" x2="-25" y2="20.5" stroke="#0284C7" strokeWidth="1.5" opacity="0.65" />

        <rect x="25" y="9" width="25" height="23" rx="6" fill="url(#tm-win-warm)" stroke="#0284C7" strokeWidth="2.2" />
        <line x1="37.5" y1="9" x2="37.5" y2="32" stroke="#0284C7" strokeWidth="1.5" opacity="0.65" />
        <line x1="25" y1="20.5" x2="50" y2="20.5" stroke="#0284C7" strokeWidth="1.5" opacity="0.65" />

        {/* Detective Shield */}
        <polygon points="0,-16 12,-11 9.5,2 0,9 -9.5,2 -12,-11" fill="#2563EB" stroke="#FACC15" strokeWidth="2.4" />
        <polygon points="0,-11 2,-6 7,-6 3,-3 4.5,2 0,-1 -4.5,2 -3,-3 -7,-6 -2,-6" fill="#FEF08A" />

        {/* Arched Double Doors */}
        <path
          d="M-16,52 L-16,24 A16,16 0 0,1 16,24 L16,52 Z"
          fill={hqDoorOpen ? '#FEF08A' : '#0284C7'}
          stroke="#1E3A8A"
          strokeWidth="2.4"
        />
        {!hqDoorOpen && (
          <>
            <line x1="0" y1="9" x2="0" y2="52" stroke="#1E3A8A" strokeWidth="2" />
            <circle cx="-4" cy="34" r="2" fill="#FDE047" />
            <circle cx="4" cy="34" r="2" fill="#FDE047" />
          </>
        )}

        {/* Crisp Nameplate */}
        <rect x="-56" y="49" width="112" height="22" rx="11" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.2" />
        <text x="0" y="64" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#0F4C81">
          Detective HQ
        </text>
      </g>

      {/* 2. RED FLAG CENTRE — (38.2%, 39%) => (458, 220) */}
      <g transform="translate(458, 220)" filter="url(#tm-soft-shadow)">
        {redFlagIlluminated && (
          <ellipse cx="0" cy="4" rx="108" ry="78" fill="#FEF08A" opacity="0.52" />
        )}
        <ellipse cx="0" cy="46" rx="76" ry="15" fill="#14532D" opacity="0.28" />
        <circle cx="-62" cy="36" r="14" fill="#22C55E" />
        <circle cx="62" cy="36" r="14" fill="#22C55E" />

        <rect x="-58" y="-6" width="116" height="52" rx="10" fill="url(#tm-redflag-wall)" stroke="#9F1239" strokeWidth="2.4" />
        <polygon points="-72,-4 0,-48 72,-4" fill="url(#tm-redflag-roof)" stroke="#9F1239" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M-66,-6 L0,-44 L66,-6" fill="none" stroke="#FFE4E6" strokeWidth="2" opacity="0.55" />

        {/* Animated Waving Red Flags */}
        <g transform="translate(-26, -34)">
          <line x1="0" y1="0" x2="0" y2="-28" stroke="#7F1D1D" strokeWidth="2.8" strokeLinecap="round" />
          <g className="animate-flag-wave">
            <polygon points="1,-28 28,-21 1,-14" fill="#EF4444" stroke="#991B1B" strokeWidth="1.2" />
          </g>
        </g>
        <g transform="translate(26, -34)">
          <line x1="0" y1="0" x2="0" y2="-28" stroke="#7F1D1D" strokeWidth="2.8" strokeLinecap="round" />
          <g className="animate-flag-wave" style={{ animationDelay: '0.5s' }}>
            <polygon points="1,-28 28,-21 1,-14" fill="#EF4444" stroke="#991B1B" strokeWidth="1.2" />
          </g>
        </g>

        {/* Warning Triangle Emblem */}
        <polygon points="0,-35 16,-11 -16,-11" fill="#FEF08A" stroke="#991B1B" strokeWidth="2.2" strokeLinejoin="round" />
        <text x="0" y="-14" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#991B1B">
          !
        </text>

        <rect x="-45" y="8" width="21" height="21" rx="5" fill="url(#tm-win-sky)" stroke="#0284C7" strokeWidth="2" />
        <rect x="24" y="8" width="21" height="21" rx="5" fill="url(#tm-win-sky)" stroke="#0284C7" strokeWidth="2" />
        <path
          d="M-14,46 L-14,20 A14,14 0 0,1 14,20 L14,46 Z"
          fill={redFlagDoorOpen ? '#FEF08A' : '#F43F5E'}
          stroke="#881337"
          strokeWidth="2.2"
        />
        {!redFlagDoorOpen && <circle cx="6" cy="33" r="2" fill="#FEF08A" />}

        <rect x="-58" y="44" width="116" height="21" rx="10.5" fill="#FFFFFF" stroke="#E11D48" strokeWidth="2" />
        <text x="0" y="58.5" textAnchor="middle" fontSize="11" fontWeight="900" fill="#9F1239">
          Red Flag Centre
        </text>
      </g>

      {/* 3. AINA'S HOUSE — (61.5%, 38.5%) => (738, 218) */}
      <g transform="translate(738, 218)" filter="url(#tm-soft-shadow)">
        {ainaIlluminated && (
          <ellipse cx="0" cy="4" rx="104" ry="76" fill="#FEF08A" opacity="0.5" />
        )}
        <ellipse cx="0" cy="46" rx="76" ry="15" fill="#14532D" opacity="0.28" />
        {/* Cozy Chimney + Rising Smoke Puffs */}
        <rect x="30" y="-44" width="14" height="26" rx="3" fill="#C084FC" stroke="#6B21A8" strokeWidth="2" />
        <g className="animate-steam-1">
          <circle cx="37" cy="-54" r="5" fill="#FFFFFF" opacity="0.7" />
        </g>
        <g className="animate-steam-2">
          <circle cx="41" cy="-60" r="6.5" fill="#FFFFFF" opacity="0.55" />
        </g>

        <circle cx="-60" cy="36" r="14" fill="#22C55E" />
        <circle cx="60" cy="36" r="14" fill="#22C55E" />
        <rect x="-56" y="-4" width="112" height="50" rx="10" fill="url(#tm-aina-wall)" stroke="#6B21A8" strokeWidth="2.4" />
        <polygon points="-70,-2 0,-46 70,-2" fill="url(#tm-aina-roof)" stroke="#6B21A8" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M-64,-4 L0,-42 L64,-4" fill="none" stroke="#FAE8FF" strokeWidth="2" opacity="0.55" />

        {/* Glowing Heart Emblem */}
        <path
          d="M0,-14 C-4,-24 -16,-24 -16,-14 C-16,-6 0,2 0,2 C0,2 16,-6 16,-14 C16,-24 4,-24 0,-14 Z"
          fill="#F472B6"
          stroke="#FFFFFF"
          strokeWidth="2"
        />

        {/* Warm Windows & Flowerboxes */}
        <rect x="-44" y="8" width="21" height="20" rx="5" fill="url(#tm-win-warm)" stroke="#7E22CE" strokeWidth="2" />
        <rect x="23" y="8" width="21" height="20" rx="5" fill="url(#tm-win-warm)" stroke="#7E22CE" strokeWidth="2" />
        <rect x="-46" y="27" width="25" height="7" rx="3" fill="#EC4899" />
        <circle cx="-39" cy="26" r="2.8" fill="#FEF08A" />
        <circle cx="-31" cy="26" r="2.8" fill="#FBCFE8" />
        <rect x="21" y="27" width="25" height="7" rx="3" fill="#EC4899" />
        <circle cx="28" cy="26" r="2.8" fill="#FEF08A" />
        <circle cx="36" cy="26" r="2.8" fill="#FBCFE8" />

        <path
          d="M-12,46 L-12,20 A12,12 0 0,1 12,20 L12,46 Z"
          fill={ainaDoorOpen ? '#FEF08A' : '#A855F7'}
          stroke="#581C87"
          strokeWidth="2.2"
        />
        {!ainaDoorOpen && <circle cx="5" cy="34" r="2" fill="#FEF08A" />}

        <rect x="-52" y="44" width="104" height="21" rx="10.5" fill="#FFFFFF" stroke="#9333EA" strokeWidth="2" />
        <text x="0" y="58.5" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#6B21A8">
          Aina&apos;s House
        </text>
      </g>

      {/* 4. CYBER CAFÉ — (82.8%, 45%) => (994, 254) */}
      <g transform="translate(994, 254)" filter="url(#tm-soft-shadow)">
        {cafeIlluminated && (
          <ellipse cx="0" cy="4" rx="108" ry="80" fill="#FEF08A" opacity="0.5" />
        )}
        <ellipse cx="0" cy="48" rx="84" ry="16" fill="#14532D" opacity="0.28" />
        {/* Bistro Patio Umbrella & Table */}
        <g transform="translate(56, 26)">
          <line x1="0" y1="0" x2="0" y2="24" stroke="#78350F" strokeWidth="2.6" />
          <path d="M-25,2 Q0,-19 25,2 Z" fill="#FB7185" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M-10,1 Q0,-16 10,1 Z" fill="#FFF1F2" opacity="0.7" />
          <rect x="-12" y="14" width="24" height="5" rx="2" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.5" />
          <circle cx="-4" cy="12" r="2.5" fill="#FDE047" />
        </g>

        <rect x="-62" y="-6" width="114" height="54" rx="11" fill="url(#tm-cafe-wall)" stroke="#9A3412" strokeWidth="2.4" />
        <path d="M-74,-4 L-54,-36 L44,-36 L64,-4 Z" fill="url(#tm-cafe-roof)" stroke="#9A3412" strokeWidth="2.4" strokeLinejoin="round" />
        <line x1="-30" y1="-36" x2="-38" y2="-4" stroke="#FFFBEB" strokeWidth="8" opacity="0.75" />
        <line x1="-5" y1="-36" x2="-5" y2="-4" stroke="#FFFBEB" strokeWidth="8" opacity="0.75" />
        <line x1="20" y1="-36" x2="28" y2="-4" stroke="#FFFBEB" strokeWidth="8" opacity="0.75" />

        {/* Rooftop Glowing Laptop & Steaming Coffee Cup */}
        <g transform="translate(-5, -52)">
          <rect x="-25" y="-12" width="50" height="30" rx="5" fill="#2563EB" stroke="#1E3A8A" strokeWidth="2.2" />
          <rect x="-20" y="-8" width="40" height="22" rx="3" fill="#E0F2FE" />
          <ellipse cx="0" cy="4" rx="8.5" ry="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.6" />
          {/* Animated Steam Wisps */}
          <path d="M-4,-6 Q-7,-13 -2,-18" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" className="animate-steam-1" />
          <path d="M4,-6 Q7,-13 2,-18" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" className="animate-steam-2" />
          <path d="M-28,18 L28,18 L34,24 L-34,24 Z" fill="#CBD5E1" stroke="#475569" strokeWidth="1.8" />
        </g>

        <rect x="-46" y="10" width="22" height="22" rx="5" fill="url(#tm-win-warm)" stroke="#C2410C" strokeWidth="2" />
        <rect x="16" y="10" width="22" height="22" rx="5" fill="url(#tm-win-warm)" stroke="#C2410C" strokeWidth="2" />
        <path
          d="M-16,48 L-16,18 A13,13 0 0,1 10,18 L10,48 Z"
          fill={cafeDoorOpen ? '#FEF08A' : '#EC4899'}
          stroke="#831843"
          strokeWidth="2.2"
        />

        <rect x="-56" y="46" width="108" height="21" rx="10.5" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2" />
        <text x="-2" y="60.5" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#9A3412">
          Cyber Café
        </text>
      </g>

      {/* 5. ADVICE CENTRE — (56.5%, 64.5%) => (678, 368) */}
      <g transform="translate(678, 368)" filter="url(#tm-soft-shadow)">
        {adviceIlluminated && (
          <ellipse cx="0" cy="4" rx="108" ry="80" fill="#FEF08A" opacity="0.5" />
        )}
        <ellipse cx="0" cy="50" rx="82" ry="16" fill="#14532D" opacity="0.3" />
        <circle cx="-64" cy="40" r="14" fill="#22C55E" />
        <circle cx="64" cy="40" r="14" fill="#22C55E" />

        <rect x="-60" y="-4" width="120" height="54" rx="12" fill="url(#tm-advice-wall)" stroke="#115E59" strokeWidth="2.4" />
        <path d="M-74,-2 L-54,-38 L54,-38 L74,-2 Z" fill="url(#tm-advice-roof)" stroke="#115E59" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M-64,-5 L54,-5" stroke="#CCFBF1" strokeWidth="2" opacity="0.55" />

        {/* Speech Bubble Sign with Animated Typing Dots */}
        <g transform="translate(0, -54)">
          <rect x="-27" y="-14" width="54" height="32" rx="15" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2.8" />
          <polygon points="-6,17 4,17 -8,27" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="-11" cy="2" r="3.4" fill="#FFFFFF" className="animate-typing-dot-1" />
          <circle cx="0" cy="2" r="3.4" fill="#FFFFFF" className="animate-typing-dot-2" />
          <circle cx="11" cy="2" r="3.4" fill="#FFFFFF" className="animate-typing-dot-3" />
        </g>

        <rect x="-48" y="10" width="24" height="24" rx="5" fill="url(#tm-win-warm)" stroke="#0F766E" strokeWidth="2" />
        <rect x="24" y="10" width="24" height="24" rx="5" fill="url(#tm-win-warm)" stroke="#0F766E" strokeWidth="2" />
        <path
          d="M-15,50 L-15,20 A15,15 0 0,1 15,20 L15,50 Z"
          fill={adviceDoorOpen ? '#FEF08A' : '#2DD4BF'}
          stroke="#115E59"
          strokeWidth="2.2"
        />

        <rect x="-58" y="48" width="116" height="22" rx="11" fill="#FFFFFF" stroke="#0D9488" strokeWidth="2.2" />
        <text x="0" y="63" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#115E59">
          Advice Centre
        </text>
      </g>

      {/* 6. GAME ARCADE — (32.5%, 66.5%) => (390, 380) */}
      <g transform="translate(390, 380)" filter="url(#tm-soft-shadow)">
        <ellipse cx="0" cy="52" rx="84" ry="16" fill="#14532D" opacity="0.3" />
        <circle cx="-66" cy="42" r="14" fill="#22C55E" />
        <circle cx="66" cy="42" r="14" fill="#22C55E" />

        <rect x="-64" y="-6" width="128" height="58" rx="14" fill="url(#tm-arcade-wall)" stroke="#4C1D95" strokeWidth="2.4" />
        <path d="M-76,-4 Q0,-44 76,-4 Z" fill="url(#tm-arcade-roof)" stroke="#4C1D95" strokeWidth="2.4" />

        {/* Animated Blinking Cartoon Eyes on Roof */}
        <g className="animate-arcade-blink">
          <g transform="translate(-18, -32)">
            <circle cx="0" cy="0" r="13" fill="#FFFFFF" stroke="#4C1D95" strokeWidth="2.4" />
            <circle cx="2" cy="1" r="6" fill="#2563EB" />
            <circle cx="3" cy="-1" r="2.2" fill="#FFFFFF" />
          </g>
          <g transform="translate(18, -32)">
            <circle cx="0" cy="0" r="13" fill="#FFFFFF" stroke="#4C1D95" strokeWidth="2.4" />
            <circle cx="-2" cy="1" r="6" fill="#2563EB" />
            <circle cx="-1" cy="-1" r="2.2" fill="#FFFFFF" />
          </g>
        </g>

        {/* Controller Neon Marquee */}
        <rect x="-27" y="-12" width="54" height="22" rx="11" fill="#6D28D9" stroke="#FDE047" strokeWidth="2.4" />
        <circle cx="-11" cy="-1" r="4" fill="#FFFFFF" />
        <circle cx="11" cy="-1" r="4" fill="#F472B6" />
        <rect x="-6" y="-3" width="12" height="4" rx="2" fill="#FFFFFF" />

        <polygon points="-44,12 -40,20 -32,20 -38,25 -36,33 -44,28 -52,33 -50,25 -56,20 -48,20" fill="#FACC15" />
        <polygon points="44,12 48,20 56,20 50,25 52,33 44,28 36,33 38,25 32,20 40,20" fill="#FACC15" />
        <path d="M-16,52 L-16,22 A16,16 0 0,1 16,22 L16,52 Z" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2.2" />

        <rect x="-56" y="50" width="112" height="22" rx="11" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="2.2" />
        <text x="0" y="65" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#4C1D95">
          Game Arcade
        </text>
      </g>

      {/* 7. DIGITAL SAFE GARDEN — (81.5%, 73.5%) => (978, 420) */}
      <g transform="translate(978, 420)" filter="url(#tm-soft-shadow)">
        <ellipse cx="0" cy="48" rx="84" ry="16" fill="#14532D" opacity="0.3" />
        <circle cx="-64" cy="40" r="12" fill="#F472B6" stroke="#FFFFFF" strokeWidth="1.8" />
        <circle cx="64" cy="40" r="12" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="1.8" />
        <ellipse cx="-26" cy="36" rx="22" ry="11" fill="#22C55E" />
        <ellipse cx="26" cy="36" rx="22" ry="11" fill="#4ADE80" />
        <circle cx="-32" cy="30" r="4" fill="#F472B6" />
        <circle cx="30" cy="31" r="4" fill="#FDE047" />

        {/* Crystal Glass Greenhouse Dome */}
        <path
          d="M-66,44 L-66,12 A66,62 0 0,1 66,12 L66,44 Z"
          fill="url(#tm-dome-glass)"
          stroke="#FFFFFF"
          strokeWidth="3"
        />
        <path
          d="M-28,44 L-28,12 A28,62 0 0,1 0,-50 A28,62 0 0,1 28,12 L28,44"
          fill="none"
          stroke="#E0F2FE"
          strokeWidth="2"
          opacity="0.88"
        />
        <line x1="-66" y1="14" x2="66" y2="14" stroke="#E0F2FE" strokeWidth="2" opacity="0.78" />
        {/* Specular dome gleam */}
        <path d="M-48,-8 A48,46 0 0,1 -16,-36" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.7" />

        {/* Gently Swaying Sprouting Crown Leaves */}
        <g transform="translate(0, -52)" className="animate-sprout-sway">
          <path d="M0,4 C-18,-2 -24,-22 -4,-24 C6,-24 6,-6 0,4 Z" fill="#4ADE80" stroke="#15803D" strokeWidth="2" />
          <path d="M0,4 C18,-2 24,-22 4,-24 C-6,-24 -6,-6 0,4 Z" fill="#84CC16" stroke="#15803D" strokeWidth="2" />
        </g>

        <path d="M-14,44 L-14,18 A14,14 0 0,1 14,18 L14,44 Z" fill="#BBF7D0" stroke="#0D9488" strokeWidth="2.2" />

        <rect x="-68" y="42" width="136" height="22" rx="11" fill="#FFFFFF" stroke="#16A34A" strokeWidth="2.2" />
        <text x="0" y="57" textAnchor="middle" fontSize="11.2" fontWeight="900" fill="#15803D">
          Digital Safe Garden
        </text>
      </g>

      {/* ==================== 8. FOREGROUND FLORA, FIREFLIES & BUTTERFLIES ==================== */}
      {/* Rustic Wooden Garden Fence Corner (Lower Left) */}
      <g transform="translate(82, 534)" opacity="0.92">
        <rect x="0" y="-12" width="12" height="44" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="1.6" />
        <rect x="26" y="-4" width="11" height="36" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="1.6" />
        <rect x="-4" y="4" width="44" height="7" rx="3" fill="#D97706" stroke="#78350F" strokeWidth="1.4" />
      </g>

      {/* Lower-Left Tropical Hibiscus & Lush Leaves */}
      <g transform="translate(46, 515)">
        <ellipse cx="14" cy="24" rx="48" ry="24" fill="#15803D" />
        <ellipse cx="42" cy="30" rx="28" ry="14" fill="#22C55E" />
        <g className="animate-flower-sway">
          <circle cx="-12" cy="-8" r="14" fill="url(#tm-hibiscus)" />
          <circle cx="12" cy="-8" r="14" fill="url(#tm-hibiscus)" />
          <circle cx="-10" cy="12" r="14" fill="url(#tm-hibiscus)" />
          <circle cx="10" cy="12" r="14" fill="url(#tm-hibiscus)" />
          <circle cx="0" cy="-16" r="13" fill="url(#tm-hibiscus)" />
          <circle cx="0" cy="0" r="6" fill="#FDE047" />
        </g>
      </g>

      {/* Lower-Right Tropical Hibiscus & Lush Leaves */}
      <g transform="translate(1152, 520)">
        <ellipse cx="-14" cy="24" rx="48" ry="24" fill="#15803D" />
        <ellipse cx="-42" cy="30" rx="28" ry="14" fill="#22C55E" />
        <g className="animate-flower-sway" style={{ animationDelay: '1.2s' }}>
          <circle cx="-11" cy="-7" r="13" fill="url(#tm-hibiscus)" />
          <circle cx="11" cy="-7" r="13" fill="url(#tm-hibiscus)" />
          <circle cx="-9" cy="11" r="13" fill="url(#tm-hibiscus)" />
          <circle cx="9" cy="11" r="13" fill="url(#tm-hibiscus)" />
          <circle cx="0" cy="-14" r="12" fill="url(#tm-hibiscus)" />
          <circle cx="0" cy="0" r="5.5" fill="#FDE047" />
        </g>
      </g>

      {/* Smoothly Fluttering Colorful Butterflies */}
      <g className="animate-butterfly-a">
        <g transform="translate(260, 500)">
          <g className="animate-wing-flutter">
            <ellipse cx="-6.5" cy="0" rx="7" ry="4.8" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="1" />
            <ellipse cx="6.5" cy="0" rx="7" ry="4.8" fill="#FB923C" stroke="#FFFFFF" strokeWidth="1" />
          </g>
        </g>
      </g>
      <g className="animate-butterfly-b">
        <g transform="translate(945, 422)">
          <g className="animate-wing-flutter">
            <ellipse cx="-6" cy="0" rx="6.5" ry="4.4" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />
            <ellipse cx="6" cy="0" rx="6.5" ry="4.4" fill="#F472B6" stroke="#FFFFFF" strokeWidth="1" />
          </g>
        </g>
      </g>

      {/* Drifting Sunlit Firefly / Light Motes */}
      <g className="animate-firefly-a">
        <circle cx="290" cy="340" r="4" fill="#FEF08A" filter="url(#tm-soft-glow)" />
        <circle cx="622" cy="402" r="3.5" fill="#FFFFFF" filter="url(#tm-soft-glow)" />
        <circle cx="912" cy="346" r="4" fill="#FEF08A" filter="url(#tm-soft-glow)" />
      </g>
      <g className="animate-firefly-b">
        <circle cx="468" cy="472" r="3.8" fill="#FEF08A" filter="url(#tm-soft-glow)" />
        <circle cx="848" cy="488" r="3.8" fill="#A5F3FC" filter="url(#tm-soft-glow)" />
        <circle cx="1044" cy="458" r="4" fill="#FEF08A" filter="url(#tm-soft-glow)" />
      </g>

      {/* HQ Door Glow during Scene 14 Entrance */}
      {hqDoorOpen && (
        <rect
          x="182"
          y="265"
          width="32"
          height="40"
          rx="10"
          fill="#FEF08A"
          stroke="#F59E0B"
          strokeWidth="3"
          opacity="0.92"
        />
      )}

      {/* Rustle behind nearby tree at end of Scene 02 */}
      {showRustleBehindTree && (
        <g transform="translate(285, 212)" className="animate-bounce">
          <text
            x="0"
            y="0"
            fontSize="18"
            fontWeight="900"
            fill="#FEF08A"
            stroke="#0369A1"
            strokeWidth="1.2"
          >
            *rustle!*
          </text>
        </g>
      )}
    </svg>
  );
};
