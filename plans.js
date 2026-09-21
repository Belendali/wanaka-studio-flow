/* ──────────────────────────────────────────────────────────────────
   Three ways to show a plan: H, a cartridge charged from a dark tablet;
   E, a handheld console standing open on a desk; G, a cartridge and two
   sheets of notebook paper on a desk.

   The plan is the same in both, and so are its rules. The palette is
   fixed — neutral grey for the room, Wanaka lime for everything you can
   press or that marks a choice. Switching the cover changes the game,
   not the colours.
   ────────────────────────────────────────────────────────────────── */

const $ = (id) => document.getElementById(id);
const E = (t, c, h) => { const n = document.createElement(t);
  if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };

// ── The three plans we can show ───────────────────────────────────
const PLANS = {
  toy: {
    set: 'boy',
    cover: 'assets/boy.jpg',
    parts: [['The bedroom', ['Toy blocks', 'Book stacks', 'Dresser'], 0],
            ['Big toys', ['Basketball', 'Truck', 'Teddy'], -1],
            ['To collect', ['Stars', 'Baseballs', 'Pencils'], -1],
            ['The kid', ['Backpacker', 'Robot pal', 'Dino suit'], -1]],
    // bubble art for the asset page, cut from the cover
    partImg: (n) => `assets/boy-part-${slug(n)}.jpg`,
    form: { genre: 'adventure', style: 'default', quality: 'High', scope: 'standard',
            plat: ['web', 'mobile'], len: 1, diff: 1 },
    title: 'Tiny Explorer',
    sub: 'The Giant Bedroom',
    genre: 'Adventure',
    pitch: 'You are the size of a thumb. The bedroom is a country, '
         + 'and the hoop on the far shelf is the edge of the map.',
    doing: 'Cross a bedroom the size of a country — over the rug, up the blocks, '
         + 'past the truck — to the hoop on the far shelf.',
    feel: 'Small and brave, in a room that was built for someone much bigger.',
    style: 'Default', quality: 'High',
    rooms: '4 rooms', assets: '6 assets', mins: '~12 min',
    credits: '320–560', platform: 'Web + Mobile', length: '8–12 min a run',
    checks: ['He can run, climb and jump', 'Every shelf has a way down',
             'A fallen block can be climbed again', 'Reaching the hoop ends the run',
             'Runs at 60fps on a three-year-old phone', 'A new player finishes without help'],
  },
  horror: {
    set: 'cover',
    form: { genre: 'adventure', style: 'ink-wash', quality: 'Ultra', scope: 'standard',
            plat: ['web'], len: 2, diff: 1,
            what: 'Search the house by torchlight for what happened here. The batteries do not last.',
            feel: 'Watched. Cold where the lamp does not reach, and never quite alone.' },
    parts: [['The house', ['Terrace', 'Farmhouse', 'Flat'], 0],
            ['The toys', ['Dolls', 'Soldiers', 'Music box'], -1],
            ['What you find', ['Photos', 'Diary', 'Keys'], -1],
            ['Your light', ['Lantern', 'Torch', 'Candle'], -1]],
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
    set: 'cover',
    form: { genre: 'platformer', style: 'phosphor', quality: 'Medium', scope: 'ambitious',
            plat: ['web', 'mobile'], len: 0, diff: 2,
            what: 'Sprint a bedroom built of blocks and books, and grab every star before the light goes out.',
            feel: 'Fast and legible. You lose because you were greedy, and you know it.' },
    parts: [['The bedroom', ['Blocks', 'Books', 'Shelves'], 0],
            ['Hazards', ['Spikes', 'Toy cars', 'The cat'], -1],
            ['To collect', ['Stars', 'Candy', 'Coins'], -1],
            ['The runner', ['Pixel kid', 'Robot', 'Frog'], -1]],
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

// ── E · the handheld ──────────────────────────────────────────────
/* A clamshell standing open on a desk. It arrives shut, lands, and swings
   open around its hinge; both screens flicker on; the Planner drops onto
   the desk beside it. The left screen is the game and nothing else. The
   right one is the plan as a touch screen — the same fields and rules as
   G's notebook, wired by the same code. */
const ic = (d, extra = '') => `<svg class="ti" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="1.9" stroke-linecap="round"
  stroke-linejoin="round">${d}${extra}</svg>`;

function compE(p) {
  const f = p.form;
  const so = (label, v, on, title = '') =>
    `<button class="eo${on ? ' is-on' : ''}" data-v="${v}"${title ? ` title="${title}"` : ''}>${label}</button>`;
  const seg = (k, items) => `<span class="eseg" data-k="${k}">${items}</span>`;
  const dots = Array.from({ length: 12 }, () => '<i></i>').join('');
  return `
  <div class="room room--studio">
    <!-- no room of its own: the console arrives over the Studio, behind a scrim -->
    <img class="room__studio" src="assets/studio-bg.jpg" alt="">
    <span class="room__scrim"></span>

    <!-- behind the console: the light that spills out as it opens -->
    <span class="con__light" aria-hidden="true"><i class="con__rays"></i></span>
    <div class="con" id="con">
      <img class="con__paw" src="assets/paw.png" alt="" aria-hidden="true">
      <div class="con__body">
        <!-- the half that stays on the desk: the plan, and the buttons -->
        <section class="con__half con__base">
          <div class="con__glass">
            <div class="ts" id="ts" data-step="1">
              <header class="ts__top">
                <button class="ts__tab is-on" data-step="1"><b>1</b>Plan</button>
                <button class="ts__tab" data-step="2"><b>2</b>Assets</button>
                <span class="ts__bat"></span>
              </header>
              <div class="ts__pages">
                <section class="ts__page is-on" data-page="1">
                  <input class="ts__name" data-need value="${p.title}" placeholder="Name your game" spellcheck="false">
                  <div class="tr"><span class="tr__k">Genre</span>
                    <button class="ep" data-slip="genre"><span class="ep__v" data-val>${genreV(f.genre)}</span><i class="ep__c">▾</i></button>
                  </div>
                  <label class="tf"><span class="tr__k">What you do</span>
                    <textarea data-need rows="2" spellcheck="false" placeholder="What does the player do?">${f.what || p.doing}</textarea>
                  </label>
                  <label class="tf"><span class="tr__k">How it feels</span>
                    <textarea rows="2" spellcheck="false" placeholder="What should it feel like?">${f.feel || p.feel}</textarea>
                  </label>
                  <div class="tr"><span class="tr__k">Look</span>
                    <button class="ep ep--look" data-slip="look"><span class="ep__v" data-val>${lookV(p, f.style, f.quality)}</span><i class="ep__c">▾</i></button>
                  </div>
                  <div class="tr"><span class="tr__k">Scope</span>
                    ${seg('scope', F.scopes.map(([k, n, w, cr, t]) => so(n, k, k === f.scope, `${w} · ${cr} · ${t}`)).join(''))}
                  </div>
                  <div class="tr"><span class="tr__k">Plays on</span>
                    <span class="emulti" data-multi>${[['Web', 'web'], ['Mobile', 'mobile']].map(([n, k]) =>
                      `<button class="eck${f.plat.includes(k) ? ' is-on' : ''}" data-v="${k}"><i></i>${n}</button>`).join('')}</span>
                  </div>
                  <div class="tr"><span class="tr__k">A run</span>
                    ${seg('len', F.length.map((n, i) => so(n, i, i === f.len)).join(''))}
                  </div>
                  <div class="tr"><span class="tr__k">Difficulty</span>
                    ${seg('diff', F.difficulty.map((n, i) => so(n, i, i === f.diff)).join(''))}
                  </div>
                </section>
                <section class="ts__page ts__page--parts" data-page="2">
                  <div class="elib elib--ts" id="elibTs"></div>
                </section>
              </div>
              <footer class="ts__foot">
                <span class="ts__sum"><b data-sum>${sumV(f.scope)}</b><em data-count></em></span>
                <button class="ts__go" id="tsgo">Next · Assets<i class="kb">A</i></button>
              </footer>

              <div class="eslip eslip--genre" data-slipbox="genre" hidden>
                ${F.genres.map(([k, n]) =>
                  `<button class="eslip__g${k === f.genre ? ' is-on' : ''}" data-g="${k}">${GICON[k]}${n}</button>`).join('')}
              </div>
              <div class="eslip eslip--look" data-slipbox="look" hidden>
                <div class="eslip__grid">${F.styles.map(([k, n]) =>
                  `<button class="eslip__s${k === f.style ? ' is-on' : ''}" data-s="${k}"><img src="${thumb(p, k)}" alt=""><span>${n}</span></button>`).join('')}</div>
                <div class="eslip__q">${F.quality.map((q) =>
                  `<button class="eo${q === f.quality ? ' is-on' : ''}" data-q="${q}">${q}</button>`).join('')}</div>
              </div>
            </div>
          </div>
          <div class="con__ctrl">
            <span class="con__dpad">
              <button class="con__pad con__pad--up" data-pad="up" aria-label="Scroll up"></button>
              <button class="con__pad con__pad--left" data-pad="left" aria-label="Step 1"></button>
              <button class="con__pad con__pad--right" data-pad="right" aria-label="Step 2"></button>
              <button class="con__pad con__pad--down" data-pad="down" aria-label="Scroll down"></button>
            </span>
            <span class="con__abxy">
              <button data-key="x" title="X · look">X</button>
              <button data-key="y" title="Y · genre">Y</button>
              <button data-key="a" title="A · next / approve">A</button>
              <button data-key="b" title="B · back">B</button>
            </span>
            <span class="con__legend">A next<br>B back</span>
            <span class="con__sys">
              <button data-key="select" title="Select · next look"></button>
              <button data-key="start" title="Start · next / approve"></button>
            </span>
            <span class="con__grille">${dots}</span>
            <span class="con__led"></span>
          </div>
        </section>

        <span class="con__hinge" aria-hidden="true"><i></i><i></i></span>

        <!-- the lid: swings open around the hinge, the game on its face -->
        <section class="con__lid">
          <div class="con__face">
            <div class="con__glass con__glass--game">
              <img id="congame" src="${p.cover}" alt="">
              <!-- step 2: the parts on this screen, their models on the touch screen -->
              <div class="elib elib--parts" id="elib">
                <header class="eparts__h"><b>Assets</b><em>Pick a part, then its models on the right. Leave a part alone and the Artist makes it.</em></header>
                <div class="eslots">
                  ${p.parts.map(([name], i) => `
                    <button class="eslot${i === 0 ? ' is-sel' : ''}" data-slot="${i}">
                      <span class="eslot__t"><b>${name}</b><em data-st></em></span>
                      <span class="eslot__picks" data-picks></span>
                      <i class="eslot__go"></i>
                    </button>`).join('')}
                </div>
              </div>
              <!-- the loading screen: once as the lid opens, again when the plan is approved -->
              <div class="cload" aria-hidden="true">
                <span class="cload__icon"><img src="assets/wanaka-icon.png" alt=""><i></i></span>
                <span class="cload__word"></span>
                <span class="cload__bar">${Array.from({ length: 14 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</span>
                <span class="cload__cap"><b data-cap>Opening your plan</b><em class="cload__pct"></em></span>
              </div>
              <span class="con__scan"></span>
              <span class="con__sweep"></span>
            </div>
          </div>
          <div class="con__back">
            <!-- the Wanaka badge stands proud of the lid; the name is cut into it -->
            <span class="lid__badge"><img src="assets/wanaka-icon.png" alt=""></span>
            <span class="lid__word" aria-label="Wanaka"></span>
            <span class="lid__screw lid__screw--a"></span><span class="lid__screw lid__screw--b"></span>
          </div>
        </section>
      </div>
      <span class="con__shadow"></span>
    </div>

    <button class="pcat" id="pcat" title="Planner Wana">
      <span class="pcat__shadow"></span>
      <img src="assets/crew-planner.webp" alt="Planner Wana">
    </button>

    <button class="replay" id="replay">↻ Replay</button>
  </div>`;
}

// ── G · the desk ──────────────────────────────────────────────────
/* A cartridge rises out of the bottom of the screen with the cover in its
   window; two sheets of notebook paper fly in from the top right and land
   on a desk. Page 1 is the plan, page 2 is the assets. Turning the page
   slides sheet 1 out and tucks it under sheet 2, the way you would on a
   real desk. Everything on the paper sits on the ruled lines: sizes are
   all multiples of one line height, and the line height is the page
   height / 20, so it scales with the screen and never drifts off. */

const F = {
  genres: [['adventure', 'Adventure'], ['platformer', 'Platformer'], ['puzzle', 'Puzzle'],
           ['collect', 'Collectathon'], ['racing', 'Racing'], ['action', 'Action']],
  styles: [['default', 'Default'], ['realistic', 'Realistic'], ['toon', 'Stylized Toon'],
           ['graphic-ink', 'Graphic Ink'], ['ink-wash', 'Ink Wash'], ['pixel', 'Pixel Screen'],
           ['crosshatch', 'Crosshatch'], ['one-bit', 'One-Bit'], ['phosphor', 'Phosphor'],
           ['retro-warm', 'Retro Warm'], ['horror', 'Horror']],
  quality: ['Low', 'Medium', 'High', 'Ultra', 'Cinematic'],
  scopes: [['slice', 'Slice', '1 room · 3 assets', '180–260 cr', '~6 min'],
           ['standard', 'Standard', '4 rooms · 6 assets', '320–560 cr', '~12 min'],
           ['ambitious', 'Ambitious', '7 rooms · 11 assets', '640–980 cr', '~25 min']],
  length: ['3–5 min', '8–12 min', '15–20 min'],
  difficulty: ['Gentle', 'Normal', 'Tough'],
  genreSub: {
    adventure: 'Explore a world and find your way', platformer: 'Jump, land and time your moves',
    puzzle: 'Work it out, then pull it off', collect: 'Sweep a place clean of things worth having',
    racing: 'Get there first, or beat the clock', action: 'React fast and stay alive',
  },
  lengthSub: ['Fast retries, quick payoff', 'Room for mastery and an arc', 'A longer run with varied beats'],
  diffSub: ['Forgiving, few hazards', 'Fair, with room to fail', 'Tight timing, real pressure'],
};
const GICON = {
  adventure: ic('<path d="M3 18l5-11 5 8 3-5 5 8z"/>'),
  platformer: ic('<path d="M3 19h5v-5h5v-5h5V5h3"/>'),
  puzzle: ic('<path d="M5 9h3.5a2 2 0 1 1 4 0H16v3.5a2 2 0 1 0 0 4V20H5z"/>'),
  collect: ic('<path d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z"/>'),
  racing: ic('<path d="M5 21V4m0 1h12l-2 4 2 4H5"/>'),
  action: ic('<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>'),
};
// each cover has its own set of style renders
const full = (p, k) => (p.set === 'boy' ? `assets/boy-${k}.jpg` : `assets/cover-${k}.jpg`);
const thumb = (p, k) => (p.set === 'boy' ? `assets/boy-sty-${k}.jpg` : `assets/sty-${k}.jpg`);
const opt = (label, v, on, title = '') =>
  `<button class="o${on ? ' is-on' : ''}" data-v="${v}"${title ? ` title="${title}"` : ''}><i class="rd"></i>${label}</button>`;
const genreV = (k) => {
  const g = F.genres.find((x) => x[0] === k) || F.genres[0];
  return `${GICON[g[0]]}${g[1]}`;
};
const lookV = (p, k, q) => {
  const st = F.styles.find((x) => x[0] === k) || F.styles[0];
  return `<img src="${thumb(p, k)}" alt="">${st[1]} · ${q}`;
};
const sumV = (k) => {
  const sc = F.scopes.find((x) => x[0] === k) || F.scopes[1];
  return `${sc[2].split(' · ')[0]} · ${sc[3]}`;
};

const CART = 'M16 0H298L324 26V184Q324 200 308 200H16Q0 200 0 184V16Q0 0 16 0Z';
const RIM = 'M19 6H295L318 29V181Q318 194 305 194H19Q6 194 6 181V19Q6 6 19 6Z';
const CLIP = 'M12 30V86a9 9 0 0 0 18 0V16a13 13 0 0 0 -26 0V92a17 17 0 0 0 34 0V28';

// The cartridge G and H share. H asks for the contacts its current arcs into.
const SHAPES = {
  wide: { vb: '0 0 324 200', cart: CART, rim: RIM, grip: 'M258 11h18M258 15.5h18M258 20h18',
          pinX: 310, pinY: 60, pinStep: 12, pins: 9, cls: '' },
  '4:3': { vb: '0 0 300 225', cart: 'M15 0H276L300 24V210Q300 225 285 225H15Q0 225 0 210V15Q0 0 15 0Z',
           rim: 'M18 6H273L294 27V207Q294 219 282 219H18Q6 219 6 207V18Q6 6 18 6Z',
           grip: 'M236 11h18M236 15.5h18M236 20h18', pinX: 286, pinY: 62, pinStep: 13, pins: 10, cls: ' cart--43' },
};
const pinRow = (g) => `<g class="pins">${Array.from({ length: g.pins }, (_, i) =>
  `<rect x="${g.pinX}" y="${g.pinY + i * g.pinStep}" width="8" height="8" rx="1.6"/>`).join('')}</g>`;
function cartridge(p, { pins = false, shape = 'wide' } = {}) {
  const g = SHAPES[shape];
  const layers = [9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) =>
    `<svg class="cart__layer" style="--z:${-n * 2.9}px;fill:hsl(230 6% ${4 + (9 - n) * 1.6}%)"
      viewBox="${g.vb}"><path d="${g.cart}"/></svg>`).join('');
  return `
    <!-- left · the cartridge -->
    <div class="cartcol" id="cartcol">
      <div class="cart__rise">
        <div class="cart__float">
          <div class="cart${g.cls}" id="cart">
            ${layers}
            <div class="cart__face">
              <svg class="cart__svg" viewBox="${g.vb}" aria-hidden="true">
                <defs><linearGradient id="cartg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#46474D"/><stop offset=".55" stop-color="#2B2C31"/>
                  <stop offset="1" stop-color="#1C1D21"/></linearGradient></defs>
                <path d="${g.cart}" fill="url(#cartg)"/>
                <path d="${g.rim}" fill="none" stroke="rgba(255,255,255,.17)" stroke-width="1.2"/>
                <path d="${g.grip}" stroke="rgba(255,255,255,.24)"
                      stroke-width="1.6" stroke-linecap="round"/>
                ${pins ? pinRow(g) : ''}
              </svg>
              <span class="cart__lab" id="cartlab"><i></i>Game Cartridge</span>
              <div class="cart__win">
                <img src="${p.cover}" alt="">
                <span class="cart__sheen"></span>
              </div>
              <span class="cart__sweep"></span>
              <span class="cart__zap"></span>
            </div>
          </div>
        </div>
        <span class="cart__shadow"></span>
      </div>
    </div>
`;
}

function compG(p) {
  const ck = (label, on) =>
    `<button class="ck${on ? ' is-on' : ''}" data-po><i></i>${label}</button>`;
  const later = (on) =>
    `<button class="ck ck--later${on ? ' is-on' : ''}" data-later>✦ Artist</button>`;
  const f = p.form;
  const faces = CREW.map(([k]) => `<img src="assets/crew-${k}.webp" alt="">`).join('');

  return `
  <div class="desk">
    <span class="desk__lamp"></span>

    ${cartridge(p)}

    <!-- right · two sheets of notebook paper -->
    <div class="stackcol">
      <div class="stack" id="stack">
        <span class="sheet sheet--lav"><span class="fill"></span></span>
        <span class="sheet sheet--blue"><span class="fill"></span></span>

        <article class="sheet sheet--note sheet--2">
          <div class="note">
            <div class="n__row"><span class="n__pg">p.2 / 2</span><span class="n__tag">Assets</span></div>
            <h2 class="n__title">Game assets</h2>
            <p class="n__hint">Tick any. Skip a line and the Artist makes it.</p>
            <div class="n__parts">
              ${p.parts.map(([name, opts, pick]) => `
                <p class="part" data-part><b>${name}</b>${opts.map((o, i) => ck(o, i === pick)).join('')}${later(pick < 0)}</p>`).join('')}
            </div>
            <footer class="n__foot">
              <button class="pgbtn pgbtn--back" data-go="1">← page 1</button>
              <span class="n__count" id="count" data-count></span>
            </footer>
            <button class="stamp" id="stamp">Approve</button>
            <span class="inked">Approved</span>
          </div>
        </article>

        <article class="sheet sheet--note sheet--1">
          <div class="note">
            <div class="n__row"><span class="n__pg">p.1 / 2</span><span class="n__tag">The plan</span>
              <span class="n__try">✎ tap to edit</span></div>
            <div class="f-tw">
              <input class="n__title f-title" data-need value="${p.title}" placeholder="Name your game" spellcheck="false">
              <i class="pen">✎</i>
            </div>
            <div class="fl"><span class="fl__k">Genre</span>
              <button class="pick" data-slip="genre"><span class="pick__v" id="g-genre" data-val>${genreV(f.genre)}</span><i class="chev">▾</i></button>
            </div>
            <div class="fta"><span class="fl__k">What you do</span><i class="pen">✎</i>
              <textarea class="ta f-what" data-need spellcheck="false" placeholder="What does the player do?">${f.what || p.doing}</textarea>
            </div>
            <div class="fta"><span class="fl__k">How it feels</span><i class="pen">✎</i>
              <textarea class="ta f-feel" spellcheck="false" placeholder="What should it feel like?">${f.feel || p.feel}</textarea>
            </div>
            <div class="fl"><span class="fl__k">Look</span>
              <button class="pick" data-slip="look"><span class="pick__v" id="g-look" data-val>${lookV(p, f.style, f.quality)}</span><i class="chev">▾</i></button>
            </div>
            <div class="fl"><span class="fl__k">Scope</span>
              <span class="opts" data-k="scope">${F.scopes.map(([k, n, what, cr, t]) =>
                opt(n, k, k === f.scope, `${what} · ${cr} · ${t}`)).join('')}</span>
            </div>
            <div class="fl"><span class="fl__k">Plays on</span>
              <span class="opts opts--multi" data-multi>${[['Web', 'web'], ['Mobile', 'mobile']].map(([n, k]) =>
                `<button class="ck${f.plat.includes(k) ? ' is-on' : ''}" data-v="${k}"><i></i>${n}</button>`).join('')}</span>
            </div>
            <div class="fl"><span class="fl__k">A run</span>
              <span class="opts" data-k="len">${F.length.map((n, i) => opt(n, i, i === f.len)).join('')}</span>
            </div>
            <div class="fl"><span class="fl__k">Difficulty</span>
              <span class="opts" data-k="diff">${F.difficulty.map((n, i) => opt(n, i, i === f.diff)).join('')}</span>
            </div>
            <footer class="n__foot">
              <span class="n__faces">${faces}</span>
              <em id="g-sum" data-sum>${sumV(f.scope)}</em>
              <button class="pgbtn pgbtn--cta" data-go="2">page 2 →</button>
            </footer>

            <div class="slip slip--genre" id="slip-genre" data-slipbox="genre" hidden>
              ${F.genres.map(([k, n]) =>
                `<button class="slip__g${k === f.genre ? ' is-on' : ''}" data-g="${k}">${GICON[k]}${n}</button>`).join('')}
            </div>
            <div class="slip slip--look" id="slip-look" data-slipbox="look" hidden>
              <div class="slip__grid">${F.styles.map(([k, n]) =>
                `<button class="slip__s${k === f.style ? ' is-on' : ''}" data-s="${k}"><img src="${thumb(p, k)}" alt=""><span>${n}</span></button>`).join('')}</div>
              <div class="slip__q"><em>Quality</em>${F.quality.map((q) =>
                `<button class="o${q === f.quality ? ' is-on' : ''}" data-q="${q}">${q}</button>`).join('')}</div>
            </div>
          </div>
        </article>

        <svg class="pclip" viewBox="0 0 42 112" aria-hidden="true">
          <path d="${CLIP}" fill="none" stroke="#A9683F" stroke-width="4.4" stroke-linecap="round"/>
          <path d="${CLIP}" fill="none" stroke="#EBB590" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
    </div>

    <span class="desk__vig"></span>
    <button class="replay" id="replay">↻ Replay</button>
  </div>`;
}

// ── Shared by E and G: the form, the asset rows, the required fields ──
// pickers that open a slip, pick-one groups, and the platform ticks
function wireForm(p, root, onLook) {
  const f = { ...p.form };
  const box = (k) => root.querySelector(`[data-slipbox="${k}"]`);
  const val = (k) => root.querySelector(`[data-slip="${k}"] [data-val]`);
  const close = () => root.querySelectorAll('[data-slipbox]').forEach((x) => { x.hidden = true; });

  root.querySelectorAll('[data-slip]').forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      const slip = box(b.dataset.slip);
      const wasShut = slip.hidden;
      close();
      slip.hidden = !wasShut;
    };
  });
  root.addEventListener('click', (e) => {
    if (!e.target.closest('[data-slipbox]') && !e.target.closest('[data-slip]')) close();
  });

  box('genre').querySelectorAll('[data-g]').forEach((b) => {
    b.onclick = () => {
      f.genre = b.dataset.g;
      box('genre').querySelectorAll('[data-g]').forEach((x) => x.classList.toggle('is-on', x === b));
      val('genre').innerHTML = genreV(f.genre);
      close();
    };
  });
  // choosing a look re-renders the game in that style and re-lights the room
  box('look').querySelectorAll('[data-s]').forEach((b) => {
    b.onclick = () => {
      f.style = b.dataset.s;
      box('look').querySelectorAll('[data-s]').forEach((x) => x.classList.toggle('is-on', x === b));
      val('look').innerHTML = lookV(p, f.style, f.quality);
      onLook(full(p, f.style));
    };
  });
  box('look').querySelectorAll('[data-q]').forEach((b) => {
    b.onclick = () => {
      f.quality = b.dataset.q;
      box('look').querySelectorAll('[data-q]').forEach((x) => x.classList.toggle('is-on', x === b));
      val('look').innerHTML = lookV(p, f.style, f.quality);
    };
  });

  root.querySelectorAll('[data-k]').forEach((g) => {
    g.querySelectorAll('[data-v]').forEach((o) => {
      o.onclick = () => {
        g.querySelectorAll('[data-v]').forEach((x) => x.classList.toggle('is-on', x === o));
        const sum = root.querySelector('[data-sum]');
        if (g.dataset.k === 'scope' && sum) sum.textContent = sumV(o.dataset.v);
      };
    });
  });

  // a game has to ship somewhere: the last platform will not untick
  root.querySelectorAll('[data-multi] [data-v]').forEach((c) => {
    c.onclick = () => {
      const on = root.querySelectorAll('[data-multi] [data-v].is-on').length;
      if (c.classList.contains('is-on') && on === 1) {
        c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake');
        return;
      }
      c.classList.toggle('is-on');
    };
  });
}

