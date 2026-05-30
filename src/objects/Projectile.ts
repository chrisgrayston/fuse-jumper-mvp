import Phaser from 'phaser';
import { ProjectileType } from '../levels/types';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  readonly projType: ProjectileType;

  // Bubble-specific stochastic state
  private readonly bubbleSineFreq: number;
  private readonly bubbleSineAmp: number;
  private readonly bubbleSinePhase: number;
  private bubbleSineT = 0;
  private bubbleVY: number; // tracked independently — never read back from physics body

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
      // Belt-and-suspenders: zero out body-local gravity too
      body.setGravityY(0);
    } else if (type === 'crate') {
      body.allowGravity = false; // crates use initial velocity only
    } else {
      body.allowGravity = true;  // other projectiles arc under gravity
    }

    body.setVelocity(vx, vy);
    body.setCollideWorldBounds(false);

    if (type === 'bubble') {
      this.bubbleSineFreq  = Phaser.Math.FloatBetween(0.9, 1.9);
      this.bubbleSineAmp   = Phaser.Math.FloatBetween(28, 55);
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

    const { x, y } = this;
    if (x < -60 || x > 860 || y < -60 || y > 520) {
      this.destroy();
    }
  }
}
