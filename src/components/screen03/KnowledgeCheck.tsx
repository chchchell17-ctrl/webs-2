import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, HelpCircle, ShieldCheck } from 'lucide-react';
import { KNOWLEDGE_CHECK_OPTIONS } from '../../data/screen03Data.ts';
import {
  playErrorTone,
  playLoginSuccess,
  playPortalOpen,
} from '../../utils/soundEffects.ts';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface KnowledgeCheckProps {
  alreadyCompleted?: boolean;
  onComplete: () => void;
}

export const KnowledgeCheck: React.FC<KnowledgeCheckProps> = ({
  alreadyCompleted = false,
  onComplete,
}) => {
  const [selected, setSelected] = useState<'A' | 'B' | 'C' | null>(
    alreadyCompleted ? 'C' : null
  );

  const isCorrect = selected === 'C';
  const isWrong = selected === 'A' || selected === 'B';

  const handleChoose = (optId: 'A' | 'B' | 'C') => {
    setSelected(optId);
    if (optId === 'C') {
      playLoginSuccess();
    } else {
      playErrorTone();
    }
  };

  return (
    <div className="relative z-20 w-full max-w-3xl mx-auto px-3 sm:px-5 py-2 pointer-events-auto">
      <div
        style={{
          background:
            'linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(232,248,255,0.95) 55%, rgba(243,232,255,0.95) 100%)',
        }}
        className="aero-glass-card rounded-[30px] border-2 border-white p-5 sm:p-7 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.36)]"
      >
        <div className="relative z-10 space-y-4">
          {/* Pusheen Prompt Header */}
          <div className="flex items-center gap-3.5 rounded-2xl bg-sky-50/95 border border-sky-200 p-3.5">
            <div className="h-14 w-14 shrink-0">
              <PusheenIllustration
                expression={isCorrect ? 'celebrating' : isWrong ? 'thinking' : 'happy'}
                pose={isCorrect ? 'waving' : 'normal'}
              />
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#0E3558] space-y-0.5">
              <p className="font-extrabold text-[#0369A1]">Detective Pusheen:</p>
              {isCorrect ? (
                <>
                  <p>
                    &ldquo;That&apos;s right! Asking a trusted adult is a safe way to handle a
                    suspicious message.&rdquo;
                  </p>
                  <p>&ldquo;You&apos;re learning quickly, Detective!&rdquo;</p>
                </>
              ) : isWrong ? (
                <p>
                  &ldquo;Think about what you learned. Should you trust an unexpected message from
                  someone you don&apos;t know?&rdquo;
                </p>
              ) : (
                <p>&ldquo;Let&apos;s see if you&apos;ve learned something new, Detective!&rdquo;</p>
              )}
            </div>
          </div>

          {/* Scenario & Question */}
          <div className="rounded-2xl bg-white/95 border border-purple-200 p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#6D28D9]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>PUSHEEN&apos;S DETECTIVE CHECK</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-[#18466E]">
              You receive a message from someone you don&apos;t know. It says you can win a free
              tablet if you click a link.
            </p>
            <h2 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#0E3558] pt-1">
              WHAT SHOULD YOU DO?
            </h2>
          </div>

          {/* Immediate Feedback Banner */}
          {isCorrect && (
            <div
              role="status"
              className="rounded-2xl bg-emerald-50 border-2 border-emerald-300 px-4 py-2.5 flex items-center gap-2 text-sm font-extrabold text-[#15803D]"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>EXCELLENT WORK!</span>
            </div>
          )}

          {isWrong && (
            <div
              role="status"
              className="rounded-2xl bg-amber-50 border-2 border-amber-300 px-4 py-2.5 flex items-center gap-2 text-sm font-extrabold text-[#B45309]"
            >
              <HelpCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>TRY AGAIN! Pick the safest choice below.</span>
            </div>
          )}

          {/* Answer Options */}
          <div className="space-y-2.5">
            {KNOWLEDGE_CHECK_OPTIONS.map((opt) => {
              const isSelected = selected === opt.id;
              const rightOpt = isSelected && opt.id === 'C';
              const wrongOpt = isSelected && opt.id !== 'C';

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleChoose(opt.id)}
                  className={`w-full min-h-[54px] rounded-2xl border-2 p-3.5 text-left transition-all flex items-center gap-3 cursor-pointer ${
                    rightOpt
                      ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-200'
                      : wrongOpt
                        ? 'bg-amber-50/90 border-amber-400 animate-lock-wobble'
                        : 'bg-white/95 hover:bg-sky-50 border-sky-200 hover:border-sky-400 shadow-xs'
                  }`}
                >
                  <span
                    className={`h-8 w-8 rounded-xl font-extrabold text-sm flex items-center justify-center shrink-0 ${
                      rightOpt
                        ? 'bg-emerald-500 text-white'
                        : wrongOpt
                          ? 'bg-amber-500 text-white'
                          : 'bg-purple-100 text-[#6D28D9]'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#0E3558]">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {isCorrect && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  playPortalOpen();
                  onComplete();
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
  );
};
