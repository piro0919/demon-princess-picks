import { CONTEXT_LABELS, SQUARE_LABELS, optionLabel } from '@/game/labels';
import type { Option, PickContext, Visited } from '@/game/types';
import { LuckMark } from './luck-mark';

type Props = {
  context: PickContext;
  options: Option[];
  /** 今いるマス。ランダムから化けたなら、そのことを見出しに出す */
  landed: Visited | undefined;
  onPick: (index: number) => void;
};

export function PickCards({ context, options, landed, onPick }: Props) {
  const fromRandom = context !== 'opening' && context !== 'afterBattle' && landed?.fromRandom;
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-4">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        {fromRandom && <span className="text-muted">{SQUARE_LABELS.random} →</span>}
        {CONTEXT_LABELS[context]}
        {fromRandom && landed.lucky && <LuckMark />}
      </h2>
      <div className="grid w-full gap-3 landscape:grid-cols-3">
        {options.map((option, i) => (
          <button
            key={`${context}-${i}-${optionLabel(option)}`}
            type="button"
            onClick={() => onPick(i)}
            className="flex min-h-24 cursor-pointer flex-col items-start gap-2 rounded-2xl border border-line bg-surface p-4 text-left transition-colors hover:border-accent active:border-accent"
          >
            <span className="flex w-full items-center justify-between gap-2 text-xs text-muted">
              {option.kind === 'now' ? 'Now' : 'Later'}
              {option.lucky && <LuckMark />}
            </span>
            <span className="font-bold">{optionLabel(option)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
