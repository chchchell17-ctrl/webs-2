import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Edit3,
  Loader2,
  Send,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import {
  SCREEN07_MISSION1_STARTERS,
  SCREEN07_MISSION1_WORD_BANK,
  SCREEN07_MISSION2_EXPRESSIONS,
  SCREEN07_MISSION2_WORD_BANK,
  SCREEN07_MISSION3_STARTERS,
  SCREEN07_MISSION3_WORD_BANK,
  SCREEN07_SCENARIO_MESSAGE,
} from '../../data/screen07Data.ts';
import type { AvatarConfig, Screen07WritingPortfolio } from '../../types/game.ts';
import {
  playErrorTone,
  playLoginSuccess,
  playPortalOpen,
  playSoftSelect,
} from '../../utils/soundEffects.ts';
import { evaluateWritingWithServer } from '../../utils/writingValidator.ts';
import { DetectiveAvatarPortrait } from '../game/DetectiveAvatar.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface AdviceWritingMissionsProps {
  mode: 'scenario-intro' | 'mission-1' | 'mission-2' | 'mission-3' | 'complete-chat';
  avatarConfig: AvatarConfig;
  nickname: string;
  portfolio: Screen07WritingPortfolio;
  onStartMission1: () => void;
  onSaveMissionStep: (
    step: 1 | 2 | 3,
    text: string,
    feedbackNote: string,
    evaluatedByAi: boolean
  ) => void;
  onJumpToEditStep: (step: 1 | 2 | 3) => void;
  onFinishChatReview: () => void;
}

