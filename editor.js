/* ──────────────────────────────────────────────────────────────────
   Wanaka · Studio — the whole first run, on the new editor.

   A new user opens the editor, says what they want to make, the crew
   drafts a plan, the plan opens in Plan Studio, they approve it, and
   the crew builds it while the scene fills in beside them.

   The editor chrome follows the shipped one (page #1D1D26, lime
   #C4EB00, a 390px chat column, a 56px icon rail). The plan panel is
   the reworked one-page version, loaded from panel.js.

   Every beat is a step in RUN() at the bottom — that is the script.
   ────────────────────────────────────────────────────────────────── */

(function () {
const E = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const CREW = [
  ['planner', 'Planner'], ['artist', 'Artist'], ['developer', 'Developer'],
  ['tester', 'Tester'], ['marketing', 'Publisher'],
];
const BRIEF = 'a tiny girl exploring a giant wooden toy house, collecting puzzle pieces';

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
        <div class="playbar" id="playbar" hidden>
          <button class="playbtn" id="playbtn">▶ Play</button>
          <span>Version 1.0 · built in ~12 min</span>
        </div>
      </section>

      <aside class="chat">
        <header class="chat__top">
          <span class="chat__name" id="chat-name">New project<i class="cv"></i></span>
          <button class="chat__plus">＋</button>
        </header>
        <div class="chat__log" id="log"></div>
        <div class="chat__composer">
          <textarea class="chat__in" id="input" rows="2"
            placeholder="Describe the game — the Agent will plan before building..."></textarea>
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
  document.getElementById('stage').appendChild(w);
  document.getElementById('scene').innerHTML = sceneSVG();
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
      ${[[470, 400], [660, 330], [790, 470], [540, 540], [880, 400]].map(([x, y], i) => `
        <g style="animation-delay:${i * .12}s">
          <circle cx="${x}" cy="${y}" r="16" fill="#F4D35E" opacity=".16"/>
          <path d="M${x - 8} ${y} l8 -9 l8 9 l-8 9 Z" fill="#F4D35E"/>
        </g>`).join('')}
    </g>

    <g class="pc light">
      <ellipse cx="600" cy="330" rx="420" ry="260" fill="url(#lamp)"/>
    </g>
  </svg>`;
}

// ── Chat ──────────────────────────────────────────────────────────
const log = () => document.getElementById('log');
function push(node) {
  log().appendChild(node);
  log().scrollTop = log().scrollHeight;
  return node;
}
const userSay = (t) => push(E('div', 'msg msg--me', esc(t)));
function crewSay(who, t) {
  const [k, n] = CREW.find((c) => c[0] === who) || CREW[0];
  return push(E('div', 'msg msg--crew', `
    <img src="assets/crew-${k}.webp" alt="">
    <span><b>${n} Wana</b>${t}</span>`));
}
function crewTick(t) {
  return push(E('div', 'tick', `<i></i>${t}`));
}
function ask(q, options) {
  return new Promise((resolve) => {
    push(E('div', 'msg msg--crew', `
      <img src="assets/crew-planner.webp" alt="">
      <span><b>Planner Wana</b>${q}</span>`));
    const box = push(E('div', 'qa'));
    options.forEach((t, i) => {
      const b = E('button', 'qa__b' + (i === 0 ? ' qa__b--go' : ''), t);
      b.onclick = () => { box.remove(); userSay(t); resolve(t); };
      box.appendChild(b);
    });
  });
}

// ── The crew card over the viewport ───────────────────────────────
const card = () => document.getElementById('crewcard');
function cardShow(kicker, line, face) {
  card().hidden = false;
  document.getElementById('cc-kicker').textContent = kicker;
  document.getElementById('cc-line').textContent = line;
  if (face) document.getElementById('cc-face').src = `assets/crew-${face}.webp`;
}
function cardBusy(who) {
  document.querySelectorAll('.cc').forEach((c) =>
    c.classList.toggle('is-on', c.dataset.k === who));
}

// ── Typing into the composer, like a person would ─────────────────
async function typeIn(text) {
  const box = document.getElementById('input');
  box.focus();
  for (let i = 0; i <= text.length; i++) {
    box.value = text.slice(0, i);
    await wait(18 + Math.random() * 26);
  }
  await wait(420);
}

// ── The run ───────────────────────────────────────────────────────
async function RUN() {
  const scene = document.getElementById('scene');
  await wait(700);

  // 1 · the brief
  await typeIn(BRIEF);
  document.getElementById('send').classList.add('is-live');
  await wait(280);
  document.getElementById('input').value = '';
  userSay(BRIEF);
  document.getElementById('chat-name').innerHTML = 'Tiny Explorer<i class="cv"></i>';

  // 2 · the crew starts reading
  await wait(500);
  cardShow('Plan crew · thinking', 'Reading your brief', 'planner');
  cardBusy('planner');
  crewSay('planner', "A toy house is a good shape for this — small player, big world. Two quick things and I'll write the plan.");

  // 3 · two questions, because the answers change the plan
  await wait(700);
  const pace = await ask('Racing the clock, or exploring at your own pace?',
                         ['At my own pace', 'Against the clock']);
  await wait(500);
  const who = await ask('Who is this for?', ['Kids', 'Anyone', 'Players who like a challenge']);

  // 4 · drafting, one Wana at a time
  await wait(500);
  crewSay('planner', 'Got it. Give me a moment — I am laying out the whole build.');
  const beats = [
    ['planner', 'Shaping the loop', 'Collect, carry home, repeat'],
    ['artist', 'Choosing a look', 'Warm toy house, stylized toon'],
    ['developer', 'Sizing the build', 'Four rooms, one full course'],
    ['tester', 'Setting the checks', 'Six things it has to pass'],
  ];
  for (const [k, line, note] of beats) {
    cardShow('Plan crew · thinking', line, k);
    cardBusy(k);
    await wait(1100);
    crewTick(note);
  }

  // 5 · the plan is ready
  await wait(500);
  cardBusy(null);
  cardShow('Plan crew · in sync', 'The plan is ready', 'planner');
  document.getElementById('cc-dot').classList.add('is-ready');
  document.getElementById('cc-foot').hidden = false;
  crewSay('planner', 'Here it is. Read it over — nothing gets built until you say so.');
  const plan = push(E('div', 'plancard', `
    <img src="assets/cover-toon.jpg" alt="">
    <div>
      <em>Your plan is ready</em>
      <b>Tiny Explorer: The Wooden Toy House</b>
      <span>A tiny toy-sized girl explores a giant wooden dollhouse to collect scattered puzzle pieces.</span>
      <button class="openbtn">Open full plan ↗</button>
    </div>`));
  plan.querySelector('.openbtn').onclick = openPanel;
  document.getElementById('cc-open').onclick = openPanel;
}

// ── The plan panel ────────────────────────────────────────────────
function openPanel() {
  const host = document.getElementById('panel-host');
  if (host.dataset.built !== '1') {
    window.mountPlanPanel();
    host.dataset.built = '1';
  }
  host.hidden = false;
  setTimeout(() => host.classList.add('is-on'), 20);
}
window.__closePanel = () => {
  const host = document.getElementById('panel-host');
  host.classList.remove('is-on');
  setTimeout(() => { host.hidden = true; }, 260);
};
window.__approve = async () => {
  window.__closePanel();
  await wait(420);
  build();
};

// ── The build ─────────────────────────────────────────────────────
async function build() {
  const scene = document.getElementById('scene');
  document.getElementById('cc-foot').hidden = true;
  userSay('Approved — build it');
  await wait(400);
  crewSay('planner', 'Building now. I will only interrupt you if someone genuinely needs a call.');

  const steps = [
    ['developer', 'Make it playable', 'floor', 'Movement, start, fail, retry'],
    ['artist', 'Build the world', 'rooms', 'The character, the rooms, the goal'],
    ['developer', 'Add the rules', 'picks', 'Checkpoints, hazards, pickups'],
    ['artist', 'Light it', 'light', 'Lamp light, warm bounce'],
    ['tester', 'Playtest it', 'done', 'Ran it end to end — it holds up'],
  ];
  for (const [k, line, part, note] of steps) {
    cardShow('Crew is building', line, k);
    cardBusy(k);
    scene.classList.add('is-' + part);
    await wait(1500);
    crewTick(note);
  }

  cardBusy(null);
  cardShow('Version 1.0', 'Built and reviewed', 'tester');
  crewSay('tester', 'Version 1.0 is up. Give it a drive — tell any of us what to change and we will take another pass.');
  document.getElementById('playbar').hidden = false;
  document.getElementById('playbtn').onclick = () => {
    document.getElementById('md-prev').classList.add('is-on');
    document.getElementById('md-build').classList.remove('is-on');
    document.getElementById('view').classList.add('is-playing');
  };
}

shell();
RUN();
})();
