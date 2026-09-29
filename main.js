/* Behaviour for index.html and work.html. Content lives in data.js. */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const vimeo = (id, bg) => `https://player.vimeo.com/video/${id}?` +
    (bg ? 'background=1&autoplay=1&loop=1&muted=1&autopause=0' : 'title=0&byline=0&portrait=0&dnt=1');
  const iframe = (id, bg, title) => {
    const f = document.createElement('iframe');
    f.src = vimeo(id, bg && !reduce); f.title = title || 'Video';
    f.allow = 'autoplay; fullscreen; picture-in-picture'; f.loading = 'lazy';
    return f;
  };

  /* ---------- Menu: burger → cross, translucent overlay ---------- */
  const btn = $('#menuBtn');
  if (btn) {
    const lbl = $('.lbl', btn);
    const set = o => {
      document.body.classList.toggle('menu-open', o);
      btn.setAttribute('aria-expanded', o);
      if (lbl) lbl.textContent = o ? 'Close' : 'Menu';
      $$('#menu .hl li').forEach((li, i) => li.style.transitionDelay = o ? (80 + i * 35) + 'ms' : '0ms');
    };
    btn.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
    $$('#menu a').forEach(a => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }

  /* ---------- Videos ---------- */
  $$('[data-bg]').forEach(el => { const f = iframe(VIDEOS[el.dataset.bg], true, 'Showreel (background)'); f.loading = 'eager'; f.tabIndex = -1; f.setAttribute('aria-hidden', 'true'); el.appendChild(f); });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.appendChild(iframe(VIDEOS[e.target.dataset.embed] || e.target.dataset.vimeo, e.target.hasAttribute('data-muted'), e.target.dataset.title));
    io.unobserve(e.target);
  }), { rootMargin: '500px' });
  $$('[data-embed]').forEach(el => io.observe(el));

  /* ---------- Highlight lists ---------- */
  $$('[data-hl]').forEach(list => {
    const items = [...list.children]; let hovering = false;
    const light = i => items.forEach((li, j) => li.classList.toggle('on', j === i));
    items.forEach((li, i) => {
      li.addEventListener('mouseenter', () => { hovering = true; light(i); });
      li.addEventListener('focusin', () => light(i));
    });
    list.addEventListener('mouseleave', () => { hovering = false; if (!list.hasAttribute('data-scroll')) light(-1); });
    if (list.hasAttribute('data-scroll')) {
      const onScroll = () => {
        if (hovering) return;
        const mid = innerHeight / 2; let best = -1, d = 1e9;
        items.forEach((li, i) => { const r = li.getBoundingClientRect(); const dd = Math.abs(r.top + Math.min(r.height, 90) / 2 - mid); if (dd < d) { d = dd; best = i; } });
        light(best);
      };
      addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
  });
  // "Other Work" opens its sub-list
  $$('.hl li.has-sub > button').forEach(b => b.addEventListener('click', () => {
    const li = b.parentElement, o = !li.classList.contains('expanded');
    li.classList.toggle('expanded', o); b.setAttribute('aria-expanded', o);
    $$('.subl a', li).forEach((a, i) => a.style.transitionDelay = o ? (120 + i * 60) + 'ms' : '0ms');
  }));

  /* ---------- Bio: words light up as they pass; portrait drifts ---------- */
  const wordEls = [];
  $$('[data-words]').forEach(p => {
    p.innerHTML = p.textContent.trim().split(/\s+/).map(w => `<span class="w">${esc(w)}</span>`).join(' ');
    wordEls.push(...$$('.w', p));
  });
  const photo = $('.bio .photo');
  if (!reduce && (wordEls.length || photo)) {
    const upd = () => {
      const line = innerHeight * 0.72;
      wordEls.forEach(w => w.classList.toggle('lit', w.getBoundingClientRect().top < line));
      if (photo) {
        const r = photo.getBoundingClientRect();
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
        photo.style.setProperty('--py', (p * 6 - 6) + '%');
      }
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }

  /* ---------- Projects: DVD stack ---------- */
  const stack = $('#stack');
  if (stack && typeof PROJECTS !== 'undefined') {
    stack.innerHTML = PROJECTS.map((p, i) => `
      <article class="dvd" tabindex="0" aria-label="${esc(p.title)}, ${esc(p.broadcaster)}, ${esc(p.role)}">
        ${p.image ? `<div class="img" style="background-image:url('${esc(p.image)}')" role="img" aria-label="${esc(p.title)} key art"></div>`
                  : `<div class="img ph">[ Image to come — ${esc(p.title)} ]</div>`}
        <div class="spine"><div class="l"><span class="ti">${esc(p.title)}</span><span class="br">— ${esc(p.broadcaster)}</span></div><span class="ro">${esc(p.role)}</span></div>
        <div class="detail"><p>${esc(p.description)}</p><span class="yr">${esc(p.year)}</span></div>
      </article>`).join('');
    const dvds = $$('.dvd', stack); let t;
    const open = el => dvds.forEach(d => d.classList.toggle('open', d === el));
    dvds.forEach(d => {
      d.addEventListener('mouseenter', () => { clearTimeout(t); t = setTimeout(() => open(d), 90); });
      d.addEventListener('click', () => open(d.classList.contains('open') && matchMedia('(hover: none)').matches ? null : d));
      d.addEventListener('focus', () => open(d));
    });
    stack.addEventListener('mouseleave', () => { clearTimeout(t); });
    if (dvds[0]) open(dvds[0]);
  }

  /* ---------- Galleries ---------- */
  const docTrack = $('#docTrack');
  if (docTrack && typeof DOCUMENTARIES !== 'undefined') {
    docTrack.innerHTML = DOCUMENTARIES.map(d => `
      <${d.link ? `a href="${esc(d.link)}"` : 'div'} class="card">
        <div class="pic">${d.image ? `<img src="${esc(d.image)}" alt="${esc(d.title)} poster" loading="lazy">` : `<div class="ph" style="height:100%">[ 9:16 poster — ${esc(d.title)} ]</div>`}</div>
        <div><h3>${esc(d.title)}</h3><div class="m">${esc(d.for)} · ${esc(d.role)}</div></div>
      </${d.link ? 'a' : 'div'}>`).join('');
  }
  const owTrack = $('#owTrack');
  if (owTrack && typeof OTHER_WORK !== 'undefined') {
    owTrack.innerHTML = Object.entries(OTHER_WORK).map(([k, s]) => `
      <a class="card" href="work.html?s=${k}">
        <div class="pic"><img src="${esc(s.cover)}" alt="${esc(s.title)} — Christian Marot" loading="lazy"></div>
        <div><h3>${esc(s.title)}</h3><div class="m">${esc(s.group)}</div></div>
      </a>`).join('');
  }
  $$('.sec').forEach(sec => {
    const track = $('.track', sec); if (!track) return;
    const [prev, next] = $$('.arrow', sec);
    const step = () => ($('.card', track)?.offsetWidth || 300) + 24;
    const sync = () => { prev.disabled = track.scrollLeft < 4; next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4; };
    prev.onclick = () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' });
    next.onclick = () => track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' });
    track.addEventListener('scroll', sync, { passive: true }); addEventListener('resize', sync); sync();
  });

  /* ---------- Shoot diary: departures / arrivals board ---------- */
  const rowsEl = $('#boardRows');
  if (rowsEl && typeof DIARY !== 'undefined') {
    $('#updated').textContent = LAST_UPDATED;
    const cls = s => /nda/i.test(s) ? 'nda' : /released/i.test(s) ? 'rel' : 'prod';
    const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const flap = el => {
      if (reduce) return;
      const target = el.textContent; let f = 0; const frames = 10 + Math.floor(Math.random() * 8);
      const tick = () => {
        f++;
        el.textContent = [...target].map((c, i) => (c === ' ' || f > frames * (i + 1) / target.length + 4) ? c : CH[Math.floor(Math.random() * CH.length)]).join('');
        if (f < frames + 6) requestAnimationFrame(tick); else el.textContent = target;
      };
      tick();
    };
    const render = mode => {
      const rows = DIARY.filter(r => (cls(r.status) === 'rel') === (mode === 'dep'));
      $('#boardLabel').textContent = mode === 'dep' ? 'Released' : 'In production · Under NDA';
      rowsEl.innerHTML = rows.length ? rows.map(r => `<tr>
          <td><span class="fl">${esc(r.dates)}</span></td><td class="pj"><span class="fl">${esc(r.project)}</span></td>
          <td class="hide-s"><span class="fl">${esc(r.for)}</span></td><td class="hide-s"><span class="fl">${esc(r.role)}</span></td>
          <td class="st ${cls(r.status)}"><span>${esc(r.status)}</span></td></tr>`).join('')
        : `<tr><td colspan="5" class="empty">No ${mode === 'dep' ? 'departures' : 'arrivals'} listed.</td></tr>`;
      $$('.fl', rowsEl).forEach(flap);
    };
    $$('.toggle button').forEach(b => b.addEventListener('click', () => {
      $$('.toggle button').forEach(x => x.setAttribute('aria-pressed', x === b));
      render(b.dataset.mode);
    }));
    render('dep');
  }

  /* ---------- Other-work page: tiles gather into a grid, then pan sideways ---------- */
  const grid = $('#wkGrid');
  if (grid && typeof OTHER_WORK !== 'undefined') {
    const key = new URLSearchParams(location.search).get('s') || 'hotels';
    const s = OTHER_WORK[key] || OTHER_WORK.hotels;
    document.title = `${s.title} — Christian Marot, Cinematographer`;
    $('#wkGroup').textContent = s.group; $('#wkName').textContent = s.title;
    const keys = Object.keys(OTHER_WORK), ix = keys.indexOf(key);
    const nx = keys[(ix + 1) % keys.length], pv = keys[(ix - 1 + keys.length) % keys.length];
    $('#wkNext').href = `work.html?s=${nx}`; $('#wkNext').textContent = `${OTHER_WORK[nx].title} →`;
    $('#wkPrev').href = `work.html?s=${pv}`; $('#wkPrev').textContent = `← ${OTHER_WORK[pv].title}`;

    const MIN = 16; // prototype: pad with labelled placeholders until more clips are added
    const tiles = [...s.tiles]; while (tiles.length < MIN) tiles.push({ ph: true });
    grid.innerHTML = tiles.map((t, i) => t.image ? `<div class="tile"><img src="${esc(t.image)}" alt="${esc(s.title)} — frame ${i + 1}" loading="lazy"></div>`
      : t.vimeo ? `<div class="tile" data-vimeo="${esc(t.vimeo)}" data-muted data-embed="" data-title="${esc(s.title)} clip"></div>`
      : `<div class="tile ph">[ 9:16 clip ]</div>`).join('');
    $$('[data-vimeo]', grid).forEach(el => io.observe(el));

    const els = $$('.tile', grid), stage = $('#wkStage');
    const seeds = els.map((_, i) => ({ x: (Math.sin(i * 12.9898) * 43758.5453 % 1), y: (Math.sin(i * 78.233) * 12543.123 % 1), r: (Math.sin(i * 3.7) * 9) }));
    let rows = 2, tileH, tileW, panMax = 0;
    const layout = () => {
      rows = innerHeight > 900 ? 2 : 2;
      tileH = Math.floor((innerHeight - 110 - 150 - 16 * (rows - 1)) / rows); tileW = Math.round(tileH * 9 / 16);
      grid.style.gridTemplateRows = `repeat(${rows}, ${tileH}px)`; grid.style.gridAutoColumns = tileW + 'px';
      panMax = Math.max(0, grid.scrollWidth - innerWidth);
      stage.style.height = (innerHeight * 1.6 + panMax * 1.2 + innerHeight) + 'px';
      frame();
    };
    const frame = () => {
      const scrolled = -stage.getBoundingClientRect().top;
      const gatherLen = innerHeight * 1.6;
      const g = reduce ? 1 : Math.min(1, Math.max(0, scrolled / gatherLen));
      const e = 1 - Math.pow(1 - g, 3);
      const pan = reduce ? 0 : Math.min(1, Math.max(0, (scrolled - gatherLen) / (panMax * 1.2 || 1)));
      els.forEach((el, i) => {
        const sd = seeds[i], k = 1 - e;
        el.style.transform = `translate(${sd.x * innerWidth * 0.45 * k}px, ${sd.y * innerHeight * 0.5 * k}px) rotate(${sd.r * k}deg) scale(${1 - 0.25 * k})`;
      });
      grid.style.transform = `translateX(${-pan * panMax}px)`;
      const tt = $('.wk-title'); if (tt) tt.style.opacity = stage.getBoundingClientRect().bottom > innerHeight * 0.75 ? 1 : 0;
    };
    addEventListener('scroll', frame, { passive: true }); addEventListener('resize', layout); layout();
  }
})();
