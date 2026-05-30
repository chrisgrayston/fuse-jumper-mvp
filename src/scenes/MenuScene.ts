import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.scale;

    // Background gradient feel via rectangles
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a0a2e);

    // Decorative stars
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const r = Phaser.Math.FloatBetween(0.5, 2);
      this.add.circle(x, y, r, 0xffffff, Phaser.Math.FloatBetween(0.3, 0.9));
    }

    // Title
    this.add.text(width / 2, height * 0.22, 'FUSE JUMPER', {
      fontSize: '52px',
      fontFamily: 'monospace',
      color: '#ffee00',
      stroke: '#ff6600',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.38, 'Collect all fuses!\nAvoid the enemies.', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#aaddff',
      align: 'center',
    }).setOrigin(0.5);

    // Controls hint
    this.add.text(width / 2, height * 0.58, '← → or A/D  to move\nSPACE or W  to jump\nHold JUMP to float', {
      fontSize: '15px',
      fontFamily: 'monospace',
      color: '#88aacc',
      align: 'center',
    }).setOrigin(0.5);

    // Start button / prompt
    const startText = this.add.text(width / 2, height * 0.80, 'TAP OR PRESS SPACE TO START', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffffff',
    }).setOrigin(0.5).setInteractive();

    this.tweens.add({
      targets: startText,
      alpha: 0.2,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const startGame = (): void => {
      this.scene.start('GameScene');
    };

    startText.on('pointerdown', startGame);

    this.input.keyboard?.on('keydown-SPACE', startGame);
    this.input.keyboard?.on('keydown-ENTER', startGame);
  }
}
