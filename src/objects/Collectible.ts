import Phaser from 'phaser';

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  private glowTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'fuse');
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body
    this.setDepth(5);

    this.glowTween = scene.tweens.add({
      targets: this,
      alpha: 0.4,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  collect(): void {
    this.glowTween?.stop();
    this.destroy();
  }
}
