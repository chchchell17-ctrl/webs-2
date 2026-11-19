import React, { useEffect, useState } from 'react';
import {
  Award,
  Backpack,
  BookOpen,
  Compass,
  Edit3,
  FileSearch,
  Film,
  Gem,
  HelpCircle,
  MapPin,
  RotateCcw,
  Settings,
  Sparkles,
  Star,
  Upload,
  X,
} from 'lucide-react';
import type { GameSettings, InventoryItem, StudentGameState } from '../../types/game.ts';
import { playBackClick, playErrorTone, playSoftSelect } from '../../utils/soundEffects.ts';
import type { CustomMapMedia } from '../../utils/customMapStorage.ts';
import { DetectiveAvatar } from './DetectiveAvatar.tsx';
import type { HudModalType } from './GameHud.tsx';
import { PusheenIllustration } from './PusheenIllustration.tsx';

interface HudModalsProps {
  activeModal: HudModalType | null;
  gameState: StudentGameState;
  canEditCharacter: boolean;
  requireSettingChangeBeforeClose?: boolean;
  customMapMedia?: CustomMapMedia | null;
  onUploadCustomMap?: (file: File) => Promise<void>;
  onResetCustomMap?: () => Promise<void>;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
  onCloseModal: (modal: HudModalType) => void;
  onEditCharacter?: () => void;
  onReplayTutorial?: () => void;
}

type BagTab = 'badges' | 'collectibles' | 'missionItems' | 'specialRewards';

