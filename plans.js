/* ──────────────────────────────────────────────────────────────────
   Three ways to show a plan: H, a cartridge charged from a pane of glass;
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
  <div class="room">
    <span class="room__lamp"></span>
    <span class="room__desk"></span>

    <div class="con" id="con">
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
                    <button class="ep" data-slip="look"><span class="ep__v" data-val>${lookV(p, f.style, f.quality)}</span><i class="ep__c">▾</i></button>
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
                <section class="ts__page" data-page="2">
                  <p class="ts__hint">Tick as many as you like. Leave a row alone and the Artist makes it.</p>
                  ${p.parts.map(([name, opts, pick]) => `
                    <div class="ta2" data-part><span class="tr__k">${name}</span>
                      <span class="ta2__o">${opts.map((o, i) =>
                        `<button class="echip${i === pick ? ' is-on' : ''}" data-po>${o}</button>`).join('')}<button
                        class="echip echip--later${pick < 0 ? ' is-on' : ''}" data-later>✦ Artist</button></span>
                    </div>`).join('')}
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
              <span class="con__scan"></span>
              <span class="con__sweep"></span>
            </div>
          </div>
          <div class="con__back"><span>WANAKA</span></div>
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
const PINS = `<g class="pins">${Array.from({ length: 9 }, (_, i) =>
  `<rect x="310" y="${60 + i * 12}" width="8" height="8" rx="1.6"/>`).join('')}</g>`;
function cartridge(p, { pins = false } = {}) {
  const layers = [9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) =>
    `<svg class="cart__layer" style="--z:${-n * 2.9}px;fill:hsl(230 6% ${4 + (9 - n) * 1.6}%)"
      viewBox="0 0 324 200"><path d="${CART}"/></svg>`).join('');
  return `
    <!-- left · the cartridge -->
    <div class="cartcol" id="cartcol">
      <div class="cart__rise">
        <div class="cart__float">
          <div class="cart" id="cart">
            ${layers}
            <div class="cart__face">
              <svg class="cart__svg" viewBox="0 0 324 200" aria-hidden="true">
                <defs><linearGradient id="cartg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#46474D"/><stop offset=".55" stop-color="#2B2C31"/>
                  <stop offset="1" stop-color="#1C1D21"/></linearGradient></defs>
                <path d="${CART}" fill="url(#cartg)"/>
                <path d="${RIM}" fill="none" stroke="rgba(255,255,255,.17)" stroke-width="1.2"/>
                <path d="M258 11h18M258 15.5h18M258 20h18" stroke="rgba(255,255,255,.24)"
                      stroke-width="1.6" stroke-linecap="round"/>
                ${pins ? PINS : ''}
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
    con.classList.add('is-approved');
    go.innerHTML = 'Approved ✓';
    go.disabled = true;
    hop();
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
    up: () => page().scrollBy({ top: -70, behavior: 'smooth' }),
    down: () => page().scrollBy({ top: 70, behavior: 'smooth' }),
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

  wireAssets(ts);
  wireForm(p, ts, (src) => { $('congame').src = src; });
  $('replay').onclick = paint;
}

// ── H · the charge ────────────────────────────────────────────────
/* G's cartridge on the left; on the right, the plan as a pane of glass
   floating over slow colour. Approving sends current out of every choice
   you made, gathers it at the edge of the glass, and arcs it across the gap
   into the cartridge's contacts. */
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-');

