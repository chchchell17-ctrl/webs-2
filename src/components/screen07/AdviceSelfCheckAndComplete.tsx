import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Gamepad2, Map, Sparkles } from 'lucide-react';
import {
  SCREEN07_COMPLETION_SCRIPT,
  SCREEN07_SELF_CHECK_ITEMS,
} from '../../data/screen07Data.ts';
import type { AvatarConfig, GameSettings } from '../../types/game.ts';
import { playLoginSuccess, playPortalOpen, playSoftSelect } from '../../utils/soundEffects.ts';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface AdviceSelfCheckAndCompleteProps {
  mode: 'self-check' | 'completion';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  selfCheck: {
    askAdvice: boolean;
    giveAdvice: boolean;
    respondAdvice: boolean;
  };
  onToggleSelfCheck: (key: 'askAdvice' | 'giveAdvice' | 'respondAdvice') => void;
  onFinishSelfCheck: () => void;
  onContinueToGameArcade: () => void;
  onReturnToTown: () => void;
}

export const AdviceSelfCheckAndComplete: React.FC<AdviceSelfCheckAndCompleteProps> = ({
  mode,
  avatarConfig,
  nickname,
  settings,
  selfCheck,
  onToggleSelfCheck,
  onFinishSelfCheck,
  onContinueToGameArcade,
  onReturnToTown,
}) => {
  const [completionStepIdx, setCompletionStepIdx] = useState(0);
  const [dialogueFinished, setDialogueFinished] = useState(false);

  const completedCount = [
    selfCheck.askAdvice,
    selfCheck.giveAdvice,
    selfCheck.respondAdvice,
  ].filter(Boolean).length;
  const allChecked = completedCount === 3;

  if (mode === 'self-check') {
    return (
      <div className="relative z-20 w-full max-w-3xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
        <div className="rounded-[32px] border-2 border-white bg-white/95 p-6 sm:p-8 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] space-y-5 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-100 pb-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0D9488]">
                SCENE 10 · SIMPLE SELF-CHECK
              </p>
              <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
                THREE THINGS I CAN DO!
              </h2>
            </div>

            <span
              className={`rounded-2xl border px-4 py-1.5 text-xs sm:text-sm font-extrabold ${
                allChecked
                  ? 'bg-emerald-100 border-emerald-300 text-[#15803D]'
                  : 'bg-sky-50 border-sky-200 text-[#0369A1]'
              }`}
            >
              {completedCount} / 3 COMPLETED!
            </span>
          </div>

          <p className="text-sm font-semibold text-[#334155]">
            Tick each skill below once you feel confident using it in online safety conversations:
          </p>

          {/* STRICTLY 3 Simple Self-Check Checkboxes */}
          <div className="space-y-3">
            {SCREEN07_SELF_CHECK_ITEMS.map((item) => {
              const checked = selfCheck[item.key];
              return (
                <label
                  key={item.key}
                  onClick={() => playSoftSelect()}
                  className={`flex items-start gap-3.5 rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                    checked
                      ? 'bg-emerald-50/90 border-emerald-400 shadow-sm'
                      : 'bg-white border-sky-200 hover:border-sky-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleSelfCheck(item.key)}
                    className="mt-1 h-5 w-5 rounded accent-emerald-600 cursor-pointer shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-extrabold text-[#0E3558]">
                      {item.label}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-[#475569] mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                  {checked && <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0 mt-1" />}
                </label>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={!allChecked}
              onClick={() => {
                playLoginSuccess();
                onFinishSelfCheck();
              }}
              className="aero-glossy-btn min-h-[50px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] disabled:opacity-45 disabled:cursor-not-allowed px-7 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>FINISH ACTIVITY 4</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 'completion'
  const currentStep = !dialogueFinished ? SCREEN07_COMPLETION_SCRIPT[completionStepIdx] : null;

  return (
    <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 pb-44 sm:pb-48">
      <div className="w-full max-w-3xl rounded-[32px] border-2 border-white bg-white/95 p-6 sm:p-8 shadow-2xl text-center space-y-5">
        <div className="flex items-end justify-center gap-8">
          <div className="w-24 h-30">
            <DetectiveAvatar config={avatarConfig} view="front" pose="celebrate" />
          </div>
          <div className="w-24 h-22">
            <PusheenIllustration expression="celebrating" pose="waving" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
          <CheckCircle2 className="h-4 w-4" />
          <span>ACTIVITY 4 COMPLETED! WORDS THAT HELP.</span>
        </div>

        <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
          CONGRATULATIONS, DETECTIVE {nickname.toUpperCase()}!
        </h2>

        <p className="text-sm sm:text-base font-semibold text-[#334155] max-w-xl mx-auto">
          Your 3-part advice portfolio and 3/3 self-check have been saved for your teacher and
          parents! Look across Detective Town — the{' '}
          <span className="font-extrabold text-[#7C3AED]">Game Arcade</span> is now unlocked!
        </p>

        {dialogueFinished && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onContinueToGameArcade();
              }}
              className="aero-glossy-btn min-h-[50px] rounded-full bg-gradient-to-b from-[#A855F7] to-[#7C3AED] hover:from-[#C084FC] hover:to-[#6D28D9] border border-white px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>PREVIEW GAME ARCADE UNLOCK</span>
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
        )}
      </div>

      {currentStep && (
        <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
          <div className="pointer-events-auto">
            <DialogueBox
              speaker={currentStep.speaker}
              speakerName={currentStep.speakerName}
              playerNickname={nickname}
              playerAvatar={avatarConfig}
              expression={currentStep.expression}
              text={currentStep.text}
              settings={settings}
              nextLabel={
                completionStepIdx + 1 < SCREEN07_COMPLETION_SCRIPT.length
                  ? 'NEXT'
                  : 'UNLOCK GAME ARCADE'
              }
              onSkipAll={() => setDialogueFinished(true)}
              onNext={() => {
                if (completionStepIdx + 1 < SCREEN07_COMPLETION_SCRIPT.length) {
                  setCompletionStepIdx((p) => p + 1);
                } else {
                  setDialogueFinished(true);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
