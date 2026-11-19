import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { PusheenIllustration } from './PusheenIllustration.tsx';

export type LoadingAccent = 'sky' | 'purple' | 'rose' | 'emerald' | 'pink' | 'amber' | 'teal';

interface LocationLoadingScreenProps {
  destinationName: string;
  subtitle?: string;
  accent?: LoadingAccent;
  reducedMotion: boolean;
  preloadImages?: string[];
  preloadVideo?: string;
  onComplete: () => void;
}

const ACCENT_STYLES: Record<
  LoadingAccent,
  {
    bgGradient: string;
    ringStroke: string;
    ringTrack: string;
    pillBg: string;
    pillText: string;
    barFill: string;
    titleColor: string;
  }
> = {
  sky: {
    bgGradient: 'from-[#5BBBE9] via-[#BAE6FD] to-[#E0F7FF]',
    ringStroke: '#0284C7',
    ringTrack: 'rgba(255,255,255,0.65)',
    pillBg: 'bg-sky-100 border-sky-200',
    pillText: 'text-[#0369A1]',
    barFill: 'from-[#38BDF8] via-[#0EA5E9] to-[#0284C7]',
    titleColor: 'text-[#0E3558]',
  },
  purple: {
    bgGradient: 'from-[#6DD5FA] via-[#DDD6FE] to-[#F3E8FF]',
    ringStroke: '#7C3AED',
    ringTrack: 'rgba(255,255,255,0.65)',
    pillBg: 'bg-purple-100 border-purple-200',
    pillText: 'text-[#6D28D9]',
    barFill: 'from-[#C084FC] via-[#A855F7] to-[#7C3AED]',
    titleColor: 'text-[#0E3558]',
  },
  rose: {
    bgGradient: 'from-[#7DD3FC] via-[#FFE4E6] to-[#FFF1F2]',
    ringStroke: '#E11D48',
    ringTrack: 'rgba(255,255,255,0.65)',
    pillBg: 'bg-rose-100 border-rose-200',
    pillText: 'text-[#BE123C]',
    barFill: 'from-[#FB7185] via-[#F43F5E] to-[#E11D48]',
    titleColor: 'text-[#0E3558]',
  },
  emerald: {
    bgGradient: 'from-[#6DD5FA] via-[#D1FAE5] to-[#ECFDF5]',
    ringStroke: '#059669',
    ringTrack: 'rgba(255,255,255,0.65)',
    pillBg: 'bg-emerald-100 border-emerald-200',
    pillText: 'text-[#047857]',
    barFill: 'from-[#34D399] via-[#10B981] to-[#059669]',
    titleColor: 'text-[#0E3558]',
  },
  pink: {
    bgGradient: 'from-[#818CF8] via-[#FBCFE8] to-[#FDF4FF]',
    ringStroke: '#C026D3',
    ringTrack: 'rgba(255,255,255,0.65)',
    pillBg: 'bg-fuchsia-100 border-fuchsia-200',
    pillText: 'text-[#9333EA]',
    barFill: 'from-[#F472B6] via-[#D946EF] to-[#9333EA]',
    titleColor: 'text-[#0E3558]',
  },
  amber: {
    bgGradient: 'from-[#7DD3FC] via-[#FDE68A] to-[#FFFBEB]',
    ringStroke: '#D97706',
    ringTrack: 'rgba(255,255,255,0.65)',
    pillBg: 'bg-amber-100 border-amber-200',
    pillText: 'text-[#B45309]',
    barFill: 'from-[#FBBF24] via-[#F59E0B] to-[#D97706]',
    titleColor: 'text-[#0E3558]',
  },
  teal: {
    bgGradient: 'from-[#99F6E4] via-[#EDE9FE] to-[#F0FDFA]',
    ringStroke: '#0D9488',
    ringTrack: 'rgba(255,255,255,0.65)',
    pillBg: 'bg-teal-100 border-teal-200',
    pillText: 'text-[#0F766E]',
    barFill: 'from-[#2DD4BF] via-[#14B8A6] to-[#0D9488]',
    titleColor: 'text-[#0E3558]',
  },
};

