export interface Enemy {
  id: string;
  name: string;
  type: 'ENEMY' | 'BOSS' | 'MINION';
  maxHealth: number;
  attack: number;
  defense: number;
  baseDamage: number;
  traitId?: string;
  traitName?: string;
  traitDescription?: string;
}

export interface LevelData {
  enemies: Enemy[];
}

// Stage 1: 10 levels with varying enemy compositions
export const STAGE_1_LEVELS: Record<number, LevelData> = {
  1: {
    enemies: [
      {
        id: 'goblin_1',
        name: 'Goblin Scout',
        type: 'ENEMY',
        maxHealth: 60,
        attack: 9,
        defense: 9,
        baseDamage: 12,
      },
    ],
  },
  2: {
    enemies: [
      {
        id: 'goblin_1',
        name: 'Goblin Warrior',
        type: 'ENEMY',
        maxHealth: 70,
        attack: 13,
        defense: 12,
        baseDamage: 14,
      },
      {
        id: 'goblin_2',
        name: 'Goblin Archer',
        type: 'ENEMY',
        maxHealth: 50,
        attack: 15,
        defense: 8,
        baseDamage: 16,
      },
    ],
  },
  3: {
    enemies: [
      {
        id: 'orc_1',
        name: 'Orc Brute',
        type: 'ENEMY',
        maxHealth: 90,
        attack: 18,
        defense: 17,
        baseDamage: 16,
      },
    ],
  },
  4: {
    enemies: [
      {
        id: 'skeleton_1',
        name: 'Skeleton Warrior',
        type: 'ENEMY',
        maxHealth: 65,
        attack: 14,
        defense: 14,
        baseDamage: 14,
      },
      {
        id: 'skeleton_2',
        name: 'Skeleton Mage',
        type: 'ENEMY',
        maxHealth: 55,
        attack: 18,
        defense: 9,
        baseDamage: 17,
      },
    ],
  },
  5: {
    enemies: [
      {
        id: 'troll_1',
        name: 'Cave Troll',
        type: 'ENEMY',
        maxHealth: 110,
        attack: 20,
        defense: 21,
        baseDamage: 18,
      },
    ],
  },
  6: {
    enemies: [
      {
        id: 'bandit_1',
        name: 'Bandit Leader',
        type: 'ENEMY',
        maxHealth: 80,
        attack: 19,
        defense: 12,
        baseDamage: 15,
      },
      {
        id: 'bandit_2',
        name: 'Bandit Cutthroat',
        type: 'ENEMY',
        maxHealth: 60,
          attack: 19,
          defense: 5,
        baseDamage: 20,
      },
    ],
  },
  7: {
    enemies: [
      {
        id: 'wraith_1',
        name: 'Cursed Wraith',
        type: 'ENEMY',
        maxHealth: 75,
          attack: 22,
          defense: 15,
        baseDamage: 22,
      },
    ],
  },
  8: {
    enemies: [
      {
        id: 'ogre_1',
        name: 'Armored Ogre',
        type: 'ENEMY',
        maxHealth: 130,
          attack: 22,
          defense: 15,
        baseDamage: 22,
      },
    ],
  },
  9: {
    enemies: [
      {
        id: 'elite_1',
        name: 'Elite Guard',
        type: 'ENEMY',
        maxHealth: 95,
          attack: 24,
          defense: 18,
        baseDamage: 24,
      },
      {
        id: 'elite_2',
        name: 'Elite Archer',
        type: 'ENEMY',
        maxHealth: 75,
          attack: 26,
          defense: 13,
        baseDamage: 26,
      },
      {
        id: 'elite_3',
        name: 'Elite Mage',
        type: 'ENEMY',
        maxHealth: 65,
          attack: 28,
          defense: 10,
        baseDamage: 28,
      },
    ],
  },
  10: {
    enemies: [
      {
        id: 'boss',
        name: 'Goblin King',
        type: 'BOSS',
        maxHealth: 250,
          attack: 27,
          defense: 84,
        baseDamage: 30,
      },
    ],
  },
};

