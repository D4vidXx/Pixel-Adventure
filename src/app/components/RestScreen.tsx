import { Heart, Sparkles, ArrowRight } from 'lucide-react';

interface RestScreenProps {
  currentHealth: number;
  maxHealth: number;
  onRest: () => void;
}

export function RestScreen({ currentHealth, maxHealth, onRest }: RestScreenProps) {
  const healAmount = Math.floor(maxHealth * 0.5);
  const newHealth = Math.min(maxHealth, currentHealth + healAmount);
  const actualHeal = newHealth - currentHealth;

  return (
    <div className="size-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-slate-800 border-4 border-blue-600 p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 bg-slate-700 border-4 border-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-blue-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl text-slate-100 tracking-wider uppercase mb-4">Rest Area</h2>
        <p className="text-slate-300 text-lg mb-8">
          You've found a safe place to rest and recover your strength.
        </p>

        {/* Health Display */}
        <div className="bg-slate-900 border-2 border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-red-500" />
            <h3 className="text-xl text-slate-100 tracking-wide uppercase">Health Recovery</h3>
          </div>

          <div className="flex items-center justify-center gap-4 text-2xl mb-4">
            <span className="text-red-400">{currentHealth}</span>
            <ArrowRight className="w-6 h-6 text-slate-400" />
            <span className="text-green-400">{newHealth}</span>
            <span className="text-slate-500">/ {maxHealth}</span>
          </div>

          <div className="w-full h-6 bg-slate-700 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-green-500 transition-all duration-1000"
              style={{ width: `${(newHealth / maxHealth) * 100}%` }}
            ></div>
          </div>

          {actualHeal > 0 ? (
            <p className="text-green-400">
              Restore <span className="font-bold">+{actualHeal} HP</span> (50% of max health)
            </p>
          ) : (
            <p className="text-yellow-400">You're already at full health!</p>
          )}
        </div>

        {/* Rest Button */}
        <button
          onClick={onRest}
          className="px-12 py-4 bg-blue-900 hover:bg-blue-800 text-slate-100 border-2 border-blue-600 hover:border-blue-500 transition-all tracking-wider uppercase text-xl"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6" />
            <span>Rest and Recover</span>
          </div>
        </button>
      </div>
    </div>
  );
}
