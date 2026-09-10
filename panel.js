/* ──────────────────────────────────────────────────────────────────
   Wanaka · Plan Studio — a faithful copy of what shipped.

   Measured off studio.dev.wanaka.app at 1920×936 and rebuilt here so
   the two can be compared side by side and changed one stage at a
   time. Numbers taken from the live DOM:

     page            #1D1D26
     section card    #232427, radius 10
     header divider  #2E3033, header row 10px 12px, 13px/500
     select          #1C1D1F on #2E3033, radius 6, 268×32
     option card     #232427, radius 8, padding 12
     ring            box-shadow 0 0 0 1px  #2E3033 → #A9ABB3 when chosen
     rail            336px wide, padding 0 16px 12px, 1px left divider
     left pane       starts x=11, y=61
     footer          Close 66×34, radius 10, Next 160×34
     stage label     8px, rgba(255,255,255,.28)

   Nothing here is a proposal. ?after loads the reworked version.
   ────────────────────────────────────────────────────────────────── */

const pEl = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ── The project, as the live plan has it ──────────────────────────
const P = {
  title: 'Tiny Explorer: The Wooden Toy House',
  genre: 'Adventure',
  promise: 'A tiny toy-sized girl explores a giant wooden dollhouse to collect scattered puzzle pieces and complete the story puzzle.',
  fantasy: 'Feel small and curious, discovering hidden treasures inside a cozy, oversized toy world',
  cover: 'assets/cover-girl.jpg',
  // the genre decides what game this is, so it is a picture decision
  genres: [
    ['adventure', 'Adventure', 'Explore a world and find your way through', true],
    ['platformer', 'Platformer', 'Jump, land, and time your moves'],
    ['puzzle', 'Puzzle', 'Work out the answer, then pull it off'],
    ['collect', 'Collectathon', 'Sweep a place clean of things worth having'],
    ['racing', 'Racing', 'Get there first, or beat the clock'],
    ['action', 'Action', 'React fast, keep yourself alive'],
  ],
  // each scope says what you get, not just how large it is
  scopes: [
    ['slice', 'Slice', 'One room, one puzzle — a demo that proves the feel.',
     '1 room · 3 assets', '180–260 credits · ~6 min'],
    ['standard', 'Standard', 'The whole course, from the first step to the goal.',
     '4 rooms · 6 assets', '320–560 credits · ~12 min', true],
    ['ambitious', 'Ambitious', 'Extra rooms, optional paths, and a polish pass.',
     '7 rooms · 11 assets', '640–980 credits · ~25 min'],
  ],
  styles: [
    ['default', 'Default'], ['realistic', 'Realistic'], ['toon', 'Stylized Toon', true],
    ['graphic-ink', 'Graphic Ink'], ['ink-wash', 'Ink Wash'], ['pixel', 'Pixel Screen'],
    ['crosshatch', 'Crosshatch'], ['one-bit', 'One-Bit'], ['phosphor', 'Phosphor'],
    ['retro-warm', 'Retro Warm'], ['horror', 'Horror'],
  ],
  quality: [['Low'], ['Medium'], ['High', true], ['Ultra'], ['Cinematic']],
  slots: [
    ['01', '3d', 'Hero asset', 'The object the player identifies with immediately.',
     'A readable hero with a strong silhouette', '3D', 'character', ['Wanaka', 'Poly Haven', 'Sketchfab']],
    ['02', '3d', 'World kit', 'Reusable landmarks that define the route',
     'Reusable landmarks that define the route', '3D', 'environment', ['Wanaka', 'Poly Haven', 'Sketchfab']],
    ['03', 'audio', 'Theme audio', 'A short loop that matches the session length',
     'A short loop that matches the session length', 'Audio', 'music loop', ['Wanaka', 'Freesound']],
  ],
  platforms: [['Web', 'web', true], ['Mobile', 'mobile', true]],
  length: [['3–5 min', 'Fast retries, quick payoff'],
           ['8–12 min', 'Room for mastery and an arc', true],
           ['15–20 min', 'A longer run with varied beats']],
  difficulty: [['Gentle', 'Forgiving landings, few hazards'],
               ['Normal', 'Fair, with room to fail', true],
               ['Tough', 'Tight timing, real pressure']],
  // everything the simple page decides for you, kept behind Advanced
  extras: [['Hidden room behind a breakable wall', true],
           ['A companion that marks missing pickups', true]],
  pattern: [['Precision course', 'Measured jumps, moving platforms, a clear flag', true],
            ['Collectathon course', 'Hub rooms, a required pickup count, safe returns']],
  camera: [['Dynamic', 'Cinematic accents', true], ['Grounded', 'Restrained motion'],
           ['Tactical', 'Wider, more readable']],
  tone: [['Energetic', 'Bright, immediate', true], ['Atmospheric', 'Mood leads'],
         ['Playful', 'Loose and expressive']],
  crewWork: [['Make it playable', 'Movement, start, fail, retry'],
             ['Build the world', 'The character, the rooms, the goal'],
             ['Add the rules', 'Checkpoints, hazards, pickups'],
             ['Playtest it', 'Run it, fix what breaks, check it holds up']],
  knobs: [
    ['Jump forgiveness', 42, 'Strict', 'Generous'],
    ['Hazard density', 55, 'Sparse', 'Gauntlet'],
    ['Collectibles', 8, 'None', 'Packed', true],
    ['Camera lead', 60, 'Locked', 'Anticipating'],
  ],
  feelStatement: 'Warm, whimsical wonder of being tiny inside a giant cozy toy world',
  personality: [
    ['Camera feel', 'How the player reads motion and space.', [
      ['Dynamic', 'Responsive movement with cinematic accents.', true],
      ['Grounded', 'Stable framing with restrained motion.'],
      ['Tactical', 'A wider view that prioritizes readability.']]],
    ['Emotional tone', 'The feeling each play session should leave behind.', [
      ['Energetic', 'Bright feedback and immediate momentum.', true],
      ['Atmospheric', 'World mood and anticipation lead the experience.'],
      ['Playful', 'Expressive motion and low-friction experimentation.']]],
  ],
  stretch: [
    ['Hidden room behind a breakable wall'],
    ['A companion that marks missing pickups'],
  ],
  stages: [
    ['01', 'Playable foundation', 'Core player loop, Readable game state, Start, fail, and retry', 'Plan stage',
     ['Core player loop', 'Readable game state', 'Start, fail, and retry'],
     ['A player can enter play, traverse the representative course, reach the goal, and restart.']],
    ['02', 'World and visual language', 'Hero character, Course sections, Goal presentation', 'Visual stage',
     ['Hero character', 'Course sections', 'Goal presentation'],
     ['Failure and recovery stay on the intended route without a stuck state.']],
    ['03', 'Game systems', 'Checkpoints, Hazard recovery, Pickup rules', 'Build stage',
     ['Checkpoints', 'Hazard recovery', 'Pickup rules'],
     ['Visible and collision boundaries match from the gameplay camera.']],
    ['04', 'Playtest and review', 'Runtime playtest, Issue fixes, Full acceptance suite', 'Review stage',
     ['Runtime playtest', 'Issue fixes', 'Full acceptance suite'],
     ['A player can enter play, traverse the representative course, reach the goal, and restart.',
      'Failure and recovery stay on the intended route without a stuck state.',
      'Visible and collision boundaries match from the gameplay camera.',
      'Optional collectibles and hazards are tested only when the course uses them.']],
  ],
};

