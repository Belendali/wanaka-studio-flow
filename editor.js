/* ──────────────────────────────────────────────────────────────────
   Wanaka · Studio — the whole first run, on the new editor.

   Plan is ON by default for a new project. You type your own brief and
   press send; the Plan crew drafts without stopping to interview you,
   the plan opens in Plan Studio, you approve, and the build takes over
   the viewport — one Wana at a time, six seconds a card, while the
   scene assembles behind. When Version 1.0 lands the crew hands you
   two ways forward: say what to change, or swap a model.

   Send an empty box and it falls back to BRIEF, so the demo always runs.
   The script is RUN() → build() → handover(). One beat a line.
   Add ?fast to the URL to run it at 6× for a quick re-watch.
   ────────────────────────────────────────────────────────────────── */

(function () {
const E = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const FAST = /(\?|&)fast\b/.test(location.search) ? 6 : 1;
const wait = (ms) => new Promise((r) => setTimeout(r, ms / FAST));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const $ = (id) => document.getElementById(id);

const CREW = [
  ['planner', 'Planner'], ['artist', 'Artist'], ['developer', 'Developer'],
  ['tester', 'Tester'], ['marketing', 'Publisher'],
];
const NAME = Object.fromEntries(CREW);
const BRIEF = 'a tiny girl exploring a giant wooden toy house, collecting puzzle pieces';

/* The three things in the scene a user can swap out. Each one draws
   itself, draws every alternative, and knows how to repaint the scene
   when you pick one — so a swap shows the model you actually chose. */
const girl = (head, body, legs) => `
  <circle cx="0" cy="-38" r="15" fill="${head}"/>
  <rect x="-13" y="-24" width="26" height="42" rx="12" fill="${body}"/>
  <rect x="-9" y="16" width="8" height="20" rx="4" fill="${legs}"/>
  <rect x="1" y="16" width="8" height="20" rx="4" fill="${legs}"/>`;
const piece = (c, d) => `
  <circle cx="0" cy="0" r="34" fill="${c}" opacity=".16"/>
  <path d="${d}" fill="${c}"/>`;
const box = (a, b, c) => `
  <path d="M-42 0 l42 -21 l42 21 l-42 21 Z" fill="${a}"/>
  <path d="M-42 0 l42 21 l0 26 l-42 -21 Z" fill="${b}"/>
  <path d="M0 21 l42 -21 l0 26 l-42 21 Z" fill="${c}"/>`;

const STAR = 'M-17 0 l17 -19 l17 19 l-17 19 Z';
const KEY = 'M-6 -18 a9 9 0 1 1 0 18 l0 20 l7 0 l-7 7 Z';
const SPOOL = 'M-13 -18 l26 0 l-7 8 l0 20 l7 8 l-26 0 l7 -8 l0 -20 Z';
const BEAD = 'M0 -17 a17 17 0 1 1 -.1 0 Z';

const MODELS = {
  hero: {
    name: 'Explorer girl', kind: 'Character', node: '.hero',
    now: girl('#EFDCCB', '#C9575C', '#4C5674'),
    lib: [
      ['Tin Explorer', 'Fits this slot', ['#D8DEE6', '#8FA6C4', '#3E4658']],
      ['Paper Scout', '', ['#F0E4CE', '#D9B26A', '#8A6A44']],
      ['Wind-up Kid', '', ['#E8D7B4', '#B98A3C', '#6B4E22']],
      ['Button Doll', '', ['#F4DCD6', '#A85C86', '#5A3350']],
    ],
    draw: (c) => girl(c[0], c[1], c[2]),
    paint: (g, c) => {
      g.querySelector('circle').setAttribute('fill', c[0]);
      const r = g.querySelectorAll('rect');
      r[0].setAttribute('fill', c[1]);
      r[1].setAttribute('fill', c[2]);
      r[2].setAttribute('fill', c[2]);
    },
  },
  picks: {
    name: 'Puzzle piece', kind: 'Prop', node: '.picks',
    now: piece('#F4D35E', STAR),
    lib: [
      ['Brass key', 'Fits this slot', ['#E0B457', KEY]],
      ['Wooden star', '', ['#C98A4B', STAR]],
      ['Ribbon spool', '', ['#E88FA8', SPOOL]],
      ['Glass marble', '', ['#7FD4E8', BEAD]],
    ],
    draw: (c) => piece(c[0], c[1]),
    paint: (g, c) => g.querySelectorAll('g').forEach((one) => {
      one.querySelector('circle').setAttribute('fill', c[0]);
      const path = one.querySelector('path');
      path.setAttribute('fill', c[0]);
      path.setAttribute('d', c[1]);
    }),
  },
  r2: {
    name: 'Toy house room', kind: 'Environment', node: '.r2',
    now: box('#8A6238', '#5E4226', '#74502E'),
    lib: [
      ['Attic room', 'Fits this slot', ['#B6785E', '#7C4B38', '#9A6349']],
      ['Nursery', '', ['#C9B08A', '#8E7554', '#AE9670']],
      ['Music box room', '', ['#8E7BA8', '#5B4C74', '#75648F']],
      ['Workshop', '', ['#7E8A93', '#4E585F', '#66727A']],
    ],
    draw: (c) => box(c[0], c[1], c[2]),
    paint: (g, c) => g.querySelectorAll('path')
      .forEach((path, i) => path.setAttribute('fill', c[i])),
  },
};

// ── Shell ─────────────────────────────────────────────────────────
function shell() {
  const w = E('div', 'ed');
  w.innerHTML = `
    <header class="ed__top">
      <span class="ed__home">⌂</span>
      <span class="ed__branch">main</span>
      <span class="ed__tools">
        ${['⌖', '✋', '✥', '⟳', '⤢'].map((g, i) =>
          `<button class="tl${i === 0 ? ' is-on' : ''}">${g}</button>`).join('')}
      </span>
      <span class="ed__modes">
        <button class="md is-on" id="md-build">Build</button>
        <button class="md" id="md-prev">Preview</button>
      </span>
      <span class="ed__right">
        <button class="ghostbtn">Multiplayer</button>
        <button class="pubbtn">↗ Publish</button>
        <button class="ghostbtn">Upgrade</button>
        <span class="credits" id="credits">100,001,456</span>
      </span>
    </header>

    <div class="ed__body">
      <nav class="ed__rail">
        ${[['◫', 'Scene'], ['＋', 'Add'], ['✦', 'Create'], ['◐', 'Visual'],
           ['▦', 'Toolbox'], ['⚙', 'Settings']].map(([g, t], i) => `
          <button class="rl${i === 0 ? ' is-on' : ''}"><i>${g}</i><span>${t}</span></button>`).join('')}
        <span class="ed__me">Y</span>
      </nav>

      <section class="view" id="view">
        <div class="view__scene" id="scene"></div>

        <!-- thinking: a small card in the corner, the build has not started -->
        <div class="crewcard" id="crewcard" hidden>
          <header class="crewcard__h">
            <img src="assets/crew-planner.webp" alt="" id="cc-face">
            <span>
              <em id="cc-kicker">Plan crew · thinking</em>
              <b id="cc-line">Reading your brief</b>
            </span>
            <i class="dot" id="cc-dot"></i>
          </header>
          <div class="crewcard__row" id="cc-row">
            ${CREW.map(([k, n]) => `
              <span class="cc" data-k="${k}"><img src="assets/crew-${k}.webp" alt=""><em>${n}</em></span>`).join('')}
          </div>
          <div class="crewcard__foot" id="cc-foot" hidden>
            <span class="crewcard__mini">
              <b id="cc-title">Tiny Explorer</b><em id="cc-sub">The plan is ready to read</em>
            </span>
            <button class="openbtn" id="cc-open">Open full plan</button>
          </div>
        </div>

        <!-- building: the main event, centre of the viewport -->
        <div class="bx" id="bx" hidden>
          <div class="bx__card" id="bx-card">
            <div class="bx__art">
              <img src="assets/crew-developer.webp" alt="" id="bx-face">
            </div>
            <div class="bx__body">
              <em class="bx__badge" id="bx-role">Developer Wana</em>
              <b id="bx-line">Making it playable</b>
              <p id="bx-note">Movement, a start, a way to fail, a way to retry.</p>
            </div>
            <div class="bx__bar"><i id="bx-fill"></i></div>
            <div class="bx__nav">
              <button class="bx__arrow" id="bx-prev">‹</button>
              <span class="bx__dots" id="bx-dots"></span>
              <button class="bx__arrow" id="bx-next">›</button>
            </div>
            <button class="bx__live" id="bx-live" hidden>Back to what they are doing now</button>
          </div>
          <div class="bx__done" id="bx-done" hidden>
            <em>Version 1.0</em>
            <b>Your game is ready to play</b>
            <p>Five Wanas built it, the Tester ran it end to end.</p>
            <button class="bx__play" id="bx-play">▶ Play it</button>
            <span>then tell the crew what to change</span>
          </div>
        </div>

        <!-- handover: swapping a model out -->
        <div class="hint" id="hint" hidden>
          <i>⇄</i><span>Click any model in the scene to swap it</span>
          <button id="hint-x">✕</button>
        </div>
        <div class="sheet" id="sheet" hidden></div>

        <div class="playbar" id="playbar" hidden>
          <button class="playbtn" id="playbtn">▶ Play</button>
          <span id="playnote">Version 1.0 · built in ~12 min</span>
        </div>
      </section>

      <aside class="chat">
        <header class="chat__top">
          <span class="chat__name" id="chat-name">New project<i class="cv"></i></span>
          <button class="chat__plus">＋</button>
        </header>
        <div class="chat__log" id="log"></div>
        <div class="chat__composer" id="composer">
          <textarea class="chat__in" id="input" rows="2"
            placeholder="Describe the game — the Agent will plan it before building..."></textarea>
          <div class="chat__row">
            <button class="ci">＋</button>
            <button class="ci">✂</button>
            <span class="model">Wanaka 1.0 Pro <i class="cv"></i></span>
            <span class="grow"></span>
            <button class="ci">🔊</button>
            <button class="plan is-on" id="planbtn">Plan</button>
            <button class="send" id="send">↑</button>
          </div>
        </div>
      </aside>
    </div>

    <div class="panelwrap" id="panel-host" hidden></div>`;
  $('stage').appendChild(w);
  $('scene').innerHTML = sceneSVG();
}

// ── The scene, which fills in as the crew works ───────────────────
function sceneSVG() {
  const room = (x, y, w, h, cls) => `
    <g class="pc ${cls}">
      <path d="M${x} ${y} l${w} ${-w * .5} l${h} ${h * .5} l${-w} ${w * .5} Z" fill="#8A6238"/>
      <path d="M${x} ${y} l${h} ${h * .5} l0 88 l${-h} ${-h * .5} Z" fill="#5E4226"/>
      <path d="M${x + h} ${y + h * .5} l${w} ${-w * .5} l0 88 l${-w} ${w * .5} Z" fill="#74502E"/>
    </g>`;
  return `
  <svg viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1B1E2A"/><stop offset="1" stop-color="#12141C"/>
      </linearGradient>
      <radialGradient id="lamp"><stop offset="0" stop-color="#FFD79A" stop-opacity=".55"/>
        <stop offset="1" stop-color="#FFD79A" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1200" height="760" fill="url(#sky)"/>

    <g class="grid">
      ${Array.from({ length: 13 }, (_, i) => `
        <line x1="${140 + i * 60}" y1="${430 - i * 30}" x2="${500 + i * 60}" y2="${610 - i * 30}"
              stroke="rgba(255,255,255,.10)"/>
        <line x1="${140 + i * 60}" y1="${430 + i * 30}" x2="${500 + i * 60}" y2="${250 + i * 30}"
              stroke="rgba(255,255,255,.10)"/>`).join('')}
    </g>

    <g class="pc floor"><path d="M600 250 L1060 480 L600 710 L140 480 Z" fill="#6E5A3C"/>
      <path d="M600 250 L1060 480 L600 710 L140 480 Z" fill="none" stroke="rgba(255,255,255,.14)"/></g>

    ${room(360, 430, 150, 150, 'r1')}
    ${room(560, 340, 160, 160, 'r2')}
    ${room(700, 470, 140, 140, 'r3')}

    <g transform="translate(505 585)"><g class="pc hero">
      <ellipse cx="0" cy="34" rx="30" ry="12" fill="#000" opacity=".4"/>
      <circle cx="0" cy="-38" r="15" fill="#EFDCCB"/>
      <rect x="-13" y="-24" width="26" height="42" rx="12" fill="#C9575C"/>
      <rect x="-9" y="16" width="8" height="20" rx="4" fill="#4C5674"/>
      <rect x="1" y="16" width="8" height="20" rx="4" fill="#4C5674"/>
    </g></g>

    <g class="pc picks">
      ${[[470, 400], [660, 330], [790, 470], [540, 540], [880, 400]].map(([x, y]) => `
        <g transform="translate(${x} ${y}) scale(.5)">${piece('#F4D35E', STAR)}</g>`).join('')}
    </g>

    <g class="pc light">
      <ellipse cx="600" cy="330" rx="420" ry="260" fill="url(#lamp)"/>
    </g>
  </svg>`;
}

// ── Chat ──────────────────────────────────────────────────────────
const log = () => $('log');
function push(node) {
  log().appendChild(node);
  log().scrollTop = log().scrollHeight;
  return node;
}
const userSay = (t) => push(E('div', 'msg msg--me', esc(t)));
function crewSay(who, t) {
  return push(E('div', 'msg msg--crew', `
    <img src="assets/crew-${who}.webp" alt="">
    <span><b>${NAME[who]} Wana</b>${t}</span>`));
}
const crewTick = (t) => push(E('div', 'tick', `<i></i>${t}`));

// ── The small corner card, used while the crew is still thinking ──
function cardShow(kicker, line, face) {
  $('crewcard').hidden = false;
  $('cc-kicker').textContent = kicker;
  $('cc-line').textContent = line;
  if (face) $('cc-face').src = `assets/crew-${face}.webp`;
}
function cardBusy(who) {
  document.querySelectorAll('.cc').forEach((c) =>
    c.classList.toggle('is-on', c.dataset.k === who));
}

// ── 1 · the user's own brief ──────────────────────────────────────
/* Nothing happens until they type it themselves and press send. */
let started = false;
function armComposer() {
  const box = $('input');
  const send = $('send');
  const ready = () => box.value.trim().length > 0;
  const paint = () => send.classList.toggle('is-live', ready());
  const fire = () => {
    if (started) return;
    const brief = box.value.trim() || BRIEF;
    started = true;
    box.value = '';
    box.blur();
    send.classList.remove('is-live');
    RUN(brief);
  };
  box.oninput = paint;
  box.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); fire(); }
  };
  send.onclick = fire;
  box.focus();
}

