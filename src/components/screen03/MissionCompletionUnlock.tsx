import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  DoorOpen,
  Flag,
  LockOpen,
  Sparkles,
} from 'lucide-react';
import {
  COMPLETION_DIALOGUE_SCRIPT,
  UNLOCK_DIALOGUE_SCRIPT,
} from '../../data/screen03Data.ts';
import type { AvatarConfig, GameSettings } from '../../types/game.ts';
import {
  playLoginSuccess,
  playPortalOpen,
} from '../../utils/soundEffects.ts';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface MissionCompletionUnlockProps {
  phase: 'completion' | 'unlock-red-flag';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  onProceedToUnlock: () => void;
  onUnlockVisualTriggered?: () => void;
  onContinueToRedFlagCentre: () => void;
}

const COMPLETED_INDUCTION_STAGES = [
  'Watched the investigation video.',
  'Identified the problem.',
  'Completed the YES/NO decision.',
  'Explored three online safety rules.',
  'Completed the quick understanding check.',
];

export const MissionCompletionUnlock: React.FC<MissionCompletionUnlockProps> = ({
  phase,
  avatarConfig,
  nickname,
  settings,
  onProceedToUnlock,
  onUnlockVisualTriggered,
  onContinueToRedFlagCentre,
}) => {
  const [compIdx, setCompIdx] = useState(0);
  const [compDialogueDone, setCompDialogueDone] = useState(false);

  const [unlockIdx, setUnlockIdx] = useState(0);
  const [unlockDialogueDone, setUnlockDialogueDone] = useState(false);
  const [lockDissolved, setLockDissolved] = useState(false);

  useEffect(() => {
    if (phase === 'unlock-red-flag') {
      setUnlockIdx(0);
      setUnlockDialogueDone(false);
      setLockDissolved(false);
      const t = window.setTimeout(() => {
        setLockDissolved(true);
        playLoginSuccess();
        onUnlockVisualTriggered?.();
      }, settings.reducedMotion ? 200 : 750);
      return () => window.clearTimeout(t);
    }
  }, [phase, settings.reducedMotion, onUnlockVisualTriggered]);

  // SCENE 10: Pusheen's Final Encouragement & Induction Completed Panel
  if (phase === 'completion') {
    const currentStep = COMPLETION_DIALOGUE_SCRIPT[compIdx];

    return (
      <>
        <div
          className={`relative z-20 w-full max-w-4xl mx-auto px-2 sm:px-4 ${
            !compDialogueDone ? 'pb-44 sm:pb-48' : 'pb-6'
          } flex flex-col gap-3.5 pointer-events-auto`}
        >
          <div
            style={{
              background:
                'linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(232,248,255,0.95) 55%, rgba(237,233,254,0.95) 100%)',
            }}
            className="aero-glass-card rounded-[28px] border-2 border-white p-5 sm:p-6 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)]"
          >
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Left Characters Celebration */}
              <div className="md:col-span-4 rounded-2xl bg-gradient-to-b from-sky-50 to-purple-50 border border-white p-4 flex flex-col items-center justify-center text-center gap-2">
                <div className="flex items-end justify-center gap-2">
                  <div className="w-20 h-26">
                    <DetectiveAvatar config={avatarConfig} view="front" pose="wave" />
                  </div>
                  <div className="w-18 h-16">
                    <PusheenIllustration expression="celebrating" pose="waving" />
                  </div>
                </div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#15803D] bg-emerald-100 border border-emerald-300 rounded-lg px-3 py-1">
                  INDUCTION COMPLETED!
                </p>
              </div>

              {/* Right Mission Progress Panel */}
              <div className="md:col-span-8 space-y-3 text-left">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-[#0284C7]">
                    MISSION 01
                  </p>
                  <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558]">
                    THE MYSTERY OF THE UNEXPECTED PRIZE
                  </h2>
                </div>

                <div className="rounded-2xl bg-white/95 border border-sky-100 p-3.5 space-y-2">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#6D28D9]">
                    COMPLETED STAGES
                  </p>
                  <ul className="space-y-1.5">
                    {COMPLETED_INDUCTION_STAGES.map((stageText) => (
                      <li
                        key={stageText}
                        className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0E3558]"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0" aria-hidden="true" />
                        <span>{stageText}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {compDialogueDone && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        playPortalOpen();
                        onProceedToUnlock();
                      }}
                      className="aero-glossy-btn min-h-[48px] w-full sm:w-auto rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <span>SEE NEXT LOCATION</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {!compDialogueDone && currentStep && (
          <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
            <div className="pointer-events-auto">
              <DialogueBox
                speaker={currentStep.speaker}
                speakerName={currentStep.speakerName}
                playerNickname={nickname}
                playerAvatar={avatarConfig}
                expression={currentStep.expression}
                text={currentStep.text}
                settings={settings}
                onReplay={() => setCompIdx(0)}
                onSkipAll={() => setCompDialogueDone(true)}
                onNext={() => {
                  if (compIdx + 1 < COMPLETION_DIALOGUE_SCRIPT.length) {
                    setCompIdx((prev) => prev + 1);
                  } else {
                    setCompDialogueDone(true);
                  }
                }}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // SCENE 11: Unlock Red Flag Centre
  const currentUnlockStep = UNLOCK_DIALOGUE_SCRIPT[unlockIdx];

  return (
    <>
      <div
        className={`relative z-20 w-full max-w-4xl mx-auto px-2 sm:px-4 ${
          !unlockDialogueDone ? 'pb-44 sm:pb-48' : 'pb-6'
        } flex flex-col gap-3.5 pointer-events-auto`}
      >
        <div
          style={{
            background:
              'linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(254,242,242,0.94) 48%, rgba(232,248,255,0.95) 100%)',
          }}
          className="aero-glass-card rounded-[30px] border-2 border-white p-5 sm:p-7 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.38)]"
        >
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Animated Digital Map Unlock Preview */}
            <div className="md:col-span-6 rounded-2xl bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#DCFCE7] border-2 border-white p-4 shadow-inner">
              <svg viewBox="0 0 360 210" className="w-full h-auto" aria-hidden="true">
                <rect width="360" height="105" fill="#7DD3FC" rx="12" />
                <path d="M0 95 Q180 65 360 92 L360 210 L0 210 Z" fill="#4ADE80" />
                {/* Stone Pathway Between HQ and Red Flag Centre */}
                <path
                  d="M78 156 Q168 118 272 138"
                  fill="none"
                  stroke="#FCD34D"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <path
                  d="M78 156 Q168 118 272 138"
                  fill="none"
                  stroke="#FEF3C7"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="10 8"
                />
                {/* Detective HQ Mini Building */}
                <rect x="46" y="102" width="64" height="46" rx="8" fill="#EFF6FF" stroke="#0284C7" strokeWidth="3" />
                <polygon points="40,104 78,76 116,104" fill="#2563EB" />
                <text x="78" y="132" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="900">
                  HQ
                </text>

                {/* Red Flag Centre Glowing Node */}
                {lockDissolved && (
                  <circle
                    cx="272"
                    cy="112"
                    r="48"
                    fill="#FDE047"
                    opacity="0.45"
                    className={settings.reducedMotion ? '' : 'animate-pulse'}
                  />
                )}
                <rect x="234" y="90" width="76" height="50" rx="10" fill="#FFF1F2" stroke="#E11D48" strokeWidth="3" />
                <polygon points="228,92 272,62 316,92" fill="#F43F5E" />
                {/* Waving Flag */}
                <line x1="272" y1="62" x2="272" y2="38" stroke="#9F1239" strokeWidth="3" />
                <polygon points="274,38 302,46 274,54" fill="#FB7185" />
                <text x="272" y="122" textAnchor="middle" fill="#BE123C" fontSize="10" fontWeight="900">
                  RED FLAG
                </text>
              </svg>
            </div>

            {/* Unlock Announcement Details */}
            <div className="md:col-span-6 space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-rose-100 border border-rose-300 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#BE123C]">
                {lockDissolved ? (
                  <>
                    <LockOpen className="h-4 w-4 text-[#16A34A]" aria-hidden="true" />
                    <span className="text-[#15803D]">NEW LOCATION UNLOCKED!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>UNLOCKING NEXT LOCATION...</span>
                  </>
                )}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2">
                <Flag className="h-6 w-6 text-[#E11D48] shrink-0" aria-hidden="true" />
                <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
                  RED FLAG CENTRE
                </h2>
              </div>

              <p className="text-sm sm:text-base font-bold text-[#6D28D9]">
                &ldquo;Your next investigation awaits!&rdquo;
              </p>

              <p className="text-xs sm:text-sm font-semibold text-[#18466E]">
                Detective Town&apos;s security gate is open! Head over to the Red Flag Centre to
                learn how to spot hidden warning signs in suspicious messages.
              </p>

              {unlockDialogueDone && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      playPortalOpen();
                      onContinueToRedFlagCentre();
                    }}
                    className="aero-glossy-btn min-h-[50px] w-full sm:w-auto rounded-full bg-gradient-to-b from-[#FB7185] to-[#E11D48] hover:from-[#FDA4AF] hover:to-[#BE123C] border border-white px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <DoorOpen className="h-5 w-5" aria-hidden="true" />
                    <span>CONTINUE TO RED FLAG CENTRE</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!unlockDialogueDone && currentUnlockStep && (
        <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
          <div className="pointer-events-auto">
            <DialogueBox
              speaker={currentUnlockStep.speaker}
              speakerName={currentUnlockStep.speakerName}
              playerNickname={nickname}
              playerAvatar={avatarConfig}
              expression={currentUnlockStep.expression}
              text={currentUnlockStep.text}
              settings={settings}
              onReplay={() => setUnlockIdx(0)}
              onSkipAll={() => setUnlockDialogueDone(true)}
              onNext={() => {
                if (unlockIdx + 1 < UNLOCK_DIALOGUE_SCRIPT.length) {
                  setUnlockIdx((prev) => prev + 1);
                } else {
                  setUnlockDialogueDone(true);
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
