Feature: Level 2 — Club 2000 layout and enemies (Flanker, Rushy, Smaller Bear)
  Theme: neon nightclub, purple/pink 0xff1a44. playerStart (80, 390).

  Scenario: Level 2 platform layout
    Then the platform list matches exactly:
      | x   | y   | width | height | role                |
      | 0   | 430 | 800   | 20     | dance floor         |
      | 0   | 378 | 110   | 12     | speaker box (left)  |
      | 690 | 378 | 110   | 12     | speaker box (right) |
      | 255 | 280 | 290   | 12     | stage               |
      | 45  | 272 | 155   | 12     | mid-left            |
      | 600 | 272 | 155   | 12     | mid-right           |
      | 65  | 208 | 160   | 12     | VIP balcony left    |
      | 575 | 208 | 160   | 12     | VIP balcony right   |
      | 285 | 158 | 230   | 12     | VIP centre          |
      | 315 | 85  | 170   | 12     | top booth           |

  Scenario: Level 2 shirt positions
    Then all 11 shirts spawn at exactly:
      | number | x   | y   |
      | 1      | 180 | 415 |
      | 2      | 580 | 415 |
      | 3      | 50  | 362 |
      | 4      | 730 | 362 |
      | 5      | 320 | 264 |
      | 6      | 450 | 264 |
      | 7      | 85  | 255 |
      | 8      | 640 | 255 |
      | 9      | 360 | 143 |
      | 10     | 355 | 68  |
      | 11     | 445 | 68  |

  Scenario: Level 2 has exactly three enemies
    Then there are exactly three enemies:
      | type         | x   | y   | notes                                         |
      | flanker      | 380 | 404 | patrolLeft 120, patrolRight 680                |
      | rushy        | 400 | 110 | floater, base position for figure-8           |
      | smaller-bear | 120 | 193 | posA (120,193) VIP-left, posB (640,193) VIP-right |

  # Flanker
  Scenario: Flanker patrols between its bounds at 110 px/s
    Given the flanker is patrolling
    When it reaches x=120 moving left or x=680 moving right
    Then it reverses direction and continues patrolling at 110 px/s

  Scenario: Flanker stamps in place every 3-5.5 seconds before charging
    Given the flanker has been patrolling for its randomized interval (3000-5500ms)
    Then it stops (velocity 0) and plays a 2-frame sumo-stamp loop for 1500ms

  Scenario: Flanker charges at 560 px/s after stamping
    Given the flanker's 1500ms stamp has just completed
    Then its direction is derived from the newly flipped atPosA flag
    And it charges at exactly 560 px/s for 550ms
    And it then resumes normal 110 px/s patrol
    And the Flanker never fires a projectile; the charge itself is the only threat

  # Rushy
  Scenario: Rushy floats in a figure-8 with no gravity and no platform collision
    Given rushy exists at base position (400, 110)
    When time t accumulates at delta * 0.0004 per ms
    Then rushy's x = 400 + cos(t*0.7)*200 and y = 110 + sin(t)*25
    And rushy's body is synced via body.reset() every frame, never by physics integration
    And rushy never spawns a projectile

  # Smaller Bear
  Scenario: Smaller Bear idles, throws its coat, then jumps to the opposite platform
    Given smaller-bear is idling at posA or posB
    When its randomized idle timer (3000-5000ms) elapses
    Then a decorative coat image launches on a 900ms parabolic flight (arc height 140px, one 360-degree spin) toward the opposite platform
    And a "GRAAARR!" floating text appears and fades over 1000ms
    And the bear begins an 800ms pre-jump pause followed by a 1200ms arced jump (arc height 80px) to the opposite platform

  Scenario: The coat has no hitbox
    Given the coat sprite is mid-flight
    When the player overlaps its visual position
    Then no hit is registered; only the bear's own body can hurt the player

  Scenario: Smaller Bear wears the coat for 1500ms after landing
    Given smaller-bear has just completed its jump
    Then the coat snaps onto the bear's position
    And the bear remains stationary wearing the coat for 1500ms before idling again