// ── 2 · brief → plan ──────────────────────────────────────────────
async function RUN(brief) {
  userSay(brief);
  $('chat-name').innerHTML = 'Tiny Explorer<i class="cv"></i>';

  // Plan was already on, so the brief goes straight to the crew.
  await wait(500);
  cardShow('Plan crew · thinking', 'Reading your brief', 'planner');
  cardBusy('planner');
  crewSay('planner', 'Good — I can see the shape of this. '
    + 'Give me a moment and I will lay out the whole build.');

  // They draft it themselves. Anything they got wrong, the plan is editable.
  const beats = [
    ['planner', 'Shaping the loop', 'Collect, carry home, repeat'],
    ['artist', 'Choosing a look', 'Warm toy house, stylized toon'],
    ['developer', 'Sizing the build', 'Four rooms, one full course'],
    ['tester', 'Setting the checks', 'Six things it has to pass'],
  ];
  for (const [k, line, note] of beats) {
    await wait(500);
    cardShow('Plan crew · thinking', line, k);
    cardBusy(k);
    await wait(1100);
    crewTick(note);
  }

  await wait(500);
  cardBusy(null);
  cardShow('Plan crew · in sync', 'The plan is ready', 'planner');
  $('cc-dot').classList.add('is-ready');
  $('cc-foot').hidden = false;
  crewSay('planner', 'Here it is. Every line is yours to change — '
    + 'nothing gets built until you approve it.');
  const plan = push(E('div', 'plancard', `
    <img src="assets/cover-toon.jpg" alt="">
    <div>
      <em>Your plan is ready</em>
      <b>Tiny Explorer: The Wooden Toy House</b>
      <span>A tiny toy-sized girl explores a giant wooden dollhouse to collect scattered puzzle pieces.</span>
      <button class="openbtn">Open full plan ↗</button>
    </div>`));
  plan.querySelector('.openbtn').onclick = openPanel;
  $('cc-open').onclick = openPanel;
}

