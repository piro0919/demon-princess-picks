const PERCENT = 100;

export function HpBar({ hp, maxHp, foe = false }: { hp: number; maxHp: number; foe?: boolean }) {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full transition-all ${foe ? 'bg-foe' : 'bg-hp'}`}
          style={{ width: `${(Math.max(0, hp) / maxHp) * PERCENT}%` }}
        />
      </div>
      <span className="text-xs text-muted tabular-nums">
        {hp}/{maxHp}
      </span>
    </div>
  );
}
