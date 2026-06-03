import Phaser from 'phaser';

interface VillainDef {
  key: string;
  name: string;
  desc: string;
}

interface LevelIntroDef {
  club: number;
  bgArt: string;
  heading: string;
  villains: VillainDef[];
}

const INTRO_DEFS: LevelIntroDef[] = [
  {
    club: 1800,
    bgArt: 'art-club1800',
    heading: "TONIGHT'S THREAT",
    villains: [
      { key: 'art-bubble-blower', name: 'BUBBLE BLOWER', desc: 'Small but loud.\nFires triple bubbles.\nVolleys footballs.\nDeceptively fast.' },
    ],
  },
  {
    club: 2000,
    bgArt: 'art-club1900',
    heading: 'TONIGHT: THE FLANKER & FRIENDS',
    villains: [
      { key: 'art-flanker',      name: 'THE FLANKER',   desc: 'Patrols then charges.\nGives no warning.' },
      { key: 'art-rushy',        name: 'RUSHY',         desc: 'Weaves through the air.\nImpossible to predict.' },
      { key: 'art-smaller-bear', name: 'SMALLER BEAR',  desc: 'Hurls his coat.\nThen goes to find it.' },
    ],
  },
  {
    club: 2100,
    bgArt: 'art-club2100',
    heading: "TONIGHT'S THREATS",
    villains: [
      { key: 'art-clippy',         name: 'CLIPPY',          desc: 'Patrols.\nThrows paper files.' },
      { key: 'art-melonhead',      name: 'MELONHEAD',       desc: 'Swings a mallet.\nJumps platforms.' },
      { key: 'art-butter-fingers', name: 'BUTTER FINGERS',  desc: 'Drops crates\nfrom above.' },
      { key: 'art-padel-punisher', name: 'PADEL PUNISHER',  desc: 'Static. Fires\nat random angles.' },
    ],
  },
  {
    club: 2200,
    bgArt: 'art-club2200',
    heading: 'THE FINAL GAUNTLET',
    villains: [
      { key: 'art-giant-bear',    name: 'GIANT BEAR',    desc: 'Massive patrol.\nCharges hard.' },
      { key: 'art-condor',        name: 'CONDOR',        desc: 'Swoops in arcs.\nAlways airborne.' },
      { key: 'art-actuary-man',   name: 'ACTUARY MAN',   desc: 'Glides precisely\nbetween points.' },
      { key: 'art-puffin',        name: 'THE PUFFIN',    desc: 'Aims golf balls\ndirectly at you.' },
      { key: 'art-vascular-man',  name: 'VASCULAR MAN',  desc: 'Hangs under\nplatforms.' },
      { key: 'art-skeletor',      name: 'SKELETOR',      desc: 'Dark magic.\nTracks your position.' },
    ],
  },
];

export class LevelIntroScene extends Phaser.Scene {
  constructor() { super({ key: 'LevelIntroScene' }); }

  create(data: { levelIndex: number; score: number; lives: number }): void {
    const { width, height } = this.scale;
    const def = INTRO_DEFS[data.levelIndex] ?? INTRO_DEFS[0];

    // Full-screen club background
    const bgImg = this.add.image(width / 2, height / 2, def.bgArt);
    const bgScaleX = width / bgImg.width;
    const bgScaleY = height / bgImg.height;
    bgImg.setScale(Math.max(bgScaleX, bgScaleY)).setAlpha(0.42);

    // Dark overlay for readability
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.58);

    // Header strip
    this.add.rectangle(width / 2, 20, width, 42, 0x000000, 0.8);
    this.add.text(width / 2, 10, `CLUB ${def.club}`, {
      fontSize: '11px', fontFamily: 'monospace', color: '#888888',
    }).setOrigin(0.5, 0);
    this.add.text(width / 2, 25, def.heading, {
      fontSize: '16px', fontFamily: 'monospace',
      color: '#ffee00', stroke: '#332200', strokeThickness: 3,
    }).setOrigin(0.5, 0);

    // Villain cards
    this.layoutCards(def.villains, width, height);

