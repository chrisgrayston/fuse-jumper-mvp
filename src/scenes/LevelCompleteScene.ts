import Phaser from 'phaser';

const CLUB_NAMES: Record<number, string> = {
  1800: 'CLUB 1800',
  2000: 'CLUB 2000',
  2100: 'CLUB 2100',
  2200: 'CLUB 2200',
};

export class LevelCompleteScene extends Phaser.Scene {
  constructor() { super({ key: 'LevelCompleteScene' }); }

  create(data: { score: number; lives: number; levelIndex: number; nextLevelIndex: number }): void {
    const { width, height } = this.scale;
    const isGameComplete = data.nextLevelIndex === -1;

    this.add.rectangle(width / 2, height / 2, width, height, 0x0a1a0e, 0.93);

    const clubNames = [1800, 2000, 2100, 2200];
    const completedClub = CLUB_NAMES[clubNames[data.levelIndex]];

    this.add.text(width / 2, height * 0.18, isGameComplete ? 'TEAM COMPLETE!' : 'SQUAD FILLED!', {
      fontSize: '44px', fontFamily: 'monospace',
      color: '#00ff88', stroke: '#004422', strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.34, completedClub, {
      fontSize: '22px', fontFamily: 'monospace', color: '#aaffcc',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.46, `SCORE: ${data.score ?? 0}`, {
      fontSize: '26px', fontFamily: 'monospace', color: '#ffee00',
    }).setOrigin(0.5);

    if (isGameComplete) {
      this.add.text(width / 2, height * 0.60, 'All 4 clubs conquered!\nYour fantasy team is built.', {
        fontSize: '18px', fontFamily: 'monospace', color: '#aaffcc', align: 'center',
      }).setOrigin(0.5);
    } else {
      const nextClub = CLUB_NAMES[clubNames[data.nextLevelIndex]];
      this.add.text(width / 2, height * 0.60, `Next: ${nextClub}`, {
        fontSize: '20px', fontFamily: 'monospace', color: '#88ddff',
      }).setOrigin(0.5);
    }

    const btnLabel = isGameComplete ? 'TAP TO PLAY AGAIN' : 'TAP TO CONTINUE';
    const btn = this.add.text(width / 2, height * 0.80, btnLabel, {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5).setInteractive();

    this.tweens.add({ targets: btn, alpha: 0.2, duration: 700, yoyo: true, repeat: -1 });

    const next = (): void => {
      if (isGameComplete) {
        this.scene.start('GameScene', { levelIndex: 0, score: 0, lives: 3 });
      } else {
        this.scene.start('GameScene', {
          levelIndex: data.nextLevelIndex,
          score: data.score,
          lives: data.lives,
        });
      }
    };

    btn.on('pointerdown', next);
    this.input.keyboard?.on('keydown-SPACE', next);
    this.input.keyboard?.on('keydown-ENTER', next);
  }
}
