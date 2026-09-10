# Wanaka · Studio flow

The whole first run, on the new editor shell.

A new user opens the editor, types what they want to make, the Plan crew
asks two questions and drafts a plan, the plan opens in Plan Studio, they
approve it, and the crew builds it while the scene fills in beside them.

- `editor.js` / `editor.css` — the editor shell, the chat, the crew card,
  the isometric scene that gains a part per build step. The whole script
  is `RUN()` at the bottom of `editor.js`.
- `panel.js` / `panel.css` — the reworked one-page Plan Studio panel
  (12 controls, 7 more behind Advanced), mounted over the editor.

Run locally: `python3 serve.py` → http://localhost:8459
