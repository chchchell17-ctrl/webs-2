import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Film,
  HelpCircle,
  Mail,
  Search,
} from 'lucide-react';
import { BRIEFING_DIALOGUE_SCRIPT } from '../../data/screen03Data.ts';
import type { GameSettings } from '../../types/game.ts';
import { playPortalOpen } from '../../utils/soundEffects.ts';
import { DialogueBox } from '../game/DialogueBox.tsx';

interface MissionBriefingProps {
  settings: GameSettings;
  onStartVideo: () => void;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({
  settings,
  onStartVideo,
}) => {
  const [briefingLineIdx, setBriefingLineIdx] = useState(0);
  const currentLine = BRIEFING_DIALOGUE_SCRIPT[briefingLineIdx];
  const allDialogueShown = briefingLineIdx >= BRIEFING_DIALOGUE_SCRIPT.length - 1;

  return (
    <>
      <div className="relative z-20 w-full max-w-5xl mx-auto px-2 sm:px-4 pb-44 sm:pb-48 flex flex-col items-center justify-center gap-3 sm:gap-4 pointer-events-auto">
        {/* Large Digital Case File Inside Central HQ Monitor Frame */}
        <div
          style={{
            background:
              'linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(226,248,255,0.95) 55%, rgba(243,232,255,0.94) 100%)',
          }}
          className="aero-glass-card w-full rounded-[28px] border-2 border-white p-4 sm:p-6 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)]"
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-center">
            {/* Left Visual Case Evidence Emblem */}
            <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-sky-100/90 via-white to-purple-100/80 border border-white p-4 sm:p-5 flex flex-col items-center justify-center gap-3 shadow-inner">
              <div className="relative flex items-center justify-center w-44 h-36 sm:w-48 sm:h-40">
                {/* Mystery Envelope Illustration */}
                <div className="relative rounded-2xl bg-gradient-to-br from-[#FDE68A] to-[#F59E0B] p-4 shadow-lg border-2 border-white w-36 h-26 flex flex-col items-center justify-center">
                  <Mail className="h-11 w-11 text-white drop-shadow-sm" aria-hidden="true" />
                  <span className="mt-1 text-[10px] font-extrabold tracking-widest uppercase text-amber-950">
                    MYSTERY CASE #01
                  </span>

                  {/* Glowing Question Mark Badge */}
                  <span
                    className={`absolute -top-3 -right-3 h-9 w-9 rounded-full bg-gradient-to-b from-[#A855F7] to-[#7C3AED] border-2 border-white text-white flex items-center justify-center shadow-md ${
                      settings.reducedMotion ? '' : 'animate-bounce'
                    }`}
                  >
                    <HelpCircle className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                {/* Animated Magnifying Glass Scanning */}
                <div
                  className={`absolute -bottom-1 right-2 h-14 w-14 rounded-full bg-white/90 border-2 border-sky-300 shadow-md flex items-center justify-center ${
                    settings.reducedMotion ? '' : 'animate-pulse'
                  }`}
                >
                  <Search className="h-7 w-7 text-[#0284C7]" aria-hidden="true" />
                </div>

                {/* Mini Digital Notification Card */}
                <div className="absolute -top-2 -left-2 rounded-xl bg-white/95 border border-rose-200 px-2.5 py-1.5 shadow-md flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-[#E11D48]" aria-hidden="true" />
                  <span className="text-[10px] font-extrabold text-[#BE123C] whitespace-nowrap">
                    FREE PRIZE?!
                  </span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#0369A1]">
                  STATUS: READY TO START
                </p>
              </div>
            </div>

            {/* Right Case File Details */}
            <div className="lg:col-span-7 space-y-3.5 text-left">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#6D28D9]">
                  MISSION 01 · DIGITAL CASE FILE
                </p>
                <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558] leading-snug">
                  THE MYSTERY OF THE UNEXPECTED PRIZE
                </h2>
              </div>

              <div className="rounded-2xl bg-white/90 border border-sky-100 p-3.5">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0284C7] mb-1">
                  CASE DESCRIPTION
                </p>
                <p className="text-sm sm:text-base font-semibold text-[#0E3558]">
                  &ldquo;An unexpected online message promises a FREE prize and asks someone to click a link.&rdquo;
                </p>
              </div>

              <div className="rounded-2xl bg-sky-50/90 border border-sky-200 p-3.5 space-y-2">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0369A1]">
                  YOUR MISSION
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs sm:text-sm font-semibold text-[#0E3558]">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Watch the investigation video.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Identify what is happening.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Make a decision about the suspicious message.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Discover why online safety matters.</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    onStartVideo();
                  }}
                  className="aero-glossy-btn min-h-[48px] w-full sm:w-auto rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Film className="h-5 w-5" aria-hidden="true" />
                  <span>WATCH THE VIDEO</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-Pinned Pusheen Briefing Dialogue */}
      {currentLine && (
        <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
          <div className="pointer-events-auto">
            <DialogueBox
              speaker={currentLine.speaker}
              speakerName={currentLine.speakerName}
              expression={currentLine.expression}
              text={currentLine.text}
              settings={settings}
              showNextButton={!allDialogueShown}
              onNext={() =>
                setBriefingLineIdx((prev) =>
                  Math.min(BRIEFING_DIALOGUE_SCRIPT.length - 1, prev + 1)
                )
              }
              onReplay={() => setBriefingLineIdx(0)}
              onSkipAll={() => setBriefingLineIdx(BRIEFING_DIALOGUE_SCRIPT.length - 1)}
            />
          </div>
        </div>
      )}
    </>
  );
};
