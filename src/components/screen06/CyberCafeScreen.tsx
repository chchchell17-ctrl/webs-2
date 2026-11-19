import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import {
  createDefaultScreen06Progress,
  SCREEN06_MEET_BYTE_SCRIPT,
} from '../../data/screen06Data.ts';
import type {
  GameSettings,
  InventoryItem,
  SaveSyncStatus,
  Screen06Progress,
  Screen06StageId,
  StudentGameState,
} from '../../types/game.ts';
import type { CustomMapMedia } from '../../utils/customMapStorage.ts';
import { playSoftSelect, setMusicMood } from '../../utils/soundEffects.ts';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { GameHud, type HudModalType } from '../game/GameHud.tsx';
import { HudModals } from '../game/HudModals.tsx';
import { CyberCafeInteriorScene } from './CyberCafeInteriorScene.tsx';
import { CyberChallenges } from './CyberChallenges.tsx';
import { CyberMessageInvestigation } from './CyberMessageInvestigation.tsx';

interface CyberCafeScreenProps {
  gameState: StudentGameState;
  saveStatus: SaveSyncStatus;
  customMapMedia?: CustomMapMedia | null;
  onUploadCustomMap?: (file: File) => Promise<void>;
  onResetCustomMap?: () => Promise<void>;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
  onPersistState: (nextState: StudentGameState) => Promise<void>;
  onReturnToTown: () => void;
  onContinueToAdviceCentre: (latestState: StudentGameState) => void;
  onEditCharacter: () => void;
  onReplayTutorial: () => void;
  onSignOut: () => void;
}

const BYTES_HELPER_BADGE: InventoryItem = {
  id: 'bytes-helper',
  name: "Byte's Helper",
  category: 'badges',
  description:
    'Awarded by Byte at the Cyber Café for classifying all 10 digital message files and solving the 3-message challenge!',
};

const STAGE_LABELS: Record<Screen06StageId, string> = {
  exterior: 'SCENE 01 · OUTSIDE CYBER CAFÉ',
  'interior-explore': 'SCENE 02 · EXPLORE CYBER CAFÉ',
  'meet-byte': 'SCENE 03 · MEET BYTE',
  'seat-select': 'SCENE 04 · CHOOSE A COMPUTER',
  'workstation-ready': 'SCENE 05 · WORKSTATION READY',
  investigation: 'SCENE 06 · 10 DIGITAL MESSAGE FILES',
  'part-c-action': 'SCENE 07 · PART C: WHAT SHOULD YOU DO?',
  'part-d-challenge': 'SCENE 08 · PART D: MINI CHALLENGE',
  completion: "SCENE 09 · BYTE'S HELPER BADGE",
  'unlock-advice': 'SCENE 10 · ADVICE CENTRE UNLOCKED',
};

