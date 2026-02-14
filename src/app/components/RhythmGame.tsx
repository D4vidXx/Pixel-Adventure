import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface RhythmGameProps {
    type: 'keyboard' | 'drums' | 'violin';
    onComplete: (score: number, totalNotes: number, perfectCount: number) => void;
    onNoteHit: (rating: string) => void; // For passive shield gain
    onClose: () => void;
}

interface Note {
    id: number;
    time: number; // Time in ms when it should be hit
    lane: number; // 0-3 for keyboard/drums, x/y for violin (abstracted)
    x?: number; // For violin
    y?: number; // For violin
    hit: boolean;
}

export function RhythmGame({ type, onComplete, onNoteHit, onClose }: RhythmGameProps) {
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const perfectCountRef = useRef(0); // Use Ref for immediate updates
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNotes, setActiveNotes] = useState<Note[]>([]);
    const [gameStarted, setGameStarted] = useState(false);
    const gameAreaRef = useRef<HTMLDivElement>(null);

    // Initialize Notes
    useEffect(() => {
        const newNotes: Note[] = [];
        const totalNotes = type === 'keyboard' ? 120 : 50;
        const duration = (type === 'violin' ? 30 : (type === 'keyboard' ? 25 : 15)) * 1000;

        for (let i = 0; i < totalNotes; i++) {
            newNotes.push({
                id: i,
                time: (i / totalNotes) * duration * 0.95 + (type === 'drums' ? 3500 : 500),
                lane: Math.floor(Math.random() * 4),
                x: Math.random() * 80 + 10,
                y: Math.random() * 80 + 10,
                hit: false,
            });
        }
        setNotes(newNotes);
        setGameStarted(true);
    }, [type]);


    const handleFinish = () => {
        onComplete(score, 50, perfectCountRef.current);
        onClose();
    };

    const handleHit = (rating: string) => {
        setScore(s => {
            const next = s + 1;
            if (next === 50) {
                setTimeout(handleFinish, 300);
            }
            return next;
        });
        setCombo(prev => {
            const next = prev + 1;
            if (next > maxCombo) setMaxCombo(next);
            return next;
        });
        if (rating === 'Perfect' || rating === 'Perfect!!') {
            perfectCountRef.current += 1;
        }
        onNoteHit(rating);
    };

    const handleMiss = () => {
        setCombo(0);
    };

    // Game Logic handled in sub-components for cleanliness? 
    // Or monolithic here for simplicity? Let's do simple monolithic first.

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">
            {/* Animated Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="w-full max-w-5xl h-[85vh] relative bg-slate-950/50 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col scale-in-center">

                {/* Decorative border glow */}
                <div className="absolute inset-0 rounded-[2rem] border border-white/5 pointer-events-none" />

                {/* Header */}
                <div className="px-8 py-6 flex justify-between items-center bg-white/5 border-b border-white/10">
                    <div className="flex flex-col">
                        <div className="text-white font-black text-2xl uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            {type === 'keyboard' ? '🎹 Keyboard' : type === 'drums' ? '🥁 Drum' : '🎻 Violin'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Symphony</span>
                        </div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1 font-bold">Musical Perfection Mode</div>
                    </div>

                    <div className="flex gap-12 items-center">
                        <div className="flex flex-col items-end">
                            <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Score</div>
                            <div className="text-3xl font-black font-mono text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">{score.toString().padStart(2, '0')} <span className="text-white/20 text-lg">/ 50</span></div>
                        </div>
                        <button
                            onClick={() => {
                                onComplete(25, 50, 0);
                                onClose();
                            }}
                            className="ml-4 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all hover:scale-110 active:scale-90 group"
                            title="Skip (25 notes + 10 shield)"
                        >
                            <X className="text-white w-6 h-6 group-hover:text-yellow-400 transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Combo Overlay (Fixed Position) */}
                <AnimatePresence>
                    {combo > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, x: '-50%' }}
                            animate={{ opacity: 1, scale: 1, x: '-50%' }}
                            key={combo}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 text-center"
                        >
                            <div className="text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                {combo}
                            </div>
                            <div className="text-xs font-black uppercase tracking-[0.4em] text-white/40 mt-[-10px]">Combo</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Game Area */}
                <div ref={gameAreaRef} className="flex-1 relative cursor-crosshair overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)]" />
                    {type === 'keyboard' && <KeyboardGame notes={notes} onHit={handleHit} onMiss={handleMiss} onFinish={handleFinish} />}
                    {type === 'drums' && <DrumGame notes={notes} onHit={handleHit} onMiss={handleMiss} onFinish={handleFinish} />}
                    {type === 'violin' && <ViolinGame notes={notes} onHit={handleHit} onMiss={handleMiss} onFinish={handleFinish} />}
                </div>
            </div>
        </div>
    );
}


