import { Coins, ShoppingBag, X, Heart, Zap, Shield, Sword, Apple, Sandwich, Droplet, Sparkles, Skull } from 'lucide-react';
import { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoveShop } from './MoveShop';
import { Move } from './MoveSelection';
import { ParticleBackground } from './ParticleBackground';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: typeof Heart;
  type: 'consumable' | 'permanent' | 'artifact';
}

const BASE_SHOP_ITEMS: ShopItem[] = [
  // Consumables
  {
    id: 'apple',
    name: 'Apple',
    description: 'Restores 10 HP',
    price: 3,
    icon: Apple,
    type: 'consumable',
  },
  {
    id: 'bread',
    name: 'Bread',
    description: 'Restores 16 HP',
    price: 5,
    icon: Sandwich,
    type: 'consumable',
  },
  {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'Restores 36 HP',
    price: 15,
    icon: Heart,
    type: 'consumable',
  },
  {
    id: 'small_energy_shot',
    name: 'Small Energy Shot',
    description: 'Restores 10 energy',
    price: 15,
    icon: Droplet,
    type: 'consumable',
  },
  {
    id: 'energy_potion',
    name: 'Energy Potion',
    description: 'Restores 40 energy',
    price: 40,
    icon: Sparkles,
    type: 'consumable',
  },
  {
    id: 'weakness_potion',
    name: 'Weakness Potion',
    description: 'Reduces all enemy damage by 20% for 3 turns',
    price: 35,
    icon: Skull,
    type: 'consumable',
  },
  // Permanent upgrades
  {
    id: 'attack_upgrade',
    name: 'Physical Training',
    description: 'Permanently increases attack by 8',
    price: 18,
    icon: Sword,
    type: 'permanent',
  },
  {
    id: 'defense_upgrade',
    name: 'Defense Training',
    description: 'Permanently increases defense by 8',
    price: 18,
    icon: Shield,
    type: 'permanent',
  },
];

const STAGE4_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'pixie_dust',
    name: 'Pixie Dust',
    description: 'Heal 45 HP',
    price: 8,
    icon: Sparkles,
    type: 'consumable',
  },
  {
    id: 'medicinal_herbs',
    name: 'Medicinal Herbs',
    description: 'Heal 60 HP',
    price: 14,
    icon: Droplet,
    type: 'consumable',
  },
  {
    id: 'big_health_potion',
    name: 'Big Health Potion',
    description: 'Heal 100 HP',
    price: 30,
    icon: Heart,
    type: 'consumable',
  },
  {
    id: 'antidote',
    name: 'Antidote',
    description: 'Cures poison',
    price: 120,
    icon: Skull,
    type: 'consumable',
  },
  {
    id: 'mana_potion',
    name: 'Mana Potion',
    description: 'Replenishes 60 energy',
    price: 50,
    icon: Sparkles,
    type: 'consumable',
  },
];

const ILLEGAL_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    description: 'Heal 80 HP',
    price: 35,
    icon: Heart,
    type: 'consumable',
  },
  {
    id: 'rum',
    name: 'Rum',
    description: 'Gain 50 Shield and stun an enemy',
    price: 50,
    icon: Shield,
    type: 'consumable',
  },
  {
    id: 'rope',
    name: 'Rope',
    description: '40% chance to skip the level (no boss fights)',
    price: 50,
    icon: Sparkles,
    type: 'consumable',
  },
  {
    id: 'pirates_ship',
    name: "Pirate's Ship",
    description: 'Gain 300 Shield and +40 Speed while shield holds',
    price: 400,
    icon: Shield,
    type: 'consumable',
  },
  {
    id: 'artifact_rare',
    name: 'Rare Artifact',
    description: 'Buy a random rare artifact',
    price: 240,
    icon: Sparkles,
    type: 'artifact',
  },
  {
    id: 'artifact_legendary',
    name: 'Legendary Artifact',
    description: 'Buy a random legendary artifact',
    price: 360,
    icon: Sparkles,
    type: 'artifact',
  },
];

interface ShopProps {
  gold: number;
  characterClass: string;
  currentMoves: Move[];
  ownedSpecialMoves: string[];
  playerAttack: number;
  playerDefense: number;
  attackCap: number;
  defenseCap: number;
  currentStage: number;
  heroId: string;
  onPurchase: (itemId: string, price: number, isPermanent: boolean) => void;
  onPurchaseMove: (moveId: string, replaceIndex: number) => void;
  onClose: () => void;
}