// Small marks, so a genre or a scope reads before the words do.
const ICON = {
  adventure: sv('<path d="M3 15l4-9 4 6 3-4 3 7z"/><circle cx="13.5" cy="4.5" r="1.6"/>'),
  platformer: sv('<rect x="1.5" y="12.5" width="6" height="2.2" rx="1.1"/><rect x="10.5" y="8.5" width="6" height="2.2" rx="1.1"/><circle cx="4.5" cy="8.5" r="2.2"/>'),
  puzzle: sv('<path d="M3 3h5v2.2a1.6 1.6 0 103.2 0V3H15v5h-2.2a1.6 1.6 0 100 3.2H15V15h-5v-2.2a1.6 1.6 0 10-3.2 0V15H3z"/>'),
  collect: sv('<circle cx="5" cy="5.5" r="2.3"/><circle cx="12.5" cy="7" r="2.3"/><circle cx="7.5" cy="12.5" r="2.3"/><circle cx="13.5" cy="13" r="1.6"/>'),
  racing: sv('<path d="M2 11.5h14M4.5 11.5a2 2 0 104 0M10 11.5a2 2 0 104 0"/><path d="M3.5 11.5l2-4h7l2 4"/>'),
  action: sv('<path d="M9.5 1.5L4 10h4l-1.5 6.5L14 8h-4z"/>'),
  slice: sv('<rect x="2.5" y="5.5" width="6" height="7" rx="1.4"/>'),
  standard: sv('<rect x="1.5" y="5.5" width="5" height="7" rx="1.4"/><rect x="7.5" y="5.5" width="5" height="7" rx="1.4"/><rect x="13.5" y="5.5" width="3" height="7" rx="1.4"/>'),
  ambitious: sv('<rect x="1.5" y="7.5" width="4" height="5" rx="1.2"/><rect x="6.5" y="4.5" width="4" height="8" rx="1.2"/><rect x="11.5" y="6" width="4" height="6.5" rx="1.2"/><path d="M13.2 1l.7 1.6 1.7.2-1.3 1.2.4 1.7-1.5-.9-1.5.9.4-1.7-1.3-1.2 1.7-.2z"/>'),
};
function sv(inner) {
  return '<svg class="ic" viewBox="0 0 18 18" fill="none" stroke="currentColor" ' +
         'stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">' + inner + '</svg>';
}

