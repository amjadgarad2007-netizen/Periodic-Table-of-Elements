/* ── state ── */
let lang = 'ar';
let currentElement = null;
const T = {
  ar: {
    title: 'الجدول الدوري للعناصر',
    sub: 'انقر على أي عنصر لعرض تفاصيله',
    atomicN: 'العدد الذري',
    massN: 'العدد الكتلي',
    group: 'المجموعة',
    period: 'الدورة',
    cfg: 'التوزيع الإلكتروني (أوفباو)',
    orbital: 'التوزيع في المدارات',
    aufbau: 'مبدأ أوفباو – صناديق المدارات',
    shells: 'توزيع الإلكترونات في المستويات',
    anomaly: '⚠ شذوذ في التوزيع الإلكتروني',
    cats: {
      alkali: 'فلزات قلوية', alkaline: 'فلزات قلوية ترابية',
      transition: 'عناصر انتقالية', boron_grp: 'مجموعة البورون',
      carbon_grp: 'مجموعة الكربون', pnictogen: 'مجموعة النيتروجين',
      chalcogen: 'مجموعة الأكسجين', halogen: 'هالوجينات',
      noble: 'غازات نبيلة', lanthanide: 'لانثانيدات',
      actinide: 'أكتينيدات', metalloid: 'أشباه فلزات',
      nonmetal: 'لافلزات'
    },
    lanthRow: 'لانثانيدات (57 – 71)',
    actRow: 'أكتينيدات (89 – 103)',
    lang: 'English',
    searchPh: 'ابحث بالاسم، الرمز، أو العدد الذري...',
    searchEmpty: 'لا توجد نتائج',
    searchAll: 'الكل',
    quizBtn: 'اختبار',
    quizTitle: 'اختبار الجدول الدوري',
    quizQ1: 'ما رمز هذا العنصر؟',
    quizQ2: 'ما اسم هذا العنصر؟',
    quizQ3: 'ما العدد الذري لهذا العنصر؟',
    quizQ4: 'ما فئة هذا العنصر؟',
    quizQ: 'السؤال',
    quizOf: 'من',
    quizCorrect: 'إجابة صحيحة! 🎉',
    quizWrong: 'إجابة خاطئة...',
    quizNext: 'السؤال التالي',
    quizResult: 'النتيجة النهائية',
    quizResultGreat: 'ممتاز! أنت خبير في الجدول الدوري 🏆',
    quizResultGood: 'جيد جداً! واصل التدريب 💪',
    quizResultOk: 'بداية طيبة... جرب مرة أخرى',
    quizResultTry: 'تحتاج مراجعة... راجع العناصر وجرب مجدداً',
    quizRestart: 'إعادة الاختبار',
    quizClose: 'إغلاق'
  },
  en: {
    title: 'Periodic Table of Elements',
    sub: 'Click any element to view details',
    atomicN: 'Atomic Number',
    massN: 'Atomic Mass',
    group: 'Group',
    period: 'Period',
    cfg: 'Electron Configuration (Aufbau)',
    orbital: 'Orbital Diagram',
    aufbau: 'Aufbau – Orbital Boxes',
    shells: 'Electron Shell Distribution',
    anomaly: '⚠ Electron configuration anomaly',
    cats: {
      alkali: 'Alkali Metals', alkaline: 'Alkaline Earth Metals',
      transition: 'Transition Metals', boron_grp: 'Boron Group',
      carbon_grp: 'Carbon Group', pnictogen: 'Pnictogens',
      chalcogen: 'Chalcogens', halogen: 'Halogens',
      noble: 'Noble Gases', lanthanide: 'Lanthanides',
      actinide: 'Actinides', metalloid: 'Metalloids',
      nonmetal: 'Non-metals'
    },
    lanthRow: 'Lanthanides (57 – 71)',
    actRow: 'Actinides (89 – 103)',
    lang: 'العربية',
    searchPh: 'Search by name, symbol, or atomic number...',
    searchEmpty: 'No results',
    searchAll: 'All',
    quizBtn: 'Quiz',
    quizTitle: 'Periodic Table Quiz',
    quizQ1: 'What is the symbol of this element?',
    quizQ2: 'What is the name of this element?',
    quizQ3: 'What is the atomic number of this element?',
    quizQ4: 'What category is this element?',
    quizQ: 'Question',
    quizOf: 'of',
    quizCorrect: 'Correct! 🎉',
    quizWrong: 'Wrong...',
    quizNext: 'Next question',
    quizResult: 'Final score',
    quizResultGreat: 'Excellent! You are a periodic table expert 🏆',
    quizResultGood: 'Very good! Keep practicing 💪',
    quizResultOk: 'Good start... try again',
    quizResultTry: 'Needs review... study the elements and retry',
    quizRestart: 'Restart quiz',
    quizClose: 'Close'
  }
};

