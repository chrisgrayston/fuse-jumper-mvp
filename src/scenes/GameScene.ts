import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { Enemy } from '../objects/Enemy';
import { Collectible } from '../objects/Collectible';
import { level1 } from '../levels/level1';
import { getTouchState, consumeJumpPressed } from '../input/touchInput';

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

  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private fusesText!: Phaser.GameObjects.Text;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

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

    this.drawBackground(width, height);
    this.physics.world.setBounds(0, 0, width, height);

    this.platforms = this.physics.add.staticGroup();
    this.buildPlatforms();

    this.fuses = this.physics.add.staticGroup();
    this.buildFuses();

    const { x, y } = level1.playerStart;
    this.player = new Player(this, x, y);

    this.enemies = this.physics.add.group();
    this.buildEnemies();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);

    this.physics.add.overlap(
      this.player,
      this.fuses,
      (_player, fuse) => { this.collectFuse(fuse as Collectible); },
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      () => { this.hitByEnemy(); },
    );

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up:    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left:  this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.createHUD();
  }

  update(_time: number, delta: number): void {
    if (this.isRespawning) return;

    const touch = getTouchState();

    const left  = this.cursors.left.isDown  || this.wasd.left.isDown  || touch.left;
    const right = this.cursors.right.isDown || this.wasd.right.isDown || touch.right;

    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.up) ||
      touch.jumpPressed;

    const jumpHeld =
      this.cursors.up.isDown ||
      this.cursors.space.isDown ||
      this.wasd.up.isDown ||
      touch.jumpHeld;

    consumeJumpPressed();

    this.player.handleMovement(left, right, jumpPressed, jumpHeld);

    for (const enemy of this.enemyObjects) {
      enemy.update(delta);
    }
  }

  // ── Build helpers ─────────────────────────────────────────────────────────

  private drawBackground(width: number, height: number): void {
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a0a2e);
    for (let i = 0; i < 80; i++) {
      const sx = Phaser.Math.Between(0, width);
      const sy = Phaser.Math.Between(0, height);
      const sr = Phaser.Math.FloatBetween(0.4, 1.8);
      this.add.circle(sx, sy, sr, 0xffffff, Phaser.Math.FloatBetween(0.2, 0.8)).setDepth(0);
    }
    for (let row = 0; row < height; row += 40) {
      this.add.rectangle(width / 2, row, width, 1, 0x334455, 0.15).setDepth(0);
    }
  }

  private buildPlatforms(): void {
    for (const p of level1.platforms) {
      const gfx = this.add.graphics().setDepth(2);
      gfx.fillStyle(0x445566);
      gfx.fillRect(p.x, p.y, p.width, p.height);
      gfx.fillStyle(0x6688aa);
      gfx.fillRect(p.x, p.y, p.width, 3);
      gfx.fillStyle(0x223344, 0.5);
      gfx.fillRect(p.x, p.y + p.height - 3, p.width, 3);

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
      const enemy = new Enemy(this, e.x, e.y, e.type, e.patrolLeft, e.patrolRight);
      this.enemies.add(enemy);
      this.enemyObjects.push(enemy);
    }
  }

  // ── Gameplay ──────────────────────────────────────────────────────────────

  private collectFuse(fuse: Collectible): void {
    fuse.collect();
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

    this.tweens.add({
      targets: this.player,
      alpha: 0,
      duration: 120,
      yoyo: true,
      repeat: 5,
      onComplete: () => { this.player.setAlpha(1); },
    });

    this.time.delayedCall(RESPAWN_DELAY, () => {
      this.player.resetPosition(level1.playerStart.x, level1.playerStart.y);
      this.isRespawning = false;
      this.time.delayedCall(1500, () => { this.isInvincible = false; });
    });
  }

  // ── HUD ───────────────────────────────────────────────────────────────────

  private createHUD(): void {
    const hudStyle = {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    };
    this.scoreText = this.add.text(8,  6,  '', hudStyle).setDepth(20).setScrollFactor(0);
    this.livesText = this.add.text(8,  24, '', hudStyle).setDepth(20).setScrollFactor(0);
    this.fusesText = this.add.text(8,  42, '', hudStyle).setDepth(20).setScrollFactor(0);
    this.updateHUD();
  }

  private updateHUD(): void {
    this.scoreText.setText(`SCORE: ${this.score}`);
    this.livesText.setText(`LIVES: ${'♥ '.repeat(this.lives).trim()}`);
    this.fusesText.setText(`FUSES: ${this.fusesLeft}`);
  }
}
