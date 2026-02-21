export interface EquipmentItem {
    id: string;
    name: string;
    description: string;
    passiveDescription: string;
    cost: number;
    icon: string;
    flatStats?: {
        attack?: number;
        defense?: number;
        health?: number;
        speed?: number;
        crit?: number;
    };
    onCritGrantRandomStat?: number;
    unavailableClasses?: string[];
    ignoreStatCap?: boolean;
}

export const EQUIPMENT_ITEMS: EquipmentItem[] = [
    {
        id: 'hardened_chestplate',
        name: 'Hardened Chestplate',
        description: '+20 Defense',
        passiveDescription: 'Gain 12 Shield at the start of every level.',
        cost: 120,
        icon: '🛡️',
        flatStats: { defense: 20 },
        ignoreStatCap: true,
    },
    {
        id: 'four_leaf_clover',
        name: '4-Leaf Clover',
        description: '+10 Speed',
        passiveDescription: 'Heal 4 HP whenever you dodge an attack.',
        cost: 90,
        icon: '🍀',
        flatStats: { speed: 10 },
        ignoreStatCap: true,
    },
    {
        id: 'ring_of_power',
        name: 'Ring of Power',
        description: '+20 Attack',
        passiveDescription: 'Instantly kill any enemy below 10% of their max HP. Every kill raise the threshold by 0.5%.',
        cost: 120,
        icon: '💍',
        flatStats: { attack: 20 },
        ignoreStatCap: true,
    },
    {
        id: 'beer',
        name: 'Beer',
        description: '+5% Crit Chance',
        passiveDescription: 'Gain +3 to a random stat (HP, Atk, Def, Spd) at start of every level. Also gain +2 to a random stat on crit.',
        cost: 60,
        icon: '🍺',
        flatStats: { crit: 5 },
        onCritGrantRandomStat: 2,
        ignoreStatCap: true,
    },
    {
        id: 'unholy_headpiece',
        name: 'Unholy Headpiece',
        description: '+10 Attack, +10 Defense.',
        passiveDescription: 'Attacking moves cost 5% of your max HP, but deal +40% damage.',
        cost: 200,
        icon: '👹',
        flatStats: { attack: 10, defense: 10 },
        ignoreStatCap: true,
    },

    {
        id: 'thorny_aura',
        name: 'Thorny Aura',
        description: '+10 Defense',
        passiveDescription: 'Start combat with 50 Shield. Reflect 12% of damage taken back at attacker.',
        cost: 100,
        icon: '🌹',
        flatStats: { defense: 10 },
        ignoreStatCap: true,
    },
    {
        id: 'blue_tinted_glasses',
        name: 'Blue Tinted Glasses',
        description: '+5 Speed, +10 Max HP.',
        passiveDescription: 'Recover an extra 8 mana/energy per turn and 8 every time you get a kill.',
        cost: 120,
        icon: '🕶️',
        flatStats: { speed: 5, health: 10 },
        unavailableClasses: ['gunslinger'],
        ignoreStatCap: true,
    },
    {
        id: 'ancient_rune_stone',
        name: 'Ancient Rune Stone',
        description: '+10% Crit Chance',
        passiveDescription: 'Landing a natural crit guarantees you will dodge the next attack.',
        cost: 200,
        icon: '🪨',
    },
    {
        id: 'movie_popcorn',
        name: 'Dozens of Eggs',
        description: 'No Base Stats',
        passiveDescription: 'Increase Max HP by 1 every turn (Max 4/level). 5% chance for +12 HP & Max HP, but risks Salmonella (-20% HP).',
        cost: 200,
        icon: '🥚',
    },
    {
        id: 'blood_vile',
        name: 'Blood Vile',
        description: '+5% Lifesteal, +5% Crit Chance',
        passiveDescription: 'Gain 5% lifesteal on all attacks. When you crit, the lifesteal effect is doubled.',
        cost: 200,
        icon: '🩸',
    },
    {
        id: 'chinese_waving_cat',
        name: 'Chinese Waving Cat',
        description: 'Start with 100 gold',
        passiveDescription: 'Gain a random stat boost (HP, ATK, DEF) for every 12 coins you spend in shop. Can exceed normal stat caps.',
        cost: 300,
        icon: '🐱',
        ignoreStatCap: true,
    },
    {
        id: 'angelic_wings',
        name: 'Angelic Wings',
        description: '+25 Speed',
        passiveDescription: 'Your dodge chance cap is increased from 60% to 65%.',
        cost: 300,
        icon: '😇',
        flatStats: { speed: 25 },
    },
    {
        id: 'crab_claws',
        name: 'Crab Claws',
        description: '+30% Defense',
        passiveDescription: 'Gain permanent 30% more defense. One of your moves is randomly disabled each turn.',
        cost: 200,
        icon: '🦀',
        flatStats: { defense: 30 },
        ignoreStatCap: true,
    },
    {
        id: 'sharp_razor',
        name: 'Sharp Razor',
        description: '+18% Crit Chance',
        passiveDescription: 'After landing a critical hit, you have an 8% chance to guarantee a critical hit on your next turn.',
        cost: 300,
        icon: '🪒',
    },
    {
        id: 'gasoline_cane',
        name: 'Gasoline Can',
        description: '-30% Defense',
        passiveDescription: 'Your defense cap is reduced by 30%, but you gain a permanent +30% attack buff.',
        cost: 200,
        icon: '🔥',
    },
    {
        id: 'fairy_bell',
        name: 'Fairy Bell',
        description: '+8% Lifesteal',
        passiveDescription: 'Lifesteal 8% of damage dealt. Every enemy kill will heal you 10 HP.',
        cost: 200,
        icon: '🔔',
    },
];

export function getEquipmentItem(id: string): EquipmentItem | undefined {
    return EQUIPMENT_ITEMS.find(item => item.id === id);
}
