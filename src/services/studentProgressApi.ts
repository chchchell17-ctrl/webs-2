import type { StudentSession } from '../types/auth.ts';
import type { StudentGameState } from '../types/game.ts';
import { createDefaultStudentGameState } from '../data/townData.ts';
import { createDefaultScreen03Progress } from '../data/screen03Data.ts';
import { createDefaultScreen04Progress } from '../data/screen04Data.ts';
import { createDefaultScreen05Progress } from '../data/screen05Data.ts';
import { createDefaultScreen06Progress } from '../data/screen06Data.ts';
import { createDefaultScreen07Progress } from '../data/screen07Data.ts';

function getLocalStorageKey(session: StudentSession): string {
  return `ddw_student_state_${session.classCode}_${session.studentCode}`;
}

export function loadLocalCachedState(session: StudentSession): StudentGameState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(getLocalStorageKey(session));
    if (!raw) return null;
    return JSON.parse(raw) as StudentGameState;
  } catch {
    return null;
  }
}

export function saveLocalCachedState(
  session: StudentSession,
  state: StudentGameState,
  pendingSync: boolean
): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      getLocalStorageKey(session),
      JSON.stringify({ ...state, _pendingSync: pendingSync })
    );
  } catch {
    // Ignore storage quota issues
  }
}

export function buildInitialStudentStateFromSession(session: StudentSession): StudentGameState {
  const defaults = createDefaultStudentGameState();
  const p = session.progress;

  const resolvedLastScene: StudentGameState['lastScene'] = !p.avatarConfig
    ? 'customisation'
    : p.lastPosition === 'screen-08-handoff'
      ? 'screen-08-handoff'
      : p.lastPosition === 'screen-07-handoff'
        ? 'screen-07-handoff'
        : p.lastPosition === 'screen-06-handoff'
          ? 'screen-06-handoff'
          : p.lastPosition === 'screen-05-handoff'
            ? 'screen-05-handoff'
            : p.lastPosition === 'screen-04-handoff'
              ? 'screen-04-handoff'
              : p.lastPosition === 'screen-03-handoff'
                ? 'screen-03-handoff'
                : 'town';

  const serverState: StudentGameState = {
    detectiveNickname: p.detectiveNickname || '',
    avatarConfig: p.avatarConfig ?? null,
    tutorialProgress: p.tutorialProgress ?? defaults.tutorialProgress,
    screen03Progress: p.screen03Progress ?? createDefaultScreen03Progress(),
    screen04Progress: p.screen04Progress ?? createDefaultScreen04Progress(),
    screen05Progress: p.screen05Progress ?? createDefaultScreen05Progress(),
    screen06Progress: p.screen06Progress ?? createDefaultScreen06Progress(),
    screen07Progress: p.screen07Progress ?? createDefaultScreen07Progress(),
    settings: p.settings ?? defaults.settings,
    inventory: p.inventory ?? defaults.inventory,
    xp: p.xp ?? 0,
    stars: p.stars ?? 0,
    level: Math.max(1, Math.floor((p.xp ?? 0) / 100) + 1),
    currentMission: p.currentMission || defaults.currentMission,
    completedMissions: p.completedMissions ?? [],
    unlockedBuildings: p.unlockedBuildings ?? ['detective-hq'],
    lastPosition: p.townPosition ?? defaults.lastPosition,
    lastScene: resolvedLastScene,
    updatedAt: p.updatedAt ?? 0,
  };

  // Merge newer offline-cached progress only if it is genuinely newer than server state
  const local = loadLocalCachedState(session);
  if (local && local.updatedAt > serverState.updatedAt && local.avatarConfig) {
    return local;
  }

  return serverState;
}

export async function fetchStudentStateFromServer(): Promise<{
  ok: boolean;
  state?: StudentGameState;
}> {
  try {
    const res = await fetch('/api/student/state', {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (!res.ok) return { ok: false };
    const data = (await res.json()) as { ok?: boolean; state?: StudentGameState };
    if (data.ok && data.state) {
      return { ok: true, state: data.state };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

export async function saveStudentStateToServer(
  session: StudentSession,
  state: StudentGameState
): Promise<{ ok: boolean; offline: boolean; state: StudentGameState }> {
  const stamped: StudentGameState = {
    ...state,
    updatedAt: Date.now(),
  };

  // Always cache locally immediately
  saveLocalCachedState(session, stamped, true);

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { ok: false, offline: true, state: stamped };
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId =
    controller !== null ? window.setTimeout(() => controller.abort(), 3500) : null;

  try {
    const res = await fetch('/api/student/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ state: stamped }),
      signal: controller?.signal,
    });

    if (!res.ok) {
      return { ok: false, offline: res.status >= 500 || res.status === 0, state: stamped };
    }

    const data = (await res.json()) as { ok?: boolean; state?: StudentGameState };
    const confirmed = data.state ?? stamped;
    saveLocalCachedState(session, confirmed, false);
    return { ok: true, offline: false, state: confirmed };
  } catch {
    return { ok: false, offline: true, state: stamped };
  } finally {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  }
}
