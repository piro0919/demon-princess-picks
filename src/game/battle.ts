import { DAMAGE_SPREAD, GAUGE, MAX_ACTIONS, MIN_DAMAGE } from './balance';
import type { Rng } from './rng';
import type { BattleResult, Fighter, Hit } from './types';

function damage(attacker: Fighter, target: Fighter, rng: Rng): number {
  const spread = 1 + (rng.next() * 2 - 1) * DAMAGE_SPREAD;
  // 守りは割合で効く。引き算にすると、守りが攻めを超えたところで傷が通らなくなる
  const raw = (attacker.atk * attacker.atk) / Math.max(1, attacker.atk + target.def);
  return Math.max(MIN_DAMAGE, Math.round(raw * spread));
}

/**
 * 戦闘を最後まで計算する。画面はこの結果を順に見せるだけで、戦闘の中で選ぶものは無い。
 * SPD の効き方（仮）: 双方が SPD ずつ行動の溜まりを増やし、GAUGE に届いた方から殴る。同時なら主人公が先
 */
export function simulateBattle(hero: Fighter, enemy: Fighter, rng: Rng): BattleResult {
  const heroSpd = Math.max(1, hero.spd);
  const enemySpd = Math.max(1, enemy.spd);
  let heroHp = hero.hp;
  let enemyHp = enemy.hp;
  let heroGauge = 0;
  let enemyGauge = 0;
  const hits: Hit[] = [];

  while (hits.length < MAX_ACTIONS) {
    if (heroGauge < GAUGE && enemyGauge < GAUGE) {
      // 次にどちらかが届くまで一気に進める
      const ticks = Math.min(
        Math.ceil((GAUGE - heroGauge) / heroSpd),
        Math.ceil((GAUGE - enemyGauge) / enemySpd),
      );
      heroGauge += ticks * heroSpd;
      enemyGauge += ticks * enemySpd;
    }
    if (heroGauge >= GAUGE) {
      heroGauge -= GAUGE;
      const dealt = Math.min(enemyHp, damage(hero, enemy, rng));
      enemyHp -= dealt;
      hits.push({ by: 'hero', damage: dealt, heroHp, enemyHp });
      if (enemyHp === 0) return { hits, won: true, heroHp };
    } else {
      enemyGauge -= GAUGE;
      const dealt = Math.min(heroHp, damage(enemy, hero, rng));
      heroHp -= dealt;
      hits.push({ by: 'enemy', damage: dealt, heroHp, enemyHp });
      if (heroHp === 0) return { hits, won: false, heroHp };
    }
  }
  return { hits, won: false, heroHp };
}