export const HudModals: React.FC<HudModalsProps> = ({
  activeModal,
  gameState,
  canEditCharacter,
  requireSettingChangeBeforeClose = false,
  customMapMedia = null,
  onUploadCustomMap,
  onResetCustomMap,
  onUpdateSettings,
  onCloseModal,
  onEditCharacter,
  onReplayTutorial,
}) => {
  const [bagTab, setBagTab] = useState<BagTab>('badges');
  const [selectedBagSlotIdx, setSelectedBagSlotIdx] = useState<number>(0);
  const [settingTouchedInTutorial, setSettingTouchedInTutorial] = useState(false);
  const [settingReminder, setSettingReminder] = useState(false);
  const [mapUploadBusy, setMapUploadBusy] = useState(false);
  const [mapUploadError, setMapUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (activeModal === 'settings' || activeModal === 'help') {
      setSettingTouchedInTutorial(false);
      setSettingReminder(false);
      setMapUploadError(null);
    }
    if (activeModal === 'bag') {
      setSelectedBagSlotIdx(0);
    }
  }, [activeModal]);

  useEffect(() => {
    if (!activeModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleRequestClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  if (!activeModal) return null;

  const handleRequestClose = () => {
    if (
      activeModal === 'settings' &&
      requireSettingChangeBeforeClose &&
      !settingTouchedInTutorial
    ) {
      playErrorTone();
      setSettingReminder(true);
      return;
    }
    playBackClick();
    onCloseModal(activeModal);
  };

  const applySetting = (patch: Partial<GameSettings>) => {
    playSoftSelect();
    setSettingTouchedInTutorial(true);
    setSettingReminder(false);
    onUpdateSettings(patch);
  };

  const handleMapFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !onUploadCustomMap) return;

    const lowerName = file.name.toLowerCase();
    const isValid =
      file.type.startsWith('image/') ||
      file.type === 'video/mp4' ||
      file.type === 'video/webm' ||
      lowerName.endsWith('.gif') ||
      lowerName.endsWith('.webp') ||
      lowerName.endsWith('.apng') ||
      lowerName.endsWith('.mp4') ||
      lowerName.endsWith('.webm');

    if (!isValid) {
      playErrorTone();
      setMapUploadError('Please pick a .gif, .webp, .png, .mp4, or .webm file.');
      return;
    }

    setMapUploadBusy(true);
    setMapUploadError(null);
    try {
      await onUploadCustomMap(file);
      playSoftSelect();
    } catch {
      playErrorTone();
      setMapUploadError('Could not save that map file in this browser. Try a smaller GIF or MP4.');
    } finally {
      setMapUploadBusy(false);
    }
  };

  const avatar = gameState.avatarConfig;
  const nickname = gameState.detectiveNickname || 'Junior Detective';
  const bagItems: Record<BagTab, InventoryItem[]> = {
    badges: gameState.inventory.badges,
    collectibles: gameState.inventory.collectibles,
    missionItems: gameState.inventory.missionItems,
    specialRewards: gameState.inventory.specialRewards,
  };
  const currentBagItems = bagItems[bagTab];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${activeModal} panel`}
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-[#0B2945]/45 backdrop-blur-xs"
    >
      <div
        style={{
          background:
            'linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(232,248,255,0.95) 60%, rgba(242,235,255,0.95) 100%)',
        }}
        className="aero-glass-card w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-[28px] border border-white p-5 sm:p-6 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.38)]"
      >
        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between gap-3 pb-3 border-b border-sky-100">
          <div className="flex items-center gap-2.5">
            {activeModal === 'profile' && <Award className="h-5 w-5 text-[#0284C7]" />}
            {activeModal === 'bag' && <Backpack className="h-5 w-5 text-[#0D9488]" />}
            {activeModal === 'mission-tracker' && <Compass className="h-5 w-5 text-[#7C3AED]" />}
            {activeModal === 'settings' && <Settings className="h-5 w-5 text-[#0284C7]" />}
            {activeModal === 'help' && <HelpCircle className="h-5 w-5 text-[#DB2777]" />}

            <h2 className="font-[var(--font-display)] text-lg sm:text-xl font-bold uppercase text-[#0E3558]">
              {activeModal === 'profile' && 'PLAYER PROFILE'}
              {activeModal === 'bag' && 'DETECTIVE BAG'}
              {activeModal === 'mission-tracker' && 'MISSION TRACKER'}
              {activeModal === 'settings' && 'SETTINGS & HELP'}
              {activeModal === 'help' && 'DETECTIVE HELP GUIDE'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleRequestClose}
            aria-label="Close panel"
            className="h-10 w-10 rounded-full bg-white hover:bg-sky-50 border border-sky-200 text-[#0E3558] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="relative z-10 pt-4 space-y-4">
          {/* 1. PLAYER PROFILE */}
          {activeModal === 'profile' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-sky-50 to-cyan-100/70 border border-white p-4">
                  <div className="w-32 h-44">
                    {avatar && <DetectiveAvatar config={avatar} view="front" pose="wave" />}
                  </div>
                  <p className="font-[var(--font-display)] text-base font-bold text-[#6D28D9] mt-1">
                    {nickname}
                  </p>
                </div>

                <div className="sm:col-span-7 grid grid-cols-2 gap-2.5">
                  <div className="rounded-2xl bg-white/90 border border-sky-100 p-3">
                    <p className="text-[11px] font-bold text-[#5B7A96]">LEVEL</p>
                    <p className="font-[var(--font-display)] text-xl font-bold text-[#0284C7]">
                      LEVEL {gameState.level}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/90 border border-purple-100 p-3">
                    <p className="text-[11px] font-bold text-[#5B7A96]">XP</p>
                    <p className="font-[var(--font-display)] text-xl font-bold text-[#6D28D9]">
                      {gameState.xp} XP
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/90 border border-amber-100 p-3">
                    <p className="text-[11px] font-bold text-[#5B7A96]">STARS</p>
                    <p className="font-[var(--font-display)] text-xl font-bold text-[#B45309] flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-400" aria-hidden="true" />
                      {gameState.stars} STARS
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/90 border border-teal-100 p-3">
                    <p className="text-[11px] font-bold text-[#5B7A96]">BADGES</p>
                    <p className="font-[var(--font-display)] text-xl font-bold text-[#0D9488]">
                      {gameState.inventory.badges.length} BADGES
                    </p>
                  </div>
                  <div className="col-span-2 rounded-2xl bg-white/90 border border-emerald-100 p-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#475569]">COMPLETED MISSIONS</span>
                    <span className="font-[var(--font-display)] text-base font-bold text-[#15803D]">
                      {gameState.completedMissions.length} COMPLETED MISSIONS
                    </span>
                  </div>
                </div>
              </div>

              {/* Pusheen + Player Dialogue Hint */}
              <div className="rounded-2xl bg-sky-50/90 border border-sky-200 p-3.5 flex items-start gap-3">
                <div className="h-12 w-12 shrink-0">
                  <PusheenIllustration expression="happy" />
                </div>
                <div className="text-xs sm:text-sm space-y-1 text-[#0E3558]">
                  <p className="font-semibold">
                    <strong>Detective Pusheen:</strong> &ldquo;Look! This is your detective profile.
                    Every time you complete a mission, your achievements will be recorded here.&rdquo;
                  </p>
                  <p className="text-[#6D28D9] font-semibold">
                    <strong>{nickname}:</strong> &ldquo;Can I change my character later?&rdquo;
                  </p>
                  <p className="font-semibold">
                    <strong>Detective Pusheen:</strong> &ldquo;Of course! You can revisit character
                    customisation whenever that feature is available.&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {canEditCharacter && onEditCharacter ? (
                  <button
                    type="button"
                    onClick={() => {
                      playSoftSelect();
                      onEditCharacter();
                    }}
                    className="min-h-[42px] rounded-full bg-purple-100 hover:bg-purple-200 border border-purple-300 px-4 py-2 text-xs font-bold text-[#6D28D9] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Edit Character</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-[#5B7A96]">
                    Character customisation unlocks right after your tour!
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleRequestClose}
                  className="aero-glossy-btn min-h-[42px] rounded-full bg-gradient-to-b from-[#2AB2DF] to-[#0E83B5] px-6 py-2 text-xs sm:text-sm font-bold text-white cursor-pointer"
                >
                  CLOSE PROFILE
                </button>
              </div>
            </>
          )}

          {/* 2. DETECTIVE BAG (ACTUAL BACKPACK INVENTORY UI) */}
          {activeModal === 'bag' && (() => {
            const BAG_CAPACITY = 12;
            const slots = Array.from({ length: BAG_CAPACITY }, (_, i) => currentBagItems[i] ?? null);
            const selectedItem = slots[selectedBagSlotIdx] ?? null;

            const compartmentMeta: Record<
              BagTab,
              {
                label: string;
                pocketName: string;
                emptyHint: string;
                accentBg: string;
                accentText: string;
                SlotIcon: React.ComponentType<{ className?: string }>;
              }
            > = {
              badges: {
                label: 'Badges',
                pocketName: 'Badge Pin Pouch',
                emptyHint: 'Earn detective badges by solving cases in Detective Town!',
                accentBg: 'from-amber-400 to-orange-500',
                accentText: 'text-[#B45309]',
                SlotIcon: Award,
              },
              collectibles: {
                label: 'Collectibles',
                pocketName: 'Treasure Pocket',
                emptyHint: 'Discover special town treasures as you explore each building.',
                accentBg: 'from-cyan-400 to-sky-500',
                accentText: 'text-[#0369A1]',
                SlotIcon: Gem,
              },
              missionItems: {
                label: 'Mission Items',
                pocketName: 'Clue Folder',
                emptyHint: 'Important evidence and clue cards you find go right in here.',
                accentBg: 'from-teal-400 to-emerald-500',
                accentText: 'text-[#0F766E]',
                SlotIcon: FileSearch,
              },
              specialRewards: {
                label: 'Special Rewards',
                pocketName: 'Star Vault',
                emptyHint: 'Unlock rare rewards when you complete big milestones!',
                accentBg: 'from-purple-400 to-fuchsia-500',
                accentText: 'text-[#6D28D9]',
                SlotIcon: Sparkles,
              },
            };

            const activeMeta = compartmentMeta[bagTab];
            const ActiveSlotIcon = activeMeta.SlotIcon;

            return (
              <>
              <div className="space-y-3">
                {/* Physical Detective Satchel / Backpack Shell */}
                <div className="relative rounded-[26px] border-4 border-[#92400E]/85 bg-gradient-to-b from-[#FEF3C7] via-[#FDE68A]/55 to-[#F59E0B]/25 p-3.5 sm:p-4 shadow-[inset_0_2px_8px_rgba(146,64,14,0.18),0_10px_24px_-8px_rgba(120,53,15,0.28)]">
                  {/* Top Backpack Carry Strap & Flap Trim */}
                  <div className="flex items-center justify-between gap-2 rounded-2xl bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#0F766E] border-2 border-[#115E59] px-3.5 py-2.5 text-white shadow-sm mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="h-9 w-9 rounded-xl bg-amber-300 border-2 border-[#78350F] flex items-center justify-center shrink-0 shadow-xs">
                        <Backpack className="h-5 w-5 text-[#78350F]" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-[var(--font-display)] text-xs sm:text-sm font-bold tracking-wide uppercase truncate">
                          {nickname}&apos;s Detective Backpack
                        </p>
                        <p className="text-[11px] font-semibold text-teal-100 truncate">
                          {activeMeta.pocketName}
                        </p>
                      </div>
                    </div>

                    {/* Brass Clasp Capacity Readout */}
                    <div className="rounded-xl bg-[#FEF3C7] border-2 border-[#B45309] px-2.5 py-1 text-right shrink-0 shadow-xs">
                      <p className="text-[10px] font-extrabold uppercase text-[#92400E]">Pockets</p>
                      <p className="text-xs font-extrabold tabular-nums text-[#78350F]">
                        {currentBagItems.length}/{BAG_CAPACITY}
                      </p>
                    </div>
                  </div>

                  {/* Backpack Compartment Tabs */}
                  <div
                    role="tablist"
                    aria-label="Detective Bag compartments"
                    className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3"
                  >
                    {(Object.keys(compartmentMeta) as BagTab[]).map((tabId) => {
                      const tabInfo = compartmentMeta[tabId];
                      const count = bagItems[tabId].length;
                      const isActive = bagTab === tabId;
                      return (
                        <button
                          key={tabId}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => {
                            playSoftSelect();
                            setBagTab(tabId);
                            setSelectedBagSlotIdx(0);
                          }}
                          className={`min-h-[38px] rounded-xl px-2.5 py-1.5 text-xs font-bold cursor-pointer transition-all flex items-center justify-between gap-1.5 border-2 ${
                            isActive
                              ? 'bg-[#0D9488] border-[#115E59] text-white shadow-sm'
                              : 'bg-white/90 border-[#D97706]/30 text-[#78350F] hover:bg-white'
                          }`}
                        >
                          <span className="truncate">{tabInfo.label}</span>
                          <span
                            className={`text-[11px] font-extrabold tabular-nums ${
                              isActive ? 'text-amber-200' : 'text-[#B45309]'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 12 Stitched Backpack Inventory Grid Pockets */}
                  <div
                    role="grid"
                    aria-label={`${activeMeta.pocketName} slots`}
                    className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5 rounded-2xl bg-[#FFFBEB]/80 border-2 border-dashed border-[#B45309]/35 p-2.5 sm:p-3"
                  >
                    {slots.map((item, idx) => {
                      const isSelected = selectedBagSlotIdx === idx;
                      return (
                        <button
                          key={`${bagTab}-slot-${idx}`}
                          type="button"
                          onClick={() => {
                            playSoftSelect();
                            setSelectedBagSlotIdx(idx);
                          }}
                          aria-label={
                            item
                              ? `${item.name} in pocket ${idx + 1}`
                              : `Empty backpack pocket ${idx + 1}`
                          }
                          className={`group relative aspect-square rounded-2xl border-2 p-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                            item
                              ? isSelected
                                ? 'bg-white border-[#0D9488] ring-3 ring-teal-300 shadow-md scale-[1.02]'
                                : 'bg-white/95 border-teal-200 hover:border-teal-400 shadow-xs'
                              : isSelected
                                ? 'bg-[#FEF3C7]/90 border-[#D97706] ring-2 ring-amber-300'
                                : 'bg-[#FEF3C7]/45 border-dashed border-[#D97706]/35 hover:bg-[#FEF3C7]/75'
                          }`}
                        >
                          {/* Pocket Number Tag */}
                          <span className="absolute top-1 left-1.5 text-[9px] font-bold tabular-nums text-[#92400E]/60">
                            {idx + 1}
                          </span>

                          {item ? (
                            <>
                              <span
                                className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br ${activeMeta.accentBg} text-white flex items-center justify-center shadow-sm mb-1`}
                              >
                                <ActiveSlotIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                              <span className="text-[10px] sm:text-[11px] font-extrabold text-[#0E3558] leading-tight line-clamp-2">
                                {item.name}
                              </span>
                            </>
                          ) : (
                            <span className="h-7 w-7 rounded-lg border border-dashed border-[#B45309]/25 flex items-center justify-center text-[#B45309]/30">
                              <ActiveSlotIcon className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Pocket Inspector Bar */}
                  <div className="mt-3 rounded-2xl bg-white/95 border border-amber-200 p-3 flex items-center gap-3">
                    {selectedItem ? (
                      <>
                        <span
                          className={`h-11 w-11 rounded-xl bg-gradient-to-br ${activeMeta.accentBg} text-white flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          <ActiveSlotIcon className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className={`text-xs sm:text-sm font-extrabold ${activeMeta.accentText}`}>
                            {selectedItem.name}
                          </p>
                          <p className="text-xs font-semibold text-[#475569]">
                            {selectedItem.description}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-11 w-11 shrink-0">
                          <PusheenIllustration expression="encouraging" />
                        </div>
                        <div className="text-xs sm:text-sm text-[#0E3558]">
                          <p className="font-extrabold text-[#92400E]">
                            {currentBagItems.length === 0
                              ? 'Your Detective Backpack is ready!'
                              : `Pocket #${selectedBagSlotIdx + 1} is empty`}
                          </p>
                          <p className="font-semibold text-[#475569]">
                            {activeMeta.emptyHint}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleRequestClose}
                  className="aero-glossy-btn min-h-[42px] rounded-full bg-gradient-to-b from-[#2AB2DF] to-[#0E83B5] px-6 py-2 text-xs sm:text-sm font-bold text-white cursor-pointer"
                >
                  CLOSE BAG
                </button>
              </div>
              </>
            );
          })()}

          {/* 3. MISSION TRACKER */}
          {activeModal === 'mission-tracker' && (() => {
            const s3 = gameState.screen03Progress;
            const s4 = gameState.screen04Progress;
            const s5 = gameState.screen05Progress;
            const s6 = gameState.screen06Progress;
            const s7 = gameState.screen07Progress;
            const redFlagUnlocked =
              Boolean(s3?.redFlagCentreUnlocked) ||
              gameState.unlockedBuildings.includes('red-flag-centre');
            const ainaUnlocked =
              Boolean(s4?.ainasHouseUnlocked) ||
              gameState.unlockedBuildings.includes('ainas-house');
            const cafeUnlocked =
              Boolean(s5?.cyberCafeUnlocked) ||
              gameState.unlockedBuildings.includes('cyber-cafe');
            const adviceUnlocked =
              Boolean(s6?.adviceCentreUnlocked) ||
              gameState.unlockedBuildings.includes('advice-centre');
            const arcadeUnlocked =
              Boolean(s7?.gameArcadeUnlocked) ||
              gameState.unlockedBuildings.includes('game-arcade');
            const inductionDone = Boolean(s3?.inductionCompleted);

            const nextMissionEyebrow = arcadeUnlocked
              ? 'NEXT LOCATION: GAME ARCADE'
              : adviceUnlocked
                ? 'ACTIVITY 4 · ADVICE CENTRE'
                : cafeUnlocked
                  ? 'ACTIVITY 3 · CYBER CAFÉ'
                  : ainaUnlocked
                    ? "ACTIVITY 2 · AINA'S HOUSE"
                    : redFlagUnlocked
                      ? 'MISSION 02 · RED FLAG CENTRE'
                      : 'MISSION 01 · INDUCTION';

            const nextMissionTitle = arcadeUnlocked
              ? 'GAME ARCADE · SCREEN 08 READY'
              : adviceUnlocked
                ? 'WORDS THAT HELP · ASKING & GIVING ADVICE'
                : cafeUnlocked
                  ? 'HELP BYTE INVESTIGATE 10 MESSAGE FILES!'
                  : ainaUnlocked
                    ? 'THE MYSTERY OF THE LUCKY MESSAGE'
                    : redFlagUnlocked
                      ? 'SPOT THE WARNING SIGNS IN DIGITAL MESSAGES'
                      : 'THE MYSTERY OF THE UNEXPECTED PRIZE';

            const nextLocationLabel = arcadeUnlocked
              ? 'GAME ARCADE (UNLOCKED)'
              : adviceUnlocked
                ? 'ADVICE CENTRE (UNLOCKED)'
                : cafeUnlocked
                  ? 'CYBER CAFÉ (UNLOCKED)'
                  : ainaUnlocked
                    ? "AINA'S HOUSE (UNLOCKED)"
                    : redFlagUnlocked
                      ? 'RED FLAG CENTRE (UNLOCKED)'
                      : 'DETECTIVE HQ';

            const nextObjectiveLabel = arcadeUnlocked
              ? 'You completed Activities 1–4 and earned your Words That Help portfolio! Game Arcade (Screen 08) is now unlocked.'
              : adviceUnlocked
                ? 'Explore the Advice Centre, read the 3 Advice Cards, complete Writing Missions 1–3, and tick all 3 Self-Check items.'
                : cafeUnlocked
                  ? "Meet Byte at the Cyber Café, sit at an empty computer, classify all 10 message files, solve Part C & D, and earn Byte's Helper badge!"
                  : ainaUnlocked
                    ? "Visit Aina's House, walk through the rooms with WASD to find her bedroom, read the Lucky Message story (Q1–Q5), and write caring advice."
                    : redFlagUnlocked
                      ? 'Investigate the suspicious AeroMail email, collect all 5 warning signs, and complete the Red Flag Centre knowledge check.'
                      : 'Watch a video about a suspicious online message, decide whether you would click it, and learn three online safety rules.';

            return (
              <>
                <div className="rounded-2xl bg-gradient-to-br from-purple-50/95 via-white to-sky-50/95 border border-purple-200 p-4 sm:p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-extrabold tracking-widest uppercase text-[#6D28D9]">
                      YOUR ADVENTURE
                    </span>
                    <span className="rounded-lg border px-2.5 py-0.5 text-[11px] font-extrabold bg-emerald-100 border-emerald-300 text-[#15803D]">
                      {arcadeUnlocked
                        ? 'ACTIVITIES 1–4 COMPLETED!'
                        : adviceUnlocked
                          ? 'ACTIVITY 3 COMPLETED!'
                          : cafeUnlocked
                            ? 'ACTIVITIES 1 & 2 COMPLETED!'
                            : s4?.activityCompleted
                              ? 'MISSION 02 COMPLETED!'
                              : inductionDone
                                ? 'INDUCTION COMPLETED!'
                                : s3?.hqEntered
                                  ? 'STATUS: IN PROGRESS'
                                  : 'STATUS: READY TO BEGIN'}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#0284C7]">
                      {nextMissionEyebrow}
                    </p>
                    <h3 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#1E1B4B]">
                      {nextMissionTitle}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                    <div className="rounded-xl bg-white/90 border border-sky-100 p-3 flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-[11px] font-extrabold text-[#5B7A96]">LOCATION</p>
                        <p className="font-bold text-[#0E3558]">{nextLocationLabel}</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/90 border border-purple-100 p-3 flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-[#6D28D9] shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-[11px] font-extrabold text-[#5B7A96]">OBJECTIVE</p>
                        <p className="font-semibold text-[#0E3558]">{nextObjectiveLabel}</p>
                      </div>
                    </div>
                  </div>

                  {s3 && (
                    <div className="rounded-xl bg-white/85 border border-sky-100 p-3 space-y-1.5">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0369A1]">
                        MISSION 01 · DETECTIVE HQ INDUCTION
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs font-semibold text-[#0E3558]">
                        <li className={s3.videoCompleted ? 'text-[#15803D]' : 'text-[#64748B]'}>
                          {s3.videoCompleted ? '✓' : '○'} Watched the investigation video
                        </li>
                        <li className={s3.problemIdentified ? 'text-[#15803D]' : 'text-[#64748B]'}>
                          {s3.problemIdentified ? '✓' : '○'} Identified the problem
                        </li>
                        <li className={s3.decisionCompleted ? 'text-[#15803D]' : 'text-[#64748B]'}>
                          {s3.decisionCompleted ? '✓' : '○'} Completed the YES/NO decision
                        </li>
                        <li
                          className={
                            s3.rulesCompleted.rule1 &&
                            s3.rulesCompleted.rule2 &&
                            s3.rulesCompleted.rule3
                              ? 'text-[#15803D]'
                              : 'text-[#64748B]'
                          }
                        >
                          {s3.rulesCompleted.rule1 &&
                          s3.rulesCompleted.rule2 &&
                          s3.rulesCompleted.rule3
                            ? '✓'
                            : '○'}{' '}
                          Explored three online safety rules
                        </li>
                        <li
                          className={
                            s3.knowledgeCheckCompleted ? 'text-[#15803D]' : 'text-[#64748B]'
                          }
                        >
                          {s3.knowledgeCheckCompleted ? '✓' : '○'} Completed quick understanding check
                        </li>
                      </ul>
                    </div>
                  )}

                  {redFlagUnlocked && (
                    <div className="rounded-xl bg-white/85 border border-rose-100 p-3 space-y-1.5">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#BE123C]">
                        MISSION 02 · RED FLAG CENTRE (SPOT THE WARNING SIGNS)
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs font-semibold text-[#0E3558]">
                        <li
                          className={
                            s4?.learningExamplesExplored.example1 &&
                            s4?.learningExamplesExplored.example2 &&
                            s4?.learningExamplesExplored.example3
                              ? 'text-[#15803D]'
                              : 'text-[#64748B]'
                          }
                        >
                          {s4?.learningExamplesExplored.example1 &&
                          s4?.learningExamplesExplored.example2 &&
                          s4?.learningExamplesExplored.example3
                            ? '✓'
                            : '○'}{' '}
                          Learned Red Flag clues &amp; safety signs
                        </li>
                        <li
                          className={
                            (s4?.discoveredClues.length ?? 0) >= 5
                              ? 'text-[#15803D]'
                              : 'text-[#64748B]'
                          }
                        >
                          {(s4?.discoveredClues.length ?? 0) >= 5 ? '✓' : '○'} Found email warning
                          signs ({s4?.discoveredClues.length ?? 0}/5)
                        </li>
                        <li className={s4?.masteryAchieved ? 'text-[#15803D]' : 'text-[#64748B]'}>
                          {s4?.masteryAchieved ? '✓' : '○'} Knowledge Check (First try:{' '}
                          {s4?.firstAttemptScore ?? 0}/5)
                        </li>
                        <li className={ainaUnlocked ? 'text-[#15803D]' : 'text-[#64748B]'}>
                          {ainaUnlocked ? '✓' : '○'} Unlocked Aina&apos;s House
                        </li>
                      </ul>
                    </div>
                  )}

                  {ainaUnlocked && (
                    <div className="rounded-xl bg-white/85 border border-fuchsia-100 p-3 space-y-1.5">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#9333EA]">
                        ACTIVITY 2 · AINA&apos;S HOUSE (LUCKY MESSAGE MYSTERY)
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs font-semibold text-[#0E3558]">
                        <li className={s5?.foundAinasRoom ? 'text-[#15803D]' : 'text-[#64748B]'}>
                          {s5?.foundAinasRoom ? '✓' : '○'} Found Aina&apos;s Bedroom
                        </li>
                        <li className={s5?.readingCompleted ? 'text-[#15803D]' : 'text-[#64748B]'}>
                          {s5?.readingCompleted ? '✓' : '○'} Reading Q1–Q5 (First try:{' '}
                          {s5?.firstAttemptScore ?? 0}/5 · Final:{' '}
                          {s5?.readingResponses.filter((r) => Boolean(r.finalCorrectAnswer)).length ??
                            0}
                          /5)
                        </li>
                        <li className={s5?.writingCompleted ? 'text-[#15803D]' : 'text-[#64748B]'}>
                          {s5?.writingCompleted ? '✓' : '○'} Completed 3-step Advice Chat
                        </li>
                        <li className={cafeUnlocked ? 'text-[#15803D]' : 'text-[#64748B]'}>
                          {cafeUnlocked ? '✓' : '○'} Unlocked Cyber Café (Screen 06)
                        </li>
                      </ul>
                    </div>
                  )}

                  {cafeUnlocked && (
                    <div className="rounded-xl bg-white/85 border border-cyan-100 p-3 space-y-1.5">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0284C7]">
                        ACTIVITY 3 · CYBER CAFÉ (HELP BYTE INVESTIGATE!)
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs font-semibold text-[#0E3558]">
                        <li
                          className={
                            (s6?.casesCompleted.length ?? 0) >= 10
                              ? 'text-[#15803D]'
                              : 'text-[#64748B]'
                          }
                        >
                          {(s6?.casesCompleted.length ?? 0) >= 10 ? '✓' : '○'} Digital Message Files (
                          {s6?.casesCompleted.length ?? 0}/10 · 1st try:{' '}
                          {s6?.firstAttemptCasesScore ?? 0}/10)
                        </li>
                        <li className={s6?.partCCompleted ? 'text-[#15803D]' : 'text-[#64748B]'}>
                          {s6?.partCCompleted ? '✓' : '○'} Part C: Choose Correct Action
                        </li>
                        <li
                          className={s6?.miniChallengeCompleted ? 'text-[#15803D]' : 'text-[#64748B]'}
                        >
                          {s6?.miniChallengeCompleted ? '✓' : '○'} Part D: 3-Message Challenge
                        </li>
                        <li className={s6?.badgeAwarded ? 'text-[#15803D]' : 'text-[#64748B]'}>
                          {s6?.badgeAwarded ? '✓' : '○'} Earned Byte&apos;s Helper Badge
                        </li>
                      </ul>
                    </div>
                  )}

                  {adviceUnlocked && (
                    <div className="rounded-xl bg-white/85 border border-teal-100 p-3 space-y-1.5">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0D9488]">
                        ACTIVITY 4 · ADVICE CENTRE (WORDS THAT HELP)
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs font-semibold text-[#0E3558]">
                        <li
                          className={
                            s7?.learningCardsExplored.card1 &&
                            s7?.learningCardsExplored.card2 &&
                            s7?.learningCardsExplored.card3
                              ? 'text-[#15803D]'
                              : 'text-[#64748B]'
                          }
                        >
                          {s7?.learningCardsExplored.card1 &&
                          s7?.learningCardsExplored.card2 &&
                          s7?.learningCardsExplored.card3
                            ? '✓'
                            : '○'}{' '}
                          Opened all 3 Advice Learning Cards
                        </li>
                        <li
                          className={
                            s7?.writingPortfolio.submittedAt ? 'text-[#15803D]' : 'text-[#64748B]'
                          }
                        >
                          {s7?.writingPortfolio.submittedAt ? '✓' : '○'} Completed 3-Part Advice Chat
                        </li>
                        <li
                          className={
                            s7?.selfCheck.askAdvice &&
                            s7?.selfCheck.giveAdvice &&
                            s7?.selfCheck.respondAdvice
                              ? 'text-[#15803D]'
                              : 'text-[#64748B]'
                          }
                        >
                          {s7?.selfCheck.askAdvice &&
                          s7?.selfCheck.giveAdvice &&
                          s7?.selfCheck.respondAdvice
                            ? '✓'
                            : '○'}{' '}
                          Self-Check (
                          {[
                            s7?.selfCheck.askAdvice,
                            s7?.selfCheck.giveAdvice,
                            s7?.selfCheck.respondAdvice,
                          ].filter(Boolean).length}
                          /3)
                        </li>
                        <li className={arcadeUnlocked ? 'text-[#15803D]' : 'text-[#64748B]'}>
                          {arcadeUnlocked ? '✓' : '○'} Unlocked Game Arcade (Screen 08)
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-sky-50/90 border border-sky-200 p-3.5 flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0">
                    <PusheenIllustration
                      expression={arcadeUnlocked || adviceUnlocked || cafeUnlocked || inductionDone ? 'celebrating' : 'happy'}
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#0E3558]">
                    <strong>Detective Pusheen:</strong>{' '}
                    {arcadeUnlocked
                      ? '“Purr-fect work completing Activities 1–4! The Game Arcade is now unlocked on Detective Town!”'
                      : adviceUnlocked
                        ? '“Visit the Advice Centre next to practise asking, giving, and responding to online safety advice!”'
                        : cafeUnlocked
                          ? '“Amazing work helping Aina! Cyber Café is now open on your Detective Town map!”'
                          : ainaUnlocked
                            ? '“Head over to Aina’s House next! She needs our detective reading and advice skills.”'
                            : redFlagUnlocked
                              ? '“You finished the Detective HQ induction! Head over to Red Flag Centre next!”'
                              : '“See? This is your first mission! Whenever you need to remember what you’re supposed to do, just check your Mission Tracker.”'}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleRequestClose}
                    className="aero-glossy-btn min-h-[42px] rounded-full bg-gradient-to-b from-[#2AB2DF] to-[#0E83B5] px-6 py-2 text-xs sm:text-sm font-bold text-white cursor-pointer"
                  >
                    CLOSE TRACKER
                  </button>
                </div>
              </>
            );
          })()}

          {/* 4. SETTINGS & HELP */}
          {(activeModal === 'settings' || activeModal === 'help') && (
            <>
              {activeModal === 'settings' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Sound Effects */}
                  <button
                    type="button"
                    onClick={() => applySetting({ soundEffects: !gameState.settings.soundEffects })}
                    className="rounded-2xl bg-white/95 border border-sky-100 p-3.5 flex items-center justify-between text-left cursor-pointer hover:border-sky-300"
                  >
                    <div>
                      <p className="text-xs font-extrabold text-[#0E3558]">SOUND EFFECTS</p>
                      <p className="text-[11px] text-[#5B7A96]">Button pops and chimes</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                        gameState.settings.soundEffects
                          ? 'bg-emerald-100 text-[#15803D]'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {gameState.settings.soundEffects ? 'On' : 'Off'}
                    </span>
                  </button>

                  {/* Background Music */}
                  <button
                    type="button"
                    onClick={() =>
                      applySetting({ backgroundMusic: !gameState.settings.backgroundMusic })
                    }
                    className="rounded-2xl bg-white/95 border border-sky-100 p-3.5 flex items-center justify-between text-left cursor-pointer hover:border-sky-300"
                  >
                    <div>
                      <p className="text-xs font-extrabold text-[#0E3558]">BACKGROUND MUSIC</p>
                      <p className="text-[11px] text-[#5B7A96]">Gentle town melody</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                        gameState.settings.backgroundMusic
                          ? 'bg-emerald-100 text-[#15803D]'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {gameState.settings.backgroundMusic ? 'On' : 'Off'}
                    </span>
                  </button>

                  {/* Subtitles */}
                  <button
                    type="button"
                    onClick={() => applySetting({ subtitles: !gameState.settings.subtitles })}
                    className="rounded-2xl bg-white/95 border border-sky-100 p-3.5 flex items-center justify-between text-left cursor-pointer hover:border-sky-300"
                  >
                    <div>
                      <p className="text-xs font-extrabold text-[#0E3558]">SUBTITLES</p>
                      <p className="text-[11px] text-[#5B7A96]">Show dialogue text</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                        gameState.settings.subtitles
                          ? 'bg-emerald-100 text-[#15803D]'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {gameState.settings.subtitles ? 'On' : 'Off'}
                    </span>
                  </button>

                  {/* Text Size */}
                  <div className="rounded-2xl bg-white/95 border border-sky-100 p-3.5 space-y-2">
                    <p className="text-xs font-extrabold text-[#0E3558]">TEXT SIZE</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['small', 'medium', 'large'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => applySetting({ textSize: sz })}
                          className={`min-h-[34px] rounded-xl text-xs font-bold capitalize cursor-pointer ${
                            gameState.settings.textSize === sz
                              ? 'bg-[#0284C7] text-white'
                              : 'bg-sky-50 text-[#0E3558] hover:bg-sky-100'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Animation Preference */}
                  <div className="rounded-2xl bg-white/95 border border-sky-100 p-3.5 space-y-2">
                    <p className="text-xs font-extrabold text-[#0E3558]">ANIMATION</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => applySetting({ reducedMotion: false })}
                        className={`min-h-[34px] rounded-xl text-xs font-bold cursor-pointer ${
                          !gameState.settings.reducedMotion
                            ? 'bg-[#0284C7] text-white'
                            : 'bg-sky-50 text-[#0E3558] hover:bg-sky-100'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => applySetting({ reducedMotion: true })}
                        className={`min-h-[34px] rounded-xl text-xs font-bold cursor-pointer ${
                          gameState.settings.reducedMotion
                            ? 'bg-[#0284C7] text-white'
                            : 'bg-sky-50 text-[#0E3558] hover:bg-sky-100'
                        }`}
                      >
                        Reduced Motion
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CUSTOM ANIMATED MAP (.GIF / .MP4) */}
              {onUploadCustomMap && (
                <div className="rounded-2xl bg-sky-50/90 border border-sky-200 p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Film className="h-4 w-4 text-[#0284C7]" aria-hidden="true" />
                      <h3 className="font-[var(--font-display)] text-sm font-bold uppercase text-[#0E3558]">
                        CUSTOM ANIMATED MAP (GIF / VIDEO)
                      </h3>
                    </div>
                    {customMapMedia && onResetCustomMap && (
                      <button
                        type="button"
                        onClick={() => {
                          playSoftSelect();
                          onResetCustomMap();
                        }}
                        className="min-h-[34px] rounded-full bg-white hover:bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-[#BE123C] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Reset Default Map</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-[#335C81]">
                    {customMapMedia
                      ? `Active custom map: ${customMapMedia.fileName}`
                      : 'Detective Town already includes live animated sunbeams, clouds, stream ripples, swimming fish, and butterflies. Want to load your own animated .gif or .mp4 from your computer? Pick it below!'}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="aero-glossy-btn min-h-[38px] rounded-full bg-gradient-to-b from-[#2AB2DF] to-[#0E83B5] px-4 py-1.5 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer">
                      <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {mapUploadBusy
                          ? 'Loading Map...'
                          : customMapMedia
                            ? 'Change Map File'
                            : 'Choose Local .GIF / .MP4'}
                      </span>
                      <input
                        type="file"
                        accept=".gif,.webp,.apng,.mp4,.webm,image/*,video/mp4,video/webm"
                        onChange={handleMapFileChange}
                        disabled={mapUploadBusy}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  {mapUploadError && (
                    <p
                      role="alert"
                      className="text-xs font-bold text-[#B91C1C] bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5"
                    >
                      {mapUploadError}
                    </p>
                  )}
                </div>
              )}

              {/* HELP SECTION */}
              <div className="rounded-2xl bg-pink-50/90 border border-pink-200 p-4 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#DB2777]" aria-hidden="true" />
                    <h3 className="font-[var(--font-display)] text-sm font-bold uppercase text-[#9D174D]">
                      HELP &amp; CONTROLS
                    </h3>
                  </div>
                  {onReplayTutorial && (
                    <button
                      type="button"
                      onClick={() => {
                        playSoftSelect();
                        onReplayTutorial();
                      }}
                      className="min-h-[36px] rounded-full bg-white hover:bg-pink-100 border border-pink-300 px-3.5 py-1 text-xs font-bold text-[#BE185D] inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Replay the tutorial</span>
                    </button>
                  )}
                </div>

                <ul className="text-xs font-semibold text-[#10375C] space-y-1 list-disc pl-4">
                  <li>Click or tap anywhere on the stone pathway (or use WASD / Arrow keys) to walk.</li>
                  <li>Click any of the seven town buildings to learn what each location is for.</li>
                  <li>Use the top icons anytime to check your Profile, Bag, Mission Tracker, or Settings.</li>
                </ul>
              </div>

              {activeModal === 'settings' && (
                <div className="rounded-2xl bg-sky-50/90 border border-sky-200 p-3 flex items-center gap-3">
                  <div className="h-11 w-11 shrink-0">
                    <PusheenIllustration expression="encouraging" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#0E3558]">
                    <strong>Detective Pusheen:</strong> &ldquo;These settings help you enjoy the
                    adventure in the way that feels comfortable for you.&rdquo;
                  </p>
                </div>
              )}

              {settingReminder && (
                <p role="alert" className="text-xs font-bold text-[#B45309] bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  Try clicking any setting option above first (you can switch it right back afterwards!), then close this panel.
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleRequestClose}
                  className="aero-glossy-btn min-h-[42px] rounded-full bg-gradient-to-b from-[#2AB2DF] to-[#0E83B5] px-6 py-2 text-xs sm:text-sm font-bold text-white cursor-pointer"
                >
                  {activeModal === 'settings' ? 'DONE' : 'CLOSE HELP'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
