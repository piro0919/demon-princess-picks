import { optionLabel } from '@/game/labels';
import type { Perk, Stats } from '@/game/types';
import { HpBar } from './hp-bar';

const SHOWN = [
  ['ATK', 'atk'],
  ['DEF', 'def'],
  ['SPD', 'spd'],
  ['LUCK', 'luck'],
] as const;

/** 主人公の能力と、取った「〜するたびに」の強化 */
export function StatsBar({ stats, perks }: { stats: Stats; perks: Perk[] }) {
  return (
    <footer className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="min-w-40 flex-1">
          <HpBar hp={stats.hp} maxHp={stats.maxHp} />
        </div>
        {SHOWN.map(([label, key]) => (
          <span key={key} className="flex items-baseline gap-1">
            <span className="text-xs text-muted">{label}</span>
            <span className="font-bold tabular-nums">{stats[key]}</span>
          </span>
        ))}
      </div>
      {perks.length > 0 && (
        <ul className="flex flex-wrap gap-1">
          {perks.map((perk, i) => (
            <li key={i} className="rounded-full border border-line px-2 text-xs text-muted">
              {optionLabel({ kind: 'later', perk, lucky: false })}
            </li>
          ))}
        </ul>
      )}
    </footer>
  );
}
