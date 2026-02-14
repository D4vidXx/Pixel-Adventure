import { ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ParticleBackground } from './ParticleBackground';

interface InterludeScreenProps {
  currentLevel: number;
  onSelectShop: () => void;
  onSelectRest: () => void;
}

export function InterludeScreen({ currentLevel, onSelectShop, onSelectRest }: InterludeScreenProps) {
  return (
    <div className="size-full bg-slate-950 flex shadow-inner items-center justify-center p-6 relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(2,6,23,1))]" />

      {/* Nebula Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.03, 0.08, 0.03],
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px]"
      />

      {/* Particles */}
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full relative z-10"
      >
        {/* Title */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              textShadow: [
                "0 0 10px rgba(148,163,184,0.1)",
                "0 0 20px rgba(148,163,184,0.3)",
                "0 0 10px rgba(148,163,184,0.1)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block"
          >
            <h2 className="text-5xl font-black bg-gradient-to-r from-slate-100 via-slate-300 to-slate-100 bg-clip-text text-transparent tracking-widest uppercase mb-4 px-4">
              Level {currentLevel} Complete!
            </h2>
          </motion.div>
          <div className="flex items-center justify-center gap-4 text-slate-400 text-lg tracking-[0.3em] uppercase opacity-70">
            <div className="h-px w-12 bg-slate-700" />
            Choose your path forward
            <div className="h-px w-12 bg-slate-700" />
          </div>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {/* Shop Option */}
          <motion.button
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelectShop}
            className="group relative bg-slate-900/60 backdrop-blur-xl border-2 border-yellow-600/30 hover:border-yellow-500 p-12 transition-all duration-300 rounded-[3rem] overflow-hidden shadow-2xl shadow-black/40"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col items-center text-center gap-8">
              <div className="w-28 h-28 bg-yellow-500/10 rounded-3xl border-2 border-yellow-600/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <ShoppingBag className="w-12 h-12 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-yellow-400 tracking-wider uppercase mb-3">
                  Visit Shop
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed opacity-80 mb-6">
                  Spend your hard-earned gold on artifacts and permanent upgrades
                </p>
              </div>
              <div className="flex items-center gap-3 text-yellow-500 font-bold tracking-widest uppercase text-xs p-3 px-6 bg-yellow-500/10 rounded-2xl group-hover:bg-yellow-500 group-hover:text-yellow-950 transition-all">
                <span>Enter Shop</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>

          {/* Rest Option */}
          <motion.button
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelectRest}
            className="group relative bg-slate-900/60 backdrop-blur-xl border-2 border-blue-600/30 hover:border-blue-500 p-12 transition-all duration-300 rounded-[3rem] overflow-hidden shadow-2xl shadow-black/40"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col items-center text-center gap-8">
              <div className="w-28 h-28 bg-blue-500/10 rounded-3xl border-2 border-blue-600/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <Heart className="w-12 h-12 text-blue-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-blue-400 tracking-wider uppercase mb-3 text-shadow-sm">
                  Rest Area
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed opacity-80 mb-6">
                  Recover your strength and restore 50% of your maximum health
                </p>
              </div>
              <div className="flex items-center gap-3 text-blue-400 font-bold tracking-widest uppercase text-xs p-3 px-6 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500 group-hover:text-blue-950 transition-all">
                <span>Rest Here</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
