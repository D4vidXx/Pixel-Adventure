import { Zap, Shield, Flame, Droplet, Sparkles, Swords, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

export interface Move {
  id: string;
  name: string;
  description: string;
  type: 'attack' | 'buff' | 'debuff' | 'utility';
  baseDamage?: number;
  defenseBoost?: number;
  cost: number;
  cooldown: number;
  icon: typeof Zap;
  scalesWithSpeed?: boolean; // For moves that scale with speed stat
  appliesPoison?: boolean; // For moves that apply poison status
  poisonDuration?: number; // How many turns the poison lasts
  isAOE?: boolean; // Hits all enemies
  stunChance?: number; // Percent chance to stun each enemy hit
  burnChance?: number; // Percent chance to burn target
  burnDuration?: number; // How many turns burn lasts
  weaknessTurns?: number; // How many turns weakness lasts
  randomEffectChance?: number; // Percent chance to apply a random effect
  critDamageMultiplier?: number; // Multiplier for critical damage (e.g., x4)
  damageOverTurns?: number; // Number of turns to spread damage over
  maxUsesPerTurn?: number; // Maximum number of times this move can be used in a single turn
}

interface MoveSelectionProps {
  moves: Move[];
  onSelectMove: (move: Move) => void;
  onClose: () => void;
  currentResource: number;
  resourceType: 'Mana' | 'Energy' | 'Bullets' | 'Stamina';
  activeCooldowns: Record<string, number>;
  classId: string;
  disabledMoveId?: string | null;
  moveUsesThisTurn?: Record<string, number>;
  brunoComboMeter?: number;
}

const CLASS_SYMBOLS: Record<string, string> = {
  warrior: '⚔️',
  mage: '✦',
  rogue: '🗡️',
  paladin: '✝',
  gunslinger: '🔫',
};

export function MoveSelection({ moves, onSelectMove, onClose, currentResource, resourceType, activeCooldowns, classId, disabledMoveId, moveUsesThisTurn, brunoComboMeter }: MoveSelectionProps) {
  const [hoveredMove, setHoveredMove] = useState<Move | null>(null);
  const classSymbol = CLASS_SYMBOLS[classId] || '⚔️';

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-t from-slate-950 via-slate-900/95 to-slate-900/80 backdrop-blur-md border-t border-slate-700/40 p-4 sm:p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Move List */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-lg sm:text-xl text-slate-100 tracking-wider uppercase font-black">
                Choose Your Move
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800/40 hover:bg-slate-700/60 text-slate-300 border border-slate-700/50 rounded-lg hover:text-white transition-all flex items-center gap-2 uppercase tracking-wide text-xs font-bold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).endPlayerTurn) {
                      (window as any).endPlayerTurn();
                    }
                  }}
                  className="px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 font-bold rounded-lg transition-all text-xs tracking-widest uppercase flex items-center gap-2"
                >
                  <span>{classId === 'brawler' ? 'End Turn' : 'Skip Turn'}</span>
                </button>
              </div>
            </div>

            {/* Moves Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {moves.map((move, index) => {
                const Icon = move.icon;
                const cooldownRemaining = activeCooldowns[move.id] || 0;
                const onCooldown = cooldownRemaining > 0;

                const usesThisTurn = moveUsesThisTurn?.[move.id] || 0;
                const hitMaxUses = move.maxUsesPerTurn !== undefined && usesThisTurn >= move.maxUsesPerTurn;
                const brawlerFreeMove = classId === 'brawler' && (brunoComboMeter || 0) >= 3;

                const canAfford = currentResource >= move.cost || brawlerFreeMove;
                const isDisabled = disabledMoveId === move.id || (!brawlerFreeMove && hitMaxUses);
                const canUse = (canAfford && !onCooldown && !isDisabled);

                let borderColor = 'border-slate-700';
                let bgColor = 'bg-slate-900/40';
                let iconColor = 'text-slate-400';
                let glowColor = 'bg-slate-500/0';

                if (move.type === 'attack') {
                  borderColor = canUse ? 'border-red-500/30' : 'border-red-900/20';
                  bgColor = canUse ? 'bg-red-950/20' : 'bg-slate-900/40';
                  iconColor = canUse ? 'text-red-400' : 'text-slate-600';
                  glowColor = 'group-hover:bg-red-500/10';
                } else if (move.type === 'buff') {
                  borderColor = canUse ? 'border-blue-500/30' : 'border-blue-900/20';
                  bgColor = canUse ? 'bg-blue-950/20' : 'bg-slate-900/40';
                  iconColor = canUse ? 'text-blue-400' : 'text-slate-600';
                  glowColor = 'group-hover:bg-blue-500/10';
                } else if (move.type === 'utility') {
                  borderColor = canUse ? 'border-yellow-500/30' : 'border-yellow-900/20';
                  bgColor = canUse ? 'bg-yellow-950/20' : 'bg-slate-900/40';
                  iconColor = canUse ? 'text-yellow-400' : 'text-slate-600';
                  glowColor = 'group-hover:bg-yellow-500/10';
                } else {
                  borderColor = canUse ? 'border-purple-500/30' : 'border-purple-900/20';
                  bgColor = canUse ? 'bg-purple-950/20' : 'bg-slate-900/40';
                  iconColor = canUse ? 'text-purple-400' : 'text-slate-600';
                  glowColor = 'group-hover:bg-purple-500/10';
                }

                return (
                  <motion.button
                    key={move.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={canUse ? { scale: 1.02, y: -2 } : {}}
                    whileTap={canUse ? { scale: 0.98 } : {}}
                    onClick={() => canUse && onSelectMove(move)}
                    onMouseEnter={() => setHoveredMove(move)}
                    onMouseLeave={() => setHoveredMove(null)}
                    disabled={!canUse}
                    className={`group relative p-4 bg-slate-900/40 backdrop-blur-sm border rounded-2xl text-left transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[120px] ${borderColor} ${bgColor} ${canUse ? 'cursor-pointer hover:border-opacity-80 hover:shadow-lg hover:shadow-black/20' : 'opacity-50 cursor-not-allowed grayscale-[0.5]'}`}
                  >
                    {/* Hover Glow */}
                    <div className={`absolute inset-0 transition-colors duration-300 ${glowColor}`} />

                    {/* Scanline */}
                    {canUse && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                    )}

                    {/* Class Symbol Background */}
                    <div className="absolute -right-2 -bottom-4 text-7xl opacity-[0.03] pointer-events-none select-none leading-none font-serif">
                      {classSymbol}
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg bg-black/20 ${canUse ? '' : 'opacity-50'}`}>
                          <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold uppercase tracking-wider ${canUse ? 'text-slate-200' : 'text-slate-500'}`}>
                            {move.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono uppercase">
                            {move.type}
                          </span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-col items-end gap-1">
                        {onCooldown && (
                          <span className="px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded text-[10px] uppercase font-bold text-orange-400">
                            CD: {cooldownRemaining}
                          </span>
                        )}
                        {move.maxUsesPerTurn !== undefined && (
                          <span className="px-1.5 py-0.5 bg-cyan-900/40 border border-cyan-500/20 rounded text-[10px] uppercase font-bold text-cyan-400">
                            {usesThisTurn}/{move.maxUsesPerTurn} Uses
                          </span>
                        )}
                        {isDisabled && hitMaxUses && !brawlerFreeMove && (
                          <span className="px-1.5 py-0.5 bg-red-900/40 border border-red-500/20 rounded text-[10px] uppercase font-bold text-red-400">
                            Max Uses
                          </span>
                        )}
                        {isDisabled && (!hitMaxUses || brawlerFreeMove) && (
                          <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-[10px] uppercase font-bold text-slate-400">
                            Disabled
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="flex gap-2 relative z-10 mt-2">
                      {move.baseDamage !== undefined && (
                        <span className="px-2 py-1 bg-black/20 text-slate-300 border border-white/5 rounded text-xs font-mono">
                          <span className="text-red-400 font-bold">{move.baseDamage}</span> DMG
                        </span>
                      )}
                      {move.defenseBoost !== undefined && (
                        <span className="px-2 py-1 bg-black/20 text-slate-300 border border-white/5 rounded text-xs font-mono">
                          <span className="text-blue-400 font-bold">+{move.defenseBoost}</span> DEF
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-mono font-bold border ${canAfford
                        ? (brawlerFreeMove && move.cost > 0) ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {brawlerFreeMove ? 0 : move.cost} {resourceType === 'Energy' ? 'EN' : resourceType === 'Stamina' ? 'SP' : resourceType === 'Mana' ? 'MP' : 'AP'}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: Move Details */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 h-fit lg:sticky lg:top-4 shadow-xl shadow-black/20">
              <h4 className="text-xs text-slate-500 tracking-widest uppercase mb-4 font-bold">Move Details</h4>
              <div className="min-h-[250px]">
                {hoveredMove ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div>
                      <h5 className="text-lg text-white tracking-wide uppercase font-black mb-1">
                        {hoveredMove.name}
                      </h5>
                      <p className="text-sm text-slate-400 leading-relaxed border-l-2 border-slate-700 pl-3">
                        {hoveredMove.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-800/50">
                      {hoveredMove.baseDamage !== undefined && (
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Damage Formula</p>
                          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                            <span className="text-red-400">{hoveredMove.baseDamage}</span> + (ATK × 0.1)
                          </div>
                        </div>
                      )}

                      {hoveredMove.defenseBoost !== undefined && (
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Effect</p>
                          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                            Gains <span className="text-blue-400">+{hoveredMove.defenseBoost}</span> Defense
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-950/30 p-2 rounded border border-slate-800">
                          <p className="text-[10px] text-slate-500 uppercase">Cost</p>
                          <p className="text-purple-300 font-bold">{hoveredMove.cost} {resourceType}</p>
                        </div>
                        <div className="bg-slate-950/30 p-2 rounded border border-slate-800">
                          <p className="text-[10px] text-slate-500 uppercase">Cooldown</p>
                          <p className="text-orange-300 font-bold">{hoveredMove.cooldown} Turns</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2 py-10 opacity-50">
                    <Sparkles className="w-8 h-8 mb-2" />
                    <p className="text-sm italic">Hover over a move to analyze</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Define movesets for each character class
export const MOVESETS: Record<string, Move[]> = {
  warrior: [
    {
      id: 'basic_attack',
      name: 'Basic Attack',
      description: 'A standard attack',
      type: 'attack',
      baseDamage: 20,
      cost: 0,
      cooldown: 0,
      icon: Swords,
    },
    {
      id: 'fortify',
      name: 'Fortify',
      description: 'Increase defense by 15',
      type: 'buff',
      defenseBoost: 15,
      cost: 40,
      cooldown: 6,
      icon: Shield,
    },
    {
      id: 'heavy_strike',
      name: 'Heavy Strike',
      description: 'A powerful crushing blow',
      type: 'attack',
      baseDamage: 35,
      cost: 40,
      cooldown: 3,
      icon: Swords,
    },
    {
      id: 'shield_bash',
      name: 'Shield Bash',
      description: 'Attack with your shield',
      type: 'attack',
      baseDamage: 25,
      cost: 30,
      cooldown: 2,
      icon: Shield,
    },
  ],
  mage: [
    {
      id: 'basic_attack',
      name: 'Basic Attack',
      description: 'A standard attack',
      type: 'attack',
      baseDamage: 20,
      cost: 0,
      cooldown: 0,
      icon: Zap,
    },
    {
      id: 'fortify',
      name: 'Fortify',
      description: 'Increase defense by 15',
      type: 'buff',
      defenseBoost: 15,
      cost: 40,
      cooldown: 6,
      icon: Shield,
    },
    {
      id: 'fireball',
      name: 'Fireball',
      description: 'Launch a devastating fireball',
      type: 'attack',
      baseDamage: 40,
      cost: 50,
      cooldown: 3,
      icon: Flame,
    },
    {
      id: 'magic_shield',
      name: 'Magic Shield',
      description: 'Increase defense by 20',
      type: 'buff',
      defenseBoost: 20,
      cost: 40,
      cooldown: 2,
      icon: Sparkles,
    },
  ],
  rogue: [
    {
      id: 'basic_attack',
      name: 'Basic Attack',
      description: 'A standard attack',
      type: 'attack',
      baseDamage: 20,
      cost: 0,
      cooldown: 0,
      icon: Zap,
    },
    {
      id: 'fortify',
      name: 'Fortify',
      description: 'Increase defense by 15',
      type: 'buff',
      defenseBoost: 15,
      cost: 40,
      cooldown: 6,
      icon: Shield,
    },
    {
      id: 'quick_strike',
      name: 'Quick Strike',
      description: 'A swift attack that scales with speed (+0.1 damage per speed)',
      type: 'attack',
      baseDamage: 28,
      cost: 50,
      cooldown: 5,
      icon: Zap,
      scalesWithSpeed: true,
    },
    {
      id: 'poison_strike',
      name: 'Poison Strike',
      description: 'Poisons target, dealing 5% max HP per turn for 2 turns',
      type: 'attack',
      baseDamage: 25,
      cost: 25,
      cooldown: 3,
      icon: Droplet,
      appliesPoison: true,
      poisonDuration: 2,
    },
  ],
  paladin: [
    {
      id: 'basic_attack',
      name: 'Basic Attack',
      description: 'A standard attack',
      type: 'attack',
      baseDamage: 20,
      cost: 0,
      cooldown: 0,
      icon: Zap,
    },
    {
      id: 'fortify',
      name: 'Fortify',
      description: 'Increase defense by 15',
      type: 'buff',
      defenseBoost: 15,
      cost: 40,
      cooldown: 6,
      icon: Shield,
    },
    {
      id: 'holy_strike',
      name: 'Holy Strike',
      description: 'Strike with divine power',
      type: 'attack',
      baseDamage: 32,
      cost: 35,
      cooldown: 2,
      icon: Sparkles,
    },
    {
      id: 'divine_shield',
      name: 'Divine Shield',
      description: 'Increase defense by 25',
      type: 'buff',
      defenseBoost: 25,
      cost: 45,
      cooldown: 3,
      icon: Shield,
    },
  ],
};
