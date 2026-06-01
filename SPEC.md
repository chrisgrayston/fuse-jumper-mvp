# Fuse Jumper — Game Specification

## Concept

A 2D arcade platformer set inside a series of London nightclubs. You play a **Fantasy Premier League newbie** trying to climb from the bottom of the mini-league table to the very top. Every club you enter is run by a crew of seasoned FPL veterans who don't want you there — smug stat-heads, differential merchants, and armchair tacticians who've been top of the league for years and intend to stay there.

Your goal: collect all 11 player shirts scattered across each club's platforms — building your FPL squad one signing at a time — before the regulars kill you. Beat the club, carry your score and lives forward to the next one. Four clubs stand between you and the top of the league: Club 1800 → 2000 → 2100 → 2200.

**Tone:** Chaotic, funny, British. The enemies aren't random thugs — they're FPL archetypes: the guy who always plays the Triple Captain on a blank gameweek, the one who's been on the same wildcard since August. Enemy names like Butter Fingers, Padel Punisher, Melonhead. Power-ups are the actual FPL chips — Triple Captain, Wildcard, Bench Boost, Free Hit — each with a direct in-game effect that mirrors their real fantasy value.

---

## Tech Stack

- **Engine:** Phaser 3.80 (Arcade Physics)
- **Language:** TypeScript + Vite
- **Hosting:** Cloudflare Workers static assets
- **Deploy:** `npm run deploy` (wrangler) — git push alone does NOT deploy
- **Canvas:** 800 × 450px, world gravity: `{ x: 0, y: 600 }`
- **All sprites:** generated programmatically in `src/scenes/BootScene.ts`
  - `fillCircle` works; `fillEllipse` does NOT
- **Live URL:** https://fuse-jumper-mvp.christopher-grayston.workers.dev

---

## Scene Flow

```
MenuScene
  → LevelIntroScene  (club name/number reveal)
    → GameScene       (main gameplay)
      → LevelCompleteScene  (score tally, carry forward)
        → LevelIntroScene (next level)
      → GameOverScene   (score = 0 → back to menu)
```

---

## Player

- **Sprite:** `player`, `player-2` (walk), `player-jump` (in air)
- **Walk speed:** 200 px/s
- **Jump velocity:** -480 (upward); float assist while holding jump
- **Controls:** Arrow keys / WASD + touch (mobile)
- **Lives:** 3 (MAX_LIVES). Carried between levels.
- **On hit:** Brief invincibility window, then respawn at level start. Die → Game Over if lives reach 0.
- **Dev keys:** G = god mode; 1–4 = jump to level

---

## Collectibles (Shirts)

Each level has 11 numbered shirts placed on platforms — each one a player signing for your FPL squad. Collecting all 11 completes your team and ends the level, earning you the right to move up to the next club.

**Scoring:**
- `SCORE_PER_PICK = 100` per shirt
- `ORDER_BONUS = 50` bonus if collected in sequence (1→2→3…→11)
- Sequence breaks on the first out-of-order pickup — no further order bonuses that run
- Score multiplier from coins applies to both base and bonus

---

## Coins (FPL Chips)

The real FPL chips drop into the arena every `COIN_INTERVAL = 10000ms` (max 3 per level). 50% spawn chance per tick. Just like in real FPL, using the right chip at the right moment can flip the game.

| Code | Name | Effect |
|------|------|--------|
| `tc` | Triple Captain | `scoreMult = 3` for rest of level — your captain hauls, everyone notices |
| `bb` | Bench Boost | Spawns 4 extra shirts (numbers 12–15) on random platforms — your bench players actually contribute for once |
| `ww` | Wildcard | Restores all missing shirts to their original positions — full squad reset, fresh start |
| `fh` | Free Hit | +1 life — a get-out-of-jail card, just like the real thing |

---

## Eels (Environmental Hazard)

Spawn every 5000ms from the right edge, fall with gravity, drift left. Animate 3 frames. Destroy on contact with player (kills player) or when they exit the world. Not attached to any enemy — a background threat.

---

## Level Structure

All levels: 800 × 450 canvas, `playerStart: { x: 80, y: 390 }`. Platforms are static physics bodies.

### Level 1 — Club 1800 "No Rules. No Light. No Tomorrow."
- **Narrative:** The bottom rung. A grimy dive bar where FPL rookies go to die. The locals have been 18th in their league since 2019 and couldn't be prouder of it. They see a new face with a squad sheet and immediately get territorial.
- **Theme:** Gritty dive bar. Dark red neon (`0xcc1122`). Wet concrete.
- **Platforms:** Bar floor (full width), bar stools ×2, bar counter (right), high shelf (left), back shelf (right), top shelf (centre)
- **Enemies:** `bubble-blower` (ground patrol)

