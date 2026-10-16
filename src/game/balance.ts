import type {
  OptionTemplate,
  PickContext,
  ResolvedSquare,
  SquareType,
  StatKey,
  Stats,
} from './types';

/**
 * 釣り合いの数値。どれも仮置き（CLAUDE.md の「Not decided yet」）で、test/balance.test.ts の自動で遊ばせた結果を見て合わせる。
 * 数値はここにだけ書く
 */

export const START_STATS: Stats = { atk: 8, def: 2, maxHp: 60, hp: 60, spd: 10, luck: 0 };

export const SECTIONS = 3;
/** 区切りごとのマスの数。この後にボスのマスが1つ付く */
export const SQUARES_PER_SECTION = 12;
/** 最初の戦闘の前に出す三択の回数（本人と合意済み） */
export const OPENING_PICKS = 3;

export const SQUARE_WEIGHTS: { item: Exclude<SquareType, 'boss'>; weight: number }[] = [
  { item: 'battle', weight: 45 },
  { item: 'treasure', weight: 10 },
  { item: 'statUp', weight: 10 },
  { item: 'statDown', weight: 8 },
  { item: 'heal', weight: 12 },
  { item: 'random', weight: 15 },
];

export const RANDOM_WEIGHTS: { item: ResolvedSquare; weight: number }[] = [
  { item: 'battle', weight: 30 },
  { item: 'treasure', weight: 20 },
  { item: 'statUp', weight: 20 },
  { item: 'statDown', weight: 15 },
  { item: 'heal', weight: 15 },
];
/** 幸運1あたり、ランダムのマスが宝箱と回復に化ける重みに足す分 */
export const RANDOM_LUCK_WEIGHT = 3;

/** 三択の各枠が良い方の選択肢になる確率。幸運1あたり LUCK_GOOD_CHANCE だけ上がる */
export const BASE_GOOD_CHANCE = 0.1;
export const LUCK_GOOD_CHANCE = 0.04;
export const MAX_GOOD_CHANCE = 0.8;

/** 「今すぐ効く」選択肢の量は、区切りが進むごとにこの割合で増える */
export const NOW_SCALE_PER_SECTION = 0.6;

/** 戦闘。SPD だけ行動の溜まりが増え、GAUGE に届いたら殴る */
export const GAUGE = 100;
export const MIN_DAMAGE = 1;
/** 与える傷の振れ幅（±） */
export const DAMAGE_SPREAD = 0.15;
/** 終わらない戦闘を打ち切る行動の数。打ち切ったら主人公の負け */
export const MAX_ACTIONS = 300;

/** 雑魚敵。全区切りで同じ顔ぶれで、踏んだマスの数に応じて強くなる（本人と合意済み） */
export const ENEMIES = [
  { name: 'Enemy A', atk: 6, def: 1, maxHp: 22, spd: 8 },
  { name: 'Enemy B', atk: 5, def: 3, maxHp: 30, spd: 6 },
  { name: 'Enemy C', atk: 7, def: 0, maxHp: 16, spd: 14 },
];
export const BOSSES = [
  { name: 'Boss 1', atk: 15, def: 8, maxHp: 120, spd: 13 },
  { name: 'Boss 2', atk: 40, def: 25, maxHp: 330, spd: 26 },
  { name: 'Boss 3', atk: 85, def: 55, maxHp: 800, spd: 45 },
];
/** 雑魚敵の強さが、踏んだマス1つごとに増える割合 */
export const ENEMY_GROWTH_PER_SQUARE = 0.07;

type Pool = { normal: OptionTemplate[]; good: OptionTemplate[] };

const now = (stat: StatKey, amount: number): OptionTemplate => ({
  kind: 'now',
  effects: [{ stat, amount }],
});
const win = (stat: StatKey, amount: number): OptionTemplate => ({
  kind: 'later',
  perk: { trigger: 'win', effect: { stat, amount } },
});
const step = (stat: StatKey, amount: number): OptionTemplate => ({
  kind: 'later',
  perk: { trigger: 'square', effect: { stat, amount } },
});

const GROWTH: Pool = {
  normal: [
    now('atk', 4),
    now('def', 2),
    now('maxHp', 15),
    now('spd', 3),
    now('luck', 3),
    win('atk', 1),
    win('def', 1),
    win('maxHp', 4),
    win('spd', 1),
    step('hp', 2),
  ],
  good: [
    now('atk', 8),
    now('def', 5),
    now('maxHp', 30),
    now('spd', 6),
    win('atk', 2),
    win('def', 2),
    win('hp', 10),
    step('hp', 4),
    win('luck', 1),
  ],
};

export const POOLS: Record<PickContext, Pool> = {
  opening: GROWTH,
  afterBattle: GROWTH,
  treasure: {
    normal: GROWTH.good,
    good: [now('atk', 14), now('def', 8), now('maxHp', 50), win('atk', 3), step('hp', 6)],
  },
  statUp: {
    normal: [now('atk', 5), now('def', 3), now('maxHp', 20), now('spd', 4), now('luck', 4)],
    good: [now('atk', 10), now('def', 6), now('maxHp', 40), now('spd', 8), now('luck', 8)],
  },
  statDown: {
    normal: [now('atk', -3), now('def', -2), now('hp', -20), now('spd', -3), now('luck', -3)],
    good: [now('atk', -1), now('def', -1), now('hp', -5), now('spd', -1), now('luck', -1)],
  },
  heal: {
    normal: [now('hp', 30), now('maxHp', 10), step('hp', 2)],
    good: [now('hp', 60), now('maxHp', 25), step('hp', 4)],
  },
};