// several per row, or leave it to the Artist — which is the same as clearing it
function wireAssets(root) {
  const count = () => {
    const parts = [...root.querySelectorAll('[data-part]')];
    const picked = root.querySelectorAll('[data-po].is-on').length;
    const left = parts.filter((x) => !x.querySelector('[data-po].is-on')).length;
    const c = root.querySelector('[data-count]');
    if (c) c.textContent = `${picked} picked · ${left} left to the Artist`;
  };
  root.querySelectorAll('[data-part]').forEach((part) => {
    const later = part.querySelector('[data-later]');
    part.querySelectorAll('[data-po]').forEach((c) => {
      c.onclick = () => {
        c.classList.toggle('is-on');
        later.classList.toggle('is-on', !part.querySelector('[data-po].is-on'));
        count();
      };
    });
    later.onclick = () => {
      part.querySelectorAll('[data-po]').forEach((c) => c.classList.remove('is-on'));
      later.classList.add('is-on');
      count();
    };
  });
  count();
}

// a name and what the player does are the two things the crew cannot guess
function needWatch(root) {
  root.querySelectorAll('[data-need]').forEach((x) =>
    x.addEventListener('input', () => x.classList.remove('is-missing')));
}
function formCheck(root, btn) {
  const need = [...root.querySelectorAll('[data-need]')];
  const miss = need.filter((x) => !x.value.trim());
  need.forEach((x) => x.classList.toggle('is-missing', miss.includes(x)));
  if (miss.length) {
    btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake');
    miss[0].focus();
  }
  return !miss.length;
}

