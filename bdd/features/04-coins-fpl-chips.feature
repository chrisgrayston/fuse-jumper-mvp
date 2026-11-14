Feature: Coins (FPL chips) spawning and effects
  COIN_INTERVAL = 10000ms. Each chip type can drop at most once per level.
  Types: tc (Triple Captain), bb (Bench Boost), ww (Wildcard), fh (Free Hit).

  Background:
    Given a level is in progress
    And droppedCoinTypes is empty and no coin is currently on screen

  Scenario: Coin spawn roll happens every 10 seconds, not more often
    When 10000ms of gameplay elapse
    Then a coin-spawn roll occurs exactly once
    And the coin timer resets to 0 for the next interval

  Scenario: A coin only spawns if the roll succeeds and a type is still available
    Given the spawn roll's random check passes (p < 0.5)
    And at least one coin type has not yet dropped this level
    And no coin is currently on screen
    When the 10-second interval elapses
    Then one coin of a random not-yet-dropped type spawns at x between 60 and 640, y = -30
    And that type is added to droppedCoinTypes

  Scenario: No coin spawns if the roll fails
    Given the spawn roll's random check fails (p >= 0.5)
    When the 10-second interval elapses
    Then no coin spawns, even though a type is still available

  Scenario: No coin spawns if one is already on screen
    Given a coin is currently alive and uncollected
    When the 10-second interval elapses and the roll would otherwise succeed
    Then no additional coin spawns

  Scenario: Every chip type can appear at most once per level
    Given all 4 chip types have already dropped this level
    When the 10-second interval elapses
    Then no further coin spawns regardless of the random roll

  Scenario: Coins bounce off all four world edges manually
    Given a coin is falling under gravity with bounce 0.5
    When it reaches x <= 0, x >= 800, y <= 0, or y >= 450
    Then its velocity component on that axis reflects (sign flips)
    And its position is clamped 1px inside the boundary

  Scenario: Triple Captain triples the score multiplier for the rest of the level
    When the player collects a "tc" coin
    Then scoreMult becomes 3
    And the HUD score line appends " x3"
    And a "x3 SCORE ACTIVATED!" flash appears
    And scoreMult remains 3 for every subsequent pickup this level, with no decay

  Scenario: Bench Boost adds 4 new shirts on non-ground platforms
    Given the level has at least one platform with height < 20 (not the full-width ground)
    When the player collects a "bb" coin
    Then shirts numbered 12, 13, 14, and 15 are created
    Each at a random x within a randomly chosen thin platform, y = platform top - 18
    And pickupsLeft increases by 4
    And a "BENCH BOOST! +4 SHIRTS" flash appears

  Scenario: Wildcard restores every missing shirt and resets the sequence
    Given shirts 2, 5, and 9 have already been collected this level
    When the player collects a "ww" coin
    Then shirts 2, 5, and 9 reappear at their originally recorded spawn positions
    And pickupsLeft increases by the number of shirts restored
    And nextExpected resets to 1
    And sequenceActive resets to true
    And shirt 1 resumes pulsing
    And a "WILDCARD! SHIRTS RESTORED" flash appears

  Scenario: Free Hit grants an extra life
    Given lives is 2
    When the player collects an "fh" coin
    Then lives becomes 3
    And the HUD lives line updates immediately
    And a "FREE HIT! +1 LIFE" flash appears

  Scenario: Collecting a coin destroys it immediately
    When the player overlaps any coin
    Then the coin is destroyed before its effect is applied
    And it cannot be collected twice
