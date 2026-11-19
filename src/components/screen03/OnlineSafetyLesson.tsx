import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  ONLINE_SAFETY_RULES,
  type OnlineSafetyRuleItem,
  SAFETY_INTRO_SCRIPT,
} from '../../data/screen03Data.ts';
import type { AvatarConfig, GameSettings } from '../../types/game.ts';
import {
  playLoginSuccess,
  playPortalOpen,
  playSoftSelect,
} from '../../utils/soundEffects.ts';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface OnlineSafetyLessonProps {
  phase: 'safety-intro' | 'safety-rules';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  rulesCompleted: {
    rule1: boolean;
    rule2: boolean;
    rule3: boolean;
  };
  onCompleteSafetyIntro: () => void;
  onCompleteRule: (ruleId: 'rule1' | 'rule2' | 'rule3') => void;
  onContinueToKnowledgeCheck: () => void;
}

const RuleIllustration: React.FC<{
  ruleId: 'rule1' | 'rule2' | 'rule3';
  large?: boolean;
}> = ({ ruleId, large = false }) => {
  const sizeClass = large ? 'w-44 h-36 sm:w-52 sm:h-40' : 'w-32 h-24 sm:w-36 sm:h-28';

  if (ruleId === 'rule1') {
    // Cartoon hand stopping before clicking a computer mouse
    return (
      <svg viewBox="0 0 220 160" className={sizeClass} aria-hidden="true">
        <defs>
          <linearGradient id="r1-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>
          <linearGradient id="r1-mouse" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="208" height="148" rx="22" fill="url(#r1-bg)" stroke="#FFFFFF" strokeWidth="4" />
        {/* Mouse Cable */}
        <path d="M148 54 Q165 24 190 32" fill="none" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
        {/* Computer Mouse */}
        <rect x="122" y="54" width="52" height="76" rx="26" fill="url(#r1-mouse)" stroke="#0284C7" strokeWidth="3.5" />
        <line x1="124" y1="86" x2="172" y2="86" stroke="#0284C7" strokeWidth="2.5" />
        <line x1="148" y1="54" x2="148" y2="86" stroke="#0284C7" strokeWidth="2.5" />
        <rect x="144" y="64" width="8" height="14" rx="4" fill="#0369A1" />
        {/* Red/Amber Stop Octagon Badge */}
        <polygon
          points="72,26 94,26 108,40 108,62 94,76 72,76 58,62 58,40"
          fill="#F43F5E"
          stroke="#FFFFFF"
          strokeWidth="3.5"
        />
        <text x="83" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900">
          STOP
        </text>
        {/* Cartoon Open Hand Pausing Before Clicking */}
        <g>
          <rect x="42" y="88" width="44" height="44" rx="16" fill="#FDBA74" stroke="#9A3412" strokeWidth="3" />
          <rect x="34" y="66" width="11" height="28" rx="5.5" fill="#FDBA74" stroke="#9A3412" strokeWidth="2.5" />
          <rect x="46" y="56" width="11" height="36" rx="5.5" fill="#FDBA74" stroke="#9A3412" strokeWidth="2.5" />
          <rect x="58" y="54" width="11" height="38" rx="5.5" fill="#FDBA74" stroke="#9A3412" strokeWidth="2.5" />
          <rect x="70" y="60" width="11" height="32" rx="5.5" fill="#FDBA74" stroke="#9A3412" strokeWidth="2.5" />
          <rect x="81" y="92" width="22" height="11" rx="5.5" fill="#FDBA74" stroke="#9A3412" strokeWidth="2.5" />
        </g>
        {/* Pause Sparks */}
        <line x1="106" y1="74" x2="116" y2="66" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        <line x1="108" y1="88" x2="119" y2="88" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (ruleId === 'rule2') {
    // Digital padlock protecting personal information
    return (
      <svg viewBox="0 0 220 160" className={sizeClass} aria-hidden="true">
        <defs>
          <linearGradient id="r2-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F3E8FF" />
            <stop offset="100%" stopColor="#DDD6FE" />
          </linearGradient>
          <linearGradient id="r2-lock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="208" height="148" rx="22" fill="url(#r2-bg)" stroke="#FFFFFF" strokeWidth="4" />
        {/* Floating Private ID Card Behind Padlock */}
        <rect x="26" y="34" width="96" height="68" rx="12" fill="#FFFFFF" stroke="#A855F7" strokeWidth="2.5" />
        <circle cx="48" cy="58" r="10" fill="#C4B5FD" />
        <rect x="66" y="50" width="44" height="6" rx="3" fill="#7C3AED" />
        <rect x="66" y="62" width="36" height="5" rx="2.5" fill="#CBD5E1" />
        <rect x="38" y="78" width="70" height="8" rx="4" fill="#E9D5FF" />
        {/* Shiny Digital Padlock */}
        <path
          d="M118 68 V48 A24 24 0 0 1 166 48 V68"
          fill="none"
          stroke="#0284C7"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <rect x="104" y="66" width="76" height="62" rx="16" fill="url(#r2-lock)" stroke="#FFFFFF" strokeWidth="3.5" />
        <circle cx="142" cy="92" r="9" fill="#78350F" />
        <rect x="138" y="96" width="8" height="16" rx="4" fill="#78350F" />
        {/* Digital Sparkle */}
        <circle cx="188" cy="40" r="6" fill="#38BDF8" />
        <circle cx="192" cy="116" r="5" fill="#A855F7" />
      </svg>
    );
  }

  // Rule 3: Child asking parent or trusted adult for help while looking at a computer
  return (
    <svg viewBox="0 0 220 160" className={sizeClass} aria-hidden="true">
      <defs>
        <linearGradient id="r3-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DCFCE7" />
          <stop offset="100%" stopColor="#99F6E4" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="208" height="148" rx="22" fill="url(#r3-bg)" stroke="#FFFFFF" strokeWidth="4" />
      {/* Desk & Laptop/Monitor */}
      <rect x="116" y="52" width="78" height="54" rx="10" fill="#0EA5E9" stroke="#FFFFFF" strokeWidth="3.5" />
      <rect x="122" y="58" width="66" height="42" rx="6" fill="#E0F2FE" />
      <rect x="140" y="70" width="30" height="18" rx="5" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" />
      <text x="155" y="83" textAnchor="middle" fill="#92400E" fontSize="11" fontWeight="900">
        ?!
      </text>
      <rect x="108" y="106" width="94" height="12" rx="6" fill="#CBD5E1" />
      {/* Trusted Adult */}
      <circle cx="52" cy="54" r="19" fill="#FDBA74" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M33 52 Q36 30 55 32 Q72 34 71 52 Q58 42 33 52 Z" fill="#451A03" />
      <rect x="30" y="74" width="44" height="58" rx="18" fill="#0D9488" stroke="#FFFFFF" strokeWidth="3" />
      {/* Child Detective Looking Together */}
      <circle cx="96" cy="76" r="15" fill="#FED7AA" stroke="#FFFFFF" strokeWidth="2.5" />
      <path d="M81 74 Q84 58 98 60 Q112 62 111 74 Z" fill="#78350F" />
      <rect x="78" y="92" width="36" height="40" rx="14" fill="#6D28D9" stroke="#FFFFFF" strokeWidth="2.5" />
      {/* Helping Heart / Speech Sparkle */}
      <circle cx="78" cy="36" r="12" fill="#FFFFFF" stroke="#10B981" strokeWidth="2.5" />
      <text x="78" y="41" textAnchor="middle" fill="#059669" fontSize="13" fontWeight="900">
        +
      </text>
    </svg>
  );
};

export const OnlineSafetyLesson: React.FC<OnlineSafetyLessonProps> = ({
  phase,
  avatarConfig,
  nickname,
  settings,
  rulesCompleted,
  onCompleteSafetyIntro,
  onCompleteRule,
  onContinueToKnowledgeCheck,
}) => {
  const [introIdx, setIntroIdx] = useState(0);
  const [expandedRule, setExpandedRule] = useState<OnlineSafetyRuleItem | null>(null);

  const currentIntroStep = SAFETY_INTRO_SCRIPT[introIdx];
  const completedCount =
    Number(rulesCompleted.rule1) + Number(rulesCompleted.rule2) + Number(rulesCompleted.rule3);
  const allThreeDone = completedCount === 3;

  // SCENE 07: What Is Online Safety?
  if (phase === 'safety-intro' && currentIntroStep) {
    return (
      <>
        <div className="relative z-20 w-full max-w-4xl mx-auto px-2 sm:px-4 pb-44 sm:pb-48 flex flex-col items-center justify-center gap-4 pointer-events-auto">
          <div
            style={{
              background:
                'linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(224,242,254,0.94) 55%, rgba(237,233,254,0.94) 100%)',
            }}
            className="aero-glass-card w-full max-w-2xl rounded-[30px] border-2 border-white p-6 sm:p-8 text-center space-y-3 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)]"
          >
            <div className="relative z-10 flex flex-col items-center space-y-2.5">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-b from-[#34D399] to-[#0D9488] border-2 border-white shadow-md flex items-center justify-center text-white">
                <ShieldCheck className="h-8 w-8" aria-hidden="true" />
              </div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#0284C7]">
                DETECTIVE HQ · LEARNING CORNER
              </p>
              <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
                ONLINE SAFETY
              </h2>
              <p className="font-[var(--font-display)] text-base sm:text-lg font-extrabold text-[#6D28D9]">
                THINK BEFORE YOU CLICK!
              </p>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
          <div className="pointer-events-auto">
            <DialogueBox
              speaker={currentIntroStep.speaker}
              speakerName={currentIntroStep.speakerName}
              playerNickname={nickname}
              playerAvatar={avatarConfig}
              expression={currentIntroStep.expression}
              text={currentIntroStep.text}
              settings={settings}
              onReplay={() => setIntroIdx(0)}
              onSkipAll={() => onCompleteSafetyIntro()}
              onNext={() => {
                if (introIdx + 1 < SAFETY_INTRO_SCRIPT.length) {
                  setIntroIdx((prev) => prev + 1);
                } else {
                  onCompleteSafetyIntro();
                }
              }}
            />
          </div>
        </div>
      </>
    );
  }

  // SCENE 08: Three Interactive Online Safety Rules
  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-2 sm:px-4 pb-6 flex flex-col gap-3.5 pointer-events-auto">
      {/* Header Banner */}
      <div className="rounded-[24px] bg-white/92 backdrop-blur-md border-2 border-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2 shadow-md">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#6D28D9]">
            ONLINE SAFETY · THREE IMPORTANT DETECTIVE RULES
          </p>
          <h2 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#0E3558]">
            Click each rule card below to investigate and unlock it!
          </h2>
        </div>

        <div className="text-xs sm:text-sm font-extrabold tabular-nums text-[#0369A1] bg-sky-100 border border-sky-200 rounded-xl px-3 py-1.5">
          {completedCount} / 3 Rules Explored
        </div>
      </div>

      {/* Expanded Rule View vs 3 Interactive Cards Grid */}
      {expandedRule ? (
        <div
          style={{
            background:
              'linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(232,248,255,0.96) 55%, rgba(243,232,255,0.96) 100%)',
          }}
          className="aero-glass-card rounded-[28px] border-2 border-white p-5 sm:p-7 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.38)] space-y-5"
        >
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-white/90 border border-sky-100 p-4 shadow-inner">
              <RuleIllustration ruleId={expandedRule.id} large={true} />
              <p className={`mt-2 text-xs font-extrabold uppercase tracking-wider ${expandedRule.accentText}`}>
                RULE {expandedRule.number} · {expandedRule.shortTag}
              </p>
            </div>

            <div className="md:col-span-7 space-y-3 text-left">
              <h3 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558]">
                RULE {expandedRule.number}: {expandedRule.heading}
              </h3>

              {/* Pusheen Delivery */}
              <div className="rounded-2xl bg-sky-50/95 border border-sky-200 p-3.5 flex items-start gap-3">
                <div className="h-12 w-12 shrink-0">
                  <PusheenIllustration expression="encouraging" />
                </div>
                <div className="space-y-1 text-xs sm:text-sm font-semibold text-[#0E3558]">
                  <p className="font-extrabold text-[#0369A1]">Detective Pusheen says:</p>
                  {expandedRule.pusheenSays.map((line) => (
                    <p key={line}>&ldquo;{line}&rdquo;</p>
                  ))}
                </div>
              </div>

              {/* Example Box */}
              <div className="rounded-2xl bg-white/95 border border-purple-200 p-3.5 space-y-1.5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#6D28D9]">
                  {expandedRule.exampleTitle}
                </p>
                {expandedRule.exampleItems.length === 1 ? (
                  <p className="text-xs sm:text-sm font-semibold text-[#0E3558]">
                    {expandedRule.exampleItems[0]}
                  </p>
                ) : (
                  <ul className="grid grid-cols-2 gap-1 text-xs sm:text-sm font-semibold text-[#0E3558] list-disc pl-4">
                    {expandedRule.exampleItems.map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Remember Banner */}
              <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-3 flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#15803D]">
                <ShieldCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>REMEMBER: {expandedRule.remember}</span>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const willCompleteAll =
                      !rulesCompleted[expandedRule.id] && completedCount + 1 === 3;
                    if (willCompleteAll) {
                      playLoginSuccess();
                    } else {
                      playSoftSelect();
                    }
                    onCompleteRule(expandedRule.id);
                    setExpandedRule(null);
                  }}
                  className="aero-glossy-btn min-h-[46px] w-full sm:w-auto rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-7 py-2 text-sm font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>CONTINUE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {ONLINE_SAFETY_RULES.map((rule) => {
              const isDone = rulesCompleted[rule.id];
              return (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => {
                    playSoftSelect();
                    setExpandedRule(rule);
                  }}
                  className={`group rounded-[26px] border-2 p-4 sm:p-5 bg-gradient-to-b ${rule.accentGradient} ${
                    isDone ? 'border-emerald-400 ring-2 ring-emerald-200/80' : `${rule.borderColor}`
                  } shadow-[0_14px_34px_-10px_rgba(16,55,92,0.28)] flex flex-col items-center justify-between text-center gap-3 transition-transform duration-150 hover:-translate-y-1 hover:shadow-xl active:scale-98 cursor-pointer`}
                >
                  <div className="w-full flex items-center justify-between gap-2 text-xs font-extrabold">
                    <span className={rule.accentText}>RULE {rule.number}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] ${
                        isDone
                          ? 'bg-emerald-100 text-[#15803D]'
                          : 'bg-amber-100 text-[#B45309]'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>COMPLETED</span>
                        </>
                      ) : (
                        <span>CLICK TO EXPLORE</span>
                      )}
                    </span>
                  </div>

                  <div className="py-1 transition-transform duration-150 group-hover:scale-105">
                    <RuleIllustration ruleId={rule.id} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-[var(--font-display)] text-base sm:text-lg font-bold text-[#0E3558] leading-snug">
                      {rule.heading}
                    </h3>
                    <p className="text-xs font-semibold text-[#475569]">
                      {rule.shortTag}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* All Three Rules Completion Celebration & Continue CTA */}
          {allThreeDone ? (
            <div className="space-y-3">
              <div className="rounded-[24px] bg-gradient-to-r from-emerald-50 via-white to-sky-50 border-2 border-emerald-300 p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0">
                    <PusheenIllustration expression="celebrating" pose="waving" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#15803D] inline-flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>ALL THREE RULES DISCOVERED!</span>
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-[#0E3558]">
                      <strong>Detective Pusheen:</strong> &ldquo;Wonderful! You&apos;re learning how to
                      become a smart digital detective!&rdquo;
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    onContinueToKnowledgeCheck();
                  }}
                  className="aero-glossy-btn min-h-[48px] w-full sm:w-auto rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-7 py-2.5 text-sm sm:text-base font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-sky-50/95 border border-white p-3 flex items-center gap-3 shadow-sm">
              <div className="h-11 w-11 shrink-0">
                <PusheenIllustration expression="encouraging" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#0E3558]">
                <strong>Detective Pusheen:</strong> &ldquo;Click all three rule cards above and read
                each one carefully before we continue!&rdquo;
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
