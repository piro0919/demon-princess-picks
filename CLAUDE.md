# Demon Princess Picks

A browser game where the only thing the player does is pick one of three options. Battles run on their own; the player picks after each battle and on every other square, and tries to reach the last boss.

Nothing is built yet. Everything below was agreed with the owner in a sounding-board session on 2026-10-17 (in the home window; the log is `~/.claude/projects/-Users-piro/50474f48-0d6f-449f-a628-0c5e9128e54e.jsonl`). Do not change the spec, the look or the name without the owner's word.

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
- One web search on 2026-10-17 found no game with this name. A game with a close setting exists: "Demon Princess Retreat" (indie RPG, June 2026), also about the Demon King's daughter

### Turned down

- Showing the next enemy before picking (owner preferred hidden)
- Branching map like Slay the Spire (one straight road instead)
- Battle-only, without event squares (gets monotone over 30 minutes)
- Unlocks or stat carry-over between runs
- Different enemy kinds per section (for now)
- Names with "Doom" (owner disliked it). "The Devil's Daughter …" clashes with Sherlock Holmes: The Devil's Daughter (2016)

## Not decided yet

- Tech stack
- Number of squares per section and how often each square type appears
- What exactly each square's three options are, and the list of upgrades
- The three bosses
- How SPD works in auto battles
