Feature: HUD display and pause behavior

  Scenario: HUD score line reflects score and active multiplier
    Given score is 1250 and scoreMult is 1
    Then the score line reads "SCORE: 1250"
    Given scoreMult becomes 3
    Then the score line reads "SCORE: 1250 x3"

  Scenario: HUD lives line shows one heart per life, or infinity in god mode
    Given lives is 2 and god mode is off
    Then the lives line reads "LIVES: ♥ ♥" (trimmed, space-separated hearts)
    Given god mode is on
    Then the lives line reads "LIVES: ∞" regardless of the lives count

  Scenario: HUD squad line shows remaining pickups
    Given pickupsLeft is 7
    Then the squad line reads "SQUAD: 7 left"

  Scenario: HUD club indicator shows the current club number in its accent color
    Given the active level is Club 2100 with accentColor 0xff7700
    Then the top-right text reads "CLUB 2100" rendered in "#ff7700"

  Scenario: All HUD elements are fixed to the camera and always on top
    Given any HUD text element
    Then it has scrollFactor 0 and depth 20

  Scenario: Pausing freezes the entire simulation
    Given the game is unpaused
    When the player presses P, presses Escape, or taps the pause button
    Then isPaused becomes true
    And physics.pause() is called, freezing every enemy, projectile, coin, and eel
    And a semi-opaque (65% alpha) full-screen overlay becomes visible and interactive
    And "PAUSED" and a resume hint are shown centered
    And GameScene.update() returns immediately on every subsequent frame, except the dev-level-request check at the very top

  Scenario: Resuming restores exactly the prior state
    Given the game is paused
    When the player presses P, presses Escape, or taps anywhere on the pause overlay
    Then isPaused becomes false
    And physics.resume() is called
    And the overlay, "PAUSED" text, and hint are all hidden and made non-interactive

  Scenario: The pause button itself remains visible and clickable regardless of pause state
    Given the game is either paused or unpaused
    Then the top-right pause icon button is always rendered and always interactive

  Scenario: Pausing does not affect dev level-jump requests
    Given the game is paused
    When a dev level-jump button or key is used
    Then GameScene still restarts at the requested level, bypassing the pause short-circuit