// Visual style folded into Overview, and asset picking left the plan entirely:
// the first build is made by the crew, and swapping in library assets happens
// afterwards, in the Assets tab, where you can see the thing in the game.
// One page. Review was a second reading of a plan you had just read, so the
// approval happens where the decisions are, and the footer states the
// consequence instead of a stage list.
const CREW = ['planner', 'artist', 'developer', 'tester', 'marketing'];
const CREW_NAME = { planner: 'Planner', artist: 'Artist', developer: 'Developer',
                    tester: 'Tester', marketing: 'Publisher' };

let step = 0;

/* Plan B — for when picking assets has to live inside the plan.
   Two things the shipped version gets wrong and this one does not:
   a slot can take more than one model, and a slot can take none.

   The candidates are drawn rather than photographed, so four entries in
   a slot actually look like four different models. */
const art = (inner) => `<svg viewBox="-46 -38 92 76">${inner}</svg>`;

const house = (wall, roof, door) => art(`
  <path d="M-26 30 L-26 -4 L26 -4 L26 30 Z" fill="${wall}"/>
  <path d="M-32 -2 L0 -30 L32 -2 Z" fill="${roof}"/>
  <rect x="-7" y="10" width="14" height="20" rx="2" fill="${door}"/>
  <rect x="-20" y="4" width="10" height="10" rx="2" fill="${door}" opacity=".7"/>
  <rect x="10" y="4" width="10" height="10" rx="2" fill="${door}" opacity=".7"/>`);

const chair = (frame, seat) => art(`
  <rect x="-16" y="-26" width="32" height="28" rx="5" fill="${seat}"/>
  <rect x="-20" y="0" width="40" height="9" rx="4" fill="${frame}"/>
  <rect x="-16" y="9" width="6" height="20" rx="3" fill="${frame}"/>
  <rect x="10" y="9" width="6" height="20" rx="3" fill="${frame}"/>`);

const kid = (head, body, legs) => art(`
  <circle cx="0" cy="-16" r="11" fill="${head}"/>
  <rect x="-10" y="-5" width="20" height="30" rx="9" fill="${body}"/>
  <rect x="-7" y="23" width="6" height="12" rx="3" fill="${legs}"/>
  <rect x="1" y="23" width="6" height="12" rx="3" fill="${legs}"/>`);

