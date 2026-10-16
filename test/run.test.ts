import { describe, expect, it } from 'vitest';
import { OPENING_PICKS, SQUARES_PER_SECTION } from '../src/game/balance';
import { simulateBattle } from '../src/game/battle';
import { Rng } from '../src/game/rng';
import { choose, finishBattle, newRun } from '../src/game/run';
import type { RunState } from '../src/game/types';

describe('挑戦の進み方', () => {
  it('同じ種なら同じ挑戦になる', () => {
    expect(newRun(42)).toEqual(newRun(42));
    expect(choose(newRun(42), 1)).toEqual(choose(newRun(42), 1));
  });

  it('最初の戦闘の前に三択が決まった回数だけ出て、そのあと1マス目に進む', () => {
    let state = newRun(7);
    for (let i = 0; i < OPENING_PICKS; i++) {
      expect(state.pos).toBe(-1);
      expect(state.phase).toMatchObject({ kind: 'pick', context: 'opening' });
      state = choose(state, 0);
    }
    expect(state.pos).toBe(0);
    expect(state.visited).toHaveLength(1);
  });

  it('道は区切りごとにマスが並び、最後がボス', () => {
    const { road } = newRun(3);
    expect(road).toHaveLength(SQUARES_PER_SECTION + 1);
    expect(road.at(-1)).toBe('boss');
    expect(road.slice(0, -1)).not.toContain('boss');
  });

  it('三択は毎回3つで、同じものが並ばない', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const { phase } = newRun(seed);
      if (phase.kind !== 'pick') throw new Error('最初は三択');
      expect(phase.options).toHaveLength(3);
      expect(new Set(phase.options.map((o) => JSON.stringify(o))).size).toBe(3);
    }
  });

  it('幸運が0なら、三択に幸運の印は付かない', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const { phase } = newRun(seed);
      if (phase.kind !== 'pick') throw new Error('最初は三択');
      expect(phase.options.some((o) => o.lucky)).toBe(false);
    }
  });

  it('幸運が高いと、三択に幸運の印が付いた選択肢が出る', () => {
    const lucky = Array.from({ length: 50 }, (_, i) => {
      const state = newRun(i + 1);
      const rich: RunState = { ...state, stats: { ...state.stats, luck: 20 }, openingLeft: 1 };
      const next = choose(rich, 0);
      return next.phase.kind === 'pick' && next.phase.options.some((o) => o.lucky);
    });
    expect(lucky.filter(Boolean).length).toBeGreaterThan(25);
  });

  it('HP は戦闘のあとも持ち越す', () => {
    let state = newRun(11);
    while (state.phase.kind !== 'battle') state = choose(state, 0);
    const { result } = state.phase;
    expect(result.heroHp).toBeLessThan(state.stats.maxHp);
    // 勝ったときに効く強化を外し、戦闘の結果だけを見る
    state = finishBattle({ ...state, perks: [] });
    expect(state.stats.hp).toBe(result.heroHp);
  });

  it('戦闘に負けたら挑戦は終わる', () => {
    let state = newRun(11);
    while (state.phase.kind !== 'battle') state = choose(state, 0);
    const lost: RunState = {
      ...state,
      phase: { ...state.phase, result: { ...state.phase.result, won: false, heroHp: 0 } },
    };
    expect(finishBattle(lost).phase.kind).toBe('over');
  });
});

describe('戦闘', () => {
  const fighter = { atk: 10, def: 2, maxHp: 50, hp: 50, spd: 10 };

  it('SPD が倍なら、ほぼ倍の回数殴る', () => {
    const { hits } = simulateBattle({ ...fighter, spd: 20 }, { ...fighter, hp: 500 }, new Rng(1));
    const hero = hits.filter((h) => h.by === 'hero').length;
    const enemy = hits.filter((h) => h.by === 'enemy').length;
    expect(hero / enemy).toBeGreaterThan(1.8);
  });

  it('守りが攻めより高くても、傷は通る', () => {
    const { hits } = simulateBattle(fighter, { ...fighter, def: 100 }, new Rng(1));
    expect(hits.find((h) => h.by === 'hero')?.damage).toBeGreaterThan(0);
  });

  it('記録の HP は、殴られた側の傷の分だけ減っていく', () => {
    const { hits, won, heroHp } = simulateBattle(fighter, fighter, new Rng(5));
    let hero = fighter.hp;
    let enemy = fighter.hp;
    for (const h of hits) {
      if (h.by === 'hero') enemy -= h.damage;
      else hero -= h.damage;
      expect([h.heroHp, h.enemyHp]).toEqual([hero, enemy]);
    }
    expect(heroHp).toBe(hero);
    expect(won).toBe(enemy === 0);
  });
});