export const AdviceWritingMissions: React.FC<AdviceWritingMissionsProps> = ({
  mode,
  avatarConfig,
  nickname,
  portfolio,
  onStartMission1,
  onSaveMissionStep,
  onJumpToEditStep,
  onFinishChatReview,
}) => {
  const activeStep: 1 | 2 | 3 | null =
    mode === 'mission-1' ? 1 : mode === 'mission-2' ? 2 : mode === 'mission-3' ? 3 : null;

  const [draft, setDraft] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorNote, setErrorNote] = useState<string | null>(null);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  useEffect(() => {
    setErrorNote(null);
    if (activeStep === 1) setDraft(portfolio.mission1Asking);
    else if (activeStep === 2) setDraft(portfolio.mission2Giving);
    else if (activeStep === 3) setDraft(portfolio.mission3Responding);
  }, [activeStep, portfolio.mission1Asking, portfolio.mission2Giving, portfolio.mission3Responding]);

  const insertWord = (snippet: string, asLower = false) => {
    if (isEvaluating) return;
    playSoftSelect();
    setErrorNote(null);
    setDraft((prev) => {
      const clean = prev.trimEnd();
      const piece = asLower ? snippet.toLowerCase() : snippet;
      if (!clean) return piece.charAt(0).toUpperCase() + piece.slice(1);
      return `${clean} ${piece}`;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeStep || isEvaluating) return;

    setIsEvaluating(true);
    setErrorNote(null);
    setSuccessNote(null);

    const res = await evaluateWritingWithServer({
      context: 'screen07',
      step: activeStep,
      text: draft,
    });

    setIsEvaluating(false);

    if (!res.acceptable) {
      playErrorTone();
      setErrorNote(res.tip ? `${res.feedback} ${res.tip}` : res.feedback);
      return;
    }

    playLoginSuccess();
    setSuccessNote(
      `${res.evaluatedByAi ? 'AI Teacher Check: ' : 'Safety Check: '}${res.feedback}`
    );
    onSaveMissionStep(activeStep, draft.trim(), res.feedback, res.evaluatedByAi);
  };

  if (mode === 'scenario-intro') {
    return (
      <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
        <div className="rounded-[32px] border-2 border-white bg-white/95 p-5 sm:p-8 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] space-y-5 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#DB2777]">
                REAL-LIFE SCENARIO · YOUR FRIEND NEEDS ADVICE!
              </p>
              <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558]">
                A Classmate Received a 5,000 Free Coins Message!
              </h2>
            </div>
            <div className="w-12 h-12 shrink-0">
              <PusheenIllustration expression="worried" />
            </div>
          </div>

          {/* Smartphone Alert Frame */}
          <div className="rounded-[26px] border-4 border-slate-800 bg-gradient-to-b from-slate-900 to-slate-800 p-4 sm:p-5 text-white shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-sky-300 font-bold">
              <span className="inline-flex items-center gap-1.5">
                <Smartphone className="h-4 w-4" />
                <span>{SCREEN07_SCENARIO_MESSAGE.sender}</span>
              </span>
              <span>{SCREEN07_SCENARIO_MESSAGE.time}</span>
            </div>

            <div className="rounded-2xl bg-rose-500/20 border border-rose-400/50 p-4 space-y-1.5">
              <p className="text-sm sm:text-base font-extrabold text-amber-300 inline-flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-300" />
                <span>{SCREEN07_SCENARIO_MESSAGE.title}</span>
              </p>
              <p className="text-xs sm:text-sm font-semibold text-white/95 leading-relaxed">
                {SCREEN07_SCENARIO_MESSAGE.body}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-purple-50 border border-purple-200 p-4 space-y-1">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#7C3AED]">
              FRIEND&apos;S MESSAGE TO YOU:
            </p>
            <p className="text-sm sm:text-base font-bold text-[#0E3558]">
              {SCREEN07_SCENARIO_MESSAGE.friendQuestion}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onStartMission1();
              }}
              className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#38BDF8] to-[#0284C7] px-7 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>START WRITING MISSION 1</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'complete-chat') {
    return (
      <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
        <div className="rounded-[32px] border-2 border-white bg-white/95 overflow-hidden shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] text-left">
          <div className="bg-gradient-to-r from-[#0284C7] via-[#7C3AED] to-[#0D9488] px-5 py-4 text-white flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-sky-100">
                SCENE 09 · COMPLETE 3-PART SAFETY CHAT
              </p>
              <h2 className="font-[var(--font-display)] text-lg sm:text-xl font-bold">
                Your Real Online Safety Conversation!
              </h2>
            </div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold">
              PORTFOLIO READY
            </span>
          </div>

          <div className="p-5 sm:p-7 space-y-4 bg-gradient-to-b from-sky-50/40 to-purple-50/40">
            {/* Bubble 1 */}
            <div className="rounded-2xl bg-white border-2 border-sky-200 p-4 flex flex-wrap items-start justify-between gap-3 shadow-xs">
              <div className="space-y-1 flex-1 min-w-[200px]">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0284C7]">
                  1 · ASKING FOR ADVICE
                </p>
                <p className="text-sm font-bold text-[#0E3558]">{portfolio.mission1Asking}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  playSoftSelect();
                  onJumpToEditStep(1);
                }}
                className="rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1 text-xs font-extrabold text-[#0369A1] inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </button>
            </div>

            {/* Bubble 2 */}
            <div className="rounded-2xl bg-white border-2 border-purple-200 p-4 flex flex-wrap items-start justify-between gap-3 shadow-xs">
              <div className="space-y-1 flex-1 min-w-[200px]">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#7C3AED]">
                  2 · GIVING ONLINE SAFETY ADVICE (DETECTIVE {nickname.toUpperCase()})
                </p>
                <p className="text-sm font-bold text-[#0E3558]">{portfolio.mission2Giving}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  playSoftSelect();
                  onJumpToEditStep(2);
                }}
                className="rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1 text-xs font-extrabold text-[#6D28D9] inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </button>
            </div>

            {/* Bubble 3 */}
            <div className="rounded-2xl bg-white border-2 border-teal-200 p-4 flex flex-wrap items-start justify-between gap-3 shadow-xs">
              <div className="space-y-1 flex-1 min-w-[200px]">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0D9488]">
                  3 · RESPONDING POLITELY
                </p>
                <p className="text-sm font-bold text-[#0E3558]">{portfolio.mission3Responding}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  playSoftSelect();
                  onJumpToEditStep(3);
                }}
                className="rounded-full bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1 text-xs font-extrabold text-[#0F766E] inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </button>
            </div>

            {portfolio.feedbackNotes.length > 0 && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-1.5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#15803D] inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>WRITING EVALUATION FEEDBACK</span>
                </p>
                <ul className="list-disc pl-5 text-xs sm:text-sm font-semibold text-[#0E3558] space-y-1">
                  {portfolio.feedbackNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  playPortalOpen();
                  onFinishChatReview();
                }}
                className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] px-7 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>SAVE &amp; CONTINUE</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Writing Mission 1, 2, or 3
  const stepMeta =
    activeStep === 1
      ? {
          badge: 'WRITING MISSION 1 OF 3 · ASKING FOR ADVICE',
          title: 'Ask a trusted person for advice about the 5,000 Free Coins message!',
          promptContext:
            'Imagine you received the suspicious 5,000 Free Coins message asking for your password. Write a clear question asking for help.',
          starters: SCREEN07_MISSION1_STARTERS,
          wordBank: SCREEN07_MISSION1_WORD_BANK,
          placeholder:
            'Example: I received a message promising 5,000 free coins if I enter my password. What should I do?',
        }
      : activeStep === 2
        ? {
            badge: 'WRITING MISSION 2 OF 3 · GIVING ADVICE',
            title: 'Your friend asks: "Should I enter my password to get 5,000 coins?"',
            promptContext:
              'Reply as Detective ' +
              nickname +
              ' giving SAFE advice using "You should...", "You shouldn\'t...", or "You could...".',
            starters: SCREEN07_MISSION2_EXPRESSIONS,
            wordBank: SCREEN07_MISSION2_WORD_BANK,
            placeholder:
              "Example: You shouldn't enter your password! You should stop and ask a trusted adult.",
          }
        : {
            badge: 'WRITING MISSION 3 OF 3 · RESPONDING POLITELY',
            title: 'Respond politely to the good online-safety advice!',
            promptContext:
              'Thank your helper kindly and state what safe action you will take next.',
            starters: SCREEN07_MISSION3_STARTERS,
            wordBank: SCREEN07_MISSION3_WORD_BANK,
            placeholder:
              'Example: Thank you for your advice! I understand now and I will ask my parents.',
          };

  return (
    <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div className="rounded-[32px] border-2 border-white bg-white/95 overflow-hidden shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] text-left">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7C3AED] via-[#0284C7] to-[#0D9488] px-5 py-4 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-white p-0.5 shrink-0">
              <DetectiveAvatarPortrait config={avatarConfig} className="w-full h-full" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-sky-100">
                {stepMeta.badge}
              </p>
              <h2 className="font-[var(--font-display)] text-base sm:text-lg font-bold">
                {stepMeta.title}
              </h2>
            </div>
          </div>
          <span className="rounded-xl bg-white/20 px-3 py-1 text-xs font-extrabold">
            TASK {activeStep} / 3
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4">
          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 shrink-0">
              <PusheenIllustration expression="encouraging" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#0E3558]">{stepMeta.promptContext}</p>
          </div>

          {/* Previous typed messages preview */}
          {(activeStep === 2 || activeStep === 3) && portfolio.mission1Asking && (
            <div className="rounded-xl bg-purple-50/70 border border-purple-200 px-3.5 py-2 text-xs font-semibold text-[#5B21B6]">
              <span className="font-extrabold">Mission 1 saved:</span> &ldquo;
              {portfolio.mission1Asking}&rdquo;
            </div>
          )}
          {activeStep === 3 && portfolio.mission2Giving && (
            <div className="rounded-xl bg-teal-50/70 border border-teal-200 px-3.5 py-2 text-xs font-semibold text-[#0F766E]">
              <span className="font-extrabold">Mission 2 saved:</span> &ldquo;
              {portfolio.mission2Giving}&rdquo;
            </div>
          )}

          {/* Sentence Starters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#475569] mr-1">Sentence starters:</span>
            {stepMeta.starters.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  playSoftSelect();
                  setErrorNote(null);
                  setDraft((prev) => (prev.trim() ? prev : s));
                }}
                className="rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 text-xs font-bold text-[#0369A1] cursor-pointer"
              >
                + &ldquo;{s.trim()}&rdquo;
              </button>
            ))}
          </div>

          {/* Word Bank */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#475569] mr-1">
              Word bank (tap to add):
            </span>
            {stepMeta.wordBank.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => insertWord(word, true)}
                className="rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 text-[11px] font-extrabold text-[#6D28D9] cursor-pointer"
              >
                {word}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              rows={3}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                if (errorNote) setErrorNote(null);
              }}
              placeholder={stepMeta.placeholder}
              className="flex-1 rounded-2xl border-2 border-sky-200 bg-sky-50/40 px-4 py-3 text-sm font-semibold text-[#0E3558] focus:outline-none focus-visible:border-purple-400 focus-visible:ring-4 focus-visible:ring-purple-200"
            />
            <button
              type="submit"
              disabled={isEvaluating}
              className="aero-glossy-btn min-h-[50px] sm:self-end rounded-full bg-gradient-to-b from-[#2AB2DF] to-[#0E83B5] hover:from-[#36BDE9] hover:to-[#1190C6] disabled:opacity-70 px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>SUBMIT TASK {activeStep}</span>
                </>
              )}
            </button>
          </div>

          {successNote && !errorNote && (
            <p className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-bold text-[#15803D]">
              {successNote}
            </p>
          )}

          {errorNote && (
            <p className="rounded-xl bg-amber-50 border border-amber-300 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#92400E]">
              {errorNote}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
