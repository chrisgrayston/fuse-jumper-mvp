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
    // Column bases
    { x: 30,  y: 383, width: 80,  height: 12 },
    { x: 690, y: 383, width: 80,  height: 12 },
    // Upper
    { x: 100, y: 202, width: 130, height: 12 },
    { x: 570, y: 202, width: 130, height: 12 },
    { x: 300, y: 182, width: 200, height: 12 },
    // High
    { x: 148, y: 142, width: 140, height: 12 },
    { x: 512, y: 142, width: 140, height: 12 },
    { x: 308, y: 112, width: 184, height: 12 },
    // Very high
    { x: 200, y: 72,  width: 120, height: 12 },
    { x: 480, y: 72,  width: 120, height: 12 },
    // Skeletor's throne
    { x: 318, y: 28,  width: 164, height: 12 },
  ],

  players: [
    { number: 1,  x: 200, y: 415 },
    { number: 2,  x: 560, y: 415 },
    { number: 3,  x: 55,  y: 367 },
    { number: 4,  x: 730, y: 367 },  // moved from lower-right → column base right
    { number: 5,  x: 635, y: 186 },  // moved from mid-left → upper right
    { number: 6,  x: 218, y: 126 },  // moved from puffin → high left
    { number: 7,  x: 582, y: 126 },  // moved from mid-right → high right
    { number: 8,  x: 130, y: 186 },
    { number: 9,  x: 360, y: 165 },
    { number: 10, x: 360, y: 95  },
    { number: 11, x: 400, y: 12  },
  ],

  enemies: [
    // Giant Bear patrols ground
    {
      type: 'giant-bear',
      x: 250,
      y: 415,
      patrolLeft: 90,
      patrolRight: 540,
    },
    // Condor sine-waves through middle
    {
      type: 'condor',
      x: 400,
      y: 240,
    },
    // Actuary Man flies between high platforms
    {
      type: 'actuary-man',
      x: 360,
      y: 22,
      posA: { x: 360, y: 22  },
      posB: { x: 360, y: 236 },
    },
    // Puffin stands on upper-centre platform, fires golf balls
    {
      type: 'puffin',
      x: 400,
      y: 167,
    },
    // Vascular Man hangs beneath mid platforms
    {
      type: 'vascular-man',
      x: 120,
      y: 290,
      posA: { x: 120, y: 290 },
      posB: { x: 680, y: 290 },
    },
    // Skeletor at the top
    {
      type: 'skeletor',
      x: 400,
      y: 14,
    },
  ],
};
