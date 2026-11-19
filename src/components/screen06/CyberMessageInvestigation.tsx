import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  Eye,
  Gamepad2,
  HelpCircle,
  Link2,
  Mail,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import {
  SCREEN06_MESSAGE_CASES,
  type Screen06MessageCase,
} from '../../data/screen06Data.ts';
import type {
  AvatarConfig,
  Screen06CaseAttempt,
  Screen06Classification,
} from '../../types/game.ts';
import {
  playErrorTone,
  playLoginSuccess,
  playPortalOpen,
  playSoftSelect,
} from '../../utils/soundEffects.ts';
import { ByteIllustration } from '../game/ByteIllustration.tsx';
import { DetectiveAvatarPortrait } from '../game/DetectiveAvatar.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface CyberMessageInvestigationProps {
  avatarConfig: AvatarConfig;
  nickname: string;
  initialCompletedCases: number[];
  initialAttempts: Record<string, Screen06CaseAttempt>;
  onRecordCaseProgress: (
    attempts: Record<string, Screen06CaseAttempt>,
    completed: number[],
    firstAttemptScore: number
  ) => void;
  onTenseAlertChange: (isTense: boolean) => void;
  onFinishAll10Cases: () => void;
}

const PLATFORM_STYLES: Record<
  Screen06MessageCase['platformType'],
  { headerBg: string; border: string; icon: React.ReactNode }
