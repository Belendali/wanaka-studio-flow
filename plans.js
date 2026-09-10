/* ──────────────────────────────────────────────────────────────────
   Four ways to show a plan.

   The plan itself is the same in all four — Tiny Explorer, four rooms,
   stylized toon. What changes is how it is put in front of a person.

   Every screen takes its colours from the cover image at runtime: the
   canvas quantises it, the palette gets sorted into roles, and the page
   re-themes. A plan for a warm toy house and a plan for a horror game
   are not supposed to look like the same product.
   ────────────────────────────────────────────────────────────────── */

const $ = (id) => document.getElementById(id);
const E = (t, c, h) => { const n = document.createElement(t);
  if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };

// ── The three plans we can show ───────────────────────────────────
const PLANS = {
  toy: {
    cover: 'assets/cover-girl.jpg',
    title: 'Tiny Explorer',
    sub: 'The Wooden Toy House',
    genre: 'Adventure',
    pitch: 'You are the size of a thumb. The dollhouse on the bedroom floor is '
         + 'a country, and someone has scattered the pieces of your story through it.',
    doing: 'Walk the rooms of a giant wooden dollhouse, find the puzzle pieces '
         + 'hidden under the furniture, and carry them home one at a time. '
         + 'Nothing chases you. The pleasure is in noticing.',
    feel: 'Small and curious. Warm lamp light, oversized grain, a cat the size '
        + 'of a hill who is entirely uninterested in you.',
    style: 'Stylized toon', quality: 'High',
    rooms: '4 rooms', assets: '6 assets', mins: '~12 min',
    credits: '320–560', platform: 'Web + Mobile', length: '8–12 min a run',
    checks: ['She can walk, climb and carry', 'Every room has a way out',
             'A dropped piece can be found again', 'The last piece ends the story',
             'Runs at 60fps on a three-year-old phone', 'A new player finishes without help'],
  },
  horror: {
    cover: 'assets/cover-ink-wash.jpg',
    title: 'Small Hours',
    sub: 'What Is Left In The Nursery',
    genre: 'Horror',
    pitch: 'The house is the same house. The toys are the same toys. '
         + 'Something has been moving them while you were asleep.',
    doing: 'Search the rooms by torchlight for the pieces of what happened here. '
         + 'The batteries do not last. What you find does not want to be found.',
    feel: 'Watched. Cold blue where the lamp does not reach, and the sense that '
        + 'the room behind you is not the room you left.',
    style: 'Cold wash', quality: 'Ultra',
    rooms: '4 rooms', assets: '9 assets', mins: '~18 min',
    credits: '480–720', platform: 'Web', length: '15–20 min a run',
    checks: ['The torch runs down and can be refilled', 'Every room has a way out',
             'Nothing jumps in the first two minutes', 'The house rearranges only offscreen',
             'Runs at 60fps with the lights off', 'A new player finishes without help'],
  },
  pixel: {
    cover: 'assets/cover-phosphor.jpg',
    title: 'Toybox Run',
    sub: 'Eight Rooms, One Breath',
    genre: 'Arcade',
    pitch: 'The floor is lava, the lava is carpet, and you have four minutes '
         + 'before the bedroom light goes out.',
    doing: 'Sprint the length of a bedroom built of blocks and books. '
         + 'Grab every star on the way. Miss one and the run does not count.',
    feel: 'Fast and legible. You lose because you were greedy, and you know it '
        + 'the instant it happens.',
    style: 'Phosphor', quality: 'Medium',
    rooms: '8 rooms', assets: '4 assets', mins: '~7 min',
    credits: '210–340', platform: 'Web + Mobile', length: '3–5 min a run',
    checks: ['A run can be finished in one breath', 'Every jump is survivable',
             'The timer is always visible', 'A missed star is your fault, not the camera’s',
             'Runs at 60fps on a three-year-old phone', 'A new player finishes without help'],
  },
};

const CREW = [
  ['planner', 'Planner', 'I kept it to one house. A small world you can hold beats a big one you get lost in.'],
  ['artist', 'Artist', 'Warm lamp, cold window. Everything oversized so she reads as tiny without saying so.'],
  ['developer', 'Developer', 'Four rooms is a full course and still fits one build. Eight would cost you a day.'],
  ['tester', 'Tester', 'Six things it has to pass. If it fails one I send it back before you ever see it.'],
  ['marketing', 'Publisher', 'This screenshots well. That matters more than it should.'],
];

