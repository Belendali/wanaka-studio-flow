# Wanaka · Studio flow

The whole first run, on the new editor shell.

Plan is ON by default for a new project. A new user types what they want,
the Plan crew drafts without stopping to interview them, the plan opens in
Plan Studio, they approve, and the build takes over the viewport — one Wana
at a time, eight seconds a card, while the scene assembles behind. When
Version 1.0 lands the crew hands them two ways forward: say what to change,
or click a model in the scene and swap it (library, or the Artist makes a
new one).

Add `?fast` to the URL to run the whole thing at 6× for a re-watch.

- `editor.js` / `editor.css` — the editor shell, the chat, the crew card,
  the isometric scene that gains a part per build step. The whole script
  is `RUN()` at the bottom of `editor.js`.
- `panel.js` / `panel.css` — the reworked one-page Plan Studio panel
  (12 controls, 7 more behind Advanced), mounted over the editor.

Run locally: `python3 serve.py` → http://localhost:8459
