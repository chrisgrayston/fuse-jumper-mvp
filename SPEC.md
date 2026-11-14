# Fuse Jumper — Full Reengineering Specification

This document is the authoritative, implementation-level specification of the game as it
currently exists. It is written to be sufficient, on its own, to rebuild the game — code,
content, tech stack, and deployment pipeline — from nothing.

Companion document: `bdd/` contains Gherkin `.feature` files that express every rule below
as testable scenarios. Use this file for *what exists and the exact numbers*; use `bdd/`
for *acceptance criteria while rebuilding*.

---

## 1. Concept

A 2D arcade platformer set inside a series of London nightclubs. You play a **Fantasy
Premier League newbie** climbing from the bottom of a mini-league table to the top. Every
club is run by FPL veterans who don't want you there.

**Goal:** collect all 11 numbered player shirts scattered across each club's platforms
(building an FPL squad) before the regulars kill you. Clear a club, carry score/lives
forward, move to the next. Four clubs: **Club 1800 → 2000 → 2100 → 2200**.

**Tone:** chaotic, funny, British. Enemies are FPL archetypes (Bubble Blower, Flanker,
Rushy, Smaller Bear, Melonhead, Clippy, Butter Fingers, Padel Punisher, Giant Bear, Condor,
Actuary Man, Puffin, Vascular Man, Skeletor). Power-ups are the real FPL chips — Triple
Captain, Bench Boost, Wildcard, Free Hit.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Engine | Phaser 3.80.1, Arcade Physics |
| Language | TypeScript 5.4.5 |
| Bundler/dev server | Vite 6.4.2 |
| Hosting | Cloudflare Workers (static assets + Worker script) |
| Edge KV | Cloudflare Workers KV (`SCORES` namespace) for the leaderboard |
| Deploy tool | Wrangler 4.95.0 |
| Package manager | npm |

