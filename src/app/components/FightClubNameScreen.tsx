import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface FightClubNameScreenProps {
    onConfirm: (name: string) => void;
    onBack: () => void;
}

export function FightClubNameScreen({ onConfirm, onBack }: FightClubNameScreenProps) {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        const trimmed = name.trim();
        if (trimmed.length === 0) return;
        onConfirm(trimmed);
    };

    return (
        <div className="size-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Dark gritty bg */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(30,10,10,1),rgba(2,6,23,1))]" />
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.03) 2px,rgba(255,255,255,0.03) 4px)' }} />

            {/* Red spotlight */}
            <motion.div
                animate={{ opacity: [0.1, 0.25, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-0 inset-x-0 h-72 bg-red-900/30 blur-[120px]"
            />

            <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center gap-8">
                {/* Gloves Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="text-8xl"
                >
                    🥊
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-4xl font-black text-white tracking-widest uppercase">
                        The Underground Circuit
                    </h1>
                    <p className="text-red-400 font-bold tracking-widest text-sm mt-2 uppercase">
                        Enter your fighter name
                    </p>
                </motion.div>

                {/* Name Input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full"
                >
                    <input
                        autoFocus
                        type="text"
                        maxLength={20}
                        placeholder="Your name..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                        className="w-full bg-slate-800/80 border-2 border-slate-600 focus:border-red-500 outline-none rounded-xl px-6 py-4 text-white text-2xl font-bold text-center tracking-widest placeholder:text-slate-600 transition-colors"
                    />
                    <p className="text-slate-600 text-xs mt-2">{name.length}/20 — Press Enter or click below</p>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col gap-3 w-full"
                >
                    <button
                        onClick={handleSubmit}
                        disabled={name.trim().length === 0}
                        className="group flex items-center justify-center gap-3 w-full px-8 py-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-black text-lg rounded-xl transition-all uppercase tracking-widest"
                    >
                        <span>Enter the Ring</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={onBack}
                        className="text-slate-500 hover:text-slate-300 text-sm font-bold transition-colors py-2"
                    >
                        ← Back to Events
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
