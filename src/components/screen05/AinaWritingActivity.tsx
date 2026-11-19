import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Edit3,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  buildWritingRubricFeedback,
  WRITING_WORD_BANK,
} from '../../data/screen05Data.ts';
import type {
  AvatarConfig,
  Screen05WritingResponses,
} from '../../types/game.ts';
import {
  playErrorTone,
  playLoginSuccess,
  playPortalOpen,
  playSoftSelect,
} from '../../utils/soundEffects.ts';
import { evaluateWritingWithServer } from '../../utils/writingValidator.ts';
import { AinaIllustration } from '../game/AinaIllustration.tsx';
import { DetectiveAvatarPortrait } from '../game/DetectiveAvatar.tsx';

interface AinaWritingActivityProps {
  avatarConfig: AvatarConfig;
  nickname: string;
  initialResponses: Screen05WritingResponses;
  onSaveWriting: (responses: Screen05WritingResponses) => void;
  onContinueAfterTranscript: (responses: Screen05WritingResponses) => void;
}

export const AinaWritingActivity: React.FC<AinaWritingActivityProps> = ({
  avatarConfig,
  nickname,
  initialResponses,
  onSaveWriting,
  onContinueAfterTranscript,
}) => {
  const [stage1Text, setStage1Text] = useState(initialResponses.adviceSeekingQuestion);
  const [stage2Text, setStage2Text] = useState(initialResponses.adviceGivingMessage);
  const [stage3Text, setStage3Text] = useState(initialResponses.adviceResponseMessage);

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 'transcript'>(() =>
    initialResponses.submitted ? 'transcript' : 1
  );
  const [draft, setDraft] = useState<string>(() =>
    initialResponses.submitted ? '' : initialResponses.adviceSeekingQuestion
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorNote, setErrorNote] = useState<string | null>(null);
  const [stepSuccessNote, setStepSuccessNote] = useState<string | null>(null);
  const [rubricNotes, setRubricNotes] = useState<string[]>(initialResponses.writingFeedback);

  const insertSnippet = (snippet: string) => {
    if (isEvaluating) return;
    playSoftSelect();
    setErrorNote(null);
    setDraft((prev) => {
      const clean = prev.trimEnd();
      if (!clean) return snippet;
      return `${clean} ${snippet.toLowerCase()}`;
    });
  };

  const handleSubmitStep = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeStep === 'transcript' || isEvaluating) return;

    setIsEvaluating(true);
    setErrorNote(null);
    setStepSuccessNote(null);

    const result = await evaluateWritingWithServer({
      context: 'screen05',
      step: activeStep,
      text: draft,
    });

    setIsEvaluating(false);

    if (!result.acceptable) {
      playErrorTone();
      setErrorNote(
        result.tip ? `${result.feedback} ${result.tip}` : result.feedback
      );
      return;
    }

    playLoginSuccess();
    setErrorNote(null);
    const trimmed = draft.trim();
    const feedbackPrefix = result.evaluatedByAi ? 'AI Teacher Check: ' : 'Safety Check: ';
    const updatedNotes = [
      ...rubricNotes.filter((n) => !n.startsWith(`Step ${activeStep}:`)),
      `Step ${activeStep}: ${result.feedback}`,
    ];
    setRubricNotes(updatedNotes);
    setStepSuccessNote(`${feedbackPrefix}${result.feedback}`);

    if (activeStep === 1) {
      setStage1Text(trimmed);
      setActiveStep(2);
      setDraft(stage2Text);
      onSaveWriting({
        adviceSeekingQuestion: trimmed,
        adviceGivingMessage: stage2Text,
        adviceResponseMessage: stage3Text,
        writingFeedback: updatedNotes,
        submitted: false,
      });
      return;
    }

    if (activeStep === 2) {
      setStage2Text(trimmed);
      setActiveStep(3);
      setDraft(stage3Text);
      onSaveWriting({
        adviceSeekingQuestion: stage1Text,
        adviceGivingMessage: trimmed,
        adviceResponseMessage: stage3Text,
        writingFeedback: updatedNotes,
        submitted: false,
      });
      return;
    }

    const completeData = {
      adviceSeekingQuestion: stage1Text,
      adviceGivingMessage: stage2Text,
      adviceResponseMessage: trimmed,
    };
    const finalNotes = [
      ...buildWritingRubricFeedback(completeData),
      ...updatedNotes,
    ];
    const finalized: Screen05WritingResponses = {
      ...completeData,
      writingFeedback: finalNotes,
      submitted: true,
    };
    setStage3Text(trimmed);
    setRubricNotes(finalNotes);
    setActiveStep('transcript');
    onSaveWriting(finalized);
  };

  const handleEditAnswers = () => {
    playSoftSelect();
    setActiveStep(1);
    setDraft(stage1Text);
    setErrorNote(null);
    setStepSuccessNote(null);
  };

  const stagePrompt =
    activeStep === 1
      ? {
          badge: 'STAGE 1 OF 3 · ASKING FOR ADVICE',
          instruction:
            'Help Aina practise asking a trusted friend or adult for advice about the suspicious message.',
          placeholder: 'Example: I received a strange message promising a free tablet. What should I do?',
          starters: ['I received a strange message. ', 'What should I do if ', 'Could you help me? '],
        }
      : activeStep === 2
        ? {
            badge: 'STAGE 2 OF 3 · GIVING ONLINE SAFETY ADVICE',
            instruction:
              'Reply as Detective ' + nickname + " giving Aina clear advice! Try 'You should...', 'You shouldn't...', or 'You could...'.",
            placeholder:
              "Example: You shouldn't click the link. You should stop and ask your mother or teacher.",
            starters: ['You should ', "You shouldn't ", 'You could '],
          }
        : {
            badge: 'STAGE 3 OF 3 · RESPONDING POLITELY',
            instruction:
              'Finish the chat by writing how Aina responds politely to good online-safety advice.',
            placeholder:
              "Example: Thank you! That's a good idea. I will show the message to my mother right now.",
            starters: ['Thank you. ', "That's a good idea. ", 'I will ', 'I understand. '],
          };

  return (
    <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div className="rounded-[30px] border-2 border-white bg-white/95 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] overflow-hidden">
        {/* Realistic Chat Header */}
        <div className="bg-gradient-to-r from-[#0284C7] via-[#7C3AED] to-[#EC4899] px-5 py-3.5 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-full bg-white p-0.5 shrink-0">
              <AinaIllustration expression={activeStep === 'transcript' ? 'celebrating' : 'curious'} />
              <span
                aria-hidden="true"
                className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white"
              />
            </div>
            <div className="text-left">
              <p className="font-[var(--font-display)] text-sm sm:text-base font-bold tracking-wide">
                AINA – ONLINE
              </p>
              <p className="text-[11px] font-semibold text-sky-100 inline-flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>Asking &amp; Giving Online Safety Advice Practice</span>
              </p>
            </div>
          </div>

          <span className="rounded-xl bg-white/20 px-3 py-1 text-[11px] font-extrabold tracking-wider">
            {activeStep === 'transcript' ? 'COMPLETED CHAT' : `STEP ${activeStep} / 3`}
          </span>
        </div>

        {/* Chat History Thread */}
        <div className="bg-gradient-to-b from-sky-50/60 to-purple-50/40 p-4 sm:p-6 space-y-3 max-h-[340px] overflow-y-auto text-left">
          {/* Initial Context Message */}
          <div className="flex items-end gap-2.5 max-w-[85%]">
            <div className="h-9 w-9 rounded-full bg-pink-100 border border-pink-200 p-0.5 shrink-0">
              <AinaIllustration expression="worried" />
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-white border border-pink-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0E3558] shadow-xs">
              <p className="text-[10px] font-extrabold text-[#DB2777]">Aina</p>
              <p>
                Detective {nickname}, let&apos;s write our real safety conversation step by step!
              </p>
            </div>
          </div>

          {/* Student Message 1 */}
          {(activeStep === 2 || activeStep === 3 || activeStep === 'transcript') && stage1Text && (
            <div className="flex items-end justify-end gap-2.5">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-b from-pink-500 to-rose-600 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-sm">
                <p className="text-[10px] font-extrabold text-pink-100">
                  1 · Asking for Advice (Aina)
                </p>
                <p>{stage1Text}</p>
              </div>
            </div>
          )}

          {/* Student Message 2 */}
          {(activeStep === 3 || activeStep === 'transcript') && stage2Text && (
            <div className="flex items-end gap-2.5 max-w-[85%]">
              <div className="h-9 w-9 rounded-full bg-purple-100 border border-purple-200 p-0.5 shrink-0">
                <DetectiveAvatarPortrait config={avatarConfig} className="w-full h-full" />
              </div>
              <div className="rounded-2xl rounded-bl-sm bg-white border border-sky-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0E3558] shadow-xs">
                <p className="text-[10px] font-extrabold text-[#0369A1]">
                  2 · Giving Advice (Detective {nickname})
                </p>
                <p>{stage2Text}</p>
              </div>
            </div>
          )}

          {/* Student Message 3 */}
          {activeStep === 'transcript' && stage3Text && (
            <div className="flex items-end justify-end gap-2.5">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-b from-emerald-500 to-teal-600 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-sm">
                <p className="text-[10px] font-extrabold text-emerald-100">
                  3 · Responding Politely (Aina)
                </p>
                <p>{stage3Text}</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Composer OR Complete Transcript Feedback */}
        <div className="border-t border-slate-100 bg-white p-4 sm:p-6 text-left space-y-4">
          {activeStep === 'transcript' ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#15803D] inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>COMPLETE WRITING TRANSCRIPT &amp; YEAR 5 FEEDBACK</span>
                </p>
                <ul className="space-y-1 text-xs sm:text-sm font-semibold text-[#0E3558] list-disc pl-5">
                  {rubricNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleEditAnswers}
                  className="min-h-[44px] rounded-full bg-white hover:bg-sky-50 border border-sky-200 px-5 py-2 text-xs sm:text-sm font-extrabold text-[#0369A1] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>EDIT ANSWERS</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    onContinueAfterTranscript({
                      adviceSeekingQuestion: stage1Text,
                      adviceGivingMessage: stage2Text,
                      adviceResponseMessage: stage3Text,
                      writingFeedback: rubricNotes,
                      submitted: true,
                    });
                  }}
                  className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-7 py-2 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>CONTINUE</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitStep} className="space-y-3">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#7E22CE]">
                  {stagePrompt.badge}
                </p>
                <p className="text-xs sm:text-sm font-bold text-[#0E3558] mt-0.5">
                  {stagePrompt.instruction}
                </p>
              </div>

              {/* Optional Sentence Starters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#475569] mr-1">
                  Sentence starters:
                </span>
                {stagePrompt.starters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => {
                      playSoftSelect();
                      setErrorNote(null);
                      setDraft((prev) => (prev.trim() ? prev : starter));
                    }}
                    className="rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 text-xs font-bold text-[#0369A1] cursor-pointer"
                  >
                    + &ldquo;{starter.trim()}&rdquo;
                  </button>
                ))}
              </div>

              {/* Optional Word Bank for Stage 2 */}
              {activeStep === 2 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#475569] mr-1">
                    Word bank (tap to add):
                  </span>
                  {WRITING_WORD_BANK.map((word) => (
                    <button
                      key={word}
                      type="button"
                      onClick={() => insertSnippet(word)}
                      className="rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 text-[11px] font-extrabold text-[#6D28D9] cursor-pointer"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5">
                <textarea
                  rows={2}
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    if (errorNote) setErrorNote(null);
                  }}
                  placeholder={stagePrompt.placeholder}
                  className="flex-1 rounded-2xl border-2 border-sky-200 bg-sky-50/40 px-4 py-2.5 text-sm font-semibold text-[#0E3558] focus:outline-none focus-visible:border-purple-400 focus-visible:ring-4 focus-visible:ring-purple-200"
                />
                <button
                  type="submit"
                  disabled={isEvaluating}
                  className="aero-glossy-btn min-h-[48px] sm:self-end rounded-full bg-gradient-to-b from-[#2AB2DF] to-[#0E83B5] hover:from-[#36BDE9] hover:to-[#1190C6] disabled:opacity-70 px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white inline-flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>SEND MESSAGE</span>
                    </>
                  )}
                </button>
              </div>

              {stepSuccessNote && !errorNote && (
                <p className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-bold text-[#15803D]">
                  {stepSuccessNote}
                </p>
              )}

              {errorNote && (
                <p className="rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2 text-xs font-bold text-[#92400E]">
                  {errorNote}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
