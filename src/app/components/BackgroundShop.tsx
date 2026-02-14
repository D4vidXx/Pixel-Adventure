import { ArrowLeft, Diamond, Image, Lock } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { BACKGROUND_OPTIONS } from '../data/backgrounds';
import { STYLE_OPTIONS } from '../data/styles';

interface BackgroundShopProps {
  diamonds: number;
  ownedBackgrounds: string[];
  activeBackgroundId: string;
  onBuyBackground: (backgroundId: string, cost: number) => void;
  onSelectBackground: (backgroundId: string) => void;
  ownedStyles: string[];
  activeStyleId: string;
  onSelectStyle: (styleId: string) => void;
  onBack: () => void;
  backgroundStyle?: string;
}

export function BackgroundShop({
  diamonds,
  ownedBackgrounds,
  activeBackgroundId,
  onBuyBackground,
  onSelectBackground,
  ownedStyles,
  activeStyleId,
  onSelectStyle,
  onBack,
  backgroundStyle,
}: BackgroundShopProps) {
  const [activeTab, setActiveTab] = useState<'backgrounds' | 'styles'>('backgrounds');
  const canAfford = (cost: number) => diamonds >= cost;

  return (
    <div className="size-full flex items-center justify-center p-6 overflow-hidden relative">
      <div
        className="absolute inset-0"
        style={{
          background: backgroundStyle ?? 'linear-gradient(180deg, #0b1b3a 0%, #143d6b 45%, #1b6ca8 70%, #2ab0d8 100%)',
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.12, 0.08] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-cyan-500/10 rounded-full blur-[110px]"
      />
      <motion.div
        animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-5xl h-full max-h-[90vh] bg-slate-950/55 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Image className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Background Shop</h2>
              <p className="text-xs text-white/60 tracking-widest uppercase mt-1">Unlock looks for the entire world</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/70 border border-cyan-500/30 rounded-xl px-5 py-3">
            <Diamond className="w-5 h-5 text-cyan-400" />
            <span className="text-xl font-black text-cyan-200">{diamonds}</span>
            <span className="text-xs text-white/60 uppercase tracking-wider">Diamonds</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('backgrounds')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${activeTab === 'backgrounds'
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-100'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
            >
              Backgrounds
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('styles')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${activeTab === 'styles'
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-100'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
            >
              Styles
            </button>
          </div>

          {activeTab === 'styles' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.35em] text-white/70">Styles</h3>
                <span className="text-[10px] uppercase tracking-widest text-white/50">Themes by update</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STYLE_OPTIONS.map((style) => {
                  const isActive = activeStyleId === style.id;
                  const owned = ownedStyles.includes(style.id);
                  return (
                    <div key={style.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">{style.name}</h4>
                          <p className="text-[11px] text-white/60 mt-1">{style.description}</p>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-cyan-200/80 bg-cyan-500/15 border border-cyan-400/30 px-2 py-1 rounded-full whitespace-nowrap">
                          {style.badge}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        {isActive ? (
                          <span className="text-[10px] uppercase tracking-widest text-emerald-200 bg-emerald-500/15 border border-emerald-400/30 px-2 py-1 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase tracking-widest text-white/40">&nbsp;</span>
                        )}
                        <motion.button
                          whileHover={owned ? { scale: 1.03 } : {}}
                          whileTap={owned ? { scale: 0.97 } : {}}
                          onClick={() => onSelectStyle(style.id)}
                          disabled={!owned}
                          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${owned
                            ? isActive
                              ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                              : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-100 hover:bg-cyan-500/35'
                            : 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                            }`}
                        >
                          {owned ? (isActive ? 'Selected' : 'Use') : 'Locked'}
                        </motion.button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'backgrounds' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {BACKGROUND_OPTIONS.map((background) => {
                const owned = ownedBackgrounds.includes(background.id);
                const active = activeBackgroundId === background.id;
                const affordable = canAfford(background.cost);

                return (
                  <motion.div
                    key={background.id}
                    whileHover={{ y: -2 }}
                    className={`rounded-3xl border p-5 transition-all ${active
                      ? 'border-cyan-400/70 shadow-lg shadow-cyan-500/20'
                      : owned
                        ? 'border-white/15'
                        : 'border-white/10'
                      } bg-slate-900/40`}
                  >
                    <div className="h-32 rounded-2xl border border-white/10" style={{ background: background.style }} />
                    <div className="flex items-start justify-between gap-4 mt-4">
                      <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide">{background.name}</h3>
                        <p className="text-xs text-white/60 mt-1">{background.description}</p>
                      </div>
                      {active && (
                        <span className="text-[10px] uppercase tracking-widest text-cyan-200 bg-cyan-500/20 border border-cyan-500/30 px-2 py-1 rounded-full">Active</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Diamond className={`w-4 h-4 ${owned ? 'text-emerald-300' : affordable ? 'text-cyan-300' : 'text-white/30'}`} />
                        <span className={`text-sm font-bold ${owned ? 'text-emerald-200 line-through' : affordable ? 'text-cyan-200' : 'text-white/40'}`}>
                          {background.cost}
                        </span>
                        {owned && <span className="text-[10px] text-emerald-200 uppercase tracking-widest">Owned</span>}
                      </div>

                      {!owned ? (
                        <motion.button
                          whileHover={affordable ? { scale: 1.03 } : {}}
                          whileTap={affordable ? { scale: 0.97 } : {}}
                          onClick={() => onBuyBackground(background.id, background.cost)}
                          disabled={!affordable}
                          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${affordable
                            ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-100 hover:bg-cyan-500/35'
                            : 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                            }`}
                        >
                          Buy
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => onSelectBackground(background.id)}
                          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${active
                            ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                            }`}
                        >
                          {active ? 'Selected' : 'Use'}
                        </motion.button>
                      )}
                    </div>

                    {!owned && !affordable && (
                      <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40">
                        <Lock className="w-3 h-3" />
                        Need more diamonds
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-6 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 uppercase tracking-widest text-xs font-bold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </motion.button>

          <div className="text-[10px] uppercase tracking-widest text-white/50">
            {ownedBackgrounds.length} / {BACKGROUND_OPTIONS.length} unlocked
          </div>
        </div>
      </motion.div>
    </div>
  );
}
