import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private enemyType: 'patrol' | 'flyer';
  private patrolLeft: number;
  private patrolRight: number;
  private baseY: number;
  private flyTime: number = 0;
  private flyAmplitude: number = 55;
  private flySpeed: number = 1.8;
  private patrolSpeed: number = 80;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: 'patrol' | 'flyer',
    patrolLeft = 0,
    patrolRight = 800,
  ) {
    const textureKey = type === 'patrol' ? 'enemy-patrol' : 'enemy-flyer';
    super(scene, x, y, textureKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.enemyType = type;
    this.patrolLeft = patrolLeft;
    this.patrolRight = patrolRight;
    this.baseY = y;
    this.setDepth(6);

    const body = this.body as Phaser.Physics.Arcade.Body;

    if (type === 'patrol') {
      body.setGravityY(0);
      body.allowGravity = false;
      body.setVelocityX(this.patrolSpeed);
      body.setImmovable(false);
    } else {
      body.setGravityY(0);
      body.allowGravity = false;
      body.setImmovable(false);
    }
  }

  update(delta: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (this.enemyType === 'patrol') {
      if (this.x <= this.patrolLeft) {
        body.setVelocityX(this.patrolSpeed);
        this.setFlipX(false);
      } else if (this.x >= this.patrolRight) {
        body.setVelocityX(-this.patrolSpeed);
        this.setFlipX(true);
      }
    } else {
      this.flyTime += delta * 0.001;
      const newY = this.baseY + Math.sin(this.flyTime * this.flySpeed * Math.PI) * this.flyAmplitude;
      body.y = newY - this.height / 2;
      // Horizontal drift
      const newX = 400 + Math.cos(this.flyTime * 0.7 * Math.PI) * 260;
      body.x = newX - this.width / 2;
    }
  }
}
