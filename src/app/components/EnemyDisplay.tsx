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
}

export function EnemyDisplay({ enemies, selectedTargetId, onSelectTarget, bossChargeCount, bossChargeThreshold, bossAttackBonus, bossDefenseBonus, slashedEnemyIds = new Set(), hasRingOfPower = false, lordInfernoPowerMeter = 0 }: EnemyDisplayProps) {
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
      <div className={`grid gap-4 ${aliveEnemies.length === 1 ? 'grid-cols-1' : aliveEnemies.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
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
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectTarget(enemy.id)}
                className={`group p-3 border rounded-xl transition-all duration-200 text-left relative overflow-hidden ${isSelected
                  ? 'bg-gradient-to-br from-red-900/50 to-red-950/30 border-red-500/70 shadow-lg shadow-red-900/20'
                  : 'bg-gradient-to-br from-slate-800/40 to-slate-900/30 border-red-900/50 hover:border-red-700/70 hover:from-slate-800/50'
                  }`}
              >
                {/* Boss Badge */}
                {enemy.type === 'BOSS' && (
                  <div className="mb-2 flex justify-center">
                    <span className="px-2 py-1 bg-red-900/80 border border-red-600/50 text-red-400 text-xs tracking-widest uppercase rounded-md shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                      Boss
                    </span>
                  </div>
                )}

                {/* Target Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Target className="w-5 h-5 text-red-400 animate-pulse" />
                  </div>
                )}

                {/* Enemy Visual */}
                <div className="flex justify-center mb-3">
                  <motion.div
                    animate={isSelected ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, -5, 5, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                    className={`w-20 h-20 border-2 ${isSelected ? 'border-red-500/60' : 'border-red-900/40'} rounded-xl flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 transition-all shadow-inner`}
                  >
                    <motion.div
                      animate={{
                        y: [0, -3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-4xl"
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
                <h4 className={`text-center text-sm tracking-wide uppercase mb-2 ${isSelected ? 'text-red-400 font-bold' : 'text-slate-100'}`}>
                  {enemy.name}
                </h4>

                {enemy.name === 'Lava Pebble' && (
                  <div className="mb-3 rounded-lg border border-orange-500/30 bg-orange-900/20 px-2 py-1">
                    <p className="text-[10px] text-orange-300 uppercase tracking-widest font-bold">Trait: Scorch</p>
                    <p className="text-[9px] text-slate-300 italic">30% chance to burn you on hit.</p>
                  </div>
                )}

                {enemy.name === 'Lava Golem' && (
                  <div className="mb-3 rounded-lg border border-orange-500/30 bg-orange-900/20 px-2 py-1">
                    <p className="text-[10px] text-orange-300 uppercase tracking-widest font-bold">Trait: Heat Lock</p>
                    <p className="text-[9px] text-slate-300 italic">Prevents all buff moves, including training.</p>
                  </div>
                )}

                {enemy.name === 'Mother Golem' && (
                  <div className="mb-3 rounded-lg border border-orange-500/30 bg-orange-900/20 px-2 py-1">
                    <p className="text-[10px] text-orange-300 uppercase tracking-widest font-bold">Trait: Motherly Bond</p>
                    <p className="text-[9px] text-slate-300 italic">Spawns 4 Lava Pebbles when revealed.</p>
                  </div>
                )}

                {enemy.name === 'Lava Dragon' && (
                  <div className="mb-3 rounded-lg border border-orange-500/30 bg-orange-900/20 px-2 py-1">
                    <p className="text-[10px] text-orange-300 uppercase tracking-widest font-bold">Trait: Pyreburst</p>
                    <p className="text-[9px] text-slate-300 italic">Releases 12 Lava Pebbles upon death.</p>
                  </div>
                )}

                {enemy.name === 'Lava Spider' && (
                  <div className="mb-3 rounded-lg border border-orange-500/30 bg-orange-900/20 px-2 py-1">
                    <p className="text-[10px] text-orange-300 uppercase tracking-widest font-bold">Trait: Web Ambush</p>
                    <p className="text-[9px] text-slate-300 italic">Always acts first, webbing you to weaken and halve speed.</p>
                  </div>
                )}

                {enemy.name === 'Fire Lizard' && (
                  <div className="mb-3 rounded-lg border border-orange-500/30 bg-orange-900/20 px-2 py-1">
                    <p className="text-[10px] text-orange-300 uppercase tracking-widest font-bold">Trait: Adaptive Scales</p>
                    <p className="text-[9px] text-slate-300 italic">Taking the same move twice in a row halves the damage.</p>
                  </div>
                )}

                {/* Health Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span className="text-slate-400">HP</span>
                    </div>
                    <span className="text-slate-300 font-mono italic">
                      {enemy.currentHealth}/{enemy.maxHealth}
                      {(enemy.shield || 0) > 0 && (
                        <span className="text-blue-400 font-bold ml-1"> (+{enemy.shield} SHD)</span>
                      )}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden border border-white/5 relative">
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
                      className={`h-full relative z-10 ${healthPercent > 50 ? 'bg-gradient-to-r from-red-600 to-red-500' : healthPercent > 25 ? 'bg-gradient-to-r from-orange-600 to-orange-500' : 'bg-gradient-to-r from-yellow-600 to-yellow-500'
                        }`}
                    />
                    {(enemy.shield || 0) > 0 && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(enemy.shield / enemy.maxHealth) * 100}%` }}
                        className="absolute top-0 left-0 h-full bg-blue-500/50 z-20"
                      />
                    )}
                  </div>
                </div>

                {/* Boss Rage Meter */}
                {enemy.type === 'BOSS' && (
                  <div className="space-y-3 mb-3">
                    {/* Trait Info */}
                    <div className="bg-orange-950/30 border border-orange-500/20 rounded-lg p-2">
                      <p className="text-[10px] text-orange-400 font-bold uppercase tracking-tighter mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Boss Trait: Rage
                      </p>
                      <p className="text-[9px] text-slate-400 leading-tight italic">
                        {enemy.name === 'Magma Overlord'
                          ? 'Every 6 hits, spawns a Magma Soldier.'
                          : 'Gains +2 ATK every turn. Every 5 hits, heals 15% HP and gains +15 ATK.'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Zap className="w-3 h-3 text-orange-400" />
                          </motion.div>
                          <span className="text-orange-400/80 tracking-widest uppercase">Rage Meter</span>
                        </div>
                        <span className="text-orange-300 font-mono">{bossChargeCount}/{bossChargeThreshold}</span>
                      </div>
                      <div className="flex gap-1 h-1.5">
                        {Array.from({ length: bossChargeThreshold }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full border border-white/5 transition-all duration-300 ${i < bossChargeCount
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'
                              : 'bg-slate-800/80'
                              }`}
                          />
                        ))}
                      </div>

                      {bossChargeCount >= bossChargeThreshold && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center"
                        >
                          <p className="text-[10px] text-red-400 font-bold bg-red-950/40 border border-red-500/30 rounded px-1 py-0.5 animate-pulse inline-block">
                            ⚠️ GUARANTEED CRIT!
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Enemy Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/50">
                  <div className="flex items-center gap-1 text-xs">
                    <Sword className="w-3 h-3 text-orange-500" />
                    <span className="text-slate-400 text-[10px]">ATK</span>
                    <span className="text-slate-200 ml-auto font-mono">
                      {enemy.type === 'BOSS' ? enemy.attack + bossAttackBonus : enemy.attack}
                      {enemy.type === 'BOSS' && bossAttackBonus > 0 && (
                        <span className="text-orange-400 text-[9px]"> (+{bossAttackBonus})</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Shield className="w-3 h-3 text-blue-500" />
                    <span className="text-slate-400 text-[10px]">DEF</span>
                    <span className="text-slate-200 ml-auto font-mono">
                      {enemy.type === 'BOSS' ? enemy.defense + bossDefenseBonus : enemy.defense}
                      {enemy.type === 'BOSS' && bossDefenseBonus > 0 && (
                        <span className="text-blue-400 text-[9px]"> (+{bossDefenseBonus})</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Status Effects */}
                <div className="mt-3 flex flex-wrap gap-1 justify-center">
                  <AnimatePresence>
                    {enemy.weaknessTurns > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="px-2 py-0.5 bg-purple-900/40 border border-purple-500/30 text-purple-300 text-[10px] rounded-full backdrop-blur-sm"
                      >
                        💀 Weakened ({enemy.weaknessTurns})
                      </motion.span>
                    )}
                    {enemy.poisonTurns > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="px-2 py-0.5 bg-green-900/40 border border-green-500/30 text-green-300 text-[10px] rounded-full backdrop-blur-sm"
                      >
                        🧪 Poisoned ({enemy.poisonTurns})
                      </motion.span>
                    )}
                    {enemy.stunTurns > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="px-2 py-0.5 bg-yellow-900/40 border border-yellow-500/30 text-yellow-300 text-[10px] rounded-full backdrop-blur-sm"
                      >
                        💫 Stunned ({enemy.stunTurns})
                      </motion.span>
                    )}
                    {enemy.burnTurns > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="px-2 py-0.5 bg-orange-900/40 border border-orange-500/30 text-orange-300 text-[10px] rounded-full backdrop-blur-sm"
                      >
                        🔥 Burning ({enemy.burnTurns})
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Boss Power Meter UI */}
                {isBoss && (
                  <div className="absolute -bottom-6 left-0 w-full flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full border border-orange-900 transition-all duration-300 ${(lordInfernoPowerMeter || 0) >= i ? 'bg-orange-500 shadow-[0_0_8px_orange] scale-110' : 'bg-slate-800'
                          }`}
                      >
                        {(lordInfernoPowerMeter || 0) >= i && <span className="block w-full h-full animate-pulse bg-yellow-400 rounded-full opacity-50"></span>}
                      </div>
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Selection Hint */}
      {aliveEnemies.length > 1 && (
        <p className="text-center text-slate-400 text-xs italic">
          Click an enemy to target them
        </p>
      )}
    </div>
  );
}
