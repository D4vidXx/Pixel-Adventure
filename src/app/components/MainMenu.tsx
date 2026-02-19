import { Skull, Play, Settings, Sparkles, Diamond, ShoppingBag, ScrollText, Image, Flower, ChevronLeft, ChevronRight, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ParticleBackground } from './ParticleBackground';
import { useState, useEffect } from 'react';
import { PatchNotesModal } from './PatchNotesModal';
import animeStyleArt from '../../assets/anime-style-gacha.png';
import mountainStyleArt from '../../assets/serene-japanese-mountainscape.png';
import animeForestStyleArt from '../../assets/anime-forest.png';
import { Difficulty, DIFFICULTY_CONFIG } from '../data/difficulty';

interface MainMenuProps {
  onPlay: () => void;
  onSettings: () => void;
  onShop: () => void;
  onBackgroundShop: () => void;
  onStyleGacha: (styleId: string) => void;
  onClaimGift: (styleId: string) => void;
  diamonds: number;
  backgroundStyle?: string;
  activeStyleId?: string;
  activeBackgroundId?: string;
  ownedStyles: string[];
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export function MainMenu({
  onPlay,
  onSettings,
  onShop,
  onBackgroundShop,
  onStyleGacha,
  onClaimGift,
  diamonds,
  backgroundStyle,
  activeStyleId,
  activeBackgroundId,
  ownedStyles,
  difficulty,
  onDifficultyChange
}: MainMenuProps) {
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const [hasNewPatchNotes, setHasNewPatchNotes] = useState(false);

  useEffect(() => {
    // Check if user has seen the latest patch notes
    const lastSeenPatchVersion = localStorage.getItem('lastSeenPatchVersion');
    const currentVersion = '1.6.1';

    if (lastSeenPatchVersion !== currentVersion) {
      setHasNewPatchNotes(true);
      setShowPatchNotes(true);
    }
  }, []);

  const showDecorations = activeStyleId !== 'classic';
  const isGachaStyle = activeStyleId === 'anime-prism' || activeStyleId === 'japanese-mountainscape' || activeStyleId === 'fairy-forest';
  const getStyleImage = () => {
    if (activeStyleId === 'japanese-mountainscape') return mountainStyleArt;
    if (activeStyleId === 'fairy-forest') return animeForestStyleArt;
    return animeStyleArt;
  };
  const needsTextBoost = activeBackgroundId === 'anime-skies';

  const baseBackgroundStyle = isGachaStyle
    ? 'radial-gradient(circle_at_50%_50%, #1a1d2e, #0f1117)'
    : (backgroundStyle ?? 'radial-gradient(circle_at_20%_15%, rgba(255,236,179,0.35), transparent 55%), linear-gradient(180deg, rgba(18,126,150,1) 0%, rgba(10,88,105,1) 48%, rgba(10,74,88,1) 68%, rgba(8,56,68,1) 100%)');

  const handleDifficultyCycle = (direction: 'next' | 'prev') => {
    const difficulties: Difficulty[] = ['easy', 'normal', 'hard', 'nightmare'];
    const currentIndex = difficulties.indexOf(difficulty);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= difficulties.length) newIndex = 0;
    if (newIndex < 0) newIndex = difficulties.length - 1;

    onDifficultyChange(difficulties[newIndex]);
  };

  const diffConfig = DIFFICULTY_CONFIG[difficulty];

  // Helper to format percentage
  const fmtMod = (mod: number) => Math.round(mod * 100) + '%';

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
  {/* Sorry Package Animation */ }
  {
    showSorryAnim && (
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
    )
  }

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
        className="relative z-10 flex flex-col items-center max-w-md w-full"
      >
        {/* Main Glass Card */}
        <div className="w-full backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group/card">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          {/* Game Title Section */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8 text-center relative"
          >
            {/* Decorative Glow */}
            <div className="absolute inset-0 bg-rose-500/20 blur-[60px] rounded-full scale-150 -z-10" />

            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <motion.div
                  animate={{ opacity: [0.45, 0.85, 0.45], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-rose-500/45 blur-xl rounded-full"
                />
                <Flower className="w-16 h-16 text-rose-200 relative drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]" strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tighter uppercase italic mb-2 drop-shadow-lg">
              Pixel<span className="text-red-500">Adventure</span>
            </h1>

            <p className="text-red-400/80 tracking-[0.3em] uppercase text-[10px] font-bold">
              v1.6.1 // Roguelike Journey
            </p>
          </motion.div>

          {/* Menu Buttons Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col gap-3"
          >
            {/* Gift Claim Button - Prominent if available */}
            {!ownedStyles.includes('fairy-forest') && (
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onClaimGift('fairy-forest')}
                className="w-full py-4 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-xl transition-all duration-300 font-bold tracking-widest uppercase relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
              >
                <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">🎁</span>
                  <span>Claim Gift</span>
                </div>
              </motion.button>
            )}

            {/* Sorry Package Claim */}
            {!sorryClaimed && !showSorryAnim && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSorryClaim}
                className="w-full py-3 bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 rounded-xl font-bold uppercase tracking-widest"
              >
                Claim Compensation
              </motion.button>
            )}

