import React, { useState } from 'react';
import hqInteriorBg from '../../assets/images/detective_hq_interior_1795078104682.jpg';
import type {
  AvatarConfig,
  DialogueExpression,
} from '../../types/game.ts';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

export type HQCameraFocus = 'overview' | 'desk' | 'monitor' | 'town-map';

interface HQEnvironmentProps {
  avatarConfig: AvatarConfig;
  nickname: string;
  cameraFocus: HQCameraFocus;
  reducedMotion: boolean;
  doorOpen: boolean;
  playerEntered: boolean;
  playerPose?: 'idle' | 'walk' | 'wave';
  pusheenEntered: boolean;
  pusheenAtMonitor: boolean;
  pusheenExpression?: DialogueExpression;
  pusheenPose?: 'normal' | 'waving' | 'peeking' | 'celebrating';
  monitorOn: boolean;
  monitorMode?: 'standby' | 'mission-ready' | 'online-safety' | 'town-map';
  redFlagIlluminated?: boolean;
  dimmedBackdrop?: boolean;
}

const HQ_CAMERA_TRANSFORMS: Record<HQCameraFocus, string> = {
  overview: 'scale(1) translate3d(0%, 0%, 0)',
  desk: 'scale(1.03) translate3d(0%, -0.5%, 0)',
  monitor: 'scale(1.06) translate3d(1.5%, 1%, 0)',
  'town-map': 'scale(1.08) translate3d(-1.5%, 1%, 0)',
};

const MONITOR_STATUS_TEXT: Record<NonNullable<HQEnvironmentProps['monitorMode']>, string> = {
  standby: 'HQ COMMAND SCREENS · STANDBY',
  'mission-ready': 'MISSION 01 · CASE FILE ACTIVE',
  'online-safety': 'ONLINE SAFETY · 3 DETECTIVE RULES',
  'town-map': 'DETECTIVE TOWN · RED FLAG CENTRE UNLOCKED',
};

