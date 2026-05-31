# Fuse Jumper MVP — Claude instructions

## Deployment

After every code change, ALWAYS run all three steps WITHOUT asking for confirmation:

1. `git add <files> && git commit -m "..."` — commit (do NOT ask permission)
2. `git push origin main` — push to GitHub (do NOT ask permission)
3. `npm run deploy` — build and deploy to Cloudflare Workers

The game is hosted at https://fuse-jumper-mvp.christopher-grayston.workers.dev.
Git push does NOT trigger a Cloudflare deploy — `npm run deploy` is always required.

## Stack

- Phaser 3.80 + TypeScript + Vite
- Cloudflare Workers static assets (wrangler deploy from dist/)
- All sprites generated programmatically in `src/scenes/BootScene.ts`
- `fillCircle` works; `fillEllipse` does NOT
- Enemy update signature: `update(delta, playerX, playerY): void`