### 2.1 `package.json` scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && wrangler deploy"
  },
  "dependencies": { "phaser": "^3.80.1" },
  "devDependencies": {
    "typescript": "^5.4.5",
    "vite": "^6.4.2",
    "wrangler": "^4.95.0"
  }
}
```

- `npm run dev` — local Vite dev server (HMR), `server.host: true` so it's reachable on LAN.
- `npm run build` — type-checks with `tsc` (no emit config beyond default `tsconfig.json`),
  then `vite build` emits static assets to `dist/`.
- `npm run deploy` — **the only command that publishes to production.** It always rebuilds
  first. **A `git push` alone never deploys** — this is a hard rule for this project.

### 2.2 `vite.config.ts`

```ts
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } },
  },
  server: { host: true },
});
```

Relative `base: './'` matters because the Worker serves assets from `dist/` and the SPA
fallback must work from any path. `phaser` is split into its own chunk.

### 2.3 `wrangler.jsonc`

```jsonc
{
  "name": "fuse-jumper-mvp",
  "compatibility_date": "2026-05-30",
  "main": "worker.ts",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application",
    "binding": "ASSETS"
  },
  "kv_namespaces": [
    { "binding": "SCORES", "id": "<kv-namespace-id>" }
  ]
}
```

- Cloudflare Workers **static assets** mode: `./dist` is served directly by the platform,
  with `not_found_handling: single-page-application` so any unmatched path falls back to
  `index.html` (safe for a one-page game; also means the Worker's `fetch` only runs for
  paths the asset handler doesn't resolve to a file, i.e. effectively just `/api/*`).
- `main: worker.ts` — a custom Worker script runs *before* static asset serving, to handle
  `/api/*`. To recreate this: `wrangler kv namespace create SCORES`, paste the id in, then
  `wrangler deploy`.

### 2.4 `worker.ts` — Leaderboard API

The entire server-side surface of the game is one Worker script with one route.

```
GET  /api/scores
POST /api/scores     { initials: string, score: number }
*    anything else   → falls through to env.ASSETS.fetch(request)  (serves dist/)
```

**`GET /api/scores`**
- Reads KV key `leaderboard` (a JSON array of `{ initials, score }`, or `[]` if absent).
- Returns `200` with that JSON array. CORS: `Access-Control-Allow-Origin: *`.

**`POST /api/scores`**
- Body: `{ initials: unknown, score: unknown }`.
- Validation:
  - `initials`: must be a `string`. Normalized: uppercased, every non-`A–Z` character
    stripped, truncated to 3 chars, right-padded with `A` to exactly 3 chars. Example:
    `"ab1"` → `"AB"` → `"ABA"`. If the input isn't a string, the whole request is rejected.
  - `score`: must be a finite `number`, `>= 0`; truncated to an integer via `Math.floor`.
    Anything else is rejected.
  - On failure of either: `400 Bad Request` (plain text body `"Bad Request"`).
- On success:
  1. Load current leaderboard array from KV (`[]` if absent).
  2. Push the new `{ initials, score }` entry.
  3. Sort **descending by score**.
  4. Truncate to the **top 10** (`scores.splice(10)`).
  5. Write back to KV under key `leaderboard`.
  6. Respond `200` with the new (already-truncated, sorted) array as JSON.
- Any other HTTP method on `/api/scores` → `405 Method Not Allowed`.
- No auth, no rate limiting, no per-player identity — trust-based, arcade-style leaderboard.

To reimplement: any KV-backed or equivalent durable key-value store works; the exact
contract (shape, sort order, top-10 cap, 3-letter initials sanitation) is what matters for
compatibility with `GameOverScene`.

### 2.5 PWA shell

- `public/manifest.json`: name "Fuse Jumper", `display: fullscreen`, `orientation: any`,
  background/theme color `#1a0a2e`, icons `icon-192.png` / `icon-512.png` (maskable).
- `index.html` `<head>`: viewport meta disables pinch-zoom and sets
  `viewport-fit=cover`; `apple-mobile-web-app-capable`, `apple-mobile-web-app-title`
  `"Fuse Jumper"`; `<link rel="manifest">`, `<link rel="apple-touch-icon">`.
- `theme-color` meta `#1a0a2e` matches `body` background and Phaser's `backgroundColor`.

---

## 3. File Map

```
index.html                 — page shell: #game-container + on-screen touch controls + dev buttons
worker.ts                  — Cloudflare Worker: /api/scores, else serve dist/
wrangler.jsonc              — Workers config: static assets binding + KV binding
vite.config.ts              — build config
tsconfig.json               — TypeScript compiler config
package.json
public/
  manifest.json, icon-192.png, icon-512.png
  art/                      — JPEG background + villain-portrait art (see §12)
src/
  main.ts                   — Phaser.Game bootstrap, scene list, global physics config
  styles.css                — page/touch-control layout (grid, responsive by orientation)
  input/
    touchInput.ts           — on-screen control state machine, read by GameScene
  scenes/
    BootScene.ts             — preloads art JPEGs, procedurally generates ALL game sprites
    MenuScene.ts              — title screen
    LevelIntroScene.ts        — per-club "villain roster" reveal screen
    GameScene.ts               — main gameplay: physics, collisions, scoring, HUD, pause
    LevelCompleteScene.ts      — score tally / "next club" screen
    GameOverScene.ts            — leaderboard fetch, initials entry, score submit, board
  objects/
    Player.ts                 — movement, jump/float physics, animation state machine
    Enemy.ts                   — every enemy's AI, stored as one big switch/state machine
    Projectile.ts               — every projectile type's physics + lifecycle
    Collectible.ts              — a single numbered shirt pickup
  levels/
    types.ts                   — EnemyType / ProjectileType / LevelData interfaces
    level1.ts … level4.ts       — per-club platform/collectible/enemy layout data
```

---

## 4. Game Configuration

```ts
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  parent: 'game-container',
  backgroundColor: '#1a0a2e',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 600 }, debug: false } },
  scene: [BootScene, MenuScene, LevelIntroScene, GameScene, GameOverScene, LevelCompleteScene],
};
```

- Fixed logical resolution **800×450** (16:9), scaled to fit any viewport, centered.
- World gravity **600 px/s²** downward (positive y = down in Phaser's coordinate system).
- `initTouchInput()` runs once at boot, before `new Phaser.Game(config)`, wiring DOM button
  listeners that live for the whole page lifetime (not scene-scoped).

---

## 5. Scene Flow

```
BootScene  (preload + generate textures, auto-advances)
  → MenuScene
    → LevelIntroScene (levelIndex: 0, score: 0, lives: 3)
      → GameScene (levelIndex, score, lives)
        ├─ on all 11 (+bonus) shirts collected → LevelCompleteScene
        │     ├─ more levels left → LevelIntroScene (next levelIndex, carried score/lives)
        │     └─ last level done  → LevelCompleteScene with nextLevelIndex=-1 ("game complete")
        │           → LevelIntroScene (levelIndex: 0, score: 0, lives: 3)  [restart]
        └─ on lives reaching 0 → GameOverScene (score)
              → (after leaderboard flow) → MenuScene
```

Data passed between scenes via Phaser's `scene.start(key, data)` payload, read in each
scene's `init()`/`create(data)`:

| Scene | Incoming data | Outgoing data |
|---|---|---|
| MenuScene | — | `{ levelIndex: 0, score: 0, lives: 3 }` → LevelIntroScene |
| LevelIntroScene | `{ levelIndex, score, lives }` | same shape → GameScene |
| GameScene | `{ levelIndex?, score?, lives? }` (all default: `0`, `0`, `3`) | `{ score, lives, levelIndex, nextLevelIndex }` → LevelCompleteScene, or `{ score }` → GameOverScene |
| LevelCompleteScene | `{ score, lives, levelIndex, nextLevelIndex }` | `{ levelIndex, score, lives }` → LevelIntroScene |
| GameOverScene | `{ score }` | none (ends at MenuScene) |

---

## 6. BootScene

- `preload()`:
  - Loads 19 JPEG images from `public/art/` (one game-logo/menu poster, 5 club backgrounds,
    13 villain portraits — see §12.1 for the exact key→file table).
  - Calls `this.generateTextures()` synchronously (no async texture generation — pure
    Phaser `Graphics` draw calls baked to textures via `generateTexture(key, w, h)`).
  - Auto-transitions to `MenuScene` once preload completes (no loading bar in current
    build — negligible load time since only images + procedural code).
- `generateTextures()` is ~3000 lines of `Phaser.GameObjects.Graphics` draw calls (fillRect,
  fillCircle, etc.) rasterized into named textures. **Every sprite in the game — player,
  all 14 enemy types across all their animation frames, all 11 projectile types, UI
  elements — is generated code, not an image asset.** See §12 for the full texture
  inventory and the drawing-API constraints that must be respected when recreating this.

---

## 7. Player

File: `src/objects/Player.ts`.

### 7.1 Physics constants

| Constant | Value |
|---|---|
| `WALK_SPEED` | 200 px/s |
| `JUMP_VELOCITY` | −480 px/s (instant, on press) |
| `FLOAT_GRAVITY` | 120 (replaces world gravity of 600 while floating → effective ~120) |
| `NORMAL_GRAVITY` | 600 (used only to compute the float gravity delta) |
| `FLOAT_MAX_FALL` | 80 px/s (terminal fall speed while floating) |
| Body size / offset | 22×42, offset (9, 4) — narrower than the 40×50 sprite canvas |
| `setMaxVelocityY` | 500 |
| `setCollideWorldBounds` | true (blocks at all 4 edges) |

### 7.2 Controls

- **Move:** ← / → arrow keys, A / D, or on-screen left/right buttons (mobile). Horizontal
  velocity is set directly to `±WALK_SPEED` or `0` — no acceleration/deceleration curve.
- **Jump:** ↑, Space, W, or on-screen jump button. Edge-triggered (`JustDown`) — only fires
  once per press, and only while `canJump` is true (becomes true on landing, false on jump).
- **Float:** while airborne AND falling slower than 50 px/s downward (`velocity.y > -50`)
  AND the jump button/key is **held**, gravity is overridden to `FLOAT_GRAVITY - NORMAL_GRAVITY`
  (a negative delta added to world gravity, netting ~120 px/s² effective gravity), and fall
  speed is clamped to `FLOAT_MAX_FALL` (80 px/s). Releasing jump or touching ground cancels
  floating immediately.
- Touch input, keyboard, and (dev) level-jump buttons are polled every frame in
  `GameScene.update()` via `getTouchState()` / `consumeJumpPressed()` /
  `consumeRequestedLevel()` from `touchInput.ts` — see §7.4.

### 7.3 Animation state machine (texture keys, all generated 40×50)

Priority order evaluated every frame in `handleMovement`:

1. **Airborne** (`!onGround`): resets all ground-only timers (idle/tap/run/land), then:
   - `velocity.y < -80` → `player-jump`
   - else floating → `player-float`
   - else → `player-fall`
2. **Just landed hard** (`justLanded && prevVelY > 280`): `landTimer = 190ms` →
   `player-land` while `landTimer > 95`, then `player-crouch` while `0 < landTimer <= 95`,
   decrementing by `delta` each frame.
3. **Moving on ground** (`left || right`): 8-frame run cycle `player-run-1`…`player-run-8`,
   advancing one frame every 75ms (`runTimer`), looping 1→8→1.
4. **Idle on ground, <1000ms**: `player-idle`.
5. **Idle on ground, ≥1000ms**: alternate `player-idle` / `player-tap` every 350ms
   (foot-tapping fidget — `tapOn` flag flips on a 350ms timer, only once idle exceeds 1s).

`resetPosition(x, y)` (used on respawn): `body.reset(x, y)` plus clears every one of the
above timers/flags back to defaults (`canJump=false`, `isFloating=false`, etc.).

### 7.4 Touch input module (`src/input/touchInput.ts`)

A tiny, scene-independent singleton module (plain module-level `state` object, not a
class) wired once at boot:

```ts
interface TouchState { left: boolean; right: boolean; jumpPressed: boolean; jumpHeld: boolean; }
```

- `wire(id, onDown, onUp)` attaches both touch (`touchstart`/`touchend`/`touchcancel`,
  `passive: false`, `preventDefault()`) and mouse (`mousedown`/`mouseup`/`mouseleave`)
  listeners to a DOM element by id, so the same buttons work with touch or a mouse (for
  desktop testing).
- `btn-left` / `btn-right`: set/clear `state.left` / `state.right`.
- `btn-jump`: on down, sets **both** `jumpPressed = true` and `jumpHeld = true`; on up,
  clears only `jumpHeld`. `jumpPressed` is a one-shot flag consumed every frame by
  `consumeJumpPressed()` (set back to `false`) so it behaves like a key-down edge even
  though the DOM event already fired.
- `btn-level-1..4` (dev-only buttons, always rendered in the DOM — see `index.html`): set
  a module-level `requestedLevel` index; `GameScene.update()` calls
  `consumeRequestedLevel()` every frame and, if non-null, immediately restarts `GameScene`
  at that level with `score: 0, lives: MAX_LIVES`. **`requestedLevel` is 0-indexed**,
  matching `levelIndex` everywhere else in this spec (scene data payloads, `LEVELS[]`
  array indexing) — button `btn-level-1` sets `requestedLevel = 0`, `btn-level-2` sets
  `1`, and so on (`idx = buttonNumber - 1`). This mirrors the keyboard dev keys in §7.5,
  which do the same `parseInt(e.key, 10) - 1` conversion. Do not make this 1-indexed —
  `consumeRequestedLevel()`'s return value is passed straight through to
  `scene.start('GameScene', { levelIndex: devLevel, ... })` with no further offset.

### 7.5 Dev keyboard shortcuts (active only inside `GameScene`)

| Key | Effect |
|---|---|
| `1`–`4` | Jump straight to that level, resetting score to 0 and lives to 3 |
| `5` | Toggle god mode (`godMode`) — player takes no damage from anything, HUD shows `LIVES: ∞` |
| `P` / `Escape` | Toggle pause |

(The in-repo CLAUDE.md mentions `G` for god mode in older notes; the **current** code binds
god mode to the `5` key — use the code as ground truth.)

---

## 8. Level Data Model

File: `src/levels/types.ts`.

```ts
type EnemyType =
  | 'bubble-blower' | 'flanker' | 'rushy' | 'smaller-bear' | 'melonhead' | 'clippy'
  | 'butter-fingers' | 'padel-punisher' | 'condor' | 'giant-bear' | 'actuary-man'
  | 'puffin' | 'vascular-man' | 'skeletor';

type ProjectileType =
  | 'bubble' | 'mallet' | 'crate' | 'pie' | 'glass-shard' | 'padel-ball' | 'golf-ball'
  | 'dark-magic' | 'coat' | 'football' | 'beer';

interface PlatformData { x: number; y: number; width: number; height: number; }
interface PlayerData   { number: number /* 1–11 */; x: number; y: number; }
interface EnemyData {
  type: EnemyType; x: number; y: number;
  patrolLeft?: number; patrolRight?: number;
  posA?: { x: number; y: number }; posB?: { x: number; y: number };
}
interface LevelData {
  club: number;                 // 1800 | 2000 | 2100 | 2200
  bgPrimary: number; bgSecondary: number; accentColor: number;  // 0xRRGGBB
  platforms: PlatformData[];
  players: PlayerData[];        // exactly 11 entries, numbered 1..11
  enemies: EnemyData[];
  playerStart: { x: number; y: number };
}
```

All 4 levels use `playerStart: { x: 80, y: 390 }` and an 800×450 canvas. Platforms are
rectangles rendered as `Graphics.fillRect` (body color + top glow strip in `accentColor` +
bottom shadow strip) and backed by an invisible `physics.add.staticImage` whose static body
is resized/repositioned to exactly match the rectangle (`body.setSize(w,h)` +
`body.reset(cx, cy)`).

### 8.1 Level 1 — Club 1800, "No Rules. No Light. No Tomorrow."

`bgPrimary 0x0d0507, accentColor 0xcc1122`. Gritty dive bar, dark red neon.

Platforms:
| x | y | w | h | role |
|---|---|---|---|---|
| 0 | 430 | 800 | 20 | bar floor (full width) |
| 80 | 362 | 70 | 12 | bar stool 1 |
| 230 | 362 | 70 | 12 | bar stool 2 |
| 480 | 295 | 280 | 12 | bar counter (right) |
| 60 | 210 | 150 | 12 | high shelf (left) |
| 540 | 210 | 210 | 12 | back shelf (right) |
| 275 | 128 | 260 | 12 | top shelf (centre) |

Shirts (11): `1:(180,415) 2:(560,415) 3:(100,347) 4:(245,347) 5:(520,280) 6:(700,280)
7:(90,195) 8:(175,195) 9:(580,195) 10:(330,113) 11:(460,113)`

Enemies: one `bubble-blower` at `(400, 406)`, `patrolLeft: 150, patrolRight: 650`.

### 8.2 Level 2 — Club 2000, "VIP Only. Hard Techno. Harder You."

`bgPrimary 0x0a0005, accentColor 0xff1a44`. Neon nightclub, purple/pink.

Platforms:
| x | y | w | h | role |
|---|---|---|---|---|
| 0 | 430 | 800 | 20 | dance floor |
| 0 | 378 | 110 | 12 | speaker box (left) |
| 690 | 378 | 110 | 12 | speaker box (right) |
| 255 | 280 | 290 | 12 | stage |
| 45 | 272 | 155 | 12 | mid-left |
| 600 | 272 | 155 | 12 | mid-right |
| 65 | 208 | 160 | 12 | VIP balcony left |
| 575 | 208 | 160 | 12 | VIP balcony right |
| 285 | 158 | 230 | 12 | VIP centre |
| 315 | 85 | 170 | 12 | top booth |

Shirts (11): `1:(180,415) 2:(580,415) 3:(50,362) 4:(730,362) 5:(320,264) 6:(450,264)
7:(85,255) 8:(640,255) 9:(360,143) 10:(355,68) 11:(445,68)`

Enemies:
- `flanker` at `(380,404)`, `patrolLeft:120, patrolRight:680`
- `rushy` at `(400,110)` (floats — `x`/`y` here are the figure-8 base position)
- `smaller-bear` at `(120,193)`, `posA:(120,193)` (VIP balcony left), `posB:(640,193)`
  (VIP balcony right)

### 8.3 Level 3 — Club 2100, "Mid-tier prestige. Earned, not given."

`bgPrimary 0x0d0a04, accentColor 0xff7700`. Industrial neon orange, multi-platform.

Platforms:
| x | y | w | h | role |
|---|---|---|---|---|
| 0 | 430 | 800 | 20 | ground |
| 35 | 372 | 120 | 12 | low-left flank |
| 645 | 372 | 120 | 12 | low-right flank |
| 75 | 302 | 140 | 12 | mid-left |
| 325 | 292 | 160 | 12 | mid-centre |
| 575 | 302 | 140 | 12 | mid-right |
| 150 | 232 | 140 | 12 | upper-left |
| 505 | 232 | 140 | 12 | upper-right |
| 55 | 152 | 120 | 12 | high-left flank |
| 625 | 152 | 120 | 12 | high-right flank |
| 260 | 80 | 280 | 12 | top |

Shirts (11): `1:(130,415) 2:(450,415) 3:(65,357) 4:(95,357) 5:(680,357) 6:(145,286)
7:(620,286) 8:(185,216) 9:(560,216) 10:(390,64) 11:(450,64)`

Enemies:
- `clippy` at `(300,407)`, `patrolLeft:155, patrolRight:645`
- `melonhead` at `(400,50)` (spawn point only — it immediately begins hopping a fixed
  12-node platform circuit, see §10)
- `butter-fingers` at `(115,124)`, `posA:(115,124)` (high-left), `posB:(685,124)`
  (high-right)
- `padel-punisher` at `(685,279)` (standing on the mid-right platform, top at y=302)

### 8.4 Level 4 — Club 2200, "Only the gods qualify."

`bgPrimary 0x08080f, accentColor 0xf0c040`. Greek marble temple, gold/white, Skeletor's
throne.

Platforms:
| x | y | w | h | role |
|---|---|---|---|---|
| 0 | 430 | 800 | 20 | marble ground |
| 30 | 330 | 80 | 12 | column base left |
| 690 | 330 | 80 | 12 | column base right |
| 100 | 202 | 130 | 12 | upper-left |
| 570 | 202 | 130 | 12 | upper-right |
| 300 | 350 | 200 | 12 | middle platform (below column bases) |
| 148 | 142 | 140 | 12 | high-left |
| 512 | 142 | 140 | 12 | high-right |
| 308 | 112 | 184 | 12 | high-centre |
| 318 | 55 | 164 | 12 | Skeletor's throne |

Shirts (11): `1:(200,415) 2:(560,415) 3:(55,314) 4:(755,314) 5:(635,186) 6:(218,126)
7:(582,126) 8:(130,186) 9:(360,334) 10:(360,95) 11:(466,39)`

Enemies:
- `giant-bear` at `(360,316)`, `patrolLeft:316, patrolRight:484` (patrols the middle
  platform)
- `condor` at `(400,110)` — figure-8 base position, flies **above** actuary-man (y≈185)
  and vascular-man (y≈246)
- `actuary-man` at `(200,185)` (cruise altitude), `posA:(0,407)` (ground landing y=407),
  `patrolLeft:160, patrolRight:640`
- `puffin` at `(700,307)` (standing on right column base, drives golf balls leftward)
- `vascular-man` at `(165,246)`, `posA:(165,246)` (under upper-left), `posB:(635,246)`
  (under upper-right)
- `skeletor` at `(400,32)` (on the throne)

---

## 9. Collectibles & Scoring

File: `src/objects/Collectible.ts`, scoring logic in `GameScene`.

- Each level spawns exactly 11 `Collectible` sprites (texture `player-{number}`, a static
  Arcade body, depth 5), one per numbered shirt, at the coordinates in §8.
- `pickupsLeft` starts at 11 (12–15 added by Bench Boost, see §10.2); level completes when
  it reaches 0.
- **Sequence tracking:** `nextExpected` starts at 1. The collectible matching `nextExpected`
  has a persistent pulse tween (`startPulse()`: tint `0xffee44`, alpha oscillates
  1↔0.45 every 320ms, `Quad.easeInOut`, infinite yoyo) so the player always has a visible
  "next" hint.
- **Scoring on pickup:**
  - Base: `SCORE_PER_PICK = 100`.
  - If `sequenceActive` and the collected number **equals** `nextExpected`: add
    `ORDER_BONUS = 50` (total 150 before multiplier), increment `nextExpected`, start the
    pulse on the new `nextExpected` target (if it still exists).
  - If `sequenceActive` and the collected number does **not** equal `nextExpected`: this is
    the first out-of-order pickup. `sequenceActive` is permanently set `false` for the rest
    of the level (no more order bonuses can ever be earned this level, even if the player
    luckily hits the "right" number again later), and the pulse on the (now-moot)
    `nextExpected` target is stopped.
  - Final awarded points = `(base [+ bonus]) * scoreMult` (see Triple Captain, §10.1).
  - A floating text (`+N` or `+N IN ORDER!`, yellow if bonus applied else pale green)
    spawns at the pickup location and tweens upward 30px while fading over 900ms.
- When `pickupsLeft <= 0`: after a 700ms delay, transition to `LevelCompleteScene` with the
  current score/lives and either the next `levelIndex` or `-1` if this was level 4 (index
  3, the last).

---

## 10. Coins — FPL Chips

GameScene fields: `coinTimer`, `COIN_INTERVAL = 10000` (ms), `droppedCoinTypes` (a `Set`
tracking which of the 4 types have already appeared **this level** — each type can drop at
most once per level), `scoreMult` (starts at 1).

- Every 10 seconds of gameplay (`coinTimer` accumulates `delta`, resets to 0 on trigger),
  roll: if there is at least one coin type not yet dropped this level, AND no coin is
  currently on screen (`coinList.length === 0`), AND `Math.random() < 0.5` → spawn one
  random not-yet-dropped type.
- Spawned at `x ∈ [60,640]`, `y = -30` (above the canvas), velocity `(rand[30,70], 80)`,
  gravity on, bounce 0.5, and manually bounced off all 4 world edges every frame in
  `GameScene.update()` (not `setCollideWorldBounds`, because it spawns above y=0).
- A flash text names the chip at the top of the screen, fades over 2s with a 1.2s delay.
- Player overlap destroys the coin and applies its effect:

| Code | Name | Effect |
|---|---|---|
| `tc` | Triple Captain | `scoreMult = 3` for the remainder of the level (affects all future pickup scoring) |
| `bb` | Bench Boost | Spawns 4 new shirts, numbered 12–15, on random **thin platforms** (`height < 20`, i.e. not the ground) at a random x within that platform and y = platform-top − 18; increments `pickupsLeft` by 4 |
| `ww` | Wildcard | Restores **every currently missing** numbered shirt (1–15, whatever was ever spawned) to its **original recorded position**, increments `pickupsLeft` accordingly, and **resets the sequence**: `nextExpected = 1`, `sequenceActive = true`, restarts the pulse on shirt 1 |
| `fh` | Free Hit | `lives += 1` |

Each effect shows a second, larger centred flash message naming the effect (e.g. "x3 SCORE
ACTIVATED!", "BENCH BOOST! +4 SHIRTS").

### 10.1 Score multiplier interaction

`scoreMult` is applied multiplicatively to `(base + orderBonus)` on every subsequent pickup
in the level, including Bench Boost shirts and Wildcard-restored shirts. It does not decay
— once Triple Captain is picked up, every remaining pickup that level is worth 3× until the
level ends (it resets to 1 on `create()` for the next level).

### 10.2 Bench Boost platform selection

`LEVELS[levelIndex].platforms.filter(p => p.height < 20)` — i.e. every platform except the
full-width ground strip (which is always `height: 20`). One such platform is picked at
random **independently for each of the 4 new shirts** (duplicates allowed — two new shirts
can land on the same platform).

---

## 11. Eels (Environmental Hazard)

- Disabled entirely on level 4 (`levelIndex < 3` guard in `GameScene.update()`).
- Every 5.5 seconds (`eelTimer >= 5500`), spawn one eel at `x ∈ [520,660]`, `y ∈ [-20,40]`
  (above the canvas, drifting down), 3-frame looping texture (`enemy-eel-1/2/3`, 150ms per
  frame), gravity on, constant leftward velocity `vx = -60` re-applied every frame.
- First eel after 2000ms post-level-start (set directly in `create()`, not via the 5500ms
  timer, so the very first spawn is earlier than steady-state cadence).
- Destroyed on contact with the player (counts as a hit — see §14) or when it exits the
  world (`x < -80 || y > 520`).
- Not attached to any platform collider logic beyond the generic
  `physics.add.collider(eelsGroup, platforms)` — it will land and keep drifting left along
  a platform surface if it lands on one before exiting.
- On player hit (any cause), **all live eels are destroyed** and the eel spawn timer is
  reset to 2000ms (same "grace period" as a fresh level start).

---

## 12. Art

### 12.1 Loaded JPEG assets (`public/art/`, loaded in `BootScene.preload()`)

| Texture key | File |
|---|---|
| `art-heroes` | HeroesAndVillains.jpeg (menu poster) |
| `art-club1800` | Club1800c.jpeg |
| `art-club1900` | Club1900.jpeg *(used only as the level-2 intro-screen backdrop, see §5/LevelIntroScene — note the off-by-one club-name vs art-file naming)* |
| `art-club2000` | Club2000.jpeg |
| `art-club2100` | Club2100.jpeg |
| `art-club2200` | Club2200.jpeg |
| `art-bubble-blower` | BubbleBlower.jpeg |
| `art-flanker` | TheFlanker.jpeg |
| `art-rushy` | Rushy.jpeg |
| `art-smaller-bear` | SmallerBear.jpeg |
| `art-melonhead` | melonhead.jpeg |
| `art-clippy` | CLippy.jpeg |
| `art-butter-fingers` | ButterFingers.jpeg |
| `art-padel-punisher` | PadelPunisher.jpeg |
| `art-giant-bear` | GiantBear.jpeg |
| `art-condor` | Condor.jpeg |
| `art-actuary-man` | ActuaryMan.jpeg |
| `art-puffin` | ThePuffin.jpeg |
| `art-vascular-man` | VascularMan.jpeg |
| `art-skeletor` | Skeletor.jpeg |

Used as: (a) full-bleed, scaled-to-cover, alpha-tinted backgrounds in `GameScene`
(`art-club{1800,2000,2100,2200}`, keyed off `levelIndex`, see §13.2 for the exact
alpha/vignette treatment) and `LevelIntroScene` (`art-club1800/1900/2100/2200` per level,
alpha 0.42 + 0.58 black overlay); (b) cropped portrait thumbnails in the `LevelIntroScene`
villain cards (top 42% of each source image, see §5.2 of `LevelIntroScene` layout logic);
(c) `art-heroes` as the full `MenuScene` backdrop.

### 12.2 Procedural sprite generation (`BootScene.generateTextures()`)

Every gameplay sprite — player, all enemies (every animation frame of every state), every
projectile, UI chrome like the crate-smash animation — is drawn with `Phaser.GameObjects.Graphics`
primitives and rasterized via `graphics.generateTexture(key, width, height)`. There is no
external pixel-art tool or spritesheet in the pipeline.

**Hard constraints discovered through building this (must hold for a rebuild):**
- `graphics.fillCircle(x, y, radius)` **works** in this Phaser version.
- `graphics.fillEllipse(...)` **does not render correctly** — avoid it entirely; approximate
  ellipses with scaled circles, multiple overlapping circles, or `fillRect` with rounded
  corners (`fillRoundedRect`) instead.
- Each distinct animation frame is its own named texture (no texture-atlas/frame-based
  sprite sheets); `sprite.setTexture(key)` is how frame-swapping is implemented everywhere
  in `Enemy.ts` and `Player.ts`.

**Texture size inventory (width×height px):**

| Group | Sizes | Frame keys (pattern) |
|---|---|---|
| Player | 40×50, all states | `player-idle`, `player-tap`, `player-land`, `player-crouch`, `player-run-1`…`player-run-8`, `player-jump`, `player-float`, `player-fall` |
| bubble-blower | 40×52 | `enemy-bubble-blower`, `-2`, `-blow` |
| flanker | 44×52 | `enemy-flanker`, `-2`, `-stamp`, `-stamp-2` |
| eel | 52×18 | `enemy-eel-1/2/3` |
| rushy | 36×48 | `enemy-rushy` |
| smaller-bear | 24×28 | `enemy-smaller-bear` |
| melonhead | W×H (see code; ~24×44 body region) | `enemy-melonhead`, `-walk-2`, `-jump`, `-float`, `-swing-1`, `-swing-2` |
| clippy | 40×50 | `enemy-clippy`, `enemy-clippy-2`…`-8`, `enemy-clippy-scratch-1..4` |
| butter-fingers | `BW`×`BH` (40×56 per SPEC history) | `enemy-butter-fingers`, `-walk-2`, `-throw-1..4`, `-jump`, `-roll-1..4`, `-pie-1..3` |
| padel-punisher | 40×50 | `enemy-padel-punisher`, `-wait-2`, `-windup-1..3`, `-strike`, `-follow-1..2` |
| condor | W×H | `enemy-condor-0`…`-11` (12-frame wing cycle; `enemy-condor-0` doubles as `enemy-condor` reset alias) |
| giant-bear | 48×72 | `enemy-giant-bear`, `-2/-3/-4` (walk), `-growl-1..4`, `-throw-1..4`, `-charge-1..4` |
| actuary-man | 50×26 (flying) / 40×50 (grounded) | `enemy-actuary-man`, `-fly-1..6`, `-land-1..4`, `-laptop-1..6`, `-takeoff-1..4` |
| puffin | W×H | `enemy-puffin-golfer`, `-wait-2`, `-windup-1..4`, `-impact`, `-follow-1..4` (override default `enemy-puffin` key with `enemy-puffin-golfer`) |
| vascular-man | — | `enemy-vascular-man`, `-hang-2`, `-flex-1/2`, `-pullup-1..4`, `-lower-1/2`, `-swing-1/2`, `-pike-1..4`, `-fly-1/2`, `-reach-1/2`, `-catch-1/2` |
| skeletor | 18×44 body | `enemy-skeletor`, `enemy-skeletor-cast-0..15` (16-frame cast cycle) |
| Projectiles | varies per type | `proj-bubble`, `proj-mallet`, `proj-crate`, `proj-crate-smash-1/2/3`, `proj-pie`, `proj-glass-shard`, `proj-padel-ball`, `proj-golf-ball`, `proj-dark-magic`, `proj-coat`, `proj-football`, `proj-beer` |
| Collectibles | 16×16-ish | `player-1`…`player-15` (11 base + 4 Bench-Boost extras) |
| Coins | — | `coin-tc`, `coin-bb`, `coin-ww`, `coin-fh` |

A rebuild does **not** need to reproduce every pixel of the art (that's a creative,
redrawable layer) — it must reproduce the **texture key naming convention**, **frame
counts/timings**, and **canvas sizes relative to hitboxes** listed in §13, since gameplay
logic (`setTexture` calls) and physics (`body.setSize`/`setOffset`) are both hard-wired to
these.

---

## 13. Enemy Reference

File: `src/objects/Enemy.ts`. All enemy AI is one `Enemy` class whose `update(delta,
playerX, playerY)` switches on `eType` into one of 14 behavior blocks. State is held in a
single mutable struct per instance (`State`): `clock`, `nextAction`, `direction`,
`isCharging`, `chargeTimer`, `atPosA`, `travelling`, `travelTimer`, `sineT`, `kickClock`,
`nextKick`, `kickDir` — these fields are heavily **repurposed** per enemy type (e.g.
`nextKick` holds a phase-ID enum for `butter-fingers`, `padel-punisher`, `puffin`,
`vascular-man`, `actuary-man`, `skeletor`, but a literal millisecond countdown for
`bubble-blower`/`clippy`'s projectile-fire gating). Any rebuild should keep each enemy's
state machine self-contained (e.g. a discriminated-union or per-type class) rather than
reusing one shared struct, unless byte-for-byte field compatibility is required.

**Floaters** (gravity disabled, `body.reset()` drives position manually every frame, so
Arcade collisions with platforms never apply): `rushy`, `condor`, `actuary-man`,
`vascular-man`, `skeletor`.
**Ground walkers** (gravity on, collide with platforms normally): everyone else.

`resetEnemy()` — called on every player death/respawn — snaps the enemy back to its spawn
data, resets its state machine to initial values, and re-establishes its initial velocity
(ground patrollers) or position (floaters/manual movers). Each enemy type with nontrivial
phase state has its own branch in `resetEnemy()` (see code) rather than one generic reset.

`kickStart()` — called once right after the enemy is added to the physics group (because
`group.add()` wipes the body's velocity) — re-applies the initial patrol velocity for
ground-walking types that have one.

### 13.1 bubble-blower (Level 1)

- Ground patrol, velocity fixed at 0 via explicit `setVelocityX(0)` every frame — **this
  enemy does not actually patrol despite having `patrolLeft`/`patrolRight` data**; it is
  stationary and only animates/fires in place. (`SPEEDS['bubble-blower'] = 0`.)
- Every 4–8s (`nextKick`, re-rolled each time): kicks a football — `spawn(x ± 18, y,
  'football', vx=±340 alternating, vy=0)`. Direction (`kickDir`) flips each kick.
- Every 14–20s (`nextAction`): blows 3 bubbles in a fan — angles −170°/−90°/−10° each
  jittered ±6°, speed 120–150 px/s, spawned at `x + (i-1)*14, y-14`.
- Animation priority: blow-charge (900ms after triggering the bubble fan) > kick-travel
  (450ms after a football kick, shows a "keepup" frame matching kick direction) > idle
  2-frame keepup loop (380ms/frame).

### 13.2 flanker (Level 2)

- 3-phase cycle, patrol speed 110 px/s:
  1. **Patrol** (`patrolBounce` between `patrolLeft`/`patrolRight`, default 50/750):
     2-frame walk loop (260ms/frame). Every 3–5.5s → phase 2.
  2. **Stamp** (`travelling=true`): velocity zeroed, 2-frame sumo-stamp loop (300ms/frame)
     for 1500ms, then flips `atPosA` and derives `direction` from it, enters phase 3.
  3. **Charge** (`isCharging=true`): velocity set to `±560` (note: far above the 110 patrol
     speed) for 550ms, 2-frame run loop (130ms/frame), then back to patrol at normal speed.
- No projectiles; the charge itself is the threat (high speed, no warning beyond the stamp
  animation).

### 13.3 rushy (Level 2)

- Pure floater, no gravity, `body.reset()` every frame.
- Path: `x = 400 + cos(t*0.7)*200`, `y = baseY + sin(t)*25`, where `t` accumulates at
  `delta * 0.0004` per ms (i.e. a slow, continuous figure-8/weave). `baseY` = the level
  data's spawn `y`.
- No projectiles — contact-only threat.

### 13.4 smaller-bear (Level 2)

- 3-phase idle↔travel↔wear cycle between `posA`/`posB`:
  1. **Idle**: waits 3–5s, then throws a decorative `coat` sprite (`proj-coat`, an `Image`,
     not a `Projectile` — no hitbox) on a 900ms manual parabolic flight toward the
     destination platform (arc height 140px, one full 360° spin over the flight), spawns a
     "GRAAARR!" floating text, and begins its own jump.
  2. **Travelling** (2000ms total: 800ms pre-jump pause, then 1200ms lerp-with-arc to the
     target platform, arc height 80px).
  3. **Wearing** (1500ms): coat snaps onto the bear's position; bear does nothing else.
- No projectiles from the bear itself; the coat has no hitbox (visual only) — only the
  bear's body is a threat.

### 13.5 melonhead (Level 3)

- Floater (manual `body.reset()`), but conceptually a "hopper" across a **fixed 12-node
  platform circuit** hardcoded in the enemy class (not derived from level data):

  ```
  0 ground-left(200,400) 1 low-left(95,342) 2 mid-left(145,272) 3 upper-left(220,202)
  4 high-left(115,122)   5 top(400,50)      6 high-right(685,122) 7 upper-right(575,202)
  8 mid-right(645,272)   9 mid-center(405,262) 10 low-right(705,342) 11 ground-right(600,400)
  ```
  Spawns settled on node 5 (top). Cycles nodes in index order, wrapping 11→0.
- 3-phase loop:
  1. **Settle** (idle on current node, 700–1300ms, 2-frame walk-bob loop 380ms/frame), then
     advance `kickDir` to `(kickDir+1) % 12` and begin flight to that node.
  2. **In-flight** (750ms lerp with a parabolic arc whose height is
     `max(55, |Δy|*0.4 + 40)`; first half of flight shows a "jump" texture, second half a
     "float" texture).
  3. **Swing** (on arrival, 400ms): faces the player (`swDir = playerX < x ? -1 : 1`),
     2-frame mallet-swing animation (200ms each) — **this is purely cosmetic; no `mallet`
     projectile is actually spawned by melonhead** (unlike the SPEC's older description —
     verify against code: melonhead's swing never calls `this.spawn(...)`; it's a
     contact-range visual threat only, synced to the player's position at swing-start).
- Patrol bounds (`patrolLeft`/`patrolRight` on `EnemyData`) are **not used** by this
  enemy's current implementation (the circuit is hardcoded) — any `EnemyData` values set
  for melonhead in level files are inert.

### 13.6 clippy (Level 3)

- Ground patrol at 22 px/s (`SPEEDS['clippy'] = 22`) between `patrolLeft`/`patrolRight`
  (default 50/750). At each bound: stop (`isCharging=true`), 1400ms "scratch" animation
  (4-frame loop, 200ms/frame, `enemy-clippy-scratch-1..4`), then resume at normal speed in
  the reversed direction. While walking: 8-frame cycle (200ms/frame,
  `enemy-clippy`/`enemy-clippy-2..8`).
- **No projectiles** in the current implementation — purely a patrol/turn-pause contact
  threat (older SPEC text describing a `mallet`-firing Clippy is stale).

### 13.7 butter-fingers (Level 3) — 10-phase state machine

Gravity off throughout; all movement via `body.reset()`. Phases (IDs stored in
`st.nextKick`):

| ID | Phase | Duration | Behavior |
|---|---|---|---|
| 0 | IDLE | 1.5–2.5s (random) | 2-frame bob loop (700ms/frame); on timeout, increments `kickClock` and checks `kickClock % 3 === 0` |
| — | — | — | If that check is true → go straight to **TRAVELLING** (pie cycle: jump first, pies after landing). Else → **THROW_LIFT**. |
| 1 | THROW_LIFT | 300ms | spawns `crate` at `(x, y+55)`, `vx = rand(-25,25)`, `vy = 50` |
| 2 | THROW_HOLD | 250ms | — |
| 3 | THROW_RELEASE | 200ms | — |
| 4 | THROW_FOLLOW | 250ms | → TRAVELLING |
| 6 | TRAVELLING | 900ms | lerp-with-arc (height 40px) to the opposite `posA`/`posB`; flips `atPosA` on arrival |
| 5 | ROLLING | 560ms | slides 60 px/s in the direction it just arrived from (toward the platform's outer edge), 4-frame roll loop (140ms/frame) |
| 7 | PIE_WIND | 320ms | spawns **2** `pie` projectiles horizontally (`vx = ±200`, one at `y`, one at `y-10`); flips `kickDir` for next pie cycle |
| 8 | PIE_THROW | 180ms | — |
| 9 | PIE_FOLLOW | 280ms | → IDLE |

- **Cadence:** `kickClock` increments once per IDLE→action transition; `kickClock % 3 ===
  0` triggers the pie branch. Net pattern over time: **crate, crate, PIE, crate, crate,
  PIE, …** (every 3rd action-cycle is a pie cycle instead of a crate-throw cycle), and a
  pie cycle *always* travels first, then throws pies after landing+rolling — it never
  throws a crate in the same cycle as pies.
- Pie throw direction (`kickDir`) alternates ±1 between successive pie cycles.
- Faces centre: flips sprite X so it always looks toward the middle of the arena
  (`!atPosA` when at posA, i.e. facing right; inverse at posB).

### 13.8 padel-punisher (Level 3)

- Fully static (`body.reset(eData.x, eData.y)` every frame — never actually moves from its
  spawn point even though it has an Arcade body).
- 3-phase loop:
  1. **WAIT**: 2-frame idle loop (550ms/frame); exits the moment the ball it last served
     (`padelBall`) is gone (destroyed or expired) — see Projectile §14 for the ball's own
     2000ms lifespan + bounce rules.
  2. **WINDUP** (600ms, 4 frames at 150ms each: windup-1/2/3/strike): on completion, serves
     one `padel-ball`. Serve angle sweeps through a fixed 8-step sequence
     (`20°,40°,…,160°` from the +X axis, measured as `cos(angle)*speed, -sin(angle)*speed`
     — i.e. always upward, sweeping from steep-right to steep-left across 8 consecutive
     serves before repeating), speed randomized 520–680 px/s. Ball spawned at
     `(x-14, y-22)`.
  3. **FOLLOW** (400ms, 2 frames at 200ms each) → back to WAIT.
- First serve happens immediately on spawn (`nextKick` initialized to WINDUP, not WAIT).

### 13.9 giant-bear (Level 4)

- 3-phase loop, very slow patrol (8 px/s — note: far slower than old-SPEC's "50 px/s") on
  the middle platform between `patrolLeft`/`patrolRight` (default 90/540; level 4 uses
  316/484):
  1. **Patrol**: velocity re-asserted to `±8` every frame based on which bound was hit
     (not using the shared `patrolBounce` helper); 4-frame walk loop (160ms/frame). First
     charge delayed 15–20s after spawn; subsequent intervals 2.5–5s.
  2. **Growl** (1400ms, `travelling=true`): velocity zeroed, 4-frame growl loop (350ms/
     frame, scaled over elapsed time) as a telegraph before throwing.
  3. **Throw** (`atPosA=true`, 1200ms): velocity zeroed, faces throw direction
     (`kickDir`), 4-frame throw loop (300ms/frame scaled over elapsed time); at the
     **600ms mark** (release window, gated by a one-shot `sineT` flag) spawns a `beer`
     projectile 30px to the side it's facing, `vx = 250 * kickDir`. On completion, flips
     `atPosA=false` and `kickDir *= -1`, returns to patrol with a fresh 2.5–5s delay.
- `giant-bear-charge-1..4` textures exist in the generated set but are **not referenced**
  by the current `update()` switch — a literal "charge" dash (as described in the old
  SPEC) is not implemented; the throw/growl/patrol cycle above is the actual behavior.
  Treat the charge textures as available-but-unused when rebuilding, unless restoring that
  behavior is in scope.

### 13.10 condor (Level 4)

- Pure floater. Path: `x = 400 + cos(t*0.6)*330`, `y = baseY + sin(t)*55`, `t` accumulates
  at `delta * 0.0016`/ms (wider, slower figure-8 than rushy). 12-frame wing-flap loop, 65ms
  per frame (~1.3 flaps/sec, `enemy-condor-0..11`). Faces direction of horizontal travel
  (`setFlipX(sin(t*0.6) > 0)`).
- Hitbox is deliberately smaller than the sprite (18×36, offset 31,8) — only the body
  counts, not the wingspan.
- No projectiles — contact-only.

### 13.11 actuary-man (Level 4)

- 4-phase cycle, alternating between flying at cruise altitude and landing to "work":
  1. **FLY**: horizontal cruise at 140 px/s toward `direction`, fixed at `y = eData.y`
     (cruise altitude), 6-frame "superman" loop (120ms/frame). On reaching `patrolLeft` or
     `patrolRight` (default 80/720) while heading that way → **LAND**.
  2. **LAND** (700ms): `y` eases `Cubic.In` from cruise altitude down to `posA.y` (ground
     landing y, e.g. 407); 4-frame landing animation (175ms/frame).
  3. **LAPTOP** (2400ms): stays grounded, 6-frame "typing" loop (400ms/frame) — the comic
     beat of an actuary stopping mid-flight to do paperwork.
  4. **TAKEOFF** (700ms): flips `direction`, `y` eases `Cubic.Out` back up to cruise
     altitude; 4-frame takeoff animation (175ms/frame) → back to FLY.
- Hitbox swaps between flying (30×14, offset 10,6) and grounded (24×44, offset 8,4)
  per-phase.
- No projectiles — contact-only, but the ground phases make it briefly a "platform-level"
  threat rather than purely an airborne one.

### 13.12 puffin (Level 4)

- Fully static (`body.reset(eData.x, eData.y)` every frame).
- Mirrors `padel-punisher`'s structure but aims leftward and shows a "RIP!!!" floating
  text on each drive:
  1. **IDLE**: 2-frame waggle loop (550ms/frame), exits when its last `golf-ball` is
     gone.
  2. **WINDUP** (1000ms, 5 frames at 200ms each: windup-1..4, impact): fires one
     `golf-ball` at completion. Elevation sweeps `10°,20°,…,80°` across 8 consecutive
     drives (`kickDir` 0–7, repeating), speed randomized 290–360 px/s, direction always
     leftward (`-cos(angle)*speed, -sin(angle)*speed`). Spawned at `(x-16, y-22)`. Spawns a
     "RIP!!!" text that floats up 35px over 900ms.
  3. **FOLLOW** (600ms, 5 frames at 120ms each) → back to IDLE.
- First drive happens immediately on spawn (`nextKick` initialized to WINDUP).
- Overrides its default texture key to `enemy-puffin-golfer` (not `enemy-puffin`) at
  construction.

### 13.13 vascular-man (Level 4)

- 3-phase shuttle between `posA`/`posB` ("hangs and swings between platforms"):
  1. **PULLUP** (at rest at current position): 10-frame pull-up-themed idle loop (200ms/
     frame: hang→flex×2→pullup×4→lower×2), looping for a random **2–4 full reps** of the
     whole 10-frame cycle (`reps = floor(kickClock / (200*10))`) before advancing. Flips
     `atPosA` and derives travel `direction` at the end.
  2. **SWING** (1400ms travel): position lerps with a combined sine-arc (`-sin(t*π)*40`)
     plus linear y-interpolation toward the target, producing an under-slung swinging
     arc. Texture advances through a precise 10-stage lookup by travel progress `t`
     (swing-1/2 → pike-1..4 → fly-1/2 → reach-1/2).
  3. **ARRIVE** (450ms): 2-frame "catch" loop (by elapsed-progress, not fixed frame time)
     → back to PULLUP with a fresh random 2–4 rep count.
- No projectiles — contact-only; threat profile is "appears/disappears under a platform
  on an unpredictable swing timing."

### 13.14 skeletor (Level 4)

- Fully static (`body.reset(eData.x, eData.y)` every frame), stands on the throne.
- 2-phase loop:
  1. **IDLE**: static texture, 2000ms wait (`nextAction` fixed at 2000, not randomized)
     before casting.
  2. **CAST** (1280ms total): 16-frame cast animation (80ms/frame, `enemy-skeletor-cast-
     0..15`). At the moment the frame index first reaches **4** (320ms into the cast — the
     visual "release" point), fires exactly one `dark-magic` projectile aimed directly at
     the player's current position (`(dx/len)*240, (dy/len)*240`, normalized direction ×
     240 px/s), spawned at `(x, y+10)`. A one-shot guard (`isCharging`) ensures only one
     projectile fires per cast even though the frame condition (`frame >= 4`) stays true
     for the rest of the cast.
- Hitbox 18×44, offset 6,3 — slimmer than most ground enemies.

---

## 14. Projectile Reference

File: `src/objects/Projectile.ts`. All projectiles are one `Projectile` class
(`texture = proj-{type}`), added to a shared `projectilesGroup` and tracked in a parallel
`projectileList` array (the array is iterated every frame in `GameScene.update()` to call
each projectile's own `update(delta)` and cull it from the list once `!active`).

**Governing gotcha — re-asserted every rebuild must replicate:** `Phaser.Physics.Arcade`'s
`group.add(obj)` call **resets the object's physics body**, silently wiping any velocity,
gravity, or bounce flags set in the object's own constructor. The fix used throughout this
codebase is twofold:
1. `GameScene`'s `spawnFn` (the only way any code creates a projectile) **re-applies**
   `body.setVelocity(vx, vy)` immediately after `group.add(proj)`, plus re-applies
   `allowGravity`/bounce/`collideWorldBounds` for `padel-ball`/`golf-ball`/`dark-magic`.
2. Several projectile types (`football`, `pie`, `beer`) **store their intended velocity in
   an instance field** (`footballVX`, `pieVX`, `beerVX`) and **re-assert the full velocity
   vector every single frame** inside their own `update(delta)`, because a one-time
   post-`add()` fix isn't enough for types that must maintain a *constant* zero-gravity
   velocity indefinitely (any later re-add or body reset elsewhere would otherwise silently
   zero them again).

| Type | Gravity | Lifespan / exit rule | Notes |
|---|---|---|---|
| `bubble` | off | exits only through top (`y < -60`) | Sine-wave horizontal drift (`freq` 0.3–0.7, `amp` 80–160 px, random phase per bubble); vertical speed decays toward a slow −25 px/s "float up" each frame; bounces (phase-flips) off left/right/bottom world edges |
| `mallet` | on (natural) | bounces top/bottom, exits left/right (`x<-60 or x>860`) | simple ballistic arc; **not currently spawned by any enemy** in the present code (clippy/melonhead no longer fire it — see §13.6/13.5) |
| `crate` | reduced (`setGravityY(-520)` → effective ~80 of the world's 600) | destroyed on platform contact (see §15) or exits any edge (±60/±520 margins) | spawned only by butter-fingers |
| `pie` | off | exits any edge | `pieVX` re-asserted every frame (see gotcha above); spawned in pairs by butter-fingers |
| `glass-shard` | on (full) | self-destructs after 1600ms (`glassLifespan`) regardless of position, or on edge exit | only created by the crate-smash system (§15), never by `spawnFn` directly from an enemy |
| `padel-ball` | off, but bounces (`setBounce(1,1)`, `setCollideWorldBounds(true)`) | 2000ms lifespan (`glassLifespan` field reused for timing), then destroys on its *next* platform/world-bound contact after expiry; also force-destroyed if it strays far out of bounds (±30/±490 margins) | spawned only by padel-punisher |
| `golf-ball` | off, bounces, world-bound-collides | identical lifecycle rule to `padel-ball` | spawned only by puffin |
| `dark-magic` | off | exits any edge | aimed at player at spawn time, then flies in a straight line (no homing) |
| `coat` | — (not a `Projectile` subclass at all — a plain `Image`) | removed manually by smaller-bear's own logic | decorative only, never has a hitbox, never goes through `spawnFn` |
| `football` | off | bounces top/bottom, exits left/right | `footballVX` re-asserted every frame; spawned only by bubble-blower |
| `beer` | off | exits any edge | `beerVX` re-asserted every frame; spawned only by giant-bear |

All projectile types that reach the player via the `physics.add.overlap(player,
projectilesGroup, …)` handler are destroyed on contact and count as one hit (§16),
**except** `coat` (never added to `projectilesGroup` — no hitbox) and anything already
inactive/destroyed before the overlap resolves.

---

## 15. Crate Smash System

When a `crate` projectile's body collides with the `platforms` static group:

1. A dedicated `physics.add.collider(projectilesGroup, platforms, callback,
   processCallback)` fires. The `processCallback` restricts the actual collision response
   (and therefore this whole system) to `projType === 'crate'` — every other projectile
   type passes through platforms unobstructed (they have their own, separate
   `padel-ball`/`golf-ball` collider with a different `processCallback`, or no platform
   collider at all).
2. The crate is destroyed at its impact `(x, y)`.
3. `createCrateSmash(x, y)`:
   - Plays a 3-frame smash animation at that position (`proj-crate-smash-1/2/3`, 240ms per
     frame, then destroys the image).
   - Spawns **3** `glass-shard` projectiles at `(x, y-20)`, each with
     `vx = rand(-340,340)`, `vy = -rand(260,460)` (always upward — note the explicit
     negation; this is the one case where a "random" vy is forced negative rather than
     sampled from a signed range).
4. Glass shards hurt the player on contact (standard projectile-overlap handling) and
   self-destruct after 1600ms regardless of whether they've hit anything.

**Positioning constraint that must be preserved:** a crate's spawn point must clear the
platform the throwing enemy is standing on, or it will immediately re-collide and smash at
spawn. Butter-fingers (standing at `y=124` on a 12px-tall platform whose top is at `y=152`,
i.e. platform body spans `y∈[152,164]`) spawns crates at `y+55 = 179`, whose body
(crate texture height ~unknown exact px, but top edge clears 164) sits below the platform's
bottom edge — this is why the offset is `+55` and not something smaller.

---

## 16. Hit Detection & Lives

GameScene fields: `lives` (starts at `MAX_LIVES = 3`, carried between levels via scene
data), `isInvincible`, `isRespawning`, `godMode`.

- **Sources of a "hit":** player ↔ enemy overlap; player ↔ any projectile in
  `projectilesGroup` overlap (projectile is destroyed); player ↔ eel overlap (eel is
  destroyed and removed from `eelList`).
- `hitPlayer()`:
  - No-ops entirely if `godMode || isInvincible || isRespawning`.
  - Otherwise: `lives--`, immediately sets `isRespawning = true` (this is what actually
    blocks further hits during the respawn sequence, *before* `isInvincible` is even set),
    updates the HUD.
  - **If `lives <= 0`:** after a 400ms delay, transitions to `GameOverScene` with the
    current score. (The player sprite is not reset/respawned in this branch — the scene
    ends.)
  - **Otherwise:**
    - Sets `isInvincible = true`.
    - **Resets every enemy** to its spawn state (`resetEnemy()` on all) — the whole level's
      enemy layout snaps back, not just whichever enemy caused the hit.
    - Destroys every in-flight projectile and clears `projectileList`.
    - Destroys every live eel, clears `eelList`, resets `eelTimer = 2000` (same grace
      period as level start).
    - Flashes the player sprite (alpha 1↔0 over 110ms, yoyo, repeat 6× ≈ 1.5s) as a visual
      cue, running concurrently with a fixed 1200ms `RESPAWN_DELAY` timer.
    - After `RESPAWN_DELAY` (1200ms): stop the flash tween, force player alpha to 1, call
      `player.resetPosition(levelStart.x, levelStart.y)`, clear `isRespawning`.
    - A **further** 1500ms after that (so ~2700ms total post-hit): clear `isInvincible`.
      This means the player is briefly invincible-and-controllable for 1.5s right after
      respawning, before hits can register again.
- `godMode` (toggled by dev key `5`) makes `hitPlayer()` a complete no-op — no life lost, no
  reset of enemies/projectiles/eels, nothing. HUD shows `LIVES: ∞` while active.

---

## 17. HUD & Pause

- Top-left, stacked, monospace 15px white-with-black-stroke text, all `setScrollFactor(0)`
  and depth 20 (always on top, fixed to camera):
  - Line 1: `SCORE: {score}` (+ ` x{scoreMult}` suffix if `scoreMult > 1`).
  - Line 2: `LIVES: {'♥ '.repeat(lives).trim()}` or `LIVES: ∞` if `godMode`.
  - Line 3: `SQUAD: {pickupsLeft} left`.
- Top-right: `CLUB {club}` in the level's `accentColor` (converted to a `#rrggbb` CSS
  string).
