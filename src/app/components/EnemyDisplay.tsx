import { Heart, Target, Sword, Shield, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Enemy, getEnemyEmoji } from './EnemyData';

interface EnemyDisplayProps {
  enemies: Array<Enemy & {
    currentHealth: number;
    shield: number;
    weaknessTurns: number;
    poisonTurns: number;
    stunTurns: number;
    burnTurns: number;
  }>;
  selectedTargetId: string | null;
  onSelectTarget: (enemyId: string) => void;
  bossChargeCount: number;
  bossChargeThreshold: number;
  bossAttackBonus: number;
  bossDefenseBonus: number;
  slashedEnemyIds?: Set<string>;
  hasRingOfPower?: boolean;
  lordInfernoPowerMeter?: number;
  robinHoodRageMeter?: number;
}

export function EnemyDisplay({ enemies, selectedTargetId, onSelectTarget, bossChargeCount, bossChargeThreshold, bossAttackBonus, bossDefenseBonus, slashedEnemyIds = new Set(), hasRingOfPower = false, lordInfernoPowerMeter = 0, robinHoodRageMeter = 0 }: EnemyDisplayProps) {
  const aliveEnemies = enemies.filter(e => e.currentHealth > 0);

  if (aliveEnemies.length === 0) {
    return (
      <div className="text-center text-slate-400 p-8">
        <p className="text-2xl mb-2">🎉</p>
        <p>All enemies defeated!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enemies Grid */}
      <div className={`grid gap-4 ${aliveEnemies.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : aliveEnemies.length === 2 ? 'grid-cols-2 max-w-2xl mx-auto' : 'grid-cols-3 max-w-4xl mx-auto'}`}>
        <AnimatePresence mode="popLayout">
          {aliveEnemies.map((enemy, index) => {
            const isSelected = selectedTargetId === enemy.id;
            const healthPercent = (enemy.currentHealth / enemy.maxHealth) * 100;
            const isBoss = enemy.type === 'BOSS';

            return (
              <motion.button
                key={enemy.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectTarget(enemy.id)}
                className={`group relative p-4 border rounded-2xl transition-all duration-300 text-left overflow-hidden flex flex-col ${isSelected
                  ? 'bg-red-950/30 border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.2)] backdrop-blur-md'
                  : 'bg-slate-900/40 border-slate-700/50 hover:border-slate-500/80 hover:bg-slate-900/60 backdrop-blur-sm'
                  }`}
              >
                {/* Selection Glow */}
                {isSelected && (
                  <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
                )}

                {/* Boss Badge */}
                {enemy.type === 'BOSS' && (
                  <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-transparent via-red-900/80 to-transparent h-6 flex items-center justify-center border-b border-red-500/30">
                    <span className="text-[10px] text-red-300 tracking-[0.2em] uppercase font-black drop-shadow-md">
                      ☠ Boss Encounter ☠
                    </span>
                  </div>
                )}

                {/* Target Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 z-20">
                    <Target className="w-5 h-5 text-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                  </div>
                )}

                {/* Enemy Visual */}
                <div className={`flex justify-center mb-4 ${enemy.type === 'BOSS' ? 'mt-6' : 'mt-2'}`}>
                  <motion.div
                    animate={isSelected ? {
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-24 h-24 border-2 ${isSelected ? 'border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'border-slate-700/50'} rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 relative overflow-hidden`}
                  >
                    {/* Background Glow */}
                    <div className={`absolute inset-0 ${isSelected ? 'bg-red-500/10' : 'bg-transparent'}`} />

                    <motion.div
                      animate={{
                        y: [0, -4, 0],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-5xl relative z-10 filter drop-shadow-xl"
                    >
                      {getEnemyEmoji(enemy.name)}
                    </motion.div>

                    {/* Organic Claw Mark Overlay */}
                    <AnimatePresence>
                      {slashedEnemyIds.has(enemy.id) && (
                        <motion.div
                          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              initial={{
                                scaleX: 0,
                                opacity: 0,
                                rotate: -45 + (i - 1) * 8, // Fan out slightly
                                y: -20 + i * 20,
                                x: -15 + i * 10
                              }}
                              animate={{
                                scaleX: [0, 1.5, 1.2],
                                opacity: [0, 1, 0.9],
                                x: [-15 + i * 10, 15 + i * 10]
                              }}
                              transition={{
                                duration: 0.22,
                                delay: i * 0.05,
                                ease: "circOut"
                              }}
                              className="absolute w-full flex items-center justify-center"
                              style={{ height: `${3 + i}px` }} // Varied thickness
                            >
                              {/* Main Red Swipe */}
                              <div
                                className="w-full h-full bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_15px_rgba(220,38,38,0.9)]"
                                style={{
                                  clipPath: 'polygon(0% 50%, 20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%)',
                                  filter: 'blur(0.5px)'
                                }}
                              />
                              {/* White-Hot Core */}
                              <div
                                className="absolute inset-0 bg-white/50"
                                style={{
                                  clipPath: 'polygon(10% 50%, 25% 20%, 75% 20%, 90% 50%, 75% 80%, 25% 80%)',
                                  filter: 'blur(1px)'
                                }}
                              />
                            </motion.div>
                          ))}

                          {/* Primal Impact Flash */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.2, 1.4] }}
                            transition={{ duration: 0.35 }}
                            className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Enemy Name */}
                <h4 className={`text-center text-sm tracking-wider uppercase font-black mb-3 ${isSelected ? 'text-red-100' : 'text-slate-200'}`}>
                  {enemy.name}
                </h4>

                {/* Health Bar */}
                <div className="space-y-1 mb-4 relative z-10 w-full px-2">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                    <div className="flex items-center gap-1 text-red-400">
                      <Heart className="w-3 h-3 fill-current" />
                      <span>HP</span>
                    </div>
                    <span className="text-slate-300 font-mono">
                      {enemy.currentHealth} <span className="text-slate-500">/ {enemy.maxHealth}</span>
                      {(enemy.shield || 0) > 0 && (
                        <span className="text-cyan-400 ml-1">(+{enemy.shield})</span>
                      )}
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative shadow-inner">
                    {/* Ring of Power Threshold Marker */}
                    {hasRingOfPower && enemy.type !== 'BOSS' && (
                      <div className="absolute left-0 bottom-0 h-full w-[10%] bg-red-900/50 border-r border-red-500/50 z-0">
                        {healthPercent <= 10 && (
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="w-full h-full bg-red-600/80"
                          />
                        )}
                      </div>
                    )}

                    <motion.div
                      initial={{ width: `${healthPercent}%` }}
                      animate={{ width: `${healthPercent}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`h-full relative z-10 shadow-[0_2px_5px_rgba(0,0,0,0.3)] ${healthPercent > 50 ? 'bg-gradient-to-r from-red-600 to-red-500' : healthPercent > 25 ? 'bg-gradient-to-r from-orange-600 to-orange-500' : 'bg-gradient-to-r from-yellow-600 to-yellow-500'
                        }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                    </motion.div>

                    {(enemy.shield || 0) > 0 && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(enemy.shield / enemy.maxHealth) * 100}%` }}
                        className="absolute top-0 left-0 h-full bg-cyan-500/50 z-20 backdrop-blur-[1px]"
                      />
                    )}
                  </div>
                </div>

                {/* Trait & Stats Container */}
                <div className="bg-slate-950/30 rounded-lg p-2 space-y-2 mb-2 w-full">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="flex items-center gap-1.5 border-r border-slate-800 pr-2">
                      <Sword className="w-3 h-3 text-orange-500" />
                      <span className="text-slate-400 font-bold">ATK</span>
                      <span className="text-slate-200 ml-auto font-mono">
                        {enemy.type === 'BOSS' ? enemy.attack + bossAttackBonus : enemy.attack}
                        {enemy.type === 'BOSS' && bossAttackBonus > 0 && (
                          <span className="text-orange-400 text-[9px]"> (+{bossAttackBonus})</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 pl-1">
                      <Shield className="w-3 h-3 text-blue-500" />
                      <span className="text-slate-400 font-bold">DEF</span>
                      <span className="text-slate-200 ml-auto font-mono">
                        {enemy.type === 'BOSS' ? enemy.defense + bossDefenseBonus : enemy.defense}
                        {enemy.type === 'BOSS' && bossDefenseBonus > 0 && (
                          <span className="text-blue-400 text-[9px]"> (+{bossDefenseBonus})</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Generic Trait UI */}
                {enemy.traitName && !['Lava Pebble', 'Lava Golem', 'Mother Golem', 'Lava Dragon', 'Lava Spider', 'Fire Lizard'].includes(enemy.name) && (
                  <div className="mb-2 w-full">
                    <div className="px-2 py-1 bg-emerald-950/30 border border-emerald-500/20 rounded text-center">
                      <p className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold">{enemy.traitName}</p>
                      <p className="text-[8px] text-emerald-200/60 leading-tight">{enemy.traitDescription}</p>
                    </div>
                  </div>
                )}

                {/* Specific Trait Displays */}
                {enemy.name === 'Lava Pebble' && (
                  <div className="mb-2 px-2 py-1 bg-orange-950/30 border border-orange-500/20 rounded text-center w-full">
                    <p className="text-[9px] text-orange-400 uppercase tracking-widest font-bold">Scorch</p>
                    <p className="text-[8px] text-orange-200/60 leading-tight">30% chance to burn on hit</p>
                  </div>
                )}
                {/* ... (Other traits can be similarly styled compact) ... */}

                {/* Status Effects Row */}
                <div className="mt-auto flex flex-wrap gap-1 justify-center w-full min-h-[20px]">
                  <AnimatePresence>
                    {enemy.weaknessTurns > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[9px] uppercase font-bold rounded flex items-center gap-1"
                      >
                        Startled {enemy.weaknessTurns}
                      </motion.span>
                    )}
                    {enemy.poisonTurns > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[9px] uppercase font-bold rounded flex items-center gap-1"
                      >
                        Poison {enemy.poisonTurns}
                      </motion.span>
                    )}
                    {enemy.stunTurns > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-[9px] uppercase font-bold rounded flex items-center gap-1"
                      >
                        Stun {enemy.stunTurns}
                      </motion.span>
                    )}
                    {enemy.burnTurns > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-300 text-[9px] uppercase font-bold rounded flex items-center gap-1"
                      >
                        Burn {enemy.burnTurns}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Boss Rage Meter (Lord Inferno / Goblin King) */}
                {enemy.type === 'BOSS' && (
                  <div className="mt-3 w-full border-t border-slate-800/50 pt-2">
                    {/* Simplified Rage Bar */}
                    {enemy.name === 'Robin Hood' ? (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold uppercase text-red-400">
                          <span>Rage</span>
                          <span>{robinHoodRageMeter}/5</span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className={`flex-1 ${i < robinHoodRageMeter ? 'bg-red-500' : 'bg-slate-800'}`} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold uppercase text-orange-400">
                          <span>Rage</span>
                          <span>{bossChargeCount}/{bossChargeThreshold}</span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden flex gap-0.5">
                          {Array.from({ length: bossChargeThreshold }).map((_, i) => (
                            <div key={i} className={`flex-1 ${i < bossChargeCount ? 'bg-orange-500' : 'bg-slate-800'}`} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Selection Hint */}
      {aliveEnemies.length > 1 && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center text-slate-500 text-[10px] uppercase tracking-widest font-bold"
        >
          Select a Target
        </motion.p>
      )}
    </div>
  );
}