export const HQEnvironment: React.FC<HQEnvironmentProps> = ({
  avatarConfig,
  nickname,
  cameraFocus,
  reducedMotion,
  doorOpen,
  playerEntered,
  playerPose = 'idle',
  pusheenEntered,
  pusheenAtMonitor,
  pusheenExpression = 'happy',
  pusheenPose = 'normal',
  monitorOn,
  monitorMode = 'standby',
  redFlagIlluminated = false,
  dimmedBackdrop = false,
}) => {
  const [bgFailed, setBgFailed] = useState(false);

  const playerLeft = playerEntered ? '22%' : '8%';
  const playerTop = playerEntered ? '82%' : '76%';

  const pusheenLeft = !pusheenEntered ? '11%' : pusheenAtMonitor ? '74%' : '78%';
  const pusheenTop = !pusheenEntered ? '77%' : pusheenAtMonitor ? '76%' : '81%';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#6DD5FA] via-[#BAE6FD] to-[#E9D5FF] select-none pointer-events-none"
    >
      {/* Camera-animated Futuristic HQ Conference Room */}
      <div
        style={{
          transform: HQ_CAMERA_TRANSFORMS[cameraFocus],
          transition: reducedMotion
            ? 'none'
            : 'transform 950ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="relative w-full h-full"
      >
        {/* Generated Frutiger Aero Detective HQ Interior Artwork */}
        {!bgFailed && (
          <img
            src={hqInteriorBg}
            alt="Detective HQ bright futuristic briefing room with U-shaped table and panoramic screens"
            referrerPolicy="no-referrer"
            onError={() => setBgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}

        {/* Luminous Frutiger Aero atmospheric gloss & readability tint */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            dimmedBackdrop
              ? 'bg-gradient-to-b from-[#0E3558]/28 via-[#BAE6FD]/18 to-[#0E3558]/32'
              : 'bg-gradient-to-b from-sky-200/12 via-transparent to-sky-900/18'
          }`}
        />

        {/* Ambient Left/Right Command Screen Status Indicator */}
        {monitorOn && (
          <div className="hidden md:flex absolute top-[18%] left-[7%] items-center gap-2 rounded-full bg-white/85 backdrop-blur-md border border-sky-200 px-3.5 py-1 shadow-md">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                redFlagIlluminated
                  ? 'bg-rose-500'
                  : monitorMode === 'online-safety'
                    ? 'bg-emerald-500'
                    : 'bg-sky-500'
              } ${reducedMotion ? '' : 'animate-pulse'}`}
            />
            <span className="text-[10px] font-extrabold tracking-wider text-[#0E3558]">
              {MONITOR_STATUS_TEXT[monitorMode]}
            </span>
          </div>
        )}

        {/* Entrance Sliding Frosted Glass Double Doors Reveal (Scene 01) */}
        <div
          className={`absolute inset-0 flex transition-opacity duration-700 ${
            doorOpen ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            className={`w-1/2 h-full bg-gradient-to-r from-[#38BDF8]/88 via-[#BAE6FD]/85 to-white/90 border-r-2 border-white backdrop-blur-md flex items-center justify-end pr-6 transition-transform duration-700 ${
              doorOpen ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            <div className="rounded-2xl bg-white/90 border border-sky-200 px-4 py-2 text-right shadow-md">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#0284C7]">
                SJKC MING TAO
              </p>
              <p className="text-sm font-extrabold text-[#0E3558]">DETECTIVE</p>
            </div>
          </div>
          <div
            className={`w-1/2 h-full bg-gradient-to-l from-[#38BDF8]/88 via-[#BAE6FD]/85 to-white/90 border-l-2 border-white backdrop-blur-md flex items-center justify-start pl-6 transition-transform duration-700 ${
              doorOpen ? 'translate-x-full' : 'translate-x-0'
            }`}
          >
            <div className="rounded-2xl bg-white/90 border border-sky-200 px-4 py-2 text-left shadow-md">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#6D28D9]">
                HEADQUARTERS
              </p>
              <p className="text-sm font-extrabold text-[#0E3558]">HQ ACCESS</p>
            </div>
          </div>
        </div>

        {/* Animated Junior Detective & Pusheen Companion in the Briefing Room */}
        <div className="relative w-full h-full">
          {/* Player Customised Avatar */}
          <div
            style={{
              left: playerLeft,
              top: playerTop,
              transition: reducedMotion
                ? 'none'
                : 'left 1100ms cubic-bezier(0.22, 1, 0.36, 1), top 1100ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="absolute -translate-x-1/2 -translate-y-[85%] z-10 flex flex-col items-center"
          >
            <div className="mb-0.5 rounded-full bg-white/95 border border-purple-200 px-2.5 py-0.5 text-[10px] sm:text-xs font-extrabold text-[#6D28D9] shadow-sm whitespace-nowrap">
              {nickname}
            </div>
            <div className="w-14 h-20 sm:w-20 sm:h-28 drop-shadow-[0_8px_12px_rgba(14,53,88,0.28)]">
              <DetectiveAvatar
                config={avatarConfig}
                view={playerEntered ? 'front' : 'right'}
                pose={playerPose}
              />
            </div>
          </div>

          {/* Detective Pusheen Companion */}
          <div
            style={{
              left: pusheenLeft,
              top: pusheenTop,
              transition: reducedMotion
                ? 'none'
                : 'left 1000ms cubic-bezier(0.22, 1, 0.36, 1), top 1000ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="absolute -translate-x-1/2 -translate-y-[80%] z-10 flex flex-col items-center"
          >
            <div className="mb-0.5 rounded-full bg-sky-50/95 border border-sky-200 px-2.5 py-0.5 text-[10px] sm:text-xs font-extrabold text-[#0369A1] shadow-sm whitespace-nowrap">
              Detective Pusheen
            </div>
            <div className="w-16 h-14 sm:w-22 sm:h-20 drop-shadow-[0_8px_12px_rgba(14,53,88,0.25)]">
              <PusheenIllustration expression={pusheenExpression} pose={pusheenPose} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
