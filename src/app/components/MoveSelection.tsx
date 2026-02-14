import { Zap, Shield, Flame, Droplet, Sparkles, Swords, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

export interface Move {
  id: string;
  name: string;
  description: string;
  type: 'attack' | 'buff' | 'debuff';
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
}

interface MoveSelectionProps {
  moves: Move[];
  onSelectMove: (move: Move) => void;
  onClose: () => void;
  currentResource: number;
  resourceType: 'Mana' | 'Energy' | 'Bullets';
  activeCooldowns: Record<string, number>;
  classId: string;
  disabledMoveId?: string | null;
}

const CLASS_SYMBOLS: Record<string, string> = {
  warrior: '⚔️',
  mage: '✦',
  rogue: '🗡️',
  paladin: '✝',
  gunslinger: '🔫',
};

export function MoveSelection({ moves, onSelectMove, onClose, currentResource, resourceType, activeCooldowns, classId, disabledMoveId }: MoveSelectionProps) {
  const [hoveredMove, setHoveredMove] = useState<Move | null>(null);
  const classSymbol = CLASS_SYMBOLS[classId] || '⚔️';

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-t from-slate-950 via-slate-900/95 to-slate-900/80 backdrop-blur-md border-t border-slate-700/40 p-4 sm:p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Move List */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-lg sm:text-xl text-slate-100 tracking-wider uppercase">
                Choose Your Move
              </h3>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700/80 text-slate-100 border border-slate-600/50 rounded-xl backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm tracking-wide uppercase">Back</span>
              </button>
            </div>

            {/* Moves Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {moves.map((move, index) => {
                const Icon = move.icon;
                const cooldownRemaining = activeCooldowns[move.id] || 0;
                const onCooldown = cooldownRemaining > 0;
                const canAfford = currentResource >= move.cost;
                const isDisabled = disabledMoveId === move.id;
                const canUse = canAfford && !onCooldown && !isDisabled;

                const borderColor =
                  move.type === 'attack' ? 'border-red-600' :
                    move.type === 'buff' ? 'border-blue-600' :
                      'border-purple-600';

                const bgColor =
                  move.type === 'attack' ? 'bg-red-900/30 hover:bg-red-900/50' :
                    move.type === 'buff' ? 'bg-blue-900/30 hover:bg-blue-900/50' :
                      'bg-purple-900/30 hover:bg-purple-900/50';

                return (
                  <motion.button
                    key={move.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={canUse ? { scale: 1.03, y: -3 } : {}}
                    whileTap={canUse ? { scale: 0.98 } : {}}
                    onClick={() => canUse && onSelectMove(move)}
                    onMouseEnter={() => setHoveredMove(move)}
                    onMouseLeave={() => setHoveredMove(null)}
                    disabled={!canUse}
                    className={`group p-3 border ${borderColor} text-left transition-all duration-200 relative min-h-[100px] sm:min-h-[120px] flex flex-col overflow-hidden rounded-xl ${canUse
                      ? `${bgColor} hover:border-opacity-100 shadow-lg shadow-black/10`
                      : 'bg-slate-900/50 opacity-50 cursor-not-allowed'
                      }`}
                  >
                    {/* Class Symbol Background */}
                    <div className="absolute -right-2 -bottom-2 text-6xl opacity-[0.07] pointer-events-none select-none leading-none">
                      {classSymbol}
                    </div>
                    {onCooldown && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-orange-900/80 border border-orange-600/50 rounded-lg text-orange-300 text-xs font-bold">
                        {cooldownRemaining}
                      </div>
                    )}
                    {isDisabled && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-slate-900/80 border border-slate-600/50 rounded-lg text-slate-300 text-xs font-bold">
                        Disabled
                      </div>
                    )}
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-5 h-5 text-slate-100" />
                        <h4 className="text-sm sm:text-base text-slate-100 tracking-wide uppercase">
                          {move.name}
                        </h4>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs flex-wrap mt-auto">
                      {move.baseDamage !== undefined && (
                        <span className="px-2 py-1 bg-red-950/80 text-red-400 border border-red-800/50 rounded-md">
                          {move.baseDamage} DMG
                        </span>
                      )}
                      {move.defenseBoost !== undefined && (
                        <span className="px-2 py-1 bg-blue-950/80 text-blue-400 border border-blue-800/50 rounded-md">
                          +{move.defenseBoost} DEF
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded border ${canAfford
                        ? 'bg-purple-950 text-purple-400 border-purple-800'
                        : 'bg-slate-900 text-slate-600 border-slate-800'
                        }`}>
                        {move.cost} {resourceType}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: Move Details */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 h-fit lg:sticky lg:top-0 shadow-xl shadow-black/20 max-h-[40vh] lg:max-h-none overflow-auto">
            <h4 className="text-sm text-slate-400 tracking-wider uppercase mb-3">Move Details</h4>
            <div className="min-h-[300px]">
              {hoveredMove ? (
                <div className="space-y-3">
                  <div>
                    <h5 className="text-lg text-slate-100 tracking-wide uppercase mb-1">
                      {hoveredMove.name}
                    </h5>
                    <p className="text-sm text-slate-400 mb-3">
                      {hoveredMove.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm border-t border-slate-700 pt-3">
                    {hoveredMove.baseDamage !== undefined && (
                      <div>
                        <p className="text-slate-500 text-xs uppercase mb-1">Damage Calculation</p>
                        <p className="text-slate-300">
                          Base: <span className="text-red-400">{hoveredMove.baseDamage}</span>
                        </p>
                        <p className="text-slate-400 text-xs">
                          + (Attack × 0.1) - (Enemy Defense × 0.1)
                        </p>
                      </div>
                    )}

                    {hoveredMove.defenseBoost !== undefined && (
                      <div>
                        <p className="text-slate-500 text-xs uppercase mb-1">Defense Boost</p>
                        <p className="text-slate-300">
                          Increases defense by <span className="text-blue-400">+{hoveredMove.defenseBoost}</span>
                        </p>
                        <p className="text-slate-400 text-xs">
                          Flat defense increase for this battle
                        </p>
                      </div>
                    )}

                    <div className="border-t border-slate-700 pt-2 space-y-1">
                      <p className="text-slate-300">
                        Cost: <span className="text-purple-400">{hoveredMove.cost}</span> {resourceType}
                      </p>
                      {hoveredMove.cooldown > 0 && (
                        <p className="text-slate-300">
                          Cooldown: <span className="text-orange-400">{hoveredMove.cooldown}</span> turn{hoveredMove.cooldown > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">
                  Hover over a move to see detailed information
                </p>
              )}
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