const PIECE = {
  star: 'M0 -26 l7 17 l18 1 l-14 12 l5 18 l-16 -10 l-16 10 l5 -18 l-14 -12 l18 -1 Z',
  key: 'M-5 -24 a11 11 0 1 1 0 22 l0 24 l9 0 l-9 9 Z',
  spool: 'M-16 -22 l32 0 l-9 10 l0 24 l9 10 l-32 0 l9 -10 l0 -24 Z',
  marble: 'M0 -21 a21 21 0 1 1 -.1 0 Z',
};
const piece = (c, k) => art(`
  <circle cx="0" cy="2" r="30" fill="${c}" opacity=".14"/>
  <g transform="translate(0 2)"><path d="${PIECE[k]}" fill="${c}"/></g>`);

const SLOTS = [
  ['house', 'The toy house', 'Walls, roof, and how the rooms connect', [
    ['Dollhouse shell', 'Fits this slot', house('#C79A62', '#A8563F', '#6B4327'), true],
    ['Cardboard fort', '', house('#BC9268', '#8E6A47', '#6A4C31')],
    ['Wooden cabin', '', house('#9A7248', '#5E4226', '#3E2C1A')],
    ['Paper house', '', house('#E4DCC8', '#C4B79A', '#8E846E')],
  ]],
  ['furniture', 'Room furniture', 'Beds, chairs, shelves — six pieces', [
    ['Nursery set', 'Fits this slot', chair('#8A6238', '#D8A05E')],
    ['Attic clutter', '', chair('#6E5A3C', '#9A8358')],
    ['Workshop bench', '', chair('#5A626B', '#8B949C')],
    ['Doll parlour', '', chair('#7C4A66', '#C98BA6')],
  ]],
  ['pieces', 'Puzzle pieces', 'The thing she is collecting', [
    ['Wooden stars', 'Fits this slot', piece('#F4D35E', 'star')],
    ['Brass keys', '', piece('#E0B457', 'key')],
    ['Ribbon spools', '', piece('#E88FA8', 'spool')],
    ['Glass marbles', '', piece('#7FD4E8', 'marble')],
  ]],
  ['girl', 'The girl', 'The character you play', [
    ['Tin Explorer', 'Fits this slot', kid('#D8DEE6', '#8FA6C4', '#3E4658')],
    ['Paper Scout', '', kid('#F0E4CE', '#D9B26A', '#8A6A44')],
    ['Wind-up Kid', '', kid('#E8D7B4', '#B98A3C', '#6B4E22')],
    ['Button Doll', '', kid('#F4DCD6', '#A85C86', '#5A3350')],
  ]],
];

// ── Shell ─────────────────────────────────────────────────────────
function mount() {
  const w = pEl('div', 'ws');
  w.innerHTML = `
    <header class="ws__top">
      <span class="ws__brand"><img src="assets/crew-planner.webp" alt=""><b>Plan Studio</b></span>
      <span class="ws__steps" id="steps">
        <button class="st is-on" data-s="0"><i></i><span>Overview</span></button>
        <button class="st" data-s="1"><i></i><span>Game assets</span></button>
      </span>
      <span class="ws__doc"></span>
      <button class="abtog" id="abtog"><i></i>Plan B · assets in the plan</button>
      <span class="ws__faces">${CREW.map((k) =>
        `<img src="assets/crew-${k}.webp" alt="${CREW_NAME[k]}" title="${CREW_NAME[k]} Wana">`).join('')}</span>
    </header>
    <div class="ws__main" id="main"></div>
    <footer class="ws__foot">
      <span class="ws__sum" id="sum"></span>
      <span class="ws__acts">
        <button class="b b--sec">Close</button>
        <button class="b b--go" id="go">Approve plan &amp; start build<i>↗</i></button>
      </span>
    </footer>`;
  (document.getElementById('panel-host') || document.getElementById('stage')).appendChild(w);
  document.getElementById('main').innerHTML =
    `<div class="page is-on" data-s="0">${stOverview()}</div>
     <div class="page" data-s="1">${stAssets()}</div>`;
  paintSum();
  wire();
  const go = document.getElementById('go');
  // in Plan B the same button walks to the assets step first
  if (go) go.onclick = () => {
    if (document.querySelector('.ws.is-planb') && step === 0) return goStep(1);
    window.__approve && window.__approve();
  };
  const close = document.querySelector('.b--sec');
  if (close) close.onclick = () => window.__closePanel && window.__closePanel();
}

