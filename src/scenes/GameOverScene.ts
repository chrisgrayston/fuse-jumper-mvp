import Phaser from 'phaser';

interface ScoreEntry { initials: string; score: number; }
type Phase = 'loading' | 'initials' | 'submitting' | 'board';

export class GameOverScene extends Phaser.Scene {
  private score = 0;
  private phase: Phase = 'loading';
  private chars = ['A', 'A', 'A'];
  private cursor = 0;
  private scores: ScoreEntry[] = [];
  private newEntryIndex = -1;
  private charTexts: Phaser.GameObjects.Text[] = [];
  private cursorBar!: Phaser.GameObjects.Text;
  private initialsObjs: Phaser.GameObjects.GameObject[] = [];

  constructor() { super({ key: 'GameOverScene' }); }

  create(data: { score: number }): void {
    this.score         = data?.score ?? 0;
    this.phase         = 'loading';
    this.chars         = ['A', 'A', 'A'];
    this.cursor        = 0;
    this.newEntryIndex = -1;
    this.initialsObjs  = [];

    const W = this.scale.width;   // 800
    const H = this.scale.height;  // 450

    this.add.rectangle(W / 2, H / 2, W, H, 0x08000f, 1);

    this.add.text(W / 2, 46, 'GAME OVER', {
      fontSize: '48px', fontFamily: 'monospace',
      color: '#ff2244', stroke: '#880000', strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(W / 2, 94, `SCORE: ${this.score}`, {
      fontSize: '24px', fontFamily: 'monospace', color: '#ffee00',
    }).setOrigin(0.5);

    const loadingTxt = this.add.text(W / 2, H / 2, 'LOADING...', {
      fontSize: '15px', fontFamily: 'monospace', color: '#444444',
    }).setOrigin(0.5);

    this.fetchScores()
      .then(scores => {
        this.scores = scores;
        loadingTxt.destroy();
        const qualifies = this.score > 0 &&
          (scores.length < 10 || this.score > scores[scores.length - 1].score);
        qualifies ? this.showInitials() : this.showBoard(-1);
      })
      .catch(() => {
        loadingTxt.destroy();
        this.score > 0 ? this.showInitials() : this.showBoard(-1);
      });
  }

  private async fetchScores(): Promise<ScoreEntry[]> {
    const res = await fetch('/api/scores');
    if (!res.ok) throw new Error('fetch failed');
    return res.json() as Promise<ScoreEntry[]>;
  }

  private showInitials(): void {
    this.phase = 'initials';
    const W = this.scale.width;

    const push = <T extends Phaser.GameObjects.GameObject>(o: T): T => {
      this.initialsObjs.push(o); return o;
    };

    push(this.add.text(W / 2, 133, 'ENTER YOUR INITIALS', {
      fontSize: '16px', fontFamily: 'monospace', color: '#9999cc',
    }).setOrigin(0.5));

    // ── Big ◀ / ▶ arrow buttons on the canvas ──────────────────────────────
    const prevBtn = push(this.add.text(W * 0.12, 210, '◀', {
      fontSize: '52px', fontFamily: 'monospace', color: '#cccccc',
      padding: { x: 18, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }));
    (prevBtn as Phaser.GameObjects.Text).on('pointerdown', () => this.cycleChar(-1));
    (prevBtn as Phaser.GameObjects.Text).on('pointerover', () => (prevBtn as Phaser.GameObjects.Text).setColor('#ffee00'));
    (prevBtn as Phaser.GameObjects.Text).on('pointerout',  () => (prevBtn as Phaser.GameObjects.Text).setColor('#cccccc'));

    const nextBtn = push(this.add.text(W * 0.88, 210, '▶', {
      fontSize: '52px', fontFamily: 'monospace', color: '#cccccc',
      padding: { x: 18, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }));
    (nextBtn as Phaser.GameObjects.Text).on('pointerdown', () => this.cycleChar(1));
    (nextBtn as Phaser.GameObjects.Text).on('pointerover', () => (nextBtn as Phaser.GameObjects.Text).setColor('#ffee00'));
    (nextBtn as Phaser.GameObjects.Text).on('pointerout',  () => (nextBtn as Phaser.GameObjects.Text).setColor('#cccccc'));

    // ── 3 letter boxes — tap to move cursor there ──────────────────────────
    const xs = [W / 2 - 70, W / 2, W / 2 + 70];
    this.charTexts = xs.map((x, i) => {
      const t = push(this.add.text(x, 208, this.chars[i], {
        fontSize: '54px', fontFamily: 'monospace', color: '#aaaaaa',
        padding: { x: 10, y: 4 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true }));
      (t as Phaser.GameObjects.Text).on('pointerdown', () => {
        this.cursor = i;
        this.updateInitialsDisplay();
      });
      return t as Phaser.GameObjects.Text;
    });

    // Cursor underline
    this.cursorBar = push(this.add.text(xs[0], 249, '▔▔', {
      fontSize: '18px', fontFamily: 'monospace', color: '#ffee00',
    }).setOrigin(0.5)) as Phaser.GameObjects.Text;

    // ── CONFIRM button ─────────────────────────────────────────────────────
    const confirmBtn = push(this.add.text(W / 2, 308, '[ CONFIRM ]', {
      fontSize: '22px', fontFamily: 'monospace', color: '#ffffff',
      padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }));
    (confirmBtn as Phaser.GameObjects.Text).on('pointerdown', () => this.advanceCursor());
    (confirmBtn as Phaser.GameObjects.Text).on('pointerover', () => (confirmBtn as Phaser.GameObjects.Text).setColor('#ffee00'));
    (confirmBtn as Phaser.GameObjects.Text).on('pointerout',  () => (confirmBtn as Phaser.GameObjects.Text).setColor('#ffffff'));

    push(this.add.text(W / 2, 358, '◀ ▶  CHANGE LETTER     ENTER / SPACE  CONFIRM', {
      fontSize: '11px', fontFamily: 'monospace', color: '#444444',
    }).setOrigin(0.5));

    this.updateInitialsDisplay();

    // Keyboard
    this.input.keyboard?.on('keydown-LEFT',  () => this.cycleChar(-1));
    this.input.keyboard?.on('keydown-RIGHT', () => this.cycleChar(1));
    this.input.keyboard?.on('keydown-DOWN',  () => this.cycleChar(-1));
    this.input.keyboard?.on('keydown-UP',    () => this.cycleChar(1));
    this.input.keyboard?.on('keydown-SPACE', () => this.advanceCursor());
    this.input.keyboard?.on('keydown-ENTER', () => this.advanceCursor());
  }

  private cycleChar(dir: number): void {
    if (this.phase !== 'initials') return;
    const code = this.chars[this.cursor].charCodeAt(0) + dir;
    this.chars[this.cursor] = String.fromCharCode(((code - 65 + 26) % 26) + 65);
    this.updateInitialsDisplay();
  }

  private advanceCursor(): void {
    if (this.phase !== 'initials') return;
    if (this.cursor < 2) {
      this.cursor++;
      this.updateInitialsDisplay();
    } else {
      void this.submitScore();
    }
  }

  private updateInitialsDisplay(): void {
    const xs = [this.scale.width / 2 - 70, this.scale.width / 2, this.scale.width / 2 + 70];
    this.charTexts.forEach((t, i) => {
      t.setText(this.chars[i]);
      t.setColor(i === this.cursor ? '#ffee00' : '#aaaaaa');
    });
    this.cursorBar.setX(xs[this.cursor]);
  }

  private async submitScore(): Promise<void> {
    this.phase = 'submitting';
    this.input.keyboard?.removeAllListeners();
    this.initialsObjs.forEach(o => (o as Phaser.GameObjects.Text).destroy());

    const initials = this.chars.join('');
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initials, score: this.score }),
      });
      this.scores = await res.json() as ScoreEntry[];
      this.newEntryIndex = this.scores.findIndex(
        s => s.initials === initials && s.score === this.score,
      );
    } catch { /* show board anyway */ }

    this.showBoard(this.newEntryIndex);
  }

