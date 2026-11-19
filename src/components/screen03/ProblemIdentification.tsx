import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { PROBLEM_IDENTIFICATION_OPTIONS } from '../../data/screen03Data.ts';
import type { GameSettings } from '../../types/game.ts';
import {
  playErrorTone,
  playLoginSuccess,
  playPortalOpen,
} from '../../utils/soundEffects.ts';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';
import { InvestigationVideoPlayer } from './InvestigationVideoPlayer.tsx';

interface ProblemIdentificationProps {
  settings: GameSettings;
  alreadyIdentified?: boolean;
  onIdentified: () => void;
}

export const ProblemIdentification: React.FC<ProblemIdentificationProps> = ({
  settings,
  alreadyIdentified = false,
  onIdentified,
}) => {
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | null>(
    alreadyIdentified ? 'A' : null
  );

  const isCorrect = selectedOption === 'A';
  const isWrong = selectedOption === 'B' || selectedOption === 'C';

  const handleChoose = (optId: 'A' | 'B' | 'C') => {
    setSelectedOption(optId);
    if (optId === 'A') {
      playLoginSuccess();
    } else {
      playErrorTone();
    }
  };

  return (
    <div className="relative z-20 w-full max-w-6xl mx-auto px-3 sm:px-5 py-2 pointer-events-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT: Smaller Replayable Investigation Video Screen */}
        <div className="lg:col-span-5 space-y-2">
          <InvestigationVideoPlayer
            settings={settings}
            compact={true}
            alreadyWatched={true}
          />
          <p className="text-center text-xs font-bold text-[#0E3558] bg-white/80 rounded-full py-1 px-3 border border-white inline-block mx-auto w-full">
            Need a clue? Press Play or Replay anytime on the left screen.
          </p>
        </div>

        {/* RIGHT: Evidence Question & 3 Answer Cards */}
        <div
          style={{
            background:
              'linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(232,248,255,0.95) 60%, rgba(243,232,255,0.95) 100%)',
          }}
          className="lg:col-span-7 aero-glass-card rounded-[28px] border-2 border-white p-4 sm:p-6 shadow-[0_20px_50px_-10px_rgba(16,55,92,0.34)]"
        >
          <div className="relative z-10 space-y-4">
            {/* Pusheen Prompt */}
            <div className="flex items-center gap-3 rounded-2xl bg-sky-50/95 border border-sky-200 p-3">
              <div className="h-12 w-12 shrink-0">
                <PusheenIllustration
                  expression={isCorrect ? 'celebrating' : isWrong ? 'thinking' : 'curious'}
                />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#0E3558]">
                <p className="font-extrabold text-[#0369A1]">Detective Pusheen:</p>
                {isCorrect ? (
                  <p>
                    &ldquo;Well spotted! The student received an unexpected message promising a free
                    prize. That&apos;s our first important clue!&rdquo;
                  </p>
                ) : isWrong ? (
                  <p>
                    &ldquo;Think about the unusual message that appeared on the computer screen.
                    Watch the video again if you need to.&rdquo;
                  </p>
                ) : (
                  <p>&ldquo;Let&apos;s review the evidence!&rdquo;</p>
                )}
              </div>
            </div>

            {/* Question Title */}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#6D28D9]">
                WHAT IS THE PROBLEM?
              </p>
              <h2 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#0E3558] mt-0.5">
                What happened to the student in the video?
              </h2>
            </div>

            {/* Feedback Banner */}
            {isCorrect && (
              <div
                role="status"
                className="rounded-2xl bg-emerald-50 border-2 border-emerald-300 px-4 py-2.5 flex items-center gap-2 text-sm font-extrabold text-[#15803D]"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>CORRECT!</span>
              </div>
            )}

            {isWrong && (
              <div
                role="status"
                className="rounded-2xl bg-amber-50 border-2 border-amber-300 px-4 py-2.5 flex items-center gap-2 text-sm font-extrabold text-[#B45309]"
              >
                <HelpCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>NOT QUITE, DETECTIVE! Try choosing another clue below.</span>
              </div>
            )}

            {/* Three Answer Cards */}
            <div className="space-y-2.5">
              {PROBLEM_IDENTIFICATION_OPTIONS.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const optionRight = isSelected && opt.id === 'A';
                const optionWrong = isSelected && opt.id !== 'A';

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleChoose(opt.id)}
                    className={`w-full min-h-[54px] rounded-2xl border-2 p-3.5 text-left transition-all flex items-start gap-3 cursor-pointer ${
                      optionRight
                        ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-200'
                        : optionWrong
                          ? 'bg-amber-50/90 border-amber-400 animate-lock-wobble'
                          : 'bg-white/95 hover:bg-sky-50 border-sky-200 hover:border-sky-400 shadow-xs'
                    }`}
                  >
                    <span
                      className={`h-8 w-8 rounded-xl font-extrabold text-sm flex items-center justify-center shrink-0 ${
                        optionRight
                          ? 'bg-emerald-500 text-white'
                          : optionWrong
                            ? 'bg-amber-500 text-white'
                            : 'bg-sky-100 text-[#0369A1]'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#0E3558] leading-snug pt-0.5">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Continue CTA (unlocked once Option A is selected) */}
            {isCorrect && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    onIdentified();
                  }}
                  className="aero-glossy-btn min-h-[48px] w-full sm:w-auto rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