### Level 2 — Club 2000 "VIP Only. Hard Techno. Harder You."
- **Narrative:** Mid-table. These lot actually watch the football and think that makes them experts. They've got a spreadsheet. They've named their team something ironic. They do NOT want a newbie climbing past them.
- **Theme:** Neon nightclub. Purple/pink (`0xff1a44`).
- **Platforms:** Dance floor, speaker boxes ×2, stage, mid left/right, VIP balconies ×2, VIP centre, top booth
- **Enemies:** `flanker` (ground patrol), `rushy` (figure-8 float, top third), `smaller-bear` (jumps VIP left ↔ VIP right)

### Level 3 — Club 2100 "Mid-tier prestige. Earned, not given."
- **Narrative:** The serious end. These are the regulars who've been top 10k overall. They talk about "ownership", "differentials", and "price rises" at the bar. Butter Fingers has played his Wildcard four times this season alone. Nobody questions it.
- **Theme:** Industrial neon orange (`0xff7700`). Multi-platform chaos.
- **Platforms:** Ground, low flanks ×2, mid ×3, upper flanks ×2, high flanks ×2 (y=152, h=12), top (y=58)
- **Enemies:** `clippy` (ground patrol), `melonhead` (physics-driven arena roam), `butter-fingers` (high-flank jumping with crate/pie throws), `padel-punisher` (centre-mid, static)

### Level 4 — Club 2200 "Only the gods qualify."
- **Narrative:** The summit. These are the top-of-the-league legends — the ones with trophies on their profile and a chip saved since Gameweek 1. Skeletor has been number one in the mini-league for so long nobody remembers when it wasn't his. Beat them and the league is yours.
- **Theme:** Greek marble temple. Gold and white (`0xf0c040`). Skeletor reigns.
- **Platforms:** Many tiers — marble ground up to Skeletor's throne at y=28
- **Enemies:** `giant-bear` (ground patrol + charge), `condor` (figure-8 float, mid), `actuary-man` (vertical shuttle, throne ↔ mid), `puffin` (static, aims golf balls at player), `vascular-man` (glides between mid positions), `skeletor` (static throne, aims dark magic)

---

## Enemy Reference

All enemies live in `src/objects/Enemy.ts`. Physics bodies are Arcade. `resetEnemy()` is called on player respawn.

**Floaters** (no gravity): `rushy`, `condor`, `actuary-man`, `vascular-man`, `skeletor`  
**Ground walkers** (gravity on, platform collider): all others

### bubble-blower (Level 1)
- Patrols ground left/right at 55 px/s
- Every 8–12s: blows 3 bubbles in a spread arc (upward fan, -10° / -90° / -170°)
- Every 4–8s: kicks a football in alternating direction (vx=±340)
- Sprites: idle, blow, walk-2

### flanker (Level 2)
- Patrols at 110 px/s. Every 3–5.5s: stops for 1500ms sumo stamp, then charges at 420 px/s for 550ms
- No projectiles — dangerous on contact during charge
- Sprites: idle, walk-2, stamp, stamp-2

### rushy (Level 2)
- Floats in figure-8 sine path: x = 400 + cos(t×0.7)×200, y = baseY + sin(t)×25
- No projectiles — pure contact threat
- No gravity; uses `body.reset()` each frame

### smaller-bear (Level 2)
- Idles at posA or posB (VIP balcony left/right). Every 3–5s: throws coat ahead on arc, then jumps to other platform (900ms flight, arc 80px), then wears coat for 1500ms
- Coat (`proj-coat`) flies as a decorative sprite (no hitbox)
- Growls "GRAAARR!" text on jump initiation

### melonhead (Level 3)
- Physics-driven: roams under gravity with random jumps (-400 vy)
- 70% of direction changes are toward the player
- Within 65px of player: swing attack with mallet (spawn `mallet` projectile at vy=-60)
- Patrol bounds enforced (patrolLeft/patrolRight). Stall-prevention kicks in if stuck.
- Sprites: idle, walk-2, jump, float, swing-1, swing-2

### clippy (Level 3)
- Patrols ground at 60 px/s. Every 2.5–4s: fires a `mallet` projectile in patrol direction (vx=±260, vy=-60)
- No animation beyond patrol

