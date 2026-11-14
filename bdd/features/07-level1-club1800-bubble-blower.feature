Feature: Level 1 — Club 1800 layout and the Bubble Blower enemy
  Theme: gritty dive bar, dark red neon 0xcc1122. playerStart (80, 390).

  Scenario: Level 1 platform layout
    Given Level 1 (Club 1800) has loaded
    Then the platform list matches exactly:
      | x   | y   | width | height | role                   |
      | 0   | 430 | 800   | 20     | bar floor              |
      | 80  | 362 | 70    | 12     | bar stool 1            |
      | 230 | 362 | 70    | 12     | bar stool 2            |
      | 480 | 295 | 280   | 12     | bar counter (right)    |
      | 60  | 210 | 150   | 12     | high shelf (left)      |
      | 540 | 210 | 210   | 12     | back shelf (right)     |
      | 275 | 128 | 260   | 12     | top shelf (centre)     |

  Scenario: Level 1 shirt positions
    Then all 11 shirts spawn at exactly:
      | number | x   | y   |
      | 1      | 180 | 415 |
      | 2      | 560 | 415 |
      | 3      | 100 | 347 |
      | 4      | 245 | 347 |
      | 5      | 520 | 280 |
      | 6      | 700 | 280 |
      | 7      | 90  | 195 |
      | 8      | 175 | 195 |
      | 9      | 580 | 195 |
      | 10     | 330 | 113 |
      | 11     | 460 | 113 |

  Scenario: Level 1 has exactly one enemy
    Then there is exactly one enemy, a bubble-blower at (400, 406) with patrolLeft 150 and patrolRight 650

  Scenario: Bubble Blower does not actually patrol despite having patrol bounds
    Given the bubble-blower enemy exists
    When any amount of time elapses
    Then its horizontal velocity is held at exactly 0 every frame

  Scenario: Bubble Blower kicks a football every 4-8 seconds, alternating direction
    Given the bubble-blower's kick timer has just elapsed
    Then a football projectile spawns at (bubbleX + kickDir*18, bubbleY) with vx = kickDir*340, vy = 0
    And the next kick interval is re-rolled between 4000ms and 8000ms
    And kickDir flips sign for the following kick

  Scenario: Bubble Blower blows a 3-bubble fan every 14-20 seconds
    Given the bubble-blower's action timer has just elapsed
    Then three bubble projectiles spawn at angles -170, -90, and -10 degrees (each jittered +/-6 degrees)
    And each bubble's speed is between 120 and 150 px/s
    And they spawn offset at x + (i-1)*14, y - 14 for i in 0,1,2
    And the next action interval is re-rolled between 14000ms and 20000ms

  Scenario: Bubble Blower animation priority
    Given the bubble-blower is mid-bubble-charge (900ms window after triggering a fan)
    Then its texture is "enemy-bubble-blower-blow", overriding any kick or idle animation
    Given the bubble-blower is within 450ms of a football kick, and not mid-bubble-charge
    Then its texture shows the keepup frame matching its kick direction
    Given neither charge is active
    Then its texture alternates between two idle keepup frames every 380ms
