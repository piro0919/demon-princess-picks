import { describe, expect, it } from 'vitest';
import { preferBot, randomBot, summarize } from './simulate';

/**
 * 釣り合いを、自動で遊ばせた結果で見張る（src/game/balance.ts の数値は仮置き）。
 * 狙いは CLAUDE.md の「うまくいけば踏破、失敗すれば第一区切りで終わる」と、「今か後か」の取り合い
 */
describe('釣り合い', () => {
  const RUNS = 1000;

  it('何も考えずに押しても、たまに踏破でき、第一区切りで倒れることもよくある', () => {
    const r = summarize(RUNS, randomBot);
    expect(r.cleared).toBeGreaterThan(0.03);
    expect(r.cleared).toBeLessThan(0.3);
    expect(r.diedInSection1).toBeGreaterThan(0.2);
    expect(r.diedInSection1).toBeLessThan(0.7);
  });

  it('「〜するたびに」ばかり選ぶと序盤で倒れやすいが、踏破は「今すぐ」ばかりより多い', () => {
    const later = summarize(RUNS, preferBot('later'));
    const now = summarize(RUNS, preferBot('now'));
    expect(later.diedInSection1).toBeGreaterThan(now.diedInSection1);
    expect(later.cleared).toBeGreaterThan(now.cleared);
  });
});
