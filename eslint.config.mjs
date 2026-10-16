import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import magicNumbers from '@piro0919/eslint-config';
import tailwind from '@piro0919/eslint-config/tailwind';
import hollowTests from 'eslint-plugin-hollow-tests';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // 決まりは全リポジトリで共有する（piro0919/eslint-config）。[...] に値をじかに書かず、globals.css の @theme に名前を付けて使う
  ...tailwind({
    cssConfigPath: 'src/app/globals.css',
    files: ['src/**/*.{ts,tsx}'],
    level: 'error',
    // globals.css に自前で書いたクラス（戦闘の突進の向き）
    whitelist: ['fighter-hero', 'fighter-foe'],
  }),
  // 名前の無い数字を落とす（piro0919/eslint-config）。釣り合いの数値をまとめた src/game/balance.ts と、乱数の作り方の定数が並ぶ src/game/rng.ts は外す
  ...magicNumbers({
    files: ['src/**/*.{ts,tsx}'],
    level: 'error',
    ignores: ['src/game/balance.ts', 'src/game/rng.ts'],
  }),
  // 何も確かめずに通るテストを落とす（eslint-plugin-hollow-tests）
  { ...hollowTests.configs.recommended, files: ['test/**/*.{ts,tsx}'] },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.claude/**',
    '.playwright-mcp/**',
  ]),
]);

export default eslintConfig;
