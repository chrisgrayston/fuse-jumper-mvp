export type EnemyType =
  | 'bubble-blower'
  | 'flanker'
  | 'rushy'
  | 'smaller-bear'
  | 'melonhead'
  | 'clippy'
  | 'butter-fingers'
  | 'padel-punisher'
  | 'condor'
  | 'giant-bear'
  | 'actuary-man'
  | 'puffin'
  | 'vascular-man'
  | 'skeletor';

export type ProjectileType =
  | 'bubble'
  | 'mallet'
  | 'crate'
  | 'pie'
  | 'glass-shard'
  | 'padel-ball'
  | 'golf-ball'
  | 'dark-magic'
  | 'coat'
  | 'football';

export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlayerData {
  number: number; // 1–11
  x: number;
  y: number;
}

export interface EnemyData {
  type: EnemyType;
  x: number;
  y: number;
  patrolLeft?: number;
  patrolRight?: number;
  posA?: { x: number; y: number };
  posB?: { x: number; y: number };
}

export interface LevelData {
  club: number;
  bgPrimary: number;
  bgSecondary: number;
  accentColor: number;
  platforms: PlatformData[];
  players: PlayerData[];
  enemies: EnemyData[];
  playerStart: { x: number; y: number };
}
