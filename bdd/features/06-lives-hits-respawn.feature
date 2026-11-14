Feature: Hit detection, invincibility, respawn, and game over
  MAX_LIVES = 3, RESPAWN_DELAY = 1200ms. Lives carry forward between levels, reset
  to 3 only on a brand-new run from MenuScene or after a full game-complete restart.

  Background:
    Given the player is not in god mode, not invincible, and not currently respawning

  Scenario Outline: Every hit source triggers the same hit sequence
    When the player overlaps "<source>"
    Then the hit-player sequence is triggered exactly once for this contact

    Examples:
      | source                         |
      | an enemy's body                |
      | any live projectile            |
      | a live eel                     |

  Scenario: God mode makes the player immune to all damage
    Given god mode is active
    When the player overlaps an enemy, a projectile, or an eel
    Then no life is lost, no enemy/projectile/eel state is reset, and nothing else happens
    And the HUD lives line reads the infinity symbol

  Scenario: A hit while already invincible or respawning is ignored
    Given the player is currently invincible or currently respawning
    When the player overlaps a second damage source
    Then it has no effect; lives does not decrease a second time

  Scenario: Taking a hit with lives remaining
    Given lives is 2
    When the player is hit
    Then lives becomes 1
    And isRespawning becomes true immediately, before isInvincible is set
    And isInvincible becomes true
    And every enemy in the level is reset to its spawn state via resetEnemy()
    And every in-flight projectile is destroyed and the projectile list is cleared
    And every live eel is destroyed and the eel timer resets to 2000ms
    And the player sprite flashes (alpha 1 to 0, 110ms, yoyo, repeating 6 times, ~1.5s)

  Scenario: Respawn timing sequence after a non-fatal hit
    Given a non-fatal hit has just occurred
    When 1200ms (RESPAWN_DELAY) elapse
    Then the flash tween stops and player alpha is forced to 1
    And the player is moved to the current level's playerStart position
    And isRespawning becomes false
    When a further 1500ms elapse (2700ms total since the hit)
    Then isInvincible becomes false

  Scenario: The player can be hit again only after the full invincibility window
    Given a non-fatal hit occurred at time T
    When a second potential hit occurs between T and T+2700ms
    Then it is ignored
    When a second potential hit occurs after T+2700ms
    Then it is processed as a new hit

  Scenario: Losing the last life ends the run without respawning
    Given lives is 1
    When the player is hit
    Then lives becomes 0
    And isRespawning becomes true
    And after a 400ms delay GameOverScene starts with the current score
    And the player is not reset to playerStart, no enemy/projectile/eel cleanup runs

  Scenario: Lives carry forward across levels but reset on a full restart
    Given the player cleared level 1 with 2 lives remaining
    When LevelIntroScene starts for level 2
    Then lives is still 2
    Given the player just finished level 4 (game complete)
    When the player chooses to play again
    Then lives resets to 3 for the new run
