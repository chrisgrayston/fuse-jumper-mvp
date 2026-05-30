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
    this.load.image('art-club1800',       './art/Club1800b.jpeg');
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

    // ── Player — 6 animation states, 40×50 px, always drawn facing RIGHT ──
    // setFlipX handles left-facing; cape is on the left = character's back.
    {
      const SK = 0xffcc88; // skin
      const HR = 0x2b1d0e; // hair
      const ST = 0xf0f0f0; // shirt
      const JN = 0x1d3d8b; // jeans
      const BT = 0x1a1a2e; // boots
      const CA = 0x7700cc; // cape outer
      const CI = 0xcc55ff; // cape inner
      const EY = 0x222233; // eyes

      // Shared helper: draw head+eyes+neck at face origin (fx, fy)
      const drawHead = (fx: number, fy: number) => {
        g.fillStyle(HR); g.fillRect(fx, fy,      16, 7); g.fillRect(fx - 1, fy + 3, 3, 7);
        g.fillStyle(SK); g.fillRect(fx, fy + 3,  16, 11);
        g.fillStyle(EY); g.fillRect(fx + 3, fy + 6, 3, 3); g.fillRect(fx + 10, fy + 6, 3, 3);
        g.fillStyle(0xffffff); g.fillRect(fx + 3, fy + 6, 1, 1); g.fillRect(fx + 10, fy + 6, 1, 1);
        g.fillStyle(SK); g.fillRect(fx + 4, fy + 14, 7, 3); // neck
      };

      // Shared: slim torso (wide shoulders, narrow waist)
      const drawTorso = (tx: number, ty: number) => {
        g.fillStyle(ST); g.fillRect(tx, ty,     20, 5);  // shoulders
        g.fillStyle(ST); g.fillRect(tx + 4, ty + 5, 12, 5); // waist
      };

      // ── player-idle: cape hanging, arms at sides ─────────────────────
      g.clear();
      g.fillStyle(CA); g.fillRect(2, 14, 12, 32); g.fillStyle(CI); g.fillRect(3, 15, 9, 28);
      drawHead(12, 2);
      drawTorso(10, 19);
      g.fillStyle(ST); g.fillRect( 4, 19, 7, 11); g.fillStyle(SK); g.fillRect( 4, 29, 6, 4);
      g.fillStyle(ST); g.fillRect(29, 19, 7, 11); g.fillStyle(SK); g.fillRect(30, 29, 6, 4);
      g.fillStyle(JN); g.fillRect(12, 29, 16, 5);
      g.fillStyle(JN); g.fillRect(12, 34, 6, 11); g.fillRect(22, 34, 6, 11);
      g.fillStyle(BT); g.fillRect(11, 44, 8, 5);  g.fillRect(22, 44, 8, 5);
      g.generateTexture('player-idle', 40, 50);

      // ── player-tap: right foot raised (idle >1 s) ────────────────────
      g.clear();
      g.fillStyle(CA); g.fillRect(2, 14, 12, 32); g.fillStyle(CI); g.fillRect(3, 15, 9, 28);
      drawHead(12, 2);
      drawTorso(10, 19);
      g.fillStyle(ST); g.fillRect( 4, 19, 7, 11); g.fillStyle(SK); g.fillRect( 4, 29, 6, 4);
      g.fillStyle(ST); g.fillRect(29, 19, 7, 11); g.fillStyle(SK); g.fillRect(30, 29, 6, 4);
      g.fillStyle(JN); g.fillRect(12, 29, 16, 5);
      g.fillStyle(JN); g.fillRect(12, 34, 6, 11); g.fillRect(22, 34, 6, 8); // R leg 3 px shorter
      g.fillStyle(BT); g.fillRect(11, 44, 8, 5);  g.fillRect(22, 41, 8, 5); // R boot raised 3 px
      g.generateTexture('player-tap', 40, 50);

      // ── player-run-1: right leg forward, left arm raised ─────────────
      g.clear();
      g.fillStyle(CA); g.fillTriangle(14, 14, 0, 34, 8, 49);
      g.fillStyle(CI); g.fillTriangle(14, 16, 2, 34, 9, 45);
      drawHead(14, 1);
      drawTorso(12, 18);
      g.fillStyle(ST); g.fillRect( 6, 20, 7, 6);  g.fillStyle(SK); g.fillRect( 4, 25, 6, 4); // back arm
      g.fillStyle(ST); g.fillRect(30, 15, 6, 9);  g.fillStyle(SK); g.fillRect(32, 23, 5, 4); // front arm raised
      g.fillStyle(JN); g.fillRect(14, 28, 14, 4);
      g.fillStyle(JN); g.fillRect(22, 32, 6, 8);  g.fillRect(23, 40, 5, 6); // right leg forward
      g.fillStyle(JN); g.fillRect(12, 32, 6, 5);  g.fillRect(10, 37, 5, 8); // left leg back
      g.fillStyle(BT); g.fillRect( 9, 44, 7, 4);  g.fillRect(22, 45, 8, 4);
      g.generateTexture('player-run-1', 40, 50);

      // ── player-run-2: left leg forward, right arm raised ─────────────
      g.clear();
      g.fillStyle(CA); g.fillTriangle(14, 14, 0, 34, 8, 49);
      g.fillStyle(CI); g.fillTriangle(14, 16, 2, 34, 9, 45);
      drawHead(14, 1);
      drawTorso(12, 18);
      g.fillStyle(ST); g.fillRect(28, 20, 7, 6);  g.fillStyle(SK); g.fillRect(30, 25, 6, 4); // back arm
      g.fillStyle(ST); g.fillRect( 4, 15, 6, 9);  g.fillStyle(SK); g.fillRect( 3, 23, 5, 4); // front arm raised
      g.fillStyle(JN); g.fillRect(14, 28, 14, 4);
      g.fillStyle(JN); g.fillRect(12, 32, 6, 8);  g.fillRect(11, 40, 5, 6); // left leg forward
      g.fillStyle(JN); g.fillRect(22, 32, 6, 5);  g.fillRect(24, 37, 5, 8); // right leg back
      g.fillStyle(BT); g.fillRect(10, 45, 8, 4);  g.fillRect(23, 44, 7, 4);
      g.generateTexture('player-run-2', 40, 50);

      // ── player-jump: arms raised, cape fans up-left ───────────────────
      g.clear();
      g.fillStyle(CA); g.fillTriangle(13, 16,  0,  1, 5, 34);
      g.fillStyle(CI); g.fillTriangle(13, 18,  2,  3, 6, 30);
      drawHead(12, 3);
      drawTorso(10, 20);
      g.fillStyle(ST); g.fillRect( 4, 12, 8, 11); g.fillStyle(SK); g.fillRect( 3,  9, 7, 5); // arms up
      g.fillStyle(ST); g.fillRect(28, 12, 8, 11); g.fillStyle(SK); g.fillRect(30,  9, 7, 5);
      g.fillStyle(JN); g.fillRect(12, 29, 16, 4);
      g.fillStyle(JN); g.fillRect(11, 33, 6, 10); g.fillRect(23, 33, 6,  9);
      g.fillStyle(BT); g.fillRect(10, 42, 7,  4); g.fillRect(22, 41, 7,  4);
      g.generateTexture('player-jump', 40, 50);

      // ── player-float: cape billows above, arms glide wide ─────────────
      g.clear();
      g.fillStyle(CA); g.fillRect(0, 0, 18, 9); g.fillRect(1, 9, 14, 8); g.fillRect(3, 17, 11, 6);
      g.fillStyle(CI); g.fillRect(1, 1, 13, 6);  g.fillRect(2, 7, 10, 7); g.fillRect(4, 15,  8, 5);
      drawHead(16, 5);
      drawTorso(14, 22);
      g.fillStyle(ST); g.fillRect( 3, 23, 12, 5); g.fillStyle(SK); g.fillRect( 1, 23, 4, 4); // L arm spread
      g.fillStyle(ST); g.fillRect(32, 23,  7, 5); g.fillStyle(SK); g.fillRect(37, 23, 3, 4); // R arm spread
      g.fillStyle(JN); g.fillRect(16, 31, 14, 4);
      g.fillStyle(JN); g.fillRect(15, 35,  6, 12); g.fillRect(25, 35, 6, 12);
      g.fillStyle(BT); g.fillRect(14, 46,  7,  4); g.fillRect(25, 46, 7,  4);
      g.generateTexture('player-float', 40, 50);

      // ── player-fall: arms bracing, cape trailing up ───────────────────
      g.clear();
      g.fillStyle(CA); g.fillTriangle(13, 15,  1,  2, 7, 38);
      g.fillStyle(CI); g.fillTriangle(13, 17,  3,  5, 8, 33);
      drawHead(12, 3);
      drawTorso(10, 20);
      g.fillStyle(ST); g.fillRect( 2, 20, 10, 6); g.fillStyle(SK); g.fillRect( 1, 20, 3, 5); // arms out
      g.fillStyle(ST); g.fillRect(28, 20, 10, 6); g.fillStyle(SK); g.fillRect(36, 20, 3, 5);
      g.fillStyle(JN); g.fillRect(12, 29, 16, 4);
      g.fillStyle(JN); g.fillRect(12, 33,  6, 12); g.fillRect(22, 33, 6, 12);
      g.fillStyle(BT); g.fillRect(11, 44,  7,  5); g.fillRect(22, 44, 7,  5);
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
    g.fillStyle(0xffcc88); g.fillRect(14, 2, 16, 16);   // bald head (rect, no fillCircle)
    g.fillStyle(0x222222); g.fillRect(19, 8, 2, 2);     // left eye
    g.fillStyle(0x222222); g.fillRect(24, 8, 2, 2);     // right eye
    g.fillStyle(0xffcc88); g.fillRect(19, 17, 6, 3);    // neck
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
    g.fillStyle(0xffcc88); g.fillRect(14, 2, 16, 16);
    g.fillStyle(0x222222); g.fillRect(19, 8, 2, 2);
    g.fillStyle(0x222222); g.fillRect(24, 8, 2, 2);
    g.fillStyle(0xffcc88); g.fillRect(19, 17, 6, 3);
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
    g.fillStyle(0xffcc88); g.fillRect(14, 2, 16, 16);
    g.fillStyle(0x222222); g.fillRect(19, 8, 2, 2);
    g.fillStyle(0x222222); g.fillRect(24, 8, 2, 2);
    g.fillStyle(0xffcc88); g.fillRect(19, 17, 6, 3);
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
    g.fillStyle(0xffcc88); g.fillRect(14, 2, 16, 16);
    g.fillStyle(0x222222); g.fillRect(19, 8, 2, 2);
    g.fillStyle(0x222222); g.fillRect(24, 8, 2, 2);
    g.fillStyle(0xffcc88); g.fillRect(19, 17, 6, 3);
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

    // ── Rushy — black cassock, white collar, Man Utd red flash ───────────
    g.clear();
    g.fillStyle(0x111111); g.fillRect(2, 6, 22, 26);
    g.fillStyle(0xffffff); g.fillRect(9, 6, 8, 6);     // collar
    g.fillStyle(0xcc0000); g.fillRect(0, 14, 26, 4);   // Man Utd stripe
    g.fillStyle(0xffcc88); g.fillRect(7, 0, 12, 8);    // face
    g.generateTexture('enemy-rushy', 26, 32);

    // ── Smaller Bear — small brown, Spurs white kit ──────────────────────
    g.clear();
    g.fillStyle(0x8b5e3c); g.fillRect(2, 4, 20, 22);
    g.fillStyle(0xffffff); g.fillRect(4, 8, 16, 10);   // Spurs kit
    g.fillStyle(0x8b5e3c); g.fillCircle(12, 4, 6);     // head
    g.generateTexture('enemy-smaller-bear', 24, 28);

    // ── Melonhead — green watermelon head, QPR blue/white stripes ────────
    g.clear();
    g.fillStyle(0x1144aa); g.fillRect(1, 10, 26, 22);
    g.fillStyle(0xffffff);
    for (let i = 0; i < 4; i++) g.fillRect(1 + i * 7, 10, 3, 22); // stripes
    g.fillStyle(0x22aa44); g.fillCircle(14, 6, 9);     // melon head
    g.fillStyle(0x115522); g.fillRect(8, 2, 12, 3);    // rind
    g.generateTexture('enemy-melonhead', 28, 32);

    // ── Clippy — grey suit, red folder, SE3 ──────────────────────────────
    g.clear();
    g.fillStyle(0x666677); g.fillRect(2, 8, 22, 22);
    g.fillStyle(0xcc2200); g.fillRect(18, 12, 10, 14); // folder
    g.fillStyle(0xffcc88); g.fillRect(7, 0, 12, 9);
    g.generateTexture('enemy-clippy', 30, 30);

    // ── Butter Fingers — tall, Birmingham blue, parkour ──────────────────
    g.clear();
    g.fillStyle(0x0033aa); g.fillRect(3, 6, 18, 30);
    g.fillStyle(0xffcc88); g.fillRect(6, 0, 12, 8);
    g.fillStyle(0xffaa00); g.fillRect(0, 18, 24, 3);   // corona crate band
    g.generateTexture('enemy-butter-fingers', 24, 36);

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

    // ── Giant Bear — large brown, Spurs kit ──────────────────────────────
    g.clear();
    g.fillStyle(0x7a4e2d); g.fillRect(0, 6, 40, 30);
    g.fillStyle(0xffffff); g.fillRect(6, 10, 28, 14);  // Spurs kit
    g.fillStyle(0x7a4e2d); g.fillCircle(20, 6, 8);
    g.generateTexture('enemy-giant-bear', 40, 36);

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
      g.fillStyle(dark);  g.fillCircle(12, 12, 11);  // 1px dark rim
      g.fillStyle(base);  g.fillCircle(12, 12, 10);  // main coin
      g.fillStyle(shine); g.fillCircle(9, 8, 3);     // specular highlight
      g.fillStyle(0x111111);
      drawLetter(6,  7, label[0]);   // first letter, centred pair at x≈12
      drawLetter(13, 7, label[1]);
      g.generateTexture(key, 24, 24);
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

    // Crate
    g.clear();
    g.fillStyle(0xeecc88); g.fillRect(0, 0, 22, 18);
    g.fillStyle(0xaa8844); g.fillRect(0, 0, 22, 3); g.fillRect(0, 15, 22, 3);
    g.fillRect(10, 0, 3, 18);
    g.generateTexture('proj-crate', 22, 18);

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

    // Coat (smaller bear throw)
    g.clear();
    g.fillStyle(0x886644); g.fillRect(0, 4, 24, 14);
    g.fillStyle(0xaa8866); g.fillRect(0, 0, 10, 6); g.fillRect(14, 0, 10, 6);
    g.generateTexture('proj-coat', 24, 18);

    // Platform tile (reused)
    g.clear();
    g.fillStyle(0x445566); g.fillRect(0, 0, 8, 14);
    g.fillStyle(0x6688aa); g.fillRect(0, 0, 8, 3);
    g.generateTexture('platform-tile', 8, 14);

    g.destroy();
  }
}
