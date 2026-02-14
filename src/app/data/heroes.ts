import { Move } from '../components/MoveSelection';
import { WARRIOR_BASIC_MOVES, DEARBORN_MOVES, MAGE_BASIC_MOVES, ROGUE_BASIC_MOVES, PALADIN_BASIC_MOVES, GUNSLINGER_BASIC_MOVES, DUALITY_BASIC_MOVES, WOLFGANG_KEYBOARD_MOVES, WOLFGANG_DRUMS_MOVES, WOLFGANG_VIOLIN_MOVES, CLYDE_NORMAL_MOVES, CLYDE_GHOUL_MOVES, ELARA_MAGE_MOVES, ZEPHYR_MAGE_MOVES, MERYN_MAGE_MOVES, LUCIAN_MOVES } from './basic-moves';

export interface Hero {
  id: string;
  name: string;
  classId: string;
  title: string;
  description: string;
  stats: {
    health: number;
    attack: number;
    defense: number;
    speed: number;
  };
  uniqueAbility?: {
    name: string;
    description: string;
    id: string;
  };
  resourceType: string;
  moves: Move[];
}

// Warrior Heroes
export const WARRIOR_HEROES: Hero[] = [
  {
    id: 'aldric',
    name: 'Aldric the Unbreakable',
    classId: 'warrior',
    title: 'The Iron Wall',
    description: 'A veteran warrior who has survived countless battles through sheer resilience',
    stats: {
      health: 140,
      attack: 35,
      defense: 32,
      speed: 21,
    },
    resourceType: 'Energy',
    uniqueAbility: {
      id: 'iron_will',
      name: 'Iron Will',
      description: 'Passive: Gain +5 Max HP for each enemy defeated',
    },
    moves: WARRIOR_BASIC_MOVES,
  },
  {
    id: 'thora',
    name: 'Thora Battleborn',
    classId: 'warrior',
    title: 'The Berserker',
    description: 'A fierce warrior who grows stronger as battle rages on',
    stats: {
      health: 135,
      attack: 37,
      defense: 30,
      speed: 23,
    },
    resourceType: 'Energy',
    uniqueAbility: {
      id: 'battle_rage',
      name: 'Battle Rage',
      description: 'Passive: Deal 50% more damage if your health is below 50%',
    },
    moves: WARRIOR_BASIC_MOVES,
  },
  {
    id: 'gareth',
    name: 'Gareth Ironheart',
    classId: 'warrior',
    title: 'The Steadfast',
    description: 'A balanced warrior who excels in both offense and defense',
    stats: {
      health: 138,
      attack: 36,
      defense: 31,
      speed: 22,
    },
    resourceType: 'Energy',
    uniqueAbility: {
      id: 'endurance',
      name: 'Endurance',
      description: 'Passive: Heal 20 HP at the start of each level (overflow becomes shield)',
    },
    moves: WARRIOR_BASIC_MOVES,
  },
  {
    id: 'dearborn',
    name: "Dearborn 'Wave Surfer' Winmore",
    classId: 'warrior',
    title: 'Wave Surfer',
    description: 'A swashbuckling warrior whose strike surges into crashing waves after using other skills.',
    stats: {
      health: 120,
      attack: 28,
      defense: 38,
      speed: 25,
    },
    resourceType: 'Energy',
    uniqueAbility: {
      id: 'wave_surfer',
      name: 'Wave Surfer',
      description: 'Passive: Using any skill other than Strike upgrades Strike to Wave Crash. Also grants access to the Illegal Shop.',
    },
    moves: DEARBORN_MOVES,
  },
];

// Mage Heroes
export const MAGE_HEROES: Hero[] = [
  {
    id: 'elara',
    name: 'Elara Stormweaver',
    classId: 'mage',
    title: 'The Archmage',
    description: 'A master of elemental magic who commands the fury of storms',
    stats: {
      health: 100,
      attack: 59,
      defense: 26,
      speed: 20,
    },
    resourceType: 'Mana',
    uniqueAbility: {
      id: 'arcane_mastery',
      name: 'Arcane Mastery',
      description: 'Passive: Spells have a 15% chance to proc extra effects (burn, stun, poison, freeze, weaken)',
    },
    moves: ELARA_MAGE_MOVES,
  },
  {
    id: 'zephyr',
    name: 'Zephyr the Enigmatic',
    classId: 'mage',
    title: 'The Shadowcaster',
    description: 'A mysterious mage who specializes in dark and arcane arts',
    stats: {
      health: 95,
      attack: 61,
      defense: 25,
      speed: 22,
    },
    resourceType: 'Mana',
    uniqueAbility: {
      id: 'dark_pact',
      name: 'Dark Pact',
      description: 'Passive: At 100 mana you will guarantee a critical hit',
    },
    moves: ZEPHYR_MAGE_MOVES,
  },
  {
    id: 'meryn',
    name: 'Meryn Frostwhisper',
    classId: 'mage',
    title: 'The Cryomancer',
    description: 'A cold and calculating mage who freezes enemies in their tracks',
    stats: {
      health: 105,
      attack: 57,
      defense: 27,
      speed: 18,
    },
    resourceType: 'Mana',
    uniqueAbility: {
      id: 'permafrost',
      name: 'Permafrost',
      description: 'Passive: At the start of each level your health bar is frozen. The first attack will break the ice and negate ALL damage',
    },
    moves: MERYN_MAGE_MOVES,
  },
];

