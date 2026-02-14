import { motion } from 'motion/react';

interface SoulMeterUIProps {
  currentSoul: number;
  maxSoul: number;
  attackBonus: number;
}

export function SoulMeterUI({ currentSoul, maxSoul, attackBonus }: SoulMeterUIProps) {
  // Calculate percentage for visual bar
  const soulPercentage = (currentSoul / maxSoul) * 100;
  
  // Calculate attack bonuses (every 10 soul = +1 attack)
  const currentBonusAttack = Math.floor(currentSoul / 10);

  return (
    <div className="flex flex-col gap-2 bg-slate-900/60 border border-purple-400/40 rounded-lg p-4 backdrop-blur-sm">
      {/* Title */}
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest font-bold text-purple-300">Soul Meter</span>
        <span className="text-xs font-mono text-purple-200">{currentSoul}/{maxSoul}</span>
      </div>

      {/* Main meter bar */}
      <div className="relative w-full h-6 bg-slate-950/80 border border-purple-500/50 rounded-full overflow-hidden">
        {/* Glow effect behind bar */}
        <motion.div
          animate={{
            boxShadow: [
              `inset 0 0 0 rgba(168,85,247,0)`,
              `inset 0 0 12px rgba(168,85,247,0.4)`,
              `inset 0 0 0 rgba(168,85,247,0)`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0"
        />

        {/* Fill bar */}
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${soulPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 relative"
        >
          {/* Shimmer effect */}
          <motion.div
            animate={{ x: ['100%', '-100%'] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>

        {/* Milestone markers (every 500 soul = 1 checkpoint) */}
        {[...Array(Math.floor(maxSoul / 500))].map((_, i) => {
          const markerPercent = ((i + 1) * 500 / maxSoul) * 100;
          return (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-purple-400/30"
              style={{ left: `${markerPercent}%` }}
            />
          );
        })}
      </div>

      {/* Stats display */}
      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
        <div className="bg-slate-800/50 px-2 py-1 rounded border border-purple-400/20">
          <span className="text-purple-300">ATK Bonus:</span>
          <span className="text-yellow-300 ml-1">+{currentBonusAttack}</span>
        </div>
        <div className="bg-slate-800/50 px-2 py-1 rounded border border-purple-400/20">
          <span className="text-purple-300">Kills:</span>
          <span className="text-green-300 ml-1">{Math.floor(currentSoul / 5)}</span>
        </div>
      </div>

      {/* Passive ability description */}
      <div className="text-[9px] text-purple-200/70 italic border-t border-purple-400/20 pt-2 mt-1">
        Passive: +5 Soul per kill. Every 10 Soul = +1 ATK (uncapped)
      </div>
    </div>
  );
}