function wireG(p) {
  const stack = $('stack');
  const page1 = stack.querySelector('.sheet--1 .note');
  needWatch(page1);
  const turn = (n) => {
    if (n === 2 && !formCheck(page1, page1.querySelector('[data-go="2"]'))) return;
    stack.classList.remove(n === 2 ? 'is-back' : 'is-p2');
    void stack.offsetWidth;                  // restart the keyframes
    stack.classList.add(n === 2 ? 'is-p2' : 'is-back');
  };
  stack.querySelectorAll('[data-go]').forEach((b) => { b.onclick = () => turn(+b.dataset.go); });
  wireAssets(stack.querySelector('.sheet--2 .note'));

  $('stamp').onclick = () => {
    stack.classList.add('is-approved');
    const rise = document.querySelector('.cart__rise');
    rise.classList.remove('is-pop'); void rise.offsetWidth; rise.classList.add('is-pop');
    setTimeout(() => {
      $('cart').classList.add('is-loaded');
      $('cartlab').innerHTML = '<i></i>Loaded · building v1';
    }, 240);
  };

  // the cartridge leans toward the pointer
  const col = $('cartcol'), cart = $('cart');
  col.onmousemove = (e) => {
    const r = col.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    cart.style.setProperty('--ry', `${-18 + x * 24}deg`);
    cart.style.setProperty('--rx', `${9 - y * 16}deg`);
    cart.style.setProperty('--mx', `${50 - x * 90}%`);
  };
  col.onmouseleave = () => ['--ry', '--rx', '--mx'].forEach((v) => cart.style.removeProperty(v));

  $('replay').onclick = paint;
  wireForm(p, page1, (src) => { document.querySelector('.cart__win img').src = src; });
}

