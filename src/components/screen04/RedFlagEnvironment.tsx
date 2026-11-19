import React, { useState } from 'react';
import redFlagLabBg from '../../assets/images/red_flag_centre_lab_1795080504192.jpg';
import type { AvatarConfig, DialogueExpression } from '../../types/game.ts';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface RedFlagEnvironmentProps {
  avatarConfig: AvatarConfig;
  nickname: string;
  pusheenExpression?: DialogueExpression;
  showCharacters?: boolean;
  dimmed?: boolean;
}

export const RedFlagEnvironment: React.FC<RedFlagEnvironmentProps> = ({
  avatarConfig,
  nickname,
  pusheenExpression = 'happy',
  showCharacters = true,
  dimmed = false,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden select-none bg-[#BAE6FD]">
      {!imgFailed ? (
        <img
          src={redFlagLabBg}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover object-center scale-[1.01]"
        />
      ) : (
        <div
          className="w-full h-full"
          style={{
            background:
              'radial-gradient(circle at 22% 20%, #A5F3FC 0%, #67E8F9 32%, #E9D5FF 72%, #FBCFE8 100%)',
          }}
        />
      )}

      {/* Bright Frutiger Aero glass readability veil */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          dimmed ? 'bg-[#0B2945]/45 backdrop-blur-xs' : 'bg-gradient-to-b from-white/25 via-sky-100/15 to-[#0E3558]/25'
        }`}
      />

      {/* Ambient Characters Standing Inside Investigation Tower */}
      {showCharacters && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[155px] sm:bottom-[175px] flex items-end justify-between max-w-5xl mx-auto px-6 sm:px-14 opacity-95">
          <div className="flex flex-col items-center">
            <div className="w-24 h-32 sm:w-30 sm:h-40 drop-shadow-[0_12px_16px_rgba(16,55,92,0.3)]">
              <DetectiveAvatar config={avatarConfig} view="front" pose="idle" />
            </div>
            <span className="mt-1 rounded-full bg-white/85 border border-white px-3 py-0.5 text-[11px] font-extrabold text-[#6D28D9] shadow-sm">
              {nickname}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-22 sm:w-30 sm:h-26 drop-shadow-[0_12px_16px_rgba(16,55,92,0.3)]">
              <PusheenIllustration expression={pusheenExpression} pose="waving" />
            </div>
            <span className="mt-1 rounded-full bg-white/85 border border-white px-3 py-0.5 text-[11px] font-extrabold text-[#0369A1] shadow-sm">
              Detective Pusheen
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
