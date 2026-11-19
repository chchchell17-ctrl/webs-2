import React, { useState } from 'react';
import {
  AlertTriangle,
  Gift,
  ShieldCheck,
  Smartphone,
  Tablet,
  Wifi,
  X,
} from 'lucide-react';
import { AINA_SMARTPHONE_MESSAGE } from '../../data/screen05Data.ts';
import { playSoftSelect } from '../../utils/soundEffects.ts';

interface AinaPhoneMessageProps {
  onInspected?: () => void;
}

export const AinaPhoneMessage: React.FC<AinaPhoneMessageProps> = ({ onInspected }) => {
  const [showSafePreview, setShowSafePreview] = useState(false);

  return (
    <>
      <div className="w-full max-w-[340px] mx-auto rounded-[36px] border-4 border-[#1E293B] bg-[#0F172A] p-2.5 shadow-[0_22px_50px_-10px_rgba(15,23,42,0.5)]">
        {/* Phone Top Speaker Notch */}
        <div className="flex items-center justify-between px-4 py-1 text-[10px] font-bold text-slate-300">
          <span>{AINA_SMARTPHONE_MESSAGE.time}</span>
          <span className="h-1.5 w-14 rounded-full bg-slate-700" />
          <span className="inline-flex items-center gap-1">
            <Wifi className="h-3 w-3 text-sky-300" />
            <span>5G</span>
          </span>
        </div>

        {/* Phone Screen */}
        <div className="mt-1 rounded-[26px] bg-gradient-to-b from-[#EFF6FF] via-white to-[#FFF1F2] overflow-hidden border border-slate-700/40">
          {/* Sender Header */}
          <div className="bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#7C3AED] px-4 py-3 text-white">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold tracking-wide leading-tight">
                    {AINA_SMARTPHONE_MESSAGE.senderHeader}
                  </p>
                  <p className="text-[10px] font-bold text-amber-200 tracking-wider">
                    {AINA_SMARTPHONE_MESSAGE.senderSub}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold opacity-90">
                {AINA_SMARTPHONE_MESSAGE.time}
              </span>
            </div>
          </div>

          {/* Message Body */}
          <div className="p-4 space-y-3 text-left">
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-amber-400 text-white flex items-center justify-center shrink-0">
                <Tablet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#BE123C]">
                  {AINA_SMARTPHONE_MESSAGE.headline}
                </p>
                <p className="text-[11px] font-bold text-[#92400E]">
                  Lucky Tablet Giveaway Alert
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-[13px] font-semibold text-[#0E3558] leading-relaxed">
              {AINA_SMARTPHONE_MESSAGE.paragraphs.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            {/* Simulated CTA Button (never navigates externally) */}
            <button
              type="button"
              onClick={() => {
                playSoftSelect();
                onInspected?.();
                setShowSafePreview(true);
              }}
              className="aero-glossy-btn w-full min-h-[42px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] border border-white px-4 py-2 text-xs font-extrabold text-white inline-flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Gift className="h-4 w-4" />
              <span>{AINA_SMARTPHONE_MESSAGE.ctaLabel}</span>
            </button>
          </div>
        </div>

        {/* Bottom Home Bar */}
        <div className="mt-2 mb-0.5 flex justify-center">
          <div className="h-1 w-20 rounded-full bg-slate-600" />
        </div>
      </div>

      {/* Safe Link Preview Modal */}
      {showSafePreview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Safe Smartphone Link Preview"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2945]/55 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-[28px] border-2 border-white bg-white p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-start justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0369A1]">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Safe Detective Link Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSafePreview(false)}
                aria-label="Close safe preview"
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 space-y-2">
              <p className="text-xs font-extrabold text-[#BE123C] inline-flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                <span>Remember: Think Before You Click!</span>
              </p>
              <p className="font-mono text-xs font-bold text-[#9F1239] bg-white rounded-xl border border-rose-200 px-3 py-2 break-all">
                {AINA_SMARTPHONE_MESSAGE.simulatedDestinationUrl}
              </p>
              <p className="text-xs font-semibold text-[#334155]">
                In Detective Mode we NEVER open unknown links! Notice how it tries to send Aina to an
                untrusted outside website.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSafePreview(false)}
              className="aero-glossy-btn w-full min-h-[44px] rounded-full bg-gradient-to-b from-[#2AB2DF] to-[#0E83B5] px-5 py-2 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
            >
              BACK TO INVESTIGATION
            </button>
          </div>
        </div>
      )}
    </>
  );
};
