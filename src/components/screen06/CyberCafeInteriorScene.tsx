import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Coffee,
  Laptop,
  MapPin,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import cyberCafeInteriorBg from '../../assets/images/cyber_cafe_interior_1795083706722.jpg';
import {
  CAFE_COMPUTER_SEATS,
  CAFE_EXPLORE_ZONES,
  type CafeSeatOption,
} from '../../data/screen06Data.ts';
import type { AvatarConfig, GameSettings } from '../../types/game.ts';
import {
  playErrorTone,
  playLoginSuccess,
  playPortalOpen,
  playSoftSelect,
} from '../../utils/soundEffects.ts';
import { ByteIllustration } from '../game/ByteIllustration.tsx';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface CyberCafeInteriorSceneProps {
  mode: 'exterior' | 'interior-explore' | 'meet-byte' | 'seat-select' | 'workstation-ready';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  selectedSeatId: string | null;
  onEnterCafe?: () => void;
  onStartMeetByte?: () => void;
  onSeatSelected?: (seatId: string) => void;
  onBeginMission03?: () => void;
}

export const CyberCafeInteriorScene: React.FC<CyberCafeInteriorSceneProps> = ({
  mode,
  avatarConfig,
  nickname,
  settings,
  selectedSeatId,
  onEnterCafe,
  onStartMeetByte,
  onSeatSelected,
  onBeginMission03,
}) => {
  const [bgFailed, setBgFailed] = useState(false);
  const [activeZoneId, setActiveZoneId] = useState<string>('byte-station');
  const [visitedZones, setVisitedZones] = useState<string[]>(['byte-station']);

  // Walkable avatar inside Cyber Cafe interior exploration
  const [avatarPos, setAvatarPos] = useState<{ x: number; y: number }>({ x: 48, y: 74 });
  const [facing, setFacing] = useState<'front' | 'left' | 'right'>('front');
  const [isMoving, setIsMoving] = useState(false);
  const posRef = useRef(avatarPos);
  posRef.current = avatarPos;
  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Seat selection feedback
  const [occupiedAlert, setOccupiedAlert] = useState<string | null>(null);
  const [connectingSeat, setConnectingSeat] = useState<CafeSeatOption | null>(null);

  useEffect(() => {
    if (mode !== 'interior-explore') {
      keysRef.current.clear();
      setIsMoving(false);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        e.preventDefault();
        keysRef.current.add(k);
        targetRef.current = null;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== 'interior-explore') return;

    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const keys = keysRef.current;
      let dx = 0;
      let dy = 0;
      if (keys.has('w') || keys.has('arrowup')) dy -= 1;
      if (keys.has('s') || keys.has('arrowdown')) dy += 1;
      if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
      if (keys.has('d') || keys.has('arrowright')) dx += 1;

      const cur = posRef.current;
      let nextX = cur.x;
      let nextY = cur.y;
      let moving = false;

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        nextX = cur.x + (dx / len) * 32 * dt;
        nextY = cur.y + (dy / len) * 32 * dt;
        moving = true;
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
          nextX = cur.x + (tx / dist) * 34 * dt;
          nextY = cur.y + (ty / dist) * 34 * dt;
          moving = true;
          if (tx < -1) setFacing('left');
          else if (tx > 1) setFacing('right');
          else setFacing('front');
        }
      }

      if (moving) {
        const clamped = {
          x: Math.max(8, Math.min(92, nextX)),
          y: Math.max(30, Math.min(86, nextY)),
        };
        posRef.current = clamped;
        setAvatarPos(clamped);
        setIsMoving(true);

        for (const z of CAFE_EXPLORE_ZONES) {
          if (Math.hypot(z.x - clamped.x, z.y - clamped.y) < 13) {
            setActiveZoneId(z.id);
            setVisitedZones((prev) => (prev.includes(z.id) ? prev : [...prev, z.id]));
            break;
          }
        }
      } else {
        setIsMoving(false);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [mode]);

  const activeZone =
    CAFE_EXPLORE_ZONES.find((z) => z.id === activeZoneId) ?? CAFE_EXPLORE_ZONES[1];

  const handleSeatClick = (seat: CafeSeatOption) => {
    if (connectingSeat) return;

    if (seat.occupied) {
      playErrorTone();
      setOccupiedAlert('Oops! Someone is already using this computer. Try another seat!');
      return;
    }

    setOccupiedAlert(null);
    playLoginSuccess();
    setConnectingSeat(seat);

    const delay = settings.reducedMotion ? 260 : 950;
    window.setTimeout(() => {
      playPortalOpen();
      setConnectingSeat(null);
      onSeatSelected?.(seat.id);
    }, delay);
  };

  if (mode === 'exterior') {
    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 py-6">
        {/* Background */}
        <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#E0F2FE]">
          {!bgFailed ? (
            <img
              src={cyberCafeInteriorBg}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setBgFailed(true)}
              className="w-full h-full object-cover object-center blur-[3px] scale-105 opacity-75"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(155deg, #BAE6FD 0%, #E0F2FE 55%, #ECFEFF 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/25 via-transparent to-[#0B2945]/40" />
        </div>

        <div className="relative z-10 w-full max-w-3xl rounded-[32px] border-2 border-white bg-white/92 backdrop-blur-md p-6 sm:p-8 shadow-[0_24px_60px_-10px_rgba(14,53,88,0.35)] text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 border border-cyan-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#0369A1]">
            <Coffee className="h-4 w-4" />
            <span>DETECTIVE TOWN · CYBER CAFÉ ARRIVAL</span>
          </div>

          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
            WELCOME TO THE CYBER CAFÉ!
          </h2>

          <p className="text-sm sm:text-base font-semibold text-[#334155] max-w-xl mx-auto">
            Inside this bright digital café, Detective Byte needs your help checking real-looking
            digital messages to see which ones are safe, suspicious, or need more information!
          </p>

          <div className="flex items-end justify-center gap-10 py-2">
            <div className="flex flex-col items-center">
              <div className="w-24 h-30 sm:w-28 sm:h-36">
                <DetectiveAvatar config={avatarConfig} view="front" pose="wave" />
              </div>
              <span className="rounded-full bg-purple-100 border border-purple-200 px-3 py-0.5 text-[11px] font-extrabold text-[#6D28D9]">
                {nickname}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-22 sm:w-26 sm:h-24">
                <PusheenIllustration expression="excited" pose="waving" />
              </div>
              <span className="rounded-full bg-sky-100 border border-sky-200 px-3 py-0.5 text-[11px] font-extrabold text-[#0369A1]">
                Detective Pusheen
              </span>
            </div>
          </div>

          {onEnterCafe && (
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onEnterCafe();
              }}
              className="aero-glossy-btn min-h-[50px] rounded-full bg-gradient-to-b from-[#38BDF8] to-[#0284C7] hover:from-[#60A5FA] hover:to-[#0369A1] border border-white px-8 py-3 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <span>ENTER CYBER CAFÉ</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'meet-byte') {
    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-end pb-44 sm:pb-48">
        <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#E0F2FE]">
          {!bgFailed ? (
            <img
              src={cyberCafeInteriorBg}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setBgFailed(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(155deg, #E0F2FE 0%, #CFFAFE 55%, #F0FDF4 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-[#0B2945]/35" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-14 flex items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="flex flex-col items-center">
              <div className="w-22 h-28 sm:w-28 sm:h-36 drop-shadow-xl">
                <DetectiveAvatar config={avatarConfig} view="front" pose="idle" />
              </div>
              <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-extrabold text-[#6D28D9] shadow">
                {nickname}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-18 sm:w-24 sm:h-22 drop-shadow-xl">
                <PusheenIllustration expression="happy" />
              </div>
              <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-extrabold text-[#0369A1] shadow">
                Pusheen
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-28 h-30 sm:w-36 sm:h-38 drop-shadow-xl">
              <ByteIllustration expression="happy" pose="waving" />
            </div>
            <span className="rounded-full bg-white/95 px-3 py-0.5 text-[11px] font-extrabold text-[#0284C7] shadow">
              Byte the Robot
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'workstation-ready') {
    const chosenSeat =
      CAFE_COMPUTER_SEATS.find((s) => s.id === selectedSeatId) ?? CAFE_COMPUTER_SEATS[1];

    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 py-6">
        <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#E0F2FE]">
          {!bgFailed && (
            <img
              src={cyberCafeInteriorBg}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setBgFailed(true)}
              className="w-full h-full object-cover object-center opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-[#0B2945]/45 backdrop-blur-xs" />
        </div>

        <div className="relative z-10 w-full max-w-2xl rounded-[32px] border-2 border-cyan-200 bg-white/96 p-6 sm:p-8 shadow-2xl text-center space-y-5">
          <div className="mx-auto w-24 h-24">
            <ByteIllustration expression="celebrating" pose="investigating" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
            <CheckCircle2 className="h-4 w-4" />
            <span>WORKSTATION CONNECTED!</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
              {chosenSeat.label} · {chosenSeat.stationName}
            </h2>
            <p className="text-sm sm:text-base font-semibold text-[#334155]">
              Monitor synced with Byte&apos;s security terminal! Let&apos;s begin{' '}
              <span className="font-extrabold text-[#0284C7]">
                MISSION 03: THE DIGITAL MESSAGE FILES
              </span>{' '}
              and classify all 10 message cases!
            </p>
          </div>

          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 text-xs sm:text-sm font-bold text-[#0369A1]">
            Remember: Look at the SENDER, MESSAGE BODY, REQUESTS, and LINKS before choosing SAFE,
            SUSPICIOUS, or NEED MORE INFORMATION.
          </div>

          {onBeginMission03 && (
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onBeginMission03();
              }}
              className="aero-glossy-btn min-h-[50px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] border border-white px-8 py-3 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>START MISSION 03 · 10 CASES</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 'interior-explore' or 'seat-select'
  return (
    <div className="relative z-20 w-full max-w-6xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div className="rounded-[32px] border-2 border-white bg-white/95 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.35)] p-4 sm:p-6 space-y-4">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0284C7] inline-flex items-center gap-1.5">
              <Coffee className="h-3.5 w-3.5" />
              <span>
                {mode === 'seat-select'
                  ? 'CYBER CAFÉ · STEP 2: CHOOSE AN EMPTY COMPUTER SEAT'
                  : 'CYBER CAFÉ · EXPLORE THE DIGITAL CAFÉ'}
              </span>
            </p>
            <h2 className="font-[var(--font-display)] text-lg sm:text-2xl font-bold text-[#0E3558]">
              {mode === 'seat-select'
                ? 'Select an empty computer station to connect with Byte!'
                : 'Walk with WASD or click any café hotspot, then talk to Byte!'}
            </h2>
          </div>

          {mode === 'interior-explore' && onStartMeetByte && (
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onStartMeetByte();
              }}
              className="aero-glossy-btn min-h-[46px] rounded-full bg-gradient-to-b from-[#38BDF8] to-[#0284C7] border border-white px-6 py-2 text-xs sm:text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>TALK TO BYTE</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Interactive Interior Map Viewport */}
        <div
          ref={stageRef}
          onClick={(e) => {
            if (mode !== 'interior-explore' || !stageRef.current) return;
            const rect = stageRef.current.getBoundingClientRect();
            const cx = ((e.clientX - rect.left) / rect.width) * 100;
            const cy = ((e.clientY - rect.top) / rect.height) * 100;
            targetRef.current = {
              x: Math.max(8, Math.min(92, cx)),
              y: Math.max(30, Math.min(86, cy)),
            };
          }}
          className="relative w-full aspect-[16/9] min-h-[300px] sm:min-h-[380px] rounded-[24px] border-2 border-sky-200 overflow-hidden bg-[#E0F2FE] shadow-inner select-none"
        >
          {!bgFailed ? (
            <img
              src={cyberCafeInteriorBg}
              alt="Cyber Café interior"
              referrerPolicy="no-referrer"
              onError={() => setBgFailed(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(155deg, #BAE6FD 0%, #E0F2FE 55%, #ECFDF5 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2945]/45 via-transparent to-white/15" />

          {/* Byte standing by his central workstation */}
          <div
            style={{ left: '47%', top: '34%', transform: 'translate(-50%, -50%)' }}
            className="pointer-events-none absolute z-10 flex flex-col items-center"
          >
            <div className="w-14 h-16 sm:w-20 sm:h-22 drop-shadow-xl">
              <ByteIllustration expression="happy" pose="waving" />
            </div>
            <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-extrabold text-[#0284C7] shadow">
              Byte
            </span>
          </div>

          {mode === 'interior-explore' && (
            <>
              {/* 4 Hotspot Zones */}
              {CAFE_EXPLORE_ZONES.map((zone) => {
                const isVisited = visitedZones.includes(zone.id);
                const isSelected = activeZoneId === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSoftSelect();
                      setActiveZoneId(zone.id);
                      setVisitedZones((prev) => (prev.includes(zone.id) ? prev : [...prev, zone.id]));
                      targetRef.current = { x: zone.x, y: Math.max(35, zone.y) };
                    }}
                    style={{
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute z-20 rounded-full px-3 py-1.5 text-[11px] font-extrabold border-2 shadow-md inline-flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 ${
                      isSelected
                        ? 'bg-[#0284C7] text-white border-white ring-4 ring-sky-300/60'
                        : isVisited
                          ? 'bg-emerald-50/95 text-[#15803D] border-emerald-300'
                          : 'bg-white/95 text-[#0E3558] border-sky-200'
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{zone.label}</span>
                  </button>
                );
              })}

              {/* Walkable Player Avatar + Pusheen */}
              <div
                style={{
                  left: `${avatarPos.x}%`,
                  top: `${avatarPos.y}%`,
                  transform: 'translate(-50%, -70%)',
                }}
                className="pointer-events-none absolute z-30 flex items-end"
              >
                <div className="w-12 h-16 sm:w-16 sm:h-20 drop-shadow-xl">
                  <DetectiveAvatar
                    config={avatarConfig}
                    view={facing}
                    pose={isMoving ? 'walk' : 'idle'}
                  />
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 -ml-2 mb-1 drop-shadow-md">
                  <PusheenIllustration expression="happy" />
                </div>
              </div>
            </>
          )}

          {mode === 'seat-select' && (
            <>
              {/* 4 Seat Buttons overlaid in interior */}
              {CAFE_COMPUTER_SEATS.map((seat) => {
                const isConnecting = connectingSeat?.id === seat.id;
                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => handleSeatClick(seat)}
                    style={{
                      left: `${seat.xPct}%`,
                      top: `${seat.yPct}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute z-20 rounded-2xl border-2 px-3 py-2 shadow-lg text-left min-w-[128px] sm:min-w-[155px] cursor-pointer transition-transform hover:scale-105 ${
                      seat.occupied
                        ? 'bg-rose-50/95 border-rose-300 text-[#9F1239]'
                        : isConnecting
                          ? 'bg-emerald-500 border-white text-white ring-4 ring-emerald-300'
                          : 'bg-white/95 border-emerald-400 text-[#0E3558] ring-4 ring-emerald-300/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[11px] font-extrabold inline-flex items-center gap-1">
                        {seat.occupied ? (
                          <UserCheck className="h-3.5 w-3.5 text-[#E11D48]" />
                        ) : (
                          <Laptop className="h-3.5 w-3.5 text-[#059669]" />
                        )}
                        {seat.label}
                      </span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${
                          seat.occupied
                            ? 'bg-rose-200 text-[#9F1239]'
                            : 'bg-emerald-100 text-[#15803D]'
                        }`}
                      >
                        {seat.occupied ? `Used (${seat.occupantName})` : 'Empty'}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold opacity-85 mt-0.5 truncate">
                      {seat.stationName}
                    </p>
                  </button>
                );
              })}

              {/* Sitting/Connecting Avatar */}
              <div
                style={{
                  left: `${connectingSeat ? connectingSeat.xPct : 50}%`,
                  top: `${connectingSeat ? connectingSeat.yPct + 12 : 76}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="pointer-events-none absolute z-30 transition-all duration-500 flex items-end"
              >
                <div className="w-12 h-16 sm:w-16 sm:h-20 drop-shadow-xl">
                  <DetectiveAvatar
                    config={avatarConfig}
                    view="front"
                    pose={connectingSeat ? 'walk' : 'idle'}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Details / Feedback Strip */}
        {mode === 'interior-explore' ? (
          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 shrink-0">
                <PusheenIllustration expression="happy" />
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#0284C7]">
                  EXPLORING: {activeZone.label} ({visitedZones.length}/{CAFE_EXPLORE_ZONES.length} checked)
                </p>
                <p className="text-xs sm:text-sm font-bold text-[#0E3558]">
                  {activeZone.description}
                </p>
                <p className="text-xs font-semibold text-[#0369A1] mt-0.5">
                  Pusheen: &ldquo;{activeZone.pusheenTip}&rdquo;
                </p>
              </div>
            </div>

            {onStartMeetByte && (
              <button
                type="button"
                onClick={() => {
                  playPortalOpen();
                  onStartMeetByte();
                }}
                className="min-h-[40px] rounded-full bg-white hover:bg-sky-100 border border-sky-300 px-4 py-1.5 text-xs font-extrabold text-[#0369A1] cursor-pointer"
              >
                Ready? Talk to Byte →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {occupiedAlert && (
              <div
                role="alert"
                className="rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3 flex items-center gap-3 text-left"
              >
                <AlertCircle className="h-5 w-5 text-[#E11D48] shrink-0" />
                <p className="text-xs sm:text-sm font-extrabold text-[#9F1239]">{occupiedAlert}</p>
              </div>
            )}

            {/* Accessible Seat Cards for smaller screens / keyboard users */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {CAFE_COMPUTER_SEATS.map((seat) => (
                <button
                  key={seat.id}
                  type="button"
                  onClick={() => handleSeatClick(seat)}
                  className={`rounded-2xl border-2 p-3 text-left cursor-pointer transition-all ${
                    seat.occupied
                      ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300'
                      : 'bg-emerald-50/80 border-emerald-300 hover:border-emerald-500 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0E3558]">{seat.label}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        seat.occupied
                          ? 'bg-rose-200 text-[#9F1239]'
                          : 'bg-emerald-200 text-[#14532D]'
                      }`}
                    >
                      {seat.occupied ? 'Occupied' : 'Available'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#334155] mt-1">{seat.stationName}</p>
                  <p className="text-[11px] font-medium text-[#475569] mt-0.5">{seat.seatNote}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
