import { Sword, Wand2, UserX, Shield as ShieldIcon, Target, Swords, Sparkles } from 'lucide-react';

export interface ClassType {
  id: string;
  name: string;
  description: string;
  icon: typeof Sword;
}

export const CLASSES: ClassType[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Masters of melee combat with high health and powerful physical attacks',
    icon: Sword,
  },
  {
    id: 'mage',
    name: 'Mage',
    description: 'Wielders of arcane magic with devastating spells and area damage',
    icon: Wand2,
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description: 'Swift assassins with high speed and deadly critical strikes',
    icon: UserX,
  },
  {
    id: 'paladin',
    name: 'Paladin',
    description: 'Holy warriors combining defense with healing and righteous damage',
    icon: ShieldIcon,
  },
  {
    id: 'gunslinger',
    name: 'Gunslinger',
    description: 'Masters of firearms with high attack and speed, but vulnerable defense',
    icon: Swords,
  },
  {
    id: 'duality',
    name: 'Duality',
    description: 'Martial artists who can transform into primal beasts when their meter is full.',
    icon: Sparkles,
  },
  {
    id: 'brawler',
    name: 'Brawler',
    description: 'Relentless fighters who use Stamina to unleash devastating combos in a single turn.',
    icon: Swords,
  },
];