/* ── anomalous elements (by atomic number) ── */
const ANOMALIES = new Set([24, 29, 41, 42, 44, 45, 46, 47, 57, 58, 64, 78, 79, 89, 90, 91, 92, 93, 94, 96]);

/* ── CSS variable per category ── */
const CAT_VAR = {
  alkali: '--alkali', alkaline: '--alkaline', transition: '--transition',
  boron_grp: '--boron', carbon_grp: '--carbon', pnictogen: '--pnictogen',
  chalcogen: '--chalcogen', halogen: '--halogen', noble: '--noble',
  lanthanide: '--lanthanide', actinide: '--actinide',
  metalloid: '--metalloid', nonmetal: '--nonmetal'
};
function catColor(cat) {
  return getComputedStyle(document.documentElement).getPropertyValue(CAT_VAR[cat] || '--unknown').trim();
}

/* ──────────────────────────────────────
   BUILD TABLE
────────────────────────────────────── */
function buildTable() {
  const grid = document.getElementById('pt-grid');
  grid.innerHTML = '';

  // Map elements by [period][group]
  const map = {};
  ELEMENTS.forEach(el => {
    if (el.cat === 'lanthanide' || el.cat === 'actinide') return;
    map[`${el.p}-${el.g}`] = el;
  });

  // corner cell (row 1, col 1)
  const corner = document.createElement('div');
  corner.className = 't-corner';
  corner.style.gridColumn = 1;
  corner.style.gridRow = 1;
  grid.appendChild(corner);

  // group numbers header (row 1, cols 2-19)
  for (let g = 1; g <= 18; g++) {
    const gh = document.createElement('div');
    gh.className = 'g-head';
    gh.textContent = g;
    gh.style.gridColumn = g + 1;
    gh.style.gridRow = 1;
    grid.appendChild(gh);
  }

  // period numbers (col 1, rows 2-8)
  for (let p = 1; p <= 7; p++) {
    const ph = document.createElement('div');
    ph.className = 'p-head';
    ph.textContent = p;
    ph.style.gridColumn = 1;
    ph.style.gridRow = p + 1;
    grid.appendChild(ph);
  }

  for (let row = 1; row <= 7; row++) {
    for (let col = 1; col <= 18; col++) {
      const el = map[`${row}-${col}`];

      /* La/Ac placeholder in col 3, rows 6-7 */
      if (!el && col === 3 && (row === 6 || row === 7)) {
        const ph = document.createElement('div');
        ph.className = 'el sep-cell';
        ph.style.gridColumn = col + 1;
        ph.style.gridRow = row + 1;
        ph.textContent = row === 6 ? '57-71' : '89-103';
        grid.appendChild(ph);
        continue;
      }

      if (!el) {
        const blank = document.createElement('div');
        blank.style.gridColumn = col + 1;
        blank.style.gridRow = row + 1;
        grid.appendChild(blank);
        continue;
      }

      grid.appendChild(makeCell(el, col + 1, row + 1));
    }
  }

  /* f-block rows */
  buildFBlock();
}

function makeCell(el, col, row) {
  const div = document.createElement('div');
  div.className = `el cat-${el.cat}`;
  if (col) div.style.gridColumn = col;
  if (row) div.style.gridRow = row;
  div.style.animationDelay = Math.min(el.n * 7, 700) + 'ms';

  div.innerHTML = `
    <span class="num">${el.n}</span>
    <span class="sym">${el.sym}</span>
    <span class="name">${lang === 'ar' ? el.ar : el.en}</span>
  `;
  div.title = lang === 'ar' ? el.ar : el.en;
  div.addEventListener('click', () => openModal(el));
  return div;
}

