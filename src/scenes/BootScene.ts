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
    this.load.image('art-club1800',       './art/Club1800.jpeg');
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

    // ── Player — 5 animation states, 40×50 px, always drawn facing RIGHT ──
    // setFlipX handles left-facing; cape is on the left = character's back.
    {
      const SK = 0xffcc88; // skin
      const HR = 0x2b1d0e; // hair
      const ST = 0xf0f0f0; // shirt
      const JN = 0x1d3d8b; // jeans
      const BT = 0x1a1a2e; // boots
      const CA = 0x7700cc; // cape outer
      const CI = 0xcc55ff; // cape inner

      // ── idle: cape hanging straight down behind ────────────────────────
      g.clear();
      g.fillStyle(CA); g.fillRect(2,  14, 12, 32);
      g.fillStyle(CI); g.fillRect(3,  15,  9, 28);
      g.fillStyle(HR); g.fillRect(12,  2, 16,  7); g.fillRect(11,  5,  3,  8);
      g.fillStyle(SK); g.fillRect(12,  5, 16, 11); g.fillRect(17, 16,  7,  3);
      g.fillStyle(ST); g.fillRect(11, 19, 18, 10);
      g.fillStyle(ST); g.fillRect( 4, 19,  8,  9); g.fillStyle(SK); g.fillRect( 4, 27,  7, 4);
      g.fillStyle(ST); g.fillRect(28, 19,  8,  9); g.fillStyle(SK); g.fillRect(29, 27,  7, 4);
      g.fillStyle(JN); g.fillRect(11, 29, 18,  5);
      g.fillStyle(JN); g.fillRect(11, 34,  8, 11); g.fillRect(21, 34,  8, 11);
      g.fillStyle(BT); g.fillRect(10, 44,  9,  5); g.fillRect(21, 44,  9,  5);
      g.generateTexture('player-idle', 40, 50);

      // ── run: cape triangle streaming backward-left ─────────────────────
      g.clear();
      g.fillStyle(CA); g.fillTriangle(14, 14,  0, 34,  8, 49);
      g.fillStyle(CI); g.fillTriangle(14, 16,  2, 34,  9, 45);
      g.fillStyle(HR); g.fillRect(14,  1, 16,  7); g.fillRect(13,  4,  3,  7);
      g.fillStyle(SK); g.fillRect(14,  4, 16, 11); g.fillRect(18, 15,  7,  3);
      g.fillStyle(ST); g.fillRect(12, 18, 18, 10);
      g.fillStyle(ST); g.fillRect( 6, 20,  7,  6); g.fillStyle(SK); g.fillRect( 4, 25,  6, 4);
      g.fillStyle(ST); g.fillRect(29, 16,  6,  9); g.fillStyle(SK); g.fillRect(31, 24,  5, 4);
      g.fillStyle(JN); g.fillRect(12, 28, 18,  4);
      g.fillStyle(JN); g.fillRect(21, 32,  8,  8); g.fillRect(22, 40,  7,  6); // forward leg
      g.fillStyle(JN); g.fillRect(10, 32,  8,  5); g.fillRect( 9, 37,  7,  8); // back leg
      g.fillStyle(BT); g.fillRect( 8, 44,  8,  4); g.fillRect(21, 45,  9,  4);
      g.generateTexture('player-run', 40, 50);

      // ── jump: arms raised, cape fans upward-left ──────────────────────
      g.clear();
      g.fillStyle(CA); g.fillTriangle(13, 16,  0,  1,  5, 34);
      g.fillStyle(CI); g.fillTriangle(13, 18,  2,  3,  6, 30);
      g.fillStyle(HR); g.fillRect(12,  3, 16,  7); g.fillRect(11,  6,  3,  7);
      g.fillStyle(SK); g.fillRect(12,  6, 16, 11); g.fillRect(17, 17,  7,  3);
      g.fillStyle(ST); g.fillRect(11, 20, 18,  9);
      g.fillStyle(ST); g.fillRect( 4, 12,  8, 11); g.fillStyle(SK); g.fillRect( 3,  9,  7, 5);
      g.fillStyle(ST); g.fillRect(28, 12,  8, 11); g.fillStyle(SK); g.fillRect(30,  9,  7, 5);
      g.fillStyle(JN); g.fillRect(11, 29, 18,  4);
      g.fillStyle(JN); g.fillRect(10, 33,  8, 10); g.fillRect(22, 33,  8,  9);
      g.fillStyle(BT); g.fillRect( 9, 42,  8,  4); g.fillRect(21, 41,  8,  4);
      g.generateTexture('player-jump', 40, 50);

      // ── float: cape dramatically billows above, arms spread wide ───────
      g.clear();
      g.fillStyle(CA); g.fillRect(0,  0, 18,  9); g.fillRect(1,  9, 14,  8); g.fillRect(3, 17, 11, 6);
      g.fillStyle(CI); g.fillRect(1,  1, 13,  6); g.fillRect(2,  7, 10,  7); g.fillRect(4, 15,  8, 5);
      g.fillStyle(HR); g.fillRect(16,  5, 16,  7); g.fillRect(15,  8,  3,  7);
      g.fillStyle(SK); g.fillRect(16,  8, 16, 11); g.fillRect(21, 19,  7,  3);
      g.fillStyle(ST); g.fillRect(14, 22, 18,  9);
      g.fillStyle(ST); g.fillRect( 4, 23, 11,  5); g.fillStyle(SK); g.fillRect( 1, 23,  5, 4);
      g.fillStyle(ST); g.fillRect(31, 23,  8,  5); g.fillStyle(SK); g.fillRect(37, 23,  3, 4);
      g.fillStyle(JN); g.fillRect(14, 31, 18,  4);
      g.fillStyle(JN); g.fillRect(13, 35,  8, 12); g.fillRect(23, 35,  8, 12);
      g.fillStyle(BT); g.fillRect(12, 46,  9,  4); g.fillRect(23, 46,  9,  4);
      g.generateTexture('player-float', 40, 50);

      // ── fall: arms bracing, cape trailing upward ───────────────────────
      g.clear();
      g.fillStyle(CA); g.fillTriangle(13, 15,  1,  2,  7, 38);
      g.fillStyle(CI); g.fillTriangle(13, 17,  3,  5,  8, 33);
      g.fillStyle(HR); g.fillRect(12,  3, 16,  7); g.fillRect(11,  6,  3,  7);
      g.fillStyle(SK); g.fillRect(12,  6, 16, 11); g.fillRect(17, 17,  7,  3);
      g.fillStyle(ST); g.fillRect(11, 20, 18,  9);
      g.fillStyle(ST); g.fillRect( 3, 19, 10,  6); g.fillStyle(SK); g.fillRect( 1, 19,  4, 5);
      g.fillStyle(ST); g.fillRect(27, 19, 10,  6); g.fillStyle(SK); g.fillRect(35, 19,  4, 5);
      g.fillStyle(JN); g.fillRect(11, 29, 18,  4);
      g.fillStyle(JN); g.fillRect(11, 33,  8, 12); g.fillRect(21, 33,  8, 12);
      g.fillStyle(BT); g.fillRect(10, 44,  8,  5); g.fillRect(21, 44,  8,  5);
      g.generateTexture('player-fall', 40, 50);
    }

    // ── Bubble Blower — claret & blue, round ─────────────────────────────
    g.clear();
    g.fillStyle(0x7b003c); g.fillRect(0, 8, 26, 22);
    g.fillStyle(0x002fa7); g.fillRect(4, 8, 18, 8);
    g.fillStyle(0xffcc88); g.fillCircle(13, 5, 6);
    g.fillStyle(0xffffff); g.fillCircle(16, 5, 3);     // bubble mouth
    g.generateTexture('enemy-bubble-blower', 26, 30);

    // ── Flanker — wide mud-brown rugby player ────────────────────────────
    g.clear();
    g.fillStyle(0x4a3020); g.fillRect(0, 6, 36, 24);
    g.fillStyle(0xffcc88); g.fillRect(8, 0, 20, 8);
    g.fillStyle(0x7a5030); g.fillRect(0, 6, 36, 4);    // mud band
    g.generateTexture('enemy-flanker', 36, 30);

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
    const jerseyColors = [
      0xffcc00, // 1  GK — yellow
      0x22aa44, // 2  DEF
      0x22aa44, // 3  DEF
      0x22aa44, // 4  DEF
      0x22aa44, // 5  DEF
      0x4488ff, // 6  MID
      0x4488ff, // 7  MID
      0x4488ff, // 8  MID
      0xff3333, // 9  FWD
      0xff3333, // 10 FWD
      0xff3333, // 11 FWD
    ];
    for (let i = 1; i <= 11; i++) {
      g.clear();
      g.fillStyle(jerseyColors[i - 1]);
      // Jersey shape
      g.fillRect(4, 2, 18, 16);
      g.fillRect(0, 2, 6, 10);   // left sleeve
      g.fillRect(20, 2, 6, 10);  // right sleeve
      g.fillRect(6, 18, 14, 10); // shorts
      // Number (drawn as a white rectangle hint — text added in scene)
      g.fillStyle(0xffffff, 0.9);
      g.fillRect(9, 5, 8, 10);
      g.generateTexture(`player-${i}`, 26, 28);
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
