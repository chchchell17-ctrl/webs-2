import React from 'react';
import { GraduationCap, School, Sparkles, Users } from 'lucide-react';
import type { PortalType } from '../../types/auth.ts';
import { PortalCard } from './PortalCard.tsx';

interface PortalSelectionProps {
  onSelectPortal: (portal: PortalType) => void;
  onQuickStart?: () => void;
  quickStartBusy?: boolean;
}

export const PortalSelection: React.FC<PortalSelectionProps> = ({
  onSelectPortal,
  onQuickStart,
  quickStartBusy = false,
}) => {
  return (
    <section
      aria-labelledby="portal-heading"
      className="w-full max-w-5xl mx-auto px-4 sm:px-6"
    >
      <div className="text-center mb-5 sm:mb-7">
        <h2
          id="portal-heading"
          className="font-[var(--font-display)] text-xl sm:text-2xl font-bold tracking-wide uppercase casper-sub-halo"
        >
          <span className="text-[#0369A1]">WHO&apos;S </span>
          <span className="text-[#7E22CE]">ENTERING </span>
          <span className="text-[#15803D]">TODAY?</span>
        </h2>
        <p className="mt-1.5 inline-block rounded-full bg-white/80 backdrop-blur-sm border border-white/95 px-4 py-1 text-xs sm:text-sm font-semibold text-[#0E4A73] shadow-xs">
          Select any portal below — anything you type works right away!
        </p>
      </div>

      {/* Side-by-side equal cards on desktop/tablet, stacked vertically on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <PortalCard
          portal="student"
          kicker="STUDENT PORTAL"
          title="STUDENT LOGIN"
          description="Enter any Class Code, Student ID, or PIN to start playing."
          icon={GraduationCap}
          onSelect={onSelectPortal}
        />

        <PortalCard
          portal="teacher"
          kicker="TEACHER PORTAL"
          title="TEACHER LOGIN"
          description="Access your Teacher Control Centre."
          icon={School}
          onSelect={onSelectPortal}
        />

        <PortalCard
          portal="parent"
          kicker="PARENT PORTAL"
          title="PARENT LOGIN"
          description="See your child's learning progress."
          icon={Users}
          onSelect={onSelectPortal}
        />
      </div>

      {onQuickStart && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onQuickStart}
            disabled={quickStartBusy}
            className="aero-glossy-btn min-h-[46px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-7 py-2.5 text-sm font-bold tracking-wide text-white inline-flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-70"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>{quickStartBusy ? 'ENTERING...' : 'QUICK START AS DETECTIVE'}</span>
          </button>
        </div>
      )}
    </section>
  );
};