// Rogue Heroes
// Rogue class gets +20% crit chance (25% total, 1 in 4 instead of 1 in 20)
export const ROGUE_HEROES: Hero[] = [
  {
    id: 'shadow',
    name: 'Shadow',
    classId: 'rogue',
    title: 'The Phantom',
    description: 'A ghost-like assassin who strikes from the shadows',
    stats: {
      health: 115,
      attack: 40,
      defense: 28,
      speed: 38,
    },
    resourceType: 'Energy',
    uniqueAbility: {
      id: 'shadowstep',
      name: 'Shadowstep',
      description: 'Passive: 25% chance to completely dodge enemy attacks',
    },
    moves: ROGUE_BASIC_MOVES,
  },
  {
    id: 'vex',
    name: 'Vex the Swift',
    classId: 'rogue',
    title: 'The Bladedancer',
    description: 'A lightning-fast rogue who dances through combat with deadly precision',
    stats: {
      health: 110,
      attack: 42,
      defense: 27,
      speed: 40,
    },
    resourceType: 'Energy',
    uniqueAbility: {
      id: 'backstab',
      name: 'Backstab',
      description: 'Passive: Critical hits deal +30% bonus damage',
    },
    moves: ROGUE_BASIC_MOVES,
  },
  {
    id: 'kira',
    name: 'Kira Nightshade',
    classId: 'rogue',
    title: 'The Poisoner',
    description: 'A cunning rogue who specializes in deadly toxins',
    stats: {
      health: 120,
      attack: 38,
      defense: 29,
      speed: 36,
    },
    resourceType: 'Energy',
    uniqueAbility: {
      id: 'toxic_mastery',
      name: 'Toxic Mastery',
      description: 'Passive: Poison effects deal +50% damage',
    },
    moves: ROGUE_BASIC_MOVES,
  },
  {
    id: 'shinjiro',
    name: 'Shinjiro',
    classId: 'rogue',
    title: 'The Shadow Blade',
    description: 'A disciplined rogue who harnesses the energy of dodged attacks.',
    stats: {
      health: 125,
      attack: 44,
      defense: 25,
      speed: 42,
    },
    resourceType: 'Energy',
    uniqueAbility: {
      id: 'shadow_meter',
      name: 'Shadow Meter',
      description: 'Passive: Fills when dodging (requires 2). When full, deals 25% ATK 3 times (free action) and gains +0.5% dodge.',
    },
    moves: ROGUE_BASIC_MOVES,
  },
];

// Paladin Heroes
export const PALADIN_HEROES: Hero[] = [
  {
    id: 'seraphina',
    name: 'Seraphina the Blessed',
    classId: 'paladin',
    title: 'The Holy Guardian',
    description: 'A radiant warrior blessed by divine light',
    stats: {
      health: 130,
      attack: 38,
      defense: 31,
      speed: 23,
    },
    resourceType: 'Mana',
    uniqueAbility: {
      id: 'divine_grace',
      name: 'Divine Grace',
      description: 'Passive: Heal 2 HP every turn',
    },
    moves: PALADIN_BASIC_MOVES,
  },
  {
    id: 'marcus',
    name: 'Marcus the Devoted',
    classId: 'paladin',
    title: 'The Templar',
    description: 'A steadfast defender of justice and righteousness',
    stats: {
      health: 135,
      attack: 36,
      defense: 33,
      speed: 21,
    },
    resourceType: 'Mana',
    uniqueAbility: {
      id: 'holy_bastion',
      name: 'Holy Bastion',
      description: 'Passive: Take 10% reduced damage from all sources',
    },
    moves: PALADIN_BASIC_MOVES,
  },
  {
    id: 'lyanna',
    name: 'Lyanna Sunforge',
    classId: 'paladin',
    title: 'The Avenger',
    description: 'A fierce paladin who strikes down the wicked with holy fury',
    stats: {
      health: 125,
      attack: 40,
      defense: 30,
      speed: 24,
    },
    resourceType: 'Mana',
    uniqueAbility: {
      id: 'righteous_fury',
      name: 'Righteous Fury',
      description: 'Passive: 20% chance to burn the enemy when they attack you',
    },
    moves: PALADIN_BASIC_MOVES,
  },
];

