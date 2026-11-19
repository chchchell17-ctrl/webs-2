import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bell, MapPin, SkipForward } from 'lucide-react';
import {
  createDefaultScreen03Progress,
  HQ_WELCOME_SCRIPT,
} from '../../data/screen03Data.ts';
import type {
  DialogueChoice,
  GameSettings,
  SaveSyncStatus,
  Screen03Progress,
  Screen03StageId,
  StudentGameState,
} from '../../types/game.ts';
import type { CustomMapMedia } from '../../utils/customMapStorage.ts';
import {
  playMascotChirp,
  playPortalOpen,
  playSoftSelect,
} from '../../utils/soundEffects.ts';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { GameHud, type HudModalType } from '../game/GameHud.tsx';
import { HudModals } from '../game/HudModals.tsx';
import { type HQCameraFocus, HQEnvironment } from './HQEnvironment.tsx';
import { InvestigationVideoPlayer } from './InvestigationVideoPlayer.tsx';
import { KnowledgeCheck } from './KnowledgeCheck.tsx';
import { MissionBriefing } from './MissionBriefing.tsx';
import { MissionCompletionUnlock } from './MissionCompletionUnlock.tsx';
import { OnlineSafetyLesson } from './OnlineSafetyLesson.tsx';
import { ProblemIdentification } from './ProblemIdentification.tsx';
import { YesNoDecisionChallenge } from './YesNoDecisionChallenge.tsx';

interface DetectiveHQScreenProps {
  gameState: StudentGameState;
  saveStatus: SaveSyncStatus;
  customMapMedia?: CustomMapMedia | null;
  onUploadCustomMap?: (file: File) => Promise<void>;
  onResetCustomMap?: () => Promise<void>;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
  onPersistState: (nextState: StudentGameState) => Promise<void>;
  onReturnToTown: () => void;
  onContinueToRedFlagCentre: (latestState: StudentGameState) => void;
  onEditCharacter: () => void;
  onReplayTutorial: () => void;
  onSignOut: () => void;
}

const STAGE_LABELS: Record<Screen03StageId, string> = {
  entrance: 'SCENE 01 · ENTERING DETECTIVE HQ',
  welcome: 'SCENE 02 · PUSHEEN WELCOME',
  briefing: 'SCENE 03 · MISSION 01 BRIEFING',
  video: 'SCENE 04 · INVESTIGATION VIDEO',
  problem: 'SCENE 05 · IDENTIFY THE PROBLEM',
  decision: 'SCENE 06 · YES / NO CHALLENGE',
  'decision-feedback': 'SCENE 06 · DETECTIVE FEEDBACK',
  'safety-intro': 'SCENE 07 · WHAT IS ONLINE SAFETY?',
  'safety-rules': 'SCENE 08 · THREE DETECTIVE RULES',
  'knowledge-check': 'SCENE 09 · QUICK CHECK',
  completion: 'SCENE 10 · INDUCTION COMPLETED',
  'unlock-red-flag': 'SCENE 11 · RED FLAG CENTRE UNLOCK',
};

function resolveInitialStage(progress: Screen03Progress): Screen03StageId {
  if (!progress.hqEntered) return 'entrance';
  if (progress.currentStage === 'decision-feedback' && !progress.decisionChoice) {
    return 'decision';
  }
  return progress.currentStage || 'briefing';
}