export function Shop({ gold, characterClass, currentMoves, ownedSpecialMoves, playerAttack, playerDefense, attackCap, defenseCap, currentStage, heroId, onPurchase, onPurchaseMove, onClose }: ShopProps) {
  const [hoveredItem, setHoveredItem] = useState<ShopItem | null>(null);
  const isIllegalShop = heroId === 'dearborn';
  let shopItems: ShopItem[];
  if (isIllegalShop) {
    shopItems = [...BASE_SHOP_ITEMS, ...ILLEGAL_SHOP_ITEMS];
  } else if (currentStage >= 4) {
    shopItems = [
      ...STAGE4_SHOP_ITEMS,
      // Permanent upgrades
      ...BASE_SHOP_ITEMS.filter(i => i.type === 'permanent'),
    ];
  } else {
    shopItems = BASE_SHOP_ITEMS;
  }
  // Stable discount selection for illegal shop
  const discountRef = useRef<Set<string> | null>(null);
  if (isIllegalShop && discountRef.current === null) {
    const ids = [...shopItems].map(item => item.id);
    if (ids.length <= 2) {
      discountRef.current = new Set(ids);
    } else {
      for (let i = ids.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      discountRef.current = new Set(ids.slice(0, 2));
    }
  }
  const discountedIds = isIllegalShop ? (discountRef.current ?? new Set<string>()) : new Set<string>();

  return (

    <div className="size-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      {/* Animated Glow Background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.13, 0.08],
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-yellow-400/10 rounded-full blur-[120px] z-0"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.06, 0.12, 0.06],
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[100px] z-0"
      />
      {/* Particles */}
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full h-full max-h-[92vh] bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 flex flex-col relative z-10 shadow-2xl shadow-black/50 overflow-hidden rounded-2xl sm:rounded-3xl"
      >
        {/* Header - Fixed */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 border-b border-slate-700/50 flex-shrink-0 bg-slate-800/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400/10 rounded-2xl border border-yellow-400/20">
              <ShoppingBag className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <motion.h2
                animate={{
                  textShadow: [
                    "0 0 10px rgba(234,179,8,0.3)",
                    "0 0 20px rgba(234,179,8,0.5)",
                    "0 0 10px rgba(234,179,8,0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent tracking-widest uppercase"
              >
                Shop
              </motion.h2>
              <p className="text-slate-400 text-xs tracking-widest uppercase mt-1 opacity-70">Artifacts & Upgrades</p>
              {isIllegalShop && (
                <p className="text-red-400 text-[10px] tracking-[0.2em] uppercase mt-2 font-bold">Illegal Shop Open</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-800/80 px-6 py-3 border border-yellow-600/50 rounded-2xl shadow-inner group transition-all hover:bg-slate-800">
              <Coins className="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold text-yellow-400 tracking-wider transition-all">{gold}</span>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-600/50 rounded-2xl transition-all hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-scroll px-8 py-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900/30">
          {/* Move Shop Section */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-1 overflow-hidden">
            <MoveShop
              characterClass={characterClass}
              currentMoves={currentMoves}
              ownedSpecialMoves={ownedSpecialMoves}
              gold={gold}
              currentStage={currentStage}
              onPurchaseMove={onPurchaseMove}
              onClose={onClose}
            />
          </div>

          {/* Shop Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm text-slate-400 tracking-[0.2em] uppercase font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Items & Training
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shopItems.map((item) => {
                  const Icon = item.icon;
                  const discounted = discountedIds.has(item.id);
                  const finalPrice = discounted ? Math.max(1, Math.floor(item.price * 0.7)) : item.price;
                  const canAfford = gold >= finalPrice;
                  const isCapped = item.id === 'attack_upgrade' ? playerAttack >= attackCap : item.id === 'defense_upgrade' ? playerDefense >= defenseCap : false;
                  const isClydeForbidden = item.id === 'attack_upgrade' && heroId === 'clyde';
                  const canPurchase = canAfford && !isCapped && !isClydeForbidden;

                  return (
                    <motion.button
                      key={item.id}
                      whileHover={canPurchase ? { scale: 1.04, y: -6 } : {}}
                      whileTap={canPurchase ? { scale: 0.97 } : {}}
                      onClick={() => canPurchase && onPurchase(item.id, finalPrice, item.type === 'permanent')}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      disabled={!canPurchase}
                      className={`group p-5 border-2 text-left transition-all duration-300 relative min-h-[140px] flex flex-col rounded-2xl overflow-hidden shadow-xl
                        ${canPurchase
                          ? 'bg-slate-800/60 hover:bg-slate-800/90 border-slate-700/50 hover:border-yellow-400/60 shadow-yellow-400/10'
                          : 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
                        }`}
                    >
                      {/* Animated border glow for permanent/equipment items */}
                      {item.type === 'permanent' && canPurchase && (
                        <motion.div
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-2xl border-4 border-yellow-400/40 pointer-events-none z-0"
                          style={{ filter: 'blur(6px)' }}
                        />
                      )}
                      {/* Hover Glow */}
                      {canAfford && (
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                      <div className="flex-shrink-0 relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-xl border ${canAfford ? 'bg-slate-900/80 border-slate-700 text-yellow-400' : 'bg-slate-900/40 border-slate-800 text-slate-600'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {item.type === 'permanent' && (
                            <span className="px-2 py-1 bg-yellow-900/30 border border-yellow-400/30 text-yellow-200 text-[10px] font-bold tracking-wider uppercase rounded-lg backdrop-blur-sm shadow-yellow-400/10">
                              Upgrade
                            </span>
                          )}
                          {discounted && (
                            <span className="px-2 py-1 bg-red-900/40 border border-red-500/40 text-red-300 text-[10px] font-bold tracking-wider uppercase rounded-lg backdrop-blur-sm">
                              -30%
                            </span>
                          )}
                        </div>
                        <h4 className={`text-sm tracking-wide uppercase font-bold mb-1 ${canAfford ? 'text-slate-100' : 'text-slate-500'}`}>
                          {item.name}
                        </h4>
                      </div>
                      <p className={`text-xs mb-4 line-clamp-2 ${canAfford ? 'text-slate-400' : 'text-slate-600'}`}>{item.description}</p>
                      <div className="mt-auto flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-1.5">
                          <Coins className={`w-4 h-4 ${canAfford ? 'text-yellow-500' : 'text-slate-700'}`} />
                          <span className={`text-lg font-bold ${canAfford ? 'text-yellow-400' : 'text-slate-700'}`}>
                            {finalPrice}
                          </span>
                          {discounted && (
                            <span className="text-xs text-slate-500 line-through ml-2">
                              {item.price}
                            </span>
                          )}
                        </div>
                        {canAfford && (
                          <div className="p-1 px-2 bg-yellow-500/10 text-yellow-500 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-bold uppercase rounded-lg">Buy Now</div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Item Details */}
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 p-6 rounded-3xl h-fit lg:sticky lg:top-8 shadow-xl">
              <h4 className="text-xs text-slate-500 tracking-[0.2em] uppercase font-bold mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                Information
              </h4>
              <div className="min-h-[280px]">
                <AnimatePresence mode="wait">
                  {hoveredItem ? (
                    <motion.div
                      key={hoveredItem.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h5 className="text-2xl text-slate-100 font-bold tracking-wide uppercase mb-2">
                          {hoveredItem.name}
                        </h5>
                        <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl">
                          <p className="text-sm text-slate-300 leading-relaxed italic">"{hoveredItem.description}"</p>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                        {hoveredItem.type === 'permanent' && (
                          <div className="bg-purple-900/20 border border-purple-600/30 p-4 rounded-2xl flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                            <p className="text-purple-300 text-[11px] leading-snug">
                              This enhancement is permanent and will empower you for the remainder of your journey.
                            </p>
                          </div>
                        )}

                        <div className="bg-slate-900/30 border border-slate-700/30 p-4 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                              <Coins className="w-4 h-4 text-yellow-500/70" />
                              <span>Cost</span>
                            </div>
                            {(() => {
                              const discounted = discountedIds.has(hoveredItem.id);
                              const finalPrice = discounted ? Math.max(1, Math.floor(hoveredItem.price * 0.7)) : hoveredItem.price;
                              return (
                                <span className="text-xl font-bold text-yellow-400">
                                  {finalPrice} Gold
                                  {discounted && (
                                    <span className="text-xs text-slate-500 line-through ml-2">{hoveredItem.price}</span>
                                  )}
                                </span>
                              );
                            })()}
                          </div>
                          {(() => {
                            const currentIsCapped = hoveredItem.id === 'attack_upgrade' ? playerAttack >= attackCap : hoveredItem.id === 'defense_upgrade' ? playerDefense >= defenseCap : false;
                            const discounted = discountedIds.has(hoveredItem.id);
                            const finalPrice = discounted ? Math.max(1, Math.floor(hoveredItem.price * 0.7)) : hoveredItem.price;
                            return currentIsCapped;
                          })() ? (
                            <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 p-2 rounded-xl justify-center">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                              Stat Cap Reached
                            </div>
                          ) : gold >= (() => {
                            const discounted = discountedIds.has(hoveredItem.id);
                            return discounted ? Math.max(1, Math.floor(hoveredItem.price * 0.7)) : hoveredItem.price;
                          })() ? (
                            <div className="flex items-center gap-2 text-green-400 text-[10px] font-bold uppercase tracking-widest bg-green-500/10 p-2 rounded-xl justify-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                              Funds Available
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 p-2 rounded-xl justify-center">
                              Insufficient Funds
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12"
                    >
                      <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700">
                        <ShoppingBag className="w-6 h-6 text-slate-600" />
                      </div>
                      <p className="text-slate-500 text-sm italic max-w-[180px]">
                        Hover over an item to reveal its mysteries
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="px-8 py-6 border-t border-slate-700/50 text-center flex-shrink-0 bg-slate-800/30">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-12 py-4 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-slate-100 border border-slate-600/50 rounded-2xl transition-all tracking-[0.2em] uppercase font-bold shadow-xl shadow-black/20"
          >
            Leave Shop
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
