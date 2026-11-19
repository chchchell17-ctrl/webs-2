import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle2,
  Link2,
  Map,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  SCREEN06_COMPLETION_SCRIPT,
  SCREEN06_MINI_CHALLENGE_MESSAGES,
  SCREEN06_PART_C_SCENARIO,
  type PartCActionOption,
} from '../../data/screen06Data.ts';
import type {
  AvatarConfig,
  GameSettings,
  Screen06ChallengeAttempt,
  Screen06Classification,
} from '../../types/game.ts';
import {
  playErrorTone,
  playLoginSuccess,
  playPortalOpen,
  playSoftSelect,
} from '../../utils/soundEffects.ts';
import { ByteIllustration } from '../game/ByteIllustration.tsx';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface CyberChallengesProps {
  mode: 'part-c-action' | 'part-d-challenge' | 'completion' | 'unlock-advice';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  firstAttemptCasesScore: number;
  initialPartCChoice: string | null;
  initialChallengeAttempts: Record<string, Screen06ChallengeAttempt>;
  onRecordPartC: (choiceId: string, isCorrect: boolean) => void;
  onProceedToPartD: () => void;
  onRecordChallengeProgress: (
    attempts: Record<string, Screen06ChallengeAttempt>,
    completedAll: boolean
  ) => void;
  onFinishPartD: () => void;
  onProceedToUnlockAdvice: () => void;
  onVisitAdviceCentre: () => void;
  onReturnToTown: () => void;
  onTenseAlertChange: (isTense: boolean) => void;
}

