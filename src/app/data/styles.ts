export interface StyleOption {
  id: string;
  name: string;
  description: string;
  badge: string;
  source: 'base' | 'gacha' | 'gift';
}

export const BASE_STYLE_IDS = ['classic', 'pirate'] as const;

// Main gacha pool
export const GACHA_STYLE_IDS = [
  'anime-prism',
  'japanese-mountainscape',
] as const;
export const GACHA_STYLE_ID = 'anime-prism'; // Primary gacha

// New gacha pool for Fairy-meeting and Graceful-sleep
export const FAIRY_GACHA_STYLE_IDS = [
  'fairy-meeting',
  'Graceful-sleep',
] as const;
export const FAIRY_GACHA_STYLE_ID = 'fairy-meeting';

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'The original gradient with no extra designs.',
    badge: 'Always Available',
    source: 'base',
  },
  {
    id: 'pirate',
    name: 'Pirate Tide',
    description: 'Sun, beach, ships, and warm sea glow.',
    badge: 'Update Exclusive',
    source: 'base',
  },
  {
    id: 'anime-prism',
    name: 'Anime Prism',
    description: 'Cel-shaded glow with pastel prism flares and star trails.',
    badge: 'Gacha Exclusive',
    source: 'gacha',
  },
  {
    id: 'japanese-mountainscape',
    name: 'Japanese Mountainscape',
    description: 'Serene misty mountains with cherry blossoms and ancient temples.',
    badge: 'Gacha Exclusive',
    source: 'gacha',
  },
  {
    id: 'fairy-forest',
    name: 'Fairy Forest',
    description: 'A magical woodland with glowing flora and gentle spirits.',
    badge: 'Update v1.6.1 Gift',
    source: 'gift',
  },
  {
    id: 'fairy-meeting',
    name: 'Fairy Meeting',
    description: 'A vibrant, stylized world with bold lines and anime-inspired colors.',
    badge: 'Gacha Exclusive',
    source: 'gacha',
  },
  {
    id: 'Graceful-sleep',
    name: 'Graceful Sleep',
    description: 'A dreamy, tranquil scene evoking peaceful slumber and gentle hues.',
    badge: 'Gacha Exclusive',
    source: 'gacha',
  },
];

export const getStyleById = (id: string) =>
  STYLE_OPTIONS.find((style) => style.id === id) ?? null;
