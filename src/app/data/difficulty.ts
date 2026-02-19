export type Difficulty = 'easy' | 'normal' | 'hard' | 'nightmare';

export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; hpMod: number; atkMod: number; goldMod: number; description: string; color: string }> = {
    easy: {
        label: 'Easy',
        hpMod: 0.8,
        atkMod: 0.8,
        goldMod: 0.8,
        description: 'For those who want a relaxed journey.',
        color: 'text-green-400'
    },
    normal: {
        label: 'Normal',
        hpMod: 1.0,
        atkMod: 1.0,
        goldMod: 1.0,
        description: 'The standard adventure experience.',
        color: 'text-blue-400'
    },
    hard: {
        label: 'Hard',
        hpMod: 1.3,
        atkMod: 1.3,
        goldMod: 1.2,
        description: 'Enemies are tougher. Rewards are greater.',
        color: 'text-orange-400'
    },
    nightmare: {
        label: 'Nightmare',
        hpMod: 1.6,
        atkMod: 1.6,
        goldMod: 1.5,
        description: 'Only for the truly fearless.',
        color: 'text-red-500'
    }
};