function compH(p) {
  const f = p.form;
  const so = (label, v, on, title = '') =>
    `<button class="gopt${on ? ' is-on' : ''}" data-v="${v}"${title ? ` title="${title}"` : ''}>${label}</button>`;
  const seg = (k, items) => `<span class="gseg" data-k="${k}">${items}</span>`;
  const bub = (name, on) => `<button class="bub${on ? ' is-on' : ''}" data-po>
      <span class="bub__art">${p.partImg ? `<img src="${p.partImg(name)}" alt="">` : `<b>${name[0]}</b>`}</span>
      <span class="bub__n">${name}</span></button>`;
  return `
  <div class="charge" id="charge">
    <span class="charge__blob charge__blob--a"></span>
    <span class="charge__blob charge__blob--b"></span>
    <span class="charge__blob charge__blob--c"></span>

    ${cartridge(p, { pins: true })}

    <div class="glcol">
      <div class="gl" id="gl" data-step="1">
        <header class="gl__top">
          <span class="gl__tabs">
            <button class="gl__tab is-on" data-step="1">Plan</button>
            <button class="gl__tab" data-step="2">Assets</button>
          </span>
          <span class="gl__dots"><i></i><i></i></span>
        </header>
        <div class="gl__pages">
          <section class="gl__page is-on" data-page="1">
            <input class="gl__name" data-need value="${p.title}" placeholder="Name your game" spellcheck="false">
            <div class="gr"><span class="gr__k">Genre</span>
              <button class="gpick" data-slip="genre"><span class="gpick__v" data-val>${genreV(f.genre)}</span><i class="gpick__c">⌄</i></button>
            </div>
            <label class="gf"><span class="gr__k">What you do</span>
              <textarea data-need spellcheck="false" placeholder="What does the player do?">${f.what || p.doing}</textarea>
            </label>
            <label class="gf"><span class="gr__k">How it feels</span>
              <textarea spellcheck="false" placeholder="What should it feel like?">${f.feel || p.feel}</textarea>
            </label>
            <div class="gr"><span class="gr__k">Look</span>
              <button class="gpick" data-slip="look"><span class="gpick__v" data-val>${lookV(p, f.style, f.quality)}</span><i class="gpick__c">⌄</i></button>
            </div>
            <div class="gr"><span class="gr__k">Scope</span>
              ${seg('scope', F.scopes.map(([k, n, w2, cr, t]) => so(n, k, k === f.scope, `${w2} · ${cr} · ${t}`)).join(''))}
            </div>
            <div class="gr"><span class="gr__k">Plays on</span>
              <span class="gtog" data-multi>${[['Web', 'web'], ['Mobile', 'mobile']].map(([n, k]) =>
                `<button class="gsw${f.plat.includes(k) ? ' is-on' : ''}" data-v="${k}"><i></i>${n}</button>`).join('')}</span>
            </div>
            <div class="gr"><span class="gr__k">A run</span>
              ${seg('len', F.length.map((n, i) => so(n, i, i === f.len)).join(''))}
            </div>
            <div class="gr"><span class="gr__k">Difficulty</span>
              ${seg('diff', F.difficulty.map((n, i) => so(n, i, i === f.diff)).join(''))}
            </div>
          </section>
          <section class="gl__page" data-page="2">
            <p class="gl__hint">The Artist picked three for each part. Tick any, or leave it to the Artist.</p>
            <div class="gparts">
              ${p.parts.map(([name, opts, pick]) => `
                <div class="gpart" data-part>
                  <div class="gpart__h"><b>${name}</b><button class="gmore" data-more>All ${opts.length + 21} ›</button></div>
                  <div class="gpart__o">${opts.map((o, i) => bub(o, i === pick)).join('')}<button
                    class="bub bub--later${pick < 0 ? ' is-on' : ''}" data-later><span class="bub__art"><b>✦</b></span><span class="bub__n">Artist</span></button></div>
                  <div class="gpart__all">${'<i></i>'.repeat(8)}</div>
                </div>`).join('')}
            </div>
          </section>
        </div>
        <footer class="gl__foot">
          <span class="gl__sum"><b data-sum>${sumV(f.scope)}</b><em data-count></em></span>
          <button class="gbtn" id="glgo"><span>Next · Assets</span></button>
        </footer>

        <div class="gslip gslip--genre" data-slipbox="genre" hidden>
          ${F.genres.map(([k, n]) =>
            `<button class="gslip__g${k === f.genre ? ' is-on' : ''}" data-g="${k}">${GICON[k]}${n}</button>`).join('')}
        </div>
        <div class="gslip gslip--look" data-slipbox="look" hidden>
          <div class="gslip__grid">${F.styles.map(([k, n]) =>
            `<button class="gslip__s${k === f.style ? ' is-on' : ''}" data-s="${k}"><img src="${thumb(p, k)}" alt=""><span>${n}</span></button>`).join('')}</div>
          <div class="gslip__q">${F.quality.map((q) =>
            `<button class="gopt${q === f.quality ? ' is-on' : ''}" data-q="${q}">${q}</button>`).join('')}</div>
        </div>
      </div>
    </div>

    <svg class="zap" id="zap" aria-hidden="true"></svg>
    <button class="replay" id="replay">↻ Replay</button>
  </div>`;
}