- **Pause** (`P`/`Escape` key, or an always-visible top-right pause-icon button, or tapping
  the pause overlay itself to resume):
  - `physics.pause()` / `physics.resume()` — freezes/unfreezes all Arcade physics
    simulation (enemies, projectiles, coins, eels, player all stop moving).
  - A semi-opaque full-screen rectangle (`0x000000`, alpha 0.65) becomes visible and
    interactive (click/tap anywhere on it resumes).
  - "PAUSED" (34px) + "tap anywhere / press P to resume" (12px, grey) centred text appear.
  - The pause-toggle button itself (two simple vertical bars drawn with `Graphics`, in a
    rounded dark pill) is always rendered at the top-right, independent of pause state.
  - **Note:** `GameScene.update()` returns immediately if `isPaused` (or
    `isRespawning`) — input, coin/eel timers, enemy AI, and projectile updates **all**
    freeze; only the dev-level-request check at the very top of `update()` still runs
    regardless of pause state.

---

## 18. Scene-by-Scene UI Reference

### 18.1 MenuScene

- Full-bleed `art-heroes` backdrop (cover-scaled) + 62%-alpha black vignette.
- A pulsing green alert bar at the very top: `"TRANSFER WINDOW CLOSES: 18:30"` (yellow
  text on a green bar that pulses alpha 0.88↔0.5 every 400ms, forever — purely decorative
  flavor text, not a real countdown).
