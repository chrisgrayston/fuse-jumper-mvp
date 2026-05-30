export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FuseData {
  x: number;
  y: number;
}

export interface EnemyData {
  x: number;
  y: number;
  type: 'patrol' | 'flyer';
  patrolLeft?: number;
  patrolRight?: number;
}

export interface LevelData {
  platforms: PlatformData[];
  fuses: FuseData[];
  enemies: EnemyData[];
  playerStart: { x: number; y: number };
}

export const level1: LevelData = {
  playerStart: { x: 100, y: 370 },

  platforms: [
    // Ground
    { x: 0,   y: 430, width: 800, height: 20 },
    // Low platforms
    { x: 40,  y: 350, width: 130, height: 14 },
    { x: 630, y: 350, width: 130, height: 14 },
    // Mid platforms
    { x: 160, y: 270, width: 140, height: 14 },
    { x: 500, y: 270, width: 140, height: 14 },
    { x: 310, y: 300, width: 180, height: 14 },
    // Upper platforms
    { x: 60,  y: 195, width: 120, height: 14 },
    { x: 620, y: 195, width: 120, height: 14 },
    { x: 280, y: 210, width: 240, height: 14 },
    // Top platforms
    { x: 130, y: 120, width: 140, height: 14 },
    { x: 530, y: 120, width: 140, height: 14 },
    { x: 310, y: 80,  width: 180, height: 14 },
  ],

  fuses: [
    // Ground level
    { x: 120, y: 410 },
    { x: 680, y: 410 },
    // Low platforms
    { x: 80,  y: 330 },
    { x: 140, y: 330 },
    { x: 660, y: 330 },
    { x: 720, y: 330 },
    // Mid
    { x: 200, y: 250 },
    { x: 560, y: 250 },
    { x: 350, y: 280 },
    { x: 420, y: 280 },
    // Upper
    { x: 100, y: 175 },
    { x: 670, y: 175 },
    { x: 330, y: 190 },
    { x: 400, y: 190 },
    { x: 460, y: 190 },
    // Top
    { x: 175, y: 100 },
    { x: 560, y: 100 },
    { x: 350, y: 60  },
    { x: 400, y: 60  },
    { x: 450, y: 60  },
  ],

  enemies: [
    {
      type: 'patrol',
      x: 310,
      y: 415,
      patrolLeft: 180,
      patrolRight: 620,
    },
    {
      type: 'flyer',
      x: 400,
      y: 160,
    },
  ],
};
