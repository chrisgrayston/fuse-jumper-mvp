Feature: Eels environmental hazard
  Eels are a background threat unrelated to any enemy, disabled entirely on level 4.

  Scenario: Eels are disabled on level 4
    Given GameScene starts on levelIndex 3 (Club 2200)
    When any amount of time elapses
    Then no eel is ever spawned

  Scenario: The first eel spawns earlier than the steady-state cadence
    Given GameScene starts on levelIndex 0, 1, or 2
    When exactly 2000ms have elapsed since level start
    Then the first eel spawns

  Scenario: Eels spawn every 5.5 seconds thereafter
    Given at least one eel has already spawned
    When 5500ms elapse without an intervening hit-reset
    Then another eel spawns at x between 520 and 660, y between -20 and 40

  Scenario: Eel appearance and motion
    Given an eel has just spawned
    Then it uses a 3-frame looping texture (enemy-eel-1/2/3) advancing every 150ms
    And gravity pulls it downward
    And its horizontal velocity is held at exactly -60 px/s every frame, regardless of collisions

  Scenario: Eel exits the world when it drifts off the left or falls off the bottom
    Given an eel is alive
    When its x becomes less than -80, or its y becomes greater than 520
    Then it is destroyed and removed from tracking

  Scenario: Eel contact with the player counts as a hit
    Given an eel is alive and the player is not invincible
    When the player overlaps the eel
    Then the eel is destroyed and removed from tracking
    And the standard hit-player sequence is triggered

  Scenario: A hit from any source clears all live eels and resets the eel timer
    Given multiple eels are alive
    When the player is hit by anything (enemy, projectile, or an eel itself) and survives
    Then every live eel is destroyed
    And the eel spawn timer resets to 2000ms, matching the fresh-level grace period
