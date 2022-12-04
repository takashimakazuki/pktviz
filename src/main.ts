import p5 from "p5";

const BG_COLOR = "#171d21";
const BUBBLE_COLOR = "#77acb5";

type Position = {
  x: number;
  y: number;
};

class NodeStripe {
  pos: Position;
  p: p5;
  name: string;
  size: { width: number; height: number };

  constructor(
    p: p5,
    name: string,
    pos: Position,
    size: { width: number; height: number }
  ) {
    this.p = p;
    this.name = name;
    this.pos = { ...pos };
    this.size = size;
  }

  draw() {
    this.p.color(BUBBLE_COLOR);
    this.p.stroke(BUBBLE_COLOR);
    this.p.rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(this.size.width / 5);
    this.p.text(this.name, this.getCenterPos().x, this.getCenterPos().y);
  }

  getCenterPos(): Position {
    return {
      x: this.pos.x + this.size.width / 2,
      y: this.pos.y + this.size.height / 2,
    };
  }
}

class PacketSprite {
  constructor(p: p5, src: Position, dst: Position) {
    this.p = p;
    this.pos = { ...src };
    this.src = { ...src };
    this.dst = { ...dst };
    this.size = 10;
    this.animationSteps = 200; // src-dst間の距離で可変にする
    this.step = 0; // 現在のステップ数は0で初期化
    this.isFinishd = false;
  }
  p: p5;
  pos: Position;
  src: Position;
  dst: Position;
  size: number;
  animationSteps: number;
  step: number;
  isFinishd: boolean;

  updatePos() {
    const t = this.step / this.animationSteps;
    this.pos.x = (1 - t) * this.src.x + t * this.dst.x;
    this.pos.y = (1 - t) * this.src.y + t * this.dst.y;
    this.step++;

    if (t > 1) {
      this.isFinishd = true;
    }
  }

  draw() {
    this.p.color(BUBBLE_COLOR);
    this.p.stroke(BUBBLE_COLOR);
    this.p.circle(this.pos.x, this.pos.y, this.size);
  }
}

const sketch = (p: p5) => {
  const s1 = new NodeStripe(
    p,
    "s1",
    { x: 100, y: 100 },
    { width: 100, height: 50 }
  );
  const s2 = new NodeStripe(
    p,
    "s2",
    { x: 800, y: 100 },
    { width: 100, height: 50 }
  );
  const s3 = new NodeStripe(
    p,
    "s3",
    { x: 100, y: 500 },
    { width: 100, height: 50 }
  );
  const s4 = new NodeStripe(
    p,
    "s4",
    { x: 800, y: 500 },
    { width: 100, height: 50 }
  );
  let packets: PacketSprite[] = [];
  let time: number = 0;

  /** 初期化処理 */
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  /** フレームごとの描画処理 */
  p.draw = () => {
    p.background(p.color(BG_COLOR));

    // Draw Packets
    packets.forEach((pkt) => {
      pkt.updatePos();
      pkt.draw();
    });
    // Remove packets which have arrived to destination
    packets = packets.filter((pkt) => !pkt.isFinishd);

    if (Math.random() > 0.96) {
      packets.push(new PacketSprite(p, s1.getCenterPos(), s2.getCenterPos()));
    }
    if (Math.random() > 0.95) {
      packets.push(new PacketSprite(p, s2.getCenterPos(), s3.getCenterPos()));
    }
    if (Math.random() > 0.99) {
      packets.push(new PacketSprite(p, s4.getCenterPos(), s3.getCenterPos()));
    }
    if (Math.random() > 0.95) {
      packets.push(new PacketSprite(p, s1.getCenterPos(), s4.getCenterPos()));
    }
    if (Math.random() > 0.99) {
      packets.push(new PacketSprite(p, s1.getCenterPos(), s3.getCenterPos()));
    }
    if (Math.random() > 0.92) {
      packets.push(new PacketSprite(p, s3.getCenterPos(), s2.getCenterPos()));
    }
    if (Math.random() > 0.92) {
      packets.push(new PacketSprite(p, s4.getCenterPos(), s2.getCenterPos()));
    }

    // Draw Nodes
    s1.draw();
    s2.draw();
    s3.draw();
    s4.draw();
    time++;
  };
};

new p5(sketch);