- Title `"DEADLINE DAY"` (68px, red-stroked white).
- Tagline, sub-tagline (2 lines), controls hint, all centred, decreasing font size.
- Pulsing (0.15 alpha swing, 700ms) start prompt: `"TAP OR PRESS SPACE TO KICK OFF"`.
- Starts the game on: tap/click the start prompt, `SPACE`, or `ENTER` → `LevelIntroScene`
  with `{ levelIndex: 0, score: 0, lives: 3 }`.

### 18.2 LevelIntroScene

- Per-level backdrop (`art-club1800/1900/2100/2200` — **note:** level-index-2 uses the
  `art-club1900` key, not `art-club2000`, for its intro screen only; `GameScene` uses
  `art-club2000` for actual gameplay at that same level — this file-key mismatch is
  intentional in the current build (different image for the "reveal" vs. the arena), not a
  bug to silently "fix" when rebuilding unless art direction says otherwise), alpha 0.42,
  + 58%-alpha black overlay.
- Header strip: small grey `CLUB {n}` + larger yellow heading line (level-specific flavor
  text, e.g. `"TONIGHT'S THREAT"`, `"THE FINAL GAUNTLET"`).
- A responsive villain-card grid (1/2-3/4/5-6 column layouts depending on villain count for
  that level — levels have 1, 3, 4, and 6 villains respectively), each card showing a
  cropped portrait (top 42% of the source JPEG, see §12.1), name, and 1–4 line flavor
  description, read from a hardcoded `INTRO_DEFS` array (one entry per level, villain list
  matching that level's `enemies` — note this is **curated by hand**, not derived from
  `level{n}.ts` enemy data, so keeping them in sync when adding/removing enemies is a
  manual responsibility).