// a seeded random, so any given moment of the arc always looks the same
const rng = (seed) => {
  let x = (Math.abs(Math.floor(seed)) % 2147483646) + 1;
  return () => ((x = (x * 16807) % 2147483647) - 1) / 2147483646;
};
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const easeOut = (v) => 1 - Math.pow(1 - v, 3);

/* The whole charge is one function of elapsed time, so any moment of it
   can be drawn on its own.
     0–420   the button fills
   260–1100  a trail leaves every choice and runs to the edge of the glass
   820–2100  the arc grows across the gap, flickers, and fades
  1060–1700  sparks at the contacts; the card lights from that side
  1450       the cartridge is loaded                                  */
function charge() {
  const root = $('charge'), gl = $('gl'), go = $('glgo'), zap = $('zap');
  const cart = $('cart'), pinsEl = cart.querySelector('.pins');
  const box = root.getBoundingClientRect();
  const mid = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
  };
  const glr = gl.getBoundingClientRect();
  const target = mid(pinsEl);
  const merge = {
    x: glr.left - box.left - 4,
    y: Math.max(glr.top - box.top + 40, Math.min(glr.bottom - box.top - 40, target.y)),
  };
  const sources = [...gl.querySelectorAll('.gl__page.is-on [data-po].is-on, .gl__page.is-on [data-later].is-on'), go].map(mid);

  zap.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
  zap.innerHTML = `<defs><linearGradient id="zgrad" gradientUnits="userSpaceOnUse"
      x1="${merge.x}" y1="0" x2="${target.x}" y2="0">
      <stop offset="0" stop-color="#A58BFF"/><stop offset="1" stop-color="#8FF7FF"/></linearGradient></defs>
    ${sources.map((q) => `<path class="ztrail" d="M${q.x} ${q.y} C${q.x - 90} ${q.y} ${merge.x + 70} ${merge.y} ${merge.x} ${merge.y}"/>`).join('')}
    <path class="zarc zarc--outer"/><path class="zarc zarc--glow"/><path class="zarc zarc--core"/>
    <path class="zfork"/><path class="zfork"/>
    <g class="zsparks">${'<circle r="0"/>'.repeat(16)}</g>`;
  const trails = [...zap.querySelectorAll('.ztrail')].map((el) => ({ el, len: el.getTotalLength() }));
  trails.forEach(({ el, len }) => { el.style.strokeDasharray = len; el.style.strokeDashoffset = len; });
  const arcs = [...zap.querySelectorAll('.zarc')];
  const forks = [...zap.querySelectorAll('.zfork')];
  const sparks = [...zap.querySelectorAll('.zsparks circle')];
  const sr = rng(11);
  const spray = sparks.map(() => {
    const a = (sr() - .5) * Math.PI * .95, v = 90 + sr() * 210;
    return { vx: Math.cos(a) * v, vy: Math.sin(a) * v - 50 };
  });

  const dx = target.x - merge.x, dy = target.y - merge.y, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L, N = 16;
  const jag = (seed) => {
    const r = rng(seed * 97 + 3), pts = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N, o = (i === 0 || i === N) ? 0 : (r() - .5) * 38 * Math.sin(Math.PI * u);
      pts.push([merge.x + dx * u + nx * o, merge.y + dy * u + ny * o]);
    }
    return pts;
  };
  const path = (pts) => 'M' + pts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' L');
  const lab = $('cartlab');

  const frame = (t) => {
    go.style.setProperty('--fill', clamp01(t / 420).toFixed(3));
    trails.forEach(({ el, len }, i) => {
      el.style.strokeDashoffset = (len * (1 - easeOut(clamp01((t - 260 - i * 70) / 460)))).toFixed(1);
      el.style.opacity = t < 1050 ? 1 : clamp01(1 - (t - 1050) / 300);
    });
    const grow = easeOut(clamp01((t - 820) / 240));
    const on = t >= 820 && t < 2100;
    const fade = t < 1700 ? 1 : clamp01(1 - (t - 1700) / 400);
    const seed = Math.floor(t / 50);
    let pts = jag(seed);
    if (grow < 1) {
      const n = grow * N, k = Math.floor(n), fr = n - k;
      const a = pts[k], b = pts[Math.min(k + 1, N)];
      pts = pts.slice(0, k + 1).concat([[a[0] + (b[0] - a[0]) * fr, a[1] + (b[1] - a[1]) * fr]]);
    }
    arcs.forEach((el) => { el.setAttribute('d', on && grow > 0 ? path(pts) : ''); el.style.opacity = fade; });
    forks.forEach((el, j) => {
      if (!on || grow < 1 || t > 1650) { el.setAttribute('d', ''); return; }
      const r = rng(seed * 31 + j * 7 + 1);
      let [x, y] = pts[3 + Math.floor(r() * 10)];
      const pp = [[x, y]];
      for (let q = 0; q < 4; q++) { x += 10 + r() * 16; y += (r() - .5) * 36 + (j ? 12 : -12); pp.push([x, y]); }
      el.setAttribute('d', path(pp));
      el.style.opacity = fade * .85;
    });
    sparks.forEach((c, i) => {
      const s = (t - 1060) / 1000;
      if (s < 0 || s > .65) { c.setAttribute('r', 0); return; }
      c.setAttribute('cx', (target.x + spray[i].vx * s).toFixed(1));
      c.setAttribute('cy', (target.y + spray[i].vy * s + 300 * s * s).toFixed(1));
      c.setAttribute('r', (2.3 * (1 - s / .65)).toFixed(2));
    });
    pinsEl.classList.toggle('is-hot', t >= 1060 && t < 2000);
    if (t >= 1100) cart.classList.add('is-charging');
    if (t >= 1450 && !cart.classList.contains('is-loaded')) {
      cart.classList.add('is-loaded');
      lab.innerHTML = '<i></i>Loaded · building v1';
    }
    if (t >= 1700) gl.classList.add('is-done');
  };
  window.__chargeFrame = frame;          // draw any moment by hand when checking it

  gl.classList.add('is-charging');
  go.querySelector('span').textContent = 'Charging…';
  if (window.__chargeHold) { frame(0); return; }
  const t0 = performance.now();
  const tick = (now) => {
    const t = now - t0;
    frame(t);
    if (t < 2200) { requestAnimationFrame(tick); return; }
    gl.classList.remove('is-charging');
    go.querySelector('span').textContent = 'Approved ✓';
    go.disabled = true;
    zap.innerHTML = '';
  };
  requestAnimationFrame(tick);
}

