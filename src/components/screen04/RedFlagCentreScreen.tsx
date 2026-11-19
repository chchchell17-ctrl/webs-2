import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, MapPin, SkipForward } from 'lucide-react';
import {
  createDefaultScreen04Progress,
  SCREEN04_COMPUTER_INTRO_SCRIPT,
  SCREEN04_WELCOME_SCRIPT,
} from '../../data/screen04Data.ts';
import type {
  GameSettings,
  SaveSyncStatus,
  Screen04ClueId,
  Screen04KnowledgeAttempt,
  Screen04Progress,
  Screen04StageId,
  StudentGameState,
} from '../../types/game.ts';
import type { CustomMapMedia } from '../../utils/customMapStorage.ts';
import { playMascotChirp, playPortalOpen, playSoftSelect } from '../../utils/soundEffects.ts';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { GameHud, type HudModalType } from '../game/GameHud.tsx';
import { HudModals } from '../game/HudModals.tsx';
import { EmailInvestigationLab } from './EmailInvestigationLab.tsx';
import { RedFlagCompletionUnlock } from './RedFlagCompletionUnlock.tsx';
import { RedFlagEnvironment } from './RedFlagEnvironment.tsx';
import { RedFlagKnowledgeCheck } from './RedFlagKnowledgeCheck.tsx';
import { RedFlagLearningCorner } from './RedFlagLearningCorner.tsx';

interface RedFlagCentreScreenProps {
  gameState: StudentGameState;
  saveStatus: SaveSyncStatus;
  customMapMedia?: CustomMapMedia | null;
  onUploadCustomMap?: (file: File) => Promise<void>;
  onResetCustomMap?: () => Promise<void>;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
  onPersistState: (nextState: StudentGameState) => Promise<void>;
  onReturnToTown: () => void;
  onContinueToAinasHouse: (latestState: StudentGameState) => void;
  onEditCharacter: () => void;
  onReplayTutorial: () => void;
  onSignOut: () => void;
}

const STAGE_LABELS: Record<Screen04StageId, string> = {
  arrival: 'SCENE 01 · ARRIVING AT RED FLAG CENTRE',
  welcome: 'SCENE 02 · MEET DETECTIVE PUSHEEN',
  'learning-corner': 'SCENE 03 · RED FLAG LEARNING CORNER',
  'computer-intro': 'SCENE 04 · INVESTIGATION COMPUTER',
  'email-investigation': 'SCENE 05 · AEROMAIL CLUE LAB',
  'knowledge-check': 'SCENE 06 · KNOWLEDGE CHECK',
  completion: 'SCENE 07 · WARNING SIGNS REVIEW',
  'unlock-aina': "SCENE 08 · UNLOCK AINA'S HOUSE",
};

