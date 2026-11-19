import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Inbox,
  Lightbulb,
  Lock,
  Mail,
  Search,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  AEROMAIL_SUSPICIOUS_EMAIL,
  NON_CLUE_FEEDBACK,
  SCREEN04_CLUES,
} from '../../data/screen04Data.ts';
import type { Screen04ClueId } from '../../types/game.ts';
import {
  playErrorTone,
  playLoginSuccess,
  playPortalOpen,
  playSoftSelect,
} from '../../utils/soundEffects.ts';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface EmailInvestigationLabProps {
  discoveredClues: Screen04ClueId[];
  missedClicks: number;
  hintsUsed: number;
  onDiscoverClue: (clueId: Screen04ClueId) => void;
  onMissClick: () => void;
  onUseHint: () => void;
  onProceedToQuiz: () => void;
}

export const EmailInvestigationLab: React.FC<EmailInvestigationLabProps> = ({
  discoveredClues,
  missedClicks,
  hintsUsed,
  onDiscoverClue,
  onMissClick,
  onUseHint,
  onProceedToQuiz,
}) => {
  const [pusheenMessage, setPusheenMessage] = useState<string>(
    'Use your magnifying glass to click the FIVE warning signs hidden inside this AeroMail message! Be careful—not everything in the email is a red flag.'
  );
  const [pusheenMood, setPusheenMood] = useState<'curious' | 'celebrating' | 'thinking'>('curious');
  const [showSafeLinkModal, setShowSafeLinkModal] = useState(false);
  const [showMobileBoard, setShowMobileBoard] = useState(false);

  const discoveredSet = useMemo(() => new Set(discoveredClues), [discoveredClues]);
  const allFound = discoveredClues.length >= SCREEN04_CLUES.length;
  const hintUnlocked = missedClicks >= 2 && !allFound;

  const nextUndiscoveredClue = useMemo(
    () => SCREEN04_CLUES.find((c) => !discoveredSet.has(c.id)) ?? null,
    [discoveredSet]
  );

  const handleClueClick = (clueId: Screen04ClueId) => {
    const def = SCREEN04_CLUES.find((c) => c.id === clueId);
    if (!def) return;

    if (discoveredSet.has(clueId)) {
      playSoftSelect();
      setPusheenMood('curious');
      setPusheenMessage(`You already recorded "${def.label}" on your Evidence Board! Keep looking for the remaining clues.`);
      return;
    }

    playLoginSuccess();
    setPusheenMood('celebrating');
    setPusheenMessage(def.pusheenFoundLine);
    onDiscoverClue(clueId);
  };

  const handleOrdinaryClick = (regionKey: keyof typeof NON_CLUE_FEEDBACK) => {
    playErrorTone();
    setPusheenMood('thinking');
    setPusheenMessage(NON_CLUE_FEEDBACK[regionKey]);
    onMissClick();
  };

  const clueStyle = (clueId: Screen04ClueId) =>
    discoveredSet.has(clueId)
      ? 'bg-rose-100/90 border-2 border-rose-400 ring-2 ring-rose-200 rounded-xl px-2 py-1 transition-all'
      : 'border-2 border-transparent hover:bg-sky-50/70 rounded-xl px-2 py-1 transition-colors';

  const evidenceBoardContent = (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#BE123C]" aria-hidden="true" />
          <h3 className="font-[var(--font-display)] text-base font-bold text-[#0E3558]">
            EVIDENCE BOARD
          </h3>
        </div>
        <span className="rounded-lg bg-rose-100 border border-rose-200 px-2.5 py-0.5 text-xs font-extrabold tabular-nums text-[#BE123C]">
          {discoveredClues.length} / 5 Clues
        </span>
      </div>

      <ul className="space-y-2">
        {SCREEN04_CLUES.map((clue) => {
          const found = discoveredSet.has(clue.id);
          return (
            <li
              key={clue.id}
              className={`rounded-2xl border p-3 transition-colors ${
                found
                  ? 'bg-emerald-50/90 border-emerald-300 text-[#0E3558]'
                  : 'bg-slate-50/90 border-slate-200 text-[#64748B]'
              }`}
            >
              <div className="flex items-start gap-2">
                {found ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Lock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div className="text-xs leading-snug">
                  <p className="font-extrabold">
                    {found ? clue.boardTitle : `Hidden Warning Sign #${clue.order}`}
                  </p>
                  <p className="mt-0.5 font-medium">
                    {found
                      ? clue.boardSummary
                      : 'Inspect the suspicious email to uncover this clue.'}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {hintUnlocked && nextUndiscoveredClue && (
        <button
          type="button"
          onClick={() => {
            playSoftSelect();
            setPusheenMood('curious');
            setPusheenMessage(`Detective Hint (${hintsUsed + 1}): ${nextUndiscoveredClue.hintText}`);
            onUseHint();
          }}
          className="w-full min-h-[40px] rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 px-4 py-1.5 text-xs font-extrabold text-[#92400E] inline-flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Lightbulb className="h-4 w-4 text-amber-600" />
          <span>NEED A HINT? ({hintsUsed} used)</span>
        </button>
      )}

      {allFound && (
        <button
          type="button"
          onClick={() => {
            playPortalOpen();
            onProceedToQuiz();
          }}
          className="aero-glossy-btn w-full min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-5 py-2.5 text-sm font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <span>CONTINUE TO KNOWLEDGE CHECK</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="relative z-20 w-full max-w-6xl mx-auto px-3 sm:px-5 pb-8 flex flex-col gap-3.5 pointer-events-auto">
      {/* Live Pusheen Investigator Feedback Strip */}
      <div className="rounded-[24px] bg-white/95 backdrop-blur-md border-2 border-white px-4 py-3 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="h-13 w-13 shrink-0">
            <PusheenIllustration expression={pusheenMood} />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0369A1] inline-flex items-center gap-1">
              <Search className="h-3.5 w-3.5" />
              <span>MAGNIFYING GLASS ACTIVE · DETECTIVE PUSHEEN</span>
            </p>
            <p className="text-xs sm:text-sm font-bold text-[#0E3558] leading-snug">
              {pusheenMessage}
            </p>
          </div>
        </div>

        {/* Mobile/Tablet Evidence Board Toggle */}
        <button
          type="button"
          onClick={() => {
            playSoftSelect();
            setShowMobileBoard(true);
          }}
          className="lg:hidden min-h-[40px] rounded-full bg-rose-100 hover:bg-rose-200 border border-rose-300 px-4 py-1.5 text-xs font-extrabold text-[#BE123C] inline-flex items-center gap-1.5 cursor-pointer tabular-nums"
        >
          <ClipboardList className="h-4 w-4" />
          <span>Evidence Board ({discoveredClues.length}/5)</span>
        </button>
      </div>

      {/* Main Split Workspace: AeroMail Desktop Left, Evidence Board Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* AeroMail Desktop Window */}
        <div
          className="lg:col-span-8 rounded-[28px] border-2 border-white bg-white/96 shadow-[0_22px_55px_-12px_rgba(16,55,92,0.34)] overflow-hidden"
          style={{ cursor: 'zoom-in' }}
        >
          {/* AeroMail Top Window Bar */}
          <div className="bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] px-4 py-2.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-extrabold tracking-wide">
                AeroMail Desktop · Safe Lab Viewer
              </span>
            </div>
            <span className="rounded-md bg-white/20 px-2.5 py-0.5 text-[11px] font-bold">
              READ CAREFULLY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12">
            {/* Left Mail Folders Sidebar (Non-clue ordinary feature) */}
            <aside className="hidden sm:block sm:col-span-3 bg-sky-50/80 border-r border-sky-100 p-3 space-y-2">
              <button
                type="button"
                onClick={() => handleOrdinaryClick('sidebar')}
                className="w-full text-left rounded-xl bg-white border border-sky-200 px-3 py-2 text-xs font-bold text-[#0369A1] flex items-center gap-2 cursor-zoom-in"
              >
                <Inbox className="h-4 w-4" />
                <span>{AEROMAIL_SUSPICIOUS_EMAIL.folder} (1)</span>
              </button>
              <button
                type="button"
                onClick={() => handleOrdinaryClick('sidebar')}
                className="w-full text-left rounded-xl hover:bg-white/70 px-3 py-2 text-xs font-semibold text-[#475569] cursor-zoom-in"
              >
                School Notices
              </button>
              <button
                type="button"
                onClick={() => handleOrdinaryClick('sidebar')}
                className="w-full text-left rounded-xl hover:bg-white/70 px-3 py-2 text-xs font-semibold text-[#475569] cursor-zoom-in"
              >
                Starred Clues
              </button>
            </aside>

            {/* Right Email Reading Pane */}
            <div className="sm:col-span-9 p-4 sm:p-6 space-y-4 text-left">
              {/* Subject & Timestamp Row */}
              <div className="border-b border-slate-100 pb-3 flex flex-wrap items-start justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleOrdinaryClick('subject')}
                  className="text-left hover:bg-slate-50 rounded-lg px-1.5 py-0.5 cursor-zoom-in"
                >
                  <h3 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#0E3558]">
                    {AEROMAIL_SUSPICIOUS_EMAIL.subject}
                  </h3>
                </button>

                <button
                  type="button"
                  onClick={() => handleOrdinaryClick('timestamp')}
                  className="text-xs font-semibold text-[#64748B] hover:bg-slate-50 rounded-lg px-2 py-1 cursor-zoom-in"
                >
                  {AEROMAIL_SUSPICIOUS_EMAIL.timeLabel}
                </button>
              </div>

              {/* CLUE 1: Unknown Sender */}
              <button
                type="button"
                onClick={() => handleClueClick('unknown-sender')}
                className={`w-full text-left cursor-zoom-in ${clueStyle('unknown-sender')}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-[#475569]">From: </span>
                    <span className="font-extrabold text-[#0E3558]">
                      {AEROMAIL_SUSPICIOUS_EMAIL.senderName}
                    </span>{' '}
                    <span className="font-mono text-xs text-[#0369A1]">
                      &lt;{AEROMAIL_SUSPICIOUS_EMAIL.senderEmail}&gt;
                    </span>
                  </div>
                  {discoveredSet.has('unknown-sender') && (
                    <span className="text-[11px] font-extrabold text-[#BE123C] inline-flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5" /> Red Flag #1
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  To: {AEROMAIL_SUSPICIOUS_EMAIL.recipient}
                </p>
              </button>

              {/* Email Body */}
              <div className="space-y-3 text-sm sm:text-[15px] text-[#0E3558] leading-relaxed">
                {/* Ordinary Greeting */}
                <button
                  type="button"
                  onClick={() => handleOrdinaryClick('greeting')}
                  className="block text-left font-semibold hover:bg-slate-50 rounded-lg px-2 py-0.5 cursor-zoom-in"
                >
                  {AEROMAIL_SUSPICIOUS_EMAIL.greeting}
                </button>

                {/* CLUE 2: Unexpected Free Prize */}
                <button
                  type="button"
                  onClick={() => handleClueClick('unexpected-prize')}
                  className={`block w-full text-left font-medium cursor-zoom-in ${clueStyle('unexpected-prize')}`}
                >
                  <span>{AEROMAIL_SUSPICIOUS_EMAIL.prizeSentence}</span>
                  {discoveredSet.has('unexpected-prize') && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#BE123C]">
                      <ShieldAlert className="h-3.5 w-3.5" /> Red Flag #2
                    </span>
                  )}
                </button>

                {/* CLUE 3: Urgent Deadline */}
                <button
                  type="button"
                  onClick={() => handleClueClick('urgent-deadline')}
                  className={`block w-full text-left font-medium cursor-zoom-in ${clueStyle('urgent-deadline')}`}
                >
                  <span>{AEROMAIL_SUSPICIOUS_EMAIL.urgencySentence}</span>
                  {discoveredSet.has('urgent-deadline') && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#BE123C]">
                      <ShieldAlert className="h-3.5 w-3.5" /> Red Flag #3
                    </span>
                  )}
                </button>

                {/* CLUE 4: Suspicious CTA Button (opens safe lab preview, NEVER external URL) */}
                <div className={`py-2 ${discoveredSet.has('suspicious-link') ? clueStyle('suspicious-link') : 'px-2'}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        playSoftSelect();
                        setShowSafeLinkModal(true);
                      }}
                      className="aero-glossy-btn min-h-[42px] rounded-full bg-gradient-to-b from-[#38BDF8] to-[#0284C7] hover:from-[#7DD3FC] hover:to-[#0369A1] px-6 py-2 text-xs sm:text-sm font-extrabold text-white shadow-md cursor-zoom-in"
                    >
                      {AEROMAIL_SUSPICIOUS_EMAIL.ctaLabel}
                    </button>
                    {discoveredSet.has('suspicious-link') && (
                      <span className="text-[11px] font-extrabold text-[#BE123C] inline-flex items-center gap-1">
                        <ShieldAlert className="h-3.5 w-3.5" /> Red Flag #4
                      </span>
                    )}
                  </div>
                </div>

                {/* CLUE 5: Personal Information Request */}
                <button
                  type="button"
                  onClick={() => handleClueClick('personal-info')}
                  className={`block w-full text-left font-medium cursor-zoom-in ${clueStyle('personal-info')}`}
                >
                  <span>{AEROMAIL_SUSPICIOUS_EMAIL.infoRequestSentence}</span>
                  {discoveredSet.has('personal-info') && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#BE123C]">
                      <ShieldAlert className="h-3.5 w-3.5" /> Red Flag #5
                    </span>
                  )}
                </button>

                {/* Ordinary Sign-off */}
                <button
                  type="button"
                  onClick={() => handleOrdinaryClick('signoff')}
                  className="block text-left text-sm font-semibold text-[#475569] hover:bg-slate-50 rounded-lg px-2 py-0.5 cursor-zoom-in"
                >
                  {AEROMAIL_SUSPICIOUS_EMAIL.signOff}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Evidence Board Panel */}
        <aside className="hidden lg:block lg:col-span-4 rounded-[28px] border-2 border-white bg-white/95 p-5 shadow-[0_22px_55px_-12px_rgba(16,55,92,0.3)]">
          {evidenceBoardContent}
        </aside>
      </div>

      {/* Mobile / Tablet Collapsible Evidence Board Modal */}
      {showMobileBoard && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Evidence Board"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2945]/55 backdrop-blur-xs lg:hidden"
        >
          <div className="w-full max-w-md rounded-[28px] border-2 border-white bg-white p-5 shadow-2xl relative max-h-[85dvh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowMobileBoard(false)}
              aria-label="Close evidence board"
              className="absolute top-3.5 right-3.5 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#0E3558] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            {evidenceBoardContent}
          </div>
        </div>
      )}

      {/* SAFE SIMULATED LINK PREVIEW MODAL (NEVER opens real external site) */}
      {showSafeLinkModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Safe Link Inspector Preview"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2945]/55 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-[28px] border-2 border-white bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0369A1]">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>AeroMail Safe Link Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSafeLinkModal(false)}
                aria-label="Close link preview"
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#B45309] inline-flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                <span>Hidden Destination Web Address:</span>
              </p>
              <p className="font-mono text-xs sm:text-sm font-bold text-[#BE123C] bg-white rounded-xl border border-rose-200 px-3 py-2 break-all">
                {AEROMAIL_SUSPICIOUS_EMAIL.ctaSimulatedUrl}
              </p>
              <p className="text-xs text-[#475569] font-medium leading-relaxed">
                Notice how the button says &ldquo;{AEROMAIL_SUSPICIOUS_EMAIL.ctaLabel}&rdquo;, but it
                actually leads to an unfamiliar website outside our school!
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowSafeLinkModal(false);
                  handleClueClick('suspicious-link');
                }}
                className="aero-glossy-btn min-h-[44px] w-full rounded-full bg-gradient-to-b from-[#FB7185] to-[#E11D48] px-5 py-2 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
              >
                RECORD AS RED FLAG #4 (SUSPICIOUS LINK)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
