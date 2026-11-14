# Fuse Jumper — BDD Acceptance Suite

This directory expresses `../SPEC.md` as Gherkin scenarios. Read them together: `SPEC.md`
gives exact numbers and the "why"; these `.feature` files give pass/fail acceptance
criteria to check a rebuild against.

**Status:** these are specification-grade Gherkin, not yet wired to a runner — the project
has no test framework installed (`package.json` has no test script). To execute them
against a real rebuild:

- **Unit/behavior level** (physics constants, scoring math, enemy state machines,
  worker.ts validation logic) — pair with `vitest` + a lightweight harness that constructs
  `Enemy`/`Player`/`Projectile`/`GameScene` instances using Phaser's headless test mode, or
  extract the pure logic (scoring, worker validation, state-machine transitions) into
  plain functions that these scenarios can call directly via `@cucumber/cucumber` or
  `jest-cucumber` step definitions.
- **End-to-end level** (scene flow, HUD text, touch controls, full playthroughs) — pair
  with Playwright driving the actual canvas (read pixel data / expose a debug hook that
  dumps `GameScene`'s internal state to `window` in dev builds) since Phaser renders to
  `<canvas>`, which has no DOM to query directly.
- **worker.ts / API level** — these scenarios translate almost directly into
  `supertest`-style HTTP assertions against `wrangler dev` or `unstable_dev`.

## File index

| File | Covers |
|---|---|
| `01-scene-flow.feature` | Boot → Menu → Intro → Game → Complete/GameOver transitions, data carried between scenes |
| `02-player-movement.feature` | Walk/jump/float physics, animation state machine, dev keys |
| `03-collectibles-and-scoring.feature` | Shirt pickup, order-bonus sequencing, score multiplier interaction |
| `04-coins-fpl-chips.feature` | Coin spawn cadence, each chip's effect, one-per-type-per-level rule |
| `05-eels-hazard.feature` | Eel spawn cadence, movement, collision, level-4 disable |
| `06-lives-hits-respawn.feature` | Hit detection, invincibility window, respawn sequencing, god mode, game over |
| `07-level1-club1800-bubble-blower.feature` | Level 1 layout + bubble-blower AI |
| `08-level2-club2000-enemies.feature` | Level 2 layout + flanker/rushy/smaller-bear AI |
| `09-level3-club2100-enemies.feature` | Level 3 layout + clippy/melonhead/butter-fingers/padel-punisher AI |
| `10-level4-club2200-enemies.feature` | Level 4 layout + giant-bear/condor/actuary-man/puffin/vascular-man/skeletor AI |
| `11-projectiles-and-crate-smash.feature` | Every projectile type's physics/lifecycle, crate smash + glass shards |
| `12-screen-boundaries.feature` | Block/bounce/exit rules per entity per edge |
| `13-pause-and-hud.feature` | HUD text contents, pause overlay behavior |
| `14-leaderboard-api.feature` | `worker.ts` `/api/scores` GET/POST contract, KV persistence, validation |
| `15-gameover-leaderboard-ui.feature` | GameOverScene's loading/initials/submitting/board state machine |
| `16-tech-stack-and-deploy.feature` | Build/deploy pipeline, PWA shell, responsive touch-control layout |

Each `Given`/`When`/`Then` references concrete constants and coordinates from `SPEC.md` —
treat any mismatch between a scenario and `SPEC.md` as a bug in this file, since `SPEC.md`
was derived directly from the shipped source.
