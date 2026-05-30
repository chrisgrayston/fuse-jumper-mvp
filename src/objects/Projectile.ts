import Phaser from 'phaser';
import { ProjectileType } from '../levels/types';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  readonly projType: ProjectileType;

  // Bubble stochastic drift state (set once on construction)
  private readonly bubbleSineFreq: number;
  private readonly bubbleSineAmp: number;
  private readonly bubbleSinePhase: number;
  private bubbleSineT = 0;

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
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(8);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = type === 'crate';
    body.setVelocity(vx, vy);
    body.setCollideWorldBounds(false);

    if (type === 'bubble') {
      // Each bubble gets unique drift characteristics
      this.bubbleSineFreq  = Phaser.Math.FloatBetween(0.9, 1.9);
      this.bubbleSineAmp   = Phaser.Math.FloatBetween(24, 52);
      this.bubbleSinePhase = Phaser.Math.FloatBetween(0, Math.PI * 2);
    } else {
      this.bubbleSineFreq  = 0;
      this.bubbleSineAmp   = 0;
      this.bubbleSinePhase = 0;
    }
  }

  update(delta: number): void {
    if (this.projType === 'bubble' && this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      this.bubbleSineT += delta * 0.001; // seconds

      // Sinusoidal horizontal drift — each bubble out of phase with others
      const vx = this.bubbleSineAmp * Math.sin(
        this.bubbleSineT * this.bubbleSineFreq * Math.PI * 2 + this.bubbleSinePhase,
      );

      // Upward speed bleeds toward a slow gentle float (~-20 px/s)
      const targetVY = -20;
      const currentVY = body.velocity.y;
      const newVY = currentVY + (targetVY - currentVY) * Math.min(1, delta * 0.0009);

      body.setVelocity(vx, newVY);
    }

    // Cull off-screen
    const { x, y } = this;
    if (x < -60 || x > 860 || y < -60 || y > 520) {
      this.destroy();
    }
  }
}