  private showBoard(highlightIndex: number): void {
    this.phase = 'board';
    const W = this.scale.width;
    const H = this.scale.height;

    this.add.text(W / 2, 126, '── HIGH SCORES ──', {
      fontSize: '15px', fontFamily: 'monospace', color: '#f0c040',
    }).setOrigin(0.5);

    if (this.scores.length === 0) {
      this.add.text(W / 2, 270, 'NO SCORES YET', {
        fontSize: '16px', fontFamily: 'monospace', color: '#444444',
      }).setOrigin(0.5);
    }

    const startY = 152;
    const rowH   = 26;

    this.scores.forEach((entry, i) => {
      const y  = startY + i * rowH;
      const hi = i === highlightIndex;
      const col = hi ? '#ffee00' : (i < 3 ? '#f0c040' : '#bbbbbb');

      this.add.text(W * 0.13, y, `${hi ? '▶' : ' '}${i + 1}.`, {
        fontSize: '14px', fontFamily: 'monospace', color: col,
      }).setOrigin(0, 0.5);

      this.add.text(W * 0.50, y, entry.initials, {
        fontSize: '14px', fontFamily: 'monospace', color: col,
      }).setOrigin(0.5, 0.5);

      this.add.text(W * 0.80, y, String(entry.score).padStart(6, ' '), {
        fontSize: '14px', fontFamily: 'monospace', color: col,
      }).setOrigin(1, 0.5);
    });

    const hint = this.add.text(W / 2, H - 16, 'PRESS ANY KEY OR TAP TO CONTINUE', {
      fontSize: '13px', fontFamily: 'monospace', color: '#666666',
    }).setOrigin(0.5);

    this.tweens.add({ targets: hint, alpha: 0.15, duration: 700, yoyo: true, repeat: -1 });

    this.time.delayedCall(700, () => {
      const go = () => this.scene.start('MenuScene');
      this.input.keyboard?.once('keydown', go);
      this.input.once('pointerdown', go);
    });
  }
}
