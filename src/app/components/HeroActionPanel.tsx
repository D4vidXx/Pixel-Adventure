import React from 'react';
import { motion } from 'motion/react';
import { Sword, Package, Zap, Shield } from 'lucide-react';

interface HeroActionPanelProps {
    isPlayerTurn: boolean;
    onFight: () => void;
    onUseItem: () => void;
    onTrain: () => void;
    onBlock: () => void;
    blockCooldownTurns: number;
    playerAttack: number;
    attackCap: number;
}

export const HeroActionPanel: React.FC<HeroActionPanelProps> = ({
    isPlayerTurn,
    onFight,
    onUseItem,
    onTrain,
    onBlock,
    blockCooldownTurns,
    playerAttack,
    attackCap
}) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
            {/* FIGHT ACTION */}
            <motion.button
                variants={item}
                whileHover={isPlayerTurn ? { scale: 1.05, y: -5 } : {}}
                whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
                onClick={onFight}
                disabled={!isPlayerTurn}
                className={`group relative px-4 sm:px-8 py-4 sm:py-6 border rounded-2xl transition-all duration-300 overflow-hidden ${isPlayerTurn
                    ? 'bg-gradient-to-br from-red-900/40 to-red-950/30 hover:from-red-900/60 hover:to-red-900/40 text-slate-100 border-red-600/30 hover:border-red-500 shadow-lg shadow-red-900/20 backdrop-blur-sm'
                    : 'bg-slate-900/40 text-slate-600 border-slate-800/50 cursor-not-allowed rounded-xl backdrop-blur-sm'
                    }`}
            >
                {/* Clean hover glow effect */}
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 transition-colors duration-300" />

                {/* Animated scanline */}
                {isPlayerTurn && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                )}

                <div className="relative flex flex-col items-center gap-2 z-10">
                    <div className={`p-3 rounded-full ${isPlayerTurn ? 'bg-red-500/20 ring-1 ring-red-500/50' : 'bg-slate-800'}`}>
                        <Sword className={`w-6 h-6 sm:w-8 sm:h-8 ${isPlayerTurn ? 'text-red-400' : 'text-slate-600'}`} />
                    </div>
                    <span className="tracking-widest uppercase font-black text-sm sm:text-base">Fight</span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium">Attack Enemy</span>
                </div>
            </motion.button>

            {/* USE ITEM ACTION */}
            <motion.button
                variants={item}
                whileHover={isPlayerTurn ? { scale: 1.05, y: -5 } : {}}
                whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
                onClick={onUseItem}
                disabled={!isPlayerTurn}
                className={`group relative px-4 sm:px-8 py-4 sm:py-6 border rounded-2xl transition-all duration-300 overflow-hidden ${isPlayerTurn
                    ? 'bg-gradient-to-br from-purple-900/40 to-purple-950/30 hover:from-purple-900/60 hover:to-purple-900/40 text-slate-100 border-purple-600/30 hover:border-purple-500 shadow-lg shadow-purple-900/20 backdrop-blur-sm'
                    : 'bg-slate-900/40 text-slate-600 border-slate-800/50 cursor-not-allowed backdrop-blur-sm'
                    }`}
            >
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors duration-300" />

                <div className="relative flex flex-col items-center gap-2 z-10">
                    <div className={`p-3 rounded-full ${isPlayerTurn ? 'bg-purple-500/20 ring-1 ring-purple-500/50' : 'bg-slate-800'}`}>
                        <Package className={`w-6 h-6 sm:w-8 sm:h-8 ${isPlayerTurn ? 'text-purple-400' : 'text-slate-600'}`} />
                    </div>
                    <span className="tracking-widest uppercase font-black text-sm sm:text-base">Items</span>
                    <span className="text-[10px] sm:text-xs text-red-300 font-bold uppercase tracking-widest bg-red-900/20 border border-red-500/20 px-2 py-0.5 rounded">
                        Ends Turn
                    </span>
                </div>
            </motion.button>

            {/* TRAIN ACTION */}
            <motion.button
                variants={item}
                whileHover={isPlayerTurn ? { scale: 1.05, y: -5 } : {}}
                whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
                onClick={onTrain}
                disabled={!isPlayerTurn}
                className={`group relative px-4 sm:px-8 py-4 sm:py-6 border rounded-2xl transition-all duration-300 overflow-hidden ${isPlayerTurn
                    ? 'bg-gradient-to-br from-amber-900/40 to-amber-950/30 hover:from-amber-900/60 hover:to-amber-900/40 text-slate-100 border-amber-600/30 hover:border-amber-500 shadow-lg shadow-amber-900/20 backdrop-blur-sm'
                    : 'bg-slate-900/40 text-slate-600 border-slate-800/50 cursor-not-allowed backdrop-blur-sm'
                    }`}
            >
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-300" />

                <div className="relative flex flex-col items-center gap-2 z-10">
                    <div className={`p-3 rounded-full ${isPlayerTurn ? 'bg-amber-500/20 ring-1 ring-amber-500/50' : 'bg-slate-800'}`}>
                        <Zap className={`w-6 h-6 sm:w-8 sm:h-8 ${isPlayerTurn ? 'text-amber-400' : 'text-slate-600'}`} />
                    </div>
                    <span className="tracking-widest uppercase font-black text-sm sm:text-base">Train</span>
                    <span className="text-[10px] sm:text-xs text-slate-400 leading-tight text-center">
                        <span className="text-amber-300">+{5 + Math.floor(playerAttack * 0.05)} ATK</span>
                        <br />
                        <span className="text-slate-500">Limit: {attackCap}</span>
                        <br />
                        <span className="text-red-400">Take 60% More DMG</span>
                    </span>
                </div>
            </motion.button>

            {/* BLOCK ACTION */}
            <motion.button
                variants={item}
                whileHover={isPlayerTurn && blockCooldownTurns <= 0 ? { scale: 1.05, y: -5 } : {}}
                whileTap={isPlayerTurn && blockCooldownTurns <= 0 ? { scale: 0.95 } : {}}
                onClick={onBlock}
                disabled={!isPlayerTurn || blockCooldownTurns > 0}
                className={`group relative px-4 sm:px-8 py-4 sm:py-6 border rounded-2xl transition-all duration-300 overflow-hidden ${isPlayerTurn && blockCooldownTurns <= 0
                    ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/30 hover:from-blue-900/60 hover:to-blue-900/40 text-slate-100 border-blue-600/30 hover:border-blue-500 shadow-lg shadow-blue-900/20 backdrop-blur-sm'
                    : 'bg-slate-900/40 text-slate-600 border-slate-800/50 cursor-not-allowed backdrop-blur-sm'
                    }`}
            >
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300" />

                <div className="relative flex flex-col items-center gap-2 z-10">
                    <div className={`p-3 rounded-full ${isPlayerTurn && blockCooldownTurns <= 0 ? 'bg-blue-500/20 ring-1 ring-blue-500/50' : 'bg-slate-800'}`}>
                        <Shield className={`w-6 h-6 sm:w-8 sm:h-8 ${isPlayerTurn && blockCooldownTurns <= 0 ? 'text-blue-400' : 'text-slate-600'}`} />
                    </div>
                    <span className="tracking-widest uppercase font-black text-sm sm:text-base">Block</span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium">
                        {blockCooldownTurns > 0 ? (
                            <span className="text-slate-500 font-mono">Cooldown: {blockCooldownTurns}</span>
                        ) : (
                            <span className="text-blue-300">-70% DMG Taken</span>
                        )}
                    </span>
                </div>
            </motion.button>
        </motion.div>
    );
};
