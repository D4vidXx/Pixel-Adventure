import { motion } from 'motion/react';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';

interface EventVictoryScreenProps {
    eventName: string;
    equipmentName: string;
    equipmentIcon: string;
    equipmentDescription: string;
    onContinue: () => void;
}

export function EventVictoryScreen({
    eventName,
    equipmentName,
    equipmentIcon,
    equipmentDescription,
    onContinue
}: EventVictoryScreenProps) {
    return (
        <div className="size-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(2,6,23,1))]" />

            {/* Dynamic Glow */}
            <motion.div
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [0.8, 1.2, 0.8],
                    rotate: [0, 90, 180]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full blur-[120px] bg-yellow-600/30"
            />

            <ParticleBackground />

            <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center">
                {/* Title */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <Trophy className="w-12 h-12 text-yellow-400" />
                        <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent tracking-widest uppercase">
                            Event Cleared!
                        </h2>
                        <Trophy className="w-12 h-12 text-yellow-400" />
                    </div>
                    <p className="text-slate-300 text-2xl font-bold tracking-widest uppercase">
                        {eventName}
                    </p>
                </motion.div>

                {/* Reward Reveal */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", bounce: 0.6, duration: 1 }}
                    className="relative mb-16 w-full max-w-md mx-auto"
                >
                    {/* Beams */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute pointer-events-none inset-[-50%] bg-[conic-gradient(from_0deg,transparent,rgba(250,204,21,0.2),transparent,rgba(250,204,21,0.2),transparent)] rounded-full blur-xl"
                    />

                    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-yellow-500/50 rounded-3xl p-8 shadow-[0_0_100px_rgba(234,179,8,0.3)]">
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="flex justify-center mb-6"
                        >
                            <div className="relative">
                                <span className="text-8xl drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                                    {equipmentIcon}
                                </span>
                                <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-yellow-300 animate-pulse" />
                                <Sparkles className="absolute -bottom-2 -left-4 w-6 h-6 text-yellow-300 animate-pulse delay-300" />
                            </div>
                        </motion.div>

                        <h3 className="text-3xl font-black text-white tracking-widest uppercase mb-3">
                            {equipmentName}
                        </h3>
                        <p className="text-yellow-400 font-bold text-lg mb-2">Exclusive Equipment Unlocked!</p>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                            {equipmentDescription}
                        </p>
                    </div>
                </motion.div>

                {/* Continue Button */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                >
                    <button
                        onClick={onContinue}
                        className="group px-10 py-5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-yellow-950 font-black text-xl rounded-2xl border-2 border-yellow-300 transition-all shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center gap-3 uppercase tracking-widest"
                    >
                        <span>Claim Reward</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
