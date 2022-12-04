import p5 from "p5";
import logs from "./sample_packet_log.json";

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
  constructor(p: p5, src: Position, dst: Position, timestamp?: number) {
    this.p = p;
    this.pos = { ...src };
    this.src = { ...src };
    this.dst = { ...dst };
    this.size = 10;
    this.animationSteps = 200; // src-dst間の距離で可変にする
    this.step = 0; // 現在のステップ数は0で初期化
    this.isFinishd = false;
    this.timestamp = timestamp;
  }
  p: p5;
  pos: Position;
  src: Position;
  dst: Position;
  size: number;
  animationSteps: number;
  step: number;
  isFinishd: boolean;
  timestamp?: number;

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
  const servers = [
    new NodeStripe(p, "s1", { x: 100, y: 100 }, { width: 100, height: 50 }),
    new NodeStripe(p, "s2", { x: 800, y: 100 }, { width: 100, height: 50 }),
    new NodeStripe(p, "s3", { x: 100, y: 500 }, { width: 100, height: 50 }),
    new NodeStripe(p, "s4", { x: 800, y: 500 }, { width: 100, height: 50 }),
  ];
  let waitingPackets: PacketSprite[] = logs.map((log) => {
    const src = servers.find((s) => s.name === log.src);
    const dst = servers.find((s) => s.name === log.dst);
    if (src == undefined || dst == undefined) {
      console.error();
      throw new Error(
        `Cannot find server name src ${log.src} and/or dst ${log.dst}`
      );
    }
    return new PacketSprite(
      p,
      src.getCenterPos(),
      dst.getCenterPos(),
      log.timestamp
    );
  });
  let packets: PacketSprite[] = [];
  let time: number = 1670170000;

  /** 初期化処理 */
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  /** フレームごとの描画処理 */
  p.draw = () => {
    p.background(p.color(BG_COLOR));
    p.text(time, 100, 200);

    // Check newly generated packets
    if (waitingPackets.length > 0 && waitingPackets[0].timestamp! <= time) {
      console.log(waitingPackets.length);
      const p = waitingPackets.shift();
      if (p) {
        packets.push(p);
      }
    }
    // Draw Packets
    packets.forEach((pkt) => {
      pkt.updatePos();
      pkt.draw();
    });
    // Remove packets which have arrived to destination
    packets = packets.filter((pkt) => !pkt.isFinishd);

    // Draw Nodes
    servers.forEach((s) => {
      s.draw();
    });
    time += 1;
  };
};

new p5(sketch);