- Pulsing footer prompt `"PRESS SPACE OR TAP TO ENTER"`.
- Any tap, `SPACE`, or `ENTER` → `GameScene` with the same `{levelIndex, score, lives}`.

### 18.3 LevelCompleteScene

- Dark green-tinted full-screen overlay (93% alpha).
- Heading: `"SQUAD FILLED!"` normally, or `"TEAM COMPLETE!"` if `nextLevelIndex === -1`
  (all 4 clubs cleared).
- Club name just completed, current score, and either a "Next: {club}" line or a
  "All 4 clubs conquered!" message.
- Pulsing button: `"TAP TO CONTINUE"` (or `"TAP TO PLAY AGAIN"` if game-complete).
- On activation: if game-complete, restart fully at `LevelIntroScene` with
  `{levelIndex:0, score:0, lives:3}` (score/lives do **not** carry over into a fresh
  run); otherwise continue to `LevelIntroScene` with `{nextLevelIndex, score, lives}`
  (carried forward).

### 18.4 GameOverScene — Leaderboard flow

A 4-phase local state machine (`loading` → `initials` → `submitting` → `board`):

1. **loading**: shows `"GAME OVER"` (48px red), `"SCORE: {score}"`, and a `"LOADING..."`
   placeholder while `GET /api/scores` resolves.
   - On success: if `score > 0` AND (fewer than 10 existing entries, OR `score` beats the
     current 10th-place entry) → go to **initials**; else skip straight to **board**
     (highlight index −1, i.e. nothing highlighted).
   - On fetch failure (network error, non-2xx): same qualification check is attempted
     using whatever `this.scores` currently is (empty array, since the fetch never
     populated it) — practically this means a failed `GET` always routes a `score > 0` run
     into **initials** anyway (empty leaderboard trivially "qualifies"), and a `score`-0
     run straight to an empty **board**.