function buildFBlock() {
  const wrap = document.getElementById('fblock');
  wrap.innerHTML = '';

  ['lanthanide', 'actinide'].forEach((cat, i) => {
    const row = document.createElement('div');
    row.className = 'fblock-row';
    const lbl = document.createElement('div');
    lbl.className = 'fblock-label';
    lbl.textContent = lang === 'ar'
      ? (i === 0 ? T.ar.lanthRow : T.ar.actRow)
      : (i === 0 ? T.en.lanthRow : T.en.actRow);

    ELEMENTS.filter(e => e.cat === cat).forEach(el => {
      row.appendChild(makeCell(el, null, null));
    });

    const wrapper = document.createElement('div');
    wrapper.appendChild(lbl);
    wrapper.appendChild(row);
    wrap.appendChild(wrapper);
  });
}

/* ──────────────────────────────────────
   LEGEND + CATEGORY FILTER
────────────────────────────────────── */
let activeCat = null;

function buildLegend() {
  const leg = document.getElementById('legend');
  leg.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn all' + (activeCat === null ? ' active' : '');
  allBtn.textContent = T[lang].searchAll;
  allBtn.addEventListener('click', () => setFilter(null));
  leg.appendChild(allBtn);

  const cats = Object.keys(CAT_VAR);
  cats.forEach(cat => {
    const d = document.createElement('button');
    d.className = 'filter-btn';
    d.dataset.cat = cat;
    d.innerHTML = `<span class="leg-dot" style="background:${catColor(cat)}"></span>
                   <span>${T[lang].cats[cat]}</span>`;
    d.addEventListener('click', () => setFilter(activeCat === cat ? null : cat));
    leg.appendChild(d);
  });

  if (activeCat) setFilter(activeCat);
}

function setFilter(cat) {
  activeCat = cat;
  document.querySelectorAll('#legend .filter-btn').forEach(b => {
    b.classList.toggle('active', cat ? b.dataset.cat === cat : b.classList.contains('all'));
  });
  document.querySelectorAll('.el').forEach(el => {
    if (!cat) { el.classList.remove('dim', 'hl'); return; }
    const inCat = el.classList.contains('cat-' + cat);
    el.classList.toggle('dim', !inCat);
    el.classList.toggle('hl', inCat);
  });
}

/* ──────────────────────────────────────
   MODAL
────────────────────────────────────── */
function openModal(el) {
  currentElement = el;
  const t = T[lang];
  document.getElementById('m-badge').style.background =
    `color-mix(in srgb, ${catColor(el.cat)} 50%, #111)`;
  document.getElementById('m-num').textContent = el.n;
  document.getElementById('m-sym').textContent = el.sym;
  document.getElementById('m-mass').textContent = el.mass;
  document.getElementById('m-name').textContent = lang === 'ar' ? el.ar : el.en;
  document.getElementById('m-cat').textContent = t.cats[el.cat] || el.cat;
  document.getElementById('m-an').textContent = el.n;
  document.getElementById('m-am').textContent = el.mass;
  document.getElementById('m-grp').textContent = el.g;
  document.getElementById('m-per').textContent = el.p;
  document.getElementById('m-cfg').textContent = el.cfg;
  document.getElementById('m-shells').textContent = el.shells.join(' | ');

  document.getElementById('lbl-cfg').textContent = t.cfg;
  document.getElementById('lbl-orbital').textContent = t.orbital;
  document.getElementById('lbl-aufbau').textContent = t.aufbau;
  document.getElementById('lbl-shells').textContent = t.shells;
  document.getElementById('lbl-an').textContent = t.atomicN;
  document.getElementById('lbl-am').textContent = t.massN;
  document.getElementById('lbl-grp').textContent = t.group;
  document.getElementById('lbl-per').textContent = t.period;

  const anomDiv = document.getElementById('m-anomaly');
  anomDiv.textContent = ANOMALIES.has(el.n) ? t.anomaly : '';

  drawOrbital(el);
  drawAufbau(el);

  document.getElementById('overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('overlay').classList.remove('open');
}

/* ──────────────────────────────────────
   ORBITAL CANVAS (Bohr model)
────────────────────────────────────── */
function drawOrbital(el) {
  const canvas = document.getElementById('orb-canvas');
  const size = Math.min(window.innerWidth * .5, 230);
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  const cs = getComputedStyle(document.documentElement);
  const ringCol = cs.getPropertyValue('--orb-ring').trim();
  const labelCol = cs.getPropertyValue('--orb-label').trim();
  const eStroke = cs.getPropertyValue('--orb-electron-stroke').trim();
  const eFill = cs.getPropertyValue('--orb-electron').trim();

  const cx = size / 2, cy = size / 2;
  const shells = el.shells;
  const maxR = cx - 14;
  const minR = 24;

  // nucleus
  const nRadius = Math.max(14, Math.min(22, 8 + shells.length * 2));
  const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, nRadius);
  grad.addColorStop(0, '#fff');
  grad.addColorStop(.4, eFill);
  grad.addColorStop(1, '#0d1633');
  ctx.beginPath();
  ctx.arc(cx, cy, nRadius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // nucleus label
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.max(8, nRadius * .7)}px Cairo,sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(lang === 'ar' ? 'نواة' : 'Nucleus', cx, cy);

  // shells
  const step = shells.length === 1 ? 0 : (maxR - minR) / (shells.length - 1);
  shells.forEach((count, i) => {
    const r = shells.length === 1 ? minR + 18 : minR + i * step;

    // orbit ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = ringCol;
    ctx.lineWidth = 1;
    ctx.stroke();

    // electrons
    for (let e = 0; e < count; e++) {
      const angle = (2 * Math.PI * e) / count - Math.PI / 2;
      const ex = cx + r * Math.cos(angle);
      const ey = cy + r * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(ex, ey, 5, 0, Math.PI * 2);
      ctx.fillStyle = eFill;
      ctx.fill();
      ctx.strokeStyle = eStroke;
      ctx.lineWidth = .8;
      ctx.stroke();
    }

    // shell number label
    const lx = cx + r + 8;
    const ly = cy;
    ctx.fillStyle = labelCol;
    ctx.font = '9px Cairo,sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`n${i + 1}:${count}`, lx > size - 24 ? cx - r - 8 : lx, ly);
    ctx.textAlign = 'center';
  });
}

