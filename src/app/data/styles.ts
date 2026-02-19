export interface StyleOption {
  id: string;
  name: string;
  description: string;
  badge: string;
  source: 'base' | 'gacha' | 'gift';
}

export const BASE_STYLE_IDS = ['classic', 'pirate'] as const;
export const GACHA_STYLE_IDS = ['anime-prism', 'japanese-mountainscape'] as const;
export const GACHA_STYLE_ID = 'anime-prism'; // Primary gacha

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
    badge: 'Current Update',
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
    badge: 'v1.6.1 Gift',
    source: 'gift',
  },
];

export const getStyleById = (id: string) =>
  STYLE_OPTIONS.find((style) => style.id === id) ?? null;
