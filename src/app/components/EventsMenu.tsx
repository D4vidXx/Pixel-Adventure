import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Swords, Lock, Check } from 'lucide-react';
import { EQUIPMENT_ITEMS } from '../data/equipment-items';

interface EventsMenuProps {
    onStartEvent: (eventId: 'event_goblin_ambush' | 'event_fight_club') => void;
    onBack: () => void;
    ownedItems: string[];
    diamonds: number;
}

export function EventsMenu({ onStartEvent, onBack, ownedItems }: EventsMenuProps) {
    const boneSmasher = EQUIPMENT_ITEMS.find((item) => item.id === 'bone_smasher');
    const boxerGlove = EQUIPMENT_ITEMS.find((item) => item.id === 'boxer_glove');
    const hasBoneSmasher = ownedItems.includes('bone_smasher');
    const hasBoxerGlove = ownedItems.includes('boxer_glove');

    return (
        <div className="size-full flex flex-col p-6 z-10 relative">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <div className="flex items-center gap-3">
                    <Swords className="w-6 h-6 text-purple-400" />
                    <h2 className="text-2xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)] uppercase">
                        Special Events
                    </h2>
                    <Swords className="w-6 h-6 text-purple-400" />
                </div>
                <div className="w-[100px]"></div>
            </div>

            <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">

                    {/* Goblin Ambush */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`relative p-6 rounded-2xl border ${hasBoneSmasher ? 'border-green-500/50 bg-green-950/30' : 'border-purple-500/50 bg-slate-900/50'} shadow-xl overflow-hidden group`}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.1),transparent_50%)]" />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1">
                                    Goblin Ambush
                                </h3>
                                <p className="text-sm text-slate-400">
                                    Survive 5 waves of brutal Goblin assaults!
                                </p>
                            </div>
                            <div className="bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
                                <span className="text-xs font-bold text-fuchsia-400">DIFFICULTY: HARD</span>
                            </div>
                        </div>
                        <div className={`mt-6 p-4 rounded-xl border ${hasBoneSmasher ? 'border-green-500/30 bg-green-900/20' : 'border-slate-700/50 bg-slate-800/50'} flex gap-4 items-center relative z-10`}>
                            <div className="text-4xl">{boneSmasher?.icon}</div>
                            <div className="flex-1">
                                <div className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                    REWARD: {boneSmasher?.name}
                                    {hasBoneSmasher && <Check className="w-4 h-4 text-green-400" />}
                                </div>
                                <div className="text-xs text-slate-400">{boneSmasher?.passiveDescription}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => onStartEvent('event_goblin_ambush')}
                            className="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-black tracking-widest uppercase rounded-xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all relative z-10"
                        >
                            Start Event Run
                        </button>
                    </motion.div>

                    {/* Underground Circuit */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`relative p-6 rounded-2xl border ${hasBoxerGlove ? 'border-green-500/50 bg-green-950/30' : 'border-red-700/50 bg-slate-900/50'} shadow-xl overflow-hidden group`}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.08),transparent_50%)]" />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                                    🥊 The Underground Circuit
                                </h3>
                                <p className="text-sm text-slate-400">
                                    Prove yourself in an illegal underground fighting ring.
                                </p>
                            </div>
                            <div className="bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
                                <span className="text-xs font-bold text-red-400">UNIQUE GAMEPLAY</span>
                            </div>
                        </div>
                        <div className={`mt-6 p-4 rounded-xl border ${hasBoxerGlove ? 'border-green-500/30 bg-green-900/20' : 'border-slate-700/50 bg-slate-800/50'} flex gap-4 items-center relative z-10`}>
                            <div className="text-4xl">{boxerGlove?.icon}</div>
                            <div className="flex-1">
                                <div className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                    REWARD: {boxerGlove?.name}
                                    {hasBoxerGlove && <Check className="w-4 h-4 text-green-400" />}
                                </div>
                                <div className="text-xs text-slate-400">{boxerGlove?.passiveDescription}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => onStartEvent('event_fight_club')}
                            className="mt-6 w-full py-4 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-black tracking-widest uppercase rounded-xl border border-red-600/30 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all relative z-10"
                        >
                            Enter the Ring
                        </button>
                    </motion.div>

                    {/* Coming Soon placeholders */}
                    {[0, 1].map((idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * (idx + 2) }}
                            className="relative p-6 rounded-2xl border border-slate-800/50 bg-slate-900/30 shadow-xl overflow-hidden flex flex-col items-center justify-center min-h-[250px]"
                        >
                            <Lock className="w-12 h-12 text-slate-600 mb-4" />
                            <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest">
                                Coming Soon
                            </h3>
                        </motion.div>
                    ))}

                </div>
            </div>
        </div>
    );
}
