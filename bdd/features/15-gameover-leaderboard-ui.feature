Feature: GameOverScene — leaderboard fetch, initials entry, submission, board display
  4 phases: loading -> initials -> submitting -> board.

  Scenario: Loading phase fetches the current leaderboard
    Given GameOverScene starts with a final score
    Then "GAME OVER", the score, and a "LOADING..." placeholder are shown
    And a GET request to /api/scores is made immediately

  Scenario: A qualifying score goes to initials entry
    Given the fetch succeeds and score is greater than 0
    And either fewer than 10 entries exist, or score beats the current 10th-place entry
    Then the scene transitions to the initials-entry phase

  Scenario: A non-qualifying score skips straight to the board
    Given the fetch succeeds and score is 0, or the leaderboard is full of higher scores
    Then the scene transitions directly to the board phase with no highlighted row

  Scenario: A failed fetch still allows qualifying scores to attempt entry
    Given the GET request fails (network error or non-2xx)
    And score is greater than 0
    Then the scene proceeds to initials entry anyway, since the empty local leaderboard trivially qualifies

  Scenario: A failed fetch with a zero score goes straight to an empty board
    Given the GET request fails and score is 0
    Then the scene shows the board phase with "NO SCORES YET" and no highlighted row

  Scenario: Initials entry defaults and controls
    Given the initials-entry phase has just started
    Then the 3 letter slots default to "A", "A", "A" with the cursor on slot 0
    When the left-arrow key, down-arrow key, or on-canvas "◀" button is used
    Then the currently selected letter steps backward through the alphabet, wrapping Z to A
    When the right-arrow key, up-arrow key, or on-canvas "▶" button is used
    Then the currently selected letter steps forward, wrapping A to Z
    When any of the 3 letter glyphs is tapped directly
    Then the cursor moves to that slot without changing its letter

  Scenario: Confirming advances the cursor, then submits on the last slot
    Given the cursor is on slot 0 or slot 1
    When SPACE, ENTER, or the on-canvas "[ CONFIRM ]" button is used
    Then the cursor advances to the next slot
    Given the cursor is on slot 2 (the last slot)
    When SPACE, ENTER, or "[ CONFIRM ]" is used
    Then the scene transitions to the submitting phase

  Scenario: Submitting posts the score and locates the new entry
    Given the submitting phase has started with initials "XYZ" and score 900
    Then all initials-entry UI elements are destroyed
    And a POST to /api/scores is sent with { initials: "XYZ", score: 900 }
    When the response succeeds
    Then the returned array becomes the new leaderboard
    And the new entry's index is found by matching both initials "XYZ" and score 900 (first match)
    When the request fails
    Then the board is still shown, with no row highlighted

  Scenario: A duplicate initials+score pair can mis-highlight a pre-existing row
    Given an entry with initials "ABC" and score 500 already exists on the board
    And the player's new submission is also initials "ABC" and score 500
    Then the highlight may land on the pre-existing row instead of the new one, since the match is first-found by value, not by identity

  Scenario: Board phase rendering
    Given the board phase is active with up to 10 entries
    Then each row reads "{rank}. {initials} {score}"
    And ranks 1-3 render in gold, the highlighted row (if any) in bright yellow with a "▶" marker, all others in grey
    Given the leaderboard is empty
    Then "NO SCORES YET" is shown instead of any rows

  Scenario: A grace period prevents an accidental instant dismissal
    Given the board has just been shown
    When fewer than 700ms have elapsed
    Then no keypress or tap dismisses the board
    When 700ms or more have elapsed
    Then the next keypress or tap of any kind transitions to MenuScene
