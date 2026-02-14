import { ArrowLeft, Heart, Sword, Shield, Zap, Sparkles, Users, Package } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import animeStyleArt from '../../assets/anime-style-gacha.png';
import mountainStyleArt from '../../assets/serene-japanese-mountainscape.png';
import { Hero, ALL_HEROES, getHeroesByClass } from '../data/heroes';
import { CLASSES } from '../data/classes';
import { ParticleBackground } from './ParticleBackground';
import { EQUIPMENT_ITEMS, getEquipmentItem } from '../data/equipment-items';

interface CombinedHeroSelectionProps {
  onSelectHero: (hero: Hero) => void;
  onBack: () => void;
  ownedItems: string[];
  equippedItems: string[];
  onToggleEquip: (itemId: string) => void;
  backgroundStyle?: string;
  activeBackgroundId?: string;
  activeStyleId?: string;
}

type TabType = 'all' | 'warrior' | 'mage' | 'rogue' | 'paladin' | 'gunslinger' | 'duality';

export function CombinedHeroSelection({ onSelectHero, onBack, ownedItems, equippedItems, onToggleEquip, backgroundStyle, activeBackgroundId, activeStyleId }: CombinedHeroSelectionProps) {
  const needsTextBoost = activeBackgroundId === 'anime-skies';
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [hoveredHero, setHoveredHero] = useState<string | null>(null);

  // Get heroes based on active tab
  const getDisplayedHeroes = (): Hero[] => {
    if (activeTab === 'all') {
      return ALL_HEROES;
    }
    return getHeroesByClass(activeTab);
  };

  const heroes = getDisplayedHeroes();

  const handleConfirm = () => {
    if (selectedHero) {
      onSelectHero(selectedHero);
    }
  };

  return (
    <div className="size-full flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      {/* Background Layers */}
      <div
        className="absolute inset-0"
        style={{
          background: backgroundStyle ?? 'radial-gradient(circle_at_50%_50%, rgba(17,24,39,1), rgba(2,6,23,1))',
        }}
      />
      {needsTextBoost && <div className="absolute inset-0 bg-slate-950/35" />}

      {/* Nebula Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1],
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-indigo-600/20 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.05, 0.12, 0.05],
          x: [0, -20, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/15 rounded-full blur-[90px]"
      />

      {/* Particles */}
      <ParticleBackground />

      {/* Gacha Style Background */}
      {(activeStyleId === 'anime-prism' || activeStyleId === 'japanese-mountainscape') && (
        <>
          <img
            src={activeStyleId === 'japanese-mountainscape' ? mountainStyleArt : animeStyleArt}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,114,182,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(96,165,250,0.12),transparent_65%)] pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl w-full h-full flex flex-col z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8 relative"
        >
          <div className="absolute inset-0 bg-indigo-600/10 blur-[50px] rounded-full scale-150 -z-10" />

          <div className="relative inline-block">
            <motion.h1
              animate={{
                textShadow: [
                  "0 0 15px rgba(99,102,241,0.2)",
                  "0 0 30px rgba(99,102,241,0.5)",
                  "0 0 15px rgba(99,102,241,0.2)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-100 mb-2 tracking-tighter uppercase italic"
            >
              Choose Your Hero
            </motion.h1>
            <motion.div
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-6"
            >
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </motion.div>
          </div>

          <p className="text-slate-400 tracking-[0.15em] sm:tracking-[0.25em] uppercase text-[10px] sm:text-xs font-bold">
            Select your fate and begin the descent
          </p>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-0">
          {/* Left Sidebar - Tabs */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-56 flex-shrink-0 flex flex-row lg:flex-col gap-3 sm:gap-4 overflow-x-auto lg:overflow-y-auto custom-scrollbar pr-0 lg:pr-2 min-h-0"
          >
            {/* All Heroes Tab */}
            <motion.button
              whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              onClick={() => setActiveTab('all')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 backdrop-blur-md min-w-[220px] lg:min-w-0 ${activeTab === 'all'
                ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === 'all' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                <Users className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className={`text-sm font-bold uppercase tracking-widest ${activeTab === 'all' ? 'text-indigo-100' : 'text-slate-300'}`}>
                  All Heroes
                </p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-0.5">{ALL_HEROES.length} characters</p>
              </div>
            </motion.button>

            <div className="w-full h-px bg-white/5 my-2 hidden lg:block" />

            {/* Class Tabs */}
            {CLASSES.map((classType) => {
              const Icon = classType.icon;
              const isActive = activeTab === classType.id;
              const classHeroes = getHeroesByClass(classType.id);

              return (
                <motion.button
                  key={classType.id}
                  whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  onClick={() => setActiveTab(classType.id as TabType)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 backdrop-blur-md min-w-[220px] lg:min-w-0 ${isActive
                    ? 'bg-yellow-600/20 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                  <div className={`p-3 rounded-xl ${isActive ? 'bg-yellow-500 text-black' : 'bg-white/5 text-slate-400'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold uppercase tracking-widest ${isActive ? 'text-yellow-100' : 'text-slate-300'}`}>
                      {classType.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-0.5">{classHeroes.length} characters</p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Right Content - Hero Grid and Equipment */}
          <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-0">
            {/* Hero Grid */}
            <div className="flex-1 flex flex-col min-h-0 bg-white/5 rounded-3xl border border-white/5 p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex-1 overflow-auto pr-0 sm:pr-2 custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-4"
                  >
                  {heroes.map((hero, index) => {
                    const isSelected = selectedHero?.id === hero.id;
                    const isHovered = hoveredHero === hero.id;

                    return (
                      <motion.button
                        key={hero.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03, duration: 0.3 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedHero(hero);
                          // Unequip items that this hero can't use
                          equippedItems.forEach(itemId => {
                            const item = getEquipmentItem(itemId);
                            if (item?.unavailableClasses?.includes(hero.classId)) {
                              onToggleEquip(itemId);
                            }
                          });
                        }}
                        onMouseEnter={() => setHoveredHero(hero.id)}
                        onMouseLeave={() => setHoveredHero(null)}
                        className={`group relative flex flex-col p-5 rounded-3xl border-2 transition-all duration-400 overflow-hidden text-left bg-slate-900/40 backdrop-blur-md ${isSelected
                          ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.25)] ring-1 ring-yellow-500/50'
                          : 'border-white/10 hover:border-white/30'
                          }`}
                      >
                        {/* Background Decoration */}
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full transition-opacity duration-500 -z-10 ${isSelected ? 'bg-yellow-500/15 opacity-100' : 'bg-indigo-500/5 opacity-0 group-hover:opacity-100'
                          }`} />

                        <div className="mb-4">
                          <h3 className={`text-xl font-black tracking-tight uppercase mb-1 transition-colors ${isSelected ? 'text-yellow-400' : 'text-slate-100'
                            }`}>
                            {hero.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="h-0.5 w-6 bg-red-500" />
                            <p className="text-red-400 text-[10px] font-black uppercase tracking-widest italic">
                              {hero.title}
                            </p>
                          </div>
                        </div>

                        <p className="text-slate-400 text-xs mb-5 line-clamp-3 font-medium leading-relaxed italic">
                          "{hero.description}"
                        </p>

                        {/* Unique Ability */}
                        {hero.uniqueAbility && (
                          <div className="mb-5 p-3 bg-indigo-900/20 border border-indigo-500/20 rounded-2xl relative group-hover:border-indigo-500/40 transition-colors">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="text-indigo-300 text-[10px] uppercase font-black tracking-widest">
                                {hero.uniqueAbility.name}
                              </span>
                            </div>
                            <p className="text-slate-300 text-[10px] font-medium leading-tight">
                              {hero.uniqueAbility.description}
                            </p>
                          </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {[
                            { icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10', label: 'HP', val: hero.stats.health },
                            { icon: Sword, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'ATK', val: hero.stats.attack },
                            { icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'DEF', val: hero.stats.defense },
                            { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'SPD', val: hero.stats.speed },
                          ].map((stat, i) => (
                            <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors ${stat.bg}`}>
                              <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                              <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter leading-none mb-0.5">{stat.label}</p>
                                <p className="text-slate-100 text-sm font-black leading-none">{stat.val}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Selection status */}
                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-yellow-400' : 'text-slate-500 group-hover:text-slate-300'
                            }`}>
                            {isSelected ? 'Ready for Descent' : 'Awaiting Selection'}
                          </span>
                          {isSelected && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,1)]" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
            </div>

            {/* Equipment Loadout - Right Side */}
            {ownedItems.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="w-full lg:w-72 flex-shrink-0 flex flex-col min-h-0 bg-white/5 rounded-3xl border border-white/5 p-4 sm:p-6 backdrop-blur-sm order-last lg:order-none"
              >
                <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                  <Package className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-cyan-400 uppercase tracking-widest font-bold">Equipment Loadout</span>
                  <span className="text-[10px] text-slate-500 ml-auto">{equippedItems.length}/2 slots</span>
                </div>
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar min-h-0">
                  {ownedItems.map(itemId => {
                    const item = getEquipmentItem(itemId);
                    if (!item) return null;

                    // Hide if unavailable for this specific hero
                    if (selectedHero && item.unavailableClasses?.includes(selectedHero.classId)) {
                      return null;
                    }

                    const isEquipped = equippedItems.includes(itemId);
                    return (
                      <motion.button
                        key={itemId}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onToggleEquip(itemId)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm ${isEquipped
                          ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-100 shadow-lg shadow-cyan-500/10'
                          : equippedItems.length >= 2
                            ? 'bg-slate-800/40 border-slate-700/30 text-slate-500 opacity-50 cursor-not-allowed'
                            : 'bg-slate-800/40 border-slate-700/30 text-slate-300 hover:border-cyan-500/30'
                          }`}
                        disabled={!isEquipped && equippedItems.length >= 2}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-bold text-xs">{item.name}</span>
                        {isEquipped && <span className="text-[10px] text-cyan-400 ml-1">✓</span>}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-6 sm:mt-8 pt-6 border-t border-white/10"
        >
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-2xl transition-all duration-300 backdrop-blur-md flex items-center gap-3"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-widest uppercase">Recall to Menu</span>
          </motion.button>

          <motion.button
            whileHover={selectedHero ? { scale: 1.05, boxShadow: "0 0 30px rgba(234,179,8,0.3)" } : {}}
            whileTap={selectedHero ? { scale: 0.98 } : {}}
            onClick={handleConfirm}
            disabled={!selectedHero}
            className={`px-6 sm:px-12 py-4 sm:py-5 rounded-2xl transition-all duration-500 flex items-center gap-3 border-2 ${selectedHero
              ? 'bg-yellow-500/20 border-yellow-500 text-yellow-100 hover:bg-yellow-500/30 shadow-lg'
              : 'bg-white/5 border-white/10 text-slate-600 cursor-not-allowed opacity-50'
              }`}
          >
            <span className="text-sm sm:text-lg font-black tracking-widest uppercase">
              {selectedHero ? `Embark as ${selectedHero.name}` : 'Await Selection'}
            </span>
            {selectedHero && <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><Sword className="w-5 h-5 text-yellow-500" /></motion.div>}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