export const CyberChallenges: React.FC<CyberChallengesProps> = ({
  mode,
  avatarConfig,
  nickname,
  settings,
  firstAttemptCasesScore,
  initialPartCChoice,
  initialChallengeAttempts,
  onRecordPartC,
  onProceedToPartD,
  onRecordChallengeProgress,
  onFinishPartD,
  onProceedToUnlockAdvice,
  onVisitAdviceCentre,
  onReturnToTown,
  onTenseAlertChange,
}) => {
  // Part C state
  const [selectedOption, setSelectedOption] = useState<PartCActionOption | null>(() => {
    if (!initialPartCChoice) return null;
    return SCREEN06_PART_C_SCENARIO.options.find((o) => o.id === initialPartCChoice) ?? null;
  });

  // Part D state (3 new mini challenge messages)
  const [challengeMap, setChallengeMap] = useState<Record<string, Screen06ChallengeAttempt>>(
    initialChallengeAttempts
  );
  const [miniIdx, setMiniIdx] = useState<number>(0);
  const [miniFeedback, setMiniFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);
  const [showSimLink, setShowSimLink] = useState(false);

  // Completion script state
  const [completionIdx, setCompletionIdx] = useState(0);

  const currentMini = SCREEN06_MINI_CHALLENGE_MESSAGES[miniIdx];

  useEffect(() => {
    if (mode === 'part-d-challenge') {
      onTenseAlertChange(currentMini.id === 'msg-b');
    }
  }, [mode, currentMini.id, onTenseAlertChange]);

  const handleSelectPartC = (opt: PartCActionOption) => {
    setSelectedOption(opt);
    onRecordPartC(opt.id, opt.isCorrect);
    if (opt.isCorrect) {
      playLoginSuccess();
      onTenseAlertChange(false);
    } else {
      playErrorTone();
      onTenseAlertChange(true);
    }
  };

  const completedMiniCount = SCREEN06_MINI_CHALLENGE_MESSAGES.filter(
    (m) => challengeMap[m.id]?.completed
  ).length;

  const handleMiniClassify = (choice: Screen06Classification) => {
    const prev = challengeMap[currentMini.id] ?? {
      challengeId: currentMini.id,
      firstChoice: null,
      firstCorrect: false,
      attempts: 0,
      completed: false,
    };

    const isCorrect = choice === currentMini.correctClassification;
    const updated: Screen06ChallengeAttempt = {
      challengeId: currentMini.id,
      firstChoice: prev.firstChoice ?? choice,
      firstCorrect: prev.attempts === 0 ? isCorrect : prev.firstCorrect,
      attempts: prev.attempts + 1,
      completed: prev.completed || isCorrect,
    };

    const nextMap = { ...challengeMap, [currentMini.id]: updated };
    setChallengeMap(nextMap);

    const nextCompletedCount = SCREEN06_MINI_CHALLENGE_MESSAGES.filter(
      (m) => nextMap[m.id]?.completed
    ).length;
    onRecordChallengeProgress(
      nextMap,
      nextCompletedCount >= SCREEN06_MINI_CHALLENGE_MESSAGES.length
    );

    if (isCorrect) {
      playLoginSuccess();
      setMiniFeedback({ correct: true, message: currentMini.feedbackCorrect });
    } else {
      playErrorTone();
      setMiniFeedback({ correct: false, message: currentMini.feedbackWrong });
    }
  };

  if (mode === 'part-c-action') {
    return (
      <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
        <div className="rounded-[32px] border-2 border-white bg-white/95 p-5 sm:p-8 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] space-y-5 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0284C7]">
                PART C · SMART DETECTIVE ACTION
              </p>
              <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558]">
                {SCREEN06_PART_C_SCENARIO.title}
              </h2>
            </div>
            <div className="w-14 h-14 shrink-0">
              <ByteIllustration
                expression={selectedOption?.isCorrect ? 'celebrating' : 'worried'}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 text-sm sm:text-base font-bold text-[#0E3558]">
            {SCREEN06_PART_C_SCENARIO.prompt}
          </div>

          <div className="space-y-2.5">
            {SCREEN06_PART_C_SCENARIO.options.map((opt) => {
              const isChosen = selectedOption?.id === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectPartC(opt)}
                  className={`w-full min-h-[52px] rounded-2xl border-2 px-4 py-3 text-left text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isChosen && opt.isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-[#14532D]'
                      : isChosen && !opt.isCorrect
                        ? 'bg-rose-50 border-rose-400 text-[#9F1239]'
                        : 'bg-white border-sky-100 hover:border-sky-300 text-[#0E3558]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isChosen && opt.isCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0" />
                  )}
                  {isChosen && !opt.isCorrect && (
                    <AlertTriangle className="h-5 w-5 text-[#E11D48] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption && (
            <div
              className={`rounded-2xl border-2 p-4 space-y-2 ${
                selectedOption.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-[#14532D]'
                  : 'bg-rose-50 border-rose-300 text-[#9F1239]'
              }`}
            >
              <p className="text-sm font-extrabold">{selectedOption.consequenceTitle}</p>
              <p className="text-xs sm:text-sm font-semibold">{selectedOption.consequenceText}</p>
              {!selectedOption.isCorrect ? (
                <p className="text-[11px] font-bold opacity-85">
                  No XP lost! Try choosing the safest detective action above.
                </p>
              ) : (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      playPortalOpen();
                      onProceedToPartD();
                    }}
                    className="aero-glossy-btn min-h-[46px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] px-6 py-2 text-xs sm:text-sm font-extrabold text-white inline-flex items-center gap-2 shadow cursor-pointer"
                  >
                    <span>CONTINUE TO THREE-MESSAGE MINI CHALLENGE</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'part-d-challenge') {
    const isMiniSolved = Boolean(challengeMap[currentMini.id]?.completed);
    const allThreeSolved =
      completedMiniCount >= SCREEN06_MINI_CHALLENGE_MESSAGES.length;

    return (
      <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
        <div className="rounded-[32px] border-2 border-white bg-white/95 p-5 sm:p-8 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] space-y-5 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C3AED]">
                PART D · THREE-MESSAGE MINI CHALLENGE
              </p>
              <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558]">
                Final Quick Check ({miniIdx + 1} OF 3)
              </h2>
            </div>

            <span className="rounded-2xl bg-purple-50 border border-purple-200 px-4 py-1.5 text-xs sm:text-sm font-extrabold text-[#6D28D9]">
              {completedMiniCount} / 3 SOLVED
            </span>
          </div>

          {/* 3 New Messages Tabs */}
          <div className="flex flex-wrap gap-2">
            {SCREEN06_MINI_CHALLENGE_MESSAGES.map((m, i) => {
              const solved = Boolean(challengeMap[m.id]?.completed);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    playSoftSelect();
                    setMiniIdx(i);
                    setMiniFeedback(null);
                    setShowSimLink(false);
                  }}
                  className={`rounded-xl border px-3.5 py-1.5 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer ${
                    miniIdx === i
                      ? 'bg-[#7C3AED] text-white border-[#6D28D9]'
                      : solved
                        ? 'bg-emerald-50 text-[#15803D] border-emerald-300'
                        : 'bg-white text-[#475569] border-slate-200'
                  }`}
                >
                  {solved && <CheckCircle2 className="h-3.5 w-3.5" />}
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Current Mini Challenge Message Card */}
          <div className="rounded-[24px] border-2 border-sky-200 bg-sky-50/50 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0284C7]">
                FROM: {currentMini.sender}
              </span>
              <span className="rounded-full bg-white border border-sky-200 px-2.5 py-0.5 text-[10px] font-extrabold text-[#0369A1]">
                {currentMini.label}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-[#0E3558]">
              {currentMini.title}
            </h3>

            <p className="text-sm font-semibold text-[#1E293B] bg-white rounded-xl border border-sky-100 p-3.5">
              {currentMini.body}
            </p>

            {currentMini.simulatedLink && (
              <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/80 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#92400E] inline-flex items-center gap-1.5 break-all">
                  <Link2 className="h-3.5 w-3.5" />
                  {currentMini.simulatedLink}
                </span>
                <button
                  type="button"
                  onClick={() => setShowSimLink((p) => !p)}
                  className="rounded-full bg-white border border-amber-300 px-2.5 py-0.5 text-[10px] font-extrabold text-[#B45309] cursor-pointer"
                >
                  {showSimLink ? 'Hide Note' : 'Check Link Safely'}
                </button>
                {showSimLink && (
                  <p className="w-full text-[11px] font-bold text-[#92400E]">
                    Simulated preview only — external links never open here!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 3 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleMiniClassify('safe')}
              className="min-h-[48px] rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 px-4 py-2 text-xs sm:text-sm font-extrabold text-[#15803D] cursor-pointer"
            >
              SAFE
            </button>
            <button
              type="button"
              onClick={() => handleMiniClassify('suspicious')}
              className="min-h-[48px] rounded-2xl border-2 border-rose-300 bg-rose-50/70 hover:bg-rose-100 px-4 py-2 text-xs sm:text-sm font-extrabold text-[#BE123C] cursor-pointer"
            >
              SUSPICIOUS
            </button>
            <button
              type="button"
              onClick={() => handleMiniClassify('need-more-info')}
              className="min-h-[48px] rounded-2xl border-2 border-amber-300 bg-amber-50/70 hover:bg-amber-100 px-4 py-2 text-xs sm:text-sm font-extrabold text-[#B45309] cursor-pointer"
            >
              NEED MORE INFORMATION
            </button>
          </div>

          {miniFeedback && (
            <div
              className={`rounded-2xl border-2 p-4 space-y-2 ${
                miniFeedback.correct
                  ? 'bg-emerald-50 border-emerald-300 text-[#14532D]'
                  : 'bg-amber-50 border-amber-300 text-[#92400E]'
              }`}
            >
              <p className="text-xs sm:text-sm font-bold">{miniFeedback.message}</p>
              {isMiniSolved && (
                <div className="pt-1">
                  {allThreeSolved ? (
                    <button
                      type="button"
                      onClick={() => {
                        playPortalOpen();
                        onFinishPartD();
                      }}
                      className="aero-glossy-btn min-h-[46px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] px-6 py-2 text-xs sm:text-sm font-extrabold text-white inline-flex items-center gap-2 shadow cursor-pointer"
                    >
                      <Award className="h-4 w-4" />
                      <span>FINISH MINI CHALLENGE &amp; EARN BADGE</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        playSoftSelect();
                        const nextPending = SCREEN06_MINI_CHALLENGE_MESSAGES.findIndex(
                          (m, idx) => idx !== miniIdx && !challengeMap[m.id]?.completed
                        );
                        setMiniIdx(
                          nextPending >= 0 ? nextPending : (miniIdx + 1) % SCREEN06_MINI_CHALLENGE_MESSAGES.length
                        );
                        setMiniFeedback(null);
                        setShowSimLink(false);
                      }}
                      className="aero-glossy-btn min-h-[44px] rounded-full bg-gradient-to-b from-[#38BDF8] to-[#0284C7] px-5 py-2 text-xs sm:text-sm font-extrabold text-white inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>NEXT CHALLENGE MESSAGE</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'completion') {
    const step = SCREEN06_COMPLETION_SCRIPT[completionIdx];
    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 pb-44 sm:pb-48">
        <div className="w-full max-w-2xl rounded-[32px] border-2 border-white bg-white/95 p-6 sm:p-8 shadow-2xl text-center space-y-4">
          <div className="mx-auto w-28 h-28">
            <ByteIllustration expression="celebrating" pose="waving" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#B45309]">
            <Award className="h-4 w-4" />
            <span>BADGE EARNED: BYTE&apos;S HELPER</span>
          </div>
          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
            CYBER CAFÉ MISSION COMPLETE!
          </h2>
          <p className="text-sm font-semibold text-[#334155]">
            Detective {nickname}, you classified all 10 message files (First-try accuracy:{' '}
            <span className="font-extrabold text-[#0284C7]">{firstAttemptCasesScore}/10</span>) and
            mastered the 3-message mini challenge!
          </p>
        </div>

        {step && (
          <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
            <div className="pointer-events-auto">
              <DialogueBox
                speaker={step.speaker}
                speakerName={step.speakerName}
                playerNickname={nickname}
                playerAvatar={avatarConfig}
                expression={step.expression}
                text={step.text}
                settings={settings}
                nextLabel={
                  completionIdx + 1 < SCREEN06_COMPLETION_SCRIPT.length
                    ? 'NEXT'
                    : 'CLAIM BADGE & UNLOCK ADVICE CENTRE'
                }
                onNext={() => {
                  if (completionIdx + 1 < SCREEN06_COMPLETION_SCRIPT.length) {
                    setCompletionIdx((p) => p + 1);
                  } else {
                    onProceedToUnlockAdvice();
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // 'unlock-advice'
  return (
    <div className="relative z-20 w-full max-w-3xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div className="rounded-[32px] border-2 border-white bg-white/95 p-6 sm:p-8 shadow-2xl text-center space-y-5">
        <div className="flex items-center justify-center gap-5">
          <div className="w-20 h-20">
            <ByteIllustration expression="celebrating" />
          </div>
          <div className="w-20 h-18">
            <PusheenIllustration expression="celebrating" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
          <ShieldCheck className="h-4 w-4" />
          <span>NEW LOCATION UNLOCKED: ADVICE CENTRE!</span>
        </div>

        <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
          READY FOR SCREEN 07 · WORDS THAT HELP!
        </h2>

        <p className="text-sm sm:text-base font-semibold text-[#334155] max-w-xl mx-auto">
          Your <span className="font-extrabold text-[#B45309]">Byte&apos;s Helper</span> badge is
          safely saved in your Detective Bag! Head across town to the Advice Centre to practise
          asking for, giving, and responding to online-safety advice!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              playPortalOpen();
              onVisitAdviceCentre();
            }}
            className="aero-glossy-btn min-h-[50px] rounded-full bg-gradient-to-b from-[#2DD4BF] to-[#0D9488] hover:from-[#5EEAD4] hover:to-[#0F766E] border border-white px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>VISIT ADVICE CENTRE</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              playSoftSelect();
              onReturnToTown();
            }}
            className="min-h-[50px] rounded-full bg-white hover:bg-sky-50 border-2 border-sky-200 px-6 py-2.5 text-sm font-extrabold text-[#0369A1] inline-flex items-center gap-2 cursor-pointer"
          >
            <Map className="h-4 w-4" />
            <span>BACK TO TOWN MAP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
