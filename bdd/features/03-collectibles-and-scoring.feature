Feature: Collectible shirts and the scoring system
  SCORE_PER_PICK = 100, ORDER_BONUS = 50. Each level has 11 numbered shirts (1-11).

  Background:
    Given a level has started with 11 collectibles numbered 1 through 11
    And pickupsLeft is 11, nextExpected is 1, sequenceActive is true, scoreMult is 1

  Scenario: Collecting the first shirt in sequence awards the order bonus
    When the player collects shirt number 1
    Then 150 points are awarded (100 base + 50 order bonus)
    And nextExpected becomes 2
    And a "+150 IN ORDER!" flash appears in yellow at the pickup location
    And pickupsLeft becomes 10
    And shirt 2 begins pulsing (tint 0xffee44, alpha oscillating 1 to 0.45 every 320ms)

  Scenario: Collecting shirts in exact order repeatedly awards the bonus every time
    When the player collects shirts 1, 2, 3 in that exact order
    Then each pickup awards 150 points
    And the running total is 450
    And nextExpected is 4 after the third pickup

  Scenario: The first out-of-order pickup permanently disables future order bonuses
    Given nextExpected is 3
    When the player collects shirt number 7 (not 3)
    Then only 100 base points are awarded, no bonus
    And sequenceActive becomes false
    And the pulse on shirt 3 stops
    And a "+100" flash appears in pale green, not yellow

  Scenario: Once sequenceActive is false, even collecting the "right" number later never re-awards a bonus
    Given sequenceActive has already become false this level
    When the player collects shirt number 3, which happens to equal the old nextExpected
    Then only 100 base points are awarded
    And nextExpected does not advance and no pulse restarts

  Scenario: Score multiplier applies to both base and order bonus
    Given scoreMult is 3 (Triple Captain is active)
    When the player collects a shirt in sequence
    Then the awarded points are (100 + 50) * 3 = 450
    When the player collects a shirt out of sequence (bonus unavailable)
    Then the awarded points are 100 * 3 = 300

  Scenario: Collecting the final shirt completes the level
    Given pickupsLeft is 1
    When the player collects the last remaining shirt
    Then pickupsLeft becomes 0
    And the level-complete transition is scheduled after a 700ms delay

  Scenario: Collecting a shirt removes it from the world immediately
    When the player collects any shirt
    Then its sprite and physics body are destroyed and removed from the collectibles group
    And it cannot be collected a second time
