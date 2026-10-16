import { SECTIONS } from '@/game/balance';
import type { RunState } from '@/game/types';

/** 区切りの番号と、今の区切りのマスの並び。踏んだマスは塗り、先のマスは中身を見せない */
export function RoadBar({ state }: { state: RunState }) {
  return (
    <header className="flex items-center gap-3">
      <span className="text-sm font-bold tabular-nums">
        {state.section + 1}/{SECTIONS}
      </span>
      <ol className="flex flex-1 items-center gap-1">
        {state.road.map((type, i) => {
          const done = i < state.pos;
          const here = i === state.pos;
          const boss = type === 'boss';
          return (
            <li
              key={i}
              className={`h-2 flex-1 rounded-full ${
                here ? 'bg-accent' : done ? 'bg-muted' : boss ? 'bg-foe' : 'bg-line'
              }`}
            />
          );
        })}
      </ol>
    </header>
  );
}