function wireE(p) {
  const ts = $('ts');
  const con = $('con');
  const go = $('tsgo');
  const page1 = ts.querySelector('[data-page="1"]');
  needWatch(page1);

  const key = (k) => con.querySelector(`[data-key="${k}"]`);
  const pad = con.querySelector('.con__dpad');
  const press = (el) => {
    if (!el) return;
    el.classList.add('is-down');
    setTimeout(() => el.classList.remove('is-down'), 170);
  };
  const tip = (d) => {
    pad.classList.add('is-' + d);
    setTimeout(() => pad.classList.remove('is-' + d), 170);
  };

  const step = (n) => {
    if (n === 2 && !formCheck(page1, go)) return;
    ts.dataset.step = n;
    ts.querySelectorAll('.ts__tab').forEach((t) => t.classList.toggle('is-on', +t.dataset.step === n));
    ts.querySelectorAll('.ts__page').forEach((pg) => pg.classList.toggle('is-on', +pg.dataset.page === n));
    con.classList.toggle('is-lib', n === 2 && !con.classList.contains('is-approved') && !con.classList.contains('is-loading'));
    if (!con.classList.contains('is-approved')) {
      go.innerHTML = n === 1 ? 'Next · Assets<i class="kb">A</i>' : 'Approve<i class="kb">A</i>';
    }
  };
  ts.querySelectorAll('.ts__tab').forEach((t) => { t.onclick = () => step(+t.dataset.step); });

  const cat = $('pcat');
  const hop = () => { cat.classList.remove('is-hop'); void cat.offsetWidth; cat.classList.add('is-hop'); };
  go.onclick = () => {
    press(key('a'));
    if (ts.dataset.step === '1') { step(2); return; }
    if (con.classList.contains('is-approved')) return;
    // approving loads the build on the top screen, then the game comes up
    go.disabled = true;
    go.innerHTML = 'Loading…';
    con.querySelector('[data-cap]').textContent = 'Loading v1';
    con.classList.remove('is-lib');
    con.classList.add('is-loading');
    setTimeout(() => {
      con.classList.remove('is-loading');
      con.classList.add('is-approved');
      go.innerHTML = 'Approved ✓';
      hop();
    }, 2500);
  };
  cat.onclick = hop;

  // the console's own buttons drive the screen
  const openSlip = () => ts.querySelector('[data-slipbox]:not([hidden])');
  const act = {
    a: () => go.click(),
    start: () => go.click(),
    b: () => {
      const s = openSlip();
      if (s) { s.hidden = true; return; }
      if (ts.dataset.step === '2') step(1);
    },
    x: () => ts.querySelector('[data-slip="look"]').click(),
    y: () => ts.querySelector('[data-slip="genre"]').click(),
    select: () => {                            // flick through the looks
      const all = [...ts.querySelectorAll('[data-slipbox="look"] [data-s]')];
      const at = all.findIndex((x) => x.classList.contains('is-on'));
      all[(at + 1) % all.length].click();
    },
  };
  Object.keys(act).forEach((k) => {
    const el = key(k);
    el.onclick = (e) => { e.stopPropagation(); press(el); act[k](); };
  });
  const page = () => ts.querySelector('.ts__page.is-on');
  const dir = {
    left: () => step(1),
    right: () => step(2),
    up: () => (ts.dataset.step === '2' ? con.__slot(-1) : page().scrollBy({ top: -70, behavior: 'smooth' })),
    down: () => (ts.dataset.step === '2' ? con.__slot(1) : page().scrollBy({ top: 70, behavior: 'smooth' })),
  };
  pad.querySelectorAll('[data-pad]').forEach((b) => {
    b.onclick = () => { tip(b.dataset.pad); dir[b.dataset.pad](); };
  });

  // and so does the keyboard, unless you are typing
  if (window.__eKeys) document.removeEventListener('keydown', window.__eKeys);
  window.__eKeys = (e) => {
    if (which !== 'e' || !document.getElementById('ts')) return;
    const typing = /INPUT|TEXTAREA/.test((document.activeElement || {}).tagName || '');
    if (typing) { if (e.key === 'Escape') document.activeElement.blur(); return; }
    const m = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }[e.key];
    if (m) { e.preventDefault(); pad.querySelector(`[data-pad="${m}"]`).click(); return; }
    if (e.key === 'Enter') { e.preventDefault(); key('a').click(); }
    if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); key('b').click(); }
  };
  document.addEventListener('keydown', window.__eKeys);

  // the body turns a little toward the pointer — but holds still while you use the screen
  const room = document.querySelector('.room');
  const body = document.querySelector('.con__body');
  room.onmousemove = (e) => {
    if (e.target.closest('.ts')) return;
    const r = room.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    body.style.setProperty('--ry', `${x * 7}deg`);
    body.style.setProperty('--rx', `${10 - y * 5}deg`);
  };
  room.onmouseleave = () => ['--ry', '--rx'].forEach((v) => body.style.removeProperty(v));

  wireLibrary(p, ts, con);
  wireForm(p, ts, (src) => { $('congame').src = src; });
  $('replay').onclick = paint;
}

// ── E's library: the top screen shows the models for the part picked below ──
/* Four the Artist puts forward, the rest of the shelf behind them, and a few
   that only a search turns up. Picking is multi-select; a part with nothing
   picked is left to the Artist — that is an answer, not a gap. */
