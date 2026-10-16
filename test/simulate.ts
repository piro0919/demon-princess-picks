import { SECTIONS } from '../src/game/balance';
import { choose, finishBattle, newRun } from '../src/game/run';
import type { Option, RunState } from '../src/game/types';

export type Bot = (state: RunState, seed: number) => number;

/** 何も考えずに押す遊び方 */
export const randomBot: Bot = (_state, seed) => seed % 3;

/** 決まった種類（今すぐ／〜するたびに）を、あれば必ず選ぶ遊び方 */
export const preferBot =
  (kind: Option['kind']): Bot =>
  (state, seed) => {
    if (state.phase.kind !== 'pick') return 0;
    const i = state.phase.options.findIndex((o) => o.kind === kind);
    return i >= 0 ? i : seed % 3;
  };

/** 挑戦を最後まで遊ばせ、どこまで行けたかを返す。section は倒れた区切り */
export function playRun(seed: number, bot: Bot): { section: number; cleared: boolean } {
  let state = newRun(seed);
  let picks = 0;
  for (;;) {
    if (state.phase.kind === 'over') return { section: state.section, cleared: false };
    if (state.phase.kind === 'clear') return { section: SECTIONS, cleared: true };
    if (state.phase.kind === 'battle') state = finishBattle(state);
    else state = choose(state, bot(state, seed + picks++));
  }
}

export function summarize(runs: number, bot: Bot) {
  const results = Array.from({ length: runs }, (_, i) => playRun(i + 1, bot));
  const share = (f: (r: (typeof results)[number]) => boolean) => results.filter(f).length / runs;
  return {
    diedInSection1: share((r) => !r.cleared && r.section === 0),
    cleared: share((r) => r.cleared),
  };
}
