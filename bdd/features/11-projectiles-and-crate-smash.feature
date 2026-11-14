Feature: Projectile physics/lifecycle and the crate-smash system
  All projectiles are created only via GameScene's spawnFn, which must re-apply
  velocity (and for padel-ball/golf-ball/dark-magic, gravity/bounce flags) after
  physics.add.group() wipes them.

  Scenario: group.add() wipes a freshly constructed projectile's body
    Given a Projectile is constructed with velocity (vx, vy) and gravity settings
    When it is added to projectilesGroup via group.add()
    Then its physics body's velocity and gravity are reset by Phaser
    And spawnFn must call body.setVelocity(vx, vy) again immediately after add() to compensate

  Scenario: Bubble drifts on a decaying sine wave and only exits through the top
    Given a bubble projectile is alive with random freq (0.3-0.7), amp (80-160), and phase
    Then its vx each frame is amp * sin(t*freq*2*pi + phase), with t accumulating at delta*0.001
    And its vy decays toward -25 px/s each frame (always trending upward)
    And it bounces (phase flips by pi) off x<=0, x>=800, and y>=450
    And it is destroyed only when y < -60

  Scenario: Football and pie re-assert their velocity every single frame
    Given a football or pie projectile is alive
    Then every frame its update() forces allowGravity=false, gravity.y=0, velocity.y=0, and velocity.x back to its stored constant (footballVX or pieVX)
    And this re-assertion is required because any later body reset would otherwise zero the stored velocity

  Scenario: Beer behaves identically to football/pie's re-assertion pattern
    Given a beer projectile is alive
    Then every frame its velocity.x is forced back to its stored beerVX, with zero gravity and zero vertical velocity

  Scenario Outline: Boundary exit rules per projectile type
    Given a "<type>" projectile is alive
    When it crosses "<boundary>"
    Then it is "<outcome>"

    Examples:
      | type        | boundary                     | outcome                    |
      | football    | left or right world edge     | destroyed                  |
      | football    | top or bottom world edge     | bounces (velocity.y flips) |
      | mallet      | left or right world edge     | destroyed                  |
      | mallet      | top or bottom world edge     | bounces (velocity.y flips) |
      | crate       | any edge (+/-60 x, +/-520 y) | destroyed                  |
      | pie         | any edge                     | destroyed                  |
      | dark-magic  | any edge                     | destroyed                  |
      | glass-shard | any edge, or 1600ms elapsed  | destroyed                  |

  Scenario: Glass shard has a hard 1600ms lifespan regardless of position
    Given a glass-shard was spawned 1600ms ago and is still within world bounds
    Then it self-destructs anyway

  Scenario: Padel-ball and golf-ball bounce off platforms and world bounds, with a soft 2000ms expiry
    Given a padel-ball or golf-ball is alive
    Then it has allowGravity false, bounce (1.0, 1.0), and collideWorldBounds true
    And for its first 2000ms it does not self-destruct on any contact
    When 2000ms have elapsed
    Then it self-destructs on its next contact with a platform or world bound
    And regardless of the above, it is force-destroyed if it strays beyond x<-30, x>830, y<-30, or y>490

  Scenario: Only crate collisions with platforms trigger the smash system
    Given the shared projectilesGroup-platforms collider has a processCallback
    Then only projectiles with projType "crate" actually collide with platforms
    And padel-ball and golf-ball use a separate collider/processCallback pair that makes them bounce instead of smash
    And every other projectile type passes through platforms with no collision response at all

  Scenario: Crate smash sequence
    Given a crate's body collides with a platform
    Then the crate is destroyed at its impact (x, y)
    And a 3-frame smash animation plays at that position (240ms per frame), then is destroyed
    And exactly 3 glass-shard projectiles spawn at (x, y-20)
    And each shard's vx is random between -340 and 340
    And each shard's vy is -(random between 260 and 460) — always upward, never downward

  Scenario: Crate spawn offset must clear the throwing platform
    Given butter-fingers stands at y=124 on a platform whose body spans y=152 to y=164
    When it spawns a crate at y+55 = 179
    Then the crate's body starts below the platform's bottom edge (164)
    And it does not immediately re-collide and smash at the moment of spawn

  Scenario: Glass shards hurt the player and expire independently of the smash animation
    Given a glass shard is alive after a crate smash
    When the player overlaps it
    Then the standard hit-player sequence triggers and the shard is destroyed
    When 1600ms elapse without player contact
    Then the shard self-destructs anyway, independent of whether the smash animation has finished
