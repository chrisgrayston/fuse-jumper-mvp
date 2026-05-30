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

    // Player – cyan rectangle with a small visor stripe
    g.clear();
    g.fillStyle(0x00e5ff);
    g.fillRect(0, 0, 24, 32);
    g.fillStyle(0x007fff);
    g.fillRect(4, 6, 16, 8);
    g.fillStyle(0xffffff, 0.5);
    g.fillRect(6, 8, 5, 4);
    g.generateTexture('player', 24, 32);

    // Fuse – bright yellow diamond
    g.clear();
    g.fillStyle(0xffee00);
    g.fillTriangle(10, 0, 20, 10, 10, 20);
    g.fillTriangle(10, 0, 0, 10, 10, 20);
    g.fillStyle(0xff9900, 0.7);
    g.fillRect(7, 7, 6, 6);
    g.generateTexture('fuse', 20, 20);

    // Patrol enemy – red squat rectangle
    g.clear();
    g.fillStyle(0xff2244);
    g.fillRect(0, 4, 28, 22);
    g.fillStyle(0xaa0022);
    g.fillRect(4, 0, 20, 8);
    g.fillStyle(0xffff00);
    g.fillRect(6, 7, 5, 5);
    g.fillRect(17, 7, 5, 5);
    g.generateTexture('enemy-patrol', 28, 26);

    // Flying enemy – purple diamond/triangle with glow feel
    g.clear();
    g.fillStyle(0xcc44ff);
    g.fillTriangle(14, 0, 28, 16, 14, 28);
    g.fillTriangle(14, 0, 0, 16, 14, 28);
    g.fillStyle(0xff00ff, 0.8);
    g.fillCircle(14, 14, 6);
    g.generateTexture('enemy-flyer', 28, 28);

    // Platform tile – single 1×14 pixel wide strip, tiled in GameScene
    g.clear();
    g.fillStyle(0x445566);
    g.fillRect(0, 0, 8, 14);
    g.fillStyle(0x6688aa);
    g.fillRect(0, 0, 8, 3);
    g.generateTexture('platform-tile', 8, 14);

    g.destroy();
  }
}
