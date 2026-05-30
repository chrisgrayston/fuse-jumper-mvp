import Phaser from 'phaser';

const WALK_SPEED    = 200;
const JUMP_VELOCITY = -480;
const FLOAT_GRAVITY = 120;
const NORMAL_GRAVITY = 600;
const FLOAT_MAX_FALL = 80;

export class Player extends Phaser.Physics.Arcade.Sprite {
  private isFloating = false;
  private canJump    = false;
  private idleTime   = 0;
  private tapOn      = false;
  private tapTimer   = 0;
  private runTimer   = 0;
  private runFrame   = 1;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(10);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setMaxVelocityY(500);
    // Fix hitbox to the character body regardless of which texture is active
    body.setSize(22, 42);
    body.setOffset(9, 4);
  }

  handleMovement(
    left: boolean,
    right: boolean,
    jumpPressed: boolean,
    jumpHeld: boolean,
    delta: number,
  ): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    // Horizontal
    if (left) {
      body.setVelocityX(-WALK_SPEED);
      this.setFlipX(true);
    } else if (right) {
      body.setVelocityX(WALK_SPEED);
      this.setFlipX(false);
    } else {
      body.setVelocityX(0);
    }

    // Jump
    if (jumpPressed && this.canJump) {
      body.setVelocityY(JUMP_VELOCITY);
      this.canJump = false;
    }

    // Float (hold jump while descending)
    if (jumpHeld && !body.blocked.down && body.velocity.y > -50) {
      this.isFloating = true;
    } else if (!jumpHeld) {
      this.isFloating = false;
    }

    if (this.isFloating) {
      body.setGravityY(FLOAT_GRAVITY - NORMAL_GRAVITY);
      if (body.velocity.y > FLOAT_MAX_FALL) body.setVelocityY(FLOAT_MAX_FALL);
    } else {
      body.setGravityY(0);
    }

    // Ground check
    if (body.blocked.down) {
      this.canJump    = true;
      this.isFloating = false;
    }

    // Pick sprite based on state
    const onGround = body.blocked.down;
    const velY     = body.velocity.y;
    let key: string;
    if (!onGround) {
      this.idleTime  = 0;
      this.tapOn     = false;
      this.tapTimer  = 0;
      this.runTimer  = 0;
      this.runFrame  = 1;
      if      (velY < -80)       key = 'player-jump';
      else if (this.isFloating)  key = 'player-float';
      else                       key = 'player-fall';
    } else if (left || right) {
      this.idleTime  = 0;
      this.tapOn     = false;
      this.tapTimer  = 0;
      this.runTimer += delta;
      if (this.runTimer >= 120) { this.runTimer = 0; this.runFrame = this.runFrame === 1 ? 2 : 1; }
      key = `player-run-${this.runFrame}`;
    } else {
      this.runTimer = 0;
      this.runFrame = 1;
      this.idleTime += delta;
      if (this.idleTime >= 1000) {
        this.tapTimer += delta;
        if (this.tapTimer >= 350) { this.tapTimer = 0; this.tapOn = !this.tapOn; }
        key = this.tapOn ? 'player-tap' : 'player-idle';
      } else {
        key = 'player-idle';
      }
    }
    if (this.texture.key !== key) this.setTexture(key);
  }

  resetPosition(x: number, y: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.reset(x, y);
    this.canJump    = false;
    this.isFloating = false;
    this.idleTime   = 0;
    this.tapOn      = false;
    this.tapTimer   = 0;
    this.runTimer   = 0;
    this.runFrame   = 1;
  }
}