// Gunslinger Heroes
export const GUNSLINGER_HEROES: Hero[] = [
  {
    id: 'clint',
    name: 'Clint Eastwood',
    classId: 'gunslinger',
    title: 'The Outlaw',
    description: 'A legendary marksman whose luck never runs out on the final shot.',
    stats: {
      health: 85,
      attack: 58,
      defense: 22,
      speed: 36,
    },
    resourceType: 'Bullets',
    uniqueAbility: {
      id: 'last_chamber',
      name: 'Last Chamber',
      description: 'Passive: Every 6 bullets spent guarantees a crit.',
    },
    moves: GUNSLINGER_BASIC_MOVES,
  },
  {
    id: 'fredrinn',
    name: 'Fredrinn the Bold',
    classId: 'gunslinger',
    title: 'The Bloodhunter',
    description: 'A ruthless gunslinger who sustains himself through the carnage he creates.',
    stats: {
      health: 80,
      attack: 62,
      defense: 20,
      speed: 38,
    },
    resourceType: 'Bullets',
    uniqueAbility: {
      id: 'bullet_vamp',
      name: 'Blood Bullets',
      description: 'Passive: Every bullet hit has 8% lifesteal (heals 8% of damage).',
    },
    moves: GUNSLINGER_BASIC_MOVES,
  },
  {
    id: 'johnny',
    name: 'Johnny Silverhand',
    classId: 'gunslinger',
    title: 'The Rebel',
    description: 'A revolutionary who always seems to have one more trick up his sleeve.',
    stats: {
      health: 90,
      attack: 55,
      defense: 24,
      speed: 34,
    },
    resourceType: 'Bullets',
    uniqueAbility: {
      id: 'extra_mag',
      name: 'Extra Mag',
      description: 'Passive: Gain an extra bullet every turn.',
    },
    moves: GUNSLINGER_BASIC_MOVES,
  },
  {
    id: 'lucian',
    name: 'Lucian Dusk',
    classId: 'gunslinger',
    title: 'The Duskbringer',
    description: 'A mysterious gunslinger whose very soul fuels his devastating attacks.',
    stats: {
      health: 90,
      attack: 32,
      defense: 25,
      speed: 36,
    },
    resourceType: 'Bullets',
    uniqueAbility: {
      id: 'soul_meter',
      name: 'Soul Meter',
      description: 'Passive: Gain 5 Soul per enemy kill (max 5000). Every 10 Soul grants +1 Attack (breaks cap). Soul-Shot builds meter by 1 per hit.',
    },
    moves: LUCIAN_MOVES,
  },
];

// Duality Heroes
export const DUALITY_HEROES: Hero[] = [
  {
    id: 'cedric',
    name: 'Cedric "Beast" Amponsem',
    classId: 'duality',
    title: 'The Shiftshifter',
    description: 'A martial artist who can tap into his primal beast self when pushed to the limit.',
    stats: {
      health: 110,
      attack: 24,
      defense: 20,
      speed: 32,
    },
    resourceType: 'Energy',
    uniqueAbility: {
      id: 'primal_shift',
      name: 'Primal Shift',
      description: 'Passive: Charges meter by hitting. Full meter unlocks Beast Form (+30 ATK, +20 DEF). Transforms back with half HP on death in Beast form.',
    },
    moves: DUALITY_BASIC_MOVES,
  },
  {
    id: 'clyde',
    name: 'Clyde Grimshaw',
    classId: 'duality',
    title: 'The Soulkeeper',
    description: 'A supernatural being who captures enemy souls to defy death itself.',
    stats: {
      health: 250,
      attack: 10,
      defense: 90,
      speed: 1,
    },
    resourceType: 'Energy',
    uniqueAbility: {
      id: 'soul_keeper',
      name: 'Soul Keeper',
      description: 'Passive: Cannot gain attack from training or items. 10% chance to grab enemy soul on kill (Max: 2). Dying with a soul revives you with 50% HP and 25 Shield.',
    },
    moves: CLYDE_NORMAL_MOVES,
  },
  {
    id: 'wolfgang',
    name: 'Wolfgang Amadeus',
    classId: 'duality',
    title: 'The Virtuoso',
    description: 'A musical genius who weaves magic into every note.',
    stats: {
      health: 120,
      attack: 34,
      defense: 26,
      speed: 25,
    },
    resourceType: 'Energy',
    uniqueAbility: {
      id: 'musical_genius',
      name: 'Musical Genius',
      description: 'Passive: Gain 1 Shield per Perfect note hit in Symphony. Fill Note Bar (max 100) to unleash Burst Damage (1 dmg per note).',
    },
    moves: WOLFGANG_KEYBOARD_MOVES, // Start with Keyboard form
  },
];

export const ALL_HEROES = [
  ...WARRIOR_HEROES,
  ...MAGE_HEROES,
  ...ROGUE_HEROES,
  ...PALADIN_HEROES,
  ...GUNSLINGER_HEROES,
  ...DUALITY_HEROES,
];

export function getHeroesByClass(classId: string): Hero[] {
  switch (classId) {
    case 'warrior':
      return WARRIOR_HEROES;
    case 'mage':
      return MAGE_HEROES;
    case 'rogue':
      return ROGUE_HEROES;
    case 'paladin':
      return PALADIN_HEROES;
    case 'gunslinger':
      return GUNSLINGER_HEROES;
    case 'duality':
      return DUALITY_HEROES;
    default:
      return [];
  }
}
