import { describe, expect, it } from 'vitest';
import { optionLabel } from '../src/i18n/labels';
import { detectLang, MESSAGES } from '../src/i18n/messages';
import type { Option } from '../src/game/types';

describe('言語', () => {
  it('端末の言語設定で、先に来た日本語か英語に合わせる', () => {
    expect(detectLang(['ja-JP', 'en-US'])).toBe('ja');
    expect(detectLang(['ja'])).toBe('ja');
    expect(detectLang(['en-US', 'ja-JP'])).toBe('en');
    expect(detectLang(['fr-FR', 'ja-JP'])).toBe('ja');
    expect(detectLang(['fr-FR'])).toBe('en');
    expect(detectLang([])).toBe('en');
  });

  it('「〜するたびに」の強化を、それぞれの言語で書く', () => {
    const option = {
      kind: 'later',
      perk: { trigger: 'win', effect: { stat: 'atk', amount: 1 } },
      lucky: false,
    } as const;
    expect(optionLabel(option, MESSAGES.en)).toBe('ATK +1 each time you win a battle');
    expect(optionLabel(option, MESSAGES.ja)).toBe('戦闘に勝つたびに ATK +1');
  });

  it('日本語でも、最大HP 以外の能力の名前は英語の略のまま', () => {
    const now: Option = { kind: 'now', effects: [{ stat: 'maxHp', amount: 15 }], lucky: false };
    expect(optionLabel(now, MESSAGES.ja)).toBe('最大HP +15');
    expect(MESSAGES.ja.stats.atk).toBe('ATK');
  });
});
