import type { Effect, Option } from '@/game/types';
import type { Messages } from './messages';

function signed(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

function effectLabel({ stat, amount }: Effect, m: Messages): string {
  return `${m.stats[stat]} ${signed(amount)}`;
}

export function optionLabel(option: Option, m: Messages): string {
  if (option.kind === 'now') return option.effects.map((e) => effectLabel(e, m)).join(', ');
  const { trigger, effect } = option.perk;
  return trigger === 'win'
    ? m.eachWin(effectLabel(effect, m))
    : m.eachSquare(effectLabel(effect, m));
}
