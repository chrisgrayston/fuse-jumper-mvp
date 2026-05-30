import { LevelData } from './types';

// Club 1800 — "No Rules. No Light. No Tomorrow."
// Gritty dive bar. Dark red neon. Wet concrete.
export const level1: LevelData = {
  club: 1800,
  bgPrimary:   0x0d0507,
  bgSecondary: 0x1a0a0a,
  accentColor: 0xcc1122,

  playerStart: { x: 80, y: 390 },

  platforms: [
    // Bar floor
    { x: 0,   y: 430, width: 800, height: 20 },
    // Bar stools
    { x: 110, y: 362, width: 70,  height: 12 },
    { x: 260, y: 362, width: 70,  height: 12 },
    // Bar counter (right)
    { x: 480, y: 295, width: 280, height: 12 },
    // High shelf (left)
    { x: 60,  y: 210, width: 150, height: 12 },
    // Back shelf (right)
    { x: 540, y: 210, width: 210, height: 12 },
    // Top shelf (centre)
    { x: 295, y: 128, width: 210, height: 12 },
  ],

  players: [
    { number: 1,  x: 180, y: 415 },
    { number: 2,  x: 420, y: 415 },
    { number: 3,  x: 130, y: 347 },
    { number: 4,  x: 275, y: 347 },
    { number: 5,  x: 520, y: 280 },
    { number: 6,  x: 700, y: 280 },
    { number: 7,  x: 90,  y: 195 },
    { number: 8,  x: 175, y: 195 },
    { number: 9,  x: 580, y: 195 },
    { number: 10, x: 330, y: 113 },
    { number: 11, x: 460, y: 113 },
  ],

  enemies: [
    {
      type: 'bubble-blower',
      x: 400,
      y: 415,
      patrolLeft: 150,
      patrolRight: 650,
    },
  ],
};
