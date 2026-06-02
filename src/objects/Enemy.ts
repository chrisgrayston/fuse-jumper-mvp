import Phaser from 'phaser';
import { EnemyType, EnemyData, ProjectileType } from '../levels/types';

export type SpawnFn = (x: number, y: number, type: ProjectileType, vx: number, vy: number) => Phaser.Physics.Arcade.Sprite;

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
  'bubble-blower':  0,
  'flanker':        110,
  'clippy':         28,
  'giant-bear':     50,
};

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private readonly eType: EnemyType;
  private readonly eData: EnemyData;
  private readonly spawn: SpawnFn;
  private st: State;

  // Padel Punisher: active ball reference for at-rest detection
  private padelBall: Phaser.Physics.Arcade.Sprite | null = null;

  // Smaller-bear coat animation
  private coatSprite: Phaser.GameObjects.Image | null = null;
  private coatT = 0;
  private coatStartX = 0;
  private coatStartY = 0;
  private coatEndX   = 0;
  private coatEndY   = 0;

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
    if (this.eType === 'clippy') {
      body.setSize(22, 44);
      body.setOffset(9, 4);
    }
    if (this.eType === 'melonhead') {
      body.setCollideWorldBounds(true);
      body.setSize(24, 44);
      body.setOffset(10, 16);
    }
    if (this.eType === 'butter-fingers') {
      body.allowGravity = false;
      body.setSize(28, 48);
      body.setOffset(6, 4);
      this.st.nextKick = 0;  // PHASE_IDLE
      this.st.chargeTimer = Phaser.Math.Between(1500, 2500);
    }
    if (this.eType === 'padel-punisher') {
      body.setSize(22, 44);
      body.setOffset(9, 4);
      this.st.nextKick = 1;  // start in WINDUP immediately
      this.st.kickClock = 0;
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
        body.setVelocityX(0);

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
          this.st.nextAction = Phaser.Math.Between(14000, 20000);
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
          body.setVelocityX(560 * this.st.direction);
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
            // atPosA alternates true/false to give right/left charges independently
            // of whichever direction patrolBounce set between stamps
            this.st.atPosA    = !this.st.atPosA;
            this.st.direction = this.st.atPosA ? 1 : -1;
            this.st.isCharging  = true;
            this.st.chargeTimer = 550;
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
        this.st.sineT += delta * 0.0004;
        const baseX = 400;
        const baseY = this.eData.y;
        this.x = baseX + Math.cos(this.st.sineT * 0.7) * 200;
        this.y = baseY + Math.sin(this.st.sineT) * 25;
        body.reset(this.x, this.y);
        break;
      }

      case 'smaller-bear': {
        if (this.st.isCharging) {
          // Phase 3 — wearing coat: keep coat overlaid on bear
          this.st.chargeTimer -= delta;
          if (this.coatSprite) this.coatSprite.setPosition(this.x, this.y - 4);
          if (this.st.chargeTimer <= 0) {
            this.st.isCharging = false;
            if (this.coatSprite) { this.coatSprite.destroy(); this.coatSprite = null; }
          }
        } else if (this.st.travelling) {
          // Phase 2 — jumping: bear arcs to destination, coat flies ahead
          this.coatT += delta;
          if (this.coatSprite) {
            const COAT_FLIGHT = 900;  // coat flight duration
            const cl = Math.min(1, this.coatT / COAT_FLIGHT);
            const cx = Phaser.Math.Linear(this.coatStartX, this.coatEndX, cl);
            const cy = Phaser.Math.Linear(this.coatStartY, this.coatEndY, cl)
                       - Math.sin(cl * Math.PI) * 140;   // big visible arc
            this.coatSprite.setPosition(cx, cy);
            this.coatSprite.setAngle(cl * 360);           // one spin in flight
            if (cl >= 1) {
              // landed — lie flat at destination
              this.coatSprite.setPosition(this.coatEndX, this.coatEndY + 10);
              this.coatSprite.setAngle(0);
            }
          }
          this.st.travelTimer -= delta;
          const target = this.st.atPosA ? this.eData.posA! : this.eData.posB!;
          const startX = this.st.atPosA ? this.eData.posB!.x : this.eData.posA!.x;
          const startY = this.st.atPosA ? this.eData.posB!.y : this.eData.posA!.y;
          // Bear only begins moving after the 800ms pre-jump pause
          if (this.st.travelTimer <= 1200) {
            const lerp = 1 - Math.max(0, this.st.travelTimer) / 1200;
            this.x = Phaser.Math.Linear(startX, target.x, lerp);
            this.y = Phaser.Math.Linear(startY, target.y, lerp) - Math.sin(lerp * Math.PI) * 80;
            body.reset(this.x, this.y);
          }
          if (this.st.travelTimer <= 0) {
            this.st.travelling = false;
            // Snap coat onto bear to start wearing phase
            if (this.coatSprite) this.coatSprite.setPosition(this.x, this.y - 4);
            this.st.isCharging  = true;
            this.st.chargeTimer = 1500;
          }
        } else {
          // Phase 1 — idle: wait then throw coat and jump
          if (this.st.clock >= this.st.nextAction) {
            this.st.clock       = 0;
            this.st.nextAction  = Phaser.Math.Between(3000, 5000);
            this.st.atPosA      = !this.st.atPosA;
            this.st.travelling  = true;
            this.st.travelTimer = 2000;   // 800ms pause + 1200ms jump
            const target = this.st.atPosA ? this.eData.posA! : this.eData.posB!;
            // Launch coat sprite on a manual arc to the destination
            this.coatStartX = this.x;
            this.coatStartY = this.y;
            this.coatEndX   = target.x;
            this.coatEndY   = target.y;
            this.coatT      = 0;
            this.coatSprite = this.scene.add.image(this.x, this.y, 'proj-coat').setDepth(7);
            // Growl
            const growl = this.scene.add.text(this.x, this.y - 28, 'GRAAARR!', {
              fontSize: '13px', fontFamily: 'monospace',
              color: '#ff4400', stroke: '#000000', strokeThickness: 3,
            }).setOrigin(0.5).setDepth(25);
            this.scene.tweens.add({
              targets: growl, y: growl.y - 30, alpha: 0, duration: 1000,
              onComplete: () => growl.destroy(),
            });
          }
        }
        break;
      }

      // ── Club 2100 ───────────────────────────────────────────────────────

      case 'melonhead': {
        const onGround = body.blocked.down;
        const distX    = Math.abs(playerX - this.x);
        const pLeft    = this.eData.patrolLeft  ?? 60;
        const pRight   = this.eData.patrolRight ?? 740;

        // Swing attack when player is within mallet range
        if (distX < 65 && !this.st.isCharging && onGround) {
          this.st.isCharging  = true;
          this.st.chargeTimer = 800;
          body.setVelocityX(0);
        }

        if (this.st.isCharging) {
          this.st.chargeTimer -= delta;
          this.setTexture(this.st.chargeTimer > 400 ? 'enemy-melonhead-swing-1' : 'enemy-melonhead-swing-2');
          this.setFlipX(playerX < this.x);
          if (this.st.chargeTimer <= 0) {
            this.st.isCharging = false;
            this.st.clock      = 0;
            this.st.nextAction = Phaser.Math.Between(600, 1800);
          }
          break;
        }

        // Bounce at patrol edges
        if (this.x <= pLeft) {
          this.st.direction = 1;
          body.setVelocityX(65);
        } else if (this.x >= pRight) {
          this.st.direction = -1;
          body.setVelocityX(-65);
        }

        // Periodic direction change — biased 70% toward player
        if (this.st.clock >= this.st.nextAction) {
          this.st.clock      = 0;
          this.st.nextAction = Phaser.Math.Between(700, 2200);
          const toPlayer     = playerX > this.x ? 1 : -1;
          this.st.direction  = Phaser.Math.Between(0, 9) < 7 ? toPlayer : -toPlayer;
          body.setVelocityX(65 * this.st.direction);
        }

        // Random jump when grounded
        if (onGround && this.st.travelTimer <= 0 && Phaser.Math.Between(0, 240) === 0) {
          body.setVelocityY(-400);
          this.st.travelTimer = 1400;
        }
        if (this.st.travelTimer > 0) this.st.travelTimer -= delta;

        // Keep moving if stalled on ground
        if (onGround && Math.abs(body.velocity.x) < 5) {
          body.setVelocityX(65 * this.st.direction);
        }

        // Animation
        this.st.sineT += delta;
        this.setFlipX(this.st.direction < 0);
        if (!onGround) {
          this.setTexture(body.velocity.y < 0 ? 'enemy-melonhead-jump' : 'enemy-melonhead-float');
        } else {
          const wf = Math.floor(this.st.sineT / 280) % 2;
          this.setTexture(wf === 0 ? 'enemy-melonhead' : 'enemy-melonhead-walk-2');
        }
        break;
      }

      case 'clippy': {
        this.st.sineT += delta;
        const pLeft  = this.eData.patrolLeft  ?? 50;
        const pRight = this.eData.patrolRight ?? 750;

        if (this.st.isCharging) {
          this.st.chargeTimer -= delta;
          body.setVelocityX(0);
          const sf = Math.floor(this.st.sineT / 200) % 4;
          this.setTexture(`enemy-clippy-scratch-${sf + 1}`);
          if (this.st.chargeTimer <= 0) {
            this.st.isCharging = false;
            body.setVelocityX(SPEEDS['clippy']! * this.st.direction);
          }
        } else if (this.x <= pLeft && this.st.direction < 0) {
          this.st.direction   = 1;
          this.setFlipX(false);
          this.st.isCharging  = true;
          this.st.chargeTimer = 1400;
          this.st.sineT       = 0;
          body.setVelocityX(0);
        } else if (this.x >= pRight && this.st.direction > 0) {
          this.st.direction   = -1;
          this.setFlipX(true);
          this.st.isCharging  = true;
          this.st.chargeTimer = 1400;
          this.st.sineT       = 0;
          body.setVelocityX(0);
        } else {
          body.setVelocityX(SPEEDS['clippy']! * this.st.direction);
          this.setFlipX(this.st.direction < 0);
          const cf = Math.floor(this.st.sineT / 200) % 8;
          this.setTexture(cf === 0 ? 'enemy-clippy' : `enemy-clippy-${cf + 1}`);
        }
        break;
      }

      case 'butter-fingers': {
        // Phase IDs stored in st.nextKick
        const PI  = 0;  // IDLE
        const PLI = 1;  // THROW_LIFT
        const PHO = 2;  // THROW_HOLD
        const PRE = 3;  // THROW_RELEASE
        const PFO = 4;  // THROW_FOLLOW
        const PRL = 5;  // ROLLING
        const PTR = 6;  // TRAVELLING
        const PWN = 7;  // PIE_WIND
        const PPT = 8;  // PIE_THROW
        const PPF = 9;  // PIE_FOLLOW

        this.st.chargeTimer -= delta;
        this.st.sineT += delta;
        const ph = this.st.nextKick;
        const posA = this.eData.posA!;
        const posB = this.eData.posB!;

        if (ph === PI) {
          this.setTexture(Math.floor(this.st.sineT / 700) % 2 === 0
            ? 'enemy-butter-fingers' : 'enemy-butter-fingers-walk-2');
          this.setFlipX(!this.st.atPosA);  // face center: right at posA, left at posB
          if (this.st.chargeTimer <= 0) {
            this.st.kickClock++;
            const isPie = (this.st.kickClock % 3 === 0);
            if (isPie) {
              this.st.nextKick = PTR;
              this.st.chargeTimer = 900;
            } else {
              this.st.nextKick = PLI;
              this.st.chargeTimer = 300;
            }
          }

        } else if (ph === PLI) {
          this.setTexture('enemy-butter-fingers-throw-1');
          this.setFlipX(!this.st.atPosA);
          if (this.st.chargeTimer <= 0) {
            this.spawn(this.x, this.y + 55, 'crate', Phaser.Math.Between(-25, 25), 50);
            this.st.nextKick = PHO;
            this.st.chargeTimer = 250;
          }

        } else if (ph === PHO) {
          this.setTexture('enemy-butter-fingers-throw-2');
          this.setFlipX(!this.st.atPosA);
          if (this.st.chargeTimer <= 0) {
            this.st.nextKick = PRE;
            this.st.chargeTimer = 200;
          }

        } else if (ph === PRE) {
          this.setTexture('enemy-butter-fingers-throw-3');
          this.setFlipX(!this.st.atPosA);
          if (this.st.chargeTimer <= 0) {
            this.st.nextKick = PFO;
            this.st.chargeTimer = 250;
          }

        } else if (ph === PFO) {
          this.setTexture('enemy-butter-fingers-throw-4');
          this.setFlipX(!this.st.atPosA);
          if (this.st.chargeTimer <= 0) {
            this.st.nextKick = PTR;
            this.st.chargeTimer = 900;
          }

        } else if (ph === PTR) {
          const from = this.st.atPosA ? posA : posB;
          const to   = this.st.atPosA ? posB : posA;
          const elapsed = 900 - this.st.chargeTimer;
          const t = Phaser.Math.Clamp(elapsed / 900, 0, 1);
          this.x = Phaser.Math.Linear(from.x, to.x, t);
          this.y = Phaser.Math.Linear(from.y, to.y, t) - Math.sin(t * Math.PI) * 40;
          body.reset(this.x, this.y);
          this.setTexture('enemy-butter-fingers-jump');
          this.setFlipX(to.x < from.x);
          if (this.st.chargeTimer <= 0) {
            this.st.atPosA = !this.st.atPosA;
            this.x = to.x; this.y = to.y;
            body.reset(to.x, to.y);
            this.st.nextKick = PRL;
            this.st.chargeTimer = 560;
            this.st.sineT = 0;
          }

        } else if (ph === PRL) {
          const rollDir = this.st.atPosA ? -1 : 1;  // arrived at left → roll left; right → roll right
          this.x += rollDir * 60 * (delta / 1000);
          body.reset(this.x, this.y);
          this.setFlipX(rollDir < 0);
          const rf = Math.floor(this.st.sineT / 140) % 4;
          this.setTexture(`enemy-butter-fingers-roll-${rf + 1}`);
          if (this.st.chargeTimer <= 0) {
            this.st.sineT = 0;
            const goToPie = (this.st.kickClock % 3 === 0);
            if (goToPie) {
              this.st.nextKick = PWN;
              this.st.chargeTimer = 320;
            } else {
              this.st.nextKick = PI;
              this.st.chargeTimer = Phaser.Math.Between(1500, 2500);
            }
          }

        } else if (ph === PWN) {
          this.setTexture('enemy-butter-fingers-pie-1');
          this.setFlipX(!this.st.atPosA);
          if (this.st.chargeTimer <= 0) {
            const pDir = this.st.kickDir;
            this.spawn(this.x + pDir * 16, this.y,      'pie', pDir * 200, 0);
            this.spawn(this.x + pDir * 16, this.y - 10, 'pie', pDir * 200, 0);
            this.st.kickDir = -pDir;
            this.st.nextKick = PPT;
            this.st.chargeTimer = 180;
          }

        } else if (ph === PPT) {
          this.setTexture('enemy-butter-fingers-pie-2');
          this.setFlipX(!this.st.atPosA);
          if (this.st.chargeTimer <= 0) {
            this.st.nextKick = PPF;
            this.st.chargeTimer = 280;
          }

        } else if (ph === PPF) {
          this.setTexture('enemy-butter-fingers-pie-3');
          this.setFlipX(!this.st.atPosA);
          if (this.st.chargeTimer <= 0) {
            this.st.nextKick = PI;
            this.st.chargeTimer = Phaser.Math.Between(1500, 2500);
            this.st.sineT = 0;
          }
        }
        break;
      }

      case 'padel-punisher': {
        const PP_WAIT   = 0;
        const PP_WINDUP = 1;
        const PP_FOLLOW = 2;

        this.st.sineT    += delta;
        this.st.kickClock += delta;

        if (this.st.nextKick === PP_WINDUP) {
          const wPhase = Math.min(3, Math.floor(this.st.kickClock / 150));
          const wKeys  = ['windup-1', 'windup-2', 'windup-3', 'strike'];
          this.setTexture(`enemy-padel-punisher-${wKeys[wPhase]}`);
          if (this.st.kickClock >= 600) {
            // Serve — angle 95°–150° from +X (upward left, mix of high/low arcs)
            const angle = Phaser.Math.DegToRad(Phaser.Math.Between(95, 150));
            const speed = Phaser.Math.Between(1040, 1360);
            this.padelBall = this.spawn(
              this.x - 14, this.y - 22, 'padel-ball',
              Math.cos(angle) * speed, -Math.sin(angle) * speed,
            );
            this.st.nextKick  = PP_FOLLOW;
            this.st.kickClock = 0;
          }
        } else if (this.st.nextKick === PP_FOLLOW) {
          this.setTexture(this.st.kickClock < 200
            ? 'enemy-padel-punisher-follow-1'
            : 'enemy-padel-punisher-follow-2');
          if (this.st.kickClock >= 400) {
            this.st.nextKick  = PP_WAIT;
            this.st.kickClock = 0;
            this.st.sineT     = 0;
          }
        } else {
          // PP_WAIT — watch ball; cycle idle frames
          const wf = Math.floor(this.st.sineT / 550) % 2;
          this.setTexture(wf === 0 ? 'enemy-padel-punisher' : 'enemy-padel-punisher-wait-2');
          // Detect ball at rest or gone
          const ballGone    = !this.padelBall || !this.padelBall.active;
          const ballAtRest  = !ballGone &&
            (this.padelBall!.body as Phaser.Physics.Arcade.Body).speed < 28;
          if (ballGone || ballAtRest) {
            this.padelBall    = null;
            this.st.nextKick  = PP_WINDUP;
            this.st.kickClock = 0;
            this.st.sineT     = 0;
          }
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

  // ── Public API ───────────────────────────────────────────────────────────

  resetEnemy(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (this.coatSprite) { this.coatSprite.destroy(); this.coatSprite = null; }

    if (this.eType === 'butter-fingers') {
      const spawnX = this.eData.posA?.x ?? this.eData.x;
      const spawnY = this.eData.posA?.y ?? this.eData.y;
      body.setVelocity(0, 0);
      body.allowGravity = false;
      this.x = spawnX; this.y = spawnY;
      body.reset(spawnX, spawnY);
      this.st.nextKick    = 0;
      this.st.chargeTimer = Phaser.Math.Between(1500, 2500);
      this.st.kickClock   = 0;
      this.st.kickDir     = 1;
      this.st.atPosA      = true;
      this.st.sineT       = 0;
      this.setTexture('enemy-butter-fingers');
      this.setFlipX(false);
      return;
    }
    if (this.eType === 'padel-punisher') {
      body.reset(this.eData.x, this.eData.y);
      body.setVelocity(0, 0);
      this.st.nextKick  = 1;  // PP_WINDUP
      this.st.kickClock = 0;
      this.st.sineT     = 0;
      this.padelBall    = null;
      this.setTexture('enemy-padel-punisher');
      return;
    }

    body.reset(this.eData.x, this.eData.y);
    body.setVelocity(0, 0);

    this.st.clock        = 0;
    this.st.nextAction   = Phaser.Math.Between(1500, 3000);
    this.st.direction    = 1;
    this.st.isCharging   = false;
    this.st.chargeTimer  = 0;
    this.st.atPosA       = true;
    this.st.travelling   = false;
    this.st.travelTimer  = 0;
    this.st.sineT        = Phaser.Math.FloatBetween(0, Math.PI * 2);
    this.st.kickClock    = 0;
    this.st.nextKick     = Phaser.Math.Between(3000, 7000);
    this.st.kickDir      = 1;

    this.setTexture(`enemy-${this.eType}`);
    this.setFlipX(false);

    const floaters: EnemyType[] = ['rushy', 'condor', 'actuary-man', 'vascular-man', 'skeletor'];
    body.allowGravity = !floaters.includes(this.eType);

    const speed = SPEEDS[this.eType];
    if (speed !== undefined) body.setVelocityX(speed);
  }

  kickStart(): void {
    const speed = SPEEDS[this.eType];
    if (speed !== undefined) {
      (this.body as Phaser.Physics.Arcade.Body).setVelocityX(speed);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

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
