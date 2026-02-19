import { Heart, Shield, Zap, Sparkles, ArrowLeft, Apple, Sandwich, Droplet, Skull } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'healing' | 'buff' | 'restore' | 'debuff';
  healAmount?: number;
  attackBoost?: number;
  defenseBoost?: number;
  resourceRestore?: number;
  weaknessDebuff?: boolean;
  icon: typeof Heart;
}

export const ITEM_TYPES: Record<string, Item> = {
  // Common Loot Items
  apple: {
    id: 'apple',
    name: 'Apple',
    description: 'A fresh apple that restores 10 HP',
    type: 'healing',
    healAmount: 10,
    icon: Apple,
  },
  bread: {
    id: 'bread',
    name: 'Bread',
    description: 'A loaf of bread that restores 16 HP',
    type: 'healing',
    healAmount: 16,
    icon: Sandwich,
  },
  small_energy_shot: {
    id: 'small_energy_shot',
    name: 'Small Energy Shot',
    description: 'A small vial that restores 10 energy',
    type: 'restore',
    resourceRestore: 10,
    icon: Droplet,
  },
  // Rare Loot Items
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'A potent potion that restores 36 HP',
    type: 'healing',
    healAmount: 36,
    icon: Heart,
  },
  energy_potion: {
    id: 'energy_potion',
    name: 'Energy Potion',
    description: 'Replenishes 40 energy',
    type: 'restore',
    resourceRestore: 40,
    icon: Sparkles,
  },
  mana_potion: {
    id: 'mana_potion',
    name: 'Mana Potion',
    description: 'Replenishes 60 energy',
    type: 'restore',
    resourceRestore: 60,
    icon: Sparkles,
  },
  weakness_potion: {
    id: 'weakness_potion',
    name: 'Weakness Potion',
    description: 'Reduces all enemy damage by 20% for their next 3 turns',
    type: 'debuff',
    weaknessDebuff: true,
    icon: Skull,
  },
  // Stage 4 Items
  pixie_dust: {
    id: 'pixie_dust',
    name: 'Pixie Dust',
    description: 'Heals 45 HP',
    type: 'healing',
    healAmount: 45,
    icon: Sparkles,
  },
  medicinal_herbs: {
    id: 'medicinal_herbs',
    name: 'Medicinal Herbs',
    description: 'Heals 60 HP',
    type: 'healing',
    healAmount: 60,
    icon: Droplet,
  },
  big_health_potion: {
    id: 'big_health_potion',
    name: 'Big Health Potion',
    description: 'Heals 100 HP',
    type: 'healing',
    healAmount: 100,
    icon: Heart,
  },
  antidote: {
    id: 'antidote',
    name: 'Antidote',
    description: 'Cures poison',
    type: 'healing', // Using healing type to allow usage, logic will handle cure
    healAmount: 0, // No heal, just cure
    icon: Skull,
  },
  // Smuggled Goods
  sugarcane: {
    id: 'sugarcane',
    name: 'Sugarcane',
    description: 'Heals 80 HP',
    type: 'healing',
    healAmount: 80,
    icon: Heart,
  },
  rum: {
    id: 'rum',
    name: 'Rum',
    description: 'Gain 50 Shield and stun an enemy',
    type: 'buff',
    icon: Shield,
  },
  rope: {
    id: 'rope',
    name: 'Rope',
    description: '40% chance to skip the level (no boss fights)',
    type: 'buff',
    icon: Sparkles,
  },
  pirates_ship: {
    id: 'pirates_ship',
    name: "Pirate's Ship",
    description: 'Gain 300 Shield and +40 Speed while shield holds',
    type: 'buff',
    icon: Shield,
  },
  // Legacy Items (kept for backward compatibility)
  greater_health_potion: {
    id: 'greater_health_potion',
    name: 'Greater Health Potion',
    description: 'Restores 100 HP',
    type: 'healing',
    healAmount: 100,
    icon: Heart,
  },
  energy_elixir: {
    id: 'energy_elixir',
    name: 'Energy Elixir',
    description: 'Restores 50 Mana/Energy',
    type: 'restore',
    resourceRestore: 50,
    icon: Sparkles,
  },
  attack_boost: {
    id: 'attack_boost',
    name: 'Strength Potion',
    description: 'Increases attack by 10 for this battle',
    type: 'buff',
    attackBoost: 10,
    icon: Zap,
  },
  defense_boost: {
    id: 'defense_boost',
    name: 'Fortification Potion',
    description: 'Increases defense by 10 for this battle',
    type: 'buff',
    defenseBoost: 10,
    icon: Shield,
  },
};

