import { ArrowLeft, Diamond, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { GACHA_STYLE_ID, getStyleById } from '../data/styles';
import animeStyleArt from '../../assets/anime-style-gacha.png';
import mountainStyleArt from '../../assets/serene-japanese-mountainscape.png';

interface StyleGachaProps {
  diamonds: number;
  ownedStyles: string[];
  activeStyleId: string;
  onUnlockStyle: (styleId: string) => void;
  onSelectStyle: (styleId: string) => void;
  onSpendDiamonds: (amount: number) => void;
  onBack: () => void;
  backgroundStyle?: string;
  styleId?: string; // Which gacha style to pull for (defaults to anime-prism)
}

const BASE_ROLL_COST = 50;
const DAILY_DISCOUNT_RATE = 0.5;
const PITY_TARGET = 100;
const STYLE_ODDS = 0.005;

const getStyleImage = (styleId: string): string => {
  switch (styleId) {
    case 'anime-prism':
      return animeStyleArt;
    case 'japanese-mountainscape':
      return mountainStyleArt;
    default:
      return animeStyleArt;
  }
};

export function StyleGacha({
  diamonds,
  ownedStyles,
  activeStyleId,
  onUnlockStyle,
  onSelectStyle,
  onSpendDiamonds,
  onBack,
  backgroundStyle,
  styleId = GACHA_STYLE_ID,
}: StyleGachaProps) {
  const style = getStyleById(styleId);
  const [rollCount, setRollCount] = useState<number>(() => {
    const saved = localStorage.getItem(`pixelAdventure_styleGachaRolls_${styleId}`);
    const parsed = saved ? parseInt(saved, 10) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  });
  const [lastDiscountDate, setLastDiscountDate] = useState<string | null>(() =>
    localStorage.getItem(`pixelAdventure_styleGachaDiscountDate_${styleId}`)
  );
  const [result, setResult] = useState<'idle' | 'hit' | 'pity' | 'miss'>('idle');

  const todayKey = new Date().toISOString().slice(0, 10);
  const hasDiscount = lastDiscountDate !== todayKey;
  const rollCost = Math.ceil(BASE_ROLL_COST * (hasDiscount ? DAILY_DISCOUNT_RATE : 1));

  if (!style) return null;

  const isMountainStyle = style.id === 'japanese-mountainscape';
  const owned = ownedStyles.includes(style.id);
  const pityRemaining = owned ? 0 : Math.max(PITY_TARGET - rollCount, 0);
  const pityProgress = owned ? 100 : Math.min((rollCount / PITY_TARGET) * 100, 100);
  const canRoll = !owned && diamonds >= rollCost;

  const persistRolls = (count: number) => {
    localStorage.setItem(`pixelAdventure_styleGachaRolls_${styleId}`, count.toString());
  };

  const persistDiscountDate = (value: string) => {
    localStorage.setItem(`pixelAdventure_styleGachaDiscountDate_${styleId}`, value);
  };

  const handleRoll = () => {
    if (!canRoll) return;
    onSpendDiamonds(rollCost);

    if (hasDiscount) {
      setLastDiscountDate(todayKey);
      persistDiscountDate(todayKey);
    }

    const nextCount = rollCount + 1;
    const isPity = nextCount >= PITY_TARGET;
    const hit = isPity || Math.random() < STYLE_ODDS;

    if (hit) {
      onUnlockStyle(style.id);
      setRollCount(0);
      persistRolls(0);
      setResult(isPity ? 'pity' : 'hit');
    } else {
      setRollCount(nextCount);
      persistRolls(nextCount);
      setResult('miss');
    }
  };

  const handleRollTen = () => {
    if (!canRoll || diamonds < rollCost * 10) return;
    
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        onSpendDiamonds(rollCost);

        if (i === 0 && hasDiscount) {
          setLastDiscountDate(todayKey);
          persistDiscountDate(todayKey);
        }

        const nextCount = rollCount + i + 1;
        const isPity = nextCount >= PITY_TARGET;
        const hit = isPity || Math.random() < STYLE_ODDS;

        if (hit) {
          onUnlockStyle(style.id);
          setRollCount(0);
          persistRolls(0);
          setResult(isPity ? 'pity' : 'hit');
        } else {
          setRollCount(nextCount);
          persistRolls(nextCount);
          if (i === 9) setResult('miss');
        }
      }, i * 200);
    }
  };

  return (
    <div className="size-full flex items-start justify-center p-2 sm:p-6 overflow-y-auto overflow-x-hidden relative">
      <div
        className="absolute inset-0"
        style={{
          background: backgroundStyle ?? 'radial-gradient(circle_at_50%_50%, #111827, #020617)',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,114,182,0.2),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(96,165,250,0.18),transparent_60%)]" />
      <img
        src={getStyleImage(styleId)}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 my-2 sm:my-4 w-full max-w-5xl max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-3rem)] bg-slate-950/70 backdrop-blur-2xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-8 py-4 sm:py-6 border-b border-white/10 bg-gradient-to-b from-slate-950/20 to-transparent">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Style Gacha</p>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase">Prism Capsule</h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 bg-slate-900/60 border border-pink-400/30 rounded-xl px-3 sm:px-4 py-2">
              <Diamond className="w-5 h-5 text-pink-300" />
              <span className="text-base sm:text-lg font-black text-pink-100">{diamonds}</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-widest text-white/50">Diamonds</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBack}
              className="sm:hidden px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 uppercase tracking-[0.12em] text-[10px] font-bold flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </motion.button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-8 flex flex-col gap-5 sm:gap-8">
          {/* Style Spotlight Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.5rem] sm:rounded-[2rem] border border-pink-400/30 bg-gradient-to-br from-pink-500/15 via-slate-900/70 to-blue-500/15 p-4 sm:p-12 text-center overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,114,182,0.2),transparent_70%)]" />
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block mb-4 sm:mb-6"
              >
                <Star className="w-10 h-10 sm:w-12 sm:h-12 text-pink-300" />
              </motion.div>
              <p className="text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.15em] text-pink-200/70">Exclusive Style</p>
              <h3 className="text-xl sm:text-4xl font-black text-white uppercase tracking-wide mt-2 break-words">{style.name}</h3>
              <p className="text-xs sm:text-sm text-white/70 mt-3 sm:mt-4 max-w-2xl mx-auto">{style.description}</p>
              
              {/* Style Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-5 sm:mt-8"
              >
                <div className="w-full max-w-[14rem] sm:max-w-sm mx-auto aspect-[16/9] rounded-2xl border border-pink-400/30 shadow-2xl shadow-pink-500/20 overflow-hidden">
                  <img
                    src={getStyleImage(styleId)}
                    alt="{style.name} Style Preview"
                    className={`w-full h-full ${isMountainStyle ? 'object-cover object-[center_12%]' : 'object-cover object-center'}`}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Info and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-4 sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2">Drop Odds</p>
              <p className="text-2xl font-black text-pink-100">0.5%</p>
              <p className="text-xs text-white/40 mt-1">Guaranteed at 100</p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-4 sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2">Pity Progress</p>
              <p className="text-2xl font-black text-blue-100">{rollCount}/{PITY_TARGET}</p>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-3">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 transition-all"
                  style={{ width: `${pityProgress}%` }}
                />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-4 sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2">Your Diamonds</p>
              <div className="flex items-center gap-2">
                <Diamond className="w-5 h-5 text-pink-300" />
                <p className="text-2xl font-black text-pink-100">{diamonds}</p>
              </div>
              {hasDiscount && !owned && (
                <p className="text-xs text-emerald-200 bg-emerald-500/20 px-2 py-1 rounded-md mt-2 inline-block">50% off today</p>
              )}
            </div>
          </div>

          {/* Result Display */}
          <AnimatePresence mode="wait">
            {result !== 'idle' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-[1.5rem] sm:rounded-[2rem] border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-amber-500/20 p-5 sm:p-8 text-center"
              >
                {result === 'miss' && (
                  <div>
                    <p className="text-lg text-white/80">The prism flickers...</p>
                    <p className="text-sm text-white/60 mt-2">No style appears. Try again.</p>
                  </div>
                )}
                {(result === 'hit' || result === 'pity') && (
                  <div>
                    <p className="text-xl sm:text-3xl font-black text-pink-100 uppercase tracking-[0.12em] sm:tracking-widest">✨ {style.name} Unlocked ✨</p>
                    <p className="text-sm text-white/70 mt-2">
                      {result === 'pity' ? 'Pity broke through! The style is yours.' : 'A rare shimmer breaks through!'}
                    </p>
                    {activeStyleId !== style.id && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectStyle(style.id)}
                        className="mt-4 px-6 py-2 rounded-xl border border-emerald-400/60 bg-emerald-500/30 text-emerald-100 text-xs font-black uppercase tracking-[0.25em]"
                      >
                        Apply Style Now
                      </motion.button>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={canRoll ? { scale: 1.05, boxShadow: "0 0 20px rgba(244, 114, 182, 0.4)" } : {}}
              whileTap={canRoll ? { scale: 0.95 } : {}}
              onClick={handleRoll}
              disabled={!canRoll}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-2xl border text-sm font-black uppercase tracking-[0.18em] sm:tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                canRoll
                  ? 'bg-pink-500/20 border-pink-400/50 text-pink-100 hover:bg-pink-500/30'
                  : 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Draw One ({rollCost})
            </motion.button>

            <motion.button
              whileHover={canRoll && diamonds >= rollCost * 10 ? { scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" } : {}}
              whileTap={canRoll && diamonds >= rollCost * 10 ? { scale: 0.95 } : {}}
              onClick={handleRollTen}
              disabled={!canRoll || diamonds < rollCost * 10}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-2xl border text-sm font-black uppercase tracking-[0.18em] sm:tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                canRoll && diamonds >= rollCost * 10
                  ? 'bg-blue-500/20 border-blue-400/50 text-blue-100 hover:bg-blue-500/30'
                  : 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              <Star className="w-4 h-4" />
              Draw Ten ({rollCost * 10})
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
