import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';
import { SCREEN04_KNOWLEDGE_QUESTIONS } from '../../data/screen04Data.ts';
import type { Screen04KnowledgeAttempt } from '../../types/game.ts';
import {
  playErrorTone,
  playLoginSuccess,
  playPortalOpen,
} from '../../utils/soundEffects.ts';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface RedFlagKnowledgeCheckProps {
  initialAttempts: Record<string, Screen04KnowledgeAttempt>;
  onUpdateAttempts: (
    attempts: Record<string, Screen04KnowledgeAttempt>,
    firstAttemptScore: number,
    masteryAchieved: boolean
  ) => void;
  onCompleteQuiz: () => void;
}

export const RedFlagKnowledgeCheck: React.FC<RedFlagKnowledgeCheckProps> = ({
  initialAttempts,
  onUpdateAttempts,
  onCompleteQuiz,
}) => {
  const [attemptsMap, setAttemptsMap] = useState<Record<string, Screen04KnowledgeAttempt>>(
    initialAttempts
  );
  const [qIdx, setQIdx] = useState<number>(() => {
    const firstUnfinished = SCREEN04_KNOWLEDGE_QUESTIONS.findIndex(
      (q) => !initialAttempts[q.id]?.completed
    );
    return firstUnfinished >= 0 ? firstUnfinished : 0;
  });
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'retry' | 'correct'>(() =>
    initialAttempts[SCREEN04_KNOWLEDGE_QUESTIONS[qIdx]?.id]?.completed ? 'correct' : 'idle'
  );

  const currentQ = SCREEN04_KNOWLEDGE_QUESTIONS[qIdx];
  const totalQ = SCREEN04_KNOWLEDGE_QUESTIONS.length;

  const computeFirstScore = (map: Record<string, Screen04KnowledgeAttempt>) =>
    SCREEN04_KNOWLEDGE_QUESTIONS.filter((q) => map[q.id]?.firstCorrect).length;

  const handleChooseOption = (optionIdx: number) => {
    if (status === 'correct') return;

    setSelectedIdx(optionIdx);
    const existing = attemptsMap[currentQ.id];
    const isCorrect = optionIdx === currentQ.correctIndex;
    const isFirstAttempt = !existing;

    const updatedAttempt: Screen04KnowledgeAttempt = {
      firstChoiceIdx: existing ? existing.firstChoiceIdx : optionIdx,
      firstCorrect: existing ? existing.firstCorrect : isCorrect,
      attempts: (existing?.attempts ?? 0) + 1,
      completed: existing?.completed || isCorrect,
    };

    const nextMap = {
      ...attemptsMap,
      [currentQ.id]: updatedAttempt,
    };
    setAttemptsMap(nextMap);

    const firstScore = computeFirstScore(nextMap);
    const mastery = firstScore >= 4;
    onUpdateAttempts(nextMap, firstScore, mastery);

    if (isCorrect) {
      playLoginSuccess();
      setStatus('correct');
    } else {
      playErrorTone();
      setStatus('retry');
    }
  };

  const handleNextQuestion = () => {
    if (qIdx + 1 < totalQ) {
      const nextIdx = qIdx + 1;
      const nextQ = SCREEN04_KNOWLEDGE_QUESTIONS[nextIdx];
      setQIdx(nextIdx);
      setSelectedIdx(null);
      setStatus(attemptsMap[nextQ.id]?.completed ? 'correct' : 'idle');
      return;
    }

    playPortalOpen();
    onCompleteQuiz();
  };

  const currentFirstScore = computeFirstScore(attemptsMap);
  const completedCount = SCREEN04_KNOWLEDGE_QUESTIONS.filter((q) => attemptsMap[q.id]?.completed).length;

  return (
    <div className="relative z-20 w-full max-w-3xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div
        style={{
          background:
            'linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(232,248,255,0.95) 55%, rgba(255,241,242,0.95) 100%)',
        }}
        className="aero-glass-card rounded-[30px] border-2 border-white p-5 sm:p-7 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] space-y-5"
      >
        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#BE123C]">
              <HelpCircle className="h-4 w-4" />
              <span>RED FLAG KNOWLEDGE CHECK</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-extrabold tabular-nums text-[#0369A1]">
              <span>Question {qIdx + 1} of {totalQ}</span>
              <span className="text-[#475569]">·</span>
              <span>1st-Try Score: {currentFirstScore} / {totalQ}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full rounded-full bg-sky-100 overflow-hidden border border-white">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FB7185] via-[#F59E0B] to-[#34D399] transition-all duration-300"
              style={{ width: `${(completedCount / totalQ) * 100}%` }}
            />
          </div>

          {/* Question */}
          <h2 className="font-[var(--font-display)] text-lg sm:text-2xl font-bold text-[#0E3558] leading-snug">
            {currentQ.prompt}
          </h2>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              const isAnswer = idx === currentQ.correctIndex;

              let btnStyle =
                'bg-white hover:bg-sky-50 border-sky-200 text-[#0E3558]';
              if (status === 'correct' && isAnswer) {
                btnStyle =
                  'bg-emerald-50 border-emerald-400 text-[#14532D] ring-2 ring-emerald-200';
              } else if (status === 'retry' && isSelected) {
                btnStyle = 'bg-amber-50 border-amber-400 text-[#92400E]';
              }

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleChooseOption(idx)}
                  disabled={status === 'correct'}
                  className={`w-full min-h-[50px] text-left rounded-2xl border-2 px-4 py-3 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 transition-colors cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <span>
                    <span className="inline-block w-6 font-extrabold text-[#0284C7]">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </span>
                  {status === 'correct' && isAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Supportive Pusheen Feedback */}
          <div className="rounded-2xl bg-white/95 border border-sky-200 p-3.5 flex items-center gap-3">
            <div className="h-12 w-12 shrink-0">
              <PusheenIllustration
                expression={
                  status === 'correct'
                    ? 'celebrating'
                    : status === 'retry'
                      ? 'encouraging'
                      : 'curious'
                }
              />
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#0E3558]">
              <p className="font-extrabold text-[#0369A1]">Detective Pusheen:</p>
              {status === 'correct' ? (
                <p>{currentQ.explanation}</p>
              ) : status === 'retry' ? (
                <p>{currentQ.retryPrompt} (No stars or XP lost—take your time and try again!)</p>
              ) : (
                <p>Choose the best detective answer above based on what you spotted in AeroMail!</p>
              )}
            </div>
          </div>

          {status === 'correct' && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="aero-glossy-btn min-h-[48px] w-full sm:w-auto rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>{qIdx + 1 < totalQ ? 'NEXT QUESTION' : 'COMPLETE KNOWLEDGE CHECK'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