2. **initials**: 3-letter arcade-style name entry.
   - 3 independently-steppable letter slots (`A`–`Z`, wrapping), default `"AAA"`.
   - On-canvas `◀`/`▶` buttons (52px, hover highlights yellow) step the **currently
     selected** letter by −1/+1 (`charCodeAt` arithmetic, wrapped mod 26).
   - Tapping any of the 3 big letter glyphs directly moves the cursor to that slot.
   - Keyboard: `←`/`↓` = previous letter, `→`/`↑` = next letter (note the inverted
     up/down mapping — both arrow pairs are wired to the same two actions), `SPACE`/`ENTER`
     = advance cursor (confirm current letter, move to next slot; on slot 2 (0-indexed),
     confirming submits).
   - An on-canvas `[ CONFIRM ]` button does the same "advance cursor / submit on last slot"
     action as Space/Enter.
   - A short underline glyph (`▔▔`) tracks under the currently-selected letter.
3. **submitting**: all initials-entry UI is torn down; `POST /api/scores` is sent with
   `{ initials: "XYZ", score }`. On success, the response array becomes the new `scores`,
   and the just-submitted entry's index is found by matching **both** initials and score
   (first match wins — if an identical score+initials pair already existed on the board,
   this can mis-highlight the pre-existing one, a known quirk to either preserve or
   deliberately fix in a rebuild). On any fetch error, the board is shown anyway with no
   highlight.