export const RedFlagCentreScreen: React.FC<RedFlagCentreScreenProps> = ({
  gameState,
  saveStatus,
  customMapMedia = null,
  onUploadCustomMap,
  onResetCustomMap,
  onUpdateSettings,
  onPersistState,
  onReturnToTown,
  onContinueToAinasHouse,
  onEditCharacter,
  onReplayTutorial,
  onSignOut,
}) => {
  const initialProgress = gameState.screen04Progress ?? createDefaultScreen04Progress();

  const [s4, setS4] = useState<Screen04Progress>(initialProgress);
  const s4Ref = useRef<Screen04Progress>(s4);
  s4Ref.current = s4;

  const gameStateRef = useRef<StudentGameState>(gameState);
  gameStateRef.current = gameState;

  const [stage, setStage] = useState<Screen04StageId>(() =>
    initialProgress.enteredCentre ? initialProgress.currentStage || 'welcome' : 'arrival'
  );
  const [welcomeIdx, setWelcomeIdx] = useState(0);
  const [computerIntroIdx, setComputerIntroIdx] = useState(0);
  const [activeModal, setActiveModal] = useState<HudModalType | null>(null);

  const persistProgress = useCallback(
    (
      patch: Partial<Screen04Progress>,
      extraState?: Partial<StudentGameState>
    ): StudentGameState => {
      const mergedExamples = patch.learningExamplesExplored
        ? { ...s4Ref.current.learningExamplesExplored, ...patch.learningExamplesExplored }
        : s4Ref.current.learningExamplesExplored;

      const nextS4: Screen04Progress = {
        ...s4Ref.current,
        ...patch,
        learningExamplesExplored: mergedExamples,
      };
      setS4(nextS4);
      s4Ref.current = nextS4;

      const nextGameState: StudentGameState = {
        ...gameStateRef.current,
        ...extraState,
        screen04Progress: nextS4,
      };
      gameStateRef.current = nextGameState;
      void onPersistState(nextGameState);
      return nextGameState;
    },
    [onPersistState]
  );

  // Brief glass tower arrival moment before Pusheen welcome
  useEffect(() => {
    if (stage !== 'arrival') return;
    const t = window.setTimeout(() => {
      playMascotChirp();
      persistProgress({ enteredCentre: true, currentStage: 'welcome' });
      setStage('welcome');
    }, gameState.settings.reducedMotion ? 350 : 1700);
    return () => window.clearTimeout(t);
  }, [stage, gameState.settings.reducedMotion, persistProgress]);

  const avatarConfig = gameState.avatarConfig;
  const nickname = gameState.detectiveNickname || 'Junior Detective';
  if (!avatarConfig) return null;

  const handleCompleteUnlockToAina = () => {
    const existingBuildings = gameStateRef.current.unlockedBuildings;
    const updatedBuildings = existingBuildings.includes('ainas-house')
      ? existingBuildings
      : ([...existingBuildings, 'ainas-house'] as StudentGameState['unlockedBuildings']);

    const nextCompleted = gameStateRef.current.completedMissions.includes(
      'MISSION 02 · RED FLAG CENTRE'
    )
      ? gameStateRef.current.completedMissions
      : [...gameStateRef.current.completedMissions, 'MISSION 02 · RED FLAG CENTRE'];

    const bonusXp = s4Ref.current.activityCompleted ? 0 : 60;
    const bonusStars = s4Ref.current.activityCompleted ? 0 : 2;
    const nextXp = gameStateRef.current.xp + bonusXp;

    const latest = persistProgress(
      {
        enteredCentre: true,
        activityCompleted: true,
        ainasHouseUnlocked: true,
        currentStage: 'unlock-aina',
      },
      {
        xp: nextXp,
        stars: gameStateRef.current.stars + bonusStars,
        level: Math.max(1, Math.floor(nextXp / 100) + 1),
        unlockedBuildings: updatedBuildings,
        completedMissions: nextCompleted,
        currentMission: "AINA'S HOUSE: HELP AINA READ & RESPOND TO THE LUCKY MESSAGE",
      }
    );
    onContinueToAinasHouse(latest);
  };

  const currentWelcomeStep = SCREEN04_WELCOME_SCRIPT[welcomeIdx];
  const currentComputerStep = SCREEN04_COMPUTER_INTRO_SCRIPT[computerIntroIdx];

  return (
    <div
      className={`relative h-dvh w-full flex flex-col overflow-hidden bg-[#BAE6FD] ${
        gameState.settings.reducedMotion ? 'reduced-motion' : ''
      }`}
    >
      <RedFlagEnvironment
        avatarConfig={avatarConfig}
        nickname={nickname}
        pusheenExpression={
          stage === 'welcome' && currentWelcomeStep
            ? currentWelcomeStep.expression
            : stage === 'completion' || stage === 'unlock-aina'
              ? 'celebrating'
              : 'happy'
        }
        showCharacters={stage === 'arrival' || stage === 'welcome' || stage === 'computer-intro'}
        dimmed={
          stage === 'learning-corner' ||
          stage === 'email-investigation' ||
          stage === 'knowledge-check' ||
          stage === 'completion' ||
          stage === 'unlock-aina'
        }
      />

      <GameHud
        gameState={gameState}
        saveStatus={saveStatus}
        spotlightTarget={null}
        onOpenModal={(modal) => setActiveModal(modal)}
        onSignOut={onSignOut}
      />

      {/* Sub-header Strip */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-3 sm:px-5 pt-1.5 pb-1 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={() => {
            playSoftSelect();
            onReturnToTown();
          }}
          className="min-h-[38px] rounded-full bg-white/92 hover:bg-white border border-white px-4 py-1 text-xs font-extrabold text-[#0369A1] shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Detective Town</span>
        </button>

        <div className="rounded-full bg-white/92 border border-white px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-[#BE123C] shadow-xs inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#E11D48]" aria-hidden="true" />
          <span>RED FLAG CENTRE · {STAGE_LABELS[stage]}</span>
        </div>
      </div>

      {/* Main Scrollable Workspace */}
      <main className="relative z-20 flex-1 min-h-0 w-full overflow-y-auto flex flex-col">
        {stage === 'arrival' && (
          <div className="fixed inset-x-0 bottom-5 z-40 px-4 flex flex-col items-center gap-3 pointer-events-none">
            <div className="rounded-2xl bg-white/95 border-2 border-rose-200 px-5 py-3 shadow-xl text-center pointer-events-auto">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#BE123C]">
                SEGMENT 2 · ACTIVITY 1
              </p>
              <p className="font-[var(--font-display)] text-base sm:text-lg font-bold text-[#0E3558]">
                ENTERING THE RED FLAG CENTRE LAB...
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                persistProgress({ enteredCentre: true, currentStage: 'welcome' });
                setStage('welcome');
              }}
              className="pointer-events-auto min-h-[40px] rounded-full bg-white/95 border border-sky-200 px-4 py-1.5 text-xs font-extrabold text-[#0369A1] shadow-md inline-flex items-center gap-1.5 cursor-pointer"
            >
              <SkipForward className="h-3.5 w-3.5" />
              <span>MEET PUSHEEN</span>
            </button>
          </div>
        )}

        {stage === 'welcome' && currentWelcomeStep && (
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
                  persistProgress({ enteredCentre: true, currentStage: 'learning-corner' });
                  setStage('learning-corner');
                }}
                onChoiceSelect={() => {
                  persistProgress({ enteredCentre: true, currentStage: 'learning-corner' });
                  setStage('learning-corner');
                }}
                onNext={() => {
                  if (welcomeIdx + 1 < SCREEN04_WELCOME_SCRIPT.length) {
                    setWelcomeIdx((prev) => prev + 1);
                  } else {
                    persistProgress({ enteredCentre: true, currentStage: 'learning-corner' });
                    setStage('learning-corner');
                  }
                }}
              />
            </div>
          </div>
        )}

        {stage === 'learning-corner' && (
          <div className="w-full my-auto pt-2">
            <RedFlagLearningCorner
              settings={gameState.settings}
              explored={s4.learningExamplesExplored}
              onExploreExample={(id) => {
                persistProgress({
                  learningExamplesExplored: {
                    ...s4Ref.current.learningExamplesExplored,
                    [id]: true,
                  },
                });
              }}
              onContinueToComputer={() => {
                setComputerIntroIdx(0);
                persistProgress({ currentStage: 'computer-intro' });
                setStage('computer-intro');
              }}
            />
          </div>
        )}

        {stage === 'computer-intro' && currentComputerStep && (
          <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
            <div className="pointer-events-auto">
              <DialogueBox
                speaker={currentComputerStep.speaker}
                speakerName={currentComputerStep.speakerName}
                playerNickname={nickname}
                playerAvatar={avatarConfig}
                expression={currentComputerStep.expression}
                text={currentComputerStep.text}
                settings={gameState.settings}
                nextLabel={
                  computerIntroIdx + 1 < SCREEN04_COMPUTER_INTRO_SCRIPT.length
                    ? 'NEXT'
                    : 'OPEN AEROMAIL'
                }
                onReplay={() => setComputerIntroIdx(0)}
                onSkipAll={() => {
                  persistProgress({ currentStage: 'email-investigation' });
                  setStage('email-investigation');
                }}
                onNext={() => {
                  if (computerIntroIdx + 1 < SCREEN04_COMPUTER_INTRO_SCRIPT.length) {
                    setComputerIntroIdx((prev) => prev + 1);
                  } else {
                    persistProgress({ currentStage: 'email-investigation' });
                    setStage('email-investigation');
                  }
                }}
              />
            </div>
          </div>
        )}

        {stage === 'email-investigation' && (
          <div className="w-full my-auto pt-2">
            <EmailInvestigationLab
              discoveredClues={s4.discoveredClues}
              missedClicks={s4.missedInspectionClicks}
              hintsUsed={s4.hintsUsed}
              onDiscoverClue={(clueId: Screen04ClueId) => {
                if (s4Ref.current.discoveredClues.includes(clueId)) return;
                persistProgress({
                  discoveredClues: [...s4Ref.current.discoveredClues, clueId],
                });
              }}
              onMissClick={() => {
                persistProgress({
                  missedInspectionClicks: s4Ref.current.missedInspectionClicks + 1,
                });
              }}
              onUseHint={() => {
                persistProgress({
                  hintsUsed: s4Ref.current.hintsUsed + 1,
                });
              }}
              onProceedToQuiz={() => {
                persistProgress({ currentStage: 'knowledge-check' });
                setStage('knowledge-check');
              }}
            />
          </div>
        )}

        {stage === 'knowledge-check' && (
          <div className="w-full my-auto pt-2">
            <RedFlagKnowledgeCheck
              initialAttempts={s4.knowledgeAttempts}
              onUpdateAttempts={(
                knowledgeAttempts: Record<string, Screen04KnowledgeAttempt>,
                firstAttemptScore: number,
                masteryAchieved: boolean
              ) => {
                persistProgress({
                  knowledgeAttempts,
                  firstAttemptScore,
                  masteryAchieved,
                });
              }}
              onCompleteQuiz={() => {
                persistProgress({ currentStage: 'completion' });
                setStage('completion');
              }}
            />
          </div>
        )}

        {(stage === 'completion' || stage === 'unlock-aina') && (
          <div className="w-full my-auto pt-2">
            <RedFlagCompletionUnlock
              phase={stage}
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              firstAttemptScore={s4.firstAttemptScore}
              onProceedToUnlock={() => {
                const existingBuildings = gameStateRef.current.unlockedBuildings;
                const updatedBuildings = existingBuildings.includes('ainas-house')
                  ? existingBuildings
                  : ([...existingBuildings, 'ainas-house'] as StudentGameState['unlockedBuildings']);

                persistProgress(
                  {
                    activityCompleted: true,
                    ainasHouseUnlocked: true,
                    currentStage: 'unlock-aina',
                  },
                  {
                    unlockedBuildings: updatedBuildings,
                  }
                );
                setStage('unlock-aina');
              }}
              onVisitAinasHouse={handleCompleteUnlockToAina}
            />
          </div>
        )}
      </main>

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
