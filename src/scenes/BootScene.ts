import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    this.generateTextures();
    this.scene.start('MenuScene');
  }

  private generateTextures(): void {
    const g = this.make.graphics({ x: 0, y: 0 });

    // ── Player — normal human (white shirt, jeans) ────────────────────────
    g.clear();
    g.fillStyle(0x3366cc); g.fillRect(0, 14, 22, 18);  // jeans
    g.fillStyle(0xffffff); g.fillRect(2, 6,  18, 10);  // shirt
    g.fillStyle(0xffcc88); g.fillRect(5, 0,  12, 8);   // head
    g.fillStyle(0x553300); g.fillRect(6, 0,  10, 4);   // hair
    g.generateTexture('player', 22, 32);

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
