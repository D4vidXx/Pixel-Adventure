import { Coins, Gift, Sparkles, Star } from 'lucide-react';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ParticleBackground } from './ParticleBackground';

export interface LootItem {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export const LOOT_ITEMS = {
  // Common (80%)
  apple: {
    id: 'apple',
    name: 'Apple',
    description: 'A fresh apple that restores 10 HP',
    rarity: 'common' as const,
  },
  bread: {
    id: 'bread',
    name: 'Bread',
    description: 'A loaf of bread that restores 16 HP',
    rarity: 'common' as const,
  },
  small_energy_shot: {
    id: 'small_energy_shot',
    name: 'Small Energy Shot',
    description: 'A small vial that restores 10 energy',
    rarity: 'common' as const,
  },
  // Rare (15%)
  health_potion_reward: {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'A potent potion that restores 36 HP',
    rarity: 'rare' as const,
  },
  energy_potion: {
    id: 'energy_potion',
    name: 'Energy Potion',
    description: 'Replenishes 40 energy',
    rarity: 'rare' as const,
  },
  weakness_potion: {
    id: 'weakness_potion',
    name: 'Weakness Potion',
    description: 'Reduces all enemy damage by 20% for their next 3 turns',
    rarity: 'rare' as const,
  },
  // Legendary Artifacts (5%) - Permanent passive effects
  golden_apple: {
    id: 'golden_apple',
    name: 'Golden Apple',
    description: 'At the end of your turn, heal 8% of your max HP',
    rarity: 'legendary' as const,
  },
  golden_crown: {
    id: 'golden_crown',
    name: 'Golden Crown',
    description: '1% chance to instantly kill an enemy at the start of your turn',
    rarity: 'legendary' as const,
  },
  finished_rubix_cube: {
    id: 'finished_rubix_cube',
    name: 'Finished Rubix Cube',
    description: 'Permanently increases attack and defense by 20%',
    rarity: 'legendary' as const,
  },
  disco_ball: {
    id: 'disco_ball',
    name: 'Disco Ball',
    description: '15% chance the enemy gets distracted and skips their turn (max 2; extra converts to another legendary)',
    rarity: 'legendary' as const,
  },
  lucky_charm: {
    id: 'lucky_charm',
    name: 'Lucky Charm',
    description: 'Permanently increase your highest stat by 8% (Atk/Def/Spd only)',
    rarity: 'rare' as const,
  },
  wooden_mask: {
    id: 'wooden_mask',
    name: 'Wooden Mask',
    description: 'Grants +15 Shield at the start of every level',
    rarity: 'rare' as const,
  },
  slime_boots: {
    id: 'slime_boots',
    name: 'Slime Boots',
    description: 'Reduces the first attack you take in a level by 25% (caps at 50%)',
    rarity: 'rare' as const,
  },
  pirates_chest: {
    id: 'pirates_chest',
    name: 'Pirates\' Chest',
    description: 'Mystery Chest odds: 55% Common, 30% Rare, 15% Legendary',
    rarity: 'rare' as const,
  },
};

interface RewardScreenProps {
  currentStage: number;
  currentLevel: number;
  onSelectGold: (amount: number) => void;
  onSelectChest: (loot: LootItem) => void;
  onSelectBossChest?: () => void;
  onSelectBossLoots?: (primaryLoot: LootItem, bonusLoot?: LootItem) => void;
  ownedArtifacts: Record<string, number>;
  combatLog: string[];
}

export function RewardScreen({ currentStage, currentLevel, onSelectGold, onSelectChest, onSelectBossChest, onSelectBossLoots, ownedArtifacts, combatLog }: RewardScreenProps) {
  const [selectedReward, setSelectedReward] = useState<'gold' | 'chest' | 'boss_chest' | null>(null);
  const [revealedLoot, setRevealedLoot] = useState<LootItem | null>(null);
  const [bonusBossLoot, setBonusBossLoot] = useState<LootItem | null>(null);
  const [bossLoots, setBossLoots] = useState<LootItem[]>([]);
  const [bossLootIndex, setBossLootIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const claimLockRef = useRef(false);

  const isBossLevel = (currentStage === 1 && currentLevel === 10)
    || (currentStage === 2 && currentLevel === 12)
    || (currentStage === 3 && currentLevel === 16);
  const isLordInfernoBoss = currentStage === 2 && currentLevel === 12;
  const isMagmaOverlordBoss = currentStage === 3 && currentLevel === 16;
  const goldAmount = isBossLevel ? 100 : 25 + (currentStage - 1) * 5;

  const rollLoot = (): LootItem => {
    const roll = Math.random() * 100;
    const hasPiratesChest = ownedArtifacts['pirates_chest'] > 0;
    const commonOdds = hasPiratesChest ? 55 : 80;
    const rareOdds = hasPiratesChest ? 30 : 15;

    if (roll < commonOdds) {
      // Common
      const commonItems = [LOOT_ITEMS.apple, LOOT_ITEMS.bread, LOOT_ITEMS.small_energy_shot];
      return commonItems[Math.floor(Math.random() * commonItems.length)];
    } else if (roll < commonOdds + rareOdds) {
      // Rare
      const rareItems = [
        LOOT_ITEMS.health_potion_reward,
        LOOT_ITEMS.energy_potion,
        LOOT_ITEMS.weakness_potion,
        LOOT_ITEMS.lucky_charm,
        LOOT_ITEMS.wooden_mask,
        LOOT_ITEMS.slime_boots,
        LOOT_ITEMS.pirates_chest,
      ];
      // In stacking mode, we don't filter out owned artifacts
      return rareItems[Math.floor(Math.random() * rareItems.length)];
    } else {
      // Legendary Artifacts
      const legendaryItems = [
        LOOT_ITEMS.golden_apple,
        LOOT_ITEMS.golden_crown,
        LOOT_ITEMS.finished_rubix_cube,
        LOOT_ITEMS.disco_ball,
      ];
      // In stacking mode, we don't filter out owned artifacts
      return legendaryItems[Math.floor(Math.random() * legendaryItems.length)];
    }
  };

  const handleSelectGold = () => {
    setSelectedReward('gold');
    setTimeout(() => {
      onSelectGold(goldAmount);
    }, 800);
  };

  const handleSelectChest = () => {
    setSelectedReward('chest');
    setIsRevealing(true);

    setTimeout(() => {
      const loot = rollLoot();
      setRevealedLoot(loot);
      setIsRevealing(false);
    }, 1500);
  };

  const handleSelectBossChest = () => {
    setSelectedReward('boss_chest');
    setIsRevealing(true);
    setBossLootIndex(0);

    setTimeout(() => {
      const roll = Math.random() * 100;
      const rollBossLoot = (): LootItem => {
        const lootRoll = Math.random() * 100;
        if (lootRoll < 50) {
          const legendaryItems = [
            LOOT_ITEMS.golden_apple,
            LOOT_ITEMS.golden_crown,
            LOOT_ITEMS.finished_rubix_cube,
            LOOT_ITEMS.disco_ball,
          ];
          return legendaryItems[Math.floor(Math.random() * legendaryItems.length)];
        }
        return {
          id: 'boss_bonus_gold',
          name: '+100 Bonus Gold',
          description: 'Extra gold from the boss chest!',
          rarity: 'rare',
        };
      };

      const bossChestCount = isLordInfernoBoss ? 2 : isMagmaOverlordBoss ? 3 : 1;
      const rolledLoots = Array.from({ length: bossChestCount }, () => rollBossLoot());
      setRevealedLoot(rolledLoots[0]);
      setBossLoots(rolledLoots);
      setBonusBossLoot(null);
      setIsRevealing(false);
    }, 1500);
  };

  const handleClaimLoot = () => {
    if (hasClaimed || isRevealing || claimLockRef.current) return;
    claimLockRef.current = true;
    setHasClaimed(true);

    if (selectedReward === 'boss_chest' && revealedLoot && bossLoots.length > 0) {
      if (bossLootIndex < bossLoots.length - 1) {
        const nextIndex = bossLootIndex + 1;
        setBossLootIndex(nextIndex);
        setRevealedLoot(bossLoots[nextIndex]);
        setHasClaimed(false);
        setTimeout(() => {
          claimLockRef.current = false;
        }, 150);
        return;
      }

      if (onSelectBossLoots && bossLoots.length <= 2) {
        onSelectBossLoots(bossLoots[0], bossLoots[1]);
      } else {
        const applyLoot = (loot: LootItem | null) => {
          if (!loot) return;
          if (loot.id === 'boss_bonus_gold') {
            if (onSelectBossChest) {
              onSelectBossChest();
            }
          } else {
            onSelectChest(loot);
          }
        };
        bossLoots.forEach(loot => applyLoot(loot));
      }

      setBonusBossLoot(null);
      setBossLoots([]);
      setBossLootIndex(0);
      return;
    }

    const applyLoot = (loot: LootItem | null) => {
      if (!loot) return;
      if (loot.id === 'boss_bonus_gold') {
        if (onSelectBossChest) {
          onSelectBossChest();
        }
      } else {
        onSelectChest(loot);
      }
    };

    applyLoot(revealedLoot);
    applyLoot(bonusBossLoot);
    setBonusBossLoot(null);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-slate-400 border-slate-500/50';
      case 'rare':
        return 'text-blue-400 border-blue-500/50';
      case 'legendary':
        return 'text-yellow-400 border-yellow-500/50';
      default:
        return 'text-slate-400 border-slate-500/50';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-slate-900/40';
      case 'rare':
        return 'bg-blue-900/40';
      case 'legendary':
        return 'bg-yellow-900/40';
      default:
        return 'bg-slate-900/40';
    }
  };

  return (
    <div className="size-full min-h-screen bg-slate-950 flex shadow-inner items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(2,6,23,1))]" />

      {/* Nebula Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.12, 0.05],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.04, 0.1, 0.04],
          x: [0, -60, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[110px]"
      />

      {/* Particles */}
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* Title */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            animate={{
              textShadow: [
                "0 0 10px rgba(234,179,8,0.2)",
                "0 0 30px rgba(234,179,8,0.5)",
                "0 0 10px rgba(234,179,8,0.2)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <h2 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent tracking-widest uppercase mb-4 px-4">
              Victory!
            </h2>
          </motion.div>
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-slate-400 text-sm sm:text-lg tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-70">
            <div className="h-px w-12 bg-slate-700" />
            Choose your reward
            <div className="h-px w-12 bg-slate-700" />
          </div>
        </motion.div>

        {/* Reward Options */}
        {!selectedReward ? (
          isBossLevel ? (
            /* Boss Level - Show only Boss Chest */
            <div className="max-w-2xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSelectBossChest}
                className="group relative w-full bg-slate-900/60 backdrop-blur-xl border-2 border-orange-600/50 hover:border-orange-500 p-8 sm:p-12 transition-all duration-300 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl shadow-black/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex flex-col items-center gap-6">
                  <div className="p-6 sm:p-8 bg-orange-500/10 rounded-full border border-orange-500/20 shadow-inner">
                    <Gift className="w-16 h-16 sm:w-24 sm:h-24 text-orange-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl sm:text-4xl font-bold text-orange-400 tracking-wider uppercase mb-2">
                      Boss Chest
                    </h3>
                    <p className="text-slate-400 text-sm sm:text-lg">
                      {goldAmount} Gold + Epic Loot!
                    </p>
                    {(isLordInfernoBoss || isMagmaOverlordBoss) && (
                      <p className="text-xs sm:text-sm text-orange-300/80 uppercase tracking-[0.2em] mt-2">
                        {isMagmaOverlordBoss ? 'Magma Overlord: 3 chests, opened one at a time' : 'Lord Inferno: 2 chests, opened one at a time'}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
                    <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-red-900/20 backdrop-blur-md border border-red-500/30 text-red-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-2xl">
                      Legendary Artifact
                    </div>
                    <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-yellow-900/20 backdrop-blur-md border border-yellow-500/30 text-yellow-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-2xl">
                      +100 Gold
                    </div>
                  </div>
                </div>
              </motion.button>
            </div>
          ) : (
            /* Normal Levels - Show Gold or Chest */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              {/* Gold Option */}
              <motion.button
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSelectGold}
                className="group relative bg-slate-900/60 backdrop-blur-xl border-2 border-yellow-600/30 hover:border-yellow-500 p-12 transition-all duration-300 rounded-[3rem] overflow-hidden shadow-2xl shadow-black/40"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex flex-col items-center gap-8 text-center">
                  <div className="p-6 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                    <Coins className="w-20 h-20 text-yellow-400 group-hover:rotate-12 transition-transform" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-yellow-400 tracking-wider uppercase mb-2">
                      {goldAmount} Gold
                    </h3>
                    <p className="text-slate-400 text-sm italic opacity-80">
                      Standard spoils of war
                    </p>
                  </div>
                  <div className="px-6 py-2 bg-slate-800/80 border border-yellow-600/30 text-yellow-300/80 text-[10px] font-bold uppercase tracking-[0.3em] rounded-xl backdrop-blur-sm">
                    Guaranteed Reward
                  </div>
                </div>
              </motion.button>

              {/* Chest Option */}
              <motion.button
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSelectChest}
                className="group relative bg-slate-900/60 backdrop-blur-xl border-2 border-purple-600/30 hover:border-purple-500 p-12 transition-all duration-300 rounded-[3rem] overflow-hidden shadow-2xl shadow-black/40"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex flex-col items-center gap-8 text-center">
                  <div className="p-6 bg-purple-500/10 rounded-full border border-purple-500/20">
                    <Gift className="w-20 h-20 text-purple-400 group-hover:-rotate-12 transition-transform" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-purple-400 tracking-wider uppercase mb-2">
                      Mystery Chest
                    </h3>
                    <p className="text-slate-400 text-sm italic opacity-80">
                      Tempt the fates with a chest
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <div className="px-2 py-1.5 bg-slate-800/80 border border-slate-600/30 text-slate-400 text-[9px] font-bold uppercase tracking-widest rounded-lg">
                      Common
                    </div>
                    <div className="px-2 py-1.5 bg-blue-900/20 border border-blue-500/30 text-blue-400 text-[9px] font-bold uppercase tracking-widest rounded-lg">
                      Rare
                    </div>
                    <div className="px-2 py-1.5 bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 text-[9px] font-bold uppercase tracking-widest rounded-lg">
                      Legend
                    </div>
                  </div>
                </div>
              </motion.button>
            </div>
          )
        ) : (
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {selectedReward === 'gold' ? (
                /* Gold Selected Animation */
                <motion.div
                  key="gold-reward"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  className="bg-slate-900/60 backdrop-blur-xl border-2 border-yellow-600/30 p-16 rounded-[4rem] text-center shadow-2xl relative"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.05),transparent)]" />
                  <motion.div
                    animate={{
                      rotateY: [0, 360],
                    }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    className="relative z-10"
                  >
                    <Coins className="w-32 h-32 text-yellow-400 mx-auto mb-8 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]" />
                  </motion.div>
                  <h3 className="text-5xl font-black text-yellow-400 tracking-wider uppercase mb-4 relative z-10">
                    +{goldAmount} Gold!
                  </h3>
                  <p className="text-slate-400 text-lg tracking-widest uppercase opacity-70 relative z-10">Preparing next stage...</p>
                </motion.div>
              ) : (isRevealing) ? (
                <motion.div
                  key="revealing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-slate-900/60 backdrop-blur-xl border-2 border-slate-700/50 p-16 rounded-[4rem] text-center shadow-2xl"
                >
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                  >
                    <Gift className="w-32 h-32 text-indigo-400 mx-auto mb-8 opacity-50" />
                  </motion.div>
                  <h3 className="text-2xl text-slate-100 tracking-[0.3em] uppercase mb-4">
                    Opening Loot...
                  </h3>
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-yellow-400 mx-auto" />
                  </motion.div>
                </motion.div>
              ) : revealedLoot ? (
                <motion.div
                  key="revealed"
                  initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="text-center relative"
                >
                  <div className={`p-12 bg-slate-900/80 backdrop-blur-2xl border-2 rounded-[4rem] shadow-2xl ${getRarityColor(revealedLoot.rarity)}`}>
                    <motion.div
                      animate={{
                        y: [-10, 10, -10],
                        rotate: [-5, 5, -5]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className={`inline-block p-10 bg-slate-800/50 rounded-[2.5rem] border ${getRarityColor(revealedLoot.rarity)} mb-8 shadow-inner`}
                    >
                      {revealedLoot.id === 'boss_bonus_gold' ? (
                        <Coins className="w-24 h-24" />
                      ) : (
                        <Star className="w-24 h-24" />
                      )}
                    </motion.div>

                    <div className="space-y-4 mb-10">
                      <div className={`inline-block px-6 py-2 border rounded-2xl ${getRarityColor(revealedLoot.rarity)} ${getRarityBg(revealedLoot.rarity)}`}>
                        <p className="text-xs font-black uppercase tracking-[0.3em]">
                          {revealedLoot.rarity === 'legendary' ? '✨ Legendary Artifact ✨' : revealedLoot.rarity}
                        </p>
                      </div>
                      <h3 className={`text-5xl font-black tracking-tighter uppercase ${getRarityColor(revealedLoot.rarity)}`}>
                        {revealedLoot.name}
                      </h3>
                      <p className="text-slate-300 text-lg max-w-md mx-auto leading-relaxed italic opacity-80">
                        "{revealedLoot.description}"
                      </p>
                      {selectedReward === 'boss_chest' && bossLoots.length > 1 && (
                        <p className="text-xs text-slate-400 uppercase tracking-[0.25em]">
                          Boss Chest {bossLootIndex + 1} / {bossLoots.length}
                        </p>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,0,0,0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClaimLoot}
                      disabled={hasClaimed || isRevealing}
                      className={`px-12 py-4 text-slate-100 font-black text-lg border-2 transition-all uppercase tracking-widest rounded-3xl ${hasClaimed || isRevealing ? 'opacity-60 cursor-not-allowed' : ''} ${selectedReward === 'boss_chest' && bossLootIndex < bossLoots.length - 1 ? 'animate-pulse' : ''} ${revealedLoot.rarity === 'legendary'
                        ? 'bg-yellow-600 hover:bg-yellow-500 border-yellow-400 shadow-yellow-500/20'
                        : revealedLoot.rarity === 'rare'
                          ? 'bg-blue-600 hover:bg-blue-500 border-blue-400 shadow-blue-500/20'
                          : 'bg-slate-700 hover:bg-slate-600 border-slate-500 shadow-slate-500/20'
                        }`}
                    >
                      {selectedReward === 'boss_chest' && bossLootIndex < bossLoots.length - 1 ? 'Open Next Chest' : 'Claim Loot'}
                    </motion.button>
                    {selectedReward === 'boss_chest' && bossLootIndex < bossLoots.length - 1 && (
                      <p className="mt-3 text-xs text-slate-400 uppercase tracking-[0.25em]">
                        Next chest ready
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )}

        {/* History Toggle */}
        <div className="w-full flex flex-col items-center mt-12">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-slate-500 hover:text-slate-300 text-[10px] font-black uppercase tracking-widest mb-4 transition-colors"
          >
            {showHistory ? 'Hide Combat Log' : 'View Combat Log History'}
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full overflow-hidden"
              >
                <div className="bg-slate-950/50 border border-slate-700/30 rounded-2xl p-4 max-h-40 overflow-y-auto custom-scrollbar">
                  {combatLog.slice().reverse().map((log, i) => (
                    <p key={i} className="text-[10px] text-slate-400 mb-1 font-medium leading-relaxed border-l border-slate-700/30 pl-3">
                      {log}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
