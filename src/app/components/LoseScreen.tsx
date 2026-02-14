import { Skull, Swords, Heart, Coins, Sparkles, RotateCcw, Home } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ParticleBackground } from './ParticleBackground';

interface LoseScreenProps {
  damageDealt: number;
  damageTaken: number;
  goldAccumulated: number;
  legendaryArtifacts: Record<string, number>;
  onTryAgain: () => void;
  onReturnToMenu: () => void;
  combatLog: string[];
}

export function LoseScreen({
  damageDealt,
  damageTaken,
  goldAccumulated,
  legendaryArtifacts,
  onTryAgain,
  onReturnToMenu,
  combatLog,
}: LoseScreenProps) {
  const [showHistory, setShowHistory] = useState(false);
  const artifactNames: Record<string, string> = {
    golden_apple: '🍎 Golden Apple',
    finished_rubix_cube: '🎲 Finished Rubix Cube',
    disco_ball: '🪩 Disco Ball',
    lucky_button: '🍀 Lucky Button',
    wooden_mask: '🎭 Wooden Mask',
  };

  return (
    <div className="size-full min-h-screen bg-slate-950 flex items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,0,0,1),rgba(2,6,23,1))]" />

      {/* Nebula Orbs (Dark Red / Blood theme) */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, 40, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-[60%] h-[60%] bg-red-900/10 rounded-full blur-[130px]"
      />
      <motion.div
        animate={{
          scale: [1.4, 1, 1.4],
          opacity: [0.03, 0.08, 0.03],
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-slate-900/10 rounded-full blur-[120px]"
      />

      {/* Particles (Embers) */}
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full max-h-[calc(100vh-3rem)] bg-slate-900/60 backdrop-blur-2xl border-2 border-red-900/30 p-5 sm:p-10 relative z-10 shadow-2xl rounded-[2rem] sm:rounded-[3rem] overflow-x-hidden overflow-y-auto"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
                filter: ["drop-shadow(0 0 10px rgba(220,38,38,0.3))", "drop-shadow(0 0 30px rgba(220,38,38,0.6))", "drop-shadow(0 0 10px rgba(220,38,38,0.3))"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-24 sm:w-32 sm:h-32 bg-red-950/50 rounded-full border-4 border-red-600/50 flex items-center justify-center shadow-inner"
            >
                <Skull className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />
            </motion.div>
          </div>
          <motion.h1
            animate={{
              opacity: [0.8, 1, 0.8],
              textShadow: ["0 0 20px rgba(220,38,38,0.2)", "0 0 40px rgba(220,38,38,0.5)", "0 0 20px rgba(220,38,38,0.2)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl sm:text-6xl font-black text-red-500 tracking-[0.08em] sm:tracking-[0.2em] uppercase mb-3"
          >
            Defeated
          </motion.h1>
          <p className="text-slate-400 text-sm sm:text-lg tracking-[0.18em] sm:tracking-widest uppercase opacity-60">Your journey ends here...</p>
        </div>

        {/* Statistics */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 p-8 mb-10 rounded-[2rem] shadow-xl">
          <h2 className="text-sm font-bold text-slate-500 tracking-[0.4em] uppercase mb-8 text-center flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-slate-700" />
            Your Legacy
            <div className="h-px w-8 bg-slate-700" />
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Damage Dealt */}
            <div className="bg-slate-900/50 border border-slate-700/30 p-5 rounded-2xl group hover:border-red-600/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Swords className="w-4 h-4 text-red-400 opacity-70" />
                <h3 className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Damage Dealt</h3>
              </div>
              <p className="text-3xl font-black text-red-400 drop-shadow-sm">{damageDealt.toLocaleString()}</p>
            </div>

            {/* Damage Taken */}
            <div className="bg-slate-900/50 border border-slate-700/30 p-5 rounded-2xl group hover:border-red-600/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-red-400 opacity-70" />
                <h3 className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Damage Taken</h3>
              </div>
              <p className="text-3xl font-black text-red-400 drop-shadow-sm">{damageTaken.toLocaleString()}</p>
            </div>

            {/* Gold Accumulated */}
            <div className="bg-slate-900/50 border border-slate-700/30 p-5 rounded-2xl group hover:border-yellow-600/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Coins className="w-4 h-4 text-yellow-400 opacity-70" />
                <h3 className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Gold Earned</h3>
              </div>
              <p className="text-3xl font-black text-yellow-400 drop-shadow-sm">{goldAccumulated.toLocaleString()}</p>
            </div>

            {/* Legendary Artifacts */}
            <div className="bg-slate-900/50 border border-slate-700/30 p-5 rounded-2xl group hover:border-purple-600/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400 opacity-70" />
                <h3 className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Artifacts</h3>
              </div>
              <p className="text-3xl font-black text-purple-400 drop-shadow-sm">{Object.values(legendaryArtifacts).reduce((a, b) => a + b, 0)}</p>
            </div>
          </div>

          {/* Artifact List */}
          {Object.keys(legendaryArtifacts).length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-700/30">
              <h3 className="text-[10px] text-slate-500 font-black tracking-widest uppercase mb-4 text-center">
                Artifacts Recovered
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {Object.entries(legendaryArtifacts).map(([artifact, count], index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-purple-900/20 backdrop-blur-md border border-purple-600/30 text-purple-300 text-[10px] font-bold tracking-wider uppercase rounded-xl flex items-center gap-2"
                  >
                    <span>{artifactNames[artifact] || artifact}</span>
                    {count > 1 && <span className="text-purple-400 font-black text-xs">x{count}</span>}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* History Toggle */}
        <div className="w-full flex flex-col items-center mb-8">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-slate-500 hover:text-slate-300 text-[10px] font-black uppercase tracking-widest mb-4 transition-colors"
          >
            {showHistory ? 'Hide Combat Log' : 'View Combat Log History'}
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full overflow-hidden"
              >
                <div className="bg-slate-950/50 border border-slate-700/30 rounded-2xl p-4 max-h-40 overflow-y-auto custom-scrollbar">
                  {combatLog.slice().reverse().map((log, i) => (
                    <p key={i} className="text-[10px] text-slate-400 mb-1 font-medium leading-relaxed border-l border-slate-700/30 pl-3">
                      {log}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTryAgain}
            className="flex-1 px-5 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-slate-100 font-black tracking-[0.08em] sm:tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 rounded-2xl shadow-xl shadow-red-900/20 border border-red-600/30"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReturnToMenu}
            className="flex-1 px-5 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-slate-100 font-black tracking-[0.08em] sm:tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 rounded-2xl shadow-xl shadow-black/20 border border-slate-600/30"
          >
            <Home className="w-5 h-5" />
            Menu
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
