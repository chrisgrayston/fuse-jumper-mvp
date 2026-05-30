import { LevelData } from './types';

// Club 2000 — VIP Only. Hard Techno. Harder You.
// Neon nightclub. Purple/pink. Disco ball.
export const level2: LevelData = {
  club: 2000,
  bgPrimary:   0x0a0515,
  bgSecondary: 0x150a25,
  accentColor: 0xcc44ff,

  playerStart: { x: 80, y: 390 },

  platforms: [
    // Dance floor
    { x: 0,   y: 430, width: 800, height: 20 },
    // Speaker boxes
    { x: 0,   y: 378, width: 110, height: 12 },
    { x: 690, y: 378, width: 110, height: 12 },
    // Stage
    { x: 255, y: 326, width: 290, height: 12 },
    // Mid left / right
    { x: 45,  y: 272, width: 155, height: 12 },
    { x: 600, y: 272, width: 155, height: 12 },
    // VIP balconies
    { x: 65,  y: 208, width: 160, height: 12 },
    { x: 575, y: 208, width: 160, height: 12 },
    // VIP centre
    { x: 285, y: 158, width: 230, height: 12 },
    // Top booth
    { x: 315, y: 85,  width: 170, height: 12 },
  ],

  players: [
    { number: 1,  x: 180, y: 415 },
    { number: 2,  x: 580, y: 415 },
    { number: 3,  x: 50,  y: 362 },
    { number: 4,  x: 730, y: 362 },
    { number: 5,  x: 320, y: 310 },
    { number: 6,  x: 450, y: 310 },
    { number: 7,  x: 85,  y: 255 },
    { number: 8,  x: 640, y: 255 },
    { number: 9,  x: 360, y: 143 },
    { number: 10, x: 355, y: 68  },
    { number: 11, x: 445, y: 68  },
  ],

  enemies: [
    // Flanker patrols dance floor
    {
      type: 'flanker',
      x: 380,
      y: 395,
      patrolLeft: 120,
      patrolRight: 680,
    },
    // Rushy floats in top third
    {
      type: 'rushy',
      x: 400,
      y: 110,
    },
    // Smaller Bear on VIP left → jumps to VIP right
    {
      type: 'smaller-bear',
      x: 120,
      y: 193,
      posA: { x: 120, y: 193 },
      posB: { x: 640, y: 193 },
    },
  ],
};
