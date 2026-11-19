import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { createDefaultScreen07Progress } from '../../data/screen07Data.ts';
import type {
  GameSettings,
  InventoryItem,
  SaveSyncStatus,
  Screen07Progress,
  Screen07StageId,
  StudentGameState,
} from '../../types/game.ts';
import type { CustomMapMedia } from '../../utils/customMapStorage.ts';
import { playSoftSelect, setMusicMood } from '../../utils/soundEffects.ts';
import { GameHud, type HudModalType } from '../game/GameHud.tsx';
import { HudModals } from '../game/HudModals.tsx';
import { AdviceCentreEnvironment } from './AdviceCentreEnvironment.tsx';
import { AdviceLearningCorner } from './AdviceLearningCorner.tsx';
import { AdviceSelfCheckAndComplete } from './AdviceSelfCheckAndComplete.tsx';
import { AdviceWritingMissions } from './AdviceWritingMissions.tsx';

interface AdviceCentreScreenProps {
  gameState: StudentGameState;
  saveStatus: SaveSyncStatus;
  customMapMedia?: CustomMapMedia | null;
  onUploadCustomMap?: (file: File) => Promise<void>;
  onResetCustomMap?: () => Promise<void>;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
  onPersistState: (nextState: StudentGameState) => Promise<void>;
  onReturnToTown: () => void;
  onContinueToGameArcade: (latestState: StudentGameState) => void;
  onEditCharacter: () => void;
  onReplayTutorial: () => void;
  onSignOut: () => void;
}

const WORDS_THAT_HELP_ITEM: InventoryItem = {
  id: 'advice-portfolio-scroll',
  name: 'Words That Help Portfolio',
  category: 'mission-items',
  description:
    'Your 3-part online safety advice conversation written at the Advice Centre!',
};

const STAGE_LABELS: Record<Screen07StageId, string> = {
  exterior: 'SCENE 01 · OUTSIDE ADVICE CENTRE',
  'interior-explore': 'SCENE 02 · EXPLORE ADVICE CENTRE',
  'pusheen-intro': 'SCENE 03 · MISSION 04 INTRO',
  'learning-corner': 'SCENE 04 · ADVICE LEARNING CORNER',
  'scenario-intro': 'SCENE 05 · FRIEND SCENARIO',
  'mission-1': 'SCENE 06 · WRITING MISSION 1',
  'mission-2': 'SCENE 07 · WRITING MISSION 2',
  'mission-3': 'SCENE 08 · WRITING MISSION 3',
  'complete-chat': 'SCENE 09 · COMPLETE 3-PART CHAT',
  'self-check': 'SCENE 10 · THREE THINGS I CAN DO!',
  completion: 'SCENE 11 · GAME ARCADE UNLOCKED',
};