/* ──────────────────────────────────────
   AUFBAU BOXES
────────────────────────────────────── */
const AUFBAU_ORDER = [
  { n: 1, l: 's', cap: 2 }, { n: 2, l: 's', cap: 2 }, { n: 2, l: 'p', cap: 6 },
  { n: 3, l: 's', cap: 2 }, { n: 3, l: 'p', cap: 6 }, { n: 4, l: 's', cap: 2 },
  { n: 3, l: 'd', cap: 10 }, { n: 4, l: 'p', cap: 6 }, { n: 5, l: 's', cap: 2 },
  { n: 4, l: 'd', cap: 10 }, { n: 5, l: 'p', cap: 6 }, { n: 6, l: 's', cap: 2 },
  { n: 4, l: 'f', cap: 14 }, { n: 5, l: 'd', cap: 10 }, { n: 6, l: 'p', cap: 6 },
  { n: 7, l: 's', cap: 2 }, { n: 5, l: 'f', cap: 14 }, { n: 6, l: 'd', cap: 10 },
  { n: 7, l: 'p', cap: 6 }
];

function drawAufbau(el) {
  const cont = document.getElementById('aufbau-cont');
  cont.innerHTML = '';
  let remaining = el.n;

  for (const sub of AUFBAU_ORDER) {
    if (remaining <= 0) break;
    const fill = Math.min(remaining, sub.cap);
    remaining -= fill;
    const nBoxes = sub.cap / 2;

    const grp = document.createElement('div');
    grp.className = 'sub-group';
    grp.innerHTML = `<div class="sub-label">${sub.n}${sub.l}</div>`;

    const boxes = document.createElement('div');
    boxes.className = 'sub-boxes';

    for (let b = 0; b < nBoxes; b++) {
      const box = document.createElement('div');
      box.className = 'orb-box';
      const e1 = b + 1, e2 = nBoxes + b + 1;
      const hasUp = fill >= e1;
      // Hund's rule: fill up first
      const hasDown = fill >= e2;
      if (hasUp && hasDown) box.classList.add('full');
      else if (hasUp) box.classList.add('up');
      boxes.appendChild(box);
    }

    grp.appendChild(boxes);
    cont.appendChild(grp);
  }
}

