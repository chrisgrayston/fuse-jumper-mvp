import Phaser from 'phaser';
import { EnemyType, EnemyData, ProjectileType } from '../levels/types';

export type SpawnFn = (x: number, y: number, type: ProjectileType, vx: number, vy: number) => void;

interface State {
  clock: number;
  nextAction: number;
  direction: number;       // 1 = right, -1 = left
  isCharging: boolean;
  chargeTimer: number;
  atPosA: boolean;         // for two-position enemies
  travelling: boolean;     // mid-jump/travel
  travelTimer: number;
  sineT: number;
  kickClock: number;       // bubble-blower: time since last kick
  nextKick: number;        // bubble-blower: interval until next kick
  kickDir: number;         // bubble-blower: alternates 1 / -1
}

const SPEEDS: Partial<Record<EnemyType, number>> = {
  'bubble-blower':  55,
  'flanker':        110,
  'clippy':         60,
  'giant-bear':     50,
};

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private readonly eType: EnemyType;
  private readonly eData: EnemyData;
  private readonly spawn: SpawnFn;
  private st: State;

  constructor(
    scene: Phaser.Scene,
    data: EnemyData,
    spawnFn: SpawnFn,
  ) {
    super(scene, data.x, data.y, `enemy-${data.type}`);
    this.eType = data.type;
    this.eData = data;
    this.spawn = spawnFn;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(6);

    this.st = {
      clock: 0,
      nextAction: Phaser.Math.Between(1500, 3000),
      direction: 1,
      isCharging: false,
      chargeTimer: 0,
      atPosA: true,
      travelling: false,
      travelTimer: 0,
      sineT: Phaser.Math.FloatBetween(0, Math.PI * 2),
      kickClock: 0,
      nextKick: Phaser.Math.Between(3000, 7000),
      kickDir: 1,
    };

    const body = this.body as Phaser.Physics.Arcade.Body;
    const floaters: EnemyType[] = ['rushy', 'condor', 'actuary-man', 'vascular-man', 'skeletor'];
    if (floaters.includes(this.eType)) {
      body.allowGravity = false;
      body.setImmovable(false);
    } else {
      body.allowGravity = true;
    }

    // Per-type hitbox tuning
    if (this.eType === 'bubble-blower') {
      body.setSize(24, 44);
      body.setOffset(8, 6);
    }

    // Ground patrol — set initial velocity
    const speed = SPEEDS[this.eType];
    if (speed !== undefined) {
      body.setVelocityX(speed);
    }
  }

  update(delta: number, playerX: number, playerY: number): void {
    this.st.clock += delta;
    const body = this.body as Phaser.Physics.Arcade.Body;

    switch (this.eType) {

      // ── Club 1800 ───────────────────────────────────────────────────────

      case 'bubble-blower': {
        this.st.sineT  += delta;
        this.st.kickClock += delta;
        this.patrolBounce(body, this.eData.patrolLeft ?? 50, this.eData.patrolRight ?? 750, SPEEDS['bubble-blower']!);

        // Kick the football periodically (independent of bubble timer)
        if (this.st.kickClock >= this.st.nextKick) {
          this.st.kickClock = 0;
          this.st.nextKick  = Phaser.Math.Between(4000, 8000);
          const kDir = this.st.kickDir;
          this.st.kickDir   = -kDir;  // alternate next kick
          const vx   = kDir * 340;
          this.spawn(this.x + kDir * 18, this.y, 'football', vx, 0);
          this.st.travelTimer = 450;
        }

        // Animation priority: blow > kick > keepup cycle
        if (this.st.chargeTimer > 0) {
          this.st.chargeTimer -= delta;
          this.setTexture('enemy-bubble-blower-blow');
        } else if (this.st.travelTimer > 0) {
          this.st.travelTimer -= delta;
          // Show whichever keepup frame matches kick direction
          this.setTexture(this.st.direction > 0 ? 'enemy-bubble-blower' : 'enemy-bubble-blower-2');
        } else {
          const frame = Math.floor(this.st.sineT / 380) % 2;
          this.setTexture(frame === 0 ? 'enemy-bubble-blower' : 'enemy-bubble-blower-2');
        }

        if (this.st.clock >= this.st.nextAction) {
          this.st.clock = 0;
          this.st.nextAction = Phaser.Math.Between(8000, 12000);
          this.st.chargeTimer = 900;
          const baseAngles = [-170, -90, -10];
          for (let i = 0; i < 3; i++) {
            const rad = Phaser.Math.DegToRad(baseAngles[i] + Phaser.Math.Between(-6, 6));
            const spd = Phaser.Math.Between(120, 150);
            this.spawn(this.x + (i - 1) * 14, this.y - 14, 'bubble', Math.cos(rad) * spd, Math.sin(rad) * spd);
          }
        }
        break;
      }

      // ── Club 2000 ───────────────────────────────────────────────────────

      case 'flanker': {
        this.st.sineT += delta;
        if (this.st.isCharging) {
          // Phase 3: charge — fast run for 900ms
          this.st.chargeTimer -= delta;
          body.setVelocityX(420 * this.st.direction);
          this.setFlipX(this.st.direction < 0);
          const cf = Math.floor(this.st.sineT / 130) % 2;
          this.setTexture(cf === 0 ? 'enemy-flanker' : 'enemy-flanker-2');
          if (this.st.chargeTimer <= 0) {
            this.st.isCharging = false;
            body.setVelocityX(SPEEDS['flanker']! * this.st.direction);
          }
        } else if (this.st.travelling) {
          // Phase 2: stamp — stopped, sumo stomp animation for 1500ms
          body.setVelocityX(0);
          this.st.travelTimer -= delta;
          const sf = Math.floor(this.st.sineT / 300) % 2;
          this.setTexture(sf === 0 ? 'enemy-flanker-stamp' : 'enemy-flanker-stamp-2');
          if (this.st.travelTimer <= 0) {
            this.st.travelling = false;
            this.st.isCharging = true;
            this.st.chargeTimer = 900;
            this.st.sineT = 0;
          }
        } else {
          // Phase 1: patrol walk
          this.patrolBounce(body, this.eData.patrolLeft ?? 50, this.eData.patrolRight ?? 750, SPEEDS['flanker']!);
          const pf = Math.floor(this.st.sineT / 260) % 2;
          this.setTexture(pf === 0 ? 'enemy-flanker' : 'enemy-flanker-2');
          if (this.st.clock >= this.st.nextAction) {
            this.st.clock = 0;
            this.st.nextAction = Phaser.Math.Between(3000, 5500);
            this.st.travelling = true;
            this.st.travelTimer = 1500;
            this.st.sineT = 0;
          }
        }
        break;
      }

      case 'rushy': {
        this.st.sineT += delta * 0.0018;
        const baseX = 400;
        const baseY = this.eData.y;
        this.x = baseX + Math.cos(this.st.sineT * 0.7) * 310;
        this.y = baseY + Math.sin(this.st.sineT) * 35;
        body.reset(this.x, this.y);
        break;
      }

      case 'smaller-bear': {
        if (!this.st.travelling) {
          if (this.st.clock >= this.st.nextAction) {
            this.st.clock = 0;
            this.st.nextAction = Phaser.Math.Between(3000, 5000);
            this.st.atPosA = !this.st.atPosA;
            this.st.travelling = true;
            this.st.travelTimer = 600;
            // Throw coat projectile ahead of jump
            const target = this.st.atPosA ? this.eData.posA! : this.eData.posB!;
            const dir = target.x > this.x ? 1 : -1;
            this.spawn(this.x, this.y, 'coat', dir * 180, -80);
          }
        } else {
          this.st.travelTimer -= delta;
          const target = this.st.atPosA ? this.eData.posA! : this.eData.posB!;
          const lerp = 1 - Math.max(0, this.st.travelTimer) / 600;
          const startX = this.st.atPosA ? this.eData.posB!.x : this.eData.posA!.x;
          const startY = this.st.atPosA ? this.eData.posB!.y : this.eData.posA!.y;
          this.x = Phaser.Math.Linear(startX, target.x, lerp);
          this.y = Phaser.Math.Linear(startY, target.y, lerp) - Math.sin(lerp * Math.PI) * 60;
          body.reset(this.x, this.y);
          if (this.st.travelTimer <= 0) this.st.travelling = false;
        }
        break;
      }

      // ── Club 2100 ───────────────────────────────────────────────────────

      case 'melonhead': {
        if (!this.st.travelling) {
          if (this.st.clock >= this.st.nextAction) {
            this.st.clock = 0;
            this.st.nextAction = Phaser.Math.Between(2000, 3500);
            this.st.atPosA = !this.st.atPosA;
            this.st.travelling = true;
            this.st.travelTimer = 700;
            // Mallet swing — spawn short-lived hitbox represented as projectile
            this.spawn(this.x + this.st.direction * 30, this.y, 'mallet', this.st.direction * 20, -10);
          }
        } else {
          this.st.travelTimer -= delta;
          const target = this.st.atPosA ? this.eData.posA! : this.eData.posB!;
          const startX = this.st.atPosA ? this.eData.posB!.x : this.eData.posA!.x;
          const startY = this.st.atPosA ? this.eData.posB!.y : this.eData.posA!.y;
          const lerp = 1 - Math.max(0, this.st.travelTimer) / 700;
          this.x = Phaser.Math.Linear(startX, target.x, lerp);
          this.y = Phaser.Math.Linear(startY, target.y, lerp) - Math.sin(lerp * Math.PI) * 80;
          body.reset(this.x, this.y);
          this.st.direction = target.x > startX ? 1 : -1;
          if (this.st.travelTimer <= 0) this.st.travelling = false;
        }
        break;
      }

      case 'clippy': {
        this.patrolBounce(body, this.eData.patrolLeft ?? 50, this.eData.patrolRight ?? 750, SPEEDS['clippy']!);
        if (this.st.clock >= this.st.nextAction) {
          this.st.clock = 0;
          this.st.nextAction = Phaser.Math.Between(2500, 4000);
          const dir = this.st.direction;
          this.spawn(this.x + dir * 20, this.y - 5, 'mallet', dir * 260, -60);
        }
        break;
      }

      case 'butter-fingers': {
        if (!this.st.travelling) {
          if (this.st.clock >= this.st.nextAction) {
            this.st.clock = 0;
            this.st.nextAction = Phaser.Math.Between(2500, 4000);
            // Drop a crate straight down
            this.spawn(this.x, this.y + 10, 'crate', Phaser.Math.Between(-30, 30), 30);
            // Start moving to other platform
            this.st.atPosA = !this.st.atPosA;
            this.st.travelling = true;
            this.st.travelTimer = 800;
          }
        } else {
          this.st.travelTimer -= delta;
          const target = this.st.atPosA ? this.eData.posA! : this.eData.posB!;
          const startX = this.st.atPosA ? this.eData.posB!.x : this.eData.posA!.x;
          const startY = this.st.atPosA ? this.eData.posB!.y : this.eData.posA!.y;
          const lerp = 1 - Math.max(0, this.st.travelTimer) / 800;
          this.x = Phaser.Math.Linear(startX, target.x, lerp);
          this.y = Phaser.Math.Linear(startY, target.y, lerp) - Math.sin(lerp * Math.PI) * 50;
          body.reset(this.x, this.y);
          if (this.st.travelTimer <= 0) this.st.travelling = false;
        }
        break;
      }

      case 'padel-punisher': {
        // Static — fires padel balls in random upward angles
        body.reset(this.eData.x, this.eData.y);
        if (this.st.clock >= this.st.nextAction) {
          this.st.clock = 0;
          this.st.nextAction = Phaser.Math.Between(1800, 3200);
          const angle = Phaser.Math.DegToRad(Phaser.Math.Between(200, 340));
          const speed = Phaser.Math.Between(220, 320);
          this.spawn(this.x, this.y - 10, 'padel-ball', Math.cos(angle) * speed, Math.sin(angle) * speed);
        }
        break;
      }

      // ── Club 2200 ───────────────────────────────────────────────────────

      case 'giant-bear': {
        if (this.st.isCharging) {
          this.st.chargeTimer -= delta;
          if (this.st.chargeTimer <= 0) {
            this.st.isCharging = false;
            body.setVelocityX(SPEEDS['giant-bear']! * this.st.direction);
          }
        } else {
          this.patrolBounce(body, this.eData.patrolLeft ?? 50, this.eData.patrolRight ?? 750, SPEEDS['giant-bear']!);
          if (this.st.clock >= this.st.nextAction) {
            this.st.clock = 0;
            this.st.nextAction = Phaser.Math.Between(4000, 7000);
            this.st.isCharging = true;
            this.st.chargeTimer = 1400;
            body.setVelocityX(260 * this.st.direction);
          }
        }
        break;
      }

      case 'condor': {
        this.st.sineT += delta * 0.0016;
        this.x = 400 + Math.cos(this.st.sineT * 0.6) * 330;
        this.y = this.eData.y + Math.sin(this.st.sineT) * 55;
        body.reset(this.x, this.y);
        break;
      }

      case 'actuary-man': {
        if (!this.st.travelling) {
          if (this.st.clock >= this.st.nextAction) {
            this.st.clock = 0;
            this.st.nextAction = Phaser.Math.Between(3000, 5000);
            this.st.atPosA = !this.st.atPosA;
            this.st.travelling = true;
            this.st.travelTimer = 900;
          }
        } else {
          this.st.travelTimer -= delta;
          const target = this.st.atPosA ? this.eData.posA! : this.eData.posB!;
          const startX = this.st.atPosA ? this.eData.posB!.x : this.eData.posA!.x;
          const startY = this.st.atPosA ? this.eData.posB!.y : this.eData.posA!.y;
          const lerp = 1 - Math.max(0, this.st.travelTimer) / 900;
          this.x = Phaser.Math.Linear(startX, target.x, Phaser.Math.Easing.Cubic.InOut(lerp));
          this.y = Phaser.Math.Linear(startY, target.y, Phaser.Math.Easing.Cubic.InOut(lerp));
          body.reset(this.x, this.y);
          if (this.st.travelTimer <= 0) this.st.travelling = false;
        }
        break;
      }

      case 'puffin': {
        body.reset(this.eData.x, this.eData.y);
        if (this.st.clock >= this.st.nextAction) {
          this.st.clock = 0;
          this.st.nextAction = Phaser.Math.Between(2000, 3500);
          // Aim toward player
          const dx = playerX - this.x;
          const dy = playerY - this.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const spd = 280;
          this.spawn(this.x, this.y - 8, 'golf-ball', (dx / len) * spd, (dy / len) * spd);
        }
        break;
      }

      case 'vascular-man': {
        // Glides along underside of platforms — represented as horizontal sine drift
        if (!this.st.travelling) {
          if (this.st.clock >= this.st.nextAction) {
            this.st.clock = 0;
            this.st.nextAction = Phaser.Math.Between(3500, 5500);
            this.st.atPosA = !this.st.atPosA;
            this.st.travelling = true;
            this.st.travelTimer = 1000;
          }
        } else {
          this.st.travelTimer -= delta;
          const target = this.st.atPosA ? this.eData.posA! : this.eData.posB!;
          const startX = this.st.atPosA ? this.eData.posB!.x : this.eData.posA!.x;
          const startY = this.st.atPosA ? this.eData.posB!.y : this.eData.posA!.y;
          const lerp = 1 - Math.max(0, this.st.travelTimer) / 1000;
          this.x = Phaser.Math.Linear(startX, target.x, lerp);
          // Somersault arc — inverted sine (hangs below then swings over)
          this.y = startY - Math.sin(lerp * Math.PI) * 40 + (target.y - startY) * lerp;
          body.reset(this.x, this.y);
          if (this.st.travelTimer <= 0) this.st.travelling = false;
        }
        break;
      }

      case 'skeletor': {
        body.reset(this.eData.x, this.eData.y);
        if (this.st.clock >= this.st.nextAction) {
          this.st.clock = 0;
          this.st.nextAction = Phaser.Math.Between(2000, 3500);
          // Aim dark magic at player
          const dx = playerX - this.x;
          const dy = playerY - this.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const spd = 240;
          this.spawn(this.x, this.y + 10, 'dark-magic', (dx / len) * spd, (dy / len) * spd);
        }
        break;
      }
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private patrolBounce(
    body: Phaser.Physics.Arcade.Body,
    left: number,
    right: number,
    speed: number,
  ): void {
    if (this.x <= left) {
      this.st.direction = 1;
      body.setVelocityX(speed);
      this.setFlipX(false);
    } else if (this.x >= right) {
      this.st.direction = -1;
      body.setVelocityX(-speed);
      this.setFlipX(true);
    }
  }
}