/* Each model names the render it shows, so a thumbnail never lies about its name. */
const SHELF = {
  'The bedroom': [
    [['Block castle', 'toy-blocks'], ['Reading nook', 'book-stacks'], ['Toy chest', 'dresser'], ['Hoop corner', 'basketball'],
      ['Toy garage', 'truck'], ['Plush pile', 'teddy'], ['Star mobile', 'stars'], ['Pencil desk', 'pencils'],
      ['Robot shelf', 'robot-pal'], ['Dino rug', 'dino-suit'], ['Ball bin', 'baseballs']],
    [['Alphabet blocks', 'toy-blocks'], ['Block tower', 'toy-blocks'], ['Bookcase', 'book-stacks'], ['Storybook pile', 'book-stacks'], ['Tall dresser', 'dresser']]],
  'Big toys': [
    [['Beach ball', 'basketball'], ['Fire truck', 'truck'], ['Stuffed bear', 'teddy'], ['Toy robot', 'robot-pal'],
      ['Toy dino', 'dino-suit'], ['Block tower', 'toy-blocks'], ['Giant crayons', 'pencils'], ['Bouncy ball', 'baseballs'],
      ['Pop-up book', 'book-stacks'], ['Toy cabinet', 'dresser'], ['Star pillow', 'stars']],
    [['Dump truck', 'truck'], ['Toy crane', 'truck'], ['Plush bunny', 'teddy'], ['Wind-up bear', 'teddy'], ['Kickball', 'basketball']]],
  'To collect': [
    [['Gold coins', 'stars'], ['Crayons', 'pencils'], ['Marbles', 'baseballs'], ['Mini blocks', 'toy-blocks'],
      ['Tiny books', 'book-stacks'], ['Mini trucks', 'truck'], ['Gummy bears', 'teddy'], ['Robot bolts', 'robot-pal'],
      ['Dino eggs', 'dino-suit'], ['Hoop tokens', 'basketball'], ['Drawer keys', 'dresser']],
    [['Gold stars', 'stars'], ['Glitter stars', 'stars'], ['Star badges', 'stars'], ['Paper stars', 'stars'], ['Star beads', 'stars']]],
  'The kid': [
    [['Robot suit', 'robot-pal'], ['Dino hoodie', 'dino-suit'], ['Hoop star', 'basketball'], ['Little trucker', 'truck'],
      ['Bear onesie', 'teddy'], ['Bookworm', 'book-stacks'], ['Little artist', 'pencils'], ['Star captain', 'stars'],
      ['Block builder', 'toy-blocks'], ['Slugger', 'baseballs'], ['Sleepwalker', 'dresser']],
    [['Hiker kid', 'backpacker'], ['Camp kid', 'backpacker'], ['Map reader', 'backpacker'], ['Trail scout', 'backpacker'], ['Tiny backpacker', 'backpacker']]],
};
function wireLibrary(p, ts, con) {
  const lib = $('elibTs');
  const slots = [...con.querySelectorAll('.eslot')];
  const picked = p.parts.map(([, opts, pick]) => new Set(pick >= 0 ? [opts[pick]] : []));
  let sel = 0;
  const img = (n, key) => (!p.partImg ? '' : key ? `assets/boy-part-${key}.jpg` : p.partImg(n));
  const models = (i) => {
    const [name, opts] = p.parts[i];
    const [more, deep] = SHELF[name] || [[], []];
    return [...opts.map((n) => [n, '', 'pick']), ...more.map(([n, k]) => [n, k, '']), ...deep.map(([n, k]) => [n, k, 'deep'])]
      .map(([n, key, kind]) => ({ n, kind, src: img(n, key) }));
  };
  const card = (m) => `
    <button class="lcard" data-n="${m.n}"${m.kind === 'deep' ? ' data-deep hidden' : ''}>
      <span class="lcard__art">${m.src ? `<img src="${m.src}" alt="">` : `<b>${m.n[0]}</b>`}<i class="lcard__box"></i></span>
      <span class="lcard__n">${m.n}</span>${m.kind === 'pick' ? '<em>Artist’s pick</em>' : ''}
    </button>`;
  const paintRows = () => {
    slots.forEach((b, i) => {
      const set = picked[i];
      b.classList.toggle('is-sel', i === sel);
      b.querySelector('[data-st]').textContent = set.size ? `${set.size} from the library` : 'Left to the Artist';
      const shown = [...set].slice(0, 3);
      b.querySelector('[data-picks]').innerHTML = set.size
        ? shown.map((n) => { const m = models(i).find((x) => x.n === n); return m && m.src ? `<img src="${m.src}" alt="">` : '<i></i>'; }).join('')
          + (set.size > 3 ? `<b>+${set.size - 3}</b>` : '')
        : '<span class="eslot__ai">✦ Artist</span>';
    });
    const total = picked.reduce((a, s2) => a + s2.size, 0);
    const left = picked.filter((s2) => !s2.size).length;
    const c = ts.querySelector('[data-count]');
    if (c) c.textContent = `${total} picked · ${left} left to the Artist`;
  };
  const paintLib = () => {
    const [name] = p.parts[sel];
    const all = models(sel);
    const set = picked[sel];
    const shelf = all.filter((m) => m.kind !== 'deep').length;
    lib.innerHTML = `
      <header class="elib__h">
        <span class="elib__t"><b>${name}</b><em>${shelf} of ${all.length} models${set.size ? ` · ${set.size} picked` : ''}</em></span>
        <label class="elib__s"><i>⌕</i><input type="text" spellcheck="false" placeholder="Search ${name.replace(/^The /, '').toLowerCase()}…"><button type="button" class="elib__x" hidden>✕</button></label>
      </header>
      <div class="elib__grid">
        <button class="lcard lcard--ai${set.size ? '' : ' is-on'}" data-ai>
          <span class="lcard__art"><img src="assets/crew-artist.webp" alt=""></span>
          <span class="lcard__n">Artist makes it</span><em>✦ New</em>
        </button>
        ${all.map(card).join('')}
      </div>
      <div class="elib__none" hidden><b>Nothing here matches <span data-q></span></b>
        <button class="elib__ai">✦ Leave it to the Artist</button></div>`;
    const grid = lib.querySelector('.elib__grid');
    const box = lib.querySelector('input');
    const x = lib.querySelector('.elib__x');
    const mark = () => {
      grid.querySelectorAll('.lcard[data-n]').forEach((c) => c.classList.toggle('is-on', set.has(c.dataset.n)));
      grid.querySelector('[data-ai]').classList.toggle('is-on', !set.size);
      lib.querySelector('.elib__t em').textContent = `${shelf} of ${all.length} models${set.size ? ` · ${set.size} picked` : ''}`;
      paintRows();
    };
    grid.querySelectorAll('.lcard[data-n]').forEach((c) => {
      c.onclick = () => { if (set.has(c.dataset.n)) set.delete(c.dataset.n); else set.add(c.dataset.n); mark(); };
    });
    const toArtist = () => { set.clear(); mark(); };
    grid.querySelector('[data-ai]').onclick = toArtist;
    lib.querySelector('.elib__ai').onclick = () => { box.value = ''; search(); toArtist(); };
    const search = () => {
      const q = box.value.trim().toLowerCase();
      x.hidden = !q;
      let hits = 0;
      grid.querySelectorAll('.lcard[data-n]').forEach((c) => {
        const hit = q ? c.dataset.n.toLowerCase().includes(q) : !c.hasAttribute('data-deep');
        c.hidden = !hit; if (hit) hits++;
      });
      grid.querySelector('[data-ai]').hidden = !!q;
      lib.querySelector('.elib__none').hidden = !(q && !hits);
      grid.hidden = !!(q && !hits);
      lib.querySelector('[data-q]').textContent = `“${box.value.trim()}”`;
      lib.querySelector('.elib__t em').textContent = q ? `${hits} found in ${all.length} models` : `${shelf} of ${all.length} models${set.size ? ` · ${set.size} picked` : ''}`;
    };
    box.oninput = search;
    box.onkeydown = (e) => { e.stopPropagation(); if (e.key === 'Escape') { if (box.value) { box.value = ''; search(); } else box.blur(); } };
    x.onclick = () => { box.value = ''; search(); box.focus(); };
    mark();
  };
  const pick = (i) => { sel = (i + slots.length) % slots.length; paintLib(); paintRows(); };
  slots.forEach((b, i) => { b.onclick = () => pick(i); });
  con.__slot = (d) => pick(sel + d);
  pick(0);
}

// ── H · the charge ────────────────────────────────────────────────
/* G's cartridge on the left, a dark tablet on the right, and a fine line
   that always joins them — a port on the tablet's edge, the cartridge's
   contacts at the other end, a little current running along it. The plan
   is iPad-sized and quiet: the story on one card, every other choice a tile
   that shows only its current value. Approving floods the line: a wave
   crosses the screen's dots, a cone of light opens at the port and narrows
   into the line, and the cartridge lights and loads. */
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-');

