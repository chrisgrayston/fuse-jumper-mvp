Feature: Player movement, jump/float physics, and animation state
  Physics constants: WALK_SPEED 200, JUMP_VELOCITY -480, FLOAT_GRAVITY 120,
  NORMAL_GRAVITY 600, FLOAT_MAX_FALL 80. Body size 22x42 offset (9,4) on a 40x50 texture.

  Background:
    Given the player exists in GameScene with collideWorldBounds true

  Scenario Outline: Horizontal movement sets exact velocity, no acceleration ramp
    Given no horizontal input is held
    When the player holds "<direction>"
    Then horizontal velocity becomes exactly <velocity> immediately, on the same frame
    And the sprite is flipped <flip>

    Examples:
      | direction | velocity | flip         |
      | left      | -200     | horizontally |
      | right     | 200      | not flipped  |

  Scenario: Releasing all horizontal input stops the player instantly
    Given the player is moving right at 200 px/s
    When both left and right input are released
    Then horizontal velocity becomes exactly 0 on the next frame

  Scenario: Jump only fires on a fresh press while grounded
    Given the player is standing on a platform ("canJump" is true)
    When the jump input transitions from not-pressed to pressed
    Then vertical velocity is set to -480 instantly
    And "canJump" becomes false
    And holding the jump key down continuously does not repeat the jump

  Scenario: Jump is ignored while airborne
    Given the player is airborne and "canJump" is false
    When the jump input is pressed
    Then vertical velocity is unchanged by the jump action

  Scenario: Landing restores jump availability
    Given the player is airborne
    When the player's body becomes blocked-down (lands on a platform)
    Then "canJump" becomes true
    And "isFloating" becomes false

  Scenario: Floating slows descent while jump is held
    Given the player is airborne and falling slower than 50 px/s downward
    When the jump button is held
    Then "isFloating" becomes true
    And gravity for this frame is overridden to a net ~120 px/s^2
    And vertical velocity is clamped so it never exceeds 80 px/s downward

  Scenario: Floating stops the instant the player falls too fast or releases jump
    Given the player is floating
    When the jump button is released
    Then "isFloating" becomes false and full world gravity (600) resumes

  Scenario: Floating cannot begin while rising or falling fast
    Given the player's vertical velocity is -300 (rising from a jump)
    When the jump button is held
    Then "isFloating" does not start, because velocity.y is not greater than -50

  Scenario Outline: Animation state machine priority while airborne
    Given the player is airborne
    When vertical velocity is <velocity> and isFloating is <floating>
    Then the active texture is "<texture>"

    Examples:
      | velocity | floating | texture       |
      | -500     | false    | player-jump   |
      | -40      | true     | player-float  |
      | 300      | false    | player-fall   |

  Scenario: Hard landing triggers a land-then-crouch animation sequence
    Given the player lands with a pre-land vertical velocity greater than 280 px/s
    Then the texture becomes "player-land" for the first 95ms of the 190ms land timer
    And then becomes "player-crouch" for the remaining time
    And then returns to normal ground-state animation selection

  Scenario: Running animation advances one frame every 75ms, looping 1 through 8
    Given the player is grounded and moving (left or right held)
    When 75ms of continuous movement elapse
    Then the run frame advances by one, wrapping from player-run-8 back to player-run-1

  Scenario: Idle fidget only begins after 1 second of standing still
    Given the player is grounded with no horizontal input
    When less than 1000ms has elapsed since becoming idle
    Then the texture is "player-idle"
    When 1000ms or more has elapsed
    Then the texture alternates "player-idle" and "player-tap" every 350ms

  Scenario: Respawn fully resets player state
    Given the player is mid-air, floating, with a non-default run frame and land timer
    When resetPosition(x, y) is called
    Then the body is reset to (x, y) with zero velocity
    And canJump, isFloating are both false
    And idleTime, tapTimer, runTimer, landTimer, prevVelY are all cleared to zero
    And wasOnGround is false

  Scenario Outline: Dev keyboard shortcuts inside GameScene
    Given GameScene is active
    When the dev key "<key>" is pressed
    Then "<effect>"

    Examples:
      | key | effect                                                                 |
      | 1   | GameScene restarts at levelIndex 0 with score 0 and lives 3            |
      | 2   | GameScene restarts at levelIndex 1 with score 0 and lives 3            |
      | 3   | GameScene restarts at levelIndex 2 with score 0 and lives 3            |
      | 4   | GameScene restarts at levelIndex 3 with score 0 and lives 3            |
      | 5   | god mode toggles; HUD lives line shows the infinity symbol when active |
      | p   | pause toggles                                                          |
      | P   | pause toggles                                                          |

  Scenario: On-screen touch controls drive the same movement as keyboard
    Given the game is running on a touch device
    When the player holds the on-screen left button
    Then it has the same effect as holding the left arrow key
    When the player presses and releases the on-screen jump button
    Then a single jump fires, equivalent to one JustDown keyboard press
