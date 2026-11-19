import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, HeartHandshake, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import adviceCentreExtBg from '../../assets/images/advice_centre_exterior_1795083708291.jpg';
import adviceCentreIntBg from '../../assets/images/advice_centre_interior_1795083708166.jpg';
import {
  ADVICE_CENTRE_ZONES,
  SCREEN07_PUSHEEN_INTRO_SCRIPT,
} from '../../data/screen07Data.ts';
import type { AvatarConfig, GameSettings } from '../../types/game.ts';
import { playPortalOpen, playSoftSelect } from '../../utils/soundEffects.ts';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface AdviceCentreEnvironmentProps {
  mode: 'exterior' | 'interior-explore' | 'pusheen-intro';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  onEnterInterior?: () => void;
  onStartIntroDialogue?: () => void;
  onFinishIntro?: () => void;
}

export const AdviceCentreEnvironment: React.FC<AdviceCentreEnvironmentProps> = ({
  mode,
  avatarConfig,
  nickname,
  settings,
  onEnterInterior,
  onStartIntroDialogue,
  onFinishIntro,
}) => {
  const [extFailed, setExtFailed] = useState(false);
  const [intFailed, setIntFailed] = useState(false);
  const [activeZoneId, setActiveZoneId] = useState<string>('advice-desk');
  const [visitedZones, setVisitedZones] = useState<string[]>(['advice-desk']);
  const [introIdx, setIntroIdx] = useState(0);

  // Walkable avatar inside Advice Centre interior exploration
  const [avatarPos, setAvatarPos] = useState<{ x: number; y: number }>({ x: 50, y: 74 });
  const [facing, setFacing] = useState<'front' | 'left' | 'right'>('front');
  const [isMoving, setIsMoving] = useState(false);
  const posRef = useRef(avatarPos);
  posRef.current = avatarPos;
  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const stageRef = useRef<HTMLDivElement | null>(null);

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
          y: Math.max(28, Math.min(86, nextY)),
        };
        posRef.current = clamped;
        setAvatarPos(clamped);
        setIsMoving(true);

        for (const z of ADVICE_CENTRE_ZONES) {
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

  if (mode === 'exterior') {
    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 py-6">
        <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#F3E8FF]">
          {!extFailed ? (
            <img
              src={adviceCentreExtBg}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setExtFailed(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(155deg, #CCFBF1 0%, #EDE9FE 55%, #E0F2FE 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-[#0B2945]/35" />
        </div>

        <div className="relative z-10 w-full max-w-3xl rounded-[32px] border-2 border-white bg-white/92 backdrop-blur-md p-6 sm:p-8 shadow-[0_24px_60px_-10px_rgba(14,53,88,0.34)] text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 border border-teal-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#0F766E]">
            <HeartHandshake className="h-4 w-4" />
            <span>DETECTIVE TOWN · ADVICE CENTRE</span>
          </div>

          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
            ADVICE CENTRE · WORDS THAT HELP
          </h2>

          <p className="text-sm sm:text-base font-semibold text-[#334155] max-w-xl mx-auto">
            Step inside the welcoming pastel Advice Centre to practise writing real messages that
            ask for advice, give safe advice, and respond kindly!
          </p>

          <div className="flex items-end justify-center gap-10 py-1">
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
                <PusheenIllustration expression="happy" pose="waving" />
              </div>
              <span className="rounded-full bg-teal-100 border border-teal-200 px-3 py-0.5 text-[11px] font-extrabold text-[#0F766E]">
                Detective Pusheen
              </span>
            </div>
          </div>

          {onEnterInterior && (
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onEnterInterior();
              }}
              className="aero-glossy-btn min-h-[50px] rounded-full bg-gradient-to-b from-[#2DD4BF] to-[#0D9488] hover:from-[#5EEAD4] hover:to-[#0F766E] border border-white px-8 py-3 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <span>STEP INSIDE ADVICE CENTRE</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'pusheen-intro') {
    const step = SCREEN07_PUSHEEN_INTRO_SCRIPT[introIdx];
    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 pb-44 sm:pb-48">
        <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#F5F3FF]">
          {!intFailed ? (
            <img
              src={adviceCentreIntBg}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setIntFailed(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(155deg, #EDE9FE 0%, #CCFBF1 55%, #E0F2FE 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-[#0B2945]/35" />
        </div>

        {/* Floating Mission 04 Overview Cards */}
        <div className="relative z-10 w-full max-w-4xl rounded-[30px] border-2 border-white bg-white/92 backdrop-blur-md p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C3AED]">
                MISSION 04 · WORDS THAT HELP
              </p>
              <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558]">
                Three Essential Communication Skills
              </h2>
            </div>
            <div className="w-14 h-12">
              <PusheenIllustration expression={step?.expression || 'happy'} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3.5">
              <p className="text-xs font-extrabold text-[#0284C7]">1 · ASKING FOR ADVICE</p>
              <p className="text-xs font-semibold text-[#334155] mt-1">
                Ask clearly when a message seems suspicious!
              </p>
            </div>
            <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3.5">
              <p className="text-xs font-extrabold text-[#7C3AED]">2 · GIVING ADVICE</p>
              <p className="text-xs font-semibold text-[#334155] mt-1">
                Use &ldquo;You should&rdquo;, &ldquo;You shouldn&apos;t&rdquo; &amp; &ldquo;You
                could&rdquo;!
              </p>
            </div>
            <div className="rounded-2xl bg-teal-50 border border-teal-200 p-3.5">
              <p className="text-xs font-extrabold text-[#0D9488]">3 · RESPONDING POLITELY</p>
              <p className="text-xs font-semibold text-[#334155] mt-1">
                Thank your helper &amp; explain your safe plan!
              </p>
            </div>
          </div>
        </div>

        {step && (
          <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
            <div className="pointer-events-auto">
              <DialogueBox
                speaker={step.speaker}
                speakerName={step.speakerName}
                playerNickname={nickname}
                playerAvatar={avatarConfig}
                expression={step.expression}
                text={step.text}
                settings={settings}
                nextLabel={
                  introIdx + 1 < SCREEN07_PUSHEEN_INTRO_SCRIPT.length
                    ? 'NEXT'
                    : 'OPEN ADVICE LEARNING CORNER'
                }
                onReplay={() => setIntroIdx(0)}
                onSkipAll={() => onFinishIntro?.()}
                onNext={() => {
                  if (introIdx + 1 < SCREEN07_PUSHEEN_INTRO_SCRIPT.length) {
                    setIntroIdx((p) => p + 1);
                  } else {
                    onFinishIntro?.();
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  const activeZone =
    ADVICE_CENTRE_ZONES.find((z) => z.id === activeZoneId) ?? ADVICE_CENTRE_ZONES[0];

  return (
    <div className="relative z-20 w-full max-w-6xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div className="rounded-[32px] border-2 border-white bg-white/95 p-4 sm:p-6 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0D9488] inline-flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>ADVICE CENTRE · EXPLORE THE INTERIOR</span>
            </p>
            <h2 className="font-[var(--font-display)] text-lg sm:text-2xl font-bold text-[#0E3558]">
              Walk with WASD or tap the four stations inside the Advice Centre!
            </h2>
          </div>

          {onStartIntroDialogue && (
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onStartIntroDialogue();
              }}
              className="aero-glossy-btn min-h-[46px] rounded-full bg-gradient-to-b from-[#2DD4BF] to-[#0D9488] border border-white px-6 py-2 text-xs sm:text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>MEET PUSHEEN · MISSION 04</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div
          ref={stageRef}
          onClick={(e) => {
            if (!stageRef.current) return;
            const rect = stageRef.current.getBoundingClientRect();
            const cx = ((e.clientX - rect.left) / rect.width) * 100;
            const cy = ((e.clientY - rect.top) / rect.height) * 100;
            targetRef.current = {
              x: Math.max(8, Math.min(92, cx)),
              y: Math.max(28, Math.min(86, cy)),
            };
          }}
          className="relative w-full aspect-[16/9] min-h-[300px] sm:min-h-[380px] rounded-[24px] border-2 border-purple-200 overflow-hidden bg-[#F5F3FF] shadow-inner select-none"
        >
          {!intFailed ? (
            <img
              src={adviceCentreIntBg}
              alt="Advice Centre interior"
              referrerPolicy="no-referrer"
              onError={() => setIntFailed(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(155deg, #EDE9FE 0%, #CCFBF1 55%, #E0F2FE 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2945]/40 via-transparent to-white/15" />

          {ADVICE_CENTRE_ZONES.map((zone) => {
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
                  targetRef.current = { x: zone.x, y: Math.max(32, zone.y) };
                }}
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-20 rounded-full px-3 py-1.5 text-[11px] font-extrabold border-2 shadow-md inline-flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 ${
                  isSelected
                    ? 'bg-[#7C3AED] text-white border-white ring-4 ring-purple-300/60'
                    : isVisited
                      ? 'bg-emerald-50/95 text-[#15803D] border-emerald-300'
                      : 'bg-white/95 text-[#0E3558] border-purple-200'
                }`}
              >
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{zone.label}</span>
              </button>
            );
          })}

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
        </div>

        <div className="rounded-2xl bg-purple-50 border border-purple-200 p-4 flex flex-wrap items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 shrink-0">
              <PusheenIllustration expression="encouraging" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#7C3AED]">
                STATION: {activeZone.label} ({visitedZones.length}/{ADVICE_CENTRE_ZONES.length}{' '}
                explored)
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#0E3558]">
                {activeZone.description}
              </p>
              <p className="text-xs font-semibold text-[#5B21B6] mt-0.5">
                Pusheen: &ldquo;{activeZone.pusheenNote}&rdquo;
              </p>
            </div>
          </div>

          {onStartIntroDialogue && (
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onStartIntroDialogue();
              }}
              className="min-h-[40px] rounded-full bg-white hover:bg-purple-100 border border-purple-300 px-4 py-1.5 text-xs font-extrabold text-[#6D28D9] cursor-pointer"
            >
              Start Mission 04 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
