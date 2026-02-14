import { Flame, Wind, Sparkles, Skull, X, Coins, Zap, Shield, Sword, Heart } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Move } from './MoveSelection';

// Special moves available for purchase
export const SPECIAL_MOVES: Record<string, Move> = {
  // Stage 1 Moves
  warrior_whirlwind: {
    id: 'whirlwind',
    name: 'Whirlwind',
    description: 'A devastating spinning attack that hits ALL enemies',
    type: 'attack',
    baseDamage: 35,
    cost: 45,
    cooldown: 4,
    icon: Wind,
  },
  mage_chain_lightning: {
    id: 'chain_lightning',
    name: 'Chain Lightning',
    description: 'Call down lightning on ALL enemies! Guaranteed Stun.',
    type: 'attack',
    baseDamage: 50,
    cost: 100,
    cooldown: 5,
    isAOE: true,
    stunChance: 100,
    icon: Sparkles,
  },
  rogue_lethal_execution: {
    id: 'lethal_execution',
    name: 'Lethal Execution',
    description: 'A deadly strike that scales with enemy HP (+20% of target\'s current HP as bonus damage)',
    type: 'attack',
    baseDamage: 30,
    cost: 45,
    cooldown: 4,
    icon: Skull,
  },
  paladin_holy_wrath: {
    id: 'holy_wrath',
    name: 'Holy Wrath',
    description: 'Smite your foe with divine power, dealing 30 damage and healing yourself for 15 HP',
    type: 'attack',
    baseDamage: 30,
    cost: 50,
    cooldown: 4,
    icon: Flame,
  },
  gunslinger_bullet_storm: {
    id: 'bullet_storm',
    name: 'Bullet Storm',
    description: 'Fire 3-8 bullets randomly at all enemies (1 Ammo/Shot).',
    type: 'attack',
    baseDamage: 14,
    cost: 8,
    cooldown: 5,
    icon: Sparkles,
  },
  // Stage 2 Moves
  warrior_strengthen: {
    id: 'strengthen',
    name: 'Strengthen',
    description: 'A powerful surge of energy that permanently grants +8 Attack and +8 Defense for this run',
    type: 'buff',
    cost: 30,
    cooldown: 2,
    icon: Sword,
    defenseBoost: 10, // Used for display, logic handled in Game.tsx
  },
  mage_smite: {
    id: 'smite',
    name: 'Smite',
    description: 'Divine punishment that deals 60% of the target\'s MAX HP as flat damage. Cannot crit.',
    type: 'attack',
    baseDamage: 0,
    cost: 60,
    cooldown: 10,
    icon: Zap,
  },
  rogue_stealth_kick: {
    id: 'stealth_kick',
    name: 'Stealth Kick',
    description: 'A swift kick dealing 45 damage with a 25% chance to grant an immediate extra turn',
    type: 'attack',
    baseDamage: 45,
    cost: 45,
    cooldown: 4,
    icon: Zap,
  },
  paladin_holy_healing: {
    id: 'holy_healing',
    name: 'Holy Healing',
    description: 'Call upon divine grace to instantly restore 50% of your maximum health',
    type: 'buff',
    cost: 35,
    cooldown: 3,
    icon: Heart,
  },
  gunslinger_quick_draw: {
    id: 'quick_draw',
    name: 'Quick Draw',
    description: 'A lightning-fast shot dealing 15 damage that stuns the enemy and skips their turn',
    type: 'attack',
    baseDamage: 15,
    cost: 1,
    cooldown: 3,
    icon: Zap,
    stunChance: 100,
  },
  // Stage 3 Moves
  warrior_carnage: {
    id: 'carnage',
    name: 'Carnage',
    description: 'A brutal strike dealing 80 damage',
    type: 'attack',
    baseDamage: 80,
    cost: 60,
    cooldown: 8,
    icon: Sword,
  },
  mage_channeling: {
    id: 'channeling',
    name: 'Channeling',
    description: 'Take a turn off with 50% damage reduction. Your next attack deals 100% more damage.',
    type: 'buff',
    cost: 0,
    cooldown: 6,
    icon: Sparkles,
  },
  rogue_pathfinder: {
    id: 'pathfinder',
    name: 'Pathfinder',
    description: 'Deals 40 damage to ALL enemies. Gain 5 Shield for each enemy killed by this move.',
    type: 'attack',
    baseDamage: 40,
    cost: 35,
    cooldown: 5,
    isAOE: true,
    icon: Wind,
  },
  paladin_groundbreak: {
    id: 'groundbreak',
    name: 'Groundbreak',
    description: 'Slams the ground to deal 65 damage to ALL enemies and heals you for 25 HP.',
    type: 'attack',
    baseDamage: 65,
    cost: 50,
    cooldown: 8,
    isAOE: true,
    icon: Shield,
  },
  gunslinger_standoff: {
    id: 'standoff',
    name: 'Standoff',
    description: 'Deals 20 damage. The target hesitates, skipping their next attack, with a 20% chance to skip their following turn too.',
    type: 'attack',
    baseDamage: 20,
    cost: 1,
    cooldown: 5,
    icon: Zap,
  },
};

