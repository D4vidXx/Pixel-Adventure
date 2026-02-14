import { ArrowLeft, Heart, Sword, Shield, Zap, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Hero, getHeroesByClass } from '../data/heroes';
import { ClassType } from '../data/classes';

interface HeroSelectionProps {
  selectedClass: ClassType;
  onSelectHero: (hero: Hero) => void;
  onBack: () => void;
}

export function HeroSelection({ selectedClass, onSelectHero, onBack }: HeroSelectionProps) {
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [hoveredHero, setHoveredHero] = useState<string | null>(null);
  
  const heroes = getHeroesByClass(selectedClass.id);

  const handleHeroClick = (hero: Hero) => {
    setSelectedHero(hero.id);
    setTimeout(() => onSelectHero(hero), 500);
  };

  return (
    <div className="size-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-auto">
      <div className="max-w-7xl w-full">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-5xl text-slate-100 mb-3 tracking-wider uppercase">
            Choose Your {selectedClass.name}
          </h1>
          <p className="text-slate-400 text-sm sm:text-lg">
            Select a hero to begin your adventure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {heroes.map((hero, index) => {
            const isSelected = selectedHero === hero.id;
            const isHovered = hoveredHero === hero.id;

            return (
              <motion.button
                key={hero.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleHeroClick(hero)}
                onMouseEnter={() => setHoveredHero(hero.id)}
                onMouseLeave={() => setHoveredHero(null)}
                className={`group bg-slate-800 border-4 p-4 sm:p-6 transition-all duration-300 text-left ${
                  isSelected
                    ? 'border-yellow-500 bg-yellow-900/20'
                    : 'border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex flex-col h-full">
                  {/* Hero Name & Title */}
                  <div className="mb-4">
                    <h3 className="text-xl sm:text-2xl text-slate-100 tracking-wider uppercase mb-1">
                      {hero.name}
                    </h3>
                    <p className="text-yellow-500 text-sm italic tracking-wide">
                      {hero.title}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-sm mb-4 flex-grow">
                    {hero.description}
                  </p>

                  {/* Unique Ability */}
                  {hero.uniqueAbility && (
                    <div className="mb-4 p-3 bg-slate-900/50 border border-purple-700/50 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-400 text-xs uppercase tracking-wider font-bold">
                          {hero.uniqueAbility.name}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs">
                        {hero.uniqueAbility.description}
                      </p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 p-2 bg-slate-900/50 border border-slate-700 rounded">
                      <Heart className="w-4 h-4 text-red-400" />
                      <div>
                        <p className="text-slate-500 text-xs uppercase">HP</p>
                        <p className="text-slate-100 font-bold">{hero.stats.health}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-900/50 border border-slate-700 rounded">
                      <Sword className="w-4 h-4 text-orange-400" />
                      <div>
                        <p className="text-slate-500 text-xs uppercase">ATK</p>
                        <p className="text-slate-100 font-bold">{hero.stats.attack}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-900/50 border border-slate-700 rounded">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-slate-500 text-xs uppercase">DEF</p>
                        <p className="text-slate-100 font-bold">{hero.stats.defense}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-900/50 border border-slate-700 rounded">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <div>
                        <p className="text-slate-500 text-xs uppercase">SPD</p>
                        <p className="text-slate-100 font-bold">{hero.stats.speed}</p>
                      </div>
                    </div>
                  </div>

                  {/* Select Button */}
                  <motion.div
                    animate={isHovered ? { x: 5 } : { x: 0 }}
                    className={`text-center py-2 border-t-2 ${
                      isSelected ? 'border-yellow-500' : 'border-slate-700'
                    }`}
                  >
                    <span className={`tracking-wide uppercase text-sm ${
                      isSelected ? 'text-yellow-400' : 'text-slate-300'
                    }`}>
                      {isSelected ? 'Selected! ✓' : 'Select Hero →'}
                    </span>
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 border-2 border-slate-600 hover:border-slate-500 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="tracking-wide uppercase">Back to Classes</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
