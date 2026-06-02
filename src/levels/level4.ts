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
    { x: 300, y: 260, width: 200, height: 12 },  // Puffin platform (lowered from y=182)
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
    { number: 4,  x: 730, y: 314 },  // column base right (330-16)
    { number: 5,  x: 635, y: 186 },  // upper right
    { number: 6,  x: 218, y: 126 },  // high left
    { number: 7,  x: 582, y: 126 },  // high right
    { number: 8,  x: 130, y: 186 },  // upper left
    { number: 9,  x: 360, y: 244 },  // puffin platform (260-16)
    { number: 10, x: 360, y: 95  },  // high centre
    { number: 11, x: 400, y: 39  },  // throne (55-16)
  ],

  enemies: [
    // Giant Bear patrols ground
    {
      type: 'giant-bear',
      x: 250,
      y: 398,
      patrolLeft: 90,
      patrolRight: 540,
    },
    // Condor sine-waves through middle
    {
      type: 'condor',
      x: 400,
      y: 240,
    },
    // Actuary Man flies between throne and mid area
    {
      type: 'actuary-man',
      x: 360,
      y: 49,
      posA: { x: 360, y: 49  },
      posB: { x: 360, y: 236 },
    },
    // Puffin Golfer stands on bottom-right column base, drives golf balls left
    {
      type: 'puffin',
      x: 730,
      y: 307,
    },
    // Vascular Man glides between sides
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
      y: 41,
    },
  ],
};
