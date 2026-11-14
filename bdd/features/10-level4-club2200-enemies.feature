Feature: Level 4 — Club 2200 layout and enemies (Giant Bear, Condor, Actuary Man, Puffin, Vascular Man, Skeletor)
  Theme: Greek marble temple, gold/white 0xf0c040. playerStart (80, 390). Final club.

  Scenario: Level 4 platform layout
    Then the platform list matches exactly:
      | x   | y   | width | height | role                                |
      | 0   | 430 | 800   | 20     | marble ground                       |
      | 30  | 330 | 80    | 12     | column base left                    |
      | 690 | 330 | 80    | 12     | column base right                   |
      | 100 | 202 | 130   | 12     | upper-left                          |
      | 570 | 202 | 130   | 12     | upper-right                         |
      | 300 | 350 | 200   | 12     | middle platform (below column bases)|
      | 148 | 142 | 140   | 12     | high-left                           |
      | 512 | 142 | 140   | 12     | high-right                          |
      | 308 | 112 | 184   | 12     | high-centre                         |
      | 318 | 55  | 164   | 12     | Skeletor's throne                   |

  Scenario: Level 4 shirt positions
    Then all 11 shirts spawn at exactly:
      | number | x   | y   |
      | 1      | 200 | 415 |
      | 2      | 560 | 415 |
      | 3      | 55  | 314 |
      | 4      | 755 | 314 |
      | 5      | 635 | 186 |
      | 6      | 218 | 126 |
      | 7      | 582 | 126 |
      | 8      | 130 | 186 |
      | 9      | 360 | 334 |
      | 10     | 360 | 95  |
      | 11     | 466 | 39  |

  Scenario: Level 4 has exactly six enemies
    Then there are exactly six enemies:
      | type         | x   | y   | notes                                                         |
      | giant-bear   | 360 | 316 | patrolLeft 316, patrolRight 484                               |
      | condor       | 400 | 110 | floater, flies above actuary-man and vascular-man             |
      | actuary-man  | 200 | 185 | cruise altitude; posA (0,407) ground y; patrolLeft 160, patrolRight 640 |
      | puffin       | 700 | 307 | static, drives golf balls leftward                            |
      | vascular-man | 165 | 246 | posA (165,246) under upper-left, posB (635,246) under upper-right |
      | skeletor     | 400 | 32  | static, on the throne                                         |

  # Giant Bear
  Scenario: Giant Bear patrols very slowly at 8 px/s
    Given giant-bear is patrolling between x=316 and x=484
    Then its speed is exactly 8 px/s, far slower than other ground patrollers
    And its first throw is delayed 15000-20000ms after spawn; subsequent intervals are 2500-5000ms

  Scenario: Giant Bear growls, then throws a beer, then resumes patrol
    Given giant-bear's patrol interval has elapsed
    Then it growls in place for 1400ms (4-frame loop, 350ms/frame)
    Then it throws: faces its throw direction, plays a 4-frame throw loop (300ms/frame) for 1200ms
    And at the 600ms mark of the throw it spawns exactly one "beer" projectile, 30px to the side it faces, vx = 250*kickDir
    Then it flips its facing direction and resumes patrol

  Scenario: Giant Bear's charge textures exist but are unused
    Given the texture set enemy-giant-bear-charge-1..4 was generated
    Then no code path in the current update() switch ever selects them
    And giant-bear never performs a dash/charge move in the current behavior

  # Condor
  Scenario: Condor flies a wide, slow figure-8 with no projectiles
    Given condor exists at base (400, 110)
    When time t accumulates at delta * 0.0016 per ms
    Then x = 400 + cos(t*0.6)*330 and y = 110 + sin(t)*55
    And it plays a 12-frame wing-flap loop at 65ms/frame (~1.3 flaps/sec)
    And it faces its direction of horizontal travel
    And its hitbox (18x36, offset 31,8) is smaller than its sprite — only the body counts

  # Actuary Man
  Scenario: Actuary Man cycles fly, land, laptop, takeoff
    Given actuary-man is flying at cruise altitude y=185 at 140 px/s
    When it reaches patrolLeft (160) or patrolRight (640)
    Then it lands: y eases Cubic.In from 185 to 407 over 700ms (4-frame landing anim, 175ms/frame)
    Then it "works": stays grounded for 2400ms (6-frame typing loop, 400ms/frame)
    Then it takes off: y eases Cubic.Out from 407 back to 185 over 700ms, flips direction, resumes flying

  Scenario: Actuary Man's hitbox changes with its phase
    Given actuary-man is flying
    Then its body is 30x14, offset (10,6)
    Given actuary-man is grounded (land/laptop/takeoff)
    Then its body is 24x44, offset (8,4)

  Scenario: Actuary Man never fires a projectile
    Given actuary-man is in any phase
    Then it is contact-only; no spawnFn call ever occurs for this enemy

  # Puffin
  Scenario: Puffin never moves and drives immediately on spawn
    Given puffin exists at (700, 307)
    Then its position via body.reset() never changes
    And it drives its first golf ball immediately on spawn, not after a wait
    And it overrides its default texture key to "enemy-puffin-golfer"

  Scenario: Puffin's drive elevation sweeps through 8 fixed steps, aimed leftward
    Given puffin is about to drive its Nth ball (N = 0..7, wrapping)
    Then the elevation angle is 10 + N*10 degrees (10,20,...,80)
    And velocity is vx = -cos(angle)*speed, vy = -sin(angle)*speed (always leftward and upward)
    And speed is randomized between 290 and 360 px/s
    And the ball spawns at (x-16, y-22)
    And a "RIP!!!" floating text appears, rising 35px over 900ms

  Scenario: Puffin wait/windup/follow timing
    Given puffin has just driven a ball
    Then it plays a 600ms, 5-frame follow-through, then waggles (2-frame, 550ms/frame) until that ball is gone
    Then the next windup begins (1000ms, 5 frames at 200ms each: windup-1..4, impact)

  # Vascular Man
  Scenario: Vascular Man cycles pull-up reps, a swinging travel, and an arrival catch
    Given vascular-man is at rest at posA or posB
    Then it loops a 10-frame pull-up animation (200ms/frame) for a random 2-4 full reps
    When the rep count completes
    Then it flips atPosA and begins a 1400ms swing to the opposite platform
    And its position follows a combined sine-arc (-sin(t*pi)*40) plus linear interpolation, giving an under-slung swing
    And its texture advances through 10 stages by travel progress: swing-1/2, pike-1..4, fly-1/2, reach-1/2
    When the swing completes
    Then it plays a 450ms, 2-frame "catch" animation, then resumes pull-ups with a fresh random 2-4 reps

  Scenario: Vascular Man never fires a projectile
    Then it is a contact-only threat whose danger is appearing/disappearing under a platform unpredictably

  # Skeletor
  Scenario: Skeletor never moves and waits exactly 2000ms between casts
    Given skeletor exists at (400, 32) on the throne
    Then its position via body.reset() never changes
    And its idle wait before each cast is fixed at exactly 2000ms, not randomized

  Scenario: Skeletor's cast fires exactly one homing-aimed, non-homing-flight projectile per cast
    Given skeletor begins a 1280ms, 16-frame cast animation (80ms/frame)
    When the frame index first reaches 4 (320ms into the cast)
    Then exactly one "dark-magic" projectile spawns at (x, y+10)
    And its velocity is the normalized direction to the player's position at that instant, times 240 px/s
    And it flies in a straight line afterward — it does not continue tracking the player
    And no second dark-magic projectile fires even though frame >= 4 remains true for the rest of the cast