// ── 3 · the plan panel ────────────────────────────────────────────
function openPanel() {
  const host = $('panel-host');
  if (host.dataset.built !== '1') { window.mountPlanPanel(); host.dataset.built = '1'; }
  host.hidden = false;
}
window.__closePanel = () => { $('panel-host').hidden = true; };
window.__approve = async () => { window.__closePanel(); await wait(420); build(); };

// ── 4 · the build, front and centre ───────────────────────────────
const STEPS = [
  ['developer', 'Making it playable',
   'Movement, a start, a way to fail, a way to retry.',
   [['floor', 'Movement, start, fail, retry']]],
  ['artist', 'Building the toy house',
   'Four rooms, the girl, and the pieces she is after.',
   [['rooms', 'Four rooms and the girl'],
    ['picks', 'Where the puzzle pieces sit']]],
  ['artist', 'Lighting it',
   'One warm desk lamp, and the bounce it throws on the floor.',
   [['light', 'One warm desk lamp, and its bounce']]],
  ['tester', 'Playing it through',
   'Six checks, start to finish, on web and on a phone.',
   [['done', 'Ran it end to end — it holds up']]],
];
const CARD_MS = 6000;
let live = 0;      // the step the crew is actually on
let shown = 0;     // the card the user is looking at

function paintStep(i) {
  shown = i;
  const [k, line, note] = STEPS[i];
  $('bx-face').src = `assets/crew-${k}.webp`;
  $('bx-role').textContent = `${NAME[k]} Wana`;
  $('bx-line').textContent = line;
  $('bx-note').textContent = note;
  $('bx-card').classList.remove('is-in');
  void $('bx-card').offsetWidth;
  $('bx-card').classList.add('is-in');
  $('bx-fill').style.transitionDuration = `${CARD_MS / 1000 / FAST}s`;
  $('bx-fill').style.width = `${((live + 1) / STEPS.length) * 100}%`;
  $('bx-dots').innerHTML = STEPS.map((_, n) =>
    `<i class="${n === shown ? 'is-on' : ''}${n <= live ? ' is-done' : ''}"></i>`).join('');
  $('bx-prev').disabled = i === 0;
  $('bx-next').disabled = i >= live;
  $('bx-live').hidden = i === live;
}

