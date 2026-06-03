import { LevelData } from './types';

// Club 2200 — Only the gods qualify.
// Greek marble temple. Gold and white. Clouds. Skeletor reigns.
export const level4: LevelData = {
  club: 2200,
  bgPrimary:   0x08080f,
  bgSecondary: 0x10102a,
  accentColor: 0xf0c040,

  playerStart: { x: 80, y: 390 },

  platforms: [
    // Marble ground
    { x: 0,   y: 430, width: 800, height: 20 },
    // Column bases (raised from y=383)
    { x: 30,  y: 330, width: 80,  height: 12 },
    { x: 690, y: 330, width: 80,  height: 12 },
    // Upper
    { x: 100, y: 202, width: 130, height: 12 },
    { x: 570, y: 202, width: 130, height: 12 },
    { x: 300, y: 350, width: 200, height: 12 },  // Middle platform (below column bases)
    // High
    { x: 148, y: 142, width: 140, height: 12 },
    { x: 512, y: 142, width: 140, height: 12 },
    { x: 308, y: 112, width: 184, height: 12 },
    // Skeletor's throne (lowered from y=28)
    { x: 318, y: 55,  width: 164, height: 12 },
  ],

  players: [
    { number: 1,  x: 200, y: 415 },
    { number: 2,  x: 560, y: 415 },
    { number: 3,  x: 55,  y: 314 },  // column base left (330-16)
    { number: 4,  x: 755, y: 314 },  // column base right — shirt moved right
    { number: 5,  x: 635, y: 186 },  // upper right
    { number: 6,  x: 218, y: 126 },  // high left
    { number: 7,  x: 582, y: 126 },  // high right
    { number: 8,  x: 130, y: 186 },  // upper left
    { number: 9,  x: 360, y: 334 },  // middle platform (350-16)
    { number: 10, x: 360, y: 95  },  // high centre
    { number: 11, x: 466, y: 39  },  // throne right edge
  ],

  enemies: [
    // Giant Bear patrols middle platform
    {
      type: 'giant-bear',
      x: 360,
      y: 316,
      patrolLeft: 316,
      patrolRight: 484,
    },
    // Condor sine-waves through middle
    {
      type: 'condor',
      x: 400,
      y: 240,
    },
    // Actuary Man patrols the ground, laptop head-shake at each end
    {
      type: 'actuary-man',
      x: 200,
      y: 407,
      patrolLeft: 50,
      patrolRight: 740,
    },
    // Puffin Golfer stands on left edge of right column base, drives golf balls left
    {
      type: 'puffin',
      x: 700,
      y: 307,
    },
    // Vascular Man swings under upper-left and upper-right platforms
    {
      type: 'vascular-man',
      x: 165,
      y: 246,
      posA: { x: 165, y: 246 },
      posB: { x: 635, y: 246 },
    },
    // Skeletor at the top
    {
      type: 'skeletor',
      x: 400,
      y: 32,
    },
  ],
};
