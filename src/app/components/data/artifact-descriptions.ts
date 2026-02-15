// Centralized artifact descriptions for tooltips
export const ARTIFACT_DESCRIPTIONS: Record<string, string> = {
  golden_apple: 'Heals you 8% of your max HP each turn.',
  golden_crown: 'At the end of each level, you have a 1% chance to be healed to full health.',
  finished_rubix_cube: 'Increases both your defense and attack stats by 15% permanently.',
  disco_ball: '20% chance to skip all enemy turns each round. Stacks up to 2 times.',
  lucky_charm: 'Increases your highest stat by 5% permanently.',
  wooden_mask: 'Gain 8 shield at the start of each level.',
  slime_boots: 'Reduces the first attack you take each level by 10% (up to a maximum of 50%).',
  pirates_chest: 'Awards a random artifact or loot when found.',
  turtle_shell: 'Reduces all damage taken by 5%.',
};

// Centralized debuff descriptions for tooltips
export const DEBUFF_DESCRIPTIONS: Record<string, string> = {
  weakened: 'You deal 50% less damage while this is active.',
  webbed: 'Your speed is halved while this is active.',
  burning: 'You take 5% of your max HP as damage at the end of each turn.',
};
