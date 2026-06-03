import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.scale;

    // Art background: HeroesAndVillains poster
    const bgImg = this.add.image(width / 2, height / 2, 'art-heroes');
    const scaleX = width / bgImg.width;
    const scaleY = height / bgImg.height;
    bgImg.setScale(Math.max(scaleX, scaleY));

    // Dark vignette overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.62);

    // Flashing top alert bar — transfer window closing
    const alertBar = this.add.rectangle(width / 2, 18, width, 36, 0x007700, 0.88);
    this.tweens.add({ targets: alertBar, alpha: 0.5, duration: 400, yoyo: true, repeat: -1 });
    this.add.text(width / 2, 18, '  TRANSFER WINDOW CLOSES: 18:30  ', {
      fontSize: '13px', fontFamily: 'monospace', color: '#ffff00',
    }).setOrigin(0.5);

    // Main title
    this.add.text(width / 2, height * 0.31, 'DEADLINE DAY', {
      fontSize: '68px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#ff2200',
      strokeThickness: 7,
    }).setOrigin(0.5);

    // Tagline
    this.add.text(width / 2, height * 0.475, 'Build your 11-man fantasy squad', {
      fontSize: '17px', fontFamily: 'monospace', color: '#ffcc00',
    }).setOrigin(0.5);

    // Game aim
    this.add.text(width / 2, height * 0.555, 'Navigate 4 clubs  ·  Collect 11 players  ·  Survive the other players', {
      fontSize: '13px', fontFamily: 'monospace', color: '#aaddff',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.605, 'Watch out for the eels', {
      fontSize: '13px', fontFamily: 'monospace', color: '#aaddff',
    }).setOrigin(0.5);

    // Controls
    this.add.text(width / 2, height * 0.66, '← →  MOVE        SPACE / W  JUMP        HOLD JUMP  FLOAT', {
      fontSize: '11px', fontFamily: 'monospace', color: '#778899',
    }).setOrigin(0.5);

    // Start prompt
    const startText = this.add.text(width / 2, height * 0.83, 'TAP OR PRESS SPACE TO KICK OFF', {
      fontSize: '19px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setInteractive();

    this.tweens.add({
      targets: startText, alpha: 0.15, duration: 700,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    const startGame = (): void => {
      this.scene.start('LevelIntroScene', { levelIndex: 0, score: 0, lives: 3 });
    };

    startText.on('pointerdown', startGame);
    this.input.keyboard?.on('keydown-SPACE', startGame);
    this.input.keyboard?.on('keydown-ENTER', startGame);
  }
}