const STAGE_ONE_MOVE_IDS = new Set([
  'whirlwind',
  'chain_lightning',
  'lethal_execution',
  'holy_wrath',
  'bullet_storm',
]);

const CLASS_STAGE_MOVES: Record<string, { stage: number; key: string }[]> = {
  warrior: [
    { stage: 1, key: 'warrior_whirlwind' },
    { stage: 2, key: 'warrior_strengthen' },
    { stage: 3, key: 'warrior_carnage' },
  ],
  mage: [
    { stage: 1, key: 'mage_chain_lightning' },
    { stage: 2, key: 'mage_smite' },
    { stage: 3, key: 'mage_channeling' },
  ],
  rogue: [
    { stage: 1, key: 'rogue_lethal_execution' },
    { stage: 2, key: 'rogue_stealth_kick' },
    { stage: 3, key: 'rogue_pathfinder' },
  ],
  paladin: [
    { stage: 1, key: 'paladin_holy_wrath' },
    { stage: 2, key: 'paladin_holy_healing' },
    { stage: 3, key: 'paladin_groundbreak' },
  ],
  gunslinger: [
    { stage: 1, key: 'gunslinger_bullet_storm' },
    { stage: 2, key: 'gunslinger_quick_draw' },
    { stage: 3, key: 'gunslinger_standoff' },
  ],
};

const SPECIAL_MOVE_PRICE_OVERRIDES: Record<string, number> = {
  chain_lightning: 100,
  smite: 60,
};

export const getSpecialMovePrice = (moveId: string) => (
  SPECIAL_MOVE_PRICE_OVERRIDES[moveId] ?? (STAGE_ONE_MOVE_IDS.has(moveId) ? 60 : 100)
);

interface MoveShopProps {
  characterClass: string;
  currentMoves: Move[];
  ownedSpecialMoves: string[];
  gold: number;
  currentStage: number;
  onPurchaseMove: (moveId: string, replaceIndex: number) => void;
  onClose: () => void;
}

