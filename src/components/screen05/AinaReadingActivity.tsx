import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  AINA_READING_PASSAGE,
  SCREEN05_READING_QUESTIONS,
  validateReadingAnswer,
} from '../../data/screen05Data.ts';
import type {
  AvatarConfig,
  Screen05ReadingResponse,
} from '../../types/game.ts';
import {
  playErrorTone,
  playLoginSuccess,
  playPortalOpen,
} from '../../utils/soundEffects.ts';
import { AinaIllustration } from '../game/AinaIllustration.tsx';
import { DetectiveAvatarPortrait } from '../game/DetectiveAvatar.tsx';
import { AinaPhoneMessage } from './AinaPhoneMessage.tsx';

interface AinaReadingActivityProps {
  avatarConfig: AvatarConfig;
  nickname: string;
  initialResponses: Screen05ReadingResponse[];
  onRecordProgress: (
    responses: Screen05ReadingResponse[],
    firstAttemptScore: number,
    readCaseFile: boolean
  ) => void;
  onCompleteReading: (
    responses: Screen05ReadingResponse[],
    firstAttemptScore: number
  ) => void;
}

export const AinaReadingActivity: React.FC<AinaReadingActivityProps> = ({
  avatarConfig,
  nickname,
  initialResponses,
  onRecordProgress,
  onCompleteReading,
}) => {
  const [responses, setResponses] = useState<Screen05ReadingResponse[]>(initialResponses);
  const [qIdx, setQIdx] = useState<number>(() => {
    const firstUnanswered = SCREEN05_READING_QUESTIONS.findIndex(
      (q) => !initialResponses.some((r) => r.questionNumber === q.number && r.finalCorrectAnswer)
    );
    return firstUnanswered >= 0 ? firstUnanswered : 0;
  });
  const [inputValue, setInputValue] = useState('');
  const [lastFeedback, setLastFeedback] = useState<{
    correct: boolean;
    text: string;
  } | null>(() => {
    const existing = initialResponses.find(
      (r) => r.questionNumber === SCREEN05_READING_QUESTIONS[qIdx]?.number
    );
    if (existing?.finalCorrectAnswer) {
      return {
        correct: true,
        text: SCREEN05_READING_QUESTIONS[qIdx].correctResponse,
      };
    }
    return null;
  });
  const [pendingAttempts, setPendingAttempts] = useState<{
    firstAnswer: string;
    attemptCount: number;
  } | null>(null);
  const [caseInspected, setCaseInspected] = useState(initialResponses.length > 0);

  const currentQ = SCREEN05_READING_QUESTIONS[qIdx];
  const totalQ = SCREEN05_READING_QUESTIONS.length;
  const currentSolved = responses.some(
    (r) => r.questionNumber === currentQ.number && Boolean(r.finalCorrectAnswer)
  );

  const computeFirstAttemptScore = (list: Screen05ReadingResponse[]) =>
    list.filter((r) => r.firstAttemptCorrect).length;

  const handleSubmitAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentSolved) return;

    const trimmed = inputValue.trim();
    const verdict = validateReadingAnswer(currentQ.number, trimmed);

    const nextAttemptCount = (pendingAttempts?.attemptCount ?? 0) + 1;
    const firstAnswer = pendingAttempts ? pendingAttempts.firstAnswer : trimmed;

    if (!verdict.correct) {
      playErrorTone();
      setPendingAttempts({
        firstAnswer,
        attemptCount: nextAttemptCount,
      });
      setLastFeedback({
        correct: false,
        text: verdict.feedback,
      });
      return;
    }

    playLoginSuccess();
    const record: Screen05ReadingResponse = {
      questionNumber: currentQ.number,
      firstAnswer,
      finalCorrectAnswer: trimmed,
      attemptCount: nextAttemptCount,
      firstAttemptCorrect: nextAttemptCount === 1,
    };

    const nextList = [
      ...responses.filter((r) => r.questionNumber !== currentQ.number),
      record,
    ].sort((a, b) => a.questionNumber - b.questionNumber);

    const score = computeFirstAttemptScore(nextList);
    setResponses(nextList);
    setPendingAttempts(null);
    setLastFeedback({
      correct: true,
      text: verdict.feedback,
    });
    setCaseInspected(true);
    onRecordProgress(nextList, score, true);
  };

  const handleAdvanceQuestion = () => {
    if (qIdx + 1 < totalQ) {
      const nextIdx = qIdx + 1;
      const nextQ = SCREEN05_READING_QUESTIONS[nextIdx];
      const existing = responses.find((r) => r.questionNumber === nextQ.number);
      setQIdx(nextIdx);
      setInputValue(existing?.finalCorrectAnswer || '');
      setPendingAttempts(null);
      setLastFeedback(
        existing?.finalCorrectAnswer
          ? { correct: true, text: nextQ.correctResponse }
          : null
      );
      return;
    }

    playPortalOpen();
    onCompleteReading(responses, computeFirstAttemptScore(responses));
  };

  const firstScore = computeFirstAttemptScore(responses);

  return (
    <div className="relative z-20 w-full max-w-6xl mx-auto px-3 sm:px-5 pb-8 space-y-4 pointer-events-auto">
      {/* Top Side-by-Side Split: Smartphone Left, Persistent Reading Passage Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* LEFT: Realistic Smartphone Showing Lucky Rewards Message */}
        <div className="lg:col-span-5 rounded-[28px] border-2 border-white bg-white/88 backdrop-blur-md p-4 shadow-lg flex flex-col items-center justify-center">
          <AinaPhoneMessage
            onInspected={() => {
              if (!caseInspected) {
                setCaseInspected(true);
                onRecordProgress(responses, firstScore, true);
              }
            }}
          />
        </div>

        {/* RIGHT: Persistent Always-Visible 3-Paragraph Reading Passage */}
        <article
          aria-label="The Mystery of the Lucky Message reading passage"
          className="lg:col-span-7 rounded-[28px] border-2 border-white bg-white/95 p-5 sm:p-6 shadow-lg flex flex-col justify-between text-left"
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-100 pb-3">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#DB2777]">
                <BookOpen className="h-4 w-4" />
                <span>CASE STORY · KEEP READING WHILE ANSWERING</span>
              </div>
              <span className="text-xs font-bold text-[#0369A1]">Year 5 Reading Evidence</span>
            </div>

            <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558]">
              {AINA_READING_PASSAGE.title}
            </h2>

            <div className="space-y-3 max-h-[260px] lg:max-h-none overflow-y-auto pr-1 text-sm sm:text-base font-medium text-[#18466E] leading-relaxed">
              {AINA_READING_PASSAGE.paragraphs.map((para, idx) => (
                <p key={idx} className="rounded-2xl bg-sky-50/70 border border-sky-100 p-3.5">
                  <span className="font-extrabold text-[#0284C7] mr-1.5">[{idx + 1}]</span>
                  {para}
                </p>
              ))}
            </div>
          </div>

          <p className="mt-3 text-xs font-semibold text-[#64748B]">
            Read paragraphs [1], [2], and [3] carefully to answer Aina&apos;s questions below in your own words.
          </p>
        </article>
      </div>

      {/* Interactive Typed Comprehension Conversation with Aina (NO MCQs) */}
      <section
        aria-label="Reading comprehension conversation with Aina"
        style={{
          background:
            'linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(253,242,248,0.94) 55%, rgba(232,248,255,0.95) 100%)',
        }}
        className="aero-glass-card rounded-[28px] border-2 border-white p-5 sm:p-6 shadow-[0_20px_50px_-12px_rgba(16,55,92,0.3)]"
      >
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-xl bg-pink-100 border border-pink-200 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#BE185D] tabular-nums">
              QUESTION {currentQ.number} OF {totalQ}
            </span>
            <span className="text-xs font-extrabold text-[#0369A1] tabular-nums">
              1st-Try Accuracy: {firstScore} / {totalQ} · Completed: {responses.length} / {totalQ}
            </span>
          </div>

          {/* Aina's Question Bubble */}
          <div className="flex items-start gap-3">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-pink-50 border border-pink-200 p-1 shrink-0">
              <AinaIllustration
                expression={
                  lastFeedback?.correct
                    ? 'happy'
                    : lastFeedback && !lastFeedback.correct
                      ? 'thinking'
                      : 'curious'
                }
              />
            </div>
            <div className="flex-1 rounded-2xl bg-white border border-pink-200 p-3.5 sm:p-4 text-left shadow-xs">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#DB2777]">
                AINA ASKS:
              </p>
              <p className="mt-1 font-[var(--font-display)] text-base sm:text-lg font-bold text-[#0E3558]">
                &ldquo;{currentQ.ainaQuestion}&rdquo;
              </p>
            </div>
          </div>

          {/* Typed Answer Input Form */}
          <form onSubmit={handleSubmitAnswer} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-purple-50 border border-purple-200 p-1 shrink-0 items-center justify-center">
              <DetectiveAvatarPortrait config={avatarConfig} className="w-full h-full" />
            </div>
            <label className="sr-only" htmlFor="reading-answer-input">
              Type your answer as {nickname}
            </label>
            <input
              id="reading-answer-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={currentSolved}
              placeholder={currentQ.placeholder}
              autoComplete="off"
              className="flex-1 min-h-[48px] rounded-2xl border-2 border-sky-200 bg-white px-4 py-2 text-sm sm:text-base font-semibold text-[#0E3558] focus:outline-none focus-visible:border-pink-400 focus-visible:ring-4 focus-visible:ring-pink-200 disabled:bg-emerald-50 disabled:border-emerald-300"
            />
            {!currentSolved && (
              <button
                type="submit"
                className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#EC4899] to-[#BE185D] hover:from-[#F472B6] hover:to-[#9D174D] px-6 py-2 text-sm font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>REPLY TO AINA</span>
              </button>
            )}
          </form>

          {/* Aina's Supportive Response */}
          {lastFeedback && (
            <div
              className={`rounded-2xl border p-3.5 flex flex-wrap items-center justify-between gap-3 ${
                lastFeedback.correct
                  ? 'bg-emerald-50 border-emerald-300 text-[#14532D]'
                  : 'bg-amber-50 border-amber-300 text-[#92400E]'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-left">
                {lastFeedback.correct ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                ) : (
                  <Sparkles className="h-5 w-5 text-amber-600 shrink-0" />
                )}
                <span>
                  <strong>Aina:</strong> &ldquo;{lastFeedback.text}&rdquo;
                </span>
              </div>

              {currentSolved && (
                <button
                  type="button"
                  onClick={handleAdvanceQuestion}
                  className="aero-glossy-btn min-h-[44px] w-full sm:w-auto rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] px-6 py-2 text-xs sm:text-sm font-extrabold text-white inline-flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>
                    {qIdx + 1 < totalQ ? 'NEXT QUESTION' : 'CONTINUE TO ADVICE SKILLS'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