export const CyberCafeScreen: React.FC<CyberCafeScreenProps> = ({
  gameState,
  saveStatus,
  customMapMedia = null,
  onUploadCustomMap,
  onResetCustomMap,
  onUpdateSettings,
  onPersistState,
  onReturnToTown,
  onContinueToAdviceCentre,
  onEditCharacter,
  onReplayTutorial,
  onSignOut,
}) => {
  const initialProgress = gameState.screen06Progress ?? createDefaultScreen06Progress();

  const [s6, setS6] = useState<Screen06Progress>(initialProgress);
  const s6Ref = useRef<Screen06Progress>(s6);
  s6Ref.current = s6;

  const gameStateRef = useRef<StudentGameState>(gameState);
  gameStateRef.current = gameState;

  const [stage, setStage] = useState<Screen06StageId>(() =>
    initialProgress.enteredCafe ? initialProgress.currentStage || 'exterior' : 'exterior'
  );
  const [meetByteIdx, setMeetByteIdx] = useState(0);
  const [tenseAlert, setTenseAlert] = useState(false);
  const [activeModal, setActiveModal] = useState<HudModalType | null>(null);

  useEffect(() => {
    if (stage === 'completion' || stage === 'unlock-advice') {
      setMusicMood('celebration');
    } else if (
      (stage === 'investigation' || stage === 'part-c-action' || stage === 'part-d-challenge') &&
      tenseAlert
    ) {
      setMusicMood('tense');
    } else {
      setMusicMood('peaceful');
    }
  }, [stage, tenseAlert]);

  useEffect(() => {
    return () => {
      setMusicMood('peaceful');
    };
  }, []);

  const persistProgress = useCallback(
    (
      patch: Partial<Screen06Progress>,
      extraState?: Partial<StudentGameState>
    ): StudentGameState => {
      const nextS6: Screen06Progress = {
        ...s6Ref.current,
        ...patch,
      };
      setS6(nextS6);
      s6Ref.current = nextS6;

      const nextGameState: StudentGameState = {
        ...gameStateRef.current,
        ...extraState,
        screen06Progress: nextS6,
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

  const awardCompletionAndUnlockAdvice = () => {
    const existingBadges = gameStateRef.current.inventory.badges;
    const hasBadge = existingBadges.some((b) => b.id === BYTES_HELPER_BADGE.id);
    const updatedBadges = hasBadge ? existingBadges : [...existingBadges, BYTES_HELPER_BADGE];

    const existingBuildings = gameStateRef.current.unlockedBuildings;
    const updatedBuildings = existingBuildings.includes('advice-centre')
      ? existingBuildings
      : ([...existingBuildings, 'advice-centre'] as StudentGameState['unlockedBuildings']);

    const nextMissions = gameStateRef.current.completedMissions.includes(
      'MISSION 03 · CYBER CAFÉ'
    )
      ? gameStateRef.current.completedMissions
      : [...gameStateRef.current.completedMissions, 'MISSION 03 · CYBER CAFÉ'];

    const bonusXp = s6Ref.current.activityCompleted ? 0 : 90;
    const bonusStars = s6Ref.current.activityCompleted ? 0 : 2;
    const nextXp = gameStateRef.current.xp + bonusXp;

    return persistProgress(
      {
        badgeAwarded: true,
        activityCompleted: true,
        adviceCentreUnlocked: true,
        currentStage: 'unlock-advice',
      },
      {
        xp: nextXp,
        stars: gameStateRef.current.stars + bonusStars,
        level: Math.max(1, Math.floor(nextXp / 100) + 1),
        inventory: {
          ...gameStateRef.current.inventory,
          badges: updatedBadges,
        },
        unlockedBuildings: updatedBuildings,
        completedMissions: nextMissions,
        currentMission: 'ADVICE CENTRE: WORDS THAT HELP',
      }
    );
  };

  const currentByteStep = SCREEN06_MEET_BYTE_SCRIPT[meetByteIdx];

  return (
    <div
      className={`relative h-dvh w-full flex flex-col overflow-hidden bg-[#E0F2FE] ${
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

        <div className="rounded-full bg-white/92 border border-white px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-[#0284C7] shadow-xs inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#0284C7]" aria-hidden="true" />
          <span>CYBER CAFÉ · {STAGE_LABELS[stage]}</span>
        </div>
      </div>

      {/* Main Scrollable Area */}
      <main className="relative z-20 flex-1 min-h-0 w-full overflow-y-auto flex flex-col">
        {(stage === 'exterior' ||
          stage === 'interior-explore' ||
          stage === 'seat-select' ||
          stage === 'workstation-ready') && (
          <div className="w-full my-auto pt-2">
            <CyberCafeInteriorScene
              mode={stage}
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              selectedSeatId={s6.selectedSeatId}
              onEnterCafe={() => {
                persistProgress({
                  enteredCafe: true,
                  currentStage: 'interior-explore',
                });
                setStage('interior-explore');
              }}
              onStartMeetByte={() => {
                setMeetByteIdx(0);
                persistProgress({
                  enteredCafe: true,
                  currentStage: 'meet-byte',
                });
                setStage('meet-byte');
              }}
              onSeatSelected={(seatId) => {
                persistProgress({
                  selectedSeatId: seatId,
                  currentStage: 'workstation-ready',
                });
                setStage('workstation-ready');
              }}
              onBeginMission03={() => {
                persistProgress({ currentStage: 'investigation' });
                setStage('investigation');
              }}
            />
          </div>
        )}

        {stage === 'meet-byte' && currentByteStep && (
          <>
            <CyberCafeInteriorScene
              mode="meet-byte"
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              selectedSeatId={s6.selectedSeatId}
            />

            <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
              <div className="pointer-events-auto">
                <DialogueBox
                  speaker={currentByteStep.speaker}
                  speakerName={currentByteStep.speakerName}
                  playerNickname={nickname}
                  playerAvatar={avatarConfig}
                  expression={currentByteStep.expression}
                  text={currentByteStep.text}
                  settings={gameState.settings}
                  nextLabel={
                    meetByteIdx + 1 < SCREEN06_MEET_BYTE_SCRIPT.length
                      ? 'NEXT'
                      : 'CHOOSE A COMPUTER SEAT'
                  }
                  onReplay={() => setMeetByteIdx(0)}
                  onSkipAll={() => {
                    persistProgress({ currentStage: 'seat-select' });
                    setStage('seat-select');
                  }}
                  onNext={() => {
                    if (meetByteIdx + 1 < SCREEN06_MEET_BYTE_SCRIPT.length) {
                      setMeetByteIdx((prev) => prev + 1);
                    } else {
                      persistProgress({ currentStage: 'seat-select' });
                      setStage('seat-select');
                    }
                  }}
                />
              </div>
            </div>
          </>
        )}

        {stage === 'investigation' && (
          <div className="w-full my-auto pt-2">
            <CyberMessageInvestigation
              avatarConfig={avatarConfig}
              nickname={nickname}
              initialCompletedCases={s6.casesCompleted}
              initialAttempts={s6.caseAttempts}
              onRecordCaseProgress={(caseAttempts, casesCompleted, firstAttemptCasesScore) => {
                persistProgress({
                  caseAttempts,
                  casesCompleted,
                  firstAttemptCasesScore,
                });
              }}
              onTenseAlertChange={setTenseAlert}
              onFinishAll10Cases={() => {
                setTenseAlert(false);
                persistProgress({ currentStage: 'part-c-action' });
                setStage('part-c-action');
              }}
            />
          </div>
        )}

        {(stage === 'part-c-action' ||
          stage === 'part-d-challenge' ||
          stage === 'completion' ||
          stage === 'unlock-advice') && (
          <div className="w-full my-auto pt-2">
            <CyberChallenges
              mode={stage}
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              firstAttemptCasesScore={s6.firstAttemptCasesScore}
              initialPartCChoice={s6.partCChoice}
              initialChallengeAttempts={s6.challengeAttempts}
              onRecordPartC={(partCChoice, partCCompleted) => {
                persistProgress({
                  partCChoice,
                  partCCompleted: s6Ref.current.partCCompleted || partCCompleted,
                });
              }}
              onProceedToPartD={() => {
                setTenseAlert(false);
                persistProgress({
                  partCCompleted: true,
                  currentStage: 'part-d-challenge',
                });
                setStage('part-d-challenge');
              }}
              onRecordChallengeProgress={(challengeAttempts, miniChallengeCompleted) => {
                persistProgress({
                  challengeAttempts,
                  miniChallengeCompleted,
                });
              }}
              onFinishPartD={() => {
                setTenseAlert(false);
                persistProgress({
                  miniChallengeCompleted: true,
                  currentStage: 'completion',
                });
                setStage('completion');
              }}
              onProceedToUnlockAdvice={() => {
                awardCompletionAndUnlockAdvice();
                setStage('unlock-advice');
              }}
              onVisitAdviceCentre={() => {
                const latest = awardCompletionAndUnlockAdvice();
                onContinueToAdviceCentre(latest);
              }}
              onReturnToTown={onReturnToTown}
              onTenseAlertChange={setTenseAlert}
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