// What pressing the button will actually do.
function paintSum() {
  const sc = P.scopes.find((x) => x[5]) || P.scopes[1];
  const el2 = document.getElementById('sum');
  if (!el2) return;
  // on the assets step the footer counts what the library is covering
  let assets = '';
  if (document.querySelector('.ws.is-planb') && step === 1) {
    const slots = [...document.querySelectorAll('.slot')];
    const n = document.querySelectorAll('.ass:not(.ass--later).is-on').length;
    const later = slots.length
      - slots.filter((x) => x.querySelector('.ass:not(.ass--later).is-on')).length;
    assets = ` · <b>${n} from the library</b>${later ? `, ${later} the Artist makes` : ''}`;
  }
  el2.innerHTML =
    `<b>${sc[3]}</b> · 5 Wanas on it${assets} · <b>${sc[4].split(' · ')[0]}</b>`
    + ` · playable in ${sc[4].split(' · ')[1]}`;
}

// Which page of the plan you are on. Plan A has one; Plan B has two.
function goStep(n) {
  step = n;
  document.querySelectorAll('.page').forEach((p) =>
    p.classList.toggle('is-on', +p.dataset.s === n));
  document.querySelectorAll('.st').forEach((b) =>
    b.classList.toggle('is-on', +b.dataset.s === n));
  const go = document.getElementById('go');
  const planb = !!document.querySelector('.ws.is-planb');
  go.innerHTML = (planb && n === 0)
    ? 'Next · game assets<i>→</i>' : 'Approve plan &amp; start build<i>↗</i>';
  document.querySelector('.ws__main').scrollTop = 0;
  paintSum();
}

// Every slot may take several models, or none at all — skipping one is a
// real answer, not a thing the plan refuses to move past.
function stAssets() {
  return `<div class="wide2">
    <header class="wide2__h">
      <b>Game assets</b>
      <p>Optional. Pick as many as you like for each part — anything you leave
        alone, the Artist makes during the build.</p>
    </header>
      ${SLOTS.map(([k, name, note, opts]) => `
        <div class="slot" data-k="${k}">
          <header class="slot__h">
            <span><b>${name}</b><em>${note}</em></span>
            <i class="slot__state">The Artist will make it</i>
          </header>
          <div class="slot__grid">
            ${opts.map(([n, tag, svg, on], i) => `
              <button class="ass${on ? ' is-on' : ''}" data-n="${n}" data-i="${i}">
                <span class="ass__art">${svg}<i class="ass__box"></i></span>
                <b>${n}</b>${tag ? `<em>${tag}</em>` : ''}
              </button>`).join('')}
            <button class="ass ass--later">
              <span class="ass__art ass__art--later">✦</span>
              <b>Generate later</b><em>The Artist makes it</em>
            </button>
          </div>
        </div>`).join('')}
  </div>`;
}

// ── 01 · Overview ─────────────────────────────────────────────────
function stOverview() {
  return `
    <div class="split">
      <section class="pane">
        <figure class="shot shot--art">
          <img src="assets/cover-${P.styles.find((x) => x[2])[0]}.jpg" alt="" id="cover">
          <button class="shot__retry">Retry cover</button>
        </figure>
      </section>
      <aside class="rail">
        ${card('GAME INFORMATION', `
          <label class="lbl">Game title</label>
          <input class="inp" value="${esc(P.title)}">
          <label class="lbl">Genre</label>
          ${genreField()}
          <label class="lbl">Core gameplay</label>
          <textarea class="ta ta--tall">${esc(P.promise)}</textarea>
          <label class="lbl">Player experience</label>
          <textarea class="ta">${esc(P.fantasy)}</textarea>`)}
        ${card('VISUAL STYLE', styleField())}
        ${card('BUILD SCOPE', `
          ${P.scopes.map(([k, n, d, what, cost, on]) => `
            <button class="scope${on ? ' is-on' : ''}" data-k="${k}">
              <span class="scope__hd">${ICON[k]}<b>${n}</b></span>
              <span class="scope__more"><span>${d}</span>
                <em>${what}<i>${cost}</i></em></span>
            </button>`).join('')}
          ${multi('Platform', P.platforms)}
          ${seg('Session length', P.length, 'len')}
          ${seg('Difficulty', P.difficulty, 'diff')}`)}
        ${advanced()}
      </aside>
    </div>`;
}

