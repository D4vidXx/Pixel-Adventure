import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Shield, Zap, Package, Sparkles, Sword, Moon, Music } from 'lucide-react';
import { Hero } from '../data/heroes';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { SoulMeterUI } from './SoulMeterUI';

interface HeroStatusPanelProps {
    hero: Hero;
    playerHealth: number;
    maxPlayerHealth: number;
    playerShield: number;
    playerResource: number;
    maxPlayerResource: number;
    resourceType: string;

    // Stats
    attack: number;
    defense: number;
    speed: number;

    // Status Effects
    statusEffects: {
        weakness: number;
        speedDebuff: number;
        burn: number;
        poison: number;
        isPoisonLethal: boolean;
        vineTrap: number;
        bleed: number;
        pollen: number;
        devastation: number;
    };

    // Hero Specifics
    dualityMeter?: number; // Cedric/Wolfgang/Clyde
    dualityForm?: 'human' | 'beast' | 'normal' | 'ghoul' | 'keyboard' | 'drums' | 'violin';
    wolfgangNoteMeter?: number;
    lucianSoulMeter?: number;
    clydeSouls?: number;

    // Eli Specifics
    eliShieldActive?: boolean;
    eliShieldCharge?: number;
    maxEliShield?: number;
    onToggleEliShield?: () => void;

    // Meryn Specifics
    permafrostIceActive?: boolean;

    // Rogue Specifics
    shadowMeter?: number;
    bonusDodgeChance?: number;

    // Gunslinger Specifics
    bulletsSpent?: number;
    guaranteedCrit?: boolean;

    // Actions
    onBurst?: () => void; // Wolfgang

    // Artifacts & Inventory
    artifacts?: Record<string, number>;
    inventory?: Record<string, number>;
    artifactBonusStats?: { attack: number; defense: number; };

    // Stat Details
    heroId?: string;
    baseCritChance?: number;
    itemCritChance?: number;
    totalCritChance?: number;
    equipSpeedBonus?: number;
    bonusSpeed?: number;
    dodgeCap?: number;
    totalDodgeChance?: number;
}

