import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  DoorOpen,
  Footprints,
  Home,
  Sofa,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import ainaBedroomBg from '../../assets/images/aina_bedroom_interior_1795080505554.jpg';
import ainaHouseExtBg from '../../assets/images/aina_house_exterior_1795080504183.jpg';
import {
  AINA_HOUSE_ROOMS,
  type HouseRoomDefinition,
  type HouseRoomId,
} from '../../data/screen05Data.ts';
import type { AvatarConfig, GameSettings } from '../../types/game.ts';
import {
  playDoorKnock,
  playErrorTone,
  playLoginSuccess,
  playPortalOpen,
  playSoftSelect,
} from '../../utils/soundEffects.ts';
import { AinaIllustration } from '../game/AinaIllustration.tsx';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface AinasHouseCutawayProps {
  mode: 'exterior' | 'cutaway' | 'bedroom-entry';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  foundRoomInitial?: boolean;
  onStartLooking?: () => void;
  onWrongRoomClick: (roomId: HouseRoomId) => void;
  onFoundBedroom: () => void;
  onEnterBedroom: () => void;
}

const RoomFurnitureSvg: React.FC<{ roomId: HouseRoomId }> = ({ roomId }) => {
  if (roomId === 'study-room') {
    return (
      <svg viewBox="0 0 240 135" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect x="0" y="0" width="240" height="135" fill="#EFF6FF" />
        {/* Warm wooden floorboards */}
        <line x1="0" y1="108" x2="240" y2="108" stroke="#DBEAFE" strokeWidth="2" />
        {/* Bookshelf */}
        <rect x="18" y="18" width="66" height="96" rx="6" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" />
        <line x1="18" y1="50" x2="84" y2="50" stroke="#D97706" strokeWidth="2" />
        <line x1="18" y1="82" x2="84" y2="82" stroke="#D97706" strokeWidth="2" />
        <rect x="26" y="25" width="10" height="22" rx="2" fill="#38BDF8" />
        <rect x="39" y="28" width="9" height="19" rx="2" fill="#A855F7" />
        <rect x="51" y="24" width="11" height="23" rx="2" fill="#34D399" />
        {/* Study Desk & Monitor & Lamp */}
        <rect x="110" y="78" width="108" height="12" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
        <rect x="120" y="90" width="10" height="26" fill="#94A3B8" />
        <rect x="196" y="90" width="10" height="26" fill="#94A3B8" />
        <rect x="140" y="46" width="44" height="28" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
        <polygon points="198,46 214,46 220,60 192,60" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
        <line x1="206" y1="60" x2="206" y2="78" stroke="#64748B" strokeWidth="3" />
      </svg>
    );
  }

  if (roomId === 'ainas-bedroom') {
    return (
      <svg viewBox="0 0 240 135" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect x="0" y="0" width="240" height="135" fill="#F5F3FF" />
        <line x1="0" y1="108" x2="240" y2="108" stroke="#EDE9FE" strokeWidth="2" />
        {/* Window with Pastel Curtains */}
        <rect x="148" y="16" width="64" height="46" rx="6" fill="#BAE6FD" stroke="#FFFFFF" strokeWidth="2.5" />
        <rect x="146" y="16" width="14" height="46" rx="4" fill="#F9A8D4" />
        <rect x="198" y="16" width="14" height="46" rx="4" fill="#F9A8D4" />
        {/* Cozy Bed */}
        <rect x="18" y="68" width="114" height="44" rx="10" fill="#DDD6FE" stroke="#8B5CF6" strokeWidth="2.5" />
        <rect x="24" y="54" width="32" height="20" rx="6" fill="#FFFFFF" stroke="#C4B5FD" strokeWidth="2" />
        <rect x="62" y="70" width="66" height="38" rx="8" fill="#FBCFE8" />
        {/* Side Table */}
        <rect x="150" y="82" width="56" height="30" rx="6" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
      </svg>
    );
  }

  if (roomId === 'living-room') {
    return (
      <svg viewBox="0 0 240 135" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect x="0" y="0" width="240" height="135" fill="#ECFEFF" />
        <line x1="0" y1="108" x2="240" y2="108" stroke="#CFFAFE" strokeWidth="2" />
        {/* Sofa */}
        <rect x="22" y="62" width="104" height="44" rx="12" fill="#7DD3FC" stroke="#0284C7" strokeWidth="2.5" />
        <rect x="32" y="50" width="84" height="18" rx="8" fill="#38BDF8" />
        <rect x="36" y="68" width="18" height="14" rx="4" fill="#FDE047" />
        {/* TV Cabinet */}
        <rect x="150" y="34" width="68" height="40" rx="6" fill="#1E293B" stroke="#FFFFFF" strokeWidth="2" />
        <rect x="156" y="40" width="56" height="28" rx="3" fill="#67E8F9" />
        <rect x="146" y="82" width="74" height="28" rx="6" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 135" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="0" width="240" height="135" fill="#ECFDF5" />
      <line x1="0" y1="108" x2="240" y2="108" stroke="#D1FAE5" strokeWidth="2" />
      {/* Kitchen Cabinets */}
      <rect x="18" y="18" width="90" height="36" rx="6" fill="#D1FAE5" stroke="#059669" strokeWidth="2" />
      <rect x="18" y="72" width="90" height="40" rx="6" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
      {/* Dining Table & Kettle */}
      <rect x="128" y="76" width="90" height="12" rx="5" fill="#FCD34D" stroke="#D97706" strokeWidth="2" />
      <rect x="140" y="88" width="10" height="24" fill="#D97706" />
      <rect x="194" y="88" width="10" height="24" fill="#D97706" />
      <circle cx="172" cy="64" r="11" fill="#FB7185" />
    </svg>
  );
};

interface RoomRect {
  id: HouseRoomId;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  centerX: number;
  centerY: number;
}

const ROOM_RECTS: RoomRect[] = [
  { id: 'study-room', x1: 3, y1: 6, x2: 40, y2: 45, centerX: 24, centerY: 28 },
  { id: 'ainas-bedroom', x1: 60, y1: 6, x2: 97, y2: 45, centerX: 76, centerY: 28 },
  { id: 'living-room', x1: 3, y1: 55, x2: 40, y2: 94, centerX: 24, centerY: 75 },
  { id: 'kitchen', x1: 60, y1: 55, x2: 97, y2: 94, centerX: 76, centerY: 75 },
];

function detectRoomAt(x: number, y: number): HouseRoomId | null {
  for (const r of ROOM_RECTS) {
    if (x >= r.x1 && x <= r.x2 - 2 && y >= r.y1 && y <= r.y2) {
      return r.id;
    }
  }
  return null;
}

function clampPositionToWalkableHouse(x: number, y: number): { x: number; y: number } {
  // Keep inside overall floor plan
  let nx = Math.max(8, Math.min(92, x));
  let ny = Math.max(15, Math.min(88, y));

  // Wall between upper floor (y < 46) and ground floor (y > 54) except central staircase corridor (42 <= x <= 58)
  const inStairColumn = nx >= 42 && nx <= 58;
  if (!inStairColumn && ny > 44 && ny < 58) {
    ny = ny < 51 ? 44 : 58;
  }

  return { x: nx, y: ny };
}

export const AinasHouseCutaway: React.FC<AinasHouseCutawayProps> = ({
  mode,
  avatarConfig,
  nickname,
  settings,
  foundRoomInitial = false,
  onStartLooking,
  onWrongRoomClick,
  onFoundBedroom,
  onEnterBedroom,
}) => {
  const [extFailed, setExtFailed] = useState(false);
  const [bedFailed, setBedFailed] = useState(false);

  const [wrongBanner, setWrongBanner] = useState<{ roomName: string; message: string } | null>(null);
  const [checkedWrongRooms, setCheckedWrongRooms] = useState<HouseRoomId[]>([]);
  const [foundBedroom, setFoundBedroom] = useState<boolean>(foundRoomInitial);
  const [knockPhase, setKnockPhase] = useState<
    'ready' | 'knocking' | 'aina-asked' | 'pusheen-replied' | 'come-in'
  >('ready');

  // Walkable floor plan state
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 50, y: 78 });
  const [facing, setFacing] = useState<'front' | 'left' | 'right'>('front');
  const [isMoving, setIsMoving] = useState(false);

  const posRef = useRef(playerPos);
  posRef.current = playerPos;
  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const keysPressedRef = useRef<Set<string>>(new Set());
  const activeRoomRef = useRef<HouseRoomId | null>(null);
  const foundBedroomRef = useRef(foundBedroom);
  foundBedroomRef.current = foundBedroom;
  const floorPlanRef = useRef<HTMLDivElement | null>(null);

  const triggerRoomVisit = useCallback(
    (roomId: HouseRoomId) => {
      if (foundBedroomRef.current) return;
      const room = AINA_HOUSE_ROOMS.find((r) => r.id === roomId);
      if (!room) return;

      if (room.id !== 'ainas-bedroom') {
        playErrorTone();
        targetRef.current = null;
        setWrongBanner({
          roomName: room.name,
          message: 'No, Aina is not here.',
        });
        setCheckedWrongRooms((prev) => (prev.includes(room.id) ? prev : [...prev, room.id]));
        onWrongRoomClick(room.id);
        return;
      }

      playLoginSuccess();
      targetRef.current = null;
      setWrongBanner(null);
      setFoundBedroom(true);
      onFoundBedroom();
    },
    [onFoundBedroom, onWrongRoomClick]
  );

  // WASD + Arrow key listeners when in cutaway mode
  useEffect(() => {
    if (mode !== 'cutaway' || foundBedroom) {
      keysPressedRef.current.clear();
      setIsMoving(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const targetEl = e.target as HTMLElement | null;
      if (
        targetEl &&
        (targetEl.tagName === 'INPUT' ||
          targetEl.tagName === 'TEXTAREA' ||
          targetEl.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (
        ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)
      ) {
        e.preventDefault();
        keysPressedRef.current.add(key);
        targetRef.current = null;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current.delete(e.key.toLowerCase());
    };

    const clearKeys = () => {
      keysPressedRef.current.clear();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearKeys);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearKeys);
    };
  }, [mode, foundBedroom]);

  // Smooth movement loop (WASD + click-to-walk)
  useEffect(() => {
    if (mode !== 'cutaway' || foundBedroom) return;

    let rafId = 0;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const keys = keysPressedRef.current;
      let dx = 0;
      let dy = 0;
      if (keys.has('w') || keys.has('arrowup')) dy -= 1;
      if (keys.has('s') || keys.has('arrowdown')) dy += 1;
      if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
      if (keys.has('d') || keys.has('arrowright')) dx += 1;

      const cur = posRef.current;
      let nextX = cur.x;
      let nextY = cur.y;
      let movingNow = false;

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        const speed = 34; // % per second
        nextX = cur.x + (dx / len) * speed * dt;
        nextY = cur.y + (dy / len) * speed * dt;
        movingNow = true;
        if (dx < -0.1) setFacing('left');
        else if (dx > 0.1) setFacing('right');
        else setFacing('front');
      } else if (targetRef.current) {
        const tx = targetRef.current.x - cur.x;
        const ty = targetRef.current.y - cur.y;
        const dist = Math.hypot(tx, ty);
        if (dist < 1.2) {
          targetRef.current = null;
        } else {
          const speed = 36;
          nextX = cur.x + (tx / dist) * speed * dt;
          nextY = cur.y + (ty / dist) * speed * dt;
          movingNow = true;
          if (tx < -1) setFacing('left');
          else if (tx > 1) setFacing('right');
          else setFacing('front');
        }
      }

      if (movingNow) {
        const clamped = clampPositionToWalkableHouse(nextX, nextY);
        posRef.current = clamped;
        setPlayerPos(clamped);
        setIsMoving(true);

        const roomNow = detectRoomAt(clamped.x, clamped.y);
        if (roomNow && roomNow !== activeRoomRef.current) {
          activeRoomRef.current = roomNow;
          triggerRoomVisit(roomNow);
        } else if (!roomNow && activeRoomRef.current !== null) {
          activeRoomRef.current = null;
        }
      } else {
        setIsMoving(false);
      }

      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [mode, foundBedroom, triggerRoomVisit]);

  const handleFloorPlanClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (foundBedroom || !floorPlanRef.current) return;
    const rect = floorPlanRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    targetRef.current = clampPositionToWalkableHouse(clickX, clickY);
  };

  const walkToRoomCard = (room: HouseRoomDefinition) => {
    if (foundBedroom) return;
    playSoftSelect();
    const rect = ROOM_RECTS.find((r) => r.id === room.id);
    if (!rect) return;
    // If already close, trigger immediately; otherwise walk into room cleanly
    const cur = posRef.current;
    const dist = Math.hypot(rect.centerX - cur.x, rect.centerY - cur.y);
    if (dist < 14) {
      triggerRoomVisit(room.id);
      return;
    }
    targetRef.current = { x: rect.centerX, y: rect.centerY };
  };

  const nudgeDirection = (dx: number, dy: number) => {
    if (foundBedroom) return;
    targetRef.current = null;
    const cur = posRef.current;
    const clamped = clampPositionToWalkableHouse(cur.x + dx, cur.y + dy);
    posRef.current = clamped;
    setPlayerPos(clamped);
    if (dx < 0) setFacing('left');
    else if (dx > 0) setFacing('right');
    else setFacing('front');

    const roomNow = detectRoomAt(clamped.x, clamped.y);
    if (roomNow && roomNow !== activeRoomRef.current) {
      activeRoomRef.current = roomNow;
      triggerRoomVisit(roomNow);
    } else if (!roomNow) {
      activeRoomRef.current = null;
    }
  };

  const handleKnockOnDoor = () => {
    if (knockPhase !== 'ready') return;
    playDoorKnock();
    setKnockPhase('knocking');

    const fast = settings.reducedMotion;
    window.setTimeout(() => {
      playSoftSelect();
      setKnockPhase('aina-asked');
    }, fast ? 220 : 650);

    window.setTimeout(() => {
      setKnockPhase('pusheen-replied');
    }, fast ? 520 : 1850);

    window.setTimeout(() => {
      playPortalOpen();
      setKnockPhase('come-in');
    }, fast ? 850 : 3100);
  };

  if (mode === 'exterior') {
    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-end pb-44 sm:pb-48">
        <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#FCE7F3]">
          {!extFailed ? (
            <img
              src={ainaHouseExtBg}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setExtFailed(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(180deg, #BAE6FD 0%, #FCE7F3 55%, #DCFCE7 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-[#0B2945]/25" />
        </div>

        {/* Characters standing outside Aina's House */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex items-end justify-center gap-10 sm:gap-16">
          <div className="flex flex-col items-center">
            <div className="w-24 h-32 sm:w-30 sm:h-40 drop-shadow-xl">
              <DetectiveAvatar config={avatarConfig} view="front" pose="wave" />
            </div>
            <span className="mt-1 rounded-full bg-white/90 border border-white px-3 py-0.5 text-[11px] font-extrabold text-[#6D28D9]">
              {nickname}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-22 sm:w-28 sm:h-24 drop-shadow-xl">
              <PusheenIllustration expression="happy" pose="waving" />
            </div>
            <span className="mt-1 rounded-full bg-white/90 border border-white px-3 py-0.5 text-[11px] font-extrabold text-[#0369A1]">
              Detective Pusheen
            </span>
          </div>
        </div>

        {onStartLooking && (
          <div className="relative z-20 mt-4">
            <button
              type="button"
              onClick={onStartLooking}
              className="aero-glossy-btn min-h-[46px] rounded-full bg-gradient-to-b from-[#EC4899] to-[#BE185D] border border-white px-6 py-2 text-sm font-extrabold text-white shadow-lg cursor-pointer"
            >
              LOOK INSIDE AINA&apos;S HOUSE
            </button>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'bedroom-entry') {
    return (
      <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#FDF2F8]">
        {!bedFailed ? (
          <img
            src={ainaBedroomBg}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setBedFailed(true)}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(165deg, #FCE7F3 0%, #EDE9FE 55%, #E0F2FE 100%)',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-[#0B2945]/30" />

        {/* Characters in Bedroom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[160px] sm:bottom-[180px] max-w-5xl mx-auto px-6 sm:px-14 flex items-end justify-between">
          <div className="flex items-end gap-4">
            <div className="flex flex-col items-center">
              <div className="w-22 h-28 sm:w-28 sm:h-36 drop-shadow-xl">
                <DetectiveAvatar config={avatarConfig} view="front" pose="idle" />
              </div>
              <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-extrabold text-[#6D28D9]">
                {nickname}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-18 sm:w-24 sm:h-22 drop-shadow-xl">
                <PusheenIllustration expression="encouraging" />
              </div>
              <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-extrabold text-[#0369A1]">
                Pusheen
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-26 h-28 sm:w-32 sm:h-34 drop-shadow-xl">
              <AinaIllustration expression="worried" holdingPhone={true} />
            </div>
            <span className="rounded-full bg-white/90 px-3 py-0.5 text-[11px] font-extrabold text-[#DB2777]">
              Aina
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Interactive Walkable 2D Dollhouse Floor Plan (WASD + Arrow Keys + Click-to-Walk)
  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div
        style={{
          background:
            'linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(253,242,248,0.94) 55%, rgba(232,248,255,0.94) 100%)',
        }}
        className="aero-glass-card rounded-[32px] border-2 border-white p-4 sm:p-6 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.35)] space-y-4"
      >
        <div className="relative z-10 space-y-3.5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#DB2777] inline-flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5" />
                <span>AINA&apos;S HOUSE · EXPLORE ROOMS</span>
              </p>
              <h2 className="font-[var(--font-display)] text-lg sm:text-2xl font-bold text-[#0E3558]">
                {foundBedroom
                  ? "YOU FOUND AINA'S BEDROOM!"
                  : 'Walk around with WASD / Arrows or click a room to find Aina!'}
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-sky-50 border border-sky-200 px-3 py-1.5">
              <div className="w-8 h-8 shrink-0">
                <PusheenIllustration expression={foundBedroom ? 'celebrating' : wrongBanner ? 'encouraging' : 'curious'} />
              </div>
              <span className="text-xs font-bold text-[#0369A1]">
                {foundBedroom
                  ? "This is Aina's bedroom! Let's knock first!"
                  : wrongBanner
                    ? wrongBanner.message
                    : 'Use WASD / Arrows to walk upstairs & check each room!'}
              </span>
            </div>
          </div>

          {!foundBedroom ? (
            <>
              {/* Wrong-Room Inline Alert Message */}
              {wrongBanner && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-2xl border-2 border-rose-300 bg-gradient-to-r from-[#FFE4E6] via-[#FFF1F2] to-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-[#E11D48] text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                      !
                    </div>
                    <div className="text-left">
                      <p className="text-xs sm:text-sm font-extrabold text-[#9F1239]">
                        {wrongBanner.message}
                      </p>
                      <p className="text-[11px] font-semibold text-[#475569]">
                        Checked {wrongBanner.roomName}. Keep exploring the other rooms!
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playSoftSelect();
                      setWrongBanner(null);
                    }}
                    className="rounded-full bg-white border border-rose-200 px-3 py-1 text-[11px] font-extrabold text-[#BE123C] cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Walkable 2D Floor Plan Stage */}
              <div
                ref={floorPlanRef}
                onClick={handleFloorPlanClick}
                className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[340px] rounded-[26px] border-4 border-white bg-gradient-to-b from-[#FDF2F8] via-[#FAF5FF] to-[#ECFEFF] shadow-inner overflow-hidden select-none cursor-crosshair"
              >
                {/* Roof Beam */}
                <div className="absolute inset-x-0 top-0 h-5 bg-gradient-to-r from-[#F9A8D4] via-[#DDD6FE] to-[#F9A8D4] border-b border-white flex items-center justify-center">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#581C87]">
                    2-STOREY WALKABLE HOUSE · UPPER &amp; GROUND FLOORS
                  </span>
                </div>

                {/* Central Hallway & Wooden Stairs */}
                <div
                  aria-hidden="true"
                  className="absolute left-[42%] top-[7%] w-[16%] h-[88%] bg-gradient-to-b from-[#FEF3C7]/70 to-[#FDE68A]/55 border-x-2 border-dashed border-amber-300/80 flex flex-col items-center justify-center"
                >
                  <div className="w-full px-2 py-2 flex flex-col gap-1 items-center">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-800 bg-white/80 rounded-full px-2 py-0.5">
                      Stairs
                    </span>
                    {[0, 1, 2, 3, 4].map((stepIdx) => (
                      <div
                        key={stepIdx}
                        className="w-full h-2.5 rounded-sm bg-amber-300/90 border border-amber-500/40"
                      />
                    ))}
                  </div>
                </div>

                {/* Floor Divider Beam (left & right wings) */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 right-[58%] top-[48%] h-[4%] bg-[#CBD5E1] border-y border-white shadow-xs"
                />
                <div
                  aria-hidden="true"
                  className="absolute left-[58%] right-0 top-[48%] h-[4%] bg-[#CBD5E1] border-y border-white shadow-xs"
                />

                {/* 4 Walkable Rooms (Equal Visual Weight — no glow spoiler on Bedroom) */}
                {AINA_HOUSE_ROOMS.map((room) => {
                  const r = ROOM_RECTS.find((item) => item.id === room.id)!;
                  const alreadyCheckedWrong = checkedWrongRooms.includes(room.id);
                  const Icon =
                    room.id === 'study-room'
                      ? BookOpen
                      : room.id === 'ainas-bedroom'
                        ? Sparkles
                        : room.id === 'living-room'
                          ? Sofa
                          : UtensilsCrossed;

                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        walkToRoomCard(room);
                      }}
                      style={{
                        left: `${r.x1}%`,
                        top: `${r.y1 + 2}%`,
                        width: `${r.x2 - r.x1}%`,
                        height: `${r.y2 - r.y1 - 2}%`,
                      }}
                      className="absolute rounded-[20px] border-2 border-white bg-white/90 hover:border-sky-300 shadow-md overflow-hidden group cursor-pointer transition-shadow"
                    >
                      <div className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity">
                        <RoomFurnitureSvg roomId={room.id} />
                      </div>

                      {/* Room Label Pill */}
                      <div className="relative z-10 m-2 flex items-center justify-between gap-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/95 border border-sky-100 px-2.5 py-0.5 text-[10px] sm:text-xs font-extrabold text-[#0E3558] shadow-xs">
                          <Icon className="h-3 w-3 text-[#6D28D9]" />
                          {room.name}
                        </span>
                        {alreadyCheckedWrong && (
                          <span className="rounded-full bg-rose-100 border border-rose-300 px-2 py-0.5 text-[9px] font-extrabold text-[#BE123C]">
                            Not here
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Walkable Player Avatar + Detective Pusheen Follower */}
                <div
                  style={{
                    left: `${playerPos.x}%`,
                    top: `${playerPos.y}%`,
                    transform: 'translate(-50%, -72%)',
                  }}
                  className="pointer-events-none absolute z-30 flex items-end gap-1"
                >
                  <div className="w-12 h-16 sm:w-16 sm:h-20 drop-shadow-lg">
                    <DetectiveAvatar
                      config={avatarConfig}
                      view={facing}
                      pose={isMoving ? 'walk' : 'idle'}
                    />
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 -ml-2 mb-1 drop-shadow-md">
                    <PusheenIllustration expression="curious" />
                  </div>
                </div>
              </div>

              {/* Controls Bar (WASD hint + Mobile/Touch D-Pad) */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/85 border border-sky-100 px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0E3558]">
                  <Footprints className="h-4 w-4 text-[#0284C7]" />
                  <span>
                    Move with <kbd className="rounded bg-sky-100 px-1.5 py-0.5 text-[11px] font-extrabold">W A S D</kbd> or{' '}
                    <kbd className="rounded bg-sky-100 px-1.5 py-0.5 text-[11px] font-extrabold">Arrow Keys</kbd>, or tap any room to walk inside!
                  </span>
                </div>

                {/* Touch / Click D-Pad */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Walk left"
                    onClick={() => nudgeDirection(-12, 0)}
                    className="h-9 w-9 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-200 flex items-center justify-center text-[#0369A1] cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Walk up"
                    onClick={() => nudgeDirection(0, -14)}
                    className="h-9 w-9 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-200 flex items-center justify-center text-[#0369A1] cursor-pointer"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Walk down"
                    onClick={() => nudgeDirection(0, 14)}
                    className="h-9 w-9 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-200 flex items-center justify-center text-[#0369A1] cursor-pointer"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Walk right"
                    onClick={() => nudgeDirection(12, 0)}
                    className="h-9 w-9 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-200 flex items-center justify-center text-[#0369A1] cursor-pointer"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Found Aina's Bedroom -> Door Knocking Sequence */
            <div className="rounded-[26px] border-2 border-pink-200 bg-gradient-to-b from-pink-50/90 to-purple-50/90 p-5 sm:p-7 flex flex-col items-center text-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
                <Sparkles className="h-4 w-4" />
                <span>YOU FOUND AINA&apos;S ROOM!</span>
              </div>

              {/* Interactive Bedroom Door Visual */}
              <button
                type="button"
                onClick={handleKnockOnDoor}
                disabled={knockPhase !== 'ready'}
                className={`relative w-44 h-56 rounded-t-[70px] rounded-b-xl border-4 border-white bg-gradient-to-b from-[#F472B6] to-[#BE185D] shadow-xl flex flex-col items-center justify-center gap-2 text-white transition-transform cursor-pointer disabled:cursor-default ${
                  knockPhase === 'ready' ? 'hover:scale-[1.03] active:scale-95' : ''
                } ${knockPhase === 'knocking' && !settings.reducedMotion ? 'animate-bounce' : ''}`}
              >
                <div className="w-28 h-24 rounded-t-[45px] rounded-b-lg bg-pink-200/35 border-2 border-white/60 flex items-center justify-center">
                  <DoorOpen className="h-10 w-10 text-white" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider px-3">
                  {knockPhase === 'ready' ? 'KNOCK ON THE DOOR' : 'KNOCK! KNOCK!'}
                </span>
                <span className="absolute right-4 top-1/2 h-4 w-4 rounded-full bg-amber-300 border-2 border-white shadow" />
              </button>

              {/* Knock Dialogue Bubbles */}
              <div className="w-full max-w-lg space-y-2 text-left">
                {knockPhase === 'ready' && (
                  <p className="text-center text-sm font-bold text-[#0E3558]">
                    Tap the door button above to knock politely before entering!
                  </p>
                )}
                {(knockPhase === 'aina-asked' ||
                  knockPhase === 'pusheen-replied' ||
                  knockPhase === 'come-in') && (
                  <div className="rounded-2xl bg-white border border-pink-200 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#0E3558]">
                    <span className="text-[#DB2777]">Aina (inside):</span> &ldquo;Who&apos;s there?&rdquo;
                  </div>
                )}
                {(knockPhase === 'pusheen-replied' || knockPhase === 'come-in') && (
                  <div className="rounded-2xl bg-white border border-sky-200 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#0E3558]">
                    <span className="text-[#0369A1]">Detective Pusheen:</span> &ldquo;It&apos;s Detective Pusheen! We&apos;ve come to help!&rdquo;
                  </div>
                )}
                {knockPhase === 'come-in' && (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-300 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#14532D] flex flex-wrap items-center justify-between gap-3">
                    <span>
                      <span className="text-[#DB2777]">Aina:</span> &ldquo;Oh! Come in!&rdquo;
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playPortalOpen();
                        onEnterBedroom();
                      }}
                      className="aero-glossy-btn min-h-[44px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] px-6 py-2 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
                    >
                      ENTER BEDROOM
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