// ── Bits ──────────────────────────────────────────────────────────
// Genre sits where it shipped — second in Game information — but it opens
// into six marked options, and each explains itself only on hover.
function genreField() {
  const cur = P.genres.find((g) => g[3]) || P.genres[0];
  return `
    <div class="gpick" id="gpick">
      <button class="gpick__now" id="gpick-now">
        ${ICON[cur[0]]}<b>${cur[1]}</b><i class="chev"></i>
      </button>
      <div class="gpick__list">
        ${P.genres.map(([k, n, d, on]) => `
          <button class="gen${on ? ' is-on' : ''}" data-k="${k}" data-n="${n}">
            <span class="gen__hd">${ICON[k]}<b>${n}</b></span>
            <span class="gen__more">${d}</span>
          </button>`).join('')}
      </div>
    </div>`;
}

// One block for the look: the current profile, opening to the rest, with the
// quality tier as a strip underneath.
function styleField() {
  const cur = P.styles.find((x) => x[2]) || P.styles[0];
  return `
    <div class="spick" id="spick">
      <button class="spick__now" id="spick-now">
        <img src="assets/sty-${cur[0]}.jpg" alt="">
        <b>${cur[1]}</b><i class="chev"></i>
      </button>
      <div class="spick__list">
        ${P.styles.map(([k, n, on]) => `
          <button class="sty2${on ? ' is-on' : ''}" data-k="${k}" data-n="${n}">
            <img src="assets/sty-${k}.jpg" alt=""><span>${n}</span>
          </button>`).join('')}
      </div>
      <div class="qual">
        <span class="qual__k">Render quality</span>
        <div class="qual__row">
          ${P.quality.map(([n, on]) => `
            <button class="q${on ? ' is-on' : ''}">${n}</button>`).join('')}
        </div>
      </div>
    </div>`;
}

// Everything the page decides on your behalf, in one closed drawer, ordered by
// how much difference it makes. Shut by default: a first-timer never meets it.
function advanced() {
  const row = (n, inner) => `<div class="adv__i"><span class="adv__k">${n}</span>${inner}</div>`;
  return `
    <section class="sect adv" id="adv">
      <button class="sect__h adv__h" id="adv-h">
        <i class="h"></i>ADVANCED<span class="adv__n">7</span><i class="chev"></i>
      </button>
      <div class="sect__b adv__b">
        ${row('Notes for the crew',
          `<textarea class="ta" rows="2" placeholder="Anything the fields above do not cover…"></textarea>`)}
        ${row('Optional extras', P.extras.map(([n, on], i) => `
          <label class="ck"><input type="checkbox" ${on ? 'checked' : ''}><span>${n}</span></label>`).join(''))}
        ${row('Play pattern', P.pattern.map(([n, d, on]) => `
          <button class="pat${on ? ' is-on' : ''}"><b>${n}</b><em>${d}</em></button>`).join(''))}
        ${row('Tuning', `
          <p class="adv__p">Easier to judge after the first playtest — the crew picks sensible values until then.</p>
          ${P.knobs.map(([n, v, lo, hi, plain]) => `
            <label class="kn">
              <span class="kn__t">${n}<b>${plain ? v : v + '%'}</b></span>
              <input type="range" min="0" max="100" value="${plain ? v * 8 : v}">
              <span class="kn__e"><em>${lo}</em><em>${hi}</em></span>
            </label>`).join('')}`)}
        ${row('Camera feel', segRow(P.camera))}
        ${row('Library assets', `
          <label class="ck"><input type="checkbox"><span>Let the crew reuse assets from the library</span></label>
          <p class="adv__p">Off by default: the first build is made from scratch, and swapping in library
            assets happens afterwards in Assets, where you can see them in the game.</p>`)}
        ${row('What the crew will do', `
          ${P.crewWork.map(([n, d], i) => `
            <label class="ck ck--two"><input type="checkbox" checked>
              <span><b>${i + 1}. ${n}</b><em>${d}</em></span></label>`).join('')}
          <p class="adv__p">All four run by default. Switch one off and the crew skips it.</p>`)}
      </div>
    </section>`;
}
function segRow(opts) {
  return `<div class="seg__row">${opts.map(([n, d, on]) =>
    `<button class="sg${on ? ' is-on' : ''}" title="${d}">${n}</button>`).join('')}</div>`;
}

