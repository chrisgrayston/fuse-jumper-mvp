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
  }

  startPulse(): void {
    this.glowTween?.stop();
    this.setTint(0xffee44);
    this.glowTween = this.scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0.45 },
      duration: 320,
      yoyo: true,
      repeat: -1,
      ease: 'Quad.easeInOut',
    });
  }

  stopPulse(): void {
    this.glowTween?.stop();
    this.clearTint();
    this.setAlpha(1);
  }

  collect(): void {
    this.glowTween?.stop();
    this.destroy();
  }
}
