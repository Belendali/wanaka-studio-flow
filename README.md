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

## Four ways to show a plan

`plans.html` — four static comps of the same plan, to argue about before
building any of it.

- **A · One-pager** — an editorial spread. Prose, not fields; the settings
  demoted to a spec strip like a film's technical credits.
- **B · Crew wall** — what the five Wanas each pinned up, in their own
  voice, signed. Uses the one thing nobody else's AI has.
- **C · Game box** — the plan as packaging for a game that does not exist
  yet. Approve = "Make it real".
- **D · Blueprint** — the toy house drawn as a technical sheet, specs in a
  title block.

Every screen takes its palette from the cover **at runtime** (`readPalette`
in `plans.js` quantises the image on a canvas and sorts the result into
roles). Switch the cover in the top right: warm toy house, cold horror,
green phosphor — same layout, three different products.

- **E · Handheld** — a clamshell on its side: the game on the left panel,
  the plan on the right one as a touch menu, buttons down the far edge.
  The shell is drawn in code (a turbulence filter does the wobble) as a
  stand-in, so the layout can be settled before anyone draws it.

### If you are drawing the shell

Work to a **1800 × 900** canvas (2:1) and keep these cut-outs clear —
`plans.css` positions live HTML into them by percentage:

| Part | x | y | w | h | radius |
|---|---|---|---|---|---|
| Left screen (the game) | 52 | 60 | 788 | 780 | 24 |
| Right screen (the plan) | 962 | 60 | 584 | 780 | 20 |
| Hinge | 862 | 150 | 76 | 600 | 38 |
| Control edge | 1560 | — | 220 | — | — |

Deliver **two layers**: flat colour (tintable, one hue) and ink + shading
(transparent, sits on top). The flat layer takes `--shell` from the cover,
so the console changes colour with the game.
