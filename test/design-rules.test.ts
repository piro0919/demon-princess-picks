import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { HIT_MS } from '../src/lib/motion';

/**
 * 見た目の決まり（CLAUDE.md の Design rules）から外れた書き方を見つける。決まりを変えるときは、ここも一緒に変える
 */

const ROOT = join(import.meta.dirname, '..', 'src');
const css = readFileSync(join(ROOT, 'app', 'globals.css'), 'utf8');
const files = readdirSync(ROOT, { recursive: true, encoding: 'utf8' })
  .filter((f) => /\.tsx?$/.test(f))
  .map((f) => ({ path: f, lines: readFileSync(join(ROOT, f), 'utf8').split('\n') }));

function offenders(test: (line: string) => boolean): string[] {
  return files.flatMap(({ path, lines }) =>
    lines.flatMap((line, i) =>
      /^\s*(\/\/|\*|\/\*|\{\/\*)/.test(line) || !test(line) ? [] : [`${path}:${i + 1}`],
    ),
  );
}

describe('見た目の決まり', () => {
  it('戦闘の1手の長さは、CSS と JavaScript で同じ', () => {
    const m = css.match(/--duration-hit:\s*(\d+)ms;/);
    expect(Number(m?.[1])).toBe(HIT_MS);
  });

  it('部品で色をじかに書かない（globals.css の @theme の名前を使う）', () => {
    expect(offenders((l) => /#[0-9a-f]{3,8}\b/i.test(l) && !l.includes('themeColor'))).toEqual([]);
  });

  it('部品で動きの長さを数字で書かない', () => {
    expect(offenders((l) => /(?<![\w-])duration-\d/.test(l))).toEqual([]);
  });
});
