export interface PatchNote {
    version: string;
    date: string;
    title: string;
    description: string;
    sections: {
        title: string;
        items: string[];
    }[];
}

export const PATCH_NOTES: PatchNote[] = [
        {
            version: '1.5.4',
            date: '2026-02-13',
            title: 'Artifact & Equipment Balance Patch',
            description: 'Major artifact and equipment nerfs/buffs for better game balance.',
            sections: [
                {
                    title: '🧰 Equipment Changes',
                    items: [
                        'All equipment base stats (except dodge chance) now break the stat cap.',
                        'Waving Cat no longer boosts speed.',
                        'Beer stats buff: +3 → +2, now also gives +2 to a random stat on crit.',
                        '4-Leaf Clover heal nerfed: 10 HP → 6 HP.',
                        'Hardened Chest-Plate shield buff: 10 → 12.',
                        'Dozens of Eggs cap reduced: 5 → 4.',
                        'Magma Overlord defense increased: 220 → 320.',
                    ]
                },
                {
                    title: '🎲 Artifact Changes',
                    items: [
                        'Lucky Charm boost nerfed: 8% → 5%.',
                        'Rubix Cube nerfed: 20% → 15%, max 3.',
                        'Sharp Razor nerfed: 20% → 18%.',
                        'Golden Apple heal nerfed: 8% → 6%, max 3.',
                        'Wooden Mask shield nerfed: 15 → 8.',
                        'Slime Boots nerfed: 25% → 10%.',
                        'Cap the amount of Golden Apple and Rubix Cube to 3.',
                        'Golden Apple and Rubix Cube now convert to another legendary artifact if you already own the maximum.',
                    ]
                },
                {
                    title: '🩹 Shop & Artifact Flow',
                    items: [
                        'Lucky Charm, Golden Apple, Rubix Cube, Wooden Mask, and Slime Boots removed from equipment shop (now artifacts only).',
                    ]
                }
            ]
        },
    {
        version: '1.5.3',
        date: '2026-02-13',
        title: 'Stage 3 Launch + Dual Gacha + Lucian Dusk',
        description: 'New stage, enemies, boss mechanics, gear flow, combat fixes, dual gachas, and Lucian Dusk with Soul-Shot + Soul Meter progression.',
        sections: [
            {
                title: '🌋 Stage 3 Content',
                items: [
                    'Added Stage 3 levels (1-16) with new encounters and pacing.',
                    'New enemies: Lava Hut spawner, Fire Lizard passive, Lava Spider ambush, Lava Pebble minions.',
                    'New boss: Magma Overlord',
                ]
            },
            {
                title: '⚔️ New & Updated Moves',
                items: [
                    'Added Stage 3 moves, including Standoff, Channeling, Pathfinder, Groundbreak, and Smite updates.',
                    'Move shop now shows all unlocked stage moves and supports re-buying earlier moves.',
                    'Move pricing overrides: Smite 60, Chain Lightning 100; Smite cannot crit.',
                ]
            },
            {
                title: '🎒 Stage 3 Loadout',
                items: [
                    'After Stage 2 boss, pick an extra equipment item and gain +50 max HP.',
                    'Run loadout now supports 3 equipment slots with confirm/skip flow.',
                    'Loadout UI shows currently equipped items and selected state.',
                ]
            },
            {
                title: '🎁 Rewards & Progression',
                items: [
                    'Stage 2 to Stage 3 transition flow added.',
                    'Stage 3 boss now routes to a 3-chest boss reward flow.',
                ]
            },
            {
                title: '🩹 Combat Fixes & Balance',
                items: [
                    'Standoff now properly skips enemy turns; Channeling grants guard and next-attack buff.',
                    'Pathfinder shields on multi-kill; Groundbreak heals on use.',
                    'Try Again now clears unfinished status effects; turtle answer now advances correctly.',
                    'Outrage scaling and Fire Tornado skip fixes applied; entrapment timing corrected.',
                    'Paladin basic attack buffed to 18 and Judgment to 35.',
                ]
            },
            {
                title: '🖥️ UI & Feedback',
                items: [
                    'Burn status now displays on the player card.',
                    'Move descriptions updated for Smite and Standoff/Channeling effects.',
                ]
            },
            {
                title: '✨ Dual Gacha System',
                items: [
                    'Anime Prism gacha: 50 diamonds per roll, 0.5% odds, 100-roll pity guarantee',
                    'Japanese Mountainscape gacha: 50 diamonds per roll, 0.5% odds, 100-roll pity guarantee',
                    'Each gacha has independent roll tracking and pity counters',
                    'First-day discount: 50% off for 24 hours per gacha (25 diamonds per roll)',
                    'Draw One and Draw Ten buttons available for both gachas',
                ]
            },
            {
                title: '🎨 Exclusive Styles',
                items: [
                    'Anime Prism: Cel-shaded glow with pastel prism flares and star effects',
                    'Japanese Mountainscape: Serene misty mountains with cherry blossoms',
                    'Selected styles persist across all game screens (Menu, Hero Select, Combat)',
                    'Full-screen artwork backgrounds with atmospheric effects',
                ]
            },
            {
                title: '🎯 Gacha UI Improvements',
                items: [
                    'Gacha buttons added to main menu with style-specific colors',
                    'Independent pity progress tracking for each gacha type',
                    'Style badges display correctly without text wrapping',
                    'Spotlight banner shows preview artwork for each exclusive style',
                ]
            },
            {
                title: '🕶️ New Hero: Lucian Dusk',
                items: [
                    'Added Lucian Dusk to the Gunslinger roster.',
                    'Lucian uses a Soul Meter (max 5000).',
                    'Lucian gains +5 Soul on non-minion enemy kill.',
                    'Lucian gains bonus attack from Soul Meter progression.',
                ]
            },
            {
                title: '🎯 Soul-Shot Move',
                items: [
                    'Added Soul-Shot to Lucian: fires 2-6 bullets at 14 base damage per bullet.',
                    'Soul-Shot now routes through its own move handler and matches Gunslinger multi-shot flow.',
                    'Each Soul-Shot bullet hit now grants +1 Soul (capped at 5000).',
                    'Added per-shot combat feedback: “🟣 Soul +1”.',
                ]
            },
            {
                title: '🧠 Crit Bullet Fixes',
                items: [
                    'Fixed Soul-Shot incorrectly triggering pre-attack gunslinger bullet spending (+cost) before firing.',
                    'Soul-Shot is now excluded from unified pre-attack gunslinger bullet increment logic (same handling approach as other multi-shot moves).',
                    'Resolved critical bullet marker jumping/disappearing behavior caused by mixed counting paths.',
                    'Critical chamber progression now tracks correctly from actual bullets fired by Soul-Shot.',
                ]
            }
        ]
    },
    {
        version: '1.5.2',
        date: '2026-02-12',
        title: 'Balance Hotfix',
        description: 'Small balance adjustments and reward tuning.',
        sections: [
            {
                title: '⚖️ Balance Updates',
                items: [
                    'Chinese Waving Cat now grants a stat boost every 12 coins spent (was every 2).',
                    'Illegal Shop artifact prices increased: Rare 180→240, Legendary 300→360.',
                    'Iron Cage cooldown increased from 2 to 3 turns.',
                    'Enemy gold drops reduced by 50% (6–10 per defeat).',
                    'Angelic Wings dodge cap reduced from 75% to 65%.',
                    'Strengthen now counts as a buff move (max 3 uses per level).',
                    'Lord Inferno rage meter threshold reduced from 4 to 3.',
                    'Training base attack increase reduced from 15 to 5; shop training now costs 18.',
                ]
            },
            {
                title: '🎁 Rewards',
                items: [
                    'Lord Inferno now opens two boss chests sequentially after defeat.',
                ]
            },
            {
                title: '🧰 Equipment Fixes',
                items: [
                    'Dozens of Eggs per-turn Max HP gain and Salmonella proc restored.',
                ]
            },
            {
                title: '🩹 Combat Fixes',
                items: [
                    'Aldric no longer freezes the turn when gaining Max HP after a kill with multiple enemies alive.',
                    'Thorny Aura reflect kills no longer freeze combat flow.',
                ]
            }
        ]
    },
    {
        version: '1.5.1',
        date: '2026-02-12',
        title: 'Pirate Bay Splash!',
        description: 'New equipment and artifacts, expanded shop layouts, and hero select improvements with item and combat polish.',
        sections: [
            {
                title: '🧰 New Equipment (6)',
                items: [
                    'Blood Vile: +5% lifesteal, +5% crit chance; crit lifesteal is doubled',
                    'Chinese Waving Cat: Start with 100 gold; every 20 coins spent grants a random stat (ignores caps)',
                    'Angelic Wings: +25 Speed; dodge cap raised from 60% to 75%',
                    'Crab Claws: +30% Defense multiplier; disables one random usable move per turn',
                    'Sharp Razor: +20% crit chance; 8% chance to guarantee next crit after a crit',
                    'Gasoline Can: -30% Defense cap, +30% Attack cap; +30% attack multiplier',
                ]
            },
            {
                title: '🏴‍☠️ New Hero - Dearborn',
                items: [
                    'Dearborn "Wave Surfer" Winmore joins the Warrior roster',
                    'Passive: Using any skill other than Strike upgrades Strike into Wave Crash (AOE)',
                    'Tide Call: Next attack deals +50% damage and heals 20% max HP',
                ]
            },
            {
                title: '🏆 New Artifacts (3)',
                items: [
                    'Golden Crown: 1% chance to instantly kill an enemy at the start of your turn (kills all enemies on proc)',
                    'Slime Boots: Reduces the first hit you take each level by 25% (caps at 50%)',
                    'Pirates\' Chest: Grants immediate loot; chest odds become 55% Common / 30% Rare / 15% Legendary',
                ]
            },
            {
                title: '⚙️ Equipment Effects',
                items: [
                    'Blood Vile lifesteal now applies to every hit, including multi-shot gunslinger attacks',
                    'Crab Claws move disable now shows in the move list and respects cooldowns/resources',
                    'Chinese Waving Cat stat boosts now apply on all shop and move purchases (20-coin proc)',
                    'Angelic Wings dodge cap applied to final dodge calculation (hard cap at 75%)',
                    'Gasoline Can caps now scale off stage caps (150/300) with +30% ATK and -30% DEF',
                ]
            },
            {
                title: '🛡️ Blue Tinted Glasses Fix',
                items: [
                    'Now grants +5 Speed and +10 Max HP flat stats',
                    'Passive remains: +8 mana/energy per turn and +8 on kill',
                ]
            },
            {
                title: '🎲 Artifact Adjustments',
                items: [
                    'Lucky Charm now boosts the highest stat among Attack, Defense, or Speed only (no HP)',
                    'Finished Rubix Cube now correctly grants +20% Attack and +20% Defense',
                    'Enemy artifact drops: 1% Legendary, 5% Rare',
                ]
            },
            {
                title: '🌹 Combat Balance',
                items: [
                    'Thorny Aura reflect now calculates off pre-defense damage so high defense does not nullify reflect',
                    'Goblin King now applies weakness to the player during Desperation (not to itself)',
                    'Goblin King max HP reduced by 25',
                    'Goblin King defense reduced by 10',
                    'Goblin King rage meter threshold increased to 4',
                    'Goblin King base attack reduced by 15',
                ]
            },
            {
                title: '💰 Gold & Rewards',
                items: [
                    'Enemy gold drops increased to 12–20 per defeat (was 4–12)',
                    'Jackpot: 5% chance on enemy defeat to gain +50 bonus gold',
                    'End-of-level gold rewards increased to 25 (Stage 1) and 30 (Stage 2)',
                ]
            },
            {
                title: '🛒 Shop UI Updates',
                items: [
                    'Equipment Shop grid expanded and scrollable',
                    'Equipment Shop header/footer are fixed while content scrolls',
                    'Main Shop scroll behavior improved',
                ]
            },
            {
                title: '🧰 Loot UI',
                items: [
                    'Pirates\' Chest now reveals its loot with an on-screen popup',
                ]
            },
            {
                title: '🕵️ Illegal Shop',
                items: [
                    'Illegal Shop opens for Dearborn with expanded inventory',
                    'Two random items are discounted by 30% each time the shop opens',
                    'Artifacts available for purchase: Rare (180 gold) and Legendary (300 gold)',
                ]
            },
            {
                title: '🚢 Smuggled Goods',
                items: [
                    'Sugarcane: Heal 80 HP (35 gold)',
                    'Rum: Gain 50 Shield and stun an enemy (50 gold)',
                    'Rope: 40% chance to skip the level (50 gold, no boss fights)',
                    'Pirate\'s Ship: Gain 300 Shield and +40 Speed while shield holds (400 gold)',
                ]
            },
            {
                title: '🧑‍🚀 Hero Select Layout',
                items: [
                    'Equipment loadout moved to the right side of hero cards',
                    'Layout centered with improved spacing and scroll behavior',
                ]
            },
            {
                title: '🎨 Background Styles & Shop',
                items: [
                    'New Background Shop with a dedicated Styles tab (themes by update)',
                    'Style switching added: Classic removes decorative layers, Pirate Tide keeps them',
                    'New backgrounds added: Aurora Borealis (with subtle shooting star), Anime Skies',
                ]
            },
            {
                title: '📊 Stat Tooltips',
                items: [
                    'Attack stat tooltip now shows base crit (5% / 25% rogue) + item crit bonuses',
                    'Speed tooltip shows dodge cap (60% or 75% with Angelic Wings) and total dodge chance',
                ]
            }
        ]
    },
    {
        version: '1.4.4',
        date: '2026-02-12',
        title: 'Boss & Paladin Overhaul + Quality of Life',
        description: 'Major balance adjustments for Bosses and Paladins, plus new features for Clyde and Wolfgang, and improved UI/UX.',
        sections: [
            {
                title: '👑 Boss Balance Updates',
                items: [
                    'Goblin King Rage Threshold: 5 → 3 stacks (charges rage meter faster)',
                    'Goblin King Defense: 35 → 90 (significantly more durable)',
                ]
            },
            {
                title: '⚔️ Gunslinger Class Nerfs',
                items: [
                    'All Gunglingers: -10 Speed (Clint 46→36, Fredrinn 48→38, Johnny 44→34)',
                    'PEW: 30 → 24 damage',
                    '6-Round: 18 → 14 damage, shot range 1-6 → 2-6 bullets',
                    'Bullet Storm: 18 → 14 damage, fixed 8 shots → dynamic 3-8 shots',
                    'Johnny Silverhand: Extra bullet every other turn → every turn',
                ]
            },
            {
                title: '⚔️ Warrior Class Rework',
                items: [
                    'Aldric Iron Will: +2 defense per kill → +5 Max HP per enemy defeated',
                    'Thora Battle Rage: +5% damage per 10% HP lost → 50% more damage if below 50% HP',
                    'Gareth Endurance: 2 HP per turn regen → 20 HP at level start (overflow becomes shield)',
                ]
            },
            {
                title: '🎺 Paladin Class Adjustments',
                items: [
                    'Seraphina Divine Grace: 3 HP when using Block → 2 HP every turn (passive regen)',
                    'Lyanna Righteous Fury: +10% damage to enemies below 50% HP → 20% chance to burn enemies when attacked',
                ]
            },
            {
                title: '🛡️ Equipment Updates',
                items: [
                    'Movie Theater Popcorn → Dozens of Eggs (🍿 → 🥚 emoji)',
                ]
            },
            {
                title: '👻 Clyde Quality of Life',
                items: [
                    'OUTRAGE: Now supports mouse clicks in addition to Space key spam',
                    'OUTRAGE Skip Button: New feature allows skipping the minigame to deal 65 damage instantly',
                    'OUTRAGE Skip: Still shows the explosion animation before ending turn',
                ]
            },
            {
                title: '🎼 Wolfgang Quality of Life',
                items: [
                    'Rhythm Game Skip: X button now skips and grants 25 notes + 10 shield',
                    'Rhythm Game Skip now properly adds 25 points to Wolfgang\'s burst meter',
                ]
            },
            {
                title: '🐛 Bug Fixes',
                items: [
                    'Fixed Aldric\'s Max HP bonus not applying (state management issue)',
                    'Fixed enemies attacking twice per turn (turn-ending conditional logic)',
                    'Fixed Clyde OUTRAGE skip freezing combat (added proper animation delays)',
                    'Fixed Wolfgang rhythm skip freezing combat (added state update delay)',
                ]
            }
        ]
    },
    {
        version: '1.4.3',
        date: '2026-02-12',
        title: 'Mage Overhaul',
        description: 'A comprehensive overhaul of all mage heroes with stat buffs, redesigned passives, and powerful new signature moves.',
        sections: [
            {
                title: '✨ Mage Class Buffs',
                items: [
                    'All Mages: +7 Attack, -5 Speed (stronger spellcasting, less evasive)',
                    'Elara: 59 ATK, 20 SPD | Zephyr: 61 ATK, 22 SPD | Meryn: 57 ATK, 18 SPD',
                ]
            },
            {
                title: '🔮 Passive Ability Redesigns',
                items: [
                    'Elara - Arcane Mastery: Spells have 15% chance to proc extra effects (burn, stun, poison, freeze, weaken)',
                    'Zephyr - Dark Pact: At 100 mana you will guarantee a critical hit',
                    'Meryn - Permafrost: At the start of each level your health bar is frozen. First attack breaks the ice & negates ALL damage',
                ]
            },
            {
                title: '⛈️ New Signature Moves',
                items: [
                    'Elara - Weather Ball: 30 damage to ALL enemies (25 mana). 15% chance to inflict random effect (poison, burn, weaken, stun, freeze 1-3 turns)',
                    'Zephyr - Iron-Cage: 10 damage to one enemy (20 mana). Guaranteed stun + x4 crit damage multiplier',
                    'Meryn - Ice Storm: 80 damage to ALL enemies over 5 turns (30 mana). 16 damage per turn for strategic control',
                ]
            },
            {
                title: '👻 New Hero - Clyde Grimshaw',
                items: [
                    'Added Clyde Grimshaw: A duality-form hero with unique stat-swapping mechanics',
                    'Soul Keeper Passive: Defense converts to Attack in Ghoul form (finalAttack = baseAttack + (defense × 2))',
                    'Duality Meter: Tracks transformation state with visual sword symbols',
                    'Exclusive Move - Like Turtle Without Its Shell: 10 damage to all enemies (60 mana)',
                    'Exclusive Move - OUTRAGE: Devastating multi-phase attack with smooth screen shake animations',
                    'Stat Swapping: Clyde cannot gain attack upgrades (stat conversions prevent stacking)',
                    'UI Polish: Blue glowing sword meter, crystal soul counter, animated fire border at full charge',
                ]
            }
        ]
    },
    {
        version: '1.4.2',
        date: '2026-02-11',
        title: 'Balance & Polish Update',
        description: 'A major update focusing on game balance, bug fixes, and refining the "Lord Inferno" boss fight.',
        sections: [
            {
                title: '🔥 Lord Inferno Boss Update',
                items: [
                    'Added "Power Meter" mechanic: The boss now gains a stack each turn.',
                    'At 5 stacks, Lord Inferno gets a GUARANTEED CRITICAL HIT on his next attack.',
                    'Added UI indicator under the boss to track power stacks.',
                ]
            },
            {
                title: '⚖️ Game Balance',
                items: [
                    'Shop: Attack & Defense Training cost reduced from 15 to 8.',
                    'Critical Hits now ignore 50% of enemy defense (was 100%).',
                    'RPS Draws no longer penalize the player (no effect).',
                    'Cedric\'s Sleep status now correctly skips the turn.',
                ]
            },
            {
                title: '⚔️ Move Updates',
                items: [
                    'Chain Lightning: Buffed damage to 50, now hits ALL enemies, and guarantees a Stun. Cooldown increased to 5 turns.',
                    'Chain Lightning moved to Stage 2 pool.',
                    'Smite moved to Stage 1 pool.',
                    'Smite bug fixes applied.',
                ]
            },
            {
                title: '🎒 Item Updates',
                items: [
                    'Unholy Headpiece: Now costs 5% Max HP (was higher), deals 1.4x Damage.',
                    'Thorny Aura: Now grants +50 Starting Shield and reflects 12% damage taken.',
                    'Beer: Now grants +3 to a random stat (HP, Atk, Def) at start of level + 5% Crit Chance.',
                    'Ring of Power: Base execute threshold is 10%. Now gains +0.5% threshold per successful execute!',
                    '4-Leaf Clover: Now gives +10 Speed.',
                    'Ancient Runes: Replaced +10% Dodge with +10% Crit Chance.',
                ]
            },
            {
                title: '🐛 Bug Fixes',
                items: [
                    'Fixed Shield generation exceeding stat caps.',
                    'Fixed Death Screen scaling issues on smaller screens.',
                    'General stability improvements.',
                ]
            }
        ]
    },
    {
        version: '1.4.1',
        date: '2026-02-10',
        title: 'Wolfgang Rhythm Update',
        description: 'Refined the rhythm game mechanics for the Bard class.',
        sections: [
            {
                title: 'Changes',
                items: [
                    'Wolfgang\'s Drum Minigame now has a tighter hit window for "Perfect" hits.',
                    'Added preparation time before note falling starts.',
                    'Increased overall scroll speed for better challenge.',
                ]
            }
        ]
    }
];
