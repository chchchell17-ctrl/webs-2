import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  DoorOpen,
  Home,
  LockOpen,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  SCREEN04_CLUES,
  SCREEN04_COMPLETION_SCRIPT,
  SCREEN04_UNLOCK_SCRIPT,
  THREE_CORE_REMINDERS,
} from '../../data/screen04Data.ts';
import type { AvatarConfig, GameSettings } from '../../types/game.ts';
import { playLoginSuccess, playPortalOpen } from '../../utils/soundEffects.ts';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface RedFlagCompletionUnlockProps {
  phase: 'completion' | 'unlock-aina';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  firstAttemptScore: number;
  onProceedToUnlock: () => void;
  onVisitAinasHouse: () => void;
}

export const RedFlagCompletionUnlock: React.FC<RedFlagCompletionUnlockProps> = ({
  phase,
  avatarConfig,
  nickname,
  settings,
  firstAttemptScore,
  onProceedToUnlock,
  onVisitAinasHouse,
}) => {
  const [compIdx, setCompIdx] = useState(0);
  const [compDone, setCompDone] = useState(false);

  const [unlockIdx, setUnlockIdx] = useState(0);
  const [unlockDone, setUnlockDone] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    if (phase === 'unlock-aina') {
      setUnlockIdx(0);
      setUnlockDone(false);
      setGateOpen(false);
      const t = window.setTimeout(() => {
        setGateOpen(true);
        playLoginSuccess();
      }, settings.reducedMotion ? 200 : 750);
      return () => window.clearTimeout(t);
    }
  }, [phase, settings.reducedMotion]);

  if (phase === 'completion') {
    const currentStep = SCREEN04_COMPLETION_SCRIPT[compIdx];
    return (
      <>
        <div
          className={`relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-5 ${
            !compDone ? 'pb-44 sm:pb-48' : 'pb-8'
          } pointer-events-auto`}
        >
          <div
            style={{
              background:
                'linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(255,241,242,0.95) 50%, rgba(232,248,255,0.95) 100%)',
            }}
            className="aero-glass-card rounded-[30px] border-2 border-white p-5 sm:p-7 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] space-y-5"
          >
            <div className="relative z-10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-[#BE123C]">
                    MISSION 02 COMPLETED · RED FLAG CENTRE
                  </p>
                  <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
                    FIVE WARNING SIGNS MASTERED!
                  </h2>
                </div>
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs sm:text-sm font-extrabold text-[#15803D] tabular-nums">
                  Clues: 5 / 5 · Quiz 1st-Try: {firstAttemptScore} / 5
                </div>
              </div>

              {/* Discovered Warning Signs Summary */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                {SCREEN04_CLUES.map((clue) => (
                  <div
                    key={clue.id}
                    className="rounded-2xl bg-white/95 border border-rose-200 p-3 text-left space-y-1 shadow-xs"
                  >
                    <p className="text-[11px] font-extrabold text-[#BE123C] inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Flag #{clue.order}
                    </p>
                    <p className="text-xs font-extrabold text-[#0E3558]">{clue.label}</p>
                    <p className="text-[11px] text-[#475569] leading-snug">{clue.boardSummary}</p>
                  </div>
                ))}
              </div>

              {/* STOP · CHECK · ASK Core Reminders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {THREE_CORE_REMINDERS.map((r) => (
                  <div key={r.word} className={`rounded-2xl border p-4 ${r.bg} text-left space-y-1.5`}>
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${r.color} px-3 py-1 text-xs font-extrabold text-white`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{r.word}</span>
                    </div>
                    <p className={`text-xs sm:text-sm font-bold ${r.textColor}`}>{r.detail}</p>
                  </div>
                ))}
              </div>

              {compDone && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      playPortalOpen();
                      onProceedToUnlock();
                    }}
                    className="aero-glossy-btn min-h-[48px] w-full sm:w-auto rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>SEE NEXT DETECTIVE LOCATION</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {!compDone && currentStep && (
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
                onSkipAll={() => setCompDone(true)}
                onNext={() => {
                  if (compIdx + 1 < SCREEN04_COMPLETION_SCRIPT.length) {
                    setCompIdx((prev) => prev + 1);
                  } else {
                    setCompDone(true);
                  }
                }}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // SCENE 08: Unlock Aina's House
  const currentUnlockStep = SCREEN04_UNLOCK_SCRIPT[unlockIdx];

  return (
    <>
      <div
        className={`relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-5 ${
          !unlockDone ? 'pb-44 sm:pb-48' : 'pb-8'
        } pointer-events-auto`}
      >
        <div
          style={{
            background:
              'linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(253,242,248,0.95) 55%, rgba(232,248,255,0.95) 100%)',
          }}
          className="aero-glass-card rounded-[30px] border-2 border-white p-5 sm:p-7 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.38)]"
        >
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5 rounded-2xl bg-gradient-to-b from-pink-50 via-white to-purple-50 border-2 border-white p-4 flex flex-col items-center justify-center gap-3 shadow-inner">
              <div className="flex items-end justify-center gap-3">
                <div className="w-20 h-26">
                  <DetectiveAvatar config={avatarConfig} view="front" pose="wave" />
                </div>
                <div className="w-18 h-16">
                  <PusheenIllustration expression="excited" pose="waving" />
                </div>
              </div>
              <span className="rounded-xl bg-pink-100 border border-pink-200 px-3 py-1 text-xs font-extrabold text-[#BE185D]">
                DESTINATION: AINA&apos;S HOUSE
              </span>
            </div>

            <div className="md:col-span-7 space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
                {gateOpen ? (
                  <>
                    <LockOpen className="h-4 w-4" />
                    <span>NEW LOCATION UNLOCKED!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>UNLOCKING NEXT LOCATION...</span>
                  </>
                )}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2">
                <Home className="h-6 w-6 text-[#DB2777] shrink-0" />
                <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
                  AINA&apos;S HOUSE
                </h2>
              </div>

              <p className="text-sm sm:text-base font-bold text-[#6D28D9]">
                Segment 2 · Activity 2: The Mystery of the Lucky Message
              </p>

              <p className="text-xs sm:text-sm font-semibold text-[#18466E]">
                Aina needs a Digital Detective&apos;s help! Visit her home to read the mystery message
                on her smartphone and give her clear online-safety advice.
              </p>

              {unlockDone && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      playPortalOpen();
                      onVisitAinasHouse();
                    }}
                    className="aero-glossy-btn min-h-[50px] w-full sm:w-auto rounded-full bg-gradient-to-b from-[#EC4899] to-[#BE185D] hover:from-[#F472B6] hover:to-[#9D174D] border border-white px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <DoorOpen className="h-5 w-5" />
                    <span>VISIT AINA&apos;S HOUSE</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!unlockDone && currentUnlockStep && (
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
              onSkipAll={() => setUnlockDone(true)}
              onNext={() => {
                if (unlockIdx + 1 < SCREEN04_UNLOCK_SCRIPT.length) {
                  setUnlockIdx((prev) => prev + 1);
                } else {
                  setUnlockDone(true);
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
