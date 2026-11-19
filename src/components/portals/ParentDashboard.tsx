import React, { useCallback, useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  LogOut,
  MessageSquareText,
  RefreshCw,
  ShieldAlert,
  Star,
  Users,
} from 'lucide-react';
import { fetchParentOverview } from '../../services/authApi.ts';
import type { ParentSession, PortalStudentRecord } from '../../types/auth.ts';
import { playHoverTick } from '../../utils/soundEffects.ts';

interface ParentDashboardProps {
  session: ParentSession;
  onSignOut: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ session, onSignOut }) => {
  const [children, setChildren] = useState<PortalStudentRecord[]>([]);
  const [source, setSource] = useState<'preview' | 'cloud'>('preview');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadChildren = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    const res = await fetchParentOverview();
    setLoading(false);
    if (!res.ok) {
      setErrorMessage(res.message || 'Unable to load your child’s learning progress.');
      return;
    }
    setSource(res.source);
    setChildren(res.children);
  }, []);

  useEffect(() => {
    void loadChildren();
  }, [loadChildren]);

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-[#F5EEFF] via-[#E9F6FF] to-[#EEFDF4] text-[#10375C]">
      <header className="sticky top-0 z-20 border-b border-purple-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b from-[#8F6BD8] to-[#6B46B8] text-white shadow-sm">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#7E22CE]">
                Parent Progress Portal · SJKC Ming Tao
              </p>
              <h1 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#10375C]">
                {session.displayName} ({session.email})
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-semibold text-[#475569] mr-2">
              {source === 'cloud' ? 'Cloud Sync' : 'Classroom Preview'}
            </span>
            <button
              type="button"
              onClick={() => {
                playHoverTick();
                void loadChildren();
              }}
              className="min-h-[40px] rounded-full bg-white hover:bg-purple-50 border border-purple-200 px-3.5 py-2 text-xs font-bold text-[#6B46B8] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="min-h-[40px] rounded-full bg-white hover:bg-rose-50 border border-slate-200 px-3.5 py-2 text-xs font-bold text-[#10375C] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 space-y-5">
        {errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl bg-white/90 border border-white p-10 text-center text-sm font-semibold text-[#475569]">
            Loading your child&apos;s learning report...
          </div>
        ) : children.length === 0 ? (
          <div className="rounded-3xl bg-white/90 border border-white p-10 text-center text-sm font-medium text-[#64748B]">
            No linked child records found yet. Ask your child&apos;s teacher to link their account.
          </div>
        ) : (
          children.map((child) => {
            const s04 = child.screen04Progress;
            const s05 = child.screen05Progress;
            const s06 = child.screen06Progress;
            const s07 = child.screen07Progress;
            return (
              <section
                key={child.studentId}
                className="rounded-3xl bg-white/92 border border-white shadow-sm p-5 sm:p-6 space-y-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#7E22CE]">
                      {child.className} · {child.studentCode}
                    </p>
                    <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#10375C]">
                      {child.displayName}
                      {child.detectiveNickname ? ` (${child.detectiveNickname})` : ''}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-[#475569]">
                      Current Mission: <span className="font-bold">{child.currentMission}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm font-extrabold tabular-nums">
                    <div className="rounded-xl bg-sky-50 border border-sky-200 px-3.5 py-2 text-[#0369A1]">
                      Level {child.level} · {child.xp} XP
                    </div>
                    <div className="rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2 text-amber-700 inline-flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                      {child.stars} Stars
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#0369A1]">
                      Activity 0 · Detective HQ
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#10375C] inline-flex items-center gap-1.5">
                      {child.screen03Completed ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Induction Completed
                        </>
                      ) : (
                        'In Progress'
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#B45309] inline-flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      Activity 1 · Red Flag Centre
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#10375C] tabular-nums">
                      {s04?.discoveredClues?.length ?? 0}/5 Warning Signs Spotted
                    </p>
                    <p className="mt-0.5 text-xs text-[#475569] tabular-nums">
                      1st-Try Check: {s04?.firstAttemptScore ?? 0}/5
                      {s04?.masteryAchieved ? ' · Mastery Achieved' : ''}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#7E22CE] inline-flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      Activity 2 · Aina&apos;s House
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#10375C] tabular-nums">
                      Reading Accuracy: {s05?.firstAttemptScore ?? 0}/5 on 1st try
                    </p>
                    <p className="mt-0.5 text-xs text-[#475569]">
                      {s05?.activityCompleted
                        ? 'Reading & Advice Writing Complete'
                        : s05?.readingCompleted
                          ? 'Reading Complete · Advice Writing Pending'
                          : 'Not yet completed'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-4">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#0284C7]">
                      Activity 3 · Cyber Café
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#10375C] tabular-nums">
                      Message Files: {s06?.casesCompleted?.length ?? 0}/10 (1st try:{' '}
                      {s06?.firstAttemptCasesScore ?? 0}/10)
                    </p>
                    <p className="mt-0.5 text-xs text-[#475569]">
                      {s06?.badgeAwarded
                        ? "Badge Earned: Byte's Helper · Part C & D Done"
                        : 'In progress'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#0D9488]">
                      Activity 4 · Advice Centre
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#10375C] tabular-nums">
                      Self-Check:{' '}
                      {[
                        s07?.selfCheck?.askAdvice,
                        s07?.selfCheck?.giveAdvice,
                        s07?.selfCheck?.respondAdvice,
                      ].filter(Boolean).length}
                      /3 Skills Ticked
                    </p>
                    <p className="mt-0.5 text-xs text-[#475569]">
                      {s07?.activityCompleted
                        ? 'Words That Help Writing Portfolio Complete'
                        : 'Not yet completed'}
                    </p>
                  </div>
                </div>

                {s05?.readingResponses && s05.readingResponses.length > 0 && (
                  <div className="rounded-2xl border border-purple-100 bg-purple-50/30 p-4 space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#7E22CE]">
                      Reading Comprehension Summary (Q1–Q5)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
                      {s05.readingResponses.map((r) => (
                        <div
                          key={r.questionNumber}
                          className="rounded-xl bg-white border border-purple-100 p-2.5"
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span>Q{r.questionNumber}</span>
                            <span className={r.firstAttemptCorrect ? 'text-emerald-700' : 'text-amber-700'}>
                              {r.firstAttemptCorrect ? '1st Try' : `${r.attemptCount} Tries`}
                            </span>
                          </div>
                          <p className="mt-1 text-[#334155] truncate" title={r.finalCorrectAnswer}>
                            {r.finalCorrectAnswer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {s05?.writingResponses?.submitted && (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/35 p-4 space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#15803D] inline-flex items-center gap-1.5">
                      <MessageSquareText className="h-3.5 w-3.5" />
                      Your Child&apos;s Online Safety Advice to Aina
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                      <div className="rounded-xl bg-white border border-emerald-100 p-3">
                        <p className="font-bold text-[#0369A1]">Asking for Advice</p>
                        <p className="mt-1 text-[#10375C]">
                          &ldquo;{s05.writingResponses.adviceSeekingQuestion}&rdquo;
                        </p>
                      </div>
                      <div className="rounded-xl bg-white border border-emerald-100 p-3">
                        <p className="font-bold text-[#15803D]">Safety Advice Given</p>
                        <p className="mt-1 text-[#10375C]">
                          &ldquo;{s05.writingResponses.adviceGivingMessage}&rdquo;
                        </p>
                      </div>
                      <div className="rounded-xl bg-white border border-emerald-100 p-3">
                        <p className="font-bold text-[#7E22CE]">Polite Response</p>
                        <p className="mt-1 text-[#10375C]">
                          &ldquo;{s05.writingResponses.adviceResponseMessage}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {s07?.writingPortfolio?.mission1Asking && (
                  <div className="rounded-2xl border border-teal-100 bg-teal-50/35 p-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0D9488] inline-flex items-center gap-1.5">
                        <MessageSquareText className="h-3.5 w-3.5" />
                        Words That Help · Screen 07 Advice Portfolio
                      </h3>
                      {s07.writingPortfolio.submittedAt > 0 && (
                        <span className="text-[11px] font-semibold text-[#475569]">
                          Saved {new Date(s07.writingPortfolio.submittedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                      <div className="rounded-xl bg-white border border-teal-100 p-3">
                        <p className="font-bold text-[#0284C7]">1. Asking for Advice</p>
                        <p className="mt-1 text-[#10375C]">
                          &ldquo;{s07.writingPortfolio.mission1Asking}&rdquo;
                        </p>
                      </div>
                      <div className="rounded-xl bg-white border border-teal-100 p-3">
                        <p className="font-bold text-[#7C3AED]">2. Giving Safe Advice</p>
                        <p className="mt-1 text-[#10375C]">
                          &ldquo;{s07.writingPortfolio.mission2Giving}&rdquo;
                        </p>
                      </div>
                      <div className="rounded-xl bg-white border border-teal-100 p-3">
                        <p className="font-bold text-[#0D9488]">3. Responding Politely</p>
                        <p className="mt-1 text-[#10375C]">
                          &ldquo;{s07.writingPortfolio.mission3Responding}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            );
          })
        )}
      </main>
    </div>
  );
};