            {/* Difficulty Selector */}
            <div className="mb-6 bg-slate-950/40 rounded-xl p-3 border border-white/5 relative group/diff">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => handleDifficultyCycle('prev')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-center flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Difficulty</div>
                  <div className={`text-lg font-black uppercase tracking-wider ${diffConfig.color} filter drop-shadow-md`}>
                    {diffConfig.label}
                  </div>
                </div>

                <button
                  onClick={() => handleDifficultyCycle('next')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Modifiers Tooltip */}
              <div className="mt-2 pt-2 border-t border-white/5 flex justify-center gap-4 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1"><Swords className="w-3 h-3" /> Enemy Stats: {fmtMod(diffConfig.atkMod)}</span>
                <span className="flex items-center gap-1"><Diamond className="w-3 h-3 text-yellow-500" /> Rewards: {fmtMod(diffConfig.goldMod)}</span>
              </div>
            </div>

            {/* Primary Action: Enter Dungeon */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(220, 38, 38, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onPlay}
              className="w-full py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border border-red-400/50 rounded-xl transition-all duration-300 shadow-lg shadow-red-900/50 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.2),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="flex items-center justify-center gap-3">
                <Play className="w-6 h-6 fill-current" />
                <span className="text-lg font-black tracking-widest uppercase">Start Run</span>
              </div>
            </motion.button>

            {/* Secondary Actions: Grid */}
            <div className="grid grid-cols-2 gap-3 mt-1">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(6, 182, 212, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onShop}
                className="py-4 bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-100 border border-cyan-500/30 rounded-xl transition-all backdrop-blur-sm flex flex-col items-center gap-1"
              >
                <ShoppingBag className="w-5 h-5 text-cyan-400 mb-1" />
                <span className="text-xs font-bold uppercase tracking-wider">Shop</span>
                <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-[10px] text-cyan-300 font-mono">
                  <Diamond className="w-3 h-3" /> {diamonds}
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onSettings}
                className="py-4 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-600/30 rounded-xl transition-all backdrop-blur-sm flex flex-col items-center justify-center gap-2"
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Settings</span>
              </motion.button>
            </div>

            {/* Tertiary Action: Patch Notes */}
            <motion.button
              whileHover={{ scale: 1.02, color: "rgba(216, 180, 254, 1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowPatchNotes(true);
                setHasNewPatchNotes(false);
                localStorage.setItem('lastSeenPatchVersion', '1.5.3');
              }}
              className="mt-2 text-xs text-slate-400 hover:text-purple-300 uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 py-2"
            >
              {hasNewPatchNotes && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              <ScrollText className="w-3 h-3" />
              <span>View Patch Notes</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Dock for Extras */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 px-6 py-3 bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackgroundShop}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 group-hover:border-cyan-400 flex items-center justify-center transition-colors">
              <Image className="w-5 h-5 text-slate-400 group-hover:text-cyan-300 transition-colors" />
            </div>
            <span className="text-[9px] uppercase font-bold text-slate-500 group-hover:text-cyan-200">Backdrop</span>
          </motion.button>

          <div className="w-px h-8 bg-white/10" />

          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStyleGacha('anime-prism')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 group-hover:border-pink-400 flex items-center justify-center transition-colors">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            <span className="text-[9px] uppercase font-bold text-slate-500 group-hover:text-pink-200">Prism</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStyleGacha('japanese-mountainscape')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 group-hover:border-blue-400 flex items-center justify-center transition-colors">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[9px] uppercase font-bold text-slate-500 group-hover:text-blue-200">Mountain</span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showPatchNotes && <PatchNotesModal onClose={() => setShowPatchNotes(false)} />}
      </AnimatePresence>
    </div>
  );
}

