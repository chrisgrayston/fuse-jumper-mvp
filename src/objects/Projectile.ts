import Phaser from 'phaser';
import { ProjectileType } from '../levels/types';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  readonly projType: ProjectileType;

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
    body.allowGravity = type !== 'crate'; // crates fall, rest don't
    if (type === 'bubble') {
      body.allowGravity = false;
    }
    body.setVelocity(vx, vy);
    body.setCollideWorldBounds(false);
  }

  update(): void {
    // Destroy when off screen
    const { x, y } = this;
    if (x < -60 || x > 860 || y < -60 || y > 520) {
      this.destroy();
    }
  }
}
