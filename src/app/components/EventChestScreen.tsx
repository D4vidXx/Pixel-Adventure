import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Coins, Sword, Shield, Sparkles, ArrowRight, Package } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';

export interface EventReward {
    type: 'items' | 'stats' | 'artifact';
    items?: { id: string; name: string; quantity: number }[];
    attack?: number;
    defense?: number;
    artifactId?: string;
    artifactName?: string;
    artifactIcon?: string;
}

interface EventChestScreenProps {
    reward: EventReward;
    onContinue: () => void;
}

export function EventChestScreen({ reward, onContinue }: EventChestScreenProps) {
    const [opened, setOpened] = useState(false);
    const [showReward, setShowReward] = useState(false);

    useEffect(() => {
        // Auto-open after a short delay
        const timer1 = setTimeout(() => setOpened(true), 1000);
        const timer2 = setTimeout(() => setShowReward(true), 1500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const renderRewardIcon = () => {
        switch (reward.type) {
            case 'items':
                return <Package className="w-16 h-16 text-emerald-500" />;
            case 'stats':
                return (
                    <div className="flex gap-4">
                        <Sword className="w-12 h-12 text-orange-500" />
                        <Shield className="w-12 h-12 text-blue-500" />
                    </div>
                );
            case 'artifact':
                return <span className="text-6xl">{reward.artifactIcon || '💎'}</span>;
        }
    };

    const renderRewardText = () => {
        switch (reward.type) {
            case 'items':
                return (
                    <>
                        <h3 className="text-4xl font-black text-emerald-500 tracking-wider uppercase mb-2">Item Stash!</h3>
                        <div className="flex flex-col gap-1 items-center">
                            {reward.items?.map((item, idx) => (
                                <p key={idx} className="text-slate-300 text-xl font-bold">
                                    {item.quantity}x {item.name}
                                </p>
                            ))}
                        </div>
                    </>
                );
            case 'stats':
                return (
                    <>
                        <h3 className="text-4xl font-black text-fuchsia-400 tracking-wider uppercase mb-2">Power Surge!</h3>
                        <p className="text-slate-300 text-xl font-bold">
                            Gained <span className="text-orange-400">+{reward.attack} Attack</span> and <span className="text-blue-400">+{reward.defense} Defense</span>!
                        </p>
                    </>
                );
            case 'artifact':
                return (
                    <>
                        <h3 className="text-4xl font-black text-purple-400 tracking-wider uppercase mb-2">Artifact Found!</h3>
                        <p className="text-slate-300 text-xl font-bold">You acquired the {reward.artifactName}!</p>
                    </>
                );
        }
    };

    return (
        <div className="size-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(2,6,23,1))]" />

            {/* Dynamic Glow based on reward type */}
            <motion.div
                animate={{
                    opacity: showReward ? [0.1, 0.2, 0.1] : 0,
                    scale: showReward ? [1, 1.2, 1] : 0.8,
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute inset-0 rounded-full blur-[100px] ${reward.type === 'items' ? 'bg-emerald-600/30' :
                        reward.type === 'stats' ? 'bg-fuchsia-600/30' :
                            'bg-purple-600/30'
                    }`}
            />

            <ParticleBackground />

            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-2xl font-bold text-slate-400 tracking-[0.3em] uppercase mb-12"
                >
                    Event Reward
                </motion.h2>

                <div className="relative h-64 w-full flex items-center justify-center mb-12">
                    <AnimatePresence mode="wait">
                        {!showReward ? (
                            <motion.div
                                key="chest"
                                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    y: 0,
                                    rotate: opened ? [0, -5, 5, -5, 5, 0] : 0,
                                    filter: opened ? "brightness(1.5)" : "brightness(1)"
                                }}
                                exit={{ scale: 1.5, opacity: 0, filter: "brightness(2) blur(10px)" }}
                                transition={{
                                    duration: 0.5,
                                    rotate: { duration: 0.4 },
                                }}
                                className="absolute"
                            >
                                <div className="w-40 h-40 bg-slate-800 rounded-3xl border-4 border-fuchsia-900/50 shadow-[0_0_50px_rgba(192,132,252,0.2)] flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 to-transparent" />
                                    <Gift className="w-20 h-20 text-fuchsia-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]" />

                                    {/* Lock */}
                                    <div className="absolute -bottom-2 w-16 h-8 bg-slate-900 border-2 border-slate-700 rounded-t-full flex justify-center pt-1">
                                        <div className="w-3 h-3 rounded-full bg-slate-600" />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="reward"
                                initial={{ scale: 0, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                                className="absolute flex flex-col items-center"
                            >
                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="mb-8 relative"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 w-32 h-32 -m-8 bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.2),transparent)] rounded-full blur-md"
                                    />
                                    <div className="relative bg-slate-900/80 p-6 rounded-3xl border-2 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                                        {renderRewardIcon()}
                                        <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-yellow-300 animate-pulse" />
                                        <Sparkles className="absolute -bottom-2 -left-3 w-6 h-6 text-yellow-300 animate-pulse delay-700" />
                                    </div>
                                </motion.div>

                                {renderRewardText()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showReward ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <button
                        onClick={onContinue}
                        disabled={!showReward}
                        className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/10 transition-all shadow-lg flex items-center gap-3"
                    >
                        <span>Continue Journey</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
