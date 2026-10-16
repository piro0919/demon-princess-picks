/** 能力。hp は今の HP で、maxHp を超えない */
export type Stats = {
  atk: number;
  def: number;
  maxHp: number;
  hp: number;
  spd: number;
  luck: number;
};

/** 三択で上げ下げできる能力。hp は HP の回復（負なら減る） */
export type StatKey = 'atk' | 'def' | 'maxHp' | 'hp' | 'spd' | 'luck';

export type Effect = { stat: StatKey; amount: number };

/** 「〜するたびに」の強化が効く時。win は戦闘に勝つたび、square はマスを踏むたび */
export type Trigger = 'win' | 'square';

export type Perk = { trigger: Trigger; effect: Effect };

/** 三択の中身。now は今すぐ効く強化、later は「〜するたびに」の強化 */
export type OptionTemplate = { kind: 'now'; effects: Effect[] } | { kind: 'later'; perk: Perk };

/** 三択の一つ。lucky は幸運のおかげで良い方の選択肢が出たもの */
export type Option = OptionTemplate & { lucky: boolean };

export type SquareType = 'battle' | 'treasure' | 'statUp' | 'statDown' | 'heal' | 'random' | 'boss';

/** ランダムのマスが化ける先 */
export type ResolvedSquare = Exclude<SquareType, 'random' | 'boss'>;

/** 三択が出る場面 */
export type PickContext = 'opening' | 'afterBattle' | 'treasure' | 'statUp' | 'statDown' | 'heal';

export type Fighter = Pick<Stats, 'atk' | 'def' | 'maxHp' | 'hp' | 'spd'>;

export type Enemy = Fighter & { name: string; boss: boolean };

export type Hit = { by: 'hero' | 'enemy'; damage: number; heroHp: number; enemyHp: number };

export type BattleResult = { hits: Hit[]; won: boolean; heroHp: number };

/** 踏んだマス。ランダムから化けたものは fromRandom を立てる */
export type Visited = { type: SquareType | ResolvedSquare; fromRandom: boolean; lucky: boolean };

export type Phase =
  | { kind: 'pick'; context: PickContext; options: Option[] }
  | { kind: 'battle'; enemy: Enemy; result: BattleResult }
  | { kind: 'over' }
  | { kind: 'clear' };

export type RunState = {
  rng: number;
  stats: Stats;
  perks: Perk[];
  /** 0 から始まる区切りの番号 */
  section: number;
  road: SquareType[];
  /** 今いるマス。-1 は最初の三択の最中 */
  pos: number;
  visited: Visited[];
  openingLeft: number;
  phase: Phase;
};
