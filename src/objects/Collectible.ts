import Phaser from 'phaser';

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  readonly playerNumber: number;
  private glowTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number, playerNumber: number) {
    const key = `player-${playerNumber}`;
    super(scene, x, y, key);
    this.playerNumber = playerNumber;
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setDepth(5);

    this.glowTween = scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 500 + playerNumber * 30,
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
