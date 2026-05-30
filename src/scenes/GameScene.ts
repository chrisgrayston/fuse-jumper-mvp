import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { Enemy, SpawnFn } from '../objects/Enemy';
import { Collectible } from '../objects/Collectible';
import { Projectile } from '../objects/Projectile';
import { LevelData, ProjectileType } from '../levels/types';
import { level1 } from '../levels/level1';
import { level2 } from '../levels/level2';
import { level3 } from '../levels/level3';
import { level4 } from '../levels/level4';
import { getTouchState, consumeJumpPressed } from '../input/touchInput';

const LEVELS: LevelData[] = [level1, level2, level3, level4];
const MAX_LIVES      = 3;
const SCORE_PER_PICK = 100;
const ORDER_BONUS    = 50;
const RESPAWN_DELAY  = 1200;

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private collectibles!: Phaser.Physics.Arcade.StaticGroup;
  private enemies!: Phaser.Physics.Arcade.Group;
  private projectilesGroup!: Phaser.Physics.Arcade.Group;
  private enemyControllers: Enemy[] = [];
  private projectileList: Projectile[] = [];

  private levelIndex: number = 0;
  private score: number = 0;
  private lives: number = MAX_LIVES;
  private pickupsLeft: number = 0;
  private nextExpected: number = 1;
  private isInvincible: boolean = false;
  private isRespawning: boolean = false;

  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private pickupText!: Phaser.GameObjects.Text;
  private clubText!: Phaser.GameObjects.Text;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };

  constructor() { super({ key: 'GameScene' }); }

  init(data: { levelIndex?: number; score?: number; lives?: number }): void {
    this.levelIndex = data.levelIndex ?? 0;
    this.score      = data.score      ?? 0;
    this.lives      = data.lives      ?? MAX_LIVES;
  }

  create(): void {
    this.pickupsLeft    = 11;
    this.nextExpected   = 1;
    this.isInvincible   = false;
    this.isRespawning   = false;
    this.enemyControllers = [];
    this.projectileList   = [];

    const level = LEVELS[this.levelIndex];
    const { width, height } = this.scale;

    this.drawBackground(level, width, height);
    this.physics.world.setBounds(0, 0, width, height);

    this.platforms = this.physics.add.staticGroup();
    this.buildPlatforms(level);

    this.collectibles = this.physics.add.staticGroup();
    this.buildCollectibles(level);

    const { x, y } = level.playerStart;
    this.player = new Player(this, x, y);

    this.enemies = this.physics.add.group();
    this.projectilesGroup = this.physics.add.group();
    this.buildEnemies(level);

    // Colliders
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);

    this.physics.add.overlap(this.player, this.collectibles, (_p, c) => {
      this.pickupPlayer(c as Collectible);
    });
    this.physics.add.overlap(this.player, this.enemies, () => { this.hitPlayer(); });
    this.physics.add.overlap(this.player, this.projectilesGroup, (_p, proj) => {
      (proj as Projectile).destroy();
      this.hitPlayer();
    });

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up:    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left:  this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.createHUD(level);
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
      this.cursors.up.isDown || this.cursors.space.isDown ||
      this.wasd.up.isDown    || touch.jumpHeld;
    consumeJumpPressed();

    this.player.handleMovement(left, right, jumpPressed, jumpHeld);

    const px = this.player.x;
    const py = this.player.y;
    for (const ec of this.enemyControllers) {
      ec.update(delta, px, py);
    }

    // Update projectiles and cull off-screen
    for (let i = this.projectileList.length - 1; i >= 0; i--) {
      const p = this.projectileList[i];
      if (!p.active) {
        this.projectileList.splice(i, 1);
        continue;
      }
      p.update();
      if (!p.active) this.projectileList.splice(i, 1);
    }
  }

  // ── Build ─────────────────────────────────────────────────────────────────

  private drawBackground(level: LevelData, width: number, height: number): void {
    // Club art backdrop at very low opacity
    const artKeys = ['art-club1800', 'art-club2000', 'art-club2100', 'art-club2200'];
    const artKey = artKeys[this.levelIndex];
    if (artKey && this.textures.exists(artKey)) {
      const bgArt = this.add.image(width / 2, height / 2, artKey).setDepth(0);
      const sx = width / bgArt.width;
      const sy = height / bgArt.height;
      bgArt.setScale(Math.max(sx, sy)).setAlpha(0.11);
    }

    this.add.rectangle(width / 2, height / 2, width, height, level.bgPrimary, 0.80);

    // Ambient particles / stars
    for (let i = 0; i < 60; i++) {
      const sx = Phaser.Math.Between(0, width);
      const sy = Phaser.Math.Between(0, height);
      const sr = Phaser.Math.FloatBetween(0.3, 1.5);
      const col = level.club === 2200
        ? 0xf0d080 // gold stars for Club 2200
        : 0xffffff;
      this.add.circle(sx, sy, sr, col, Phaser.Math.FloatBetween(0.2, 0.8)).setDepth(0);
    }

    // Club-specific neon accent lines
    const neonAlpha = 0.18;
    for (let row = 0; row < height; row += 50) {
      this.add.rectangle(width / 2, row, width, 1, level.accentColor, neonAlpha).setDepth(0);
    }

    // Club label (background watermark)
    this.add.text(width / 2, height / 2, `CLUB\n${level.club}`, {
      fontSize: '90px',
      fontFamily: 'monospace',
      color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0.04).setDepth(0);
  }

  private buildPlatforms(level: LevelData): void {
    for (const p of level.platforms) {
      const gfx = this.add.graphics().setDepth(2);
      gfx.fillStyle(level.club === 2200 ? 0x998855 : 0x445566);
      gfx.fillRect(p.x, p.y, p.width, p.height);
      gfx.fillStyle(level.accentColor, 0.5);
      gfx.fillRect(p.x, p.y, p.width, 3);
      gfx.fillStyle(0x223344, 0.4);
      gfx.fillRect(p.x, p.y + p.height - 3, p.width, 3);

      const zone = this.physics.add.staticImage(
        p.x + p.width / 2, p.y + p.height / 2, '__DEFAULT',
      ).setVisible(false);
      const body = zone.body as Phaser.Physics.Arcade.StaticBody;
      body.setSize(p.width, p.height);
      body.reset(p.x + p.width / 2, p.y + p.height / 2);
      this.platforms.add(zone);
    }
  }

  private buildCollectibles(level: LevelData): void {
    for (const pd of level.players) {
      const c = new Collectible(this, pd.x, pd.y, pd.number);
      // Overlay the number on the jersey texture
      this.add.text(pd.x, pd.y, `${pd.number}`, {
        fontSize: '10px',
        fontFamily: 'monospace',
        color: '#111111',
        fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(6);
      this.collectibles.add(c);
    }
  }

  private buildEnemies(level: LevelData): void {
    const spawnFn: SpawnFn = (x, y, type: ProjectileType, vx, vy) => {
      const proj = new Projectile(this, x, y, type, vx, vy);
      this.projectilesGroup.add(proj);
      this.projectileList.push(proj);
    };

    for (const ed of level.enemies) {
      const enemy = new Enemy(this, ed, spawnFn);
      this.enemies.add(enemy as unknown as Phaser.GameObjects.GameObject);
      this.enemyControllers.push(enemy);
    }
  }

  // ── Gameplay ──────────────────────────────────────────────────────────────

  private pickupPlayer(c: Collectible): void {
    const num = c.playerNumber;
    c.collect();
    this.collectibles.remove(c, true, true);

    let pts = SCORE_PER_PICK;
    if (num === this.nextExpected) {
      pts += ORDER_BONUS;
      this.nextExpected++;
    }
    this.score += pts;
    this.pickupsLeft--;
    this.updateHUD();

    // Flash bonus text
    const label = pts > SCORE_PER_PICK ? `+${pts} IN ORDER!` : `+${pts}`;
    const flash = this.add.text(c.x, c.y - 10, label, {
      fontSize: '14px', fontFamily: 'monospace',
      color: pts > SCORE_PER_PICK ? '#ffee00' : '#aaffaa',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(25);
    this.tweens.add({ targets: flash, y: flash.y - 30, alpha: 0, duration: 900, onComplete: () => flash.destroy() });

    if (this.pickupsLeft <= 0) {
      this.time.delayedCall(700, () => {
        const nextLevel = this.levelIndex + 1;
        if (nextLevel < LEVELS.length) {
          this.scene.start('LevelCompleteScene', {
            score: this.score,
            lives: this.lives,
            levelIndex: this.levelIndex,
            nextLevelIndex: nextLevel,
          });
        } else {
          this.scene.start('LevelCompleteScene', {
            score: this.score,
            lives: this.lives,
            levelIndex: this.levelIndex,
            nextLevelIndex: -1, // game complete
          });
        }
      });
    }
  }

  private hitPlayer(): void {
    if (this.isInvincible || this.isRespawning) return;

    this.lives--;
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
      targets: this.player, alpha: 0, duration: 110,
      yoyo: true, repeat: 6,
      onComplete: () => { this.player.setAlpha(1); },
    });

    this.time.delayedCall(RESPAWN_DELAY, () => {
      const { x, y } = LEVELS[this.levelIndex].playerStart;
      this.player.resetPosition(x, y);
      this.isRespawning = false;
      this.time.delayedCall(1500, () => { this.isInvincible = false; });
    });
  }

  // ── HUD ───────────────────────────────────────────────────────────────────

  private createHUD(level: LevelData): void {
    const s = {
      fontSize: '15px', fontFamily: 'monospace',
      color: '#ffffff', stroke: '#000000', strokeThickness: 2,
    };
    this.scoreText  = this.add.text(8,  6,  '', s).setDepth(20).setScrollFactor(0);
    this.livesText  = this.add.text(8,  24, '', s).setDepth(20).setScrollFactor(0);
    this.pickupText = this.add.text(8,  42, '', s).setDepth(20).setScrollFactor(0);
    this.clubText   = this.add.text(this.scale.width - 8, 6, `CLUB ${level.club}`, {
      ...s, color: `#${level.accentColor.toString(16).padStart(6, '0')}`,
    }).setDepth(20).setScrollFactor(0).setOrigin(1, 0);
    this.updateHUD();
  }

  private updateHUD(): void {
    this.scoreText.setText(`SCORE: ${this.score}`);
    this.livesText.setText(`LIVES: ${'♥ '.repeat(this.lives).trim()}`);
    this.pickupText.setText(`SQUAD: ${11 - this.pickupsLeft}/11`);
  }
}
