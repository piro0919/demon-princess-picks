import {
  BASE_GOOD_CHANCE,
  BOSSES,
  ENEMIES,
  ENEMY_GROWTH_PER_SQUARE,
  LUCK_GOOD_CHANCE,
  MAX_GOOD_CHANCE,
  NOW_SCALE_PER_SECTION,
  OPENING_PICKS,
  POOLS,
  RANDOM_LUCK_WEIGHT,
  RANDOM_WEIGHTS,
  SECTIONS,
  SQUARE_WEIGHTS,
  SQUARES_PER_SECTION,
  START_STATS,
} from './balance';
import { simulateBattle } from './battle';
import { Rng } from './rng';
import type {
  Effect,
  Enemy,
  Option,
  OptionTemplate,
  PickContext,
  ResolvedSquare,
  RunState,
  SquareType,
  Stats,
  Trigger,
} from './types';

/** 挑戦の進め方。どの関数も元の状態を変えず、新しい状態を返す */

export function newRun(seed: number): RunState {
  const rng = new Rng(seed);
  const state: RunState = {
    rng: 0,
    stats: { ...START_STATS },
    perks: [],
    section: 0,
    road: makeRoad(rng),
    pos: -1,
    visited: [],
    openingLeft: OPENING_PICKS - 1,
    phase: { kind: 'pick', context: 'opening', options: [] },
  };
  state.phase = { kind: 'pick', context: 'opening', options: drawOptions('opening', state, rng) };
  state.rng = rng.state;
  return state;
}

function makeRoad(rng: Rng): SquareType[] {
  const squares = Array.from(
    { length: SQUARES_PER_SECTION },
    () => rng.weighted(SQUARE_WEIGHTS).item,
  );
  return [...squares, 'boss'];
}

function goodChance(luck: number): number {
  return Math.min(MAX_GOOD_CHANCE, BASE_GOOD_CHANCE + Math.max(0, luck) * LUCK_GOOD_CHANCE);
}

const CHOICES = 3;

/** 三択を引く。同じものは並べない。幸運が無くても良い方が出た枠には lucky を立てない */
function drawOptions(context: PickContext, state: RunState, rng: Rng): Option[] {
  const pool = POOLS[context];
  const chance = goodChance(state.stats.luck);
  const options: Option[] = [];
  const taken = new Set<string>();
  while (options.length < CHOICES) {
    const r = rng.next();
    const good = r < chance;
    const template = rng.pick(good ? pool.good : pool.normal);
    const key = JSON.stringify(template);
    if (taken.has(key)) continue;
    taken.add(key);
    options.push({ ...scaleNow(template, state.section), lucky: good && r >= BASE_GOOD_CHANCE });
  }
  return options;
}

/** 「今すぐ効く」量だけ、区切りが進むごとに増やす。「〜するたびに」は積み上がるので増やさない */
function scaleNow(template: OptionTemplate, section: number): OptionTemplate {
  if (template.kind !== 'now') return template;
  const scale = 1 + section * NOW_SCALE_PER_SECTION;
  return {
    ...template,
    effects: template.effects.map((e) => ({ ...e, amount: Math.round(e.amount * scale) })),
  };
}

function applyEffect(stats: Stats, { stat, amount }: Effect): Stats {
  const next = { ...stats };
  if (stat === 'hp') {
    // イベントで HP が減っても倒れはしない。倒れるのは戦闘だけ
    next.hp = Math.min(next.maxHp, Math.max(1, next.hp + amount));
  } else if (stat === 'maxHp') {
    next.maxHp = Math.max(1, next.maxHp + amount);
    next.hp = Math.min(next.maxHp, Math.max(1, next.hp + Math.max(0, amount)));
  } else {
    next[stat] = Math.max(0, next[stat] + amount);
  }
  return next;
}

function applyPerks(state: RunState, trigger: Trigger): Stats {
  return state.perks
    .filter((p) => p.trigger === trigger)
    .reduce((stats, p) => applyEffect(stats, p.effect), state.stats);
}

