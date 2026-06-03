import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MessageSquare, AlertTriangle } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';

interface DialogueLine {
    speaker: string;
    text: string;
    expression?: 'normal' | 'scared' | 'determined';
}

const GOBLIN_AMBUSH_DIALOGUE: DialogueLine[] = [
    {
        speaker: "Panicked Villager",
        text: "Brave hero! Thank the stars you've arrived!",
        expression: "scared"
    },
    {
        speaker: "Panicked Villager",
        text: "The Goblin King and Goblin Queen have descended from the mountains with their vicious horde!",
        expression: "scared"
    },
    {
        speaker: "Panicked Villager",
        text: "They've already ransacked the outer farms and now they intend to take over the entire land...",
        expression: "scared"
    },
    {
        speaker: "Panicked Villager",
        text: "Please, you must stop them before it's too late! Our fate rests in your hands!",
        expression: "determined"
    }
];

interface EventIntroScreenProps {
    onComplete: () => void;
}

export function EventIntroScreen({ onComplete }: EventIntroScreenProps) {
    const [currentLine, setCurrentLine] = useState(0);

    const handleNext = () => {
        if (currentLine < GOBLIN_AMBUSH_DIALOGUE.length - 1) {
            setCurrentLine(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const line = GOBLIN_AMBUSH_DIALOGUE[currentLine];
    const isFirst = currentLine === 0;
    const isLast = currentLine === GOBLIN_AMBUSH_DIALOGUE.length - 1;

    return (
        <div className="size-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(17,24,39,1),rgba(2,6,23,1))]" />

            {/* Warning Glow */}
            <motion.div
                animate={{
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 top-0 h-1/2 bg-red-900/10 blur-[100px]"
            />

            <ParticleBackground />

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-4xl flex flex-col h-full items-center justify-between py-12">

                {/* Title / Mood Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center text-center mt-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
                        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent tracking-widest uppercase">
                            Goblin Ambush
                        </h2>
                        <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
                    </div>
                    <p className="text-slate-400 uppercase tracking-[0.2em] text-sm font-bold">
                        Chapter 1: The Invasion
                    </p>
                </motion.div>

                {/* Visual / Character Element */}
                <div className="flex-1 flex items-center justify-center w-full relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={line.expression}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="relative"
                        >
                            <div className="text-9xl drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                {line.expression === 'scared' ? '😱' : '🙏'}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dialogue Box */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full"
                >
                    <div className="bg-slate-900/90 backdrop-blur-md border-2 border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl relative">

                        {/* Speaker Tab */}
                        <div className="absolute -top-5 left-8 bg-slate-800 border-2 border-slate-600 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-slate-400" />
                            <span className="font-bold text-slate-200 tracking-wider text-sm">
                                {line.speaker}
                            </span>
                        </div>

                        {/* Text Content */}
                        <div className="min-h-[100px] flex items-center mt-2">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={currentLine}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed"
                                >
                                    "{line.text}"
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        {/* Controls */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleNext}
                                className="group flex items-center gap-3 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all active:scale-95"
                            >
                                <span>{isLast ? "Begin Ambush" : "Next"}</span>
                                <ArrowRight className={`w-5 h-5 ${isLast ? 'animate-bounce-horizontal' : 'group-hover:translate-x-1'} transition-transform`} />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center mt-6 gap-2">
                        {GOBLIN_AMBUSH_DIALOGUE.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentLine ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-700'
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