export const AdviceCentreScreen: React.FC<AdviceCentreScreenProps> = ({
  gameState,
  saveStatus,
  customMapMedia = null,
  onUploadCustomMap,
  onResetCustomMap,
  onUpdateSettings,
  onPersistState,
  onReturnToTown,
  onContinueToGameArcade,
  onEditCharacter,
  onReplayTutorial,
  onSignOut,
}) => {
  const initialProgress = gameState.screen07Progress ?? createDefaultScreen07Progress();

  const [s7, setS7] = useState<Screen07Progress>(initialProgress);
  const s7Ref = useRef<Screen07Progress>(s7);
  s7Ref.current = s7;

  const gameStateRef = useRef<StudentGameState>(gameState);
  gameStateRef.current = gameState;

  const [stage, setStage] = useState<Screen07StageId>(() =>
    initialProgress.enteredAdviceCentre
      ? initialProgress.currentStage || 'exterior'
      : 'exterior'
  );
  const [activeModal, setActiveModal] = useState<HudModalType | null>(null);

  useEffect(() => {
    if (stage === 'completion') {
      setMusicMood('celebration');
    } else if (stage === 'scenario-intro' || stage === 'mission-2') {
      setMusicMood('tense');
    } else {
      setMusicMood('peaceful');
    }
  }, [stage]);

  useEffect(() => {
    return () => {
      setMusicMood('peaceful');
    };
  }, []);

  const persistProgress = useCallback(
    (
      patch: Partial<Screen07Progress>,
      extraState?: Partial<StudentGameState>
    ): StudentGameState => {
      const nextS7: Screen07Progress = {
        ...s7Ref.current,
        ...patch,
      };
      setS7(nextS7);
      s7Ref.current = nextS7;

      const nextGameState: StudentGameState = {
        ...gameStateRef.current,
        ...extraState,
        screen07Progress: nextS7,
      };
      gameStateRef.current = nextGameState;
      void onPersistState(nextGameState);
      return nextGameState;
    },
    [onPersistState]
  );

  const avatarConfig = gameState.avatarConfig;
  const nickname = gameState.detectiveNickname || 'Junior Detective';
  if (!avatarConfig) return null;

  const finalizeCompletionAndUnlockArcade = () => {
    const existingItems = gameStateRef.current.inventory.missionItems;
    const hasScroll = existingItems.some((i) => i.id === WORDS_THAT_HELP_ITEM.id);
    const updatedItems = hasScroll ? existingItems : [...existingItems, WORDS_THAT_HELP_ITEM];

    const existingBuildings = gameStateRef.current.unlockedBuildings;
    const updatedBuildings = existingBuildings.includes('game-arcade')
      ? existingBuildings
      : ([...existingBuildings, 'game-arcade'] as StudentGameState['unlockedBuildings']);

    const nextMissions = gameStateRef.current.completedMissions.includes(
      'MISSION 04 · ADVICE CENTRE'
    )
      ? gameStateRef.current.completedMissions
      : [...gameStateRef.current.completedMissions, 'MISSION 04 · ADVICE CENTRE'];

    const bonusXp = s7Ref.current.activityCompleted ? 0 : 90;
    const bonusStars = s7Ref.current.activityCompleted ? 0 : 2;
    const nextXp = gameStateRef.current.xp + bonusXp;

    return persistProgress(
      {
        activityCompleted: true,
        gameArcadeUnlocked: true,
        currentStage: 'completion',
      },
      {
        xp: nextXp,
        stars: gameStateRef.current.stars + bonusStars,
        level: Math.max(1, Math.floor(nextXp / 100) + 1),
        inventory: {
          ...gameStateRef.current.inventory,
          missionItems: updatedItems,
        },
        unlockedBuildings: updatedBuildings,
        completedMissions: nextMissions,
        currentMission: 'GAME ARCADE: READY FOR SCREEN 08',
      }
    );
  };

  return (
    <div
      className={`relative h-dvh w-full flex flex-col overflow-hidden bg-[#F5F3FF] ${
        gameState.settings.reducedMotion ? 'reduced-motion' : ''
      }`}
    >
      <GameHud
        gameState={gameState}
        saveStatus={saveStatus}
        spotlightTarget={null}
        onOpenModal={(modal) => setActiveModal(modal)}
        onSignOut={onSignOut}
      />

      {/* Sub-header */}
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

        <div className="rounded-full bg-white/92 border border-white px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-[#7C3AED] shadow-xs inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#0D9488]" aria-hidden="true" />
          <span>ADVICE CENTRE · {STAGE_LABELS[stage]}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-20 flex-1 min-h-0 w-full overflow-y-auto flex flex-col">
        {(stage === 'exterior' || stage === 'interior-explore' || stage === 'pusheen-intro') && (
          <AdviceCentreEnvironment
            mode={stage}
            avatarConfig={avatarConfig}
            nickname={nickname}
            settings={gameState.settings}
            onEnterInterior={() => {
              persistProgress({
                enteredAdviceCentre: true,
                currentStage: 'interior-explore',
              });
              setStage('interior-explore');
            }}
            onStartIntroDialogue={() => {
              persistProgress({
                enteredAdviceCentre: true,
                currentStage: 'pusheen-intro',
              });
              setStage('pusheen-intro');
            }}
            onFinishIntro={() => {
              persistProgress({ currentStage: 'learning-corner' });
              setStage('learning-corner');
            }}
          />
        )}

        {stage === 'learning-corner' && (
          <div className="w-full my-auto pt-2">
            <AdviceLearningCorner
              initialExplored={s7.learningCardsExplored}
              onUpdateExplored={(learningCardsExplored) => {
                persistProgress({ learningCardsExplored });
              }}
              onProceedToScenario={() => {
                persistProgress({ currentStage: 'scenario-intro' });
                setStage('scenario-intro');
              }}
            />
          </div>
        )}

        {(stage === 'scenario-intro' ||
          stage === 'mission-1' ||
          stage === 'mission-2' ||
          stage === 'mission-3' ||
          stage === 'complete-chat') && (
          <div className="w-full my-auto pt-2">
            <AdviceWritingMissions
              mode={stage}
              avatarConfig={avatarConfig}
              nickname={nickname}
              portfolio={s7.writingPortfolio}
              onStartMission1={() => {
                persistProgress({ currentStage: 'mission-1' });
                setStage('mission-1');
              }}
              onSaveMissionStep={(step, text, feedbackNote, evaluatedByAi) => {
                const prev = s7Ref.current.writingPortfolio;
                const filteredNotes = prev.feedbackNotes.filter(
                  (n) => !n.startsWith(`Mission ${step}:`)
                );
                const nextPortfolio = {
                  ...prev,
                  mission1Asking: step === 1 ? text : prev.mission1Asking,
                  mission2Giving: step === 2 ? text : prev.mission2Giving,
                  mission3Responding: step === 3 ? text : prev.mission3Responding,
                  feedbackNotes: [...filteredNotes, `Mission ${step}: ${feedbackNote}`],
                  evaluatedByAi: prev.evaluatedByAi || evaluatedByAi,
                  submittedAt: step === 3 ? Date.now() : prev.submittedAt,
                };

                const nextStage: Screen07StageId =
                  step === 1
                    ? 'mission-2'
                    : step === 2
                      ? 'mission-3'
                      : 'complete-chat';

                persistProgress({
                  writingPortfolio: nextPortfolio,
                  currentStage: nextStage,
                });
                setStage(nextStage);
              }}
              onJumpToEditStep={(step) => {
                const nextStage: Screen07StageId =
                  step === 1 ? 'mission-1' : step === 2 ? 'mission-2' : 'mission-3';
                persistProgress({ currentStage: nextStage });
                setStage(nextStage);
              }}
              onFinishChatReview={() => {
                persistProgress({
                  writingPortfolio: {
                    ...s7Ref.current.writingPortfolio,
                    submittedAt: s7Ref.current.writingPortfolio.submittedAt || Date.now(),
                  },
                  currentStage: 'self-check',
                });
                setStage('self-check');
              }}
            />
          </div>
        )}

        {(stage === 'self-check' || stage === 'completion') && (
          <div className="w-full my-auto pt-2">
            <AdviceSelfCheckAndComplete
              mode={stage}
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              selfCheck={s7.selfCheck}
              onToggleSelfCheck={(key) => {
                const nextCheck = {
                  ...s7Ref.current.selfCheck,
                  [key]: !s7Ref.current.selfCheck[key],
                };
                persistProgress({ selfCheck: nextCheck });
              }}
              onFinishSelfCheck={() => {
                finalizeCompletionAndUnlockArcade();
                setStage('completion');
              }}
              onContinueToGameArcade={() => {
                const latest = finalizeCompletionAndUnlockArcade();
                onContinueToGameArcade(latest);
              }}
              onReturnToTown={onReturnToTown}
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