function hBg() { try { return localStorage.getItem('h-bg4') || 'wave'; } catch (e) { return 'wave'; } }
function wireHBg() {
  const c = document.getElementById('charge'); if (!c) return;
  const mark = () => document.querySelectorAll('.hbgsw [data-bg]').forEach((b) => b.classList.toggle('is-on', b.dataset.bg === c.dataset.bg));
  document.querySelectorAll('.hbgsw [data-bg]').forEach((b) => b.addEventListener('click', () => {
    c.dataset.bg = b.dataset.bg; mark();
    try { localStorage.setItem('h-bg4', b.dataset.bg); } catch (e) {}
  }));
  mark();
  roomLoop(c);
  dotsLoop(c);
  waveLoop(c);
}
// Dots: a flat dot grid on a dark gradient; each dot's opacity follows a slow drifting field, brighter near the link
function dotsLoop(c) {
  const cv = c.querySelector('.hbg__dots'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t0 = performance.now();
  let last = 0, loadedAt = 0;
  const draw = (now) => {
    if (!cv.isConnected) return;
    if (c.dataset.bg !== 'dots' || now - last < 33) { requestAnimationFrame(draw); return; }
    last = now;
    const dpr = Math.min(2, devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const t = still ? 0 : (now - t0) / 1000;

    // where the current runs: dots gather light around the port and the pins
    const cr = c.getBoundingClientRect();
    const tb = c.querySelector('.tb')?.getBoundingClientRect(), ca = c.querySelector('.cart')?.getBoundingClientRect();
    const px = tb ? tb.left - cr.left : W * .45, py = tb ? tb.top - cr.top + tb.height / 2 : H / 2;
    const qx = ca ? ca.right - cr.left : W * .35, qy = ca ? ca.top - cr.top + ca.height / 2 : H / 2;
    const mx = (px + qx) / 2, my = (py + qy) / 2;
    const loaded = !!c.querySelector('.cart.is-loaded');
    if (loaded && !loadedAt) loadedAt = now; if (!loaded) loadedAt = 0;
    const ring = loadedAt ? (now - loadedAt) / 1000 * W * .55 : -1;

    const S = 16;
    for (let y = S / 2; y < H; y += S) {
      for (let x = S / 2; x < W; x += S) {
        // slow, soft field of light and shade
        const n = Math.sin(x * .006 + t * .35) * Math.cos(y * .008 - t * .27) + .6 * Math.sin((x + y) * .004 - t * .2);
        const d = Math.hypot(x - mx, (y - my) * 1.4) / W;
        const m = Math.max(0, Math.min(1, (n + 1.6) / 3.2)); let a = .03 + .42 * m * m * m + .3 * Math.max(0, 1 - d * 1.8) ** 2 + .12 * (1 - y / H);
        let lime = Math.max(0, 1 - d * 3.2);
        if (ring > 0) { const w = Math.abs(Math.hypot(x - px, y - py) - ring); if (w < 60) { const k = 1 - w / 60; a += .5 * k * Math.max(0, 1 - ring / W); lime = Math.max(lime, k); } }
        a = Math.min(.85, a);
        if (a < .04) continue;
        const r = .8 + .9 * Math.min(1, a * 1.8);
        ctx.fillStyle = `rgba(${Math.round(236 - 40 * lime)},${Math.round(236 - 1 * lime)},${Math.round(241 - 241 * lime * .9)},${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill();
      }
    }
    if (!still || ring > 0) requestAnimationFrame(draw); else requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}
// the room's floor: a perspective grid drawn on canvas so lines stay crisp, with contact shadows under the card and tablet
function roomLoop(c) {
  const cv = c.querySelector('.hbg__cv'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t0 = performance.now();
  const draw = (now) => {
    if (!cv.isConnected) return;
    if (c.dataset.bg !== 'room') { requestAnimationFrame(draw); return; }
    const dpr = Math.min(2, devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const hy = H * 0.64, cx = W * 0.56, f = H * 0.9, camH = 1.25, sp = 0.5;
    const off = still ? 0 : ((now - t0) / 9000) % 1 * sp;

    // floor: faint light near the horizon, dark toward us
    const fl = ctx.createLinearGradient(0, hy, 0, H);
    fl.addColorStop(0, 'rgba(196,235,0,.07)'); fl.addColorStop(.25, 'rgba(26,29,20,.9)'); fl.addColorStop(1, 'rgba(10,11,9,1)');
    ctx.fillStyle = fl; ctx.fillRect(0, hy, W, H - hy);

    // depth lines
    for (let i = 0; i < 60; i++) {
      const z = 0.9 + i * sp - off; if (z <= 0.5) continue;
      const y = hy + f * camH / z; if (y > H + 2) continue;
      const k = Math.min(1, (y - hy) / (H - hy));
      ctx.strokeStyle = `rgba(214,240,120,${(0.025 + 0.28 * k * k).toFixed(3)})`;
      ctx.lineWidth = 0.5 + 0.5 * k;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    // lines running to the vanishing point
    for (let x = -40; x <= 40; x++) {
      const wx = x * sp, bx = cx + f * wx / (f * camH / (H - hy));
      const g = ctx.createLinearGradient(0, hy, 0, H);
      const a = 0.24 * Math.max(0, 1 - Math.abs(x) / 30);
      g.addColorStop(0, 'rgba(214,240,120,0)'); g.addColorStop(.35, `rgba(214,240,120,${(a * .35).toFixed(3)})`); g.addColorStop(1, `rgba(214,240,120,${a.toFixed(3)})`);
      ctx.strokeStyle = g; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(cx, hy); ctx.lineTo(bx, H); ctx.stroke();
    }
    // fog that swallows the far grid
    const fog = ctx.createLinearGradient(0, hy - 2, 0, hy + H * 0.12);
    fog.addColorStop(0, 'rgba(18,20,14,1)'); fog.addColorStop(1, 'rgba(18,20,14,0)');
    ctx.fillStyle = fog; ctx.fillRect(0, hy - 2, W, H * 0.12 + 2);
    // horizon: a hairline that fades at both ends
    const hz = ctx.createLinearGradient(0, 0, W, 0);
    hz.addColorStop(0, 'rgba(214,240,120,0)'); hz.addColorStop(.56, 'rgba(214,240,120,.35)'); hz.addColorStop(1, 'rgba(214,240,120,0)');
    ctx.fillStyle = hz; ctx.fillRect(0, hy, W, 1);

    // what stands in the room: a light pool, then a soft contact shadow
    const cr = c.getBoundingClientRect();
    [['.cart', 0.10], ['.tb', 0.2]].forEach(([sel, glow]) => {
      const el = c.querySelector(sel); if (!el) return;
      const r = el.getBoundingClientRect(); if (!r.width) return;
      const ex = r.left - cr.left + r.width / 2, ey = Math.max(hy + 8, r.bottom - cr.top + H * 0.035);
      const lit = c.querySelector('.cart.is-loaded') ? 1.6 : 1;
      ctx.save(); ctx.translate(ex, ey); ctx.scale(1, 0.16);
      let g = ctx.createRadialGradient(0, 0, 0, 0, 0, r.width * 0.75);
      g.addColorStop(0, `rgba(196,235,0,${(glow * lit).toFixed(3)})`); g.addColorStop(1, 'rgba(196,235,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r.width * 0.75, 0, 7); ctx.fill();
      g = ctx.createRadialGradient(0, 0, 0, 0, 0, r.width * 0.5);
      g.addColorStop(0, 'rgba(0,0,0,.75)'); g.addColorStop(.6, 'rgba(0,0,0,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r.width * 0.5, 0, 7); ctx.fill();
      ctx.restore();
    });
    if (!still) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}
// Particles: a grey studio backdrop lit from the top left, and a floor of particle lines that ripple toward a bright horizon
function waveLoop(c) {
  const cv = c.querySelector('.hbg__wave'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t0 = performance.now();
  let last = 0;
  const draw = (now) => {
    if (!cv.isConnected) return;
    if (c.dataset.bg !== 'wave' || now - last < 33) { requestAnimationFrame(draw); return; }
    last = now;
    const dpr = Math.min(2, devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const t = still ? 0 : (now - t0) / 1000;
    const lit = c.querySelector('.cart.is-loaded') ? 1 : 0;
    const hy = H * .76, cx = W * .42, f = H * .9, camH = .5;

    // backdrop
    let g = ctx.createLinearGradient(0, 0, 0, hy);
    g.addColorStop(0, '#232427'); g.addColorStop(.7, '#18191B'); g.addColorStop(1, '#1D1E21');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // a soft shaft of light from the top left
    ctx.save(); ctx.translate(W * .2, H * .12); ctx.rotate(.5); ctx.scale(1, 2.2);
    g = ctx.createRadialGradient(0, 0, 0, 0, 0, W * .32);
    g.addColorStop(0, 'rgba(210,214,222,.16)'); g.addColorStop(.5, 'rgba(180,186,196,.05)'); g.addColorStop(1, 'rgba(180,186,196,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, W * .32, 0, 7); ctx.fill(); ctx.restore();
    // flare line near the top
    g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.2, 'rgba(255,255,255,.16)'); g.addColorStop(.5, 'rgba(255,255,255,.05)'); g.addColorStop(1, 'rgba(255,255,255,.1)');
    ctx.fillStyle = g; ctx.fillRect(0, H * .13, W, 1);
    // floor base
    g = ctx.createLinearGradient(0, hy, 0, H);
    g.addColorStop(0, '#1E1F22'); g.addColorStop(1, '#0B0B0D');
    ctx.fillStyle = g; ctx.fillRect(0, hy, W, H - hy);

    // particle lines: columns run toward the horizon; dots are bucketed by opacity so each bucket is one fill
    const step = 6 / f, B = 12, buckets = Array.from({ length: B }, () => []);
    for (let y = hy + 1.5; y < H + 20; y += 1.8 + (y - hy) * .012) {
      const z = f * camH / (y - hy);
      const k = Math.min(1, (y - hy) / (H - hy));
      const stride = 2 ** Math.max(0, Math.ceil(Math.log2(z / 2.2)));
      const j0 = Math.floor(-cx * z / (f * step) / stride) * stride, j1 = Math.ceil((W - cx) * z / (f * step));
      const sz = .8 + .9 * k;
      for (let jj = j0; jj <= j1; jj += stride) {
        const wx = jj * step;
        const h = .018 * Math.sin(wx * 2.2 + z * .8 - t * .7) + .012 * Math.sin(z * 1.9 - wx * .9 + t * .45) + .006 * Math.sin(wx * 7 - t);
        const x = cx + f * wx / z, yy = hy + f * (camH - h) / z;
        const hl = Math.max(0, 1 - Math.hypot((x - cx) / (W * .35), (yy - hy) / (H * .07)));
        let a = (.16 + .3 * (1 - k) + .5 * hl * hl + 14 * Math.max(0, h) * k) * (1 - .45 * k * k) * (1 + .3 * lit);
        if (a < .04) continue;
        buckets[Math.min(B - 1, Math.floor(a * B))].push(x - sz / 2, yy - sz / 2, sz);
      }
    }
    buckets.forEach((d, b) => {
      if (!d.length) return;
      ctx.fillStyle = `rgba(232,234,238,${((b + .5) / B).toFixed(3)})`;
      ctx.beginPath();
      for (let q = 0; q < d.length; q += 3) ctx.rect(d[q], d[q + 1], d[q + 2], d[q + 2]);
      ctx.fill();
    });
    // the bright seam where floor meets backdrop
    ctx.save(); ctx.translate(cx, hy); ctx.scale(1, .06);
    g = ctx.createRadialGradient(0, 0, 0, 0, 0, W * .38);
    g.addColorStop(0, `rgba(255,255,255,${.5 + .25 * lit})`); g.addColorStop(.35, 'rgba(255,255,255,.14)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, W * .38, 0, 7); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(cx, hy - 4); ctx.scale(1, .5);
    g = ctx.createRadialGradient(0, 0, 0, 0, 0, W * .3);
    g.addColorStop(0, 'rgba(230,234,240,.10)'); g.addColorStop(1, 'rgba(230,234,240,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, W * .3, 0, 7); ctx.fill(); ctx.restore();
    // edges fall off
    g = ctx.createRadialGradient(W * .5, H * .55, H * .3, W * .5, H * .55, W * .72);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.45)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}
function compH(p) {
  const f = p.form;
  const sc = F.scopes.find((x) => x[0] === f.scope) || F.scopes[1];
  const tile = (k, label, value, sub = null, cls = '') => `<button class="tile${cls}" data-slip="${k}">
      <span class="tile__top"><span class="tc__k">${label}</span><span class="tile__edit">Edit<i>⌄</i></span></span>
      <span class="tile__v" data-val>${value}</span>${sub === null ? '' : `<span class="tile__sub" data-sub>${sub}</span>`}</button>`;
  const choice = (label, v, on, sub = '') => `<button class="tco${on ? ' is-on' : ''}" data-v="${v}" data-label="${label}" data-sub="${sub}">
      <b>${label}</b>${sub ? `<em>${sub}</em>` : ''}</button>`;
  const bub = (name, on) => `<button class="tbub${on ? ' is-on' : ''}" data-po>
      <span class="tbub__art">${p.partImg ? `<img src="${p.partImg(name)}" alt="">` : `<b>${name[0]}</b>`}</span>
      <span class="tbub__n">${name}</span></button>`;
  return `
  <div class="charge" id="charge" data-bg="${hBg()}">
    <div class="hbg" aria-hidden="true">
      <i class="hbg__glow hbg__glow--a"></i><i class="hbg__glow hbg__glow--b"></i>
      <div class="hbg__room"><i class="hbg__wall"></i><canvas class="hbg__cv"></canvas><i class="hbg__grain"></i></div>
      <canvas class="hbg__dots"></canvas><canvas class="hbg__wave"></canvas>
    </div>
    ${cartridge(p, { pins: true, shape: '4:3' })}

    <svg class="link" id="link" aria-hidden="true">
      <defs><linearGradient id="lgrad" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".5" stop-color="#fff" stop-opacity=".16"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".55"/></linearGradient></defs>
      <line class="link__glow"/><line class="link__base"/>
      <line class="link__pulse"/><line class="link__pulse link__pulse--b"/>
      <circle class="link__node" r="4.5"/><circle class="link__node link__node--end" r="2.5"/>
    </svg>

    <div class="tabcol">
      <div class="tb" id="tab">
        <span class="tb__port"></span>
        <div class="tb__screen" id="gl" data-step="1">
          <span class="tb__grid"></span>
          <header class="tb__top">
            <span class="tb__lead"><span class="tb__brand">PLAN</span><span class="tb__hint">Tap any card to edit</span></span>
            <span class="tb__tabs">
              <button class="tb__tab is-on" data-step="1">Plan</button>
              <button class="tb__tab" data-step="2">Assets</button>
            </span>
          </header>

          <div class="tb__pages">
            <section class="tb__page is-on" data-page="1">
              <div class="tl">
                <div class="tc tc--game tl__main">
                  <label class="tfield"><span class="tc__k">Name <i class="ed">✎</i></span>
                    <input class="tb__name" data-need value="${p.title}" placeholder="Name your game" spellcheck="false"></label>
                  <label class="tf tf--grow"><span class="tc__k">What you do <i class="ed">✎</i></span>
                    <textarea data-need spellcheck="false" placeholder="What does the player do?">${f.what || p.doing}</textarea></label>
                  <label class="tf"><span class="tc__k">How it feels <i class="ed">✎</i></span>
                    <textarea spellcheck="false" placeholder="What should it feel like?">${f.feel || p.feel}</textarea></label>
                </div>
                <div class="tiles">
                  ${tile('genre', 'Genre', genreV(f.genre), F.genreSub[f.genre])}
                  ${tile('look', 'Look', lookV(p, f.style, f.quality), null, ' tile--look')}
                  ${tile('scope', 'Scope', sc[1], `${sc[2]} · ${sc[3]}`)}
                  <div class="tile tile--flat"><span class="tc__k">Plays on</span>
                    <span class="ttog" data-multi>${[['Web', 'web'], ['Mobile', 'mobile']].map(([n, k]) =>
                      `<button class="tsw${f.plat.includes(k) ? ' is-on' : ''}" data-v="${k}"><i></i>${n}</button>`).join('')}</span></div>
                  ${tile('len', 'A run', F.length[f.len], F.lengthSub[f.len])}
                  ${tile('diff', 'Difficulty', F.difficulty[f.diff], F.diffSub[f.diff])}
                </div>
              </div>
            </section>

            <section class="tb__page" data-page="2">
              <div class="tparts">
                ${p.parts.map(([name, opts, pick]) => `
                  <div class="tc tpart" data-part>
                    <div class="tpart__h"><b>${name}</b><button class="tmore" data-more>ALL ${opts.length + 21}</button></div>
                    <div class="tpart__o">${opts.map((o, i) => bub(o, i === pick)).join('')}<button
                      class="tbub tbub--later${pick < 0 ? ' is-on' : ''}" data-later><span class="tbub__art"><b>✦</b></span><span class="tbub__n">Artist</span></button></div>
                    <div class="tpart__all">${'<i></i>'.repeat(8)}</div>
                  </div>`).join('')}
              </div>
            </section>
          </div>

          <footer class="tb__foot">
            <b class="tb__stepn" data-stepn>01 / 02</b>
            <span class="tb__sum"><b data-sum>${sumV(f.scope)}</b><em data-count></em></span>
            <button class="tbtn" id="glgo"><span>Next · Assets</span><i class="tbtn__ic">→</i></button>
          </footer>

          <div class="tslip tslip--side" data-slipbox="genre" hidden>
            ${F.genres.map(([k, n]) =>
              `<button class="tslip__g${k === f.genre ? ' is-on' : ''}" data-g="${k}">${GICON[k]}${n}</button>`).join('')}
          </div>
          <div class="tslip tslip--wide" data-slipbox="look" hidden>
            <div class="tslip__grid">${F.styles.map(([k, n]) =>
              `<button class="tslip__s${k === f.style ? ' is-on' : ''}" data-s="${k}"><img src="${thumb(p, k)}" alt=""><span>${n}</span></button>`).join('')}</div>
            <div class="tslip__q tseg">${F.quality.map((q) =>
              `<button class="topt${q === f.quality ? ' is-on' : ''}" data-q="${q}">${q}</button>`).join('')}</div>
          </div>
          <div class="tslip tslip--side" data-slipbox="scope" hidden>
            <span class="tlist" data-k="scope">${F.scopes.map(([k, n, w2, cr]) =>
              choice(n, k, k === f.scope, `${w2} · ${cr}`)).join('')}</span>
          </div>
          <div class="tslip tslip--side" data-slipbox="len" hidden>
            <span class="tlist" data-k="len">${F.length.map((n, i) => choice(n, i, i === f.len, F.lengthSub[i])).join('')}</span>
          </div>
          <div class="tslip tslip--side" data-slipbox="diff" hidden>
            <span class="tlist" data-k="diff">${F.difficulty.map((n, i) => choice(n, i, i === f.diff, F.diffSub[i])).join('')}</span>
          </div>
        </div>
      </div>
    </div>

    <svg class="zap" id="zap" aria-hidden="true"></svg>
    <button class="replay" id="replay">↻ Replay</button>
    <span class="hbgsw" role="group" aria-label="Background"><em>Background</em><button data-bg="wave">Particles</button><button data-bg="dots">Dots</button><button data-bg="glow">Glow</button><button data-bg="room">3D room</button><button data-bg="none">Off</button></span>
  </div>`;
}

// a seeded random, so any given moment always looks the same
const rng = (seed) => {
  let x = (Math.abs(Math.floor(seed)) % 2147483646) + 1;
  return () => ((x = (x * 16807) % 2147483647) - 1) / 2147483646;
};
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const easeOut = (v) => 1 - Math.pow(1 - v, 3);

// the two ends of the line: the tip of the tablet's port, and the cartridge's contacts
const linkEnds = (root) => {
  const box = root.getBoundingClientRect();
  const pr = root.querySelector('.tb__port').getBoundingClientRect();
  const qr = root.querySelector('#cart .pins').getBoundingClientRect();
  return {
    box,
    ax: pr.left - box.left + 4, ay: pr.top - box.top + pr.height / 2,
    bx: qr.left - box.left + qr.width / 2, by: qr.top - box.top + qr.height / 2,
  };
};

// The line follows the cartridge as it floats and leans, every frame.
function linkLoop() {
  const root = $('charge'), svg = $('link');
  const lines = [...svg.querySelectorAll('line')];
  const [n1, n2] = svg.querySelectorAll('circle');
  const grad = svg.querySelector('#lgrad');
  const update = () => {
    const e = linkEnds(root);
    if (!e.box.width) return;
    svg.setAttribute('viewBox', `0 0 ${e.box.width} ${e.box.height}`);
    [...lines, grad].forEach((el) => {
      el.setAttribute('x1', e.ax); el.setAttribute('y1', e.ay);
      el.setAttribute('x2', e.bx); el.setAttribute('y2', e.by);
    });
    n1.setAttribute('cx', e.ax); n1.setAttribute('cy', e.ay);
    n2.setAttribute('cx', e.bx); n2.setAttribute('cy', e.by);
  };
  window.__linkOnce = update;             // one update by hand when checking it
  const step = () => {
    if (!root.isConnected) return;
    update();
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* The whole charge is one function of elapsed time, so any moment of it
   can be drawn on its own. It is drawn along the line, in the line's own
   frame: the port at (0,0), the contacts at (-L,0).
     0–380   the button fills; current on the line speeds up
   160–920   a wave of light crosses the screen's dots toward the port
   640–1220  a cone of light opens at the port and narrows into the line
  1180–1760  a few sparks at the contacts; the card lights from that side
  1420       the cartridge is loaded; 1520–2040 the cone fades               */
function charge() {
  const root = $('charge'), scr = $('gl'), go = $('glgo'), zap = $('zap'), tab = $('tab'), link = $('link');
  const grid = scr.querySelector('.tb__grid');
  const cart = $('cart'), pinsEl = cart.querySelector('.pins'), lab = $('cartlab');
  const e = linkEnds(root);
  const L = Math.hypot(e.bx - e.ax, e.by - e.ay) || 1;
  const ang = Math.atan2(e.by - e.ay, e.bx - e.ax) * 180 / Math.PI - 180;
  const tr = tab.getBoundingClientRect();
  const x0 = 0, tx = -L, xm = -L * .58, H0 = Math.min(tr.height * .22, 150);
  const chosen = [...scr.querySelectorAll('.tb__page.is-on [data-po].is-on, .tb__page.is-on [data-later].is-on')];

  zap.setAttribute('viewBox', `0 0 ${e.box.width} ${e.box.height}`);
  zap.innerHTML = `<defs>
      <linearGradient id="zfun" gradientUnits="userSpaceOnUse" x1="${x0}" y1="0" x2="${xm}" y2="0">
        <stop offset="0" stop-color="#12205C" stop-opacity="0"/><stop offset=".4" stop-color="#1F4FD8" stop-opacity=".5"/>
        <stop offset=".8" stop-color="#5CC8FF" stop-opacity=".92"/><stop offset="1" stop-color="#F2FDFF"/></linearGradient>
      <linearGradient id="zrim" gradientUnits="userSpaceOnUse" x1="${x0}" y1="0" x2="${xm}" y2="0">
        <stop offset="0" stop-color="#C58BFF" stop-opacity="0"/><stop offset=".7" stop-color="#C58BFF" stop-opacity=".55"/>
        <stop offset="1" stop-color="#FFFFFF" stop-opacity=".9"/></linearGradient>
      <linearGradient id="zline" gradientUnits="userSpaceOnUse" x1="${xm}" y1="0" x2="${tx}" y2="0">
        <stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#BDEBFF"/><stop offset="1" stop-color="#D59BFF"/></linearGradient>
      <clipPath id="zclip"><rect id="zrect" x="0" y="${-(H0 + 60)}" width="0" height="${2 * (H0 + 60)}"/></clipPath>
    </defs>
    <g transform="translate(${e.ax} ${e.ay}) rotate(${ang})">
      <g clip-path="url(#zclip)" id="zbeam">
        <path class="zfun zfun--glow"/><path class="zfun"/><path class="zrim"/>
        <line class="zline zline--glow" x1="${xm}" y1="0" x2="${tx}" y2="0"/>
        <line class="zline zline--core" x1="${xm}" y1="0" x2="${tx}" y2="0"/>
      </g>
      <g class="zsparks">${'<circle r="0"/>'.repeat(10)}</g>
    </g>`;
  const rect = zap.querySelector('#zrect'), beam = zap.querySelector('#zbeam');
  const funs = [...zap.querySelectorAll('.zfun')], rim = zap.querySelector('.zrim');
  const core = zap.querySelector('.zline--core');
  const sparks = [...zap.querySelectorAll('.zsparks circle')];
  const sr = rng(5);
  const spray = sparks.map(() => {
    const a = (sr() - .5) * Math.PI * .85, v = 60 + sr() * 160;
    return { vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30 };
  });
  const cx = xm + (x0 - xm) * .3;
  const cone = (h) => `M${x0} ${-h} Q${cx} -2.5 ${xm} -1 L${xm} 1 Q${cx} 2.5 ${x0} ${h} Z`;
  const edges = (h) => `M${x0} ${-h} Q${cx} -2.5 ${xm} -1 M${x0} ${h} Q${cx} 2.5 ${xm} 1`;

  const frame = (t) => {
    go.style.setProperty('--fill', clamp01(t / 380).toFixed(3));
    link.classList.toggle('is-charging', t < 1600);
    chosen.forEach((el) => el.classList.toggle('is-sending', t < 760));
    const w0 = clamp01((t - 160) / 760), w = w0 * w0 * (3 - 2 * w0);
    grid.style.setProperty('--wave', `${(112 - w * 130).toFixed(1)}%`);
    grid.style.setProperty('--waveOn', t > 160 && t < 1000 ? 1 : 0);

    const open = easeOut(clamp01((t - 640) / 360));
    const reach = easeOut(clamp01((t - 700) / 520));
    const fade = t < 1520 ? 1 : clamp01(1 - (t - 1520) / 520);
    const h = H0 * (.35 + .65 * open) * (1 + .03 * Math.sin(t / 45));
    const left = -reach * (L + 4);
    rect.setAttribute('x', left.toFixed(1));
    rect.setAttribute('width', Math.max(0, 30 - left).toFixed(1));
    funs.forEach((el) => el.setAttribute('d', cone(h)));
    rim.setAttribute('d', edges(h));
    core.style.opacity = (.82 + .18 * Math.sin(t / 30)).toFixed(3);
    beam.style.opacity = t < 640 ? 0 : fade;

    sparks.forEach((c, i) => {
      const s2 = (t - 1180) / 1000;
      if (s2 < 0 || s2 > .58) { c.setAttribute('r', 0); return; }
      c.setAttribute('cx', (tx + spray[i].vx * s2).toFixed(1));
      c.setAttribute('cy', (spray[i].vy * s2 + 260 * s2 * s2).toFixed(1));
      c.setAttribute('r', (1.8 * (1 - s2 / .58)).toFixed(2));
    });
    pinsEl.classList.toggle('is-hot', t >= 1180 && t < 1950);
    if (t >= 1200) cart.classList.add('is-charging');
    if (t >= 1420 && !cart.classList.contains('is-loaded')) {
      cart.classList.add('is-loaded');
      lab.innerHTML = '<i></i>Loaded · building v1';
      link.classList.add('is-live');
    }
    if (t >= 1620) scr.classList.add('is-done');
  };
  window.__chargeFrame = frame;          // draw any moment by hand when checking it

  scr.classList.add('is-charging');
  go.querySelector('span').textContent = 'Charging';
  if (window.__chargeHold) { frame(0); return; }
  const t0 = performance.now();
  const tick = (now) => {
    const t = now - t0;
    frame(t);
    if (t < 2150) { requestAnimationFrame(tick); return; }
    scr.classList.remove('is-charging');
    chosen.forEach((el) => el.classList.remove('is-sending'));
    go.querySelector('span').textContent = 'Approved';
    go.disabled = true;
    zap.innerHTML = '';
  };
  requestAnimationFrame(tick);
}

function wireH(p) {
  wireHBg();
  const scr = $('gl');
  const go = $('glgo');
  const page1 = scr.querySelector('[data-page="1"]');
  needWatch(page1);
  const step = (n) => {
    if (n === 2 && !formCheck(page1, go)) return;
    scr.dataset.step = n;
    scr.querySelectorAll('.tb__tab').forEach((t) => t.classList.toggle('is-on', +t.dataset.step === n));
    scr.querySelectorAll('.tb__page').forEach((pg) => pg.classList.toggle('is-on', +pg.dataset.page === n));
    scr.querySelector('[data-stepn]').textContent = `0${n} / 02`;
    if (!scr.classList.contains('is-done')) go.querySelector('span').textContent = n === 1 ? 'Next · Assets' : 'Approve';
  };
  scr.querySelectorAll('.tb__tab').forEach((t) => { t.onclick = () => step(+t.dataset.step); });
  scr.querySelectorAll('[data-more]').forEach((b) => {
    b.onclick = () => b.closest('[data-part]').classList.toggle('is-open');
  });
  go.onclick = () => {
    if (scr.dataset.step === '1') { step(2); return; }
    if (scr.classList.contains('is-done') || scr.classList.contains('is-charging')) return;
    charge();
  };
  wireAssets(scr);
  wireForm(p, scr, (src) => { document.querySelector('.cart__win img').src = src; });
  // a pick in a tile's slip writes back into the tile and closes the slip
  scr.querySelectorAll('[data-slipbox] [data-k]').forEach((g) => {
    g.querySelectorAll('[data-v]').forEach((o) => o.addEventListener('click', () => {
      const v = scr.querySelector(`[data-slip="${g.dataset.k}"] [data-val]`);
      const sub = scr.querySelector(`[data-slip="${g.dataset.k}"] [data-sub]`);
      if (v) v.textContent = o.dataset.label;
      if (sub) sub.textContent = o.dataset.sub;
      g.closest('[data-slipbox]').hidden = true;
    }));
  });
  scr.querySelectorAll('[data-slipbox="genre"] [data-g]').forEach((b) => b.addEventListener('click', () => {
    const sub = scr.querySelector('[data-slip="genre"] [data-sub]');
    if (sub) sub.textContent = F.genreSub[b.dataset.g];
  }));
  linkLoop();

  // the cartridge faces you straight on, and leans only under the pointer — the line follows it
  const col = $('cartcol'), cart = $('cart');
  col.onmousemove = (ev) => {
    const r = col.getBoundingClientRect();
    const x = (ev.clientX - r.left) / r.width - .5;
    const y = (ev.clientY - r.top) / r.height - .5;
    cart.style.setProperty('--ry', `${x * 22}deg`);
    cart.style.setProperty('--rx', `${-y * 16}deg`);
    cart.style.setProperty('--mx', `${50 - x * 90}%`);
  };
  col.onmouseleave = () => ['--ry', '--rx', '--mx'].forEach((v) => cart.style.removeProperty(v));
  $('replay').onclick = paint;
}

// ── Wiring ────────────────────────────────────────────────────────
const COMPS = { h: compH, e: compE, g: compG };
let which = new URLSearchParams(location.search).get('c') || 'h', plan = 'toy';

function paint() {
  const p = PLANS[plan];
  $('stage').className = 'stage stage--' + which;
  $('stage').innerHTML = COMPS[which](p);
  if (which === 'g') wireG(p);
  if (which === 'e') wireE(p);
  if (which === 'h') wireH(p);
  document.querySelectorAll('.sw__b').forEach((b) =>
    b.classList.toggle('is-on', b.dataset.c === which));
  document.querySelectorAll('.sw__p').forEach((b) =>
    b.classList.toggle('is-on', b.dataset.p === plan));

}

document.querySelectorAll('.sw__b').forEach((b) =>
  b.onclick = () => { which = b.dataset.c; paint(); });
document.querySelectorAll('.sw__p').forEach((b) =>
  b.onclick = () => { plan = b.dataset.p; paint(); });
paint();
