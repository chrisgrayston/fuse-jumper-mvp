Feature: worker.ts leaderboard API (/api/scores)
  Backed by a Cloudflare Workers KV namespace bound as SCORES, under the single key
  "leaderboard" (a JSON array of { initials: string, score: number }).

  Background:
    Given the Worker is running with a SCORES KV binding

  Scenario: GET returns an empty array when no scores have ever been submitted
    Given the KV key "leaderboard" does not exist
    When a GET request is made to /api/scores
    Then the response is 200 with JSON body []
    And the response includes "Access-Control-Allow-Origin: *"

  Scenario: GET returns the stored leaderboard verbatim
    Given KV key "leaderboard" holds [{"initials":"AAA","score":500}]
    When a GET request is made to /api/scores
    Then the response is 200 with that exact JSON array

  Scenario: POST with valid initials and score appends, sorts, and caps at 10
    Given the current leaderboard has 10 entries, the lowest scoring 300
    When a POST is made with { initials: "zzz", score: 450 }
    Then the new entry is added as { initials: "ZZZ", score: 450 }
    And the full list is sorted descending by score
    And the list is truncated to the top 10 (the old lowest-300 entry is dropped if 450 ranks above it)
    And the response is 200 with the resulting sorted, capped array
    And KV key "leaderboard" is updated to this same array

  Scenario Outline: Initials normalization
    When a POST is made with initials "<input>"
    Then the stored initials become "<normalized>"

    Examples:
      | input   | normalized |
      | ab      | ABA        |
      | abcdef  | ABC        |
      | a1b2c3  | ABC        |
      | "   "   | AAA        |
      | xyz     | XYZ        |

  Scenario: Non-string initials are rejected
    When a POST is made with { initials: 123, score: 400 }
    Then the response is 400 Bad Request
    And the leaderboard in KV is unchanged

  Scenario Outline: Score validation
    When a POST is made with score "<score>"
    Then the result is "<result>"

    Examples:
      | score      | result                                |
      | 400        | accepted, stored as 400               |
      | 400.9      | accepted, floored to 400              |
      | -5         | rejected, 400 Bad Request             |
      | "not-a-num"| rejected, 400 Bad Request             |
      | Infinity   | rejected, 400 Bad Request             |
      | NaN        | rejected, 400 Bad Request             |

  Scenario: Any other HTTP method on /api/scores is rejected
    When a PUT or DELETE request is made to /api/scores
    Then the response is 405 Method Not Allowed

  Scenario: Any path other than /api/scores falls through to static asset serving
    When a GET request is made to any path not starting with /api/scores
    Then the request is forwarded to env.ASSETS.fetch(request), serving the built dist/ output

  Scenario: There is no authentication or rate limiting
    Given any client can call POST /api/scores with any initials and a plausible score
    Then the request is accepted as long as it passes the shape/range validation above
    And no per-player identity or anti-cheat check exists in the current implementation