    // Footer prompt
    const footerText = this.add.text(width / 2, height - 10, 'PRESS SPACE OR TAP TO ENTER', {
      fontSize: '14px', fontFamily: 'monospace',
      color: '#ffffff', stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5, 1);
    this.tweens.add({ targets: footerText, alpha: 0.15, duration: 650, yoyo: true, repeat: -1 });

    const go = (): void => {
      this.input.off('pointerdown', go);
      this.input.keyboard?.removeListener('keydown-SPACE', go);
      this.input.keyboard?.removeListener('keydown-ENTER', go);
      this.scene.start('GameScene', {
        levelIndex: data.levelIndex,
        score: data.score,
        lives: data.lives,
      });
    };
    this.input.keyboard?.on('keydown-SPACE', go);
    this.input.keyboard?.on('keydown-ENTER', go);
    this.input.on('pointerdown', go);
  }

  private layoutCards(villains: VillainDef[], width: number, height: number): void {
    const count = villains.length;
    const areaTop = 46;
    const areaBot = height - 24;
    const availH = areaBot - areaTop;
    const pad = 8;

    type CardPos = { cx: number; cy: number; cw: number; ch: number };
    let positions: CardPos[];

    if (count === 1) {
      const cw = Math.min(240, width - 40);
      const ch = availH - pad * 2;
      positions = [{ cx: width / 2, cy: areaTop + pad + ch / 2, cw, ch }];

    } else if (count <= 3) {
      const cw = Math.min(210, (width - pad * (count + 1)) / count);
      const ch = availH - pad * 2;
      const totalW = cw * count + pad * (count - 1);
      const startX = (width - totalW) / 2 + cw / 2;
      positions = villains.map((_, i) => ({
        cx: startX + i * (cw + pad),
        cy: areaTop + pad + ch / 2,
        cw,
        ch,
      }));

    } else if (count === 4) {
      const cw = (width - pad * 5) / 4;
      const ch = availH - pad * 2;
      const startX = pad + cw / 2;
      positions = villains.map((_, i) => ({
        cx: startX + i * (cw + pad),
        cy: areaTop + pad + ch / 2,
        cw,
        ch,
      }));

    } else {
      // 5 or 6 — two rows of 3
      const cols = 3;
      const rows = 2;
      const cw = (width - pad * (cols + 1)) / cols;
      const ch = (availH - pad * (rows + 1)) / rows;
      positions = villains.map((_, i) => ({
        cx: pad + (i % cols) * (cw + pad) + cw / 2,
        cy: areaTop + pad + Math.floor(i / cols) * (ch + pad) + ch / 2,
        cw,
        ch,
      }));
    }

    villains.forEach((v, i) => this.drawCard(v, positions[i]));
  }

  private drawCard(
    v: VillainDef,
    pos: { cx: number; cy: number; cw: number; ch: number },
  ): void {
    const { cx, cy, cw, ch } = pos;
    const cardLeft = cx - cw / 2;
    const cardTop  = cy - ch / 2;

    // Card backing
    const gfx = this.add.graphics();
    gfx.fillStyle(0x05050f, 0.88);
    gfx.fillRect(cardLeft, cardTop, cw, ch);
    gfx.lineStyle(1, 0x444466, 1);
    gfx.strokeRect(cardLeft, cardTop, cw, ch);

    // Image: top 75 % of card height
    const imgAreaH = Math.floor(ch * 0.75);
    const texSrc   = this.textures.get(v.key).source[0];
    const origW    = texSrc.width;
    const origH    = texSrc.height;

    // Crop top 42 % of source — strips text/nameplate, shows just the character art
    const cropH = Math.floor(origH * 0.42);

    // Uniform scale to fit the cropped region within cw × imgAreaH
    const scale = Math.min(cw / origW, imgAreaH / cropH);

    // setOrigin(0.5, 0) anchors top-centre; y = cardTop starts the image exactly there
    const img = this.add.image(cx, cardTop, v.key);
    img.setOrigin(0.5, 0);
    img.setCrop(0, 0, origW, cropH);
    img.setScale(scale);

    // Name label — sits just below the image area
    const bigCard = cw > 155;
    const textY = cardTop + imgAreaH + 3;
    this.add.text(cx, textY, v.name, {
      fontSize: bigCard ? '10px' : '9px',
      fontFamily: 'monospace',
      color: '#ffdd00',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
    }).setOrigin(0.5, 0);

    this.add.text(cx, textY + (bigCard ? 14 : 12), v.desc, {
      fontSize: bigCard ? '8px' : '7px',
      fontFamily: 'monospace',
      color: '#aaaaaa',
      align: 'center',
      wordWrap: { width: cw - 6 },
    }).setOrigin(0.5, 0);
  }
}
