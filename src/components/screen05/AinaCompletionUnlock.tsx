import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Coffee,
  DoorOpen,
  Heart,
  LockOpen,
  Sparkles,
} from 'lucide-react';
import {
  SCREEN05_THANK_YOU_SCRIPT,
  SCREEN05_UNLOCK_CAFE_SCRIPT,
} from '../../data/screen05Data.ts';
import type { AvatarConfig, GameSettings } from '../../types/game.ts';
import { playLoginSuccess, playPortalOpen } from '../../utils/soundEffects.ts';
import { AinaIllustration } from '../game/AinaIllustration.tsx';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface AinaCompletionUnlockProps {
  phase: 'thank-you' | 'case-closed' | 'unlock-cafe';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  firstAttemptScore: number;
  onProceedToCaseClosed: () => void;
  onProceedToUnlockCafe: () => void;
  onVisitCyberCafe: () => void;
}

export const AinaCompletionUnlock: React.FC<AinaCompletionUnlockProps> = ({
  phase,
  avatarConfig,
  nickname,
  settings,
  firstAttemptScore,
  onProceedToCaseClosed,
  onProceedToUnlockCafe,
  onVisitCyberCafe,
}) => {
  const [tyIdx, setTyIdx] = useState(0);
  const [tyDone, setTyDone] = useState(false);

  const [unlockIdx, setUnlockIdx] = useState(0);
  const [unlockDone, setUnlockDone] = useState(false);
  const [cafeGateOpen, setCafeGateOpen] = useState(false);

  useEffect(() => {
    if (phase === 'unlock-cafe') {
      setUnlockIdx(0);
      setUnlockDone(false);
      setCafeGateOpen(false);
      const t = window.setTimeout(() => {
        setCafeGateOpen(true);
        playLoginSuccess();
      }, settings.reducedMotion ? 200 : 700);
      return () => window.clearTimeout(t);
    }
  }, [phase, settings.reducedMotion]);

  if (phase === 'thank-you') {
    const currentStep = SCREEN05_THANK_YOU_SCRIPT[tyIdx];
    return (
      <>
        <div
          className={`relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-5 ${
            !tyDone ? 'pb-44 sm:pb-48' : 'pb-8'
          } pointer-events-auto`}
        >
          <div
            style={{
              background:
                'linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(253,242,248,0.95) 55%, rgba(232,248,255,0.95) 100%)',
            }}
            className="aero-glass-card rounded-[30px] border-2 border-white p-6 sm:p-8 text-center space-y-5 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)]"
          >
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 border border-pink-200 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#BE185D]">
                <Heart className="h-4 w-4 text-[#DB2777] fill-[#F472B6]" />
                <span>THANK-YOU NOTE FROM AINA</span>
              </div>

              <div className="flex items-end justify-center gap-5 py-2">
                <div className="w-20 h-26">
                  <DetectiveAvatar config={avatarConfig} view="front" pose="wave" />
                </div>
                <div className="w-24 h-26">
                  <AinaIllustration expression="celebrating" />
                </div>
                <div className="w-18 h-16">
                  <PusheenIllustration expression="celebrating" pose="waving" />
                </div>
              </div>

              <div className="max-w-lg mx-auto rounded-2xl bg-white/95 border border-pink-200 p-4 text-sm sm:text-base font-semibold text-[#0E3558] shadow-xs">
                &ldquo;Thank you, Detective {nickname} and Detective Pusheen! Now I know how to check
                suspicious messages and ask my mother before clicking anything!&rdquo;
              </div>

              {tyDone && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      playPortalOpen();
                      onProceedToCaseClosed();
                    }}
                    className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>VIEW CASE SUMMARY</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {!tyDone && currentStep && (
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
                onReplay={() => setTyIdx(0)}
                onSkipAll={() => setTyDone(true)}
                onNext={() => {
                  if (tyIdx + 1 < SCREEN05_THANK_YOU_SCRIPT.length) {
                    setTyIdx((prev) => prev + 1);
                  } else {
                    setTyDone(true);
                  }
                }}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  if (phase === 'case-closed') {
    return (
      <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
        <div
          style={{
            background:
              'linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(232,248,255,0.95) 55%, rgba(253,242,248,0.95) 100%)',
          }}
          className="aero-glass-card rounded-[30px] border-2 border-white p-6 sm:p-8 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] space-y-5"
        >
          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#15803D]">
                  ACTIVITY 2 · CASE CLOSED
                </p>
                <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
                  THE MYSTERY OF THE LUCKY MESSAGE · SOLVED!
                </h2>
              </div>
              <span className="rounded-xl bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 text-xs font-extrabold text-[#15803D] inline-flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                <span>Segment 2 Activity 2 Complete</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="rounded-2xl bg-white/95 border border-purple-200 p-4 space-y-1.5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#7E22CE]">
                  Reading Comprehension (Q1–Q5)
                </p>
                <p className="text-lg font-extrabold text-[#0E3558] tabular-nums">
                  1st-Try Score: {firstAttemptScore} / 5 · Final Score: 5 / 5
                </p>
                <p className="text-xs font-medium text-[#475569]">
                  Successfully located key details about sender, promised prize, deadline, and personal info requests.
                </p>
              </div>

              <div className="rounded-2xl bg-white/95 border border-emerald-200 p-4 space-y-1.5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
                  Advice Writing Chat (3 / 3 Turns)
                </p>
                <ul className="text-xs font-semibold text-[#0E3558] space-y-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Asked for online-safety advice clearly
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Gave safe action advice using Year 5 phrases
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Responded politely &amp; saved transcript
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  playPortalOpen();
                  onProceedToUnlockCafe();
                }}
                className="aero-glossy-btn min-h-[48px] w-full sm:w-auto rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>SEE NEXT DETECTIVE LOCATION</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SCENE 10: Unlock Cyber Café
  const currentUnlockStep = SCREEN05_UNLOCK_CAFE_SCRIPT[unlockIdx];

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
              'linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(254,243,199,0.92) 55%, rgba(232,248,255,0.95) 100%)',
          }}
          className="aero-glass-card rounded-[30px] border-2 border-white p-6 sm:p-8 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.38)]"
        >
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5 rounded-2xl bg-gradient-to-b from-amber-50 via-white to-sky-50 border-2 border-white p-4 flex flex-col items-center justify-center gap-3 shadow-inner">
              <div className="flex items-end justify-center gap-3">
                <div className="w-20 h-26">
                  <DetectiveAvatar config={avatarConfig} view="front" pose="wave" />
                </div>
                <div className="w-18 h-16">
                  <PusheenIllustration expression="celebrating" pose="waving" />
                </div>
              </div>
              <span className="rounded-xl bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-extrabold text-[#B45309]">
                NEXT STOP: CYBER CAFÉ
              </span>
            </div>

            <div className="md:col-span-7 space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
                {cafeGateOpen ? (
                  <>
                    <LockOpen className="h-4 w-4" />
                    <span>NEW LOCATION UNLOCKED!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>UNLOCKING CYBER CAFÉ...</span>
                  </>
                )}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2">
                <Coffee className="h-6 w-6 text-[#D97706] shrink-0" />
                <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
                  CYBER CAFÉ
                </h2>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-[#18466E]">
                Great work helping Aina! The Cyber Café across Detective Town is now unlocked and
                ready for your next mission.
              </p>

              {unlockDone && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      playPortalOpen();
                      onVisitCyberCafe();
                    }}
                    className="aero-glossy-btn min-h-[50px] w-full sm:w-auto rounded-full bg-gradient-to-b from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] border border-white px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <DoorOpen className="h-5 w-5" />
                    <span>VISIT CYBER CAFÉ</span>
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
                if (unlockIdx + 1 < SCREEN05_UNLOCK_CAFE_SCRIPT.length) {
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