4. **board**: renders up to 10 rows (`{rank}. {initials} {score}`), gold for ranks 1–3,
   bright yellow + a `▶` marker for the just-submitted row (if found), grey otherwise. If
   the leaderboard is empty, shows `"NO SCORES YET"` instead of rows. After a 700ms grace
   period (so an accidental tap right after submit doesn't instantly dismiss the board),
   the **next** keypress or tap of any kind returns to `MenuScene`.

---

## 19. Screen Boundary Behavior Table

Canvas 800×450. World bounds match exactly.

| Entity | Top | Right | Bottom | Left |
|---|---|---|---|---|
| Player | block | block | block | block |
| All enemies (ground + floaters, where applicable) | block | block | block | block |
| Coins | bounce (manual) | bounce (manual) | bounce (manual) | bounce (manual) |
| Bubble | exit (y<−60) | bounce (phase-flip) | bounce (phase-flip) | bounce (phase-flip) |
| Football | bounce | exit | bounce | exit |
| Mallet | bounce | exit | bounce | exit |
| Beer | exit (all edges, generic rule) | exit | exit | exit |
| Crate | exit | exit | exit | exit |
| Pie | exit | exit | exit | exit |
| Glass shard | exit | exit | exit | exit |
| Padel-ball | exit (wide margin) but **bounces** off platforms/world-bounds first | — | — | — |
| Golf-ball | same as padel-ball | — | — | — |
| Dark-magic | exit | exit | exit | exit |
| Eel | — | — | exit (y>520) | exit (x<−80) |

"Block" = `setCollideWorldBounds(true)`, handled by Arcade Physics automatically.
"Bounce (manual)" = explicit per-frame edge checks in `GameScene.update()` or
`Projectile.update()` that flip a velocity component and clamp position by 1px inside the
boundary. "Exit" = the entity is destroyed once sufficiently outside the stated margin
(margins vary per type — see §14 for exact numbers).

---

## 20. Key Technical Patterns (gotchas to preserve)

1. **`body.reset(x, y)` for manually-driven motion.** Any entity whose position is computed
   by game logic each frame (figure-8 floaters, lerp-based travel, melonhead's circuit
   hops, butter-fingers' phases) sets `this.x`/`this.y` directly then calls
   `body.reset(this.x, this.y)` to keep the Arcade physics body in sync — it never lets
   Arcade's own integrator move these entities.
2. **`group.add()` silently wipes the physics body.** Every projectile and enemy is added
   to a `physics.add.group()` or `.staticGroup()` after construction; Phaser resets
   velocity/gravity on add. The codebase's fix is either (a) a one-time re-apply
   immediately after `add()` (`spawnFn`, `kickStart()`), or (b) continuous re-assertion
   every frame for anything that must hold a constant zero-gravity velocity indefinitely
   (football, pie, beer — see §14).
3. **Coordinate system:** +y is down. Upward velocity/gravity must be negative. World
   gravity (600) plus a projectile's own `setGravityY(g)` sums to its *effective* gravity —
   e.g. crate's `setGravityY(-520)` on top of world 600 nets ~80 effective downward
   acceleration (a slow "lob").
4. **`fillEllipse` is broken in this Phaser build — use `fillCircle` or composed
   rectangles/circles instead.**
5. **Crate spawn offset must clear the throwing platform's body**, or the crate smashes
   immediately at spawn (see §15's worked example).
6. **Projectile lifespan vs. destroy-on-exit are two different mechanisms** that can apply
   to the same object (e.g. `padel-ball`/`golf-ball` have both a 2000ms soft-expiry *and* a
   wide-margin hard exit-bounds check) — preserve both independently rather than collapsing
   to one.
7. **Hit-stop sequencing matters:** `isRespawning` is set *before* `isInvincible`, and is
   what actually blocks a second hit arriving in the same frame/short window right after
   the first; `isInvincible` only starts covering the *visual* flash + the ~1.5s grace
   period *after* the player has already respawned. Collapsing these into one flag changes
   observable behavior (a hit during the 1200ms respawn-delay window would otherwise be
   possible).

---

## 21. Build & Deploy Runbook (for a from-scratch rebuild)

1. `npm create vite@latest fuse-jumper-mvp -- --template vanilla-ts` (or manually scaffold
   `package.json`/`tsconfig.json`/`vite.config.ts` as in §2).
2. `npm install phaser@^3.80.1`; `npm install -D typescript wrangler`.
3. Author `src/main.ts`, all `src/scenes/*`, `src/objects/*`, `src/levels/*`,
   `src/input/touchInput.ts` per §§4–18.
4. Author `index.html` + `src/styles.css` with the on-screen control layout (grid-based,
   orientation-responsive — see §2.5/index.html for the exact element IDs
   (`game-container`, `ctrl-left`/`ctrl-right`/`ctrl-dev`, `btn-left`/`btn-right`/
   `btn-jump`, `btn-level-1..4`) that `touchInput.ts` binds to by id).
5. `public/manifest.json` + icons for the PWA shell.
6. Author `worker.ts` per §2.4.
7. `wrangler kv namespace create SCORES` → copy the returned id into `wrangler.jsonc`'s
   `kv_namespaces[0].id`.
8. `wrangler login` (one-time, interactive) to link the Cloudflare account.
9. `npm run build` locally to verify `tsc` passes and `dist/` is produced.
10. `npm run deploy` — this is the **only** command that publishes; confirm the live URL
    (`https://<worker-name>.<account>.workers.dev`) serves the built game and
    `/api/scores` round-trips.
11. For all subsequent changes: commit → push → **always run `npm run deploy` explicitly**
    — pushing to the git remote has no effect on the live Cloudflare deployment.