// --- Sub-Games ---

interface SubGameProps {
    notes: Note[];
    onHit: (rating: string) => void;
    onMiss: () => void;
    onFinish: () => void;
}

function KeyboardGame({ notes, onHit, onMiss, onFinish }: SubGameProps) {
    const [hitNoteIds, setHitNoteIds] = useState<Set<number>>(new Set());
    const [missedNoteIds, setMissedNoteIds] = useState<Set<number>>(new Set());
    const [hitEffects, setHitEffects] = useState<{ id: number, lane: number, text: string }[]>([]);
    const [pressedLanes, setPressedLanes] = useState<Set<number>>(new Set());
    const startTime = useRef(Date.now());
    const [now, setNow] = useState(Date.now());

    // Constants
    const HIT_POSITION_Y = 82; // Slightly lower for better look
    const SPAWN_TIME = 850; // Faster falling
    const HIT_WINDOW = 130; // Tighter hit window

    // Game Loop for visuals and miss detection
    useEffect(() => {
        const loop = setInterval(() => {
            const currentNow = Date.now();
            setNow(currentNow);

            // Miss Detection: If a note has passed the hit window and isn't hit
            const elapsed = currentNow - startTime.current;
            notes.forEach(note => {
                if (!hitNoteIds.has(note.id) && !missedNoteIds.has(note.id)) {
                    if (elapsed > note.time + HIT_WINDOW) {
                        setMissedNoteIds(prev => new Set(prev).add(note.id));
                        onMiss();
                    }
                }
            });

            // Check for game end
            const lastNoteTime = notes[notes.length - 1]?.time || 0;
            if (elapsed > lastNoteTime + 1000) {
                onFinish();
            }
        }, 16);
        return () => clearInterval(loop);
    }, [notes, hitNoteIds, missedNoteIds]);

    const checkHit = (lane: number) => {
        const elapsed = Date.now() - startTime.current;

        const note = notes.find(n =>
            !hitNoteIds.has(n.id) &&
            n.lane === lane &&
            Math.abs(n.time - elapsed) <= HIT_WINDOW
        );

        if (note) {
            const newHits = new Set(hitNoteIds);
            newHits.add(note.id);
            setHitNoteIds(newHits);

            const diff = Math.abs(note.time - elapsed);
            let rating = 'Good';
            if (diff < 50) rating = 'Perfect';
            else if (diff < 100) rating = 'Good';

            onHit(rating);
            setHitEffects(prev => [...prev, { id: note.id, lane, text: rating }]);
            setTimeout(() => setHitEffects(prev => prev.filter(e => e.id !== note.id)), 500);
        } else {
            // Penalty for ghost tapping: Burn the next note in this lane
            const nextNote = notes.find(n =>
                !hitNoteIds.has(n.id) &&
                !missedNoteIds.has(n.id) &&
                n.lane === lane &&
                n.time > elapsed
            );
            if (nextNote) {
                setMissedNoteIds(prev => new Set(prev).add(nextNote.id));
            }
            onMiss();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return;
            const laneMap: Record<string, number> = {
                'ArrowLeft': 0, 'a': 0,
                'ArrowDown': 1, 's': 1,
                'ArrowUp': 2, 'w': 2,
                'ArrowRight': 3, 'd': 3
            };
            const lane = laneMap[e.key];
            if (lane !== undefined) {
                setPressedLanes(prev => new Set(prev).add(lane));
                checkHit(lane);
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            const laneMap: Record<string, number> = {
                'ArrowLeft': 0, 'a': 0,
                'ArrowDown': 1, 's': 1,
                'ArrowUp': 2, 'w': 2,
                'ArrowRight': 3, 'd': 3
            };
            const lane = laneMap[e.key];
            if (lane !== undefined) {
                setPressedLanes(prev => {
                    const next = new Set(prev);
                    next.delete(lane);
                    return next;
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [hitNoteIds, notes]);

    const ICONS = [ArrowLeft, ArrowDown, ArrowUp, ArrowRight];
    const COLORS = ['text-purple-400', 'text-cyan-400', 'text-emerald-400', 'text-rose-400'];
    const GLOW_COLORS = ['shadow-purple-500/50', 'shadow-cyan-500/50', 'shadow-emerald-500/50', 'shadow-rose-500/50'];
    const BG_GRADIENTS = [
        'from-purple-600 to-purple-400',
        'from-cyan-600 to-cyan-400',
        'from-emerald-600 to-emerald-400',
        'from-rose-600 to-rose-400'
    ];

    return (
        <div className="relative w-full h-full flex justify-center gap-6 px-12 pb-12 pt-4">
            {[0, 1, 2, 3].map(lane => {
                const Icon = ICONS[lane];
                const isPressed = pressedLanes.has(lane);
                return (
                    <div key={lane} className="relative w-24 h-full flex flex-col items-center">
                        {/* Lane Background Track */}
                        <div className={`absolute inset-0 w-full bg-gradient-to-b from-white/[0.02] to-white/[0.05] border-x border-white/5 transition-colors duration-200 ${isPressed ? 'bg-white/[0.08]' : ''}`} />

                        {/* Lane Glow Effect */}
                        <AnimatePresence>
                            {isPressed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`absolute inset-0 w-full bg-gradient-to-t ${BG_GRADIENTS[lane].replace('from-', 'from-').replace('to-', 'to-')} opacity-10 blur-xl`}
                                />
                            )}
                        </AnimatePresence>

                        {/* Receptor (Target) */}
                        <div
                            className={`absolute bottom-[10%] w-20 h-20 flex items-center justify-center border-2 rounded-2xl z-10 transition-all duration-75 
                                ${isPressed ? `scale-90 border-white bg-white/10 ${GLOW_COLORS[lane]} shadow-[0_0_20px_rgba(255,255,255,0.3)]` : 'border-white/20 bg-black/40'}`}
                            style={{ top: `${HIT_POSITION_Y}%` }}
                        >
                            <Icon className={`w-10 h-10 ${isPressed ? 'text-white' : 'text-white/20'}`} />
                        </div>

                        {/* Falling Notes */}
                        {notes.filter(n => n.lane === lane && !hitNoteIds.has(n.id) && !missedNoteIds.has(n.id)).map(note => {
                            const elapsed = now - startTime.current;
                            const timeUntilHit = note.time - elapsed;

                            if (timeUntilHit > SPAWN_TIME || timeUntilHit < -200) return null;

                            const progress = 1 - (timeUntilHit / SPAWN_TIME);
                            const top = progress * HIT_POSITION_Y;

                            return (
                                <motion.div
                                    key={note.id}
                                    style={{ top: `${top}%` }}
                                    className={`absolute w-20 h-20 flex items-center justify-center rounded-2xl shadow-xl z-20 bg-gradient-to-br ${BG_GRADIENTS[lane]} border-2 border-white/30`}
                                >
                                    <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                                    {/* Inner glow */}
                                    <div className="absolute inset-0 rounded-2xl bg-white/20 blur-[2px]" />
                                </motion.div>
                            );
                        })}

                        {/* Hit Effects */}
                        <div className="absolute w-full flex flex-col items-center pointer-events-none z-30" style={{ top: `${HIT_POSITION_Y - 12}%` }}>
                            <AnimatePresence mode="popLayout">
                                {hitEffects.filter(e => e.lane === lane).map(e => (
                                    <motion.div
                                        key={e.id}
                                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                        animate={{ opacity: 1, scale: 1.2, y: -40 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className={`font-black text-2xl ${COLORS[lane]} drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] italic tracking-tighter`}
                                    >
                                        {e.text.toUpperCase()}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ... Re-implementing simplified logic to avoid complexity
// We will use a centralized game loop in the main component instead of per-note logic

function DrumGame({ notes, onHit, onMiss, onFinish }: SubGameProps) {
    const [hitNoteIds, setHitNoteIds] = useState<Set<number>>(new Set());
    const [missedNoteIds, setMissedNoteIds] = useState<Set<number>>(new Set());
    const [hitEffects, setHitEffects] = useState<{ time: number, text: string, type: 'Perfect!!' | 'Perfect' | 'Good' }[]>([]);
    const [startDelay, setStartDelay] = useState(3);
    const startTime = useRef(Date.now());
    const [now, setNow] = useState(Date.now());
    const HIT_ZONE_X = 220; // Slightly more right for better balance

    // Countdown logic
    useEffect(() => {
        if (startDelay > 0) {
            const timer = setTimeout(() => setStartDelay(d => d - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [startDelay]);

    useEffect(() => {
        const id = setInterval(() => {
            const currentNow = Date.now();
            setNow(currentNow);

            // Miss Detection
            const elapsed = currentNow - startTime.current;
            notes.forEach(note => {
                if (!hitNoteIds.has(note.id) && !missedNoteIds.has(note.id)) {
                    // If note has passed the hit zone + 100ms window
                    if (elapsed > note.time + 100) {
                        setMissedNoteIds(prev => new Set(prev).add(note.id));
                        onMiss();
                    }
                }
            });

            // Check for game end
            const lastNoteTime = notes[notes.length - 1]?.time || 0;
            if (elapsed > lastNoteTime + 1000) {
                onFinish();
            }
        }, 16);
        return () => clearInterval(id);
    }, [notes, hitNoteIds, missedNoteIds]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat || startDelay > 0) return;

            const isRedInput = ['f', 'j'].includes(e.key.toLowerCase());
            const isBlueInput = ['d', 'k'].includes(e.key.toLowerCase());

            if (!isRedInput && !isBlueInput) return;

            const elapsed = Date.now() - startTime.current;
            const targetType = isRedInput ? 0 : 1; // Even = Red, Odd = Blue

            // Find valid note
            const hitNote = notes.find(n =>
                !hitNoteIds.has(n.id) &&
                !missedNoteIds.has(n.id) &&
                Math.abs(n.time - elapsed) < 100 &&
                (n.lane % 2 === targetType)
            );

            if (hitNote) {
                const newHits = new Set(hitNoteIds);
                newHits.add(hitNote.id);
                setHitNoteIds(newHits);

                const diff = Math.abs(hitNote.time - elapsed);
                let rating: 'Perfect!!' | 'Perfect' | 'Good' = 'Good';
                if (diff < 25) rating = 'Perfect!!';
                else if (diff < 50) rating = 'Perfect';

                onHit(rating);
                setHitEffects(prev => [...prev, { time: Date.now(), text: rating, type: rating }]);
                setTimeout(() => setHitEffects(prev => prev.filter(e => Date.now() - e.time < 500)), 500);
            } else {
                onMiss();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hitNoteIds, missedNoteIds, notes, startDelay]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden px-8">

            {/* Visual Track (Liquid Neon) */}
            <div className="w-full h-48 bg-white/5 backdrop-blur-md border-y-2 border-white/10 relative flex items-center overflow-hidden rounded-xl">

                {/* Track Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent pointer-events-none" />

                {/* Hit Zone Target */}
                <div
                    className="absolute w-28 h-28 rounded-full border-2 border-white/30 bg-black/40 z-20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    style={{ left: `${HIT_ZONE_X}px` }}
                >
                    <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-2 border-white/5 animate-pulse" />
                    </div>
                </div>

                {/* Hit Effect Flash */}
                <AnimatePresence>
                    {hitEffects.map(effect => (
                        <div key={effect.time} className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                            {/* Visual Bloom */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1.5 }}
                                exit={{ opacity: 0 }}
                                className={`absolute w-32 h-32 rounded-full blur-2xl z-10 ${effect.type === 'Perfect!!' ? 'bg-amber-400/40' :
                                    effect.type === 'Perfect' ? 'bg-cyan-400/30' : 'bg-white/20'
                                    }`}
                                style={{ left: `${HIT_ZONE_X - 16}px` }}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 0, scale: 0.8 }}
                                animate={{ opacity: 1, y: -70, scale: 1.2 }}
                                exit={{ opacity: 0 }}
                                className={`absolute font-black text-3xl tracking-tighter italic ${effect.type === 'Perfect!!' ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]' :
                                    effect.type === 'Perfect' ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]' :
                                        'text-white drop-shadow-md'
                                    }`}
                                style={{ left: `${HIT_ZONE_X}px` }}
                            >
                                {effect.text}
                            </motion.div>
                        </div>
                    ))}
                </AnimatePresence>

                {/* Scrolling Notes */}
                {notes.filter(n => !hitNoteIds.has(n.id) && !missedNoteIds.has(n.id)).map(n => {
                    const elapsed = now - startTime.current;
                    const timeDiff = n.time - elapsed;
                    const x = HIT_ZONE_X + (timeDiff * 0.5);

                    if (x < -100 || x > 2000) return null;

                    const isRed = n.lane % 2 === 0;
                    return (
                        <div
                            key={n.id}
                            style={{ left: `${x}px` }}
                            className={`absolute w-24 h-24 rounded-full border-4 shadow-2xl z-10 flex items-center justify-center transition-transform scale-90 ${isRed
                                ? 'bg-gradient-to-br from-rose-600 to-rose-400 border-rose-200 shadow-rose-500/50'
                                : 'bg-gradient-to-br from-cyan-600 to-cyan-400 border-cyan-200 shadow-cyan-500/50'
                                }`}
                        >
                            <div className="absolute inset-0 rounded-full bg-white/20 blur-[2px]" />
                            <div className="text-white font-black text-2xl drop-shadow-md z-10">
                                {isRed ? 'DON' : 'KA'}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Controls Info */}
            <div className="mt-12 flex gap-10">
                <div className="flex flex-col items-center bg-white/5 border border-white/10 px-8 py-4 rounded-2xl backdrop-blur-sm transition-all hover:bg-white/10">
                    <div className="flex gap-2">
                        <kbd className="px-3 py-1 bg-rose-500/20 border border-rose-500/40 rounded text-rose-400 font-bold text-xl">F</kbd>
                        <kbd className="px-3 py-1 bg-rose-500/20 border border-rose-500/40 rounded text-rose-400 font-bold text-xl">J</kbd>
                    </div>
                    <div className="mt-2 text-[10px] text-rose-300/60 uppercase tracking-[0.2em] font-black">Center (Red)</div>
                </div>

                <div className="flex flex-col items-center bg-white/5 border border-white/10 px-8 py-4 rounded-2xl backdrop-blur-sm transition-all hover:bg-white/10">
                    <div className="flex gap-2">
                        <kbd className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded text-cyan-400 font-bold text-xl">D</kbd>
                        <kbd className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded text-cyan-400 font-bold text-xl">K</kbd>
                    </div>
                    <div className="mt-2 text-[10px] text-cyan-300/60 uppercase tracking-[0.2em] font-black">Rim (Blue)</div>
                </div>
            </div>

            {/* Prep Time Overlay */}
            <AnimatePresence>
                {startDelay > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        key={startDelay}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                            >
                                {startDelay}
                            </motion.div>
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/40 uppercase tracking-[0.5em] font-bold text-sm whitespace-nowrap">Get Ready</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}

function ViolinGame({ notes, onHit, onMiss, onFinish }: SubGameProps) {
    const [hitNoteIds, setHitNoteIds] = useState<Set<number>>(new Set());
    const [missedNoteIds, setMissedNoteIds] = useState<Set<number>>(new Set());
    const [hitEffects, setHitEffects] = useState<{ id: number, x: number, y: number, text: string, type: 'Perfect' | 'Good' }[]>([]);
    const startTime = useRef(Date.now());
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const id = setInterval(() => {
            const currentNow = Date.now();
            setNow(currentNow);

            // Miss Detection
            const elapsed = currentNow - startTime.current;
            notes.forEach(note => {
                if (!hitNoteIds.has(note.id) && !missedNoteIds.has(note.id)) {
                    const timeDiff = note.time - elapsed;
                    if (timeDiff < -200) {
                        setMissedNoteIds(prev => new Set(prev).add(note.id));
                        onMiss();
                    }
                }
            });

            // Check for game end
            const lastNoteTime = notes[notes.length - 1]?.time || 0;
            if (elapsed > lastNoteTime + 1000) {
                onFinish();
            }
        }, 16);
        return () => clearInterval(id);
    }, [notes, hitNoteIds, missedNoteIds]);

    const handleClick = (e: React.MouseEvent, note: Note) => {
        e.stopPropagation();
        const elapsed = Date.now() - startTime.current;
        const diff = Math.abs(note.time - elapsed);

        // Forgiving hit window for click but strict for tiering
        if (diff < 250 && !hitNoteIds.has(note.id) && !missedNoteIds.has(note.id)) {
            const newHits = new Set(hitNoteIds);
            newHits.add(note.id);
            setHitNoteIds(newHits);

            let rating: 'Perfect' | 'Good' = 'Good';
            if (diff < 80) rating = 'Perfect';

            onHit(rating);
            setHitEffects(prev => [...prev, { id: note.id, x: note.x!, y: note.y!, text: rating, type: rating }]);
            setTimeout(() => setHitEffects(prev => prev.filter(e => e.id !== note.id)), 500);
        }
    };

    return (
        <div className="w-full h-full relative bg-transparent cursor-crosshair overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
            />

            {/* Note Rendering */}
            {notes.filter(n => !hitNoteIds.has(n.id) && !missedNoteIds.has(n.id)).map(n => {
                const elapsed = now - startTime.current;
                const timeDiff = n.time - elapsed;

                // Show 500ms before
                if (timeDiff > 500 || timeDiff < -200) return null;

                const progress = 1 - (timeDiff / 500);
                const safeProgress = Math.max(0, Math.min(1.2, progress));
                const ringScale = 2.5 - (safeProgress * 1.5); // Shrink from 2.5 to 1.0

                return (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onMouseDown={(e) => handleClick(e, n)}
                        style={{ left: `${n.x}%`, top: `${n.y}%` }}
                        className="absolute w-24 h-24 -ml-12 -mt-12 pointer-events-auto select-none group"
                    >
                        {/* Approach Circle */}
                        <div
                            style={{
                                transform: `scale(${ringScale})`,
                                opacity: progress < 0 ? 0 : 0.6
                            }}
                            className={`absolute inset-0 rounded-full border-2 border-white pointer-events-none z-0 ${progress > 0.8 ? 'border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : ''}`}
                        />

                        {/* Note Body (Glassmorphic) */}
                        <div
                            className={`absolute inset-2 rounded-full bg-white/10 backdrop-blur-md border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 active:scale-90 z-10`}
                        >
                            {/* Inner Circle Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 opacity-50" />
                            <div className="text-white font-black text-3xl drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] relative">
                                {Math.floor(n.id % 9) + 1}
                            </div>
                        </div>

                        {/* Outer Glow Ring */}
                        <div className="absolute inset-1 rounded-full border border-white/5 pointer-events-none" />
                    </motion.div>
                );
            })}

            {/* Hit Effects Overlay */}
            <AnimatePresence>
                {hitEffects.map(e => (
                    <motion.div
                        key={e.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 2 }}
                        exit={{ opacity: 0 }}
                        style={{ left: `${e.x}%`, top: `${e.y}%` }}
                        className={`absolute font-black text-4xl z-50 -ml-20 -mt-10 w-40 text-center pointer-events-none italic tracking-tighter ${e.type === 'Perfect'
                            ? 'text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                            : 'text-purple-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]'
                            }`}
                    >
                        {e.text.toUpperCase()}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
