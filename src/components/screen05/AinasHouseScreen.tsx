import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import {
  buildBedroomEntryScript,
  createDefaultScreen05Progress,
  SCREEN05_ARRIVAL_SCRIPT,
  SCREEN05_TRANSITION_WRITING_SCRIPT,
} from '../../data/screen05Data.ts';
import type {
  GameSettings,
  SaveSyncStatus,
  Screen05Progress,
  Screen05ReadingResponse,
  Screen05StageId,
  Screen05WritingResponses,
  StudentGameState,
} from '../../types/game.ts';
import type { CustomMapMedia } from '../../utils/customMapStorage.ts';
import { playSoftSelect, setMusicMood } from '../../utils/soundEffects.ts';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { GameHud, type HudModalType } from '../game/GameHud.tsx';
import { HudModals } from '../game/HudModals.tsx';
import { AinaCompletionUnlock } from './AinaCompletionUnlock.tsx';
import { AinaReadingActivity } from './AinaReadingActivity.tsx';
import { AinasHouseCutaway } from './AinasHouseCutaway.tsx';
import { AinaWritingActivity } from './AinaWritingActivity.tsx';

interface AinasHouseScreenProps {
  gameState: StudentGameState;
  saveStatus: SaveSyncStatus;
  customMapMedia?: CustomMapMedia | null;
  onUploadCustomMap?: (file: File) => Promise<void>;
  onResetCustomMap?: () => Promise<void>;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
  onPersistState: (nextState: StudentGameState) => Promise<void>;
  onReturnToTown: () => void;
  onContinueToCyberCafe: (latestState: StudentGameState) => void;
  onEditCharacter: () => void;
  onReplayTutorial: () => void;
  onSignOut: () => void;
}

const STAGE_LABELS: Record<Screen05StageId, string> = {
  arrival: "SCENE 01 · OUTSIDE AINA'S HOUSE",
  'house-layout': 'SCENE 02 · FIND AINA’S BEDROOM',
  'bedroom-entry': 'SCENE 03 · MEET AINA',
  'meet-aina': 'SCENE 03 · MEET AINA',
  'reading-investigation': 'SCENE 04–06 · LUCKY MESSAGE READING',
  'transition-writing': 'SCENE 07 · ADVICE SKILLS INTRO',
  'writing-activity': 'SCENE 08 · ADVICE WRITING CHAT',
  'thank-you': 'SCENE 09 · THANK YOU FROM AINA',
  'case-closed': 'SCENE 10 · CASE CLOSED',
  'unlock-cafe': 'SCENE 10 · CYBER CAFÉ UNLOCKED',
};

