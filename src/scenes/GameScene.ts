import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { Enemy } from '../objects/Enemy';
import { Collectible } from '../objects/Collectible';
import { level1 } from '../levels/level1';

const TOTAL_FUSES = 20;
const MAX_LIVES = 3;
const SCORE_PER_FUSE = 100;
const RESPAWN_DELAY = 1200;

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private fuses!: Phaser.Physics.Arcade.StaticGroup;
  private enemies!: Phaser.Physics.Arcade.Group;
  private enemyObjects: Enemy[] = [];

  private score: number = 0;
  private lives: number = MAX_LIVES;
  private fusesLeft: number = TOTAL_FUSES;
  private isInvincible: boolean = false;
  private isRespawning: boolean = false;

  // UI
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private fusesText!: Phaser.GameObjects.Text;

  // Controls
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private touchLeft: boolean = false;
  private touchRight: boolean = false;
  private touchJump: boolean = false;
  private touchJumpHeld: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.score = 0;
    this.lives = MAX_LIVES;
    this.fusesLeft = TOTAL_FUSES;
    this.isInvincible = false;
    this.isRespawning = false;
    this.enemyObjects = [];

    const { width, height } = this.scale;

    // Background
    this.drawBackground(width, height);

    // Physics world bounds
    this.physics.world.setBounds(0, 0, width, height);

    // Platforms
    this.platforms = this.physics.add.staticGroup();
    this.buildPlatforms();

    // Fuses
    this.fuses = this.physics.add.staticGroup();
    this.buildFuses();

    // Player
    const { x, y } = level1.playerStart;
    this.player = new Player(this, x, y);

    // Enemies
    this.enemies = this.physics.add.group();
    this.buildEnemies();

    // Colliders
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);

    this.physics.add.overlap(
      this.player,
      this.fuses,
      (_player, fuse) => {
        this.collectFuse(fuse as Collectible);
      },
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      () => {
        this.hitByEnemy();
      },
    );

    // Keyboard
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // HUD
    this.createHUD();

    // Touch controls
    this.createTouchControls();
  }

  update(_time: number, delta: number): void {
    if (this.isRespawning) return;

    const left  = this.cursors.left.isDown  || this.wasd.left.isDown  || this.touchLeft;
    const right = this.cursors.right.isDown || this.wasd.right.isDown || this.touchRight;

    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.up) ||
      this.touchJump;

    const jumpHeld =
      this.cursors.up.isDown ||
      this.cursors.space.isDown ||
      this.wasd.up.isDown ||
      this.touchJumpHeld;

    this.touchJump = false; // consume single-frame flag

    this.player.handleMovement(left, right, jumpPressed, jumpHeld);

    for (const enemy of this.enemyObjects) {
      enemy.update(delta);
    }
  }

  // ── Build helpers ────────────────────────────────────────────────────────

  private drawBackground(width: number, height: number): void {
    // Deep space gradient effect
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a0a2e);

    // Stars
    for (let i = 0; i < 80; i++) {
      const sx = Phaser.Math.Between(0, width);
      const sy = Phaser.Math.Between(0, height);
      const sr = Phaser.Math.FloatBetween(0.4, 1.8);
      this.add.circle(sx, sy, sr, 0xffffff, Phaser.Math.FloatBetween(0.2, 0.8)).setDepth(0);
    }

    // Subtle horizontal scan lines feel
    for (let row = 0; row < height; row += 40) {
      this.add.rectangle(width / 2, row, width, 1, 0x334455, 0.15).setDepth(0);
    }
  }

  private buildPlatforms(): void {
    for (const p of level1.platforms) {
      // Build platform from tiled graphics
      const gfx = this.add.graphics().setDepth(2);
      gfx.fillStyle(0x445566);
      gfx.fillRect(p.x, p.y, p.width, p.height);
      gfx.fillStyle(0x6688aa);
      gfx.fillRect(p.x, p.y, p.width, 3);
      gfx.fillStyle(0x223344, 0.5);
      gfx.fillRect(p.x, p.y + p.height - 3, p.width, 3);

      // Static body zone for physics
      const zone = this.physics.add.staticImage(
        p.x + p.width / 2,
        p.y + p.height / 2,
        '__DEFAULT',
      ).setVisible(false);
      const body = zone.body as Phaser.Physics.Arcade.StaticBody;
      body.setSize(p.width, p.height);
      body.reset(p.x + p.width / 2, p.y + p.height / 2);
      this.platforms.add(zone);
    }
  }

  private buildFuses(): void {
    for (const f of level1.fuses) {
      const fuse = new Collectible(this, f.x, f.y);
      this.fuses.add(fuse);
    }
  }

  private buildEnemies(): void {
    for (const e of level1.enemies) {
      const enemy = new Enemy(
        this,
        e.x,
        e.y,
        e.type,
        e.patrolLeft,
        e.patrolRight,
      );
      this.enemies.add(enemy);
      this.enemyObjects.push(enemy);
    }
  }

  // ── Gameplay ─────────────────────────────────────────────────────────────

  private collectFuse(fuse: Collectible): void {
    (fuse as Collectible).collect();
    this.fuses.remove(fuse, true, true);
    this.score += SCORE_PER_FUSE;
    this.fusesLeft -= 1;
    this.updateHUD();

    if (this.fusesLeft <= 0) {
      this.time.delayedCall(600, () => {
        this.scene.start('LevelCompleteScene', { score: this.score });
      });
    }
  }

  private hitByEnemy(): void {
    if (this.isInvincible || this.isRespawning) return;

    this.lives -= 1;
    this.updateHUD();

    if (this.lives <= 0) {
      this.time.delayedCall(400, () => {
        this.scene.start('GameOverScene', { score: this.score });
      });
      return;
    }

    this.isRespawning = true;
    this.isInvincible = true;

    // Flash player
    this.tweens.add({
      targets: this.player,
      alpha: 0,
      duration: 120,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.player.setAlpha(1);
      },
    });

    this.time.delayedCall(RESPAWN_DELAY, () => {
      this.player.resetPosition(level1.playerStart.x, level1.playerStart.y);
      this.isRespawning = false;

      // Invincibility grace period
      this.time.delayedCall(1500, () => {
        this.isInvincible = false;
      });
    });
  }

  // ── HUD ──────────────────────────────────────────────────────────────────

  private createHUD(): void {
    const hudStyle = {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    };

    this.scoreText  = this.add.text(8,  6, '',  hudStyle).setDepth(20).setScrollFactor(0);
    this.livesText  = this.add.text(8,  24, '', hudStyle).setDepth(20).setScrollFactor(0);
    this.fusesText  = this.add.text(8,  42, '', hudStyle).setDepth(20).setScrollFactor(0);
    this.updateHUD();
  }

  private updateHUD(): void {
    this.scoreText.setText(`SCORE: ${this.score}`);
    this.livesText.setText(`LIVES: ${'♥ '.repeat(this.lives).trim()}`);
    this.fusesText.setText(`FUSES: ${this.fusesLeft}`);
  }

  // ── Touch controls ────────────────────────────────────────────────────────

  private createTouchControls(): void {
    const { width, height } = this.scale;
    const btnSize = 64;
    const margin = 16;
    const btnY = height - margin - btnSize / 2;
    const alpha = 0.45;

    const btnStyle = {
      fontSize: '22px',
      fontFamily: 'monospace',
      color: '#ffffff',
    };

    // Left button
    const leftBtn = this.add
      .circle(margin + btnSize / 2, btnY, btnSize / 2, 0x334466, alpha)
      .setDepth(30)
      .setScrollFactor(0)
      .setInteractive();
    this.add.text(margin + btnSize / 2, btnY, '◀', btnStyle)
      .setOrigin(0.5)
      .setDepth(31)
      .setScrollFactor(0);

    // Right button
    const rightBtn = this.add
      .circle(margin + btnSize * 1.5 + 8, btnY, btnSize / 2, 0x334466, alpha)
      .setDepth(30)
      .setScrollFactor(0)
      .setInteractive();
    this.add.text(margin + btnSize * 1.5 + 8, btnY, '▶', btnStyle)
      .setOrigin(0.5)
      .setDepth(31)
      .setScrollFactor(0);

    // Jump button (right side)
    const jumpBtn = this.add
      .circle(width - margin - btnSize / 2, btnY, btnSize / 2, 0x664433, alpha)
      .setDepth(30)
      .setScrollFactor(0)
      .setInteractive();
    this.add.text(width - margin - btnSize / 2, btnY, '▲', btnStyle)
      .setOrigin(0.5)
      .setDepth(31)
      .setScrollFactor(0);

    this.wireButton(leftBtn,  () => { this.touchLeft  = true;  },
                              () => { this.touchLeft  = false; });
    this.wireButton(rightBtn, () => { this.touchRight = true;  },
                              () => { this.touchRight = false; });
    this.wireButton(jumpBtn,
      () => { this.touchJump = true; this.touchJumpHeld = true;  },
      () => { this.touchJumpHeld = false; },
    );
  }

  private wireButton(
    obj: Phaser.GameObjects.Arc,
    onDown: () => void,
    onUp: () => void,
  ): void {
    obj.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event.preventDefault();
      onDown();
    });
    obj.on('pointerup',   onUp);
    obj.on('pointerout',  onUp);
  }
}
