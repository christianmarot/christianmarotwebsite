/* Behaviour for index.html and work.html. Content lives in data.js. */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const has = name => { try { return typeof eval(name) !== 'undefined'; } catch { return false; } };
  const vimeo = (id, bg) => `https://player.vimeo.com/video/${id}?` +
    (bg ? 'background=1&autoplay=1&loop=1&muted=1&autopause=0' : 'title=0&byline=0&portrait=0&dnt=1');
  const iframe = (id, bg, title) => {
    const f = document.createElement('iframe');
    f.src = vimeo(id, bg && !reduce); f.title = title || 'Video';
    f.allow = 'autoplay; fullscreen; picture-in-picture'; f.loading = 'lazy';
    return f;
  };
  const clip = src => { const v = document.createElement('video'); Object.assign(v, { src, muted: true, loop: true, playsInline: true, autoplay: !reduce, preload: 'metadata' }); v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); return v; };

  /* ---------- Menu: burger → cross, translucent overlay ---------- */
  const btn = $('#menuBtn');
  if (btn) {
    const lbl = $('.lbl', btn);
    const set = o => {
      document.body.classList.toggle('menu-open', o);
      btn.setAttribute('aria-expanded', o);
      if (lbl) lbl.textContent = o ? 'Close' : 'Menu';
      $$('#menu .hl > li').forEach((li, i) => li.style.transitionDelay = o ? (80 + i * 40) + 'ms' : '0ms');
    };
    btn.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
    $$('#menu a').forEach(a => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }

  /* ---------- Videos ---------- */
  $$('[data-bg]').forEach(el => { const f = iframe(VIDEOS[el.dataset.bg], true, 'Showreel (background)'); f.loading = 'eager'; f.tabIndex = -1; f.setAttribute('aria-hidden', 'true'); el.appendChild(f); });
  const io = new IntersectionObserver(es => es.forEach(e => {
    const el = e.target;
    if (el.dataset.clip) { const v = $('video', el) || el.appendChild(clip(el.dataset.clip)); e.isIntersecting && !reduce ? v.play().catch(() => {}) : v.pause(); return; }
    if (!e.isIntersecting) return;
    el.appendChild(iframe(VIDEOS[el.dataset.embed] || el.dataset.vimeo, el.hasAttribute('data-muted'), el.dataset.title));
    io.unobserve(el);
  }), { rootMargin: '400px' });
  $$('[data-embed]').forEach(el => io.observe(el));

  /* ---------- Highlight lists + "Other Work" dropdowns ---------- */
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
  $$('.hl li.has-sub > button').forEach(b => b.addEventListener('click', () => {
    const li = b.parentElement, o = !li.classList.contains('expanded');
    li.classList.toggle('expanded', o); b.setAttribute('aria-expanded', o);
    $$('.subl a', li).forEach((a, i) => a.style.transitionDelay = o ? (120 + i * 60) + 'ms' : '0ms');
  }));

  /* ---------- Name: sized to the role line, then travels into About ---------- */
  const idBlock = $('#idBlock'), idSlot = $('#idSlot'), idDock = $('#idDock');
  const fitName = el => {
    const nm = $('.nm', el), role = $('.role', el); if (!nm || !role) return;
    nm.style.fontSize = '44px';
    const k = role.getBoundingClientRect().width / nm.getBoundingClientRect().width;
    nm.style.fontSize = (44 * k).toFixed(2) + 'px';
  };
  const hero = $('.hero'), vbg = $('.hero .vbg'), fade = $('.hero .fade'), bio = $('#bio');
  let flyOn = false, blockW = 0, blockH = 0;
  const setupFly = () => {
    if (!idBlock) return;
    idBlock.classList.remove('flying'); idBlock.style.transform = ''; idBlock.style.opacity = '';
    if (idBlock.parentElement !== idSlot) idSlot.appendChild(idBlock);
    idSlot.style.width = idSlot.style.height = '';
    fitName(idBlock);
    const r = idBlock.getBoundingClientRect(); blockW = r.width; blockH = r.height;
    flyOn = !reduce && innerWidth > 900 && idDock && getComputedStyle(idDock.parentElement).display !== 'none';
    if (flyOn) {
      idSlot.style.width = blockW + 'px'; idSlot.style.height = blockH + 'px';
      document.body.appendChild(idBlock); idBlock.classList.add('flying');
      const s = idDock.parentElement.getBoundingClientRect().width / blockW;
      idDock.style.width = blockW * s + 'px'; idDock.style.height = blockH * s + 'px'; idDock.dataset.s = s;
    }
    scrollFx();
  };
  const scrollFx = () => {
    const y = scrollY, vh = innerHeight;
    // hero video blurs and dims as it leaves
    if (vbg && !reduce) {
      const p = clamp(y / (vh * 0.85), 0, 1);
      vbg.style.filter = `blur(${(p * 16).toFixed(1)}px) brightness(${(1 - p * 0.55).toFixed(2)})`;
      vbg.style.transform = `scale(${1 + p * 0.06})`;
      if (fade) fade.style.opacity = p.toFixed(2);
    }
    if (!flyOn) return;
    const a = idSlot.getBoundingClientRect(), d = idDock.getBoundingClientRect(), s = +idDock.dataset.s;
    const travel = Math.max(1, d.top + y - (a.top + y) - (vh * 0.15));   // distance over which it moves
    const t = ease(clamp(y / (vh * 0.95), 0, 1));
    const x = lerp(a.left, d.left, t), top = lerp(a.top, d.top, t), sc = lerp(1, s, t);
    let op = 1;
    if (bio) { const b = bio.getBoundingClientRect(); op = clamp((b.bottom - vh * 0.35) / (vh * 0.25), 0, 1); }
    idBlock.style.transform = `translate(${x.toFixed(1)}px, ${top.toFixed(1)}px) scale(${sc.toFixed(4)})`;
    idBlock.style.opacity = op.toFixed(3);
    idBlock.style.visibility = op < 0.01 ? 'hidden' : 'visible';
    void travel;
  };
  if (idBlock) {
    addEventListener('scroll', scrollFx, { passive: true });
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(setupFly, 120); });
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(setupFly);
    setupFly();
  } else if (vbg) addEventListener('scroll', scrollFx, { passive: true });

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
        const p = clamp((r.top + r.height / 2 - innerHeight / 2) / innerHeight, -1, 1);
        photo.style.setProperty('--py', (p * 6 - 6) + '%');
      }
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }

  /* ---------- Projects: DVD stack ---------- */
  const stack = $('#stack');
  if (stack && has('PROJECTS')) {
    stack.innerHTML = PROJECTS.map(p => `
      <article class="dvd" tabindex="0" aria-label="${esc(p.title)} — ${esc(p.broadcaster)}, ${esc(p.role)}, ${esc(p.date)}">
        ${p.image ? `<div class="bg" style="background-image:url('${esc(p.image)}')"></div><div class="fg" style="background-image:url('${esc(p.image)}')" role="img" aria-label="${esc(p.title)} key art"></div>`
                  : `<div class="bg ph">[ Image to come — ${esc(p.title)} ]</div>`}
        <div class="spine"><div class="l"><span class="ti">${esc(p.title)}</span><span class="br">— ${esc(p.broadcaster)}</span></div><span class="ro">${esc(p.role)}<span class="dt"> · ${esc(p.date)}</span></span></div>
        <div class="detail"><p>${esc(p.description)}</p></div>
      </article>`).join('');
    const dvds = $$('.dvd', stack); let timer = null, anim = 0;
    // Keep the item under the cursor still while the others resize, so nothing jumps.
    const open = el => {
      if (!el || el.classList.contains('open')) return;
      const before = el.getBoundingClientRect().top;
      dvds.forEach(d => d.classList.toggle('open', d === el));
      if (reduce) return;
      cancelAnimationFrame(anim); const t0 = performance.now();
      const hold = () => {
        const diff = el.getBoundingClientRect().top - before;
        if (Math.abs(diff) > 0.5) window.scrollTo({ top: scrollY + diff, behavior: 'instant' });
        if (performance.now() - t0 < 1050) anim = requestAnimationFrame(hold);
      };
      anim = requestAnimationFrame(hold);
    };
    let lastMove = 0;
    addEventListener('scroll', () => { lastMove = 0; clearTimeout(timer); }, { passive: true });
    dvds.forEach(d => {
      // open only after the pointer has rested on an item (not while scrolling past)
      d.addEventListener('mousemove', () => {
        if (d.classList.contains('open')) return;
        const now = performance.now(); if (now - lastMove < 40) return; lastMove = now;
        clearTimeout(timer); timer = setTimeout(() => open(d), 380);
      });
      d.addEventListener('mouseleave', () => clearTimeout(timer));
      d.addEventListener('click', () => open(d));
      d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(d); } });
    });
    if (dvds[0]) dvds[0].classList.add('open');
  }

  /* ---------- Galleries ---------- */
  const docTrack = $('#docTrack');
  if (docTrack && has('DOCUMENTARIES')) {
    docTrack.innerHTML = DOCUMENTARIES.map(d => `
      <${d.link ? `a href="${esc(d.link)}"` : 'div tabindex="0"'} class="card">
        <div class="pic">${d.image ? `<img src="${esc(d.image)}" alt="${esc(d.title)} poster" loading="lazy">` : `<div class="ph" style="height:100%">[ 9:16 poster — ${esc(d.title)} ]</div>`}
          <div class="desc"><p>${esc(d.description)}</p></div></div>
        <div><h3>${esc(d.title)}</h3><div class="m">${esc(d.for)} · ${esc(d.role)} · ${esc(d.date)}</div></div>
      </${d.link ? 'a' : 'div'}>`).join('');
  }
  const owTrack = $('#owTrack');
  if (owTrack && has('OTHER_WORK')) {
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
  if (rowsEl && has('DIARY')) {
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
    const more = $('#boardMore'); let mode = 'dep', all = false; const LIMIT = 8;
    const render = () => {
      const rows = DIARY.filter(r => (cls(r.status) === 'rel') === (mode === 'dep'));
      const shown = all ? rows : rows.slice(0, LIMIT);
      $('#boardLabel').textContent = mode === 'dep' ? 'Released' : 'In production · Coming soon · Under NDA';
      rowsEl.innerHTML = shown.length ? shown.map(r => `<tr>
          <td><span class="fl">${esc(r.dates)}</span></td><td class="pj"><span class="fl">${esc(r.project)}</span></td>
          <td class="hide-s"><span class="fl">${esc(r.for)}</span></td><td class="hide-s"><span class="fl">${esc(r.role)}</span></td>
          <td class="st ${cls(r.status)}"><span>${esc(r.status)}</span></td></tr>`).join('')
        : `<tr><td colspan="5" class="empty">No ${mode === 'dep' ? 'departures' : 'arrivals'} listed.</td></tr>`;
      $$('.fl', rowsEl).forEach(flap);
      if (more) { more.hidden = rows.length <= LIMIT; more.textContent = all ? 'Show fewer ↑' : `Show all ${rows.length} ↓`; }
    };
    $$('.toggle button').forEach(b => b.addEventListener('click', () => {
      $$('.toggle button').forEach(x => x.setAttribute('aria-pressed', x === b));
      mode = b.dataset.mode; all = false; render();
    }));
    if (more) more.addEventListener('click', () => { all = !all; render(); });
    render();
  }

  /* ---------- Other-work page: hero, then tiles gather into a grid and pan sideways ---------- */
  const grid = $('#wkGrid');
  if (grid && has('OTHER_WORK')) {
    const key = new URLSearchParams(location.search).get('s') || 'hotels';
    const s = OTHER_WORK[key] || OTHER_WORK.hotels;
    document.title = `${s.title} — Christian Marot, Cinematographer`;
    $$('[data-wk="group"]').forEach(e => e.textContent = s.group);
    $$('[data-wk="title"]').forEach(e => e.textContent = s.title);
    const hbg = $('#wkHeroBg');
    if (hbg) {
      if (s.hero) { const f = iframe(s.hero, true, `${s.title} (background)`); f.loading = 'eager'; f.tabIndex = -1; f.setAttribute('aria-hidden', 'true'); hbg.appendChild(f); }
      else hbg.innerHTML = `<img src="${esc(s.cover)}" alt="">`;
    }
    const keys = Object.keys(OTHER_WORK), ix = keys.indexOf(key);
    const nx = keys[(ix + 1) % keys.length], pv = keys[(ix - 1 + keys.length) % keys.length];
    $('#wkNext').href = `work.html?s=${nx}`; $('#wkNext').textContent = `${OTHER_WORK[nx].title} →`;
    $('#wkPrev').href = `work.html?s=${pv}`; $('#wkPrev').textContent = `← ${OTHER_WORK[pv].title}`;

    const MIN = 16; // prototype: pad with labelled placeholders until more clips are added
    const tiles = [...s.tiles]; while (tiles.length < MIN) tiles.push({ ph: true });
    grid.innerHTML = tiles.map((t, i) =>
        t.image ? `<div class="tile"><img src="${esc(t.image)}" alt="${esc(s.title)} — frame ${i + 1}" loading="lazy"></div>`
      : t.video ? `<div class="tile" data-embed="" data-clip="${esc(t.video)}"></div>`
      : t.vimeo ? `<div class="tile" data-vimeo="${esc(t.vimeo)}" data-muted data-embed="" data-title="${esc(s.title)} clip"></div>`
      : `<div class="tile ph">[ 9:16 clip ]</div>`).join('');
    $$('[data-embed]', grid).forEach(el => io.observe(el));

    const els = $$('.tile', grid), stage = $('#wkStage'), wt = $('.wk-title');
    const seeds = els.map((_, i) => ({ x: (Math.sin(i * 12.9898) * 43758.5453 % 1), y: (Math.sin(i * 78.233) * 12543.123 % 1), r: (Math.sin(i * 3.7) * 9) }));
    let panMax = 0;
    const frame = () => {
      scrollFx();
      const scrolled = -stage.getBoundingClientRect().top;
      const gatherLen = innerHeight * 1.4;
      const g = reduce ? 1 : clamp(scrolled / gatherLen, 0, 1);
      const e = 1 - Math.pow(1 - g, 3);
      const pan = reduce ? 0 : clamp((scrolled - gatherLen) / (panMax * 1.2 || 1), 0, 1);
      els.forEach((el, i) => {
        const sd = seeds[i], k = 1 - e;
        el.style.transform = `translate(${sd.x * innerWidth * 0.45 * k}px, ${sd.y * innerHeight * 0.5 * k}px) rotate(${sd.r * k}deg) scale(${1 - 0.25 * k})`;
      });
      grid.style.transform = `translateX(${-pan * panMax}px)`;
      if (wt) { const r = stage.getBoundingClientRect(); wt.style.opacity = (r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.75) ? 1 : 0; }
    };
    const layout = () => {
      const hdr = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr')) || 92;
      const tileH = Math.floor((innerHeight - hdr - 24 - 170 - 16) / 2), tileW = Math.round(tileH * 9 / 16);
      grid.style.gridTemplateRows = `repeat(2, ${tileH}px)`; grid.style.gridAutoColumns = tileW + 'px';
      panMax = Math.max(0, grid.scrollWidth - innerWidth);
      stage.style.height = (innerHeight * 1.4 + panMax * 1.2 + innerHeight) + 'px';
      frame();
    };
    addEventListener('scroll', frame, { passive: true }); addEventListener('resize', layout); layout();
  }
})();
