# Wanaka · Studio flow

The whole first run, on the new editor shell.

Plan is ON by default for a new project. Open the link and it types the
brief and sends it on its own, so it plays start to finish with no input
(add `?manual` to type your own instead). The Plan crew
drafts without stopping to interview you, the plan opens in Plan Studio,
you approve, and the build takes over the viewport — one Wana at a time,
six seconds a card, four cards, while the scene assembles behind. When
Version 1.0 lands the crew hands you two ways forward: say what to change,
or click a model in the scene and swap it (library, or the Artist makes a
new one).

Add `?fast` for a 6× re-watch, `?manual` to type the brief yourself.

- `editor.js` / `editor.css` — the editor shell, the chat, the crew card,
  the isometric scene that gains a part per build step. The whole script
  is `RUN()` at the bottom of `editor.js`.
- `panel.js` / `panel.css` — the reworked one-page Plan Studio panel
  (12 controls, 7 more behind Advanced), mounted over the editor.

Run locally: `python3 serve.py` → http://localhost:8459

## Plan B

There is a switch in the plan's top bar. Off — the shipped decision — the
plan never asks for assets. On, the plan becomes two steps, `Overview` and
`Game assets`, and fixes the two things that make the live asset step
painful:

- **A slot takes more than one model.** The checkboxes are real checkboxes.
- **A slot can take none.** Every slot starts on *Generate later*, and
  picking nothing is a finished answer, not a blocked one.

Candidates are drawn inline (`house`/`chair`/`kid`/`piece` in `panel.js`)
so four entries in a slot look like four different models. Swap in real
library renders when there are some.

## Two ways to show a plan

`plans.html` — the plan presented as an object, in two directions. Both use
the same fields and rules (name, genre, what you do, how it feels, look +
quality, scope, platforms, session length, difficulty; then the assets
page), wired by the same code: `wireForm`, `wireAssets` and `formCheck` in
`plans.js` work on data hooks (`data-slip`, `data-k`, `data-multi`,
`data-part`, `data-need`…), so each direction only owns its looks.
Palettes are read off the cover at runtime; switch the cover top right.

- **E · Handheld** — a clamshell console standing open on a desk in a
  lamp-lit room. It arrives shut (the lid's back shows), lands, and the lid
  swings open around its hinge while the body slides to centre; both
  screens flicker on; the Planner drops onto the desk at the bottom right
  and hops when you tap it or approve. The left screen is only the game.
  The right one is the plan as a touch screen: segmented controls for
  pick-one, tick chips for platforms, pills that open slips for genre and
  look. Step 1 Plan → step 2 Assets → Approve.

- **G · Desk** — A game cartridge rises out
  of the bottom of the screen with the cover in its window (3D: nine copies
  of the outline pushed back in z give the body its thickness; it leans
  toward the pointer). Two sheets of ruled notebook paper fly in from the
  top right and land on a blue and a lavender backing sheet under a copper
  paperclip.

  **Page 1 is the plan, and it is editable** — the same fields as Plan
  Studio with Advanced removed: name, genre, what you do, how it feels,
  look + render quality, scope, platforms, session length, difficulty.
  Written the paper way: type on the lines, circle one, tick all that
  apply; genre and look open as a second slip of paper. Picking a look
  re-renders the cartridge in that style and re-lights the desk from it.
  A name and "what you do" are required — page 2 will not turn without
  them. **Page 2 is the assets** (Plan B's rules: tick several per line, or
  leave it to the Artist). "page 2 →" tucks sheet 1 under sheet 2; Approve
  is a rubber stamp that inks the page and loads the cartridge.

  Everything on the paper is a multiple of one ruled line (`--ln`, page
  height / 20), so the writing stays on the lines at any size. Style
  renders of the cover come from a small PIL script (tone-based, no edge
  detection) — `assets/boy-<style>.jpg` and `assets/boy-sty-<style>.jpg`.

### If you are drawing the shell

You may not need to. E is CSS the whole way down: no image, no 3D file, it
re-themes with the cover and scales to any width. If it should be a real
product render instead, work to **1800 × 900** and keep the cut-outs clear —
`plans.css` places live HTML into them, so live text still has to sit on
top of whatever is rendered:

| Part | x | y | w | h | radius |
|---|---|---|---|---|---|
| Left screen (the game) | 52 | 60 | 788 | 780 | 24 |
| Right screen (the plan) | 962 | 60 | 584 | 780 | 20 |
| Hinge | 862 | 150 | 76 | 600 | 38 |
| Control edge | 1560 | — | 220 | — | — |

Deliver it as **two layers** either way: flat colour (tintable, one hue) and
shading (transparent, on top), so the body can still take `--shell` from the
cover.
