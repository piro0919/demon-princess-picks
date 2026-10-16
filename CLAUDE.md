# Demon Princess Picks

A browser game where the only thing the player does is pick one of three options. Battles run on their own; the player picks after each battle and on every other square, and tries to reach the last boss.

A first playable build exists (boxes instead of art, provisional numbers). Everything below, except the Provisional section, was agreed with the owner in a sounding-board session on 2026-10-17 (in the home window; the log is `~/.claude/projects/-Users-piro/50474f48-0d6f-449f-a628-0c5e9128e54e.jsonl`). Do not change the spec, the look or the name without the owner's word.

## The core

- What makes the picks fun is the trade-off between things that help **now** and things that pay off **later**. If every option just makes you a bit stronger, picking turns into chores.
- So the three options come in two kinds:
  - Now: e.g. "ATK +5"
  - Later, "each time …": e.g. "ATK +1 each time you win a battle", "recover a little HP on each square"
- The "each time" upgrades carry the feeling the owner started from: productivity and speed going up as you play.
- Pressing through without thinking is fine too (owner, 2026-10-17). Do not design against it.

## Agreed

### Play

- Runs in the browser, on both a phone held upright and a PC in landscape
- The player only picks one of three. Battles are fully automatic
- Before the first battle, the player picks three times, so even losing the first battle is the result of their own picks (owner's idea; the risk is picking blind before seeing any battle)

### The road

- One straight road like a sugoroku board. The player steps on every square, one at a time. No dice: dice would add luck the player cannot touch, and stepping on every square lets the player judge "now or later" by how many squares are left
- The order of squares changes every run, and the squares ahead are hidden. Hidden was the owner's choice; Claude first suggested showing the next enemy, but with random events the fun is reacting to whatever comes, not calculating
- Square types: battle, treasure, stat up / stat down, heal, random
  - Battle: the three picks come after the battle
  - All the others: the three picks come on the square
  - Random: turns into one of the other types on the spot
- Events can be good or bad
- Three sections, like Slay the Spire's acts. A boss at the end of each; the third boss is the last one. Three was Claude's call (delegated): about 10 minutes per section is long enough for "each time" upgrades to grow before the boss, and only three bosses to make
- A good run takes about 30 minutes. A bad one can end in the first section
- HP carries over between battles. It only comes back through heal squares and upgrades
- Nothing carries over after a loss. Every run starts from the same state, so the variety has to come from the road and the picks alone, and the upgrades and events need enough kinds from the very first run

### Stats

- ATK, DEF, HP, SPD, LUCK (provisional)
- Higher LUCK makes better options show up in the three picks. LUCK can be tied into other places too, freely (owner: "色々ラックは絡ませて良い"). Example: random squares turn into treasure or heal more often
- LUCK's effect is hard to see. Show the moment it worked on screen, or nobody will pick it
- No items for now. Treasure gives stat changes or "each time" upgrades

### Enemies

- Regular enemies are the same kinds in all three sections and get stronger as you go

### Setting and look

- The heroine is the daughter of a fallen evil emperor (魔王), out to destroy the Earth
- Almost no story. The setting is decoration
- Battles show the characters hitting each other
- Art like Slay the Spire: hand-drawn, chibi-ish, one picture per character, moved by sway and lunges. This keeps the art workload low; the owner accepted that it cannot show big moves like a full sword swing
- Battles are side by side (heroine left, enemies right) in landscape. On a phone held upright, the layout has to change, e.g. enemies on top and the heroine at the bottom

### Name

- **Demon Princess Picks** (owner's pick from Claude's candidates, 2026-10-17)
- English only; no Japanese title, so search does not split the name in two
- The screen texts come in English and Japanese (owner, 2026-10-17). The language follows the device setting; there is no switch. The title stays English in both. Stat names stay ATK, DEF, HP, SPD, LUCK in Japanese too, except Max HP (最大HP). Texts live in `src/i18n/messages.ts`
- One web search on 2026-10-17 found no game with this name. A game with a close setting exists: "Demon Princess Retreat" (indie RPG, June 2026), also about the Demon King's daughter

### Turned down

- Showing the next enemy before picking (owner preferred hidden)
- Branching map like Slay the Spire (one straight road instead)
- Battle-only, without event squares (gets monotone over 30 minutes)
- Unlocks or stat carry-over between runs
- Different enemy kinds per section (for now)
- Names with "Doom" (owner disliked it). "The Devil's Daughter …" clashes with Sherlock Holmes: The Devil's Daughter (2016)

### Tech (agreed 2026-10-17)

- Next.js + TypeScript + pnpm + Tailwind, the same base as Vocafy (lint, lefthook, vitest)
- No game engine. Sway and lunges are CSS transforms. All battle drawing lives in `src/components/battle-stage.tsx`, so it can be swapped for PixiJS inside the battle frame if effects get heavy
- Game logic is pure TypeScript in `src/game/`, separate from the screen. Every function takes a state and returns a new one; the random generator's state is part of the run, so a seed replays the same run
- No server, no DB: nothing carries over between runs

## Code layout

- `src/game/balance.ts` — every balance number, and nothing else holds them
- `src/game/run.ts` — the run: opening picks, stepping, squares, picks, battles, end
- `src/game/battle.ts` — auto battle, computed to the end before it is shown
- `test/balance.test.ts` — bots play 1,000 runs and check the targets below. Change numbers in `balance.ts`, then run `pnpm test`

## Design rules

- Colors and motion lengths are named in the `@theme` of `src/app/globals.css`; components use the names only (eslint's tailwind check and `test/design-rules.test.ts`)
- One battle step is `--duration-hit` in CSS and `HIT_MS` in `src/lib/motion.ts`; keep them equal (tested)
- Until the art exists, characters are boxes with their name

## Provisional (Claude's placeholders, not agreed)

The first playable build needed values for everything below. They are placeholders to be replaced with the owner's word:

- 12 squares per section, then the boss. Square mix: battle 45, treasure 10, stat up 10, stat down 8, heal 12, random 15
- SPD: both sides fill a gauge by their SPD and act when it is full
- Damage: ATK² / (ATK + DEF), ±15%. DEF works as a ratio, so damage never drops to zero
- LUCK: each of the three slots rolls for the better list at 10% + 4% per LUCK (cap 80%); random squares turn into treasure or heal more often. A LUCK mark shows on any option or square that LUCK caused
- "Now" options grow 60% per section; "each time" upgrades do not
- Enemy names "Enemy A/B/C" and "Boss 1/2/3", the heroine shown as "Princess", the screen texts in both languages ("Before the journey" / 旅立ちの前, "Victory" / 勝利 …) and all colors
- Balance targets the tests hold: pressing without thinking clears 3–30% of runs and dies in section 1 in 20–70%; always taking "each time" upgrades dies early more often than always taking "now", but clears more often. At the time of writing: random picks clear about 11% and die in section 1 about 42%. The longest battle in 2,000 runs was 110 hits, about 66 seconds to watch

## Not decided yet

- Number of squares per section and how often each square type appears (placeholders above)
- What exactly each square's three options are, and the list of upgrades (placeholders in `balance.ts`)
- The three bosses
- How SPD works in auto battles (placeholder above)
- The art

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
