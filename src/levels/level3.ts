import { LevelData } from './types';

// Club 2100 — Mid-tier prestige. Earned, not given.
// Industrial neon orange. Multi-platform chaos.
export const level3: LevelData = {
  club: 2100,
  bgPrimary:   0x0d0a04,
  bgSecondary: 0x1a1205,
  accentColor: 0xff7700,

  playerStart: { x: 80, y: 390 },

  platforms: [
    // Ground
    { x: 0,   y: 430, width: 800, height: 20 },
    // Low flanks
    { x: 35,  y: 372, width: 120, height: 12 },
    { x: 645, y: 372, width: 120, height: 12 },
    // Mid
    { x: 75,  y: 302, width: 140, height: 12 },
    { x: 325, y: 292, width: 160, height: 12 },
    { x: 575, y: 302, width: 140, height: 12 },
    // Upper flanks
    { x: 150, y: 232, width: 140, height: 12 },
    { x: 505, y: 232, width: 140, height: 12 },
    // High flanks
    { x: 55,  y: 152, width: 120, height: 12 },
    { x: 625, y: 152, width: 120, height: 12 },
    // Top
    { x: 320, y: 58,  width: 160, height: 12 },
  ],

  players: [
    { number: 1,  x: 130, y: 415 },
    { number: 2,  x: 450, y: 415 },
    { number: 3,  x: 65,  y: 357 },
    { number: 4,  x: 95,  y: 357 },   // low-left
    { number: 5,  x: 680, y: 357 },
    { number: 6,  x: 145, y: 286 },   // mid-left
    { number: 7,  x: 620, y: 286 },
    { number: 8,  x: 185, y: 216 },
    { number: 9,  x: 560, y: 216 },   // upper-right
    { number: 10, x: 400, y: 42  },   // top platform
    { number: 11, x: 460, y: 42  },
  ],

  enemies: [
    // Clippy patrols ground
    {
      type: 'clippy',
      x: 300,
      y: 407,
      patrolLeft: 80,
      patrolRight: 620,
    },
    // Melonhead roams the arena with physics
    {
      type: 'melonhead',
      x: 400,
      y: 28,
      patrolLeft: 60,
      patrolRight: 740,
    },
    // Butter Fingers jumps between high flanks
    {
      type: 'butter-fingers',
      x: 115,
      y: 124,
      posA: { x: 115, y: 124 },
      posB: { x: 685, y: 124 },
    },
    // Padel Punisher stands on bottom-right flank platform (y=372), serves left
    {
      type: 'padel-punisher',
      x: 740,
      y: 349,
    },
  ],
};
