'use client';

import { useState } from 'react';
import { choose, finishBattle, newRun } from '@/game/run';
import { BattleStage } from './battle-stage';
import { EndScreen } from './end-screen';
import { PickCards } from './pick-cards';
import { RoadBar } from './road-bar';
import { StatsBar } from './stats-bar';

// 種は 32 ビットの整数の正の範囲から取る
const SEED_RANGE = 0x80000000;

function randomSeed(): number {
  return Math.floor(Math.random() * SEED_RANGE);
}

export function Game() {
  const [state, setState] = useState(() => newRun(randomSeed()));
  const { phase } = state;

  return (
    <main className="flex h-dvh flex-col gap-3 p-3 select-none">
      <RoadBar state={state} />
      <section className="flex min-h-0 flex-1 items-center justify-center">
        {phase.kind === 'battle' && (
          <BattleStage
            // マスごとに作り直し、1手目から見せる
            key={state.visited.length}
            enemy={phase.enemy}
            result={phase.result}
            heroHp={state.stats.hp}
            heroMaxHp={state.stats.maxHp}
            onDone={() => setState((s) => finishBattle(s))}
          />
        )}
        {phase.kind === 'pick' && (
          <PickCards
            context={phase.context}
            options={phase.options}
            landed={state.visited.at(-1)}
            onPick={(i) => setState((s) => choose(s, i))}
          />
        )}
        {(phase.kind === 'over' || phase.kind === 'clear') && (
          <EndScreen
            cleared={phase.kind === 'clear'}
            section={state.section}
            onRetry={() => setState(newRun(randomSeed()))}
          />
        )}
      </section>
      <StatsBar stats={state.stats} perks={state.perks} />
    </main>
  );
}
