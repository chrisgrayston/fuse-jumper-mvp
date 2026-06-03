import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    const { width, height } = this.scale;

    const bgBar = this.add.graphics();
    bgBar.fillStyle(0x222222);
    bgBar.fillRect(width / 2 - 200, height / 2 - 14, 400, 28);

    const fillBar = this.add.graphics();
    this.load.on('progress', (v: number) => {
      fillBar.clear();
      fillBar.fillStyle(0xffee00);
      fillBar.fillRect(width / 2 - 198, height / 2 - 12, 396 * v, 24);
    });
    this.load.on('complete', () => { bgBar.destroy(); fillBar.destroy(); });

    this.load.image('art-heroes',         './art/HeroesAndVillains.jpeg');
    this.load.image('art-club1800',       './art/Club1800c.jpeg');
    this.load.image('art-club1900',       './art/Club1900.jpeg');
    this.load.image('art-club2000',       './art/Club2000.jpeg');
    this.load.image('art-club2100',       './art/Club2100.jpeg');
    this.load.image('art-club2200',       './art/Club2200.jpeg');
    this.load.image('art-bubble-blower',  './art/BubbleBlower.jpeg');
    this.load.image('art-flanker',        './art/TheFlanker.jpeg');
    this.load.image('art-rushy',          './art/Rushy.jpeg');
    this.load.image('art-smaller-bear',   './art/SmallerBear.jpeg');
    this.load.image('art-melonhead',      './art/melonhead.jpeg');
    this.load.image('art-clippy',         './art/CLippy.jpeg');
    this.load.image('art-butter-fingers', './art/ButterFingers.jpeg');
    this.load.image('art-padel-punisher', './art/PadelPunisher.jpeg');
    this.load.image('art-giant-bear',     './art/GiantBear.jpeg');
    this.load.image('art-condor',         './art/Condor.jpeg');
    this.load.image('art-actuary-man',    './art/ActuaryMan.jpeg');
    this.load.image('art-puffin',         './art/ThePuffin.jpeg');
    this.load.image('art-vascular-man',   './art/VascularMan.jpeg');
    this.load.image('art-skeletor',       './art/Skeletor.jpeg');
  }

  create(): void {
    this.generateTextures();
    this.scene.start('MenuScene');
  }

  private generateTextures(): void {
    const g = this.make.graphics({ x: 0, y: 0 });

    // ── Player — FPL Newbie, 17 animation frames, 40×50px, facing RIGHT ──
    {
      const SK  = 0xffcc88; // skin base
      const SK2 = 0xcc8844; // skin shadow
      const HR  = 0x2b1d0e; // dark hair
      const ST  = 0x1155cc; // shirt blue
      const ST2 = 0x083090; // shirt deep shadow
      const ST3 = 0x5599ee; // shirt highlight
      const CA  = 0xf0f0f0; // cape off-white
      const CA2 = 0xbbbbbb; // cape shadow
      const CA3 = 0xffffff; // cape brightest
      const JN  = 0x1a2d8a; // jeans
      const JN2 = 0x0d1d60; // jeans shadow
      const JN3 = 0x2f4ec0; // jeans highlight
      const BL  = 0x3b1e08; // belt leather
      const BK  = 0xd4a017; // buckle gold
      const TR  = 0xf0f0f0; // trainer white
      const TS  = 0x888888; // trainer sole
      const TA  = 0x55aaff; // trainer stripe
      const CP  = 0x112266; // cap dome
      const CB  = 0x0a1644; // cap brim
      const EY  = 0x222233; // eyes

      const drawCap = (fx: number, fy: number) => {
        g.fillStyle(CP);    g.fillRect(fx,      fy,     17, 7);
        g.fillRect(fx + 2,  fy - 1,  9,  3);               // top curve
        g.fillStyle(0x223388); g.fillRect(fx + 2, fy + 3, 12, 1); // seam
        g.fillStyle(CB);    g.fillRect(fx + 13, fy + 4,  8, 3);   // brim
        g.fillRect(fx + 15, fy + 6,  5,  2);               // brim tip
        g.fillStyle(0x334499); g.fillRect(fx + 13, fy + 4, 2, 1); // brim root
      };

      const drawHead = (fx: number, fy: number) => {
        g.fillStyle(HR);        g.fillRect(fx,      fy,      16, 3);
        g.fillStyle(SK);        g.fillRect(fx,      fy + 2,  16, 11);
        g.fillStyle(SK2);       g.fillRect(fx,      fy + 2,   2,  9); // L cheek shadow
        g.fillStyle(EY);        g.fillRect(fx + 3,  fy + 5,   3,  3);
                                g.fillRect(fx + 10, fy + 5,   3,  3);
        g.fillStyle(0xffffff);  g.fillRect(fx + 3,  fy + 5,   1,  1);
                                g.fillRect(fx + 10, fy + 5,   1,  1);
        g.fillStyle(0xdd7755);  g.fillRect(fx + 5,  fy + 10,  6,  2); // mouth
        g.fillStyle(SK);        g.fillRect(fx + 4,  fy + 13,  7,  3); // neck
        g.fillStyle(SK2);       g.fillRect(fx + 4,  fy + 14,  3,  2); // neck shadow
      };

      const drawTorso = (tx: number, ty: number) => {
        g.fillStyle(ST);   g.fillRect(tx,      ty,      20, 6);
        g.fillStyle(ST2);  g.fillRect(tx,      ty + 2,   3, 4); // L shadow
                           g.fillRect(tx + 17, ty + 2,   3, 4); // R shadow
        g.fillStyle(ST3);  g.fillRect(tx + 7,  ty,       6, 2); // chest highlight
        g.fillStyle(ST);   g.fillRect(tx + 3,  ty + 6,  14, 5);
        g.fillStyle(ST2);  g.fillRect(tx + 3,  ty + 9,  14, 2); // waist shadow
        g.fillStyle(BL);   g.fillRect(tx + 3,  ty + 10, 14, 3);
        g.fillStyle(BK);   g.fillRect(tx + 9,  ty + 10,  4, 3);
        g.fillStyle(0xffee66); g.fillRect(tx + 10, ty + 10, 2, 1);
      };

      const drawTrainer = (x: number, y: number) => {
        g.fillStyle(TR);        g.fillRect(x,     y,     10, 4);
        g.fillStyle(TA);        g.fillRect(x + 1, y + 1,  7, 1);
        g.fillStyle(0xffffff);  g.fillRect(x + 1, y,      3, 1); // toe shine
        g.fillStyle(TS);        g.fillRect(x - 1, y + 3, 12, 2);
        g.fillStyle(0x555555);  g.fillRect(x - 1, y + 4, 12, 1); // sole edge
      };

      // White cape hanging straight down (idle)
      const drawCapeHang = (cx: number, cy: number, len: number) => {
        g.fillStyle(CA2); g.fillRect(cx - 1, cy,     13, len);
        g.fillStyle(CA);  g.fillRect(cx,     cy,     11, len);
        g.fillStyle(CA3); g.fillRect(cx + 2, cy + 2,  4, len - 4);
        g.fillStyle(CA2); g.fillRect(cx + 8, cy + 3,  3, len - 5);
      };

      // White cape trailing back-left when running (fillTriangle works per CLAUDE.md)
      const drawCapeRun = (topX: number, topY: number) => {
        g.fillStyle(CA2);
        g.fillTriangle(topX, topY, topX - 16, topY + 6, topX - 11, topY + 28);
        g.fillStyle(CA);
        g.fillTriangle(topX - 1, topY, topX - 14, topY + 5, topX - 9, topY + 25);
        g.fillStyle(CA3);
        g.fillTriangle(topX - 2, topY + 2, topX - 9, topY + 8, topX - 6, topY + 18);
      };

      // ── player-idle ────────────────────────────────────────────────────
      g.clear();
      drawCapeHang(2, 22, 26);
      drawCap(11, 0); drawHead(11, 6); drawTorso(10, 22);
      g.fillStyle(ST);  g.fillRect(3, 22, 8, 10);   g.fillStyle(ST2); g.fillRect(3, 27, 8, 5);
      g.fillStyle(SK);  g.fillRect(3, 31, 7,  4);
      g.fillStyle(ST);  g.fillRect(29,22, 8, 10);   g.fillStyle(ST2); g.fillRect(29,27, 8, 5);
      g.fillStyle(SK);  g.fillRect(30,31, 7,  4);
      g.fillStyle(JN);  g.fillRect(11,35,18,  5);
      g.fillStyle(JN);  g.fillRect(11,40, 7,  5);   g.fillStyle(JN2); g.fillRect(12,41, 5, 4);
      g.fillStyle(JN3); g.fillRect(11,40, 2,  3);
      g.fillStyle(JN);  g.fillRect(22,40, 7,  5);   g.fillStyle(JN2); g.fillRect(23,41, 5, 4);
      g.fillStyle(JN3); g.fillRect(22,40, 2,  3);
      drawTrainer(10, 44); drawTrainer(21, 44);
      g.generateTexture('player-idle', 40, 50);

      // ── player-tap ─────────────────────────────────────────────────────
      g.clear();
      drawCapeHang(2, 22, 26);
      drawCap(11, 0); drawHead(11, 6); drawTorso(10, 22);
      g.fillStyle(ST);  g.fillRect(3, 22, 8, 10);   g.fillStyle(SK); g.fillRect(3, 31, 7, 4);
      g.fillStyle(ST);  g.fillRect(29,22, 8, 10);   g.fillStyle(SK); g.fillRect(30,31, 7, 4);
      g.fillStyle(JN);  g.fillRect(11,35,18,  5);
      g.fillStyle(JN);  g.fillRect(11,40, 7,  5);   g.fillStyle(JN2); g.fillRect(12,41, 5, 4);
      g.fillStyle(JN);  g.fillRect(22,40, 7,  3);   // R leg shorter
      drawTrainer(10, 44); drawTrainer(22, 41);      // R trainer raised
      g.generateTexture('player-tap', 40, 50);

      // ── player-land (impact — very deep squat, wide stance) ────────────
      g.clear();
      drawCapeHang(2, 19, 18);
      drawCap(10, 1); drawHead(10, 7);
      // Compressed torso (body low)
      g.fillStyle(ST);   g.fillRect(9,  21, 22, 5);
      g.fillStyle(ST2);  g.fillRect(9,  23,  3, 3); g.fillRect(28, 23, 3, 3);
      g.fillStyle(ST3);  g.fillRect(16, 21,  6, 2);
      g.fillStyle(ST);   g.fillRect(12, 25, 16, 3);
      g.fillStyle(BL);   g.fillRect(12, 27, 16, 2); g.fillStyle(BK); g.fillRect(18,27, 4,2);
      g.fillStyle(ST);   g.fillRect(1,  21,  9, 7);  g.fillStyle(SK); g.fillRect(0, 27, 7, 3); // L arm spread
      g.fillStyle(ST);   g.fillRect(30, 21,  9, 7);  g.fillStyle(SK); g.fillRect(33,27, 7, 3); // R arm spread
      g.fillStyle(JN);   g.fillRect(11, 28, 18, 4);
      // Deep bent knees wide
      g.fillStyle(JN);   g.fillRect(7,  32,  8, 9);  g.fillStyle(JN2); g.fillRect(8, 34, 6, 7);
      g.fillStyle(JN3);  g.fillRect(7,  32,  2, 5);
      g.fillStyle(JN);   g.fillRect(6,  40,  9, 5);
      g.fillStyle(JN);   g.fillRect(25, 32,  8, 9);  g.fillStyle(JN2); g.fillRect(26,34, 6, 7);
      g.fillStyle(JN3);  g.fillRect(25, 32,  2, 5);
      g.fillStyle(JN);   g.fillRect(25, 40,  9, 5);
      drawTrainer(5, 43); drawTrainer(25, 43);
      g.generateTexture('player-land', 40, 50);

      // ── player-crouch (recovering from land) ───────────────────────────
      g.clear();
      drawCapeHang(2, 20, 22);
      drawCap(11, 0); drawHead(11, 6);
      g.fillStyle(ST);   g.fillRect(10, 20, 20, 5);
      g.fillStyle(ST2);  g.fillRect(10, 22,  3, 3); g.fillRect(27, 22, 3, 3);
      g.fillStyle(ST3);  g.fillRect(16, 20,  6, 2);
      g.fillStyle(ST);   g.fillRect(13, 24, 14, 4);
      g.fillStyle(BL);   g.fillRect(13, 27, 14, 2); g.fillStyle(BK); g.fillRect(19,27, 4,2);
      g.fillStyle(ST);   g.fillRect(3, 20,  8, 8);  g.fillStyle(SK); g.fillRect(3, 27, 7, 3);
      g.fillStyle(ST);   g.fillRect(29,20,  8, 8);  g.fillStyle(SK); g.fillRect(30,27, 7, 3);
      g.fillStyle(JN);   g.fillRect(12, 28, 16, 4);
      g.fillStyle(JN);   g.fillRect(9,  32,  7, 9); g.fillStyle(JN2); g.fillRect(10,34, 5, 7);
      g.fillStyle(JN3);  g.fillRect(9,  32,  2, 5);
      g.fillStyle(JN);   g.fillRect(8,  40,  8, 5);
      g.fillStyle(JN);   g.fillRect(24, 32,  7, 9); g.fillStyle(JN2); g.fillRect(25,34, 5, 7);
      g.fillStyle(JN3);  g.fillRect(24, 32,  2, 5);
      g.fillStyle(JN);   g.fillRect(24, 40,  8, 5);
      drawTrainer(7, 43); drawTrainer(23, 43);
      g.generateTexture('player-crouch', 40, 50);

      // ── RUN CYCLE — 8 frames (full biomechanical stride) ─────────────
      // Frame 1: Left contact — L foot strikes, R arm forward
      g.clear();
      drawCapeRun(12, 22);
      drawCap(13, 0); drawHead(13, 6); drawTorso(12, 21);
      g.fillStyle(ST);  g.fillRect(29,13, 7,10);  g.fillStyle(ST2); g.fillRect(29,18, 7, 5);
      g.fillStyle(SK);  g.fillRect(31,10, 5, 5);  // R arm forward-up
      g.fillStyle(ST);  g.fillRect(6, 24, 7, 8);  g.fillStyle(ST2); g.fillRect(6, 28, 7, 4);
      g.fillStyle(SK);  g.fillRect(5, 31, 6, 4);  // L arm back
      g.fillStyle(JN);  g.fillRect(13,34,15, 4);
      g.fillStyle(JN);  g.fillRect(11,38, 6, 6);  g.fillStyle(JN3); g.fillRect(11,38, 2, 4); // L forward
      g.fillStyle(JN);  g.fillRect(10,43, 6, 4);
      g.fillStyle(JN);  g.fillRect(22,38, 6, 5);  // R pushing off
      g.fillStyle(JN);  g.fillRect(24,42, 5, 5);  g.fillStyle(JN2); g.fillRect(25,43, 3, 4);
      drawTrainer(9,  46); drawTrainer(23, 45);
      g.generateTexture('player-run-1', 40, 50);

      // Frame 2: Left mid-support — body over left foot, R knee rising
      g.clear();
      drawCapeRun(12, 21);
      drawCap(13, 1); drawHead(13, 7); drawTorso(12, 22); // body dips
      g.fillStyle(ST);  g.fillRect(28,17, 7, 9);  g.fillStyle(SK); g.fillRect(30,14, 5, 5);
      g.fillStyle(ST);  g.fillRect(7, 22, 7, 9);  g.fillStyle(SK); g.fillRect(5, 29, 6, 4);
      g.fillStyle(JN);  g.fillRect(13,35,15, 4);
      g.fillStyle(JN);  g.fillRect(12,39, 6, 6);  g.fillStyle(JN2); g.fillRect(13,41, 4, 4); // L planted
      g.fillStyle(JN);  g.fillRect(11,44, 7, 4);
      g.fillStyle(JN);  g.fillRect(22,36, 6, 5);  // R knee rising
      g.fillStyle(JN);  g.fillRect(23,40, 5, 5);  g.fillStyle(JN2); g.fillRect(24,41, 3, 4);
      drawTrainer(10, 47); drawTrainer(22, 43);
      g.generateTexture('player-run-2', 40, 50);

      // Frame 3: Left toe-off — L pushes, R leg swings through, body rises
      g.clear();
      drawCapeRun(13, 20);
      drawCap(14, 0); drawHead(14, 6); drawTorso(13, 21);
      g.fillStyle(ST);  g.fillRect(28,20, 7, 8);  g.fillStyle(SK); g.fillRect(30,27, 6, 4); // R arm back
      g.fillStyle(ST);  g.fillRect(7, 14, 7,10);  g.fillStyle(SK); g.fillRect(5, 11, 5, 5); // L arm forward
      g.fillStyle(JN);  g.fillRect(14,34,14, 4);
      g.fillStyle(JN);  g.fillRect(10,38, 6, 6);  g.fillStyle(JN); g.fillRect(8, 43, 6, 4);  // L toe-off
      g.fillStyle(JN2); g.fillRect(8, 44, 4, 3);
      g.fillStyle(JN);  g.fillRect(23,35, 6, 6);  // R high swing
      g.fillStyle(JN);  g.fillRect(24,39, 5, 6);  g.fillStyle(JN2); g.fillRect(25,40, 3, 5);
      drawTrainer(7,  45); drawTrainer(23, 43);
      g.generateTexture('player-run-3', 40, 50);

      // Frame 4: Float A — L trails back, R reaches forward, both off ground
      g.clear();
      drawCapeRun(13, 18); // cape streams more aggressively when airborne
      drawCap(14, 0); drawHead(14, 5); drawTorso(13, 20); // body highest
      g.fillStyle(ST);  g.fillRect(27,18, 7, 8);  g.fillStyle(SK); g.fillRect(29,14, 5, 4);
      g.fillStyle(ST);  g.fillRect(8, 13, 7, 9);  g.fillStyle(SK); g.fillRect(6, 10, 5, 5);
      g.fillStyle(JN);  g.fillRect(14,33,14, 4);
      g.fillStyle(JN);  g.fillRect(8, 37, 6, 7);  g.fillStyle(JN2); g.fillRect(9, 38, 4, 6); // L trailing
      g.fillStyle(JN);  g.fillRect(6, 43, 7, 4);
      g.fillStyle(JN);  g.fillRect(24,36, 6, 7);  g.fillStyle(JN3); g.fillRect(24,36, 2, 5); // R reaching
      g.fillStyle(JN);  g.fillRect(25,42, 6, 4);
      drawTrainer(5, 45); drawTrainer(24, 44);
      g.generateTexture('player-run-4', 40, 50);

      // Frame 5: Right contact — R foot strikes, L arm forward (mirror of 1)
      g.clear();
      drawCapeRun(12, 22);
      drawCap(13, 0); drawHead(13, 6); drawTorso(12, 21);
      g.fillStyle(ST);  g.fillRect(5, 13, 7,10);  g.fillStyle(ST2); g.fillRect(5, 18, 7, 5);
      g.fillStyle(SK);  g.fillRect(4, 10, 5, 5);  // L arm forward-up
      g.fillStyle(ST);  g.fillRect(27,24, 7, 8);  g.fillStyle(ST2); g.fillRect(27,28, 7, 4);
      g.fillStyle(SK);  g.fillRect(29,31, 6, 4);  // R arm back
      g.fillStyle(JN);  g.fillRect(13,34,15, 4);
      g.fillStyle(JN);  g.fillRect(22,38, 6, 6);  g.fillStyle(JN3); g.fillRect(22,38, 2, 4); // R forward
      g.fillStyle(JN);  g.fillRect(23,43, 6, 4);
      g.fillStyle(JN);  g.fillRect(11,38, 6, 5);  // L pushing off
      g.fillStyle(JN);  g.fillRect(9, 42, 5, 5);  g.fillStyle(JN2); g.fillRect(9, 43, 3, 4);
      drawTrainer(22, 46); drawTrainer(8, 45);
      g.generateTexture('player-run-5', 40, 50);

      // Frame 6: Right mid-support (mirror of 2)
      g.clear();
      drawCapeRun(12, 21);
      drawCap(13, 1); drawHead(13, 7); drawTorso(12, 22);
      g.fillStyle(ST);  g.fillRect(5, 17, 7, 9);  g.fillStyle(SK); g.fillRect(4, 14, 5, 5);
      g.fillStyle(ST);  g.fillRect(27,22, 7, 9);  g.fillStyle(SK); g.fillRect(30,29, 6, 4);
      g.fillStyle(JN);  g.fillRect(13,35,15, 4);
      g.fillStyle(JN);  g.fillRect(21,39, 6, 6);  g.fillStyle(JN2); g.fillRect(22,41, 4, 4); // R planted
      g.fillStyle(JN);  g.fillRect(22,44, 7, 4);
      g.fillStyle(JN);  g.fillRect(11,36, 6, 5);  // L knee rising
      g.fillStyle(JN);  g.fillRect(10,40, 5, 5);  g.fillStyle(JN2); g.fillRect(11,41, 3, 4);
      drawTrainer(21, 47); drawTrainer(9, 43);
      g.generateTexture('player-run-6', 40, 50);

      // Frame 7: Right toe-off (mirror of 3)
      g.clear();
      drawCapeRun(13, 20);
      drawCap(14, 0); drawHead(14, 6); drawTorso(13, 21);
      g.fillStyle(ST);  g.fillRect(9, 20, 7, 8);  g.fillStyle(SK); g.fillRect(8, 27, 6, 4);  // L arm back
      g.fillStyle(ST);  g.fillRect(27,14, 7,10);  g.fillStyle(SK); g.fillRect(30,11, 5, 5);  // R arm forward
      g.fillStyle(JN);  g.fillRect(14,34,14, 4);
      g.fillStyle(JN);  g.fillRect(23,38, 6, 6);  g.fillStyle(JN); g.fillRect(25,43, 6, 4);  // R toe-off
      g.fillStyle(JN2); g.fillRect(26,44, 4, 3);
      g.fillStyle(JN);  g.fillRect(10,35, 6, 6);  // L high swing
      g.fillStyle(JN);  g.fillRect(9, 39, 5, 6);  g.fillStyle(JN2); g.fillRect(9, 40, 3, 5);
      drawTrainer(24, 45); drawTrainer(8, 43);
      g.generateTexture('player-run-7', 40, 50);

      // Frame 8: Float B — R trails, L reaches, both airborne (mirror of 4)
      g.clear();
      drawCapeRun(13, 18);
      drawCap(14, 0); drawHead(14, 5); drawTorso(13, 20);
      g.fillStyle(ST);  g.fillRect(9, 18, 7, 8);  g.fillStyle(SK); g.fillRect(8, 14, 5, 4);
      g.fillStyle(ST);  g.fillRect(27,13, 7, 9);  g.fillStyle(SK); g.fillRect(30,10, 5, 5);
      g.fillStyle(JN);  g.fillRect(14,33,14, 4);
      g.fillStyle(JN);  g.fillRect(24,37, 6, 7);  g.fillStyle(JN2); g.fillRect(25,38, 4, 6); // R trailing
      g.fillStyle(JN);  g.fillRect(26,43, 7, 4);
      g.fillStyle(JN);  g.fillRect(9, 36, 6, 7);  g.fillStyle(JN3); g.fillRect(9, 36, 2, 5); // L reaching
      g.fillStyle(JN);  g.fillRect(8, 42, 6, 4);
      drawTrainer(25, 45); drawTrainer(7, 44);
      g.generateTexture('player-run-8', 40, 50);

      // ── player-jump (launch — arms driving up, legs extending) ─────────
      g.clear();
      drawCapeRun(12, 19);
      drawCap(11, 0); drawHead(11, 6); drawTorso(10, 21);
      g.fillStyle(ST);  g.fillRect(2,  9, 9,13);  g.fillStyle(ST2); g.fillRect(2, 15, 9, 7);
      g.fillStyle(SK);  g.fillRect(1,  6, 8, 5);
      g.fillStyle(ST);  g.fillRect(29, 9, 9,13);  g.fillStyle(ST2); g.fillRect(29,15, 9, 7);
      g.fillStyle(SK);  g.fillRect(31, 6, 8, 5);
      g.fillStyle(JN);  g.fillRect(11,34,18, 4);
      g.fillStyle(JN);  g.fillRect(10,38, 7, 6);  g.fillStyle(JN2); g.fillRect(11,39, 5, 5);
      g.fillStyle(JN);  g.fillRect(23,38, 7, 6);  g.fillStyle(JN2); g.fillRect(24,39, 5, 5);
      drawTrainer(9, 42); drawTrainer(22, 42);
      g.generateTexture('player-jump', 40, 50);

      // ── player-float (gliding — cape billows left, arms wide) ──────────
      g.clear();
      // Cape billowing wide to the left
      g.fillStyle(CA2); g.fillRect(0,  4, 19, 8); g.fillRect(1, 12,16, 7); g.fillRect(3, 19,13, 6);
      g.fillStyle(CA);  g.fillRect(1,  4, 15, 7); g.fillRect(2, 11,13, 6); g.fillRect(4, 18,10, 5);
      g.fillStyle(CA3); g.fillRect(2,  5,  5, 4); g.fillRect(3, 11, 4, 4);
      drawCap(16, 3); drawHead(16, 9); drawTorso(15, 24);
      g.fillStyle(ST);  g.fillRect(3, 25,13, 5);  g.fillStyle(ST2); g.fillRect(3, 27,13, 3);
      g.fillStyle(SK);  g.fillRect(1, 25, 4, 4);  // L arm spread wide
      g.fillStyle(ST);  g.fillRect(34,25, 7, 5);  g.fillStyle(ST2); g.fillRect(34,27, 7, 3);
      g.fillStyle(SK);  g.fillRect(39,25, 2, 4);  // R arm spread wide
      g.fillStyle(JN);  g.fillRect(16,33,14, 4);
      g.fillStyle(JN);  g.fillRect(14,37, 7,10);  g.fillStyle(JN2); g.fillRect(15,38, 5, 9);
      g.fillStyle(JN);  g.fillRect(25,37, 7,10);  g.fillStyle(JN2); g.fillRect(26,38, 5, 9);
      drawTrainer(13, 45); drawTrainer(24, 45);
      g.generateTexture('player-float', 40, 50);

      // ── player-fall (arms out bracing, cape streams up behind) ─────────
      g.clear();
      // Cape trailing upward (falling = cape goes up)
      g.fillStyle(CA2); g.fillTriangle(13, 20,  0,  2, 5, 0);
      g.fillStyle(CA);  g.fillTriangle(13, 21,  1,  4, 6, 1);
      g.fillStyle(CA3); g.fillTriangle(12, 22,  4,  8, 7, 4);
      drawCap(11, 1); drawHead(11, 7); drawTorso(10, 22);
      g.fillStyle(ST);  g.fillRect(1, 22,10, 6);  g.fillStyle(ST2); g.fillRect(1, 24,10, 4);
      g.fillStyle(SK);  g.fillRect(0, 22, 3, 5);
      g.fillStyle(ST);  g.fillRect(29,22,10, 6);  g.fillStyle(ST2); g.fillRect(29,24,10, 4);
      g.fillStyle(SK);  g.fillRect(37,22, 3, 5);
      g.fillStyle(JN);  g.fillRect(11,31,18, 5);
      g.fillStyle(JN);  g.fillRect(11,36, 7,10);  g.fillStyle(JN2); g.fillRect(12,37, 5, 9);
      g.fillStyle(JN);  g.fillRect(22,36, 7,10);  g.fillStyle(JN2); g.fillRect(23,37, 5, 9);
      drawTrainer(10, 44); drawTrainer(21, 44);
      g.generateTexture('player-fall', 40, 50);
    }

    // ── Bubble Blower — West Ham, blonde hair, cape, keepup animation ────────
    {
      const SK  = 0xffcc88;  // skin
      const HR  = 0xffdd22;  // golden blonde
      const SH  = 0x7b003c;  // claret shirt
      const SB  = 0x0033cc;  // West Ham blue
      const BT  = 0x221100;  // dark boots
      const CA  = 0x550011;  // cape outer (deep claret)
      const CI  = 0x991133;  // cape inner
      const EY  = 0x2255cc;  // blue eyes

      const bbHair = (fx: number, fy: number) => {
        g.fillStyle(HR);
        g.fillRect(fx,    fy,    17,  6);  // main hair block
        g.fillRect(fx-1,  fy+2,   3,  7);  // left sideburn
        g.fillRect(fx+14, fy-1,   4,  4);  // right spike
        g.fillRect(fx+3,  fy-2,   5,  3);  // front spike (clips at y=0, that's fine)
        g.fillRect(fx+9,  fy-2,   4,  3);  // back spike
      };

      const bbFace = (fx: number, fy: number, blowing = false) => {
        g.fillStyle(SK);       g.fillRect(fx,    fy+3,  16, 12);  // face
        g.fillStyle(EY);       g.fillRect(fx+2,  fy+7,   3,  3);  // left eye
                               g.fillRect(fx+9,  fy+7,   3,  3);  // right eye
        g.fillStyle(0xffffff); g.fillRect(fx+2,  fy+7,   1,  1);  // L highlight
                               g.fillRect(fx+9,  fy+7,   1,  1);  // R highlight
        if (blowing) {
          g.fillStyle(0xffaa77); g.fillRect(fx-1,  fy+9,  4,  5);  // L cheek puff
                                 g.fillRect(fx+13, fy+9,  4,  5);  // R cheek puff
          g.fillStyle(0xaaddff); g.fillRect(fx+5,  fy+12, 6,  3);  // mouth/bubble
        }
        g.fillStyle(SK); g.fillRect(fx+4, fy+15, 7, 3);  // neck
      };

      const bbTorso = (tx: number, ty: number) => {
        g.fillStyle(SH); g.fillRect(tx,    ty,    20,  5);  // claret shoulders
        g.fillStyle(SB); g.fillRect(tx-5,  ty,     6,  9);  // left sleeve (blue)
        g.fillStyle(SB); g.fillRect(tx+19, ty,     6,  9);  // right sleeve (blue)
        g.fillStyle(SK); g.fillRect(tx-5,  ty+8,   5,  4);  // left hand
        g.fillStyle(SK); g.fillRect(tx+20, ty+8,   5,  4);  // right hand
        g.fillStyle(SH); g.fillRect(tx+4,  ty+5,  12,  5);  // narrow claret waist
      };

      const bbBall = (bx: number, by: number) => {
        g.fillStyle(0xffffff); g.fillRect(bx,   by,   9,  9);  // white
        g.fillStyle(0x111111); g.fillRect(bx+2, by+1, 2,  2);  // patches
                               g.fillRect(bx+6, by+2, 2,  2);
                               g.fillRect(bx+1, by+5, 2,  2);
                               g.fillRect(bx+5, by+6, 2,  2);
                               g.fillRect(bx+3, by+3, 3,  3);
        g.fillStyle(0xdddddd); g.fillRect(bx,   by+7, 9,  2);  // shadow base
        g.fillStyle(0xffffff); g.fillRect(bx+1, by+1, 2,  1);  // specular highlight
      };

      const bbCape = () => {
        g.fillStyle(CA); g.fillRect(0, 15, 12, 37);
        g.fillStyle(CI); g.fillRect(1, 16,  8, 33);
      };

      const bbShorts = () => {
        g.fillStyle(SB); g.fillRect(12, 30, 16, 6);
      };

      const bbLegL = () => {  // left leg standing
        g.fillStyle(SB); g.fillRect(12, 36,  6, 10);
        g.fillStyle(SB); g.fillRect(11, 45,  5,  5);
        g.fillStyle(BT); g.fillRect(10, 49,  9,  3);
      };

      const bbLegR = () => {  // right leg standing
        g.fillStyle(SB); g.fillRect(22, 36,  6, 10);
        g.fillStyle(SB); g.fillRect(23, 45,  5,  5);
        g.fillStyle(BT); g.fillRect(22, 49,  9,  3);
      };

      // Frame 1 — right knee raised, ball at raised foot
      g.clear();
      bbCape();
      bbHair(12, 2); bbFace(12, 2);
      bbTorso(10, 20);
      bbShorts();
      bbLegL();
      // Right leg: thigh angled up-right, shin hanging, boot raised
      g.fillStyle(SB); g.fillRect(22, 32,  8,  5);  // upper thigh (hip→knee going up)
      g.fillStyle(SB); g.fillRect(27, 36,  5,  6);  // knee area
      g.fillStyle(SB); g.fillRect(25, 41,  6,  5);  // shin angled down
      g.fillStyle(BT); g.fillRect(25, 45,  8,  4);  // raised boot
      bbBall(30, 36);
      g.generateTexture('enemy-bubble-blower', 40, 52);

      // Frame 2 — left knee raised, ball at raised foot
      g.clear();
      bbCape();
      bbHair(12, 2); bbFace(12, 2);
      bbTorso(10, 20);
      bbShorts();
      bbLegR();
      // Left leg raised
      g.fillStyle(SB); g.fillRect(10, 32,  8,  5);  // upper thigh up-left
      g.fillStyle(SB); g.fillRect(8,  36,  5,  6);  // knee area
      g.fillStyle(SB); g.fillRect(9,  41,  6,  5);  // shin
      g.fillStyle(BT); g.fillRect(7,  45,  8,  4);  // raised boot
      bbBall(1, 36);
      g.generateTexture('enemy-bubble-blower-2', 40, 52);

      // Frame 3 — blowing bubbles (both feet down, puffed cheeks)
      g.clear();
      bbCape();
      bbHair(12, 2); bbFace(12, 2, true);
      bbTorso(10, 20);
      bbShorts();
      bbLegL();
      bbLegR();
      bbBall(14, 45);
      g.generateTexture('enemy-bubble-blower-blow', 40, 52);
    }

    // ── Flanker run-1 — bald wide Dartford RFC rugby player, left leg fwd ──
    g.clear();
    g.fillStyle(0xffcc88); g.fillCircle(22, 9, 9);      // rounded bald head
    g.fillStyle(0xffcc88); g.fillRect(13, 8, 3, 5);     // left ear
    g.fillStyle(0xffcc88); g.fillRect(28, 8, 3, 5);     // right ear
    g.fillStyle(0x222222); g.fillRect(17, 8, 3, 3);     // left eye
    g.fillStyle(0xffffff); g.fillRect(17, 8, 1, 1);     // L eye highlight
    g.fillStyle(0x222222); g.fillRect(23, 8, 3, 3);     // right eye
    g.fillStyle(0xffffff); g.fillRect(23, 8, 1, 1);     // R eye highlight
    g.fillStyle(0x0033aa); g.fillRect(4, 20, 36, 4);    // jersey hoop blue
    g.fillStyle(0xffffff); g.fillRect(4, 24, 36, 4);    // jersey hoop white
    g.fillStyle(0x0033aa); g.fillRect(4, 28, 36, 4);    // jersey hoop blue
    g.fillStyle(0xffffff); g.fillRect(4, 32, 36, 4);    // jersey hoop white
    g.fillStyle(0x0033aa); g.fillRect(1, 21, 3, 9);     // left arm
    g.fillStyle(0x0033aa); g.fillRect(40, 21, 3, 9);    // right arm
    g.fillStyle(0xffcc88); g.fillRect(1, 29, 3, 3);     // left hand
    g.fillStyle(0xffcc88); g.fillRect(40, 29, 3, 3);    // right hand
    g.fillStyle(0x001166); g.fillRect(8, 36, 28, 8);    // shorts
    g.fillStyle(0xffffff); g.fillRect(8,  37, 2, 6);    // left side stripe
    g.fillStyle(0xffffff); g.fillRect(34, 37, 2, 6);    // right side stripe
    g.fillStyle(0x001166); g.fillRect(10, 43, 8, 5);    // left thigh raised
    g.fillStyle(0x001166); g.fillRect(26, 44, 8, 4);    // right thigh back
    g.fillStyle(0xffcc88); g.fillRect(11, 47, 6, 3);    // left shin
    g.fillStyle(0xffcc88); g.fillRect(27, 47, 6, 3);    // right shin
    g.fillStyle(0x3a1f0a); g.fillRect(9,  48, 8, 3);    // left boot forward
    g.fillStyle(0x3a1f0a); g.fillRect(26, 49, 8, 3);    // right boot flat
    g.generateTexture('enemy-flanker', 44, 52);

    // ── Flanker run-2 — right leg fwd ────────────────────────────────────
    g.clear();
    g.fillStyle(0xffcc88); g.fillCircle(22, 9, 9);
    g.fillStyle(0xffcc88); g.fillRect(13, 8, 3, 5);
    g.fillStyle(0xffcc88); g.fillRect(28, 8, 3, 5);
    g.fillStyle(0x222222); g.fillRect(17, 8, 3, 3);
    g.fillStyle(0xffffff); g.fillRect(17, 8, 1, 1);
    g.fillStyle(0x222222); g.fillRect(23, 8, 3, 3);
    g.fillStyle(0xffffff); g.fillRect(23, 8, 1, 1);
    g.fillStyle(0x0033aa); g.fillRect(4, 20, 36, 4);
    g.fillStyle(0xffffff); g.fillRect(4, 24, 36, 4);
    g.fillStyle(0x0033aa); g.fillRect(4, 28, 36, 4);
    g.fillStyle(0xffffff); g.fillRect(4, 32, 36, 4);
    g.fillStyle(0x0033aa); g.fillRect(1, 21, 3, 9);
    g.fillStyle(0x0033aa); g.fillRect(40, 21, 3, 9);
    g.fillStyle(0xffcc88); g.fillRect(1, 29, 3, 3);
    g.fillStyle(0xffcc88); g.fillRect(40, 29, 3, 3);
    g.fillStyle(0x001166); g.fillRect(8, 36, 28, 8);
    g.fillStyle(0xffffff); g.fillRect(8,  37, 2, 6);
    g.fillStyle(0xffffff); g.fillRect(34, 37, 2, 6);
    g.fillStyle(0x001166); g.fillRect(10, 44, 8, 4);    // left thigh back
    g.fillStyle(0x001166); g.fillRect(26, 43, 8, 5);    // right thigh raised
    g.fillStyle(0xffcc88); g.fillRect(11, 47, 6, 3);
    g.fillStyle(0xffcc88); g.fillRect(27, 47, 6, 3);
    g.fillStyle(0x3a1f0a); g.fillRect(9,  49, 8, 3);    // left boot flat
    g.fillStyle(0x3a1f0a); g.fillRect(26, 48, 8, 3);    // right boot forward
    g.generateTexture('enemy-flanker-2', 44, 52);

    // ── Flanker stamp-1 — left foot raised high ───────────────────────────
    g.clear();
    g.fillStyle(0xffcc88); g.fillCircle(22, 9, 9);
    g.fillStyle(0xffcc88); g.fillRect(13, 8, 3, 5);
    g.fillStyle(0xffcc88); g.fillRect(28, 8, 3, 5);
    g.fillStyle(0x222222); g.fillRect(17, 8, 3, 3);
    g.fillStyle(0xffffff); g.fillRect(17, 8, 1, 1);
    g.fillStyle(0x222222); g.fillRect(23, 8, 3, 3);
    g.fillStyle(0xffffff); g.fillRect(23, 8, 1, 1);
    g.fillStyle(0x0033aa); g.fillRect(4, 20, 36, 4);
    g.fillStyle(0xffffff); g.fillRect(4, 24, 36, 4);
    g.fillStyle(0x0033aa); g.fillRect(4, 28, 36, 4);
    g.fillStyle(0xffffff); g.fillRect(4, 32, 36, 4);
    g.fillStyle(0x0033aa); g.fillRect(1, 21, 3, 9);
    g.fillStyle(0x0033aa); g.fillRect(40, 21, 3, 9);
    g.fillStyle(0xffcc88); g.fillRect(1, 29, 3, 3);
    g.fillStyle(0xffcc88); g.fillRect(40, 29, 3, 3);
    g.fillStyle(0x001166); g.fillRect(8, 36, 28, 8);
    g.fillStyle(0xffffff); g.fillRect(8,  37, 2, 6);
    g.fillStyle(0xffffff); g.fillRect(34, 37, 2, 6);
    g.fillStyle(0x001166); g.fillRect(8,  37, 8, 7);    // left thigh raised high
    g.fillStyle(0xffcc88); g.fillRect(7,  42, 7, 4);    // left shin angled
    g.fillStyle(0x3a1f0a); g.fillRect(6,  44, 8, 3);    // left boot raised
    g.fillStyle(0x001166); g.fillRect(26, 44, 8, 6);    // right thigh planted
    g.fillStyle(0xffcc88); g.fillRect(27, 48, 6, 3);    // right shin
    g.fillStyle(0x3a1f0a); g.fillRect(25, 49, 8, 3);    // right boot flat
    g.generateTexture('enemy-flanker-stamp', 44, 52);

    // ── Flanker stamp-2 — right foot raised high ──────────────────────────
    g.clear();
    g.fillStyle(0xffcc88); g.fillCircle(22, 9, 9);
    g.fillStyle(0xffcc88); g.fillRect(13, 8, 3, 5);
    g.fillStyle(0xffcc88); g.fillRect(28, 8, 3, 5);
    g.fillStyle(0x222222); g.fillRect(17, 8, 3, 3);
    g.fillStyle(0xffffff); g.fillRect(17, 8, 1, 1);
    g.fillStyle(0x222222); g.fillRect(23, 8, 3, 3);
    g.fillStyle(0xffffff); g.fillRect(23, 8, 1, 1);
    g.fillStyle(0x0033aa); g.fillRect(4, 20, 36, 4);
    g.fillStyle(0xffffff); g.fillRect(4, 24, 36, 4);
    g.fillStyle(0x0033aa); g.fillRect(4, 28, 36, 4);
    g.fillStyle(0xffffff); g.fillRect(4, 32, 36, 4);
    g.fillStyle(0x0033aa); g.fillRect(1, 21, 3, 9);
    g.fillStyle(0x0033aa); g.fillRect(40, 21, 3, 9);
    g.fillStyle(0xffcc88); g.fillRect(1, 29, 3, 3);
    g.fillStyle(0xffcc88); g.fillRect(40, 29, 3, 3);
    g.fillStyle(0x001166); g.fillRect(8, 36, 28, 8);
    g.fillStyle(0xffffff); g.fillRect(8,  37, 2, 6);
    g.fillStyle(0xffffff); g.fillRect(34, 37, 2, 6);
    g.fillStyle(0x001166); g.fillRect(10, 44, 8, 6);    // left thigh planted
    g.fillStyle(0xffcc88); g.fillRect(11, 48, 6, 3);    // left shin
    g.fillStyle(0x3a1f0a); g.fillRect(9,  49, 8, 3);    // left boot flat
    g.fillStyle(0x001166); g.fillRect(28, 37, 8, 7);    // right thigh raised high
    g.fillStyle(0xffcc88); g.fillRect(29, 42, 7, 4);    // right shin angled
    g.fillStyle(0x3a1f0a); g.fillRect(30, 44, 8, 3);    // right boot raised
    g.generateTexture('enemy-flanker-stamp-2', 44, 52);

    // ── Eel — 3-frame dark moray, 52×18, head faces LEFT (moves left) ────
    {
      const DK = 0x0a1510;  // near-black shadow
      const BD = 0x1a4a28;  // dark green body
      const HL = 0x2e8048;  // lighter green scales/highlight
      const EY = 0xff3300;  // glowing red eye
      const TH = 0xddeedd;  // pale teeth
      const MB = 0x060d08;  // near-black mouth cavity

      // Body-wave Y offsets for 5 segments (x=16-48, 8px each) per frame
      const waves: number[][] = [
        [0, -3, -4, -3,  0],   // hump up
        [0,  0,  0,  0,  0],   // straight
        [0, +3, +4, +3,  0],   // hump down
      ];

      for (let f = 0; f < 3; f++) {
        g.clear();
        const w = waves[f];

        // Tail fin (rightmost, x=44-52)
        g.fillStyle(BD); g.fillRect(44, 6, 8, 6);
        g.fillStyle(HL); g.fillRect(47, 3, 5, 3);   // upper lobe
        g.fillStyle(HL); g.fillRect(47, 12, 5, 3);  // lower lobe
        g.fillStyle(DK); g.fillRect(44, 9, 3, 1);   // spine line

        // Body segments — drawn right-to-left so head overlaps
        for (let s = 4; s >= 0; s--) {
          const bx = 16 + s * 7;
          const by = 5 + w[s];
          g.fillStyle(BD); g.fillRect(bx,     by,     7,  8);
          g.fillStyle(HL); g.fillRect(bx + 1, by + 1, 4,  2);  // scale sheen
          g.fillStyle(DK); g.fillRect(bx + 6, by + 1, 1,  6);  // segment shadow
        }

        // Head (x=0-16, facing left — open snarling mouth)
        g.fillStyle(BD);  g.fillRect(0,  3, 16,  7);   // upper skull
        g.fillStyle(HL);  g.fillRect(1,  3, 13,  2);   // top ridge highlight
        g.fillStyle(BD);  g.fillRect(2, 10, 15,  5);   // lower jaw
        g.fillStyle(MB);  g.fillRect(0,  7,  9,  3);   // open mouth cavity
        g.fillStyle(DK);  g.fillRect(0,  9,  7,  1);   // gum line
        // Teeth — upper
        g.fillStyle(TH);
        g.fillRect(1,  8, 2, 3);
        g.fillRect(4,  8, 2, 3);
        g.fillRect(7,  8, 2, 2);
        // Teeth — lower
        g.fillStyle(TH);
        g.fillRect(2, 10, 2, 2);
        g.fillRect(5, 10, 2, 2);
        // Glowing eye
        g.fillStyle(EY);        g.fillRect(10, 4, 4, 4);
        g.fillStyle(0xffaa00);  g.fillRect(11, 5, 2, 2);  // eye highlight
        g.fillStyle(DK);        g.fillRect(10, 4, 1, 1);  // pupil slit
        g.fillStyle(DK);        g.fillRect(10, 7, 1, 1);

        g.generateTexture(`enemy-eel-${f + 1}`, 52, 18);
      }
    }

    // ── Rushy — cross-legged floating vicar, black jacket, white collar, Man Utd red ─
    {
      const SK  = 0xffcc88;   // skin
      const HR  = 0x1a0a05;   // dark hair
      const JK  = 0x111111;   // black jacket
      const RS  = 0xcc0000;   // Man Utd red shirt
      const CL  = 0xffffff;   // white collar
      const TR  = 0x1a1828;   // dark trousers
      const SH  = 0x080808;   // black shoes
      const EY  = 0x1a1005;   // dark eyes
      const SKD = 0xddaa77;   // skin shadow

      g.clear();

      // Cross-legged lower body (drawn first — torso overlaps top)
      g.fillStyle(TR); g.fillRect(0,  30, 10, 14);   // left knee protruding out
      g.fillStyle(TR); g.fillRect(26, 30, 10, 14);   // right knee protruding out
      g.fillStyle(TR); g.fillRect(4,  33, 28,  9);   // thigh/hip base
      g.fillStyle(TR); g.fillRect(5,  40, 26,  8);   // crossed shin area
      g.fillStyle(0x0a0a18); g.fillRect(17, 34, 2, 6);  // trouser centre crease
      g.fillStyle(SH); g.fillRect(5,  42, 11,  6);   // right foot tucked to left
      g.fillStyle(SH); g.fillRect(20, 42, 11,  6);   // left foot tucked to right

      // Arms + hands
      g.fillStyle(JK); g.fillRect(1,  22, 5, 12);
      g.fillStyle(JK); g.fillRect(30, 22, 5, 12);
      g.fillStyle(SK); g.fillRect(1,  32, 5,  4);
      g.fillStyle(SK); g.fillRect(30, 32, 5,  4);

      // Jacket torso
      g.fillStyle(JK); g.fillRect(6, 17, 24, 18);
      g.fillStyle(RS); g.fillRect(14, 17, 8, 8);     // red shirt at open V-neck
      g.fillStyle(JK); g.fillRect(6,  17, 9, 12);    // left lapel over red
      g.fillStyle(JK); g.fillRect(21, 17, 9, 12);    // right lapel over red

      // Clerical collar
      g.fillStyle(SK);     g.fillRect(14, 13, 8, 5);    // neck skin
      g.fillStyle(CL);     g.fillRect(11, 14, 14, 4);   // white band around throat
      g.fillStyle(CL);     g.fillRect(16, 13,  4, 7);   // white collar tab (the signature piece)
      g.fillStyle(0xcccccc); g.fillRect(11, 16, 14, 2); // collar underside shadow

      // Head
      g.fillStyle(SK);  g.fillCircle(18, 7, 9);          // round face
      g.fillStyle(SK);  g.fillRect(8,  5, 3, 6);          // left ear
      g.fillStyle(SK);  g.fillRect(25, 5, 3, 6);          // right ear
      g.fillStyle(SKD); g.fillRect(9,  6, 2, 4);          // ear shadow
      g.fillStyle(SKD); g.fillRect(26, 6, 2, 4);
      g.fillStyle(HR);  g.fillRect(9,  0, 18, 5);         // top hair
      g.fillStyle(HR);  g.fillRect(9,  3,  3, 4);         // left sideburn
      g.fillStyle(HR);  g.fillRect(24, 3,  3, 4);         // right sideburn
      g.fillStyle(HR);  g.fillRect(12, 5,  4, 1);         // left eyebrow
      g.fillStyle(HR);  g.fillRect(20, 5,  4, 1);         // right eyebrow
      g.fillStyle(EY);  g.fillRect(12, 7,  4, 3);         // left eye
      g.fillStyle(EY);  g.fillRect(20, 7,  4, 3);         // right eye
      g.fillStyle(0xffffff); g.fillRect(12, 7, 2, 1);     // eye highlights
      g.fillStyle(0xffffff); g.fillRect(20, 7, 2, 1);
      g.fillStyle(SKD); g.fillRect(16,  9, 4, 3);         // nose bridge
      g.fillStyle(SKD); g.fillRect(15, 10, 2, 2);         // left nostril
      g.fillStyle(SKD); g.fillRect(19, 10, 2, 2);         // right nostril
      g.fillStyle(0xcc7744); g.fillRect(14, 12, 8, 2);    // lips
      g.fillStyle(0x441100); g.fillRect(15, 13, 6, 1);    // mouth line

      g.generateTexture('enemy-rushy', 36, 48);
    }

    // ── Smaller Bear — brown bear, red shirt, 24×28 ─────────────────────
    {
      const BRN = 0x5c2e0c;   // dark brown
      const FUR = 0x7a4520;   // mid fur
      const SNT = 0xaa6640;   // snout / inner ear / paws
      const EY  = 0x0a0500;   // near-black eyes
      const RSH = 0xcc1100;   // red shirt

      g.clear();
      // Ears
      g.fillStyle(FUR); g.fillRect(1,  0, 5, 5);   g.fillStyle(SNT); g.fillRect(2,  1, 3, 3);  // L
      g.fillStyle(FUR); g.fillRect(18, 0, 5, 5);   g.fillStyle(SNT); g.fillRect(19, 1, 3, 3);  // R
      // Head
      g.fillStyle(FUR); g.fillRect(3, 2, 18, 12);
      // Eyes
      g.fillStyle(EY);       g.fillRect(6,  5, 3, 3);  g.fillStyle(0xffffff); g.fillRect(6,  5, 1, 1);
      g.fillStyle(EY);       g.fillRect(15, 5, 3, 3);  g.fillStyle(0xffffff); g.fillRect(15, 5, 1, 1);
      // Snout + nose
      g.fillStyle(SNT); g.fillRect(8, 9, 8, 5);
      g.fillStyle(EY);  g.fillRect(10, 10, 4, 2);  g.fillRect(11, 12, 2, 1);  // nose + mouth
      // Neck
      g.fillStyle(FUR); g.fillRect(9, 14, 6, 2);
      // Red shirt body
      g.fillStyle(RSH); g.fillRect(3, 16, 18, 8);
      // Arms + paw pads
      g.fillStyle(FUR); g.fillRect(0,  16, 4, 8);  g.fillStyle(SNT); g.fillRect(0,  22, 4, 3);  // L
      g.fillStyle(FUR); g.fillRect(20, 16, 4, 8);  g.fillStyle(SNT); g.fillRect(20, 22, 4, 3);  // R
      // Lower body / fur
      g.fillStyle(FUR); g.fillRect(5, 24, 14, 4);
      g.generateTexture('enemy-smaller-bear', 24, 28);
    }

    // ── Melonhead — 44×60, human body + melon helmet + big mallet, 6 frames ─
    {
      const SK  = 0xffcc88;  const MG  = 0x22aa33;  const MD  = 0x115522;
      const MR  = 0xcc1100;  const QRB = 0x1144aa;  const QRW = 0xffffff;
      const TR  = 0x222233;  const BT  = 0x180808;  const EY  = 0x222222;
      const WD  = 0x7a4010;  const WH  = 0xaa6622;
      const W = 44, H = 60, CX = 18;

      const helmet = () => {
        // Big round watermelon head
        g.fillStyle(MG);  g.fillCircle(CX, 11, 12);
        // Dark vertical stripes
        g.fillStyle(MD);
        g.fillRect(CX-8, 0, 2, 21);  g.fillRect(CX-3, 0, 2, 23);
        g.fillRect(CX+2, 0, 2, 23);  g.fillRect(CX+7, 0, 2, 21);
        // Highlight
        g.fillStyle(0x55dd55); g.fillRect(CX-3, 1, 6, 2);
      };

      const face = () => {
        g.fillStyle(SK);       g.fillRect(CX-7, 15, 14, 8);
        g.fillStyle(EY);       g.fillRect(CX-5, 17, 3, 3);  g.fillRect(CX+2, 17, 3, 3);
        g.fillStyle(QRW);      g.fillRect(CX-5, 17, 1, 1);  g.fillRect(CX+2, 17, 1, 1);
        g.fillStyle(0xcc7744); g.fillRect(CX-2, 21, 4, 2);
      };

      const stripes = (ty: number) => {
        const sc = [QRB, QRW, QRB, QRW, QRB];
        for (let i = 0; i < 5; i++) { g.fillStyle(sc[i]); g.fillRect(CX-9, ty + i*3, 18, 3); }
      };

      const shorts = (ty: number) => { g.fillStyle(TR); g.fillRect(CX-9, ty, 18, 7); };

      const armsIdle = (ty: number) => {
        g.fillStyle(QRB); g.fillRect(CX-13, ty, 4, 9);   g.fillRect(CX+9, ty, 4, 9);
        g.fillStyle(SK);  g.fillRect(CX-13, ty+9, 4, 3); g.fillRect(CX+9, ty+9, 4, 3);
      };

      const armsJump = (ty: number) => {
        g.fillStyle(QRB); g.fillRect(CX-15, ty-4, 4, 10); g.fillRect(CX+11, ty-8, 4, 14);
        g.fillStyle(SK);  g.fillRect(CX-15, ty-7, 5,  4); g.fillRect(CX+11, ty-11, 4, 4);
      };

      const armsWindup = (ty: number) => {
        g.fillStyle(QRB); g.fillRect(CX-13, ty, 4, 9);       // left at side
        g.fillStyle(SK);  g.fillRect(CX-13, ty+9, 4, 3);
        g.fillStyle(QRB); g.fillRect(CX+11, ty-14, 4, 18);   // right arm raised high
        g.fillStyle(SK);  g.fillRect(CX+11, ty-17, 4, 4);
      };

      const armsSwing = (ty: number) => {
        g.fillStyle(QRB); g.fillRect(CX+9, ty, 4, 9);        // right tucked back
        g.fillStyle(SK);  g.fillRect(CX+9, ty+9, 4, 3);
        g.fillStyle(QRB); g.fillRect(CX-12, ty+2, 22, 4);    // left arm: horizontal follow-through
        g.fillStyle(SK);  g.fillRect(CX-16, ty+1, 5, 5);
      };

      const malletDown = () => {
        g.fillStyle(WD);       g.fillRect(30, 27, 4, 25);     // handle
        g.fillStyle(WH);       g.fillRect(23, 16, 18, 11);    // head
        g.fillStyle(0xcc8833); g.fillRect(23, 16, 18,  2);    // top face
        g.fillStyle(0xffeebb); g.fillRect(24, 17,  5,  2);    // highlight
      };

      const malletUp = () => {
        g.fillStyle(WD);       g.fillRect(31, 10, 4, 28);     // handle high
        g.fillStyle(WH);       g.fillRect(23,  4, 18, 8);     // head at top
        g.fillStyle(0xcc8833); g.fillRect(23,  4, 18, 2);
        g.fillStyle(0xffeebb); g.fillRect(24,  5,  5, 2);
      };

      const malletSwing = () => {
        g.fillStyle(WD);       g.fillRect(4, 30, 26, 4);      // handle horizontal
        g.fillStyle(WH);       g.fillRect(0, 20, 12, 16);     // head on left
        g.fillStyle(0xcc8833); g.fillRect(0, 20, 12,  2);
        g.fillStyle(0xffeebb); g.fillRect(1, 21,  4,  2);
      };

      const legsW1 = (ty: number) => {
        g.fillStyle(TR); g.fillRect(CX-9, ty, 7, 6); g.fillRect(CX-8, ty+6, 5, 4);
        g.fillStyle(BT); g.fillRect(CX-10, ty+9, 9, 3);
        g.fillStyle(TR); g.fillRect(CX+2, ty, 7, 4); g.fillRect(CX+3, ty+4, 5, 6);
        g.fillStyle(BT); g.fillRect(CX+1, ty+9, 9, 3);
      };

      const legsW2 = (ty: number) => {
        g.fillStyle(TR); g.fillRect(CX+2, ty, 7, 6); g.fillRect(CX+3, ty+6, 5, 4);
        g.fillStyle(BT); g.fillRect(CX+1, ty+9, 9, 3);
        g.fillStyle(TR); g.fillRect(CX-9, ty, 7, 4); g.fillRect(CX-8, ty+4, 5, 6);
        g.fillStyle(BT); g.fillRect(CX-10, ty+9, 9, 3);
      };

      const legsJump = (ty: number) => {
        g.fillStyle(TR); g.fillRect(CX-11, ty, 8, 5); g.fillRect(CX-12, ty+4, 8, 5);
        g.fillStyle(BT); g.fillRect(CX-13, ty+8, 9, 3);
        g.fillStyle(TR); g.fillRect(CX+3, ty, 8, 5);  g.fillRect(CX+4, ty+4, 8, 5);
        g.fillStyle(BT); g.fillRect(CX+4, ty+8, 9, 3);
      };

      const legsFloat = (ty: number) => {
        g.fillStyle(TR); g.fillRect(CX-8, ty, 6, 10); g.fillRect(CX+2, ty, 6, 10);
        g.fillStyle(BT); g.fillRect(CX-9, ty+9, 8, 3); g.fillRect(CX+1, ty+9, 8, 3);
      };

      const TY = 25, SY = 40, LY = 47;   // torso / shorts / legs y offsets

      // walk-1
      g.clear();
      helmet(); face(); stripes(TY); armsIdle(TY); shorts(SY); legsW1(LY); malletDown();
      g.generateTexture('enemy-melonhead', W, H);

      // walk-2
      g.clear();
      helmet(); face(); stripes(TY); armsIdle(TY); shorts(SY); legsW2(LY); malletDown();
      g.generateTexture('enemy-melonhead-walk-2', W, H);

      // jump
      g.clear();
      helmet(); face(); stripes(TY); armsJump(TY); shorts(SY); legsJump(LY); malletUp();
      g.generateTexture('enemy-melonhead-jump', W, H);

      // float — arms spread wide
      g.clear();
      helmet(); face(); stripes(TY);
      g.fillStyle(QRB); g.fillRect(0, TY, 9, 7);  g.fillStyle(SK); g.fillRect(0, TY+7, 5, 4);
      g.fillStyle(QRB); g.fillRect(27, TY, 9, 7); g.fillStyle(SK); g.fillRect(30, TY+7, 5, 4);
      shorts(SY); legsFloat(LY); malletDown();
      g.generateTexture('enemy-melonhead-float', W, H);

      // swing-1 windup
      g.clear();
      helmet(); face(); stripes(TY); armsWindup(TY); shorts(SY); legsW1(LY); malletUp();
      g.generateTexture('enemy-melonhead-swing-1', W, H);

      // swing-2 impact
      g.clear();
      helmet(); face(); stripes(TY); armsSwing(TY); shorts(SY); legsW2(LY); malletSwing();
      g.generateTexture('enemy-melonhead-swing-2', W, H);
    }

    // ── Clippy — accountant, 8-frame old-man shuffle, 40×50px ──────────────
    {
      const SK  = 0xffcc88; // skin
      const SK2 = 0xb07040; // skin shadow / wrinkles
      const SK3 = 0xffddb0; // forehead highlight
      const HW  = 0xcccccc; // white-grey hair
      const SJ  = 0x35354a; // charcoal suit
      const SJ2 = 0x20202e; // suit deep shadow
      const SJ3 = 0x48485e; // suit pinstripe line
      const WS  = 0xf0f0f0; // white shirt
      const TI  = 0x880033; // burgundy tie
      const TI2 = 0x550020; // tie shadow
      const TR  = 0x3e3e52; // trousers (slightly lighter than jacket)
      const TR2 = 0x28283a; // trouser crease shadow
      const SH  = 0x181000; // shoe dark
      const SH2 = 0x382808; // shoe toe cap highlight
      const CB  = 0xc09050; // clipboard hardboard
      const CB2 = 0x907030; // clipboard shadow edge
      const CP  = 0xffffdc; // clipboard paper cream
      const CC  = 0xaaaaaa; // clipboard clip metal

      // Old man head: bald crown, white side hair, round glasses, jowls
      const drawHead = (hy: number) => {
        const hx = 11;
        // White-grey hair on sides (nearly bald on top)
        g.fillStyle(HW); g.fillRect(hx - 1, hy + 2,  3, 11);  // L side hair
                         g.fillRect(hx + 14,hy + 2,  3, 11);  // R side hair
        // Skin: head crown and face
        g.fillStyle(SK);  g.fillRect(hx,     hy,     15, 14);
        g.fillStyle(SK3); g.fillRect(hx + 3, hy,      7,  3); // forehead shine
        // Age wrinkles (horizontal crease lines)
        g.fillStyle(SK2); g.fillRect(hx + 2, hy + 1,  8,  1);
                          g.fillRect(hx + 3, hy + 3,  6,  1);
        // Lower face shadow (jowls/saggy cheeks)
        g.fillStyle(SK2); g.fillRect(hx,     hy + 10, 3,  4);
                          g.fillRect(hx + 12,hy + 10, 2,  3);
        // Glasses: round wire-rim with tinted lenses
        g.fillStyle(0x141414);
        g.fillRect(hx + 1, hy + 5,  5, 4);  // L lens frame
        g.fillRect(hx + 8, hy + 5,  5, 4);  // R lens frame
        g.fillRect(hx + 6, hy + 6,  2, 2);  // nose bridge
        g.fillRect(hx - 2, hy + 6,  3, 1);  // L temple arm
        g.fillRect(hx + 15,hy + 6,  3, 1);  // R temple arm
        g.fillStyle(0xcce4ff);               // lens tint
        g.fillRect(hx + 2, hy + 6,  3, 2);
        g.fillRect(hx + 9, hy + 6,  3, 2);
        g.fillStyle(0x334455);               // eyes behind lenses
        g.fillRect(hx + 3, hy + 6,  1, 1);
        g.fillRect(hx + 10,hy + 6,  1, 1);
        // Eyebrows (grey, furrowed inner corner = worried accountant)
        g.fillStyle(HW);  g.fillRect(hx + 1, hy + 4,  4,  1);
                          g.fillRect(hx + 8, hy + 4,  4,  1);
        g.fillStyle(SK2); g.fillRect(hx + 1, hy + 4,  1,  1); // L inner frown
                          g.fillRect(hx + 11,hy + 4,  1,  1); // R inner frown
        // Mouth (thin, pursed — deep in thought)
        g.fillStyle(SK2); g.fillRect(hx + 4, hy + 11, 6,  1);
        // Neck
        g.fillStyle(SK);  g.fillRect(hx + 4, hy + 14, 7,  4);
        g.fillStyle(SK2); g.fillRect(hx + 4, hy + 15, 2,  3); // neck shadow
        // White shirt collar spread open
        g.fillStyle(WS);  g.fillRect(hx + 2, hy + 15,12,  3);
        g.fillStyle(WS);  g.fillRect(hx + 3, hy + 17, 1,  2); // L collar point
                          g.fillRect(hx + 11,hy + 17, 1,  2); // R collar point
      };

      // Charcoal pinstripe jacket with shirt-and-tie showing in V
      const drawJacket = (ty: number) => {
        const tx = 8;
        // Full jacket block
        g.fillStyle(SJ);  g.fillRect(tx, ty, 24, 18);
        // Pinstripes (subtle vertical lines every 4px)
        g.fillStyle(SJ3);
        for (let px = 2; px < 24; px += 4) g.fillRect(tx + px, ty, 1, 18);
        // Side depth shadows
        g.fillStyle(SJ2); g.fillRect(tx,      ty + 2, 3, 16);
                          g.fillRect(tx + 21, ty + 2, 3, 16);
        // White shirt front (V-neck opening between lapels)
        g.fillStyle(WS);  g.fillRect(tx + 8,  ty,      8,  4); // collar spread
                          g.fillRect(tx + 9,  ty + 4,  6,  5); // V upper
                          g.fillRect(tx + 10, ty + 9,  4,  5); // V lower
                          g.fillRect(tx + 11, ty + 14, 2,  3); // shirt strip
        // Burgundy tie over shirt
        g.fillStyle(TI);  g.fillRect(tx + 11, ty + 1,  3, 15);
        g.fillStyle(TI2); g.fillRect(tx + 13, ty + 3,  1, 13); // tie R shadow
        g.fillStyle(0xaa0044); g.fillRect(tx + 11, ty,  3,  2); // tie knot
        // Lapel fold shadow lines
        g.fillStyle(SJ2); g.fillRect(tx + 8,  ty + 1,  2,  5); // L lapel
                          g.fillRect(tx + 15, ty + 1,  2,  5); // R lapel
        // Jacket buttons
        g.fillStyle(SJ2); g.fillRect(tx + 12, ty + 13, 1,  1);
                          g.fillRect(tx + 12, ty + 15, 1,  1);
        // Breast pocket (R chest) — very proper accountant detail
        g.fillStyle(SJ3); g.fillRect(tx + 17, ty + 3,  5,  1); // pocket seam
        g.fillStyle(WS);  g.fillRect(tx + 17, ty + 4,  5,  2); // white pocket square
      };

      // Clipboard (hardboard + spring clip + ruled paper + pen marks)
      const drawClipboard = (cby: number) => {
        g.fillStyle(CB);  g.fillRect(0, cby,     13, 15);
        g.fillStyle(CB2); g.fillRect(0, cby + 2,  2, 13); // L shadow
                          g.fillRect(11,cby + 2,  2, 13); // R shadow
        g.fillStyle(CP);  g.fillRect(1, cby + 3, 11, 11); // paper
        // Ruled lines
        g.fillStyle(0xccccaa);
        g.fillRect(2, cby + 5, 9, 1); g.fillRect(2, cby + 7, 9, 1);
        g.fillRect(2, cby + 9, 9, 1); g.fillRect(2, cby + 11,7, 1);
        // Pen marks (he's been filling things in)
        g.fillStyle(0x334466);
        g.fillRect(2, cby + 5, 6, 1); g.fillRect(7, cby + 5,  2, 1);
        g.fillRect(2, cby + 7, 8, 1);
        g.fillRect(2, cby + 9, 4, 1); g.fillRect(7, cby + 9,  3, 1);
        g.fillRect(2, cby + 11,3, 1);
        // Metal spring clip at top
        g.fillStyle(CC);  g.fillRect(3, cby,     7, 3);
        g.fillStyle(0xdddddd); g.fillRect(4, cby, 5, 1); // clip shine
        g.fillStyle(0x666666); g.fillRect(3, cby + 2, 7, 1); // clamp shadow
      };

      // Left hand gripping the clipboard (just hand + cuff visible)
      const drawLeftHand = (ty: number) => {
        g.fillStyle(WS);  g.fillRect(7, ty + 16, 5, 2); // shirt cuff
        g.fillStyle(SK);  g.fillRect(7, ty + 18, 6, 4); // hand
        g.fillStyle(SK2); g.fillRect(7, ty + 19, 2, 3); // hand shadow
      };

      // Right arm (free, barely swings left/right by dx pixels)
      const drawRightArm = (ty: number, dx: number) => {
        const ax = 29 + dx;
        g.fillStyle(SJ);  g.fillRect(ax,     ty,      5, 10);
        g.fillStyle(SJ2); g.fillRect(ax + 2, ty + 3,  3,  7); // sleeve shadow
        g.fillStyle(WS);  g.fillRect(ax,     ty + 10, 5,  2); // cuff
        g.fillStyle(SK);  g.fillRect(ax,     ty + 12, 5,  3); // hand
        g.fillStyle(SK2); g.fillRect(ax,     ty + 13, 2,  2); // hand shadow
      };

      // Lower body: trousers + legs + shoes
      // lx/rx = shoe x-origin; shoes are always at y=44 (ground); body bobs above
      const drawLower = (lx: number, rx: number, by: number) => {
        const hipY    = 36 + by;
        const legTopY = hipY + 5;
        const legH    = Math.max(0, 44 - legTopY);
        // Trouser hip block
        g.fillStyle(TR);  g.fillRect(9,  hipY,  22, 6);
        g.fillStyle(TR2); g.fillRect(9,  hipY + 1, 3, 5); // L shadow
                          g.fillRect(28, hipY + 1, 3, 5); // R shadow
                          g.fillRect(20, hipY,     1, 6); // centre crease
        // L trouser leg column
        if (legH > 0) {
          g.fillStyle(TR);  g.fillRect(lx + 1, legTopY, 7, legH);
          g.fillStyle(TR2); g.fillRect(lx + 2, legTopY + 1, 2, legH - 1);
        }
        // R trouser leg column
        if (legH > 0) {
          g.fillStyle(TR);  g.fillRect(rx + 1, legTopY, 7, legH);
          g.fillStyle(TR2); g.fillRect(rx + 2, legTopY + 1, 2, legH - 1);
        }
        // L dress shoe (oxford, polished dark)
        g.fillStyle(SH);  g.fillRect(lx,     44, 10, 4);
        g.fillStyle(SH2); g.fillRect(lx + 1, 44,  4, 2); // toe cap shine
        g.fillStyle(0x000000); g.fillRect(lx - 1, 47, 12, 2); // sole
        g.fillStyle(SH2); g.fillRect(lx - 1, 47, 12, 1);      // sole highlight
        // R dress shoe
        g.fillStyle(SH);  g.fillRect(rx,     44, 10, 4);
        g.fillStyle(SH2); g.fillRect(rx + 1, 44,  4, 2);
        g.fillStyle(0x000000); g.fillRect(rx - 1, 47, 12, 2);
        g.fillStyle(SH2); g.fillRect(rx - 1, 47, 12, 1);
      };

      // 8 shuffle frames: [lx, rx, bodyOffset, rArmDx]
      // Walking right: rx increases then decreases, lx mirrors; feet barely leave ground
      const shuffles: [number, number, number, number][] = [
        [ 9, 22, 0,  0], // F1 neutral
        [10, 23, 0, -1], // F2 R advances slightly, arm back
        [11, 23, 1,  0], // F3 L steps, bob down
        [12, 22, 1,  1], // F4 L forward, R starts trailing
        [12, 21, 0,  0], // F5 weight over L, R lifting
        [11, 23, 0, -1], // F6 R stepping, arm swings
        [10, 24, 1,  0], // F7 R contact, bob
        [ 9, 24, 1,  1], // F8 R forward, L trailing
      ];

      shuffles.forEach(([lx, rx, by, dx], i) => {
        g.clear();
        const jy = 18 + by;  // jacket top (whole body shifts with bob)

        drawClipboard(jy + 6);      // behind body
        drawHead(by);
        drawJacket(jy);
        drawLeftHand(jy);
        drawRightArm(jy + 1, dx);
        drawLower(lx, rx, by);

        const key = i === 0 ? 'enemy-clippy' : `enemy-clippy-${i + 1}`;
        g.generateTexture(key, 40, 50);
      });

      // 4 scratch frames: right arm raised to temple, hand rubs back and forth
      const drawScratchArm = (ty: number, hy: number, dy: number) => {
        // Upper arm going up from shoulder
        g.fillStyle(SJ);  g.fillRect(29, ty - 9, 4, 9);
        g.fillStyle(SJ2); g.fillRect(31, ty - 7, 2, 7);
        // Elbow connecting joint
        g.fillStyle(SJ);  g.fillRect(26, ty - 10, 7, 3);
        // Forearm angling up-left toward head
        g.fillStyle(SJ);  g.fillRect(26, ty - 15 + dy, 4, 7);
        g.fillStyle(SJ2); g.fillRect(28, ty - 14 + dy, 2, 6);
        // Cuff at wrist
        g.fillStyle(WS);  g.fillRect(25, ty - 16 + dy, 5, 2);
        // Hand at temple
        g.fillStyle(SK);  g.fillRect(24, hy + 3 + dy, 5, 4);
        g.fillStyle(SK2); g.fillRect(25, hy + 4 + dy, 2, 3);
      };

      // Alternate dy=0 / dy=-1 for the rubbing motion
      [0, -1, 0, -1].forEach((dy, i) => {
        g.clear();
        const jy = 18, hy = 0;
        drawClipboard(jy + 6);
        drawHead(hy);
        drawJacket(jy);
        drawLeftHand(jy);
        drawScratchArm(jy, hy, dy);
        drawLower(9, 22, hy);
        g.generateTexture(`enemy-clippy-scratch-${i + 1}`, 40, 50);
      });
    }

    // ── Butter Fingers — 14 frames, 40×56px, khaki jacket, red shirt, blond ──
    {
      const BW = 40, BH = 56;
      const SK = 0xffcc88;  // skin
      const HR = 0xffdd22;  // blond hair
      const JK = 0xb8a060;  // khaki jacket
      const JD = 0x9a8040;  // jacket dark seam
      const RS = 0xcc2222;  // red shirt
      const JN = 0x334466;  // jeans
      const SH = 0xf0f0f0;  // white shoes
      const EY = 0x1a2a1a;  // dark eyes

      // head at (hx,hy): hair+face+neck = 18px tall
      const bfHd = (hx: number, hy: number) => {
        g.fillStyle(HR); g.fillRect(hx, hy, 14, 5); g.fillRect(hx - 1, hy + 1, 3, 6);
        g.fillStyle(SK); g.fillRect(hx, hy + 4, 14, 11);
        g.fillStyle(EY); g.fillRect(hx + 2, hy + 7, 3, 3); g.fillRect(hx + 9, hy + 7, 3, 3);
        g.fillStyle(0xffffff); g.fillRect(hx + 2, hy + 7, 1, 1); g.fillRect(hx + 9, hy + 7, 1, 1);
        g.fillStyle(SK); g.fillRect(hx + 4, hy + 15, 6, 3);
      };
      // torso at (tx,ty): jacket over red shirt = 15px tall
      const bfTr = (tx: number, ty: number) => {
        g.fillStyle(RS); g.fillRect(tx + 5, ty, 14, 15);
        g.fillStyle(JK); g.fillRect(tx, ty, 24, 4);
        g.fillStyle(JK); g.fillRect(tx, ty + 4, 6, 11); g.fillRect(tx + 18, ty + 4, 6, 11);
        g.fillStyle(JD); g.fillRect(tx + 11, ty + 4, 2, 11);
      };
      // hips at (hx,hy): jeans waistband = 5px
      const bfHip = (hx: number, hy: number) => {
        g.fillStyle(JN); g.fillRect(hx, hy, 20, 5);
      };
      // standing legs+shoes at (lx,ly)
      const bfLegs = (lx: number, ly: number) => {
        g.fillStyle(JN);
        g.fillRect(lx + 2, ly, 7, 11); g.fillRect(lx + 11, ly, 7, 11);
        g.fillStyle(SH);
        g.fillRect(lx, ly + 9, 10, 5); g.fillRect(lx + 9, ly + 9, 10, 5);
      };

      // ── 1: Idle-1 ─────────────────────────────────────────────────────────
      g.clear();
      bfHd(13, 0); bfTr(8, 18); bfHip(10, 33);
      g.fillStyle(JK); g.fillRect(3, 20, 6, 9); g.fillRect(31, 20, 6, 9);
      g.fillStyle(SK); g.fillRect(3, 28, 5, 4); g.fillRect(31, 28, 5, 4);
      bfLegs(8, 38);
      g.generateTexture('enemy-butter-fingers', BW, BH);

      // ── 2: Idle-2 (slight arm sway) ───────────────────────────────────────
      g.clear();
      bfHd(13, 0); bfTr(8, 18); bfHip(10, 33);
      g.fillStyle(JK); g.fillRect(2, 19, 6, 9); g.fillRect(32, 21, 6, 9);
      g.fillStyle(SK); g.fillRect(2, 27, 5, 4); g.fillRect(32, 29, 5, 4);
      bfLegs(8, 38);
      g.generateTexture('enemy-butter-fingers-walk-2', BW, BH);

      // ── 3: Throw-1 — winding up, arms bracing down ────────────────────────
      g.clear();
      bfHd(13, 1); bfTr(8, 19); bfHip(10, 34);
      g.fillStyle(JK); g.fillRect(1, 22, 7, 8); g.fillRect(32, 22, 7, 8);
      g.fillStyle(SK); g.fillRect(1, 29, 5, 4); g.fillRect(33, 29, 5, 4);
      g.fillStyle(JN); g.fillRect(10, 38, 7, 10); g.fillRect(22, 38, 7, 10);
      g.fillStyle(SH); g.fillRect(8, 48, 10, 5); g.fillRect(21, 48, 10, 5);
      g.generateTexture('enemy-butter-fingers-throw-1', BW, BH);

      // ── 4: Throw-2 — arms fully raised overhead (crate just spawned) ──────
      g.clear();
      bfHd(13, 4); bfTr(8, 22); bfHip(10, 37);
      g.fillStyle(JK); g.fillRect(3, 4, 6, 20); g.fillRect(31, 4, 6, 20);
      g.fillStyle(SK); g.fillRect(3, 1, 5, 5); g.fillRect(31, 1, 5, 5);
      bfLegs(8, 42);
      g.generateTexture('enemy-butter-fingers-throw-2', BW, BH);

      // ── 5: Throw-3 — arms sweeping forward/outward ────────────────────────
      g.clear();
      bfHd(12, 2); bfTr(7, 20); bfHip(9, 35);
      g.fillStyle(JK); g.fillRect(0, 21, 8, 6); g.fillRect(32, 21, 8, 6);
      g.fillStyle(SK); g.fillRect(0, 20, 5, 4); g.fillRect(35, 20, 5, 4);
      bfLegs(8, 40);
      g.generateTexture('enemy-butter-fingers-throw-3', BW, BH);

      // ── 6: Throw-4 — follow-through, torso bent forward ───────────────────
      g.clear();
      bfHd(11, 4); bfTr(6, 22); bfHip(8, 37);
      g.fillStyle(JK); g.fillRect(0, 26, 7, 8); g.fillRect(33, 26, 7, 8);
      g.fillStyle(SK); g.fillRect(0, 33, 5, 4); g.fillRect(34, 33, 5, 4);
      bfLegs(8, 42);
      g.generateTexture('enemy-butter-fingers-throw-4', BW, BH);

      // ── 7: Jump — body spread in arc ──────────────────────────────────────
      g.clear();
      bfHd(13, 1); bfTr(8, 19); bfHip(10, 34);
      g.fillStyle(JK); g.fillRect(0, 20, 7, 8); g.fillRect(33, 20, 7, 8);
      g.fillStyle(SK); g.fillRect(0, 19, 5, 4); g.fillRect(35, 19, 5, 4);
      g.fillStyle(JN); g.fillRect(12, 38, 7, 9); g.fillRect(21, 37, 7, 9);
      g.fillStyle(SH); g.fillRect(10, 46, 10, 5); g.fillRect(20, 45, 10, 5);
      g.generateTexture('enemy-butter-fingers-jump', BW, BH);

      // ── 8–11: Roll frames (sideways barrel roll) ──────────────────────────
      // Roll-1: entering tuck, head forward, arms drawing in
      g.clear();
      g.fillStyle(HR); g.fillRect(18, 8, 14, 5); g.fillRect(17, 9, 3, 5);
      g.fillStyle(SK); g.fillRect(18, 12, 14, 10);
      g.fillStyle(EY); g.fillRect(20, 15, 3, 3); g.fillRect(27, 15, 3, 3);
      g.fillStyle(0xffffff); g.fillRect(20, 15, 1, 1); g.fillRect(27, 15, 1, 1);
      g.fillStyle(RS); g.fillRect(10, 22, 18, 9);
      g.fillStyle(JK); g.fillRect(8, 20, 22, 4); g.fillRect(8, 24, 7, 7); g.fillRect(23, 24, 7, 7);
      g.fillStyle(JD); g.fillRect(18, 24, 2, 7);
      g.fillStyle(JK); g.fillRect(2, 22, 7, 8); g.fillRect(31, 22, 7, 8);
      g.fillStyle(SK); g.fillRect(2, 29, 5, 3); g.fillRect(32, 29, 5, 3);
      g.fillStyle(JN); g.fillRect(8, 31, 18, 9);
      g.fillStyle(SH); g.fillRect(5, 39, 10, 5); g.fillRect(25, 38, 10, 5);
      g.generateTexture('enemy-butter-fingers-roll-1', BW, BH);

      // Roll-2: fully tucked, body compact and horizontal
      g.clear();
      g.fillStyle(HR); g.fillRect(24, 14, 12, 5);
      g.fillStyle(SK); g.fillRect(24, 18, 12, 8);
      g.fillStyle(EY); g.fillRect(26, 21, 2, 2); g.fillRect(30, 21, 2, 2);
      g.fillStyle(RS); g.fillRect(8, 18, 18, 11);
      g.fillStyle(JK); g.fillRect(6, 16, 22, 4); g.fillRect(6, 20, 7, 9); g.fillRect(21, 20, 7, 9);
      g.fillStyle(JD); g.fillRect(16, 20, 2, 9);
      g.fillStyle(JK); g.fillRect(3, 18, 5, 9); g.fillRect(32, 18, 5, 9);
      g.fillStyle(SK); g.fillRect(3, 26, 4, 3); g.fillRect(33, 26, 4, 3);
      g.fillStyle(JN); g.fillRect(4, 29, 22, 8);
      g.fillStyle(SH); g.fillRect(2, 36, 10, 5); g.fillRect(28, 35, 10, 5);
      g.generateTexture('enemy-butter-fingers-roll-2', BW, BH);

      // Roll-3: over the apex, starting to uncurl other side
      g.clear();
      g.fillStyle(HR); g.fillRect(4, 14, 12, 5);
      g.fillStyle(SK); g.fillRect(4, 18, 12, 8);
      g.fillStyle(EY); g.fillRect(6, 21, 2, 2); g.fillRect(10, 21, 2, 2);
      g.fillStyle(RS); g.fillRect(14, 18, 18, 11);
      g.fillStyle(JK); g.fillRect(12, 16, 22, 4); g.fillRect(12, 20, 7, 9); g.fillRect(27, 20, 7, 9);
      g.fillStyle(JD); g.fillRect(22, 20, 2, 9);
      g.fillStyle(JK); g.fillRect(3, 18, 5, 9); g.fillRect(32, 18, 5, 9);
      g.fillStyle(SK); g.fillRect(3, 26, 4, 3); g.fillRect(33, 26, 4, 3);
      g.fillStyle(JN); g.fillRect(14, 29, 22, 8);
      g.fillStyle(SH); g.fillRect(10, 36, 10, 5); g.fillRect(30, 35, 10, 5);
      g.generateTexture('enemy-butter-fingers-roll-3', BW, BH);

      // Roll-4: coming upright, arms extending back out
      g.clear();
      g.fillStyle(HR); g.fillRect(8, 8, 14, 5); g.fillRect(7, 9, 3, 5);
      g.fillStyle(SK); g.fillRect(8, 12, 14, 10);
      g.fillStyle(EY); g.fillRect(10, 15, 3, 3); g.fillRect(17, 15, 3, 3);
      g.fillStyle(0xffffff); g.fillRect(10, 15, 1, 1); g.fillRect(17, 15, 1, 1);
      g.fillStyle(RS); g.fillRect(10, 22, 18, 9);
      g.fillStyle(JK); g.fillRect(8, 20, 22, 4); g.fillRect(8, 24, 7, 7); g.fillRect(23, 24, 7, 7);
      g.fillStyle(JD); g.fillRect(18, 24, 2, 7);
      g.fillStyle(JK); g.fillRect(2, 22, 7, 8); g.fillRect(31, 22, 7, 8);
      g.fillStyle(SK); g.fillRect(2, 29, 5, 3); g.fillRect(32, 29, 5, 3);
      g.fillStyle(JN); g.fillRect(8, 31, 18, 9);
      g.fillStyle(SH); g.fillRect(5, 39, 10, 5); g.fillRect(25, 38, 10, 5);
      g.generateTexture('enemy-butter-fingers-roll-4', BW, BH);

      // ── 12: Pie-1 — arm pulled back winding up ────────────────────────────
      g.clear();
      bfHd(13, 0); bfTr(8, 18); bfHip(10, 33);
      g.fillStyle(JK); g.fillRect(3, 20, 6, 9);
      g.fillStyle(SK); g.fillRect(3, 28, 5, 4);
      g.fillStyle(JK); g.fillRect(31, 15, 7, 9);
      g.fillStyle(SK); g.fillRect(33, 11, 5, 5);
      bfLegs(8, 38);
      g.generateTexture('enemy-butter-fingers-pie-1', BW, BH);

      // ── 13: Pie-2 — arm fully extended forward, throwing ──────────────────
      g.clear();
      bfHd(13, 0); bfTr(8, 18); bfHip(10, 33);
      g.fillStyle(JK); g.fillRect(31, 19, 8, 6);
      g.fillStyle(SK); g.fillRect(37, 17, 5, 5);
      g.fillStyle(JK); g.fillRect(2, 20, 7, 8);
      g.fillStyle(SK); g.fillRect(1, 20, 4, 4);
      bfLegs(8, 38);
      g.generateTexture('enemy-butter-fingers-pie-2', BW, BH);

      // ── 14: Pie-3 — follow-through, arm settling ──────────────────────────
      g.clear();
      bfHd(13, 0); bfTr(8, 18); bfHip(10, 33);
      g.fillStyle(JK); g.fillRect(31, 19, 7, 9);
      g.fillStyle(SK); g.fillRect(32, 27, 5, 4);
      g.fillStyle(JK); g.fillRect(3, 20, 6, 9);
      g.fillStyle(SK); g.fillRect(3, 28, 5, 4);
      bfLegs(8, 38);
      g.generateTexture('enemy-butter-fingers-pie-3', BW, BH);
    }

    // ── Padel Punisher — evil purple padel villain, 8 frames, 40×50px ────────
    {
      const PU  = 0x6600cc;  // main purple
      const PU2 = 0x440088;  // purple shadow
      const PU3 = 0x220044;  // deep shadow
      const PU4 = 0x9944ff;  // highlight
      const MK  = 0x0e000e;  // mask near-black
      const ME  = 0xff3300;  // eye red glow
      const ME2 = 0xff8833;  // eye outer halo
      const SK  = 0xffcc88;  // skin
      const SK2 = 0xcc9955;  // skin shadow
      const BT  = 0x080008;  // boot black
      const BT2 = 0x281848;  // boot highlight
      const GL  = 0xeecc00;  // gold belt/trim
      const GL2 = 0xcc9900;  // gold shadow
      const WB  = 0xffffff;  // wristband white
      const WB2 = 0xcccccc;  // wristband grey
      const RC  = 0x4400aa;  // racket frame
      const RG  = 0x9955ee;  // racket face
      const RH  = 0x1a0044;  // racket holes
      const GRP = 0x110022;  // grip dark
      const GRP2= 0x441166;  // grip wrap light

      // Evil mask: crown fin + face plate + glowing eye slits + chin
      const ppMask = (mx: number, my: number) => {
        g.fillStyle(PU4); g.fillRect(mx + 5, my,     6, 2);   // crown fin tip
        g.fillStyle(PU);  g.fillRect(mx + 4, my + 1, 8, 2);   // crown base
        g.fillStyle(MK);  g.fillRect(mx, my + 2, 20, 13);     // face plate
        g.fillStyle(PU2); g.fillRect(mx - 2, my + 4, 3, 7);   // L flange
                          g.fillRect(mx + 19,my + 4, 3, 7);   // R flange
        g.fillStyle(ME2); g.fillRect(mx + 1, my + 6, 7, 3);   // L glow
                          g.fillRect(mx + 12,my + 6, 7, 3);   // R glow
        g.fillStyle(ME);  g.fillRect(mx + 2, my + 7, 5, 1);   // L eye slit
                          g.fillRect(mx + 13,my + 7, 5, 1);   // R eye slit
        g.fillStyle(PU3); g.fillRect(mx + 3, my + 14, 14, 2); // chin plate
        g.fillStyle(SK);  g.fillRect(mx + 6, my + 15,  8, 3); // neck skin
        g.fillStyle(SK2); g.fillRect(mx + 6, my + 16,  4, 2); // neck shadow
      };

      // Suit torso: wide shoulders + chest block + gold belt
      const ppBody = (ty: number) => {
        g.fillStyle(PU4); g.fillRect(3,  ty - 2, 34, 2);   // shoulder highlight
        g.fillStyle(PU);  g.fillRect(5,  ty,     30, 2);   // shoulder body
        g.fillStyle(PU);  g.fillRect(7,  ty + 2, 26, 13);  // chest
        g.fillStyle(PU2); g.fillRect(7,  ty + 3,  5, 12);  // L shadow
                          g.fillRect(28, ty + 3,  5, 12);  // R shadow
        g.fillStyle(PU3); g.fillRect(19, ty + 4,  2, 11);  // centre seam
        g.fillStyle(GL);  g.fillRect(6,  ty + 15, 28, 3);  // gold belt
        g.fillStyle(GL2); g.fillRect(6,  ty + 17, 28, 1);  // belt lower edge
        g.fillStyle(GL);  g.fillRect(16, ty + 15,  8, 3);  // buckle
        g.fillStyle(0xffee88); g.fillRect(17, ty + 16, 6, 1); // buckle shine
      };

      // Hips + leg columns
      const ppLegs = (lx: number, rx: number, hipY: number) => {
        g.fillStyle(PU);  g.fillRect(8, hipY, 24, 5);
        g.fillStyle(PU2); g.fillRect(8, hipY + 1, 4, 4);
                          g.fillRect(28,hipY + 1, 4, 4);
                          g.fillRect(20,hipY,     1, 5);
        const lT = hipY + 5;
        const lH = 44 - lT;
        if (lH > 0) {
          g.fillStyle(PU);  g.fillRect(lx,     lT, 7, lH);
          g.fillStyle(PU2); g.fillRect(lx + 1, lT + 1, 3, lH - 1);
        }
        const rH = 44 - lT;
        if (rH > 0) {
          g.fillStyle(PU);  g.fillRect(rx,     lT, 7, rH);
          g.fillStyle(PU2); g.fillRect(rx + 1, lT + 1, 3, rH - 1);
        }
      };

      // Black boots with gold ankle trim
      const ppShoes = (lx: number, rx: number) => {
        g.fillStyle(BT);  g.fillRect(lx, 44, 12, 5);
        g.fillStyle(BT2); g.fillRect(lx + 1, 44, 5, 2);
        g.fillStyle(GL);  g.fillRect(lx + 9, 44, 3, 5);
        g.fillStyle(0x000000); g.fillRect(lx - 1, 48, 14, 2);
        g.fillStyle(PU3); g.fillRect(lx, 48, 12, 1);
        g.fillStyle(BT);  g.fillRect(rx, 44, 12, 5);
        g.fillStyle(BT2); g.fillRect(rx + 1, 44, 5, 2);
        g.fillStyle(GL);  g.fillRect(rx + 9, 44, 3, 5);
        g.fillStyle(0x000000); g.fillRect(rx - 1, 48, 14, 2);
        g.fillStyle(PU3); g.fillRect(rx, 48, 12, 1);
      };

      // White wristband
      const ppWB = (wx: number, wy: number, w: number) => {
        g.fillStyle(WB);  g.fillRect(wx, wy, w, 3);
        g.fillStyle(WB2); g.fillRect(wx, wy + 2, w, 1);
      };

      // Gripping hand
      const ppHand = (hx: number, hy: number, w: number = 6) => {
        g.fillStyle(SK);  g.fillRect(hx, hy, w, 4);
        g.fillStyle(SK2); g.fillRect(hx, hy + 2, 2, 2);
      };

      // Right (trailing) arm: sleeve + wristband + hand, hanging at right side
      const ppRArm = (ay: number, dx: number = 0) => {
        const ax = 28 + dx;
        g.fillStyle(PU);  g.fillRect(ax, ay, 6, 9);
        g.fillStyle(PU2); g.fillRect(ax + 4, ay + 2, 2, 7);
        ppWB(ax - 1, ay + 9, 7);
        ppHand(ax, ay + 11, 6);
      };

      // Racket: VERTICAL (idle carry) — head at (rx, ry), 9×24 total
      const ppRacketV = (rx: number, ry: number) => {
        g.fillStyle(RC);  g.fillRect(rx, ry, 9, 11);
        g.fillStyle(RG);  g.fillRect(rx + 1, ry + 1, 7, 9);
        g.fillStyle(RH);
        g.fillRect(rx + 2, ry + 2, 2, 3); g.fillRect(rx + 5, ry + 2, 2, 3);
        g.fillRect(rx + 2, ry + 6, 2, 3); g.fillRect(rx + 5, ry + 6, 2, 3);
        g.fillStyle(RC);  g.fillRect(rx + 2, ry + 11, 5, 3);   // throat
        g.fillStyle(GRP); g.fillRect(rx + 2, ry + 14, 5, 8);   // grip
        g.fillStyle(GRP2);g.fillRect(rx + 3, ry + 15, 2, 6);
        g.fillStyle(RC);  g.fillRect(rx + 1, ry + 22, 7, 2);   // butt cap
      };

      // Racket: DIAGONAL UP-RIGHT (wind-up, racket pulled back high-right)
      // hx/hy = top-left of head area
      const ppRacketWU = (hx: number, hy: number) => {
        g.fillStyle(RC);  g.fillRect(hx, hy, 10, 9);
        g.fillStyle(RG);  g.fillRect(hx + 1, hy + 1, 8, 7);
        g.fillStyle(RH);
        g.fillRect(hx + 2, hy + 2, 2, 2); g.fillRect(hx + 6, hy + 2, 2, 2);
        g.fillRect(hx + 2, hy + 5, 2, 2); g.fillRect(hx + 6, hy + 5, 2, 2);
        g.fillStyle(RC);  g.fillRect(hx - 1, hy + 8, 4, 3);    // throat step 1
                          g.fillRect(hx - 3, hy + 10, 4, 4);   // throat step 2
        g.fillStyle(GRP); g.fillRect(hx - 6, hy + 13, 4, 8);   // grip
        g.fillStyle(GRP2);g.fillRect(hx - 5, hy + 14, 2, 6);
        g.fillStyle(RC);  g.fillRect(hx - 7, hy + 20, 6, 2);   // butt cap
      };

      // Racket: STRIKE (tilted up-left at contact, head upper-left)
      const ppRacketStrike = (hx: number, hy: number) => {
        g.fillStyle(RC);  g.fillRect(hx, hy, 10, 10);
        g.fillStyle(RG);  g.fillRect(hx + 1, hy + 1, 8, 8);
        g.fillStyle(RH);
        g.fillRect(hx + 2, hy + 2, 2, 3); g.fillRect(hx + 5, hy + 2, 2, 3);
        g.fillRect(hx + 2, hy + 6, 2, 2); g.fillRect(hx + 5, hy + 6, 2, 2);
        g.fillStyle(RC);  g.fillRect(hx + 8, hy + 7, 4, 4);    // throat
                          g.fillRect(hx + 10,hy + 10, 4, 4);
        g.fillStyle(GRP); g.fillRect(hx + 13,hy + 13, 5, 8);   // grip
        g.fillStyle(GRP2);g.fillRect(hx + 14,hy + 14, 3, 6);
        g.fillStyle(RC);  g.fillRect(hx + 12,hy + 21, 7, 2);   // butt cap
      };

      // Racket: FOLLOW-THROUGH (sweep diagonal, head going left-down)
      const ppRacketFT = (hx: number, hy: number) => {
        g.fillStyle(RC);  g.fillRect(hx, hy, 11, 9);
        g.fillStyle(RG);  g.fillRect(hx + 1, hy + 1, 9, 7);
        g.fillStyle(RH);
        g.fillRect(hx + 2, hy + 2, 2, 2); g.fillRect(hx + 7, hy + 2, 2, 2);
        g.fillRect(hx + 2, hy + 5, 2, 2); g.fillRect(hx + 7, hy + 5, 2, 2);
        g.fillStyle(RC);  g.fillRect(hx + 10, hy + 4, 4, 4);   // throat
                          g.fillRect(hx + 13, hy + 7, 4, 4);
        g.fillStyle(GRP); g.fillRect(hx + 16, hy + 10, 8, 4);  // horizontal grip
        g.fillStyle(GRP2);g.fillRect(hx + 17, hy + 11, 6, 2);
        g.fillStyle(RC);  g.fillRect(hx + 23, hy + 9, 3, 6);   // butt cap
      };

      // ── Frame 1: WAIT-1 — ready stance, racket vertical at left, watching ──
      g.clear();
      ppRacketV(1, 10);
      g.fillStyle(PU);  g.fillRect(3, 17, 8, 8);    // L arm upper sleeve
      g.fillStyle(PU2); g.fillRect(3, 19, 3, 6);
      ppWB(2, 25, 8);
      ppHand(3, 27, 5);
      ppMask(10, 0);
      ppBody(17);
      ppRArm(17);
      ppLegs(8, 21, 33);
      ppShoes(6, 18);
      g.generateTexture('enemy-padel-punisher', 40, 50);

      // ── Frame 2: WAIT-2 — slight head lean left tracking ball ──
      g.clear();
      ppRacketV(1, 9);
      g.fillStyle(PU);  g.fillRect(3, 16, 8, 9);
      g.fillStyle(PU2); g.fillRect(3, 18, 3, 7);
      ppWB(2, 25, 8);
      ppHand(3, 27, 5);
      ppMask(9, 0);                                  // head shifted 1px left (tracking)
      ppBody(17);
      ppRArm(17, 1);
      ppLegs(8, 21, 33);
      ppShoes(6, 18);
      g.generateTexture('enemy-padel-punisher-wait-2', 40, 50);

      // ── Frame 3: WINDUP-1 — body starts coiling right, racket moves back ──
      g.clear();
      // Racket still at left but moving centre
      ppRacketV(5, 9);
      g.fillStyle(PU);  g.fillRect(5, 17, 7, 8);    // L arm reaching for racket
      g.fillStyle(PU2); g.fillRect(5, 19, 3, 6);
      ppWB(4, 25, 7);
      ppHand(5, 27, 5);
      ppMask(11, 0);
      ppBody(17);
      ppRArm(17, 0);
      ppLegs(7, 22, 33);                             // feet slightly widening
      ppShoes(5, 19);
      g.generateTexture('enemy-padel-punisher-windup-1', 40, 50);

      // ── Frame 4: WINDUP-2 — full coil, racket pulled high-right behind body ──
      g.clear();
      // Racket on right side high-up (head at x=22,y=0)
      ppRacketWU(22, 1);
      // L arm reaching across body to grab racket on right side
      g.fillStyle(PU);  g.fillRect(8,  17, 16, 5);  // arm crossing body
      g.fillStyle(PU2); g.fillRect(8,  19, 5, 3);
      g.fillStyle(PU);  g.fillRect(16, 11, 7, 8);   // forearm going up-right
      g.fillStyle(PU2); g.fillRect(20, 12, 3, 6);
      ppWB(15, 10, 7);
      ppHand(16, 8, 6);
      ppMask(11, 1);                                 // slight head lean into coil
      ppBody(18);                                    // body raised (weight loading)
      ppRArm(18, 2);                                 // right arm pulled back with coil
      ppLegs(6, 23, 34);                             // wide athletic stance
      ppShoes(5, 20);
      g.generateTexture('enemy-padel-punisher-windup-2', 40, 50);

      // ── Frame 5: WINDUP-3 — peak tension, racket highest, maximum coil ──
      g.clear();
      ppRacketWU(24, 0);                             // racket even further right/higher
      g.fillStyle(PU);  g.fillRect(9,  16, 17, 5);  // arm spanning body
      g.fillStyle(PU2); g.fillRect(9,  18, 5, 3);
      g.fillStyle(PU);  g.fillRect(18, 9, 8, 8);    // forearm up
      g.fillStyle(PU2); g.fillRect(22, 10, 3, 6);
      ppWB(17, 8, 8);
      ppHand(18, 6, 6);
      ppMask(12, 0);                                 // head turned slightly right
      ppBody(17);
      ppRArm(17, 3);                                 // right arm pulled furthest back
      ppLegs(6, 23, 33);
      ppShoes(5, 20);
      g.generateTexture('enemy-padel-punisher-windup-3', 40, 50);

      // ── Frame 6: STRIKE — arm fully extended up-left at contact ──
      g.clear();
      // Racket at upper-left (strike position)
      ppRacketStrike(0, 2);
      // Left arm fully extended up-left: shoulder→elbow→wrist
      g.fillStyle(PU);  g.fillRect(6, 18, 8, 4);    // upper arm from shoulder
      g.fillStyle(PU2); g.fillRect(6, 20, 3, 2);
      g.fillStyle(PU);  g.fillRect(5, 13, 5, 6);    // forearm up-left
      g.fillStyle(PU2); g.fillRect(8, 14, 2, 5);
      ppWB(4, 12, 6);
      ppHand(5, 14, 5);
      ppMask(11, 1);                                 // head leaning into strike
      ppBody(18);                                    // body leaning forward
      ppRArm(18, 0);
      ppLegs(7, 22, 34);
      ppShoes(6, 20);
      g.generateTexture('enemy-padel-punisher-strike', 40, 50);

      // ── Frame 7: FOLLOW-1 — racket sweeping through, body releasing ──
      g.clear();
      ppRacketFT(0, 6);                              // racket head left, sweeping down-right
      g.fillStyle(PU);  g.fillRect(3, 17, 9, 8);    // L arm following through
      g.fillStyle(PU2); g.fillRect(3, 19, 4, 6);
      g.fillStyle(PU);  g.fillRect(4, 14, 6, 4);    // forearm still extended
      g.fillStyle(PU2); g.fillRect(8, 15, 2, 3);
      ppWB(3, 13, 6);
      ppHand(4, 14, 5);
      ppMask(11, 0);
      ppBody(17);
      ppRArm(17, -1);
      ppLegs(8, 21, 33);
      ppShoes(6, 18);
      g.generateTexture('enemy-padel-punisher-follow-1', 40, 50);

      // ── Frame 8: FOLLOW-2 — recovery, racket settling, ready again ──
      g.clear();
      ppRacketV(3, 11);                              // racket returning to front-vertical
      g.fillStyle(PU);  g.fillRect(4, 17, 8, 9);    // arm returning
      g.fillStyle(PU2); g.fillRect(4, 19, 3, 7);
      ppWB(3, 26, 8);
      ppHand(4, 28, 5);
      ppMask(10, 0);
      ppBody(17);
      ppRArm(17, 0);
      ppLegs(8, 21, 33);
      ppShoes(6, 18);
      g.generateTexture('enemy-padel-punisher-follow-2', 40, 50);
    }

    // ── Condor — half-man half-condor, Crystal Palace kit, 80×50, 12 wing-flap frames ─
    // Body is 18px wide centred at x=40. Wings span tip-to-tip ≈ 79px.
    {
      const W = 80, H = 50;

      // Palette
      const CPR  = 0xc4122e;  // Crystal Palace red
      const CPR2 = 0x8a0d1f;  // CP red shadow
      const CPB  = 0x1b5ebf;  // Crystal Palace blue
      const CPB2 = 0x123d80;  // CP blue shadow
      const CPW  = 0xf6f6f6;  // white (shorts, collar)
      const CPW2 = 0xbbbbbb;  // white shadow
      const SK   = 0xf0c088;  // leg skin
      const SK2  = 0xc07040;  // leg shadow
      const HDS  = 0xdf5c4a;  // condor head skin (bald reddish-pink)
      const HDS2 = 0xa83030;  // head shadow
      const BKC  = 0xe8b420;  // beak yellow
      const BKC2 = 0xa87010;  // beak shadow
      const EYC  = 0x141414;  // eye
      const RUF  = 0xeeeeee;  // white neck ruff
      const RUF2 = 0x999999;  // ruff shadow
      const WF   = 0x0c0c16;  // wing feathers main (near-black)
      const WF2  = 0x22223a;  // secondary coverts (dark blue-gray)
      const WH   = 0x3e3e60;  // wing highlight (iridescent sheen)
      const WW   = 0xd0d0da;  // underwing white patch (condor characteristic)
      const TAL  = 0x504010;  // talon dark
      const TAL2 = 0x906820;  // talon highlight
      const GLD  = 0xffd700;  // badge gold

      // Body centred at x=40: left edge=31, right edge=48
      // Left wing: shoulder (31,17), trailing (32,30)
      const drawLeftWing = (tipX: number, tipY: number, fold: boolean) => {
        const ax = 31, ay = 17;
        const trailX = fold ? 36 : 32;
        const trailY = fold ? 27 : 30;

        g.fillStyle(WF);
        g.fillTriangle(ax, ay, tipX, tipY, trailX, trailY);

        const iMx = Math.round(ax + (tipX - ax) * 0.42);
        const iMy = Math.round(ay + (tipY - ay) * 0.42);
        g.fillStyle(WF2);
        g.fillTriangle(ax + 1, ay + 3, iMx, iMy + 2, trailX, trailY);

        const wEx = Math.round(ax + (tipX - ax) * 0.28);
        const wEy = Math.round(ay + (tipY - ay) * 0.28);
        g.fillStyle(WW);
        g.fillTriangle(ax + 1, ay + 5, wEx, wEy + 2, trailX - 1, trailY - 4);

        const lEx = Math.round(ax + (tipX - ax) * 0.50);
        const lEy = Math.round(ay + (tipY - ay) * 0.50);
        const lMx = Math.round(ax + (tipX - ax) * 0.28);
        const lMy = Math.round(ay + (tipY - ay) * 0.28) - 1;
        g.fillStyle(WH);
        g.fillTriangle(ax, ay, lEx, lEy, lMx, lMy);
      };

      // Right wing: shoulder (49,17), trailing (48,30)
      const drawRightWing = (tipX: number, tipY: number, fold: boolean) => {
        const ax = 49, ay = 17;
        const trailX = fold ? 44 : 48;
        const trailY = fold ? 27 : 30;

        g.fillStyle(WF);
        g.fillTriangle(ax, ay, tipX, tipY, trailX, trailY);

        const iMx = Math.round(ax + (tipX - ax) * 0.42);
        const iMy = Math.round(ay + (tipY - ay) * 0.42);
        g.fillStyle(WF2);
        g.fillTriangle(ax - 1, ay + 3, iMx, iMy + 2, trailX, trailY);

        const wEx = Math.round(ax + (tipX - ax) * 0.28);
        const wEy = Math.round(ay + (tipY - ay) * 0.28);
        g.fillStyle(WW);
        g.fillTriangle(ax - 1, ay + 5, wEx, wEy + 2, trailX + 1, trailY - 4);

        const lEx = Math.round(ax + (tipX - ax) * 0.50);
        const lEy = Math.round(ay + (tipY - ay) * 0.50);
        const lMx = Math.round(ax + (tipX - ax) * 0.28);
        const lMy = Math.round(ay + (tipY - ay) * 0.28) - 1;
        g.fillStyle(WH);
        g.fillTriangle(ax, ay, lEx, lEy, lMx, lMy);
      };

      // All body x coords = original 40px coords + 20
      const drawBody = () => {
        // ── BEAK ──
        g.fillStyle(BKC);
        g.fillTriangle(41, 3, 53, 7, 41, 9);   // upper mandible
        g.fillStyle(BKC);
        g.fillRect(49, 5, 4, 5);               // hooked tip block
        g.fillStyle(BKC2);
        g.fillRect(50, 9, 3, 2);               // hook curves down
        g.fillStyle(BKC2);
        g.fillTriangle(41, 8, 48, 8, 41, 11);  // lower mandible
        g.fillStyle(0xf0a030);
        g.fillRect(41, 6, 3, 3);               // cere

        // ── HEAD ──
        g.fillStyle(HDS);
        g.fillCircle(37, 8, 7);
        g.fillStyle(HDS2);
        g.fillRect(30, 6, 3, 5);
        g.fillRect(31, 2, 3, 5);
        g.fillStyle(0xcc3838);
        g.fillRect(34, 1, 5, 3);               // caruncle
        g.fillRect(35, 0, 3, 2);

        // ── EYE ──
        g.fillStyle(EYC);
        g.fillRect(40, 6, 3, 2);
        g.fillStyle(0xffffff);
        g.fillRect(40, 6, 1, 1);
        g.fillStyle(0xff8822);
        g.fillRect(41, 6, 1, 1);

        // ── NECK RUFF ──
        g.fillStyle(RUF);
        g.fillRect(31, 14, 18, 4);
        g.fillStyle(RUF2);
        g.fillRect(31, 17, 18, 1);
        g.fillStyle(0xdddddd);
        for (let rfx = 33; rfx < 49; rfx += 3) {
          g.fillRect(rfx, 14, 1, 3);
        }

        // ── CRYSTAL PALACE SHIRT (vertical red/blue stripes) ──
        for (let s = 0; s < 6; s++) {
          const sx = 31 + s * 3;
          g.fillStyle(s % 2 === 0 ? CPR : CPB);
          g.fillRect(sx, 18, 3, 14);
          g.fillStyle(s % 2 === 0 ? CPR2 : CPB2);
          g.fillRect(sx + 2, 18, 1, 14);
        }
        g.fillStyle(CPW);
        g.fillRect(37, 17, 6, 2);              // collar
        g.fillRect(38, 19, 4, 1);
        g.fillStyle(GLD);
        g.fillRect(34, 21, 3, 2);              // badge
        g.fillRect(35, 20, 1, 1);

        // ── SHORTS ──
        g.fillStyle(CPW);
        g.fillRect(31, 32, 18, 8);
        g.fillStyle(CPW2);
        g.fillRect(40, 32, 1, 8);
        g.fillRect(31, 39, 18, 1);
        g.fillStyle(CPR);
        g.fillRect(31, 32, 2, 8);
        g.fillRect(47, 32, 2, 8);

        // ── LEGS ──
        g.fillStyle(SK);
        g.fillRect(33, 40, 6, 7);
        g.fillRect(41, 40, 6, 7);
        g.fillStyle(SK2);
        g.fillRect(33, 40, 2, 7);
        g.fillRect(41, 40, 2, 7);

        // ── TALONS ──
        g.fillStyle(TAL);
        g.fillRect(31, 47, 8, 2);
        g.fillRect(29, 48, 3, 1);
        g.fillRect(31, 48, 2, 2);
        g.fillRect(34, 48, 2, 3);
        g.fillRect(37, 48, 2, 2);
        g.fillStyle(TAL2);
        g.fillRect(31, 47, 8, 1);

        g.fillStyle(TAL);
        g.fillRect(41, 47, 8, 2);
        g.fillRect(49, 48, 3, 1);
        g.fillRect(41, 48, 2, 2);
        g.fillRect(44, 48, 2, 3);
        g.fillRect(47, 48, 2, 2);
        g.fillStyle(TAL2);
        g.fillRect(41, 47, 8, 1);
      };

      // 12-frame flap cycle: [leftTipX, leftTipY, rightTipX, rightTipY, fold]
      // Canvas is 80px wide. Shoulder at x=31(L)/49(R). Tips reach x=0–79 → ~79px span.
      // Downstroke (0–7): wings fully spread. Upstroke (8–11): tips pull inward ~10px (fold).
      const FRAMES: Array<[number, number, number, number, boolean]> = [
        [ 4,  2, 76,  2, false],   // 0  UP MAX
        [ 1,  6, 79,  6, false],   // 1  UP HIGH
        [ 0, 12, 79, 12, false],   // 2  UP MID
        [ 0, 17, 79, 17, false],   // 3  LEVEL (horizontal)
        [ 0, 23, 79, 23, false],   // 4  DOWN 1
        [ 1, 29, 79, 29, false],   // 5  DOWN 2
        [ 2, 34, 78, 34, false],   // 6  DOWN 3
        [ 3, 38, 77, 38, false],   // 7  DOWN MAX
        [10, 34, 70, 34,  true],   // 8  RECOVER 1 (fold)
        [10, 27, 70, 27,  true],   // 9  RECOVER 2
        [ 8, 20, 72, 20,  true],   // 10 RECOVER 3
        [ 5, 10, 75, 10,  true],   // 11 RECOVER 4
      ];

      FRAMES.forEach(([lx, ly, rx, ry, fold], i) => {
        g.clear();
        drawLeftWing(lx, ly, fold);
        drawRightWing(rx, ry, fold);
        drawBody();
        g.generateTexture(`enemy-condor-${i}`, W, H);
        if (i === 0) g.generateTexture('enemy-condor', W, H); // alias for reset
      });
    }

    // ── Giant Bear — 48×72, maximum detail, 16 frames ────────────────────────
    {
      // 5-shade fur palette
      const FO = 0x1a0800;   // near-black outline/deep shadow
      const FD = 0x3d1a08;   // dark fur
      const FM = 0x6b3a1a;   // mid fur (main body colour)
      const FL = 0x9a5530;   // light fur (highlight)
      const FH = 0xc07848;   // specular fur (forehead catch)
      // Snout / paw
      const SD = 0x7a4020;
      const SM = 0xb87040;
      const SL = 0xd89860;
      // Nose
      const NZ = 0x050100;
      // Eyes
      const EI = 0xff1100;   // red iris
      const EG = 0xff7700;   // blazing orange glow iris
      // Mouth anatomy
      const GM = 0xaa2233;   // gum
      const MC = 0x77000f;   // mouth cavity
      const TH = 0x300006;   // throat dark
      const TG = 0xcc2244;   // tongue base
      const TN = 0xff4466;   // tongue bright
      const IV = 0xf0e8d0;   // ivory tooth
      const TS = 0xc8c0a8;   // tooth shadow face
      // Shirt
      const WH = 0xffffff;
      const S1 = 0xf0f0f0;
      const S2 = 0xdddddd;
      const S3 = 0xaaaaaa;
      // Paw / claw
      const PC = 0xb87040;
      const CL = 0xddd5b8;

      // ── Detailed brow (stepped diagonal — inner low = scowl) ─────────
      const gbBrow = () => {
        g.fillStyle(FO);
        g.fillRect(10,15, 2,4); g.fillRect(12,13, 3,3);   // L inner→mid
        g.fillRect(15,11, 3,3); g.fillRect(18,10, 5,3);   // L mid→outer peak
        g.fillStyle(FD); g.fillRect(10,17, 9,2);           // L under-brow shadow
        g.fillStyle(FL); g.fillRect(18,10, 4,2);           // L highlight
        g.fillStyle(FO);
        g.fillRect(36,15, 2,4); g.fillRect(33,13, 3,3);   // R (mirror)
        g.fillRect(30,11, 3,3); g.fillRect(25,10, 5,3);
        g.fillStyle(FD); g.fillRect(29,17, 9,2);
        g.fillStyle(FL); g.fillRect(26,10, 4,2);
      };

      // ── Eyes: socket → iris ring → iris → vertical slit → catchlight ─
      const gbEyes = (glow: boolean) => {
        if (glow) {
          g.fillStyle(0xff4400); g.fillRect( 9,15,13,10); g.fillRect(26,15,13,10);
          g.fillStyle(0xff8800); g.fillRect(10,16,11, 8); g.fillRect(27,16,11, 8);
        }
        g.fillStyle(FO);         g.fillRect(10,16,11, 8); g.fillRect(27,16,11, 8);
        g.fillStyle(0xaa0000);   g.fillRect(11,17, 9, 6); g.fillRect(28,17, 9, 6);
        g.fillStyle(glow?EG:EI); g.fillRect(12,17, 7, 6); g.fillRect(29,17, 7, 6);
        // Vertical slit pupil — tall, narrow, predatory
        g.fillStyle(0x050000);   g.fillRect(15,15, 2,10); g.fillRect(32,15, 2,10);
        g.fillStyle(0xffffff);   g.fillRect(12,17, 2, 2); g.fillRect(29,17, 2, 2);
      };

      // ── Muzzle + nose + nostrils ──────────────────────────────────────
      const gbMuzzle = () => {
        g.fillStyle(FO); g.fillRect( 9,22,30,13);           // outer shadow
        g.fillStyle(SD); g.fillRect(10,23,28,12);           // dark snout
        g.fillStyle(SM); g.fillRect(11,23,26,11);           // mid snout
        g.fillStyle(SL); g.fillRect(12,24,11, 7);           // L highlight
        // Nose
        g.fillStyle(FO); g.fillRect(14,22,20,10);
        g.fillStyle(NZ); g.fillRect(15,23,18, 9);
        g.fillStyle(0x444444); g.fillRect(16,24, 6,2);      // L sheen
        g.fillStyle(0x2a2a2a); g.fillRect(23,24, 4,2);      // R sheen
        // Nostrils
        g.fillStyle(FO); g.fillRect(17,26, 6,5); g.fillRect(25,26, 6,5);
        g.fillStyle(0x180300); g.fillRect(18,27, 4,3); g.fillRect(26,27, 4,3);
        g.fillStyle(SM); g.fillRect(19,27, 2,2); g.fillRect(27,27, 2,2);
      };

      // ── Mouth: 0=closed 1=snarl 2=open 3=ROAR ────────────────────────
      const gbMouth = (mth: number) => {
        if (mth === 0) {
          g.fillStyle(FO); g.fillRect(13,33,22,2);
          g.fillStyle(FD); g.fillRect(14,34,20,2);
        } else if (mth === 1) {
          // Snarl: lips parted, 2 big outer fangs + 2 small incisors
          g.fillStyle(FO); g.fillRect(11,31,26,4);
          g.fillStyle(GM); g.fillRect(12,32,24,4);
          // Outer fangs
          g.fillStyle(FO);  g.fillRect(12,31, 6,7); g.fillRect(30,31, 6,7);
          g.fillStyle(TS);  g.fillRect(13,32, 4,6); g.fillRect(31,32, 4,6);
          g.fillStyle(IV);  g.fillRect(13,32, 4,6); g.fillRect(31,32, 4,6);
          // Middle incisors
          g.fillStyle(FO);  g.fillRect(19,32, 4,4); g.fillRect(25,32, 4,4);
          g.fillStyle(IV);  g.fillRect(19,33, 3,3); g.fillRect(25,33, 3,3);
          // Tooth tip gleam
          g.fillStyle(0xffffff); g.fillRect(13,32,2,1); g.fillRect(31,32,2,1);
          // Dark gap below
          g.fillStyle(MC); g.fillRect(12,36,24,2);
        } else if (mth === 2) {
          // Open: full gum + 4 upper + 4 lower teeth + tongue + throat
          g.fillStyle(FO); g.fillRect( 9,27,30,4);
          g.fillStyle(GM); g.fillRect(10,28,28,4);
          g.fillStyle(MC); g.fillRect(10,31,28,10);
          g.fillStyle(TH); g.fillRect(16,36,16, 6);
          // Tongue
          g.fillStyle(TG); g.fillRect(12,36,24,5);
          g.fillStyle(TN); g.fillRect(13,37,22,3);
          g.fillStyle(TG); g.fillRect(23,36, 2,5);  // ridge
          // Upper: 2 outer fangs (bigger) + 2 inner (smaller)
          g.fillStyle(FO); g.fillRect( 9,27, 7,9); g.fillRect(32,27, 7,9);
          g.fillStyle(FO); g.fillRect(17,28, 5,7); g.fillRect(26,28, 5,7);
          g.fillStyle(IV); g.fillRect(10,28, 5,8); g.fillRect(33,28, 5,8);
          g.fillStyle(IV); g.fillRect(18,29, 3,6); g.fillRect(27,29, 3,6);
          g.fillStyle(0xffffff); g.fillRect(10,28,2,2); g.fillRect(33,28,2,2);
          g.fillStyle(0xffffff); g.fillRect(18,29,2,2); g.fillRect(27,29,2,2);
          // Lower gum + 4 lower teeth
          g.fillStyle(GM); g.fillRect(10,40,28,3);
          g.fillStyle(FO); g.fillRect(11,40, 5,6); g.fillRect(32,40, 5,6);
          g.fillStyle(FO); g.fillRect(18,40, 4,5); g.fillRect(26,40, 4,5);
          g.fillStyle(IV); g.fillRect(11,41, 4,5); g.fillRect(32,41, 4,5);
          g.fillStyle(IV); g.fillRect(18,41, 3,4); g.fillRect(26,41, 3,4);
        } else {
          // ROAR — cavernous maw, 4 upper + 4 lower fangs, massive tongue
          g.fillStyle(FO); g.fillRect( 7,24,34,4);
          g.fillStyle(GM); g.fillRect( 8,25,32,5);
          // Deep cavity
          g.fillStyle(MC); g.fillRect( 8,29,32,12);
          g.fillStyle(TH); g.fillRect(14,33,20,10);
          g.fillStyle(0x120003); g.fillRect(19,36,10, 7); // abyss
          // Big tongue
          g.fillStyle(TG); g.fillRect(10,33,28, 9);
          g.fillStyle(TN); g.fillRect(11,34,26, 6);
          g.fillStyle(0xff6688); g.fillRect(15,35,18, 3); // wet specular
          g.fillStyle(TG); g.fillRect(23,33, 2, 9);       // ridge
          // Upper fangs: outer pair huge, inner pair large
          g.fillStyle(FO); g.fillRect( 6,24, 8,12); g.fillStyle(TS); g.fillRect( 7,25, 6,10);
          g.fillStyle(IV); g.fillRect( 7,25, 6,10); g.fillStyle(0xffffff); g.fillRect( 7,25,3,2);
          g.fillStyle(FO); g.fillRect(15,25, 7,10);
          g.fillStyle(IV); g.fillRect(16,26, 5, 9); g.fillStyle(0xffffff); g.fillRect(16,26,2,2);
          g.fillStyle(FO); g.fillRect(26,25, 7,10);
          g.fillStyle(IV); g.fillRect(27,26, 5, 9); g.fillStyle(0xffffff); g.fillRect(27,26,2,2);
          g.fillStyle(FO); g.fillRect(34,24, 8,12); g.fillStyle(TS); g.fillRect(35,25, 6,10);
          g.fillStyle(IV); g.fillRect(35,25, 6,10); g.fillStyle(0xffffff); g.fillRect(35,25,3,2);
          // Lower jaw + fangs
          g.fillStyle(FO); g.fillRect( 7,40,34,4);
          g.fillStyle(GM); g.fillRect( 8,41,32,3);
          g.fillStyle(FO); g.fillRect( 8,41, 6,6); g.fillStyle(IV); g.fillRect( 9,42, 4,5);
          g.fillStyle(FO); g.fillRect(15,41, 5,5); g.fillStyle(IV); g.fillRect(16,42, 3,4);
          g.fillStyle(FO); g.fillRect(28,41, 5,5); g.fillStyle(IV); g.fillRect(29,42, 3,4);
          g.fillStyle(FO); g.fillRect(34,41, 6,6); g.fillStyle(IV); g.fillRect(35,42, 4,5);
        }
      };

      // ── Full head ─────────────────────────────────────────────────────
      const gbHead = (mth: number, glow: boolean) => {
        // Ears (outer dark, mid fill, leading-edge highlight, snout inner)
        g.fillStyle(FO); g.fillRect( 2,0,10,9); g.fillRect(36,0,10,9);
        g.fillStyle(FM); g.fillRect( 3,1, 8,7); g.fillRect(37,1, 8,7);
        g.fillStyle(FL); g.fillRect( 3,1, 3,5); g.fillRect(44,1, 3,5);
        g.fillStyle(FD); g.fillRect( 5,2, 4,4); g.fillRect(39,2, 4,4);
        g.fillStyle(SM); g.fillRect( 6,3, 2,3); g.fillRect(40,3, 2,3);

        // Skull — 5-layer shaded depth
        g.fillStyle(FO); g.fillRect( 5, 3,38,38);  // dark outline border
        g.fillStyle(FD); g.fillRect( 6, 4,36,36);  // deep brown
        g.fillStyle(FM); g.fillRect( 7, 4,34,35);  // main brown
        g.fillStyle(FL); g.fillRect( 8, 4,32,17);  // upper face lighter
        g.fillStyle(FH); g.fillRect(14, 5,20, 8);  // forehead specular catch
        // Cheek bulge (darker lateral areas)
        g.fillStyle(FD); g.fillRect( 6,20, 4,18); g.fillRect(38,20, 4,18);
        // Jaw area (dark underneath)
        g.fillStyle(FD); g.fillRect( 8,31,32, 7);
        g.fillStyle(FM); g.fillRect( 9,32,30, 5);

        gbBrow();
        gbEyes(glow);
        gbMuzzle();
        gbMouth(mth);

        // Neck (skip for ROAR — mouth fills the space)
        if (mth < 3) {
          g.fillStyle(FO); g.fillRect(14,37,20,5);
          g.fillStyle(FD); g.fillRect(15,37,18,5);
          g.fillStyle(FM); g.fillRect(16,38,16,4);
        }
      };

      // ── Shirt with V-neck collar, side shadows, chest creases ─────────
      const gbShirt = () => {
        g.fillStyle(S3); g.fillRect( 5,42,38,22);  // outer shadow
        g.fillStyle(WH); g.fillRect( 6,42,36,22);  // main white
        g.fillStyle(S1); g.fillRect(12,43,24,18);  // centre highlight
        g.fillStyle(S2); g.fillRect( 6,42, 4,22);  // L side shadow
        g.fillStyle(S2); g.fillRect(38,42, 4,22);  // R side shadow
        g.fillStyle(S2); g.fillRect(14,46, 2,14);  // L chest crease
        g.fillStyle(S2); g.fillRect(32,46, 2,14);  // R chest crease
        g.fillStyle(S3); g.fillRect( 6,62,36, 2);  // hem shadow
        // V-neck collar
        g.fillStyle(FO); g.fillRect(18,42,12,2);
        g.fillStyle(FO); g.fillRect(18,42, 2,5); g.fillRect(28,42, 2,5);
        g.fillStyle(FO); g.fillRect(20,44, 2,4); g.fillRect(26,44, 2,4);
        g.fillStyle(FM); g.fillRect(19,43,10,5);  // neck/fur fill
        g.fillStyle(FL); g.fillRect(20,43, 6,2);  // fur highlight
      };

      // ── Arms: 8px wide, bicep highlight, 3-shade paw, 3 claws ─────────
      const gbArm = (lx: number, ly: number, rx: number, ry: number) => {
        // Left
        g.fillStyle(FO); g.fillRect(lx,   ly, 8,23);
        g.fillStyle(FD); g.fillRect(lx+1, ly, 6,21);
        g.fillStyle(FM); g.fillRect(lx+1, ly, 6,21);
        g.fillStyle(FL); g.fillRect(lx+2, ly, 2,12);  // bicep highlight
        g.fillStyle(FO); g.fillRect(lx,   ly+20, 8,5);
        g.fillStyle(SM); g.fillRect(lx+1, ly+20, 6,4);
        g.fillStyle(SL); g.fillRect(lx+1, ly+20, 3,2);
        g.fillStyle(FO); g.fillRect(lx+1,ly+24,1,3); g.fillRect(lx+3,ly+24,1,3); g.fillRect(lx+5,ly+24,1,3);
        g.fillStyle(CL); g.fillRect(lx+1,ly+24,1,2); g.fillRect(lx+3,ly+24,1,2); g.fillRect(lx+5,ly+24,1,2);
        // Right
        g.fillStyle(FO); g.fillRect(rx,   ry, 8,23);
        g.fillStyle(FD); g.fillRect(rx,   ry, 6,21);
        g.fillStyle(FM); g.fillRect(rx,   ry, 6,21);
        g.fillStyle(FL); g.fillRect(rx+2, ry, 2,12);
        g.fillStyle(FO); g.fillRect(rx,   ry+20, 8,5);
        g.fillStyle(SM); g.fillRect(rx,   ry+20, 6,4);
        g.fillStyle(SL); g.fillRect(rx,   ry+20, 3,2);
        g.fillStyle(FO); g.fillRect(rx+1,ry+24,1,3); g.fillRect(rx+3,ry+24,1,3); g.fillRect(rx+5,ry+24,1,3);
        g.fillStyle(CL); g.fillRect(rx+1,ry+24,1,2); g.fillRect(rx+3,ry+24,1,2); g.fillRect(rx+5,ry+24,1,2);
      };

      // Single arm helper for throw frames (detailed, one side at a time)
      const gbArmL = (lx: number, ly: number) => {
        g.fillStyle(FO); g.fillRect(lx,   ly, 8,23);
        g.fillStyle(FD); g.fillRect(lx+1, ly, 6,21);
        g.fillStyle(FM); g.fillRect(lx+1, ly, 6,21);
        g.fillStyle(FL); g.fillRect(lx+2, ly, 2,12);
        g.fillStyle(FO); g.fillRect(lx,   ly+20, 8,5);
        g.fillStyle(SM); g.fillRect(lx+1, ly+20, 6,4);
        g.fillStyle(SL); g.fillRect(lx+1, ly+20, 3,2);
        g.fillStyle(FO); g.fillRect(lx+1,ly+24,1,3); g.fillRect(lx+3,ly+24,1,3); g.fillRect(lx+5,ly+24,1,3);
        g.fillStyle(CL); g.fillRect(lx+1,ly+24,1,2); g.fillRect(lx+3,ly+24,1,2); g.fillRect(lx+5,ly+24,1,2);
      };
      const gbArmR = (rx: number, ry: number) => {
        g.fillStyle(FO); g.fillRect(rx,   ry, 8,23);
        g.fillStyle(FD); g.fillRect(rx,   ry, 6,21);
        g.fillStyle(FM); g.fillRect(rx,   ry, 6,21);
        g.fillStyle(FL); g.fillRect(rx+2, ry, 2,12);
        g.fillStyle(FO); g.fillRect(rx,   ry+20, 8,5);
        g.fillStyle(SM); g.fillRect(rx,   ry+20, 6,4);
        g.fillStyle(SL); g.fillRect(rx,   ry+20, 3,2);
        g.fillStyle(FO); g.fillRect(rx+1,ry+24,1,3); g.fillRect(rx+3,ry+24,1,3); g.fillRect(rx+5,ry+24,1,3);
        g.fillStyle(CL); g.fillRect(rx+1,ry+24,1,2); g.fillRect(rx+3,ry+24,1,2); g.fillRect(rx+5,ry+24,1,2);
      };

      // ── Legs: 3-shade layering, paw at base ───────────────────────────
      const gbLegs = (lo = 0, ro = 0) => {
        g.fillStyle(FO); g.fillRect(10,64+lo,12,8); g.fillRect(26,64+ro,12,8);
        g.fillStyle(FD); g.fillRect(11,64+lo,10,7); g.fillRect(27,64+ro,10,7);
        g.fillStyle(FM); g.fillRect(11,65+lo, 8,5); g.fillRect(27,65+ro, 8,5);
        g.fillStyle(FL); g.fillRect(12,65+lo, 3,4); g.fillRect(28,65+ro, 3,4);
        g.fillStyle(FO); g.fillRect(10,70+lo,12,2); g.fillRect(26,70+ro,12,2);
        g.fillStyle(SM); g.fillRect(11,70+lo,10,2); g.fillRect(27,70+ro,10,2);
      };

      // ══ Walk frames 0-3 (arms at rx=40 for 8px width) ════════════════
      g.clear(); gbHead(0,false); gbShirt(); gbArm(0,42,40,42); gbLegs();
      g.generateTexture('enemy-giant-bear', 48, 72);

      g.clear(); gbHead(0,false); gbShirt(); gbArm(0,40,40,44); gbLegs(-2,2);
      g.generateTexture('enemy-giant-bear-2', 48, 72);

      g.clear(); gbHead(1,false); gbShirt(); gbArm(0,42,40,42); gbLegs();
      g.generateTexture('enemy-giant-bear-3', 48, 72);

      g.clear(); gbHead(0,false); gbShirt(); gbArm(0,44,40,40); gbLegs(2,-2);
      g.generateTexture('enemy-giant-bear-4', 48, 72);

      // ══ Growl frames 4-7 ══════════════════════════════════════════════
      g.clear(); gbHead(1,false); gbShirt(); gbArm(0,38,40,38); gbLegs();
      g.generateTexture('enemy-giant-bear-growl-1', 48, 72);

      g.clear(); gbHead(2,false); gbShirt(); gbArm(0,32,40,32); gbLegs();
      g.generateTexture('enemy-giant-bear-growl-2', 48, 72);

      g.clear(); gbHead(3,false); gbShirt(); gbArm(0,24,40,24); gbLegs();
      g.generateTexture('enemy-giant-bear-growl-3', 48, 72);

      // Growl-4 peak: arms raised above head — draw before head so skull overlaps
      g.clear();
      g.fillStyle(FO); g.fillRect( 0,16,8,30); g.fillStyle(FM); g.fillRect( 1,16,6,28);
      g.fillStyle(FL); g.fillRect( 2,16,2,12);
      g.fillStyle(FO); g.fillRect( 0,44,8, 6); g.fillStyle(SM); g.fillRect( 1,44,6, 5);
      g.fillStyle(FO); g.fillRect(40,16,8,30); g.fillStyle(FM); g.fillRect(40,16,6,28);
      g.fillStyle(FL); g.fillRect(42,16,2,12);
      g.fillStyle(FO); g.fillRect(40,44,8, 6); g.fillStyle(SM); g.fillRect(40,44,6, 5);
      gbHead(3,true); gbShirt(); gbLegs();
      g.generateTexture('enemy-giant-bear-growl-4', 48, 72);

      // ══ Throw frames 8-11 ═════════════════════════════════════════════
      // Throw-1: L arm resting, R arm raised high with beer
      g.clear(); gbHead(1,false); gbShirt();
      gbArmL(0,42);
      g.fillStyle(FO); g.fillRect(40,14,8,23); g.fillStyle(FM); g.fillRect(40,14,6,21);
      g.fillStyle(FL); g.fillRect(42,14,2,12);
      g.fillStyle(FO); g.fillRect(40,34,8,5);  g.fillStyle(SM); g.fillRect(40,34,6,4);
      // Beer above raised arm
      g.fillStyle(0x220011); g.fillRect(42, 2,14,14);
      g.fillStyle(0xcc8800); g.fillRect(43, 3,12,12);
      g.fillStyle(0xeeeedd); g.fillRect(43, 3,12, 4);
      g.fillStyle(0xffcc44); g.fillRect(44, 4, 3,10);
      g.fillStyle(0x220011); g.fillRect(44, 9, 4, 1); // handle
      gbLegs();
      g.generateTexture('enemy-giant-bear-throw-1', 48, 72);

      // Throw-2: R arm at mid-throw, beer still in hand
      g.clear(); gbHead(2,false); gbShirt();
      gbArmL(0,42);
      g.fillStyle(FO); g.fillRect(40,22,8,23); g.fillStyle(FM); g.fillRect(40,22,6,21);
      g.fillStyle(FL); g.fillRect(42,22,2,12);
      g.fillStyle(FO); g.fillRect(40,42,8,5);  g.fillStyle(SM); g.fillRect(40,42,6,4);
      g.fillStyle(0x220011); g.fillRect(42,10,14,14);
      g.fillStyle(0xcc8800); g.fillRect(43,11,12,12);
      g.fillStyle(0xeeeedd); g.fillRect(43,11,12, 4);
      g.fillStyle(0xffcc44); g.fillRect(44,12, 3,10);
      g.fillStyle(0x220011); g.fillRect(44,17, 4, 1);
      gbLegs();
      g.generateTexture('enemy-giant-bear-throw-2', 48, 72);

      // Throw-3: release — arm fully forward as stub (beer spawned in world)
      g.clear(); gbHead(3,false); gbShirt();
      gbArmL(0,42);
      g.fillStyle(FO); g.fillRect(40,42,8,6); g.fillStyle(FM); g.fillRect(40,42,7,5);
      gbLegs();
      g.generateTexture('enemy-giant-bear-throw-3', 48, 72);

      // Throw-4: follow-through — arm drops below horizontal
      g.clear(); gbHead(1,false); gbShirt();
      gbArmL(0,42);
      gbArmR(40,36);
      gbLegs();
      g.generateTexture('enemy-giant-bear-throw-4', 48, 72);

      // ══ Charge frames 12-15 ═══════════════════════════════════════════
      g.clear(); gbHead(1,false); gbShirt(); gbArm(0,43,40,41); gbLegs(-1,1);
      g.generateTexture('enemy-giant-bear-charge-1', 48, 72);

      g.clear(); gbHead(2,false); gbShirt(); gbArm(0,45,40,39); gbLegs(2,-2);
      g.generateTexture('enemy-giant-bear-charge-2', 48, 72);

      g.clear(); gbHead(3,false); gbShirt(); gbArm(0,46,40,38); gbLegs(3,-3);
      g.generateTexture('enemy-giant-bear-charge-3', 48, 72);

      g.clear(); gbHead(3,true);  gbShirt(); gbArm(0,44,40,40); gbLegs(-2,2);
      g.generateTexture('enemy-giant-bear-charge-4', 48, 72);
    }

    // ── Actuary Man — superman fly + ground laptop, 20 frames ───────────────
    {
      // Shared palette
      const SK  = 0xf5c5a0;  const SKD = 0xd49870;
      const HR  = 0x6b1a08;  const HRL = 0xaa3015;
      const SU  = 0x620015;  const SUM = 0x8a0020;  const SUL = 0xb00030;
      const CP  = 0x3e000c;  const CPM = 0x580015;  const CPL = 0x780020;
      const MK  = 0x080820;
      const BT  = 0x161630;  const BK  = 0xd0a020;
      const TR  = 0x5520bb;  const TRL = 0x7744dd;  const TRD = 0x3311aa;
      const TW  = 0xffffff;
      const EG  = 0xeec020;  const EMB = 0x111130;
      const LTC = 0x1a2840;  const LTL = 0x2a4468;  const LSC = 0x88aadd;
      const BLK = 0x0a0a0a;  const WH  = 0xffffff;

      // ── FLYING FRAME (50×26, horizontal superman, head on left/front) ────
      // Cape billows behind (right side). 6 oscillation phases.
      const amFlyFrame = (flap: number) => {
        const cTop = [5, 3, 1, 2, 4, 5][flap];
        const cBot = [21, 23, 25, 24, 22, 21][flap];
        g.clear();
        // Cape (drawn first, body overlaps)
        g.fillStyle(CP);  g.fillRect(24, cTop, 26, cBot - cTop);
        g.fillStyle(CPM); g.fillRect(26, cTop + 1, 21, cBot - cTop - 2);
        g.fillStyle(CPL); g.fillRect(29, cTop + 2, 14, Math.max(2, cBot - cTop - 4));
        g.fillStyle(CP);  g.fillRect(24, cTop, 5, cBot - cTop);   // base attachment dark
        // Body — horizontal suit
        g.fillStyle(SU);  g.fillRect( 6, 9, 30, 8);
        g.fillStyle(SUM); g.fillRect( 8, 9, 26, 6);
        g.fillStyle(SUL); g.fillRect(10,10, 12, 4);   // chest highlight
        // Emblem
        g.fillStyle(EMB); g.fillRect(15,10,  8, 5);
        g.fillStyle(EG);  g.fillRect(16,11,  6, 1);
        g.fillStyle(EG);  g.fillRect(16,13,  6, 1);
        g.fillStyle(EG);  g.fillRect(17,11,  1, 4);
        g.fillStyle(EG);  g.fillRect(21,11,  1, 4);
        g.fillStyle(WH);  g.fillRect(19,12,  1, 1);
        g.fillStyle(WH);  g.fillRect(19,14,  1, 1);
        // Belt
        g.fillStyle(BT);  g.fillRect(22,15,  8, 2);
        g.fillStyle(BK);  g.fillRect(24,15,  3, 2);
        // Arms thrust forward (left side)
        g.fillStyle(SUM); g.fillRect( 0, 9,  6, 5);
        g.fillStyle(SUL); g.fillRect( 0,10,  4, 3);
        g.fillStyle(SK);  g.fillRect( 0, 9,  4, 4);   // fist
        g.fillStyle(SKD); g.fillRect( 0,12,  4, 1);
        // Legs trailing (right side)
        g.fillStyle(SU);  g.fillRect(34,10, 14, 5);
        g.fillStyle(SUM); g.fillRect(35,10, 12, 3);
        // Trainers on legs
        g.fillStyle(TRD); g.fillRect(34,14, 15, 6);
        g.fillStyle(TR);  g.fillRect(35,13, 14, 5);
        g.fillStyle(TRL); g.fillRect(36,13, 10, 2);
        g.fillStyle(TW);  g.fillRect(34,18, 15, 2);   // sole
        // Head (left side, slightly angled down — focus face)
        g.fillStyle(HR);  g.fillRect( 1, 7, 11, 5);
        g.fillStyle(HRL); g.fillRect( 2, 7,  8, 2);
        g.fillStyle(SK);  g.fillRect( 1, 9, 11, 8);
        g.fillStyle(MK);  g.fillRect( 0, 9, 12, 5);   // mask band
        g.fillStyle(0x1a3a88); g.fillRect( 1,10,  3, 3);
        g.fillStyle(0x1a3a88); g.fillRect( 6,10,  3, 3);
        g.fillStyle(0x4466cc); g.fillRect( 1,10,  1, 1);
        g.fillStyle(0x4466cc); g.fillRect( 6,10,  1, 1);
        g.fillStyle(SK);  g.fillRect( 3,14,  3, 2);   // nose
        g.fillStyle(BLK); g.fillRect( 2,15,  5, 1);   // mouth
        g.fillStyle(0xcc7755); g.fillRect( 3,15,  4, 1);
      };

      // ── GROUND HELPERS (40×50) ───────────────────────────────────────────
      const amCape = (sway: number) => {
        const s = sway;
        g.fillStyle(CP);  g.fillRect(s,   11, 14, 25);
        g.fillStyle(CPM); g.fillRect(s+2, 11, 10, 21);
        g.fillStyle(CPL); g.fillRect(s+3, 12,  6, 15);
        g.fillStyle(CP);  g.fillRect(s,   33, 15,  5);
        g.fillStyle(CPM); g.fillRect(s+2, 35, 10,  2);
        g.fillStyle(CPM); g.fillRect(s+10,11,  6,  4);  // shoulder wrap
      };

      const amHead = (tilt: number) => {
        const hx = 20 + tilt * 2;
        g.fillStyle(HR);  g.fillRect(hx-9, 0, 18, 6);
        g.fillStyle(HR);  g.fillRect(hx-8, 2, 16, 6);
        g.fillStyle(HRL); g.fillRect(hx-5, 0, 10, 3);
        g.fillStyle(HRL); g.fillRect(hx-7, 3,  4, 2);
        g.fillStyle(SK);  g.fillRect(hx-7, 4, 14, 10);
        g.fillStyle(SKD); g.fillRect(hx-7,12, 14,  2);
        g.fillStyle(MK);  g.fillRect(hx-9, 5, 18,  5);
        g.fillStyle(0x1a3a88); g.fillRect(hx-8, 6, 5, 3);
        g.fillStyle(0x1a3a88); g.fillRect(hx+3, 6, 5, 3);
        g.fillStyle(0x4466cc); g.fillRect(hx-7, 6, 2, 2);
        g.fillStyle(0x4466cc); g.fillRect(hx+4, 6, 2, 2);
        g.fillStyle(SK);  g.fillRect(hx-1, 9, 3, 3);
        g.fillStyle(SKD); g.fillRect(hx-1,11, 3, 1);
        g.fillStyle(BLK); g.fillRect(hx-3,11, 7, 1);
        g.fillStyle(0xcc7755); g.fillRect(hx-2,11, 5, 1);
        g.fillStyle(SKD); g.fillRect(hx-4,12, 9, 2);
        g.fillStyle(SK);  g.fillRect(hx-3,13, 6, 2);
      };

      const amBody = () => {
        g.fillStyle(SU);  g.fillRect(11,13,18,22);
        g.fillStyle(SUM); g.fillRect(13,13,14,20);
        g.fillStyle(SUL); g.fillRect(15,14,10, 8);
        g.fillStyle(SU);  g.fillRect(11,13, 3,22);
        g.fillStyle(SU);  g.fillRect(26,13, 3,22);
        g.fillStyle(EMB); g.fillRect(16,16, 8,10);
        g.fillStyle(EG);  g.fillRect(17,17, 6, 1);
        g.fillStyle(EG);  g.fillRect(17,19, 6, 1);
        g.fillStyle(EG);  g.fillRect(18,21, 2, 4);
        g.fillStyle(EG);  g.fillRect(21,21, 2, 4);
        g.fillStyle(WH);  g.fillRect(18,22, 1, 1);
        g.fillStyle(WH);  g.fillRect(21,20, 1, 1);
        g.fillStyle(WH);  g.fillRect(19,24, 1, 1);
        g.fillStyle(BT);  g.fillRect(11,33,18, 3);
        g.fillStyle(BK);  g.fillRect(17,33, 6, 3);
        g.fillStyle(BLK); g.fillRect(19,33, 2, 3);
        g.fillStyle(0xf0e060); g.fillRect(17,33, 1, 1);
      };

      const amArms = (lOff: number, rOff: number) => {
        g.fillStyle(SU);  g.fillRect( 6,17+lOff, 7,13);
        g.fillStyle(SK);  g.fillRect( 7,28+lOff, 6, 5);
        g.fillStyle(SKD); g.fillRect( 7,31+lOff, 6, 2);
        g.fillStyle(SUM); g.fillRect(28,17+rOff, 7,13);
        g.fillStyle(SUL); g.fillRect(29,17+rOff, 5, 8);
        g.fillStyle(SK);  g.fillRect(28,28+rOff, 7, 5);
        g.fillStyle(SKD); g.fillRect(28,31+rOff, 7, 2);
      };

      const amLegs = (lOff: number, rOff: number) => {
        const base = 35; const fullH = 9;
        g.fillStyle(SU);  g.fillRect(11,base+lOff, 8, fullH-lOff);
        g.fillStyle(SUM); g.fillRect(12,base+lOff, 6, Math.max(1,fullH-lOff-2));
        g.fillStyle(SU);  g.fillRect(21,base+rOff, 8, fullH-rOff);
        g.fillStyle(SUM); g.fillRect(22,base+rOff, 6, Math.max(1,fullH-rOff-2));
      };

      const amTrainers = (lOff: number, rOff: number) => {
        const lo = Math.max(-1,Math.min(1,Math.round(lOff*0.25)));
        const ro = Math.max(-1,Math.min(1,Math.round(rOff*0.25)));
        g.fillStyle(TRD); g.fillRect( 9,44+lo,13, 6);
        g.fillStyle(TR);  g.fillRect(10,43+lo,11, 5);
        g.fillStyle(TRL); g.fillRect(11,43+lo, 8, 2);
        g.fillStyle(TW);  g.fillRect( 9,48+lo,13, 2);
        g.fillStyle(TRD); g.fillRect(19,44+ro,13, 6);
        g.fillStyle(TR);  g.fillRect(20,43+ro,11, 5);
        g.fillStyle(TRL); g.fillRect(21,43+ro, 8, 2);
        g.fillStyle(TW);  g.fillRect(19,48+ro,13, 2);
      };

      const amLaptop = (phase: number) => {
        if (phase === 0) {
          g.fillStyle(LTC); g.fillRect(28,26,11, 7);
          g.fillStyle(LTL); g.fillRect(29,27, 9, 3);
          g.fillStyle(0x445566); g.fillRect(32,26, 2, 7);
        } else {
          g.fillStyle(LTC); g.fillRect(24,24,14, 5);
          g.fillStyle(0x223344); g.fillRect(25,25,12, 3);
          g.fillStyle(0x334455); g.fillRect(26,26,2,1); g.fillRect(29,26,2,1); g.fillRect(32,26,2,1);
          g.fillStyle(LTL); g.fillRect(25,13,13,12);
          g.fillStyle(LSC); g.fillRect(26,14,11,10);
          g.fillStyle(WH);  g.fillRect(27,15, 4, 1);
          g.fillStyle(WH);  g.fillRect(27,17, 7, 1);
          g.fillStyle(WH);  g.fillRect(27,19, 5, 1);
          if (phase === 2) {
            g.fillStyle(0xff4444); g.fillRect(27,15, 9, 1);
            g.fillStyle(0xffaa00); g.fillRect(27,17, 6, 1);
          }
        }
      };

      const amGnd = (
        tilt: number, sw: number,
        lA: number, rA: number,
        lL: number, rL: number,
        lt: number,
      ) => {
        g.clear();
        amCape(sw); amBody();
        if (lt >= 0) amLaptop(lt); else amArms(lA, rA);
        amLegs(lL, rL); amTrainers(lL, rL); amHead(tilt);
      };

      // ── 6 fly frames (50×26) ────────────────────────────────────────────
      amFlyFrame(0); g.generateTexture('enemy-actuary-man',       50, 26);
      amFlyFrame(0); g.generateTexture('enemy-actuary-man-fly-1', 50, 26);
      amFlyFrame(1); g.generateTexture('enemy-actuary-man-fly-2', 50, 26);
      amFlyFrame(2); g.generateTexture('enemy-actuary-man-fly-3', 50, 26);
      amFlyFrame(3); g.generateTexture('enemy-actuary-man-fly-4', 50, 26);
      amFlyFrame(4); g.generateTexture('enemy-actuary-man-fly-5', 50, 26);
      amFlyFrame(5); g.generateTexture('enemy-actuary-man-fly-6', 50, 26);

      // ── 4 land frames (40×50): descend + absorb impact ──────────────────
      // land-1: arms still overhead from flight, cape billowing back
      amGnd(0,-2,-7,-7, 0, 0,-1); g.generateTexture('enemy-actuary-man-land-1', 40, 50);
      // land-2: arms dropping, slight bend
      amGnd(0,-1,-4,-4, 1, 1,-1); g.generateTexture('enemy-actuary-man-land-2', 40, 50);
      // land-3: deep crouch, impact absorption — arms spread for balance
      amGnd(0, 0, 2,-2, 4, 4,-1); g.generateTexture('enemy-actuary-man-land-3', 40, 50);
      // land-4: rising to stand, cape settling
      amGnd(0, 0, 0, 0, 1, 1,-1); g.generateTexture('enemy-actuary-man-land-4', 40, 50);

      // ── 6 laptop frames (40×50): standing, pull out, read, shake, close ─
      amGnd(0, 0, 0, 5, 0, 0,-1); g.generateTexture('enemy-actuary-man-laptop-1', 40, 50);
      amGnd(0, 0, 0, 3, 0, 0, 0); g.generateTexture('enemy-actuary-man-laptop-2', 40, 50);
      amGnd(0, 0,-2, 0, 0, 0, 1); g.generateTexture('enemy-actuary-man-laptop-3', 40, 50);
      amGnd(-1,0,-3, 0, 0, 0, 2); g.generateTexture('enemy-actuary-man-laptop-4', 40, 50);
      amGnd( 1,0,-3, 0, 0, 0, 2); g.generateTexture('enemy-actuary-man-laptop-5', 40, 50);
      amGnd(-1,0,-2, 2, 0, 0, 0); g.generateTexture('enemy-actuary-man-laptop-6', 40, 50);

      // ── 4 takeoff frames (40×50): crouch, spring, launch, away ──────────
      // takeoff-1: slight crouch
      amGnd(0, 0, 0, 0, 2, 2,-1); g.generateTexture('enemy-actuary-man-takeoff-1', 40, 50);
      // takeoff-2: arms swinging back-and-up, deeper crouch
      amGnd(0,-1,-3,-3, 4, 4,-1); g.generateTexture('enemy-actuary-man-takeoff-2', 40, 50);
      // takeoff-3: springing, arms thrusting forward, legs straightening
      amGnd(0,-2,-6,-6, 1, 1,-1); g.generateTexture('enemy-actuary-man-takeoff-3', 40, 50);
      // takeoff-4: launching — arms fully extended, body nearly horizontal
      amGnd(0,-2,-7,-7, 0, 0,-1); g.generateTexture('enemy-actuary-man-takeoff-4', 40, 50);
    }

    // ── Puffin Golfer — 40×50px, faces LEFT, 12-frame swing ─────────────────
    {
      const W = 40, H = 50;
      // Puffin colours
      const BLK = 0x111111; const WHT = 0xffffff;
      const BO  = 0xff4400; // beak orange-red (upper)
      const BY  = 0xff9922; // beak yellow-orange (lower)
      const BG  = 0xbbbbbb; // beak grey mid-section
      const ER  = 0xff7700; // eye ring orange
      const FT  = 0xff9900; // wing-tip orange (puffin feet colour)
      // Golfer colours
      const GRN = 0x6633cc; // argyle sweater purple
      const AY  = 0xffdd00; // argyle yellow diamond
      const AR  = 0xffffff; // argyle white diamond
      const PF  = 0xcc9933; // plus-fours khaki
      const PD  = 0x997722; // plus-fours shadow
      const SC  = 0xeeeeee; // sock white
      const SR  = 0xcc2200; // sock red stripe
      const SH  = 0x442211; // shoe brown
      const SW  = 0xddbbaa; // shoe white cap
      // Club colours
      const SA  = 0xbbbbbb; // shaft silver
      const CH  = 0x666666; // club head grey
      const GP  = 0x333333; // grip

      const TY = 14;  // sweater top
      const PY = 27;  // plus-fours top
      const KY = 38;  // socks top
      const SY2 = 44; // shoes top

      const head = () => {
        // Black rounded head
        g.fillStyle(BLK); g.fillCircle(20, 6, 10);
        g.fillRect(11, 6, 18, 8);
        // White cheek patch (front = LEFT side of sprite)
        g.fillStyle(WHT); g.fillRect(9, 4, 10, 10);
        // Large colourful beak pointing LEFT (puffin's icon feature)
        g.fillStyle(BO);  g.fillRect(1, 6, 10, 3);   // upper beak
        g.fillStyle(BY);  g.fillRect(2, 8, 9, 3);    // lower beak
        g.fillRect(2, 10, 5, 1);                      // tip narrows
        g.fillStyle(BG);  g.fillRect(5, 7, 3, 3);    // grey mid-section
        // Orange eye-ring + black pupil
        g.fillStyle(ER);  g.fillRect(14, 2, 6, 6);
        g.fillRect(13, 4, 1, 3);                      // triangle extension
        g.fillStyle(BLK); g.fillRect(15, 3, 3, 4);
        g.fillStyle(WHT); g.fillRect(15, 3, 1, 1);   // highlight
      };

      const torso = () => {
        // Argyle sweater
        g.fillStyle(GRN); g.fillRect(11, TY, 18, 13);
        g.fillStyle(AY);
        g.fillRect(12, TY+2, 4, 4); g.fillRect(23, TY+2, 4, 4);
        g.fillStyle(AR);
        g.fillRect(17, TY+6, 5, 5);
        g.fillStyle(BLK); g.fillRect(15, TY, 9, 2);   // collar
        // Plus fours (baggy knickers)
        g.fillStyle(PF);
        g.fillRect(9, PY, 22, 5);                      // waist/hip
        g.fillRect(8, PY+5, 10, 6); g.fillRect(22, PY+5, 10, 6); // baggy thighs
        g.fillStyle(PD);
        g.fillRect(9, PY+10, 8, 1); g.fillRect(23, PY+10, 8, 1); // knee gather
        // Socks
        g.fillStyle(SC);
        g.fillRect(9, KY, 8, 6);  g.fillRect(23, KY, 8, 6);
        g.fillStyle(SR);
        g.fillRect(9, KY+1, 8, 1); g.fillRect(23, KY+1, 8, 1);
        g.fillRect(9, KY+4, 8, 1); g.fillRect(23, KY+4, 8, 1);
        // Golf shoes
        g.fillStyle(SH);
        g.fillRect(7, SY2, 10, 5); g.fillRect(23, SY2, 10, 5);
        g.fillStyle(SW);
        g.fillRect(7, SY2, 4, 2);  g.fillRect(23, SY2, 4, 2);
      };

      // ── ARM helpers ─────────────────────────────────────────
      // Wings = black; orange tip = puffin feet colour
      const armsA = () => {   // Address — both arms down
        g.fillStyle(BLK); g.fillRect(4, TY+2, 8, 9); g.fillRect(27, TY+2, 8, 9);
        g.fillStyle(FT);  g.fillRect(4, TY+9, 6, 3); g.fillRect(29, TY+9, 5, 3);
      };
      const armsW1 = () => {  // Takeaway — arms start going back (rightward)
        g.fillStyle(BLK); g.fillRect(13, TY+2, 7, 8); g.fillRect(27, TY+2, 9, 9);
        g.fillStyle(FT);  g.fillRect(15, TY+8, 5, 3); g.fillRect(30, TY+9, 5, 3);
      };
      const armsW2 = () => {  // Backswing — arms rising up-right
        g.fillStyle(BLK); g.fillRect(18, TY-1, 10, 9);
        g.fillStyle(FT);  g.fillRect(25, TY-1, 5, 3);
      };
      const armsW3 = () => {  // Top — arms fully back and high
        g.fillStyle(BLK); g.fillRect(20, TY-4, 12, 9);
        g.fillStyle(FT);  g.fillRect(28, TY-4, 5, 4);
      };
      const armsW4 = () => {  // Transition — arms dropping toward impact
        g.fillStyle(BLK); g.fillRect(14, TY-1, 13, 9);
        g.fillStyle(FT);  g.fillRect(24, TY+5, 5, 3);
      };
      const armsImp = () => { // IMPACT — arms fully extended LEFT
        g.fillStyle(BLK); g.fillRect(0, TY+3, 16, 7);
        g.fillStyle(FT);  g.fillRect(0, TY+3, 5, 5);
      };
      const armsF1 = () => {  // Follow 1 — arms swinging up-left
        g.fillStyle(BLK); g.fillRect(2, TY-1, 11, 9);
        g.fillStyle(FT);  g.fillRect(2, TY-1, 5, 4);
      };
      const armsF2 = () => {  // Follow 2 — arms high left
        g.fillStyle(BLK); g.fillRect(0, TY-3, 10, 9);
        g.fillStyle(FT);  g.fillRect(0, TY-3, 5, 4);
      };
      const armsF3 = () => {  // Follow 3 — wrapping over
        g.fillStyle(BLK);
        g.fillRect(1, TY-4, 9, 8); g.fillRect(3, TY+3, 9, 5);
        g.fillStyle(FT);  g.fillRect(1, TY-4, 5, 4);
      };
      const armsF4 = () => {  // High finish — arms wrapped over left
        g.fillStyle(BLK);
        g.fillRect(2, TY-5, 10, 9); g.fillRect(3, TY+3, 14, 5);
        g.fillStyle(FT);  g.fillRect(2, TY-5, 5, 4);
      };
      const armsF5 = () => {  // Pose/hold — relaxed finish
        g.fillStyle(BLK);
        g.fillRect(3, TY-4, 9, 8); g.fillRect(4, TY+3, 13, 5);
        g.fillStyle(FT);  g.fillRect(3, TY-4, 5, 3);
      };

      // ── CLUB helpers ─────────────────────────────────────────
      // Diagonal shaft drawn as stepping 2-wide pixels
      const shaftDiag = (sx: number, sy: number, steps: number, dx: number, dy: number) => {
        for (let i = 0; i < steps; i++) g.fillRect(sx + dx*i, sy + dy*i, 2, 2);
      };

      const clubA = () => {   // Address — shaft near-vertical
        g.fillStyle(SA); shaftDiag(9, 22, 7, -1, 4);
        g.fillStyle(GP); g.fillRect(8, 20, 3, 4);
        g.fillStyle(CH); g.fillRect(1, 44, 10, 4);
        g.fillStyle(SA); g.fillRect(1, 44, 10, 1);
      };
      const clubW1 = () => {  // Takeaway — shaft going back to hip, pointing RIGHT
        g.fillStyle(SA); g.fillRect(14, 26, 18, 2);
        g.fillStyle(GP); g.fillRect(14, 24, 3, 5);
        g.fillStyle(CH); g.fillRect(30, 23, 8, 5);
        g.fillStyle(SA); g.fillRect(30, 23, 8, 1);
      };
      const clubW2 = () => {  // Backswing — shaft vertical, head top-right
        g.fillStyle(SA); g.fillRect(26, 2, 2, 22);
        g.fillStyle(GP); g.fillRect(24, 20, 4, 5);
        g.fillStyle(CH); g.fillRect(23, 0, 7, 4);
        g.fillStyle(SA); g.fillRect(23, 0, 7, 1);
      };
      const clubW3 = () => {  // Top — shaft diagonal upper-right
        g.fillStyle(SA); shaftDiag(23, 14, 6, 2, -3);
        g.fillStyle(GP); g.fillRect(21, 14, 5, 5);
        g.fillStyle(CH); g.fillRect(32, 0, 7, 4);
        g.fillStyle(SA); g.fillRect(32, 0, 7, 1);
      };
      const clubW4 = () => {  // Transition — dropping, still upper-right
        g.fillStyle(SA); shaftDiag(22, 6, 6, 1, 3);
        g.fillStyle(GP); g.fillRect(20, 20, 5, 5);
        g.fillStyle(CH); g.fillRect(29, 0, 7, 4);
        g.fillStyle(SA); g.fillRect(29, 0, 7, 1);
      };
      const clubImp = () => { // Impact — shaft horizontal pointing LEFT, head far-left
        g.fillStyle(SA); g.fillRect(5, 22, 18, 2);
        g.fillStyle(GP); g.fillRect(20, 20, 4, 5);
        g.fillStyle(CH); g.fillRect(0, 19, 7, 6);
        g.fillStyle(SA); g.fillRect(6, 19, 1, 6);  // inner face line
        g.fillStyle(WHT); g.fillRect(0, 21, 1, 2); // glint
      };
      const clubF1 = () => {  // Follow 1 — going up-left past horizontal
        g.fillStyle(SA); shaftDiag(7, 8, 7, -1, 3);
        g.fillStyle(GP); g.fillRect(5, 26, 4, 4);
        g.fillStyle(CH); g.fillRect(0, 0, 6, 5);
        g.fillStyle(SA); g.fillRect(0, 0, 6, 1);
      };
      const clubF2 = () => {  // Follow 2 — shaft near-vertical rising left
        g.fillStyle(SA); g.fillRect(5, 2, 2, 22);
        g.fillStyle(GP); g.fillRect(3, 20, 4, 5);
        g.fillStyle(CH); g.fillRect(2, 0, 6, 4);
        g.fillStyle(SA); g.fillRect(2, 0, 6, 1);
      };
      const clubF3 = () => {  // Follow 3 — wrapping, pointing upper-left
        g.fillStyle(SA); shaftDiag(5, 2, 6, -1, 3);
        g.fillStyle(GP); g.fillRect(2, 16, 4, 5);
        g.fillStyle(CH); g.fillRect(0, 0, 6, 4);
      };
      const clubF4 = () => {  // High finish — club behind/above, pointing right
        g.fillStyle(SA); g.fillRect(8, 0, 26, 2);
        g.fillStyle(GP); g.fillRect(8, 0, 4, 4);
        g.fillStyle(CH); g.fillRect(32, 0, 7, 4);
      };
      const clubF5 = () => {  // Pose — club relaxed across shoulders
        g.fillStyle(SA); g.fillRect(10, 3, 22, 2);
        g.fillStyle(GP); g.fillRect(10, 1, 4, 5);
        g.fillStyle(CH); g.fillRect(30, 1, 7, 4);
      };

      // ── Generate all 12 textures ─────────────────────────────
      g.clear(); head(); torso(); armsA();  clubA();  g.generateTexture('enemy-puffin-golfer',          W, H);
      g.clear(); head(); torso(); armsA();  clubA();
      // waggle: tiny hip shift — overdraw plus-fours 1px right
      g.fillStyle(PF); g.fillRect(10, PY, 22, 5);
      g.generateTexture('enemy-puffin-golfer-wait-2', W, H);
      g.clear(); head(); torso(); armsW1(); clubW1(); g.generateTexture('enemy-puffin-golfer-windup-1', W, H);
      g.clear(); head(); torso(); armsW2(); clubW2(); g.generateTexture('enemy-puffin-golfer-windup-2', W, H);
      g.clear(); head(); torso(); armsW3(); clubW3(); g.generateTexture('enemy-puffin-golfer-windup-3', W, H);
      g.clear(); head(); torso(); armsW4(); clubW4(); g.generateTexture('enemy-puffin-golfer-windup-4', W, H);
      g.clear(); head(); torso(); armsImp(); clubImp(); g.generateTexture('enemy-puffin-golfer-impact', W, H);
      g.clear(); head(); torso(); armsF1(); clubF1();  g.generateTexture('enemy-puffin-golfer-follow-1', W, H);
      g.clear(); head(); torso(); armsF2(); clubF2();  g.generateTexture('enemy-puffin-golfer-follow-2', W, H);
      g.clear(); head(); torso(); armsF3(); clubF3();  g.generateTexture('enemy-puffin-golfer-follow-3', W, H);
      g.clear(); head(); torso(); armsF4(); clubF4();  g.generateTexture('enemy-puffin-golfer-follow-4', W, H);
      g.clear(); head(); torso(); armsF5(); clubF5();  g.generateTexture('enemy-puffin-golfer-follow-5', W, H);
    }

    // ── Vascular Man — 22-frame gymnast, 40×64, bald & muscular ─────────────
    {
      const W = 40, H = 64;
      const SK  = 0xffbb88, SK2 = 0xcc8855, SK3 = 0xffdcaa, MUS = 0xff9944;
      const VT  = 0xdd1100, VT2 = 0x991100, VT3 = 0xff5533;
      const SH  = 0x111130, SH2 = 0x222255, SHs = 0xff2200;
      const WB  = 0xffffff, WB2 = 0xbbbbbb;
      const EY  = 0x111122, MO  = 0xaa2200;

      const vmHead = (cx: number, ty: number) => {
        g.fillStyle(SK);  g.fillCircle(cx, ty + 9, 9);
        g.fillStyle(SK2); g.fillRect(cx - 9, ty + 4, 4, 10);
        g.fillStyle(SK3); g.fillRect(cx + 3, ty + 1, 4, 6);
        g.fillStyle(SK2); g.fillRect(cx - 7, ty + 4, 5, 3); g.fillRect(cx + 2, ty + 4, 5, 3);
        g.fillStyle(EY);  g.fillRect(cx - 6, ty + 7, 3, 3); g.fillRect(cx + 3, ty + 7, 3, 3);
        g.fillStyle(0xffffff); g.fillRect(cx - 6, ty + 7, 1, 1); g.fillRect(cx + 3, ty + 7, 1, 1);
        g.fillStyle(SK2); g.fillRect(cx - 1, ty + 11, 2, 3);
        g.fillStyle(MO);  g.fillRect(cx - 4, ty + 14, 8, 2);
        g.fillStyle(0xffffff); g.fillRect(cx - 3, ty + 14, 6, 1);
        g.fillStyle(SK2); g.fillRect(cx - 5, ty + 16, 10, 2);
      };

      const vmWrists = () => {
        g.fillStyle(WB);  g.fillRect(3, 0, 7, 4); g.fillRect(30, 0, 7, 4);
        g.fillStyle(WB2); g.fillRect(3, 2, 7, 2); g.fillRect(30, 2, 7, 2);
        g.fillStyle(0xff3300); g.fillRect(3, 1, 7, 1); g.fillRect(30, 1, 7, 1);
      };

      const vmArmsStr = (sY: number) => {
        g.fillStyle(SK);  g.fillRect(5, 0, 4, sY); g.fillRect(31, 0, 4, sY);
        g.fillStyle(SK2); g.fillRect(5, 0, 2, sY);
        g.fillStyle(SK3); g.fillRect(34, 0, 1, sY);
        vmWrists();
      };

      const vmArmsBent = (sY: number, frac: number) => {
        const elbow = Math.round(4 + (sY - 4) * (1 - frac * 0.65));
        g.fillStyle(SK);  g.fillRect(5, 4, 4, elbow - 4); g.fillRect(31, 4, 4, elbow - 4);
        g.fillStyle(SK2); g.fillRect(5, 4, 2, elbow - 4);
        g.fillStyle(SK3); g.fillRect(34, 4, 1, elbow - 4);
        const b = Math.round(frac * 5);
        g.fillStyle(MUS); g.fillRect(2, elbow, 9 + b, sY - elbow); g.fillRect(29 - b, elbow, 9 + b, sY - elbow);
        g.fillStyle(SK);  g.fillRect(4, elbow, 6 + b, sY - elbow); g.fillRect(30 - b, elbow, 6 + b, sY - elbow);
        g.fillStyle(SK3); g.fillRect(34, elbow, 1, sY - elbow);
        vmWrists();
      };

      const vmTorso = (ty: number) => {
        g.fillStyle(SK);  g.fillRect(2, ty, 36, 8);
        g.fillStyle(SK3); g.fillRect(8, ty, 24, 3);
        g.fillStyle(MUS); g.fillRect(2, ty, 7, 7);    g.fillRect(31, ty, 7, 7);
        g.fillStyle(SK2); g.fillRect(2, ty+5, 6, 3);  g.fillRect(32, ty+5, 6, 3);
        g.fillStyle(VT);  g.fillRect(10, ty+7, 20, 29);
        g.fillStyle(VT3); g.fillRect(10, ty+7, 2, 27);
        g.fillStyle(VT2); g.fillRect(10, ty+35, 20, 1);
        g.fillStyle(VT2); g.fillRect(19, ty+14, 2, 22);
        g.fillStyle(VT2); g.fillRect(12, ty+18, 16, 1); g.fillRect(12, ty+23, 16, 1); g.fillRect(12, ty+28, 16, 1);
        g.fillStyle(VT);  g.fillRect(11, ty+6, 4, 3);  g.fillRect(25, ty+6, 4, 3);
        g.fillStyle(SK);  g.fillRect(4, ty+8, 6, 10);  g.fillRect(30, ty+8, 6, 10);
        g.fillStyle(MUS); g.fillRect(5, ty+8, 5, 9);   g.fillRect(30, ty+8, 5, 9);
        g.fillStyle(SK2); g.fillRect(4, ty+17, 6, 1);  g.fillRect(30, ty+17, 6, 1);
        g.fillStyle(SK);  g.fillRect(4, ty+18, 6, 18); g.fillRect(30, ty+18, 6, 18);
        g.fillStyle(MUS); g.fillRect(5, ty+20, 4, 14); g.fillRect(31, ty+20, 4, 14);
        g.fillStyle(SK2); g.fillRect(4, ty+32, 6, 4);  g.fillRect(30, ty+32, 6, 4);
        g.fillStyle(SH);  g.fillRect(7, ty+36, 26, 14);
        g.fillStyle(SH2); g.fillRect(9, ty+38, 22, 10);
        g.fillStyle(SHs); g.fillRect(7, ty+36, 2, 14); g.fillRect(31, ty+36, 2, 14);
        g.fillStyle(0x3344bb); g.fillRect(9, ty+36, 3, 2); g.fillRect(28, ty+36, 3, 2);
        const lT = ty + 50;
        if (lT < H) {
          const lh = H - lT;
          g.fillStyle(SK);  g.fillRect(9, lT, 8, lh); g.fillRect(23, lT, 8, lh);
          g.fillStyle(SK2); g.fillRect(9, lT+2, 5, Math.max(0,lh-2)); g.fillRect(25, lT+2, 5, Math.max(0,lh-2));
          g.fillStyle(SK3); g.fillRect(15, lT, 2, lh); g.fillRect(23, lT, 2, lh);
        }
      };

      g.clear(); vmTorso(22); vmHead(20, 3); vmArmsStr(22);
      g.generateTexture('enemy-vascular-man', W, H);

      g.clear(); vmTorso(23); vmHead(21, 4); vmArmsStr(23);
      g.generateTexture('enemy-vascular-man-hang-2', W, H);

      g.clear(); vmTorso(22); vmHead(20, 3); vmArmsStr(22);
      g.fillStyle(MUS); g.fillRect(26, 10, 12, 12);
      g.fillStyle(SK);  g.fillRect(28, 10, 10, 12); g.fillRect(31, 4, 4, 10);
      g.fillStyle(SK2); g.fillRect(28, 10, 4, 12);
      g.fillStyle(SK3); g.fillRect(35, 10, 2, 12);
      g.fillStyle(WB);  g.fillRect(30, 0, 7, 4); g.fillStyle(WB2); g.fillRect(30, 2, 7, 2);
      g.fillStyle(0xff3300); g.fillRect(30, 1, 7, 1);
      g.generateTexture('enemy-vascular-man-flex-1', W, H);

      g.clear(); vmTorso(20); vmHead(20, 1); vmArmsBent(20, 0.85);
      g.fillStyle(MUS); g.fillCircle(8, 13, 6); g.fillCircle(32, 13, 6);
      g.fillStyle(SK);  g.fillCircle(8, 13, 5); g.fillCircle(32, 13, 5);
      g.generateTexture('enemy-vascular-man-flex-2', W, H);

      g.clear(); vmTorso(16); vmHead(20, 0); vmArmsBent(16, 0.30);
      g.generateTexture('enemy-vascular-man-pullup-1', W, H);

      g.clear(); vmTorso(9);  vmHead(20, 0); vmArmsBent(9,  0.60);
      g.generateTexture('enemy-vascular-man-pullup-2', W, H);

      g.clear(); vmTorso(3);  vmHead(20, 0); vmArmsBent(3,  0.88);
      g.generateTexture('enemy-vascular-man-pullup-3', W, H);

      g.clear(); vmTorso(3);  vmHead(20, 0); vmArmsBent(3,  1.0);
      g.fillStyle(MUS); g.fillCircle(7, 6, 6); g.fillCircle(33, 6, 6);
      g.fillStyle(SK);  g.fillCircle(7, 6, 5); g.fillCircle(33, 6, 5);
      g.generateTexture('enemy-vascular-man-pullup-4', W, H);

      g.clear(); vmTorso(9);  vmHead(20, 0); vmArmsBent(9,  0.55);
      g.generateTexture('enemy-vascular-man-lower-1', W, H);

      g.clear(); vmTorso(16); vmHead(20, 0); vmArmsBent(16, 0.28);
      g.generateTexture('enemy-vascular-man-lower-2', W, H);

      g.clear(); vmTorso(24); vmHead(21, 5); vmArmsStr(24);
      g.generateTexture('enemy-vascular-man-swing-1', W, H);

      g.clear(); vmTorso(26); vmHead(23, 7); vmArmsStr(26);
      g.generateTexture('enemy-vascular-man-swing-2', W, H);

      g.clear(); vmTorso(10); vmHead(21, 0); vmArmsBent(10, 0.55);
      g.generateTexture('enemy-vascular-man-pike-1', W, H);

      g.clear(); vmTorso(2);  vmHead(20, 0); vmArmsBent(2,  0.90);
      g.fillStyle(SK);  g.fillRect(2, 46, 10, 18); g.fillRect(28, 46, 10, 18);
      g.fillStyle(SK2); g.fillRect(2, 48, 8, 16);  g.fillRect(30, 48, 8, 16);
      g.fillStyle(SH);  g.fillRect(7, 38, 26, 10);
      g.fillStyle(SHs); g.fillRect(7, 38, 2, 10);  g.fillRect(31, 38, 2, 10);
      g.generateTexture('enemy-vascular-man-pike-2', W, H);

      g.clear(); vmTorso(2);  vmHead(20, 0); vmArmsBent(2,  0.80);
      g.fillStyle(SK);  g.fillRect(2, 46, 10, 18); g.fillRect(28, 46, 10, 18);
      g.fillStyle(SK2); g.fillRect(2, 48, 8, 16);  g.fillRect(30, 48, 8, 16);
      g.fillStyle(SH);  g.fillRect(7, 38, 26, 10);
      g.fillStyle(SHs); g.fillRect(7, 38, 2, 10);  g.fillRect(31, 38, 2, 10);
      g.generateTexture('enemy-vascular-man-pike-3', W, H);

      g.clear(); vmTorso(10); vmHead(20, 0); vmArmsBent(10, 0.48);
      g.generateTexture('enemy-vascular-man-pike-4', W, H);

      g.clear(); vmTorso(22); vmHead(20, 3); vmArmsStr(22);
      g.generateTexture('enemy-vascular-man-fly-1', W, H);

      g.clear(); vmTorso(20); vmHead(19, 1); vmArmsStr(20);
      g.fillStyle(SK3); g.fillRect(2, 20, 36, 2);
      g.generateTexture('enemy-vascular-man-fly-2', W, H);

      g.clear(); vmTorso(22); vmHead(20, 3); vmArmsStr(22);
      g.fillStyle(SK);  g.fillRect(31, 0, 5, 20);
      g.fillStyle(WB);  g.fillRect(30, 0, 7, 4); g.fillStyle(WB2); g.fillRect(30, 2, 7, 2);
      g.fillStyle(0xff3300); g.fillRect(30, 1, 7, 1);
      g.generateTexture('enemy-vascular-man-reach-1', W, H);

      g.clear(); vmTorso(24); vmHead(20, 5); vmArmsStr(24);
      g.generateTexture('enemy-vascular-man-reach-2', W, H);

      g.clear(); vmTorso(28); vmHead(20, 9); vmArmsBent(28, 0.18);
      g.generateTexture('enemy-vascular-man-catch-1', W, H);

      g.clear(); vmTorso(24); vmHead(20, 5); vmArmsStr(24);
      g.generateTexture('enemy-vascular-man-catch-2', W, H);
    }

    // ── Skeletor — skull villain, purple staff, Man City trim, 40×50, 17 frames ─
    // 1 idle + 16 cast/laugh frames. jawOpen drives the laugh; eyeGlow + staffGlow the cast.
    {
      const W = 40, H = 50;

      const SKB  = 0xe8dda0;  // bone
      const SKB2 = 0xb8a860;  // bone shadow
      const SKB3 = 0xfaf4e0;  // bone highlight
      const SYE  = 0x080808;  // eye socket void
      const MCC  = 0x6cc4f0;  // Man City sky blue
      const MCC2 = 0x3a8abf;  // MC blue shadow
      const PRP  = 0x5500aa;  // deep purple robe
      const PRP2 = 0x3a0077;  // purple shadow
      const PRP3 = 0x8833dd;  // purple mid (cowl)
      const STF  = 0x7733bb;  // staff shaft
      const STF2 = 0xaa55ff;  // staff glow
      const MGC2 = 0xdd00ff;  // magic blast bright
      const WHT  = 0xffffff;  // teeth
      const DRK  = 0x0a0015;  // mouth void
      const GLW  = 0xcc66ff;  // eye glow purple
      const GLD  = 0xffd700;  // gold trim line

      // jawOpen 0=closed 1–9=open px; skullUp 0–2 shifts skull up (head thrown back);
      // eyeGlow: blazing sockets; staffGlow: charging/firing staff
      const drawSkeletor = (jawOpen: number, skullUp: number, eyeGlow: boolean, staffGlow: boolean) => {
        const sy = -skullUp; // skull y-offset (negative = moves up)

        // ── STAFF (behind body) ──
        // Ram skull topper
        g.fillStyle(SKB);
        g.fillRect(26, 0, 10, 6);
        g.fillStyle(SKB2);
        g.fillRect(26, 0, 2, 6);
        g.fillStyle(SYE);
        g.fillRect(27, 1, 3, 3);              // L eye socket
        g.fillRect(32, 1, 3, 3);              // R eye socket
        if (staffGlow) {
          g.fillStyle(MGC2);
          g.fillRect(28, 2, 2, 2);            // L eye blazing
          g.fillRect(33, 2, 2, 2);            // R eye blazing
        }
        // Ram horns
        g.fillStyle(SKB);
        g.fillRect(20, 0, 7, 2);              // L horn
        g.fillRect(20, 2, 4, 3);              // L horn curve
        g.fillRect(35, 0, 5, 2);              // R horn (x 35–39 ✓)
        g.fillRect(35, 2, 3, 3);              // R horn curve
        g.fillStyle(SKB2);
        g.fillRect(20, 0, 1, 2);

        // Staff shaft
        if (staffGlow) {
          g.fillStyle(0x220044);
          g.fillRect(28, 5, 1, 37);           // left aura fringe
          g.fillRect(32, 5, 1, 37);           // right aura fringe
          g.fillStyle(MGC2);
          g.fillRect(29, 5, 3, 4);            // magic burst at skull joint
        }
        g.fillStyle(staffGlow ? STF2 : STF);
        g.fillRect(29, 6, 3, 42);             // shaft
        g.fillStyle(PRP2);
        g.fillRect(31, 6, 1, 42);             // shaft right-edge shadow

        // ── HOOD BACK ──
        g.fillStyle(PRP2);
        g.fillRect(7, Math.max(0, 1 + sy), 18, 20);

        // ── ROBES ──
        g.fillStyle(PRP);
        g.fillRect(8, 17, 16, 14);            // torso
        g.fillStyle(PRP2);
        g.fillRect(8, 17, 2, 14);
        g.fillRect(22, 17, 2, 14);
        // Man City blue trim band
        g.fillStyle(GLD);
        g.fillRect(8, 23, 16, 1);             // gold edge line
        g.fillStyle(MCC);
        g.fillRect(8, 24, 16, 3);
        g.fillStyle(MCC2);
        g.fillRect(8, 26, 16, 1);             // trim lower shadow
        // Lower robe
        g.fillStyle(PRP);
        g.fillRect(6, 31, 20, 7);
        g.fillStyle(PRP2);
        g.fillRect(6, 31, 2, 7);
        g.fillRect(24, 31, 2, 7);
        // Robe hem flare
        g.fillStyle(PRP);
        g.fillRect(4, 38, 24, 9);
        g.fillStyle(PRP2);
        g.fillRect(4, 38, 2, 9);
        g.fillRect(26, 38, 2, 9);
        g.fillRect(4, 46, 24, 1);             // hem bottom edge

        // ── LEFT ARM (bone skeleton) ──
        g.fillStyle(SKB);
        g.fillRect(4, 17, 5, 13);
        g.fillStyle(SKB2);
        g.fillRect(4, 17, 2, 13);
        g.fillRect(4, 28, 5, 3);              // left hand

        // ── RIGHT ARM (grips staff) ──
        g.fillStyle(SKB);
        g.fillRect(24, 17, 5, 13);
        g.fillStyle(SKB2);
        g.fillRect(27, 17, 2, 13);
        g.fillRect(26, 28, 6, 3);             // hand overlaps staff at x=29–31
        g.fillStyle(PRP2);
        g.fillRect(29, 28, 1, 3);             // grip shadow on shaft

        // ── SKULL ──
        const headY = 8 + sy;

        g.fillStyle(SKB);
        g.fillCircle(15, headY, 8);           // cranium
        g.fillStyle(SKB2);
        g.fillRect(7, headY - 2, 3, 7);       // left shadow
        g.fillStyle(SKB3);
        g.fillRect(14, headY - 6, 5, 4);      // top highlight

        // Eye sockets
        g.fillStyle(SYE);
        g.fillRect(9,  headY - 3, 5, 5);
        g.fillRect(17, headY - 3, 5, 5);
        if (eyeGlow) {
          g.fillStyle(GLW);
          g.fillRect(10, headY - 2, 3, 3);
          g.fillRect(18, headY - 2, 3, 3);
          g.fillStyle(0xffffff);
          g.fillRect(11, headY - 1, 1, 1);    // bright centre L
          g.fillRect(19, headY - 1, 1, 1);    // bright centre R
        }

        // Nose cavity
        g.fillStyle(SYE);
        g.fillRect(13, headY + 2, 4, 4);

        // Upper teeth
        const teethY = headY + 6;
        g.fillStyle(WHT);
        g.fillRect(9,  teethY, 3, 2);
        g.fillRect(13, teethY, 3, 2);
        g.fillRect(17, teethY, 2, 2);

        // Jaw
        if (jawOpen > 0) {
          g.fillStyle(DRK);
          g.fillRect(9, teethY + 2, 12, jawOpen); // mouth void
          if (jawOpen >= 7) {                      // tongue flash on wide-open laugh
            g.fillStyle(0x993366);
            g.fillRect(11, teethY + 2 + jawOpen - 3, 6, 2);
          }
          const jawY = teethY + 2 + jawOpen;
          g.fillStyle(SKB);
          g.fillRect(9, jawY, 12, 3);             // lower mandible
          g.fillStyle(SKB2);
          g.fillRect(9, jawY, 2, 3);
          g.fillStyle(WHT);
          g.fillRect(10, jawY, 2, 2);             // lower teeth
          g.fillRect(14, jawY, 2, 2);
          g.fillRect(17, jawY, 2, 2);
        } else {
          g.fillStyle(SKB);
          g.fillRect(9, teethY + 2, 12, 3);       // closed jaw
          g.fillStyle(SKB2);
          g.fillRect(9, teethY + 2, 2, 3);
        }

        // ── HOOD COWLS (drawn over skull sides) ──
        g.fillStyle(PRP3);
        g.fillRect(5, Math.max(0, sy), 5, 24);
        g.fillRect(21, Math.max(0, sy), 4, 24);
        g.fillStyle(PRP2);
        g.fillRect(5, Math.max(0, sy), 2, 24);    // L cowl shadow
      };

      // ── Idle frame ──
      g.clear();
      drawSkeletor(0, 0, false, false);
      g.generateTexture('enemy-skeletor', W, H);

      // ── 16 cast + laugh frames — [jawOpen, skullUp, eyeGlow, staffGlow] ──
      // Frame 4 is the RELEASE moment — projectile fires here in Enemy.ts.
      const SK_FRAMES: Array<[number, number, boolean, boolean]> = [
        [1, 0, false, false],  // 0  jaw barely cracks — windup begins
        [2, 0, true,  false],  // 1  eyes ignite
        [4, 0, true,  true ],  // 2  staff charges
        [6, 0, true,  true ],  // 3  full charge
        [9, 0, true,  true ],  // 4  RELEASE — jaw BLASTS open, magic fires
        [9, 2, true,  true ],  // 5  head thrown back, blazing
        [9, 2, true,  false],  // 6  staff spent — laugh begins
        [2, 1, true,  false],  // 7  jaw snaps shut
        [8, 2, true,  false],  // 8  jaw cracks wide again
        [0, 1, false, false],  // 9  snap shut
        [7, 2, false, false],  // 10 open — glow fading
        [0, 1, false, false],  // 11 snap shut
        [5, 1, false, false],  // 12 half-open, slowing
        [2, 0, false, false],  // 13 settling
        [1, 0, false, false],  // 14 nearly closed
        [0, 0, false, false],  // 15 closed — returns to idle
      ];

      SK_FRAMES.forEach(([jaw, up, eGlow, sGlow], i) => {
        g.clear();
        drawSkeletor(jaw, up, eGlow, sGlow);
        g.generateTexture(`enemy-skeletor-cast-${i}`, W, H);
      });
    }

    // ── Football player jerseys (1–11) ────────────────────────────────────
    // 3×5 pixel font — bit 2 = left col, bit 0 = right col
    const DIGIT: number[][] = [
      [6, 9, 9, 9, 6],  // 0
      [4,12, 4, 4,14],  // 1  (serif foot)
      [6, 9, 2, 4,15],  // 2
      [7, 1, 3, 1, 7],  // 3
      [5, 5, 7, 1, 1],  // 4
      [7, 4, 6, 1, 6],  // 5
      [6, 4, 7, 5, 6],  // 6
      [7, 1, 2, 2, 2],  // 7
      [6, 9, 6, 9, 6],  // 8
      [6, 9, 7, 1, 6],  // 9
    ];
    const drawDigit = (dx: number, dy: number, d: number) => {
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 3; col++) {
          if (DIGIT[d][row] & (4 >> col)) g.fillRect(dx + col * 2, dy + row * 2, 2, 2);
        }
      }
    };
    const drawNum = (n: number, cx: number, cy: number) => {
      if (n < 10) {
        drawDigit(cx - 3, cy, n);                          // 6px wide, centered
      } else {
        drawDigit(cx - 7, cy, Math.floor(n / 10));         // first digit
        drawDigit(cx + 1, cy, n % 10);                     // second digit, 1px gap
      }
    };

    const jerseyColors = [
      0xffcc00, // 1   GK — yellow
      0x22aa44, // 2–5 DEF — green
      0x22aa44,
      0x22aa44,
      0x22aa44,
      0x4488ff, // 6–8 MID — blue
      0x4488ff,
      0x4488ff,
      0xff3333, // 9–11 FWD — red
      0xff3333,
      0xff3333,
      0xff8800, // 12  GK bench  — orange
      0xdd44aa, // 13  FWD bench — pink
      0x00bbcc, // 14  MID bench — teal
      0x998822, // 15  DEF bench — olive
    ];

    for (let i = 1; i <= 15; i++) {
      const jc = jerseyColors[i - 1];
      // Darken shade for shorts
      const dr = Math.floor(((jc >> 16) & 0xff) * 0.65);
      const dg = Math.floor(((jc >>  8) & 0xff) * 0.65);
      const db = Math.floor(( jc        & 0xff) * 0.65);
      const jDark = (dr << 16) | (dg << 8) | db;
      // Lighter shade for sleeve highlight
      const lr = Math.min(255, Math.floor(((jc >> 16) & 0xff) * 1.35));
      const lg = Math.min(255, Math.floor(((jc >>  8) & 0xff) * 1.35));
      const lb = Math.min(255, Math.floor(( jc        & 0xff) * 1.35));
      const jLight = (lr << 16) | (lg << 8) | lb;

      g.clear();

      // ── Shirt body (32×36) ───────────────────────────────────────
      g.fillStyle(jc);
      g.fillRect(5,  2, 22, 18);    // main body
      g.fillRect(0,  2,  6, 13);    // left sleeve
      g.fillRect(26, 2,  6, 13);    // right sleeve

      // Sleeve top highlight
      g.fillStyle(jLight);
      g.fillRect(0,  2,  6,  2);
      g.fillRect(26, 2,  6,  2);

      // Shirt collar (white V-neck)
      g.fillStyle(0xffffff);
      g.fillRect(12, 2,  8,  2);    // collar bar
      g.fillRect(14, 4,  4,  3);    // V-neck drop

      // Sleeve cuffs (white band)
      g.fillStyle(0xffffff);
      g.fillRect(0,  13,  6, 2);
      g.fillRect(26, 13,  6, 2);

      // Subtle side seam shadow
      g.fillStyle(0x000000, 0.18);
      g.fillRect(5,  2,  1, 18);
      g.fillRect(26, 2,  1, 18);

      // ── Shorts ──────────────────────────────────────────────────
      g.fillStyle(jDark);
      g.fillRect(6, 20, 20, 12);

      // Shorts waistband
      g.fillStyle(0xffffff);
      g.fillRect(6, 20, 20,  2);

      // Centre shorts split
      g.fillStyle(0x000000, 0.15);
      g.fillRect(15, 22,  2, 10);

      // ── Number patch ────────────────────────────────────────────
      g.fillStyle(0xffffff);
      g.fillRect(8,  5, 16, 13);    // wider patch for 2×2 font

      // Subtle patch border
      g.fillStyle(0x000000, 0.12);
      g.fillRect(8,  5, 16,  1);
      g.fillRect(8, 17, 16,  1);
      g.fillRect(8,  5,  1, 13);
      g.fillRect(23, 5,  1, 13);

      // Number in dark ink, centered at (16, 7) — 2×2 pixel font
      g.fillStyle(0x111111);
      drawNum(i, 16, 7);

      g.generateTexture(`player-${i}`, 32, 36);
    }

    // ── Bonus coins ──────────────────────────────────────────────────────────
    // 3×5 uppercase pixel font (2×2 scale) for T C B W F H
    const LETTER: Record<string, number[]> = {
      T: [7, 2, 2, 2, 2],
      C: [7, 4, 4, 4, 7],
      B: [6, 5, 6, 5, 6],
      W: [5, 5, 5, 7, 2],
      F: [7, 4, 6, 4, 4],
      H: [5, 5, 7, 5, 5],
    };
    const drawLetter = (dx: number, dy: number, l: string) => {
      const bits = LETTER[l];
      if (!bits) return;
      for (let row = 0; row < 5; row++)
        for (let col = 0; col < 3; col++)
          if (bits[row] & (4 >> col)) g.fillRect(dx + col * 2, dy + row * 2, 2, 2);
    };

    // 24×24 coins — dark rim, coloured body, specular, 2-letter code
    const coinDefs = [
      { key: 'coin-tc', base: 0xffcc00, dark: 0xaa8800, shine: 0xffee88, label: 'TC' },
      { key: 'coin-bb', base: 0x00ccff, dark: 0x007799, shine: 0x88eeff, label: 'BB' },
      { key: 'coin-ww', base: 0xcc44ff, dark: 0x881acc, shine: 0xee88ff, label: 'WC' },
      { key: 'coin-fh', base: 0x44ee44, dark: 0x229922, shine: 0xaaffaa, label: 'FH' },
    ];
    for (const { key, base, dark, shine, label } of coinDefs) {
      g.clear();
      g.fillStyle(dark);  g.fillCircle(16, 16, 15);  // 1px dark rim
      g.fillStyle(base);  g.fillCircle(16, 16, 14);  // main coin
      g.fillStyle(shine); g.fillCircle(12, 11,  4);  // specular highlight
      g.fillStyle(0x111111);
      drawLetter(10, 11, label[0]);
      drawLetter(17, 11, label[1]);
      g.generateTexture(key, 32, 32);
    }

    // ── Projectiles ───────────────────────────────────────────────────────
    // Bubble
    g.clear();
    g.fillStyle(0x88ccff, 0.55); g.fillCircle(10, 10, 10);
    g.fillStyle(0xffffff, 0.7);  g.fillCircle(7, 7, 3);
    g.generateTexture('proj-bubble', 20, 20);

    // Mallet
    g.clear();
    g.fillStyle(0x885522); g.fillRect(0, 8, 30, 10);
    g.fillStyle(0xaa7744); g.fillRect(12, 0, 6, 28);
    g.generateTexture('proj-mallet', 30, 28);

    // Beer crate — 26×20, three bottles in cells (side view)
    {
      const CW = 0xc89830;  // crate wood (warm golden)
      const CD = 0x7a5c08;  // dark frame/posts
      const BG = 0x336622;  // green bottle glass
      const BC = 0xddaa00;  // bottle cap gold
      const BL = 0xff6600;  // orange label band

      g.clear();
      // Wood fill
      g.fillStyle(CW); g.fillRect(0, 0, 26, 20);
      // Outer frame (2px posts top/bottom/sides)
      g.fillStyle(CD);
      g.fillRect(0,  0, 26,  2);   // top rail
      g.fillRect(0, 18, 26,  2);   // bottom rail
      g.fillRect(0,  0,  2, 20);   // left post
      g.fillRect(24, 0,  2, 20);   // right post
      // Vertical dividers creating 3 cells (x=2-8, 10-16, 18-24)
      g.fillRect(8,  0, 2, 20);
      g.fillRect(16, 0, 2, 20);
      // Bottle in cell 1 (x=2-8)
      g.fillStyle(BG); g.fillRect(3, 2, 4, 16);    // bottle body
      g.fillStyle(BC); g.fillRect(3, 2, 4,  3);    // cap
      g.fillStyle(BL); g.fillRect(3, 9, 4,  4);    // label
      g.fillStyle(0x222200); g.fillRect(4, 14, 2, 4); // shadow/liquid
      // Bottle in cell 2 (x=10-16)
      g.fillStyle(BG); g.fillRect(11, 2, 4, 16);
      g.fillStyle(BC); g.fillRect(11, 2, 4,  3);
      g.fillStyle(BL); g.fillRect(11, 9, 4,  4);
      g.fillStyle(0x222200); g.fillRect(12, 14, 2, 4);
      // Bottle in cell 3 (x=18-24)
      g.fillStyle(BG); g.fillRect(19, 2, 4, 16);
      g.fillStyle(BC); g.fillRect(19, 2, 4,  3);
      g.fillStyle(BL); g.fillRect(19, 9, 4,  4);
      g.fillStyle(0x222200); g.fillRect(20, 14, 2, 4);
      g.generateTexture('proj-crate', 26, 20);
    }

    // Pie — 22×14, golden crust with filling
    g.clear();
    g.fillStyle(0xd4a030); g.fillRect(0, 6, 22, 8);   // pastry base
    g.fillStyle(0xf0d860); g.fillRect(2, 3, 18, 7);   // cream filling
    g.fillStyle(0xd4a030); g.fillRect(0, 3, 22, 3);   // crust rim top
    g.fillStyle(0xd4a030); g.fillRect(0, 11, 22, 3);  // crust rim bottom
    g.fillStyle(0xbb5520); g.fillRect(4, 4, 4, 4);    // jam detail L
    g.fillStyle(0xbb5520); g.fillRect(14, 4, 4, 4);   // jam detail R
    g.generateTexture('proj-pie', 22, 14);

    // Glass shard — 8×12 triangle
    g.clear();
    g.fillStyle(0xaaddff, 0.9); g.fillTriangle(4, 0, 8, 12, 0, 12);
    g.fillStyle(0xffffff, 0.7); g.fillRect(3, 1, 2, 4);
    g.generateTexture('proj-glass-shard', 8, 12);

    // Crate smash frames — 26×20 (same size as crate)
    {
      const CW = 0xb89220, CD = 0x8a6a10, BG = 0x447722;

      // smash-1: fresh impact — crate cracking
      g.clear();
      g.fillStyle(CW); g.fillRect(0, 4, 26, 16);
      g.fillStyle(CD); g.fillRect(0, 4, 26, 2); g.fillRect(0, 18, 26, 2);
      g.fillStyle(CD); g.fillRect(0, 4, 2, 16); g.fillRect(24, 4, 2, 16);
      g.fillRect(8, 4, 2, 16); g.fillRect(16, 4, 2, 16);
      g.fillStyle(BG); g.fillRect(2, 0, 5, 5); g.fillRect(10, 0, 5, 5); g.fillRect(18, 0, 5, 5);
      // Cracks
      g.fillStyle(0x3a2800); g.fillRect(5, 4, 1, 12); g.fillRect(20, 8, 6, 1);
      g.generateTexture('proj-crate-smash-1', 26, 20);

      // smash-2: breaking apart — bottom half intact, bottles flying
      g.clear();
      g.fillStyle(CW); g.fillRect(0, 12, 26, 8); g.fillRect(0, 16, 26, 4);
      g.fillStyle(CD); g.fillRect(0, 12, 2, 8); g.fillRect(24, 12, 2, 8);
      g.fillStyle(BG); g.fillRect(1, 2, 5, 10); g.fillRect(11, 0, 5, 8); g.fillRect(19, 4, 5, 8);
      g.fillStyle(0xee9900, 0.8); g.fillRect(2, 14, 22, 4); // beer splash
      g.generateTexture('proj-crate-smash-2', 26, 20);

      // smash-3: debris only
      g.clear();
      g.fillStyle(CW); g.fillRect(2, 14, 6, 4); g.fillRect(14, 12, 5, 4); g.fillRect(20, 10, 4, 3);
      g.fillStyle(0xee9900, 0.7); g.fillRect(0, 16, 26, 4);
      g.fillStyle(BG); g.fillRect(3, 8, 3, 6); g.fillRect(18, 6, 3, 6);
      g.generateTexture('proj-crate-smash-3', 26, 20);
    }

    // Padel ball
    g.clear();
    g.fillStyle(0xccff00); g.fillCircle(7, 7, 7);
    g.generateTexture('proj-padel-ball', 14, 14);

    // Golf ball
    g.clear();
    g.fillStyle(0xffffff); g.fillCircle(7, 7, 7);
    g.fillStyle(0xdddddd); g.fillCircle(5, 5, 2);
    g.generateTexture('proj-golf-ball', 14, 14);

    // Football (bubble blower kick)
    g.clear();
    g.fillStyle(0xffffff); g.fillCircle(8, 8, 8);
    g.fillStyle(0x111111);
    g.fillRect(5,  1,  6,  3);   // top patch
    g.fillRect(1,  5,  3,  6);   // left patch
    g.fillRect(12, 5,  3,  6);   // right patch
    g.fillRect(5, 12,  6,  3);   // bottom patch
    g.fillRect(5,  5,  6,  6);   // centre pentagon
    g.fillStyle(0xffffff);
    g.fillRect(6,  2,  4,  1);   // re-open top stripe gap
    g.fillRect(2,  6,  1,  4);
    g.fillRect(13, 6,  1,  4);
    g.fillRect(6, 13,  4,  1);
    g.fillStyle(0xdddddd);       // specular highlight
    g.fillRect(3,  3,  3,  2);
    g.generateTexture('proj-football', 16, 16);

    // Beer — amber pint glass flying sideways, 18×22
    g.clear();
    g.fillStyle(0x220011); g.fillRect(0, 0, 14, 20);  // glass outline
    g.fillStyle(0xcc8800); g.fillRect(1, 4, 12, 15);  // amber beer
    g.fillStyle(0xeeeedd); g.fillRect(1, 1, 12,  4);  // foam
    g.fillStyle(0xffcc44); g.fillRect(2, 5,  3, 12);  // beer highlight
    g.fillStyle(0x220011); g.fillRect(14, 5, 4, 10);  // handle outer
    g.fillStyle(0xcc8800); g.fillRect(15, 7, 2,  6);  // handle inner
    g.generateTexture('proj-beer', 18, 22);

    // Dark magic
    g.clear();
    g.fillStyle(0x8800ff);
    g.fillTriangle(8, 0, 16, 14, 0, 14);
    g.fillTriangle(8, 16, 16, 2, 0, 2);
    g.fillStyle(0xcc44ff, 0.7); g.fillCircle(8, 8, 5);
    g.generateTexture('proj-dark-magic', 16, 16);

    // Coat — trench coat / overcoat, 26×20
    {
      const CB = 0x7a5028;   // camel coat body
      const CL = 0xa07848;   // highlight
      const CD = 0x3a2008;   // dark crease / shadow
      const LN = 0xc09050;   // lapel lining
      const GD = 0xd4aa30;   // gold buckle

      g.clear();
      // Left sleeve
      g.fillStyle(CB); g.fillRect(0,  0, 9, 9);
      g.fillStyle(CL); g.fillRect(0,  0, 9, 2);  // top highlight
      g.fillStyle(CD); g.fillRect(0,  7, 9, 2);  // cuff shadow
      // Right sleeve
      g.fillStyle(CB); g.fillRect(17, 0, 9, 9);
      g.fillStyle(CL); g.fillRect(17, 0, 9, 2);
      g.fillStyle(CD); g.fillRect(17, 7, 9, 2);
      // Main body
      g.fillStyle(CB); g.fillRect(6, 3, 14, 17);
      // Left lapel (open, showing lining)
      g.fillStyle(LN); g.fillRect(6,  3, 4, 8);
      g.fillStyle(CB); g.fillRect(7,  4, 3, 7);
      // Right lapel
      g.fillStyle(LN); g.fillRect(16, 3, 4, 8);
      g.fillStyle(CB); g.fillRect(16, 4, 3, 7);
      // Belt + gold buckle
      g.fillStyle(CD); g.fillRect(6, 13, 14, 2);
      g.fillStyle(GD); g.fillRect(11, 12, 4, 4);
      g.fillStyle(CD); g.fillRect(12, 13, 2, 2);  // buckle hole
      // Buttons
      g.fillStyle(CD); g.fillRect(12, 5, 2, 2); g.fillRect(12, 9, 2, 2);
      // Crease lines
      g.fillStyle(CD); g.fillRect(6, 5, 1, 8); g.fillRect(19, 5, 1, 8);
      g.generateTexture('proj-coat', 26, 20);
    }

    // Platform tile (reused)
    g.clear();
    g.fillStyle(0x445566); g.fillRect(0, 0, 8, 14);
    g.fillStyle(0x6688aa); g.fillRect(0, 0, 8, 3);
    g.generateTexture('platform-tile', 8, 14);

    g.destroy();
  }
}
