import React, { useEffect, useState } from 'react';
import {
  Gift,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  Tablet,
  X,
} from 'lucide-react';
import type { GameSettings } from '../../types/game.ts';
import {
  playErrorTone,
  playLoginSuccess,
  playMascotChirp,
  playPortalOpen,
} from '../../utils/soundEffects.ts';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface YesNoDecisionChallengeProps {
  settings: GameSettings;
  initialChoice?: 'yes' | 'no' | null;
  phase: 'decision' | 'decision-feedback';
  onChooseDecision: (choice: 'yes' | 'no') => void;
  onConvergeToLesson: () => void;
}

export const YesNoDecisionChallenge: React.FC<YesNoDecisionChallengeProps> = ({
  settings,
  initialChoice = null,
  phase,
  onChooseDecision,
  onConvergeToLesson,
}) => {
  const [choice, setChoice] = useState<'yes' | 'no' | null>(initialChoice);
  const [yesFeedbackStep, setYesFeedbackStep] = useState<0 | 1>(0);
  const [popupDismissed, setPopupDismissed] = useState(false);

  // Play unexpected notification alert sound on initial pop-up appearance
  useEffect(() => {
    if (phase === 'decision') {
      setPopupDismissed(false);
      setYesFeedbackStep(0);
      const t = window.setTimeout(() => {
        playMascotChirp();
      }, 180);
      return () => window.clearTimeout(t);
    }
  }, [phase]);

  const handleSelectYes = () => {
    setChoice('yes');
    setYesFeedbackStep(0);
    playErrorTone();
    onChooseDecision('yes');
    window.setTimeout(() => {
      setPopupDismissed(true);
    }, settings.reducedMotion ? 150 : 950);
  };

  const handleSelectNo = () => {
    setChoice('no');
    setPopupDismissed(true);
    playLoginSuccess();
    onChooseDecision('no');
  };

  const activeChoice = choice ?? initialChoice;
  const isFeedbackPhase = phase === 'decision-feedback' && activeChoice !== null;

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-10 bg-[#0B2945]/40 backdrop-blur-sm pointer-events-none transition-opacity duration-300"
      />
      <div
        className={`relative z-20 w-full max-w-4xl mx-auto px-2 sm:px-4 ${
          isFeedbackPhase ? 'pb-44 sm:pb-48' : 'pb-6'
        } flex flex-col items-center justify-center pointer-events-auto`}
      >
        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* LEFT / MAIN FOCUS: Computer Pop-up Desktop Window */}
            <div className="lg:col-span-8 flex flex-col items-center">
              {/* Realistic Digital Notification Pop-up */}
              <div
                className={`relative w-full max-w-md rounded-[26px] border-2 border-white bg-gradient-to-b from-white via-[#F0F9FF] to-[#FFFBEB] shadow-[0_26px_65px_-12px_rgba(14,53,88,0.52)] overflow-hidden transition-all duration-500 ${
                  isFeedbackPhase && activeChoice === 'yes' && !popupDismissed
                    ? 'animate-lock-wobble ring-4 ring-amber-400'
                    : isFeedbackPhase && popupDismissed
                      ? 'opacity-30 scale-95 pointer-events-none'
                      : 'opacity-100 scale-100'
                }`}
              >
                {/* Window Title Bar */}
                <div className="bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#7C3AED] px-4 py-2.5 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2 min-w-0">
                    <Gift className="h-4 w-4 text-amber-200 shrink-0" aria-hidden="true" />
                    <span className="text-xs font-extrabold tracking-wider uppercase truncate">
                      LUCKY PRIZE CENTRE
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="rounded-md bg-amber-300 px-2 py-0.5 text-[10px] font-extrabold text-[#1E1B4B]">
                      NEW MESSAGE
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center"
                    >
                      <X className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>

                {/* Pop-up Message Content */}
                <div className="p-5 sm:p-6 text-center space-y-3 relative">
                  <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-50 border border-sky-200 px-4 py-2 shadow-xs">
                    <Tablet className="h-7 w-7 text-[#0284C7]" aria-hidden="true" />
                    <div className="text-left leading-tight">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-[#EA580C]">
                        YOU&apos;RE A WINNER!
                      </p>
                      <p className="font-[var(--font-display)] text-lg font-extrabold text-[#0369A1]">
                        FREE TABLET!
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="font-[var(--font-display)] text-lg font-bold text-[#0E3558]">
                      Congratulations!
                    </p>
                    <p className="text-sm font-semibold text-[#18466E]">
                      You have been selected to receive an amazing prize.
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-[#0369A1]">
                      Click the button below to claim your reward immediately!
                    </p>
                  </div>

                  {/* Mock Claim Now Visual Inside Notification */}
                  <div className="relative pt-1 pb-1 flex justify-center">
                    <div
                      className={`rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] border-2 border-white px-7 py-2.5 text-sm font-extrabold text-white shadow-lg ${
                        !isFeedbackPhase && !settings.reducedMotion ? 'animate-pulse' : ''
                      }`}
                    >
                      CLAIM NOW!
                    </div>

                    {/* Animated Cursor Hovering Near Claim Button */}
                    {!isFeedbackPhase && (
                      <div
                        aria-hidden="true"
                        className={`absolute -bottom-1 right-[24%] pointer-events-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)] ${
                          settings.reducedMotion ? '' : 'animate-bounce'
                        }`}
                      >
                        <MousePointer2 className="h-6 w-6 text-white fill-[#0E3558]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Large Touch-Friendly Decision Prompt & YES / NO Buttons */}
              {!isFeedbackPhase && (
                <div className="mt-4 w-full max-w-md rounded-[24px] bg-white/94 border-2 border-white p-4 shadow-xl text-center space-y-3">
                  <h2 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#0E3558]">
                    WOULD YOU CLICK THIS MESSAGE?
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleSelectYes}
                      className="aero-glossy-btn min-h-[58px] rounded-2xl bg-gradient-to-b from-[#38BDF8] to-[#0284C7] hover:from-[#7DD3FC] hover:to-[#0369A1] border-2 border-white px-5 py-3 text-base sm:text-lg font-extrabold text-white shadow-md transition-transform hover:scale-[1.03] active:scale-95 cursor-pointer"
                    >
                      YES
                    </button>

                    <button
                      type="button"
                      onClick={handleSelectNo}
                      className="aero-glossy-btn min-h-[58px] rounded-2xl bg-gradient-to-b from-[#A855F7] to-[#7C3AED] hover:from-[#C084FC] hover:to-[#6D28D9] border-2 border-white px-5 py-3 text-base sm:text-lg font-extrabold text-white shadow-md transition-transform hover:scale-[1.03] active:scale-95 cursor-pointer"
                    >
                      NO
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Detective Pusheen Reaction */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-[26px] bg-white/92 border-2 border-white p-4 sm:p-5 shadow-xl text-center space-y-2 relative overflow-hidden">
              {isFeedbackPhase && activeChoice === 'no' && (
                <div
                  aria-hidden="true"
                  className="absolute top-3 right-3 text-amber-500 flex items-center gap-1"
                >
                  <Sparkles className={`h-5 w-5 ${settings.reducedMotion ? '' : 'animate-pulse'}`} />
                </div>
              )}

              <div className="w-24 h-20 sm:w-32 sm:h-28">
                <PusheenIllustration
                  expression={
                    !isFeedbackPhase
                      ? 'surprised'
                      : activeChoice === 'yes'
                        ? 'surprised'
                        : 'celebrating'
                  }
                  pose={isFeedbackPhase && activeChoice === 'no' ? 'waving' : 'normal'}
                />
              </div>

              <p className="text-xs font-extrabold uppercase tracking-wider text-[#0369A1]">
                Detective Pusheen
              </p>

              {!isFeedbackPhase ? (
                <p className="text-xs sm:text-sm font-semibold text-[#0E3558]">
                  &ldquo;Whoa! That popped up out of nowhere! What would you do, Detective?&rdquo;
                </p>
              ) : activeChoice === 'yes' ? (
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-bold text-[#92400E] flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <span>Let&apos;s check the HQ investigation screen together!</span>
                </div>
              ) : (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-bold text-[#15803D] flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#16A34A] shrink-0" aria-hidden="true" />
                  <span>Smart thinking! Moving to the HQ investigation screen.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-Pinned Branch-Specific Pusheen Dialogue Feedback */}
      {isFeedbackPhase && activeChoice === 'yes' && (
        <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
          <div className="pointer-events-auto">
            <DialogueBox
              speaker="pusheen"
              expression="surprised"
              text={
                yesFeedbackStep === 0
                  ? 'Oh no, Detective! You have to learn more about Online Safety.'
                  : "Don't worry! That's exactly why we're here. Let's investigate together!"
              }
              settings={settings}
              nextLabel={yesFeedbackStep === 0 ? 'NEXT' : 'LEARN ABOUT ONLINE SAFETY'}
              onReplay={() => setYesFeedbackStep(0)}
              onSkipAll={() => {
                playPortalOpen();
                onConvergeToLesson();
              }}
              onNext={() => {
                if (yesFeedbackStep === 0) {
                  setYesFeedbackStep(1);
                } else {
                  playPortalOpen();
                  onConvergeToLesson();
                }
              }}
            />
          </div>
        </div>
      )}

      {isFeedbackPhase && activeChoice === 'no' && (
        <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
          <div className="pointer-events-auto">
            <DialogueBox
              speaker="pusheen"
              expression="celebrating"
              text="Great job, Detective! Let's learn more about Online Safety."
              settings={settings}
              nextLabel="LEARN ABOUT ONLINE SAFETY"
              onNext={() => {
                playPortalOpen();
                onConvergeToLesson();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
