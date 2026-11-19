import React, { useEffect, useRef, useState } from 'react';
import {
  Captions,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  INVESTIGATION_VIDEO_SRC,
  VIDEO_STORYBOARD_SHOTS,
  VIDEO_TOTAL_DURATION_SEC,
} from '../../data/screen03Data.ts';
import type { GameSettings } from '../../types/game.ts';
import { playSoftSelect } from '../../utils/soundEffects.ts';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface InvestigationVideoPlayerProps {
  settings: GameSettings;
  compact?: boolean;
  alreadyWatched?: boolean;
  onVideoComplete?: () => void;
  onContinueAfterVideo?: () => void;
}

function formatTime(sec: number): string {
  const clamped = Math.max(0, Math.floor(sec));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const InvestigationVideoPlayer: React.FC<InvestigationVideoPlayerProps> = ({
  settings,
  compact = false,
  alreadyWatched = false,
  onVideoComplete,
  onContinueAfterVideo,
}) => {
  const monitorContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [duration, setDuration] = useState<number>(VIDEO_TOTAL_DURATION_SEC);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasEnded, setHasEnded] = useState<boolean>(alreadyWatched);
  const [volume, setVolume] = useState<number>(settings.soundEffects ? 85 : 0);
  const [autoplayMutedHint, setAutoplayMutedHint] = useState<boolean>(false);
  const [subtitlesOn, setSubtitlesOn] = useState<boolean>(settings.subtitles);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState<boolean>(false);
  const [postVideoLineIdx, setPostVideoLineIdx] = useState<0 | 1>(0);
  const completedOnceRef = useRef<boolean>(alreadyWatched);

  // Sync audio volume & mute directly to the HTML5 <video> element
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.volume = Math.max(0, Math.min(1, volume / 100));
    vid.muted = volume === 0;
  }, [volume]);

  // Attempt graceful autoplay on full video scene mount when not already watched
  useEffect(() => {
    if (compact || alreadyWatched) return;
    const vid = videoRef.current;
    if (!vid) return;

    let cancelled = false;
    const startPlayback = async () => {
      try {
        vid.volume = settings.soundEffects ? 0.85 : 0;
        vid.muted = !settings.soundEffects;
        await vid.play();
      } catch {
        if (cancelled) return;
        // Fallback to muted autoplay when browser blocks unmuted autoplay
        try {
          vid.muted = true;
          setVolume(0);
          setAutoplayMutedHint(true);
          await vid.play();
        } catch {
          // User can tap the visible Play button on the monitor
        }
      }
    };

    void startPlayback();
    return () => {
      cancelled = true;
    };
  }, [compact, alreadyWatched, settings.soundEffects]);

  // Listen to native fullscreen exit
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const progressRatio = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
  const currentShot =
    VIDEO_STORYBOARD_SHOTS.find(
      (s) => progressRatio >= s.startRatio && progressRatio < s.endRatio
    ) ?? VIDEO_STORYBOARD_SHOTS[VIDEO_STORYBOARD_SHOTS.length - 1];

  const handleTogglePlay = async () => {
    playSoftSelect();
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.ended || (duration > 0 && vid.currentTime >= duration - 0.15)) {
      vid.currentTime = 0;
      setCurrentTime(0);
    }

    if (vid.paused) {
      try {
        await vid.play();
      } catch {
        // Ignore blocked play
      }
    } else {
      vid.pause();
    }
  };

  const handleReplay = async () => {
    playSoftSelect();
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    setCurrentTime(0);
    try {
      await vid.play();
    } catch {
      // Ignore blocked play
    }
  };

  const handleSeek = (nextSec: number) => {
    const vid = videoRef.current;
    const maxSec = duration || VIDEO_TOTAL_DURATION_SEC;
    const clamped = Math.max(0, Math.min(maxSec, nextSec));
    setCurrentTime(clamped);
    if (vid) {
      vid.currentTime = clamped;
    }
    if (clamped >= maxSec - 0.1) {
      setHasEnded(true);
      if (!completedOnceRef.current) {
        completedOnceRef.current = true;
        onVideoComplete?.();
      }
    }
  };

  const handleEnableSoundFromHint = () => {
    playSoftSelect();
    setVolume(85);
    setAutoplayMutedHint(false);
    const vid = videoRef.current;
    if (vid) {
      vid.muted = false;
      vid.volume = 0.85;
    }
  };

  const handleToggleFullscreen = async () => {
    playSoftSelect();
    if (isPseudoFullscreen) {
      setIsPseudoFullscreen(false);
      return;
    }
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        setIsFullscreen(false);
      }
      return;
    }
    const el = monitorContainerRef.current;
    if (el && el.requestFullscreen) {
      try {
        await el.requestFullscreen();
        return;
      } catch {
        // Fallback when embedded inside restricted iframe
      }
    }
    setIsPseudoFullscreen(true);
  };

  const isExpandedFs = isFullscreen || isPseudoFullscreen;

  const monitorFrame = (
    <div
      ref={monitorContainerRef}
      className={`${
        isPseudoFullscreen
          ? 'fixed inset-3 sm:inset-6 z-[70] flex flex-col justify-center bg-[#0B2945]/90 backdrop-blur-md p-3 sm:p-5 rounded-[30px]'
          : 'w-full'
      }`}
    >
      {/* Glossy HQ Computer Monitor Bezel */}
      <div className="rounded-[24px] border-4 border-white bg-gradient-to-b from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] p-2.5 sm:p-3.5 shadow-[0_20px_50px_-10px_rgba(16,55,92,0.38)]">
        {/* Monitor Top Status Trim */}
        <div className="flex items-center justify-between gap-2 px-2 pb-2 text-[10px] sm:text-[11px] font-extrabold text-[#0369A1]">
          <span className="truncate">
            DETECTIVE HQ MONITOR · EVIDENCE CLIP ({currentShot.title})
          </span>
          <span className="shrink-0 text-[#6D28D9]">MISSION 01 VIDEO</span>
        </div>

        {/* 16:9 Real Video Viewport */}
        <div
          className={`relative w-full ${
            isExpandedFs ? 'max-h-[70dvh] aspect-video mx-auto' : 'aspect-video'
          } rounded-2xl overflow-hidden border-2 border-[#0284C7]/40 bg-[#0F172A] shadow-inner select-none`}
        >
          <video
            ref={videoRef}
            src={INVESTIGATION_VIDEO_SRC}
            playsInline
            preload="metadata"
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration;
              if (Number.isFinite(d) && d > 0) {
                setDuration(d);
              }
            }}
            onTimeUpdate={(e) => {
              setCurrentTime(e.currentTarget.currentTime);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              setHasEnded(true);
              if (!completedOnceRef.current) {
                completedOnceRef.current = true;
                onVideoComplete?.();
              }
            }}
            onClick={handleTogglePlay}
            className="w-full h-full object-contain bg-black cursor-pointer"
          />

          {/* Tap to Play Overlay when Paused at Start/Middle */}
          {!isPlaying && (
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={hasEnded ? 'Replay investigation video' : 'Play investigation video'}
              className="absolute inset-0 z-10 flex items-center justify-center bg-[#0E3558]/25 hover:bg-[#0E3558]/15 transition-colors cursor-pointer"
            >
              <span className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white/95 border-4 border-sky-300 shadow-2xl flex items-center justify-center text-[#0284C7] transition-transform hover:scale-105 active:scale-95">
                {currentTime >= duration - 0.25 && hasEnded ? (
                  <RotateCcw className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden="true" />
                ) : (
                  <Play className="h-8 w-8 sm:h-9 sm:w-9 ml-1 fill-[#0284C7]" aria-hidden="true" />
                )}
              </span>
            </button>
          )}

          {/* Tap for Sound Pill if Autoplay Muted */}
          {autoplayMutedHint && isPlaying && volume === 0 && (
            <button
              type="button"
              onClick={handleEnableSoundFromHint}
              className="absolute top-3 left-3 z-20 rounded-full bg-white/95 hover:bg-white border-2 border-sky-300 px-3.5 py-1.5 text-xs font-extrabold text-[#0369A1] shadow-lg inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="h-4 w-4 text-[#0284C7]" aria-hidden="true" />
              <span>Tap for Sound</span>
            </button>
          )}

          {/* End-of-Video Badge */}
          {hasEnded && !isPlaying && currentTime >= duration - 0.25 && (
            <div className="absolute top-3 right-3 z-20 rounded-lg bg-[#0E3558]/88 border border-white/60 px-2.5 py-1 text-[10px] font-extrabold text-amber-300 pointer-events-none">
              EVIDENCE CLIP FINISHED
            </div>
          )}

          {/* Subtitles Scrim */}
          {subtitlesOn && (
            <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-4 pt-6 pb-2.5 text-center pointer-events-none">
              <p className="text-xs sm:text-sm font-bold text-white drop-shadow-sm">
                {currentShot.narration}
              </p>
            </div>
          )}
        </div>

        {/* Full Video Player Control Bar */}
        <div className="mt-2.5 rounded-2xl bg-white/95 border border-white px-3 py-2 space-y-2 shadow-sm">
          {/* Seekable Progress Bar */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold font-mono tabular-nums text-[#0369A1] w-9 text-right shrink-0">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || VIDEO_TOTAL_DURATION_SEC}
              step={0.1}
              value={currentTime}
              aria-label="Video timeline progress"
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="flex-1 accent-[#0284C7] cursor-pointer h-2"
            />
            <span className="text-[11px] font-bold font-mono tabular-nums text-[#475569] w-9 shrink-0">
              {formatTime(duration)}
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="min-h-[38px] rounded-full bg-[#0284C7] hover:bg-[#0369A1] px-3.5 py-1.5 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReplay}
                aria-label="Replay video"
                className="min-h-[38px] rounded-full bg-sky-100 hover:bg-sky-200 border border-sky-200 px-3 py-1.5 text-xs font-bold text-[#0369A1] inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Replay</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Volume Mute + Slider */}
              <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 rounded-full px-2.5 py-1">
                <button
                  type="button"
                  onClick={() => {
                    playSoftSelect();
                    setAutoplayMutedHint(false);
                    setVolume((v) => (v > 0 ? 0 : 85));
                  }}
                  aria-label={volume > 0 ? 'Mute video volume' : 'Unmute video volume'}
                  className="text-[#0369A1] cursor-pointer p-0.5"
                >
                  {volume > 0 ? (
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  aria-label="Video volume"
                  onChange={(e) => {
                    setAutoplayMutedHint(false);
                    setVolume(Number(e.target.value));
                  }}
                  className="w-14 sm:w-20 accent-[#0284C7] cursor-pointer h-1.5"
                />
              </div>

              {/* Subtitles Toggle */}
              <button
                type="button"
                onClick={() => {
                  playSoftSelect();
                  setSubtitlesOn((s) => !s);
                }}
                aria-pressed={subtitlesOn}
                aria-label="Toggle video subtitles"
                className={`min-h-[38px] rounded-full border px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${
                  subtitlesOn
                    ? 'bg-[#6D28D9] border-[#5B21B6] text-white'
                    : 'bg-white border-sky-200 text-[#475569]'
                }`}
              >
                <Captions className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Subtitles</span>
              </button>

              {/* Full-Screen Toggle */}
              <button
                type="button"
                onClick={handleToggleFullscreen}
                aria-label={isExpandedFs ? 'Exit full screen' : 'Full screen video'}
                className="min-h-[38px] rounded-full bg-white hover:bg-sky-50 border border-sky-200 px-3 py-1.5 text-xs font-bold text-[#0E3558] inline-flex items-center gap-1 cursor-pointer"
              >
                {isExpandedFs ? (
                  <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">{isExpandedFs ? 'Exit' : 'Full Screen'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (compact) {
    return monitorFrame;
  }

  return (
    <>
      <div className="relative z-20 w-full max-w-5xl mx-auto px-2 sm:px-4 pb-44 sm:pb-48 flex flex-col gap-3 pointer-events-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-9">{monitorFrame}</div>

          {/* Pusheen Watching Beside the Video Monitor */}
          <div className="lg:col-span-3 flex lg:flex-col items-center justify-center gap-3 rounded-[24px] bg-white/92 backdrop-blur-md border-2 border-white p-3.5 shadow-md">
            <div className="w-18 h-16 sm:w-26 sm:h-22 shrink-0">
              <PusheenIllustration
                expression={hasEnded ? 'curious' : 'thinking'}
                pose={hasEnded ? 'waving' : 'normal'}
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#0369A1]">
                Detective Pusheen
              </p>
              <p className="text-xs font-semibold text-[#0E3558]">
                {hasEnded
                  ? 'Did you spot what happened on the screen?'
                  : 'Watch carefully! Notice every clue on the screen.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-Pinned Post-Video Pusheen Dialogue */}
      {hasEnded && onContinueAfterVideo && (
        <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
          <div className="pointer-events-auto">
            <DialogueBox
              speaker="pusheen"
              expression="curious"
              text={
                postVideoLineIdx === 0
                  ? "Interesting, isn't it, Detective?"
                  : "Let's see if you can identify what happened!"
              }
              settings={settings}
              nextLabel={postVideoLineIdx === 0 ? 'NEXT' : 'REVIEW THE EVIDENCE'}
              onReplay={() => setPostVideoLineIdx(0)}
              onSkipAll={() => onContinueAfterVideo()}
              onNext={() => {
                if (postVideoLineIdx === 0) {
                  setPostVideoLineIdx(1);
                } else {
                  onContinueAfterVideo();
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
