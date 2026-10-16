import type { Effect, Option, PickContext, ResolvedSquare, SquareType, StatKey } from './types';

const STAT_LABELS: Record<StatKey, string> = {
  atk: 'ATK',
  def: 'DEF',
  maxHp: 'Max HP',
  hp: 'HP',
  spd: 'SPD',
  luck: 'LUCK',
};

function signed(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

function effectLabel({ stat, amount }: Effect): string {
  return `${STAT_LABELS[stat]} ${signed(amount)}`;
}

export function optionLabel(option: Option): string {
  if (option.kind === 'now') return option.effects.map(effectLabel).join(', ');
  const { trigger, effect } = option.perk;
  return trigger === 'win'
    ? `${effectLabel(effect)} each time you win a battle`
    : `${effectLabel(effect)} on each square`;
}

export const CONTEXT_LABELS: Record<PickContext, string> = {
  opening: 'Before the journey',
  afterBattle: 'Victory',
  treasure: 'Treasure',
  statUp: 'Power up',
  statDown: 'Curse',
  heal: 'Spring',
};

export const SQUARE_LABELS: Record<SquareType | ResolvedSquare, string> = {
  battle: 'Battle',
  boss: 'Boss',
  treasure: 'Treasure',
  statUp: 'Power up',
  statDown: 'Curse',
  heal: 'Heal',
  random: 'Random',
};
