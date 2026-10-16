import { optionLabel } from '@/i18n/labels';
import { useMessages } from '@/i18n/lang-context';
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
  const m = useMessages();
  const fromRandom = context !== 'opening' && context !== 'afterBattle' && landed?.fromRandom;
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-4">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        {fromRandom && <span className="text-muted">{m.random} →</span>}
        {m.contexts[context]}
        {fromRandom && landed.lucky && <LuckMark />}
      </h2>
      <div className="grid w-full gap-3 landscape:grid-cols-3">
        {options.map((option, i) => (
          <button
            key={`${context}-${i}-${optionLabel(option, m)}`}
            type="button"
            onClick={() => onPick(i)}
            className="flex min-h-24 cursor-pointer flex-col items-start gap-2 rounded-2xl border border-line bg-surface p-4 text-left transition-colors hover:border-accent active:border-accent"
          >
            <span className="flex w-full items-center justify-between gap-2 text-xs text-muted">
              {option.kind === 'now' ? m.now : m.later}
              {option.lucky && <LuckMark />}
            </span>
            <span className="font-bold">{optionLabel(option, m)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
