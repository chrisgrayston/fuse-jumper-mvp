import Phaser from 'phaser';

export class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelCompleteScene' });
  }

  create(data: { score: number }): void {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x0a1a0e, 0.92);

    this.add.text(width / 2, height * 0.25, 'LEVEL COMPLETE!', {
      fontSize: '44px',
      fontFamily: 'monospace',
      color: '#00ff88',
      stroke: '#004422',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.44, 'All fuses collected!', {
      fontSize: '22px',
      fontFamily: 'monospace',
      color: '#aaffcc',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.56, `SCORE: ${data?.score ?? 0}`, {
      fontSize: '28px',
      fontFamily: 'monospace',
      color: '#ffee00',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.70, '— More levels coming soon —', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#668866',
    }).setOrigin(0.5);

    const playAgainText = this.add.text(width / 2, height * 0.84, 'TAP OR PRESS SPACE TO PLAY AGAIN', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#ffffff',
    }).setOrigin(0.5).setInteractive();

    this.tweens.add({
      targets: playAgainText,
      alpha: 0.2,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    const restart = (): void => {
      this.scene.start('GameScene');
    };

    playAgainText.on('pointerdown', restart);
    this.input.keyboard?.on('keydown-SPACE', restart);
    this.input.keyboard?.on('keydown-ENTER', restart);
  }
}