export const AinasHouseScreen: React.FC<AinasHouseScreenProps> = ({
  gameState,
  saveStatus,
  customMapMedia = null,
  onUploadCustomMap,
  onResetCustomMap,
  onUpdateSettings,
  onPersistState,
  onReturnToTown,
  onContinueToCyberCafe,
  onEditCharacter,
  onReplayTutorial,
  onSignOut,
}) => {
  const initialProgress = gameState.screen05Progress ?? createDefaultScreen05Progress();

  const [s5, setS5] = useState<Screen05Progress>(initialProgress);
  const s5Ref = useRef<Screen05Progress>(s5);
  s5Ref.current = s5;

  const gameStateRef = useRef<StudentGameState>(gameState);
  gameStateRef.current = gameState;

  const [stage, setStage] = useState<Screen05StageId>(() =>
    initialProgress.enteredAinasHouse ? initialProgress.currentStage || 'arrival' : 'arrival'
  );
  const [arrivalIdx, setArrivalIdx] = useState(0);
  const [bedroomIdx, setBedroomIdx] = useState(0);
  const [transitionIdx, setTransitionIdx] = useState(0);
  const [activeModal, setActiveModal] = useState<HudModalType | null>(null);

  useEffect(() => {
    if (stage === 'reading-investigation') {
      setMusicMood('tense');
    } else if (stage === 'thank-you' || stage === 'case-closed' || stage === 'unlock-cafe') {
      setMusicMood('celebration');
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
      patch: Partial<Screen05Progress>,
      extraState?: Partial<StudentGameState>
    ): StudentGameState => {
      const nextS5: Screen05Progress = {
        ...s5Ref.current,
        ...patch,
      };
      setS5(nextS5);
      s5Ref.current = nextS5;

      const nextGameState: StudentGameState = {
        ...gameStateRef.current,
        ...extraState,
        screen05Progress: nextS5,
      };
      gameStateRef.current = nextGameState;
      void onPersistState(nextGameState);
      return nextGameState;
    },
    [onPersistState]
  );

  const avatarConfig = gameState.avatarConfig;
  const nickname = gameState.detectiveNickname || 'Junior Detective';
  const bedroomScript = useMemo(() => buildBedroomEntryScript(nickname), [nickname]);

  if (!avatarConfig) return null;

  const handleVisitCyberCafe = () => {
    const existingBuildings = gameStateRef.current.unlockedBuildings;
    const updatedBuildings = existingBuildings.includes('cyber-cafe')
      ? existingBuildings
      : ([...existingBuildings, 'cyber-cafe'] as StudentGameState['unlockedBuildings']);

    const nextCompleted = gameStateRef.current.completedMissions.includes(
      "MISSION 02 · AINA'S HOUSE"
    )
      ? gameStateRef.current.completedMissions
      : [...gameStateRef.current.completedMissions, "MISSION 02 · AINA'S HOUSE"];

    const bonusXp = s5Ref.current.activityCompleted ? 0 : 75;
    const bonusStars = s5Ref.current.activityCompleted ? 0 : 2;
    const nextXp = gameStateRef.current.xp + bonusXp;

    const latest = persistProgress(
      {
        activityCompleted: true,
        cyberCafeUnlocked: true,
        currentStage: 'unlock-cafe',
      },
      {
        xp: nextXp,
        stars: gameStateRef.current.stars + bonusStars,
        level: Math.max(1, Math.floor(nextXp / 100) + 1),
        unlockedBuildings: updatedBuildings,
        completedMissions: nextCompleted,
        currentMission: 'CYBER CAFÉ: READY FOR SCREEN 06 INVESTIGATION',
      }
    );
    onContinueToCyberCafe(latest);
  };

  const currentArrivalStep = SCREEN05_ARRIVAL_SCRIPT[arrivalIdx];
  const currentBedroomStep = bedroomScript[bedroomIdx];
  const currentTransitionStep = SCREEN05_TRANSITION_WRITING_SCRIPT[transitionIdx];

  return (
    <div
      className={`relative h-dvh w-full flex flex-col overflow-hidden bg-[#FCE7F3] ${
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

      {/* Sub-header strip */}
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

        <div className="rounded-full bg-white/92 border border-white px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-[#BE185D] shadow-xs inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#DB2777]" aria-hidden="true" />
          <span>AINA&apos;S HOUSE · {STAGE_LABELS[stage]}</span>
        </div>
      </div>

      {/* Scrollable Stage Content */}
      <main className="relative z-20 flex-1 min-h-0 w-full overflow-y-auto flex flex-col">
        {stage === 'arrival' && currentArrivalStep && (
          <>
            <AinasHouseCutaway
              mode="exterior"
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              onWrongRoomClick={() => {}}
              onFoundBedroom={() => {}}
              onEnterBedroom={() => {}}
            />

            <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
              <div className="pointer-events-auto">
                <DialogueBox
                  speaker={currentArrivalStep.speaker}
                  speakerName={currentArrivalStep.speakerName}
                  playerNickname={nickname}
                  playerAvatar={avatarConfig}
                  expression={currentArrivalStep.expression}
                  text={currentArrivalStep.text}
                  settings={gameState.settings}
                  nextLabel={
                    arrivalIdx + 1 < SCREEN05_ARRIVAL_SCRIPT.length
                      ? 'NEXT'
                      : 'LOOK INSIDE HOUSE'
                  }
                  onReplay={() => setArrivalIdx(0)}
                  onSkipAll={() => {
                    persistProgress({
                      enteredAinasHouse: true,
                      currentStage: 'house-layout',
                    });
                    setStage('house-layout');
                  }}
                  onNext={() => {
                    if (arrivalIdx + 1 < SCREEN05_ARRIVAL_SCRIPT.length) {
                      setArrivalIdx((prev) => prev + 1);
                    } else {
                      persistProgress({
                        enteredAinasHouse: true,
                        currentStage: 'house-layout',
                      });
                      setStage('house-layout');
                    }
                  }}
                />
              </div>
            </div>
          </>
        )}

        {stage === 'house-layout' && (
          <div className="w-full my-auto pt-2">
            <AinasHouseCutaway
              mode="cutaway"
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              foundRoomInitial={s5.foundAinasRoom}
              onWrongRoomClick={(roomId) => {
                persistProgress({
                  exploredHouseLayout: true,
                  wrongRoomAttempts: [...s5Ref.current.wrongRoomAttempts, roomId],
                });
              }}
              onFoundBedroom={() => {
                persistProgress({
                  exploredHouseLayout: true,
                  foundAinasRoom: true,
                });
              }}
              onEnterBedroom={() => {
                setBedroomIdx(0);
                persistProgress({
                  enteredAinasRoom: true,
                  currentStage: 'bedroom-entry',
                });
                setStage('bedroom-entry');
              }}
            />
          </div>
        )}

        {(stage === 'bedroom-entry' || stage === 'meet-aina') && currentBedroomStep && (
          <>
            <AinasHouseCutaway
              mode="bedroom-entry"
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              onWrongRoomClick={() => {}}
              onFoundBedroom={() => {}}
              onEnterBedroom={() => {}}
            />

            <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
              <div className="pointer-events-auto">
                <DialogueBox
                  speaker={currentBedroomStep.speaker}
                  speakerName={currentBedroomStep.speakerName}
                  playerNickname={nickname}
                  playerAvatar={avatarConfig}
                  expression={currentBedroomStep.expression}
                  text={currentBedroomStep.text}
                  settings={gameState.settings}
                  nextLabel={
                    bedroomIdx + 1 < bedroomScript.length
                      ? 'NEXT'
                      : 'OPEN PHONE & CASE STORY'
                  }
                  onReplay={() => setBedroomIdx(0)}
                  onSkipAll={() => {
                    persistProgress({
                      enteredAinasRoom: true,
                      currentStage: 'reading-investigation',
                    });
                    setStage('reading-investigation');
                  }}
                  onNext={() => {
                    if (bedroomIdx + 1 < bedroomScript.length) {
                      setBedroomIdx((prev) => prev + 1);
                    } else {
                      persistProgress({
                        enteredAinasRoom: true,
                        currentStage: 'reading-investigation',
                      });
                      setStage('reading-investigation');
                    }
                  }}
                />
              </div>
            </div>
          </>
        )}

        {stage === 'reading-investigation' && (
          <div className="w-full my-auto pt-2">
            <AinaReadingActivity
              avatarConfig={avatarConfig}
              nickname={nickname}
              initialResponses={s5.readingResponses}
              onRecordProgress={(
                readingResponses: Screen05ReadingResponse[],
                firstAttemptScore: number,
                readCaseFile: boolean
              ) => {
                persistProgress({
                  readCaseFile,
                  readingResponses,
                  firstAttemptScore,
                });
              }}
              onCompleteReading={(
                readingResponses: Screen05ReadingResponse[],
                firstAttemptScore: number
              ) => {
                setTransitionIdx(0);
                persistProgress({
                  readCaseFile: true,
                  readingResponses,
                  firstAttemptScore,
                  readingCompleted: true,
                  currentStage: 'transition-writing',
                });
                setStage('transition-writing');
              }}
            />
          </div>
        )}

        {stage === 'transition-writing' && currentTransitionStep && (
          <>
            <AinasHouseCutaway
              mode="bedroom-entry"
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              onWrongRoomClick={() => {}}
              onFoundBedroom={() => {}}
              onEnterBedroom={() => {}}
            />

            <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
              <div className="pointer-events-auto">
                <DialogueBox
                  speaker={currentTransitionStep.speaker}
                  speakerName={currentTransitionStep.speakerName}
                  playerNickname={nickname}
                  playerAvatar={avatarConfig}
                  expression={currentTransitionStep.expression}
                  text={currentTransitionStep.text}
                  settings={gameState.settings}
                  nextLabel={
                    transitionIdx + 1 < SCREEN05_TRANSITION_WRITING_SCRIPT.length
                      ? 'NEXT'
                      : 'OPEN ADVICE CHAT'
                  }
                  onReplay={() => setTransitionIdx(0)}
                  onSkipAll={() => {
                    persistProgress({ currentStage: 'writing-activity' });
                    setStage('writing-activity');
                  }}
                  onNext={() => {
                    if (transitionIdx + 1 < SCREEN05_TRANSITION_WRITING_SCRIPT.length) {
                      setTransitionIdx((prev) => prev + 1);
                    } else {
                      persistProgress({ currentStage: 'writing-activity' });
                      setStage('writing-activity');
                    }
                  }}
                />
              </div>
            </div>
          </>
        )}

        {stage === 'writing-activity' && (
          <div className="w-full my-auto pt-2">
            <AinaWritingActivity
              avatarConfig={avatarConfig}
              nickname={nickname}
              initialResponses={s5.writingResponses}
              onSaveWriting={(writingResponses: Screen05WritingResponses) => {
                persistProgress({
                  writingResponses,
                  writingCompleted: writingResponses.submitted,
                });
              }}
              onContinueAfterTranscript={(writingResponses: Screen05WritingResponses) => {
                persistProgress({
                  writingResponses,
                  writingCompleted: true,
                  currentStage: 'thank-you',
                });
                setStage('thank-you');
              }}
            />
          </div>
        )}

        {(stage === 'thank-you' || stage === 'case-closed' || stage === 'unlock-cafe') && (
          <div className="w-full my-auto pt-2">
            <AinaCompletionUnlock
              phase={stage}
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              firstAttemptScore={s5.firstAttemptScore}
              onProceedToCaseClosed={() => {
                persistProgress({
                  activityCompleted: true,
                  currentStage: 'case-closed',
                });
                setStage('case-closed');
              }}
              onProceedToUnlockCafe={() => {
                const existingBuildings = gameStateRef.current.unlockedBuildings;
                const updatedBuildings = existingBuildings.includes('cyber-cafe')
                  ? existingBuildings
                  : ([...existingBuildings, 'cyber-cafe'] as StudentGameState['unlockedBuildings']);

                persistProgress(
                  {
                    activityCompleted: true,
                    cyberCafeUnlocked: true,
                    currentStage: 'unlock-cafe',
                  },
                  {
                    unlockedBuildings: updatedBuildings,
                  }
                );
                setStage('unlock-cafe');
              }}
              onVisitCyberCafe={handleVisitCyberCafe}
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
