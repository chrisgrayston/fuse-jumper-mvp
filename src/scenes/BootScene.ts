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
        g.fillStyle(MG);  g.fillCircle(CX, 7, 9);
        g.fillStyle(MD);
        g.fillRect(CX-8, 0, 2, 13);  g.fillRect(CX-3, 0, 2, 14);
        g.fillRect(CX+2, 0, 2, 14);  g.fillRect(CX+6, 0, 2, 13);
        g.fillStyle(MR);  g.fillRect(CX-9, 13, 18, 4);
        g.fillStyle(QRW); g.fillRect(CX-10, 12, 20, 2);
        g.fillStyle(0x111111);
        g.fillRect(CX-4, 14, 2, 2);  g.fillRect(CX+1, 14, 2, 2);  g.fillRect(CX+5, 14, 2, 2);
      };

      const face = () => {
        g.fillStyle(SK);       g.fillRect(CX-7, 15, 14, 9);
        g.fillStyle(EY);       g.fillRect(CX-5, 17, 3, 3);  g.fillRect(CX+2, 17, 3, 3);
        g.fillStyle(QRW);      g.fillRect(CX-5, 17, 1, 1);  g.fillRect(CX+2, 17, 1, 1);
        g.fillStyle(0xcc7744); g.fillRect(CX-2, 21, 4, 2);
        g.fillStyle(SK);       g.fillRect(CX-3, 24, 6, 3);
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

    // ── Padel Punisher — red/black, racket shape ──────────────────────────
    g.clear();
    g.fillStyle(0xcc1100); g.fillRect(2, 6, 22, 24);
    g.fillStyle(0x111111); g.fillRect(22, 0, 10, 20);  // racket handle/head
    g.fillStyle(0xcccccc); g.fillRect(24, 2, 6, 14);   // racket face
    g.fillStyle(0xffcc88); g.fillRect(7, 0, 12, 8);
    g.generateTexture('enemy-padel-punisher', 32, 30);

    // ── Condor — Crystal Palace red/blue angular ──────────────────────────
    g.clear();
    g.fillStyle(0xcc0000);
    g.fillTriangle(14, 0, 28, 28, 0, 28);
    g.fillStyle(0x0033cc); g.fillRect(6, 14, 16, 14);
    g.fillStyle(0xffcc88); g.fillRect(8, 8, 12, 8);
    g.generateTexture('enemy-condor', 28, 28);

    // ── Giant Bear — brown bear, white shirt, 40×36 ──────────────────────
    {
      const FUR = 0x7a4520;   // mid fur
      const SNT = 0xaa6640;   // snout / inner ear / paws
      const EY  = 0x0a0500;   // near-black eyes
      const WSH = 0xffffff;   // white shirt
      const SHD = 0xcccccc;   // shirt shadow

      g.clear();
      // Ears
      g.fillStyle(FUR); g.fillRect(2,  0, 8, 7);  g.fillStyle(SNT); g.fillRect(3,  1, 5, 4);  // L
      g.fillStyle(FUR); g.fillRect(30, 0, 8, 7);  g.fillStyle(SNT); g.fillRect(31, 1, 5, 4);  // R
      // Head
      g.fillStyle(FUR); g.fillRect(5, 3, 30, 18);
      // Eyes (larger — it's a bigger bear)
      g.fillStyle(EY);       g.fillRect(12, 8, 5, 5);  g.fillStyle(0xffffff); g.fillRect(12, 8, 2, 2);
      g.fillStyle(EY);       g.fillRect(23, 8, 5, 5);  g.fillStyle(0xffffff); g.fillRect(23, 8, 2, 2);
      // Snout + nose + nostrils
      g.fillStyle(SNT); g.fillRect(13, 15, 14, 8);
      g.fillStyle(EY);  g.fillRect(17, 16, 6, 3);   // nose bridge
      g.fillStyle(EY);  g.fillRect(18, 19, 4, 2);   // mouth line
      g.fillStyle(SNT); g.fillRect(18, 17, 2, 2);   // L nostril
      g.fillStyle(SNT); g.fillRect(22, 17, 2, 2);   // R nostril
      // Neck
      g.fillStyle(FUR); g.fillRect(16, 21, 8, 4);
      // White shirt
      g.fillStyle(WSH); g.fillRect(5, 25, 30, 11);
      g.fillStyle(SHD); g.fillRect(5, 34, 30, 2);   // hem shadow
      // Arms + paw pads
      g.fillStyle(FUR); g.fillRect(0,  25, 6, 11);  g.fillStyle(SNT); g.fillRect(0,  33, 6, 3);  // L
      g.fillStyle(FUR); g.fillRect(34, 25, 6, 11);  g.fillStyle(SNT); g.fillRect(34, 33, 6, 3);  // R
      g.generateTexture('enemy-giant-bear', 40, 36);
    }

    // ── Actuary Man — Liverpool red suit, glasses ─────────────────────────
    g.clear();
    g.fillStyle(0xcc0000); g.fillRect(2, 8, 22, 22);
    g.fillStyle(0xffcc88); g.fillRect(7, 0, 12, 10);
    g.fillStyle(0x333333); g.fillRect(6, 4, 5, 3); g.fillRect(15, 4, 5, 3); // glasses
    g.fillStyle(0xffffff); g.fillRect(9, 14, 8, 10);   // calculator/shirt
    g.generateTexture('enemy-actuary-man', 26, 30);

    // ── Puffin — black/white/orange, tuxedo, golf club ───────────────────
    g.clear();
    g.fillStyle(0x111111); g.fillRect(2, 4, 22, 26);   // body
    g.fillStyle(0xffffff); g.fillRect(6, 8, 14, 14);   // white belly
    g.fillStyle(0xff7700); g.fillTriangle(13, 0, 20, 6, 6, 6); // beak
    g.fillStyle(0x888888); g.fillRect(24, 14, 4, 20);  // golf club shaft
    g.generateTexture('enemy-puffin', 28, 30);

    // ── Vascular Man — muscular, West Ham claret/blue ─────────────────────
    g.clear();
    g.fillStyle(0x7b003c); g.fillRect(0, 4, 32, 26);
    g.fillStyle(0xff8866);                               // veins/muscles
    g.fillRect(2, 8, 4, 16); g.fillRect(26, 8, 4, 16);
    g.fillRect(8, 4, 16, 4);
    g.fillStyle(0xffcc88); g.fillRect(8, 0, 16, 6);
    g.generateTexture('enemy-vascular-man', 32, 30);

    // ── Skeletor — Man City sky blue, skull, purple magic ────────────────
    g.clear();
    g.fillStyle(0x6600aa); g.fillRect(2, 8, 24, 22);
    g.fillStyle(0x66ccff); g.fillRect(4, 8, 20, 8);    // City kit hint
    g.fillStyle(0xddddaa); g.fillCircle(14, 5, 8);     // skull
    g.fillStyle(0x222222); g.fillRect(9, 3, 4, 3); g.fillRect(15, 3, 4, 3); // eye sockets
    g.generateTexture('enemy-skeletor', 28, 30);

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
