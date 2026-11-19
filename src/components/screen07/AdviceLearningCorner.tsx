import React, { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, MessageSquareQuote, Sparkles } from 'lucide-react';
import { ADVICE_LEARNING_CARDS, type AdviceLearningCard } from '../../data/screen07Data.ts';
import { playPortalOpen, playSoftSelect } from '../../utils/soundEffects.ts';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface AdviceLearningCornerProps {
  initialExplored: { card1: boolean; card2: boolean; card3: boolean };
  onUpdateExplored: (explored: { card1: boolean; card2: boolean; card3: boolean }) => void;
  onProceedToScenario: () => void;
}

export const AdviceLearningCorner: React.FC<AdviceLearningCornerProps> = ({
  initialExplored,
  onUpdateExplored,
  onProceedToScenario,
}) => {
  const [explored, setExplored] = useState(initialExplored);
  const [expandedId, setExpandedId] = useState<AdviceLearningCard['id']>('card1');

  const handleOpenCard = (cardId: AdviceLearningCard['id']) => {
    playSoftSelect();
    setExpandedId(cardId);
    if (!explored[cardId]) {
      const next = { ...explored, [cardId]: true };
      setExplored(next);
      onUpdateExplored(next);
    }
  };

  const countExplored = [explored.card1, explored.card2, explored.card3].filter(Boolean).length;

  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-5 pb-10 pointer-events-auto">
      <div className="rounded-[32px] border-2 border-white bg-white/95 p-5 sm:p-7 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] space-y-5 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C3AED] inline-flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span>MISSION 04 · ADVICE LEARNING CORNER</span>
            </p>
            <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558]">
              Tap each card to read helpful sentence examples before writing!
            </h2>
          </div>

          <span className="rounded-2xl bg-purple-50 border border-purple-200 px-3.5 py-1.5 text-xs font-extrabold text-[#6D28D9]">
            {countExplored} / 3 CARDS OPENED
          </span>
        </div>

        {/* 3 Clickable Expandable Learning Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ADVICE_LEARNING_CARDS.map((card) => {
            const isOpen = expandedId === card.id;
            const isDone = explored[card.id];
            return (
              <div
                key={card.id}
                onClick={() => handleOpenCard(card.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenCard(card.id);
                  }
                }}
                className={`rounded-[24px] border-2 p-4 sm:p-5 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isOpen
                    ? 'bg-gradient-to-b from-white to-sky-50/80 border-sky-400 shadow-lg ring-4 ring-sky-200/50'
                    : isDone
                      ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      style={{ color: card.accentColor }}
                      className="text-[10px] font-extrabold uppercase tracking-wider"
                    >
                      {card.badge}
                    </span>
                    {isDone && (
                      <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0" />
                    )}
                  </div>

                  <h3 className="font-[var(--font-display)] text-lg font-bold text-[#0E3558]">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-medium text-[#334155] leading-relaxed">
                    {card.summary}
                  </p>

                  {/* Helpful Expressions Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {card.expressions.map((expr) => (
                      <span
                        key={expr}
                        className="rounded-lg bg-white border border-sky-200 px-2.5 py-1 text-[11px] font-bold text-[#0E3558]"
                      >
                        {expr}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expanded Speech Bubble Example & Pusheen Tip */}
                {isOpen && (
                  <div className="mt-2 pt-3 border-t border-sky-100 space-y-2.5">
                    <div className="rounded-2xl bg-white border border-purple-200 p-3 shadow-xs">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C3AED] inline-flex items-center gap-1">
                        <MessageSquareQuote className="h-3.5 w-3.5" />
                        <span>{card.exampleSpeaker}</span>
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-[#0E3558] mt-1">
                        {card.exampleLine}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2">
                      <div className="w-8 h-8 shrink-0">
                        <PusheenIllustration expression="happy" />
                      </div>
                      <p className="text-[11px] font-bold text-[#92400E]">{card.pusheenTip}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-xs font-bold text-[#475569]">
            Tip: Click all 3 cards to unlock every example phrase, then start writing!
          </p>

          <button
            type="button"
            onClick={() => {
              playPortalOpen();
              onUpdateExplored({ card1: true, card2: true, card3: true });
              onProceedToScenario();
            }}
            className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] border border-white px-7 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>LET&apos;S WRITE!</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