async function build() {
  const scene = $('scene');
  $('crewcard').hidden = true;
  userSay('Approved — build it');
  await wait(400);
  crewSay('planner', 'Building now. I will only interrupt you if someone genuinely needs a call.');

  $('bx').hidden = false;
  $('bx-prev').onclick = () => paintStep(Math.max(0, shown - 1));
  $('bx-next').onclick = () => paintStep(Math.min(live, shown + 1));
  $('bx-live').onclick = () => paintStep(live);

  for (let i = 0; i < STEPS.length; i++) {
    live = i;
    paintStep(i);                       // a card flips to whoever just started
    const parts = STEPS[i][3];
    const slice = CARD_MS / parts.length;
    for (const [part, note] of parts) {
      scene.classList.add('is-' + part);
      await wait(slice);
      crewTick(note);
    }
  }

  $('bx-card').hidden = true;
  $('bx-done').hidden = false;
  $('bx-play').onclick = () => { $('bx').hidden = true; play(); handover(); };
}

function play() {
  $('md-prev').classList.add('is-on');
  $('md-build').classList.remove('is-on');
  $('view').classList.add('is-playing');
  $('playbar').hidden = false;
  $('playbtn').onclick = play;
}

// ── 5 · what to do with a game that exists ────────────────────────
function handover() {
  crewSay('tester', 'Version 1.0 is up and it holds together. Two things you can do from here.');
  const box = push(E('div', 'next', `
    <button class="next__row" data-go="say">
      <i>✎</i><span><b>Tell us what to change</b><em>Say it in your own words — we take another pass</em></span>
    </button>
    <button class="next__row" data-go="swap">
      <i>⇄</i><span><b>Swap a model in the scene</b><em>Pick one from the library, or have the Artist make a new one</em></span>
    </button>`));

  box.querySelector('[data-go="say"]').onclick = () => {
    const c = push(E('div', 'qa', ''));
    ['Make the rooms feel bigger', 'Add a second floor', 'Slow the girl down a little']
      .forEach((t) => {
        const b = E('button', 'qa__b', t);
        b.onclick = () => { $('input').value = t; $('input').focus(); $('send').classList.add('is-live'); };
        c.appendChild(b);
      });
    $('input').focus();
    $('composer').classList.add('is-lit');
  };
  box.querySelector('[data-go="swap"]').onclick = armSwap;
}