interface ItemSelectionProps {
  inventory: Record<string, number>;
  onUseItem: (item: Item) => void;
  onClose: () => void;
  currentHealth: number;
  maxHealth: number;
  currentResource: number;
  maxResource: number;
  resourceType: string;
}

export function ItemSelection({
  inventory,
  onUseItem,
  onClose,
  currentHealth,
  maxHealth,
  currentResource,
  maxResource,
  resourceType,
}: ItemSelectionProps) {
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);

  // Get items that the player has
  const availableItems = Object.entries(inventory)
    .filter(([_, count]) => count > 0)
    .map(([itemId, count]) => ({ item: ITEM_TYPES[itemId], count }))
    .filter(({ item }) => item !== undefined);

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
          {/* Left: Item List */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-lg sm:text-xl text-slate-100 tracking-wider uppercase font-black">
                Use Item
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800/40 hover:bg-slate-700/60 text-slate-300 border border-slate-700/50 rounded-lg hover:text-white transition-all flex items-center gap-2 uppercase tracking-wide text-xs font-bold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            </div>

            {availableItems.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-700/50 p-8 text-center rounded-2xl flex flex-col items-center justify-center min-h-[200px]">
                <div className="bg-slate-800/50 p-4 rounded-full mb-3">
                  <Sparkles className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400 text-lg font-bold">No items in inventory</p>
                <p className="text-slate-500 text-sm mt-1">
                  Defeat enemies to collect loot!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableItems.map(({ item, count }, index) => {
                  const Icon = item.icon;

                  // Check if item can be used
                  let canUse = true;
                  let disabledReason = '';

                  if (item.type === 'healing' && currentHealth >= maxHealth) {
                    canUse = false;
                    disabledReason = 'HP Full';
                  } else if (item.type === 'restore' && currentResource >= maxResource) {
                    canUse = false;
                    disabledReason = `${resourceType} Full`;
                  }

                  let borderColor = 'border-slate-700';
                  let bgColor = 'bg-slate-900/40';
                  let iconColor = 'text-slate-400';
                  let glowColor = 'bg-slate-500/0';

                  if (item.type === 'healing') {
                    borderColor = canUse ? 'border-green-500/30' : 'border-green-900/20';
                    bgColor = canUse ? 'bg-green-950/20' : 'bg-slate-900/40';
                    iconColor = canUse ? 'text-green-400' : 'text-slate-600';
                    glowColor = 'group-hover:bg-green-500/10';
                  } else if (item.type === 'restore') {
                    borderColor = canUse ? 'border-purple-500/30' : 'border-purple-900/20';
                    bgColor = canUse ? 'bg-purple-950/20' : 'bg-slate-900/40';
                    iconColor = canUse ? 'text-purple-400' : 'text-slate-600';
                    glowColor = 'group-hover:bg-purple-500/10';
                  } else if (item.type === 'buff') {
                    borderColor = canUse ? 'border-blue-500/30' : 'border-blue-900/20';
                    bgColor = canUse ? 'bg-blue-950/20' : 'bg-slate-900/40';
                    iconColor = canUse ? 'text-blue-400' : 'text-slate-600';
                    glowColor = 'group-hover:bg-blue-500/10';
                  } else { // debuff/other
                    borderColor = canUse ? 'border-red-500/30' : 'border-red-900/20';
                    bgColor = canUse ? 'bg-red-950/20' : 'bg-slate-900/40';
                    iconColor = canUse ? 'text-red-400' : 'text-slate-600';
                    glowColor = 'group-hover:bg-red-500/10';
                  }

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={canUse ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canUse ? { scale: 0.98 } : {}}
                      onClick={() => canUse && onUseItem(item)}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      disabled={!canUse}
                      className={`group relative p-4 bg-slate-900/40 backdrop-blur-sm border rounded-2xl text-left transition-all duration-300 overflow-hidden flex flex-col min-h-[120px] ${borderColor} ${bgColor} ${canUse ? 'cursor-pointer hover:border-opacity-80 hover:shadow-lg hover:shadow-black/20' : 'opacity-50 cursor-not-allowed grayscale-[0.5]'}`}
                    >
                      {/* Hover Glow */}
                      <div className={`absolute inset-0 transition-colors duration-300 ${glowColor}`} />

                      {/* Scanline */}
                      {canUse && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                      )}

                      {/* Header */}
                      <div className="flex justify-between items-start mb-2 relative z-10 w-full">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-black/20 ${canUse ? '' : 'opacity-50'}`}>
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                          </div>
                          <div>
                            <h4 className={`text-sm font-bold uppercase tracking-wider ${canUse ? 'text-slate-200' : 'text-slate-500'}`}>
                              {item.name}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-mono uppercase">
                              {item.type}
                            </span>
                          </div>
                        </div>

                        {/* Inventory Count Badge */}
                        <div className="flex flex-col items-end gap-1">
                          <span className="px-2 py-0.5 bg-slate-800 border border-slate-600 rounded text-xs font-bold text-slate-300">
                            x{count}
                          </span>
                          {!canUse && disabledReason && (
                            <span className="px-1.5 py-0.5 bg-orange-900/50 border border-orange-600/50 rounded text-[10px] uppercase font-bold text-orange-400">
                              {disabledReason}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description Preview (truncated) */}
                      <p className="text-xs text-slate-400 relative z-10 mt-auto line-clamp-2">
                        {item.description}
                      </p>

                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Item Details */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 h-fit lg:sticky lg:top-4 shadow-xl shadow-black/20">
              <h4 className="text-xs text-slate-500 tracking-widest uppercase mb-4 font-bold">Item Details</h4>
              <div className="min-h-[200px]">
                {hoveredItem ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div>
                      <h5 className="text-lg text-white tracking-wide uppercase font-black mb-1">
                        {hoveredItem.name}
                      </h5>
                      <p className="text-sm text-slate-400 leading-relaxed border-l-2 border-slate-700 pl-3">
                        {hoveredItem.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-800/50">
                      {hoveredItem.healAmount !== undefined && (
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Effect</p>
                          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                            Restores <span className="text-green-400 font-bold">{hoveredItem.healAmount}</span> HP
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 text-right">
                            Current: <span className="text-slate-300">{currentHealth}</span> / {maxHealth}
                          </p>
                        </div>
                      )}

                      {hoveredItem.resourceRestore !== undefined && (
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Effect</p>
                          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                            Restores <span className="text-purple-400 font-bold">{hoveredItem.resourceRestore}</span> {resourceType}
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 text-right">
                            Current: <span className="text-slate-300">{currentResource}</span> / {maxResource}
                          </p>
                        </div>
                      )}

                      {hoveredItem.attackBoost !== undefined && (
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Effect</p>
                          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                            Increases Attack by <span className="text-red-400 font-bold">+{hoveredItem.attackBoost}</span>
                          </div>
                        </div>
                      )}

                      {hoveredItem.defenseBoost !== undefined && (
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Effect</p>
                          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                            Increases Defense by <span className="text-blue-400 font-bold">+{hoveredItem.defenseBoost}</span>
                          </div>
                        </div>
                      )}

                      <div className="border-t border-slate-800/50 pt-2">
                        <div className="flex items-center gap-2 text-orange-400/80 bg-orange-950/20 p-2 rounded border border-orange-900/30">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-[10px] uppercase font-bold tracking-wide">Ends Your Turn</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2 py-10 opacity-50">
                    <Sparkles className="w-8 h-8 mb-2" />
                    <p className="text-sm italic">Hover over an item to inspect</p>
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
