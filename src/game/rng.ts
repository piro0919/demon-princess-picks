/**
 * 種から決まる乱数（mulberry32）。状態を数一つで持てるので、挑戦の状態にそのまま入れて、同じ種なら同じ挑戦を再現できる
 */
export class Rng {
  constructor(public state: number) {}

  /** 0 以上 1 未満 */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** 0 以上 n 未満の整数 */
  int(n: number): number {
    return Math.floor(this.next() * n);
  }

  pick<T>(items: readonly T[]): T {
    return items[this.int(items.length)];
  }

  /** 重みに従って一つ選ぶ。選んだ番号も返す */
  weighted<T>(items: readonly { item: T; weight: number }[]): { item: T; index: number } {
    const total = items.reduce((sum, i) => sum + i.weight, 0);
    let r = this.next() * total;
    for (let index = 0; index < items.length; index++) {
      r -= items[index].weight;
      if (r < 0) return { item: items[index].item, index };
    }
    return { item: items[items.length - 1].item, index: items.length - 1 };
  }
}
