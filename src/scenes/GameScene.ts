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

type CoinType = 'tc' | 'bb' | 'ww' | 'fh';

const LEVELS: LevelData[] = [level1, level2, level3, level4];
const MAX_LIVES      = 3;
const COIN_INTERVAL  = 10000; // ms between coin-drop rolls
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

  private collectibleMap!: Map<number, Collectible>;
  private allPlayerPositions!: Map<number, { x: number; y: number }>;
  private sequenceActive!: boolean;
  private godMode = false;

  private coinsGroup!: Phaser.Physics.Arcade.Group;
  private coinList: Phaser.Physics.Arcade.Sprite[] = [];
  private coinTimer    = 0;
  private coinsDropped = 0;
  private scoreMult    = 1;

  private eelsGroup!: Phaser.Physics.Arcade.Group;
  private eelList:  Phaser.Physics.Arcade.Sprite[] = [];
  private eelTimer  = 0;
  private spawnFn!: SpawnFn;

  private isPaused = false;
  private pauseOverlayRect!: Phaser.GameObjects.Rectangle;
  private pauseLabelText!: Phaser.GameObjects.Text;
  private pauseHintText!: Phaser.GameObjects.Text;

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
    this.collectibleMap      = new Map();
    this.allPlayerPositions  = new Map();
    this.sequenceActive      = true;
    this.coinTimer           = 0;
    this.coinsDropped        = 0;
    this.scoreMult           = 1;
    this.coinList            = [];

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
    this.coinsGroup = this.physics.add.group();
    this.eelsGroup  = this.physics.add.group();
    this.eelList    = [];
    this.eelTimer   = 2000;   // first eel after 3 s
    this.buildEnemies(level);

    // Colliders
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.coinsGroup, this.platforms);
    this.physics.add.collider(this.eelsGroup, this.platforms);

    // Crate smash: crates physically stop on platforms and shatter
    this.physics.add.collider(
      this.projectilesGroup,
      this.platforms,
      (projObj) => {
        const proj = projObj as unknown as Projectile;
        if (!proj.active) return;
        proj.destroy();
        this.createCrateSmash(proj.x, proj.y);
      },
      (projObj) => {
        const proj = projObj as unknown as Projectile;
        return 'projType' in proj && (proj as Projectile).projType === 'crate';
      },
    );

    this.physics.add.overlap(this.player, this.collectibles, (_p, c) => {
      this.pickupPlayer(c as Collectible);
    });
    this.physics.add.overlap(this.player, this.enemies, () => { this.hitPlayer(); });
    this.physics.add.overlap(this.player, this.projectilesGroup, (_p, proj) => {
      (proj as Projectile).destroy();
      this.hitPlayer();
    });
    this.physics.add.overlap(this.player, this.eelsGroup, (_p, eelObj) => {
      const e = eelObj as Phaser.Physics.Arcade.Sprite;
      if (!e.active) return;
      e.destroy();
      const idx = this.eelList.indexOf(e);
      if (idx >= 0) this.eelList.splice(idx, 1);
      this.hitPlayer();
    });

    this.physics.add.overlap(this.player, this.coinsGroup, (_p, coinObj) => {
      const coin = coinObj as Phaser.Physics.Arcade.Sprite;
      if (!coin.active) return;
      const type = coin.getData('coinType') as CoinType;
      coin.destroy();
      this.applyCoinEffect(type);
    });

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up:    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left:  this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // ── Dev keys ──────────────────────────────────────────────────────────
    this.input.keyboard!.on('keydown', (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '4') {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < LEVELS.length) {
          this.scene.start('GameScene', { levelIndex: idx, score: 0, lives: MAX_LIVES });
        }
      }
      if (e.key === '5') {
        this.godMode = !this.godMode;
        this.updateHUD();
      }
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        this.togglePause();
      }
    });

    this.createHUD(level);
    this.createPauseUI(width, height);
  }

  update(_time: number, delta: number): void {
    if (this.isRespawning || this.isPaused) return;

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

    this.player.handleMovement(left, right, jumpPressed, jumpHeld, delta);

    // Coin drop timer — every 60 s, 50 % chance
    this.coinTimer += delta;
    if (this.coinTimer >= COIN_INTERVAL) {
      this.coinTimer = 0;
      if (this.coinsDropped < 3 && Math.random() < 0.5) this.spawnCoin();
    }

    // Eel spawner — every 5 s
    this.eelTimer += delta;
    if (this.eelTimer >= 5500) {
      this.eelTimer = 0;
      this.spawnEel();
    }

    // Update eels — gravity + leftward velocity, animate frames
    for (let i = this.eelList.length - 1; i >= 0; i--) {
      const e = this.eelList[i];
      if (!e.active) { this.eelList.splice(i, 1); continue; }
      const at = (e.getData('animT') as number) + delta;
      e.setData('animT', at);
      e.setTexture(`enemy-eel-${(Math.floor(at / 150) % 3) + 1}`);
      if (e.x < -80 || e.y > 520) { e.destroy(); this.eelList.splice(i, 1); }
    }

    // Bounce coins off world boundaries
    for (let i = this.coinList.length - 1; i >= 0; i--) {
      const c = this.coinList[i];
      if (!c.active) { this.coinList.splice(i, 1); continue; }
      const cb = c.body as Phaser.Physics.Arcade.Body;
      if (c.x <= 0)   { cb.velocity.x =  Math.abs(cb.velocity.x); c.setX(1); }
      if (c.x >= 800) { cb.velocity.x = -Math.abs(cb.velocity.x); c.setX(799); }
      if (c.y <= 0)   { cb.velocity.y =  Math.abs(cb.velocity.y); c.setY(1); }
      if (c.y >= 450) { cb.velocity.y = -Math.abs(cb.velocity.y); c.setY(449); }
    }

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
      p.update(delta);
      if (!p.active) this.projectileList.splice(i, 1);
    }
  }

  // ── Build ─────────────────────────────────────────────────────────────────

  private drawBackground(level: LevelData, width: number, height: number): void {
    const artKeys = ['art-club1800', 'art-club2000', 'art-club2100', 'art-club2200'];
    const artKey  = artKeys[this.levelIndex];

    const artForward = this.levelIndex <= 1;  // Club 1800 + 2000 both have full-art backgrounds
    // Club 2000 image is already very dark — show at near-full brightness with thin overlay
    const artAlpha   = this.levelIndex === 1 ? 0.85 : 0.78;
    const overlayAmt = this.levelIndex === 1 ? 0.18 : 0.28;

    if (artKey && this.textures.exists(artKey)) {
      const bgArt = this.add.image(width / 2, height / 2, artKey).setDepth(0);
      const sx = width  / bgArt.width;
      const sy = height / bgArt.height;
      bgArt.setScale(Math.max(sx, sy)).setAlpha(artForward ? artAlpha : 0.11);
    }

    // Colour tint / dark overlay
    const overlayAlpha = artForward ? overlayAmt : 0.80;
    this.add.rectangle(width / 2, height / 2, width, height, level.bgPrimary, overlayAlpha).setDepth(0);

    if (artForward) {
      // Vignette: dark fade at top and bottom so platforms/HUD stay readable
      this.add.rectangle(width / 2,      0, width, 90,  0x000000, 0.55).setDepth(0);
      this.add.rectangle(width / 2, height, width, 110, 0x000000, 0.60).setDepth(0);

      // Subtle accent scanlines
      for (let row = 0; row < height; row += 60) {
        this.add.rectangle(width / 2, row, width, 1, level.accentColor, 0.08).setDepth(0);
      }
    } else {
      // Ambient particles / stars (other levels keep the original feel)
      for (let i = 0; i < 60; i++) {
        const px = Phaser.Math.Between(0, width);
        const py = Phaser.Math.Between(0, height);
        const pr = Phaser.Math.FloatBetween(0.3, 1.5);
        const col = level.club === 2200 ? 0xf0d080 : 0xffffff;
        this.add.circle(px, py, pr, col, Phaser.Math.FloatBetween(0.2, 0.8)).setDepth(0);
      }

      for (let row = 0; row < height; row += 50) {
        this.add.rectangle(width / 2, row, width, 1, level.accentColor, 0.18).setDepth(0);
      }

      this.add.text(width / 2, height / 2, `CLUB\n${level.club}`, {
        fontSize: '90px',
        fontFamily: 'monospace',
        color: '#ffffff',
      }).setOrigin(0.5).setAlpha(0.04).setDepth(0);
    }
  }

  private buildPlatforms(level: LevelData): void {
    for (const p of level.platforms) {
      const gfx = this.add.graphics().setDepth(2);
      const platBody   = level.club === 2200 ? 0x998855
                       : level.club === 2000 ? 0x18080e
                       : 0x445566;
      const platShadow = level.club === 2000 ? 0x0a0003 : 0x223344;
      const glowAlpha  = level.club === 2000 ? 0.75 : 0.5;
      gfx.fillStyle(platBody);
      gfx.fillRect(p.x, p.y, p.width, p.height);
      gfx.fillStyle(level.accentColor, glowAlpha);
      gfx.fillRect(p.x, p.y, p.width, 3);
      gfx.fillStyle(platShadow, 0.5);
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
      this.collectibleMap.set(pd.number, c);
      this.allPlayerPositions.set(pd.number, { x: pd.x, y: pd.y });
      this.collectibles.add(c);
    }
    // Pulse only the first expected collectible
    this.collectibleMap.get(1)?.startPulse();
  }

  private buildEnemies(level: LevelData): void {
    this.spawnFn = (x, y, type: ProjectileType, vx, vy) => {
      const proj = new Projectile(this, x, y, type, vx, vy);
      this.projectilesGroup.add(proj);
      // group.add() resets the physics body, wiping velocity; re-apply immediately
      (proj.body as Phaser.Physics.Arcade.Body).setVelocity(vx, vy);
      this.projectileList.push(proj);
    };

    for (const ed of level.enemies) {
      const enemy = new Enemy(this, ed, this.spawnFn);
      this.enemies.add(enemy as unknown as Phaser.GameObjects.GameObject);
      this.enemyControllers.push(enemy);
    }
  }

  // ── Gameplay ──────────────────────────────────────────────────────────────

  private pickupPlayer(c: Collectible): void {
    const num = c.playerNumber;
    c.collect();
    this.collectibles.remove(c, true, true);
    this.collectibleMap.delete(num);

    let pts = SCORE_PER_PICK;
    if (this.sequenceActive && num === this.nextExpected) {
      pts += ORDER_BONUS;
      this.nextExpected++;
      this.collectibleMap.get(this.nextExpected)?.startPulse();
    } else if (this.sequenceActive && num !== this.nextExpected) {
      // First out-of-order pickup — kill the flash and lock out future bonuses
      this.sequenceActive = false;
      this.collectibleMap.get(this.nextExpected)?.stopPulse();
    }
    const earnedPts = pts * this.scoreMult;
    this.score += earnedPts;
    this.pickupsLeft--;
    this.updateHUD();

    // Flash bonus text
    const label = pts > SCORE_PER_PICK ? `+${earnedPts} IN ORDER!` : `+${earnedPts}`;
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

  private createCrateSmash(x: number, y: number): void {
    const img = this.add.image(x, y, 'proj-crate-smash-1').setDepth(12);
    this.time.delayedCall(240, () => {
      if (img.active) img.setTexture('proj-crate-smash-2');
      this.time.delayedCall(240, () => {
        if (img.active) img.setTexture('proj-crate-smash-3');
        this.time.delayedCall(240, () => { if (img.active) img.destroy(); });
      });
    });
    for (let i = 0; i < 3; i++) {
      const vx = Phaser.Math.Between(-340, 340);
      const vy  = -Phaser.Math.Between(260, 460);  // always upward
      this.spawnFn(x, y - 20, 'glass-shard', vx, vy);
    }
  }

  private hitPlayer(): void {
    if (this.godMode || this.isInvincible || this.isRespawning) return;

    this.lives--;
    this.isRespawning = true;  // block all further hits immediately
    this.updateHUD();

    if (this.lives <= 0) {
      this.time.delayedCall(400, () => {
        this.scene.start('GameOverScene', { score: this.score });
      });
      return;
    }

    this.isInvincible = true;

    // Reset all enemies to spawn positions
    for (const enemy of this.enemyControllers) enemy.resetEnemy();

    // Clear in-flight projectiles
    for (const proj of this.projectileList) { if (proj.active) proj.destroy(); }
    this.projectileList = [];

    // Clear eels
    for (const eel of this.eelList) { if (eel.active) eel.destroy(); }
    this.eelList  = [];
    this.eelTimer = 2000;

    const flashTween = this.tweens.add({
      targets: this.player, alpha: 0, duration: 110,
      yoyo: true, repeat: 6,
      onComplete: () => { this.player.setAlpha(1); },
    });

    this.time.delayedCall(RESPAWN_DELAY, () => {
      flashTween.stop();
      const { x, y } = LEVELS[this.levelIndex].playerStart;
      this.player.resetPosition(x, y);
      this.player.setAlpha(1);
      this.isRespawning = false;
      this.time.delayedCall(1500, () => { this.isInvincible = false; });
    });
  }

  // ── Eels ──────────────────────────────────────────────────────────────────

  private spawnEel(): void {
    const spawnX = Phaser.Math.Between(520, 660);
    const spawnY = Phaser.Math.Between(-20, 40);
    const eel = this.physics.add.sprite(spawnX, spawnY, 'enemy-eel-1');
    eel.setDepth(7);
    eel.setData('animT', 0);
    this.eelsGroup.add(eel);
    const body = eel.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = true;
    body.setVelocityX(-60);
    this.eelList.push(eel);
  }

  // ── Coins ─────────────────────────────────────────────────────────────────

  private spawnCoin(): void {
    this.coinsDropped++;
    const types: CoinType[] = ['tc', 'bb', 'ww', 'fh'];
    const type = types[Phaser.Math.Between(0, 3)];
    const x    = Phaser.Math.Between(60, 640);
    const coin = this.physics.add.sprite(x, -30, `coin-${type}`);
    coin.setDepth(15);
    coin.setData('coinType', type);
    this.coinsGroup.add(coin);
    const body = coin.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = true;
    body.setBounce(0.5);
    body.setVelocity(Phaser.Math.Between(30, 70), 80);
    this.coinList.push(coin);

    const names: Record<CoinType, string> = { tc: 'TRIPLE CAPTAIN!', bb: 'BENCH BOOST!', ww: 'WILDCARD!', fh: 'FREE HIT!' };
    const clrs:  Record<CoinType, string> = { tc: '#ffcc00', bb: '#00ccff', ww: '#cc44ff', fh: '#44ee44' };
    const flash = this.add.text(this.scale.width / 2, 55, names[type], {
      fontSize: '15px', fontFamily: 'monospace',
      color: clrs[type], stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(25).setScrollFactor(0);
    this.tweens.add({ targets: flash, alpha: 0, duration: 2000, delay: 1200, onComplete: () => flash.destroy() });
  }

  private applyCoinEffect(type: CoinType): void {
    const clrs: Record<CoinType, string> = { tc: '#ffcc00', bb: '#00ccff', ww: '#cc44ff', fh: '#44ee44' };
    let msg = '';
    switch (type) {
      case 'tc':
        this.scoreMult = 3;
        msg = 'x3 SCORE ACTIVATED!';
        this.updateHUD();
        break;
      case 'bb':
        this.spawnBBShirts();
        msg = 'BENCH BOOST! +4 SHIRTS';
        break;
      case 'ww':
        this.applyWildcard();
        msg = 'WILDCARD! SHIRTS RESTORED';
        break;
      case 'fh':
        this.lives++;
        msg = 'FREE HIT! +1 LIFE';
        this.updateHUD();
        break;
    }
    const flash = this.add.text(this.scale.width / 2, 200, msg, {
      fontSize: '18px', fontFamily: 'monospace',
      color: clrs[type], stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(25).setScrollFactor(0);
    this.tweens.add({ targets: flash, y: flash.y - 50, alpha: 0, duration: 1800, onComplete: () => flash.destroy() });
  }

  private spawnBBShirts(): void {
    const plats = LEVELS[this.levelIndex].platforms.filter(p => p.height < 20);
    for (let num = 12; num <= 15; num++) {
      if (this.collectibleMap.has(num)) continue;
      const plat = plats[Phaser.Math.Between(0, plats.length - 1)];
      const rx = Phaser.Math.Between(plat.x + 10, plat.x + plat.width - 10);
      const ry = plat.y - 18;
      const c = new Collectible(this, rx, ry, num);
      this.collectibleMap.set(num, c);
      this.allPlayerPositions.set(num, { x: rx, y: ry });
      this.collectibles.add(c);
      this.pickupsLeft++;
    }
    this.updateHUD();
  }

  private applyWildcard(): void {
    for (const [num, pos] of this.allPlayerPositions) {
      if (!this.collectibleMap.has(num)) {
        const c = new Collectible(this, pos.x, pos.y, num);
        this.collectibleMap.set(num, c);
        this.collectibles.add(c);
        this.pickupsLeft++;
      }
    }
    this.updateHUD();
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
    this.clubText   = this.add.text(this.scale.width - 52, 6, `CLUB ${level.club}`, {
      ...s, color: `#${level.accentColor.toString(16).padStart(6, '0')}`,
    }).setDepth(20).setScrollFactor(0).setOrigin(1, 0);
    this.updateHUD();
  }

  private createPauseUI(width: number, height: number): void {
    // Dark overlay — only visible + interactive when paused
    this.pauseOverlayRect = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.65)
      .setScrollFactor(0).setDepth(40).setVisible(false);
    this.pauseOverlayRect.setInteractive();
    this.pauseOverlayRect.on('pointerdown', () => this.togglePause());
    this.pauseOverlayRect.removeInteractive();

    this.pauseLabelText = this.add.text(width / 2, height / 2, 'PAUSED', {
      fontSize: '34px', fontFamily: 'monospace',
      color: '#ffffff', stroke: '#000000', strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(41).setVisible(false);

    this.pauseHintText = this.add.text(width / 2, height / 2 + 38, 'tap anywhere  /  press P to resume', {
      fontSize: '12px', fontFamily: 'monospace', color: '#aaaaaa',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(41).setVisible(false);

    // Pause button — top-right corner, always visible
    const bx = width - 22, by = 16;
    const btnGfx = this.add.graphics().setScrollFactor(0).setDepth(41);
    btnGfx.fillStyle(0x000000, 0.55);
    btnGfx.fillRoundedRect(bx - 18, by - 13, 36, 26, 5);
    btnGfx.fillStyle(0xffffff, 0.88);
    btnGfx.fillRect(bx - 7, by - 7, 5, 14);
    btnGfx.fillRect(bx + 2, by - 7, 5, 14);

    this.add.zone(bx, by, 48, 38)
      .setScrollFactor(0).setDepth(42).setInteractive()
      .on('pointerdown', () => this.togglePause());
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.physics.pause();
      this.pauseOverlayRect.setVisible(true).setInteractive();
      this.pauseLabelText.setVisible(true);
      this.pauseHintText.setVisible(true);
    } else {
      this.physics.resume();
      this.pauseOverlayRect.setVisible(false).removeInteractive();
      this.pauseLabelText.setVisible(false);
      this.pauseHintText.setVisible(false);
    }
  }

  private updateHUD(): void {
    this.scoreText.setText(`SCORE: ${this.score}${this.scoreMult > 1 ? ` x${this.scoreMult}` : ''}`);
    this.livesText.setText(this.godMode ? 'LIVES: ∞' : `LIVES: ${'♥ '.repeat(this.lives).trim()}`);
    this.pickupText.setText(`SQUAD: ${this.pickupsLeft} left`);
  }
}
