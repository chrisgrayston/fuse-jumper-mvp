Feature: Tech stack, build pipeline, deployment, and the PWA/touch-control shell

  Scenario: Local development server
    Given the repo is freshly cloned and dependencies installed via npm install
    When the developer runs "npm run dev"
    Then Vite starts a dev server with HMR, reachable on the LAN (server.host: true)

  Scenario: Production build is a two-step process
    When "npm run build" is run
    Then "tsc" type-checks the project first
    And then "vite build" emits static assets into dist/, with base path "./"
    And Phaser is split into its own chunk via rollupOptions.output.manualChunks

  Scenario: Deploy always rebuilds before publishing
    When "npm run deploy" is run
    Then it runs "npm run build" first, then "wrangler deploy"
    And this is the only command that publishes the live game

  Scenario: Pushing to git never deploys by itself
    Given a code change has been committed and pushed to the git remote
    Then the live Cloudflare Workers deployment is completely unaffected
    And "npm run deploy" must be run explicitly to publish the change

  Scenario: Cloudflare Workers serves static assets with an SPA fallback
    Given wrangler.jsonc declares assets.directory "./dist" with not_found_handling "single-page-application"
    When a request is made for a path with no matching file in dist/
    Then index.html is served instead of a 404

  Scenario: The custom Worker script runs before static asset serving
    Given wrangler.jsonc declares main "worker.ts"
    When any request arrives
    Then worker.ts's fetch handler runs first
    And it only intercepts paths starting with /api/scores
    And every other path is delegated to env.ASSETS.fetch(request)

  Scenario: The KV namespace must exist and be bound before first deploy
    Given a fresh Cloudflare account with no existing KV namespace
    When setting up the project for the first time
    Then "wrangler kv namespace create SCORES" must be run
    And the returned namespace id must be placed in wrangler.jsonc's kv_namespaces[0].id
    Before any deploy that touches /api/scores can work correctly

  Scenario: The PWA manifest and meta tags support an installable, fullscreen mobile app
    Given public/manifest.json declares display "fullscreen", orientation "any", and two icon sizes (192, 512)
    And index.html's head sets viewport-fit=cover and disables pinch-zoom (maximum-scale=1.0, user-scalable=no)
    Then the game can be added to a mobile home screen and launched fullscreen without browser chrome

  Scenario: Touch controls adapt layout by device orientation
    Given the CSS grid in styles.css defines distinct layouts for portrait and landscape
    When the device is in portrait orientation
    Then the game canvas sits on top, with left/right control pads stacked below it, and dev buttons below that
    When the device is in landscape orientation
    Then control pads sit on the left/right sides of the canvas, and dev buttons float fixed at the bottom-left

  Scenario: Touch control elements are wired by fixed DOM ids
    Given index.html defines #btn-left, #btn-right, #btn-jump, and #btn-level-1 through #btn-level-4
    Then touchInput.ts's initTouchInput() binds listeners to exactly these ids
    And both touch events (touchstart/touchend/touchcancel) and mouse events (mousedown/mouseup/mouseleave) are wired to each, so desktop testing with a mouse also works

  Scenario: The canvas renders at a fixed logical resolution regardless of device size
    Given Phaser's scale mode is Phaser.Scale.FIT with autoCenter CENTER_BOTH
    And the logical game size is fixed at 800x450
    Then the canvas scales to fit any viewport while preserving aspect ratio and staying centered
