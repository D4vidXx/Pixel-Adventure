import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, ArrowRight, Shield } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';



// ─── Types ───────────────────────────────────────────────────────────────────

type Phase =
    | 'intro_pause'
    | 'choose'
    | 'attack_seq'
    | 'dodge_prompt'
    | 'defend_seq'
    | 'counter_charge'
    | 'result_flash'
    | 'enemy_turn'
    | 'level_end';

// ─── Constants ────────────────────────────────────────────────────────────────

const SEQ_KEYS = ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'];
const ATTACK_MS = 800;
const DEFEND_MS = 1400;
const DODGE_MS = 500;          // defense-side dodge window
const DODGE_OFFENSE_MS = 900;  // longer window when missed during attack
const CHARGE_DURATION_MS = 2000;

function randomSeq(): string[] {
    return Array.from({ length: 8 }, () =>
        SEQ_KEYS[Math.floor(Math.random() * SEQ_KEYS.length)]
    );
}

// ─── Fight Data ───────────────────────────────────────────────────────────────

interface Fighter {
    name: string;
    emoji: string;
    maxHp: number;
    damage: number;
    title: string;
}

const FIGHTERS: Fighter[] = [
    { name: 'Street Brawler', emoji: '😤', maxHp: 60, damage: 10, title: 'Round 1' },
    { name: 'The Bruiser', emoji: '💪', maxHp: 90, damage: 18, title: 'Round 2' },
    { name: 'Shadow Boxer', emoji: '🥷', maxHp: 75, damage: 14, title: 'Round 3' },
    { name: 'The Enforcer', emoji: '😠', maxHp: 110, damage: 22, title: 'Round 4' },
    { name: 'Iron Fist', emoji: '👊', maxHp: 150, damage: 28, title: 'Final Round' },
];

// ─── SF-style HP bar color ────────────────────────────────────────────────────

function hpColor(pct: number): string {
    if (pct > 0.6) return '#22c55e';
    if (pct > 0.3) return '#eab308';
    return '#ef4444';
}

// ─── SFBar sub-component ──────────────────────────────────────────────────────

interface SFBarProps {
    name: string;
    hp: number;
    maxHp: number;
    isPlayer?: boolean;
}