// Platform can be both at once, so it toggles rather than picks. One has to
// stay on — a build with no target is not a build.
function multi(label, opts) {
  return `
    <div class="seg" id="plat">
      <span class="seg__k">${label}</span>
      <div class="plats">
        ${opts.map(([n, k, on]) => `
          <button class="plat${on ? ' is-on' : ''}" data-k="${k}">
            <i class="box"></i>${n}
          </button>`).join('')}
      </div>
      <span class="seg__n" id="plat-note">Built for web and mobile</span>
    </div>`;
}

// A labelled strip of three, for the two questions a person actually has an
// opinion about. The engine numbers behind them are the crew's problem.
function seg(label, opts, key) {
  return `
    <div class="seg" data-seg="${key}">
      <span class="seg__k">${label}</span>
      <div class="seg__row">
        ${opts.map(([n, d, on]) => `
          <button class="sg${on ? ' is-on' : ''}" title="${d}">${n}</button>`).join('')}
      </div>
      <span class="seg__n">${(opts.find((o) => o[2]) || opts[0])[1]}</span>
    </div>`;
}

function card(title, inner) {
  return `<section class="sect">
    <header class="sect__h"><i class="h"></i>${title}</header>
    <div class="sect__b">${inner}</div>
  </section>`;
}
function wire() {
  const ab = document.getElementById('abtog');
  if (ab) ab.onclick = () => {
    const on = document.querySelector('.ws').classList.toggle('is-planb');
    ab.classList.toggle('is-on', on);
    goStep(0);                       // turning it off must not strand you on step 2
  };
  document.querySelectorAll('.st').forEach((b) =>
    b.onclick = () => goStep(+b.dataset.s));
  document.querySelectorAll('.slot').forEach((slot) => {
    const state = slot.querySelector('.slot__state');
    const later = slot.querySelector('.ass--later');
    const paint = () => {
      const n = slot.querySelectorAll('.ass:not(.ass--later).is-on').length;
      later.classList.toggle('is-on', n === 0);
      state.textContent = n === 0 ? 'The Artist will make it'
        : n === 1 ? '1 model from the library'
        : `${n} models from the library`;
      paintSum();
    };
    slot.querySelectorAll('.ass:not(.ass--later)').forEach((b) => {
      b.onclick = () => { b.classList.toggle('is-on'); paint(); };
    });
    // choosing "later" is the same as clearing the slot — never a dead end
    later.onclick = () => {
      slot.querySelectorAll('.ass.is-on').forEach((o) => o.classList.remove('is-on'));
      paint();
    };
    paint();
  });
  document.querySelectorAll('.pickcard').forEach((b) => {
    b.onclick = () => {
      const grp = b.parentElement;
      grp.querySelectorAll('.pickcard').forEach((o) => o.classList.remove('is-on'));
      b.classList.add('is-on');
    };
  });
  const styles = document.getElementById('styles');
  if (styles) {
    styles.querySelectorAll('.sty').forEach((b) => {
      b.onclick = () => {
        styles.querySelectorAll('.sty').forEach((o) => o.classList.remove('is-on'));
        b.classList.add('is-on');
        document.getElementById('pv').src = `assets/style-${b.dataset.k}.jpg`;
        const tip = document.getElementById('tip');
        tip.querySelector('b').textContent = b.dataset.n;
        tip.querySelectorAll('em')[0].textContent = b.dataset.n + ' (cel shading, ink outlines)';
      };
    });
  }
  const gp = document.getElementById('gpick');
  if (gp) {
    document.getElementById('gpick-now').onclick = () => gp.classList.toggle('is-open');
    gp.querySelectorAll('.gen').forEach((b) => {
      b.onclick = () => {
        gp.querySelectorAll('.gen').forEach((o) => o.classList.remove('is-on'));
        b.classList.add('is-on');
        const now = document.getElementById('gpick-now');
        now.innerHTML = b.querySelector('.gen__hd').innerHTML + '<i class="chev"></i>';
        gp.classList.remove('is-open');
      };
    });
  }
  const sp = document.getElementById('spick');
  if (sp) {
    document.getElementById('spick-now').onclick = () => sp.classList.toggle('is-open');
    sp.querySelectorAll('.sty2').forEach((b) => {
      b.onclick = () => {
        sp.querySelectorAll('.sty2').forEach((o) => o.classList.remove('is-on'));
        b.classList.add('is-on');
        const now = document.getElementById('spick-now');
        now.innerHTML = `<img src="assets/sty-${b.dataset.k}.jpg" alt=""><b>${b.dataset.n}</b><i class="chev"></i>`;
        const cover = document.getElementById('cover');
        if (cover) cover.src = `assets/cover-${b.dataset.k}.jpg`;
        sp.classList.remove('is-open');
      };
    });
    sp.querySelectorAll('.q').forEach((b) => {
      b.onclick = () => {
        sp.querySelectorAll('.q').forEach((o) => o.classList.remove('is-on'));
        b.classList.add('is-on');
      };
    });
  }
  const adv = document.getElementById('adv');
  if (adv) {
    document.getElementById('adv-h').onclick = () => adv.classList.toggle('is-open');
    adv.querySelectorAll('.adv__i').forEach((g) => {
      g.querySelectorAll('.pat, .sg').forEach((b) => {
        b.onclick = () => {
          const sel = b.classList.contains('pat') ? '.pat' : '.sg';
          b.parentElement.querySelectorAll(sel).forEach((o) => o.classList.remove('is-on'));
          b.classList.add('is-on');
        };
      });
      g.querySelectorAll('.kn input').forEach((r) => {
        const out = r.previousElementSibling.querySelector('b');
        r.addEventListener('input', () => { out.textContent = r.value + '%'; });
      });
    });
  }
  const plat = document.getElementById('plat');
  if (plat) {
    const note = document.getElementById('plat-note');
    plat.querySelectorAll('.plat').forEach((b) => {
      b.onclick = () => {
        const on = plat.querySelectorAll('.plat.is-on');
        if (b.classList.contains('is-on') && on.length === 1) return;   // keep one target
        b.classList.toggle('is-on');
        const picked = [...plat.querySelectorAll('.plat.is-on')].map((x) => x.dataset.k);
        note.textContent = 'Built for ' + (picked.length === 2 ? 'web and mobile' : picked[0]);
      };
    });
  }
  document.querySelectorAll('.seg:not(#plat)').forEach((g) => {
    const note = g.querySelector('.seg__n');
    g.querySelectorAll('.sg').forEach((b) => {
      b.onclick = () => {
        g.querySelectorAll('.sg').forEach((o) => o.classList.remove('is-on'));
        b.classList.add('is-on');
        note.textContent = b.title;
      };
    });
  });
  document.querySelectorAll('.scope').forEach((b) => {
    b.onclick = () => {
      b.parentElement.querySelectorAll('.scope').forEach((o) => o.classList.remove('is-on'));
      b.classList.add('is-on');
    };
  });
  document.querySelectorAll('.chip').forEach((c) => {
    c.onclick = () => {
      c.parentElement.querySelectorAll('.chip').forEach((o) => o.classList.remove('is-on'));
      c.classList.add('is-on');
    };
  });
}

window.mountPlanPanel = mount;
