import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  LogOut,
  MessageSquareText,
  RefreshCw,
  School,
  Search,
  ShieldAlert,
  Star,
} from 'lucide-react';
import { fetchTeacherOverview } from '../../services/authApi.ts';
import type { PortalStudentRecord, TeacherSession } from '../../types/auth.ts';
import { playHoverTick } from '../../utils/soundEffects.ts';

interface TeacherDashboardProps {
  session: TeacherSession;
  onSignOut: () => void;
}

const formatRelativeTime = (ts: number): string => {
  if (!ts) return 'Not started yet';
  const diffMin = Math.max(0, Math.floor((Date.now() - ts) / 60000));
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return new Date(ts).toLocaleDateString();
};

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ session, onSignOut }) => {
  const [students, setStudents] = useState<PortalStudentRecord[]>([]);
  const [source, setSource] = useState<'preview' | 'cloud'>('preview');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('ALL');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    const res = await fetchTeacherOverview();
    setLoading(false);
    if (!res.ok) {
      setErrorMessage(res.message || 'Could not load student records.');
      return;
    }
    setSource(res.source);
    setStudents(res.students);
    setSelectedStudentId((prev) =>
      prev && res.students.some((s) => s.studentId === prev)
        ? prev
        : res.students[0]?.studentId ?? null
    );
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const classOptions = useMemo(() => {
    const set = new Set<string>(session.assignedClasses);
    students.forEach((s) => {
      if (s.classCode) set.add(s.classCode);
    });
    return ['ALL', ...Array.from(set)];
  }, [session.assignedClasses, students]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return students.filter((s) => {
      const matchesClass = classFilter === 'ALL' || s.classCode === classFilter;
      const matchesSearch =
        !q ||
        s.displayName.toLowerCase().includes(q) ||
        s.studentCode.toLowerCase().includes(q) ||
        (s.detectiveNickname || '').toLowerCase().includes(q);
      return matchesClass && matchesSearch;
    });
  }, [students, classFilter, searchQuery]);

  const selectedStudent = useMemo(
    () =>
      filteredStudents.find((s) => s.studentId === selectedStudentId) ??
      filteredStudents[0] ??
      null,
    [filteredStudents, selectedStudentId]
  );

  const classMetrics = useMemo(() => {
    const total = students.length;
    const screen03Done = students.filter((s) => s.screen03Completed).length;
    const screen04Done = students.filter((s) => s.screen04Progress?.activityCompleted).length;
    const screen05Done = students.filter((s) => s.screen05Progress?.activityCompleted).length;
    return { total, screen03Done, screen04Done, screen05Done };
  }, [students]);

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-[#E6F9FF] via-[#DDF3FF] to-[#E8FAEE] text-[#10375C]">
      <header className="sticky top-0 z-20 border-b border-emerald-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b from-[#3BB96E] to-[#1F8A4D] text-white shadow-sm">
              <School className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#15803D]">
                Teacher Control Centre · {session.schoolName}
              </p>
              <h1 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#10375C]">
                {session.displayName} · Classes {session.assignedClasses.join(', ')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-semibold text-[#475569] mr-2">
              {source === 'cloud' ? 'School Cloud Sync' : 'Classroom Preview Storage'}
            </span>
            <button
              type="button"
              onClick={() => {
                playHoverTick();
                void loadOverview();
              }}
              className="min-h-[40px] rounded-full bg-white hover:bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-bold text-[#15803D] inline-flex items-center gap-1.5 cursor-pointer"
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

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-5 space-y-5">
        {/* Top KPI Strip */}
        <section aria-label="Classroom summary" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-white/90 border border-white shadow-sm p-4">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#475569]">
              Active Pupils
            </p>
            <p className="mt-1 font-[var(--font-display)] text-2xl font-bold text-[#10375C] tabular-nums">
              {classMetrics.total}
            </p>
          </div>
          <div className="rounded-2xl bg-white/90 border border-white shadow-sm p-4">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0369A1]">
              Screen 03 · Detective HQ
            </p>
            <p className="mt-1 font-[var(--font-display)] text-2xl font-bold text-[#0369A1] tabular-nums">
              {classMetrics.screen03Done} / {classMetrics.total}
            </p>
          </div>
          <div className="rounded-2xl bg-white/90 border border-white shadow-sm p-4">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#B45309]">
              Screen 04 · Red Flag Centre
            </p>
            <p className="mt-1 font-[var(--font-display)] text-2xl font-bold text-[#B45309] tabular-nums">
              {classMetrics.screen04Done} / {classMetrics.total}
            </p>
          </div>
          <div className="rounded-2xl bg-white/90 border border-white shadow-sm p-4">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#7E22CE]">
              Screen 05 · Aina&apos;s House
            </p>
            <p className="mt-1 font-[var(--font-display)] text-2xl font-bold text-[#7E22CE] tabular-nums">
              {classMetrics.screen05Done} / {classMetrics.total}
            </p>
          </div>
        </section>

        {errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
            {errorMessage}
          </div>
        )}

        {/* Roster + Student Detail Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Student List */}
          <section className="lg:col-span-5 rounded-3xl bg-white/92 border border-white shadow-sm p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-[var(--font-display)] text-base font-bold text-[#10375C]">
                Pupil Progress Roster
              </h2>
              <span className="text-xs font-semibold text-[#475569] tabular-nums">
                {filteredStudents.length} shown
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <label className="relative flex-1">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, ID, or nickname..."
                  className="w-full min-h-[40px] rounded-xl border border-sky-200 bg-sky-50/50 pl-9 pr-3 text-sm text-[#10375C] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                />
              </label>

              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                aria-label="Filter by class"
                className="min-h-[40px] rounded-xl border border-sky-200 bg-white px-3 text-sm font-semibold text-[#10375C] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {classOptions.map((code) => (
                  <option key={code} value={code}>
                    {code === 'ALL' ? 'All Classes' : `Class ${code}`}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="py-10 text-center text-sm font-semibold text-[#475569]">
                Loading classroom records...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-10 text-center text-sm font-medium text-[#64748B]">
                No pupil records match your filter.
              </div>
            ) : (
              <ul className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudent?.studentId === student.studentId;
                  const s04 = student.screen04Progress;
                  const s05 = student.screen05Progress;
                  return (
                    <li key={student.studentId}>
                      <button
                        type="button"
                        onClick={() => {
                          playHoverTick();
                          setSelectedStudentId(student.studentId);
                        }}
                        className={`w-full text-left rounded-2xl border p-3.5 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/90 border-emerald-400 shadow-xs'
                            : 'bg-white hover:bg-sky-50/70 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-extrabold text-[#10375C]">
                              {student.displayName}
                              {student.detectiveNickname
                                ? ` · ${student.detectiveNickname}`
                                : ''}
                            </p>
                            <p className="text-xs font-medium text-[#475569] mt-0.5">
                              {student.studentCode} · Class {student.classCode}
                            </p>
                          </div>
                          <div className="text-right text-xs font-bold text-[#0369A1] tabular-nums">
                            <div>Lv {student.level} · {student.xp} XP</div>
                            <div className="text-amber-600 inline-flex items-center gap-0.5 justify-end">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                              {student.stars}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-[#334155] tabular-nums">
                          <span>HQ: {student.screen03Completed ? 'Done' : 'Pending'}</span>
                          <span>·</span>
                          <span>
                            Red Flag: {s04?.discoveredClues?.length ?? 0}/5 clues
                            {s04?.activityCompleted ? ' (Done)' : ''}
                          </span>
                          <span>·</span>
                          <span>
                            Aina: {s05?.readingCompleted ? `${s05.firstAttemptScore}/5 Q` : 'Not yet'}
                          </span>
                          <span>·</span>
                          <span>
                            Café: {student.screen06Progress?.casesCompleted?.length ?? 0}/10
                          </span>
                          <span>·</span>
                          <span>
                            Advice: {student.screen07Progress?.activityCompleted ? 'Done' : 'Pending'}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Selected Student Detail View */}
          <section className="lg:col-span-7 rounded-3xl bg-white/92 border border-white shadow-sm p-5 sm:p-6 space-y-5">
            {!selectedStudent ? (
              <div className="py-12 text-center text-sm font-semibold text-[#64748B]">
                Select a pupil on the left to inspect detailed reading comprehension and writing evidence.
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
                      {selectedStudent.className} ({selectedStudent.studentCode})
                    </p>
                    <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#10375C]">
                      {selectedStudent.displayName}
                      {selectedStudent.detectiveNickname
                        ? ` · ${selectedStudent.detectiveNickname}`
                        : ''}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-[#475569] inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Last saved: {formatRelativeTime(selectedStudent.updatedAt)} · Mission:{' '}
                      {selectedStudent.currentMission}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm font-extrabold tabular-nums">
                    <div className="rounded-xl bg-sky-50 border border-sky-200 px-3 py-2 text-[#0369A1]">
                      Lv {selectedStudent.level} · {selectedStudent.xp} XP
                    </div>
                    <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-amber-700 inline-flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                      {selectedStudent.stars}
                    </div>
                  </div>
                </div>

                {/* Screen 03 & Screen 04 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-sky-200/80 bg-sky-50/45 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0369A1]">
                        Screen 03 · Detective HQ
                      </h3>
                      {selectedStudent.screen03Completed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">In Progress</span>
                      )}
                    </div>
                    <p className="text-xs text-[#334155]">
                      Unlocked locations: {selectedStudent.unlockedBuildings.join(', ')}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200/80 bg-amber-50/45 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#B45309] inline-flex items-center gap-1.5">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Screen 04 · Red Flag Centre
                      </h3>
                      <span className="text-xs font-bold text-[#10375C]">
                        {selectedStudent.screen04Progress?.activityCompleted ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#334155] tabular-nums">
                      <div>
                        Clues Spotted: {selectedStudent.screen04Progress?.discoveredClues?.length ?? 0} / 5
                      </div>
                      <div>
                        1st-Try Quiz: {selectedStudent.screen04Progress?.firstAttemptScore ?? 0} / 5
                      </div>
                      <div>
                        Mastery (&ge;4/5):{' '}
                        {selectedStudent.screen04Progress?.masteryAchieved ? 'Achieved' : 'Not yet'}
                      </div>
                      <div>
                        Hints Used: {selectedStudent.screen04Progress?.hintsUsed ?? 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screen 05 Reading Comprehension Evidence */}
                <div className="rounded-2xl border border-purple-200/80 bg-purple-50/35 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#7E22CE] inline-flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      Screen 05 · Aina&apos;s House Reading Check (Target: &ge;4/5)
                    </h3>
                    <span className="text-xs font-bold text-[#10375C] tabular-nums">
                      First-attempt accuracy: {selectedStudent.screen05Progress?.firstAttemptScore ?? 0} / 5
                      {selectedStudent.screen05Progress?.wrongRoomAttempts?.length
                        ? ` · Wrong room clicks: ${selectedStudent.screen05Progress.wrongRoomAttempts.length}`
                        : ''}
                    </span>
                  </div>

                  {selectedStudent.screen05Progress?.readingResponses &&
                  selectedStudent.screen05Progress.readingResponses.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-purple-200 text-[#475569]">
                            <th className="py-1.5 pr-3 font-bold">Q#</th>
                            <th className="py-1.5 pr-3 font-bold">First Answer</th>
                            <th className="py-1.5 pr-3 font-bold">Final Correct Answer</th>
                            <th className="py-1.5 pr-3 font-bold">Attempts</th>
                            <th className="py-1.5 font-bold">1st Try</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-purple-100">
                          {selectedStudent.screen05Progress.readingResponses.map((r) => (
                            <tr key={r.questionNumber}>
                              <td className="py-2 pr-3 font-bold tabular-nums">Q{r.questionNumber}</td>
                              <td className="py-2 pr-3 text-[#334155]">{r.firstAnswer || '—'}</td>
                              <td className="py-2 pr-3 font-semibold text-[#10375C]">
                                {r.finalCorrectAnswer || '—'}
                              </td>
                              <td className="py-2 pr-3 tabular-nums">{r.attemptCount}</td>
                              <td className="py-2 font-bold">
                                {r.firstAttemptCorrect ? (
                                  <span className="text-emerald-700">Yes</span>
                                ) : (
                                  <span className="text-amber-700">Retried</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-[#64748B]">
                      Pupil has not completed Screen 05 reading questions yet.
                    </p>
                  )}
                </div>

                {/* Screen 05 Writing Transcript */}
                <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-4 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#15803D] inline-flex items-center gap-1.5">
                    <MessageSquareText className="h-4 w-4" />
                    Screen 05 · Pupil Written Advice Transcript
                  </h3>

                  {selectedStudent.screen05Progress?.writingResponses?.submitted ? (
                    <div className="space-y-2.5 text-xs">
                      <div className="rounded-xl bg-white border border-emerald-100 p-3">
                        <p className="font-bold text-[#0369A1]">1. Asking for Advice</p>
                        <p className="mt-1 text-[#10375C]">
                          &ldquo;{selectedStudent.screen05Progress.writingResponses.adviceSeekingQuestion}&rdquo;
                        </p>
                      </div>
                      <div className="rounded-xl bg-white border border-emerald-100 p-3">
                        <p className="font-bold text-[#15803D]">2. Giving Safety Advice</p>
                        <p className="mt-1 text-[#10375C]">
                          &ldquo;{selectedStudent.screen05Progress.writingResponses.adviceGivingMessage}&rdquo;
                        </p>
                      </div>
                      <div className="rounded-xl bg-white border border-emerald-100 p-3">
                        <p className="font-bold text-[#7E22CE]">3. Responding Politely</p>
                        <p className="mt-1 text-[#10375C]">
                          &ldquo;{selectedStudent.screen05Progress.writingResponses.adviceResponseMessage}&rdquo;
                        </p>
                      </div>
                      {selectedStudent.screen05Progress.writingResponses.writingFeedback.length > 0 && (
                        <ul className="list-disc pl-5 text-[#334155] space-y-0.5 pt-1">
                          {selectedStudent.screen05Progress.writingResponses.writingFeedback.map(
                            (fb, idx) => (
                              <li key={idx}>{fb}</li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-[#64748B]">
                      Pupil has not submitted the Screen 05 advice-writing chat yet.
                    </p>
                  )}
                </div>

                {/* Screen 06 Cyber Café & Screen 07 Advice Centre Evidence */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-cyan-200/80 bg-cyan-50/45 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0284C7]">
                        Screen 06 · Cyber Café
                      </h3>
                      <span className="text-xs font-bold text-[#10375C]">
                        {selectedStudent.screen06Progress?.activityCompleted ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#334155] tabular-nums">
                      <div>
                        Cases Solved: {selectedStudent.screen06Progress?.casesCompleted?.length ?? 0} / 10
                      </div>
                      <div>
                        1st-Try Cases: {selectedStudent.screen06Progress?.firstAttemptCasesScore ?? 0} / 10
                      </div>
                      <div>
                        Part C Action:{' '}
                        {selectedStudent.screen06Progress?.partCCompleted ? 'Done' : 'Pending'}
                      </div>
                      <div>
                        Part D Mini:{' '}
                        {selectedStudent.screen06Progress?.miniChallengeCompleted ? '3/3 Done' : 'Pending'}
                      </div>
                      <div className="col-span-2">
                        Badge: {selectedStudent.screen06Progress?.badgeAwarded ? "Byte's Helper Earned" : 'Not yet'}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-teal-200/80 bg-teal-50/45 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0D9488]">
                        Screen 07 · Advice Centre
                      </h3>
                      <span className="text-xs font-bold text-[#10375C]">
                        {selectedStudent.screen07Progress?.activityCompleted ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#334155] space-y-1 tabular-nums">
                      <div>
                        Self-Check:{' '}
                        {[
                          selectedStudent.screen07Progress?.selfCheck?.askAdvice,
                          selectedStudent.screen07Progress?.selfCheck?.giveAdvice,
                          selectedStudent.screen07Progress?.selfCheck?.respondAdvice,
                        ].filter(Boolean).length}{' '}
                        / 3 skills ticked
                      </div>
                      <div>
                        Submitted:{' '}
                        {selectedStudent.screen07Progress?.writingPortfolio?.submittedAt
                          ? new Date(selectedStudent.screen07Progress.writingPortfolio.submittedAt).toLocaleString()
                          : 'Not submitted yet'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screen 07 Writing Portfolio Transcript */}
                <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/35 p-4 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#4F46E5] inline-flex items-center gap-1.5">
                    <MessageSquareText className="h-4 w-4" />
                    Screen 07 · Words That Help Writing Portfolio
                  </h3>

                  {selectedStudent.screen07Progress?.writingPortfolio?.mission1Asking ? (
                    <div className="space-y-2.5 text-xs">
                      <div className="rounded-xl bg-white border border-indigo-100 p-3">
                        <p className="font-bold text-[#0284C7]">Mission 1 · Asking for Advice</p>
                        <p className="mt-1 text-[#10375C]">
                          &ldquo;{selectedStudent.screen07Progress.writingPortfolio.mission1Asking}&rdquo;
                        </p>
                      </div>
                      <div className="rounded-xl bg-white border border-indigo-100 p-3">
                        <p className="font-bold text-[#7C3AED]">Mission 2 · Giving Safe Advice</p>
                        <p className="mt-1 text-[#10375C]">
                          &ldquo;{selectedStudent.screen07Progress.writingPortfolio.mission2Giving}&rdquo;
                        </p>
                      </div>
                      <div className="rounded-xl bg-white border border-indigo-100 p-3">
                        <p className="font-bold text-[#0D9488]">Mission 3 · Responding Politely</p>
                        <p className="mt-1 text-[#10375C]">
                          &ldquo;{selectedStudent.screen07Progress.writingPortfolio.mission3Responding}&rdquo;
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-[#64748B]">
                      Pupil has not completed Screen 07 Words That Help writing tasks yet.
                    </p>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};