/* ──────────────────────────────────────
   SEARCH
────────────────────────────────────── */
function initSearch() {
  const input = document.getElementById('search');
  const box = document.getElementById('search-results');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { box.classList.remove('show'); box.innerHTML = ''; return; }

    const matches = ELEMENTS.filter(el => {
      return el.sym.toLowerCase().includes(q)
        || el.ar.includes(q)
        || el.en.toLowerCase().includes(q)
        || String(el.n) === q
        || String(el.n).padStart(3, '0') === q;
    }).slice(0, 8);

    if (!matches.length) {
      box.innerHTML = `<div class="sr-empty">${T[lang].searchEmpty}</div>`;
    } else {
      box.innerHTML = matches.map(el => `
        <div class="sr-item" data-n="${el.n}">
          <span class="sr-sym" style="background:color-mix(in srgb, ${catColor(el.cat)} 55%, #111)">${el.sym}</span>
          <span class="sr-name">${lang === 'ar' ? el.ar : el.en}</span>
          <span class="sr-num">${el.n}</span>
        </div>`).join('');
      box.querySelectorAll('.sr-item').forEach(item => {
        item.addEventListener('click', () => {
          const el = ELEMENTS.find(e => e.n === Number(item.dataset.n));
          if (el) { openModal(el); input.value = ''; box.classList.remove('show'); }
        });
      });
    }
    box.classList.add('show');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-box')) box.classList.remove('show');
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const first = box.querySelector('.sr-item');
      if (first) first.click();
    }
  });
}

/* ──────────────────────────────────────
   THEME
────────────────────────────────────── */
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('pt-theme', t); } catch (e) {}
  const btn = document.getElementById('theme-btn');
  if (btn) btn.innerHTML = `<i class="fa-solid fa-${t === 'dark' ? 'moon' : 'sun'}"></i>`;
  const open = document.getElementById('overlay');
  if (open.classList.contains('open')) {
    const el = currentElement;
    if (el) drawOrbital(el);
  }
}

let quiz = null;

/* ──────────────────────────────────────
   QUIZ
────────────────────────────────────── */
const QUIZ_TYPES = ['sym', 'name', 'num', 'cat'];

function startQuiz() {
  const t = T[lang];
  quiz = { idx: 0, score: 0, total: 10, questions: [] };

  const pool = [...ELEMENTS].sort(() => Math.random() - .5).slice(0, quiz.total);
  pool.forEach(el => {
    quiz.questions.push({ el, type: QUIZ_TYPES[Math.floor(Math.random() * QUIZ_TYPES.length)] });
  });

  document.getElementById('quiz-title').textContent = t.quizTitle;
  document.getElementById('quiz-overlay').classList.add('open');
  renderQuiz();
}

function pickOptions(correct, pick) {
  const others = ELEMENTS
    .filter(e => e !== correct)
    .sort(() => Math.random() - .5)
    .slice(0, 3)
    .map(pick);
  const opts = [pick(correct), ...others].sort(() => Math.random() - .5);
  return { opts, correct: pick(correct) };
}

function renderQuiz() {
  const t = T[lang];
  const q = quiz.questions[quiz.idx];
  const el = q.el;
  const c = catColor(el.cat);

  document.getElementById('quiz-progress').textContent =
    `${t.quizQ} ${quiz.idx + 1}/${quiz.total}`;
  document.getElementById('quiz-score').textContent =
    `⭐ ${quiz.score}`;
  document.getElementById('quiz-feedback').className = 'quiz-feedback';
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-next').style.display = 'none';

  let preview = '', question = '';
  if (q.type === 'sym') {
    preview = `<div class="qp-name">${lang === 'ar' ? el.ar : el.en}</div>`;
    question = t.quizQ1;
  } else if (q.type === 'name') {
    preview = `<div class="qp-sym">${el.sym}</div>`;
    question = t.quizQ2;
  } else if (q.type === 'num') {
    preview = `<div class="qp-sym">${el.sym}</div><div class="qp-name">${lang === 'ar' ? el.ar : el.en}</div>`;
    question = t.quizQ3;
  } else {
    preview = `<div class="qp-sym">${el.sym}</div><div class="qp-name">${lang === 'ar' ? el.ar : el.en}</div>`;
    question = t.quizQ4;
  }

  document.getElementById('quiz-question').textContent = question;
  document.getElementById('quiz-element-preview').innerHTML = preview;
  document.getElementById('quiz-element-preview').style.background =
    `color-mix(in srgb, ${c} 40%, var(--card-bg))`;
  document.getElementById('quiz-element-preview').style.borderColor = c;

  const { opts, correct } = pickOptions(el, x =>
    q.type === 'sym' ? x.sym
    : q.type === 'name' ? (lang === 'ar' ? x.ar : x.en)
    : q.type === 'num' ? String(x.n)
    : T[lang].cats[x.cat]
  );
  quiz.current = { correct };

  const cont = document.getElementById('quiz-options');
  cont.innerHTML = '';
  opts.forEach((o, i) => {
    const b = document.createElement('button');
    b.className = 'quiz-opt';
    b.textContent = o;
    b.addEventListener('click', () => answerQuiz(i));
    cont.appendChild(b);
  });
}