// ── Colour, taken from the cover ──────────────────────────────────
const hsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return { h: 0, s: 0, l };
  const d = mx - mn;
  const s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? ((g - b) / d + (g < b ? 6 : 0))
          : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s, l };
};
const css = (h, s, l) => `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;

function readPalette(img) {
  const c = E('canvas');
  c.width = c.height = 80;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(img, 0, 0, 80, 80);
  const d = x.getImageData(0, 0, 80, 80).data;

  const bins = new Map();
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const k = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    let e = bins.get(k);
    if (!e) bins.set(k, (e = { n: 0, r: 0, g: 0, b: 0 }));
    e.n++; e.r += r; e.g += g; e.b += b;
  }
  const all = [...bins.values()].map((e) => {
    const r = e.r / e.n, g = e.g / e.n, b = e.b / e.n;
    return Object.assign({ n: e.n }, hsl(r, g, b));
  }).sort((a, z) => z.n - a.n).slice(0, 90);

  // the accent is the colour that carries the picture: saturated, mid-bright,
  // and actually present in quantity
  const score = (p) => p.s * Math.sqrt(p.n) * (p.l > .3 && p.l < .8 ? 1 : .15);
  const accent = all.slice().sort((a, z) => score(z) - score(a))[0] || { h: 30, s: .6, l: .55 };
  const far = all.slice().sort((a, z) => score(z) - score(a))
    .find((p) => Math.abs(((p.h - accent.h + 540) % 360) - 180) < 120) || accent;

  // the ground is the darkest colour with real presence, pushed down
  const deep = all.slice(0, 40).sort((a, z) => a.l - z.l)[0] || { h: accent.h, s: .2, l: .1 };

  return {
    accent: css(accent.h, Math.min(.85, accent.s + .12), Math.min(.66, Math.max(.48, accent.l))),
    accentSoft: css(accent.h, accent.s * .5, .22),
    far: css(far.h, Math.min(.7, far.s + .1), .58),
    bg: css(deep.h, Math.min(.35, deep.s), .055),
    bg2: css(deep.h, Math.min(.3, deep.s), .105),
    line: css(deep.h, Math.min(.25, deep.s), .19),
    ink: css(accent.h, .16, .95),
    ink2: css(accent.h, .10, .68),
    paper: css(accent.h, .26, .93),
    paperInk: css(accent.h, .55, .13),
    paperLine: css(accent.h, .22, .74),
  };
}

function theme(pal) {
  const r = document.documentElement.style;
  Object.entries(pal).forEach(([k, v]) => r.setProperty('--' + k, v));
}

// ── A · the one-pager ─────────────────────────────────────────────
function compA(p) {
  return `
  <article class="ed">
    <figure class="ed__cover"><img src="${p.cover}" alt=""></figure>
    <div class="ed__body">
      <p class="ed__kicker">${p.genre} · a plan for a game that does not exist yet</p>
      <h1 class="ed__title">${p.title}<em>${p.sub}</em></h1>
      <p class="ed__stand">${p.pitch}</p>
      <div class="ed__cols">
        <section><h3>What you do</h3><p>${p.doing}</p></section>
        <section><h3>What it feels like</h3><p>${p.feel}</p></section>
      </div>
      <div class="ed__spec">
        ${[[p.genre, 'Genre'], [p.style, 'Look'], [p.rooms, 'Scope'],
           [p.length, 'A run'], [p.platform, 'Plays on'], [p.credits, 'Credits']]
          .map(([v, k]) => `<span><b>${v}</b><em>${k}</em></span>`).join('')}
      </div>
      <footer class="ed__sign">
        <span class="ed__faces">${CREW.map(([k]) =>
          `<img src="assets/crew-${k}.webp" alt="">`).join('')}</span>
        Drafted by the Plan crew · nothing gets built until you approve it
      </footer>
    </div>
  </article>`;
}

// ── B · the crew's wall ───────────────────────────────────────────
function compB(p) {
  const note = (k, name, said, extra, cls) => `
    <div class="pin ${cls}">
      <span class="pin__tape"></span>
      ${extra}
      <footer class="pin__by">
        <img src="assets/crew-${k}.webp" alt="">
        <span><b>${name} Wana</b><em>${said}</em></span>
      </footer>
    </div>`;
  return `
  <article class="wall">
    <header class="wall__h">
      <h1>${p.title}<em>${p.sub}</em></h1>
      <p>What the crew put on the wall. Change anything — nothing is built until you approve.</p>
    </header>
    <div class="wall__grid">
      ${note('planner', 'Planner', CREW[0][2], `
        <h3 class="pin__h">The idea</h3>
        <p class="pin__p">${p.pitch}</p>
        <p class="pin__p">${p.doing}</p>`, 'pin--a')}
      ${note('artist', 'Artist', CREW[1][2], `
        <figure class="pin__shot"><img src="${p.cover}" alt=""></figure>
        <p class="pin__k">${p.style} · ${p.quality} quality</p>`, 'pin--b')}
      ${note('developer', 'Developer', CREW[2][2], `
        <h3 class="pin__h">The build</h3>
        <ul class="pin__nums">
          ${[[p.rooms, 'to walk'], [p.assets, 'to make'], [p.mins, 'to play'],
             [p.credits, 'credits']].map(([a, b]) =>
            `<li><b>${a}</b><em>${b}</em></li>`).join('')}
        </ul>`, 'pin--c')}
      ${note('tester', 'Tester', CREW[3][2], `
        <h3 class="pin__h">It has to pass</h3>
        <ul class="pin__check">${p.checks.map((c) => `<li>${c}</li>`).join('')}</ul>`, 'pin--d')}
    </div>
  </article>`;
}

// ── C · the box ───────────────────────────────────────────────────
function compC(p) {
  return `
  <article class="box">
    <div class="box__front">
      <img src="${p.cover}" alt="">
      <div class="box__spine">WANAKA</div>
      <div class="box__face">
        <em>${p.genre}</em>
        <h1>${p.title}</h1>
        <span>${p.sub}</span>
      </div>
    </div>
    <div class="box__back">
      <h2>${p.sub}</h2>
      <p class="box__pitch">${p.pitch}</p>
      <ul class="box__feat">
        <li>${p.doing}</li>
        <li>${p.feel}</li>
      </ul>
      <div class="box__shots">
        ${[0, 1, 2].map(() => '<span>screenshot<i>after the build</i></span>').join('')}
      </div>
      <table class="box__spec">
        ${[['Genre', p.genre], ['Look', p.style + ' · ' + p.quality],
           ['Scope', p.rooms + ' · ' + p.assets], ['A run', p.length],
           ['Plays on', p.platform], ['Cost to build', p.credits + ' credits · ' + p.mins]]
          .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}
      </table>
      <footer class="box__foot">
        <span class="box__faces">${CREW.map(([k]) =>
          `<img src="assets/crew-${k}.webp" alt="">`).join('')}</span>
        <button class="box__go">Make it real ↗</button>
      </footer>
    </div>
  </article>`;
}

// ── D · the blueprint ─────────────────────────────────────────────
function compD(p) {
  return `
  <article class="bp">
    <div class="bp__sheet">
      <svg class="bp__draw" viewBox="0 0 760 470">
        <g class="bp__iso">
          <path d="M380 70 L700 230 L380 390 L60 230 Z"/>
          <path d="M200 230 L300 180 L400 230 L300 280 Z"/>
          <path d="M200 230 L200 300 L300 350 L300 280 Z"/>
          <path d="M300 280 L400 230 L400 300 L300 350 Z"/>
          <path d="M400 175 L500 125 L600 175 L500 225 Z"/>
          <path d="M400 175 L400 245 L500 295 L500 225 Z"/>
          <path d="M500 225 L600 175 L600 245 L500 295 Z"/>
        </g>
        <g class="bp__dim">
          <path d="M60 420 L700 420"/><path d="M60 410 L60 430"/><path d="M700 410 L700 430"/>
          <text x="380" y="412" text-anchor="middle">${p.rooms.toUpperCase()}</text>
          <path d="M726 70 L726 390"/><path d="M716 70 L736 70"/><path d="M716 390 L736 390"/>
        </g>
        <g class="bp__call">
          <path d="M300 230 L250 120 L150 120"/><circle cx="300" cy="230" r="4"/>
          <text x="150" y="112">START · she wakes here</text>
          <path d="M500 175 L560 90 L660 90"/><circle cx="500" cy="175" r="4"/>
          <text x="660" y="82" text-anchor="end">GOAL · the last piece</text>
        </g>
      </svg>
      <div class="bp__block">
        <div class="bp__row bp__row--big">
          <span><em>Project</em><b>${p.title}</b></span>
          <span><em>Sheet</em><b>01 / 01</b></span>
        </div>
        <div class="bp__row">
          ${[['Genre', p.genre], ['Look', p.style], ['Scope', p.rooms + ' · ' + p.assets],
             ['A run', p.length], ['Plays on', p.platform], ['Budget', p.credits + ' cr']]
            .map(([k, v]) => `<span><em>${k}</em><b>${v}</b></span>`).join('')}
        </div>
        <div class="bp__row bp__row--sign">
          <span><em>Drawn by</em><b>The Plan crew</b></span>
          <span class="bp__faces">${CREW.map(([k]) =>
            `<img src="assets/crew-${k}.webp" alt="">`).join('')}</span>
          <span><em>Status</em><b>Awaiting your approval</b></span>
        </div>
      </div>
    </div>
  </article>`;
}

// ── Wiring ────────────────────────────────────────────────────────
const COMPS = { a: compA, b: compB, c: compC, d: compD };
let which = 'a', plan = 'toy';

function paint() {
  const p = PLANS[plan];
  $('stage').className = 'stage stage--' + which;
  $('stage').innerHTML = COMPS[which](p);
  document.querySelectorAll('.sw__b').forEach((b) =>
    b.classList.toggle('is-on', b.dataset.c === which));
  document.querySelectorAll('.sw__p').forEach((b) =>
    b.classList.toggle('is-on', b.dataset.p === plan));

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => theme(readPalette(img));
  img.src = p.cover;
}

document.querySelectorAll('.sw__b').forEach((b) =>
  b.onclick = () => { which = b.dataset.c; paint(); });
document.querySelectorAll('.sw__p').forEach((b) =>
  b.onclick = () => { plan = b.dataset.p; paint(); });
paint();
