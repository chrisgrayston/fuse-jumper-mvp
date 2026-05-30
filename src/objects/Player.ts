import Phaser from 'phaser';

const WALK_SPEED = 200;
const JUMP_VELOCITY = -480;
const FLOAT_GRAVITY = 120; // reduced gravity while holding jump
const NORMAL_GRAVITY = 600;
const FLOAT_MAX_FALL = 80; // cap fall speed while floating

export class Player extends Phaser.Physics.Arcade.Sprite {
  private isFloating: boolean = false;
  private jumpHeld: boolean = false;
  private canJump: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(10);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setMaxVelocityY(500);
  }

  handleMovement(
    left: boolean,
    right: boolean,
    jumpPressed: boolean,
    jumpHeld: boolean,
  ): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    this.jumpHeld = jumpHeld;

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

    // Jump initiation
    if (jumpPressed && this.canJump) {
      body.setVelocityY(JUMP_VELOCITY);
      this.canJump = false;
    }

    // Float while holding jump and moving upward or early fall
    if (jumpHeld && !body.blocked.down && body.velocity.y > -50) {
      this.isFloating = true;
    } else if (!jumpHeld) {
      this.isFloating = false;
    }

    if (this.isFloating) {
      body.setGravityY(FLOAT_GRAVITY - NORMAL_GRAVITY); // net gravity override
      if (body.velocity.y > FLOAT_MAX_FALL) {
        body.setVelocityY(FLOAT_MAX_FALL);
      }
    } else {
      body.setGravityY(0);
    }

    // Ground check
    if (body.blocked.down) {
      this.canJump = true;
      this.isFloating = false;
    }
  }

  resetPosition(x: number, y: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.reset(x, y);
    this.canJump = false;
    this.isFloating = false;
  }
}