function answerQuiz(i) {
  const t = T[lang];
  const buttons = document.querySelectorAll('#quiz-options .quiz-opt');
  buttons.forEach((b, j) => b.disabled = true);

  const fb = document.getElementById('quiz-feedback');
  if (buttons[i].textContent === quiz.current.correct) {
    quiz.score++;
    buttons[i].classList.add('correct');
    fb.className = 'quiz-feedback ok';
    fb.textContent = t.quizCorrect;
  } else {
    buttons[i].classList.add('wrong');
    buttons.forEach(b => {
      if (b.textContent === quiz.current.correct) b.classList.add('correct');
    });
    fb.className = 'quiz-feedback no';
    fb.textContent = t.quizWrong;
  }

  document.getElementById('quiz-score').textContent = `⭐ ${quiz.score}`;
  const next = document.getElementById('quiz-next');
  next.style.display = 'inline-block';
  next.textContent = quiz.idx + 1 < quiz.total ? t.quizNext : t.quizResult;
}

function nextQuiz() {
  if (quiz.idx + 1 < quiz.total) {
    quiz.idx++;
    renderQuiz();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  const t = T[lang];
  const pct = quiz.score / quiz.total;
  const msg = pct >= .9 ? t.quizResultGreat
    : pct >= .7 ? t.quizResultGood
    : pct >= .5 ? t.quizResultOk
    : t.quizResultTry;

  document.getElementById('quiz-progress').textContent = t.quizResult;
  document.getElementById('quiz-question').textContent = '';
  document.getElementById('quiz-element-preview').innerHTML = `
    <div class="qr-circle" style="border-color:${pct >= .5 ? 'var(--pnictogen)' : 'var(--alkali)'}">
      <div class="qr-score">${quiz.score}/${quiz.total}</div>
      <div class="qr-of">${t.quizQ}</div>
    </div>
    <div class="qr-msg">${msg}</div>
  `;
  document.getElementById('quiz-element-preview').style.background = 'transparent';
  document.getElementById('quiz-element-preview').style.borderColor = 'transparent';
  document.getElementById('quiz-element-preview').style.width = 'auto';
  document.getElementById('quiz-element-preview').style.height = 'auto';
  document.getElementById('quiz-element-preview').classList.add('quiz-result');
  document.getElementById('quiz-options').innerHTML = '';
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-next').style.display = 'none';

  const actions = document.getElementById('quiz-actions');
  actions.innerHTML = `
    <button class="quiz-restart" id="quiz-restart">${t.quizRestart}</button>
    <button class="quiz-next" id="quiz-close-final">${t.quizClose}</button>
  `;
  document.getElementById('quiz-restart').addEventListener('click', startQuiz);
  document.getElementById('quiz-close-final').addEventListener('click', closeQuiz);
}

function closeQuiz() {
  document.getElementById('quiz-overlay').classList.remove('open');
  quiz = null;
}

/* ──────────────────────────────────────
   LANGUAGE SWITCH
────────────────────────────────────── */
function setLang(l) {
  lang = l;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('lang-btn').textContent = T[lang].lang;
  document.getElementById('main-title').textContent = T[lang].title;
  document.getElementById('main-sub').textContent = T[lang].sub;
  document.getElementById('search').placeholder = T[lang].searchPh;
  document.getElementById('quiz-btn-label').textContent = T[lang].quizBtn;
  buildTable();
  buildLegend();
}

/* ──────────────────────────────────────
   INIT
────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  let saved = 'dark';
  try { saved = localStorage.getItem('pt-theme') || 'dark'; } catch (e) {}
  applyTheme(saved);

  setLang('ar');
  initSearch();

  document.getElementById('lang-btn').addEventListener('click', () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  });

  document.getElementById('theme-btn').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });

  document.getElementById('quiz-btn').addEventListener('click', startQuiz);
  document.getElementById('quiz-close').addEventListener('click', closeQuiz);
  document.getElementById('quiz-next').addEventListener('click', nextQuiz);
  document.getElementById('quiz-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeQuiz();
  });

  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.getElementById('modal-close').addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (quiz && document.getElementById('quiz-overlay').classList.contains('open')) closeQuiz();
      else closeModal();
    }
  });
});
