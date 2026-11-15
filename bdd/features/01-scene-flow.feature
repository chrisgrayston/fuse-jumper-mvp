Feature: Scene flow and data carried between scenes
  The game is a fixed sequence of Phaser scenes. Score and lives must be carried
  forward correctly across transitions, and reset correctly on a fresh run.

  Background:
    Given the game has booted and all textures and art have loaded

  Scenario: Boot auto-advances to the menu
    When BootScene finishes preloading art and generating textures
    Then MenuScene is started with no data payload

  Scenario: Starting a new game from the menu
    Given MenuScene is active
    When the player taps the start prompt, presses SPACE, or presses ENTER
    Then LevelIntroScene is started with levelIndex 0, score 0, lives 3

  Scenario: Entering gameplay from the level intro
    Given LevelIntroScene is active with levelIndex 1, score 450, lives 2
    When the player taps anywhere, presses SPACE, or presses ENTER
    Then GameScene is started with levelIndex 1, score 450, lives 2

  Scenario: GameScene defaults when started with no data
    Given GameScene is started with an empty data payload
    Then levelIndex defaults to 0
    And score defaults to 0
    And lives defaults to 3

  Scenario: Completing a level that is not the last one
    Given GameScene is active on levelIndex 1 with score 800 and lives 3
    When the player collects the last remaining shirt
    Then after a 700ms delay LevelCompleteScene is started
    And its payload is score 800, lives 3, levelIndex 1, nextLevelIndex 2

  Scenario: Completing the final level (levelIndex 3)
    Given GameScene is active on levelIndex 3 with score 2200 and lives 1
    When the player collects the last remaining shirt
    Then LevelCompleteScene is started with nextLevelIndex -1

  Scenario: Continuing from level complete to the next club
    Given LevelCompleteScene is active with score 800, lives 3, levelIndex 1, nextLevelIndex 2
    When the player taps the continue button, presses SPACE, or presses ENTER
    Then LevelIntroScene is started with levelIndex 2, score 800, lives 3

  Scenario: Finishing the game restarts fresh, not carrying score forward
    Given LevelCompleteScene is active with nextLevelIndex -1
    When the player taps "TAP TO PLAY AGAIN"
    Then LevelIntroScene is started with levelIndex 0, score 0, lives 3
    And lives is reset to 3, not carried from the completed run's remaining lives

  Scenario: Running out of lives ends the run
    Given GameScene is active with lives 1 and score 1350
    When the player is hit by any damage source
    Then after a 400ms delay GameOverScene is started with score 1350
    And the player sprite is not respawned

  Scenario: Returning to the menu after the leaderboard flow
    Given GameOverScene has finished showing the high-score board
    When the player presses any key or taps anywhere, after the 700ms grace period
    Then MenuScene is started with no data payload