function SFBar({ name, hp, maxHp, isPlayer = false }: SFBarProps) {
    const pct = Math.max(0, hp / maxHp);
    const color = hpColor(pct);
    const isLow = pct < 0.3;

    // Steep SF-style diagonal: about 14% horizontal skew on the far edge
    const clipPlayer = 'polygon(0 0, 100% 0, 93% 100%, 0 100%)';
    const clipEnemy = 'polygon(7% 0, 100% 0, 100% 100%, 0 100%)';

    return (
        <div className={`flex-1 flex flex-col gap-0.5 ${isPlayer ? '' : 'items-end'}`}>
            {/* Name plate */}
            <div className={`flex items-center gap-2 ${isPlayer ? '' : 'flex-row-reverse'}`}>
                <span
                    className="font-black uppercase tracking-widest text-white truncate max-w-[150px]"
                    style={{
                        fontSize: 'clamp(10px,2.2vw,15px)',
                        textShadow: '0 0 10px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,0.9)',
                        letterSpacing: '0.12em',
                    }}
                >
                    {name}
                </span>
                <span className="text-[10px] font-bold text-slate-400 tabular-nums">{hp}/{maxHp}</span>
            </div>

            {/* Outer shell — dark track with HP-colored outer glow */}
            <div
                className="relative w-full overflow-hidden"
                style={{
                    height: '2.25rem',
                    clipPath: isPlayer ? clipPlayer : clipEnemy,
                    background: '#111',
                    boxShadow: `inset 0 2px 8px rgba(0,0,0,0.9), inset 0 -1px 2px rgba(0,0,0,0.5), 0 0 ${isLow ? '22px' : '14px'} ${color}99, 0 0 ${isLow ? '8px' : '4px'} ${color}`,
                    border: '2px solid rgba(0,0,0,0.8)',
                }}
            >
                {/* HP fill — spring-animated width */}
                <motion.div
                    className={`absolute top-0 bottom-0 ${isPlayer ? 'left-0' : 'right-0'}`}
                    animate={{ width: `${pct * 100}%` }}
                    transition={{ type: 'spring', stiffness: 90, damping: 22 }}
                    style={{
                        background: `linear-gradient(180deg,
                            ${color}ff 0%,
                            ${color}dd 40%,
                            ${color}bb 80%,
                            ${color}88 100%)`,
                        boxShadow: isLow
                            ? `0 0 18px ${color}, inset 0 0 10px ${color}44`
                            : `0 0 10px ${color}99`,
                    }}
                />

                {/* Specular highlight strip — bright top edge */}
                <div
                    className="absolute inset-x-0 pointer-events-none"
                    style={{
                        top: 0,
                        height: '35%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 100%)',
                    }}
                />

                {/* Segment dividers — 10 cells, thick lines */}
                <div className={`absolute inset-0 flex ${isPlayer ? '' : 'flex-row-reverse'} pointer-events-none`}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 last:border-r-0"
                            style={{ borderRight: '3px solid rgba(0,0,0,0.75)' }}
                        />
                    ))}
                </div>

                {/* Low HP warning pulse */}
                {isLow && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 0.55, repeat: Infinity }}
                        style={{ background: '#ef4444' }}
                    />
                )}
            </div>
        </div>
    );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface FightClubGameProps {
    fighterName: string;
    onVictory: () => void;
    onDefeat: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FightClubGame({ fighterName, onVictory, onDefeat }: FightClubGameProps) {
    const PLAYER_MAX_HP = 100;

    const [fightIndex, setFightIndex] = useState(0);
    const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
    const [enemyHp, setEnemyHp] = useState(FIGHTERS[0].maxHp);
    const [phase, setPhase] = useState<Phase>('intro_pause');
    const [sequence, setSequence] = useState<string[]>([]);
    const [currentKeyIdx, setCurrentKeyIdx] = useState(0);
    const [timerPct, setTimerPct] = useState(1);
    const [flashMsg, setFlashMsg] = useState('');
    const [flashColor, setFlashColor] = useState('text-green-400');
    const [dodgeKey, setDodgeKey] = useState('');
    const [chargeCount, setChargeCount] = useState(0);

    const pendingDmg = useRef(0);
    const timerRaf = useRef<number | null>(null);
    const timerStart = useRef(0);
    const enemyHpRef = useRef(FIGHTERS[0].maxHp);
    // 'offense'    = wrong key during attack_seq (longer window)
    // 'enemy_turn' = enemy is attacking, dodge to avoid damage
    // null         = wrong key during defend_seq (standard window)
    const [dodgeOrigin, setDodgeOrigin] = useState<'offense' | 'enemy_turn' | null>(null);

    const enemy = FIGHTERS[fightIndex];

    // Keep ref in sync with state
    useEffect(() => { enemyHpRef.current = enemyHp; }, [enemyHp]);

    // ── Helpers ───────────────────────────────────────────────────────────────

    const clearTimer = () => {
        if (timerRaf.current !== null) {
            cancelAnimationFrame(timerRaf.current);
            timerRaf.current = null;
        }
    };

    const startTimer = useCallback((durationMs: number, onExpire: () => void) => {
        clearTimer();
        timerStart.current = performance.now();
        const tick = (now: number) => {
            const pct = Math.max(0, 1 - (now - timerStart.current) / durationMs);
            setTimerPct(pct);
            if (pct <= 0) { onExpire(); return; }
            timerRaf.current = requestAnimationFrame(tick);
        };
        timerRaf.current = requestAnimationFrame(tick);
    }, []);

    const flash = (msg: string, color: string, next: () => void, delay = 800) => {
        clearTimer();
        setFlashMsg(msg);
        setFlashColor(color);
        setPhase('result_flash');
        setTimeout(next, delay);
    };

    const beginChoose = useCallback(() => {
        clearTimer();
        pendingDmg.current = 0;
        setCurrentKeyIdx(0);
        setChargeCount(0);
        setPhase('choose');
    }, []);

    const beginEnemyTurn = useCallback(() => {
        clearTimer();
        setPhase('enemy_turn');
    }, []);

    // ── Fight init ────────────────────────────────────────────────────────────

    useEffect(() => {
        setEnemyHp(FIGHTERS[fightIndex].maxHp);
        setPhase('intro_pause');
        const t = setTimeout(beginChoose, 1200);
        return () => clearTimeout(t);
    }, [fightIndex, beginChoose]);

    // ── Sequence logic ────────────────────────────────────────────────────────

    const startAttackSeq = () => {
        setSequence(randomSeq()); setCurrentKeyIdx(0); pendingDmg.current = 0;
        setPhase('attack_seq');
    };
    const startDefendSeq = () => {
        setSequence(randomSeq()); setCurrentKeyIdx(0); pendingDmg.current = 0;
        setPhase('defend_seq');
    };

    useEffect(() => {
        if (phase !== 'attack_seq') return;
        startTimer(ATTACK_MS, () => {
            setDodgeKey(SEQ_KEYS[Math.floor(Math.random() * SEQ_KEYS.length)]);
            setPhase('dodge_prompt');
        });
        return clearTimer;
    }, [phase, currentKeyIdx, startTimer]);

    useEffect(() => {
        if (phase !== 'defend_seq') return;
        startTimer(DEFEND_MS, () => flash('❌ Defense Failed!', 'text-red-400', beginEnemyTurn));
        return clearTimer;
    }, [phase, currentKeyIdx, startTimer, beginEnemyTurn]);

    useEffect(() => {
        if (phase !== 'dodge_prompt') return;
        // Offense dodge gets a longer window than the others
        const duration = dodgeOrigin === 'offense' ? DODGE_OFFENSE_MS : DODGE_MS;
        startTimer(duration, () => {
            const dmg = enemy.damage;
            flash(`TOOK ${dmg} DAMAGE!`, 'text-red-400', () => {
                setPlayerHp(prev => {
                    const next = Math.max(0, prev - dmg);
                    if (next <= 0) setTimeout(onDefeat, 600);
                    return next;
                });
                beginChoose();
            });
        });
        return clearTimer;
    }, [phase, dodgeOrigin, startTimer, enemy.damage, beginChoose, onDefeat]);

    useEffect(() => {
        if (phase !== 'counter_charge') return;
        const end = Date.now() + CHARGE_DURATION_MS;
        const interval = setInterval(() => {
            if (Date.now() >= end) {
                clearInterval(interval);
                const totalDmg = (50 + Math.floor(Math.random() * 20)) + Math.min(chargeCount, 30);
                setEnemyHp(prev => {
                    const next = Math.max(0, prev - totalDmg);
                    if (next <= 0) {
                        setTimeout(() => {
                            if (fightIndex + 1 >= FIGHTERS.length) onVictory();
                            else { setFightIndex(fi => fi + 1); setPlayerHp(PLAYER_MAX_HP); }
                        }, 1200);
                    }
                    return next;
                });
                flash(`COUNTER! ${totalDmg} damage!`, 'text-yellow-300', beginChoose, 1200);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [phase, chargeCount, fightIndex, beginChoose, onVictory]);

    // ── Mid-combo kill detection ────────────────────────────────────────────────
    // Enemy can die from incremental hits before the sequence finishes
    useEffect(() => {
        if (phase !== 'attack_seq' || enemyHp > 0) return;
        clearTimer();
        flash('K.O.!', 'text-green-400', () => {
            if (fightIndex + 1 >= FIGHTERS.length) onVictory();
            else { setFightIndex(fi => fi + 1); setPlayerHp(PLAYER_MAX_HP); }
        }, 1200);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enemyHp, phase]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const pressed = e.key === ';' ? ';' : e.key.toUpperCase();

            if (phase === 'attack_seq') {
                if (pressed === sequence[currentKeyIdx]) {
                    // Deal 10 damage immediately — visible on the HP bar right away
                    const newHp = Math.max(0, enemyHpRef.current - 10);
                    setEnemyHp(newHp);
                    const nextIdx = currentKeyIdx + 1;
                    if (newHp <= 0) {
                        // Death handled by the mid-combo useEffect above
                        clearTimer();
                        return;
                    }
                    if (nextIdx >= sequence.length) {
                        flash('FULL COMBO!', 'text-green-400', beginEnemyTurn, 1200);
                    } else setCurrentKeyIdx(nextIdx);
                } else {
                    setDodgeOrigin('offense');
                    setDodgeKey(SEQ_KEYS[Math.floor(Math.random() * SEQ_KEYS.length)]);
                    clearTimer(); setPhase('dodge_prompt');
                }
                return;
            }
            if (phase === 'dodge_prompt' && pressed === dodgeKey) {
                clearTimer();
                const origin = dodgeOrigin;
                setDodgeOrigin(null);
                flash('DODGED!', 'text-blue-400', () => {
                    // Enemy-turn dodge: go back to choose (no counter); others: hand off to enemy
                    if (origin === 'enemy_turn') beginChoose();
                    else beginEnemyTurn();
                });
                return;
            }
            // Space bar starts an attack from the choose screen
            if (phase === 'choose' && e.key === ' ') {
                startAttackSeq();
                return;
            }
            if (phase === 'defend_seq') {
                if (pressed === sequence[currentKeyIdx]) {
                    const nextIdx = currentKeyIdx + 1;
                    if (nextIdx >= sequence.length) { clearTimer(); setChargeCount(0); setPhase('counter_charge'); }
                    else setCurrentKeyIdx(nextIdx);
                } else { clearTimer(); flash('DEFENSE FAILED!', 'text-red-400', beginEnemyTurn); }
                return;
            }
            if (phase === 'counter_charge') { setChargeCount(c => c + 1); return; }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [phase, sequence, currentKeyIdx, dodgeKey, fightIndex, beginChoose, beginEnemyTurn, onVictory, startTimer]);

    useEffect(() => {
        if (phase !== 'enemy_turn') return;
        // Brief wind-up, then show a dodge prompt the player can react to
        const delay = setTimeout(() => {
            setDodgeOrigin('enemy_turn');
            setDodgeKey(SEQ_KEYS[Math.floor(Math.random() * SEQ_KEYS.length)]);
            setPhase('dodge_prompt');
        }, 700);
        return () => clearTimeout(delay);
    }, [phase, enemy]);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="size-full flex flex-col relative overflow-hidden select-none">

            {/* ── Background layers (same as normal match) ── */}
            {/* Dark overlay so the selected background gradient shows through at correct brightness */}
            <div className="absolute inset-0 bg-slate-950/30" />
            {/* Floating particles */}
            <ParticleBackground />

            {/* Top shadow so HUD text stays readable over any background */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            {/* Bottom shadow behind action panel */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

            {/* ══ SF-style HUD ══ */}
            <div className="relative z-20 px-3 pt-3 pb-0.5">
                {/* Round label */}
                <div className="flex items-center justify-center mb-2">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 w-12 bg-gradient-to-r from-transparent to-yellow-600/60" />
                        <span className="text-yellow-400 font-black tracking-[0.35em] uppercase text-xs drop-shadow-[0_0_12px_rgba(234,179,8,0.9)]">
                            {enemy.title}
                        </span>
                        <div className="h-px flex-1 w-12 bg-gradient-to-l from-transparent to-yellow-600/60" />
                    </div>
                </div>

                {/* HP Bars row */}
                <div className="flex items-stretch gap-2">
                    <SFBar name={fighterName} hp={playerHp} maxHp={PLAYER_MAX_HP} isPlayer />

                    {/* VS badge */}
                    <div className="flex flex-col items-center justify-center flex-shrink-0 self-center">
                        <div className="w-9 h-9 rounded-full bg-black/80 border-2 border-yellow-500/70 flex items-center justify-center shadow-[0_0_14px_rgba(234,179,8,0.6)]">
                            <span className="text-yellow-400 font-black text-[9px] leading-none tracking-wider">VS</span>
                        </div>
                    </div>

                    <SFBar name={enemy.name} hp={enemyHp} maxHp={enemy.maxHp} />
                </div>
            </div>

            {/* ── Arena: sequences + flash messages live here ── */}
            <div className="relative z-10 flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">

                    {/* Flash message */}
                    {phase === 'result_flash' && (
                        <motion.div key="flash"
                            initial={{ scale: 0.4, opacity: 0, y: 30 }}
                            animate={{ scale: 1.1, opacity: 1, y: 0 }}
                            exit={{ scale: 1.4, opacity: 0 }}
                            className="flex items-center justify-center pointer-events-none"
                        >
                            <span
                                className={`text-4xl md:text-5xl font-black ${flashColor}`}
                                style={{ textShadow: '0 2px 16px rgba(0,0,0,0.95), 0 0 40px currentColor' }}
                            >
                                {flashMsg}
                            </span>
                        </motion.div>
                    )}

                    {/* KEY SEQUENCE — attack or defend — shown in the arena */}
                    {(phase === 'attack_seq' || phase === 'defend_seq') && (
                        <motion.div key="seq-arena"
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 w-full px-6"
                        >
                            <p className={`text-xs font-black uppercase tracking-[0.3em] ${phase === 'attack_seq' ? 'text-red-400' : 'text-blue-400'}`}>
                                {phase === 'attack_seq' ? 'Attack Sequence' : 'Defense Sequence'}
                            </p>

                            {/* Large key tiles */}
                            <div className="flex gap-3 flex-wrap justify-center">
                                {sequence.map((key, idx) => {
                                    const st = idx < currentKeyIdx ? 'done' : idx === currentKeyIdx ? 'active' : 'pending';
                                    return (
                                        <motion.div key={idx}
                                            animate={st === 'active' ? {
                                                scale: [1, 1.25, 1],
                                                boxShadow: ['0 0 0px rgba(250,204,21,0)', '0 0 28px rgba(250,204,21,1)', '0 0 12px rgba(250,204,21,0.5)'],
                                            } : {}}
                                            transition={{ duration: 0.45, repeat: st === 'active' ? Infinity : 0 }}
                                            className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl border-2 transition-colors
                                                ${st === 'done' ? 'bg-slate-700/80 border-slate-600 text-green-400' : ''}
                                                ${st === 'active' ? 'bg-yellow-400 border-yellow-200 text-slate-900' : ''}
                                                ${st === 'pending' ? 'bg-slate-900/70 border-slate-700/60 text-slate-500' : ''}
                                            `}
                                        >
                                            {st === 'done' ? '✓' : key}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Timer bar */}
                            <div className="w-64 h-2.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40">
                                <div
                                    className={`h-full rounded-full transition-none ${phase === 'attack_seq' ? 'bg-red-500' : 'bg-blue-500'}`}
                                    style={{ width: `${timerPct * 100}%` }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* DODGE PROMPT — also in the arena */}
                    {phase === 'dodge_prompt' && (
                        <motion.div key="dodge-arena"
                            initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <p className="text-red-400 font-black text-xl uppercase tracking-widest animate-pulse">DODGE! Press:</p>
                            <motion.div
                                animate={{
                                    scale: [1, 1.15, 1],
                                    boxShadow: ['0 0 0px #ef4444', '0 0 30px #ef4444', '0 0 0px #ef4444'],
                                }}
                                transition={{ duration: 0.35, repeat: Infinity }}
                                className="w-20 h-20 rounded-2xl bg-red-600 border-4 border-red-300 flex items-center justify-center font-black text-white text-4xl"
                            >
                                {dodgeKey}
                            </motion.div>
                            <div className="w-48 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 rounded-full" style={{ width: `${timerPct * 100}%` }} />
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* ══ Action Panel ══ */}
            <div className="relative z-20 px-3 pb-5">
                <div className="bg-black/65 backdrop-blur-md border border-white/8 rounded-2xl px-4 py-3 shadow-[0_-4px_30px_rgba(0,0,0,0.7)]">
                    <AnimatePresence mode="wait">

                        {/* CHOOSE */}
                        {phase === 'choose' && (
                            <motion.div key="choose"
                                initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex gap-3 justify-center"
                            >
                                <button onClick={startAttackSeq}
                                    className="group flex-1 max-w-xs flex flex-col items-center gap-1.5 bg-red-950/80 hover:bg-red-900/90 border border-red-700/50 rounded-xl py-4 px-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]"
                                >
                                    <Swords className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-white font-black uppercase tracking-widest text-sm">Attack</span>
                                    <span className="text-red-300/60 text-[10px] font-medium">8-key combo → damage</span>
                                </button>
                                <button onClick={startDefendSeq}
                                    className="group flex-1 max-w-xs flex flex-col items-center gap-1.5 bg-blue-950/70 hover:bg-blue-900/80 border border-blue-700/40 rounded-xl py-4 px-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]"
                                >
                                    <Shield className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-white font-black uppercase tracking-widest text-sm">Defend</span>
                                    <span className="text-blue-300/60 text-[10px] font-medium">Block &amp; counter-charge</span>
                                </button>
                            </motion.div>
                        )}

                        {/* SEQUENCE HINT — bottom panel just shows a label while sequence is displayed in the arena above */}
                        {(phase === 'attack_seq' || phase === 'defend_seq' || phase === 'dodge_prompt') && (
                            <motion.div key="seq-hint"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex items-center justify-center py-2"
                            >
                                <span className={`text-xs font-bold uppercase tracking-widest ${phase === 'attack_seq' ? 'text-red-400/60' :
                                    phase === 'dodge_prompt' ? 'text-red-400/60' :
                                        'text-blue-400/60'
                                    }`}>
                                    {phase === 'attack_seq' ? 'Type the keys above' :
                                        phase === 'dodge_prompt' ? 'Dodge the incoming hit!' :
                                            'Complete the defense above'}
                                </span>
                            </motion.div>
                        )}

                        {/* COUNTER CHARGE */}
                        {phase === 'counter_charge' && (
                            <motion.div key="charge"
                                initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-2 py-1"
                            >
                                <p className="text-yellow-400 font-black text-lg uppercase tracking-widest">🔥 CHARGE! Spam any key!</p>
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ scale: [1, 1.35, 1], backgroundColor: ['#eab308', '#fef08a', '#eab308'] }}
                                        transition={{ duration: 0.2, repeat: Infinity }}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-slate-900 text-xl"
                                    >!
                                    </motion.div>
                                    <span className="text-yellow-300 font-black text-4xl tabular-nums w-16 text-center">{chargeCount}</span>
                                    <span className="text-slate-500 text-xs uppercase tracking-widest">presses</span>
                                </div>
                            </motion.div>
                        )}

                        {/* ENEMY TURN */}
                        {phase === 'enemy_turn' && (
                            <motion.div key="enemy"
                                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                className="flex flex-col items-center gap-1 py-3"
                            >
                                <p className="text-orange-400 font-black text-xl uppercase tracking-widest animate-pulse">
                                    {enemy.name} is attacking...
                                </p>
                            </motion.div>
                        )}

                        {/* INTRO PAUSE */}
                        {phase === 'intro_pause' && (
                            <motion.div key="intro"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center gap-1 py-3"
                            >
                                <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
                                    {enemy.name} steps into the ring...
                                </p>
                            </motion.div>
                        )}

                        {/* LEVEL END */}
                        {phase === 'level_end' && (
                            <motion.div key="end"
                                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center gap-3 py-1"
                            >
                                <p className="text-green-400 font-black text-2xl uppercase tracking-widest">
                                    🏆 {enemy.name} Defeated!
                                </p>
                                <button
                                    onClick={() => {
                                        if (fightIndex + 1 >= FIGHTERS.length) onVictory();
                                        else { setFightIndex(fi => fi + 1); setPlayerHp(PLAYER_MAX_HP); }
                                    }}
                                    className="flex items-center gap-2 px-8 py-3 bg-green-800 hover:bg-green-700 text-white font-black rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                >
                                    <span>Next Fighter</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