// Stage 2: 12 levels with significantly stronger enemies
export const STAGE_2_LEVELS: Record<number, LevelData> = {
  1: {
    enemies: [
      {
        id: 'shadow_1',
        name: 'Shadow Scout',
        type: 'ENEMY',
        maxHealth: 150,
        attack: 22,
        defense: 15,
        baseDamage: 25,
      },
    ],
  },
  2: {
    enemies: [
      {
        id: 'corrupted_wolf_1',
        name: 'Corrupted Wolf',
        type: 'ENEMY',
        maxHealth: 160,
        attack: 25,
        defense: 12,
        baseDamage: 28,
      },
      {
        id: 'corrupted_wolf_2',
        name: 'Alpha Wolf',
        type: 'ENEMY',
        maxHealth: 180,
        attack: 28,
        defense: 15,
        baseDamage: 30,
      },
    ],
  },
  3: {
    enemies: [
      {
        id: 'shadow_warrior_1',
        name: 'Shadow Warrior',
        type: 'ENEMY',
        maxHealth: 200,
        attack: 30,
        defense: 170,
        baseDamage: 32,
      },
    ],
  },
  4: {
    enemies: [
      {
        id: 'dark_mage_1',
        name: 'Dark Sorcerer',
        type: 'ENEMY',
        maxHealth: 140,
        attack: 35,
        defense: 10,
        baseDamage: 38,
      },
      {
        id: 'shadow_guard_1',
        name: 'Shadow Guard',
        type: 'ENEMY',
        maxHealth: 180,
        attack: 25,
        defense: 25,
        baseDamage: 28,
      },
    ],
  },
  5: {
    enemies: [
      {
        id: 'void_golem_1',
        name: 'Void Golem',
        type: 'ENEMY',
        maxHealth: 300,
        attack: 240,
        defense: 240,
        baseDamage: 35,
      },
    ],
  },
  6: {
    enemies: [
      {
        id: 'nightmare_1',
        name: 'Nightmare Stalker',
        type: 'ENEMY',
        maxHealth: 170,
        attack: 45,
        defense: 15,
        baseDamage: 42,
      },
      {
        id: 'nightmare_2',
        name: 'Nightmare Stalker',
        type: 'ENEMY',
        maxHealth: 170,
        attack: 45,
        defense: 15,
        baseDamage: 42,
      },
    ],
  },
  7: {
    enemies: [
      {
        id: 'lich_1',
        name: 'Ancient Lich',
        type: 'ENEMY',
        maxHealth: 220,
        attack: 50,
        defense: 20,
        baseDamage: 45,
      },
    ],
  },
  8: {
    enemies: [
      {
        id: 'void_beast_1',
        name: 'Void Beast',
        type: 'ENEMY',
        maxHealth: 350,
        attack: 45,
        defense: 30,
        baseDamage: 40,
      },
    ],
  },
  9: {
    enemies: [
      {
        id: 'fallen_knight_1',
        name: 'Fallen Knight',
        type: 'ENEMY',
        maxHealth: 250,
        attack: 40,
        defense: 35,
        baseDamage: 35,
      },
      {
        id: 'fallen_knight_2',
        name: 'Fallen Paladin',
        type: 'ENEMY',
        maxHealth: 280,
        attack: 42,
        defense: 38,
        baseDamage: 38,
      },
    ],
  },
  10: {
    enemies: [
      {
        id: 'chaos_elemental_1',
        name: 'Chaos Elemental',
        type: 'ENEMY',
        maxHealth: 320,
        attack: 30,
        defense: 25,
        baseDamage: 50,
      },
    ],
  },
  11: {
    enemies: [
      {
        id: 'dragon_guard_1',
        name: 'Dragon Guard',
        type: 'ENEMY',
        maxHealth: 300,
        attack: 50,
        defense: 40,
        baseDamage: 45,
      },
      {
        id: 'dragon_guard_2',
        name: 'Dragon Preist',
        type: 'ENEMY',
        maxHealth: 250,
        attack: 55,
        defense: 20,
        baseDamage: 55,
      },
    ],
  },
  12: {
    enemies: [
      {
        id: 'lord_inferno',
        name: 'Lord Inferno',
        type: 'BOSS',
        maxHealth: 300,
        attack: 180,
        defense: 270,
        baseDamage: 40,
      },
    ],
  },
};

