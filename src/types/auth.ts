import type {
  AvatarConfig,
  AvatarPosition,
  BuildingId,
  GameSettings,
  InventoryState,
  Screen03Progress,
  Screen04Progress,
  Screen05Progress,
  Screen06Progress,
  Screen07Progress,
  TutorialProgress,
} from './game.ts';

export type PortalType = 'student' | 'teacher' | 'parent';

export type AuthErrorCode =
  | 'EMPTY_FIELDS'
  | 'INVALID_CREDENTIALS'
  | 'RATE_LIMITED'
  | 'ACCOUNT_NOT_LINKED'
  | 'UNAUTHORIZED_ROLE'
  | 'BACKEND_NOT_CONFIGURED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface BackendStatus {
  configured: boolean;
  missingEnv: string[];
}

export interface StudentProgressSummary {
  hasAvatar: boolean;
  detectiveNickname: string;
  avatarConfig: AvatarConfig | null;
  xp: number;
  stars: number;
  badges: string[];
  completedMissions: string[];
  currentMission?: string;
  lastPosition: string;
  tutorialProgress?: TutorialProgress;
  screen03Progress?: Screen03Progress;
  screen04Progress?: Screen04Progress;
  screen05Progress?: Screen05Progress;
  screen06Progress?: Screen06Progress;
  screen07Progress?: Screen07Progress;
  settings?: GameSettings;
  inventory?: InventoryState;
  unlockedBuildings?: BuildingId[];
  townPosition?: AvatarPosition;
  updatedAt?: number;
}

export interface StudentSession {
  role: 'student';
  id: string;
  studentCode: string;
  displayName: string;
  classCode: string;
  className: string;
  isFirstTime: boolean;
  progress: StudentProgressSummary;
}

export interface TeacherSession {
  role: 'teacher';
  id: string;
  displayName: string;
  email: string;
  schoolName: string;
  assignedClasses: string[];
}

export interface LinkedChildSummary {
  studentId: string;
  displayName: string;
  classCode: string;
  className: string;
}

export interface ParentSession {
  role: 'parent';
  id: string;
  displayName: string;
  email: string;
  linkedChildren: LinkedChildSummary[];
}

export type AuthenticatedSession = StudentSession | TeacherSession | ParentSession;

export interface PortalStudentRecord {
  studentId: string;
  studentCode: string;
  displayName: string;
  detectiveNickname: string;
  classCode: string;
  className: string;
  xp: number;
  stars: number;
  level: number;
  currentMission: string;
  completedMissions: string[];
  unlockedBuildings: BuildingId[];
  lastScene: string;
  screen03Completed: boolean;
  screen04Progress?: Screen04Progress;
  screen05Progress?: Screen05Progress;
  screen06Progress?: Screen06Progress;
  screen07Progress?: Screen07Progress;
  updatedAt: number;
}

export interface TeacherOverviewResponse {
  ok: boolean;
  source: 'preview' | 'cloud';
  students: PortalStudentRecord[];
  message?: string;
}

export interface ParentOverviewResponse {
  ok: boolean;
  source: 'preview' | 'cloud';
  children: PortalStudentRecord[];
  message?: string;
}

export interface AuthApiError {
  ok: false;
  code: AuthErrorCode;
  message: string;
  missingEnv?: string[];
  retryAfterSeconds?: number;
}

export interface AuthApiSuccess<T> {
  ok: true;
  message: string;
  session: T;
}

export type AuthApiResponse<T> = AuthApiSuccess<T> | AuthApiError;

export interface PasswordResetResponse {
  ok: boolean;
  code?: AuthErrorCode;
  message: string;
  missingEnv?: string[];
}