export function MoveShop({
  characterClass,
  currentMoves,
  ownedSpecialMoves,
  gold,
  currentStage,
  onPurchaseMove,
  onClose,
}: MoveShopProps) {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [selectingReplacement, setSelectingReplacement] = useState(false);

  const classKey = characterClass.toLowerCase();
  const availableMoves = (CLASS_STAGE_MOVES[classKey] || [])
    .filter(entry => entry.stage <= currentStage)
    .map(entry => {
      const move = SPECIAL_MOVES[entry.key];
      return move ? { ...move, stage: entry.stage } : null;
    })
    .filter((move): move is Move & { stage: number } => Boolean(move));

  const handleBuyMove = (move: Move) => {
    const movePrice = getSpecialMovePrice(move.id);
    if (gold < movePrice) return;
    setSelectedMove(move);
    setSelectingReplacement(true);
  };

  const handleReplaceMove = (index: number) => {
    if (!selectedMove) return;
    onPurchaseMove(selectedMove.id, index);
    setSelectingReplacement(false);
    setSelectedMove(null);
  };

  if (availableMoves.length === 0) return (
    <div className="p-8 text-center text-slate-500 italic">
      No special training available for your class yet...
    </div>
  );

  return (
    <>
      {/* Replacement Modal */}
      <AnimatePresence>
        {selectingReplacement && selectedMove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-[100]"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-2xl w-full bg-slate-900/80 border border-yellow-500/30 p-8 rounded-3xl shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none rounded-3xl" />

              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <Zap className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100 tracking-wider uppercase">
                    Choose Move to Replace
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectingReplacement(false);
                    setSelectedMove(null);
                  }}
                  className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center mb-8">
                <p className="text-slate-400 mb-2">You are learning:</p>
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                  {selectedMove.icon && <selectedMove.icon className="w-4 h-4 text-yellow-400" />}
                  <span className="text-yellow-400 font-bold uppercase tracking-widest">{selectedMove.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentMoves.map((move, index) => {
                  const MoveIcon = move.icon || Shield;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReplaceMove(index)}
                      className="group p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-left transition-all relative overflow-hidden"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-700 text-slate-300 group-hover:text-red-400 transition-colors">
                          <MoveIcon className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-100 tracking-wide uppercase">
                          {move.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-4 line-clamp-2 leading-relaxed">{move.description}</p>
                      <div className="flex gap-2">
                        {move.baseDamage && (
                          <span className="px-2 py-0.5 bg-red-900/30 text-red-400 border border-red-900/30 text-[10px] rounded-lg">
                            {move.baseDamage} DMG
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-purple-900/30 text-purple-400 border border-purple-900/30 text-[10px] rounded-lg">
                          {move.cost} {characterClass === 'mage' ? 'Mana' : 'Energy'}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Replace</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <p className="text-slate-500 text-[10px] text-center mt-8 uppercase tracking-[0.2em] font-medium">
                Training complete? Leave without replacement is not possible.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Shop Card */}
      <div className="p-6 bg-slate-900/40 border border-yellow-500/20 rounded-3xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Sword className="w-5 h-5 text-yellow-500/70" />
            <h3 className="text-sm font-bold text-yellow-500/80 tracking-[0.3em] uppercase">
              Elite Training
            </h3>
          </div>
          <div className="space-y-6">
            {availableMoves.map(move => {
              const movePrice = getSpecialMovePrice(move.id);
              const canAfford = gold >= movePrice;
              const alreadyOwned = ownedSpecialMoves.includes(move.id);
              const alreadyEquipped = currentMoves.some(existing => existing.id === move.id);
              const Icon = move.icon || Sword;

              return (
                <div
                  key={move.id}
                  className={`p-6 rounded-2xl border transition-all duration-500 ${alreadyEquipped
                    ? 'bg-green-500/5 border-green-500/30'
                    : canAfford
                      ? 'bg-slate-800/40 border-slate-700/50 group-hover:border-yellow-500/40 shadow-inner'
                      : 'bg-slate-900/20 border-slate-800 opacity-60'
                    }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      className="w-24 h-24 bg-slate-950/80 border-2 border-yellow-500/40 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl relative group-hover:border-yellow-400 transition-colors"
                    >
                      <div className="absolute inset-0 bg-yellow-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Icon className="w-12 h-12 text-yellow-400 relative z-10" />
                    </motion.div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-2xl font-bold text-slate-100 tracking-wide uppercase">
                            {move.name}
                          </h4>
                          {alreadyEquipped && (
                            <span className="px-2 py-1 bg-green-500/20 border border-green-500/40 text-green-400 text-[10px] font-bold uppercase rounded-lg">
                              Equipped
                            </span>
                          )}
                          {!alreadyEquipped && alreadyOwned && (
                            <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase rounded-lg">
                              Learned
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                          {move.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {move.baseDamage && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-900/20 border border-red-500/20 rounded-xl">
                            <Sword className="w-3 h-3 text-red-500" />
                            <span className="text-red-300 text-xs font-mono">{move.baseDamage} Damage</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/20 border border-purple-500/20 rounded-xl">
                          <Zap className="w-3 h-3 text-purple-500" />
                          <span className="text-purple-300 text-xs font-mono">{move.cost} {characterClass === 'mage' ? 'Mana' : 'Energy'}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/20 border border-blue-500/20 rounded-xl">
                          <Sparkles className="w-3 h-3 text-blue-500" />
                          <span className="text-blue-300 text-xs font-mono">{move.cooldown} Turns</span>
                        </div>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Coins className="w-6 h-6 text-yellow-500" />
                          </div>
                          <span className={`text-2xl font-bold ${canAfford ? 'text-yellow-400' : 'text-slate-600'}`}>
                            {movePrice} <span className="text-xs text-slate-500 ml-1">Gold</span>
                          </span>
                        </div>

                        <motion.button
                          whileHover={!alreadyEquipped && canAfford ? { scale: 1.05, x: 5 } : {}}
                          whileTap={!alreadyEquipped && canAfford ? { scale: 0.95 } : {}}
                          onClick={() => !alreadyEquipped && handleBuyMove(move)}
                          disabled={alreadyEquipped || !canAfford}
                          className={`px-8 py-3 rounded-2xl font-bold tracking-widest uppercase text-sm transition-all duration-300 flex items-center gap-3 ${alreadyEquipped
                            ? 'bg-green-900/40 text-green-400 border border-green-500/30 cursor-default'
                            : canAfford
                              ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-slate-900 shadow-lg shadow-yellow-900/20'
                              : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed opacity-50'
                            }`}
                        >
                          {alreadyEquipped ? (
                            <>
                              <Shield className="w-4 h-4" />
                              Equipped
                            </>
                          ) : canAfford ? (
                            <>
                              <Zap className="w-4 h-4" />
                              {alreadyOwned ? 'Retrain' : 'Commence Training'}
                            </>
                          ) : (
                            'Inadequate Funds'
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