export const HeroStatusPanel: React.FC<HeroStatusPanelProps> = ({
    hero,
    playerHealth,
    maxPlayerHealth,
    playerShield,
    playerResource,
    maxPlayerResource,
    resourceType,
    attack,
    defense,
    speed,
    statusEffects,
    dualityMeter = 0,
    dualityForm,
    wolfgangNoteMeter = 0,
    lucianSoulMeter = 0,
    clydeSouls = 0,
    eliShieldActive,
    eliShieldCharge = 0,
    maxEliShield = 0,
    onToggleEliShield,
    permafrostIceActive,
    shadowMeter = 0,
    bonusDodgeChance = 0,
    bulletsSpent = 0,
    guaranteedCrit = false,
    onBurst,
    artifacts = {},
    inventory = {},
    artifactBonusStats = { attack: 0, defense: 0 },
    heroId,
    baseCritChance = 0,
    itemCritChance = 0,
    totalCritChance = 0,
    equipSpeedBonus = 0,
    bonusSpeed = 0,
    dodgeCap = 0,
    totalDodgeChance = 0
}) => {

    // Helper to calculate percentages
    const healthPercent = (playerHealth / maxPlayerHealth) * 100;
    const resourcePercent = (playerResource / maxPlayerResource) * 100;

    return (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden group">
            {/* Decorative Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

            {/* Header: Name & Class Icon */}
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div>
                    <h3 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2 drop-shadow-md">
                        {hero.name}
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 uppercase tracking-tighter">
                            Lvl {hero.name === 'Eli Grassylocks' ? '∞' : '1'}
                        </span>
                    </h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{hero.classId}</p>
                </div>

                {/* Compact Stats Row */}
                {/* Compact Stats Row */}
                <div className="flex gap-3 bg-slate-950/40 p-1.5 rounded-lg border border-slate-800/60">
                    {/* Attack */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex flex-col items-center px-1 cursor-help">
                                <Sword className="w-3 h-3 text-orange-400 mb-0.5" />
                                <span className="text-xs font-bold text-slate-200">
                                    {attack}
                                    {hero.id !== 'clyde' && artifactBonusStats.attack > 0 && <span className="text-yellow-400 text-[10px] ml-0.5">(+{artifactBonusStats.attack})</span>}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={5} className="bg-slate-900 border-slate-700">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-orange-400 uppercase">Crit Chance</p>
                                <p className="text-[10px] text-slate-300">Base: {baseCritChance}%</p>
                                {itemCritChance > 0 && <p className="text-[10px] text-slate-300">Items: +{itemCritChance}%</p>}
                                {guaranteedCrit && <p className="text-[10px] text-purple-300">Guaranteed Crit Ready!</p>}
                                <div className="border-t border-slate-700 pt-1 mt-1">
                                    <p className="text-[10px] font-bold text-orange-300">Total: {totalCritChance}%</p>
                                </div>
                            </div>
                        </TooltipContent>
                    </Tooltip>

                    <div className="w-px bg-slate-700/50" />

                    {/* Defense */}
                    <div className="flex flex-col items-center px-1">
                        <Shield className="w-3 h-3 text-blue-400 mb-0.5" />
                        <span className="text-xs font-bold text-slate-200">
                            {defense}
                            {artifactBonusStats.defense > 0 && defense > 0 && <span className="text-yellow-400 text-[10px] ml-0.5">(+{artifactBonusStats.defense})</span>}
                        </span>
                    </div>

                    <div className="w-px bg-slate-700/50" />

                    {/* Speed */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex flex-col items-center px-1 cursor-help">
                                <Zap className="w-3 h-3 text-emerald-400 mb-0.5" />
                                <span className="text-xs font-bold text-slate-200">
                                    {speed}
                                    {(equipSpeedBonus + bonusSpeed) > 0 && <span className="text-green-400 text-[10px] ml-0.5">(+{equipSpeedBonus + bonusSpeed})</span>}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={5} className="bg-slate-900 border-slate-700">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-emerald-400 uppercase">Dodge Chance</p>
                                <p className="text-[10px] text-slate-300">Base: {(speed * 0.5).toFixed(1)}%</p>
                                {bonusDodgeChance > 0 && <p className="text-[10px] text-purple-300">Bonus: +{bonusDodgeChance}%</p>}
                                <p className="text-[10px] text-slate-500">Cap: {dodgeCap}%</p>
                                <div className="border-t border-slate-700 pt-1 mt-1">
                                    <p className="text-[10px] font-bold text-emerald-300">Total: {totalDodgeChance.toFixed(1)}%</p>
                                </div>
                            </div>
                        </TooltipContent>
                    </Tooltip>

                    <div className="w-px bg-slate-700/50" />

                    {/* Inventory Count */}
                    <div className="flex flex-col items-center px-1">
                        <Package className="w-3 h-3 text-purple-400 mb-0.5" />
                        <span className="text-xs font-bold text-slate-200">
                            {Object.values(inventory).reduce((sum, count) => sum + count, 0)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Health Bar */}
            <div className="mb-3 relative z-10">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500" fill="currentColor" /> HP
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                        {playerHealth}<span className="text-slate-500">/{maxPlayerHealth}</span>
                        {playerShield > 0 && <span className="text-cyan-400 ml-1">(+{playerShield})</span>}
                    </span>
                </div>
                {/* Bar Container */}
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden relative border border-slate-800">
                    {/* HP Fill */}
                    <motion.div
                        className="h-full bg-gradient-to-r from-red-600 to-red-500 relative"
                        initial={{ width: `${healthPercent}%` }}
                        animate={{ width: `${healthPercent}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                    </motion.div>

                    {/* Shield Overlay */}
                    {playerShield > 0 && (
                        <motion.div
                            className={`absolute top-0 left-0 h-full ${hero.id === 'eli' ? 'bg-emerald-500/50' : 'bg-cyan-500/50'} backdrop-blur-[1px]`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(playerShield / maxPlayerHealth) * 100}%` }}
                        />
                    )}

                    {/* Eli's Permafrost Effect */}
                    {permafrostIceActive && (
                        <div className="absolute inset-0 bg-cyan-200/20 backdrop-blur-[2px] border-2 border-cyan-300/30 rounded-full" />
                    )}
                </div>
            </div>

            {/* Resource Bar */}
            <div className="mb-4 relative z-10">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Zap className={`w-3 h-3 ${resourceType === 'Energy' ? 'text-amber-400' : resourceType === 'Bullets' ? 'text-red-400' : 'text-purple-400'}`} fill="currentColor" />
                        {resourceType}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                        {playerResource}<span className="text-slate-500">/{maxPlayerResource}</span>
                    </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <motion.div
                        className={`h-full ${resourceType === 'Energy' ? 'bg-amber-500' : resourceType === 'Bullets' ? 'bg-slate-400' : 'bg-purple-600'}`}
                        initial={{ width: `${resourcePercent}%` }}
                        animate={{ width: `${resourcePercent}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                </div>

                {/* Gunslinger Bullets View */}
                {hero.classId === 'gunslinger' && (
                    <div className="flex gap-0.5 mt-1 h-1.5">
                        {Array.from({ length: maxPlayerResource }).map((_, i) => {
                            const threshold = (hero.uniqueAbility?.id === 'last_chamber') ? 6 : 10;
                            const nextCritNum = Math.ceil((bulletsSpent + 1) / threshold) * threshold;
                            const bulletNum = bulletsSpent + (playerResource - i);
                            const isNextBullet = i === playerResource - 1;
                            const isCrit = bulletNum === nextCritNum || (guaranteedCrit && isNextBullet);

                            return (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-sm ${i < playerResource
                                        ? isCrit ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-slate-500'
                                        : 'bg-slate-800'}`}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Debuffs Row */}
            <div className="flex flex-wrap gap-2 mb-4 min-h-[24px]">
                {statusEffects.devastation > 0 && <Badge type="devastation" value={statusEffects.devastation} />}
                {statusEffects.vineTrap > 0 && <Badge type="vine" value={statusEffects.vineTrap} />}
                {statusEffects.bleed > 0 && <Badge type="bleed" value={statusEffects.bleed} />}
                {statusEffects.poison > 0 && <Badge type="poison" value={statusEffects.poison} isLethal={statusEffects.isPoisonLethal} />}
                {statusEffects.burn > 0 && <Badge type="burn" value={statusEffects.burn} />}
                {statusEffects.weakness > 0 && <Badge type="weakness" value={statusEffects.weakness} />}
                {statusEffects.speedDebuff > 0 && <Badge type="webbed" value={statusEffects.speedDebuff} />}
                {statusEffects.pollen > 0 && <Badge type="pollen" value={statusEffects.pollen} />}
            </div>

            {/* Artifacts Row */}
            {Object.values(artifacts).some(c => c > 0) && (
                <div className="flex flex-wrap gap-1.5 mb-4 px-1">
                    {Object.entries(artifacts).filter(([_, count]) => count > 0).map(([artifactId, count]) => {
                        const artifactNames: Record<string, string> = {
                            golden_apple: '🍎',
                            golden_crown: '👑',
                            finished_rubix_cube: '🎲',
                            disco_ball: '🪩',
                            lucky_charm: '🍀',
                            wooden_mask: '🎭',
                            slime_boots: '🟢',
                            pirates_chest: '🏴‍☠️',
                            turtle_shell: '🐢',
                        };
                        return (
                            <Tooltip key={artifactId}>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 rounded px-1.5 py-0.5 cursor-help hover:bg-yellow-500/20 transition-colors">
                                        <span className="text-xs">{artifactNames[artifactId] || '✨'}</span>
                                        {count > 1 && <span className="text-[9px] font-bold text-yellow-500">x{count}</span>}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent sideOffset={5} className="bg-slate-900 border-slate-700">
                                    <p className="text-xs font-bold text-yellow-400 capitalize">{artifactId.replace(/_/g, ' ')}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            )}

            <div className="h-px bg-slate-700/50 w-full mb-4" />

            {/* Passives & Unique Mechanics */}
            <div className="space-y-3 relative z-10">
                {/* Passive Header */}
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">{hero.uniqueAbility?.name || 'Passive'}</span>
                </div>

                {/* Description */}
                <p className="text-[10px] text-slate-400 italic leading-snug mb-3">
                    {hero.uniqueAbility?.description}
                </p>

                {/* --- HERO SPECIFIC UI --- */}

                {/* Eli Shield UI */}
                {hero.id === 'eli' && (
                    <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/80">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-slate-300 uppercase">Shield Battery</span>
                            <span className={`text-[10px] font-bold uppercase ${eliShieldActive ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                                {eliShieldActive ? 'ACTIVE' : 'RECHARGING'}
                            </span>
                        </div>

                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-2 relative border border-slate-800">
                            <motion.div
                                className={`h-full ${eliShieldActive ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(eliShieldCharge / maxEliShield) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        <button
                            onClick={onToggleEliShield}
                            className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${eliShieldActive
                                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                }`}
                        >
                            {eliShieldActive ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                )}

                {/* Cedric Moon Phase */}
                {hero.id === 'cedric' && (
                    <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-3">
                        <div className="flex justify-center gap-3 mb-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${i <= dualityMeter ? 'bg-amber-500 border-amber-400 shadow-lg scale-110' : 'bg-slate-900 border-slate-700 opacity-50'
                                    }`}>
                                    <Moon className={`w-4 h-4 ${i <= dualityMeter ? 'text-amber-950 fill-amber-950' : 'text-slate-500'}`} />
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-center text-amber-500/70 font-mono uppercase">
                            {dualityForm === 'beast' ? 'BEAST FORM ACTIVE' : `${dualityMeter} / 4 Stacks`}
                        </p>
                    </div>
                )}

                {/* Wolfgang Note Meter */}
                {hero.id === 'wolfgang' && (
                    <div
                        className={`relative h-8 bg-slate-900 rounded-lg border flex items-center justify-center cursor-pointer transition-all overflow-hidden group ${wolfgangNoteMeter >= 100 ? 'border-purple-400 shadow-[0_0_10px_purple] animate-pulse' : 'border-slate-800'
                            }`}
                        onClick={onBurst}
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-80"
                            style={{ width: `${wolfgangNoteMeter}%` }}
                        />
                        <span className="relative z-10 text-[10px] font-bold text-white uppercase tracking-widest drop-shadow-md">
                            {wolfgangNoteMeter >= 100 ? 'SYMPHONY READY!' : `${wolfgangNoteMeter} / 100`}
                        </span>
                    </div>
                )}

                {/* Lucian Soul Meter */}
                {hero.id === 'lucian' && (
                    <SoulMeterUI currentSoul={lucianSoulMeter} maxSoul={5000} attackBonus={Math.floor(lucianSoulMeter / 10)} />
                )}

                {/* Clyde Ghoul Meter */}
                {hero.id === 'clyde' && (
                    <div className="bg-blue-950/30 border border-blue-900/30 rounded-xl p-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-blue-400 font-bold uppercase">Duality</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`h-1.5 w-4 rounded-full ${i <= dualityMeter ? 'bg-blue-500 shadow-[0_0_5px_blue]' : 'bg-slate-800'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-purple-400 font-bold uppercase">Souls</span>
                            <div className="flex gap-1">
                                {[1, 2].map(i => (
                                    <div key={i} className={`w-2 h-2 rounded-full ${i <= clydeSouls ? 'bg-purple-500 shadow-[0_0_5px_purple]' : 'bg-slate-800'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Subcomponents ---

const Badge = ({ type, value, isLethal }: { type: string, value: number, isLethal?: boolean }) => {
    const config: Record<string, { color: string, bg: string, label: string }> = {
        devastation: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Devastated' },
        vine: { color: 'text-green-500', bg: 'bg-green-500/10', label: 'Wrapped' },
        bleed: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Bleed' },
        poison: { color: isLethal ? 'text-red-500' : 'text-emerald-400', bg: isLethal ? 'bg-red-500/10' : 'bg-emerald-500/10', label: isLethal ? 'Lethal' : 'Poison' },
        burn: { color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Burn' },
        weakness: { color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Weak' },
        webbed: { color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'Webbed' },
        pollen: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Pollen' },
    };

    const style = config[type] || { color: 'text-slate-400', bg: 'bg-slate-800', label: type };

    return (
        <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-white/5 ${style.color} ${style.bg} flex items-center gap-1`}>
            {style.label} <span className="text-white/50">Video{value}</span>
        </div>
    );
}
