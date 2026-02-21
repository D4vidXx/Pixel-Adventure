import { ArrowLeft, Heart, Sword, Shield, Zap, Sparkles } from 'lucide-react';
import fairyMeetingArt from '../../assets/fairy-meeting.png';
import gracefulSleepArt from '../../assets/Graceful-sleep.png';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Hero, getHeroesByClass } from '../data/heroes';
import { ClassType } from '../data/classes';

interface HeroSelectionProps {
  selectedClass: ClassType;
  onSelectHero: (hero: Hero) => void;
  onBack: () => void;
  ownedItems?: string[];
  equippedItems?: string[];
  onToggleEquip?: (itemId: string) => void;
  backgroundStyle?: string;
  activeBackgroundId?: string;
  activeStyleId?: string;
}

// Helper component for stat bars
const StatBar = ({ label, value, max = 10, colorClass, icon: Icon }: any) => (
  <div className="flex items-center gap-2 mb-1.5">
    <div className={`p-1.5 rounded-lg bg-slate-950/40 border border-white/5 ${colorClass.text}`}>
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div className="flex-grow">
      <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider mb-0.5">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-200">{value}</span>
      </div>
      <div className="h-1.5 bg-slate-900/60 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${colorClass.bg} shadow-[0_0_10px_currentColor]`}
        />
      </div>
    </div>
  </div>
);

export function HeroSelection({ selectedClass, onSelectHero, onBack, backgroundStyle, activeStyleId }: HeroSelectionProps) {
  const getStyleImage = () => {
    switch (activeStyleId) {
      case 'fairy-meeting':
        return fairyMeetingArt;
      case 'Graceful-sleep':
        return gracefulSleepArt;
      default:
        return null;
    }
  };
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [hoveredHero, setHoveredHero] = useState<string | null>(null);

  const heroes = getHeroesByClass(selectedClass.id);

  const handleHeroClick = (hero: Hero) => {
    setSelectedHero(hero.id);
    setTimeout(() => onSelectHero(hero), 600);
  };

  return (
    <div className="size-full flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-950" />
        {backgroundStyle && (
          <div className="absolute inset-0 opacity-40 blur-sm scale-110" style={{ background: backgroundStyle }} />
        )}
        {/* Style Art Overlay */}
        {getStyleImage() && (
          <img src={getStyleImage()} alt="Style Art" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      <div className="max-w-7xl w-full relative z-10 flex flex-col h-full max-h-[90vh]">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12 shrink-0"
        >
          <button
            onClick={onBack}
            className="absolute left-0 top-0 p-3 rounded-full bg-slate-800/40 border border-white/10 text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors backdrop-blur-md group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>

          <h1 className="text-4xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-slate-100 to-slate-400 font-black tracking-tighter uppercase mb-2 drop-shadow-sm">
            {selectedClass.name}
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mx-auto rounded-full mb-3" />
          <p className="text-slate-400 text-sm sm:text-base font-medium tracking-wide">
            Select your champion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 overflow-y-auto px-4 pb-4">
          {heroes.map((hero, index) => {
            const isSelected = selectedHero === hero.id;
            const isHovered = hoveredHero === hero.id;

            return (
              <motion.button
                key={hero.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleHeroClick(hero)}
                onMouseEnter={() => setHoveredHero(hero.id)}
                onMouseLeave={() => setHoveredHero(null)}
                className={`relative group text-left rounded-3xl transition-all duration-500 overflow-hidden ${isSelected
                    ? 'ring-2 ring-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)]'
                    : 'hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]'
                  }`}
              >
                {/* Card Background */}
                <div className={`absolute inset-0 backdrop-blur-xl transition-colors duration-500 ${isSelected ? 'bg-slate-900/80' : 'bg-slate-900/40 group-hover:bg-slate-800/60'
                  }`} />

                {/* Border Gradient */}
                <div className={`absolute inset-0 rounded-3xl border border-white/10 transition-colors duration-500 ${isSelected ? 'border-yellow-500/50' : 'group-hover:border-white/20'
                  }`} />

                <div className="relative p-6 sm:p-8 flex flex-col h-full">
                  {/* Hero Header */}
                  <div className="mb-6 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`text-2xl sm:text-3xl font-black tracking-wider uppercase mb-1 transition-colors duration-300 ${isSelected ? 'text-yellow-400' : 'text-slate-100 group-hover:text-white'
                          }`}>
                          {hero.name}
                        </h3>
                        <p className="text-yellow-500/80 font-serif italic tracking-wide text-sm">
                          {hero.title}
                        </p>
                      </div>
                      {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">Selected</motion.div>}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6 min-h-[60px]">
                    <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                      {hero.description}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                    <StatBar
                      label="Health"
                      value={hero.stats.health}
                      max={150}
                      icon={Heart}
                      colorClass={{ text: 'text-red-400', bg: 'bg-red-500' }}
                    />
                    <StatBar
                      label="Attack"
                      value={hero.stats.attack}
                      max={20}
                      icon={Sword}
                      colorClass={{ text: 'text-orange-400', bg: 'bg-orange-500' }}
                    />
                    <StatBar
                      label="Defense"
                      value={hero.stats.defense}
                      max={10}
                      icon={Shield}
                      colorClass={{ text: 'text-blue-400', bg: 'bg-blue-500' }}
                    />
                    <StatBar
                      label="Speed"
                      value={hero.stats.speed}
                      max={10}
                      icon={Zap}
                      colorClass={{ text: 'text-yellow-400', bg: 'bg-yellow-500' }}
                    />
                  </div>

                  {/* Unique Ability */}
                  {hero.uniqueAbility && (
                    <div className={`mt-auto p-4 rounded-xl border transition-all duration-300 ${isSelected
                        ? 'bg-purple-900/20 border-purple-500/50'
                        : 'bg-white/5 border-white/5 group-hover:bg-white/10'
                      }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className={`w-4 h-4 ${isSelected ? 'text-purple-300' : 'text-purple-400'}`} />
                        <span className={`text-xs uppercase tracking-wider font-bold ${isSelected ? 'text-purple-200' : 'text-purple-300'}`}>
                          {hero.uniqueAbility.name}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs">
                        {hero.uniqueAbility.description}
                      </p>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