// Stage 3: 12 levels (in progress)
export const STAGE_3_LEVELS: Record<number, LevelData> = {
  1: {
    enemies: [
      {
        id: 'lava_golem_1',
        name: 'Lava Golem',
        type: 'ENEMY',
        maxHealth: 300,
        attack: 255,
        defense: 382,
        baseDamage: 40,
      },
    ],
  },
  2: {
    enemies: [
      {
        id: 'lava_pebble_1',
        name: 'Lava Pebble',
        type: 'MINION',
        maxHealth: 30,
        attack: 10,
        defense: 60,
        baseDamage: 12,
      },
      {
        id: 'lava_pebble_2',
        name: 'Lava Pebble',
        type: 'MINION',
        maxHealth: 30,
        attack: 10,
        defense: 60,
        baseDamage: 12,
      },
      {
        id: 'lava_pebble_3',
        name: 'Lava Pebble',
        type: 'MINION',
        maxHealth: 30,
        attack: 10,
        defense: 60,
        baseDamage: 12,
      },
      {
        id: 'lava_pebble_4',
        name: 'Lava Pebble',
        type: 'MINION',
        maxHealth: 30,
        attack: 10,
        defense: 60,
        baseDamage: 12,
      },
      {
        id: 'lava_pebble_5',
        name: 'Lava Pebble',
        type: 'MINION',
        maxHealth: 30,
        attack: 10,
        defense: 60,
        baseDamage: 12,
      },
      {
        id: 'lava_pebble_6',
        name: 'Lava Pebble',
        type: 'MINION',
        maxHealth: 30,
        attack: 10,
        defense: 60,
        baseDamage: 12,
      },
    ],
  },
    // Add Magma Soldier as MINION
    3: {
      enemies: [
        {
          id: 'magma_soldier_1',
          name: 'Magma Soldier',
          type: 'MINION',
          maxHealth: 200,
          attack: 30,
          defense: 40,
          baseDamage: 18,
        },
      ],
    },
  3: {
    enemies: [
      {
        id: 'jester_1',
        name: 'Jester',
        type: 'ENEMY',
        maxHealth: 320,
        attack: 22,
        defense: 72,
        baseDamage: 18,
      },
    ],
  },
  4: {
    enemies: [
      {
        id: 'lava_pebble_trick_1',
        name: 'Lava Pebble',
        type: 'MINION',
        maxHealth: 30,
        attack: 11,
        defense: 78,
        baseDamage: 12,
      },
    ],
  },
  5: {
    enemies: [
      {
        id: 'lava_dragon_1',
        name: 'Lava Dragon',
        type: 'ENEMY',
        maxHealth: 600,
        attack: 20,
        defense: 300,
        baseDamage: 45,
      },
    ],
  },
  6: {
    enemies: [
      {
        id: 'lava_spider_1',
        name: 'Lava Spider',
        type: 'ENEMY',
        maxHealth: 320,
        attack: 90,
        defense: 60,
        baseDamage: 35,
      },
      {
        id: 'lava_spider_2',
        name: 'Lava Spider',
        type: 'ENEMY',
        maxHealth: 320,
        attack: 90,
        defense: 60,
        baseDamage: 35,
      },
    ],
  },
  7: {
    enemies: [
      {
        id: 'wise_turtle_1',
        name: 'Wise Turtle',
        type: 'ENEMY',
        maxHealth: 450,
        attack: 100,
        defense: 80,
        baseDamage: 40,
      },
    ],
  },
  8: {
    enemies: [
      {
        id: 'lava_golem_2',
        name: 'Lava Golem',
        type: 'ENEMY',
        maxHealth: 300,
        attack: 255,
        defense: 382,
        baseDamage: 40,
      },
      {
        id: 'lava_golem_3',
        name: 'Lava Golem',
        type: 'ENEMY',
        maxHealth: 300,
        attack: 255,
        defense: 382,
        baseDamage: 40,
      },
    ],
  },
  9: {
    enemies: [
      {
        id: 'lava_hut_1',
        name: 'Lava Hut',
        type: 'ENEMY',
        maxHealth: 1000,
        attack: 0,
        defense: 120,
        baseDamage: 0,
      },
    ],
  },
  10: {
    enemies: [
      {
        id: 'fire_lizard_1',
        name: 'Fire Lizard',
        type: 'ENEMY',
        maxHealth: 450,
        attack: 150,
        defense: 80,
        baseDamage: 35,
      },
      {
        id: 'lava_spider_3',
        name: 'Lava Spider',
        type: 'ENEMY',
        maxHealth: 320,
        attack: 90,
        defense: 60,
        baseDamage: 35,
      },
    ],
  },
  11: {
    enemies: [
      {
        id: 'lava_hut_2',
        name: 'Lava Hut',
        type: 'ENEMY',
        maxHealth: 1000,
        attack: 0,
        defense: 120,
        baseDamage: 0,
      },
      {
        id: 'lava_spider_4',
        name: 'Lava Spider',
        type: 'ENEMY',
        maxHealth: 320,
        attack: 90,
        defense: 60,
        baseDamage: 35,
      },
    ],
  },
  12: {
    enemies: [
      {
        id: 'fire_lizard_2',
        name: 'Fire Lizard',
        type: 'ENEMY',
        maxHealth: 450,
        attack: 150,
        defense: 80,
        baseDamage: 35,
      },
      {
        id: 'jester_2',
        name: 'Jester',
        type: 'ENEMY',
        maxHealth: 320,
        attack: 20,
        defense: 55,
        baseDamage: 18,
      },
    ],
  },
  13: {
    enemies: [
      {
        id: 'lava_golem_4',
        name: 'Lava Golem',
        type: 'ENEMY',
        maxHealth: 300,
        attack: 55,
        defense: 182,
        baseDamage: 40,
      },
      {
        id: 'lava_spider_5',
        name: 'Lava Spider',
        type: 'ENEMY',
        maxHealth: 320,
        attack: 90,
        defense: 60,
        baseDamage: 35,
      },
    ],
  },
  14: {
    enemies: [
      {
        id: 'wise_turtle_2',
        name: 'Wise Turtle',
        type: 'ENEMY',
        maxHealth: 450,
        attack: 100,
        defense: 80,
        baseDamage: 40,
      },
      {
        id: 'lava_pebble_7',
        name: 'Lava Pebble',
        type: 'MINION',
        maxHealth: 30,
        attack: 10,
        defense: 60,
        baseDamage: 12,
      },
      {
        id: 'lava_pebble_8',
        name: 'Lava Pebble',
        type: 'MINION',
        maxHealth: 30,
        attack: 10,
        defense: 60,
        baseDamage: 12,
      },
    ],
  },
  15: {
    enemies: [
      {
        id: 'lava_dragon_2',
        name: 'Lava Dragon',
        type: 'ENEMY',
        maxHealth: 600,
        attack: 20,
        defense: 300,
        baseDamage: 45,
      },
      {
        id: 'fire_lizard_3',
        name: 'Fire Lizard',
        type: 'ENEMY',
        maxHealth: 450,
        attack: 150,
        defense: 80,
        baseDamage: 35,
      },
    ],
  },
  16: {
    enemies: [
      {
        id: 'magma_overlord_1',
        name: 'Magma Overlord',
        type: 'BOSS',
        maxHealth: 1200,
        attack: 60,
        defense: 320,
        baseDamage: 50,
      },
    ],
  },
};

