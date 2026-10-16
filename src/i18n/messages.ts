import type { PickContext, StatKey } from '@/game/types';

export type Lang = 'en' | 'ja';

export type Messages = {
  stats: Record<StatKey, string>;
  contexts: Record<PickContext, string>;
  random: string;
  now: string;
  later: string;
  /** 「〜するたびに」の強化。effect は「ATK +1」のような効き目 */
  eachWin: (effect: string) => string;
  eachSquare: (effect: string) => string;
  cleared: string;
  defeated: string;
  section: (current: number, total: number) => string;
  retry: string;
};

// 能力の名前は、どの言語でも合意した英語の略（CLAUDE.md の Stats）で出す
const STATS: Record<StatKey, string> = {
  atk: 'ATK',
  def: 'DEF',
  maxHp: 'Max HP',
  hp: 'HP',
  spd: 'SPD',
  luck: 'LUCK',
};

export const MESSAGES: Record<Lang, Messages> = {
  en: {
    stats: STATS,
    contexts: {
      opening: 'Before the journey',
      afterBattle: 'Victory',
      treasure: 'Treasure',
      statUp: 'Power up',
      statDown: 'Curse',
      heal: 'Spring',
    },
    random: 'Random',
    now: 'Now',
    later: 'Later',
    eachWin: (effect) => `${effect} each time you win a battle`,
    eachSquare: (effect) => `${effect} on each square`,
    cleared: 'Cleared',
    defeated: 'Defeated',
    section: (current, total) => `Section ${current}/${total}`,
    retry: 'Try again',
  },
  ja: {
    stats: { ...STATS, maxHp: '最大HP' },
    contexts: {
      opening: '旅立ちの前',
      afterBattle: '勝利',
      treasure: '宝箱',
      statUp: '能力上昇',
      statDown: '能力下降',
      heal: '回復',
    },
    random: 'ランダム',
    now: '今すぐ',
    later: 'あとから',
    eachWin: (effect) => `戦闘に勝つたびに ${effect}`,
    eachSquare: (effect) => `マスを踏むたびに ${effect}`,
    cleared: '踏破',
    defeated: '敗北',
    section: (current, total) => `区切り ${current}/${total}`,
    retry: 'もう一度',
  },
};

/** 端末の言語設定に合わせる。日本語の設定が英語より先にあれば日本語、それ以外は英語 */
export function detectLang(languages: readonly string[]): Lang {
  const first = languages.find((l) => /^(ja|en)\b/i.test(l));
  return first?.toLowerCase().startsWith('ja') ? 'ja' : 'en';
}
