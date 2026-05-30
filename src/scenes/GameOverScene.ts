import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: { score: number }): void {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a0a2e, 0.92);

    this.add.text(width / 2, height * 0.28, 'GAME OVER', {
      fontSize: '56px',
      fontFamily: 'monospace',
      color: '#ff2244',
      stroke: '#880000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.5, `SCORE: ${data?.score ?? 0}`, {
      fontSize: '28px',
      fontFamily: 'monospace',
      color: '#ffee00',
    }).setOrigin(0.5);

    const restartText = this.add.text(width / 2, height * 0.72, 'TAP OR PRESS SPACE TO RETRY', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffffff',
    }).setOrigin(0.5).setInteractive();

    this.tweens.add({
      targets: restartText,
      alpha: 0.2,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    const restart = (): void => {
      this.scene.start('GameScene', { levelIndex: 0, score: 0, lives: 3 });
    };

    restartText.on('pointerdown', restart);
    this.input.keyboard?.on('keydown-SPACE', restart);
    this.input.keyboard?.on('keydown-ENTER', restart);
  }
}
