export interface BackgroundOption {
  id: string;
  name: string;
  cost: number;
  style: string;
  description: string;
}

export const DEFAULT_BACKGROUND_ID = 'pirate-dawn';

export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    id: 'pirate-dawn',
    name: 'Pirate Dawn',
    cost: 0,
    style: 'linear-gradient(180deg, rgba(18,126,150,1) 0%, rgba(10,88,105,1) 48%, rgba(10,74,88,1) 68%, rgba(8,56,68,1) 100%)',
    description: 'Warm sea breeze and a bright horizon.',
  },
  {
    id: 'ember-dusk',
    name: 'Ember Dusk',
    cost: 120,
    style: 'linear-gradient(180deg, #3b1218 0%, #7a1f25 40%, #bf5a26 70%, #f4a261 100%)',
    description: 'A fiery sunset with smoky glow.',
  },
  {
    id: 'azure-veil',
    name: 'Azure Veil',
    cost: 160,
    style: 'linear-gradient(180deg, #0b1b3a 0%, #143d6b 45%, #1b6ca8 70%, #2ab0d8 100%)',
    description: 'Deep blues with shimmering mist.',
  },
  {
    id: 'emerald-reef',
    name: 'Emerald Reef',
    cost: 200,
    style: 'linear-gradient(180deg, #0b3b2e 0%, #0f5a44 45%, #1b7a59 70%, #4ecf9f 100%)',
    description: 'Cool greens with a tropical glow.',
  },
  {
    id: 'moonlit-harbor',
    name: 'Moonlit Harbor',
    cost: 240,
    style: 'linear-gradient(180deg, #0c1020 0%, #1b2642 45%, #263a5f 70%, #6c7ea6 100%)',
    description: 'Quiet night with a silver sheen.',
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    cost: 280,
    style: 'radial-gradient(circle at 12% 20%, rgba(255,255,255,0.25) 0 2px, transparent 3px), radial-gradient(circle at 30% 14%, rgba(255,255,255,0.2) 0 1.5px, transparent 3px), radial-gradient(circle at 78% 18%, rgba(255,255,255,0.22) 0 2px, transparent 3px), radial-gradient(circle at 64% 32%, rgba(255,255,255,0.18) 0 1.5px, transparent 3px), radial-gradient(circle at 22% 48%, rgba(255,255,255,0.18) 0 1.5px, transparent 3px), radial-gradient(120% 70% at 10% 60%, rgba(124,231,197,0.35) 0%, rgba(124,231,197,0.0) 60%), radial-gradient(120% 70% at 55% 52%, rgba(64,224,208,0.3) 0%, rgba(64,224,208,0.0) 62%), radial-gradient(120% 70% at 92% 45%, rgba(80,255,190,0.28) 0%, rgba(80,255,190,0.0) 65%), linear-gradient(180deg, #050b1a 0%, #0b1f3a 35%, #16365a 55%, #1b5a6a 72%, #2a7f75 100%)',
    description: 'Northern lights across a midnight sky.',
  },
  {
    id: 'anime-skies',
    name: 'Anime Skies',
    cost: 260,
    style: 'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.7) 0 36px, rgba(255,255,255,0.0) 45px), radial-gradient(circle at 78% 24%, rgba(255,255,255,0.45) 0 22px, rgba(255,255,255,0.0) 34px), radial-gradient(circle at 30% 36%, rgba(255,255,255,0.18) 0 70px, rgba(255,255,255,0.0) 120px), linear-gradient(180deg, #7dd3fc 0%, #93c5fd 35%, #a5b4fc 58%, #f9a8d4 78%, #fef3c7 100%)',
    description: 'Soft pastel skies with dreamy light blooms.',
  },
  {
    id: 'steel-horizon',
    name: 'Steel Horizon',
    cost: 300,
    style: 'linear-gradient(180deg, #0b1118 0%, #151f2b 35%, #2a3a4d 60%, #5b738a 85%, #9aa8b5 100%)',
    description: 'Cold steel skies with a muted industrial glow.',
  },
  {
    id: 'neon-foundry',
    name: 'Neon Foundry',
    cost: 340,
    style: 'radial-gradient(120% 80% at 80% 20%, rgba(255,74,141,0.35) 0%, rgba(255,74,141,0.0) 55%), radial-gradient(120% 80% at 20% 25%, rgba(0,255,209,0.28) 0%, rgba(0,255,209,0.0) 60%), linear-gradient(180deg, #0b0f16 0%, #141a26 35%, #1e2a3a 60%, #2a3b4f 85%, #3b4f66 100%)',
    description: 'Furnace glow with neon vapor trails.',
  },
  {
    id: 'smogline',
    name: 'Smogline',
    cost: 320,
    style: 'linear-gradient(180deg, #0e141a 0%, #1d262e 30%, #3a3f43 55%, #6a6b63 78%, #9c9a8d 100%)',
    description: 'Haze and soot over a dim city horizon.',
  },
  {
    id: 'chrome-dusk',
    name: 'Chrome Dusk',
    cost: 360,
    style: 'linear-gradient(180deg, #0a0f14 0%, #141b24 28%, #2d3642 52%, #5f6c7a 76%, #b5c0c9 100%)',
    description: 'Polished metal tones with a dusk sheen.',
  },
  {
    id: 'oil-slick',
    name: 'Oil Slick',
    cost: 380,
    style: 'radial-gradient(120% 90% at 50% 10%, rgba(120,255,214,0.18) 0%, rgba(120,255,214,0.0) 55%), radial-gradient(120% 90% at 20% 70%, rgba(255,192,102,0.2) 0%, rgba(255,192,102,0.0) 60%), radial-gradient(120% 90% at 80% 65%, rgba(171,120,255,0.22) 0%, rgba(171,120,255,0.0) 60%), linear-gradient(180deg, #0a0d12 0%, #111722 35%, #1b2430 60%, #2a3646 82%, #3f4a58 100%)',
    description: 'Iridescent sheen over dark refinery skies.',
  },
];

export const getBackgroundById = (id: string) =>
  BACKGROUND_OPTIONS.find((background) => background.id === id) ?? null;