/** 三択の一つを選ぶ */
export function choose(state: RunState, index: number): RunState {
  if (state.phase.kind !== 'pick') return state;
  const option = state.phase.options[index];
  if (!option) return state;
  const next: RunState =
    option.kind === 'now'
      ? { ...state, stats: option.effects.reduce(applyEffect, state.stats) }
      : { ...state, perks: [...state.perks, option.perk] };

  if (state.phase.context === 'opening' && state.openingLeft > 0) {
    const rng = new Rng(state.rng);
    next.openingLeft = state.openingLeft - 1;
    next.phase = { kind: 'pick', context: 'opening', options: drawOptions('opening', next, rng) };
    next.rng = rng.state;
    return next;
  }
  return advance({ ...next, openingLeft: 0 });
}

/** 次のマスへ進む。区切りの最後まで来ていたら、次の区切りの道を作る */
function advance(state: RunState): RunState {
  const rng = new Rng(state.rng);
  let next: RunState = { ...state, pos: state.pos + 1 };
  if (next.pos >= next.road.length) {
    next = { ...next, section: next.section + 1, road: makeRoad(rng), pos: 0 };
  }
  next.stats = applyPerks(next, 'square');

  const planned = next.road[next.pos];
  let type: SquareType = planned;
  let lucky = false;
  if (planned === 'random') {
    ({ type, lucky } = resolveRandom(next.stats.luck, rng));
  }
  next.visited = [...next.visited, { type, fromRandom: planned === 'random', lucky }];

  if (type === 'battle' || type === 'boss') {
    const enemy = makeEnemy(next, type === 'boss', rng);
    const result = simulateBattle(next.stats, enemy, rng);
    next.phase = { kind: 'battle', enemy, result };
  } else {
    const context = type as Exclude<ResolvedSquare, 'battle'>;
    next.phase = { kind: 'pick', context, options: drawOptions(context, next, rng) };
  }
  next.rng = rng.state;
  return next;
}

/**
 * ランダムのマスを、ほかの種類のどれかに化けさせる。幸運が高いほど宝箱と回復に化けやすい。
 * 幸運で足した重みの部分に当たったときだけ lucky を立てる
 */
function resolveRandom(luck: number, rng: Rng): { type: ResolvedSquare; lucky: boolean } {
  const extra = Math.max(0, luck) * RANDOM_LUCK_WEIGHT;
  const weights = [
    ...RANDOM_WEIGHTS,
    { item: 'treasure' as const, weight: extra },
    { item: 'heal' as const, weight: extra },
  ];
  const { item, index } = rng.weighted(weights);
  return { type: item, lucky: index >= RANDOM_WEIGHTS.length };
}

function makeEnemy(state: RunState, boss: boolean, rng: Rng): Enemy {
  if (boss) {
    const b = BOSSES[state.section];
    return { ...b, hp: b.maxHp, boss: true };
  }
  const base = rng.pick(ENEMIES);
  const stepsTaken = state.section * (SQUARES_PER_SECTION + 1) + state.pos;
  const scale = 1 + stepsTaken * ENEMY_GROWTH_PER_SQUARE;
  const maxHp = Math.round(base.maxHp * scale);
  return {
    name: base.name,
    atk: Math.round(base.atk * scale),
    def: Math.round(base.def * scale),
    maxHp,
    hp: maxHp,
    spd: Math.round(base.spd * scale),
    boss: false,
  };
}

/** 戦闘を見せ終えたら呼ぶ。負けなら終わり、最後のボスに勝てば踏破、それ以外は戦闘のあとの三択 */
export function finishBattle(state: RunState): RunState {
  if (state.phase.kind !== 'battle') return state;
  const { enemy, result } = state.phase;
  const next: RunState = { ...state, stats: { ...state.stats, hp: result.heroHp } };
  if (!result.won) return { ...next, phase: { kind: 'over' } };
  if (enemy.boss && state.section === SECTIONS - 1) return { ...next, phase: { kind: 'clear' } };
  next.stats = applyPerks(next, 'win');
  const rng = new Rng(state.rng);
  next.phase = {
    kind: 'pick',
    context: 'afterBattle',
    options: drawOptions('afterBattle', next, rng),
  };
  next.rng = rng.state;
  return next;
}
