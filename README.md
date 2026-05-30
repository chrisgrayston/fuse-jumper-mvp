# Fuse Jumper

Mobile-first HTML5 arcade game built with Phaser 3 + TypeScript + Vite.

Collect all 20 fuses. Avoid the enemies. Three lives. Go.

---

## Mac Setup

### 1. Install Node.js / npm (if missing)

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node (includes npm)
brew install node
```

Or download directly from https://nodejs.org (LTS version).

### 2. Clone / enter the project

```bash
cd ~/Documents/Coding/fuse-jumper-mvp
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run locally

```bash
npm run dev
```

Open the URL shown (usually `http://localhost:5173`) in your browser.

### 5. Production build

```bash
npm run build
```

Output goes to `dist/`.

### 6. Preview the production build locally

```bash
npm run preview
```

---

## GitHub Setup

```bash
git init
git add .
git commit -m "Initial commit: Fuse Jumper MVP"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/fuse-jumper-mvp.git
git branch -M main
git push -u origin main
```

---

## Cloudflare Pages Deployment

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Click **Create application → Pages → Connect to Git**
3. Select your `fuse-jumper-mvp` repository
4. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Save and Deploy**

Every push to `main` will trigger a new deployment automatically.

---

## Controls

| Action | Keyboard | Touch |
|---|---|---|
| Move left | ← or A | Left button |
| Move right | → or D | Right button |
| Jump | Space or W or ↑ | Jump button |
| Float (hold) | Hold jump key | Hold jump button |

---

## Project Structure

```
src/
  main.ts                  # Phaser game config + boot
  scenes/
    BootScene.ts           # Generates all textures programmatically
    MenuScene.ts           # Title / start screen
    GameScene.ts           # Main gameplay loop
    GameOverScene.ts       # Game over screen
    LevelCompleteScene.ts  # Level complete screen
  objects/
    Player.ts              # Player movement + float physics
    Enemy.ts               # Patrol + flying enemy logic
    Collectible.ts         # Fuse pickup with glow tween
  levels/
    level1.ts              # Platform, fuse, enemy layout data
  styles.css               # Full-screen, no-scroll mobile CSS
index.html                 # PWA meta tags, manifest link
vite.config.ts             # Vite build config (base './', dist output)
tsconfig.json
public/
  manifest.json            # PWA manifest
  icon-192.png             # App icon
  icon-512.png             # App icon (large)
```

---

## Known Limitations (MVP 1)

- Single level only (level 2+ are placeholders)
- No audio / sound effects
- No high score persistence (no backend)
- Procedural pixel-art textures (no hand-drawn sprites)
- No mobile gyro or accelerometer controls
- PWA install prompt not explicitly triggered (browser handles it)
- Phaser chunk is large (~1.4 MB); normal for a Phaser game

---

## Next MVP Ideas

- Level 2+ with new platform layouts and more enemies
- Sound effects and chiptune music (Howler.js or Phaser audio)
- Local high-score storage (localStorage)
- Animated sprite sheets replacing generated graphics
- Enemy variety: bouncing, shooting
- Power-ups: speed boost, shield, score multiplier
- Combo / chain scoring for rapid fuse collection
- Cloudflare KV leaderboard (serverless, no backend needed)
- Level editor or procedural level generation