// Stage 4: Fairy Forest (20 levels planned). Start with Level 1: Moss Golem
export const STAGE_4_LEVELS: Record<number, LevelData> = {
  1: {
    enemies: [
      {
        id: 'moss_golem_1',
        name: 'Moss Golem',
        type: 'ENEMY',
        maxHealth: 800,
        attack: 400,
        defense: 620,
        baseDamage: 40,
        traitId: 'dangerous_smell',
        traitName: 'Dangerous Smell',
        traitDescription: '30% chance to inflict poison on hit. 10% of those poisons are lethal: deals 8% of your max HP per turn.',
      },
    ],
  },
  // Remaining levels will be filled in later
};

// Get emoji for enemy type
export function getEnemyEmoji(enemyName: string): string {
  if (enemyName.includes('Goblin')) return '👺';
  if (enemyName.includes('Orc')) return '🧟';
  if (enemyName.includes('Skeleton')) return '💀';
  if (enemyName.includes('Troll')) return '🧌';
  if (enemyName.includes('Bandit')) return '🗡️';
  if (enemyName.includes('Wraith')) return '👻';
  if (enemyName.includes('Ogre')) return '👹';
  if (enemyName.includes('Elite')) return '⚔️';
  if (enemyName.includes('King')) return '👑';
  // Stage 2 Emojis
  if (enemyName.includes('Shadow')) return '👤';
  if (enemyName.includes('Corrupted')) return '🐺';
  if (enemyName.includes('Alpha')) return '🐺';
  if (enemyName.includes('Dark')) return '🧙‍♂️';
  if (enemyName.includes('Void')) return '⚫';
  if (enemyName.includes('Nightmare')) return '👁️';
  if (enemyName.includes('Lich')) return '☠️';
  if (enemyName.includes('Hut')) return '🛖';
  if (enemyName.includes('Lizard')) return '🦎';
  if (enemyName.includes('Magma')) return '🌋';
  if (enemyName.includes('Golem')) return '🪨';
    if (enemyName.includes('Dragon')) return '🐉';
  if (enemyName.includes('Spider')) return '🕷️';
  if (enemyName.includes('Turtle')) return '🐢';
  if (enemyName.includes('Jester')) return '🃏';
  if (enemyName.includes('Fallen')) return '🛡️';
  if (enemyName.includes('Chaos')) return '🔥';
  if (enemyName.includes('Dragon')) return '🐉';
  if (enemyName.includes('Overlord')) return '👿';
  if (enemyName.includes('Inferno')) return '🔥';

  return '👾';
}
