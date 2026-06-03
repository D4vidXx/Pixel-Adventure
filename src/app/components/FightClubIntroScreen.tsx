import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MessageSquare, Mic } from 'lucide-react';

interface DialogueLine {
    speaker: string;
    text: string;
    emoji: string;
}

const FIGHT_CLUB_DIALOGUE: DialogueLine[] = [
    {
        speaker: 'Shady Promoter',
        text: "Well, well... I heard you can handle yourself in a scrap. That right?",
        emoji: '🎩',
    },
    {
        speaker: 'Shady Promoter',
        text: "Good. Because we run something special down here. No rules. No refs. Just fists.",
        emoji: '🎩',
    },
    {
        speaker: 'Shady Promoter',
        text: "Five fighters stand between you and the championship gloves. I've seen legends leave in a stretcher.",
        emoji: '🎩',
    },
    {
        speaker: 'Shady Promoter',
        text: "Think you've got what it takes? Then step into the ring. The crowd's waiting.",
        emoji: '😏',
    },
];

interface FightClubIntroScreenProps {
    fighterName: string;
    onComplete: () => void;
}

export function FightClubIntroScreen({ fighterName, onComplete }: FightClubIntroScreenProps) {
    const [currentLine, setCurrentLine] = useState(0);

    const line = FIGHT_CLUB_DIALOGUE[currentLine];
    const isLast = currentLine === FIGHT_CLUB_DIALOGUE.length - 1;

    const handleNext = () => {
        if (!isLast) setCurrentLine(prev => prev + 1);
        else onComplete();
    };

    return (
        <div className="size-full bg-slate-950 flex flex-col items-center justify-between p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(30,10,10,1),rgba(2,6,23,1))]" />
            <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.1) 2px,rgba(255,255,255,0.1) 4px)' }} />

            <motion.div
                animate={{ opacity: [0.1, 0.25, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-0 inset-x-0 h-64 bg-red-900/30 blur-[100px]"
            />

            <div className="relative z-10 w-full max-w-4xl flex flex-col h-full items-center justify-between py-10">
                {/* Header */}
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
                    <p className="text-red-500 uppercase tracking-[0.3em] text-xs font-black">The Underground Circuit</p>
                    <h2 className="text-3xl font-black text-white tracking-wide mt-1">
                        Welcome, <span className="text-red-400">{fighterName}</span>
                    </h2>
                </motion.div>

                {/* Character */}
                <div className="flex-1 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentLine}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            className="text-9xl drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                        >
                            {line.emoji}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dialogue Box */}
                <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full">
                    <div className="bg-slate-900/90 backdrop-blur-md border-2 border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl relative">
                        <div className="absolute -top-5 left-8 bg-slate-800 border-2 border-red-900/60 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                            <Mic className="w-4 h-4 text-red-400" />
                            <span className="font-bold text-slate-200 tracking-wider text-sm">{line.speaker}</span>
                        </div>
                        <div className="min-h-[80px] flex items-center mt-2">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={currentLine}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed"
                                >
                                    "{line.text}"
                                </motion.p>
                            </AnimatePresence>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleNext}
                                className="group flex items-center gap-3 px-8 py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl transition-all active:scale-95"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>{isLast ? 'Fight!' : 'Next'}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center mt-5 gap-2">
                        {FIGHT_CLUB_DIALOGUE.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentLine ? 'w-8 bg-red-500' : 'w-2 bg-slate-700'}`}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
