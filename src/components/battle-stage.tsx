import { useEffect, useState } from 'react';
import type { BattleResult, Enemy } from '@/game/types';
import { HIT_MS, SETTLE_MS } from '@/lib/motion';
import { HpBar } from './hp-bar';

type Props = {
  enemy: Enemy;
  result: BattleResult;
  heroHp: number;
  heroMaxHp: number;
  /** 1手ごとに、殴られたあとの主人公の HP を知らせる */
  onHeroHp: (hp: number) => void;
  onDone: () => void;
};

/**
 * 計算済みの戦闘を1手ずつ見せる。殴る側が相手に向かって突っ込み、殴られた側が揺れて傷の数が浮かぶ。
 * 絵が入るまでは、人物を名前入りの箱で表す。描き方を変えるときはこの部品だけを差し替える
 */
export function BattleStage({ enemy, result, heroHp, heroMaxHp, onHeroHp, onDone }: Props) {
  const [step, setStep] = useState(0);
  const { hits } = result;
  const hit = step > 0 ? hits[step - 1] : null;

  useEffect(() => {
    if (step < hits.length) {
      const t = setTimeout(() => {
        onHeroHp(hits[step].heroHp);
        setStep(step + 1);
      }, HIT_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onDone, SETTLE_MS);
    return () => clearTimeout(t);
  }, [step, hits, onHeroHp, onDone]);

  return (
    <div className="flex size-full max-w-3xl items-center justify-around gap-6 portrait:flex-col-reverse">
      <Fighter
        side="hero"
        name="Princess"
        hp={hit?.heroHp ?? heroHp}
        maxHp={heroMaxHp}
        attacking={hit?.by === 'hero'}
        hurt={hit?.by === 'enemy' ? hit.damage : null}
        step={step}
      />
      <Fighter
        side="foe"
        name={enemy.name}
        boss={enemy.boss}
        hp={hit?.enemyHp ?? enemy.hp}
        maxHp={enemy.maxHp}
        attacking={hit?.by === 'enemy'}
        hurt={hit?.by === 'hero' ? hit.damage : null}
        step={step}
      />
    </div>
  );
}

type FighterProps = {
  side: 'hero' | 'foe';
  name: string;
  boss?: boolean;
  hp: number;
  maxHp: number;
  attacking: boolean;
  hurt: number | null;
  step: number;
};

function Fighter({ side, name, boss, hp, maxHp, attacking, hurt, step }: FighterProps) {
  const down = hp === 0;
  return (
    <div className="flex w-40 flex-col items-center gap-2">
      <div className="relative">
        {/* 手が変わるたびに作り直して、動きを頭から流す */}
        <div
          key={step}
          className={`${side === 'hero' ? 'fighter-hero' : 'fighter-foe'} ${attacking ? 'animate-lunge' : hurt !== null ? 'animate-shake' : ''}`}
        >
          <div
            className={`flex items-center justify-center rounded-2xl border-2 text-sm font-bold transition-opacity ${
              boss ? 'size-36' : 'size-28'
            } ${side === 'hero' ? 'border-accent bg-surface' : 'border-foe bg-surface'} ${
              down ? 'opacity-30' : 'animate-sway'
            }`}
          >
            {name}
          </div>
        </div>
        {hurt !== null && (
          <span
            key={`hurt-${step}`}
            className="absolute inset-x-0 top-0 animate-pop text-center text-2xl font-black text-fg"
          >
            {hurt}
          </span>
        )}
      </div>
      <HpBar hp={hp} maxHp={maxHp} foe={side === 'foe'} />
    </div>
  );
}
