Feature: Level 3 — Club 2100 layout and enemies (Clippy, Melonhead, Butter Fingers, Padel Punisher)
  Theme: industrial neon orange 0xff7700. playerStart (80, 390).

  Scenario: Level 3 platform layout
    Then the platform list matches exactly:
      | x   | y   | width | height | role                 |
      | 0   | 430 | 800   | 20     | ground               |
      | 35  | 372 | 120   | 12     | low-left flank       |
      | 645 | 372 | 120   | 12     | low-right flank      |
      | 75  | 302 | 140   | 12     | mid-left             |
      | 325 | 292 | 160   | 12     | mid-centre           |
      | 575 | 302 | 140   | 12     | mid-right            |
      | 150 | 232 | 140   | 12     | upper-left           |
      | 505 | 232 | 140   | 12     | upper-right          |
      | 55  | 152 | 120   | 12     | high-left flank      |
      | 625 | 152 | 120   | 12     | high-right flank     |
      | 260 | 80  | 280   | 12     | top                  |

  Scenario: Level 3 shirt positions
    Then all 11 shirts spawn at exactly:
      | number | x   | y   |
      | 1      | 130 | 415 |
      | 2      | 450 | 415 |
      | 3      | 65  | 357 |
      | 4      | 95  | 357 |
      | 5      | 680 | 357 |
      | 6      | 145 | 286 |
      | 7      | 620 | 286 |
      | 8      | 185 | 216 |
      | 9      | 560 | 216 |
      | 10     | 390 | 64  |
      | 11     | 450 | 64  |

  Scenario: Level 3 has exactly four enemies
    Then there are exactly four enemies:
      | type           | x   | y   | notes                                                  |
      | clippy         | 300 | 407 | patrolLeft 155, patrolRight 645                        |
      | melonhead      | 400 | 50  | spawn point only; circuit is hardcoded, not from level data |
      | butter-fingers | 115 | 124 | posA (115,124) high-left, posB (685,124) high-right    |
      | padel-punisher | 685 | 279 | static, on mid-right platform                          |

  # Clippy
  Scenario: Clippy patrols at 22 px/s and pauses 1400ms at each bound, no projectiles
    Given clippy is patrolling between x=155 and x=645
    When it reaches either bound
    Then it stops, plays a 4-frame "scratch" loop (200ms/frame) for 1400ms, then reverses direction
    And at no point does clippy spawn a projectile

  # Melonhead
  Scenario: Melonhead hops a fixed 12-node platform circuit, ignoring level-file patrol bounds
    Given melonhead spawns settled on circuit node 5 (the "top" node at 400,50)
    Then its circuit is the hardcoded 12 nodes:
      | index | x   | y   | label        |
      | 0     | 200 | 400 | ground-left  |
      | 1     | 95  | 342 | low-left     |
      | 2     | 145 | 272 | mid-left     |
      | 3     | 220 | 202 | upper-left   |
      | 4     | 115 | 122 | high-left    |
      | 5     | 400 | 50  | top          |
      | 6     | 685 | 122 | high-right   |
      | 7     | 575 | 202 | upper-right  |
      | 8     | 645 | 272 | mid-right    |
      | 9     | 405 | 262 | mid-center   |
      | 10    | 705 | 342 | low-right    |
      | 11    | 600 | 400 | ground-right |
    And any patrolLeft/patrolRight set on its EnemyData is inert

  Scenario: Melonhead settle-fly-swing cycle
    Given melonhead is settled on its current node
    When its settle timer (700-1300ms, randomized) elapses
    Then it begins a 750ms parabolic flight to the next node in index order (wrapping 11 to 0)
    And the arc height is max(55, |deltaY|*0.4 + 40)
    When the flight completes
    Then it faces the player's horizontal direction and plays a 400ms, 2-frame mallet-swing animation
    And it does not spawn a mallet projectile — the swing is a contact-only visual threat

  # Butter Fingers
  Scenario: Butter Fingers cycles crate-throw, crate-throw, pie-throw, repeating
    Given butter-fingers is idling at posA or posB (gravity disabled, body.reset-driven)
    Then its action cadence over kickClock increments follows: crate, crate, pie, crate, crate, pie, ...
    And a pie cycle always travels to the opposite platform first, then throws pies after landing and rolling
    And a pie cycle never also throws a crate in the same cycle

  Scenario: Butter Fingers crate throw sub-phases
    Given butter-fingers begins a crate-throw cycle from idle
    Then it plays THROW_LIFT (300ms, spawns a crate at y+55 with vx random -25..25, vy 50)
    Then THROW_HOLD (250ms), THROW_RELEASE (200ms), THROW_FOLLOW (250ms)
    Then TRAVELLING (900ms arced lerp, arc height 40px, to the opposite platform, flipping atPosA)
    Then ROLLING (560ms, 4-frame roll loop at 140ms/frame, sliding 60 px/s toward the platform's outer edge)
    Then back to IDLE for a randomized 1500-2500ms

  Scenario: Butter Fingers pie throw sub-phases
    Given butter-fingers begins a pie-throw cycle
    Then it TRAVELS first (900ms arced lerp to the opposite platform)
    Then ROLLS (560ms)
    Then PIE_WIND (320ms, spawns 2 pie projectiles horizontally at vx +/-200, at y and y-10, kickDir flips)
    Then PIE_THROW (180ms), PIE_FOLLOW (280ms)
    Then back to IDLE

  Scenario: Butter Fingers always faces the arena centre
    Given butter-fingers is at posA (left side)
    Then it is not flipped (faces right, toward centre)
    Given butter-fingers is at posB (right side)
    Then it is flipped (faces left, toward centre)

  # Padel Punisher
  Scenario: Padel Punisher never moves from its spawn point
    Given padel-punisher exists at (685, 279)
    When any amount of time elapses
    Then its position via body.reset() never changes from (685, 279)

  Scenario: Padel Punisher serves immediately on spawn, then on a wait/windup/follow loop
    Given padel-punisher has just spawned
    Then it serves its first padel-ball immediately, not after any wait
    Given it has just served a ball
    Then it plays a 400ms, 2-frame follow-through, then waits until that ball is gone before windup begins again

  Scenario: Padel Punisher's serve angle sweeps through 8 fixed steps
    Given padel-punisher is about to serve its Nth ball (N = 0..7, wrapping)
    Then the serve angle is 20 + N*20 degrees from the +X axis (20,40,60,80,100,120,140,160)
    And the serve direction is always upward: vx = cos(angle)*speed, vy = -sin(angle)*speed
    And speed is randomized between 520 and 680 px/s
    And the ball spawns at (x-14, y-22)
