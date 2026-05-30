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
    // Low
    { x: 35,  y: 372, width: 120, height: 12 },
    { x: 645, y: 372, width: 120, height: 12 },
    { x: 240, y: 372, width: 160, height: 12 },
    // Mid
    { x: 75,  y: 302, width: 140, height: 12 },
    { x: 325, y: 292, width: 160, height: 12 },  // Padel Punisher platform
    { x: 575, y: 302, width: 140, height: 12 },
    // Upper
    { x: 150, y: 232, width: 140, height: 12 },
    { x: 505, y: 232, width: 140, height: 12 },
    { x: 310, y: 202, width: 180, height: 12 },
    // High
    { x: 55,  y: 152, width: 120, height: 12 },
    { x: 625, y: 152, width: 120, height: 12 },
    { x: 280, y: 122, width: 240, height: 12 },
    // Top
    { x: 320, y: 58,  width: 160, height: 12 },
  ],

  players: [
    { number: 1,  x: 130, y: 415 },
    { number: 2,  x: 450, y: 415 },
    { number: 3,  x: 65,  y: 357 },
    { number: 4,  x: 290, y: 357 },
    { number: 5,  x: 680, y: 357 },
    { number: 6,  x: 365, y: 276 },
    { number: 7,  x: 600, y: 286 },
    { number: 8,  x: 185, y: 216 },
    { number: 9,  x: 360, y: 186 },
    { number: 10, x: 320, y: 106 },
    { number: 11, x: 400, y: 40  },
  ],

  enemies: [
    // Clippy patrols ground
    {
      type: 'clippy',
      x: 300,
      y: 415,
      patrolLeft: 80,
      patrolRight: 620,
    },
    // Melonhead jumps between low-left and low-right
    {
      type: 'melonhead',
      x: 55,
      y: 355,
      posA: { x: 85,  y: 355 },
      posB: { x: 680, y: 355 },
    },
    // Butter Fingers patrols top platforms
    {
      type: 'butter-fingers',
      x: 330,
      y: 105,
      posA: { x: 95,  y: 136 },
      posB: { x: 650, y: 136 },
    },
    // Padel Punisher is static on centre-mid platform
    {
      type: 'padel-punisher',
      x: 400,
      y: 276,
    },
  ],
};