export const DetectiveHQScreen: React.FC<DetectiveHQScreenProps> = ({
  gameState,
  saveStatus,
  customMapMedia = null,
  onUploadCustomMap,
  onResetCustomMap,
  onUpdateSettings,
  onPersistState,
  onReturnToTown,
  onContinueToRedFlagCentre,
  onEditCharacter,
  onReplayTutorial,
  onSignOut,
}) => {
  const initialProgress = gameState.screen03Progress ?? createDefaultScreen03Progress();

  const [s3, setS3] = useState<Screen03Progress>(initialProgress);
  const s3Ref = useRef<Screen03Progress>(s3);
  s3Ref.current = s3;

  const gameStateRef = useRef<StudentGameState>(gameState);
  gameStateRef.current = gameState;

  const [hqStage, setHqStage] = useState<Screen03StageId>(() =>
    resolveInitialStage(initialProgress)
  );
  const [activeModal, setActiveModal] = useState<HudModalType | null>(null);

  // Scene 01 Entrance animation state
  const [entranceStep, setEntranceStep] = useState<number>(
    initialProgress.hqEntered ? 5 : 0
  );
  const [welcomeIdx, setWelcomeIdx] = useState<number>(0);
  const [redFlagMonitorLit, setRedFlagMonitorLit] = useState<boolean>(
    Boolean(initialProgress.redFlagCentreUnlocked)
  );
  const unlockPersistedRef = useRef<boolean>(Boolean(initialProgress.redFlagCentreUnlocked));

  const persistProgress = useCallback(
    (
      progressPatch: Partial<Screen03Progress>,
      stateExtra?: Partial<StudentGameState>
    ): StudentGameState => {
      const mergedRules = progressPatch.rulesCompleted
        ? { ...s3Ref.current.rulesCompleted, ...progressPatch.rulesCompleted }
        : s3Ref.current.rulesCompleted;

      const nextS3: Screen03Progress = {
        ...s3Ref.current,
        ...progressPatch,
        rulesCompleted: mergedRules,
      };
      setS3(nextS3);
      s3Ref.current = nextS3;

      const nextGameState: StudentGameState = {
        ...gameStateRef.current,
        ...stateExtra,
        screen03Progress: nextS3,
      };
      gameStateRef.current = nextGameState;
      void onPersistState(nextGameState);
      return nextGameState;
    },
    [onPersistState]
  );

  // Scene 01 Timed Entrance Choreography
  useEffect(() => {
    if (hqStage !== 'entrance') return;

    setEntranceStep(0);
    const fast = gameState.settings.reducedMotion;
    const t1 = window.setTimeout(() => {
      playPortalOpen();
      setEntranceStep(1);
    }, fast ? 100 : 350);

    const t2 = window.setTimeout(() => {
      setEntranceStep(2);
    }, fast ? 220 : 900);

    const t3 = window.setTimeout(() => {
      setEntranceStep(3);
    }, fast ? 360 : 1650);

    const t4 = window.setTimeout(() => {
      playMascotChirp();
      setEntranceStep(4);
    }, fast ? 520 : 2500);

    const t5 = window.setTimeout(() => {
      setEntranceStep(5);
    }, fast ? 700 : 3400);

    const t6 = window.setTimeout(() => {
      setWelcomeIdx(0);
      setHqStage('welcome');
    }, fast ? 1150 : 4800);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.clearTimeout(t5);
      window.clearTimeout(t6);
    };
  }, [hqStage, gameState.settings.reducedMotion]);

  const handleVideoComplete = useCallback(() => {
    if (!s3Ref.current.videoCompleted) {
      persistProgress({ videoCompleted: true });
    }
  }, [persistProgress]);

  const handleUnlockVisualTriggered = useCallback(() => {
    setRedFlagMonitorLit(true);
    if (!unlockPersistedRef.current) {
      unlockPersistedRef.current = true;
      const existingBuildings = gameStateRef.current.unlockedBuildings;
      const updatedBuildings = existingBuildings.includes('red-flag-centre')
        ? existingBuildings
        : ([...existingBuildings, 'red-flag-centre'] as StudentGameState['unlockedBuildings']);

      persistProgress(
        {
          inductionCompleted: true,
          redFlagCentreUnlocked: true,
          currentStage: 'unlock-red-flag',
        },
        {
          unlockedBuildings: updatedBuildings,
          currentMission: 'RED FLAG CENTRE: SPOT THE WARNING SIGNS IN DIGITAL MESSAGES',
        }
      );
    }
  }, [persistProgress]);

  const avatarConfig = gameState.avatarConfig;
  const nickname = gameState.detectiveNickname || 'Junior Detective';

  if (!avatarConfig) return null;

  // Derived HQ Environment visual state
  const isEntrance = hqStage === 'entrance';
  const doorOpen = !isEntrance || entranceStep >= 1;
  const playerEntered = !isEntrance || entranceStep >= 2;
  const playerWalkingIn = isEntrance && entranceStep === 2;
  const pusheenEntered = !isEntrance || entranceStep >= 3;
  const monitorOn = !isEntrance || entranceStep >= 4;
  const pusheenAtMonitor =
    hqStage === 'welcome' ? welcomeIdx >= 4 : hqStage !== 'entrance';

  const cameraFocus: HQCameraFocus = isEntrance
    ? entranceStep >= 3
      ? 'desk'
      : 'overview'
    : hqStage === 'safety-intro' || hqStage === 'safety-rules' || hqStage === 'knowledge-check'
      ? 'monitor'
      : hqStage === 'unlock-red-flag'
        ? 'town-map'
        : 'desk';

  const monitorMode: 'standby' | 'mission-ready' | 'online-safety' | 'town-map' =
    hqStage === 'safety-intro' || hqStage === 'safety-rules' || hqStage === 'knowledge-check'
      ? 'online-safety'
      : hqStage === 'unlock-red-flag'
        ? 'town-map'
        : entranceStep >= 5 || !isEntrance
          ? 'mission-ready'
          : 'standby';

  const currentWelcomeStep = HQ_WELCOME_SCRIPT[welcomeIdx];

  const handleContinueToRedFlag = () => {
    const existingBuildings = gameStateRef.current.unlockedBuildings;
    const updatedBuildings = existingBuildings.includes('red-flag-centre')
      ? existingBuildings
      : ([...existingBuildings, 'red-flag-centre'] as StudentGameState['unlockedBuildings']);

    const finalState = persistProgress(
      {
        hqEntered: true,
        inductionCompleted: true,
        redFlagCentreUnlocked: true,
        currentStage: 'unlock-red-flag',
      },
      {
        unlockedBuildings: updatedBuildings,
        currentMission: 'RED FLAG CENTRE: SPOT THE WARNING SIGNS IN DIGITAL MESSAGES',
      }
    );
    onContinueToRedFlagCentre(finalState);
  };

  return (
    <div
      className={`relative h-dvh w-full flex flex-col overflow-hidden bg-gradient-to-b from-[#6DD5FA] via-[#BAE6FD] to-[#E9D5FF] ${
        gameState.settings.reducedMotion ? 'reduced-motion' : ''
      }`}
    >
      {/* Full-Bleed Animated HQ Interior Backdrop (isolated from mission UI transforms) */}
      <HQEnvironment
        avatarConfig={avatarConfig}
        nickname={nickname}
        cameraFocus={cameraFocus}
        reducedMotion={gameState.settings.reducedMotion}
        doorOpen={doorOpen}
        playerEntered={playerEntered}
        playerPose={playerWalkingIn ? 'walk' : hqStage === 'completion' ? 'wave' : 'idle'}
        pusheenEntered={pusheenEntered}
        pusheenAtMonitor={pusheenAtMonitor}
        pusheenExpression={
          hqStage === 'welcome' && currentWelcomeStep
            ? currentWelcomeStep.expression
            : hqStage === 'completion' || hqStage === 'unlock-red-flag'
              ? 'celebrating'
              : 'happy'
        }
        pusheenPose={
          hqStage === 'completion' || hqStage === 'unlock-red-flag' ? 'waving' : 'normal'
        }
        monitorOn={monitorOn}
        monitorMode={monitorMode}
        redFlagIlluminated={redFlagMonitorLit}
        dimmedBackdrop={hqStage === 'decision' || hqStage === 'decision-feedback'}
      />

      {/* Persistent Top Game HUD */}
      <GameHud
        gameState={gameState}
        saveStatus={saveStatus}
        spotlightTarget={null}
        onOpenModal={(modal) => setActiveModal(modal)}
        onSignOut={onSignOut}
      />

      {/* Secondary HQ Status & Town Return Strip */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-3 sm:px-5 pt-1.5 pb-1 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={() => {
            playSoftSelect();
            onReturnToTown();
          }}
          className="min-h-[38px] rounded-full bg-white/92 hover:bg-white border border-white px-4 py-1 text-xs font-extrabold text-[#0369A1] shadow-sm inline-flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Detective Town</span>
        </button>

        <div className="rounded-full bg-white/92 border border-white px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-[#6D28D9] shadow-xs inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#0284C7]" aria-hidden="true" />
          <span>DETECTIVE HQ · {STAGE_LABELS[hqStage]}</span>
        </div>
      </div>

      {/* Scrollable Mission Workspace Overlay (Never Transformed or Clipped) */}
      <main className="relative z-20 flex-1 min-h-0 w-full overflow-y-auto flex flex-col">
        {/* SCENE 01: Entrance Mission Notification Overlay & Skip */}
        {hqStage === 'entrance' && (
          <div className="fixed inset-x-0 bottom-4 z-40 px-4 flex flex-col items-center gap-3 pointer-events-none">
            {entranceStep >= 5 && (
              <div className="rounded-2xl bg-white/95 border-2 border-amber-300 px-5 py-3 shadow-xl flex items-center gap-3 animate-bounce pointer-events-auto">
                <Bell className="h-5 w-5 text-[#D97706] shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#6D28D9]">
                    NEW HQ NOTIFICATION
                  </p>
                  <p className="text-sm font-extrabold text-[#0E3558]">
                    MISSION 01: THE MYSTERY OF THE UNEXPECTED PRIZE
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                playSoftSelect();
                setEntranceStep(5);
                setWelcomeIdx(0);
                setHqStage('welcome');
              }}
              className="pointer-events-auto min-h-[40px] rounded-full bg-white/95 hover:bg-white border border-sky-200 px-4 py-1.5 text-xs font-extrabold text-[#0369A1] shadow-md inline-flex items-center gap-1.5 cursor-pointer"
            >
              <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{entranceStep >= 5 ? 'MEET PUSHEEN' : 'SKIP ENTRANCE'}</span>
            </button>
          </div>
        )}

        {/* SCENE 02: Pusheen Welcome Inside Detective HQ (Bottom-Pinned Dialogue) */}
        {hqStage === 'welcome' && currentWelcomeStep && (
          <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
            <div className="pointer-events-auto">
              <DialogueBox
                speaker={currentWelcomeStep.speaker}
                speakerName={currentWelcomeStep.speakerName}
                playerNickname={nickname}
                playerAvatar={avatarConfig}
                expression={currentWelcomeStep.expression}
                text={currentWelcomeStep.text}
                choices={currentWelcomeStep.choices}
                settings={gameState.settings}
                onReplay={() => setWelcomeIdx(0)}
                onSkipAll={() => {
                  persistProgress({
                    hqEntered: true,
                    currentStage: 'briefing',
                  });
                  setHqStage('briefing');
                }}
                onChoiceSelect={(_choice: DialogueChoice) => {
                  persistProgress({
                    hqEntered: true,
                    currentStage: 'briefing',
                  });
                  setHqStage('briefing');
                }}
                onNext={() => {
                  if (welcomeIdx + 1 < HQ_WELCOME_SCRIPT.length) {
                    setWelcomeIdx((prev) => prev + 1);
                  } else {
                    persistProgress({
                      hqEntered: true,
                      currentStage: 'briefing',
                    });
                    setHqStage('briefing');
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* SCENE 03: Mission 01 Digital Case File Briefing */}
        {hqStage === 'briefing' && (
          <div className="w-full my-auto pt-2">
            <MissionBriefing
              settings={gameState.settings}
              onStartVideo={() => {
                persistProgress({
                  hqEntered: true,
                  missionBriefingCompleted: true,
                  currentStage: 'video',
                });
                setHqStage('video');
              }}
            />
          </div>
        )}

        {/* SCENE 04: HQ Computer Monitor Investigation Video */}
        {hqStage === 'video' && (
          <div className="w-full my-auto pt-2">
            <InvestigationVideoPlayer
              settings={gameState.settings}
              alreadyWatched={s3.videoCompleted}
              onVideoComplete={handleVideoComplete}
              onContinueAfterVideo={() => {
                persistProgress({
                  videoCompleted: true,
                  currentStage: 'problem',
                });
                setHqStage('problem');
              }}
            />
          </div>
        )}

        {/* SCENE 05: Problem Identification */}
        {hqStage === 'problem' && (
          <div className="w-full my-auto pt-2 pb-6">
            <ProblemIdentification
              settings={gameState.settings}
              alreadyIdentified={s3.problemIdentified}
              onIdentified={() => {
                persistProgress({
                  problemIdentified: true,
                  currentStage: 'decision',
                });
                setHqStage('decision');
              }}
            />
          </div>
        )}

        {/* SCENE 06: Unexpected Pop-up YES / NO Decision Challenge */}
        {(hqStage === 'decision' || hqStage === 'decision-feedback') && (
          <div className="w-full my-auto pt-2">
            <YesNoDecisionChallenge
              settings={gameState.settings}
              initialChoice={s3.decisionChoice}
              phase={hqStage}
              onChooseDecision={(choice) => {
                persistProgress({
                  decisionChoice: choice,
                  decisionCompleted: true,
                  currentStage: 'decision-feedback',
                });
                setHqStage('decision-feedback');
              }}
              onConvergeToLesson={() => {
                persistProgress({
                  decisionCompleted: true,
                  currentStage: 'safety-intro',
                });
                setHqStage('safety-intro');
              }}
            />
          </div>
        )}

        {/* SCENES 07 & 08: Online Safety Mini-Lesson & 3 Rules */}
        {(hqStage === 'safety-intro' || hqStage === 'safety-rules') && (
          <div className="w-full my-auto pt-2">
            <OnlineSafetyLesson
              phase={hqStage}
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              rulesCompleted={s3.rulesCompleted}
              onCompleteSafetyIntro={() => {
                persistProgress({
                  safetyIntroDone: true,
                  currentStage: 'safety-rules',
                });
                setHqStage('safety-rules');
              }}
              onCompleteRule={(ruleId) => {
                persistProgress({
                  rulesCompleted: {
                    ...s3Ref.current.rulesCompleted,
                    [ruleId]: true,
                  },
                });
              }}
              onContinueToKnowledgeCheck={() => {
                persistProgress({
                  currentStage: 'knowledge-check',
                });
                setHqStage('knowledge-check');
              }}
            />
          </div>
        )}

        {/* SCENE 09: Quick Knowledge Check */}
        {hqStage === 'knowledge-check' && (
          <div className="w-full my-auto pt-2 pb-6">
            <KnowledgeCheck
              alreadyCompleted={s3.knowledgeCheckCompleted}
              onComplete={() => {
                persistProgress({
                  knowledgeCheckCompleted: true,
                  currentStage: 'completion',
                });
                setHqStage('completion');
              }}
            />
          </div>
        )}

        {/* SCENES 10 & 11: Induction Completion & Red Flag Centre Unlock */}
        {(hqStage === 'completion' || hqStage === 'unlock-red-flag') && (
          <div className="w-full my-auto pt-2">
            <MissionCompletionUnlock
              phase={hqStage}
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              onProceedToUnlock={() => {
                persistProgress({
                  inductionCompleted: true,
                  currentStage: 'unlock-red-flag',
                });
                setHqStage('unlock-red-flag');
              }}
              onUnlockVisualTriggered={handleUnlockVisualTriggered}
              onContinueToRedFlagCentre={handleContinueToRedFlag}
            />
          </div>
        )}
      </main>

      {/* Shared HUD Modals */}
      <HudModals
        activeModal={activeModal}
        gameState={gameState}
        canEditCharacter={true}
        customMapMedia={customMapMedia}
        onUploadCustomMap={onUploadCustomMap}
        onResetCustomMap={onResetCustomMap}
        onUpdateSettings={onUpdateSettings}
        onCloseModal={() => setActiveModal(null)}
        onEditCharacter={() => {
          setActiveModal(null);
          onEditCharacter();
        }}
        onReplayTutorial={() => {
          setActiveModal(null);
          onReplayTutorial();
        }}
      />
    </div>
  );
};