> = {
  'email-inbox': {
    headerBg: 'from-[#0284C7] to-[#2563EB]',
    border: 'border-sky-300',
    icon: <Mail className="h-4 w-4" />,
  },
  'school-portal': {
    headerBg: 'from-[#0D9488] to-[#059669]',
    border: 'border-emerald-300',
    icon: <BookOpen className="h-4 w-4" />,
  },
  'gaming-chat': {
    headerBg: 'from-[#7C3AED] to-[#4F46E5]',
    border: 'border-violet-300',
    icon: <Gamepad2 className="h-4 w-4" />,
  },
  'smartphone-sms': {
    headerBg: 'from-[#E11D48] to-[#BE123C]',
    border: 'border-rose-300',
    icon: <Smartphone className="h-4 w-4" />,
  },
  'classroom-platform': {
    headerBg: 'from-[#16A34A] to-[#0D9488]',
    border: 'border-teal-300',
    icon: <BookOpen className="h-4 w-4" />,
  },
  'mobile-game-popup': {
    headerBg: 'from-[#EA580C] to-[#D97706]',
    border: 'border-amber-300',
    icon: <Sparkles className="h-4 w-4" />,
  },
  'social-dm': {
    headerBg: 'from-[#0891B2] to-[#0284C7]',
    border: 'border-cyan-300',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  'phone-notification': {
    headerBg: 'from-[#059669] to-[#10B981]',
    border: 'border-emerald-300',
    icon: <Bell className="h-4 w-4" />,
  },
  'security-alert': {
    headerBg: 'from-[#DC2626] to-[#9F1239]',
    border: 'border-red-300',
    icon: <ShieldAlert className="h-4 w-4" />,
  },
  'private-contest-dm': {
    headerBg: 'from-[#9333EA] to-[#DB2777]',
    border: 'border-fuchsia-300',
    icon: <MessageSquare className="h-4 w-4" />,
  },
};

export const CyberMessageInvestigation: React.FC<CyberMessageInvestigationProps> = ({
  avatarConfig,
  nickname,
  initialCompletedCases,
  initialAttempts,
  onRecordCaseProgress,
  onTenseAlertChange,
  onFinishAll10Cases,
}) => {
  const [attemptsMap, setAttemptsMap] =
    useState<Record<string, Screen06CaseAttempt>>(initialAttempts);
  const [completedCases, setCompletedCases] = useState<number[]>(initialCompletedCases);

  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(() => {
    const firstIncomplete = SCREEN06_MESSAGE_CASES.findIndex(
      (c) => !initialCompletedCases.includes(c.id)
    );
    return firstIncomplete >= 0 ? firstIncomplete : 0;
  });

  const [inspectedFields, setInspectedFields] = useState<string[]>([]);
  const [showSimulatedLinkPreview, setShowSimulatedLinkPreview] = useState(false);
  const [showByteHint, setShowByteHint] = useState(false);
  const [feedbackState, setFeedbackState] = useState<{
    status: 'correct' | 'wrong';
    headline: string;
    detail: string;
    pusheenNote?: string;
  } | null>(null);

  const currentCase = SCREEN06_MESSAGE_CASES[activeCaseIdx];
  const isCurrentCompleted = completedCases.includes(currentCase.id);
  const frameStyle = PLATFORM_STYLES[currentCase.platformType];

  useEffect(() => {
    onTenseAlertChange(currentCase.isTenseAlert);
  }, [currentCase.isTenseAlert, onTenseAlertChange]);

  useEffect(() => {
    const existingAttempt = attemptsMap[String(currentCase.id)];
    setInspectedFields(existingAttempt?.inspectedFields ?? []);
    setShowSimulatedLinkPreview(false);
    setShowByteHint(false);

    if (completedCases.includes(currentCase.id)) {
      setFeedbackState({
        status: 'correct',
        headline: 'Case Solved!',
        detail: currentCase.byteClueExplanation,
        pusheenNote: currentCase.pusheenSupportiveNote,
      });
    } else {
      setFeedbackState(null);
    }
  }, [activeCaseIdx, currentCase, attemptsMap, completedCases]);

  const computeFirstAttemptScore = (map: Record<string, Screen06CaseAttempt>) =>
    Object.values(map).filter((item) => item.firstCorrect).length;

  const markFieldInspected = (fieldKey: string) => {
    playSoftSelect();
    if (!inspectedFields.includes(fieldKey)) {
      const nextFields = [...inspectedFields, fieldKey];
      setInspectedFields(nextFields);
      const prevAttempt = attemptsMap[String(currentCase.id)] ?? {
        caseId: currentCase.id,
        firstChoice: null,
        firstCorrect: false,
        attempts: 0,
        completed: isCurrentCompleted,
        inspectedFields: [],
      };
      const nextMap: Record<string, Screen06CaseAttempt> = {
        ...attemptsMap,
        [String(currentCase.id)]: {
          ...prevAttempt,
          inspectedFields: nextFields,
        },
      };
      setAttemptsMap(nextMap);
      onRecordCaseProgress(nextMap, completedCases, computeFirstAttemptScore(nextMap));
    }
  };

  const handleClassify = (choice: Screen06Classification) => {
    const key = String(currentCase.id);
    const prev = attemptsMap[key] ?? {
      caseId: currentCase.id,
      firstChoice: null,
      firstCorrect: false,
      attempts: 0,
      completed: false,
      inspectedFields,
    };

    const isCorrect = choice === currentCase.correctClassification;
    const isFirstTry = prev.attempts === 0;

    const updatedAttempt: Screen06CaseAttempt = {
      caseId: currentCase.id,
      firstChoice: prev.firstChoice ?? choice,
      firstCorrect: isFirstTry ? isCorrect : prev.firstCorrect,
      attempts: prev.attempts + 1,
      completed: prev.completed || isCorrect,
      inspectedFields: Array.from(new Set([...prev.inspectedFields, ...inspectedFields])),
    };

    const nextAttempts = { ...attemptsMap, [key]: updatedAttempt };
    const nextCompleted =
      isCorrect && !completedCases.includes(currentCase.id)
        ? [...completedCases, currentCase.id]
        : completedCases;

    setAttemptsMap(nextAttempts);
    setCompletedCases(nextCompleted);
    onRecordCaseProgress(nextAttempts, nextCompleted, computeFirstAttemptScore(nextAttempts));

    if (isCorrect) {
      playLoginSuccess();
      setFeedbackState({
        status: 'correct',
        headline:
          choice === 'safe'
            ? 'CLASSIFIED: SAFE MESSAGE!'
            : choice === 'suspicious'
              ? 'CLASSIFIED: SUSPICIOUS RED FLAG!'
              : 'CLASSIFIED: NEED MORE INFORMATION!',
        detail: currentCase.byteClueExplanation,
        pusheenNote: currentCase.pusheenSupportiveNote,
      });
    } else {
      playErrorTone();
      setFeedbackState({
        status: 'wrong',
        headline: 'Not quite — inspect the clues and try again! (No XP lost)',
        detail: currentCase.wrongChoiceHint,
      });
    }
  };

  const allTenCompleted = completedCases.length >= SCREEN06_MESSAGE_CASES.length;

  const handleNextStep = () => {
    playPortalOpen();
    if (activeCaseIdx + 1 < SCREEN06_MESSAGE_CASES.length) {
      setActiveCaseIdx((prev) => prev + 1);
    } else if (allTenCompleted) {
      onFinishAll10Cases();
    } else {
      const nextPending = SCREEN06_MESSAGE_CASES.findIndex(
        (c) => !completedCases.includes(c.id)
      );
      if (nextPending >= 0) setActiveCaseIdx(nextPending);
      else onFinishAll10Cases();
    }
  };

  return (
    <div className="relative z-20 w-full max-w-6xl mx-auto px-3 sm:px-5 pb-10 pointer-events-auto">
      <div className="rounded-[32px] border-2 border-white bg-white/95 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] p-4 sm:p-6 space-y-5">
        {/* Mission Header & Case Progress Tracker */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0284C7]">
              MISSION 03 · THE DIGITAL MESSAGE FILES
            </p>
            <h2 className="font-[var(--font-display)] text-lg sm:text-2xl font-bold text-[#0E3558]">
              {currentCase.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-50 border border-sky-200 px-4 py-2 text-right">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#0369A1]">
                MESSAGE INVESTIGATION
              </p>
              <p className="text-sm sm:text-base font-extrabold text-[#0E3558]">
                {completedCases.length} / {SCREEN06_MESSAGE_CASES.length}
              </p>
            </div>
            <div className="w-11 h-11 rounded-full bg-purple-50 border border-purple-200 p-1 hidden sm:block">
              <DetectiveAvatarPortrait config={avatarConfig} className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* 10 Case Stepper Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {SCREEN06_MESSAGE_CASES.map((c, idx) => {
            const done = completedCases.includes(c.id);
            const active = idx === activeCaseIdx;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  playSoftSelect();
                  setActiveCaseIdx(idx);
                }}
                className={`h-8 min-w-[36px] px-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer inline-flex items-center justify-center gap-1 ${
                  active
                    ? 'bg-[#0284C7] text-white border-[#0369A1] shadow-sm scale-105'
                    : done
                      ? 'bg-emerald-50 text-[#15803D] border-emerald-300'
                      : 'bg-white text-[#475569] border-slate-200 hover:border-sky-300'
                }`}
              >
                {done && <CheckCircle2 className="h-3 w-3" />}
                <span>{c.id}</span>
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Investigation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Distinct Interactive Digital Message Frame */}
          <div className="lg:col-span-7 space-y-3">
            <div
              className={`rounded-[26px] border-2 ${frameStyle.border} bg-white shadow-lg overflow-hidden`}
            >
              {/* Simulated App Header Bar */}
              <div
                className={`bg-gradient-to-r ${frameStyle.headerBg} px-4 py-3 text-white flex items-center justify-between gap-2`}
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold">
                  {frameStyle.icon}
                  <span>{currentCase.platformLabel}</span>
                </div>
                <span className="rounded-lg bg-black/20 px-2.5 py-0.5 text-[10px] font-bold">
                  {currentCase.timestamp}
                </span>
              </div>

              {/* Inspectable Message Fields */}
              <div className="p-4 sm:p-5 space-y-3 text-left">
                <p className="text-[11px] font-bold text-[#64748B] flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-[#0284C7]" />
                  <span>
                    Click any field below (Sender, Subject, Body, Requests, or Link) to inspect
                    clues carefully!
                  </span>
                </p>

                {/* Sender Box */}
                <button
                  type="button"
                  onClick={() => markFieldInspected('sender')}
                  className={`w-full rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                    inspectedFields.includes('sender')
                      ? 'bg-sky-50/90 border-sky-300'
                      : 'bg-slate-50/80 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0284C7]">
                    SENDER {inspectedFields.includes('sender') ? '· INSPECTED' : '· TAP TO CHECK'}
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-[#0E3558] mt-0.5 break-all">
                    {currentCase.sender}
                  </p>
                </button>

                {/* Subject / Title Box */}
                <button
                  type="button"
                  onClick={() => markFieldInspected('subject')}
                  className={`w-full rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                    inspectedFields.includes('subject')
                      ? 'bg-sky-50/90 border-sky-300'
                      : 'bg-slate-50/80 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0284C7]">
                    SUBJECT / TITLE{' '}
                    {inspectedFields.includes('subject') ? '· INSPECTED' : '· TAP TO CHECK'}
                  </span>
                  <p className="text-sm sm:text-base font-extrabold text-[#0E3558] mt-0.5">
                    {currentCase.subjectOrTitle}
                  </p>
                </button>

                {/* Message Body Box */}
                <button
                  type="button"
                  onClick={() => markFieldInspected('body')}
                  className={`w-full rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                    inspectedFields.includes('body')
                      ? 'bg-sky-50/90 border-sky-300'
                      : 'bg-white border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0284C7]">
                    MESSAGE BODY{' '}
                    {inspectedFields.includes('body') ? '· INSPECTED' : '· TAP TO CHECK'}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#1E293B] leading-relaxed mt-1">
                    {currentCase.body}
                  </p>
                </button>

                {/* Requests Box */}
                {currentCase.requests && (
                  <button
                    type="button"
                    onClick={() => markFieldInspected('requests')}
                    className={`w-full rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                      inspectedFields.includes('requests')
                        ? 'bg-amber-50/90 border-amber-300'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B45309]">
                      WHAT IT REQUESTS{' '}
                      {inspectedFields.includes('requests') ? '· INSPECTED' : '· TAP TO CHECK'}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#0E3558] mt-0.5">
                      {currentCase.requests}
                    </p>
                  </button>
                )}

                {/* Safe Simulated Link Inspector (NEVER opens external URLs) */}
                {currentCase.simulatedLink && (
                  <div className="rounded-xl border border-dashed border-rose-300 bg-rose-50/70 p-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#BE123C]">
                        <Link2 className="h-4 w-4" />
                        <span className="underline break-all">{currentCase.simulatedLink}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          markFieldInspected('link');
                          setShowSimulatedLinkPreview((prev) => !prev);
                        }}
                        className="rounded-full bg-white border border-rose-300 px-3 py-1 text-[11px] font-extrabold text-[#BE123C] cursor-pointer"
                      >
                        {showSimulatedLinkPreview ? 'Hide Link Check' : 'Inspect Link Safely'}
                      </button>
                    </div>
                    {showSimulatedLinkPreview && (
                      <p className="text-[11px] font-bold text-[#9F1239] bg-white/90 rounded-lg px-2.5 py-1.5 border border-rose-200">
                        Simulated Link Scanner: Unverified external web link — never click strange
                        links outside the game!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Question, Byte Hint & Classification Buttons */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-[26px] border-2 border-sky-200 bg-gradient-to-b from-sky-50/90 to-white p-5 space-y-4 text-left shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 shrink-0">
                  <ByteIllustration
                    expression={
                      feedbackState?.status === 'correct'
                        ? 'celebrating'
                        : feedbackState?.status === 'wrong'
                          ? 'thinking'
                          : 'curious'
                    }
                    pose="investigating"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0284C7]">
                    DETECTIVE QUESTION · FILE {currentCase.id}/10
                  </p>
                  <h3 className="font-[var(--font-display)] text-base sm:text-lg font-bold text-[#0E3558]">
                    {currentCase.question}
                  </h3>
                </div>
              </div>

              {/* Optional Byte Clue Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    playSoftSelect();
                    setShowByteHint((prev) => !prev);
                  }}
                  className="rounded-full bg-white hover:bg-sky-50 border border-sky-200 px-3.5 py-1.5 text-xs font-extrabold text-[#0369A1] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>{showByteHint ? 'Hide Byte Hint' : 'Ask Byte for a Clue'}</span>
                </button>
                {showByteHint && (
                  <p className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-bold text-[#92400E]">
                    Byte Clue: Check who the sender really is, whether they promise prizes or
                    threaten urgency, and if they ask for passwords or private details!
                  </p>
                )}
              </div>

              {/* 3 Classification Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleClassify('safe')}
                  className="w-full min-h-[48px] rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-white hover:from-emerald-100 hover:border-emerald-500 px-4 py-2.5 text-left flex items-center justify-between gap-2 shadow-xs cursor-pointer transition-all"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#15803D]">
                    <ShieldCheck className="h-5 w-5" />
                    <span>SAFE</span>
                  </span>
                  <span className="text-[11px] font-bold text-[#166534]">Trusted &amp; normal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleClassify('suspicious')}
                  className="w-full min-h-[48px] rounded-2xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-white hover:from-rose-100 hover:border-rose-500 px-4 py-2.5 text-left flex items-center justify-between gap-2 shadow-xs cursor-pointer transition-all"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#BE123C]">
                    <AlertTriangle className="h-5 w-5" />
                    <span>SUSPICIOUS</span>
                  </span>
                  <span className="text-[11px] font-bold text-[#9F1239]">Red flags detected</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleClassify('need-more-info')}
                  className="w-full min-h-[48px] rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-white hover:from-amber-100 hover:border-amber-500 px-4 py-2.5 text-left flex items-center justify-between gap-2 shadow-xs cursor-pointer transition-all"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#B45309]">
                    <HelpCircle className="h-5 w-5" />
                    <span>NEED MORE INFORMATION</span>
                  </span>
                  <span className="text-[11px] font-bold text-[#92400E]">Check with adult first</span>
                </button>
              </div>
            </div>

            {/* Byte & Pusheen Immediate Feedback Card */}
            {feedbackState && (
              <div
                className={`rounded-[24px] border-2 p-4 space-y-3 text-left shadow-md ${
                  feedbackState.status === 'correct'
                    ? 'bg-emerald-50/95 border-emerald-300'
                    : 'bg-amber-50/95 border-amber-300'
                }`}
              >
                <p
                  className={`text-xs sm:text-sm font-extrabold ${
                    feedbackState.status === 'correct' ? 'text-[#15803D]' : 'text-[#B45309]'
                  }`}
                >
                  {feedbackState.headline}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#0E3558]">
                  {feedbackState.detail}
                </p>

                {feedbackState.pusheenNote && (
                  <div className="flex items-center gap-2.5 rounded-xl bg-white/90 border border-emerald-200 px-3 py-2">
                    <div className="w-8 h-8 shrink-0">
                      <PusheenIllustration expression="celebrating" />
                    </div>
                    <p className="text-xs font-bold text-[#0369A1]">
                      Pusheen: &ldquo;{feedbackState.pusheenNote}&rdquo;
                    </p>
                  </div>
                )}

                {isCurrentCompleted && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="aero-glossy-btn min-h-[46px] w-full rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] px-5 py-2 text-xs sm:text-sm font-extrabold text-white inline-flex items-center justify-center gap-2 shadow cursor-pointer"
                  >
                    <span>
                      {allTenCompleted
                        ? 'ALL 10 SOLVED! CONTINUE TO PART C'
                        : activeCaseIdx + 1 < SCREEN06_MESSAGE_CASES.length
                          ? `NEXT MESSAGE FILE (${currentCase.id + 1}/10)`
                          : 'OPEN NEXT UNSOLVED FILE'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {allTenCompleted && !isCurrentCompleted && (
              <button
                type="button"
                onClick={onFinishAll10Cases}
                className="w-full min-h-[44px] rounded-full bg-[#0284C7] text-white text-xs font-extrabold cursor-pointer"
              >
                Continue to Part C →
              </button>
            )}

            <p className="text-[11px] font-bold text-[#475569] text-center">
              Investigating as Detective {nickname} · Unlimited retries with zero XP loss!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