const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const LocationLoadingScreen: React.FC<LocationLoadingScreenProps> = ({
  destinationName,
  subtitle = 'Preparing your detective gear and scene...',
  accent = 'sky',
  reducedMotion,
  preloadImages = [],
  preloadVideo,
  onComplete,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const imagesKey = preloadImages.join('|');

  useEffect(() => {
    let cancelled = false;
    let assetsReady = false;
    let finishedCalled = false;

    const imageList = imagesKey ? imagesKey.split('|').filter(Boolean) : [];
    const totalAssets = imageList.length + (preloadVideo ? 1 : 0);

    if (totalAssets === 0) {
      assetsReady = true;
    } else {
      let settled = 0;
      const markOneDone = () => {
        settled += 1;
        if (settled >= totalAssets) {
          assetsReady = true;
        }
      };

      imageList.forEach((src) => {
        const img = new Image();
        img.onload = markOneDone;
        img.onerror = markOneDone;
        img.src = src;
      });

      if (preloadVideo) {
        const vid = document.createElement('video');
        vid.preload = 'metadata';
        let vidSettled = false;
        const finishVid = () => {
          if (vidSettled) return;
          vidSettled = true;
          markOneDone();
        };
        vid.onloadedmetadata = finishVid;
        vid.onerror = finishVid;
        vid.src = preloadVideo;
        window.setTimeout(finishVid, 1200);
      }

      // Safety cap so slow network assets never stall transition
      window.setTimeout(() => {
        assetsReady = true;
      }, 1500);
    }

    const minDurationMs = reducedMotion ? 360 : 1250;
    const startTime = performance.now();

    const intervalId = window.setInterval(() => {
      if (cancelled) return;
      const elapsed = performance.now() - startTime;
      const timeRatio = Math.min(1, elapsed / minDurationMs);

      // Hold smoothly around 94% until preloaded assets report ready (or cap timeout fires)
      const rawTarget = assetsReady
        ? Math.round(timeRatio * 100)
        : Math.min(94, Math.round(timeRatio * 94));

      setProgress((prev) => Math.max(prev, rawTarget));

      if (timeRatio >= 1 && assetsReady && !finishedCalled) {
        finishedCalled = true;
        setProgress(100);
        window.clearInterval(intervalId);
        window.setTimeout(() => {
          if (!cancelled) {
            onCompleteRef.current();
          }
        }, reducedMotion ? 80 : 220);
      }
    }, 32);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [destinationName, reducedMotion, imagesKey, preloadVideo]);

  const theme = ACCENT_STYLES[accent];
  const strokeOffset = RING_CIRCUMFERENCE * (1 - progress / 100);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading ${destinationName}, ${progress} percent`}
      className={`fixed inset-0 z-[80] flex items-center justify-center p-4 bg-gradient-to-b ${theme.bgGradient}`}
    >
      <div
        style={{
          background:
            'linear-gradient(155deg, rgba(255,255,255,0.95) 0%, rgba(236,249,255,0.92) 55%, rgba(245,243,255,0.94) 100%)',
        }}
        className="aero-glass-card w-full max-w-md rounded-[32px] border-2 border-white p-6 sm:p-8 text-center shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)]"
      >
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest ${theme.pillBg} ${theme.pillText}`}
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>ENTERING NEW LOCATION</span>
          </div>

          {/* Buffering Circle + Progress Ring + Pusheen */}
          <div className="relative flex items-center justify-center w-36 h-36">
            {/* Outer Spinning Buffering Circle */}
            <div
              aria-hidden="true"
              className={`absolute inset-0 rounded-full border-[3px] border-dashed border-sky-300/80 ${
                reducedMotion ? '' : 'animate-spin'
              }`}
              style={{ animationDuration: '5s' }}
            />

            {/* Circular Progress Arc */}
            <svg viewBox="0 0 128 128" className="w-32 h-32 -rotate-90" aria-hidden="true">
              <circle
                cx="64"
                cy="64"
                r={RING_RADIUS}
                fill="rgba(255,255,255,0.72)"
                stroke={theme.ringTrack}
                strokeWidth="9"
              />
              <circle
                cx="64"
                cy="64"
                r={RING_RADIUS}
                fill="none"
                stroke={theme.ringStroke}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={strokeOffset}
                style={{
                  transition: reducedMotion ? 'none' : 'stroke-dashoffset 80ms linear',
                }}
              />
            </svg>

            {/* Pusheen Emblem Centered Inside Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-18 h-16">
                <PusheenIllustration
                  expression={progress >= 100 ? 'celebrating' : 'excited'}
                  pose={progress >= 100 ? 'waving' : 'normal'}
                />
              </div>
            </div>
          </div>

          {/* Numeric Loading Percentage + Buffering Spinner */}
          <div className="flex items-center justify-center gap-2">
            <Loader2
              className={`h-5 w-5 ${theme.pillText} ${reducedMotion ? '' : 'animate-spin'}`}
              aria-hidden="true"
            />
            <span className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold tabular-nums text-[#0E3558]">
              {progress}%
            </span>
          </div>

          {/* Linear Progress Track */}
          <div className="w-full h-3 rounded-full bg-white/90 border border-sky-100 overflow-hidden p-0.5 shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${theme.barFill}`}
              style={{
                width: `${progress}%`,
                transition: reducedMotion ? 'none' : 'width 80ms linear',
              }}
            />
          </div>

          <div className="space-y-1">
            <h2 className={`font-[var(--font-display)] text-xl sm:text-2xl font-bold ${theme.titleColor}`}>
              {destinationName}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#475569]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