function wireH(p) {
  const gl = $('gl');
  const go = $('glgo');
  const page1 = gl.querySelector('[data-page="1"]');
  needWatch(page1);
  const step = (n) => {
    if (n === 2 && !formCheck(page1, go)) return;
    gl.dataset.step = n;
    gl.querySelectorAll('.gl__tab').forEach((t) => t.classList.toggle('is-on', +t.dataset.step === n));
    gl.querySelectorAll('.gl__page').forEach((pg) => pg.classList.toggle('is-on', +pg.dataset.page === n));
    if (!gl.classList.contains('is-done')) go.querySelector('span').textContent = n === 1 ? 'Next · Assets' : 'Approve';
  };
  gl.querySelectorAll('.gl__tab').forEach((t) => { t.onclick = () => step(+t.dataset.step); });
  gl.querySelectorAll('[data-more]').forEach((b) => {
    b.onclick = () => b.closest('[data-part]').classList.toggle('is-open');
  });
  go.onclick = () => {
    if (gl.dataset.step === '1') { step(2); return; }
    if (gl.classList.contains('is-done') || gl.classList.contains('is-charging')) return;
    charge();
  };
  wireAssets(gl);
  wireForm(p, gl, (src) => { document.querySelector('.cart__win img').src = src; });

  // the cartridge leans toward the pointer, as in G
  const col = $('cartcol'), cart = $('cart');
  col.onmousemove = (e) => {
    const r = col.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    cart.style.setProperty('--ry', `${-10 + x * 20}deg`);
    cart.style.setProperty('--rx', `${7 - y * 14}deg`);
    cart.style.setProperty('--mx', `${50 - x * 90}%`);
  };
  col.onmouseleave = () => ['--ry', '--rx', '--mx'].forEach((v) => cart.style.removeProperty(v));
  $('replay').onclick = paint;
}

// ── Wiring ────────────────────────────────────────────────────────
const COMPS = { h: compH, e: compE, g: compG };
let which = 'h', plan = 'toy';

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
