import { Skull, Play, Settings, Sparkles, Diamond, ShoppingBag, ScrollText, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ParticleBackground } from './ParticleBackground';
import { useState, useEffect } from 'react';
import { PatchNotesModal } from './PatchNotesModal';
import animeStyleArt from '../../assets/anime-style-gacha.png';
import mountainStyleArt from '../../assets/serene-japanese-mountainscape.png';

interface MainMenuProps {
  onPlay: () => void;
  onSettings: () => void;
  onShop: () => void;
  onBackgroundShop: () => void;
  onStyleGacha: (styleId: string) => void;
  diamonds: number;
  backgroundStyle?: string;
  activeStyleId?: string;
  activeBackgroundId?: string;
}

export function MainMenu({ onPlay, onSettings, onShop, onBackgroundShop, onStyleGacha, diamonds, backgroundStyle, activeStyleId, activeBackgroundId }: MainMenuProps) {
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const [hasNewPatchNotes, setHasNewPatchNotes] = useState(false);

  useEffect(() => {
    // Check if user has seen the latest patch notes
    const lastSeenPatchVersion = localStorage.getItem('lastSeenPatchVersion');
    const currentVersion = '1.5.3';
    
    if (lastSeenPatchVersion !== currentVersion) {
      setHasNewPatchNotes(true);
      setShowPatchNotes(true);
    }
  }, []);

  const showDecorations = activeStyleId !== 'classic';
  const isGachaStyle = activeStyleId === 'anime-prism' || activeStyleId === 'japanese-mountainscape';
  const getStyleImage = () => activeStyleId === 'japanese-mountainscape' ? mountainStyleArt : animeStyleArt;
  const needsTextBoost = activeBackgroundId === 'anime-skies';

  const baseBackgroundStyle = isGachaStyle 
    ? 'radial-gradient(circle_at_50%_50%, #1a1d2e, #0f1117)'
    : (backgroundStyle ?? 'radial-gradient(circle_at_20%_15%, rgba(255,236,179,0.35), transparent 55%), linear-gradient(180deg, rgba(18,126,150,1) 0%, rgba(10,88,105,1) 48%, rgba(10,74,88,1) 68%, rgba(8,56,68,1) 100%)');

  // Sorry Package claim logic
  const [sorryClaimed, setSorryClaimed] = useState(() => localStorage.getItem('pixelAdventure_sorryPackageClaimed') === 'true');
  const [showSorryAnim, setShowSorryAnim] = useState(false);
  const handleSorryClaim = () => {
    if (!sorryClaimed) {
      const diamonds = parseInt(localStorage.getItem('pixelAdventure_diamonds') || '0', 10);
      localStorage.setItem('pixelAdventure_diamonds', (diamonds + 5000).toString());
      localStorage.setItem('pixelAdventure_sorryPackageClaimed', 'true');
      setSorryClaimed(true);
      setShowSorryAnim(true);
      setTimeout(() => {
        setShowSorryAnim(false);
        window.location.reload(); // force update diamonds in UI
      }, 2200);
    }
  };
        {/* Sorry Package Animation */}
        {showSorryAnim && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="relative">
              {/* Confetti burst */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl animate-bounce">🎉</span>
                <span className="text-6xl animate-spin">💎</span>
                <span className="text-6xl animate-bounce">🎉</span>
              </div>
              <div className="relative bg-yellow-400/90 border border-yellow-500 rounded-2xl px-8 py-6 shadow-xl flex flex-col items-center">
                <span className="text-3xl font-black text-yellow-900 mb-2">5000 Diamonds Claimed!</span>
                <span className="text-lg text-yellow-700">Thank you for your patience.</span>
              </div>
            </div>
          </motion.div>
        )}

  return (
    <div className="size-full flex items-center justify-center overflow-hidden relative px-4 py-8">
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Pirate Beach Background */}
        <div className="absolute inset-0" style={{ background: baseBackgroundStyle }} />

        {needsTextBoost && (
          <div className="absolute inset-0 bg-slate-950/35" />
        )}

        {showDecorations && !isGachaStyle && (
          <>
            {/* Sun Glow */}
            <div className="absolute top-[-6%] right-[6%] w-[260px] h-[260px] bg-[radial-gradient(circle,rgba(255,214,102,0.95),rgba(255,214,102,0.2),transparent_70%)] blur-[2px]" />

            {/* Clouds */}
            <motion.div
              animate={{ x: [0, 80, 0], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[8%] left-[-10%] w-[50%] h-[20%] bg-white/10 rounded-full blur-[50px]"
            />
            <motion.div
              animate={{ x: [0, -60, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[18%] right-[-12%] w-[45%] h-[18%] bg-white/10 rounded-full blur-[55px]"
            />

            {/* Ocean shimmer */}
            <motion.div
              animate={{ opacity: [0.2, 0.45, 0.2], y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-x-0 top-[52%] h-[18%] bg-[linear-gradient(180deg,rgba(56,189,248,0.2),rgba(56,189,248,0.05),transparent)]"
            />

            {/* Pirate ships */}
            <motion.div
              animate={{ x: ['-20%', '115%'], y: [0, -8, 0], rotate: [0, 1, 0] }}
              transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
              className="absolute top-[52%] left-0 drop-shadow-[0_8px_10px_rgba(2,28,36,0.45)]"
            >
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden>
                <path d="M10 58H112L92 72H28L10 58Z" fill="#4b2e1a" />
                <rect x="58" y="18" width="4" height="40" fill="#3b2a1a" />
                <path d="M60 20L90 42H60V20Z" fill="#f1f5f9" />
                <path d="M60 28L84 44H60V28Z" fill="#e2e8f0" />
                <path d="M24 54C40 50 70 50 96 54" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              </svg>
            </motion.div>
            <motion.div
              animate={{ x: ['-25%', '120%'], y: [0, -6, 0], rotate: [0, 1, 0] }}
              transition={{ duration: 42, repeat: Infinity, ease: "linear", delay: 12 }}
              className="absolute top-[62%] left-0 drop-shadow-[0_10px_12px_rgba(2,28,36,0.5)]"
            >
              <svg width="150" height="96" viewBox="0 0 150 96" fill="none" aria-hidden>
                <path d="M14 70H140L114 88H36L14 70Z" fill="#5b381f" />
                <rect x="78" y="18" width="5" height="52" fill="#3b2a1a" />
                <path d="M80 20L120 48H80V20Z" fill="#f8fafc" />
                <path d="M80 32L112 52H80V32Z" fill="#e2e8f0" />
                <path d="M30 66C52 62 90 62 124 66" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              </svg>
            </motion.div>
            <motion.div
              animate={{ x: ['-30%', '125%'], y: [0, -5, 0], rotate: [0, 1, 0] }}
              transition={{ duration: 48, repeat: Infinity, ease: "linear", delay: 22 }}
              className="absolute top-[46%] left-0 drop-shadow-[0_6px_8px_rgba(2,28,36,0.4)]"
            >
              <svg width="96" height="64" viewBox="0 0 96 64" fill="none" aria-hidden>
                <path d="M8 46H90L74 58H24L8 46Z" fill="#4b2e1a" />
                <rect x="48" y="14" width="3" height="32" fill="#3b2a1a" />
                <path d="M50 16L74 34H50V16Z" fill="#f1f5f9" />
                <path d="M18 44C32 40 58 40 76 44" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              </svg>
            </motion.div>

            {/* Flagship */}
            <motion.div
              animate={{ x: ['45%', '130%'], y: [0, -10, 0], rotate: [0, 1.2, 0] }}
              transition={{ duration: 56, repeat: Infinity, ease: "linear", delay: 6 }}
              className="absolute top-[57%] left-0 z-0 drop-shadow-[0_14px_16px_rgba(2,28,36,0.55)] opacity-85"
            >
              <svg width="220" height="130" viewBox="0 0 220 130" fill="none" aria-hidden>
                <path d="M16 88H210L178 118H52L16 88Z" fill="#5b3a1f" />
                <rect x="116" y="18" width="6" height="70" fill="#3b2a1a" />
                <path d="M118 20L176 58H118V20Z" fill="#f8fafc" />
                <path d="M118 38L164 68H118V38Z" fill="#e2e8f0" />
                <rect x="102" y="24" width="4" height="64" fill="#3b2a1a" />
                <path d="M104 28L68 56H104V28Z" fill="#f1f5f9" />
                <path d="M104 44L76 68H104V44Z" fill="#e2e8f0" />
                <path d="M122 24L154 34L122 44V24Z" fill="#1f2937" />
                <path d="M130 30L134 30M128 33L136 33M130 36L134 36" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M46 86C70 80 116 80 170 86" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              </svg>
            </motion.div>

            {/* Sand Dunes */}
            <div className="absolute inset-x-0 bottom-0 h-[22%] bg-[linear-gradient(180deg,rgba(253,224,140,0.85),rgba(251,191,36,0.55),rgba(180,93,20,0.35))]" />

            {/* Island silhouette */}
            <div className="absolute inset-x-0 bottom-[14%] h-[6%] bg-[linear-gradient(90deg,transparent,rgba(7,44,52,0.55),rgba(7,44,52,0.55),transparent)] blur-[1px]" />

            {/* Particles */}
            <ParticleBackground />
          </>
        )}

        {isGachaStyle && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(244,114,182,0.28),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_24%,rgba(96,165,250,0.22),transparent_60%)]" />
            <motion.div
              animate={{ opacity: [0.25, 0.45, 0.25], y: [0, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-x-0 top-[12%] h-[18%] bg-[linear-gradient(180deg,rgba(248,250,252,0.18),transparent)]"
            />
            <motion.div
              animate={{ x: ['-20%', '120%'], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute top-[18%] left-0 w-[140px] h-[28px] rounded-full bg-white/20 blur-[10px]"
            />
            <motion.div
              animate={{ x: ['-30%', '120%'], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear', delay: 3 }}
              className="absolute top-[28%] left-0 w-[180px] h-[36px] rounded-full bg-white/15 blur-[12px]"
            />
            <motion.div
              animate={{ y: [0, -16, 0], opacity: [0.35, 0.6, 0.35] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[22%] right-[6%] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(190,242,100,0.25),transparent_70%)]"
            />
            <motion.div
              animate={{ opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 pointer-events-none"
            >
              <img
                src={getStyleImage()}
                alt=""
                className="w-full h-full object-cover opacity-35"
              />
            </motion.div>

            <ParticleBackground />
          </>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center relative z-10 -translate-y-4 sm:-translate-y-6"
      >
        {/* Game Title Section */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-10 sm:mb-16 relative"
        >
          {/* Decorative Glow */}
          <div className="absolute inset-0 bg-red-600/12 blur-[40px] rounded-full scale-125 -z-10" />

          <motion.div
            animate={{
              rotate: [0, 3, -3, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex items-center justify-center mb-6"
          >
            <div className="relative">
              <motion.div
                animate={{ opacity: [0.45, 0.85, 0.45], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-500/45 blur-xl rounded-full"
              />
              <Skull className="w-14 h-14 sm:w-20 sm:h-20 text-red-500 relative" strokeWidth={1.5} />
            </div>
          </motion.div>

          <div className="relative inline-block">
            <motion.h1
              animate={{
                textShadow: [
                  "0 0 10px rgba(239,68,68,0.2)",
                  "0 0 22px rgba(239,68,68,0.35)",
                  "0 0 10px rgba(239,68,68,0.2)"
                ],
                backgroundImage: [
                  "linear-gradient(to right, #f1f5f9, #ef4444, #f1f5f9)",
                  "linear-gradient(to right, #ef4444, #f1f5f9, #ef4444)",
                  "linear-gradient(to right, #f1f5f9, #ef4444, #f1f5f9)"
                ]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', backgroundSize: '200% auto' }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-100 tracking-tighter uppercase mb-2 italic"
            >
              Pixel Adventure
            </motion.h1>

            <motion.div
              animate={{ opacity: [0, 1, 0], x: [-20, 20, -20] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-8"
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </div>

          <p className="text-red-400/80 tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[10px] sm:text-xs font-bold mt-4">
            A Legendary Roguelike Journey
          </p>

          {/* Footer info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ delay: 1.5, duration: 3, repeat: Infinity }}
            className="mt-6 text-cyan-100/80 text-[10px] tracking-[0.3em] sm:tracking-[0.5em] uppercase font-medium"
          >
            v1.5.3 // Angry Marshmallow Group
          </motion.div>
        </motion.div>

        {/* Menu Buttons Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col gap-4 sm:gap-5 min-w-[260px] sm:min-w-[320px]"
        >
                    {/* Sorry Package Button */}
                    {!sorryClaimed && !showSorryAnim && (
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSorryClaim}
                        className="group px-8 py-4 bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 rounded-2xl transition-all duration-300 backdrop-blur-md font-bold tracking-widest uppercase"
                      >
                        <span className="text-lg">🪙</span> Claim Sorry Package (+5000 Diamonds)
                      </motion.button>
                    )}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 26px rgba(239, 68, 68, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onPlay}
            className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-red-600/20 hover:bg-red-600/30 text-white border border-red-500/60 rounded-2xl transition-all duration-300 backdrop-blur-md overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="relative flex items-center justify-center gap-3">
              <Play className="w-6 h-6 text-red-500 group-hover:text-red-400 transition-colors" />
              <span className="text-lg font-bold tracking-widest uppercase">Enter Dungeon</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 26px rgba(6, 182, 212, 0.35)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onShop}
            className="group relative px-10 py-5 bg-cyan-600/20 hover:bg-cyan-600/30 text-white border border-cyan-500/60 rounded-2xl transition-all duration-300 backdrop-blur-md overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="relative flex items-center justify-center gap-3">
              <ShoppingBag className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="text-sm font-bold tracking-widest uppercase">Equipment Shop</span>
              <div className="flex items-center gap-1 ml-2 bg-cyan-500/20 px-2 py-0.5 rounded-lg">
                <Diamond className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-300">{diamonds}</span>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onSettings}
            className="group px-10 py-5 bg-white/5 text-slate-300 border border-white/10 rounded-2xl transition-all duration-300 backdrop-blur-md"
          >
            <div className="flex items-center justify-center gap-3">
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-sm font-medium tracking-widest uppercase">Settings & Audio</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(168, 85, 247, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowPatchNotes(true);
              setHasNewPatchNotes(false);
              localStorage.setItem('lastSeenPatchVersion', '1.5.3');
            }}
            className="group relative px-10 py-4 bg-purple-500/5 text-purple-300/80 border border-purple-500/20 rounded-xl transition-all duration-300 backdrop-blur-md hover:border-purple-500/40"
          >
            {hasNewPatchNotes && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/50"
              >
                <div className="w-2 h-2 bg-red-300 rounded-full" />
              </motion.div>
            )}
            <div className="flex items-center justify-center gap-3">
              <ScrollText className="w-4 h-4 group-hover:text-purple-300 transition-colors" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">Patch Notes</span>
            </div>
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 z-20 w-[calc(100%-1rem)] sm:w-auto flex items-center justify-center sm:justify-start flex-wrap gap-2 sm:gap-4">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={onBackgroundShop}
          className="flex items-center gap-2"
        >
          <span className="size-12 rounded-full bg-cyan-500/20 border border-cyan-300/40 backdrop-blur-md flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Image className="w-5 h-5 text-cyan-200" />
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.3em] text-cyan-100/80 font-semibold">Backgrounds</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(244, 114, 182, 0.35)" }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onStyleGacha('anime-prism')}
          className="flex items-center gap-2"
        >
          <span className="size-12 rounded-full bg-pink-500/20 border border-pink-400/40 backdrop-blur-md flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Sparkles className="w-5 h-5 text-pink-300" />
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.3em] text-pink-100/80 font-semibold">Anime Gacha</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(147, 197, 253, 0.35)" }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onStyleGacha('japanese-mountainscape')}
          className="flex items-center gap-2"
        >
          <span className="size-12 rounded-full bg-blue-500/20 border border-blue-400/40 backdrop-blur-md flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-blue-300" />
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.15em] text-blue-100/80 font-semibold">Mountain Gacha</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showPatchNotes && <PatchNotesModal onClose={() => setShowPatchNotes(false)} />}
      </AnimatePresence>
    </div>
  );
}

