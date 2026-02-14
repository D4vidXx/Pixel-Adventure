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
  weakness_potion: {
    id: 'weakness_potion',
    name: 'Weakness Potion',
    description: 'Reduces all enemy damage by 20% for their next 3 turns',
    type: 'debuff',
    weaknessDebuff: true,
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
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-900 border-t-4 border-slate-700 p-4 sm:p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Item List */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-lg sm:text-xl text-slate-100 tracking-wider uppercase">
                Use Item
              </h3>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm tracking-wide uppercase">Back</span>
              </button>
            </div>

            {availableItems.length === 0 ? (
              <div className="bg-slate-800/50 border-2 border-slate-700 p-8 text-center">
                <p className="text-slate-400 text-lg">No items in inventory</p>
                <p className="text-slate-500 text-sm mt-2">
                  Defeat enemies to collect items!
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

                  const bgColor = canUse ? 'bg-purple-900/20 hover:bg-purple-900/40' : 'bg-slate-900/50';
                  const borderColor = canUse ? 'border-purple-600' : 'border-slate-700';

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={canUse ? { scale: 1.03, y: -3 } : {}}
                      whileTap={canUse ? { scale: 0.98 } : {}}
                      onClick={() => canUse && onUseItem(item)}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      disabled={!canUse}
                      className={`group p-3 border-2 ${borderColor} text-left transition-all duration-200 relative min-h-[130px] flex flex-col ${
                        canUse 
                          ? `${bgColor} hover:border-opacity-100` 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="absolute top-2 right-2 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-slate-300 text-xs font-bold">
                        x{count}
                      </div>
                      {!canUse && disabledReason && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-orange-900 border border-orange-600 rounded text-orange-300 text-xs font-bold">
                          {disabledReason}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2 mt-6">
                        <Icon className="w-5 h-5 text-slate-100" />
                        <h4 className="text-base text-slate-100 tracking-wide uppercase">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        {item.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Item Details */}
          <div className="bg-slate-800/50 border-2 border-slate-700 p-4 h-fit">
            <h4 className="text-sm text-slate-400 tracking-wider uppercase mb-3">Item Details</h4>
            {hoveredItem ? (
              <div className="space-y-3">
                <div>
                  <h5 className="text-lg text-slate-100 tracking-wide uppercase mb-1">
                    {hoveredItem.name}
                  </h5>
                  <p className="text-sm text-slate-400 mb-3">
                    {hoveredItem.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm border-t border-slate-700 pt-3">
                  {hoveredItem.healAmount !== undefined && (
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Effect</p>
                      <p className="text-slate-300">
                        Restores <span className="text-green-400">{hoveredItem.healAmount}</span> HP
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Current: {currentHealth} / {maxHealth}
                      </p>
                    </div>
                  )}
                  
                  {hoveredItem.resourceRestore !== undefined && (
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Effect</p>
                      <p className="text-slate-300">
                        Restores <span className="text-purple-400">{hoveredItem.resourceRestore}</span> {resourceType}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Current: {currentResource} / {maxResource}
                      </p>
                    </div>
                  )}

                  {hoveredItem.attackBoost !== undefined && (
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Effect</p>
                      <p className="text-slate-300">
                        Increases attack by <span className="text-red-400">+{hoveredItem.attackBoost}</span>
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Lasts for the current battle
                      </p>
                    </div>
                  )}

                  {hoveredItem.defenseBoost !== undefined && (
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Effect</p>
                      <p className="text-slate-300">
                        Increases defense by <span className="text-blue-400">+{hoveredItem.defenseBoost}</span>
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Lasts for the current battle
                      </p>
                    </div>
                  )}

                  {hoveredItem.weaknessDebuff && (
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Effect</p>
                      <p className="text-slate-300">
                        Reduces enemy damage by <span className="text-purple-400">20%</span>
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Lasts for enemy's next 3 turns
                      </p>
                    </div>
                  )}

                  <div className="border-t border-slate-700 pt-2">
                    <p className="text-orange-400 text-xs">
                      ⚠ Using an item ends your turn
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">
                Hover over an item to see detailed information
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