// Turn the scene's models into things you can click.
function armSwap() {
  $('view').classList.add('is-swappable');
  $('hint').hidden = false;
  $('hint-x').onclick = () => { $('hint').hidden = true; };
  Object.entries(MODELS).forEach(([id, m]) => {
    const g = document.querySelector('#scene ' + m.node);
    if (!g) return;
    g.classList.add('hot');
    g.onclick = () => openSheet(id);
  });
  crewSay('artist', 'The girl, the puzzle pieces and the rooms are all separate models. '
    + 'Click one and I will show you what could go there instead.');
}

let picked = null, pickedC = null;
function openSheet(id) {
  const m = MODELS[id];
  picked = null;
  const s = $('sheet');
  s.hidden = false;
  s.innerHTML = `
    <header class="sheet__h">
      <span><em>${m.kind}</em><b>${m.name}</b></span>
      <button class="sheet__x" id="sheet-x">✕</button>
    </header>
    <div class="sheet__now">
      <svg viewBox="-60 -60 120 120"><g>${m.now}</g></svg>
      <span class="sheet__tag">In the scene now</span>
    </div>
    <div class="sheet__sec">
      <h4>From the Wanaka library</h4>
      <div class="sheet__grid">
        ${m.lib.map(([n, tag, c], i) => `
          <button class="opt" data-i="${i}">
            <span class="opt__art"><svg viewBox="-60 -60 120 120">${m.draw(c)}</svg></span>
            <b>${n}</b>${tag ? `<em>${tag}</em>` : ''}
          </button>`).join('')}
      </div>
    </div>
    <div class="sheet__sec">
      <h4>Or describe a new one</h4>
      <div class="sheet__gen">
        <input id="gen-in" placeholder="a wind-up tin girl with a brass key on her back">
        <button id="gen-go">Generate</button>
      </div>
      <div class="sheet__out" id="gen-out" hidden></div>
    </div>
    <footer class="sheet__f">
      <span id="sheet-note">Pick one to see it in the scene</span>
      <button class="sheet__go" id="sheet-go" disabled>Replace</button>
    </footer>`;
  setTimeout(() => s.classList.add('is-on'), 20);

  const choose = (label, node, colors) => {
    picked = label; pickedC = colors;
    s.querySelectorAll('.opt,.res').forEach((o) => o.classList.remove('is-on'));
    node.classList.add('is-on');
    $('sheet-note').textContent = `${m.name} → ${label}`;
    $('sheet-go').disabled = false;
  };
  s.querySelectorAll('.opt').forEach((o) =>
    o.onclick = () => choose(m.lib[+o.dataset.i][0], o, m.lib[+o.dataset.i][2]));

  $('gen-go').onclick = async () => {
    const out = $('gen-out');
    out.hidden = false;
    out.className = 'sheet__out is-working';
    out.innerHTML = '<span class="shim"></span><em>Artist Wana is modelling it…</em>';
    await wait(2600);
    const made = m.lib[2][2];
    out.className = 'sheet__out';
    out.innerHTML = `<button class="res">
      <span class="opt__art"><svg viewBox="-60 -60 120 120">${m.draw(made)}</svg></span>
      <b>${$('gen-in').value || 'Your description'}</b><em>Made just now</em></button>`;
    out.querySelector('.res').onclick = (e) =>
      choose('a new one from the Artist', e.currentTarget, made);
  };

  $('sheet-x').onclick = closeSheet;
  $('sheet-go').onclick = () => {
    const g = document.querySelector('#scene ' + m.node);
    m.paint(g, pickedC);
    g.classList.remove('swapped'); void g.getBBox(); g.classList.add('swapped');
    closeSheet();
    crewTick(`${m.name} → ${picked}`);
    crewSay('artist', `Swapped. It is in the scene and the game still runs — `
      + `if it does not sit right, click it again and try another.`);
  };
}
function closeSheet() {
  const s = $('sheet');
  s.classList.remove('is-on');
  s.hidden = true;
}

shell();
armComposer();
})();
