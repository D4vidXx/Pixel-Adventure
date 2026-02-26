import { Heart, Shield, Sword, Package, ArrowLeft, Zap, Coins, Target, Sparkles, Moon, Music, Swords } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { ARTIFACT_DESCRIPTIONS, DEBUFF_DESCRIPTIONS } from './data/artifact-descriptions';
import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import animeStyleArt from '../../assets/anime-style-gacha.png';
import mountainStyleArt from '../../assets/serene-japanese-mountainscape.png';
import animeForestStyleArt from '../../assets/anime-forest.png';
import fairyMeetingArt from '../../assets/fairy-meeting.png';
import gracefulSleepArt from '../../assets/Graceful-sleep.png';
import { Move } from './MoveSelection';
import { MoveSelection } from './MoveSelection';
import { RhythmGame } from './RhythmGame';
import { ItemSelection, Item } from './ItemSelection';
import { RewardScreen, LootItem, LOOT_ITEMS } from './RewardScreen';
import { Shop } from './Shop';
import { RestScreen } from './RestScreen';
import { InterludeScreen } from './InterludeScreen';
import { StageBackground } from './StageBackground';
import { STAGE_1_LEVELS, STAGE_2_LEVELS, STAGE_3_LEVELS, STAGE_4_LEVELS, Enemy, getEnemyEmoji } from './EnemyData';
import { EnemyDisplay } from './EnemyDisplay';
import { getSpecialMovePrice, SPECIAL_MOVES } from './MoveShop';
import {
  CEDRIC_HUMAN_MOVES,
  CEDRIC_BEAST_MOVES,
  WOLFGANG_KEYBOARD_MOVES,
  WOLFGANG_DRUMS_MOVES,
  WOLFGANG_VIOLIN_MOVES,
  CLYDE_NORMAL_MOVES,
  CLYDE_GHOUL_MOVES,
  DEARBORN_MOVES,
  DEARBORN_WAVE_CRASH,
  JJ_SMITH_MOVES,
  CECIL_LYSANDER_MOVES
} from '../data/basic-moves';
import { LoseScreen } from './LoseScreen';
import { Hero } from '../data/heroes';
import { getEquipmentItem } from '../data/equipment-items';
import { ParticleBackground } from './ParticleBackground';
import { SoulMeterUI } from './SoulMeterUI';
import { HeroStatusPanel } from './HeroStatusPanel';
import { HeroActionPanel } from './HeroActionPanel';

import { Difficulty, DIFFICULTY_CONFIG } from '../data/difficulty';

interface GameProps {
  hero: Hero;
  onBackToMenu: () => void;
  equippedItems?: string[];
  ownedItems?: string[];
  onDiamondsEarned?: (amount: number) => void;
  activeStyleId?: string;
  activeBackgroundId?: string;
  difficulty: Difficulty;
}

export function Game({ hero, onBackToMenu, equippedItems = [], ownedItems = [], onDiamondsEarned, activeStyleId, activeBackgroundId, difficulty }: GameProps) {
  const getStyleImage = () => {
    switch (activeStyleId) {
      case 'anime-prism':
        return animeStyleArt;
      case 'japanese-mountainscape':
        return mountainStyleArt;
      case 'fairy-forest':
        return animeForestStyleArt;
      case 'fairy-meeting':
        return fairyMeetingArt;
      case 'Graceful-sleep':
        return gracefulSleepArt;
      default:
        return null;
    }
  };
  // Equipment helper
  const [runEquippedItems, setRunEquippedItems] = useState(equippedItems);
  useEffect(() => {
    setRunEquippedItems(equippedItems);
  }, [equippedItems]);

  const hasEquipment = (itemId: string) => runEquippedItems.includes(itemId);

  // Centralized Beer boost logic (after hasEquipment)
  const maybeApplyBeerBoost = () => {
    addLog(`[DEBUG] maybeApplyBeerBoost called. Beer equipped: ${hasEquipment('beer')}`);
    if (!hasEquipment('beer')) return;
    const equipmentBeer = getEquipmentItem('beer');
    const amount = equipmentBeer?.onCritGrantRandomStat ?? 2;
    const statRoll = Math.random();
    if (statRoll < 0.25) {
      if (hero.id === 'clyde') {
        setPlayerDefense(prev => prev + amount);
        addLog(`🍺 Beer boost! +${amount} Defense!`);
      } else {
        setPlayerAttack(prev => prev + amount);
        addLog(`🍺 Beer boost! +${amount} Attack!`);
      }
    } else if (statRoll < 0.50) {
      setPlayerDefense(prev => prev + amount);
      addLog(`🍺 Beer boost! +${amount} Defense!`);
    } else if (statRoll < 0.75) {
      setPermanentUpgrades(prev => ({ ...prev, healthBonus: prev.healthBonus + amount }));
      setPlayerHealth(prev => prev + amount);
      addLog(`🍺 Beer boost! +${amount} Max HP!`);
    } else {
      setPermanentUpgrades(prev => ({ ...prev, healthBonus: prev.healthBonus + amount }));
      setPlayerHealth(prev => prev + amount);
      addLog(`🍺 Beer boost! +${amount} Max HP!`);
    }
  };
  // Debug test hook: call `window.__forceBeerTest()` from browser console to force Beer proc
  useEffect(() => {
    (window as any).__forceBeerTest = () => {
      addLog('[DEBUG] window.__forceBeerTest invoked');
      maybeApplyBeerBoost();
    };
    return () => {
      try { delete (window as any).__forceBeerTest; } catch (e) { }
    };
  }, [maybeApplyBeerBoost]);
  const startingGold = hasEquipment('chinese_waving_cat') ? 100 : 0;
  const [currentStage, setCurrentStage] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);

  // Dev Cheat Buffer
  const [cheatBuffer, setCheatBuffer] = useState('');
  const [turnCount, setTurnCount] = useState(0);
  // Calculate flat stat bonuses from equipped items
  // Clyde cannot get attack bonuses from items
  const equipAttackBonus = hero.id === 'clyde' ? 0 : runEquippedItems.reduce((sum, id) => sum + (getEquipmentItem(id)?.flatStats?.attack || 0), 0);
  const equipDefenseBonus = runEquippedItems.reduce((sum, id) => {
    if (id === 'crab_claws') return sum;
    return sum + (getEquipmentItem(id)?.flatStats?.defense || 0);
  }, 0);
  const equipHealthBonus = runEquippedItems.reduce((sum, id) => sum + (getEquipmentItem(id)?.flatStats?.health || 0), 0);
  const equipSpeedBonus = runEquippedItems.reduce((sum, id) => sum + (getEquipmentItem(id)?.flatStats?.speed || 0), 0);
  const equipCritBonus = runEquippedItems.reduce((sum, id) => sum + (getEquipmentItem(id)?.flatStats?.crit || 0), 0);

  const [permanentUpgrades, setPermanentUpgrades] = useState<{
    attackBonus: number;
    defenseBonus: number;
    healthBonus: number;
  }>({ attackBonus: 0, defenseBonus: 0, healthBonus: 0 });

  const equipBonusRef = useRef({
    attack: equipAttackBonus,
    defense: equipDefenseBonus,
    health: equipHealthBonus,
  });

  useEffect(() => {
    const previous = equipBonusRef.current;
    const next = {
      attack: equipAttackBonus,
      defense: equipDefenseBonus,
      health: equipHealthBonus,
    };
    const deltaAttack = next.attack - previous.attack;
    const deltaDefense = next.defense - previous.defense;
    const deltaHealth = next.health - previous.health;

    if (deltaAttack !== 0 && hero.id !== 'clyde') {
      setPlayerAttack(prev => prev + deltaAttack);
    }
    if (deltaDefense !== 0) {
      setPlayerDefense(prev => prev + deltaDefense);
    }
    if (deltaHealth !== 0) {
      const maxBefore = hero.stats.health + permanentUpgrades.healthBonus + previous.health;
      const maxAfter = hero.stats.health + permanentUpgrades.healthBonus + next.health;
      setPlayerHealth(prev => Math.min(maxAfter, prev + (maxAfter - maxBefore)));
    }

    equipBonusRef.current = next;
  }, [equipAttackBonus, equipDefenseBonus, equipHealthBonus, hero.id, hero.stats.health, permanentUpgrades.healthBonus]);

  const [playerHealth, setPlayerHealth] = useState(hero.stats.health + equipHealthBonus);
  const [playerShield, setPlayerShield] = useState(0);

  // Brawler Class Mechanics
  const [brunoComboMeter, setBrunoComboMeter] = useState(0); // 0-3 hits
  const [moveUsesThisTurn, setMoveUsesThisTurn] = useState<Record<string, number>>({});
  const [playerTemporaryShieldTurns, setPlayerTemporaryShieldTurns] = useState(0);
  const playerTemporaryShieldAmountRef = useRef(0);
  const [powerPunchTurns, setPowerPunchTurns] = useState<number>(0); // Power Punch queued for next turn
  const powerPunchTurnsRef = useRef<number>(0);
  const [rollAndSlipDodgeActive, setRollAndSlipDodgeActive] = useState(false); // Roll & Slip pending dodge
  const rollAndSlipDodgeActiveRef = useRef(false); // Ref mirror for stale-closure safety
  // JJ Smith (Brawler) specific state
  const [jjPunches, setJjPunches] = useState(5);
  const [jjVictoryRushActive, setJjVictoryRushActive] = useState(false);
  const [jjCritStreak, setJjCritStreak] = useState(0);
  const [jjVictoryRushStacks, setJjVictoryRushStacks] = useState(0); // 1 stack = +10%
  const [jjDoubleStaminaNextTurn, setJjDoubleStaminaNextTurn] = useState(false);
  // Cecil Lysander (Brawler) specific state
  const [cecilMultiplier, setCecilMultiplier] = useState(2);
  const [cecilStreak, setCecilStreak] = useState(0);
  const [showCecilMeter, setShowCecilMeter] = useState(false);
  const [cecilMeterMoving, setCecilMeterMoving] = useState(false);
  const [cecilMeterValue, setCecilMeterValue] = useState(0);
  const [cecilMeterTargetId, setCecilMeterTargetId] = useState<string | null>(null);
  const cecilMeterDirection = useRef(1); // 1 for right, -1 for left
  const [showCecilImpactFrame, setShowCecilImpactFrame] = useState(false);

  const [playerBurnTurns, setPlayerBurnTurns] = useState(0);
  const [fireTornadoTurns, setFireTornadoTurns] = useState(0);
  const [playerSpeedDebuffTurns, setPlayerSpeedDebuffTurns] = useState(0);
  const [playerAttack, setPlayerAttack] = useState(hero.stats.attack + equipAttackBonus);
  const [playerDefense, setPlayerDefense] = useState(hero.stats.defense + equipDefenseBonus);
  const maxBrawlerStamina = hero.id === 'jj_smith' ? 50 : 60; // JJ has 50, Bruno & Feyland share 60
  const maxPlayerResource = hero.classId === 'gunslinger' ? 8 : (hero.classId === 'brawler' ? maxBrawlerStamina : 100);
  const [playerResource, setPlayerResource] = useState(() => {
    if (hero.classId === 'gunslinger') return 8; // Max bullets
    if (hero.classId === 'brawler') return maxBrawlerStamina; // Max Stamina
    return 100; // Mana, Energy, or Bullets
  });
  const [lucianSoulMeter, setLucianSoulMeter] = useState(0); // Lucian's Soul Meter (0-5000)
  const [permafrostIceActive, setPermafrostIceActive] = useState(hero.id === 'meryn'); // Meryn's passive - ice shield
  const permafrostIceActiveRef = useRef(hero.id === 'meryn');
  const [iceStormDamageRemainingTurns, setIceStormDamageRemainingTurns] = useState(0); // Track ongoing Ice Storm damage

  const playerHealthRef = useRef(playerHealth);
  const playerShieldRef = useRef(playerShield);
  const lordInfernoPowerMeterRef = useRef(0);
  const lordInfernoAuraCooldownRef = useRef(0);
  const guaranteedCritRef = useRef(false);
  const guaranteedDodgeRef = useRef(false);
  const combatLockedRef = useRef(true); // true during level transitions — blocks move input
  const lavaHutSpawnTurnRef = useRef(0);
  const lavaHutSpawnIdRef = useRef(0);
  const magmaSoldierSpawnIdRef = useRef(0);
  const magmaOverlordEntrapmentCdRef = useRef(0);
  const magmaOverlordFireTornadoCdRef = useRef(0);

  useEffect(() => { playerHealthRef.current = playerHealth; }, [playerHealth]);
  useEffect(() => { playerShieldRef.current = playerShield; }, [playerShield]);
  useEffect(() => { permafrostIceActiveRef.current = permafrostIceActive; }, [permafrostIceActive]);

  // Runtime Enemy Type
  type RuntimeEnemy = Enemy & {
    currentHealth: number;
    shield: number;
    weaknessTurns: number;
    poisonTurns: number;
    slowedTurns: number;
    stunTurns: number;
    burnTurns: number;
    iceStormTurns: number;
    standoffTurns: number;
    speed: number;
  };

  // Multi-enemy state
  const [enemies, setEnemies] = useState<RuntimeEnemy[]>([]);
  const enemiesRef = useRef(enemies);
  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const [showMoveSelection, setShowMoveSelection] = useState(false);
  const [showItemSelection, setShowItemSelection] = useState(false);
  const [showRewardScreen, setShowRewardScreen] = useState(false);
  const [showInterlude, setShowInterlude] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showRest, setShowRest] = useState(false);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [gold, setGold] = useState(startingGold);
  const [artifacts, setArtifacts] = useState<Record<string, number>>({}); // Legendary artifacts (Stacked)
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [takeExtraDamageNextTurn, setTakeExtraDamageNextTurn] = useState(false);
  const [playerWeaknessTurns, setPlayerWeaknessTurns] = useState(0);
  const [playerPoisonTurns, setPlayerPoisonTurns] = useState(0);
  const [playerBleedTurns, setPlayerBleedTurns] = useState(0);
  const [pollenMeter, setPollenMeter] = useState(0);
  const [isPlayerPoisonLethal, setIsPlayerPoisonLethal] = useState(false);
  const [vineTrapTurns, setVineTrapTurns] = useState(0);
  const [lastMoveIdByEnemy, setLastMoveIdByEnemy] = useState<Record<string, string>>({});
  const lastMoveIdByEnemyRef = useRef<Record<string, string>>({});
  const elfKingCooldownsRef = useRef({ auroraBlast: 0, temporalCrowning: 0, elfParade: 0 });
  const [activeCooldowns, setActiveCooldowns] = useState<Record<string, number>>({});
  const [blockCooldownTurns, setBlockCooldownTurns] = useState(0);
  const [bossChargeCount, setBossChargeCount] = useState(0);
  const [bossDespTriggered, setBossDespTriggered] = useState(false);
  const [bossAttackBonus, setBossAttackBonus] = useState(0);
  const [bossDefenseBonus, setBossDefenseBonus] = useState(0);
  const [artifactBonusStats, setArtifactBonusStats] = useState({ attack: 0, defense: 0 });
  const [lordInfernoPowerMeter, setLordInfernoPowerMeter] = useState(0);
  const [ringThresholdBonus, setRingThresholdBonus] = useState(0);
  const ringThresholdBonusRef = useRef(0);
  const goldRef = useRef(gold);

  useEffect(() => { lordInfernoPowerMeterRef.current = lordInfernoPowerMeter; }, [lordInfernoPowerMeter]);
  useEffect(() => { ringThresholdBonusRef.current = ringThresholdBonus; }, [ringThresholdBonus]);
  useEffect(() => { lastMoveIdByEnemyRef.current = lastMoveIdByEnemy; }, [lastMoveIdByEnemy]);
  useEffect(() => { goldRef.current = gold; }, [gold]);
  const [lordInfernoIsOverdrive, setLordInfernoIsOverdrive] = useState(false);
  const [auraCooldown, setAuraCooldown] = useState(0);
  const [lordInfernoAuraCooldown, setLordInfernoAuraCooldown] = useState(0);
  const [lordInfernoDesperationActivated, setLordInfernoDesperationActivated] = useState(false);
  const [robinHoodRageMeter, setRobinHoodRageMeter] = useState(0);
  const [playerDevastationTurns, setPlayerDevastationTurns] = useState(0);
  useEffect(() => { lordInfernoAuraCooldownRef.current = lordInfernoAuraCooldown; }, [lordInfernoAuraCooldown]);
  const [lastPlayerMoveId, setLastPlayerMoveId] = useState<string | null>(null);
  const [thiefStolenState, setThiefStolenState] = useState<{ gold: number, artifactId: string | null }>({ gold: 0, artifactId: null });
  const [ownedSpecialMoves, setOwnedSpecialMoves] = useState<string[]>([]);
  const [buffMoveUsageCount, setBuffMoveUsageCount] = useState(0);
  const [trainUsageCount, setTrainUsageCount] = useState(0);
  const [motherGolemSpawned, setMotherGolemSpawned] = useState(false);
  const [lavaDragonSpawned, setLavaDragonSpawned] = useState(false);
  const [lavaSpiderAmbushPending, setLavaSpiderAmbushPending] = useState(false);
  const [showTurtleQuestion, setShowTurtleQuestion] = useState(false);
  const [turtleAnswer, setTurtleAnswer] = useState('');
  const [turtleCountdown, setTurtleCountdown] = useState(10);
  const turtleTimerRef = useRef<number | null>(null);
  const turtleResolvedRef = useRef(false);
  const [triggerEnemyTurn, setTriggerEnemyTurn] = useState(false);
  const [showStage3EquipmentPick, setShowStage3EquipmentPick] = useState(false);
  const [selectedStage3EquipmentId, setSelectedStage3EquipmentId] = useState<string | null>(null);
  const [isDefeatAnimating, setIsDefeatAnimating] = useState(false);
  const defeatAnimationDuration = 1400; // ms

  // Statistics tracking
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);

  // ... (existing imports)
  // Style Art Overlay
  // Place this in your main game background render:
  // {getStyleImage() && (
  //   <img src={getStyleImage()} alt="Style Art" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
  // )}

  const [totalDamageTaken, setTotalDamageTaken] = useState(0);
  const [totalGoldEarned, setTotalGoldEarned] = useState(0);
  const [showLoseScreen, setShowLoseScreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bulletsSpent, setBulletsSpent] = useState(0);
  const [shadowMeter, setShadowMeter] = useState(0);
  const [showTransformationEffect, setShowTransformationEffect] = useState(false);
  const [slashedEnemyIds, setSlashedEnemyIds] = useState<Set<string>>(new Set());
  const [showSymphonyEffect, setShowSymphonyEffect] = useState(false);
  const [guaranteedDodge, setGuaranteedDodge] = useState(false);
  const [popcornEatenThisLevel, setPopcornEatenThisLevel] = useState(0);
  const [isBurstAttacking, setIsBurstAttacking] = useState(false);
  const [bonusDodgeChance, setBonusDodgeChance] = useState(0);
  const [bonusSpeed, setBonusSpeed] = useState(0);
  const [guaranteedCrit, setGuaranteedCrit] = useState(false);
  const [disabledMoveId, setDisabledMoveId] = useState<string | null>(null);
  const [entrapmentTurns, setEntrapmentTurns] = useState(0);
  const [entrapmentMoveId, setEntrapmentMoveId] = useState<string | null>(null);
  const entrapmentPendingClearRef = useRef(false);
  const [channelingGuardActive, setChannelingGuardActive] = useState(false);
  const [channelingAttackBuffActive, setChannelingAttackBuffActive] = useState(false);
  const [tideCallActive, setTideCallActive] = useState(false);
  const [dearbornStrikeUpgraded, setDearbornStrikeUpgraded] = useState(false);
  const [pirateShipActive, setPirateShipActive] = useState(false);
  const [pirateShipSpeedBonus, setPirateShipSpeedBonus] = useState(0);
  const [catCoinsSpent, setCatCoinsSpent] = useState(0);
  const [slimeBootsUsedThisLevel, setSlimeBootsUsedThisLevel] = useState(false);
  const [showDevArtifacts, setShowDevArtifacts] = useState(false);
  const [isPostStageTransitionShop, setIsPostStageTransitionShop] = useState(false);
  const [piratesChestLoot, setPiratesChestLoot] = useState<LootItem | null>(null);
  const [showPiratesChestPopup, setShowPiratesChestPopup] = useState(false);
  useEffect(() => { guaranteedCritRef.current = guaranteedCrit; }, [guaranteedCrit]);
  useEffect(() => { guaranteedDodgeRef.current = guaranteedDodge; }, [guaranteedDodge]);

  // Eli Grassylocks State
  const [eliShieldActive, setEliShieldActive] = useState(true);
  const [eliShieldCharge, setEliShieldCharge] = useState(50);

  // Calculate Max Shield based on Stage
  const maxEliShield = useMemo(() => {
    switch (currentStage) {
      case 1: return 50;
      case 2: return 100;
      case 3: return 200;
      case 4: return 350;
      default: return 50;
    }
  }, [currentStage]);

  // Upgrade Eli's shield when stage increases
  // We use a ref to track if we've already applied the upgrade for this stage/maxShield value
  // This prevents re-running this logic on re-renders or other state changes
  const lastMaxShieldRef = useRef(maxEliShield);

  useEffect(() => {
    if (hero.id === 'eli' && maxEliShield > lastMaxShieldRef.current) {
      // Calculate difference
      const diff = maxEliShield - lastMaxShieldRef.current;

      // Apply difference to charge
      setEliShieldCharge(prev => prev + diff);

      // If active, also apply to current playerShield
      if (eliShieldActive) {
        setPlayerShield(prev => prev + diff);
      }

      lastMaxShieldRef.current = maxEliShield;
      addLog(`🛡️ Shield Capacity Upgraded! (+${diff} Max Shield)`);
    } else if (hero.id === 'eli' && maxEliShield < lastMaxShieldRef.current) {
      // Handle case where maxShield decreases (e.g. new run started?)
      lastMaxShieldRef.current = maxEliShield;
    }
  }, [maxEliShield, hero.id, eliShieldActive]);

  const toggleEliShield = () => {
    if (eliShieldActive) {
      // Deactivate: Save current shield to charge, set actual shield to 0
      setEliShieldCharge(playerShield);
      setPlayerShield(0);
      setEliShieldActive(false);
      addLog('🛡️ Shield Deactivated! Regenerating...');
    } else {
      // Activate: Restore shield from charge
      setPlayerShield(eliShieldCharge);
      setEliShieldActive(true);
      addLog('🛡️ Shield Activated!');
    }
  };

  // Helper for Healing Reduction (Elf King)
  const calculateHeal = (amount: number): number => {
    // Check enemies state for Elf King
    // Note: 'enemies' state is available in this scope
    if (enemies.some(e => e.id === 'elf_king' && e.currentHealth > 0)) {
      return Math.floor(amount * 0.5);
    }
    return amount;
  };

  const [dualityForm, setDualityForm] = useState<string>(
    hero.id === 'wolfgang' ? 'keyboard' : hero.id === 'clyde' ? 'normal' : 'human'
  ); // Generalized: human/beast OR keyboard/drums/violin OR normal/ghoul
  const [dualityMeter, setDualityMeter] = useState(0);
  const [wolfgangNoteMeter, setWolfgangNoteMeter] = useState(0);
  const [showRhythmGame, setShowRhythmGame] = useState(false);
  const [currentRhythmType, setCurrentRhythmType] = useState<'keyboard' | 'drums' | 'violin'>('keyboard');
  const [isSleeping, setIsSleeping] = useState(false);
  const isSleepingRef = useRef(false);
  useEffect(() => { isSleepingRef.current = isSleeping; }, [isSleeping]);

  // Cecil Meter Animation logic
  useEffect(() => {
    if (!showCecilMeter || !cecilMeterMoving) return;

    const baseSpeed = 5;
    // Logarithmic scaling: at 2x -> 5, 4x -> 7.5, 8x -> 10, 16x -> 12.5...
    const speed = baseSpeed + (Math.max(0, Math.log2(cecilMultiplier) - 1) * 2.5);

    const interval = setInterval(() => {
      setCecilMeterValue(prev => {
        let next = prev + (speed * cecilMeterDirection.current);
        if (next >= 100) {
          next = 100;
          cecilMeterDirection.current = -1;
        } else if (next <= 0) {
          next = 0;
          cecilMeterDirection.current = 1;
        }
        return next;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [showCecilMeter, cecilMeterMoving, cecilMultiplier]);

  useEffect(() => {
    setBulletsSpent(0);
    setGuaranteedCrit(false);
  }, [hero.id]);

  const [clydeSouls, setClydeSouls] = useState(0); // Clyde's soul counter
  const [clydeGhoulTurnsLeft, setClydeGhoulTurnsLeft] = useState(0); // How many turns left in ghoul form
  const [giftFromGodsUsedThisStage, setGiftFromGodsUsedThisStage] = useState(false); // Gift from the Gods: once per stage
  const [showOutrageUI, setShowOutrageUI] = useState(false); // OUTRAGE UI visible
  const [outragePhase, setOutragePhase] = useState<'ready' | 'countdown' | 'spam' | 'blast'>('ready');
  const [outrageCountdown, setOutrageCountdown] = useState(3);
  const [outrageBlastSize, setOutrageBlastSize] = useState(60); // Starting blast size
  const [outrageSpaceCount, setOutrageSpaceCount] = useState(0);
  const [outrageSkipped, setOutrageSkipped] = useState(false);
  const outrageLabelRef = useRef<{ handleSpaceKey: ((e: KeyboardEvent) => void) | null, handleMouseClick: (() => void) | null }>({ handleSpaceKey: null, handleMouseClick: null });
  const outrageBlastTimeoutRef = useRef<number | null>(null);
  const outrageSkippedRef = useRef(false);
  const outrageCountdownIntervalRef = useRef<number | null>(null);
  const outragePostBlastTimeoutRef = useRef<number | null>(null);
  const outrageExecutedRef = useRef(false);
  const stageTransitionAppliedRef = useRef(false);
  const [screenShakeIntensity, setScreenShakeIntensity] = useState(0);
  const [showWhiteout, setShowWhiteout] = useState(false);
  const [showRPS, setShowRPS] = useState(false);
  const [rpsPendingMove, setRpsPendingMove] = useState<Move | null>(null);
  const [shakeOffsetX, setShakeOffsetX] = useState(0);
  const [shakeOffsetY, setShakeOffsetY] = useState(0);

  const shakeAnimationTime = useRef(0);
  const shakeAnimationFrameId = useRef<number | null>(null);
  const finalAttackRef = useRef(0);
  const finalDefenseRef = useRef(0);
  const attackToUseRef = useRef(0);

  const maxPlayerHealth = hero.stats.health + permanentUpgrades.healthBonus + equipHealthBonus;
  const getStatCap = () => (currentStage === 4 ? 730 : currentStage === 3 ? 530 : currentStage === 2 ? 280 : 130);

  const ignoreCap = hasEquipment('beer') || hasEquipment('chinese_waving_cat');
  const baseCap = getStatCap();
  // Hero-specific caps: Stage base + Hero base
  const attackCap = Math.floor((baseCap + hero.stats.attack) * (hasEquipment('gasoline_cane') ? 1.3 : 1));
  let defenseCap = Math.floor((baseCap + hero.stats.defense) * (hasEquipment('gasoline_cane') ? 0.7 : 1));
  if (vineTrapTurns > 0) defenseCap += 50;
  const attackBonusFromUpgrades = hero.id === 'clyde' ? 0 : permanentUpgrades.attackBonus;
  const attackBase = hero.id === 'clyde' ? hero.stats.attack : playerAttack;
  // Calculate capped stats (excluding equipment base bonuses)
  const cappedAttack = ignoreCap ? attackBase + attackBonusFromUpgrades : Math.min(attackCap, attackBase + attackBonusFromUpgrades);
  const cappedDefense = ignoreCap ? playerDefense + permanentUpgrades.defenseBonus : Math.min(defenseCap, playerDefense + permanentUpgrades.defenseBonus);

  // Always add equipment base stat bonuses after capping
  // Add equipment bonuses after cap (reuse already declared equipAttackBonus, equipDefenseBonus)
  const uncappedAttack = cappedAttack + equipAttackBonus;
  const uncappedDefense = cappedDefense + equipDefenseBonus;

  const attackMultiplier = hero.id === 'clyde' ? 1 : (hasEquipment('gasoline_cane') ? 1.3 : 1);
  const defenseMultiplier = (hasEquipment('crab_claws') ? 1.3 : 1) * (hasEquipment('gasoline_cane') ? 0.7 : 1);

  const attackBonusFromArtifacts = hero.id === 'clyde' ? 0 : artifactBonusStats.attack;
  // Lucian Passive: +1 ATK for every 10 Soul (uncapped)
  const lucianSoulBonus = hero.id === 'lucian' ? Math.floor(lucianSoulMeter / 10) : 0;
  const finalAttack = Math.floor((uncappedAttack + attackBonusFromArtifacts + lucianSoulBonus) * attackMultiplier);
  const rawDefense = Math.floor((uncappedDefense + artifactBonusStats.defense) * defenseMultiplier);
  const finalDefense = Math.max(0, rawDefense - (vineTrapTurns > 0 ? 50 : 0));

  const baseSpeed = hero.stats.speed + equipSpeedBonus + bonusSpeed + (pirateShipActive ? pirateShipSpeedBonus : 0);
  const effectiveSpeed = Math.max(0, Math.floor(baseSpeed * (playerSpeedDebuffTurns > 0 ? 0.5 : 1)));
  const dodgeCap = hasEquipment('angelic_wings') ? 65 : 60;
  const rawDodgeChance = effectiveSpeed * 0.5 + bonusDodgeChance + (hero.uniqueAbility?.id === 'shadowstep' ? 25 : 0);
  const totalDodgeChance = Math.min(dodgeCap, rawDodgeChance);

  const baseCritChance = hero.classId === 'rogue' ? 25 : 5;
  const itemCritChance = (hasEquipment('ancient_rune_stone') ? 10 : 0)
    + (hasEquipment('beer') ? 5 : 0)
    + (hasEquipment('sharp_razor') ? 18 : 0)
    + (hasEquipment('blood_vile') ? 5 : 0);
  const totalCritChance = Math.min(100, baseCritChance + itemCritChance);
  const activeDisabledMoveId = entrapmentTurns > 0 ? entrapmentMoveId : disabledMoveId;

  // Clyde Ghoul Form: Convert all defense to attack (×2)
  let ghoulFormAttack = finalAttack;
  let ghoulFormDefense = finalDefense;
  if (hero.id === 'clyde' && dualityForm === 'ghoul') {
    ghoulFormAttack = finalAttack + (finalDefense * 2);
    ghoulFormDefense = 0;
  }

  // Use the appropriate stats based on form
  const attackToUse = ghoulFormAttack;
  const defenseToUse = ghoulFormDefense;
  useEffect(() => {
    finalAttackRef.current = finalAttack;
    finalDefenseRef.current = finalDefense;
    attackToUseRef.current = attackToUse;
  }, [finalAttack, finalDefense, attackToUse]);

  const resourceType = hero.resourceType;

  // Get hero's moveset (including owned special moves)
  const [characterMoves, setCharacterMoves] = useState<Move[]>(hero.moves);

  // Stage 4 Move States
  const [manaSurgeTurns, setManaSurgeTurns] = useState(0);
  const [hammerComboStage, setHammerComboStage] = useState(0); // 0 = First hit, 1 = Second hit (Big AOE)

  // Update character moves based on form/class (Reactive)
  useEffect(() => {
    if (hero.classId === 'duality') {
      if (hero.id === 'cedric') {
        if (dualityForm === 'human' || dualityForm === 'keyboard') {
          setCharacterMoves(CEDRIC_HUMAN_MOVES);
        } else if (dualityForm === 'beast') {
          setCharacterMoves(CEDRIC_BEAST_MOVES);
        }
      } else if (hero.id === 'clyde') {
        if (dualityForm === 'normal') {
          setCharacterMoves(CLYDE_NORMAL_MOVES);
        } else if (dualityForm === 'ghoul') {
          setCharacterMoves(CLYDE_GHOUL_MOVES);
        }
      } else if (hero.id === 'wolfgang') {
        // Wolfgang Forms
        // Wolfgang Forms
        if (dualityForm === 'keyboard' || dualityForm === 'human') { // Default to keyboard
          setCharacterMoves(WOLFGANG_KEYBOARD_MOVES);
        } else if (dualityForm === 'drums') {
          setCharacterMoves(WOLFGANG_DRUMS_MOVES);
        } else if (dualityForm === 'violin') {
          setCharacterMoves(WOLFGANG_VIOLIN_MOVES);
        }
      }
    }
    // For other classes, moves are static or handled via setCharacterMoves directly (shop/upgrades)
  }, [dualityForm, hero.classId, hero.id]);

  useEffect(() => {
    if (!isPlayerTurn || !hasEquipment('crab_claws')) {
      if (disabledMoveId && entrapmentTurns === 0) setDisabledMoveId(null);
      return;
    }

    if (entrapmentTurns > 0) return;

    if (vineTrapTurns > 0) {
      setVineTrapTurns(prev => Math.max(0, prev - 1));
    }

    const availableMoves = characterMoves.filter(move => {
      if (move.id === 'outrage') return false;
      const onCooldown = (activeCooldowns[move.id] || 0) > 0;
      const canAfford = playerResource >= move.cost;
      return !onCooldown && canAfford;
    });

    if (availableMoves.length <= 1) {
      if (disabledMoveId) setDisabledMoveId(null);
      return;
    }

    const nextDisabled = availableMoves[Math.floor(Math.random() * availableMoves.length)].id;
    setDisabledMoveId(prev => {
      if (prev === nextDisabled) return prev;
      const moveName = characterMoves.find(m => m.id === nextDisabled)?.name || 'a move';
      addLog(`🦀 Crab Claws disables ${moveName} this turn!`);
      return nextDisabled;
    });
  }, [isPlayerTurn, characterMoves, activeCooldowns, playerResource, runEquippedItems]);

  const resolveCecilMeter = useMemo(() => () => {
    setCecilMeterMoving(false);

    const value = cecilMeterValue;
    const target = enemies.find(e => e.id === cecilMeterTargetId);
    if (!target) {
      setShowCecilMeter(false);
      return;
    }

    let multiplier = 1.25; // Yellow (0-40, 80-100)
    let isRed = false;

    if (value >= 70 && value <= 80) {
      multiplier = cecilMultiplier;
      isRed = true;
    } else if (value >= 40 && value < 70) {
      multiplier = 1.5;
    }

    const baseDamage = 25;
    const finalDmg = calculateDamage(Math.floor(baseDamage * multiplier), attackToUse, target);

    addLog(`🥊 Rear Cross! Meter stopped at ${value}%. Multiplier: x${multiplier}!`);

    if (isRed) {
      addLog(`🔥 MOMENTUM! Stamina refunded and Rear Cross ready for another strike!`);
      // Refund stamina
      setPlayerResource(prev => Math.min(maxPlayerResource, prev + 25));
      // Refund usage (decrement current usage count)
      setMoveUsesThisTurn(prev => ({ ...prev, cecil_rear_cross: Math.max(0, (prev.cecil_rear_cross || 0) - 1) }));
      // Double the multiplier for the next red hit
      setCecilMultiplier(prev => prev * 2);

      // Trigger impact frame
      setShowCecilImpactFrame(true);

      // Delay closing the meter and applying damage to create a freeze frame
      setTimeout(() => {
        setShowCecilImpactFrame(false);
        setShowCecilMeter(false);
        applyPlayerAttackToEnemy(target, finalDmg, (hero.moves as Move[]).find(m => m.id === 'cecil_rear_cross'));
      }, 600);
    } else {
      addLog(`💤 Momentum lost. Multiplier reset.`);
      setCecilMultiplier(2);
      setShowCecilMeter(false);
      applyPlayerAttackToEnemy(target, finalDmg, (hero.moves as Move[]).find(m => m.id === 'cecil_rear_cross'));
    }
  }, [cecilMeterValue, enemies, cecilMeterTargetId, cecilMultiplier, attackToUse, maxPlayerResource, hero.classId]);

  // Handle forced enemy turn trigger (e.g. The Hare)
  useEffect(() => {
    if (triggerEnemyTurn) {
      setTriggerEnemyTurn(false);
      setTimeout(() => {
        enemyTurn();
      }, 500);
    }
  }, [triggerEnemyTurn]);

  useEffect(() => {
    if (isPlayerTurn) return;
    if (entrapmentTurns === 0) return;
    if (entrapmentPendingClearRef.current) {
      entrapmentPendingClearRef.current = false;
      return;
    }
    setEntrapmentTurns(0);
    setEntrapmentMoveId(null);
    setDisabledMoveId(null);
    entrapmentPendingClearRef.current = false;
  }, [isPlayerTurn, entrapmentTurns]);

  // Initialize level
  useEffect(() => {
    loadLevel(currentLevel);
  }, []);

  // Cheat Code Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && showCecilMeter && cecilMeterMoving) {
        e.preventDefault();
        resolveCecilMeter();
        return;
      }

      if (e.key.toLowerCase() === 'i' && (e.ctrlKey || e.altKey)) {
        addLog('🔥 DEV CHEAT: Jumping to Lord Inferno...');
        setCurrentStage(2);
        setCurrentLevel(12);
        setPlayerHealth(maxPlayerHealth);
        setIsPlayerTurn(true);
        setShowRewardScreen(false);
        setShowShop(false);
        setShowRest(false);
        setShowInterlude(false);
        setIsTransitioning(false);
        loadLevel(12, 2);
        addLog('❤️ Lord Inferno awaits! Fully Healed!');
      }

      if (e.key.toLowerCase() === 'g' && (e.ctrlKey || e.altKey)) {
        addLog('👺 DEV CHEAT: Jumping to Goblin King...');
        setCurrentStage(1);
        setCurrentLevel(10);
        setPlayerHealth(maxPlayerHealth);
        setIsPlayerTurn(true);
        setShowRewardScreen(false);
        setShowShop(false);
        setShowRest(false);
        setShowInterlude(false);
        setIsTransitioning(false);
        loadLevel(10, 1);
        addLog('❤️ Goblin King awaits! Fully Healed!');
      }

      if (currentStage === 1 && e.key === '1' && (e.ctrlKey || e.altKey)) {
        // Simple shortcut: Alt+1 or Ctrl+1 to skip stage 1
        addLog('🕵️‍♀️ DEV CHEAT: Skipping Stage 1...');
        setCurrentStage(2);
        setCurrentLevel(1);
        setPlayerHealth(maxPlayerHealth);
        addLog('❤️ Fully Healed for the next stage!');
        setShowRewardScreen(false);
        loadLevel(1, 2);
        setShowShop(true);
        setIsPostStageTransitionShop(true);
        setIsTransitioning(false);
      }

      if (e.key.toLowerCase() === 's' && (e.ctrlKey || e.altKey)) {
        const stageInput = window.prompt('DEV CHEAT: Enter stage number (1-3)');
        const levelInput = window.prompt('DEV CHEAT: Enter level number for that stage');
        const stage = stageInput ? parseInt(stageInput, 10) : NaN;
        const level = levelInput ? parseInt(levelInput, 10) : NaN;

        const isStageValid = stage === 1 || stage === 2 || stage === 3 || stage === 4;
        const levelData = stage === 1
          ? STAGE_1_LEVELS[level]
          : stage === 2
            ? STAGE_2_LEVELS[level]
            : stage === 3
              ? STAGE_3_LEVELS[level]
              : STAGE_4_LEVELS[level];

        if (!isStageValid || !levelData) {
          addLog('❌ DEV CHEAT: Invalid stage/level.');
          return;
        }

        addLog(`🧭 DEV CHEAT: Jumping to Stage ${stage}, Level ${level}...`);
        setCurrentStage(stage);
        setCurrentLevel(level);
        setPlayerHealth(maxPlayerHealth);
        setIsPlayerTurn(true);
        setShowRewardScreen(false);
        setShowShop(false);
        setShowRest(false);
        setShowInterlude(false);
        setIsTransitioning(false);
        loadLevel(level, stage);
        addLog('❤️ Fully Healed!');
      }

      if (e.key.toLowerCase() === 'f' && (e.ctrlKey || e.altKey)) {
        addLog('🌲 DEV CHEAT: Jumping to Fairy Forest (Stage 4 Level 1)...');
        setCurrentStage(4);
        setCurrentLevel(1);
        setPlayerHealth(maxPlayerHealth);
        setIsPlayerTurn(true);
        setShowRewardScreen(false);
        setShowShop(false);
        setShowRest(false);
        setShowInterlude(false);
        setIsTransitioning(false);
        loadLevel(1, 4);
        addLog('❤️ Fairy Forest awaits! Fully Healed!');
      }

      if (e.key.toLowerCase() === 'c' && (e.ctrlKey || e.altKey)) {
        const cap = getStatCap();
        addLog(`🧙 DEV CHEAT: Maximizing Base Stats to Stage ${currentStage} Cap (${cap})...`);
        if (hero.id === 'clyde') {
          setPlayerAttack(hero.stats.attack);
        } else {
          setPlayerAttack(cap);
        }
        setPlayerDefense(cap);
        setPermanentUpgrades(prev => ({ ...prev, attackBonus: 0, defenseBonus: 0 }));
      }

      if (e.key.toLowerCase() === 'a' && (e.ctrlKey || e.altKey)) {
        setShowDevArtifacts(prev => !prev);
        addLog('🧪 DEV CHEAT: Toggled Artifact Spawner');
      }

      if (e.key === '0' && e.altKey) {
        setGold(prev => prev + 1000);
        setTotalGoldEarned(prev => prev + 1000);
        addLog('💰 DEV CHEAT: +1000 gold');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStage, maxPlayerHealth, showCecilMeter, cecilMeterMoving, resolveCecilMeter]);

  // Smooth screen shake animation
  useEffect(() => {
    if (screenShakeIntensity === 0) {
      if (shakeAnimationFrameId.current !== null) {
        cancelAnimationFrame(shakeAnimationFrameId.current);
        shakeAnimationFrameId.current = null;
      }
      setShakeOffsetX(0);
      setShakeOffsetY(0);
      shakeAnimationTime.current = 0;
      return;
    }

    const animate = () => {
      shakeAnimationTime.current += 16; // ~60fps

      // Use sine waves with different frequencies for smooth, organic motion
      const x = Math.sin(shakeAnimationTime.current / 100) * (screenShakeIntensity * 0.6);
      const y = Math.sin(shakeAnimationTime.current / 140 + 1) * (screenShakeIntensity * 0.6);

      setShakeOffsetX(x);
      setShakeOffsetY(y);

      shakeAnimationFrameId.current = requestAnimationFrame(animate);
    };

    shakeAnimationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (shakeAnimationFrameId.current !== null) {
        cancelAnimationFrame(shakeAnimationFrameId.current);
        shakeAnimationFrameId.current = null;
      }
    };
  }, [screenShakeIntensity]);

  // Player Turn Start Effects (Poison, etc.)
  useEffect(() => {
    if (!isPlayerTurn) return;

    // Brawler Mechanics
    if (hero.classId === 'brawler') {
      setMoveUsesThisTurn({}); // Reset usages for the turn
    }

    // --- TICK DOWN PLAYER STATUS EFFECTS ---
    if (playerTemporaryShieldTurns > 0) {
      if (playerTemporaryShieldTurns === 1) {
        setPlayerShield(prev => Math.max(0, prev - playerTemporaryShieldAmountRef.current));
        setPlayerTemporaryShieldTurns(0);
        playerTemporaryShieldAmountRef.current = 0;
        addLog(`🛡️ Your Guard shield expired.`);
      } else {
        setPlayerTemporaryShieldTurns(prev => prev - 1);
      }
    }

    // Handle Player Bleed (Lost Hunter Trait)
    if (playerBleedTurns > 0) {
      const bleedDamage = Math.ceil(maxPlayerHealth * 0.05);
      setPlayerHealth(prev => Math.max(0, prev - bleedDamage));

      setPermanentUpgrades(prev => ({
        ...prev,
        defenseBonus: prev.defenseBonus - 10
      }));

      addLog(`🩸 You bleed for ${bleedDamage} HP and lose 10 Defense!`);
      setPlayerBleedTurns(prev => Math.max(0, prev - 1));

      // Check for death by bleed
      if (playerHealth - bleedDamage <= 0 && !isDefeatAnimating && !showLoseScreen) {
        setTimeout(() => {
          startDefeatTransition(800);
        }, 0);
      }
    }

    // Handle Devastation (Robin Hood)
    if (playerDevastationTurns > 0) {
      const devDamage = Math.ceil(maxPlayerHealth * 0.10);
      setPlayerHealth(prev => Math.max(0, prev - devDamage));
      addLog(`🏹 Devastation deals ${devDamage} damage!`);
      setPlayerDevastationTurns(prev => Math.max(0, prev - 1));

      if (playerHealth - devDamage <= 0 && !isDefeatAnimating && !showLoseScreen) {
        setTimeout(() => {
          startDefeatTransition(800);
        }, 0);
      }
    }

    // Handle Player Poison
    if (playerPoisonTurns > 0) {
      const damagePercent = isPlayerPoisonLethal ? 0.08 : 0.05;
      const damage = Math.ceil(maxPlayerHealth * damagePercent);

      setPlayerHealth(prev => {
        const newHealth = Math.max(0, prev - damage);
        // Check for defeat due to poison
        if (newHealth === 0 && !isDefeatAnimating && !showLoseScreen) {
          setTimeout(() => {
            const reviveHealth = resolveCedricBeastDeath();
            if (reviveHealth !== null) {
              setPlayerHealth(reviveHealth);
              return;
            }
            const soulReviveHealth = resolveClydeSoulRevive();
            if (soulReviveHealth !== null) {
              setPlayerHealth(soulReviveHealth);
              return;
            }
            startDefeatTransition(800);
          }, 0);
        }
        return newHealth;
      });

      addLog(`🤢 Poison deals ${damage} damage! (${playerPoisonTurns - 1} turns remaining)`);
      setPlayerPoisonTurns(prev => Math.max(0, prev - 1));

      if (playerPoisonTurns - 1 <= 0) {
        setIsPlayerPoisonLethal(false);
      }
    }

    // Handle Weakness
    if (playerWeaknessTurns > 0) {
      setPlayerWeaknessTurns(prev => Math.max(0, prev - 1));
    }

    // Handle Speed Debuff (Webbed)
    if (playerSpeedDebuffTurns > 0) {
      setPlayerSpeedDebuffTurns(prev => Math.max(0, prev - 1));
    }

    // Handle Mana Surge Expiry
    if (manaSurgeTurns > 0) {
      setManaSurgeTurns(prev => Math.max(0, prev - 1));
      if (manaSurgeTurns === 1) {
        addLog('✨ Mana Surge fades...');
      }
    }
  }, [isPlayerTurn]);

  const loadLevel = (level: number, stageOverride?: number) => {
    combatLockedRef.current = true; // Lock input during level setup
    const stageToLoad = stageOverride || currentStage;
    const levelData = stageToLoad === 1
      ? STAGE_1_LEVELS[level]
      : stageToLoad === 2
        ? STAGE_2_LEVELS[level]
        : stageToLoad === 3
          ? STAGE_3_LEVELS[level]
          : STAGE_4_LEVELS[level];
    if (!levelData) return;

    // Reset Gift from the Gods usage if entering a new stage (detected via stage override or just logic)
    // Actually, simple way: always reset it here. If we are just reloading a level (same stage) it might be an issue?
    // "Usable once per stage".
    // If I use it in 1-1, I shouldn't be able to use it in 1-2.
    // So it should NOT reset it in loadLevel UNLESS it is the start of a new Stage.
    // The previous implementation plan said: "In loadLevel, add setGiftFromGodsUsedThisStage(false)."
    // But loadLevel is called for every level.
    // I need to check if 'level === 1' maybe? Or rely on the fact that we change stages explicitly.
    // Let's look at how stage transitions happen. Use `proceedToNextLevel`.
    // In `proceedToNextLevel`, we explicitly call `setGiftFromGodsUsedThisStage(false)` when changing stages.
    // OH! I see `setGiftFromGodsUsedThisStage(false)` was ALREADY in `proceedToNextLevel` in the code I read earlier?
    // Let me check lines 5385, 5404, 5432 in `Game.tsx` (from my previous read).
    // ...
    // Yes! `setGiftFromGodsUsedThisStage(false)` IS present in `proceedToNextLevel` for Stage 1->2, 2->3, 3->4.
    // So the reset logic MIGHT already be there?
    // Wait, the user said "Currently... is never reset".
    // Maybe they meant if you restart the game? Or maybe the user missed it?
    // Or maybe it's not working because `proceedToNextLevel` isn't the only way to change stages or it's not being called correctly?
    // Ah, `useEffect(() => { loadLevel(currentLevel); }, []);` initializes the game.
    // If I save/load, state might persist?
    // But wait, the user specifically asked for it.
    // Let's check `loadLevel` again.
    // If I put it in `loadLevel`, it resets every LEVEL. That would be "once per level", not "once per stage".
    // The user wants "once per stage".
    // So it should ONLY be reset when `currentStage` changes.
    // I will add a `useEffect` on `currentStage` to reset it.

    const diffCfg = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.normal;

    // Initialize enemies with their current health and scaled stats
    const initializedEnemies = levelData.enemies.map(e => {
      const scaledHP = Math.floor(e.maxHealth * diffCfg.hpMod);
      const scaledAtk = Math.floor(e.baseDamage * diffCfg.atkMod);
      return {
        ...e,
        maxHealth: scaledHP,
        currentHealth: scaledHP,
        baseDamage: scaledAtk,
        shield: 0,
        weaknessTurns: 0,
        poisonTurns: 0,
        slowedTurns: 0,
        stunTurns: 0,
        burnTurns: 0,
        iceStormTurns: 0,
        standoffTurns: 0,
        speed: 15
      };
    });

    setEnemies(initializedEnemies);
    setSelectedTargetId(initializedEnemies[0]?.id || null);

    // Reset buff move usage and training state for new level
    setBuffMoveUsageCount(0);
    setTrainUsageCount(0);
    setMoveUsesThisTurn({});
    setIsTraining(false);
    setTakeExtraDamageNextTurn(false);
    setLastMoveIdByEnemy({});
    lastMoveIdByEnemyRef.current = {};

    // Reset Guard temporary shield at level boundaries (brawler-specific)
    // Always zero the ref synchronously so downstream code in this function sees 0
    if (hero.classId === 'brawler') {
      playerShieldRef.current = Math.max(0, playerShieldRef.current - playerTemporaryShieldAmountRef.current);
      setPlayerShield(prev => Math.max(0, prev - playerTemporaryShieldAmountRef.current));
      setPlayerTemporaryShieldTurns(0);
      playerTemporaryShieldAmountRef.current = 0;
    }

    // Reset Feyland-specific flags on level boundaries
    setPowerPunchTurns(0);
    powerPunchTurnsRef.current = 0;
    rollAndSlipDodgeActiveRef.current = false;
    setRollAndSlipDodgeActive(false);

    // Reset JJ Smith transient dodge flag on level boundaries
    // Victory Rush state (active/stacks/streak) intentionally persists between levels
    if (hero.id === 'jj_smith') {
      setJjDoubleStaminaNextTurn(false);
    }

    // Reset Permafrost ice shield at start of level (Meryn passive)
    if (hero.id === 'meryn') {
      setPermafrostIceActive(true);
    }

    // Passive: Endurance (Gareth) - Heal 20 HP at level start (overflow becomes shield)
    if (hero.id === 'gareth') {
      const healAmount = calculateHeal(20);
      let newHealth = playerHealth + healAmount;
      let shieldGain = 0;

      if (newHealth > maxPlayerHealth) {
        shieldGain = newHealth - maxPlayerHealth;
        newHealth = maxPlayerHealth;
      }

      setPlayerHealth(newHealth);
      if (shieldGain > 0) {
        setPlayerShield(prev => prev + shieldGain);
        addLog(`🛡️ Endurance: Healed ${healAmount} HP! +${shieldGain} shield from overflow!`);
      } else {
        addLog(`🛡️ Endurance: Healed ${healAmount} HP!`);
      }
    }

    // Reset all cooldowns for new level
    setActiveCooldowns({});

    // Reset combat state
    setIsPlayerTurn(true);
    setIsBlocking(false);
    setBlockCooldownTurns(0);
    setBossChargeCount(0);
    setBossDespTriggered(false);
    setBossAttackBonus(0);
    setBossDefenseBonus(0);
    setLordInfernoPowerMeter(0);
    setLordInfernoIsOverdrive(false);
    setAuraCooldown(0);
    setLordInfernoAuraCooldown(0);
    setAuraCooldown(0);
    setLordInfernoAuraCooldown(0);
    setLordInfernoDesperationActivated(false);
    setRobinHoodRageMeter(0);
    setPlayerDevastationTurns(0);
    setPopcornEatenThisLevel(0);
    setSlimeBootsUsedThisLevel(false);
    setMotherGolemSpawned(false);
    setLavaDragonSpawned(false);
    setLavaSpiderAmbushPending(false);
    setFireTornadoTurns(0);
    setChannelingGuardActive(false);
    setChannelingAttackBuffActive(false);
    setEntrapmentTurns(0);
    setEntrapmentMoveId(null);
    setEntrapmentMoveId(null);
    setDisabledMoveId(null);
    setPlayerWeaknessTurns(0);
    setPlayerSpeedDebuffTurns(0);
    magmaSoldierSpawnIdRef.current = 0;
    magmaOverlordEntrapmentCdRef.current = 0;
    magmaOverlordFireTornadoCdRef.current = 0;
    lavaHutSpawnTurnRef.current = turnCount - 3;
    lavaHutSpawnIdRef.current = 0;
    if (turtleTimerRef.current !== null) {
      window.clearInterval(turtleTimerRef.current);
      turtleTimerRef.current = null;
    }
    turtleResolvedRef.current = false;

    // Grant level bonuses
    const resourceBonus = Math.floor(maxPlayerResource / 4);
    setPlayerResource(prev => Math.min(maxPlayerResource, prev + resourceBonus));

    const healthBonus = Math.floor(maxPlayerHealth / 8);
    const healAmount = calculateHeal(healthBonus);
    setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmount));

    addLog(`✨ New level! Restored ${resourceBonus} ${resourceType} and healed ${healAmount} HP!`);



    if (artifacts['wooden_mask']) {
      const shieldBonus = 8 * artifacts['wooden_mask'];
      setPlayerShield(prev => prev + shieldBonus);
      addLog(`🎭 Wooden Mask grants +${shieldBonus} Shield!`);
    }

    if (hasEquipment('thorny_aura') && level === 1) {
      setPlayerShield(prev => prev + 50);
      addLog(`🌹 Thorny Aura grants +50 Starting Shield!`);
    }



    setCombatLog([
      `⚔️ Level ${level}: ${initializedEnemies.map(e => e.name).join(', ')} appear${initializedEnemies.length === 1 ? 's' : ''}!`,
      'Waiting for your action...',
    ]);

    // Level Start: Grand Theft (Thief) -- moved after combat log so logs are visible
    addLog(`[DEBUG] Enemies this level: ${initializedEnemies.map(e => e.name).join(', ')}`);
    if (stageToLoad === 4 && initializedEnemies.some(e => e.name === 'Thief')) {
      const GoldToSteal = Math.floor(goldRef.current * 0.10);
      setGold(prev => Math.max(0, prev - GoldToSteal));

      // Steal one legendary artifact
      const artifactKeys = Object.keys(artifacts).filter(k => (artifacts[k] || 0) > 0);
      let stolenArtifactId: string | null = null;
      if (artifactKeys.length > 0) {
        stolenArtifactId = artifactKeys[Math.floor(Math.random() * artifactKeys.length)];
        setArtifacts(prev => {
          const updated = {
            ...prev,
            [stolenArtifactId!]: prev[stolenArtifactId!] - 1
          };
          // Recalculate artifact bonus stats after theft
          let attack = 0, defense = 0;
          if (updated['finished_rubix_cube']) {
            const attackBoost = hero.id === 'clyde' ? 0 : Math.floor(cappedAttack * 0.08) * updated['finished_rubix_cube'];
            const defenseBoost = Math.floor(cappedDefense * 0.08) * updated['finished_rubix_cube'];
            attack += attackBoost;
            defense += defenseBoost;
          }
          if (updated['lucky_charm']) {
            // Only apply the highest stat bonus for each charm
            for (let i = 0; i < updated['lucky_charm']; i++) {
              const stats = hero.id === 'clyde'
                ? { defense: finalDefense, speed: baseSpeed }
                : { attack: finalAttack, defense: finalDefense, speed: baseSpeed };
              const highest = Object.entries(stats).sort((a, b) => b[1] - a[1])[0];
              const boost = Math.floor(highest[1] * 0.08);
              if (highest[0] === 'attack') attack += boost;
              else if (highest[0] === 'defense') defense += boost;
              // speed bonus is handled elsewhere
            }
          }
          setArtifactBonusStats({ attack, defense });
          return updated;
        });
      }

      setThiefStolenState({ gold: GoldToSteal, artifactId: stolenArtifactId });
      if (GoldToSteal > 0 && stolenArtifactId) {
        addLog(`💰 A Thief ambushes you and steals ${GoldToSteal} Gold and your ${(stolenArtifactId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}! You will NOT get them back!`);
        addLog(`📝 The Thief stole: ${GoldToSteal} Gold, Artifact: ${(stolenArtifactId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}`);
      } else if (GoldToSteal > 0) {
        addLog(`💰 A Thief ambushes you and steals ${GoldToSteal} Gold! You will NOT get it back!`);
        addLog(`📝 The Thief stole: ${GoldToSteal} Gold`);
      } else if (stolenArtifactId) {
        addLog(`💰 A Thief ambushes you and steals your ${(stolenArtifactId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}! You will NOT get it back!`);
        addLog(`📝 The Thief stole: Artifact: ${(stolenArtifactId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}`);
      } else {
        addLog(`💰 A Thief ambushes you but you have nothing to steal!`);
      }
    }

    if (stageToLoad === 3 && initializedEnemies.some(e => e.name === 'Lava Spider')) {
      setLavaSpiderAmbushPending(false);
      setPlayerWeaknessTurns(2);
      setPlayerSpeedDebuffTurns(2);
      addLog('🕸️ Lava Spiders ambush! You are webbed and weakened.');
    }

    // The Hare: Quick Feet (Always goes first)
    if (stageToLoad === 4 && initializedEnemies.some(e => e.name === 'The Hare')) {
      setIsPlayerTurn(false);
      setTriggerEnemyTurn(true);
      addLog('🐇 The Hare uses Quick Feet to act first!');
    }

    // Reset Player Status Effects
    setPlayerPoisonTurns(0);
    setIsPlayerPoisonLethal(false);
    setVineTrapTurns(0);
    setPlayerBleedTurns(0);
    setPollenMeter(0);

    if (stageToLoad === 3 && level === 7) {
      setShowTurtleQuestion(true);
      setIsPlayerTurn(false);
      setTurtleAnswer('');
      setTurtleCountdown(10);
      turtleResolvedRef.current = false;
      addLog('🐢 Wise Turtle: "Who won the race the turtle or the hare?"');

      let countdown = 10;
      if (turtleTimerRef.current !== null) {
        window.clearInterval(turtleTimerRef.current);
        turtleTimerRef.current = null;
      }
      turtleTimerRef.current = window.setInterval(() => {
        countdown -= 1;
        setTurtleCountdown(countdown);
        if (countdown <= 0) {
          resolveTurtleChallenge('correct');
        }
      }, 1000);
    }

    // Equipment level-start passives (placed after setCombatLog so logs persist)
    if (hasEquipment('hardened_chestplate')) {
      setPlayerShield(prev => prev + 10);
      addLog(`🛡️ Hardened Chestplate grants +10 Shield!`);
    }
    if (hasEquipment('beer')) {
      const statRoll = Math.random();
      if (statRoll < 0.25) {
        if (hero.id === 'clyde') {
          setPlayerDefense(prev => prev + 3);
          addLog(`🍺 Beer boost! +3 Defense!`);
        } else {
          setPlayerAttack(prev => prev + 3);
          addLog(`🍺 Beer boost! +3 Attack!`);
        }
      } else if (statRoll < 0.50) {
        setPlayerDefense(prev => prev + 3);
        addLog(`🍺 Beer boost! +3 Defense!`);
      } else if (statRoll < 0.75) {
        setPermanentUpgrades(prev => ({ ...prev, healthBonus: prev.healthBonus + 3 }));
        // Note: Increasing max HP automatically heals usually via effect, but here we do explicit heal
        const healAmt = calculateHeal(3);
        setPlayerHealth(prev => prev + healAmt);
        addLog(`🍺 Beer boost! +3 Max HP!`);
      } else {
        setPermanentUpgrades(prev => ({ ...prev, healthBonus: prev.healthBonus + 3 }));
        const healAmt = calculateHeal(3);
        setPlayerHealth(prev => prev + healAmt);
        addLog(`🍺 Beer boost! +3 Max HP!`);
      }
    }
    // Unlock combat input now that the level is fully set up
    combatLockedRef.current = false;
  };

  // Dice roll helpers
  // Dice roll helpers
  const rollD20 = (isPlayer = false): number => {
    if (isPlayer) {
      let critThreshold = 20;
      if (hasEquipment('ancient_rune_stone')) critThreshold -= 2;
      if (hasEquipment('sharp_razor')) critThreshold -= 4;
      if (hasEquipment('blood_vile')) critThreshold -= 1;
      // Apply aggregated crit % from equipment (each 5% => -1 threshold)
      const equipCritReduction = Math.floor(equipCritBonus / 5);
      critThreshold -= equipCritReduction;
      critThreshold = Math.max(2, critThreshold);

      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll >= critThreshold) {
        // Player crit
        return 20;
      }
      return roll;
    } else {
      // Enemy can no longer crit naturally
      return Math.floor(Math.random() * 19) + 1; // Never returns 20
    }
  };

  const rollDamageVariance = (): number => {
    // Returns a value between 0.85 and 1.15 (±15% variance)
    return 0.85 + Math.random() * 0.3;
  };

  // Combat calculation helper
  const calculateDamage = (baseDamage: number, attackStat: number, defenseStatOrTarget: number | Enemy, isEnemyAttack = false): number => {
    let defenseStat = typeof defenseStatOrTarget === 'number' ? defenseStatOrTarget : defenseStatOrTarget.defense;
    const target = typeof defenseStatOrTarget === 'number' ? null : defenseStatOrTarget;

    // For every point of attack: +0.1 damage
    let attackBonus = attackStat * 0.1;
    let defenseReduction = defenseStat * 0.1;
    // If enemy is attacking, boost their damage and defense
    if (isEnemyAttack) {
      attackBonus *= 1.1; // 10% more damage
      defenseReduction *= 1.3; // 30% more defense
    }
    const baseDmg = baseDamage + attackBonus - defenseReduction;
    const variance = rollDamageVariance();
    let finalDamage = Math.max(1, Math.floor(baseDmg * variance));

    // Shield Fairy "Protective Veil" Trait
    if (target && !isEnemyAttack) {
      if (target.name !== 'Shield Fairy' && enemies.some(e => e.name === 'Shield Fairy' && e.currentHealth > 0)) {
        finalDamage = Math.floor(finalDamage * 0.7);
      }
    }

    // Fredrinn Passive: 8% Lifesteal
    if (hero.uniqueAbility?.id === 'bullet_vamp') {
      const lifesteal = calculateHeal(Math.floor(finalDamage * 0.08));
      if (lifesteal > 0) {
        setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + lifesteal));
      }
    }

    return finalDamage;
  };

  // Critical damage ignores HALF defense
  const calculateCritDamage = (baseDamage: number, attackStat: number, defenseStatOrTarget: number | Enemy): number => {
    let defenseStat = typeof defenseStatOrTarget === 'number' ? defenseStatOrTarget : defenseStatOrTarget.defense;
    const target = typeof defenseStatOrTarget === 'number' ? null : defenseStatOrTarget;

    const baseDmg = baseDamage + attackStat * 0.1;
    // Apply defense reduction (half effective)
    const defenseReduction = (defenseStat / 2) * 0.1;

    const variance = rollDamageVariance();
    // Standard 2.0x crit multiplier
    const multiplier = 2.0;

    const netBase = Math.max(0, baseDmg - defenseReduction);
    let finalDamage = Math.max(1, Math.floor(netBase * variance * multiplier));

    // Shield Fairy "Protective Veil" Trait
    if (target) {
      if (target.name !== 'Shield Fairy' && enemies.some(e => e.name === 'Shield Fairy' && e.currentHealth > 0)) {
        finalDamage = Math.floor(finalDamage * 0.7);
      }
    }

    // Fredrinn Passive: 8% Lifesteal
    if (hero.uniqueAbility?.id === 'bullet_vamp') {
      const lifesteal = Math.floor(finalDamage * 0.08);
      if (lifesteal > 0) {
        setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + lifesteal));
      }
    }

    return finalDamage;
  };

  const calculateEnemyDamage = (baseDamage: number, attackStat: number, defenseStat: number, isCriticalHit: boolean) => {
    const variance = rollDamageVariance();
    const baseDmg = baseDamage + attackStat * 0.1;

    if (isCriticalHit) {
      const defenseReduction = (defenseStat / 2) * 0.1;
      const netBase = Math.max(0, baseDmg - defenseReduction);
      const multiplier = 2.0;
      const preDefenseDamage = Math.max(1, Math.floor(baseDmg * variance * multiplier));
      const damage = Math.max(1, Math.floor(netBase * variance * multiplier));
      if (hero.uniqueAbility?.id === 'bullet_vamp') {
        const lifesteal = calculateHeal(Math.floor(damage * 0.08));
        if (lifesteal > 0) {
          setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + lifesteal));
        }
      }
      return { damage, preDefenseDamage };
    }

    const defenseReduction = defenseStat * 0.1;
    const netBase = baseDmg - defenseReduction;
    const preDefenseDamage = Math.max(1, Math.floor(baseDmg * variance));
    const damage = Math.max(1, Math.floor(netBase * variance));
    if (hero.uniqueAbility?.id === 'bullet_vamp') {
      const lifesteal = calculateHeal(Math.floor(damage * 0.08));
      if (lifesteal > 0) {
        setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + lifesteal));
      }
    }
    return { damage, preDefenseDamage };
  };

  // --- Helper Functions (Moved up for hoisting safety) ---
  const addLog = (message: string) => {
    setCombatLog((prev) => [...prev, message]);
  };

  const hasLavaGolem = () => enemies.some(e => e.name === 'Lava Golem' && e.currentHealth > 0);
  const hasJester = () => enemies.some(e => e.name === 'Jester' && e.currentHealth > 0);

  const applyTideCallBonus = (damage: number) => {
    if (!tideCallActive) return damage;
    return Math.floor(damage * 1.5);
  };

  const applyTurtleShellReduction = (damage: number) => {
    if (!artifacts['turtle_shell']) return damage;
    return Math.max(0, Math.floor(damage * 0.9));
  };

  const consumeChannelingAttackBuff = () => {
    if (!channelingAttackBuffActive) return 1;
    setChannelingAttackBuffActive(false);
    addLog('✨ Channeling empowers your next attack!');
    return 2;
  };

  const applyFireLizardRepeatReduction = (enemy: Enemy, moveId: string, damage: number) => {
    if (enemy.name !== 'Fire Lizard') return damage;
    if (lastMoveIdByEnemyRef.current[enemy.id] !== moveId) return damage;
    addLog('🦎 Fire Lizard adapts! Damage halved.');
    return Math.floor(damage * 0.5);
  };

  const createLavaPebble = (id: string) => ({
    id,
    name: 'Lava Pebble',
    type: 'MINION' as const,
    maxHealth: 30,
    attack: 10,
    defense: 60,
    baseDamage: 12,
    currentHealth: 30,
    shield: 0,
    weaknessTurns: 0,
    poisonTurns: 0,
    slowedTurns: 0,
    stunTurns: 0,
    burnTurns: 0,
    iceStormTurns: 0,
    standoffTurns: 0,
    speed: 15,
  });

  const createLavaGolem = (id: string) => ({
    id,
    name: 'Lava Golem',
    type: 'ENEMY' as const,
    maxHealth: 300,
    attack: 50,
    defense: 140,
    baseDamage: 40,
    currentHealth: 300,
    shield: 0,
    weaknessTurns: 0,
    poisonTurns: 0,
    slowedTurns: 0,
    stunTurns: 0,
    burnTurns: 0,
    iceStormTurns: 0,
    standoffTurns: 0,
    speed: 15,
  });

  const createMagmaSoldier = (id: string) => ({
    id,
    name: 'Magma Soldier',
    type: 'MINION' as const,
    maxHealth: 200,
    attack: 30,
    defense: 60,
    baseDamage: 50,
    currentHealth: 200,
    shield: 0,
    weaknessTurns: 0,
    poisonTurns: 0,
    slowedTurns: 0,
    stunTurns: 0,
    burnTurns: 0,
    iceStormTurns: 0,
    standoffTurns: 0,
    speed: 25,
  });

  const getBossRageThreshold = (bossName: string) => {
    if (bossName === 'Magma Overlord') return 6;
    if (bossName === 'Goblin King') return 4;
    if (bossName === 'Lord Inferno') return 3;
    if (bossName === 'Robin Hood') return 5;
    if (bossName === 'Elf King') return 10;
    return 3;
  };

  const handleBossRageTrigger = (boss: Enemy) => {
    if (boss.name === 'Robin Hood') return; // Robin Hood has its own rage logic

    if (boss.name === 'Elf King') {
      setPermanentUpgrades(prev => ({
        ...prev,
        attackBonus: prev.attackBonus - 100,
        defenseBonus: prev.defenseBonus - 100
      }));

      // Spawn Random Enemy
      const randomEnemies = [
        { id: `elf_king_summon_${Date.now()}`, name: 'Elite Knight', type: 'ENEMY' as const, maxHealth: 1500, attack: 700, defense: 1000, baseDamage: 60, currentHealth: 1500, shield: 0, weaknessTurns: 0, poisonTurns: 0, slowedTurns: 0, stunTurns: 0, burnTurns: 0, iceStormTurns: 0, standoffTurns: 0, speed: 15 },
        { id: `elf_king_summon_${Date.now()}`, name: 'Shield Fairy', type: 'ENEMY' as const, maxHealth: 1000, attack: 200, defense: 500, baseDamage: 0, currentHealth: 1000, shield: 0, weaknessTurns: 0, poisonTurns: 0, slowedTurns: 0, stunTurns: 0, burnTurns: 0, iceStormTurns: 0, standoffTurns: 0, speed: 15 },
        { id: `elf_king_summon_${Date.now()}`, name: 'Moss Golem', type: 'ENEMY' as const, maxHealth: 800, attack: 600, defense: 820, baseDamage: 40, currentHealth: 800, shield: 0, weaknessTurns: 0, poisonTurns: 0, slowedTurns: 0, stunTurns: 0, burnTurns: 0, iceStormTurns: 0, standoffTurns: 0, speed: 15 },
      ];
      const summon = randomEnemies[Math.floor(Math.random() * randomEnemies.length)];
      setEnemies(prev => [...prev, summon]);
      addLog(`👑 Elf King's RAGE! he curses you (-100 Atk/Def) and summons a ${summon.name}!`);
      return;
    }

    if (boss.name === 'Magma Overlord') {
      magmaSoldierSpawnIdRef.current += 1;
      const soldier = createMagmaSoldier(`magma_soldier_${magmaSoldierSpawnIdRef.current}`);
      setEnemies(prev => [...prev, soldier]);
      addLog('🌋 Magma Overlord summons a Magma Soldier!');
      return;
    }

    const healPercent = boss.name === 'Goblin King' ? 0.18 : 0.15;
    const healAmount = Math.floor(boss.maxHealth * healPercent);
    setEnemies(prevEnemies => prevEnemies.map(e => {
      if (e.type === 'BOSS') {
        addLog(`⚡ Boss Rage! Boss heals ${Math.floor(healPercent * 100)}% HP and gains +15 ATK!`);
        return { ...e, currentHealth: Math.min(e.maxHealth, e.currentHealth + healAmount) };
      }
      return e;
    }));
    setBossAttackBonus(prevBonus => prevBonus + 15);
  };

  useEffect(() => {
    if (turnCount === 0) return;
    if (turnCount - lavaHutSpawnTurnRef.current < 3) return;

    const aliveHuts = enemiesRef.current.filter(e => e.name === 'Lava Hut' && e.currentHealth > 0);
    if (aliveHuts.length === 0) return;

    lavaHutSpawnTurnRef.current = turnCount;

    const spawned: Array<(typeof enemies)[number]> = [];
    aliveHuts.forEach(() => {
      lavaHutSpawnIdRef.current += 1;
      const roll = Math.random();
      if (roll < 0.8) {
        spawned.push(createLavaPebble(`lava_hut_pebble_${lavaHutSpawnIdRef.current}`));
        addLog('🛖 Lava Hut spits out a Lava Pebble!');
      } else {
        spawned.push(createLavaGolem(`lava_hut_golem_${lavaHutSpawnIdRef.current}`));
        addLog('🛖 Lava Hut erupts with a Lava Golem!');
      }
    });

    if (spawned.length > 0) {
      setEnemies(prev => [...prev, ...spawned]);
    }
  }, [turnCount]);

  const resolveTurtleChallenge = (result: 'correct' | 'wrong') => {
    if (turtleResolvedRef.current) return;
    turtleResolvedRef.current = true;
    if (turtleTimerRef.current !== null) {
      window.clearInterval(turtleTimerRef.current);
      turtleTimerRef.current = null;
    }

    setShowTurtleQuestion(false);
    setTurtleAnswer('');

    if (result === 'correct') {
      grantArtifact('turtle_shell', 'Wise Turtle');
      addLog('🐢 The Wise Turtle nods and lets you pass.');
      // Remove turtle from enemies and trigger victory
      setEnemies(prev => prev.filter(e => e.name !== 'Wise Turtle'));
      addLog('🏆 Wise Turtle defeated!');
      setTimeout(() => {
        setShowRewardScreen(true);
      }, 800);
      return;
    }

    addLog('🐢 The Wise Turtle frowns and prepares to fight.');
    setIsPlayerTurn(true);
  };

  const getJesterTaunt = () => {
    const taunts = [
      '🃏 Jester jeers: "Is that all?"',
      '🃏 Jester cackles: "Too easy!"',
      '🃏 Jester sneers: "Pathetic."',
      '🃏 Jester mocks you with a wicked grin.',
      '🃏 Jester taunts: "Dance for me!"',
    ];
    return taunts[Math.floor(Math.random() * taunts.length)];
  };

  const stage3EquipmentOptions = useMemo(() => {
    return ownedItems
      .map(itemId => getEquipmentItem(itemId))
      .filter((item): item is NonNullable<ReturnType<typeof getEquipmentItem>> => Boolean(item))
      .filter(item => !runEquippedItems.includes(item.id))
      .filter(item => !item.unavailableClasses?.includes(hero.classId));
  }, [ownedItems, runEquippedItems, hero.classId]);

  const proceedToStage3AfterEquip = () => {
    loadLevel(1, 3);
    setShowShop(true);
    setIsPostStageTransitionShop(true);
    setIsTransitioning(false);
  };

  const handleStage3EquipmentConfirm = () => {
    if (!selectedStage3EquipmentId) {
      addLog('❌ Choose an equipment item to confirm.');
      return;
    }
    handleStage3EquipmentSelect(selectedStage3EquipmentId);
  };

  const handleStage3EquipmentSelect = (itemId: string) => {
    if (runEquippedItems.includes(itemId)) return;
    if (runEquippedItems.length >= 3) {
      addLog('❌ Equipment slots are full.');
      return;
    }
    const item = getEquipmentItem(itemId);
    setRunEquippedItems(prev => [...prev, itemId]);
    setShowStage3EquipmentPick(false);
    setSelectedStage3EquipmentId(null);
    if (item) {
      addLog(`🧰 Equipped ${item.name} for Stage 3!`);
    }
    proceedToStage3AfterEquip();
  };

  const handleStage3EquipmentSkip = () => {
    setShowStage3EquipmentPick(false);
    setSelectedStage3EquipmentId(null);
    addLog('🧰 No additional equipment selected.');
    proceedToStage3AfterEquip();
  };

  const resolveCedricBeastDeath = () => {
    if (hero.id !== 'cedric' || dualityForm !== 'beast') return null;
    const reviveHealth = Math.max(1, Math.floor(maxPlayerHealth * 0.5));
    setDualityForm('human');
    setCharacterMoves(CEDRIC_HUMAN_MOVES);
    setDualityMeter(0);
    addLog('🌕 Cedric reverts to human form with half HP!');
    return reviveHealth;
  };

  const resolveClydeSoulRevive = () => {
    if (hero.uniqueAbility?.id !== 'soul_keeper' || clydeSouls <= 0) return null;
    const reviveHealth = Math.max(1, Math.floor(maxPlayerHealth * 0.5));
    setClydeSouls(prev => Math.max(0, prev - 1));
    if (hero.id === 'clyde') {
      setDualityForm('normal');
      setCharacterMoves(CLYDE_NORMAL_MOVES);
      setDualityMeter(0);
      setClydeGhoulTurnsLeft(0);
    }
    addLog(`👻 Soul Keeper revives you with ${reviveHealth} HP!`);
    return reviveHealth;
  };

  const applyPlayerWeakness = (damage: number) => {
    if (playerWeaknessTurns <= 0) return damage;
    return Math.max(1, Math.floor(damage * 0.8));
  };

  const consumePlayerWeaknessTurn = () => {
    if (playerWeaknessTurns <= 0) return;
    setPlayerWeaknessTurns(prev => Math.max(0, prev - 1));
  };

  const consumeTideCall = () => {
    if (!tideCallActive) return;
    setTideCallActive(false);
  };

  const upgradeDearbornStrike = () => {
    if (hero.id !== 'dearborn' || dearbornStrikeUpgraded) return;
    setCharacterMoves(prev => prev.map(move => (move.id === 'strike' ? DEARBORN_WAVE_CRASH : move)));
    setDearbornStrikeUpgraded(true);
    addLog(`🌊 Wave Surfer! Strike upgraded to Wave Crash!`);
  };

  const resetDearbornStrike = () => {
    if (hero.id !== 'dearborn' || !dearbornStrikeUpgraded) return;
    const strikeMove = DEARBORN_MOVES.find(move => move.id === 'strike');
    if (!strikeMove) return;
    setCharacterMoves(prev => prev.map(move => (move.id === 'wave_crash' ? strikeMove : move)));
    setDearbornStrikeUpgraded(false);
  };

  const DEV_ARTIFACTS = [
    { id: 'golden_apple', name: '🍎 Golden Apple' },
    { id: 'golden_crown', name: '👑 Golden Crown' },
    { id: 'finished_rubix_cube', name: '🎲 Rubix Cube' },
    { id: 'disco_ball', name: '🪩 Disco Ball' },
    { id: 'lucky_charm', name: '🍀 Lucky Charm' },
    { id: 'wooden_mask', name: '🎭 Wooden Mask' },
    { id: 'slime_boots', name: '🟢 Slime Boots' },
    { id: 'pirates_chest', name: '🏴‍☠️ Pirates\' Chest' },
    { id: 'turtle_shell', name: '🐢 Turtle Shell' },
  ];

  const grantArtifact = (artifactId: string, sourceLabel: string) => {
    // Cap logic for legendary artifacts
    if (artifactId === 'disco_ball' && (artifacts['disco_ball'] || 0) >= 2) {
      const legendaryOptions = ['golden_apple', 'golden_crown', 'finished_rubix_cube'];
      const replacement = legendaryOptions[Math.floor(Math.random() * legendaryOptions.length)];
      addLog(`🪩 Disco Ball cap reached (2). Converted into another legendary!`);
      grantArtifact(replacement, sourceLabel);
      return;
    }
    if (artifactId === 'golden_apple' && (artifacts['golden_apple'] || 0) >= 3) {
      const legendaryOptions = ['golden_crown', 'finished_rubix_cube', 'disco_ball'];
      const replacement = legendaryOptions[Math.floor(Math.random() * legendaryOptions.length)];
      addLog(`🍎 Golden Apple cap reached (3). Converted into another legendary!`);
      grantArtifact(replacement, sourceLabel);
      return;
    }
    if (artifactId === 'finished_rubix_cube' && (artifacts['finished_rubix_cube'] || 0) >= 3) {
      const legendaryOptions = ['golden_apple', 'golden_crown', 'disco_ball'];
      const replacement = legendaryOptions[Math.floor(Math.random() * legendaryOptions.length)];
      addLog(`🎲 Rubix Cube cap reached (3). Converted into another legendary!`);
      grantArtifact(replacement, sourceLabel);
      return;
    }
    setArtifacts(prev => ({
      ...prev,
      [artifactId]: (prev[artifactId] || 0) + 1,
    }));
    const label = DEV_ARTIFACTS.find(a => a.id === artifactId)?.name || artifactId;
    addLog(`✨ ${sourceLabel}: Received ${label}!`);

    if (artifactId === 'pirates_chest') {
      grantPiratesChestLoot();
      return;
    }

    if (artifactId === 'finished_rubix_cube') {
      const attackBoost = hero.id === 'clyde' ? 0 : Math.floor(cappedAttack * 0.08);
      const defenseBoost = Math.floor(cappedDefense * 0.08);
      setArtifactBonusStats(prev => ({
        attack: prev.attack + attackBoost,
        defense: prev.defense + defenseBoost,
      }));
      if (attackBoost > 0) {
        addLog(`🎲 Rubix Cube grants +${attackBoost} Attack and +${defenseBoost} Defense! (8% each)`);
      } else {
        addLog(`🎲 Rubix Cube grants +${defenseBoost} Defense! (8%)`);
      }
      return;
    }

    if (artifactId === 'lucky_charm') {
      const stats = hero.id === 'clyde'
        ? { defense: finalDefense, speed: baseSpeed }
        : { attack: finalAttack, defense: finalDefense, speed: baseSpeed };
      const highest = Object.entries(stats).sort((a, b) => b[1] - a[1])[0];
      const boost = Math.floor(highest[1] * 0.08);
      if (highest[0] === 'attack') {
        setArtifactBonusStats(prev => ({ ...prev, attack: prev.attack + boost }));
      } else if (highest[0] === 'defense') {
        setArtifactBonusStats(prev => ({ ...prev, defense: prev.defense + boost }));
      } else if (highest[0] === 'speed') {
        setBonusSpeed(prev => prev + boost);
      }
      addLog(`🍀 Lucky Charm! Your ${highest[0]} increased by ${boost}! (Permanent)`);
      return;
    }

    if (artifactId === 'wooden_mask') {
      setPlayerShield(prev => prev + 8);
      addLog(`🎭 Wooden Mask grants +8 Shield!`);
    }
  };


  function grantPiratesChestLoot() {
    const roll = Math.random() * 100;
    const commonItems = [LOOT_ITEMS.apple, LOOT_ITEMS.bread, LOOT_ITEMS.small_energy_shot];
    const rareItems = [
      LOOT_ITEMS.health_potion_reward,
      LOOT_ITEMS.energy_potion,
      LOOT_ITEMS.weakness_potion,
      LOOT_ITEMS.lucky_charm,
      LOOT_ITEMS.wooden_mask,
      LOOT_ITEMS.slime_boots,
    ];
    const legendaryItems = [
      LOOT_ITEMS.golden_apple,
      LOOT_ITEMS.golden_crown,
      LOOT_ITEMS.finished_rubix_cube,
      LOOT_ITEMS.disco_ball,
    ];

    let loot: LootItem;
    if (roll < 55) {
      loot = commonItems[Math.floor(Math.random() * commonItems.length)];
    } else if (roll < 85) {
      loot = rareItems[Math.floor(Math.random() * rareItems.length)];
    } else {
      loot = legendaryItems[Math.floor(Math.random() * legendaryItems.length)];
    }

    setPiratesChestLoot(loot);
    setShowPiratesChestPopup(true);
    addLog(`🏴‍☠️ Pirates' Chest reveals ${loot.name}!`);

    const artifactIds = [
      'golden_apple',
      'golden_crown',
      'finished_rubix_cube',
      'disco_ball',
      'lucky_charm',
      'wooden_mask',
      'slime_boots',
    ];

    if (artifactIds.includes(loot.id)) {
      grantArtifact(loot.id, "Pirates' Chest");
      return;
    }

    setInventory(prev => ({
      ...prev,
      [loot.id]: (prev[loot.id] || 0) + 1,
    }));
    addLog(`📦 Received ${loot.name} from Pirates' Chest!`);
  }

  const consumeGuaranteedCrit = () => {
    if (!guaranteedCritRef.current) return false;
    guaranteedCritRef.current = false;
    setGuaranteedCrit(false);
    return true;
  };

  const applyBloodVileLifesteal = (damage: number, isCritical: boolean) => {
    if (!hasEquipment('blood_vile') || damage <= 0) return;
    const lifestealMultiplier = isCritical ? 0.10 : 0.05;
    let healAmount = Math.floor(damage * lifestealMultiplier);

    // Elf King Passive: Reduce healing by 50%
    healAmount = calculateHeal(healAmount);

    if (healAmount > 0) {
      setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmount));
      addLog(`🩸 Blood Vile leeches ${healAmount} HP!`);
    }
  };

  const applyFairyBellLifesteal = (damage: number) => {
    if (!hasEquipment('fairy_bell') || damage <= 0) return;
    const lifestealMultiplier = 0.08;
    let healAmount = Math.floor(damage * lifestealMultiplier);

    // Elf King Passive: Reduce healing by 50%
    healAmount = calculateHeal(healAmount);

    if (healAmount > 0) {
      setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmount));
      addLog(`🔔 Fairy Bell tinkles! Leeched ${healAmount} HP!`);
    }
  };

  const maybeTriggerSharpRazor = (isCritical: boolean) => {
    if (!isCritical || !hasEquipment('sharp_razor') || guaranteedCritRef.current) return;
    if (Math.random() < 0.08) {
      guaranteedCritRef.current = true;
      setGuaranteedCrit(true);
      addLog(`🪒 Sharp Razor gleams! Your next attack will crit!`);
    }
  };

  const applyCatStatBoost = (count: number) => {
    for (let i = 0; i < count; i += 1) {
      const roll = Math.random();
      if (roll < 0.25) {
        setPermanentUpgrades(prev => ({ ...prev, healthBonus: prev.healthBonus + 1 }));
        setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + 1));
        addLog(`🐱 Chinese Waving Cat grants +1 Max HP!`);
      } else if (roll < 0.5) {
        if (hero.id === 'clyde') {
          setPermanentUpgrades(prev => ({ ...prev, defenseBonus: prev.defenseBonus + 1 }));
          addLog(`🐱 Chinese Waving Cat grants +1 Defense!`);
        } else {
          setPermanentUpgrades(prev => ({ ...prev, attackBonus: prev.attackBonus + 1 }));
          addLog(`🐱 Chinese Waving Cat grants +1 Attack!`);
        }
      } else if (roll < 0.75) {
        setPermanentUpgrades(prev => ({ ...prev, defenseBonus: prev.defenseBonus + 1 }));
        addLog(`🐱 Chinese Waving Cat grants +1 Defense!`);
      } else {
        setBonusSpeed(prev => prev + 1);
        addLog(`🐱 Chinese Waving Cat grants +1 Speed!`);
      }
    }
  };

  const handleCatSpend = (amount: number) => {
    if (!hasEquipment('chinese_waving_cat') || amount <= 0) return;
    setCatCoinsSpent(prev => {
      const total = prev + amount;
      const procsToApply = Math.floor(total / 12);
      if (procsToApply > 0) {
        applyCatStatBoost(procsToApply);
      }
      return total % 12;
    });
  };

  const decrementCooldowns = () => {
    setActiveCooldowns((prev) => {
      const updated: Record<string, number> = {};
      Object.entries(prev).forEach(([moveId, turns]) => {
        if (turns > 1) {
          updated[moveId] = turns - 1;
        }
        // If turns === 1, we don't add it (cooldown expires)
      });
      return updated;
    });
    setManaSurgeTurns(prev => Math.max(0, prev - 1));
  };

  const enemyTurn = (enemiesSnapshot = enemies, blockingThisTurn = false, extraDamageThisTurn = false) => {
    // --- Ensure Mischievous Troll's attack always matches the player's attack stat ---
    setEnemies(prev => prev.map(e =>
      e.name === 'Mischievous Troll' ? { ...e, attack: playerAttack } : e
    ));
    setTimeout(() => {
      const aliveEnemies = enemiesSnapshot.filter(e => e.currentHealth > 0);
      if (aliveEnemies.length === 0) {
        setIsPlayerTurn(true);
        return;
      }

      if (lavaSpiderAmbushPending && aliveEnemies.some(e => e.name === 'Lava Spider')) {
        setLavaSpiderAmbushPending(false);
        setPlayerWeaknessTurns(2);
        setPlayerSpeedDebuffTurns(2);
        addLog('🕸️ Lava Spiders ambush! You are webbed and weakened.');
      }

      if (playerSpeedDebuffTurns > 0) {
        setPlayerSpeedDebuffTurns(prev => Math.max(0, prev - 1));
      }

      // Check for Disco Ball artifact (10% chance to skip ALL enemy turns)
      if (artifacts['disco_ball']) {
        const distractRoll = Math.random() * 100;
        const totalChance = 10 * artifacts['disco_ball'];
        if (distractRoll < totalChance) {
          addLog(`🪩 The Disco Ball distracts all enemies! Their turns are skipped!`);
          endEnemyTurn();
          return;
        }
      }

      // Each enemy attacks
      aliveEnemies.forEach((enemy, index) => {
        setTimeout(() => {
          let damage: number;
          const critRoll = rollD20(false); // enemy attack
          let isCritical = critRoll === 20 && enemy.type !== 'BOSS'; // Bosses cannot crit naturally

          // Decrement Lord Inferno aura cooldown
          if (enemy.name === 'Lord Inferno') {
            setLordInfernoAuraCooldown(prev => Math.max(0, prev - 1));
          }

          // Lord Inferno's Special Moves - Check what to do this turn
          let isUsingGiantSpear = false;
          let lifestealePercent = 0.12; // Default lifesteal

          if (enemy.name === 'Lord Inferno') {
            const hpPercent = enemy.currentHealth / enemy.maxHealth;

            // Check for <25% HP passive (50% lifesteal + 50 shields)
            if (hpPercent < 0.25 && !lordInfernoDesperationActivated) {
              setLordInfernoDesperationActivated(true);
              setEnemies(prev => prev.map(e =>
                e.name === 'Lord Inferno'
                  ? { ...e, shield: e.shield + 50 }
                  : e
              ));
              addLog(`🔥 Lord Inferno's Desperation Activates! +50 Shield and 50% Lifesteal!`);
              lifestealePercent = 0.50; // Update lifesteal percent
            }

            // Use Lord's Aura if available (free action that doesn't cost turn)
            if (lordInfernoAuraCooldownRef.current <= 0) {
              addLog(`✨ Lord Inferno casts Lord's Aura! +30 Shield, +15 Attack, and +15 Defense!`);
              setBossAttackBonus(prev => prev + 15);
              setBossDefenseBonus(prev => prev + 15);
              setEnemies(prev => prev.map(e =>
                e.name === 'Lord Inferno'
                  ? { ...e, shield: e.shield + 30 }
                  : e
              ));
              setLordInfernoAuraCooldown(5);
            }

            // Lord Inferno always uses Giant Spear as main attack
            isUsingGiantSpear = true;
          }

          // Lord Inferno Power Meter Logic (4 stacks = Guaranteed Crit)
          if (enemy.name === 'Lord Inferno') {
            const currentMeter = lordInfernoPowerMeterRef.current;
            if (currentMeter >= 4) {
              isCritical = true;
              setLordInfernoPowerMeter(0);
              addLog(`🔥 Lord Inferno unleashes FULL POWER! Guaranteed Critical Hit!`);
            } else {
              setLordInfernoPowerMeter(prev => Math.min(4, prev + 1));
            }
          }

          let skipStandardAttack = false;

          // Elf King Logic
          if (enemy.id === 'elf_king') {
            // Decrement Cooldowns
            if (elfKingCooldownsRef.current.temporalCrowning > 0) elfKingCooldownsRef.current.temporalCrowning--;
            if (elfKingCooldownsRef.current.elfParade > 0) elfKingCooldownsRef.current.elfParade--;

            // Rage Trait: 10 charges = -100 Stats + Spawn
            if (bossChargeCount >= 10) {
              setBossChargeCount(0); // Reset charge
              setPermanentUpgrades(prev => ({
                ...prev,
                attackBonus: prev.attackBonus - 100,
                defenseBonus: prev.defenseBonus - 100
              }));

              // Spawn Random Enemy
              const randomEnemies = [
                { id: `elf_king_summon_${Date.now()}`, name: 'Elite Knight', type: 'ENEMY' as const, maxHealth: 1500, attack: 700, defense: 1000, baseDamage: 60, currentHealth: 1500, shield: 0, weaknessTurns: 0, poisonTurns: 0, slowedTurns: 0, stunTurns: 0, burnTurns: 0, iceStormTurns: 0, standoffTurns: 0, speed: 15 },
                { id: `elf_king_summon_${Date.now()}`, name: 'Shield Fairy', type: 'ENEMY' as const, maxHealth: 1000, attack: 200, defense: 500, baseDamage: 0, currentHealth: 1000, shield: 0, weaknessTurns: 0, poisonTurns: 0, slowedTurns: 0, stunTurns: 0, burnTurns: 0, iceStormTurns: 0, standoffTurns: 0, speed: 15 },
                { id: `elf_king_summon_${Date.now()}`, name: 'Moss Golem', type: 'ENEMY' as const, maxHealth: 800, attack: 600, defense: 820, baseDamage: 40, currentHealth: 800, shield: 0, weaknessTurns: 0, poisonTurns: 0, slowedTurns: 0, stunTurns: 0, burnTurns: 0, iceStormTurns: 0, standoffTurns: 0, speed: 15 },
              ];
              const summon = randomEnemies[Math.floor(Math.random() * randomEnemies.length)];
              setEnemies(prev => [...prev, summon]);
              addLog(`👑 Elf King's RAGE! he curses you (-100 Atk/Def) and summons a ${summon.name}!`);
            }

            // Move Logic
            let moveUsed = false;

            // 1. Elf-Parade (CD: 10)
            if (!moveUsed && elfKingCooldownsRef.current.elfParade === 0) {
              const minions = Array.from({ length: 5 }, (_, i) => ({
                id: `elf_minion_${Date.now()}_${i}`,
                name: 'Elf Minion',
                type: 'MINION' as const,
                maxHealth: 100,
                attack: 450,
                defense: 300, // Giving some defense so they aren't paper
                baseDamage: 20,
                currentHealth: 100,
                shield: 0,
                weaknessTurns: 0,
                poisonTurns: 0,
                slowedTurns: 0,
                stunTurns: 0,
                burnTurns: 0,
                iceStormTurns: 0,
                standoffTurns: 0,
                speed: 15
              }));
              setEnemies(prev => [...prev, ...minions]);
              elfKingCooldownsRef.current.elfParade = 10;
              addLog(`🎺 Elf King commands the Elf-Parade! 5 Minions appear!`);
              moveUsed = true;
              skipStandardAttack = true;
            }

            // 2. Temporal Crowning (CD: 7) - Heal + Cleanse
            if (!moveUsed && elfKingCooldownsRef.current.temporalCrowning === 0) {
              const missingHp = enemy.maxHealth - enemy.currentHealth;
              if (missingHp > 0 || enemy.weaknessTurns > 0 || enemy.poisonTurns > 0 || enemy.burnTurns > 0) {
                const heal = Math.floor(missingHp * 0.10);
                setEnemies(prev => prev.map(e =>
                  e.id === enemy.id ? { ...e, currentHealth: Math.min(e.maxHealth, e.currentHealth + heal), weaknessTurns: 0, poisonTurns: 0, burnTurns: 0, stunTurns: 0 } : e
                ));
                elfKingCooldownsRef.current.temporalCrowning = 7;
                addLog(`👑 Temporal Crowning! Elf King heals ${heal} HP and removes all debuffs!`);
                moveUsed = true;
                skipStandardAttack = true;
              }
            }

            // 3. Aurora Blast (Basic)
            // Falls through to standard attack logic below if no special move used.
          } // End Elf King Logic

          // Check if enemy is stunned
          if (enemy.stunTurns > 0) {
            addLog(`💫 ${enemy.name} is STUNNED and cannot act!`);
            setEnemies(prev => prev.map(e =>
              e.id === enemy.id ? { ...e, stunTurns: Math.max(0, e.stunTurns - 1) } : e
            ));
            if (index === aliveEnemies.length - 1) {
              setTimeout(() => endEnemyTurn(), 500);
            }
            return;
          }

          // Check if enemy is burning
          if (enemy.burnTurns > 0) {
            const burnDamage = Math.ceil(enemy.maxHealth * 0.05);
            setEnemies(prev => prev.map(e => {
              if (e.id === enemy.id) {
                const newHealth = Math.max(0, e.currentHealth - burnDamage);
                const newBurnTurns = Math.max(0, e.burnTurns - 1);

                // Ring of Power Check
                const ringThreshold = 0.10 + ringThresholdBonusRef.current;
                if (hasEquipment('ring_of_power') && newHealth > 0 && newHealth <= e.maxHealth * ringThreshold) {
                  // We need to capture this event for logging, but we are inside map.
                  // The cleanest way is to just set to 0 here.
                  return { ...e, currentHealth: 0, burnTurns: newBurnTurns };
                }
                return { ...e, currentHealth: newHealth, burnTurns: newBurnTurns };
              }
              return e;
            }));
            addLog(`🔥 ${enemy.name} takes ${burnDamage} burn damage! (${Math.max(0, enemy.burnTurns - 1)} turn${enemy.burnTurns - 1 !== 1 ? 's' : ''} remaining)`);

            // Check for execution log (Predictive check using snapshot)
            const ringThresholdCheck = 0.10 + ringThresholdBonusRef.current;
            if (hasEquipment('ring_of_power') && Math.max(0, enemy.currentHealth - burnDamage) > 0 && Math.max(0, enemy.currentHealth - burnDamage) <= enemy.maxHealth * ringThresholdCheck) {
              // Update bonus for next time (Side effect, but consistent with other triggers)
              setRingThresholdBonus(prev => prev + 0.005);
              ringThresholdBonusRef.current += 0.005;
              addLog(`💍 Ring of Power executes ${enemy.name}! (Threshold: ${(ringThresholdCheck * 100).toFixed(1)}%)`);
            }

            // Check if burn killed the enemy - use a timeout to let state update
            setTimeout(() => {
              const prev = enemiesRef.current;
              const currentEnemy = prev.find(e => e.id === enemy.id);
              if (currentEnemy && currentEnemy.currentHealth === 0) {
                // Always call handleEnemyDefeated to trigger all passives (Blue Tinted Glasses, etc.)
                handleEnemyDefeated(currentEnemy, prev, []);

                // Check if all enemies are dead
                const stillAlive = prev.filter(e => e.currentHealth > 0);
                if (stillAlive.length === 0) {
                  addLog(`🏆 All enemies defeated! Victory!`);
                  setTimeout(() => {
                    if (currentLevel % 3 === 0) {
                      setShowInterlude(true);
                    } else {
                      setShowRewardScreen(true);
                    }
                  }, 1000);
                }
              }
            }, 0);
          }
          // Check for Ice Storm damage
          if (enemy.iceStormTurns > 0) {
            const baseDamagePerTurn = 16;
            const iceDamage = calculateDamage(baseDamagePerTurn, attackToUse, enemy.defense);
            setEnemies(prev => {
              const updated = prev.map(e => {
                if (e.id === enemy.id) {
                  const newHealth = Math.max(0, e.currentHealth - iceDamage);
                  const newIceStormTurns = Math.max(0, e.iceStormTurns - 1);
                  return { ...e, currentHealth: newHealth, iceStormTurns: newIceStormTurns };
                }
                return e;
              });

              // Check for kills and victory
              const justKilled = updated.filter(e => e.currentHealth === 0);
              justKilled.forEach(enemy => {
                handleEnemyDefeated(enemy, updated, []);
              });

              const stillAlive = updated.filter(e => e.currentHealth > 0);
              if (stillAlive.length === 0) {
                addLog(`🏆 All enemies defeated by Ice Storm! Victory!`);
                setTimeout(() => {
                  if (currentLevel % 3 === 0) {
                    setShowInterlude(true);
                  } else {
                    setShowRewardScreen(true);
                  }
                }, 1000);
              }

              return updated;
            });
            addLog(`❄️ ${enemy.name} takes ${iceDamage} ice storm damage! (${Math.max(0, enemy.iceStormTurns - 1)} turn${Math.max(0, enemy.iceStormTurns - 1) !== 1 ? 's' : ''} remaining)`);
          }

          // First check if enemy has poison and apply it
          let enemyDiedToPoison = false;
          if (enemy.poisonTurns > 0) {
            let poisonDamage = Math.ceil(enemy.maxHealth * 0.05);

            // Passive: Toxic Mastery (Kira) - +50% poison damage
            if (hero.uniqueAbility?.id === 'toxic_mastery') {
              poisonDamage = Math.ceil(poisonDamage * 1.5);
            }

            setEnemies(prev => prev.map(e => {
              if (e.id === enemy.id) {
                const newHealth = Math.max(0, e.currentHealth - poisonDamage);
                const newPoisonTurns = Math.max(0, e.poisonTurns - 1);

                // Ring of Power Check
                const ringThreshold = 0.10 + ringThresholdBonusRef.current;
                if (hasEquipment('ring_of_power') && newHealth > 0 && newHealth <= e.maxHealth * ringThreshold) {
                  return { ...e, currentHealth: 0, poisonTurns: newPoisonTurns };
                }

                return { ...e, currentHealth: newHealth, poisonTurns: newPoisonTurns };
              }
              return e;
            }));

            const newPoisonTurns = Math.max(0, enemy.poisonTurns - 1);
            const toxicMasteryText = hero.uniqueAbility?.id === 'toxic_mastery' ? ' 💀' : '';
            addLog(`🧪 ${enemy.name} takes ${poisonDamage} poison damage!${toxicMasteryText} (${newPoisonTurns} turn${newPoisonTurns !== 1 ? 's' : ''} remaining)`);

            // Check for execution log (Predictive check using snapshot)
            const ringThresholdCheck = 0.10 + ringThresholdBonusRef.current;
            if (hasEquipment('ring_of_power') && Math.max(0, enemy.currentHealth - poisonDamage) > 0 && Math.max(0, enemy.currentHealth - poisonDamage) <= enemy.maxHealth * ringThresholdCheck) {
              setRingThresholdBonus(prev => prev + 0.005);
              ringThresholdBonusRef.current += 0.005;
              addLog(`💍 Ring of Power executes ${enemy.name}! (Threshold: ${(ringThresholdCheck * 100).toFixed(1)}%)`);
            }

            // Check if poison killed the enemy - use a timeout to let state update
            setTimeout(() => {
              const prev = enemiesRef.current;
              const currentEnemy = prev.find(e => e.id === enemy.id);
              if (currentEnemy && currentEnemy.currentHealth === 0) {
                // Always call handleEnemyDefeated to trigger all passives (Blue Tinted Glasses, etc.)
                handleEnemyDefeated(currentEnemy, prev, []);

                // Check if all enemies are dead
                const stillAlive = prev.filter(e => e.currentHealth > 0);
                if (stillAlive.length === 0) {
                  addLog(`🏆 All enemies defeated! Victory!`);
                  setTimeout(() => {
                    if (currentLevel % 3 === 0) {
                      setShowInterlude(true);
                    } else {
                      setShowRewardScreen(true);
                    }
                  }, 1000);
                }
              }
            }, 0);
          }
          if (enemy.currentHealth > 0 && enemy.standoffTurns > 0) {
            addLog(`🤠 ${enemy.name} hesitates and skips their attack!`);
            setEnemies(prev => prev.map(e =>
              e.id === enemy.id ? { ...e, standoffTurns: Math.max(0, e.standoffTurns - 1) } : e
            ));
            if (index === aliveEnemies.length - 1) {
              setTimeout(() => endEnemyTurn(), 500);
            }
            return;
          }

          // All enemies attack
          if (enemy && enemy.currentHealth > 0 && !skipStandardAttack) {
            // Pixie: Healing behavior
            if (enemy.name === 'Pixie') {
              const elfArcher = aliveEnemies.find(e => e.name === 'Elf Archer');
              if (elfArcher) {
                setEnemies(prev => prev.map(e => {
                  if (e.id === elfArcher.id) {
                    const healAmount = 30;
                    return { ...e, currentHealth: Math.min(e.maxHealth, e.currentHealth + healAmount) };
                  }
                  return e;
                }));
                addLog(`🧚 Pixie heals Elf Archer for 30 HP!`);
              } else {
                addLog(`🧚 Pixie flies around aimlessly (no Elf Archer to heal).`);
              }
              // Pixies don't attack the player
              if (index === aliveEnemies.length - 1) {
                setTimeout(() => endEnemyTurn(), 500);
              }
              return;
            }

            // Mischievous Troll: Mimicry Logic
            if (enemy.name === 'Mischievous Troll') {
              if (lastPlayerMoveId) {
                // Find the move data from the player's current moveset (handles all classes/forms)
                const move = characterMoves.find(m => m.id === lastPlayerMoveId);

                if (move) {
                  if (move.baseDamage) {
                    // Troll mimics at EXACT player's attack stat, and uses last move
                    const trollDmg = move.baseDamage; // Use exact base damage
                    const { damage: finalTrollDmg } = calculateEnemyDamage(trollDmg, playerAttack, finalDefense, false); // Use player's attack stat
                    const reducedDmg = applyTurtleShellReduction(finalTrollDmg);

                    // Properly apply damage to shield first, then health
                    setPlayerShield(prevShield => {
                      if (prevShield > 0) {
                        if (prevShield >= reducedDmg) {
                          // All damage absorbed by shield
                          addLog(`🛡️ Your shield absorbs the troll's mimic attack! (-${reducedDmg} shield)`);
                          return prevShield - reducedDmg;
                        } else {
                          // Shield breaks, remainder to health
                          const leftover = reducedDmg - prevShield;
                          setPlayerHealth(prevHealth => {
                            const newHealth = Math.max(0, prevHealth - leftover);
                            if (newHealth === 0 && !isDefeatAnimating && !showLoseScreen) {
                              setTimeout(() => startDefeatTransition(800), 0);
                            }
                            return newHealth;
                          });
                          addLog(`🛡️ Your shield breaks! (-${prevShield} shield), you take ${leftover} damage.`);
                          return 0;
                        }
                      } else {
                        setPlayerHealth(prevHealth => {
                          const newHealth = Math.max(0, prevHealth - reducedDmg);
                          if (newHealth === 0 && !isDefeatAnimating && !showLoseScreen) {
                            setTimeout(() => startDefeatTransition(800), 0);
                          }
                          return newHealth;
                        });
                        addLog(`🃏 Mischievous Troll mimics ${move.name} with your own attack! Dealt ${reducedDmg} damage!`);
                        return 0;
                      }
                    });
                  } else if (move.type === 'buff') {
                    // Troll mimics buff moves: apply the same buff to itself
                    let didBuff = false;
                    if (move.defenseBoost && move.defenseBoost > 0) {
                      // If the move grants shield/defense, give the troll a shield
                      setEnemies(prev => prev.map(e =>
                        e.id === enemy.id ? { ...e, shield: (e.shield || 0) + move.defenseBoost! } : e
                      ));
                      addLog(`🃏 Mischievous Troll mimics your buff move: ${move.name} and gains ${move.defenseBoost} shield!`);
                      didBuff = true;
                    }
                    if (!didBuff) {
                      addLog(`🃏 Mischievous Troll mimics your buff move: ${move.name}!`);
                    }
                  } else {
                    addLog(`🃏 Mischievous Troll tries to mimic, but fails!`);
                  }
                } else {
                  addLog(`🃏 Mischievous Troll tries to mimic, but fails!`);
                }
              } else {
                addLog(`🃏 Mischievous Troll laughs at you!`);
              }
              // Troll attack replaces generic attack
              if (index === aliveEnemies.length - 1) {
                setTimeout(() => endEnemyTurn(), 500);
              }
              return;
            }

            if (enemy.name === 'Magma Overlord') {
              if (magmaOverlordEntrapmentCdRef.current > 0) {
                magmaOverlordEntrapmentCdRef.current -= 1;
              }
              if (magmaOverlordFireTornadoCdRef.current > 0) {
                magmaOverlordFireTornadoCdRef.current -= 1;
              }

              const canUseFireTornado = magmaOverlordFireTornadoCdRef.current <= 0;
              const canUseEntrapment = magmaOverlordEntrapmentCdRef.current <= 0;

              if (canUseFireTornado) {
                magmaOverlordFireTornadoCdRef.current = 6;
                setFireTornadoTurns(5);
                addLog('🌪️ Magma Overlord casts Fire Tornado!');
                if (index === aliveEnemies.length - 1) {
                  setTimeout(() => endEnemyTurn(), 500);
                }
                return;
              }

              if (canUseEntrapment) {
                magmaOverlordEntrapmentCdRef.current = 5;
                const candidates = characterMoves.filter(m => m.id !== 'outrage');
                const chosen = candidates[Math.floor(Math.random() * candidates.length)];
                if (chosen) {
                  setEntrapmentTurns(1);
                  setEntrapmentMoveId(chosen.id);
                  setDisabledMoveId(chosen.id);
                  entrapmentPendingClearRef.current = true;
                  addLog(`⛓️ Magma Overlord uses Entrapment! ${chosen.name} is sealed for a turn.`);
                }
                if (index === aliveEnemies.length - 1) {
                  setTimeout(() => endEnemyTurn(), 500);
                }
                return;
              }
            }

            if (enemy.name === 'Lava Hut') {
              addLog('🛖 Lava Hut rumbles and releases a burst of heat.');
              if (index === aliveEnemies.length - 1) {
                setTimeout(() => endEnemyTurn(), 500);
              }
              return;
            }
            if (enemy.name === 'Jester') {
              addLog(getJesterTaunt());
            }

            // Roll & Slip: on the enemy's first attack, grants +20% dodge chance
            // and if Feyland dodges (any reason), retaliates with 70 damage
            let rollSlipDodgeTriggered = false;
            let rollSlipBonusDodge = 0;
            if (rollAndSlipDodgeActiveRef.current && (hero.id === 'feyland' || hero.id === 'jj_smith')) {
              rollAndSlipDodgeActiveRef.current = false;
              setRollAndSlipDodgeActive(false); // Always consume flag on first incoming attack
              rollSlipBonusDodge = 20; // +20% extra dodge chance
            }
            const shouldDodge = guaranteedDodgeRef.current || Math.random() * 100 < (totalDodgeChance + rollSlipBonusDodge);
            if (shouldDodge) {
              // If Roll & Slip is active and dodge succeeded, counter-attack
              if (rollSlipBonusDodge > 0) {
                rollSlipDodgeTriggered = true;
              }
              if (rollSlipDodgeTriggered) {
                const counterDmg = Math.floor(70 * (1 + playerAttack * 0.02));
                const newEnemyHealth = Math.max(0, enemy.currentHealth - counterDmg);
                setEnemies(prev => prev.map(e => e.id === enemy.id ? { ...e, currentHealth: newEnemyHealth } : e));
                setTotalDamageDealt(prev => prev + (enemy.currentHealth - newEnemyHealth));
                addLog(`🥊 Roll & Slip counter! Feyland evades ${enemy.name}'s attack and retaliates for ${counterDmg} damage!`);
                if (newEnemyHealth === 0) {
                  setTimeout(() => handleEnemyDefeated(enemy, enemiesRef.current, []), 300);
                }
              } else {
              }
              if (guaranteedDodgeRef.current) {
                guaranteedDodgeRef.current = false;
                setGuaranteedDodge(false);
              }
              addLog(`💨 You dodged ${enemy.name}'s attack!`);

              // JJ Smith Passive: Dodging doubles next turn's stamina
              if (hero.id === 'jj_smith') {
                setJjDoubleStaminaNextTurn(true);
              }

              // Shinjiro Passive: Shadow Meter fills on dodge
              if (hero.id === 'shinjiro') {
                setShadowMeter(prev => {
                  const next = prev + 1;
                  if (next >= 2) {
                    setTimeout(() => {
                      addLog(`🌑 Shinjiro unleashes Shadow Strike! (25% ATK x3, +0.5% dodge)`);
                      // Calculate total attack (base + bonuses)
                      const totalAttack = playerAttack;
                      const shadowStrikeDmg = Math.floor(totalAttack * 0.25);
                      let killed = false;
                      for (let i = 0; i < 3; i++) {
                        setEnemies(prevEnemies => {
                          const updated = prevEnemies.map(e => {
                            if (e.currentHealth > 0) {
                              const newHealth = Math.max(0, e.currentHealth - shadowStrikeDmg);
                              if (newHealth < e.currentHealth) {
                                addLog(`🗡️ Shadow Strike hits ${e.name} for ${shadowStrikeDmg} true damage!`);
                              }
                              if (e.currentHealth > 0 && newHealth === 0) killed = true;
                              return { ...e, currentHealth: newHealth };
                            }
                            return e;
                          });
                          return updated;
                        });
                      }
                      setBonusDodgeChance(bonus => bonus + 0.5);
                      setShadowMeter(0);
                      setTimeout(() => {
                        // After damage, check for kills and trigger victory/defeat logic
                        setEnemies(prevEnemies => {
                          const justKilled = prevEnemies.filter(e => e.currentHealth === 0);
                          if (justKilled.length > 0) {
                            justKilled.forEach(e => handleEnemyDefeated(e, prevEnemies));
                          }
                          // If all enemies are dead, trigger victory
                          const allDead = prevEnemies.every(e => e.currentHealth === 0);
                          if (allDead) {
                            addLog(`🏆 All enemies defeated! Victory!`);
                            setTimeout(() => {
                              if (currentLevel % 3 === 0) {
                                setShowInterlude(true);
                              } else {
                                setShowRewardScreen(true);
                              }
                            }, 1000);
                          }
                          return prevEnemies;
                        });
                      }, 100);
                    }, 500);
                  }
                  return next >= 2 ? 2 : next;
                });
              }
              if (hasEquipment('four_leaf_clover')) {
                const healAmt = calculateHeal(4);
                setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmt));
                addLog(`🍀 4-Leaf Clover restores ${healAmt} HP!`);
              }
              if (index === aliveEnemies.length - 1) {
                setTimeout(() => endEnemyTurn(), 500);
              }
              return;
            }

            const defenseForDamage = defenseToUse;

            // Determine if using Giant Spear or normal attack
            let baseDamageForAttack = isUsingGiantSpear ? 35 : enemy.baseDamage;
            let magicBurstWeaknessChance = 0;
            if (enemy.name === 'Magma Overlord') {
              baseDamageForAttack = 50;
              magicBurstWeaknessChance = 0.4;
              addLog('✨ Magma Overlord unleashes Magic Burst!');
            }
            const attackStat = enemy.attack + (enemy.type === 'BOSS' ? bossAttackBonus : 0);
            const { damage: rawDamage, preDefenseDamage } = calculateEnemyDamage(baseDamageForAttack, attackStat, defenseForDamage, isCritical);
            let damage = rawDamage;

            // Shield Fairy: Deals 3% Max HP True Damage
            if (enemy.name === 'Shield Fairy') {
              damage = Math.ceil(maxPlayerHealth * 0.03);
              addLog(`🧚 Shield Fairy drains life! Consuming 3% Max HP (${damage})!`);
            }

            // Moss Golem: Dangerous Smell
            if (enemy.traitId === 'dangerous_smell' && Math.random() < 0.3) {
              const isLethal = Math.random() < 0.1;
              setPlayerPoisonTurns(3);
              setIsPlayerPoisonLethal(isLethal);
              if (isLethal) {
                addLog(`🤢 ${enemy.name}'s Dangerous Smell inflicts LETHAL Poison! (8% Max HP/turn)`);
              } else {
                addLog(`🤢 ${enemy.name}'s Dangerous Smell inflicts Poison!`);
              }
            }

            // Vine Monster: Vine Snatch
            if (enemy.traitId === 'vine_snatch' && Math.random() < 0.4) {
              setVineTrapTurns(1);
              addLog(`🌿 ${enemy.name} uses Vine Snatch! You are wrapped up and your defense is lowered!`);
            }

            // Apply block damage reduction if player blocked this turn
            if (blockingThisTurn && index === 0) {
              damage = Math.floor(damage * 0.3);
              addLog(`🛡️ You blocked ${enemy.name}'s attack! Reduced damage to ${damage}!`);
              setIsBlocking(false);
              setBlockCooldownTurns(2);
            }

            if (artifacts['slime_boots'] && !slimeBootsUsedThisLevel) {
              const reduction = 0.1; // Always 10% for first hit
              const reducedDamage = Math.floor(damage * (1 - reduction));
              damage = Math.max(0, reducedDamage);
              setSlimeBootsUsedThisLevel(true);
              addLog(`🟢 Slime Boots reduce the first hit by 10% of damage!`);
            }

            damage = applyTurtleShellReduction(damage);

            // Feyland Iron Wall passive: 20% DR when below 50% max HP
            if (hero.id === 'feyland' && playerHealthRef.current < maxPlayerHealth * 0.5) {
              damage = Math.floor(damage * 0.8);
              addLog(`🛡️ Iron Wall! Feyland's resilience reduces incoming damage by 20%!`);
            }

            if (channelingGuardActive) {
              damage = Math.floor(damage * 0.5);
              addLog(`✨ Channeling reduces ${enemy.name}'s damage by 50%!`);
            }

            const currentShield = playerShieldRef.current;
            let damageToHealth = damage;

            if (currentShield > 0) {
              const absorbed = Math.min(currentShield, damage);
              setPlayerShield(prev => Math.max(0, prev - absorbed));
              playerShieldRef.current = Math.max(0, currentShield - absorbed);
              damageToHealth = damage - absorbed;
              if (absorbed > 0) {
                addLog(`🛡️ Shield absorbed ${absorbed} damage!`);
              }
              if (pirateShipActive && playerShieldRef.current <= 0) {
                setPirateShipActive(false);
                setPirateShipSpeedBonus(0);
                addLog(`🏴‍☠️ Pirate's Ship sinks! Speed bonus lost.`);
              }
            }

            // PERMAFROST PASSIVE: Check first - breaks and negates ALL damage
            if (hero.id === 'meryn' && permafrostIceActiveRef.current) {
              permafrostIceActiveRef.current = false;
              setPermafrostIceActive(false);
              addLog(`❄️ Permafrost Ice Shield breaks! First attack was completely negated!`);
            } else {
              setPlayerHealth((prevHealth) => {
                const newHealth = Math.max(0, prevHealth - damageToHealth);
                playerHealthRef.current = newHealth;

                if (newHealth === 0 && !isDefeatAnimating && !showLoseScreen) {
                  const reviveHealth = resolveCedricBeastDeath();
                  if (reviveHealth !== null) {
                    playerHealthRef.current = reviveHealth;
                    return reviveHealth;
                  }
                  const soulReviveHealth = resolveClydeSoulRevive();
                  if (soulReviveHealth !== null) {
                    playerHealthRef.current = soulReviveHealth;
                    return soulReviveHealth;
                  }
                  startDefeatTransition(800);
                }

                return newHealth;
              });

              if (isCritical) {
                addLog(`💥 CRITICAL HIT! ${enemy.name} attacks for ${damage} damage!`);
              } else {
                if (enemy.id === 'elf_king') {
                  addLog(`✨ Aurora Blast! Elf King strikes for ${damage} damage!`);
                } else if (isUsingGiantSpear) {
                  addLog(`🔱 ${enemy.name} hurls the GIANT SPEAR for ${damage} damage!`);
                } else {
                  addLog(`💥 ${enemy.name} attacks for ${damage} damage!`);
                }
              }

              if (enemy.name === 'Lava Pebble' && Math.random() < 0.30) {
                setPlayerBurnTurns(3);
                addLog(`🔥 Lava Pebble scorches you! (Burning 3 turns)`);
              }

              // Robin Hood AI
              if (enemy.name === 'Robin Hood') {
                if (robinHoodRageMeter >= 5) {
                  // Devastation Shot (Replaces Normal Attack)
                  setPlayerDevastationTurns(2);
                  setRobinHoodRageMeter(0);
                  addLog(`🏹 Robin Hood unleashes DEVASTATION SHOT! You are Devastated for 2 turns!`);
                  // We don't apply normal damage/effects here, but we can't easily prevent the 'damage' calculated above from applying since we are in the effect phase.
                  // However, since Devastation is a status effect that deals damage LATER, we might want to also just let the physical arrow hit?
                  // User did not specify "instead of". We'll assume it's a special move that *applications* the effect.
                  // If we want to be nice, we could heal the player back the damage amount, but let's leave it as a "Strong Attack".
                } else {
                  // Tipped Arrow Logic (Normal Attack)
                  const debuffs = ['POISON', 'BLEED', 'WEAKNESS', 'SLOW', 'LETHAL_POISON', 'BURN'];
                  const debuff = debuffs[Math.floor(Math.random() * debuffs.length)];
                  addLog(`🏹 Tipped Arrow applies ${debuff}!`);

                  if (debuff === 'POISON') { setPlayerPoisonTurns(prev => prev + 3); }
                  if (debuff === 'BLEED') { setPlayerBleedTurns(prev => prev + 2); }
                  if (debuff === 'WEAKNESS') { setPlayerWeaknessTurns(prev => prev + 2); }
                  if (debuff === 'SLOW') { setPlayerSpeedDebuffTurns(prev => prev + 2); }
                  if (debuff === 'LETHAL_POISON') {
                    setPlayerPoisonTurns(prev => prev + 2);
                    setIsPlayerPoisonLethal(true);
                    addLog('☠️ Lethal Poison applied!');
                  }
                  if (debuff === 'BURN') { setPlayerBurnTurns(prev => prev + 3); }

                  // Increment Rage
                  setRobinHoodRageMeter(prev => Math.min(5, prev + 1));
                  addLog(`😡 Robin Hood's rage builds... (${Math.min(5, robinHoodRageMeter + 1)}/5)`);
                }
              }

              // Elf Archer: 10% chance to summon Pixie on hit
              if (enemy.name === 'Elf Archer' && Math.random() < 0.1) {
                const aliveEnemies = enemiesRef.current.filter(e => e.currentHealth > 0);
                if (aliveEnemies.length < 5) { // Max 5 enemies
                  const pixieId = `pixie_${Math.floor(Math.random() * 1000)}`;
                  const pixie: RuntimeEnemy = {
                    id: pixieId,
                    name: 'Pixie',
                    maxHealth: 30,
                    currentHealth: 30,
                    attack: 0,
                    defense: 50,
                    baseDamage: 0,
                    speed: 15,
                    shield: 0,
                    type: 'ENEMY', // REGULAR is not a valid type
                    traitId: 'healing_pixie',
                    traitName: 'Healing Pixie',
                    traitDescription: 'Heals the Elf Archer for 30 HP every turn.',
                    weaknessTurns: 0,
                    poisonTurns: 0,
                    slowedTurns: 0,
                    stunTurns: 0,
                    burnTurns: 0,
                    iceStormTurns: 0,
                    standoffTurns: 0
                  };
                  setEnemies(prev => [...prev, pixie]);
                  addLog('🧚 Elf Archer summons a Pixie!');
                }
              }

              // Moss Golem: Dangerous Smell
              if (enemy.traitId === 'dangerous_smell' && Math.random() < 0.3) {
                const isLethal = Math.random() < 0.1;
                setPlayerPoisonTurns(3);
                setIsPlayerPoisonLethal(isLethal);
                if (isLethal) {
                  addLog(`🤢 ${enemy.name}'s Dangerous Smell inflicts LETHAL Poison! (8% Max HP/turn)`);
                } else {
                  addLog(`🤢 ${enemy.name}'s Dangerous Smell inflicts Poison!`);
                }
              }

              if (magicBurstWeaknessChance > 0 && Math.random() < magicBurstWeaknessChance) {
                setPlayerWeaknessTurns(2);
                addLog('💀 Magic Burst weakens you for 2 turns!');
              }
            } // CLOSE if (enemy && enemy.currentHealth > 0)
          } // CLOSE else (permafrost negated)

          if (index === aliveEnemies.length - 1) {
            setTimeout(() => endEnemyTurn(), 500);
          }
        }, index * 300);
      });

      if (artifacts['golden_apple']) {
        const healPercent = 0.04 * artifacts['golden_apple'];
        let healAmount = Math.floor(maxPlayerHealth * healPercent);
        healAmount = calculateHeal(healAmount); // Elf King Reduction
        healAmount = Math.max(0, healAmount); // Prevent negative healing
        setPlayerHealth(prev => {
          const newHealth = Math.min(maxPlayerHealth, prev + healAmount);
          if (healAmount > 0 && newHealth !== prev) {
            addLog(`🍎 Golden Apple heals you for ${healAmount} HP!`);
          }
          return newHealth;
        });
      }
    }, 0);
  };

  const endEnemyTurn = () => {
    // If victory or defeat is already triggered, do nothing
    if (showRewardScreen || showInterlude || showLoseScreen || combatLockedRef.current) return;

    // Final safety check for alive enemies
    const aliveEnemies = enemiesRef.current.filter(e => e.currentHealth > 0);
    if (aliveEnemies.length === 0) return;

    let skipPlayerTurn = false;
    // Reset training vulnerability for the next turn
    setTakeExtraDamageNextTurn(false);
    if (channelingGuardActive) {
      setChannelingGuardActive(false);
    }

    if (playerBurnTurns > 0) {
      const burnDamage = applyTurtleShellReduction(Math.ceil(maxPlayerHealth * 0.05));
      setPlayerHealth(prev => {
        const newHealth = Math.max(0, prev - burnDamage);
        playerHealthRef.current = newHealth;

        if (newHealth === 0 && !isDefeatAnimating && !showLoseScreen) {
          const reviveHealth = resolveCedricBeastDeath();
          if (reviveHealth !== null) {
            playerHealthRef.current = reviveHealth;
            return reviveHealth;
          }
          const soulReviveHealth = resolveClydeSoulRevive();
          if (soulReviveHealth !== null) {
            playerHealthRef.current = soulReviveHealth;
            return soulReviveHealth;
          }
          startDefeatTransition(800);
        }

        return newHealth;
      });
      setPlayerBurnTurns(prev => Math.max(0, prev - 1));
      addLog(`🔥 You take ${burnDamage} burn damage! (${Math.max(0, playerBurnTurns - 1)} turn${playerBurnTurns - 1 !== 1 ? 's' : ''} remaining)`);
    }

    if (fireTornadoTurns > 0) {
      const tornadoDamage = applyTurtleShellReduction(Math.ceil(maxPlayerHealth * 0.05));
      setPlayerHealth(prev => {
        const newHealth = Math.max(0, prev - tornadoDamage);
        playerHealthRef.current = newHealth;

        if (newHealth === 0 && !isDefeatAnimating && !showLoseScreen) {
          const reviveHealth = resolveCedricBeastDeath();
          if (reviveHealth !== null) {
            playerHealthRef.current = reviveHealth;
            return reviveHealth;
          }
          const soulReviveHealth = resolveClydeSoulRevive();
          if (soulReviveHealth !== null) {
            playerHealthRef.current = soulReviveHealth;
            return soulReviveHealth;
          }
          startDefeatTransition(800);
        }

        return newHealth;
      });
      setFireTornadoTurns(prev => Math.max(0, prev - 1));
      addLog(`🌪️ Fire Tornado scorches you for ${tornadoDamage} damage! (${Math.max(0, fireTornadoTurns - 1)} turn${fireTornadoTurns - 1 !== 1 ? 's' : ''} remaining)`);

      const magmaBoss = enemiesRef.current.find(e => e.name === 'Magma Overlord' && e.currentHealth > 0);
      if (magmaBoss && tornadoDamage > 0) {
        setBossChargeCount(prev => {
          const threshold = getBossRageThreshold(magmaBoss.name);
          const newCount = prev + 1;
          if (newCount >= threshold) {
            handleBossRageTrigger(magmaBoss);
            return 0;
          }
          return newCount;
        });
      }

      if (Math.random() < 0.2) {
        skipPlayerTurn = true;
        addLog(`🌪️ The fire tornado whips you off balance! Your turn is skipped.`);
      }
    }

    // Increment turn count
    setTurnCount(prev => prev + 1);

    // Passive: Divine Grace (Seraphina) - Heal 2 HP every turn
    if (hero.uniqueAbility?.id === 'divine_grace') {
      const healAmount = calculateHeal(2);
      setPlayerHealth(prev => {
        const newHealth = Math.min(maxPlayerHealth, prev + healAmount);
        if (newHealth !== prev) {
          addLog(`✨ Divine Grace heals ${healAmount} HP!`);
        }
        return newHealth;
      });
    }

    if (hasEquipment('movie_popcorn')) {
      if (popcornEatenThisLevel < 4) {
        setPermanentUpgrades(prev => ({ ...prev, healthBonus: prev.healthBonus + 1 }));
        setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + calculateHeal(1)));
        setPopcornEatenThisLevel(prev => prev + 1);
        addLog(`🥚 Dozens of Eggs: +1 Max HP (${popcornEatenThisLevel + 1}/4).`);
        // Only allow Lucky Egg proc if still under cap
        if (Math.random() < 0.05) {
          const boostedMaxHealth = maxPlayerHealth + 12;
          const salmonellaLoss = Math.floor(boostedMaxHealth * 0.2);
          setPermanentUpgrades(prev => ({ ...prev, healthBonus: prev.healthBonus + 12 }));
          setPlayerHealth(prev => {
            const afterBonus = Math.min(boostedMaxHealth, prev + calculateHeal(12));
            return Math.max(1, afterBonus - salmonellaLoss);
          });
          addLog(`🥚 Lucky Eggs! +12 Max HP, but Salmonella hits (-20% HP).`);
        }
      }
    }

    // Restore resource
    setPlayerResource((prev) => {
      if (hero.classId === 'gunslinger') {
        let gain = 1;
        // Johnny Passive: Gain an extra bullet every turn
        if (hero.uniqueAbility?.id === 'extra_mag') {
          gain += 1;
        }
        const newResource = Math.min(maxPlayerResource, prev + gain);
        if (newResource !== prev) {
          addLog(`🔫 Loaded ${gain} bullet${gain > 1 ? 's' : ''}! (${newResource}/${maxPlayerResource})`);
        }
        return newResource;
      }

      if (hero.uniqueAbility?.id === 'soul_collector') {
        return prev; // Clyde keeps his souls
      }

      // Brawlers fully restore Stamina at the start of their turn
      if (hero.classId === 'brawler') {
        if (hero.id === 'jj_smith' && jjDoubleStaminaNextTurn) {
          setJjDoubleStaminaNextTurn(false);
          addLog(`⚡ JJ's Stamina is DOUBLED from a dodge! (100/50)`);
          return 100;
        }
        return maxBrawlerStamina;
      }

      const extraRestore = hasEquipment('blue_tinted_glasses') ? 8 : 0;
      return Math.min(maxPlayerResource, prev + 8 + extraRestore);
    });

    // Passive: Regeneration (Theron) - Restore 10% maxResource per turn
    if (hero.uniqueAbility?.id === 'regeneration') {
      const regenAmount = Math.floor(maxPlayerResource * 0.1);
      if (regenAmount > 0) {
        setPlayerResource(prev => Math.min(maxPlayerResource, prev + regenAmount));
        addLog(`🩹 Regeneration restores ${regenAmount} resource!`);
      }
    }

    // Passive: Predator's Instinct (Gareth) - Gain 20% more resource on enemy defeat
    // Handled in handleEnemyDefeated

    // Eli Grassylocks: Regenerate Shield if inactive
    if (hero.id === 'eli' && !eliShieldActive) {
      const regenAmount = 20; // Changed from 20% to flat 20
      setEliShieldCharge(prev => {
        const newCharge = Math.min(maxEliShield, prev + regenAmount);
        if (newCharge > prev) {
          addLog(`🛡️ Grassylocks' Shield regenerates ${newCharge - prev} shield! (Charge: ${newCharge}/${maxEliShield})`);
        }
        return newCharge;
      });
    }

    // Decrement block cooldown
    setBlockCooldownTurns(prev => Math.max(0, prev - 1));

    if (artifacts['golden_crown']) {
      const crownRoll = Math.random() * 100;
      // 1% chance per golden crown (capped at 100%)
      const crownChance = Math.min(artifacts['golden_crown'], 100);
      if (crownRoll < crownChance) {
        setPlayerHealth(maxPlayerHealth);
        setPlayerShield(0);
        addLog(`👑 Golden Crown restores you to full health!`);
      }
    }

    if (isSleepingRef.current) {
      isSleepingRef.current = false;
      setIsSleeping(false);
      addLog(`💤 Cedric is still sleeping... skipping turn.`);
      setIsPlayerTurn(false);
      setTimeout(() => enemyTurn(enemiesRef.current, false, false), 300);
      return;
    }

    if (skipPlayerTurn) {
      setIsPlayerTurn(false);
      setTimeout(() => enemyTurn(enemiesRef.current, false, false), 300);
      return;
    }

    if (hero.classId === 'brawler') {
      const heroName = hero.name;
      addLog(`⚡ ${heroName} recovers all Stamina!`);
    }

    setMoveUsesThisTurn({});

    // Feyland Power Punch logic
    if (powerPunchTurnsRef.current > 0 && hero.id === 'feyland') {
      if (powerPunchTurnsRef.current === 2) {
        // Skip this turn
        setPowerPunchTurns(1);
        powerPunchTurnsRef.current = 1;
        addLog(`⏳ Feyland is charging Power Punch... (Turn skipped)`);
        setIsPlayerTurn(false);
        setTimeout(() => enemyTurn(enemiesRef.current, false, false), 300);
        return;
      } else if (powerPunchTurnsRef.current === 1) {
        // Fire it!
        setPowerPunchTurns(0);
        powerPunchTurnsRef.current = 0;
        const ppTargetEnemy = enemiesRef.current.filter(e => e.currentHealth > 0)[0];
        if (ppTargetEnemy) {
          const ppDamage = calculateDamage(180, playerAttack, ppTargetEnemy);
          const ppNewHealth = Math.max(0, ppTargetEnemy.currentHealth - ppDamage);
          let updatedEnemies = enemiesRef.current.map(e => e.id === ppTargetEnemy.id ? { ...e, currentHealth: ppNewHealth } : e);

          setEnemies(updatedEnemies);
          setTotalDamageDealt(prev => prev + (ppTargetEnemy.currentHealth - ppNewHealth));
          addLog(`💥 POWER PUNCH! Feyland unleashes 180 damage on ${ppTargetEnemy.name}!`);

          if (ppNewHealth === 0) {
            setTimeout(() => handleEnemyDefeated(ppTargetEnemy, updatedEnemies, []), 300);
            return; // Hand off to centralized victory handler
          }
        }
      }
    }

    setIsPlayerTurn(true);
  };

  const gameEnded = showRewardScreen || showLoseScreen;

  // Move Logic Additions
  const performGunslingerSixRound = (target: Enemy & { currentHealth: number }) => {
    const maxShots = 6;
    // We'll roll 2-6 potential shots, but also clamp to current ammo
    const rolledShots = Math.floor(Math.random() * 5) + 2;
    const potentialShots = Math.min(rolledShots, playerResource);

    addLog(`🔫 6-Round: Prepare to fire up to ${potentialShots} shots at ${target.name}!`);
    setIsPlayerTurn(false);

    // Unholy Headpiece: Attack moves cost 8% max HP but deal +30% damage
    let damageMultiplier = 1;
    if (hasEquipment('unholy_headpiece')) {
      const hpCost = Math.floor(maxPlayerHealth * 0.08);
      setPlayerHealth(prev => Math.max(1, prev - hpCost));
      damageMultiplier = 1.3;
      addLog(`👹 Unholy Headpiece sacrifices ${hpCost} HP for power!`);
    }

    let totalDamage = 0;
    // Track local state since closure state won't update during timeouts
    let currentShotsFired = 0;
    let localBulletsSpent = bulletsSpent;
    let localGuaranteedCrit = guaranteedCritRef.current;

    // We need a mutable reference to the latest enemy state because state updates are async
    // But we can't easily get the "latest" react state in a recursive timeout without a ref.
    // However, we are controlling the flow. We can track the specific target's health locally.
    let targetCurrentHealth = target.currentHealth;

    const fireShot = (shotIndex: number) => {
      // Stop conditions: 
      // 1. Fired all planned shots
      // 2. Target is dead
      // 3. (Safety) Out of ammo - though potentialShots should handle this
      if (shotIndex >= potentialShots || targetCurrentHealth <= 0) {
        // Resolution phase
        addLog(`🔫 Total: ${totalDamage} damage in ${shotIndex} shots! (${potentialShots - shotIndex} saved)`);
        setTotalDamageDealt(prev => prev + totalDamage);

        if (potentialShots > 0) {
          setLastMoveIdByEnemy(prev => ({ ...prev, [target.id]: 'six_round' }));
          lastMoveIdByEnemyRef.current = { ...lastMoveIdByEnemyRef.current, [target.id]: 'six_round' };
        }

        // Update enemies state one last time to ensure sync
        setEnemies(prev => {
          const updated = prev.map(e => e.id === target.id ? { ...e, currentHealth: targetCurrentHealth } : e);

          // Check for kills and defeat
          setTimeout(() => {
            const justKilled = updated.filter(e => e.currentHealth === 0);
            justKilled.forEach(e => handleEnemyDefeated(e, updated));

            const aliveAfter = updated.filter(e => e.currentHealth > 0);
            if (aliveAfter.length === 0) {
              return; // Victory handled by handleEnemyDefeated
            } else {
              if (updated.find(e => e.id === target.id && e.currentHealth === 0)) {
                if (selectedTargetId === target.id) {
                  setSelectedTargetId(aliveAfter[0].id);
                }
              }
              decrementCooldowns();
              enemyTurn(updated, false, false);
            }
          }, 100);
          return updated;
        });
        return;
      }

      setTimeout(() => {
        // Consume Bullet
        setPlayerResource(prev => Math.max(0, prev - 1));

        // Update Bullets Spent & Check Crit (SIX-ROUND ONLY)
        localBulletsSpent++;
        setBulletsSpent(prev => prev + 1);

        const critThreshold = (hero.uniqueAbility?.id === 'last_chamber') ? 6 : 10;
        const isGuaranteedCrit = (localBulletsSpent % critThreshold) === 0;

        // Report Guaranteed Crit
        if (isGuaranteedCrit) {
          addLog(`🎯 Deadshot: Guaranteed Critical!`);
        }

        const critRoll = rollD20(true);
        const isCritical = critRoll === 20 || isGuaranteedCrit || localGuaranteedCrit;
        if (isCritical) {
          addLog('[DEBUG] Calling maybeApplyBeerBoost from Gunslinger crit handler');
          maybeApplyBeerBoost();
        }
        if (localGuaranteedCrit) {
          localGuaranteedCrit = false;
          if (guaranteedCritRef.current) {
            guaranteedCritRef.current = false;
            setGuaranteedCrit(false);
          }
        }

        // Calculate Damage
        let damage = isCritical
          ? calculateCritDamage(14, attackToUse, target.defense)
          : calculateDamage(14, attackToUse, target.defense);

        damage = Math.floor(damage * damageMultiplier);
        damage = applyFireLizardRepeatReduction(target, 'six_round', damage);
        damage = applyPlayerWeakness(damage);

        applyBloodVileLifesteal(damage, isCritical);
        maybeTriggerSharpRazor(isCritical);

        // Bullet Vamp (Fredrinn) - Heal 10% of damage dealt
        if (hero.uniqueAbility?.id === 'bullet_vamp') {
          const healAmount = calculateHeal(Math.floor(damage * 0.10));
          if (healAmount > 0) {
            setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmount));
            addLog(`🩸 Bullet Vamp heals for ${healAmount} HP!`);
          }
        }

        // Apply Damage Locally
        totalDamage += damage;
        targetCurrentHealth = Math.max(0, targetCurrentHealth - damage);

        // Ring of Power: Execute below 10%
        const ringThreshold = 0.10 + ringThresholdBonusRef.current;
        if (hasEquipment('ring_of_power') && targetCurrentHealth > 0 && targetCurrentHealth <= target.maxHealth * ringThreshold) {
          targetCurrentHealth = 0;
          setRingThresholdBonus(prev => prev + 0.005);
          ringThresholdBonusRef.current += 0.005;
          addLog(`💍 Ring of Power executes ${target.name}! (Threshold: ${(ringThreshold * 100).toFixed(1)}%)`);
        }

        if (isCritical) {
          addLog(`💥 Shot ${shotIndex + 1}: CRITICAL! ${damage} damage!`);
        } else {
          addLog(`⚔️ Shot ${shotIndex + 1}: ${damage} damage.`);
        }

        // Update UI
        setEnemies(prev => prev.map(e => e.id === target.id ? { ...e, currentHealth: targetCurrentHealth } : e));

        // Next Shot
        fireShot(shotIndex + 1);
      }, 500); // 500ms suspenseful delay
    };

    fireShot(0);
  };

  // Lucian's Soul-Shot - IDENTICAL to Six-Round, just different move ID and base damage
  const performSoulShot = (target: Enemy & { currentHealth: number }) => {
    const maxShots = 6;
    const rolledShots = Math.floor(Math.random() * 5) + 2;
    const potentialShots = Math.min(rolledShots, playerResource);

    addLog(`👻 Soul-Shot: Prepare to fire up to ${potentialShots} shots at ${target.name}!`);
    setIsPlayerTurn(false);

    let damageMultiplier = 1;
    if (hasEquipment('unholy_headpiece')) {
      const hpCost = Math.floor(maxPlayerHealth * 0.08);
      setPlayerHealth(prev => Math.max(1, prev - hpCost));
      damageMultiplier = 1.3;
      addLog(`👹 Unholy Headpiece sacrifices ${hpCost} HP for power!`);
    }

    let totalDamage = 0;
    let currentShotsFired = 0;
    let localBulletsSpent = bulletsSpent;
    let localGuaranteedCrit = guaranteedCritRef.current;

    let targetCurrentHealth = target.currentHealth;

    const fireShot = (shotIndex: number) => {
      if (shotIndex >= potentialShots || targetCurrentHealth <= 0) {
        addLog(`👻 Total: ${totalDamage} damage in ${shotIndex} shots! (${potentialShots - shotIndex} saved)`);
        setTotalDamageDealt(prev => prev + totalDamage);

        if (potentialShots > 0) {
          setLastMoveIdByEnemy(prev => ({ ...prev, [target.id]: 'soul_shot' }));
          lastMoveIdByEnemyRef.current = { ...lastMoveIdByEnemyRef.current, [target.id]: 'soul_shot' };
        }

        setEnemies(prev => {
          const updated = prev.map(e => e.id === target.id ? { ...e, currentHealth: targetCurrentHealth } : e);

          setTimeout(() => {
            const justKilled = updated.filter(e => e.currentHealth === 0);
            justKilled.forEach(e => handleEnemyDefeated(e, updated));

            const aliveAfter = updated.filter(e => e.currentHealth > 0);
            if (aliveAfter.length === 0) {
              return; // Victory handled by handleEnemyDefeated
            } else {
              if (updated.find(e => e.id === target.id && e.currentHealth === 0)) {
                if (selectedTargetId === target.id) {
                  setSelectedTargetId(aliveAfter[0].id);
                }
              }
              decrementCooldowns();
              enemyTurn(updated, false, false);
            }
          }, 100);
          return updated;
        });
        return;
      }

      setTimeout(() => {
        setPlayerResource(prev => Math.max(0, prev - 1));

        localBulletsSpent++;
        setBulletsSpent(prev => prev + 1);

        const critThreshold = (hero.uniqueAbility?.id === 'last_chamber') ? 6 : 10;
        const isGuaranteedCrit = (localBulletsSpent % critThreshold) === 0;

        if (isGuaranteedCrit) {
          addLog(`🎯 Deadshot: Guaranteed Critical!`);
        }

        const critRoll = rollD20(true);
        const isCritical = critRoll === 20 || isGuaranteedCrit || localGuaranteedCrit;
        if (isCritical) {
          addLog('[DEBUG] Calling maybeApplyBeerBoost from Bullet Storm crit handler');
          maybeApplyBeerBoost();
        }
        if (localGuaranteedCrit) {
          localGuaranteedCrit = false;
          if (guaranteedCritRef.current) {
            guaranteedCritRef.current = false;
            setGuaranteedCrit(false);
          }
        }

        let damage = isCritical
          ? calculateCritDamage(14, attackToUse, target.defense)
          : calculateDamage(14, attackToUse, target.defense);

        damage = Math.floor(damage * damageMultiplier);
        damage = applyFireLizardRepeatReduction(target, 'soul_shot', damage);
        damage = applyPlayerWeakness(damage);

        applyBloodVileLifesteal(damage, isCritical);
        maybeTriggerSharpRazor(isCritical);

        if (hero.uniqueAbility?.id === 'bullet_vamp') {
          const healAmt = calculateHeal(Math.ceil(damage * 0.08));
          if (healAmt > 0) {
            setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmt));
            addLog(`🩸 Bullet Vamp heals for ${healAmt} HP!`);
          }
        }

        totalDamage += damage;
        targetCurrentHealth = Math.max(0, targetCurrentHealth - damage);

        if (hero.id === 'lucian') {
          setLucianSoulMeter(prev => Math.min(5000, prev + 1));
          addLog(`🟣 Soul +1`);
        }

        const ringThreshold = 0.10 + ringThresholdBonusRef.current;
        if (hasEquipment('ring_of_power') && targetCurrentHealth > 0 && targetCurrentHealth <= target.maxHealth * ringThreshold) {
          targetCurrentHealth = 0;
          setRingThresholdBonus(prev => prev + 0.005);
          ringThresholdBonusRef.current += 0.005;
          addLog(`💍 Ring of Power executes ${target.name}! (Threshold: ${(ringThreshold * 100).toFixed(1)}%)`);
        }

        if (isCritical) {
          addLog(`💥 Shot ${shotIndex + 1}: CRITICAL! ${damage} damage!`);
        } else {
          addLog(`⚔️ Shot ${shotIndex + 1}: ${damage} damage.`);
        }

        setEnemies(prev => prev.map(e => e.id === target.id ? { ...e, currentHealth: targetCurrentHealth } : e));

        fireShot(shotIndex + 1);
      }, 500);
    };

    fireShot(0);
  };

  const applySingleTargetDamage = (target: Enemy, damage: number) => {
    setTotalDamageDealt(prev => prev + damage);

    const updated = enemies.map(e =>
      e.id === target.id ? { ...e, currentHealth: Math.max(0, e.currentHealth - damage) } : e
    );

    setEnemies(updated);

    // Check for victory/kill immediately using the local updated variable
    const deadEnemy = updated.find(e => e.id === target.id && e.currentHealth === 0);
    if (deadEnemy) {
      handleEnemyDefeated(deadEnemy, updated);
      const aliveAfter = updated.filter(e => e.currentHealth > 0);
      if (aliveAfter.length === 0) {
        addLog(`🏆 All enemies defeated! Victory!`);
        setTimeout(() => {
          if ([3, 6, 9].includes(currentLevel)) setShowInterlude(true);
          else setShowRewardScreen(true);
        }, 1000);
        return;
      } else if (selectedTargetId === deadEnemy.id) {
        setSelectedTargetId(aliveAfter[0].id);
      }


    }

    decrementCooldowns();
    setIsPlayerTurn(false);

    // Pass the SPECIFIC updated health state to enemyTurn so dead enemies don't act
    enemyTurn(updated, false, false);
  };

  const performBulletStorm = () => {
    // 3-8 shots, clamped to available ammo
    const rolledShots = Math.floor(Math.random() * 6) + 3;
    const shotsToFire = rolledShots;
    const potentialShots = Math.min(shotsToFire, playerResource);

    addLog(`🌪️ BULLET STORM! Prepare to fire up to ${potentialShots} shots randomly!`);
    setIsPlayerTurn(false);

    // Unholy Headpiece: Attack moves cost 8% max HP but deal +30% damage
    let damageMultiplier = 1;
    if (hasEquipment('unholy_headpiece')) {
      const hpCost = Math.floor(maxPlayerHealth * 0.08);
      setPlayerHealth(prev => Math.max(1, prev - hpCost));
      damageMultiplier = 1.3;
      addLog(`👹 Unholy Headpiece sacrifices ${hpCost} HP for power!`);
    }

    let totalDamage = 0;
    let localBulletsSpent = bulletsSpent;
    let localGuaranteedCrit = guaranteedCritRef.current;
    const hitEnemyIds = new Set<string>();
    // removed bulletsRestored

    // We maintain a local copy of enemies to track health during the sequence
    let localEnemies = enemies.map(e => ({ ...e }));

    const fireShot = (shotIndex: number) => {
      // Filter for currently alive enemies in our local state
      const aliveTargets = localEnemies.filter(e => e.currentHealth > 0);

      // Stop conditions
      if (shotIndex >= potentialShots || aliveTargets.length === 0) {
        // Resolution
        // Resolution
        // removed bulletsRestored check

        addLog(`🌪️ Total: ${totalDamage} damage in ${shotIndex} shots! (${potentialShots - shotIndex} saved)`);
        setTotalDamageDealt(prev => prev + totalDamage);

        if (hitEnemyIds.size > 0) {
          setLastMoveIdByEnemy(prev => {
            const next = { ...prev };
            hitEnemyIds.forEach(id => {
              next[id] = 'bullet_storm';
            });
            return next;
          });
          const nextRef = { ...lastMoveIdByEnemyRef.current };
          hitEnemyIds.forEach(id => {
            nextRef[id] = 'bullet_storm';
          });
          lastMoveIdByEnemyRef.current = nextRef;
        }

        // Final state update
        setEnemies(prev => {
          const finalState = localEnemies.map(e => ({ ...e }));

          setTimeout(() => {
            const justKilled = finalState.filter(e => e.currentHealth === 0);
            justKilled.forEach(e => handleEnemyDefeated(e, finalState));

            const stillAlive = finalState.filter(e => e.currentHealth > 0);

            if (stillAlive.length === 0) {
              return; // Victory handled by handleEnemyDefeated
            } else {
              decrementCooldowns();
              enemyTurn(finalState, false, false);
            }
          }, 100);
          return finalState;
        });
        return;
      }

      setTimeout(() => {
        // Consume Bullet
        setPlayerResource(prev => Math.max(0, prev - 1));

        // Update Bullets Spent & Check Crit
        localBulletsSpent++;
        setBulletsSpent(prev => prev + 1);

        const critThreshold = (hero.uniqueAbility?.id === 'last_chamber') ? 6 : 10;
        const isGuaranteedCrit = (localBulletsSpent % critThreshold) === 0;

        const critRoll = rollD20(true);
        const isCritical = critRoll === 20 || isGuaranteedCrit || localGuaranteedCrit;
        if (localGuaranteedCrit) {
          localGuaranteedCrit = false;
          if (guaranteedCritRef.current) {
            guaranteedCritRef.current = false;
            setGuaranteedCrit(false);
          }
        }

        // Pick Random Target from currently alive
        const targetIdx = Math.floor(Math.random() * aliveTargets.length);
        const target = aliveTargets[targetIdx];

        // Calculate Damage
        let damage = isCritical
          ? calculateCritDamage(14, attackToUse, target.defense)
          : calculateDamage(14, attackToUse, target.defense);

        damage = Math.floor(damage * damageMultiplier);
        damage = applyFireLizardRepeatReduction(target, 'bullet_storm', damage);
        hitEnemyIds.add(target.id);

        applyBloodVileLifesteal(damage, isCritical);
        maybeTriggerSharpRazor(isCritical);

        // Blood Bullets Passive
        if (hero.uniqueAbility?.id === 'bullet_vamp') {
          const healAmt = Math.ceil(damage * 0.08);
          if (healAmt > 0) {
            setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmt));
          }
        }

        // Track kills for bullet restore
        // Track kills (removed restore)

        // Apply Damage Locally
        totalDamage += damage;
        target.currentHealth = Math.max(0, target.currentHealth - damage);

        // Ring of Power: Execute below 10%
        const ringThreshold = 0.10 + ringThresholdBonusRef.current;
        if (hasEquipment('ring_of_power') && target.currentHealth > 0 && target.currentHealth <= target.maxHealth * ringThreshold) {
          target.currentHealth = 0;
          setRingThresholdBonus(prev => prev + 0.005);
          ringThresholdBonusRef.current += 0.005;
          addLog(`💍 Ring of Power executes ${target.name}! (Threshold: ${(ringThreshold * 100).toFixed(1)}%)`);
        }

        if (isCritical) {
          addLog(`💥 Shot ${shotIndex + 1}: CRITICAL on ${target.name}! ${damage} damage!`);
        } else {
          addLog(`⚔️ Shot ${shotIndex + 1}: ${damage} damage to ${target.name}.`);
        }

        // Update UI (force re-render with latest local state)
        setEnemies(localEnemies.map(e => ({ ...e })));

        fireShot(shotIndex + 1);
      }, 400); // 400ms delay between shots
    };

    fireShot(0);
  };

  const startDefeatTransition = (delay = 400) => {
    if (isDefeatAnimating) return;
    combatLockedRef.current = true; // Block inputs immediately on defeat
    setIsDefeatAnimating(true);
    setIsPlayerTurn(false);
    setIsTransitioning(true);

    // Reset Cedric to human form when defeated (if in beast form)
    if (hero.id === 'cedric' && dualityForm === 'beast') {
      setDualityForm('human');
      setCharacterMoves(CEDRIC_HUMAN_MOVES);
    }

    setTimeout(() => {
      setIsDefeatAnimating(false);
      setShowLoseScreen(true);
      setIsTransitioning(false);
    }, defeatAnimationDuration + delay);
  };

  const resolveRPS = (userChoice: 'rock' | 'paper' | 'scissors') => {
    setShowRPS(false);
    const move = rpsPendingMove;
    if (!move) return;

    const choices = ['rock', 'paper', 'scissors'];
    const botChoice = choices[Math.floor(Math.random() * 3)];

    let win = false;
    if (
      (userChoice === 'rock' && botChoice === 'scissors') ||
      (userChoice === 'paper' && botChoice === 'rock') ||
      (userChoice === 'scissors' && botChoice === 'paper')
    ) {
      win = true;
    }

    const botEmoji = botChoice === 'rock' ? '🪨' : botChoice === 'paper' ? '📜' : '✂️';
    const userEmoji = userChoice === 'rock' ? '🪨' : userChoice === 'paper' ? '📜' : '✂️';

    addLog(`🎲 RPS: You chose ${userEmoji}, Bot chose ${botEmoji}...`);

    if (win) {
      addLog(`🎲 RPS: VICTORY! Full meter and critical strike!`);
      setDualityMeter(4);
      setPlayerResource(prev => Math.max(0, prev - move.cost));
      const target = enemies.find(e => e.id === selectedTargetId);
      if (target) {
        let damage = calculateCritDamage(move.baseDamage || 30, attackToUse, target);
        damage = applyFireLizardRepeatReduction(target, move.id, damage);
        setLastMoveIdByEnemy(prev => ({ ...prev, [target.id]: move.id }));
        lastMoveIdByEnemyRef.current = { ...lastMoveIdByEnemyRef.current, [target.id]: move.id };
        applyPlayerAttackToEnemy(target, damage, move);
      } else {
        endPlayerTurn(move);
      }
    } else if (userChoice === botChoice) {
      addLog(`🎲 RPS: DRAW! Nothing happens.`);
      setPlayerResource(prev => Math.max(0, prev - move.cost));
      endPlayerTurn(move);
    } else {
      const penaltyText = "DEFEAT!";
      addLog(`🎲 RPS: ${penaltyText} Cedric takes double damage next turn.`);
      setTakeExtraDamageNextTurn(true);
      setPlayerResource(prev => Math.max(0, prev - move.cost));
      endPlayerTurn(move);
    }
    setRpsPendingMove(null);
  };

  const applyPlayerAttackToEnemy = (target: Enemy, damage: number, move?: Move) => {
    let updatedEnemies = enemies.map(e => {
      if (e.id === target.id) {
        let currentEnemyShield = e.shield || 0;
        let newShield = currentEnemyShield;
        let damageRemaining = damage;

        // Protective Veil Logic: 30% Damage Reduction if Shield Fairy is alive
        const hasProtectiveVeil = enemies.some(ally =>
          ally.currentHealth > 0 &&
          (ally.traitId === 'protective_veil' || ally.name === 'Shield Fairy') // Robust check
        );

        if (hasProtectiveVeil) {
          const originalDamage = damageRemaining;
          damageRemaining = Math.floor(damageRemaining * 0.7);
          // Only log once per attack if possible, but map runs for each enemy.
          // However, applyPlayerAttackToEnemy is called once per target usually.
          // We can't easily log here without spamming if it's AOE.
          // But this function is usually for single target or mapped externaly?
          // Actually applyPlayerAttackToEnemy sends 'setEnemies(updatedEnemies)' so it runs once.
          // Wait, applyPlayerAttackToEnemy takes `target` (singular).
          // So this is per target.
          if (damageRemaining < originalDamage) {
            // We can't log nicely inside map return without side effects or ref setup.
            // Logic is fine though.
          }
        }

        // Log it outside if needed, or just let the damage number speak.
        // Let's add a small floating text check or just rely on log if we can.
        // Actually, let's keep it simple first.

        let newHealth = e.currentHealth;

        if (currentEnemyShield > 0) {
          const absorbed = Math.min(currentEnemyShield, damageRemaining);
          newShield = currentEnemyShield - absorbed;
          damageRemaining -= absorbed;
        }
        newHealth = Math.max(0, newHealth - damageRemaining);
        return { ...e, currentHealth: newHealth, shield: newShield };
      }
      return e;
    });
    setEnemies(updatedEnemies);
    setTotalDamageDealt(prev => prev + damage);

    setTimeout(() => {
      const defeated = updatedEnemies.find(e => e.id === target.id && e.currentHealth === 0);
      if (defeated) handleEnemyDefeated(defeated, updatedEnemies);

      const allDead = updatedEnemies.every(e => e.currentHealth === 0);
      if (allDead) {
        addLog(`🏆 All enemies defeated! Victory!`);
        setTimeout(() => {
          if (currentLevel % 3 === 0) {
            setShowInterlude(true);
          } else {
            setShowRewardScreen(true);
          }
        }, 1000);
        return;
      }

      decrementCooldowns();
      if (move) setActiveCooldowns(prev => ({ ...prev, [move.id]: move.cooldown }));

      if (hero.classId === 'brawler') {
        setIsPlayerTurn(true);
      } else {
        setIsPlayerTurn(false);
        enemyTurn(updatedEnemies, false, false);
      }
    }, 500);
  };

  const endPlayerTurn = (m: Move) => {
    decrementCooldowns();
    setActiveCooldowns(prev => ({ ...prev, [m.id]: m.cooldown }));
    setIsPlayerTurn(false);
    enemyTurn(undefined, false, false);
  };

  const handleMoveSelect = (move: Move) => {
    setShowMoveSelection(false);

    // Block move input during level transitions (load/victory/defeat)
    if (combatLockedRef.current) return;

    // Prevent move usage if not player's turn (e.g. enemy turn or animation)
    if (!isPlayerTurn && !cheatBuffer) return;

    if (entrapmentTurns > 0 && entrapmentMoveId === move.id) {
      addLog(`⛓️ Entrapment seals ${move.name}! Choose a different move.`);
      return;
    }

    // Track resource refund status for early exits
    let resourceRefunded = false;

    // Check usage limits and combo for Brawlers
    let brawlerFreeMove = false;
    const uses = moveUsesThisTurn[move.id] || 0;

    if (hero.classId === 'brawler') {
      brawlerFreeMove = brunoComboMeter >= 3;
    }

    if (!brawlerFreeMove && move.maxUsesPerTurn !== undefined && uses >= move.maxUsesPerTurn) {
      addLog(`❌ You can only use ${move.name} ${move.maxUsesPerTurn} times per turn!`);
      return;
    }

    // Check if move is on cooldown
    if (activeCooldowns[move.id] && activeCooldowns[move.id] > 0) {
      addLog(`❌ ${move.name} is on cooldown for ${activeCooldowns[move.id]} more turn(s)!`);
      return;
    }

    // Auto-Target Logic:
    // If no target is selected, default to the first living enemy.
    let effectiveTargetId = selectedTargetId;
    if (!effectiveTargetId) {
      const firstAlive = enemies.find(e => e.currentHealth > 0);
      if (firstAlive) {
        effectiveTargetId = firstAlive.id;
        setSelectedTargetId(firstAlive.id); // Update UI state
      }
    }

    // Validate target BEFORE state changes (for non-AOE attacks)
    if (move.type === 'attack' && move.baseDamage !== undefined && move.id !== 'whirlwind' && !move.isAOE) {
      if (!effectiveTargetId) {
        addLog(`❌ No valid target available!`);
        return;
      }

      const target = enemies.find(e => e.id === effectiveTargetId);
      if (!target || target.currentHealth <= 0) {
        addLog(`❌ Invalid target!`);
        return;
      }
    }

    // --- BEYOND THIS POINT, THE MOVE IS VALID AND WILL EXECUTE ---

    // Track move uses THIS turn
    if (!brawlerFreeMove) {
      setMoveUsesThisTurn(prev => ({
        ...prev,
        [move.id]: (prev[move.id] || 0) + 1
      }));
    }

    // Only record player's last move for mimicry if it's a real move (not a dev cheat, not a failed action)
    if (!move.id.startsWith('dev_') && !move.id.startsWith('cheat_') && move.id !== 'invalid' && move.id !== 'none') {
      setLastPlayerMoveId(move.id);
    }

    // Unified Resource Deduction (Assumes move is valid and will execute)
    // Passive: Arcane Mastery (Elara) - 15% chance to refund mana cost
    if (hero.uniqueAbility?.id === 'arcane_mastery') {
      const masteryRoll = Math.random() * 100;
      if (masteryRoll < 15) {
        resourceRefunded = true;
        addLog(`✨ Arcane Mastery! Spell costs no ${resourceType}!`);
      }
    }

    if (!resourceRefunded && move.id !== 'training' && move.id !== 'six_round' && move.id !== 'soul_shot' && move.id !== 'bullet_storm' && move.id !== 'spare_bullet' && move.id !== 'reload_move') {
      setPlayerResource(prev => Math.max(0, prev - move.cost));
    }

    // Check if player has enough resource
    if (move.id === 'training') {
      if (hasLavaGolem()) {
        addLog(`🌋 Lava Golem's heat prevents training!`);
        return;
      }
      if (hasJester()) {
        if (trainUsageCount >= 3) {
          addLog('💪 You have already trained the maximum 3 times this level!');
          return;
        }
        setTrainUsageCount(prev => prev + 1);
        addLog(getJesterTaunt());
        decrementCooldowns();
        setIsPlayerTurn(false);
        enemyTurn(enemies, false, false);
        return;
      }
      const trainCost = 8;
      if (playerResource < trainCost) {
        addLog(`❌ Not enough ${resourceType} to train! Need ${trainCost}, have ${playerResource}.`);
        return;
      }
      // Training cost is custom, so we keep it here or handle it specifically. Wait, training is a special case.
      // This is a special case where the cost is fixed and not 'move.cost', so it's not redundant with the unified block.
      setPlayerResource(prev => Math.max(0, prev - trainCost));
      addLog(`💪 Training complete! Gained experience.`);
      endPlayerTurn(move);
      return;
    }

    const lavaBlocksBuffs = hasLavaGolem();
    const isBuffMove = move.id === 'strengthen' || move.type === 'buff';
    if (lavaBlocksBuffs && isBuffMove) {
      addLog(`🌋 Lava Golem's heat prevents buff moves!`);
      return;
    }

    if (isBuffMove && enemies.some(e => e.name === 'Lost Hunter' && e.currentHealth > 0)) {
      setPlayerBleedTurns(2);
      addLog(`🐻 Lost Hunter throws a Bear Trap! You are bleeding!`);
    }

    if (hasJester() && isBuffMove) {
      if (buffMoveUsageCount >= 3) {
        addLog(`❌ You can only use 3 buff moves per level! (${buffMoveUsageCount}/3)`);
        return;
      }
      // Resource will be deducted by the unified block below

      const updatedEnemies = enemies.map(e => {
        if (e.name !== 'Jester') return e;
        if (move.id === 'strengthen') {
          return { ...e, attack: e.attack + 8, defense: e.defense + 8 };
        }
        const attackBoost = (move as Move & { attackBoost?: number }).attackBoost || 0;
        const defenseBoost = move.defenseBoost || 0;
        return {
          ...e,
          attack: e.attack + attackBoost,
          defense: e.defense + defenseBoost,
        };
      });

      setEnemies(updatedEnemies);
      setBuffMoveUsageCount(prev => prev + 1);
      addLog(getJesterTaunt());
      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn(updatedEnemies, false, false);
      return;
    }

    if (hero.id === 'dearborn' && move.id !== 'strike' && move.id !== 'wave_crash') {
      upgradeDearbornStrike();
    }

    // Handle Brawler Combo Meter tracking (Bruno only)
    if (hero.id === 'bruno') {
      if (brawlerFreeMove) {
        setBrunoComboMeter(0); // Reset meter after using the combo
      } else {
        setBrunoComboMeter(prev => Math.min(3, prev + 1));
      }
    }

    // Cedric Meter Logic (Duality Class) - Moved to top to catch AOE moves
    if (hero.classId === 'duality') {
      if (dualityForm === 'human') {
        if (move.id === 'punch') {
          setDualityMeter(prev => {
            const next = Math.min(4, prev + 1);
            if (next === 4) addLog(`🌕 The Moon is full! You can now transform!`);
            return next;
          });
        }
      } else if (dualityForm === 'beast') {
        // Beast Form Passive: Charge on attacks
        if (move.type === 'attack') {
          setDualityMeter(prev => {
            const hits = (move.isAOE || move.id === 'wide_collision' || move.id === 'whirlwind')
              ? enemies.filter(e => e.currentHealth > 0).length
              : 1;

            const next = prev + hits;

            if (next >= 4) {
              addLog(`🌕 Beast Fury! Reached 4 Stacks!`);
              addLog(`❤️ Healed 10% HP & Gained +5 Attack!`);

              // Trigger Effect
              const healAmt = calculateHeal(Math.floor(maxPlayerHealth * 0.10));
              setPlayerHealth(current => Math.min(maxPlayerHealth, current + healAmt));
              setPermanentUpgrades(u => ({ ...u, attackBonus: u.attackBonus + 5 }));

              return 0; // Reset
            }
            return next;
          });
        }
      }
    }


    // Wolfgang Passive & Move Logic
    if (hero.id === 'wolfgang') {
      if (move.id === 'on_beat') {
        setPlayerResource(prev => Math.min(maxPlayerResource, prev + 10));
        setDualityMeter(prev => Math.min(4, prev + 1)); // Add Rhythm Flow stack
        addLog(`🎵 On-Beat! Restored 10 Energy & Gained 1 Rhythm Flow!`);
      } else if (move.id === 'conductor') {
        setPlayerShield(prev => prev + 15);
        // Guaranteed Stun
        const targetId = effectiveTargetId;
        if (targetId) {
          setEnemies(prev => prev.map(e => e.id === targetId ? { ...e, stunTurns: 1 } : e));
          addLog(`🎻 Conductor! Stunned the target and gained 15 Shield!`);
        } else {
          addLog(`🎻 Conductor! Gained 15 Shield!`);
        }
      } else if (move.id === 'inventory_switch') {
        if (dualityMeter < 4) {
          addLog(`❌ Not enough Rhythm Flow stacks! Need 4, have ${dualityMeter}.`);
          return;
        }
        setDualityMeter(0); // Consume stacks

        // Cycle: Keyboard -> Drums -> Violin -> Keyboard
        const forms = ['keyboard', 'drums', 'violin'];
        const currentIdx = forms.indexOf(dualityForm) !== -1 ? forms.indexOf(dualityForm) : 0;
        const nextForm = forms[(currentIdx + 1) % forms.length];

        setDualityForm(nextForm);

        // Update Moveset
        // Update Moveset & Apply Switch Bonus
        let nextMoves = WOLFGANG_KEYBOARD_MOVES;

        if (nextForm === 'drums') {
          nextMoves = WOLFGANG_DRUMS_MOVES;
          // Drum Bonus: 15 AOE Damage + 8 Def
          // Drum Bonus: 15 AOE Damage + 8 Def
          setEnemies(prev => prev.map(e => {
            if (e.currentHealth <= 0) return e;
            return { ...e, currentHealth: Math.max(0, e.currentHealth - 15) };
          }));
          setPermanentUpgrades(u => ({ ...u, defenseBonus: u.defenseBonus + 8 }));
          addLog(`🥁 Drum Switch! Dealt 15 AOE Damage & Gained +8 Defense!`);
        } else if (nextForm === 'violin') {
          nextMoves = WOLFGANG_VIOLIN_MOVES;
          // Violin Bonus: +5 Notes + 5 Attack
          setWolfgangNoteMeter(prev => Math.min(100, prev + 5));
          setPermanentUpgrades(u => ({ ...u, attackBonus: u.attackBonus + 5 }));
          addLog(`🎻 Violin Switch! Gained +5 Notes & +5 Attack!`);
        } else {
          // Keyboard Bonus: Heal 15% Max HP
          const healAmt = calculateHeal(Math.floor(maxPlayerHealth * 0.15));
          setPlayerHealth(curr => Math.min(maxPlayerHealth, curr + healAmt));
          addLog(`🎹 Piano Switch! Healed ${healAmt} HP!`);
        }

        setCharacterMoves(nextMoves);
        addLog(`🔄 Switched instrument to ${nextForm.toUpperCase()}! Consumed 4 Stacks.`);


        decrementCooldowns();
        setIsPlayerTurn(false);
        enemyTurn(enemies, false, false);
        return; // End turn
      } else if (move.id.startsWith('symphony')) {
        setShowSymphonyEffect(true);
        setTimeout(() => {
          setShowSymphonyEffect(false);
          setShowRhythmGame(true);
          setCurrentRhythmType(dualityForm as 'keyboard' | 'drums' | 'violin');
        }, 1800);
        return;
      }
    }

    // --- Interactive Moves (RPS) ---
    if (move.id === 'rps') {
      setRpsPendingMove(move);
      setShowRPS(true);
      return;
    }

    // Unified Gunslinger Crit Logic (skip for multi-hit moves, handled internally)
    let guaranteedGunslingerCrit = false;

    if (hero.classId === 'gunslinger' && move.cost > 0 && move.id !== 'six_round' && move.id !== 'soul_shot' && move.id !== 'bullet_storm') {
      const threshold = (hero.uniqueAbility?.id === 'last_chamber') ? 6 : 10;
      const nextBulletsSpent = bulletsSpent + move.cost;

      if (Math.floor(nextBulletsSpent / threshold) > Math.floor(bulletsSpent / threshold)) {
        guaranteedGunslingerCrit = true;
        addLog(`🎯 Deadshot: Guaranteed Critical reached! (${nextBulletsSpent} total bullets spent)`);
      }
      setBulletsSpent(nextBulletsSpent);
    }

    // Set cooldown if the move has one
    if (move.cooldown > 0) {
      setActiveCooldowns((prev) => ({
        ...prev,
        [move.id]: move.cooldown,
      }));
    }

    // Track the updated enemies state
    let updatedEnemies = enemies;

    // Gunslinger Move: Reload
    if (move.id === 'reload_move') {
      const reloadAmt = 4;
      // Resource cost (0) is already handled by unified block above if it ever has one
      setPlayerResource(prev => Math.min(8, prev + reloadAmt));
      addLog(`🔫 Reloading! +${reloadAmt} Bullets! Turn ends.`);
      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn(undefined, false, false);
      return;
    }

    // Gunslinger Move: 6-Round
    if (move.id === 'six_round') {
      const target = enemies.find(e => e.id === effectiveTargetId)!;
      performGunslingerSixRound(target);
      return;
    }

    // Lucian Move: Soul-Shot
    if (move.id === 'soul_shot') {
      const target = enemies.find(e => e.id === effectiveTargetId)!;
      performSoulShot(target);
      return;
    }

    // Gunslinger Move: Bullet Storm
    if (move.id === 'bullet_storm') {
      performBulletStorm();
      return;
    }

    // --- STAGE 4 MOVES ---

    // Warrior: Windswept Fury (AOE)
    if (move.id === 'windswept_fury') {

      const aliveEnemies = enemies.filter(e => e.currentHealth > 0);
      let totalFuryDamage = 0;
      const damageMap: Record<string, number> = {};

      addLog(`🌪️ Windswept Fury! Attacking ALL enemies!`);

      // Unholy Headpiece check
      let damageMultiplier = 1;
      if (hasEquipment('unholy_headpiece')) {
        const hpCost = Math.floor(maxPlayerHealth * 0.08);
        setPlayerHealth(prev => Math.max(1, prev - hpCost));
        damageMultiplier = 1.3;
        addLog(`👹 Unholy Headpiece sacrifices ${hpCost} HP for power!`);
      }

      aliveEnemies.forEach(e => {
        const critRoll = rollD20(true);
        const isCritical = critRoll === 20 || consumeGuaranteedCrit();

        let damage = isCritical
          ? calculateCritDamage(80, attackToUse, e.defense)
          : calculateDamage(80, attackToUse, e.defense);

        damage = Math.floor(damage * damageMultiplier);
        damage = applyFireLizardRepeatReduction(e, move.id, damage);

        applyBloodVileLifesteal(damage, isCritical);
        maybeTriggerSharpRazor(isCritical);

        damageMap[e.id] = damage;
        totalFuryDamage += damage;

        if (isCritical) addLog(`💥 CRITICAL! ${e.name} takes ${damage} damage!`);
        else addLog(`⚔️ ${e.name} takes ${damage} damage!`);
      });

      setTotalDamageDealt(prev => prev + totalFuryDamage);

      const updated = enemies.map(e => {
        if (damageMap[e.id]) {
          return { ...e, currentHealth: Math.max(0, e.currentHealth - damageMap[e.id]) };
        }
        return e;
      });

      setEnemies(updated);
      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn(updated, false, false);
      return;
    }

    // Mage: Mana Surge (Buff)
    if (move.id === 'mana_surge') {
      // Costs mana to cast, then grants free spells

      setManaSurgeTurns(3);
      addLog(`✨ Mana Surge activated! Your moves cost 0 Mana for 3 turns!`);

      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn(undefined, false, false);
      return;
    }

    // Rogue: Speed Blitz (Speed Scaling)
    if (move.id === 'speed_blitz') {

      const target = enemies.find(e => e.id === effectiveTargetId)!;
      const speedBonus = Math.floor(effectiveSpeed * 0.2);
      const baseDmg = 50 + speedBonus;

      const critRoll = rollD20(true);
      const isCritical = critRoll === 20 || consumeGuaranteedCrit();

      let damage = isCritical
        ? calculateCritDamage(baseDmg, attackToUse, target.defense)
        : calculateDamage(baseDmg, attackToUse, target.defense);

      damage = applyFireLizardRepeatReduction(target, move.id, damage);
      applyBloodVileLifesteal(damage, isCritical);
      maybeTriggerSharpRazor(isCritical);

      addLog(`⚡ Speed Blitz! ${speedBonus} bonus damage from speed!`);
      if (isCritical) addLog(`💥 CRITICAL! ${target.name} takes ${damage} damage!`);
      else addLog(`⚔️ ${target.name} takes ${damage} damage!`);

      applySingleTargetDamage(target, damage);
      return;
    }

    // Paladin: Hammer Combo
    if (move.id === 'hammer_combo') {

      if (hammerComboStage === 0) {
        // Stage 1: Single Target 30 dmg
        const target = enemies.find(e => e.id === effectiveTargetId)!;
        const isCritical = consumeGuaranteedCrit();
        let damage = isCritical
          ? calculateCritDamage(30, attackToUse, target.defense)
          : calculateDamage(30, attackToUse, target.defense);
        damage = applyFireLizardRepeatReduction(target, move.id, damage);

        addLog(`🔨 Hammer Combo (Part 1): Smite!`);
        addLog(`⚔️ ${target.name} takes ${damage} damage!`);

        setHammerComboStage(1);
        applySingleTargetDamage(target, damage);
      } else {
        // Stage 2: AOE 50 dmg + Heal 40
        const aliveEnemies = enemies.filter(e => e.currentHealth > 0);
        let totalDmg = 0;
        const damageMap: Record<string, number> = {};

        addLog(`🔨 Hammer Combo (Part 2): GRAND SLAM!`);

        aliveEnemies.forEach(e => {
          let damage = calculateDamage(50, attackToUse, e.defense);
          damage = applyFireLizardRepeatReduction(e, move.id, damage);
          damageMap[e.id] = damage;
          totalDmg += damage;
          addLog(`⚔️ ${e.name} takes ${damage} damage!`);
        });

        const healAmount = calculateHeal(40);
        setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmount));
        addLog(`💚 Grand Slam heals you for ${healAmount} HP!`);

        setHammerComboStage(0); // Reset

        const updated = enemies.map(e => {
          if (damageMap[e.id]) {
            return { ...e, currentHealth: Math.max(0, e.currentHealth - damageMap[e.id]) };
          }
          return e;
        });

        setEnemies(updated);
        decrementCooldowns();
        setIsPlayerTurn(false);
        enemyTurn(updated, false, false);
      }
      return;
    }

    // Gunslinger: Spare Bullet (Buff)
    if (move.id === 'spare_bullet') {

      setGuaranteedCrit(true);
      guaranteedCritRef.current = true;
      addLog(`🤠 Spare Bullet! You load a lucky round. Next hit is GUARANTEED CRITICAL!`);

      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn(undefined, false, false);
      return;
    }

    // Clyde Move: OUTRAGE (Space key spam mechanic with epic visual effects)
    if (move.id === 'outrage') {

      // Start OUTRAGE sequence
      setShowOutrageUI(true);
      setOutragePhase('ready');
      setOutrageCountdown(3);
      setOutrageSpaceCount(0);
      setOutrageBlastSize(60);
      setScreenShakeIntensity(0);
      setShowWhiteout(false);
      setOutrageSkipped(false);
      outrageSkippedRef.current = false;
      outrageExecutedRef.current = false;

      // 1 second delay before countdown starts
      setTimeout(() => {
        setOutragePhase('countdown');
        let countdown = 3;

        // Countdown timer (3, 2, 1)
        outrageCountdownIntervalRef.current = window.setInterval(() => {
          countdown--;
          setOutrageCountdown(countdown);

          if (countdown === 0) {
            if (outrageCountdownIntervalRef.current) {
              clearInterval(outrageCountdownIntervalRef.current);
              outrageCountdownIntervalRef.current = null;
            }
            // If the player skipped during countdown, abort entering spam
            if (outrageSkippedRef.current) {
              return;
            }
            setOutragePhase('spam');

            // Now handle space key and mouse click spam for 10 seconds
            let spaceCount = 0;
            const spamStartTime = Date.now();

            const handleInput = () => {
              if (outrageSkippedRef.current) return;
              const elapsed = Date.now() - spamStartTime;
              if (elapsed < 10000) {
                spaceCount++;
                setOutrageSpaceCount(spaceCount);

                // Increase blast size and screen shake with each press
                const blastIncrease = 8 + (spaceCount * 0.5);
                setOutrageBlastSize(prev => Math.min(500, prev + blastIncrease));

                // Screen shake intensity increases with spam
                const shakeIntensity = Math.min(15, spaceCount * 0.3);
                setScreenShakeIntensity(shakeIntensity);
              }
            };

            const handleSpaceKey = (e: KeyboardEvent) => {
              if (e.code === 'Space') {
                e.preventDefault();
                handleInput();
              }
            };

            const handleMouseClick = () => {
              handleInput();
            };

            // Store handlers in ref so skip button can remove them
            outrageLabelRef.current = { handleSpaceKey, handleMouseClick };

            window.addEventListener('keydown', handleSpaceKey);
            window.addEventListener('click', handleMouseClick);

            // After 10 seconds, execute the blast
            outrageBlastTimeoutRef.current = window.setTimeout(() => {
              // If the player already skipped or we've already executed, don't run the scheduled blast
              if (outrageSkippedRef.current || outrageExecutedRef.current) {
                outrageBlastTimeoutRef.current = null;
                return;
              }
              // Mark executed to prevent races with Skip
              outrageExecutedRef.current = true;
              window.removeEventListener('keydown', handleSpaceKey);
              window.removeEventListener('click', handleMouseClick);
              setOutragePhase('blast');

              // Calculate final damage
              const baseDamage = Math.max(0, spaceCount);
              const critRoll = rollD20(true);
              const isCritical = critRoll === 20 || consumeGuaranteedCrit();
              if (isCritical) {
                addLog('[DEBUG] Calling maybeApplyBeerBoost from Outrage blast');
                maybeApplyBeerBoost();
                addLog(`⚡ CRITICAL OUTRAGE!`);
              }

              let damageMultiplier = 1;
              if (hasEquipment('unholy_headpiece')) {
                const hpCost = Math.floor(maxPlayerHealth * 0.08);
                setPlayerHealth(prev => Math.max(1, prev - hpCost));
                damageMultiplier = 1.3;
                addLog(`👹 Unholy Headpiece sacrifices ${hpCost} HP for power!`);
              }

              addLog(`💥 OUTRAGE! ${spaceCount} space presses released a devastating beam!`);

              const aliveEnemies = enemies.filter(e => e.currentHealth > 0);
              let totalOutrageDamage = 0;
              const outrageDamageEntries: string[] = [];
              const outrageAttack = attackToUseRef.current;
              const outrageAttackBoost = Math.floor(outrageAttack * 0.25);
              const updatedEnemies = enemies.map(e => {
                if (aliveEnemies.find(ae => ae.id === e.id)) {
                  let damage = isCritical
                    ? calculateCritDamage(baseDamage + outrageAttackBoost, outrageAttack, e.defense)
                    : calculateDamage(baseDamage + outrageAttackBoost, outrageAttack, e.defense);
                  damage = Math.floor(damage * damageMultiplier);
                  totalOutrageDamage += damage;
                  outrageDamageEntries.push(`${e.name} ${damage}`);
                  return { ...e, currentHealth: Math.max(0, e.currentHealth - damage) };
                }
                return e;
              });

              setEnemies(updatedEnemies);
              setTotalDamageDealt(prev => prev + totalOutrageDamage);
              if (outrageDamageEntries.length > 0) {
                addLog(`💥 OUTRAGE hits: ${outrageDamageEntries.join(', ')}`);
              }

              // Boss Charge Count Increment (for Outrage on boss)
              const bossHitByOutrage = aliveEnemies.find(e => e.type === 'BOSS' && e.name !== 'Robin Hood');
              if (bossHitByOutrage) {
                setBossChargeCount(prev => {
                  const boss = aliveEnemies.find(e => e.type === 'BOSS');
                  if (!boss) return prev;
                  const threshold = getBossRageThreshold(boss.name);
                  const newCount = prev + 1;
                  if (newCount >= threshold) {
                    handleBossRageTrigger(boss);
                    return 0; // Reset the counter
                  }
                  return newCount;
                });
              }

              // White-out effect
              setShowWhiteout(true);
              setScreenShakeIntensity(0);

              // Return to normal form after ghoul turn (only 1 turn in ghoul form)
              outragePostBlastTimeoutRef.current = window.setTimeout(() => {
                // clear ref (we're executing)
                outragePostBlastTimeoutRef.current = null;
                setShowWhiteout(false);
                setShowOutrageUI(false);
                setOutrageSkipped(false);
                outrageSkippedRef.current = false;
                setDualityForm('normal');
                setClydeGhoulTurnsLeft(0);
                setCharacterMoves(CLYDE_NORMAL_MOVES);
                addLog(`💀 Ghoul form ended! Clyde returned to normal form!`);

                // Check for victory
                const defeated = updatedEnemies.filter(e => e.currentHealth === 0);
                defeated.forEach(e => {
                  handleEnemyDefeated(e, updatedEnemies, []);
                });

                const aliveAfter = updatedEnemies.filter(e => e.currentHealth > 0);
                if (aliveAfter.length === 0) {
                  addLog(`🏆 All enemies defeated! Victory!`);
                  setTimeout(() => {
                    if (currentLevel % 3 === 0) {
                      setShowInterlude(true);
                    } else {
                      setShowRewardScreen(true);
                    }
                  }, 1000);
                } else {
                  decrementCooldowns();
                  setIsPlayerTurn(false);
                  enemyTurn(updatedEnemies, false, false);
                }
              }, 800); // Fade out after 800ms
            }, 10000); // 10 second spam phase
          }
        }, 1000); // Countdown every 1 second
      }, 1000); // Initial 1 second delay

      setIsPlayerTurn(false);
      return;
    }

    // Duality Move: Energy Drink
    if (move.id === 'energy_drink') {
      const healAmt = 15;
      const energyAmt = 30;
      setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmt));
      setPlayerResource(prev => Math.min(maxPlayerResource, prev + energyAmt));
      addLog(`🥤 Energy Drink! +${healAmt} HP and +${energyAmt} Energy!`);
      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn(undefined, false, false);
      return;
    }

    // Clyde Move: Gift from the Gods
    if (move.id === 'gift_from_the_gods') {
      if (giftFromGodsUsedThisStage) {
        addLog(`❌ Gift from the Gods can only be used once per stage!`);
        return;
      }
      setGiftFromGodsUsedThisStage(true);
      // Player chooses shield or max HP - for now we'll alternate or you can add a UI
      const choice = Math.random() < 0.5 ? 'shield' : 'hp';
      if (choice === 'shield') {
        setPlayerShield(prev => prev + 100);
        addLog(`🎁 Gift from the Gods! Gained 100 Shield!`);
      } else {
        setPermanentUpgrades(prev => ({ ...prev, healthBonus: prev.healthBonus + 100 }));
        // Also heal the amount gained, subject to reduction?
        // Usually Max HP gain comes with current HP gain.
        // "Gain either 100 Shield or 100 Max HP."
        // If I gain Max HP, do I heal? Usually yes in this game (e.g. Iron Will).
        const healAmt = calculateHeal(100);
        setPlayerHealth(prev => prev + healAmt);
        addLog(`🎁 Gift from the Gods! Gained 100 Max HP and healed ${healAmt}!`);
      }
      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn(undefined, false, false);
      return;
    }

    // Clyde Move: Like Turtle Without Its Shell (Transform to Ghoul)
    if (move.id === 'like_turtle_without_shell') {
      if (dualityMeter < 4) {
        addLog(`❌ Not enough meter! (${dualityMeter}/4)`);
        return;
      }

      // Transform to ghoul form
      setDualityForm('ghoul');
      setDualityMeter(0);
      setClydeGhoulTurnsLeft(1); // Only 1 turn in ghoul form
      setCharacterMoves(CLYDE_GHOUL_MOVES);

      addLog(`💀 TRANSFORMATION! Clyde becomes a GHOUL! (1 turn only)`);
      addLog(`⚔️ All Defense converts to Attack (×2)!`);

      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn(undefined, false, false);
      return;
    }

    // Duality Move: Full Moon (Transform)
    if (move.id === 'full_moon') {
      if (dualityMeter < 4) {
        addLog(`❌ Not enough Moon energy! (${dualityMeter}/4)`);
        setCharacterMoves(hero.moves); // Safety reset
        return;
      }

      // Trigger Transformation Visuals
      setShowTransformationEffect(true);
      setTimeout(() => setShowTransformationEffect(false), 2000);

      setDualityForm('beast');
      setDualityMeter(0);
      const healAmt = Math.floor(maxPlayerHealth * 0.25);
      setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmt));

      // Beast Passive: +30 ATK, +20 DEF
      setPermanentUpgrades(prev => ({
        ...prev,
        attackBonus: prev.attackBonus + 30,
        defenseBonus: prev.defenseBonus + 20
      }));

      // Swap to Beast moves
      setCharacterMoves(CEDRIC_BEAST_MOVES);

      addLog(`🌕 FULL MOON! Cedric transforms into his BEAST form! (+30 ATK, +20 DEF)`);
      addLog(`❤️ Healed for ${healAmt} HP during the transformation!`);

      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn(undefined, false, false);
      return;
    }

    // Duality Move: Hibernate
    if (move.id === 'hibernate') {
      setPlayerHealth(maxPlayerHealth);
      isSleepingRef.current = true;
      setIsSleeping(true);
      addLog(`💤 Hibernate! Fully healed but Cedric is sleeping for 1 turn...`);
      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn(undefined, false, false);
      return;
    }

    // Cedric ROAR Buff/Debuff (Must be BEFORE AOE damage block)
    if (move.id === 'roar') {
      setEnemies(prev => prev.map(e => ({ ...e, weaknessTurns: 2 })));
      setPermanentUpgrades(prev => {
        if (hero.id === 'clyde') {
          return prev;
        }
        const currentAtk = playerAttack + prev.attackBonus;
        const cap = getStatCap();
        if (currentAtk >= cap) {
          addLog(`🦁 Attack is already at the cap (${cap})!`);
          return prev;
        }
        const increase = Math.min(8, cap - currentAtk);
        return {
          ...prev,
          attackBonus: prev.attackBonus + increase
        };
      });
      if (hero.id === 'clyde') {
        addLog(`🦁 ROAR! All enemies weakened (2 turns). Clyde's attack remains locked.`);
      } else {
        addLog(`🦁 ROAR! All enemies weakened (2 turns) and Attack increased by 8!`);
      }
      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn(enemies, false, false);
      return;
    }

    if (move.id === 'power_punch') {
      setPowerPunchTurns(2); // Next turn skipped, then fires on turn after
      powerPunchTurnsRef.current = 2;
      addLog(`💪 Feyland is charging his punch up! (-${move.cost} ${resourceType})`);

      if (hero.classId === 'brawler') {
        setIsPlayerTurn(true);
      } else {
        decrementCooldowns();
        setIsPlayerTurn(false);
        enemyTurn(enemiesRef.current, false, false);
      }
      return;
    }

    if (move.type === 'attack' && move.baseDamage !== undefined) {
      const channelingMultiplier = move.id === 'smite' ? 1 : consumeChannelingAttackBuff();
      // Special handling for Smite (scaled by enemy max HP)
      if (move.id === 'smite') {
        const target = enemies.find(e => e.id === effectiveTargetId)!;
        const isCritical = consumeGuaranteedCrit();

        let damageMultiplier = 1;
        if (hasEquipment('unholy_headpiece')) {
          const hpCost = Math.floor(maxPlayerHealth * 0.08);
          setPlayerHealth(prev => Math.max(1, prev - hpCost));
          damageMultiplier = 1.3;
          addLog(`👹 Unholy Headpiece sacrifices ${hpCost} HP for power!`);
        }

        // Smite deals 60% of enemy max HP as base damage, scaled by attack and defense
        const smiteBaseDmg = Math.floor(target.maxHealth * 0.6);
        let damage: number;
        damage = calculateDamage(smiteBaseDmg, attackToUse, target);

        damage = Math.floor(damage * damageMultiplier);
        damage = Math.floor(damage * channelingMultiplier);
        damage = applyTideCallBonus(damage);
        damage = applyFireLizardRepeatReduction(target, move.id, damage);
        consumeTideCall();

        setLastMoveIdByEnemy(prev => ({ ...prev, [target.id]: move.id }));
        lastMoveIdByEnemyRef.current = { ...lastMoveIdByEnemyRef.current, [target.id]: move.id };
        applyBloodVileLifesteal(damage, isCritical);
        maybeTriggerSharpRazor(isCritical);

        addLog(`✨ Smite! ${isCritical ? 'CRITICAL HIT!' : ''} Dealt ${damage} damage to ${target.name}! (-${move.cost} ${resourceType})`);

        const updated = enemies.map(e =>
          e.id === effectiveTargetId
            ? { ...e, currentHealth: Math.max(0, e.currentHealth - damage) }
            : e
        );

        setEnemies(updated);
        setTotalDamageDealt(prev => prev + damage);

        setTimeout(() => {
          const deadEnemy = updated.find(e => e.id === effectiveTargetId && e.currentHealth === 0);
          if (deadEnemy) {
            handleEnemyDefeated(deadEnemy, updated);
          }

          const stillAlive = updated.filter(e => e.currentHealth > 0);
          if (stillAlive.length === 0) {
            addLog(`🏆 All enemies defeated! Victory!`);
            setTimeout(() => {
              if (currentLevel % 3 === 0) {
                setShowInterlude(true);
              } else {
                setShowRewardScreen(true);
              }
            }, 1000);
            return;
          }

          decrementCooldowns();
          setIsPlayerTurn(false);
          enemyTurn(updated, false, false);
        }, 100);
        return;
      }

      // Special handling for Weather Ball (Elara)
      if (move.id === 'weather_ball') {
        const critRoll = rollD20(true);
        const darkPactCrit = hero.uniqueAbility?.id === 'dark_pact' && playerResource >= 100;
        const isCritical = critRoll === 20 || darkPactCrit || consumeGuaranteedCrit();
        if (isCritical) {
          addLog('[DEBUG] Calling maybeApplyBeerBoost from Weather Ball crit handler');
          maybeApplyBeerBoost();
        }
        if (darkPactCrit) {
          addLog(`💀 Dark Pact activated! Guaranteed critical hit at 100 mana!`);
        }
        const damageAmount = move.baseDamage || 30;
        const tideCallEmpowered = tideCallActive;

        const randomEffectChance = move.randomEffectChance || 15;
        const shouldApplyEffect = Math.random() * 100 < randomEffectChance;

        addLog(`⛈️ Weather Ball unleashed! (-${move.cost} Mana)`);
        if (tideCallEmpowered) {
          addLog(`🌊 Tide Call empowers your attack!`);
        }
        const nextLastMoveIds = { ...lastMoveIdByEnemyRef.current };

        const updated = enemies.map(enemy => {
          if (enemy.currentHealth <= 0) return enemy;

          let damage = isCritical
            ? calculateCritDamage(damageAmount, attackToUse, enemy)
            : calculateDamage(damageAmount, attackToUse, enemy);
          if (tideCallEmpowered) {
            damage = Math.floor(damage * 1.5);
          }

          damage = applyFireLizardRepeatReduction(enemy, move.id, damage);
          damage = Math.floor(damage * channelingMultiplier);
          nextLastMoveIds[enemy.id] = move.id;

          if (isCritical) addLog(`🎯 CRITICAL! Weather Ball hits ${enemy.name} for ${damage} damage!`);
          else addLog(`⛈️ Weather Ball hits ${enemy.name} for ${damage} damage!`);

          applyBloodVileLifesteal(damage, isCritical);
          maybeTriggerSharpRazor(isCritical);
          setTotalDamageDealt(prev => prev + damage);

          let updatedEnemy = { ...enemy, currentHealth: Math.max(0, enemy.currentHealth - damage) };

          // Apply random effect if triggered
          if (shouldApplyEffect) {
            const effects = ['poison', 'burn', 'weaken', 'stun', 'freeze'];
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];

            switch (randomEffect) {
              case 'poison':
                updatedEnemy.poisonTurns = 3;
                addLog(`☠️ ${enemy.name} is poisoned!`);
                break;
              case 'burn':
                updatedEnemy.burnTurns = 3;
                addLog(`🔥 ${enemy.name} is burned!`);
                break;
              case 'weaken':
                updatedEnemy.weaknessTurns = 2;
                addLog(`💀 ${enemy.name} is weakened!`);
                break;
              case 'stun':
                updatedEnemy.stunTurns = 1;
                addLog(`⚡ ${enemy.name} is stunned!`);
                break;
              case 'freeze':
                updatedEnemy.stunTurns = Math.floor(Math.random() * 3) + 1; // 1-3 turns
                addLog(`❄️ ${enemy.name} is frozen for ${updatedEnemy.stunTurns} turn(s)!`);
                break;
            }
          }

          return updatedEnemy;
        });

        setEnemies(updated);
        setLastMoveIdByEnemy(nextLastMoveIds);
        lastMoveIdByEnemyRef.current = nextLastMoveIds;
        if (tideCallEmpowered) {
          consumeTideCall();
        }

        setTimeout(() => {
          const justKilled = updated.filter(e => e.currentHealth === 0);
          justKilled.forEach(enemy => handleEnemyDefeated(enemy, updated));

          const stillAlive = updated.filter(e => e.currentHealth > 0);
          if (stillAlive.length === 0) {
            addLog(`🏆 All enemies defeated! Victory!`);
            setTimeout(() => {
              if (currentLevel % 3 === 0) {
                setShowInterlude(true);
              } else {
                setShowRewardScreen(true);
              }
            }, 1000);
            return;
          }

          decrementCooldowns();
          setIsPlayerTurn(false);
          enemyTurn(updated, false, false);
        }, 100);
        return;
      }

      // Special handling for Iron Cage (Zephyr)
      if (move.id === 'iron_cage') {
        const target = enemies.find(e => e.id === effectiveTargetId);
        if (!target) {
          addLog(`❌ No valid target!`);
          return;
        }

        if (!resourceRefunded) setPlayerResource(prev => Math.max(0, prev - move.cost));

        const critRoll = rollD20(true);
        const darkPactCrit = hero.uniqueAbility?.id === 'dark_pact' && playerResource >= 100;
        const isCritical = critRoll === 20 || darkPactCrit || consumeGuaranteedCrit();
        if (isCritical) {
          addLog('[DEBUG] Calling maybeApplyBeerBoost from Iron Cage crit handler');
          maybeApplyBeerBoost();
        }
        if (darkPactCrit) addLog(`💀 Dark Pact activated! Guaranteed critical hit!`);

        let damageAmount = move.baseDamage || 10;

        let damage: number;
        if (isCritical && move.critDamageMultiplier) {
          const baseDamage = calculateDamage(damageAmount, attackToUse, target);
          damage = Math.floor(baseDamage * move.critDamageMultiplier);
        } else {
          damage = calculateDamage(damageAmount, attackToUse, target);
        }

        damage = applyTideCallBonus(damage);
        damage = Math.floor(damage * channelingMultiplier);
        damage = applyFireLizardRepeatReduction(target, move.id, damage);
        consumeTideCall();

        setLastMoveIdByEnemy(prev => ({ ...prev, [target.id]: move.id }));
        lastMoveIdByEnemyRef.current = { ...lastMoveIdByEnemyRef.current, [target.id]: move.id };

        applyBloodVileLifesteal(damage, isCritical);
        maybeTriggerSharpRazor(isCritical);
        addLog(`🔓 Iron Cage! ${isCritical ? `CRITICAL HIT (x${move.critDamageMultiplier})! ` : ''}Dealt ${damage} damage to ${target.name}!`);

        setEnemies(prev => {
          const updated = prev.map(e =>
            e.id === effectiveTargetId
              ? { ...e, currentHealth: Math.max(0, e.currentHealth - damage), stunTurns: 1 }
              : e
          );

          // Check for kills and victory after state update
          setTimeout(() => {
            const justKilled = updated.filter(e => e.currentHealth === 0);
            justKilled.forEach(e => handleEnemyDefeated(e, updated));

            const stillAlive = updated.filter(e => e.currentHealth > 0);
            if (stillAlive.length === 0) {
              addLog(`🏆 All enemies defeated! Victory!`);
              setTimeout(() => {
                if (currentLevel % 3 === 0) {
                  setShowInterlude(true);
                } else {
                  setShowRewardScreen(true);
                }
              }, 1000);
            } else {
              decrementCooldowns();
              setIsPlayerTurn(false);
              enemyTurn(updated, false, false);
            }
          }, 100);

          return updated;
        });

        addLog(`⚡ ${target.name} is stunned!`);
        setTotalDamageDealt(prev => prev + damage);
        return;
      }

      // Special handling for Ice Storm (Meryn) - Damage over 5 turns
      if (move.id === 'ice_storm') {
        // Ensure player has enough mana for ice storm
        if (playerResource < move.cost) {
          addLog(`❌ Not enough ${resourceType}! Need ${move.cost}, have ${playerResource}.`);
          return;
        }
        if (!resourceRefunded) setPlayerResource(prev => Math.max(0, prev - move.cost));

        const baseDamagePerTurn = 16; // 80 / 5
        const totalTurns = 5;
        let totalInitialDamage = 0;
        const aliveEnemyCount = enemies.filter(e => e.currentHealth > 0).length;

        addLog(`❄️ Ice Storm summoned! All enemies will take scaling damage for ${totalTurns} turns! (-${move.cost} Mana)`);

        // Apply initial damage with proper scaling (first hit counts as player turn)
        // Calculate damage FIRST before applying
        const nextLastMoveIds = { ...lastMoveIdByEnemyRef.current };
        const damageMap = enemies
          .filter(e => e.currentHealth > 0)
          .map(enemy => {
            const baseDamage = calculateDamage(baseDamagePerTurn, attackToUse, enemy);
            let damage = applyFireLizardRepeatReduction(enemy, move.id, baseDamage);
            damage = Math.floor(damage * channelingMultiplier);
            applyBloodVileLifesteal(damage, false);
            totalInitialDamage += damage;
            nextLastMoveIds[enemy.id] = move.id;
            return { enemyId: enemy.id, damage };
          });

        setLastMoveIdByEnemy(nextLastMoveIds);
        lastMoveIdByEnemyRef.current = nextLastMoveIds;

        // Now apply the damage with the calculated values
        setEnemies(prev => {
          const updated = prev.map(enemy => {
            const damageInfo = damageMap.find(d => d.enemyId === enemy.id);
            if (damageInfo) {
              const newHealth = Math.max(0, enemy.currentHealth - damageInfo.damage);
              return { ...enemy, currentHealth: newHealth, iceStormTurns: totalTurns - 1 };
            }
            return enemy;
          });

          // Boss Charge Count Increment (for Ice Storm on boss - only on initial hit)
          const bossHitByIceStorm = prev.find(e => e.type === 'BOSS' && e.name !== 'Robin Hood' && damageMap.some(d => d.enemyId === e.id && d.damage > 0));
          if (bossHitByIceStorm) {
            setBossChargeCount(prev => {
              const boss = bossHitByIceStorm;
              const threshold = getBossRageThreshold(boss?.name || '');
              const newCount = prev + 1;
              if (newCount >= threshold) {
                handleBossRageTrigger(boss);
                return 0; // Reset the counter
              }
              return newCount;
            });
          }

          // Check for victory after Ice Storm damage
          setTimeout(() => {
            const stillAlive = updated.filter(e => e.currentHealth > 0);
            if (stillAlive.length === 0) {
              addLog(`🏆 All enemies defeated by Ice Storm! Victory!`);
              setTimeout(() => {
                if (currentLevel % 3 === 0) {
                  setShowInterlude(true);
                } else {
                  setShowRewardScreen(true);
                }
              }, 1000);
            }
          }, 100);

          return updated;
        });

        addLog(`❄️ Turn 1/5: Ice Storm deals ${Math.ceil(totalInitialDamage / (aliveEnemyCount || 1))} damage to all enemies!`);
        setTotalDamageDealt(prev => prev + totalInitialDamage);
        consumePlayerWeaknessTurn();
        decrementCooldowns();
        setIsPlayerTurn(false);
        enemyTurn(undefined, false, false);
        return;
      }

      // Special handling for Spare Bullet (Gunslinger)
      if (move.id === 'spare_bullet') {
        const bulletsToReload = 1;
        setPlayerResource(prev => Math.min(maxPlayerResource, prev + bulletsToReload));
        setGuaranteedCrit(true);
        addLog(`💀 Spare Bullet! Reloaded 1 Critical Bullet!`);
        decrementCooldowns();
        setIsPlayerTurn(false);
        enemyTurn(undefined, false, false);
        return;
      }

      // Special handling for Mana Surge (Mage)
      if (move.id === 'mana_surge') {
        setManaSurgeTurns(3);
        addLog(`✨ Mana Surge! Your next 3 moves cost 0 Mana!`);
        decrementCooldowns();
        setIsPlayerTurn(false);
        enemyTurn(undefined, false, false);
        return;
      }

      // Special handling for Whirlwind (AOE) or any isAOE move
      if (move.id === 'whirlwind' || move.isAOE) {
        const critRoll = rollD20(true);
        const darkPactCrit = hero.uniqueAbility?.id === 'dark_pact' && playerResource >= 100;
        const isCritical = critRoll === 20 || darkPactCrit || consumeGuaranteedCrit();
        if (isCritical) {
          addLog('[DEBUG] Calling maybeApplyBeerBoost from Whirlwind/AOE crit handler');
          maybeApplyBeerBoost();
        }
        if (darkPactCrit) {
          addLog(`💀 Dark Pact activated! Guaranteed critical hit at 100 mana!`);
        }

        const aliveEnemies = enemies.filter(e => e.currentHealth > 0);
        addLog(`🌪️ You used ${move.name}! Hitting ALL enemies! (-${move.cost} ${resourceType})`);
        if (tideCallActive) {
          addLog(`🌊 Tide Call empowers your attack!`);
        }

        if (move.id === 'groundbreak') {
          const healAmt = 25;
          setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmt));
          addLog(`💚 Groundbreak heals you for ${healAmt} HP!`);
        }

        // Trigger Slash Effect for Wide Collision or Slashes
        if (move.id === 'wide_collision' || move.id === 'slashes') {
          const ids = new Set(aliveEnemies.map(e => e.id));
          setSlashedEnemyIds(ids);
          setTimeout(() => setSlashedEnemyIds(new Set()), 800);
        }

        // Unholy Headpiece: Attack moves cost 5% max HP but deal +40% damage
        let damageMultiplier = 1;
        if (hasEquipment('unholy_headpiece')) {
          const hpCost = Math.floor(maxPlayerHealth * 0.05);
          setPlayerHealth(prev => Math.max(1, prev - hpCost));
          damageMultiplier = 1.4;
          addLog(`👹 Unholy Headpiece sacrifices ${hpCost} HP for power!`);
        }

        // Calculate damage for all enemies
        const damageMap: Record<string, number> = {};
        const nextLastMoveIds = { ...lastMoveIdByEnemyRef.current };
        let totalDmg = 0;
        aliveEnemies.forEach(enemy => {
          if (move.baseDamage === undefined) return;
          let damage = isCritical
            ? calculateCritDamage(move.baseDamage, attackToUse, enemy)
            : calculateDamage(move.baseDamage, attackToUse, enemy);

          damage = Math.floor(damage * damageMultiplier);
          damage = applyTideCallBonus(damage);
          damage = applyPlayerWeakness(damage);
          damage = applyFireLizardRepeatReduction(enemy, move.id, damage);
          damage = Math.floor(damage * channelingMultiplier);

          applyBloodVileLifesteal(damage, isCritical);

          damageMap[enemy.id] = damage;
          totalDmg += damage;
          nextLastMoveIds[enemy.id] = move.id;

          if (isCritical) {
            addLog(`💥 CRITICAL! ${enemy.name} takes ${damage} damage!`);
          } else {
            addLog(`⚔️ ${enemy.name} takes ${damage} damage!`);
          }
        });

        maybeTriggerSharpRazor(isCritical);
        consumeTideCall();
        if (move.id === 'wave_crash') {
          resetDearbornStrike();
        }

        setLastMoveIdByEnemy(nextLastMoveIds);
        lastMoveIdByEnemyRef.current = nextLastMoveIds;

        // Apply stun chance if the move has one
        const stunnedIds: string[] = [];
        if (move.stunChance) {
          aliveEnemies.forEach(enemy => {
            const stunRoll = Math.random() * 100;
            if (stunRoll < move.stunChance!) {
              stunnedIds.push(enemy.id);
              addLog(`💫 ${enemy.name} is STUNNED!`);
            }
          });
        }

        // Apply burn chance if the move has one (e.g. Fireball AOE)
        const burnedIds: string[] = [];
        if (move.burnChance && move.burnDuration) {
          aliveEnemies.forEach(enemy => {
            const burnRoll = Math.random() * 100;
            if (burnRoll < move.burnChance!) {
              burnedIds.push(enemy.id);
              addLog(`🔥 ${enemy.name} is BURNING! (${move.burnDuration} turns)`);
            }
          });
        }

        // Apply weakness if the move has weakness turns (e.g. Bad Temper)
        const weakenedIds: string[] = [];
        if (move.weaknessTurns && move.weaknessTurns > 0) {
          aliveEnemies.forEach(enemy => {
            weakenedIds.push(enemy.id);
            addLog(`⚡ ${enemy.name} is WEAKENED! (${move.weaknessTurns} turns)`);
          });
        }

        // Track total damage dealt
        setTotalDamageDealt(prev => prev + totalDmg);

        // Calculate the updated enemies state
        const updatedEnemies = enemies.map(e => {
          if (damageMap[e.id]) {
            let newHealth = Math.max(0, e.currentHealth - damageMap[e.id]);

            // Ring of Power: Execute below 10% + bonus
            const ringThreshold = 0.10 + ringThresholdBonusRef.current;
            if (hasEquipment('ring_of_power') && newHealth > 0 && newHealth <= e.maxHealth * ringThreshold) {
              newHealth = 0;
              setRingThresholdBonus(prev => prev + 0.005);
              addLog(`💍 Ring of Power executes ${e.name}! (Threshold: ${(ringThreshold * 100).toFixed(1)}%)`);
            }
            return { ...e, currentHealth: newHealth };
          }
          return e;
        });

        if (move.id === 'pathfinder') {
          const killedByMove = enemies.filter(e => e.currentHealth > 0)
            .filter(e => updatedEnemies.find(updated => updated.id === e.id && updated.currentHealth === 0));
          if (killedByMove.length > 0) {
            const shieldGain = killedByMove.length * 5;
            setPlayerShield(prev => prev + shieldGain);
            addLog(`🧭 Pathfinder grants +${shieldGain} Shield for ${killedByMove.length} kill${killedByMove.length > 1 ? 's' : ''}!`);
          }
        }

        // Apply all damage at once
        setEnemies(prev => {
          const updated = prev.map(e => {
            let newHealth = damageMap[e.id] ? Math.max(0, e.currentHealth - damageMap[e.id]) : e.currentHealth;

            // Ring of Power: Execute below 10% + bonus
            const ringThreshold = 0.10 + ringThresholdBonusRef.current;
            if (hasEquipment('ring_of_power') && newHealth > 0 && newHealth <= e.maxHealth * ringThreshold) {
              newHealth = 0;
            }
            const newStun = stunnedIds.includes(e.id) && newHealth > 0 ? 1 : e.stunTurns;
            const newBurn = burnedIds.includes(e.id) && newHealth > 0 ? (move.burnDuration || 0) : e.burnTurns;
            const newWeakness = weakenedIds.includes(e.id) && newHealth > 0 ? (move.weaknessTurns || 0) : e.weaknessTurns;
            return { ...e, currentHealth: newHealth, stunTurns: newStun, burnTurns: newBurn, weaknessTurns: newWeakness };
          });

          // Boss Charge Count Increment (for AOE hits on boss)
          const bossHit = aliveEnemies.find(e => e.type === 'BOSS' && e.name !== 'Robin Hood' && damageMap[e.id] && damageMap[e.id] > 0);
          if (bossHit) {
            setBossChargeCount(prev => {
              const boss = bossHit;
              const threshold = getBossRageThreshold(boss?.name || '');
              const newCount = prev + 1;
              if (newCount >= threshold) {
                handleBossRageTrigger(boss);
                return 0; // Reset the counter
              }
              return newCount;
            });
          }

          // Boss Desperation Trait (AOE path)
          const boss = updated.find(e => e.type === 'BOSS' && e.name !== 'Robin Hood');
          if (boss && !bossDespTriggered && boss.currentHealth > 0) {
            const hpPercent = boss.currentHealth / boss.maxHealth;
            if (hpPercent <= 0.2) {
              setBossDespTriggered(true);
              setPlayerResource(0);
              addLog(`💀 ${boss.name} enters DESPERATION! A dark wave drains all your ${resourceType}!`);
              // Goblin King's desperation applies weakness
              if (boss.name === 'Goblin King') {
                setPlayerWeaknessTurns(2);
                addLog('🌀 You are weakened for 2 turns!');
              }
            }
          }

          // Check for victory
          setTimeout(() => {
            const defeated = updated.filter(e => e.currentHealth === 0);
            const newlyAcquiredArtifacts: string[] = [];
            defeated.forEach(enemy => {
              handleEnemyDefeated(enemy, updated, newlyAcquiredArtifacts);
            });

            const aliveAfter = updated.filter(e => e.currentHealth > 0);
            if (aliveAfter.length === 0) {
              addLog(`🏆 All enemies defeated! Victory!`);
              setTimeout(() => {
                if (currentLevel % 3 === 0) {
                  setShowInterlude(true);
                } else {
                  setShowRewardScreen(true);
                }
              }, 1000);
            }
          }, 500);

          return updated;
        });

        const anyKilled = updatedEnemies.some(e => e.currentHealth === 0);
        const allDead = updatedEnemies.every(e => e.currentHealth === 0);

        // Clyde Duality Meter Charge (AOE attacks charge meter)
        if (hero.id === 'clyde' && (move.id === 'swipe' || move.id === 'bad_temper')) {
          const enemiesHit = aliveEnemies.length;
          setDualityMeter(prev => {
            const next = prev + enemiesHit;
            if (next >= 4) {
              addLog(`🌕 Clyde's meter is FULL! Transform with "Like Turtle Without Its Shell"!`);
              return 4;
            }
            return next;
          });
        }

        if (!allDead) {
          consumePlayerWeaknessTurn();
          decrementCooldowns();
          setIsPlayerTurn(false);
          enemyTurn(updatedEnemies, false, false);
        }
        return;
      }





      // --- JJ Smith Roll & Slip: Same mechanic as Feyland's but different ID ---
      if (move.id === 'jj_roll_and_slip') {
        // Resource already deducted by the outer attack block
        const rsTarget = enemies.filter(e => e.currentHealth > 0).find(e => e.id === effectiveTargetId) || enemies.filter(e => e.currentHealth > 0)[0];
        if (rsTarget) {
          const rsDamage = calculateDamage(20, playerAttack, rsTarget);
          const rsNewHealth = Math.max(0, rsTarget.currentHealth - rsDamage);
          const rsUpdatedEnemies = enemies.map(e => e.id === rsTarget.id ? { ...e, currentHealth: rsNewHealth } : e);
          setEnemies(rsUpdatedEnemies);
          setTotalDamageDealt(prev => prev + (rsTarget.currentHealth - rsNewHealth));
          addLog(`🥊 Roll & Slip! JJ deals ${rsDamage} damage and braces. Next enemy attack grants +20% dodge! (-${move.cost} ${resourceType})`);
          if (rsNewHealth === 0) {
            setTimeout(() => handleEnemyDefeated(rsTarget, rsUpdatedEnemies, []), 300);
          }
        } else {
          addLog(`🥊 Roll & Slip! JJ braces for a counter. Next enemy attack grants +20% dodge! (-${move.cost} ${resourceType})`);
        }
        rollAndSlipDodgeActiveRef.current = true;
        setRollAndSlipDodgeActive(true);
        setLastPlayerMoveId(move.id);
        return;
      }

      // --- JJ Smith Rapid Punches ---
      if (move.id === 'rapid_punches') {
        const rpTarget = enemies.filter(e => e.currentHealth > 0).find(e => e.id === effectiveTargetId) || enemies.filter(e => e.currentHealth > 0)[0];
        if (!rpTarget) {
          addLog(`❌ No valid target for Rapid Punches!`);
          return;
        }

        // Calculate total effective crit rate
        let critThreshold = 20;
        if (hasEquipment('ancient_rune_stone')) critThreshold -= 2;
        if (hasEquipment('sharp_razor')) critThreshold -= 4;
        if (hasEquipment('blood_vile')) critThreshold -= 1;
        const equipCritReduction = Math.floor(equipCritBonus / 5) || 0;
        critThreshold -= equipCritReduction;
        critThreshold = Math.max(2, critThreshold);

        const gearCritRate = (21 - critThreshold) * 5;
        const victoryRushBonus = jjVictoryRushActive ? jjVictoryRushStacks * 10 : 0;
        const totalCritRate = gearCritRate + victoryRushBonus;

        if (jjVictoryRushActive) {
          setJjVictoryRushActive(false);
          setJjCritStreak(0);
          setJjVictoryRushStacks(0);
          addLog(`💥 Victory Rush EXPENDED for Rapid Punches! (${totalCritRate}% Crit Rate used)`);
        }

        addLog(`👊 Rapid Punches! JJ winds up for ${jjPunches} punches on ${rpTarget.name}! (-${move.cost} ${resourceType})`);

        const baseHitDamage = 8;
        const punchCount = jjPunches;
        const PUNCH_DELAY = 120;

        const punchResults: { dmg: number; wouldCrit: boolean }[] = [];
        let simHealth = rpTarget.currentHealth;
        let totalRpDamage = 0;
        let pseudoCritCount = 0;

        for (let i = 0; i < punchCount; i++) {
          if (simHealth <= 0) break;
          const wouldCrit = Math.random() * 100 < totalCritRate;
          if (wouldCrit) pseudoCritCount++;
          const dmg = calculateDamage(baseHitDamage, playerAttack, rpTarget);
          totalRpDamage += dmg;
          simHealth = Math.max(0, simHealth - dmg);
          punchResults.push({ dmg, wouldCrit });
        }

        if (pseudoCritCount > 0) {
          const punchCap = currentStage === 1 ? 20 : (currentStage === 2 ? 30 : (currentStage === 3 ? 40 : 50));
          setJjPunches(prev => {
            const next = prev + pseudoCritCount;
            if (next > punchCap) {
              addLog(`✴️ ${pseudoCritCount} would-be crit(s)! Punch counter increased to ${punchCap} (Stage ${currentStage} cap)!`);
              return punchCap;
            }
            return next;
          });
        }

        let cumulativeDmg = 0;
        punchResults.forEach(({ dmg, wouldCrit }, i) => {
          setTimeout(() => {
            cumulativeDmg += dmg;
            setEnemies(prev => prev.map(e => {
              if (e.id !== rpTarget.id) return e;
              const newHealth = Math.max(0, e.currentHealth - dmg);
              return { ...e, currentHealth: newHealth };
            }));
            setTotalDamageDealt(prev => prev + dmg);

            if (wouldCrit) {
              addLog(`✴️ Punch ${i + 1}: ${dmg} dmg — Would-be crit! (+1 Punch)`);
            } else {
              addLog(`🥊 Punch ${i + 1}: ${dmg} dmg`);
            }

            if (i === punchResults.length - 1) {
              const finalHealth = Math.max(0, rpTarget.currentHealth - cumulativeDmg);
              addLog(`✅ Rapid Punches done! ${punchCount} punches, ${totalRpDamage} total damage.`);

              if (finalHealth === 0) {
                combatLockedRef.current = true;
                setEnemies(prev => {
                  const snapshot = prev.map(e => e.id === rpTarget.id ? { ...e, currentHealth: 0 } : e);
                  const aliveCount = snapshot.filter(e => e.currentHealth > 0).length;
                  setTimeout(() => {
                    handleEnemyDefeated(rpTarget, snapshot, []);
                    if (aliveCount > 0) {
                      combatLockedRef.current = false;
                      setIsPlayerTurn(true);
                    }
                  }, 300);
                  return snapshot;
                });
              } else {
                consumePlayerWeaknessTurn();
                setLastPlayerMoveId(move.id);
                decrementCooldowns();
                setIsPlayerTurn(true);
              }
            }
          }, PUNCH_DELAY * (i + 1));
        });
        return;
      }

      // --- Cecil Lysander: Rear Cross ---
      if (move.id === 'cecil_rear_cross') {
        const cecilTarget = enemies.find(e => e.id === effectiveTargetId) || enemies.find(e => e.currentHealth > 0);
        if (cecilTarget) {
          setCecilMeterTargetId(cecilTarget.id);
          setCecilMeterValue(0);
          cecilMeterDirection.current = 1;
          setShowCecilMeter(true);
          setCecilMeterMoving(true);
          addLog(`🥊 Cecil winds up for a REAR CROSS! Space or click to stop the meter!`);
        }
        return;
      }

      // --- Cecil Lysander: Right Hook ---
      if (move.id === 'right_hook' && hero.id === 'cecil_lysander') {
        const target = enemies.find(e => e.id === effectiveTargetId) || enemies.find(e => e.currentHealth > 0);
        if (target) {
          const dmg = calculateDamage(20, attackToUse, target);
          applyPlayerAttackToEnemy(target, dmg, move);
          addLog(`🥊 Right Hook! Dealt ${dmg} damage to ${target.name}.`);
        }
        setLastPlayerMoveId(move.id);
        return;
      }

      // --- Roll & Slip: handle before general attack so baseDamage=0 doesn't do min damage ---
      if (move.id === 'roll_and_slip') {
        if (!resourceRefunded) setPlayerResource(prev => Math.max(0, prev - move.cost));
        const rsTarget = enemies.filter(e => e.currentHealth > 0).find(e => e.id === effectiveTargetId) || enemies.filter(e => e.currentHealth > 0)[0];
        if (rsTarget) {
          const rsDamage = Math.floor(20 * (1 + playerAttack * 0.02));
          const rsNewHealth = Math.max(0, rsTarget.currentHealth - rsDamage);
          const rsUpdatedEnemies = enemies.map(e => e.id === rsTarget.id ? { ...e, currentHealth: rsNewHealth } : e);
          setEnemies(rsUpdatedEnemies);
          setTotalDamageDealt(prev => prev + (rsTarget.currentHealth - rsNewHealth));
          addLog(`\ud83e\udd4a Roll & Slip! Dealt ${rsDamage} damage and braced for a counter. Next enemy attack grants +20% dodge chance! (-${move.cost} ${resourceType})`);
          if (rsNewHealth === 0) {
            setTimeout(() => handleEnemyDefeated(rsTarget, rsUpdatedEnemies, []), 300);
          }
        } else {
          addLog(`\ud83e\udd4a Roll & Slip! Braced for a counter. Next enemy attack grants +20% dodge chance! (-${move.cost} ${resourceType})`);
        }
        rollAndSlipDodgeActiveRef.current = true;
        setRollAndSlipDodgeActive(true);
        setLastPlayerMoveId(move.id);
        return; // Prevent general attack handler from running, but keep player's turn active
      }

      // Target is already validated above, we can safely use it
      const target = enemies.find(e => e.id === effectiveTargetId)!;

      const critRoll = rollD20(true);
      const isNaturalCrit = critRoll === 20;
      if (isNaturalCrit) {
        addLog('[DEBUG] Player natural crit detected in main attack flow');
      }

      // Check for guaranteed critical hit conditions
      const darkPactCrit = hero.uniqueAbility?.id === 'dark_pact' && playerResource >= 100;
      // JJ Smith Victory Rush: each stack adds +10% crit chance (bonus roll in addition to d20)
      const jjVictoryRushCrit = hero.id === 'jj_smith' && jjVictoryRushActive && Math.random() * 100 < jjVictoryRushStacks * 10;
      const isCritical = isNaturalCrit || jjVictoryRushCrit || guaranteedGunslingerCrit || darkPactCrit || consumeGuaranteedCrit();

      let damageMultiplier = 1;

      if (hero.classId === 'brawler' && brawlerFreeMove) {
        damageMultiplier = 1.2; // +20% damage on combo hit
      }

      if (isCritical) {
        addLog('[DEBUG] Calling maybeApplyBeerBoost from main attack flow');
        maybeApplyBeerBoost();
      }

      if (darkPactCrit) {
        addLog(`💀 Dark Pact activated! Guaranteed critical hit at 100 mana!`);
      }

      // Unholy Headpiece: Attack moves cost 8% max HP but deal +30% damage
      if (hasEquipment('unholy_headpiece')) {
        const hpCost = Math.floor(maxPlayerHealth * 0.08);
        setPlayerHealth(prev => Math.max(1, prev - hpCost));
        damageMultiplier *= 1.3;
        addLog(`👹 Unholy Headpiece sacrifices ${hpCost} HP for power!`);
      }

      // Trigger Slash Effect for Cedric's Slashes
      if (move.id === 'slashes') {
        setSlashedEnemyIds(new Set([effectiveTargetId!]));
        setTimeout(() => setSlashedEnemyIds(new Set()), 800);
      }



      let damage: number;
      if (isCritical) {
        damage = calculateCritDamage(move.baseDamage || 0, attackToUse, target);
      } else {
        damage = calculateDamage(move.baseDamage || 0, attackToUse, target);
      }

      if (isCritical && hasEquipment('ancient_rune_stone')) {
        setPlayerShield(prev => prev + 5);
        addLog(`🪨 Ancient Rune Stone glows! Gained 5 Shield from the crit!`);
      }

      damage = Math.floor(damage * damageMultiplier);

      damage = applyTideCallBonus(damage);
      damage = applyPlayerWeakness(damage);
      damage = applyFireLizardRepeatReduction(target, move.id, damage);
      damage = Math.floor(damage * channelingMultiplier);
      consumeTideCall();

      setLastMoveIdByEnemy(prev => ({ ...prev, [target.id]: move.id }));
      lastMoveIdByEnemyRef.current = { ...lastMoveIdByEnemyRef.current, [target.id]: move.id };

      applyBloodVileLifesteal(damage, isCritical);
      applyFairyBellLifesteal(damage);
      maybeTriggerSharpRazor(isCritical);

      // JJ Smith Victory Rush: Track crits and update stacks after isCritical is determined
      if (hero.id === 'jj_smith' && isCritical && move.id !== 'rapid_punches') {
        const newStreak = jjCritStreak + 1;
        setJjCritStreak(newStreak);
        if (newStreak >= 2) {
          if (!jjVictoryRushActive) {
            setJjVictoryRushActive(true);
            setJjVictoryRushStacks(1);
            addLog(`⚡ VICTORY RUSH ACTIVATED! JJ gains +10% Crit Rate!`);
          } else {
            const newStacks = jjVictoryRushStacks + 1;
            setJjVictoryRushStacks(newStacks);
            addLog(`⚡ Victory Rush grows! +${newStacks * 10}% Crit Rate total!`);
          }
        }
      } else if (hero.id === 'jj_smith' && !isCritical && move.id !== 'rapid_punches') {
        if (jjCritStreak > 0 || jjVictoryRushActive) {
          setJjCritStreak(0);
          if (jjVictoryRushActive) {
            setJjVictoryRushActive(false);
            setJjVictoryRushStacks(0);
            addLog(`💨 Victory Rush ENDED - missed a crit!`);
          }
        }
      }

      // Special handling for Quick Strike (Speed scaling)
      if (move.scalesWithSpeed) {
        const speedScaling = effectiveSpeed * 0.1;
        damage += speedScaling;
        damage = Math.floor(damage);
        addLog(`⚡ Quick Strike scales with speed! +${speedScaling.toFixed(1)} bonus damage!`);
      }

      // Special handling for Lethal Execution (HP scaling)
      if (move.id === 'lethal_execution') {
        const hpScaling = Math.floor(target.currentHealth * 0.2);
        damage += hpScaling;
        damage = Math.floor(damage);
        addLog(`🗡️ Lethal Execution scales with HP! +${hpScaling} bonus damage!`);
      }

      // Special handling for Holy Wrath (healing)
      if (move.id === 'holy_wrath') {
        const healAmount = 15;
        setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmount));
        addLog(`✨ Holy Wrath heals you for ${healAmount} HP!`);
      }

      // Lunge Jab: 5% chance to inflict bleed
      if (move.id === 'lunge_jab' && Math.random() < 0.05) {
        setPlayerBleedTurns(prev => prev); // Bleed on enemy, not player
        // We need to apply bleed to the target enemy
        setEnemies(prev => prev.map(e => e.id === target.id ? { ...e, poisonTurns: (e.poisonTurns || 0) + 2 } : e));
        addLog(`🩸 Lunge Jab causes ${target.name} to BLEED! (2 turns)`);
      }

      // Passive: Battle Rage (Thora) - 50% more damage if below 50% HP
      if (hero.uniqueAbility?.id === 'battle_rage') {
        const hpPercent = (playerHealth / maxPlayerHealth) * 100;
        if (hpPercent < 50) {
          damage *= 1.5;
          damage = Math.floor(damage);
          addLog(`🔥 Battle Rage: 50% damage boost!`);
        }
      }



      if (isCritical) {
        // Passive: Backstab (Vex) - +30% damage on critical hits
        if (hero.uniqueAbility?.id === 'backstab') {
          const backstabDamage = damage * 0.30;
          damage += backstabDamage;
          damage = Math.floor(damage);
          addLog(`🗡️ Backstab adds ${Math.floor(backstabDamage)} bonus critical damage!`);
        }

        // Passive: Dark Pact (Zephyr) - Critical hits restore 8 mana
        // Dark Pact no longer restores mana on crit
      }



      // Track damage dealt
      setTotalDamageDealt(prev => prev + damage);

      // --- BEGIN REFACTORED ENEMY UPDATE ---
      updatedEnemies = enemies.map(e => {
        if (e.id === target.id) {
          let currentEnemyShield = e.shield || 0;
          let newShield = currentEnemyShield;
          let damageRemaining = damage;
          let newHealth = e.currentHealth;

          // 1. Calculate Damage & Shield
          if (currentEnemyShield > 0) {
            const absorbed = Math.min(currentEnemyShield, damageRemaining);
            newShield = currentEnemyShield - absorbed;
            damageRemaining -= absorbed;
            if (absorbed > 0) {
              addLog(`🛡️ Your attack hit ${e.name}'s shield for ${absorbed} damage!`);
            }
          }

          if (damageRemaining > 0) {
            newHealth = Math.max(0, e.currentHealth - damageRemaining);
          }

          // 2. Ring of Power Execution (below 10% HP)
          const ringThreshold = 0.10 + ringThresholdBonusRef.current;
          if (hasEquipment('ring_of_power') && newHealth > 0 && newHealth <= e.maxHealth * ringThreshold) {
            newHealth = 0;
            setRingThresholdBonus(prev => prev + 0.005);
            addLog(`💍 Ring of Power executes ${e.name}! (Threshold: ${(ringThreshold * 100).toFixed(1)}%)`);
          }

          // 3. Apply Status Effects
          let stunTurns = e.stunTurns;
          let poisonTurns = e.poisonTurns;
          let burnTurns = e.burnTurns;
          let slowedTurns = e.slowedTurns;
          let standoffTurns = e.standoffTurns;

          // Poison Strike
          if (move.appliesPoison && move.poisonDuration) {
            poisonTurns = move.poisonDuration;
            addLog(`🧪 ${target.name} is poisoned! Will take 5% max HP damage for ${move.poisonDuration} turns!`);
          }

          // Stuns (Quick Draw, etc.)
          if (move.stunChance && Math.random() * 100 < move.stunChance) {
            stunTurns = 1;
            addLog(`💫 ${target.name} is STUNNED!`);
          }

          // Fireball (Burn)
          if (move.burnChance && move.burnDuration && Math.random() * 100 < move.burnChance) {
            burnTurns = move.burnDuration;
            addLog(`🔥 ${target.name} is BURNING! (${move.burnDuration} turns)`);
          }

          if (move.id === 'standoff') {
            const extraSkip = Math.random() < 0.20;
            standoffTurns = extraSkip ? 2 : 1;
            addLog(`🤠 ${target.name} hesitates and will skip ${standoffTurns} turn${standoffTurns > 1 ? 's' : ''}!`);
          }

          return {
            ...e,
            currentHealth: newHealth,
            shield: newShield,
            stunTurns,
            poisonTurns,
            burnTurns,
            slowedTurns,
            standoffTurns
          };
        }
        return e;
      });

      // Update enemy health in state
      setEnemies(updatedEnemies);

      // Boss Charge Count Increment (for hits on boss)
      const bossAfterHit = updatedEnemies.find(e => e.id === target.id);
      if (target.type === 'BOSS' && target.name !== 'Robin Hood' && damage > 0 && bossAfterHit?.currentHealth && bossAfterHit.currentHealth > 0) {
        setBossChargeCount(prev => {
          const boss = target;
          const threshold = getBossRageThreshold(boss?.name || '');
          const newCount = prev + 1;
          if (newCount >= threshold) {
            handleBossRageTrigger(boss);
            return 0; // Reset the counter
          }
          return newCount;
        });
      }

      // Check for Boss Desperation and Defeat logic
      const boss = updatedEnemies.find(e => e.type === 'BOSS' && e.name !== 'Robin Hood');
      if (boss && !bossDespTriggered && boss.currentHealth > 0) {
        const hpPercent = boss.currentHealth / boss.maxHealth;
        if (hpPercent <= 0.2) {
          setBossDespTriggered(true);
          setPlayerResource(0);
          addLog(`💀 ${boss.name} enters DESPERATION! A dark wave drains all your ${resourceType}!`);
          // Goblin King's desperation applies weakness
          if (boss.name === 'Goblin King') {
            setPlayerWeaknessTurns(2);
            addLog('🌀 You are weakened for 2 turns!');
          }
        }
      }

      // Check for defeated enemies and victory
      let aldricKilledEnemy = false;
      setTimeout(() => {
        const justDefeated = updatedEnemies.filter(e => e.currentHealth === 0);
        const originallyAlive = enemies.filter(e => e.currentHealth > 0 && e.id === target.id);

        if (originallyAlive.length > 0 && updatedEnemies.find(e => e.id === target.id)?.currentHealth === 0) {
          handleEnemyDefeated(target, updatedEnemies);

          // Aldric's Passive: Killing a non-minion enemy ends the turn immediately
          if (hero.id === 'aldric' && target.type !== 'MINION') {
            const aliveEnemies = updatedEnemies.filter(e => e.currentHealth > 0);
            if (aliveEnemies.length > 0) {
              aldricKilledEnemy = true;
            }
          }
        }

        const aliveEnemies = updatedEnemies.filter(e => e.currentHealth > 0);
        if (aliveEnemies.length === 0) {
          return; // Victory handled by handleEnemyDefeated
        } else if (!aliveEnemies.find(e => e.id === selectedTargetId)) {
          setSelectedTargetId(aliveEnemies[0].id);
        }

        consumePlayerWeaknessTurn();
        // For Aldric killing an enemy, end the turn without enemy response
        if (aldricKilledEnemy) {
          decrementCooldowns();
          setIsPlayerTurn(true);
          // Skip enemy response, immediately return control to the player
        } else if (hero.classId === 'brawler') {
          setIsPlayerTurn(true);
        } else {
          // For non-Aldric or if Aldric didn't kill anyone, proceed with normal flow
          decrementCooldowns();
          setIsPlayerTurn(false);
          enemyTurn(updatedEnemies, false, false);
        }
      }, 100);
      // --- END REFACTORED ENEMY UPDATE ---

      if (isCritical) {
        addLog(`💥 CRITICAL HIT! You used ${move.name} on ${target.name} for ${damage} damage! (-${move.cost} ${resourceType})`);
      } else {
        addLog(`⚔️ You used ${move.name} on ${target.name} for ${damage} damage! (-${move.cost} ${resourceType})`);
      }
    } else if (move.id === 'strengthen') {
      if (buffMoveUsageCount >= 3) {
        addLog(`❌ You can only use 3 buff moves per level! (${buffMoveUsageCount}/3)`);
        setIsPlayerTurn(true);
        return;
      }
      if (!resourceRefunded) setPlayerResource(prev => Math.max(0, prev - move.cost));
      setPermanentUpgrades(prev => {
        const cap = getStatCap();
        const currentAtk = playerAttack + prev.attackBonus;
        const currentDef = playerDefense + prev.defenseBonus;

        let newAtkBonus = prev.attackBonus;
        if (currentAtk < cap && hero.id !== 'clyde') {
          const inc = Math.min(8, cap - currentAtk);
          newAtkBonus += inc;
        }

        let newDefBonus = prev.defenseBonus;
        const effectiveDefCap = cap + (vineTrapTurns > 0 ? 50 : 0);

        if (currentDef < effectiveDefCap) {
          const inc = Math.min(8, effectiveDefCap - currentDef);
          newDefBonus += inc;
        }

        if (newAtkBonus === prev.attackBonus && newDefBonus === prev.defenseBonus) {
          addLog(`⚔️ Stats are already at the cap (${cap})!`);
          return prev;
        }

        return {
          ...prev,
          attackBonus: newAtkBonus,
          defenseBonus: newDefBonus
        };
      });
      if (hero.id === 'clyde') {
        addLog(`⚔️ Strengthen! Permanently gained +8 DEF! (-${move.cost} ${resourceType})`);
      } else {
        addLog(`⚔️ Strengthen! Permanently gained +8 ATK and +8 DEF! (-${move.cost} ${resourceType})`);
      }
      setBuffMoveUsageCount((prev) => prev + 1);
    } else if (move.id === 'holy_healing') {
      if (!resourceRefunded) setPlayerResource(prev => Math.max(0, prev - move.cost));
      const baseHeal = Math.floor(maxPlayerHealth * 0.5);
      const healAmt = calculateHeal(baseHeal);
      setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmt));
      addLog(`💚 Holy Healing! Restored ${healAmt} HP! (-${move.cost} ${resourceType})`);
    } else if (move.id === 'channeling') {
      if (!resourceRefunded) setPlayerResource(prev => Math.max(0, prev - move.cost));
      setChannelingGuardActive(true);
      setChannelingAttackBuffActive(true);
      addLog('🧘 Channeling! Incoming damage halved for the next enemy turn.');
      addLog('✨ Your next attack will deal 100% more damage.');
    } else if (move.id === 'tide_call') {
      if (!resourceRefunded) setPlayerResource(prev => Math.max(0, prev - move.cost));
      const baseHeal = Math.floor(maxPlayerHealth * 0.2);
      const healAmt = calculateHeal(baseHeal);
      setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmt));
      setTideCallActive(true);
      addLog(`🌊 Tide Call! Next attack deals +50% damage and you heal ${healAmt} HP! (-${move.cost} ${resourceType})`);
    } else if (move.id === 'guard' && hero.classId === 'brawler') {
      if (!resourceRefunded) setPlayerResource(prev => Math.max(0, prev - move.cost));
      const shieldAmount = Math.floor(maxPlayerHealth * 0.15);
      setPlayerShield(prev => prev + shieldAmount);
      setPlayerTemporaryShieldTurns(1);
      playerTemporaryShieldAmountRef.current = shieldAmount;
      addLog(`🛡️ Guard! Gained ${shieldAmount} Shield for 1 turn. (-${move.cost} ${resourceType})`);
    } else if (move.id === 'quick_guard') {
      const qgShield = Math.floor(maxPlayerHealth * 0.1);
      setPlayerShield(prev => prev + qgShield);
      setPlayerTemporaryShieldTurns(1);
      playerTemporaryShieldAmountRef.current = qgShield;
      addLog(`🛡️ Quick Guard! Gained ${qgShield} Shield for 1 turn. (-${move.cost} ${resourceType})`);
      if (hero.classId === 'brawler') setIsPlayerTurn(true);
      else endPlayerTurn(move);
    } else if (move.id === 'band_aid') {
      const healAmt = Math.floor(maxPlayerHealth * 0.25);
      setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmt));
      addLog(`🩹 Band-aid! Healed for ${healAmt} HP (25% Max HP). (-${move.cost} ${resourceType})`);
      if (hero.classId === 'brawler') setIsPlayerTurn(true);
      else endPlayerTurn(move);
    } else if (move.id === 'roll_and_slip') {
      if (!resourceRefunded) setPlayerResource(prev => Math.max(0, prev - move.cost));
      // Instant 20 damage
      const rsTarget = enemies.filter(e => e.currentHealth > 0).find(e => e.id === selectedTargetId) || enemies.filter(e => e.currentHealth > 0)[0];
      if (rsTarget) {
        const rsDamage = Math.floor(20 * (1 + playerAttack * 0.02));
        const rsNewHealth = Math.max(0, rsTarget.currentHealth - rsDamage);
        setEnemies(prev => prev.map(e => e.id === rsTarget.id ? { ...e, currentHealth: rsNewHealth } : e));
        setTotalDamageDealt(prev => prev + (rsTarget.currentHealth - rsNewHealth));
        addLog(`🥊 Roll & Slip! Dealt ${rsDamage} damage and braced for a counter. Next enemy attack has +20% dodge chance — retaliate with 70 dmg on success! (-${move.cost} ${resourceType})`);
        if (rsNewHealth === 0) {
          setTimeout(() => handleEnemyDefeated(rsTarget, enemies, []), 300);
        }
      } else {
        addLog(`🥊 Roll & Slip! Braced for a counter. Next enemy attack has +20% dodge chance (+70 dmg retaliate)! (-${move.cost} ${resourceType})`);
      }
      rollAndSlipDodgeActiveRef.current = true;
      setRollAndSlipDodgeActive(true);
    } else if (move.type === 'buff' && move.defenseBoost !== undefined) {
      if (buffMoveUsageCount >= 3) {
        addLog(`❌ You can only use 3 buff moves per level! (${buffMoveUsageCount}/3)`);
        setIsPlayerTurn(true);
        return;
      }
      if (!resourceRefunded) setPlayerResource(prev => Math.max(0, prev - move.cost));

      const defenseIncrease = move.defenseBoost;
      setPlayerDefense((prev) => {
        const currentTotal = prev + permanentUpgrades.defenseBonus;
        if (currentTotal >= defenseCap) {
          addLog(`🛡️ Defense is already at the cap (${defenseCap})!`);
          return prev;
        }

        const effectiveIncrease = Math.min(defenseCap - currentTotal, defenseIncrease);
        if (effectiveIncrease < defenseIncrease) {
          addLog(`🛡️ Defense increased by ${effectiveIncrease} (Capped)!`);
        } else {
          addLog(`🛡️ You used ${move.name}! Defense increased by ${defenseIncrease}! (-${move.cost} ${resourceType})`);
        }
        return prev + effectiveIncrease;
      });
      setBuffMoveUsageCount((prev) => prev + 1);
      // Remove original log as it's handled inside the setter for accuracy
    } else if (move.id === 'health_tonic') {
      if (!resourceRefunded) setPlayerResource(prev => Math.max(0, prev - move.cost));
      const healAmt = calculateHeal(36);
      setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmt));
      addLog(`💚 You used ${move.name}! Healed for ${healAmt} HP!`);
    }

    // For all attack moves (single-target), the turn ending is handled in the setTimeout above to prevent double calls
    // For buff/utility moves, end the turn normally here
    if (move.type !== 'attack' || move.id === 'health_tonic') {
      // Stealth Kick Extra Turn Logic
      if (move.id === 'stealth_kick' && Math.random() * 100 < 25) {
        addLog(`👟 Stealth Kick! GO AGAIN!`);
        setIsPlayerTurn(true);
        return;
      }

      if (hero.classId === 'brawler') {
        setIsPlayerTurn(true);
      } else {
        consumePlayerWeaknessTurn();
        decrementCooldowns();
        setIsPlayerTurn(false);
        enemyTurn(updatedEnemies, false, false);
      }
    }
  };

  // Expose a global function to allow MoveSelection to end the player's turn
  if (typeof window !== 'undefined') {
    (window as any).endPlayerTurn = () => {
      setShowMoveSelection(false);
      // End-of-turn logic for skipping turn
      consumePlayerWeaknessTurn();
      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn();
    };
  }

  const handleFight = () => {
    if (!isPlayerTurn) return;
    setShowMoveSelection(true);
  };

  const handleUseItem = () => {
    if (!isPlayerTurn) return;
    setShowItemSelection(true);
  };

  const handleItemSelect = (item: Item) => {
    setShowItemSelection(false);

    // Check if player has the item
    if (!inventory[item.id] || inventory[item.id] <= 0) {
      addLog(`❌ You don't have any ${item.name}!`);
      return;
    }

    // Consume the item
    setInventory(prev => ({
      ...prev,
      [item.id]: prev[item.id] - 1,
    }));

    const isBossLevel = (currentStage === 1 && currentLevel === 10) || (currentStage === 2 && currentLevel === 12);

    if (item.id === 'sugarcane') {
      let healAmt = 80;
      healAmt = calculateHeal(healAmt);
      const actualHeal = Math.min(healAmt, maxPlayerHealth - playerHealth);
      setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmt));
      addLog(`🍬 Used Sugarcane! Restored ${actualHeal} HP!`);
    } else if (item.id === 'rum') {
      setPlayerShield(prev => prev + 50);
      const targetId = selectedTargetId || enemies.find(e => e.currentHealth > 0)?.id;
      if (targetId) {
        setEnemies(prev => prev.map(e =>
          e.id === targetId ? { ...e, stunTurns: Math.max(1, e.stunTurns) } : e
        ));
        const targetName = enemies.find(e => e.id === targetId)?.name || 'enemy';
        addLog(`🥃 Used Rum! Gained 50 Shield and stunned ${targetName}!`);
      } else {
        addLog(`🥃 Used Rum! Gained 50 Shield.`);
      }
    } else if (item.id === 'rope') {
      if (isBossLevel) {
        setInventory(prev => ({
          ...prev,
          [item.id]: (prev[item.id] || 0) + 1,
        }));
        addLog(`🪢 Rope can't be used in boss fights!`);
        return;
      }
      const roll = Math.random() * 100;
      if (roll < 40) {
        addLog(`🪢 Rope succeeds! You skip the level!`);
        setEnemies(prev => prev.map(e => ({ ...e, currentHealth: 0 })));
        setIsPlayerTurn(false);
        setTimeout(() => {
          if (currentLevel % 3 === 0) {
            setShowInterlude(true);
          } else {
            setShowRewardScreen(true);
          }
        }, 300);
        return;
      }
      addLog(`🪢 Rope failed to escape!`);
    } else if (item.id === 'pirates_ship') {
      setPlayerShield(prev => prev + 300);
      setPirateShipActive(true);
      setPirateShipSpeedBonus(40);
      addLog(`🏴‍☠️ Pirate's Ship! +300 Shield and +40 Speed while shield holds.`);
    }

    // Apply item effects
    const isSmuggledGoods = item.id === 'sugarcane' || item.id === 'rum' || item.id === 'rope' || item.id === 'pirates_ship';
    if (!isSmuggledGoods) {
      if (item.type === 'healing' && item.healAmount !== undefined) {
        let actualHealAmt = item.healAmount;
        if (item.id === 'apple') actualHealAmt = 16;
        if (item.id === 'bread') actualHealAmt = 24;
        if (item.id === 'health_potion') actualHealAmt = 42;

        actualHealAmt = calculateHeal(actualHealAmt);

        const actualHeal = Math.min(actualHealAmt, maxPlayerHealth - playerHealth);
        setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + actualHealAmt));
        addLog(`💚 Used ${item.name}! Restored ${actualHeal} HP!`);
      } else if (item.type === 'restore' && item.resourceRestore !== undefined) {
        if (hero.classId === 'gunslinger') {
          const bulletsRestore = Math.floor(item.resourceRestore / 10);

          if (bulletsRestore > 0) {
            const actualRestore = Math.min(bulletsRestore, maxPlayerResource - playerResource);
            setPlayerResource(prev => Math.min(maxPlayerResource, prev + bulletsRestore));
            addLog(`✨ Used ${item.name}! Restored ${actualRestore} Bullets!`);
          } else {
            addLog(`❌ This item doesn't restore enough energy for a bullet!`);
          }
        } else {
          const actualRestore = Math.min(item.resourceRestore, maxPlayerResource - playerResource);
          setPlayerResource(prev => Math.min(maxPlayerResource, prev + item.resourceRestore!));
          addLog(`✨ Used ${item.name}! Restored ${actualRestore} ${resourceType}!`);
        }
      } else if (item.type === 'buff') {
        if (item.attackBoost !== undefined) {
          if (hero.id === 'clyde') {
            addLog(`❌ Clyde cannot gain attack! His defense converts to attack in Ghoul form.`);
            // Return item to inventory since we're not using it
            setInventory(prev => ({
              ...prev,
              [item.id]: prev[item.id] + 1,
            }));
            return;
          }
          setPlayerAttack(prev => {
            const totalAtk = prev + permanentUpgrades.attackBonus;
            if (totalAtk >= attackCap) return prev;
            return Math.min(attackCap - permanentUpgrades.attackBonus, prev + item.attackBoost!);
          });
          addLog(`⚔️ Used ${item.name}! Attack increased!`);
        }
        if (item.defenseBoost !== undefined) {
          setPlayerDefense(prev => {
            const totalDef = prev + permanentUpgrades.defenseBonus;
            if (totalDef >= defenseCap) return prev;
            return Math.min(defenseCap - permanentUpgrades.defenseBonus, prev + item.defenseBoost!);
          });
          addLog(`🛡️ Used ${item.name}! Defense increased!`);
        }
      } else if (item.type === 'debuff' && item.weaknessDebuff) {
        const aliveEnemies = enemies.filter(e => e.currentHealth > 0);
        if (aliveEnemies.length === 0) {
          addLog(`❌ No enemies alive!`);
          return;
        }
        setEnemies(prev => prev.map(e =>
          e.currentHealth > 0 ? { ...e, weaknessTurns: 3 } : e
        ));
        addLog(`💀 Used ${item.name}! ALL enemies weakened — damage reduced by 20% for 3 turns!`);
      }
    }

    // Using an item now ends your turn
    addLog(`💡 Item used! Your turn ends.`);

    // Decrement cooldowns after player's turn
    consumePlayerWeaknessTurn();
    decrementCooldowns();

    setIsPlayerTurn(false);
    enemyTurn(enemies, false, false);
  };

  const applyRewardLoot = (loot: LootItem) => {
    if (loot.id === 'boss_bonus_gold') {
      setGold(prev => prev + 100);
      setTotalGoldEarned(prev => prev + 100);
      addLog(`💰 Boss Chest contained 100 bonus gold!`);
      return;
    }

    const legendaryArtifacts = [
      'golden_apple',
      'golden_crown',
      'finished_rubix_cube',
      'disco_ball',
      'lucky_charm',
      'wooden_mask',
      'slime_boots',
      'pirates_chest',
    ];

    if (legendaryArtifacts.includes(loot.id)) {
      grantArtifact(loot.id, 'Chest');
      return;
    }

    setInventory(prev => ({
      ...prev,
      [loot.id]: (prev[loot.id] || 0) + 1,
    }));
    addLog(`📦 Received ${loot.name} from the chest!`);
  };

  const handleSelectGold = (amount: number) => {
    setGold(prev => prev + amount);
    setTotalGoldEarned(prev => prev + amount);
    addLog(`💰 Received ${amount} gold! Total: ${gold + amount}`);
    proceedToNextLevel();
  };

  const handleSelectChest = (loot: LootItem) => {
    applyRewardLoot(loot);

    proceedToNextLevel();
  };

  const handleSelectBossChest = () => {
    const bossBonusLoot: LootItem = {
      id: 'boss_bonus_gold',
      name: '+100 Bonus Gold',
      description: 'Extra gold from the boss chest!',
      rarity: 'rare',
    };
    applyRewardLoot(bossBonusLoot);

    proceedToNextLevel();
  };

  const handleSelectBossLoots = (primaryLoot: LootItem, bonusLoot?: LootItem) => {
    applyRewardLoot(primaryLoot);
    if (bonusLoot) {
      applyRewardLoot(bonusLoot);
    }
    proceedToNextLevel();
  };

  const proceedToNextLevel = () => {
    // Award diamonds for beating the level, scaled by difficulty
    const diffCfg = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.normal;
    const baseReward = 5 + (2 * currentLevel);
    const diamondReward = Math.floor(baseReward * diffCfg.goldMod);

    if (onDiamondsEarned) {
      onDiamondsEarned(diamondReward);
    }
    addLog(`💎 Earned ${diamondReward} Diamonds! (${diffCfg.label} x${diffCfg.goldMod})`);

    setIsTransitioning(true);
    setTimeout(() => {
      setShowRewardScreen(false);
      if (currentStage === 1 && currentLevel === 10) {
        addLog('🏆 Stage 1 Complete! Entering the Shadow Realm...');
        setTimeout(() => {
          setCurrentStage(2);
          setCurrentLevel(1);
          setGiftFromGodsUsedThisStage(false);
          setPermanentUpgrades(prev => {
            const newBonus = prev.healthBonus + 25;
            // Full heal on stage transition... Does Elf King reduce this?
            // "Healing reduced by 50%".
            // Typically Stage Transitions are full restores that override mechanics, but the user said "EVERY other possible forms of healing".
            // However, Elf King is a specific enemy in Stage 4.
            // If I am transitioning FROM Stage 1 to 2, Elf King is NOT present.
            // So logic holds: calculateHeal checks for Elf King. If he's not there, it returns full amount.
            // But wait, if I am in Stage 4 (Elf King stage) and I somehow get a level up heal?
            // Code below is for Stage 1->2 transition. Elf King not there.
            // But let's check the Level Up logic (not stage transition).
            setPlayerHealth(hero.stats.health + equipHealthBonus + newBonus); // Full Heal with new max
            return { ...prev, healthBonus: newBonus };
          });
          setPlayerResource(maxPlayerResource); // Full Resource
          addLog('❤️ Fully Healed & Restored for the next stage! (+25 Max HP)');
          loadLevel(1, 2); // Force load Stage 2 Level 1
          setShowRewardScreen(false);
          setShowShop(true); // Open Shop
          setIsPostStageTransitionShop(true);
          setIsTransitioning(false);
        }, 1500);
      } else if (currentStage === 2 && currentLevel === 12) {
        addLog('🏆 Stage 2 Complete! Entering the Molten Frontier...');
        setTimeout(() => {
          setCurrentStage(3);
          setCurrentLevel(1);
          setGiftFromGodsUsedThisStage(false);
          const bonusHealth = 50;
          setPermanentUpgrades(prev => {
            const newBonus = prev.healthBonus + bonusHealth;
            setPlayerHealth(hero.stats.health + equipHealthBonus + newBonus);
            return { ...prev, healthBonus: newBonus };
          });
          setPlayerResource(maxPlayerResource);
          addLog('❤️ Stage 3 blessing: +50 Max HP and fully restored resources!');
          setShowRewardScreen(false);
          if (stage3EquipmentOptions.length === 0 || runEquippedItems.length >= 3) {
            addLog('🧰 No extra equipment available for Stage 3.');
            proceedToStage3AfterEquip();
          } else {
            setShowStage3EquipmentPick(true);
            setIsTransitioning(false);
          }
        }, 1500);
      } else if (currentStage === 3 && currentLevel === 16) {
        if (stageTransitionAppliedRef.current) {
          setIsTransitioning(false);
          return;
        }
        stageTransitionAppliedRef.current = true;
        addLog('🏆 Stage 3 Complete! Entering the Fairy Forest...');
        setTimeout(() => {
          setCurrentStage(4);
          setCurrentLevel(1);
          setGiftFromGodsUsedThisStage(false);
          const bonusHealth = 200;
          setPermanentUpgrades(prev => {
            const newBonus = prev.healthBonus + bonusHealth;
            setPlayerHealth(hero.stats.health + equipHealthBonus + newBonus);
            return { ...prev, healthBonus: newBonus };
          });
          setPlayerResource(maxPlayerResource);
          addLog('❤️ Stage 4 blessing: +200 Max HP and fully restored resources!');
          loadLevel(1, 4);
          setShowRewardScreen(false);
          setShowShop(true);
          setIsPostStageTransitionShop(true);
          setIsTransitioning(false);
          stageTransitionAppliedRef.current = false;
        }, 1500);
      } else {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        if (hero.classId === 'brawler') {
          setPlayerResource(maxPlayerResource);
        }
        loadLevel(nextLevel);
        setIsTransitioning(false);
      }
    }, 1500);
  };

  const handleShopPurchase = (itemId: string, price: number, isPermanent: boolean) => {
    if (gold < price) return;

    if (itemId === 'artifact_legendary' || itemId === 'artifact_rare') {
      setGold(prev => prev - price);
      handleCatSpend(price);
      const legendaryPool = ['golden_apple', 'golden_crown', 'finished_rubix_cube', 'disco_ball'];
      const rarePool = ['lucky_charm', 'wooden_mask', 'slime_boots', 'pirates_chest'];
      const pool = itemId === 'artifact_legendary' ? legendaryPool : rarePool;
      const randomArtifact = pool[Math.floor(Math.random() * pool.length)];
      grantArtifact(randomArtifact, 'Illegal Shop');
      return;
    }

    if (isPermanent) {
      if (itemId === 'attack_upgrade') {
        if (hero.id === 'clyde') {
          addLog(`❌ Clyde cannot gain attack! His defense converts to attack in Ghoul form.`);
          return;
        }
        const baseAttack = playerAttack + permanentUpgrades.attackBonus;
        if (baseAttack >= attackCap) {
          addLog(`❌ Your attack is already at the maximum for this hero (${attackCap})!`);
          return;
        }
        setGold(prev => prev - price);
        handleCatSpend(price);
        setPermanentUpgrades(prev => ({ ...prev, attackBonus: prev.attackBonus + 8 }));
        addLog(`⚔️ Attack permanently increased by 8!`);
      } else if (itemId === 'defense_upgrade') {
        const baseDefense = playerDefense + permanentUpgrades.defenseBonus;
        if (baseDefense >= defenseCap) {
          addLog(`❌ Your defense is already at the maximum for this hero (${defenseCap})!`);
          return;
        }
        setGold(prev => prev - price);
        handleCatSpend(price);
        setPermanentUpgrades(prev => ({ ...prev, defenseBonus: prev.defenseBonus + 8 }));
        addLog(`🛡️ Defense permanently increased by 8!`);
      }
    } else {
      setGold(prev => prev - price);
      handleCatSpend(price);
      setInventory(prev => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));
      addLog(`📦 Purchased ${itemId}!`);
    }
  };

  const handleCloseShop = () => {
    setShowShop(false);
    if (isPostStageTransitionShop) {
      setIsPostStageTransitionShop(false);
      setIsTransitioning(false);
      return;
    }
    setIsTransitioning(true);
    proceedToNextLevel();
  };

  const handleRest = () => {
    const baseHeal = Math.floor(maxPlayerHealth * 0.5);
    const healAmount = calculateHeal(baseHeal);
    setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmount));
    addLog(`💚 Rested and recovered ${healAmount} HP!`);
    setShowRest(false);
    setIsTransitioning(true);
    proceedToNextLevel();
  };

  const handleSelectShop = () => {
    setShowInterlude(false);
    setShowShop(true);
  };

  // --- Wolfgang Handlers ---
  const handleRhythmComplete = (score: number, total: number, perfectCount: number) => {
    setShowRhythmGame(false);

    // Check if this was a skip (score === 25)
    if (score === 25) {
      addLog(`⏭️ Skipped Symphony! Got 25 notes and +10 Shield!`);
      setPlayerShield(prev => prev + 10);
      setWolfgangNoteMeter(prev => Math.min(100, prev + 25));
    } else {
      addLog(`🎼 Symphony Complete! Score: ${score}/${total} (Perfects: ${perfectCount})`);
    }

    // Delay to ensure UI updates properly before ending turn
    setTimeout(() => {
      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn(enemies, false, false);
    }, 300);
  };

  const handleNoteHit = (rating: string) => {
    if (rating === 'Perfect' || rating === 'Perfect!!') {
      setPlayerShield(prev => prev + 1); // Nerfed from 2 to 1
    }
    setWolfgangNoteMeter(prev => Math.min(100, prev + 1));
  };

  // Reset Gift from the Gods when stage changes
  useEffect(() => {
    setGiftFromGodsUsedThisStage(false);
  }, [currentStage]);

  // --- Core Game Logic ---

  const handleLevelComplete = () => {
    setShowInterlude(false);
    setShowRest(true);
  };

  const handleSelectRest = () => {
    setShowInterlude(false);
    setShowRest(true);
  };

  const handleBlock = () => {
    if (!isPlayerTurn || blockCooldownTurns > 0) return;

    setIsBlocking(true);
    addLog('🛡️ You prepare to block the next attack!');

    // Decrement cooldowns after player's turn
    decrementCooldowns();

    setIsPlayerTurn(false);
    setBlockCooldownTurns(2);
    enemyTurn(enemies, true, false);
  };

  const handleEnemyDefeated = (defeatedEnemy: Enemy, currentEnemies: RuntimeEnemy[], freshlyOwnedArtifacts: string[] = []) => {
    const isMinion = defeatedEnemy.type === 'MINION';

    // Thief: Return stolen gold and artifact if defeated -> REMOVED per user request
    // if (defeatedEnemy.name === 'Thief' && thiefStolenState.gold > 0) {
    //   setGold(prev => prev + thiefStolenState.gold);
    //   addLog(`💰 You recovered ${thiefStolenState.gold} Gold from the Thief!`);
    //   if (thiefStolenState.artifactId) {
    //     setArtifacts(prev => ({
    //       ...prev,
    //       [thiefStolenState.artifactId!]: (prev[thiefStolenState.artifactId!] || 0) + 1
    //     }));
    //     const artName = thiefStolenState.artifactId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    //     addLog(`💎 You recovered the ${artName}!`);
    //   }
    //   setThiefStolenState({ gold: 0, artifactId: null }); // Reset stolen state
    // }

    // Giant Spear: 50% chance to drop 10 gold
    if (defeatedEnemy.name === 'Giant Spear' || defeatedEnemy.name === 'Elite Spear') {
      if (Math.random() < 0.5) {
        setGold(prev => prev + 10);
        addLog(`💰 Found 10 Gold on the ${defeatedEnemy.name}!`);
      }
    }


    if (currentStage === 3 && currentLevel === 4 && !motherGolemSpawned && defeatedEnemy.name === 'Lava Pebble') {
      const motherGolem = {
        id: 'mother_golem',
        name: 'Mother Golem',
        type: 'ENEMY' as const,
        maxHealth: 300,
        attack: 50,
        defense: 140,
        baseDamage: 40,
        currentHealth: 300,
        shield: 0,
        weaknessTurns: 0,
        poisonTurns: 0,
        slowedTurns: 0,
        stunTurns: 0,
        burnTurns: 0,
        iceStormTurns: 0,
        standoffTurns: 0,
        speed: 15,
      };

      const spawnedPebbles = Array.from({ length: 4 }, (_, i) => ({
        id: `mother_pebble_${i + 1}`,
        name: 'Lava Pebble',
        type: 'MINION' as const,
        maxHealth: 30,
        attack: 10,
        defense: 60,
        baseDamage: 12,
        currentHealth: 30,
        shield: 0,
        weaknessTurns: 0,
        poisonTurns: 0,
        slowedTurns: 0,
        stunTurns: 0,
        burnTurns: 0,
        iceStormTurns: 0,
        standoffTurns: 0,
        speed: 15,
      }));

      currentEnemies.length = 0;
      currentEnemies.push(motherGolem, ...spawnedPebbles);
      setEnemies(currentEnemies as any);
      setSelectedTargetId(motherGolem.id);
      setMotherGolemSpawned(true);
      addLog('🪨 The Mother Golem emerges, calling her pebbles to her side!');
      return;
    }

    if (currentStage === 3 && !lavaDragonSpawned && defeatedEnemy.name === 'Lava Dragon') {
      const spawnedPebbles = Array.from({ length: 12 }, (_, i) => ({
        id: `dragon_pebble_${i + 1}`,
        name: 'Lava Pebble',
        type: 'MINION' as const,
        maxHealth: 30,
        attack: 10,
        defense: 60,
        baseDamage: 12,
        currentHealth: 30,
        shield: 0,
        weaknessTurns: 0,
        poisonTurns: 0,
        slowedTurns: 0,
        stunTurns: 0,
        burnTurns: 0,
        iceStormTurns: 0,
        standoffTurns: 0,
        speed: 15,
      }));

      // Mutate the array in-place so the caller (which holds a reference to currentEnemies) sees the changes check for victory
      // remove the dragon
      const index = currentEnemies.findIndex(e => e.id === defeatedEnemy.id);
      if (index !== -1) {
        currentEnemies.splice(index, 1);
      }
      // Add pebbles
      currentEnemies.push(...spawnedPebbles);

      // Update state
      setEnemies([...currentEnemies]);
      setSelectedTargetId(spawnedPebbles[0]?.id || null);
      setLavaDragonSpawned(true);
      addLog('🐉 The Lava Dragon collapses, releasing a swarm of blazing pebbles!');
      return;
    }

    if (!isMinion) {
      const goldDrop = Math.floor(Math.random() * 5) + 6;
      setGold(prev => prev + goldDrop);
      setTotalGoldEarned(prev => prev + goldDrop);
      addLog(`🎉 ${defeatedEnemy.name} defeated! +${goldDrop} gold`);
    }

    if (!isMinion) {
      const jackpotRoll = Math.random() * 100;
      if (jackpotRoll < 5) {
        setGold(prev => prev + 50);
        setTotalGoldEarned(prev => prev + 50);
        addLog(`💰 JACKPOT! +50 bonus gold!`);
      }
    }

    // Passive: Fairy Bell - +10 HP heal on kill
    if (!isMinion && hasEquipment('fairy_bell')) {
      const healAmount = calculateHeal(10);
      if (healAmount > 0) {
        setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + healAmount));
        addLog(`🔔 Fairy Bell chimes! Healed ${healAmount} HP for the kill!`);
      }
    }

    // Passive: Blue tinted glasses - +8 resource on kill
    if (!isMinion && hasEquipment('blue_tinted_glasses')) {
      setPlayerResource(prev => {
        const newResource = Math.min(maxPlayerResource, prev + 8);
        if (newResource !== prev) {
          addLog(`👓 Blue Tinted Glasses grant +8 ${resourceType} for the kill!`);
        }
        return newResource;
      });
    }

    // Passive: Iron Will (Aldric) - +5 Max HP per enemy defeated
    if (!isMinion && hero.uniqueAbility?.id === 'iron_will') {
      setPermanentUpgrades(prev => ({ ...prev, healthBonus: prev.healthBonus + 5 }));
      addLog(`🛡️ Iron Will grants +5 Max HP!`);
    }

    // Passive: Soul Keeper (Clyde) - 10% chance to grab soul on kill
    if (!isMinion && hero.uniqueAbility?.id === 'soul_keeper' && clydeSouls < 2) {
      const soulRoll = Math.random() * 100;
      if (soulRoll < 10) {
        setClydeSouls(prev => Math.min(2, prev + 1));
        addLog(`👻 Soul Keeper! Grabbed ${defeatedEnemy.name}'s soul! (${Math.min(2, clydeSouls + 1)}/2)`);
      }
    }

    // Passive: Soul Meter (Lucian) - +5 Soul per enemy kill
    if (!isMinion && hero.id === 'lucian') {
      const soulGain = 5;
      setLucianSoulMeter(prev => Math.min(5000, prev + soulGain));
      addLog(`👻 Soul Meter: +${soulGain} Soul! (${Math.min(5000, lucianSoulMeter + soulGain)}/5000)`);
    }

    // Artifact Drop Roll (1% Legendary, 5% Rare)
    if (!isMinion) {
      const artifactRoll = Math.random() * 100;
      // Total artifacts: 1% Legendary + 5% Rare = 6% total per kill
      if (artifactRoll < 1) {
        const artifactOptions = ['golden_apple', 'golden_crown', 'finished_rubix_cube', 'disco_ball'];
        const availableArtifacts = artifactOptions;
        if (availableArtifacts.length > 0) {
          const randomArtifact = availableArtifacts[Math.floor(Math.random() * availableArtifacts.length)];
          freshlyOwnedArtifacts.push(randomArtifact);
          grantArtifact(randomArtifact, 'LEGENDARY DROP');
        }
      } else if (artifactRoll < 6) {
        const rareArtifacts = ['lucky_charm', 'wooden_mask', 'slime_boots', 'pirates_chest'];
        const availableRare = rareArtifacts;
        if (availableRare.length > 0) {
          const randomRare = availableRare[Math.floor(Math.random() * availableRare.length)];
          freshlyOwnedArtifacts.push(randomRare);
          grantArtifact(randomRare, 'RARE DROP');
        }
      }
    }

    // --- Centralized Victory Check ---
    const allEnemiesDead = currentEnemies.every(e => e.currentHealth === 0);
    if (allEnemiesDead && !showRewardScreen && !showInterlude && !showLoseScreen) {
      addLog(`🏆 All enemies defeated! Victory!`);
      combatLockedRef.current = true; // Block inputs during victory transition
      setIsPlayerTurn(false); // Disable fight buttons immediately
      decrementCooldowns();

      setTimeout(() => {
        if (currentLevel % 3 === 0) {
          setShowInterlude(true);
        } else {
          setShowRewardScreen(true);
        }
      }, 1000);
    }
  };

  const handleTrain = () => {
    if (!isPlayerTurn) return;

    if (hasLavaGolem()) {
      addLog(`🌋 Lava Golem's heat prevents training!`);
      return;
    }

    if (hasJester()) {
      if (trainUsageCount >= 3) {
        addLog('💪 You have already trained the maximum 3 times this level!');
        return;
      }

      const attackIncrease = 5 + Math.floor(playerAttack * 0.05);
      const updatedEnemies = enemies.map(e =>
        e.name === 'Jester'
          ? { ...e, attack: e.attack + attackIncrease }
          : e
      );

      setEnemies(updatedEnemies);
      setTrainUsageCount(prev => prev + 1);
      addLog(getJesterTaunt());
      decrementCooldowns();
      setIsPlayerTurn(false);
      enemyTurn(updatedEnemies, false, true);
      return;
    }

    // Clyde cannot get attack bonuses from training
    if (hero.id === 'clyde') {
      addLog(`💀 Soul Keeper prevents attack training! Clyde cannot rely on mundane training.`);
      return;
    }

    if (trainUsageCount >= 3) {
      addLog('💪 You have already trained the maximum 3 times this level!');
      return;
    }

    const baseAtk = playerAttack + permanentUpgrades.attackBonus;
    const attackIncrease = 5 + Math.floor(playerAttack * 0.05);

    if (baseAtk >= attackCap) {
      addLog('💪 Your physical power is already at the limit for this stage!');
      return;
    }

    setPlayerAttack(prev => {
      const totalAtk = prev + permanentUpgrades.attackBonus;
      if (totalAtk >= attackCap) return prev;
      return Math.min(attackCap - permanentUpgrades.attackBonus, prev + attackIncrease);
    });
    setIsTraining(true);
    setTakeExtraDamageNextTurn(true);
    setTrainUsageCount(prev => prev + 1);
    addLog(`💪 You focus on training! Attack increased by ${attackIncrease}! (⚠️ You'll take 60% more damage next turn) [${trainUsageCount + 1}/3]`);

    // Decrement cooldowns after player's turn
    decrementCooldowns();

    setIsPlayerTurn(false);
    enemyTurn(enemies, false, true);
  };



  const handlePurchaseMove = (moveId: string, replaceIndex: number) => {
    const movePrice = getSpecialMovePrice(moveId);
    if (gold < movePrice) return;

    // Get the special move
    const specialMoveKey = `${hero.classId}_${moveId}`;
    const specialMove = SPECIAL_MOVES[specialMoveKey];
    if (!specialMove) return;

    // Deduct gold
    setGold(prev => prev - movePrice);
    handleCatSpend(movePrice);

    // Replace the move
    setCharacterMoves(prev => {
      const newMoves = [...prev];
      newMoves[replaceIndex] = specialMove;
      return newMoves;
    });

    // Track owned special moves
    setOwnedSpecialMoves(prev => (prev.includes(moveId) ? prev : [...prev, moveId]));

    addLog(`📚 Learned ${specialMove.name}!`);
  };

  const handleTryAgain = () => {
    // Reset all game state to start fresh with the same hero
    setCurrentStage(1);
    setCurrentLevel(1);
    setGiftFromGodsUsedThisStage(false);
    setPlayerHealth(hero.stats.health + equipHealthBonus);
    setPlayerAttack(hero.stats.attack + equipAttackBonus);
    setPlayerDefense(hero.stats.defense + equipDefenseBonus);
    setPlayerResource(100);
    setSelectedTargetId(null);
    setShowMoveSelection(false);
    setShowItemSelection(false);
    setShowRewardScreen(false);
    setShowInterlude(false);
    setShowShop(false);
    setShowRest(false);
    setShowStage3EquipmentPick(false);
    setSelectedStage3EquipmentId(null);
    setInventory({});
    setGold(startingGold);
    setArtifacts({});
    setArtifactBonusStats({ attack: 0, defense: 0 });
    setPlayerShield(0);
    setPlayerBurnTurns(0);
    setPlayerWeaknessTurns(0);
    setPlayerSpeedDebuffTurns(0);
    setPermafrostIceActive(hero.id === 'meryn');
    setCombatLog([]);
    setIsPlayerTurn(true);
    setIsBlocking(false);
    setTakeExtraDamageNextTurn(false);
    setActiveCooldowns({});
    setPermanentUpgrades({ attackBonus: 0, defenseBonus: 0, healthBonus: 0 });
    setOwnedSpecialMoves([]);
    setRunEquippedItems(equippedItems);
    setTotalDamageDealt(0);
    setTotalDamageTaken(0);
    setTotalGoldEarned(0);
    setShowLoseScreen(false);
    setCharacterMoves(hero.moves);
    setMoveUsesThisTurn({});
    setBuffMoveUsageCount(0);
    setBossChargeCount(0);
    setBossDespTriggered(false);
    setBossAttackBonus(0);
    setDualityMeter(0);
    setDualityForm(hero.id === 'wolfgang' ? 'keyboard' : 'human');
    setWolfgangNoteMeter(0);
    setShadowMeter(0);
    setBulletsSpent(0);
    isSleepingRef.current = false;
    setIsSleeping(false);
    setShowRPS(false);
    setRpsPendingMove(null);
    setLordInfernoPowerMeter(0);
    setRingThresholdBonus(0);
    setBonusSpeed(0);
    setGuaranteedCrit(false);
    setDisabledMoveId(null);
    setEntrapmentTurns(0);
    setEntrapmentMoveId(null);
    setFireTornadoTurns(0);
    setChannelingGuardActive(false);
    setChannelingAttackBuffActive(false);
    entrapmentPendingClearRef.current = false;
    setCatCoinsSpent(0);
    setSlimeBootsUsedThisLevel(false);
    setTideCallActive(false);
    setDearbornStrikeUpgraded(false);
    setPirateShipActive(false);
    setPirateShipSpeedBonus(0);
    setPiratesChestLoot(null);
    setShowPiratesChestPopup(false);
    magmaSoldierSpawnIdRef.current = 0;
    magmaOverlordEntrapmentCdRef.current = 0;
    magmaOverlordFireTornadoCdRef.current = 0;

    // Load the first level
    loadLevel(1, 1);
  };

  const handleBurst = () => {
    if (!isPlayerTurn || isBurstAttacking) return;
    if (wolfgangNoteMeter <= 0) {
      addLog("❌ Not enough notes to burst!");
      return;
    }

    const damage = Math.floor(wolfgangNoteMeter * 1); // 1x stored notes
    setIsBurstAttacking(true);
    addLog(`🎵 SYMPHONY BURST! Charging power...`);

    // Meter Draining Animation (1.5s)
    const drainDuration = 1500;
    const steps = 60;
    const intervalTime = drainDuration / steps;
    const drainPerStep = wolfgangNoteMeter / steps;
    let currentMeter = wolfgangNoteMeter;

    const drainInterval = setInterval(() => {
      currentMeter -= drainPerStep;
      if (currentMeter <= 0) {
        clearInterval(drainInterval);
        setWolfgangNoteMeter(0);

        // Final Impact
        setIsBurstAttacking(false);
        applyBurstDamage(damage);
      } else {
        setWolfgangNoteMeter(currentMeter);
      }
    }, intervalTime);
  };

  const applyBurstDamage = (damage: number) => {
    // AOE Damage to all enemies
    const aliveEnemies = enemies.filter(e => e.currentHealth > 0);
    let totalDmg = 0;

    const isCrit = Math.random() < 0.05;
    const finalDamage = isCrit ? Math.floor(damage * 1.5) : damage;

    if (isCrit && hasEquipment('ancient_rune_stone')) {
      guaranteedDodgeRef.current = true;
      setGuaranteedDodge(true);
      addLog(`🪨 Ancient Rune Stone glows! Your next dodge is GUARANTEED!`);
    }

    const updatedEnemies = enemies.map(e => {
      if (e.currentHealth <= 0) return e;
      let newHealth = Math.max(0, e.currentHealth - finalDamage);
      totalDmg += (e.currentHealth - newHealth);
      return { ...e, currentHealth: newHealth };
    });

    setEnemies(updatedEnemies);
    setTotalDamageDealt(prev => prev + totalDmg);

    if (isCrit) {
      addLog(`✨ CRITICAL SYMPHONY! Unleashed ${finalDamage} damage to ALL enemies!`);
    } else {
      addLog(`💥 BOOM! Symphony Burst unleashed ${finalDamage} damage to ALL enemies!`);
    }

    // Check for kills after small delay for impact
    setTimeout(() => {
      const defeated = updatedEnemies.filter(e => e.currentHealth === 0);
      defeated.forEach(e => handleEnemyDefeated(e, updatedEnemies, []));

      if (updatedEnemies.every(e => e.currentHealth === 0)) {
        addLog(`🏆 All enemies defeated! Victory!`);
        setTimeout(() => {
          setShowRewardScreen(true);
        }, 1500);
      } else {
        decrementCooldowns();
        setIsPlayerTurn(false);
        enemyTurn(updatedEnemies, false, false);
      }
    }, 500);
  };

  const handleReturnToMenu = () => {
    onBackToMenu();
  };

  // Show interlude screen if active (levels 3, 6, 9)
  if (showInterlude) {
    return (
      <InterludeScreen
        currentLevel={currentLevel}
        onSelectShop={handleSelectShop}
        onSelectRest={handleSelectRest}
      />
    );
  }

  // Show rest screen if active
  if (showRest) {
    const healAmount = Math.floor(maxPlayerHealth * 0.5);
    return (
      <div className="size-full bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(2,6,23,1))]" />
        <div className="relative z-10 max-w-lg w-full text-center">
          <h2 className="text-5xl font-black bg-gradient-to-r from-blue-300 via-blue-100 to-blue-300 bg-clip-text text-transparent tracking-widest uppercase mb-6">
            Rest Area
          </h2>
          <p className="text-slate-300 text-lg mb-2">You settle down and recover your strength.</p>
          <p className="text-blue-400 text-2xl font-bold mb-8">💚 +{healAmount} HP</p>
          <button
            onClick={handleRest}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl border-2 border-blue-400 transition-all shadow-lg shadow-blue-900/50"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (showRhythmGame) {
    return (
      <RhythmGame
        type={currentRhythmType}
        onComplete={handleRhythmComplete}
        onNoteHit={handleNoteHit}
        onClose={() => setShowRhythmGame(false)}
      />
    );
  }

  // If the player was defeated, render the Lose screen
  if (showLoseScreen) {
    return (
      <LoseScreen
        damageDealt={totalDamageDealt}
        damageTaken={totalDamageTaken}
        goldAccumulated={totalGoldEarned}
        legendaryArtifacts={artifacts}
        onTryAgain={handleTryAgain}
        onReturnToMenu={handleReturnToMenu}
        combatLog={combatLog}
      />
    );
  }

  // Show reward screen if active
  if (showRewardScreen) {
    return (
      <RewardScreen
        currentStage={currentStage}
        currentLevel={currentLevel}
        onSelectGold={handleSelectGold}
        onSelectChest={handleSelectChest}
        onSelectBossChest={handleSelectBossChest}
        onSelectBossLoots={handleSelectBossLoots}
        ownedArtifacts={artifacts}
        combatLog={combatLog}
      />
    );
  }

  // Render Shop UI if open
  if (showShop) {
    return (
      <Shop
        gold={gold}
        characterClass={hero.classId}
        currentMoves={characterMoves}
        ownedSpecialMoves={ownedSpecialMoves}
        playerAttack={playerAttack}
        playerDefense={playerDefense}
        attackCap={attackCap}
        defenseCap={defenseCap}
        currentStage={currentStage}
        heroId={hero.id}
        onPurchase={handleShopPurchase}
        onPurchaseMove={handlePurchaseMove}
        onClose={handleCloseShop}
      />
    );
  }

  return (
    <div
      className={`size-full flex flex-col relative overflow-hidden transition-colors duration-1000 ${!activeBackgroundId ? (currentStage === 2 ? 'bg-neutral-950' : 'bg-slate-900') : ''}`}
      style={{
        transform: `translate(${shakeOffsetX}px, ${shakeOffsetY}px)`
      }}
    >
      {/* Gacha Style Background */}
      {/* Gacha Style Background */}
      {['anime-prism', 'japanese-mountainscape', 'fairy-forest', 'fairy-meeting', 'Graceful-sleep'].includes(activeStyleId || '') && (
        <>
          <img
            src={
              activeStyleId === 'japanese-mountainscape' ? mountainStyleArt :
                activeStyleId === 'fairy-forest' ? animeForestStyleArt :
                  activeStyleId === 'fairy-meeting' ? fairyMeetingArt :
                    activeStyleId === 'Graceful-sleep' ? gracefulSleepArt :
                      animeStyleArt
            }
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,114,182,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(96,165,250,0.12),transparent_65%)] pointer-events-none" />
        </>
      )}
      {showDevArtifacts && (
        <div className="absolute inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-slate-900/90 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black tracking-widest uppercase text-slate-100">Artifact Spawner</h3>
                <p className="text-[10px] text-slate-400 tracking-wider uppercase">Ctrl/Alt + A to toggle</p>
              </div>
              <button
                onClick={() => setShowDevArtifacts(false)}
                className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600/50 rounded-xl transition-all"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEV_ARTIFACTS.map(artifact => (
                <button
                  key={artifact.id}
                  onClick={() => grantArtifact(artifact.id, 'DEV CHEAT')}
                  className="px-4 py-3 text-left bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 rounded-2xl transition-all"
                >
                  <div className="text-sm font-bold text-slate-100">{artifact.name}</div>
                  <div className="text-[10px] text-slate-400">{artifact.id}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showPiratesChestPopup && piratesChestLoot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-yellow-400 uppercase tracking-widest">Pirates' Chest</p>
                  <h3 className="text-2xl font-black text-slate-100 mt-1">Loot Revealed</h3>
                </div>
                <button
                  onClick={() => setShowPiratesChestPopup(false)}
                  className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600/50 rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                <div className="text-lg font-bold text-yellow-300">{piratesChestLoot.name}</div>
                <p className="text-sm text-slate-300 mt-2">{piratesChestLoot.description}</p>
                <p className="text-xs text-slate-500 mt-3 uppercase tracking-widest">{piratesChestLoot.rarity}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transformation Overlay */}
      <AnimatePresence>
        {showTransformationEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: [0.5, 1.2, 1],
                opacity: 1
              }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative flex flex-col items-center"
            >
              {/* Massive Outer Glow */}
              <div className="absolute inset-0 bg-white/20 blur-[120px] rounded-full scale-150 animate-pulse" />

              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-[180px] leading-none drop-shadow-[0_0_60px_rgba(255,255,255,1)]"
                >
                  🐺
                </motion.div>

                <motion.h2
                  initial={{ letterSpacing: "1em", opacity: 0 }}
                  animate={{ letterSpacing: "0.1em", opacity: 1 }}
                  className="text-white font-black text-6xl italic uppercase tracking-tighter mt-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] text-center"
                >
                  Beast Unleashed
                </motion.h2>

                {/* Spectral Wisps */}
                <div className="absolute -inset-20 border-[20px] border-white/5 rounded-full animate-ping" />
                <div className="absolute -inset-40 border-[10px] border-white/5 rounded-full animate-pulse" />
              </div>
            </motion.div>

            {/* Screen Flash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-white"
            />
          </motion.div>
        )}

        {showSymphonyEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden bg-black/40 backdrop-blur-sm"
          >
            {/* Rainbow Energy Stream */}
            <motion.div
              initial={{ x: '-100%', skewX: -45 }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute h-[300px] w-[200%] bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 opacity-60 blur-3xl"
            />

            <motion.div
              initial={{ x: '100%', skewX: 45 }}
              animate={{ x: '-200%' }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              className="absolute h-[250px] w-[200%] bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 via-yellow-500 to-red-500 opacity-40 blur-2xl mt-40"
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Central Impact */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: [0, 1.5, 1], rotate: 0 }}
                transition={{ duration: 0.8, ease: "backOut" }}
                className="text-[140px] drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]"
              >
                🎼
              </motion.div>

              {/* Exploding Music Notes */}
              {[
                { emoji: '🎵', delay: 0.1, x: -150, y: -100, rot: -20 },
                { emoji: '🎶', delay: 0.2, x: 180, y: -50, rot: 25 },
                { emoji: '🎵', delay: 0.3, x: -100, y: 120, rot: 15 },
                { emoji: '🎶', delay: 0.4, x: 120, y: 150, rot: -10 },
                { emoji: '🎼', delay: 0.25, x: 0, y: -200, rot: 5 },
              ].map((note, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    x: note.x,
                    y: note.y,
                    opacity: 1,
                    rotate: note.rot
                  }}
                  transition={{
                    duration: 0.6,
                    delay: note.delay,
                    ease: "easeOut"
                  }}
                  className="absolute text-7xl drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                >
                  {note.emoji}
                </motion.div>
              ))}

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-8 text-white font-black text-7xl italic uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                Symphony
              </motion.h2>
            </div>

            {/* Prism Flash Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-white/40 to-purple-500/20"
            />
          </motion.div>
        )}

        {showOutrageUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"
          >
            {/* Whiteout effect */}
            {showWhiteout && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [1, 0.8, 0] }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-white"
              />
            )}

            {/* Ready Phase */}
            {outragePhase === 'ready' && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative flex flex-col items-center z-10"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="relative"
                >
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-black shadow-[0_0_60px_rgba(220,38,38,0.8)] border-4 border-red-500/60" />
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-red-400/50 shadow-[0_0_20px_rgba(220,38,38,0.6)]"
                  />
                </motion.div>
                <h2 className="text-white font-black text-5xl mt-8 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] tracking-wider">OUTRAGE READY</h2>
                <p className="text-red-300 font-bold text-xl mt-4 animate-pulse tracking-widest">PREPARE YOURSELF</p>
              </motion.div>
            )}

            {/* Countdown Phase */}
            {outragePhase === 'countdown' && (
              <motion.div
                className="relative flex flex-col items-center z-10"
              >
                <motion.div
                  key={outrageCountdown}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 1.5 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-[200px] font-black text-red-500 drop-shadow-[0_0_40px_rgba(220,38,38,0.8)]"
                >
                  {outrageCountdown}
                </motion.div>
              </motion.div>
            )}

            {/* Skip Button - Always visible */}
            {(outragePhase === 'ready' || outragePhase === 'countdown' || outragePhase === 'spam') && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => {
                  // Skip outrage - deal 65 damage with animation
                  setOutrageSkipped(true);
                  outrageSkippedRef.current = true;
                  outrageExecutedRef.current = true;
                  // Clear countdown interval if we're skipping early
                  if (outrageCountdownIntervalRef.current) {
                    clearInterval(outrageCountdownIntervalRef.current);
                    outrageCountdownIntervalRef.current = null;
                  }
                  if (outrageLabelRef.current.handleSpaceKey) {
                    window.removeEventListener('keydown', outrageLabelRef.current.handleSpaceKey);
                    outrageLabelRef.current.handleSpaceKey = null;
                  }
                  if (outrageLabelRef.current.handleMouseClick) {
                    window.removeEventListener('click', outrageLabelRef.current.handleMouseClick);
                    outrageLabelRef.current.handleMouseClick = null;
                  }

                  const baseDamage = 65;
                  const critRoll = rollD20(true);
                  const isCritical = critRoll === 20;
                  if (isCritical) {
                    addLog('[DEBUG] Calling maybeApplyBeerBoost from Outrage skip');
                    maybeApplyBeerBoost();
                    addLog(`⚡ CRITICAL OUTRAGE!`);
                  }

                  let damageMultiplier = 1;
                  if (hasEquipment('unholy_headpiece')) {
                    const hpCost = Math.floor(maxPlayerHealth * 0.08);
                    setPlayerHealth(prev => Math.max(1, prev - hpCost));
                    damageMultiplier = 1.3;
                    addLog(`👹 Unholy Headpiece sacrifices ${hpCost} HP for power!`);
                  }

                  const aliveEnemies = enemies.filter(e => e.currentHealth > 0);
                  let totalOutrageDamage = 0;
                  const outrageDamageEntries: string[] = [];
                  const outrageAttack = attackToUseRef.current;
                  const outrageAttackBoost = Math.floor(outrageAttack * 0.4);
                  const updatedEnemies = enemies.map(e => {
                    if (aliveEnemies.find(ae => ae.id === e.id)) {
                      let damage = isCritical
                        ? calculateCritDamage(baseDamage + outrageAttackBoost, outrageAttack, e.defense)
                        : calculateDamage(baseDamage + outrageAttackBoost, outrageAttack, e.defense);
                      damage = Math.floor(damage * damageMultiplier);
                      totalOutrageDamage += damage;
                      outrageDamageEntries.push(`${e.name} ${damage}`);
                      return { ...e, currentHealth: Math.max(0, e.currentHealth - damage) };
                    }
                    return e;
                  });

                  if (outrageDamageEntries.length > 0) {
                    addLog(`⏭️ Skipped OUTRAGE hits: ${outrageDamageEntries.join(', ')}`);
                  }

                  setEnemies(updatedEnemies);
                  setTotalDamageDealt(prev => prev + totalOutrageDamage);

                  // Skip: do NOT play the blast animation — finish immediately
                  // Clear the scheduled outrage timeout (we're executing now)
                  if (outrageBlastTimeoutRef.current) {
                    clearTimeout(outrageBlastTimeoutRef.current);
                    outrageBlastTimeoutRef.current = null;
                  }

                  // Clear any post-blast cleanup timeout (prevents delayed animation)
                  if (outragePostBlastTimeoutRef.current) {
                    clearTimeout(outragePostBlastTimeoutRef.current);
                    outragePostBlastTimeoutRef.current = null;
                  }

                  // Ensure input listeners are removed
                  if (outrageLabelRef.current.handleSpaceKey) {
                    window.removeEventListener('keydown', outrageLabelRef.current.handleSpaceKey);
                    outrageLabelRef.current.handleSpaceKey = null;
                  }
                  if (outrageLabelRef.current.handleMouseClick) {
                    window.removeEventListener('click', outrageLabelRef.current.handleMouseClick);
                    outrageLabelRef.current.handleMouseClick = null;
                  }

                  // Close UI and reset state immediately
                  // Reset phase and animation state to avoid playing blast visuals
                  setOutragePhase('ready');
                  setOutrageBlastSize(60);
                  setShowWhiteout(false);
                  setShowOutrageUI(false);
                  setOutrageSkipped(false);
                  outrageSkippedRef.current = false;
                  setDualityForm('normal');
                  setClydeGhoulTurnsLeft(0);
                  setCharacterMoves(CLYDE_NORMAL_MOVES);
                  addLog(`💀 Ghoul form ended! Clyde returned to normal form!`);

                  // Check for defeated enemies
                  const defeated = updatedEnemies.filter(e => e.currentHealth === 0);
                  defeated.forEach(e => {
                    handleEnemyDefeated(e, updatedEnemies, []);
                  });

                  const aliveAfter = updatedEnemies.filter(e => e.currentHealth > 0);
                  if (aliveAfter.length === 0) {
                    addLog(`🏆 All enemies defeated! Victory!`);
                    setTimeout(() => {
                      if (currentLevel % 3 === 0) {
                        setShowInterlude(true);
                      } else {
                        setShowRewardScreen(true);
                      }
                    }, 1000);
                  } else {
                    decrementCooldowns();
                    setIsPlayerTurn(false);
                    enemyTurn(updatedEnemies, false, false);
                  }
                }}
                className="absolute top-6 right-6 z-20 px-6 py-3 bg-red-600/80 hover:bg-red-500 border-2 border-red-400 text-white font-bold rounded-lg pointer-events-auto transition-all"
              >
                ⏭️ SKIP (65 DMG)
              </motion.button>
            )}

            {/* Spam Phase */}
            {outragePhase === 'spam' && (
              <motion.div
                className="relative flex flex-col items-center z-10 w-full h-full"
              >
                {/* Growing Blast */}
                <motion.div
                  animate={{ scale: outrageBlastSize / 60 }}
                  transition={{ duration: 0.1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-[60px] h-[60px]">
                    {/* Core */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-red-600 rounded-full blur-lg opacity-80" />
                    {/* Middle glow */}
                    <div className="absolute inset-2 bg-gradient-to-br from-orange-300 to-red-500 rounded-full blur-md opacity-70" />
                    {/* Inner bright core */}
                    <div className="absolute inset-4 bg-white rounded-full blur-sm opacity-90" />
                  </div>
                </motion.div>

                {/* Space press counter and instructions */}
                <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="relative z-20 flex flex-col items-center pointer-events-none"
                >
                  <p className="text-white font-black text-4xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] mb-8 tracking-wider">UNLEASH YOUR FURY</p>
                  <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl px-6 py-4 border-2 border-red-400 shadow-[0_0_30px_rgba(220,38,38,0.7)]">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 0.2, repeat: Infinity }}
                      className="text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                    >
                      {outrageSpaceCount}
                    </motion.div>
                  </div>
                  <p className="text-red-200 font-bold text-lg mt-4 tracking-widest">ATTACKS CHARGED</p>
                </motion.div>
              </motion.div>
            )}

            {/* Blast Release Phase */}
            {outragePhase === 'blast' && (
              <>
                {/* Expanding Energy Wave */}
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-[300px] h-[300px]">
                    {/* Core explosion */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-red-600 rounded-full blur-2xl opacity-80" />
                    <div className="absolute inset-8 bg-gradient-to-br from-orange-300 to-red-500 rounded-full blur-xl opacity-70" />
                    <div className="absolute inset-16 bg-white rounded-full blur-lg opacity-90" />
                  </div>
                </motion.div>

                {/* Shockwave rings */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.12, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="border-3 border-red-400 rounded-full" style={{
                      width: `${150 + i * 60}px`,
                      height: `${150 + i * 60}px`,
                      boxShadow: `0 0 20px rgba(220, 38, 38, ${0.8 - i * 0.2})`
                    }} />
                  </motion.div>
                ))}

                {/* Success text */}
                <motion.div
                  initial={{ scale: 0, opacity: 1, rotateY: -90 }}
                  animate={{ scale: [0, 1.3, 1.1], rotateY: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-20 text-center drop-shadow-[0_0_40px_rgba(220,38,38,0.9)]"
                >
                  <h2 className="text-white font-black text-6xl tracking-widest">OUTRAGE</h2>
                  <p className="text-red-300 font-bold text-xl mt-2 tracking-widest">RELEASED</p>
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {isBurstAttacking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
          >
            {/* Horizontal Rainbow Energy Beam Blast - Constant Stream */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{
                x: '0%',
                opacity: [0, 0.9, 1, 0.9],
                scaleY: [0.8, 1.2, 1]
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-transparent blur-3xl opacity-70"
              style={{ height: '40%', top: '30%' }}
            />

            {/* Core White Beam - Pulsating */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: '100%',
                opacity: [0.8, 1, 0.8],
                height: ['80px', '110px', '80px']
              }}
              transition={{
                width: { duration: 0.4, ease: "easeOut" },
                opacity: { duration: 0.2, repeat: Infinity },
                height: { duration: 0.15, repeat: Infinity }
              }}
              className="absolute top-1/2 -translate-y-1/2 left-0 bg-white blur-xl z-20"
            />

            {/* Horizontal Flying Music Notes */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ left: -50, y: `${30 + Math.random() * 40}%`, opacity: 0 }}
                animate={{
                  left: '110%',
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 360],
                  scale: [0.5, 1.3, 0.8]
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.4,
                  delay: Math.random() * 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute text-5xl z-30"
              >
                {['🎵', '🎶', '🎼'][Math.floor(Math.random() * 3)]}
              </motion.div>
            ))}

            {/* Impact Flash & Shockwaves on the Right (Enemy Area) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 2.5],
                opacity: [0.3, 0],
                x: [0, 50]
              }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="absolute right-[10%] top-1/2 -translate-y-1/2 w-96 h-96 border-[16px] border-white/30 rounded-full blur-2xl z-40"
            />

            <motion.div
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="absolute right-0 top-0 bottom-0 w-[40%] bg-white/20 blur-[100px] z-10"
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Background Layers */}
      {/* If no custom background is passed (or if we want a specific overlay for combat), use a dark overlay to ensure text readability */}
      <div className={`absolute inset-0 ${activeBackgroundId ? 'bg-slate-950/30' : 'bg-slate-950'}`} />

      {/* Default Gradient only if NO custom background is active (fallback) */}
      {!activeBackgroundId && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(2,6,23,1))]" />
      )}

      {/* Nebula Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, 60, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[110px]"
      />
      <motion.div
        animate={{
          scale: [1.4, 1, 1.4],
          opacity: [0.03, 0.08, 0.03],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-600/10 rounded-full blur-[100px]"
      />

      {/* Particles */}
      <ParticleBackground stage={currentStage} />

      {/* Stage Decorations */}
      <StageBackground stage={currentStage} />

      <div className="relative z-10 flex-1 min-h-0 w-full flex flex-col">

        <AnimatePresence>
          {showRPS && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            >
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative bg-slate-900 border-2 border-amber-600/50 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
              >
                <Moon className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tighter mb-2">Rock Paper Scissors</h3>
                <p className="text-slate-400 text-sm mb-8 italic">Choose your destiny. The bot wins ties!</p>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'rock', name: 'Rock', emoji: '🪨' },
                    { id: 'paper', name: 'Paper', emoji: '📜' },
                    { id: 'scissors', name: 'Scissors', emoji: '✂️' }
                  ].map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => resolveRPS(choice.id as any)}
                      className="bg-slate-800 hover:bg-amber-600/20 border-2 border-slate-700 hover:border-amber-500 p-4 rounded-2xl transition-all group"
                    >
                      <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">{choice.emoji}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-black">{choice.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
          {showCecilImpactFrame && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 1, 0] }}
              transition={{ duration: 0.6, times: [0, 0.8, 1] }}
              className="fixed inset-0 z-[200] pointer-events-none flex flex-col justify-center overflow-hidden"
            >
              {/* Dimming Background */}
              <div className="absolute inset-0 bg-black/70 mix-blend-multiply" />
              <div className="absolute inset-0 bg-red-950/40 mix-blend-color-burn" />

              {/* Electric Lightning Shapes */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                {/* Main Red Bolt */}
                <motion.path
                  d="M-50,200 L200,450 L350,150 L600,550 L800,250 L1100,600"
                  stroke="red" strokeWidth="25" fill="none"
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ filter: "drop-shadow(0 0 20px red)" }}
                />
                {/* Thick Black Bolt */}
                <motion.path
                  d="M-50,800 L250,550 L450,850 L700,450 L900,750 L1150,300"
                  stroke="black" strokeWidth="35" fill="none"
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                  style={{ filter: "drop-shadow(0 0 10px rgba(255,0,0,0.5))" }}
                />
                {/* Sharp White/Pink Inner Bolt */}
                <motion.path
                  d="M300,-100 L450,250 L600,400 L350,650 L500,900 L480,1100"
                  stroke="#ff4444" strokeWidth="15" fill="none"
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
                  style={{ filter: "drop-shadow(0 0 15px white)" }}
                />
              </svg>

              {/* Central Impact Burst */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 5, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500 rounded-full mix-blend-screen blur-[30px]"
              />
            </motion.div>
          )}

          {showCecilMeter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (cecilMeterMoving) resolveCecilMeter();
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative bg-slate-900 border-2 border-red-600/50 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Swords className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-3xl font-black text-slate-100 uppercase tracking-tighter mb-2 italic">Rear Cross</h3>
                <p className="text-slate-400 text-sm mb-8 font-medium italic">Stop in the <span className="text-red-500 font-bold underline">RED ZONE</span> for Momentum!</p>

                {/* The Meter */}
                <div className="relative h-14 w-full bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] mb-8">
                  {/* Yellow Zone 1 */}
                  <div className="absolute inset-y-0 left-0 w-[40%] bg-yellow-500/20" />
                  {/* Orange Zone */}
                  <div className="absolute inset-y-0 left-[40%] w-[30%] bg-orange-600/30" />
                  {/* Red Zone */}
                  <div className="absolute inset-y-0 left-[70%] w-[10%] bg-red-600/80 shadow-[0_0_25px_rgba(220,38,38,0.4)] flex items-center justify-center">
                    <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.1)_5px,rgba(255,255,255,0.1)_10px)]" />
                  </div>
                  {/* Yellow Zone 2 */}
                  <div className="absolute inset-y-0 left-[80%] w-[20%] bg-yellow-500/20" />

                  {/* Indicator Marks */}
                  <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-10">
                    {[...Array(21)].map((_, i) => (
                      <div key={i} className={`h-full w-px ${i % 5 === 0 ? 'bg-white h-full' : 'bg-white/50 h-1/2 mt-auto'}`} />
                    ))}
                  </div>

                  {/* The Needle/Pointer */}
                  <motion.div
                    className="absolute inset-y-0 w-1.5 bg-white z-20 shadow-[0_0_15px_rgba(255,255,255,1)]"
                    style={{ left: `${cecilMeterValue}%` }}
                    animate={{ scaleY: cecilMeterMoving ? [1, 1.05, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: 0.15 }}
                  >
                    <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-white rotate-45 border-2 border-slate-900" />
                    <div className="absolute -bottom-1 -left-1.5 w-4 h-4 bg-white rotate-45 border-2 border-slate-900" />
                  </motion.div>
                </div>

                <div className="flex justify-between items-center bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <div className="text-left">
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Momentum Power</div>
                    <div className="flex items-end gap-3">
                      <div className="text-4xl font-black text-white italic tracking-tighter leading-none">
                        <span className="text-slate-500 text-2xl mr-1 font-medium">x</span>
                        {cecilMultiplier}
                      </div>
                      <div className="text-sm font-bold text-red-400 mb-1">
                        {(() => {
                          const target = enemies.find(e => e.id === cecilMeterTargetId);
                          if (!target) return null;
                          const projectedDamage = calculateDamage(Math.floor(25 * cecilMultiplier), attackToUse, target);
                          return `Projected: ${projectedDamage} DMG`;
                        })()}
                      </div>
                    </div>
                  </div>

                  <button
                    onPointerDown={(e) => {
                      e.preventDefault(); // Prevent double firing if onClick somehow triggers too
                      if (cecilMeterMoving) resolveCecilMeter();
                    }}
                    className="h-16 px-10 bg-gradient-to-br from-red-500 to-red-700 text-white font-black uppercase tracking-tighter rounded-xl shadow-lg shadow-red-900/40 hover:scale-105 active:scale-95 transition-all text-xl italic"
                  >
                    HIT !!
                  </button>
                </div>

                <p className="mt-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  [ Press <span className="text-slate-300">SPACE</span> to trigger momentum ]
                </p>
              </motion.div>
            </motion.div>
          )}
          {showTurtleQuestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative bg-slate-900 border-2 border-emerald-600/50 rounded-3xl p-6 max-w-md w-full text-center shadow-2xl"
              >
                <div className="text-5xl mb-4">🐢</div>
                <h3 className="text-2xl font-black text-emerald-300 uppercase tracking-tight mb-2">Wise Turtle</h3>
                <p className="text-slate-300 text-sm mb-4">Who won the race the turtle or the hare?</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Answer in {turtleCountdown}s</p>

                <input
                  value={turtleAnswer}
                  onChange={(e) => setTurtleAnswer(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="Type your answer..."
                />

                <button
                  onClick={() => {
                    const normalizedAnswer = turtleAnswer.trim().toLowerCase();
                    const isCorrect = normalizedAnswer.includes('turtle') || normalizedAnswer.includes('tortoise');
                    resolveTurtleChallenge(isCorrect ? 'correct' : 'wrong');
                  }}
                  className="mt-4 w-full px-4 py-3 bg-emerald-600/80 hover:bg-emerald-500 border border-emerald-400/60 text-white font-bold rounded-xl transition-all"
                >
                  Submit Answer
                </button>
              </motion.div>
            </motion.div>
          )}
          {showStage3EquipmentPick && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative bg-slate-900 border-2 border-cyan-600/50 rounded-3xl p-6 max-w-3xl w-full text-center shadow-2xl"
              >
                <div className="text-4xl mb-3">🧰</div>
                <h3 className="text-2xl font-black text-cyan-300 uppercase tracking-tight mb-2">Stage 3 Loadout</h3>
                <p className="text-slate-300 text-sm mb-2">Choose one additional equipment for the Molten Frontier.</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">Slots: {runEquippedItems.length}/3</p>
                <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                  {runEquippedItems.length === 0 ? (
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">No equipment equipped yet</span>
                  ) : (
                    runEquippedItems.map(itemId => {
                      const item = getEquipmentItem(itemId);
                      if (!item) return null;
                      return (
                        <span
                          key={itemId}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-600/60 bg-slate-800/60 px-3 py-1 text-[10px] uppercase tracking-widest text-slate-200"
                        >
                          <span className="text-base">{item.icon}</span>
                          {item.name}
                          {item.id === 'movie_popcorn' && (
                            <span className="ml-2 text-[10px] text-slate-400">({popcornEatenThisLevel}/4)</span>
                          )}
                        </span>
                      );
                    })
                  )}
                </div>

                {stage3EquipmentOptions.length === 0 ? (
                  <div className="text-slate-400 text-sm py-6">No available equipment to equip.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[45vh] overflow-y-auto pr-1">
                    {stage3EquipmentOptions.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedStage3EquipmentId(item.id)}
                        className={`group relative text-left rounded-2xl p-4 transition-all ${selectedStage3EquipmentId === item.id
                          ? 'bg-cyan-900/40 border border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-800/70 border border-slate-700/60 hover:border-cyan-500/50'
                          }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <p className="text-sm font-bold text-slate-100 uppercase tracking-wide">{item.name}</p>
                            <p className="text-[10px] text-slate-400">{item.description}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-purple-300/80 italic">{item.passiveDescription}</p>
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleStage3EquipmentConfirm}
                    disabled={!selectedStage3EquipmentId}
                    className={`w-full px-4 py-3 border rounded-xl font-bold transition-all ${selectedStage3EquipmentId
                      ? 'bg-cyan-600/80 hover:bg-cyan-500 border-cyan-400/60 text-white'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-500 cursor-not-allowed'
                      }`}
                  >
                    Confirm Selection
                  </button>
                  <button
                    onClick={handleStage3EquipmentSkip}
                    className="w-full px-4 py-3 bg-slate-800/70 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold rounded-xl transition-all"
                  >
                    Skip
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
          {isDefeatAnimating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: defeatAnimationDuration / 1000 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.02 }}
                transition={{ duration: defeatAnimationDuration / 1000 }}
                className="relative z-50 text-center text-slate-100 px-6"
              >
                <p className="text-4xl font-bold">You have been defeated...</p>
                <p className="text-sm text-slate-300 mt-2">Returning to the defeat screen…</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Top Combat Area */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 pb-2">
          <div className="max-w-6xl mx-auto">
            {/* Header - Stage Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <button
                onClick={onBackToMenu}
                className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700/80 text-slate-100 border border-slate-600/50 rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm tracking-wide uppercase">Menu</span>
                </div>
              </button>

              <div className="text-center">
                <h2 className="text-lg sm:text-2xl text-slate-100 tracking-wider uppercase">
                  Stage {currentStage} - Level {currentLevel}/{currentStage === 1 ? 10 : currentStage === 2 ? 12 : currentStage === 3 ? 16 : 20}
                </h2>
                {currentLevel === (currentStage === 1 ? 10 : currentStage === 2 ? 12 : 16) && (
                  <p className="text-red-500 text-xs sm:text-sm tracking-widest uppercase mt-1">Boss Fight</p>
                )}
              </div>

              <div className="flex items-center gap-2 text-yellow-400">
                <Coins className="w-5 h-5" />
                <span className="text-base sm:text-lg font-bold">{gold}</span>
              </div>
            </div>

            {/* Combat Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Player Side */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl text-slate-100 tracking-wide uppercase mb-4">
                    {hero.name}
                  </h3>
                </div>

                {/* Player Visual */}
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={isPlayerTurn ? {} : {
                      x: [0, -5, 5, -5, 5, 0],
                      rotate: [0, -2, 2, -2, 2, 0]
                    }}
                    transition={{ duration: 0.5 }}
                    className={`w-36 h-36 sm:w-48 sm:h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden ${dualityMeter === 4 && hero.id === 'clyde'
                      ? 'border-2 animate-pulse shadow-lg shadow-blue-500/60 relative'
                      : 'border-2 border-slate-600/50 shadow-lg shadow-slate-900/50'
                      }`}
                  >
                    {/* Blue Fire Border Animation when full */}
                    {dualityMeter === 4 && hero.id === 'clyde' && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2"
                          animate={{
                            borderColor: [
                              'rgb(96, 165, 250)',
                              'rgb(59, 130, 246)',
                              'rgb(147, 197, 253)',
                              'rgb(96, 165, 250)'
                            ],
                            boxShadow: [
                              '0 0 20px rgba(96, 165, 250, 0.8), inset 0 0 20px rgba(96, 165, 250, 0.2)',
                              '0 0 40px rgba(59, 130, 246, 1), inset 0 0 30px rgba(59, 130, 246, 0.3)',
                              '0 0 20px rgba(147, 197, 253, 0.8), inset 0 0 20px rgba(147, 197, 253, 0.2)',
                              '0 0 20px rgba(96, 165, 250, 0.8), inset 0 0 20px rgba(96, 165, 250, 0.2)'
                            ]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                          style={{ pointerEvents: 'none' }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          animate={{
                            opacity: [0.3, 0.7, 0.3],
                            boxShadow: [
                              '0 0 30px rgba(96, 165, 250, 0.4)',
                              '0 0 60px rgba(59, 130, 246, 0.7)',
                              '0 0 30px rgba(96, 165, 250, 0.4)'
                            ]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                          style={{ pointerEvents: 'none' }}
                        />
                      </>
                    )}
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/10 via-transparent to-transparent rounded-2xl" />
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-5xl sm:text-6xl"
                    >
                      {hero.id === 'aldric' || hero.id === 'thora' || hero.id === 'gareth' ? '🛡️' :
                        hero.id === 'elara' || hero.id === 'zephyr' || hero.id === 'meryn' ? '🧙' :
                          hero.id === 'shadow' || hero.id === 'vex' || hero.id === 'kira' ? '🥷' :
                            hero.id === 'seraphina' || hero.id === 'marcus' || hero.id === 'lyanna' ? '⚜️' :
                              hero.id === 'clint' ? '🤠' :
                                hero.id === 'fredrinn' ? '🧛' :
                                  hero.id === 'johnny' ? '🎸' : '👤'}
                    </motion.div>
                  </motion.div>
                </div>

                {/* New Hero Status Panel */}
                <HeroStatusPanel
                  hero={hero}
                  playerHealth={playerHealth}
                  maxPlayerHealth={maxPlayerHealth}
                  playerShield={playerShield}
                  playerResource={playerResource}
                  maxPlayerResource={maxPlayerResource}
                  resourceType={resourceType}
                  attack={finalAttack}
                  defense={finalDefense}
                  speed={effectiveSpeed}
                  attackCap={attackCap}
                  defenseCap={defenseCap}
                  statusEffects={{
                    weakness: playerWeaknessTurns,
                    speedDebuff: playerSpeedDebuffTurns,
                    burn: playerBurnTurns,
                    poison: playerPoisonTurns,
                    isPoisonLethal: isPlayerPoisonLethal,
                    vineTrap: vineTrapTurns,
                    bleed: playerBleedTurns,
                    pollen: pollenMeter,
                    devastation: playerDevastationTurns
                  }}
                  dualityMeter={dualityMeter}
                  dualityForm={dualityForm as any}
                  wolfgangNoteMeter={wolfgangNoteMeter}
                  lucianSoulMeter={lucianSoulMeter}
                  clydeSouls={clydeSouls}
                  brunoComboMeter={brunoComboMeter}
                  powerPunchCharged={powerPunchTurns > 0}
                  jjVictoryRushActive={jjVictoryRushActive}
                  jjVictoryRushStacks={jjVictoryRushStacks}
                  jjPunches={jjPunches}
                  eliShieldActive={eliShieldActive}
                  eliShieldCharge={eliShieldCharge}
                  maxEliShield={maxEliShield}
                  onToggleEliShield={toggleEliShield}
                  permafrostIceActive={permafrostIceActive}
                  shadowMeter={shadowMeter}
                  bonusDodgeChance={bonusDodgeChance}
                  bulletsSpent={bulletsSpent}
                  guaranteedCrit={guaranteedCrit}
                  onBurst={handleBurst}
                  artifacts={artifacts}
                  inventory={inventory}
                  artifactBonusStats={artifactBonusStats}
                  heroId={hero.id}
                  baseCritChance={baseCritChance}
                  itemCritChance={itemCritChance}
                  totalCritChance={totalCritChance}
                  equipSpeedBonus={equipSpeedBonus}
                  bonusSpeed={bonusSpeed}
                  dodgeCap={dodgeCap}
                  totalDodgeChance={totalDodgeChance}
                />
              </div>


              {/* Enemy Side */}
              <div>
                <h3 className="text-xl text-slate-100 tracking-wide uppercase text-center mb-4">
                  Enemies
                </h3>
                <EnemyDisplay
                  enemies={enemies}
                  selectedTargetId={selectedTargetId}
                  onSelectTarget={setSelectedTargetId}
                  bossChargeCount={bossChargeCount}
                  bossChargeThreshold={getBossRageThreshold(enemies.find(e => e.type === 'BOSS')?.name || '')}
                  bossAttackBonus={bossAttackBonus}
                  bossDefenseBonus={bossDefenseBonus}
                  slashedEnemyIds={slashedEnemyIds}
                  hasRingOfPower={hasEquipment('ring_of_power')}
                  lordInfernoPowerMeter={lordInfernoPowerMeter}
                  robinHoodRageMeter={robinHoodRageMeter}
                />
              </div>
            </div>
          </div>

          {/* Combat Log */}
          {/* Combat Log */}
          <div className="relative bg-slate-950/80 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl shadow-black/40 flex flex-col h-[200px]">
            {/* Scanline Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-50" />

            {/* Header */}
            <div className="bg-slate-900/90 border-b border-slate-700/50 px-4 py-2 flex items-center justify-between z-30">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <span className="text-xs text-slate-400 font-mono uppercase tracking-widest ml-2">Battlelog.exe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[10px] text-green-400 font-mono">LIVE</span>
              </div>
            </div>

            {/* Log Content */}
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs sm:text-sm space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent z-10">
              <AnimatePresence mode="popLayout" initial={false}>
                {[...combatLog].reverse().map((log, index) => (
                  <motion.div
                    key={`${log}-${combatLog.length - 1 - index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2 ${index === 0 ? 'text-white font-bold' : 'text-slate-400'}`}
                  >
                    <span className="text-slate-600 select-none shrink-0">{'>'}</span>
                    <span>{log}</span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Turn Indicators */}
              {isPlayerTurn && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-green-400/80 pt-2 border-t border-slate-800/50 mt-2"
                >
                  <span className="animate-pulse">_</span>
                  <span>Awaiting command...</span>
                </motion.div>
              )}
              {!isPlayerTurn && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-red-400/80 pt-2 border-t border-slate-800/50 mt-2"
                >
                  <span className="animate-spin duration-[3000ms]">⟳</span>
                  <span>Enemy acting...</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* Bottom Action Area */}
      {
        !showMoveSelection && !showItemSelection ? (
          <div className="shrink-0 bg-gradient-to-t from-slate-950 via-slate-900/95 to-slate-900/80 backdrop-blur-md border-t border-slate-700/40 p-4 sm:p-6 pb-6 sm:pb-8">

            <HeroActionPanel
              isPlayerTurn={isPlayerTurn}
              onFight={handleFight}
              onUseItem={handleUseItem}
              onTrain={handleTrain}
              onBlock={handleBlock}
              blockCooldownTurns={blockCooldownTurns}
              playerAttack={playerAttack}
              attackCap={attackCap}
            />
          </div>
        ) : showMoveSelection ? (
          <MoveSelection
            moves={characterMoves}
            onSelectMove={handleMoveSelect}
            onClose={() => setShowMoveSelection(false)}
            currentResource={playerResource}
            resourceType={resourceType as 'Mana' | 'Energy'}
            activeCooldowns={activeCooldowns}
            classId={hero.classId}
            disabledMoveId={activeDisabledMoveId}
            moveUsesThisTurn={moveUsesThisTurn}
            brunoComboMeter={brunoComboMeter}
          />
        ) : (
          <ItemSelection
            inventory={inventory}
            onUseItem={handleItemSelect}
            onClose={() => setShowItemSelection(false)}
            currentHealth={playerHealth}
            maxHealth={maxPlayerHealth}
            currentResource={playerResource}
            maxResource={maxPlayerResource}
            resourceType={resourceType}
          />
        )
      }
    </div >
  );
}


