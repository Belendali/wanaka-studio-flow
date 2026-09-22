/* The whole run, in order: you ask, the team works, the plan opens on a handheld,
   you go through it, you approve, and the build starts. plans.js holds its own
   render (window.__hold) until this script says the plan is ready to open. */
const S = (id) => document.getElementById(id);
const PROMPT = 'Build a toy house exploration game: A boy collecting puzzles in the room to unlock the secret of the toy house';
const STEPS = ['Read your idea', 'Shaping the core loop', 'Choosing a look', 'Sizing the build'];
const CHAPTERS = [['1', 'You ask'], ['2', 'The team gets to work'], ['3', 'The plan opens'], ['4', 'You go through it'], ['5', 'Approved · building']];

let timers = [];
const at = (ms, fn) => timers.push(setTimeout(fn, ms));
const clear = () => { timers.forEach(clearTimeout); timers = []; };
const chapter = () => {};

function scene() {
  document.querySelector('.sc')?.remove();
  const sc = document.createElement('div');
  sc.className = 'sc';
  sc.id = 'sc';
  sc.innerHTML = `
    <img class="sc__bg" src="assets/studio-bg.jpg" alt="Wanaka Studio">
    <div class="sc__chat" id="scChat"></div>
    <div class="sc__type" id="scType"><span id="scTyped"></span><i></i></div>
    <span class="sc__plan" id="scPlan"></span>
    <span class="sc__cursor" id="scCur"><svg viewBox="0 0 12 18"><path d="M1 1l10 9.5H6.2l2.4 5.6-2 .9-2.4-5.6L1 14.6z"/></svg></span>
    <button class="sc__skip" id="scSkip">Skip to the console →</button>`;
  document.body.appendChild(sc);
  return sc;
}
const cursor = (x, y, click) => {
  const c = S('scCur');
  c.style.transform = `translate(${x}px, ${y}px)`;
  if (click) { c.classList.remove('is-click'); void c.offsetWidth; c.classList.add('is-click'); }
};
const pct = (el, fx, fy) => {
  const r = document.querySelector('.sc').getBoundingClientRect();
  return [r.width * fx, r.height * fy];
};
const add = (html, delay = 0) => {
  const chat = S('scChat');
  const d = document.createElement('div');
  d.innerHTML = html;
  const node = d.firstElementChild;
  node.style.animationDelay = `${delay}ms`;
  chat.appendChild(node);
  return node;
};

function run() {
  clear();
  chapter(0);
  const sc = scene();
  S('scSkip').onclick = open;
  let t = 300;

  // 1 · you type the idea into the composer and hit Plan
  at(t, () => cursor(...pct(null, .86, .9)));
  t += 600;
  at(t, () => {
    const typed = S('scTyped');
    [...PROMPT].forEach((ch, i) => at(i * 26, () => { typed.textContent += ch; }));
  });
  t += PROMPT.length * 26 + 400;
  at(t, () => { cursor(...pct(null, .948, .963), false); S('scPlan').classList.add('is-hot'); });
  t += 650;
  at(t, () => {
    cursor(...pct(null, .948, .963), true);
    chapter(1);
    S('scTyped').textContent = '';
    S('scType').style.opacity = 0;
    add(`<p class="sc__chip"><i></i>Plan mode on · your game team is in</p>`);
    add(`<p class="sc__you">${PROMPT}</p>`, 260);
  });

  // 2 · Planner Wana answers, then the team works through the plan
  t += 1100;
  at(t, () => add(`<div class="sc__wana"><img src="assets/crew-planner.webp" alt="">
    <div><b>Planner Wana</b><p>A toy house with a secret — love it. I've called in the team; we'll draft the whole plan for you to check before anything gets built.</p></div></div>`));
  t += 700;
  at(t, () => {
    const box = add(`<div class="sc__steps"></div>`);
    STEPS.forEach((s, i) => {
      at(i * 850, () => {
        const row = document.createElement('p');
        row.className = 'sc__step';
        row.innerHTML = `<i></i>${s}`;
        box.appendChild(row);
        at(700, () => row.classList.add('is-done'));
      });
    });
  });
  t += STEPS.length * 850 + 500;

  // 3 · the plan is ready, and it opens itself
  at(t, () => add(`<div class="sc__wana"><img src="assets/crew-planner.webp" alt="">
    <div><b>Planner Wana</b><p>Here it is — it is open on the left. Every card is yours to change, and nothing gets built until you approve it.</p></div></div>`));
  t += 800;
  let card;
  at(t, () => {
    chapter(2);
    card = add(`<div class="sc__card"><img src="assets/boy.jpg" alt="">
      <div><em>Plan v1.0</em><b>Tiny Explorer: The Giant Bedroom</b><button>View full plan</button></div></div>`);
  });
  t += 900;
  at(t, () => { card.classList.add('is-hot'); cursor(...pct(null, .9, .58)); });
  t += 650;
  at(t, () => { cursor(...pct(null, .9, .58), true); open(); });
}

// the console arrives: hand over to the plan itself
function open() {
  clear();
  chapter(2);
  const sc = S('sc');
  if (sc) sc.classList.add('is-out');
  which = 'e'; shape = 'square';
  paint();
  // Replay inside the console starts the whole run again, not just the arrival
  const r = S('replay'); if (r) r.onclick = run;
  at(600, () => sc?.remove());
}

// 5 · approved: the team starts building
document.addEventListener('e-approved', () => {
  chapter(4);
  const sc = scene();
  sc.querySelector('.sc__bg').remove();
  sc.querySelector('.sc__chat').remove();
  S('scType').remove();
  S('scSkip').remove();
  S('scCur').remove();
  sc.insertAdjacentHTML('beforeend', `
    <div class="sc__epi">
      <div class="sc__wana"><img src="assets/crew-planner.webp" alt="">
        <div><b>Planner Wana</b><p>Approved. The team is on it — building v1 now. I'll ping you the moment it's playable.</p></div></div>
      <span class="sc__bar"><i></i></span>
      <p class="sc__note">Building · 4 rooms · 6 assets</p>
    </div>`);
});

// the cover can be picked from the link: ?plan=horror / ?plan=pixel
const wanted = new URLSearchParams(location.search).get('plan');
if (wanted && ['toy', 'horror', 'pixel'].includes(wanted)) plan = wanted;
run();
