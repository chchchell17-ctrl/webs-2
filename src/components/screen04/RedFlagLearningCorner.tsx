import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flag,
  Link2,
  MailWarning,
  Sparkles,
} from 'lucide-react';
import {
  RED_FLAG_LEARNING_CARDS,
  type RedFlagLearningCard,
} from '../../data/screen04Data.ts';
import type { GameSettings } from '../../types/game.ts';
import { playLoginSuccess, playPortalOpen, playSoftSelect } from '../../utils/soundEffects.ts';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface RedFlagLearningCornerProps {
  settings: GameSettings;
  explored: {
    example1: boolean;
    example2: boolean;
    example3: boolean;
  };
  onExploreExample: (id: 'example1' | 'example2' | 'example3') => void;
  onContinueToComputer: () => void;
}

const CardIllustration: React.FC<{ id: 'example1' | 'example2' | 'example3' }> = ({ id }) => {
  if (id === 'example1') {
    return (
      <svg viewBox="0 0 210 130" className="w-40 h-26" aria-hidden="true">
        <rect x="8" y="8" width="194" height="114" rx="18" fill="#FFE4E6" stroke="#FFFFFF" strokeWidth="3" />
        <rect x="24" y="28" width="162" height="74" rx="12" fill="#FFFFFF" stroke="#FB7185" strokeWidth="2.5" />
        <circle cx="52" cy="56" r="14" fill="#FDA4AF" />
        <text x="52" y="61" textAnchor="middle" fill="#881337" fontSize="14" fontWeight="900">
          ?
        </text>
        <rect x="76" y="45" width="94" height="8" rx="4" fill="#BE123C" />
        <rect x="76" y="60" width="74" height="7" rx="3.5" fill="#FECDD3" />
        <rect x="38" y="80" width="132" height="8" rx="4" fill="#F1F5F9" />
      </svg>
    );
  }
  if (id === 'example2') {
    return (
      <svg viewBox="0 0 210 130" className="w-40 h-26" aria-hidden="true">
        <rect x="8" y="8" width="194" height="114" rx="18" fill="#FEF3C7" stroke="#FFFFFF" strokeWidth="3" />
        <rect x="28" y="34" width="76" height="62" rx="12" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2.5" />
        <rect x="52" y="46" width="28" height="24" rx="4" fill="#FDE047" stroke="#D97706" strokeWidth="2" />
        <text x="66" y="63" textAnchor="middle" fill="#92400E" fontSize="11" fontWeight="900">
          FREE
        </text>
        <circle cx="146" cy="65" r="28" fill="#FFFFFF" stroke="#EA580C" strokeWidth="3" />
        <line x1="146" y1="65" x2="146" y2="48" stroke="#EA580C" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="146" y1="65" x2="160" y2="70" stroke="#EA580C" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 210 130" className="w-40 h-26" aria-hidden="true">
      <rect x="8" y="8" width="194" height="114" rx="18" fill="#EDE9FE" stroke="#FFFFFF" strokeWidth="3" />
      <rect x="24" y="28" width="162" height="74" rx="12" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="2.5" />
      <rect x="42" y="42" width="126" height="18" rx="9" fill="#DDD6FE" />
      <text x="105" y="54" textAnchor="middle" fill="#5B21B6" fontSize="9.5" fontWeight="900">
        http://claim-now.biz
      </text>
      <rect x="42" y="70" width="84" height="16" rx="6" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
      <circle cx="152" cy="78" r="11" fill="#F43F5E" />
      <text x="152" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900">
        !
      </text>
    </svg>
  );
};

export const RedFlagLearningCorner: React.FC<RedFlagLearningCornerProps> = ({
  explored,
  onExploreExample,
  onContinueToComputer,
}) => {
  const [activeCard, setActiveCard] = useState<RedFlagLearningCard | null>(null);
  const exploredCount =
    Number(explored.example1) + Number(explored.example2) + Number(explored.example3);
  const allExplored = exploredCount === 3;

  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-5 pb-8 flex flex-col gap-4 pointer-events-auto">
      <div className="rounded-[24px] bg-white/94 backdrop-blur-md border-2 border-white px-5 py-3.5 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#BE123C]">
            RED FLAG LEARNING CORNER · MISSION 02 PREPARATION
          </p>
          <h2 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#0E3558]">
            Click each warning-sign card to study how to spot hidden red flags!
          </h2>
        </div>

        <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold tabular-nums text-[#BE123C]">
          {exploredCount} / 3 Signs Studied
        </div>
      </div>

      {activeCard ? (
        <div
          style={{
            background:
              'linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(255,241,242,0.95) 50%, rgba(232,248,255,0.95) 100%)',
          }}
          className="aero-glass-card rounded-[28px] border-2 border-white p-5 sm:p-7 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)]"
        >
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-white/95 border border-rose-100 p-5 shadow-inner text-center gap-2">
              <CardIllustration id={activeCard.id} />
              <span className={`text-xs font-extrabold uppercase tracking-wider ${activeCard.accentText}`}>
                WARNING SIGN #{activeCard.number} · {activeCard.tag}
              </span>
            </div>

            <div className="md:col-span-7 space-y-3 text-left">
              <h3 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558]">
                {activeCard.title}
              </h3>

              <div className="rounded-2xl bg-white border border-rose-200 p-3.5 space-y-1">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#BE123C]">
                  EXAMPLE TO WATCH OUT FOR ({activeCard.exampleHeadline})
                </p>
                <p className="font-mono text-xs sm:text-sm font-bold text-[#0E3558] bg-rose-50/70 rounded-lg px-3 py-2 border border-rose-100">
                  {activeCard.exampleSample}
                </p>
              </div>

              <div className="rounded-2xl bg-sky-50/90 border border-sky-200 p-3.5 text-xs sm:text-sm font-semibold text-[#0E3558]">
                <p className="font-extrabold text-[#0369A1] mb-1">What to notice:</p>
                <p>{activeCard.whatToWatch}</p>
              </div>

              <div className="rounded-2xl bg-white/95 border border-purple-200 p-3.5 flex items-start gap-3">
                <div className="h-12 w-12 shrink-0">
                  <PusheenIllustration expression="encouraging" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#0E3558]">
                  <p className="font-extrabold text-[#6D28D9]">Detective Pusheen says:</p>
                  <p>&ldquo;{activeCard.pusheenTip}&rdquo;</p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const willFinishAll = !explored[activeCard.id] && exploredCount + 1 === 3;
                    if (willFinishAll) {
                      playLoginSuccess();
                    } else {
                      playSoftSelect();
                    }
                    onExploreExample(activeCard.id);
                    setActiveCard(null);
                  }}
                  className="aero-glossy-btn min-h-[46px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-7 py-2 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>GOT IT! BACK TO CARDS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {RED_FLAG_LEARNING_CARDS.map((card) => {
              const isDone = explored[card.id];
              const CardIcon =
                card.id === 'example1' ? MailWarning : card.id === 'example2' ? Clock : Link2;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    playSoftSelect();
                    setActiveCard(card);
                  }}
                  className={`group rounded-[26px] border-2 p-5 bg-gradient-to-b ${card.accentBg} ${
                    isDone ? 'border-emerald-400 ring-2 ring-emerald-200/80' : card.borderColor
                  } shadow-[0_14px_34px_-10px_rgba(16,55,92,0.24)] flex flex-col items-center justify-between text-center gap-3 transition-transform duration-150 hover:-translate-y-1 cursor-pointer`}
                >
                  <div className="w-full flex items-center justify-between text-xs font-extrabold">
                    <span className={`inline-flex items-center gap-1 ${card.accentText}`}>
                      <CardIcon className="h-4 w-4" />
                      SIGN #{card.number}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] ${
                        isDone ? 'bg-emerald-100 text-[#15803D]' : 'bg-white/90 text-[#0E3558]'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>STUDIED</span>
                        </>
                      ) : (
                        <span>TAP TO STUDY</span>
                      )}
                    </span>
                  </div>

                  <div className="transition-transform duration-150 group-hover:scale-105">
                    <CardIllustration id={card.id} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-[var(--font-display)] text-base font-bold text-[#0E3558] leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#475569]">{card.tag}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {allExplored ? (
            <div className="rounded-[24px] bg-gradient-to-r from-emerald-50 via-white to-sky-50 border-2 border-emerald-300 p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0">
                  <PusheenIllustration expression="celebrating" pose="waving" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#15803D] inline-flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>READY FOR THE COMPUTER LAB!</span>
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-[#0E3558]">
                    <strong>Detective Pusheen:</strong> &ldquo;Awesome! Now you know what to look for.
                    Let&apos;s sit at the investigation computer and inspect a real email!&rdquo;
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playPortalOpen();
                  onContinueToComputer();
                }}
                className="aero-glossy-btn min-h-[48px] w-full sm:w-auto rounded-full bg-gradient-to-b from-[#FB7185] to-[#E11D48] hover:from-[#FDA4AF] hover:to-[#BE123C] px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Flag className="h-4 w-4" />
                <span>SIT AT INVESTIGATION COMPUTER</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/92 border border-white p-3.5 flex items-center gap-3 shadow-sm">
              <div className="h-11 w-11 shrink-0">
                <PusheenIllustration expression="encouraging" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#0E3558]">
                <strong>Detective Pusheen:</strong> &ldquo;Click all three red flag cards above before
                sitting at the AeroMail investigation computer!&rdquo;
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
