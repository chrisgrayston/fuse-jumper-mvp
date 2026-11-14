Feature: Screen boundary behavior per entity type
  Canvas and world bounds are both exactly 800x450.

  Scenario Outline: World-bound behavior at each edge, by entity
    Given a "<entity>" is alive and reaches the "<edge>" edge of the world
    Then the behavior is "<behavior>"

    Examples:
      | entity       | edge   | behavior                                   |
      | player       | top    | blocked (setCollideWorldBounds)            |
      | player       | right  | blocked                                    |
      | player       | bottom | blocked                                    |
      | player       | left   | blocked                                    |
      | any enemy    | top    | blocked                                    |
      | any enemy    | right  | blocked                                    |
      | any enemy    | bottom | blocked                                    |
      | any enemy    | left   | blocked                                    |
      | coin         | top    | bounces (manual per-frame check)           |
      | coin         | right  | bounces (manual)                           |
      | coin         | bottom | bounces (manual)                           |
      | coin         | left   | bounces (manual)                           |
      | bubble       | top    | exits (y < -60)                            |
      | bubble       | right  | bounces (sine phase flips by pi)           |
      | bubble       | bottom | bounces (phase flips by pi)                |
      | bubble       | left   | bounces (phase flips by pi)                |
      | football     | right  | exits                                      |
      | football     | left   | exits                                      |
      | football     | top    | bounces                                    |
      | football     | bottom | bounces                                    |
      | mallet       | right  | exits                                      |
      | mallet       | left   | exits                                      |
      | mallet       | top    | bounces                                    |
      | mallet       | bottom | bounces                                    |
      | crate        | top    | exits                                      |
      | crate        | right  | exits                                      |
      | crate        | bottom | exits                                      |
      | crate        | left   | exits                                      |
      | pie          | top    | exits                                      |
      | pie          | right  | exits                                      |
      | pie          | bottom | exits                                      |
      | pie          | left   | exits                                      |
      | glass-shard  | top    | exits                                      |
      | glass-shard  | right  | exits                                      |
      | glass-shard  | bottom | exits                                      |
      | glass-shard  | left   | exits                                      |
      | dark-magic   | top    | exits                                      |
      | dark-magic   | right  | exits                                      |
      | dark-magic   | bottom | exits                                      |
      | dark-magic   | left   | exits                                      |
      | eel          | bottom | exits (y > 520)                            |
      | eel          | left   | exits (x < -80)                            |

  Scenario: Coins are manually bounced because they spawn above the canvas
    Given a coin spawns at y = -30, above the physical world bounds (y >= 0)
    Then setCollideWorldBounds cannot be used for it
    And GameScene.update() manually checks x<=0, x>=800, y<=0, y>=450 every frame and flips the relevant velocity component, clamping position 1px inside

  Scenario: Padel-ball and golf-ball use bounce-then-wide-exit, not the simple table rule
    Given a padel-ball or golf-ball approaches a world edge
    Then it bounces off platforms and world bounds (setBounce 1.0, collideWorldBounds true) rather than exiting immediately
    And it is only force-destroyed once it strays beyond a wider margin (x<-30, x>830, y<-30, y>490) or its 2000ms soft-expiry has elapsed and it next makes contact
