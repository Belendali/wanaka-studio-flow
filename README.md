# Wanaka · Studio flow

The whole first run, on the new editor shell.

Plan is ON by default for a new project. **Type your own brief in the
composer and press send** — that is what starts everything. The Plan crew
drafts without stopping to interview you, the plan opens in Plan Studio,
you approve, and the build takes over the viewport — one Wana at a time,
six seconds a card, four cards, while the scene assembles behind. When
Version 1.0 lands the crew hands you two ways forward: say what to change,
or click a model in the scene and swap it (library, or the Artist makes a
new one).

Send an empty box and it falls back to the example brief, so the demo
always runs. Add `?fast` to the URL for a 6× re-watch.

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