### butter-fingers (Level 3) — 10-phase state machine
- Sits on high-flank platforms (posA: left at x=115,y=124 / posB: right at x=685,y=124)
- Physics off — uses `body.reset()` for all movement
- **Phase cycle (stored in `st.nextKick`):**

| Phase | ID | Description |
|-------|----|-------------|
| IDLE (PI) | 0 | Bob animation, 1.5–2.5s wait, then kick cycle check |
| THROW_LIFT (PLI) | 1 | Throw frame 1 — spawns `crate` (vx=±25 random, vy=50) at y+55 |
| THROW_HOLD (PHO) | 2 | Throw frame 2, 250ms |
| THROW_RELEASE (PRE) | 3 | Throw frame 3, 200ms |
| THROW_FOLLOW (PFO) | 4 | Throw frame 4, then → TRAVELLING |
| TRAVELLING (PTR) | 6 | Lerp jump to other platform over 900ms, arc height 40px |
| ROLLING (PRL) | 5 | Barrel roll slide (60 px/s) for 560ms after landing |
| PIE_WIND (PWN) | 7 | Wind-up — spawns 2 `pie` projectiles horizontally |
| PIE_THROW (PPT) | 8 | Throw frame 2, 180ms |
| PIE_FOLLOW (PPF) | 9 | Follow-through, 280ms → back to IDLE |

- **Cadence:** `kickClock % 3 === 0` → pie cycle (skips crate, jumps first, throws pies after landing). Pattern: **crate, crate, PIE, crate, crate, PIE...**
- **Pie throw direction:** alternates ±1 each pie cycle via `st.kickDir`
- Sprites: 14 frames (40×56px): idle, walk-2, throw-1/2/3/4, jump, roll-1/2/3/4, pie-1/2/3

### padel-punisher (Level 3)
- Static at centre-mid platform. Every 1.8–3.2s: fires `padel-ball` in a random upward angle (200°–340°, speed 220–320)
- Uses `body.reset()` to stay pinned

### giant-bear (Level 4)
- Patrols at 50 px/s. Every 4–7s: charges at 260 px/s for 1400ms

### condor (Level 4)
- Floats in figure-8: x = 400 + cos(t×0.6)×330, y = baseY + sin(t)×55
- No projectiles — pure contact threat

### actuary-man (Level 4)
- Shuttles between throne (posA, top) and mid platform (posB) every 3–5s over 900ms using CubicInOut easing
- No projectiles

### puffin (Level 4)
- Static on mid-centre platform. Every 2–3.5s: fires `golf-ball` aimed directly at player position (speed 280)

### vascular-man (Level 4)
- Glides between posA and posB every 3.5–5.5s over 1000ms with inverted-sine arc (swings under platforms)
- No projectiles

### skeletor (Level 4)
- Static on throne platform (y=14). Every 2–3.5s: fires `dark-magic` aimed at player (speed 240)

---

## Projectile Reference

All projectiles in `src/objects/Projectile.ts`. Added to `projectilesGroup`. 

**Critical pattern:** `projectilesGroup.add(proj)` resets the Arcade body (wipes velocity). `spawnFn` in GameScene re-applies `body.setVelocity(vx, vy)` immediately after `add()` to fix this.

| Type | Gravity | Physics notes |
|------|---------|---------------|
| `bubble` | Off | Sine drift horizontally; upward vy decays to slow float. Random freq/amp/phase per bubble. |
| `mallet` | On | Normal arc (natural gravity) |
| `crate` | Slow | `allowGravity=true`, `setGravityY(-520)` → effective gravity ~80. Physically stops on platforms via collider+processCallback (only crates get stopped). On contact: smash animation (3 frames × 240ms) + 3 glass shards |
| `pie` | Off | `allowGravity=false`. `pieVX` stored and re-asserted every frame in `update()` (same pattern as football — prevents group.add wipe) |
| `glass-shard` | On | Spawned upward (explicit `vy = -260 to -460`) from crate smash point. Lifespan 1600ms then self-destruct. Spawned at y-20 above impact. |
| `padel-ball` | On | Normal arc |
| `golf-ball` | On | Normal arc, aimed at player |
| `dark-magic` | On | Normal arc, aimed at player |
| `coat` | — | Not a Projectile — decorative `Image` managed by smaller-bear |
| `football` | Off | `allowGravity=false`. `footballVX` re-asserted every frame in `update()` |

All projectiles self-destruct if outside x: -60–860 or y: -60–520.

---

## Crate Smash System

