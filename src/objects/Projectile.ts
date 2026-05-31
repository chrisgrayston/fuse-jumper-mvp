import Phaser from 'phaser';
import { ProjectileType } from '../levels/types';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  readonly projType: ProjectileType;

  // Bubble-specific stochastic state
  private readonly bubbleSineFreq: number;
  private readonly bubbleSineAmp: number;
  private readonly bubbleSinePhase: number;
  private bubbleSineT = 0;
  private bubbleVY: number;   // tracked independently — never read back from physics body
  private footballVX = 0;     // football: stored so we can re-assert it every frame
  private pieVX = 0;          // pie: same pattern as football — re-assert every frame
  private glassLifespan = 0;  // glass-shard: ms remaining before self-destruct

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: ProjectileType,
    vx: number,
    vy: number,
  ) {
    super(scene, x, y, `proj-${type}`);
    this.projType = type;
    this.bubbleVY = vy;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(8);

    const body = this.body as Phaser.Physics.Arcade.Body;

    // Restore original gravity: only crates and bubbles ignore world gravity;
    // everything else (golf balls, mallets, padel balls…) falls naturally.
    if (type === 'bubble') {
      body.allowGravity = false;
      body.setGravityY(0);
    } else if (type === 'crate') {
      body.allowGravity = true;
      body.setGravityY(-480);   // world gravity 600 - 480 = ~120 effective → slow fall
    } else if (type === 'pie') {
      body.allowGravity = false;
      body.setGravityY(0);
      this.pieVX = vx;
    } else if (type === 'glass-shard') {
      body.allowGravity = true;
      this.glassLifespan = 1200;
    } else if (type === 'football') {
      body.allowGravity = false;
      body.setGravityY(0);
      this.footballVX = vx;     // store so update() can re-assert it every frame
    } else {
      body.allowGravity = true;
    }

    body.setVelocity(vx, vy);
    body.setCollideWorldBounds(false);

    if (type === 'bubble') {
      this.bubbleSineFreq  = Phaser.Math.FloatBetween(0.3, 0.7);
      this.bubbleSineAmp   = Phaser.Math.FloatBetween(80, 160);
      this.bubbleSinePhase = Phaser.Math.FloatBetween(0, Math.PI * 2);
    } else {
      this.bubbleSineFreq  = 0;
      this.bubbleSineAmp   = 0;
      this.bubbleSinePhase = 0;
    }
  }

  update(delta: number): void {
    if (this.projType === 'bubble' && this.active) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      this.bubbleSineT += delta * 0.001;

      // Horizontal sine drift — unique per bubble
      const vx = this.bubbleSineAmp * Math.sin(
        this.bubbleSineT * this.bubbleSineFreq * Math.PI * 2 + this.bubbleSinePhase,
      );

      // Upward speed decays toward a slow float; always stays negative (upward)
      this.bubbleVY += (-25 - this.bubbleVY) * Math.min(1, delta * 0.0008);

      body.setVelocity(vx, this.bubbleVY);
    }

    // Football / pie: re-assert both axes every frame — same pattern as bubbles.
    // group.add() resets the body so allowGravity and velocity.x get wiped;
    // driving them from stored state each tick is the only reliable fix.
    if (this.projType === 'football' && this.active) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.allowGravity = false;
      body.gravity.y    = 0;
      body.velocity.x   = this.footballVX;
      body.velocity.y   = 0;
    }
    if (this.projType === 'pie' && this.active) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.allowGravity = false;
      body.gravity.y    = 0;
      body.velocity.x   = this.pieVX;
      body.velocity.y   = 0;
    }
    if (this.projType === 'glass-shard' && this.active) {
      this.glassLifespan -= delta;
      if (this.glassLifespan <= 0) { this.destroy(); return; }
    }

    const { x, y } = this;
    if (x < -60 || x > 860 || y < -60 || y > 520) {
      this.destroy();
    }
  }
}
