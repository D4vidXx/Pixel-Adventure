import { motion } from 'motion/react';
import { TreePine, Mountain, Cloud, Leaf, Ghost, Skull, Eye, Moon } from 'lucide-react';

export function StageBackground({ stage = 1 }: { stage?: number }) {
    const isStage1 = stage === 1;

    if (isStage1) {
        // Stage 1: Forest/Goblin Theme
        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                {/* Trees - Left Side */}
                <motion.div
                    animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[5%] top-[20%] text-green-600/40"
                >
                    <TreePine size={120} strokeWidth={1} />
                </motion.div>

                <motion.div
                    animate={{ y: [0, -15, 0], rotate: [1, -1, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute left-[12%] top-[50%] text-emerald-700/50"
                >
                    <TreePine size={90} strokeWidth={1} />
                </motion.div>

                {/* Trees - Right Side */}
                <motion.div
                    animate={{ y: [0, -12, 0], rotate: [2, -2, 2] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute right-[8%] top-[30%] text-green-700/45"
                >
                    <TreePine size={100} strokeWidth={1} />
                </motion.div>

                <motion.div
                    animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
                    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute right-[15%] top-[60%] text-teal-600/35"
                >
                    <TreePine size={80} strokeWidth={1} />
                </motion.div>

                {/* Mountains - Background */}
                <motion.div
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[20%] top-[10%] text-slate-600/30"
                >
                    <Mountain size={180} strokeWidth={0.8} />
                </motion.div>

                <motion.div
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                    className="absolute right-[25%] top-[8%] text-slate-500/25"
                >
                    <Mountain size={150} strokeWidth={0.8} />
                </motion.div>

                {/* Clouds */}
                <motion.div
                    animate={{ x: [-100, 100, -100] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[5%] left-[30%] text-slate-400/20"
                >
                    <Cloud size={70} strokeWidth={1} />
                </motion.div>

                <motion.div
                    animate={{ x: [100, -100, 100] }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear", delay: 5 }}
                    className="absolute top-[15%] right-[20%] text-slate-300/15"
                >
                    <Cloud size={60} strokeWidth={1} />
                </motion.div>

                {/* Floating Leaves */}
                <motion.div
                    animate={{
                        x: [-20, 20, -20],
                        y: [0, 30, 0],
                        rotate: [0, 360, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[40%] top-[70%] text-green-500/30"
                >
                    <Leaf size={40} strokeWidth={1.5} />
                </motion.div>

                <motion.div
                    animate={{
                        x: [20, -20, 20],
                        y: [0, 40, 0],
                        rotate: [0, -360, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute right-[35%] top-[75%] text-emerald-400/25"
                >
                    <Leaf size={35} strokeWidth={1.5} />
                </motion.div>
            </div>
        );
    } else {
        // Stage 2: Shadow Realm Theme
        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
                {/* Ghosts - Floating */}
                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        x: [-10, 10, -10],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[10%] top-[25%] text-purple-400/50"
                >
                    <Ghost size={100} strokeWidth={1} />
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, -40, 0],
                        x: [10, -10, 10],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute right-[12%] top-[40%] text-indigo-500/40"
                >
                    <Ghost size={90} strokeWidth={1} />
                </motion.div>

                {/* Skulls - Bottom Corners */}
                <motion.div
                    animate={{
                        rotate: [-5, 5, -5],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[5%] bottom-[15%] text-purple-600/45"
                >
                    <Skull size={110} strokeWidth={1.2} />
                </motion.div>

                <motion.div
                    animate={{
                        rotate: [5, -5, 5],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute right-[8%] bottom-[20%] text-fuchsia-700/40"
                >
                    <Skull size={95} strokeWidth={1.2} />
                </motion.div>

                {/* Eyes - Watching */}
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[25%] top-[15%] text-indigo-400/50"
                >
                    <Eye size={70} strokeWidth={1.5} />
                </motion.div>

                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="absolute right-[30%] top-[55%] text-purple-500/45"
                >
                    <Eye size={60} strokeWidth={1.5} />
                </motion.div>

                {/* Moon - Top Center */}
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[8%] left-[45%] text-indigo-300/30"
                >
                    <Moon size={120} strokeWidth={0.8} />
                </motion.div>

                {/* Additional Atmospheric Eyes */}
                <motion.div
                    animate={{
                        opacity: [0.2, 0.6, 0.2]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute left-[60%] top-[35%] text-fuchsia-600/35"
                >
                    <Eye size={50} strokeWidth={1.5} />
                </motion.div>

                <motion.div
                    animate={{
                        opacity: [0.15, 0.5, 0.15]
                    }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute left-[15%] top-[65%] text-purple-400/30"
                >
                    <Eye size={45} strokeWidth={1.5} />
                </motion.div>
            </div>
        );
    }
}