When a `crate` hits a platform:

1. `projectilesGroup` collider fires with processCallback (`projType === 'crate'` → true, all others → false)
2. Crate destroyed at impact position
3. `createCrateSmash(x, y)` plays 3-frame animation (`proj-crate-smash-1/2/3`) at 240ms per frame
4. 3 glass shards spawned at (x, y-20) with random `vx ∈ [-340, 340]` and `vy = -[260, 460]` (always upward)
5. Glass shards hurt player on contact; despawn after 1600ms

---

## Screen Boundaries

Canvas is 800 × 450px. World bounds are set to match. Behaviour at each edge:

| Entity | Top | Right | Bottom | Left |
|--------|-----|-------|--------|------|
| Player | block | block | block | block |
| All enemies | block | block | block | block |
| Coins | bounce | bounce | bounce | bounce |
| Bubble | EXIT | bounce | bounce | bounce |
| Football | bounce | EXIT | bounce | EXIT |
| Mallet | bounce | EXIT | bounce | EXIT |
| Crate | EXIT | EXIT | EXIT | EXIT |
| Pie | EXIT | EXIT | EXIT | EXIT |
| Glass shard | EXIT | EXIT | EXIT | EXIT |
| Padel-ball | EXIT | EXIT | EXIT | EXIT |
| Golf-ball | EXIT | EXIT | EXIT | EXIT |
| Dark-magic | EXIT | EXIT | EXIT | EXIT |
| Eels | — | — | EXIT | EXIT |

**Implementation notes:**
- Player/enemies: `setCollideWorldBounds(true)` (already set)
- Coins: manual bounce in update loop (coins spawn above canvas at y=-30, so `setCollideWorldBounds` can't be used — manual check in GameScene update loop instead)
- Bubble: left/right bounce flips `bubbleSinePhase` by π (reverses sine direction) before vx is computed that frame; bottom bounce forces `bubbleVY` negative; exits through top (y < -60 → destroy)
- Football/mallet: exit left/right via existing out-of-bounds destroy; top/bottom bounce flips `body.velocity.y` and clamps position
- All other projectiles: existing destroy-on-exit logic unchanged

---

## Key Technical Patterns

### body.reset() for manual movement
Floaters and BF use `body.reset(x, y)` each frame to drive position directly, bypassing physics simulation. Required for lerp-based travel and rolling.

### group.add() wipes physics body
When any game object is added to a `physics.add.group()`, Phaser resets the Arcade body. Velocity and gravity settings set in the constructor are lost. **Fix:** `spawnFn` calls `body.setVelocity(vx, vy)` after `add()`. Football and pie additionally re-assert their state every frame in `Projectile.update()` since they need to maintain zero-gravity constant velocity.

### Crates and platform layers
Crate spawn position must clear the platform body BF stands on. BF at y=124 on high-flank (y=152, h=12 → body bottom at y=164). Crate spawns at y+55=179 → body top=169, clears platform bottom ✓. If spawn y is inside the platform body, the crate smashes immediately on spawn.

### Phaser coordinate system
Positive y = downward. For upward projectile velocity, use negative vy. World gravity adds to vy every frame (positive = accelerates down). `setGravityY(-520)` with world gravity 600 gives effective gravity of 80.

### fillEllipse is broken
Use `fillCircle` only. `fillEllipse` does not render correctly in the Phaser version used.

---

## Art Style

All sprites are pixel-art scale (~24×36px for enemies, 40×56px for butter-fingers, 16×16px for collectibles). Generated via Phaser Graphics API in `BootScene.generateTextures()`. Background art is JPEG loaded from `public/art/` and overlaid with a coloured rect for atmosphere. Each level has its own background image key (`art-club1800`, `art-club2000`, `art-club2100`, `art-club2200`).

---

## File Map

```
src/
  scenes/
    BootScene.ts         — texture generation, asset loading
    MenuScene.ts         — main menu
    LevelIntroScene.ts   — club reveal screen
    GameScene.ts         — main game loop, collision, scoring, HUD
    LevelCompleteScene.ts
    GameOverScene.ts
  objects/
    Player.ts            — player movement + animation
    Enemy.ts             — all enemy AI + state machines
    Projectile.ts        — projectile physics + update
    Collectible.ts       — shirt pickup sprites
  levels/
    types.ts             — EnemyType, ProjectileType, LevelData interfaces
    level1.ts            — Club 1800
    level2.ts            — Club 2000
    level3.ts            — Club 2100
    level4.ts            — Club 2200
```
