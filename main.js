/* Behaviour for index.html and work.html. Content lives in data.js. */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const has = name => { try { return typeof eval(name) !== 'undefined'; } catch { return false; } };
  const fmt = t => { t = Math.max(0, Math.floor(t || 0)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
  const ICON = {
    play: 'M8 5v14l11-7z', pause: 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z',
    muted: 'M4 9v6h4l5 4V5L8 9H4zm12.6 3 2.7-2.7-1.1-1.1-2.7 2.7-2.7-2.7-1.1 1.1 2.7 2.7-2.7 2.7 1.1 1.1 2.7-2.7 2.7 2.7 1.1-1.1z',
    sound: 'M4 9v6h4l5 4V5L8 9H4zm11.5 3A4.5 4.5 0 0 0 13 8v8a4.5 4.5 0 0 0 2.5-4zM13 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z',
    replay: 'M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z'
  };
  const svg = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
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
      $$('#menu .hl > li').forEach((li, i) => li.style.transitionDelay = o ? (80 + i * 40) + 'ms' : '0ms');
    };
    btn.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
    $$('#menu a').forEach(a => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }

  /* ---------- Homepage videos ---------- */
  $$('[data-bg]').forEach(el => { const f = iframe(VIDEOS[el.dataset.bg], true, 'Showreel (background)'); f.loading = 'eager'; f.tabIndex = -1; f.setAttribute('aria-hidden', 'true'); el.appendChild(f); });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    if (e.target.hasAttribute('data-custom')) customReel(e.target);
    else e.target.appendChild(iframe(VIDEOS[e.target.dataset.embed], false, e.target.dataset.title));
    io.unobserve(e.target);
  }), { rootMargin: '400px' });
  // showreel: Vimeo's own bar hidden; a play / pause symbol of ours appears when you hover over the film
  // showreel: Vimeo's own bar hidden. Ours: a hollow play button, then a scrub bar, sound and full screen
  function customReel(el) {
    const frame = el.closest('.frame'), btn = $('.reel-play', frame), pc = $('.reel-pc', frame);
    const f = document.createElement('iframe');
    f.src = `https://player.vimeo.com/video/${VIDEOS[el.dataset.embed]}?controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1&autopause=1`;
    f.title = el.dataset.title || 'Showreel'; f.allow = 'autoplay; fullscreen; picture-in-picture'; f.tabIndex = -1;
    el.appendChild(f);
    const start = () => {
      const pl = new Vimeo.Player(f); let playing = false, dur = 0, muted = false, dragging = false, idleT;
      const playI = $('.rp-play path', pc), muteI = $('.rp-mute path', pc), bar = $('.bar', pc), fill = $('b', bar), knob = $('s', bar), tm = $('.tm', pc);
      const show = t => { const p = dur ? t / dur : 0; fill.style.width = knob.style.left = (p * 100) + '%'; tm.textContent = `${fmt(t)} / ${fmt(dur)}`; bar.setAttribute('aria-valuenow', Math.round(p * 100)); };
      const wake = () => { frame.classList.remove('idle'); clearTimeout(idleT); if (playing) idleT = setTimeout(() => frame.classList.add('idle'), 2600); };
      const set = on => { playing = on; frame.classList.toggle('playing', on); frame.classList.add('started'); playI.setAttribute('d', on ? ICON.pause : ICON.play); $('.rp-play', pc).setAttribute('aria-label', on ? 'Pause' : 'Play'); btn.setAttribute('aria-label', on ? 'Pause the showreel' : 'Play the showreel'); wake(); };
      pl.getDuration().then(d => { dur = d; show(0); }).catch(() => {});
      pl.on('timeupdate', d => { dur = d.duration || dur; if (!dragging) show(d.seconds); });
      pl.on('play', () => set(true)); pl.on('pause', () => set(false)); pl.on('ended', () => set(false));
      const toggle = () => { if (playing) pl.pause(); else { if (!muted) pl.setVolume(1).catch(() => {}); pl.play().catch(() => {}); } };
      btn.addEventListener('click', toggle); $('.rp-play', pc).addEventListener('click', toggle);
      $('.rp-mute', pc).addEventListener('click', () => { muted = !muted; pl.setMuted(muted).catch(() => {}); if (!muted) pl.setVolume(1).catch(() => {}); muteI.setAttribute('d', muted ? ICON.muted : ICON.sound); $('.rp-mute', pc).setAttribute('aria-label', muted ? 'Turn sound on' : 'Mute'); });
      const seekTo = x => { const r = bar.getBoundingClientRect(), t = clamp((x - r.left) / r.width, 0, 1) * dur; show(t); return t; };
      bar.addEventListener('pointerdown', e => { dragging = true; bar.classList.add('drag'); bar.setPointerCapture(e.pointerId); seekTo(e.clientX); });
      bar.addEventListener('pointermove', e => { if (dragging) seekTo(e.clientX); });
      bar.addEventListener('pointerup', e => { if (!dragging) return; dragging = false; bar.classList.remove('drag'); pl.setCurrentTime(seekTo(e.clientX)).catch(() => {}); });
      bar.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') pl.getCurrentTime().then(t => pl.setCurrentTime(clamp(t + (e.key === 'ArrowRight' ? 5 : -5), 0, dur))); });
      // full screen: the whole frame (so our controls come too); phones without that fall back to Vimeo's own
      $('.rp-fs', pc).addEventListener('click', () => {
        const d = document;
        if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
        else if (frame.requestFullscreen) frame.requestFullscreen().catch(() => pl.requestFullscreen().catch(() => {}));
        else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
        else pl.requestFullscreen().catch(() => {});
      });
      ['mousemove', 'pointerdown', 'keydown'].forEach(ev => frame.addEventListener(ev, wake, { passive: true }));
      // pause it if you scroll away while it's playing
      new IntersectionObserver(es => { if (!es[0].isIntersecting && playing) pl.pause(); }, { threshold: .15 }).observe(frame);
    };
    if (window.Vimeo && Vimeo.Player) start();
    else { const sc = document.createElement('script'); sc.src = 'https://player.vimeo.com/api/player.js'; sc.onload = start; sc.onerror = () => { btn.hidden = pc.hidden = true; f.src = f.src.replace('controls=0&', ''); }; document.head.appendChild(sc); }
  }
  $$('[data-embed]').forEach(el => io.observe(el));

  /* ---------- Showreel: the film sits still underneath and is uncovered as the page above slides away ---------- */
  const reelF = $('.reel .frame'), reelIn = $('.reel .frame-in');
  if (reelF && reelIn && !reduce) {
    reelF.addEventListener('fullscreenchange', () => { reelIn.style.transform = reelIn.style.filter = ''; });
    const reelPin = reelF.parentElement;
    const reelFx = () => {
      // the film is already pinned in place while the page above slides off it (see .reel-pin);
      // as it is uncovered it settles from slightly zoomed and dim to normal…
      const r = reelF.getBoundingClientRect(), H = r.height, T = Math.max(0, (innerHeight - H) / 2);
      const p = clamp((reelPin.getBoundingClientRect().top + H - T) / Math.max(1, H), 0, 1);
      // …holds for a moment, and once the page moves on it slowly blurs and darkens as Projects takes over, like the landing film
      const out = clamp((T - r.top - H * .3) / (H * .7 + innerHeight * .25), 0, 1);
      reelIn.style.transform = p ? `scale(${(1 + 0.08 * p).toFixed(4)})` : out ? `scale(${(1 + .04 * out).toFixed(4)})` : '';
      reelIn.style.filter = p ? `brightness(${(1 - 0.45 * p).toFixed(3)})` : out ? `blur(${(out * 12).toFixed(1)}px) brightness(${(1 - .6 * out).toFixed(3)})` : '';
    };
    addEventListener('scroll', reelFx, { passive: true }); addEventListener('resize', reelFx); reelFx();
  }

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

  /* ---------- Name sized to the role line; hero video blurs as it leaves ---------- */
  const idBlock = $('#idBlock');
  const fitName = () => {
    if (!idBlock) return;
    const nm = $('.nm', idBlock), role = $('.role', idBlock);
    nm.style.fontSize = '44px';
    const k = role.getBoundingClientRect().width / nm.getBoundingClientRect().width;
    nm.style.fontSize = (44 * k).toFixed(2) + 'px';
  };
  if (idBlock) {
    fitName(); (document.fonts?.ready || Promise.resolve()).then(fitName);
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(fitName, 120); });
  }
  const vbg = $('.hero .vbg'), fade = $('.hero .fade'), heroBox = $('.hero');
  const heroFx = () => {
    if (!vbg || reduce) return;
    // only start blurring once the whole video has been seen (matters on short, landscape screens)
    const start = Math.max(0, (heroBox ? heroBox.offsetHeight : innerHeight) - innerHeight);
    const p = clamp((scrollY - start) / (innerHeight * 0.85), 0, 1);
    vbg.style.filter = `blur(${(p * 16).toFixed(1)}px) brightness(${(1 - p * 0.55).toFixed(2)})`;
    vbg.style.setProperty('--hs', (1 + p * 0.06).toFixed(4));
    if (fade) fade.style.opacity = p.toFixed(2);
  };
  if (vbg) { addEventListener('scroll', heroFx, { passive: true }); heroFx(); }

  /* ---------- Bio: words light up as they pass; portrait drifts ---------- */
  const wordEls = [];
  $$('[data-words]').forEach(p => {
    p.innerHTML = p.textContent.trim().split(/\s+/).map(w => `<span class="w">${esc(w)}</span>`).join(' ');
    wordEls.push(...$$('.w', p));
  });
  const photo = $('.bio .photo');
  if (!reduce && (wordEls.length || photo)) {
    const upd = () => {
      // words light one by one, left to right, as each line rises past a point just above the middle of the screen
      // (always in reading order: a word only lights once every word before it in the paragraph is lit)
      const line = innerHeight * 0.55;
      let para = null, pr = null, L = 0, stop = false;
      wordEls.forEach(w => {
        if (w.parentElement !== para) {
          para = w.parentElement; pr = para.getBoundingClientRect(); stop = false;
          L = parseFloat(getComputedStyle(para).lineHeight) || w.offsetHeight * 1.5;
        }
        const r = w.getBoundingClientRect(), along = (r.left - pr.left) / Math.max(1, pr.width);
        const on = !stop && r.top + along * L * 0.9 < line;
        if (!on) stop = true;
        w.classList.toggle('lit', on);
      });
      if (photo) {
        const r = photo.getBoundingClientRect();
        const p = clamp((r.top + r.height / 2 - innerHeight / 2) / innerHeight, -1, 1);
        photo.style.setProperty('--py', (p * 6 - 6) + '%');
      }
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }

  /* ---------- Projects: DVD stack (closed → hover zooms & colours → click opens full bleed) ---------- */
  const stack = $('#stack');
  if (stack && has('PROJECTS')) {
    stack.innerHTML = PROJECTS.map(p => `
      <article class="dvd" tabindex="0" role="button" aria-expanded="false" aria-label="${esc(p.title)} — ${esc(p.broadcaster)}, ${esc(p.role)}, ${esc(p.date)}">
        ${p.image ? `<div class="bg" style="background-image:url('${esc(p.image)}');--focus:${esc(p.focus || '50%')}" data-src="${esc(p.image)}"></div>`
                  : `<div class="bg ph">[ Image to come — ${esc(p.title)} ]</div>`}
        <div class="spine"><div class="l"><span class="ti">${esc(p.title)}</span><span class="br">— ${esc(p.broadcaster)}</span></div><span class="ro">${esc(p.role)}<span class="dt"> · ${esc(p.date)}</span></span></div>
        <div class="detail"><p>${esc(p.description)}</p></div>
      </article>`).join('');
    const dvds = $$('.dvd', stack);
    const ratio = new Map();
    dvds.forEach(d => { const bg = $('.bg', d); if (!bg?.dataset.src) return; const im = new Image(); im.onload = () => { ratio.set(d, im.naturalHeight / im.naturalWidth); if (d.classList.contains('open')) size(d); }; im.src = bg.dataset.src; });
    const size = d => { d.style.height = d.classList.contains('open') ? Math.round(d.clientWidth * (ratio.get(d) || 0.5625)) + 'px' : ''; };
    let anim = 0;
    const toggle = el => {
      const opening = !el.classList.contains('open');
      const before = el.getBoundingClientRect().top;
      dvds.forEach(d => { const o = d === el && opening; d.classList.toggle('open', o); d.setAttribute('aria-expanded', o); size(d); });
      if (reduce) return;
      // keep the clicked item where it is while the others resize, so nothing jumps
      cancelAnimationFrame(anim); const t0 = performance.now();
      const hold = () => {
        const diff = el.getBoundingClientRect().top - before;
        if (Math.abs(diff) > 0.5) window.scrollTo({ top: scrollY + diff, behavior: 'instant' });
        if (performance.now() - t0 < 950) anim = requestAnimationFrame(hold);
      };
      anim = requestAnimationFrame(hold);
    };
    dvds.forEach(d => {
      d.addEventListener('click', () => toggle(d));
      d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(d); } });
    });
    addEventListener('resize', () => dvds.forEach(size));
  }

  /* ---------- Documentary gallery: description on hover, "Read more" if it's long ---------- */
  const docTrack = $('#docTrack');
  if (docTrack && has('DOCUMENTARIES')) {
    docTrack.innerHTML = DOCUMENTARIES.map(d => `
      <${d.link ? `a href="${esc(d.link)}"` : 'div tabindex="0"'} class="card">
        <div class="pic">${d.image ? `<img src="${esc(d.image)}" alt="${esc(d.title)} poster" loading="lazy">` : `<div class="ph" style="height:100%">[ 9:16 poster — ${esc(d.title)} ]</div>`}
          <div class="desc"><p>${esc(d.description)}</p><button type="button" class="rm">Read more +</button></div></div>
        <div><h3>${esc(d.title)}</h3><div class="m">${esc(d.for)} · ${esc(d.role)} · ${esc(d.date)}</div></div>
      </${d.link ? 'a' : 'div'}>`).join('');
    const clampCheck = () => $$('.desc', docTrack).forEach(ds => {
      if (ds.classList.contains('full')) return;
      const p = $('p', ds), lines = Math.max(4, Math.floor((ds.clientHeight - 90) / (parseFloat(getComputedStyle(p).lineHeight) || 22)));
      ds.style.setProperty('--lines', lines);
      ds.classList.toggle('clamped', p.scrollHeight > p.clientHeight + 2);
    });
    $$('.rm', docTrack).forEach(b => b.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const ds = b.parentElement, full = !ds.classList.contains('full');
      ds.classList.toggle('full', full); b.textContent = full ? 'Show less −' : 'Read more +';
    }));
    $$('.card', docTrack).forEach(c => c.addEventListener('mouseleave', () => {
      const ds = $('.desc', c); if (ds.classList.contains('full')) { ds.classList.remove('full'); $('.rm', ds).textContent = 'Read more +'; ds.scrollTop = 0; }
    }));
    addEventListener('resize', clampCheck); setTimeout(clampCheck, 50); addEventListener('load', clampCheck);
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

  /* ---------- Credits: departures / arrivals board ---------- */
  const rowsEl = $('#boardRows');
  if (rowsEl && has('DIARY')) {
    $('#updated').textContent = LAST_UPDATED;
    const cls = s => /nda/i.test(s) ? 'nda' : /released/i.test(s) ? 'rel' : /production/i.test(s) ? 'prod' : 'soon';   // colours: released green, in production blue, coming soon yellow, NDA red
    const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/–';
    let run = 0;
    // Each row "reads out" in turn, top to bottom; letters settle left to right like a split-flap board.
    const flapRows = () => {
      if (reduce) return;
      const id = ++run;
      $$('tr', rowsEl).forEach((tr, r) => {
        const cells = $$('.fl', tr).map(el => ({ el, target: el.dataset.t }));
        cells.forEach(c => c.el.textContent = c.target.replace(/[^\s]/g, () => CH[Math.floor(Math.random() * CH.length)]));
        const start = performance.now() + r * 120, dur = 1100;
        const tick = now => {
          if (id !== run) return;
          const t = (now - start) / dur;
          cells.forEach(({ el, target }) => {
            el.textContent = [...target].map((ch, i) => (ch === ' ' || t > (i + 1) / target.length) ? ch : CH[Math.floor(Math.random() * CH.length)]).join('');
          });
          if (t < 1.05) requestAnimationFrame(tick); else cells.forEach(({ el, target }) => el.textContent = target);
        };
        requestAnimationFrame(tick);
      });
    };
    const more = $('#boardMore'); let mode = 'dep', all = false; const LIMIT = 8;
    const LABEL = { dep: 'Released', arr: 'In production · Coming soon · Under NDA' };
    const render = () => {
      const rows = DIARY.filter(r => (cls(r.status) === 'rel') === (mode === 'dep'));
      const shown = all ? rows : rows.slice(0, LIMIT);
      $('#boardLabel').textContent = LABEL[mode];
      const cell = t => `<span class="fl" data-t="${esc(t)}">${esc(t)}</span>`;
      rowsEl.innerHTML = shown.length ? shown.map(r => `<tr>
          <td class="dt">${cell(r.dates)}</td><td class="pj">${cell(r.project)}</td><td class="ds${!r.dest || r.dest === '—' ? ' none' : ''}">${cell(r.dest || '—')}</td>
          <td class="fo">${cell(r.for)}</td><td class="ro">${cell(r.role)}</td>
          <td class="st ${cls(r.status)}"><span>${esc(r.status)}</span></td></tr>`).join('')
        : `<tr><td colspan="6" class="empty">Nothing ${mode === 'dep' ? 'outbound' : 'inbound'} listed.</td></tr>`;
      flapRows();
      if (more) { more.hidden = rows.length <= LIMIT; more.textContent = all ? 'Show fewer ↑' : `Show all ${rows.length} ↓`; }
    };
    $$('.toggle button').forEach(b => b.addEventListener('click', () => {
      $$('.toggle button').forEach(x => x.setAttribute('aria-pressed', x === b));
      mode = b.dataset.mode; all = false; render();
    }));
    if (more) more.addEventListener('click', () => { all = !all; render(); });
    render();
    // play the read-out once when the board first scrolls into view
    const bo = new IntersectionObserver(es => { if (es[0].isIntersecting) { flapRows(); bo.disconnect(); } }, { threshold: 0.3 });
    bo.observe(rowsEl);
  }

  /* ---------- A little weather: soft clouds that drift through a few sections (and the menu), parting around the cursor ---------- */
  const drifts = $$('[data-clouds]');
  if (drifts.length && !reduce) {
    // Each cloud image is painted once, in the background, from swirled layered noise and lit from the
    // upper left: bright tops, soft grey undersides, wispy edges (top-down, like the Field Map's weather).
    const idle = f => (window.requestIdleCallback ? requestIdleCallback(f, { timeout: 2500 }) : setTimeout(f, 400));
    // The pixels are worked out on a background thread (a Web Worker), so the page never waits on them
    const WORKER = `onmessage = e => { const { seed, w, h } = e.data, D = new Uint8ClampedArray(w * h * 4);
    const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453; return s - Math.floor(s); };
      const noise = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
        const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10), v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
        const a = hash(xi, yi), b = hash(xi + 1, yi), c2 = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
        return a + (b - a) * u + (c2 - a) * v + (a - b - c2 + d) * u * v; };
      const fbm = (x, y, o) => { let s = 0, a = .5, n = 0; for (let k = 0; k < o; k++) { s += a * noise(x, y); n += a; x = x * 2.02 + 17.3; y = y * 2.02 + 9.1; a *= .5; } return s / n; };
      const sc = w / 7;                                         // feature size
      const row = y => { for (let x = 0; x < w; x++) {
        const px = x / sc, py = y / sc;
        const wx = fbm(px * .6 + 3.1, py * .6 + 7.7, 3), wy = fbm(px * .6 + 9.4, py * .6 + 1.3, 3);   // swirl
        const qx = px + (wx - .5) * 1.0, qy = py + (wy - .5) * 1.0;
        const n = fbm(qx, qy, 7), nl = fbm(qx - .12, qy - .16, 5);                                  // density + a step towards the light
        const ex = (x / w - .5) * 2, ey = (y / h - .5) * 2, m = Math.max(0, 1 - (ex * ex + ey * ey * 1.25));
        const dens = n * (.25 + 1.1 * Math.pow(m, .7));
        let a = (dens - .38) / .28; a = a < 0 ? 0 : a > 1 ? 1 : a; a = a * a * (3 - 2 * a);
        let lit = .62 + (n - nl) * 4.2 + (dens - .5) * .5; lit = lit < 0 ? 0 : lit > 1 ? 1 : lit;
        const i4 = (y * w + x) * 4, base = 150 + 104 * lit;
        D[i4] = base; D[i4 + 1] = base + 2; D[i4 + 2] = base + 6; D[i4 + 3] = a * 255;
      } };
      for (let y = 0; y < h; y++) row(y);
      postMessage({ D, w, h }, [D.buffer]); };`;
    let worker = null;
    try { worker = new Worker(URL.createObjectURL(new Blob([WORKER], { type: 'text/javascript' }))); } catch (_) {}
    const toURL = (D, w, h) => new Promise(ok => { const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').putImageData(new ImageData(D, w, h), 0, 0); c.toBlob(b => ok(b ? URL.createObjectURL(b) : c.toDataURL()), 'image/png'); });
    const paintCloud = (seed, w, h) => new Promise(ok => {
      if (worker) { worker.onmessage = e => ok(toURL(e.data.D, e.data.w, e.data.h)); worker.postMessage({ seed, w, h }); }
      else { // no workers: paint in small idle slices instead
        const D = new Uint8ClampedArray(w * h * 4);
      const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453; return s - Math.floor(s); };
        const noise = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
          const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10), v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
          const a = hash(xi, yi), b = hash(xi + 1, yi), c2 = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
          return a + (b - a) * u + (c2 - a) * v + (a - b - c2 + d) * u * v; };
        const fbm = (x, y, o) => { let s = 0, a = .5, n = 0; for (let k = 0; k < o; k++) { s += a * noise(x, y); n += a; x = x * 2.02 + 17.3; y = y * 2.02 + 9.1; a *= .5; } return s / n; };
        const sc = w / 7;                                         // feature size
        const row = y => { for (let x = 0; x < w; x++) {
          const px = x / sc, py = y / sc;
          const wx = fbm(px * .6 + 3.1, py * .6 + 7.7, 3), wy = fbm(px * .6 + 9.4, py * .6 + 1.3, 3);   // swirl
          const qx = px + (wx - .5) * 1.0, qy = py + (wy - .5) * 1.0;
          const n = fbm(qx, qy, 7), nl = fbm(qx - .12, qy - .16, 5);                                  // density + a step towards the light
          const ex = (x / w - .5) * 2, ey = (y / h - .5) * 2, m = Math.max(0, 1 - (ex * ex + ey * ey * 1.25));
          const dens = n * (.25 + 1.1 * Math.pow(m, .7));
          let a = (dens - .38) / .28; a = a < 0 ? 0 : a > 1 ? 1 : a; a = a * a * (3 - 2 * a);
          let lit = .62 + (n - nl) * 4.2 + (dens - .5) * .5; lit = lit < 0 ? 0 : lit > 1 ? 1 : lit;
          const i4 = (y * w + x) * 4, base = 150 + 104 * lit;
          D[i4] = base; D[i4 + 1] = base + 2; D[i4 + 2] = base + 6; D[i4 + 3] = a * 255;
        } };
          let y = 0;
        const slice = () => { const until = performance.now() + 8; while (y < h && performance.now() < until) row(y++); if (y < h) idle(slice); else ok(toURL(D, w, h)); };
        idle(slice);
      }
    });
    const mouse = { x: -1e4, y: -1e4 };
    addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    // paint one image at a time on the background thread
    const sprites = [];
    const SW = innerWidth < 760 ? 480 : 640;   // smaller canvases on phones
    const paintNext = async () => { sprites.push(await paintCloud(3 + sprites.length * 11, SW, Math.round(SW * .6))); if (sprites.length < 3) paintNext(); else start(); };
    addEventListener('load', paintNext);
    const menuOpen = () => document.body.classList.contains('menu-open');
    function start() {
      drifts.forEach((box, bi) => {
        const n = +box.dataset.clouds || 2, alpha = +box.dataset.alpha || 1, inMenu = !!box.closest('.menu');
        // evenly spaced around one loop that runs from just off the left edge to just off the right, all at the
        // same pace — so as one leaves on the right another is already coming in on the left, and they never bunch
        const L0 = -.45, SPAN = 1.9, V = .0065 + bi * .0007;
        let seed = 7 + bi * 31; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
        const reshape = c => { c.y = .08 + rnd() * .84; c.s = 1 + rnd() * .8; c.a = (.14 + rnd() * .07) * alpha; c.flip = rnd() < .5; c.el.src = sprites[Math.floor(rnd() * sprites.length)]; };
        const clouds = Array.from({ length: n }, (_, i) => {
          const el = new Image(); el.alt = ''; el.decoding = 'async'; box.appendChild(el);
          const c = { el, x: L0 + (i + rnd() * .3) * SPAN / n, px: 0, py: 0, fade: 1 }; reshape(c); return c;
        });
        let on = false, last = performance.now();
        const tick = now => {
          if (!on || (inMenu && !menuOpen())) { on = false; return; }
          const dt = Math.min(.05, (now - last) / 1000); last = now;
          const r = box.getBoundingClientRect();
          clouds.forEach(c => {
            c.x += V * dt; if (c.x > L0 + SPAN) { c.x -= SPAN; reshape(c); }   // drift slowly across; re-enter on the left as a new cloud
            const w = Math.min(760, 520 * c.s * Math.max(.75, r.width / 1500)), cx = r.left + c.x * r.width, cy = r.top + c.y * r.height;
            const dx = cx - mouse.x, dy = cy - mouse.y, dist = Math.hypot(dx, dy), reach = w * .6;
            const f = dist < reach ? (1 - dist / reach) : 0;           // the cursor parts them, then they ease back
            c.px += ((dist ? dx / dist : 0) * f * 110 - c.px) * Math.min(1, dt * 2.5);
            c.py += ((dist ? dy / dist : 0) * f * 70 - c.py) * Math.min(1, dt * 2.5);
            c.fade += ((1 - f * .75) - c.fade) * Math.min(1, dt * 3);
            c.el.style.width = w + 'px';
            c.el.style.transform = `translate(${(c.x * r.width - w / 2 + c.px).toFixed(1)}px, ${(c.y * r.height - w * .3 + c.py).toFixed(1)}px)${c.flip ? ' scaleX(-1)' : ''}`;
            c.el.style.opacity = (c.a * c.fade).toFixed(3);
          });
          requestAnimationFrame(tick);
        };
        const go = () => { if (on) return; on = true; last = performance.now(); requestAnimationFrame(tick); };
        if (inMenu) new MutationObserver(() => { if (menuOpen()) go(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
        else new IntersectionObserver(es => { if (es[0].isIntersecting) go(); else on = false; }).observe(box);
      });
    }
  }

  /* ---------- Field Map: numbers from the credits board; the yellow one counts up like an arcade score ---------- */
  const fmS = $('#fmShoots'), fmC = $('#fmCountries');
  if (fmS && has('DIARY') && has('PLACES')) {
    const nShoots = DIARY.length, set = new Set();
    DIARY.forEach(r => (PLACES[r.dest] || []).forEach(p => set.add(p[1])));
    const nC = set.size || +fmC.textContent;
    fmS.textContent = nShoots; fmC.textContent = nC;
    fmC.style.minWidth = String(nC).length + 'ch';
    if (!reduce) {
      fmC.textContent = 1;
      // reels up from 1, one number at a time: quick at first, easing off as it nears the total
      const run = () => {
        let v = 1; fmC.textContent = v; fmC.classList.add('counting');
        const step = () => {
          if (v >= nC) { fmC.classList.remove('counting'); return; }
          v++; fmC.textContent = v;
          const f = v / nC;                       // 0 → 1 through the count
          setTimeout(step, 40 + 380 * Math.pow(f, 4));
        };
        setTimeout(step, 60);
      };
      const co = new IntersectionObserver(es => { if (es[0].isIntersecting) { co.disconnect(); setTimeout(run, 250); } }, { threshold: .6 });
      co.observe(fmC.closest('h2'));
    }
  }

  /* ---------- Field Map: load the turning globe only as its section comes near ---------- */
  const fmBox = $('#fmGlobe');
  if (fmBox) {
    const FMV = '20261009x';
    const load = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
    const lo = new IntersectionObserver(async es => {
      if (!es[0].isIntersecting) return; lo.disconnect();
      try {
        if (!window.d3) await load('https://cdn.jsdelivr.net/npm/d3@7.8.5/dist/d3.min.js');
        if (!window.topojson) await load('https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js');
        for (const f of ['geo', 'sky', 'teaser']) await load(`fieldmap/${f}.js?v=${FMV}`);
      } catch (e) { fmBox.classList.add('off'); }
    }, { rootMargin: '900px' });
    lo.observe(fmBox);
  }

  /* =====================================================================
     OTHER-WORK PAGES
     ===================================================================== */
  const pin = $('#wkPin');
  if (!pin || !has('OTHER_WORK')) return;
  const key = new URLSearchParams(location.search).get('s') || 'restaurants';
  const S = OTHER_WORK[key] || OTHER_WORK.restaurants;
  document.title = `${S.title} — Christian Marot, Cinematographer`;
  $$('[data-wk="group"]').forEach(e => e.textContent = S.group);
  $$('[data-wk="title"]').forEach(e => e.textContent = S.title);
  const fv = $('#wkFv'); if (fv && S.hero && S.heroTitle) { fv.textContent = `Featured video: ${S.heroTitle}`; fv.hidden = false; }
  const keys = Object.keys(OTHER_WORK), ix = keys.indexOf(key);
  const nx = keys[(ix + 1) % keys.length], pv = keys[(ix - 1 + keys.length) % keys.length];
  $('#wkNext').href = `work.html?s=${nx}`; $('#wkNext').textContent = `${OTHER_WORK[nx].title} →`;
  $('#wkPrev').href = `work.html?s=${pv}`; $('#wkPrev').textContent = `← ${OTHER_WORK[pv].title}`;
  const activated = () => (navigator.userActivation ? navigator.userActivation.hasBeenActive : userTouched);
  let userTouched = false; ['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, () => userTouched = true, { once: true, capture: true }));

  /* ---------- Hero: Vimeo with bespoke controls (play/pause, scrub, sound) ---------- */
  const hbg = $('#wkHeroBg'), heroEl = $('.wk-hero');
  let heroPlayer = null;
  if (hbg) {
    if (S.heroZoom) hbg.style.setProperty('--hz', S.heroZoom);
    if (S.hero) {
      const f = document.createElement('iframe');
      f.src = `https://player.vimeo.com/video/${S.hero}?autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&autopause=0&dnt=1&playsinline=1`;
      f.allow = 'autoplay; fullscreen; picture-in-picture'; f.title = `${S.title} — featured film`;
      if (S.heroZoom) f.style.transform = `translate(-50%,-50%) scale(${S.heroZoom})`;
      hbg.appendChild(f);
      if (window.Vimeo && Vimeo.Player) {
        heroPlayer = new Vimeo.Player(f);
        const pc = $('#pc'); pc.hidden = false;
        const playB = $('#pcPlay'), playI = $('#pcPlayIcon'), muteB = $('#pcMute'), muteI = $('#pcMuteIcon');
        const bar = $('#pcBar'), fill = $('#pcFill'), knob = $('#pcKnob'), tm = $('#pcTime');
        let dur = 0, paused = false, muted = true, dragging = false;
        heroPlayer.getDuration().then(d => dur = d).catch(() => {});
        const show = (t) => { const p = dur ? t / dur : 0; fill.style.width = knob.style.left = (p * 100) + '%'; tm.textContent = `${fmt(t)} / ${fmt(dur)}`; bar.setAttribute('aria-valuenow', Math.round(p * 100)); };
        heroPlayer.on('timeupdate', d => { dur = d.duration || dur; if (!dragging) show(d.seconds); });
        heroPlayer.on('play', () => { paused = false; playI.setAttribute('d', ICON.pause); playB.setAttribute('aria-label', 'Pause'); });
        heroPlayer.on('pause', () => { paused = true; playI.setAttribute('d', ICON.play); playB.setAttribute('aria-label', 'Play'); });
        playB.onclick = () => paused ? heroPlayer.play() : heroPlayer.pause();
        muteB.onclick = () => {
          muted = !muted; heroPlayer.setMuted(muted); if (!muted) heroPlayer.setVolume(1);
          muteI.setAttribute('d', muted ? ICON.muted : ICON.sound); muteB.setAttribute('aria-label', muted ? 'Turn sound on' : 'Mute');
        };
        const seekTo = x => { const r = bar.getBoundingClientRect(); const p = clamp((x - r.left) / r.width, 0, 1); show(p * dur); return p * dur; };
        bar.addEventListener('pointerdown', e => { dragging = true; bar.classList.add('drag'); bar.setPointerCapture(e.pointerId); seekTo(e.clientX); });
        bar.addEventListener('pointermove', e => { if (dragging) seekTo(e.clientX); });
        bar.addEventListener('pointerup', e => { if (!dragging) return; dragging = false; bar.classList.remove('drag'); heroPlayer.setCurrentTime(seekTo(e.clientX)); });
        bar.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') heroPlayer.getCurrentTime().then(t => heroPlayer.setCurrentTime(clamp(t + (e.key === 'ArrowRight' ? 5 : -5), 0, dur))); });
        // pause the film (and its sound) once you scroll into the page, resume when you come back
        new IntersectionObserver(es => { const v = es[0].intersectionRatio; if (v < 0.35) heroPlayer.pause(); else if (!paused || v > 0.9) heroPlayer.play().catch(() => {}); }, { threshold: [0, 0.35, 0.9] }).observe(heroEl);
      }
      // titles + controls fade away after ~2.25s without mouse movement, and return on any movement
      let idleT;
      // (scrolling counts as activity, so coming back up to the film shows the titles again, then they fade;
      //  a button only holds them on screen while it has keyboard focus, not after a mouse click or tap)
      const holding = () => { const a = document.activeElement; return a && a !== document.body && heroEl.contains(a) && a.matches(':focus-visible'); };
      const wake = () => { heroEl.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => { if (!holding()) heroEl.classList.add('idle'); }, 2250); };
      ['mousemove', 'pointerdown', 'touchstart', 'keydown', 'wheel', 'scroll'].forEach(ev => addEventListener(ev, wake, { passive: true }));
      wake();
      // phones held upright: tap the film to see it whole (16:9) instead of cropped; tap again to return
      const portrait = matchMedia('(max-width: 760px) and (orientation: portrait)');
      heroEl.addEventListener('click', e => { if (!portrait.matches || e.target.closest('.pc')) return; heroEl.classList.toggle('fit'); });
    } else hbg.innerHTML = `<img src="${esc(S.cover)}" alt="">`;
  }

  /* ---------- Build the blocks ---------- */
  const projects = S.projects || [{ client: S.group, title: S.title, blocks: [{ type: 'grid', items: S.tiles || [] }] }];
  const row = document.createElement('div'); row.className = 'wk-row'; pin.appendChild(row);
  const mkVideo = (v, extra = '') => v.video
    ? `<div class="it vid${extra}" data-src="${esc(v.video)}" ${v.audio ? 'data-audio' : ''} ${v.once ? 'data-once' : ''}><video muted playsinline preload="none" ${v.once ? '' : 'loop'} ${v.poster ? `poster="${esc(v.poster)}"` : ''}></video>
        ${v.audio ? `<div class="vc"><button type="button" class="snd" aria-label="Turn sound on">${svg(ICON.muted)}<span>Sound</span></button></div>` : ''}
        ${v.once ? `<button type="button" class="replay" aria-label="Replay">${'<span>' + svg(ICON.replay) + 'Replay</span>'}</button>` : ''}</div>`
    : `<div class="it ph"><div class="ph" style="height:100%">[ ${esc(v.note || '9:16 clip to come')} ]</div></div>`;
  const blocksHTML = (p, pi) => p.blocks.map(b => {
    const pa = `data-p="${pi}"`;
    switch (b.type) {
      case 'feature': return `<div class="blk feat big" ${pa}>${mkVideo(b)}</div>`;
      case 'secondary': return `<div class="blk b2x2" ${pa}>${(b.videos || []).slice(0, 4).map(v => mkVideo(v)).join('')}</div>`;
      case 'hvideo': return `<div class="blk hv" ${pa}>${mkVideo(b)}</div>`;
      case 'hphoto': return `<div class="blk hp" ${pa}><div class="it"><img src="${esc(b.image)}" alt="" loading="lazy"></div></div>`;
      case 'fphoto': return `<div class="blk fp" ${pa}><div class="it"><img src="${esc(b.image)}" alt="" loading="lazy"></div></div>`;
      case 'sphoto': return `<div class="blk sph" ${pa}>${(b.images || []).slice(0, 4).map(i => `<div class="it"><img src="${esc(i)}" alt="" loading="lazy"></div>`).join('')}</div>`;
      case 'text': case 'titletext': return `<div class="blk txt it" ${pa} style="background:none">${b.type === 'titletext' ? `<div class="k">${esc(p.client || S.group)}</div><h2>${esc(b.title || p.title)}</h2>` : ''}${(b.text || []).map(t => `<p>${esc(t)}</p>`).join('')}</div>`;
      case 'grid': { const items = [...b.items]; while (items.length < 12) items.push({}); return items.map(t => `<div class="blk feat" ${pa}>${t.image ? `<div class="it"><img src="${esc(t.image)}" alt="" loading="lazy"></div>` : mkVideo(t)}</div>`).join(''); }
    }
    return '';
  }).join('');
  const sepHTML = (p, i) => `<div class="sep" aria-hidden="true"><span>${String(i + 1).padStart(2, '0')} — ${esc(p.title)}</span></div>`;
  row.innerHTML = projects.map((p, i) => (projects.length > 1 ? sepHTML(p, i) : '') + blocksHTML(p, i)).join('');
  const blks = $$('.blk', row), items = $$('.it, .sep', row);
  const firstTxt = $('.blk.txt', row);

  // sizes: featured 9:16 fills from under the menu to above the title; secondary = 2×2 of the same width
  let H = 0, panMax = 0, gatherLen = 0, rowTop = 200; const LEAD = 0.75;
  const stage = $('#wkStage');
  const layout = () => {
    const hdr = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr')) || 92;
    const top = hdr + 8, bottom = innerWidth < 760 ? 120 : 150;
    H = Math.max(260, innerHeight - top - bottom);
    const fw = Math.round(H * 9 / 16), gap = 16;
    rowTop = top;     row.style.top = top + 'px'; row.style.gap = gap + 'px';
    $$('.sep', row).forEach(s => s.style.height = H + 'px');
    blks.forEach((b, i) => {
      b.style.height = H + 'px';
      if (b.classList.contains('feat')) b.style.width = fw + 'px';
      else if (b.classList.contains('b2x2') || b.classList.contains('sph')) { const ch = (H - 12) / 2, cw = Math.round(ch * (b.classList.contains('b2x2') ? 9 / 16 : 4 / 5)); b.style.width = (cw * 2 + 12) + 'px'; b.style.gap = '12px'; }
      else if (b.classList.contains('hv') || b.classList.contains('hp')) b.style.width = Math.round(H * 16 / 9) + 'px';
      else if (b.classList.contains('fp')) b.style.width = Math.round(H * 4 / 5) + 'px';
      else if (b.classList.contains('txt')) {
        // as narrow as possible while the text still fits the height of the video beside it
        const pad = innerWidth < 760 ? 24 : 72, tr = b.style.transform; b.style.transform = '';
        const ps = $$('p', b); let fs = 15; ps.forEach(q => q.style.fontSize = '');
        let w, wMax = Math.min(620, innerWidth * 0.82);
        if (innerWidth < 760) {
          // phones: fill the screen width; the opening block must sit fully on screen beside its divider
          const gut = parseFloat(getComputedStyle(row).paddingLeft) || 24;
          w = wMax = (b === firstTxt ? innerWidth - gut - b.offsetLeft : innerWidth - gut * 2) - pad;
        } else w = Math.max(260, Math.min(360, innerWidth * 0.24));
        b.style.width = (w + pad) + 'px';
        while (b.scrollHeight > H + 2 && w < wMax) { w += 20; b.style.width = (w + pad) + 'px'; }
        while (b.scrollHeight > H + 2 && fs > 12) { fs -= 0.5; ps.forEach(q => q.style.fontSize = fs + 'px'); }
        b.style.transform = tr;
      }
    });
    $$('.blk.feat .it, .blk.hv .it, .blk.hp .it, .blk.fp .it', row).forEach(it => it.style.height = '100%');
    panMax = Math.max(0, row.scrollWidth - innerWidth);
    gatherLen = innerHeight * (innerWidth < 760 ? 1.6 : 1.3);
    stage.style.height = (gatherLen - innerHeight * LEAD + panMax * 1.15 + innerHeight * 1.3) + 'px';
    frame();
  };

  // scattered → grid, then sideways
  // entrances, by block:
  //   text + project labels  → rise straight up from below
  //   featured 9:16          → from below, starting small and growing to full size as it lands
  //   4-tile                 → top pair drops in from behind the film above, bottom pair rises from below
  //   anything else          → scattered above and below
  // every clip also drifts in from the side with a slight tilt
  const rnd = (i, k) => { const v = Math.sin(i * k) * 43758.5453; return v - Math.floor(v); };   // 0…1, fixed per item
  const seeds = items.map((el, i) => {
    if (el.classList.contains('txt') || el.classList.contains('sep')) return { x: 0, y: 1.25, r: 0, s: 0 };
    const side = (rnd(i, 12.9898) * 2 - 1) * 1.3, tilt = (rnd(i, 3.7) * 2 - 1) * 9, lift = 0.5 + rnd(i, 78.233) * 0.55;
    const blk = el.parentElement;
    if (blk.classList.contains('big'))
      return { x: side * 0.5, y: lift + 0.15, r: tilt * 0.6, s: 0.5 };
    if (blk.classList.contains('b2x2') || blk.classList.contains('sph')) {
      const top = [...blk.children].indexOf(el) < 2;
      return { x: side, y: (top ? -1 : 1) * lift, r: tilt, s: 0.2 };
    }
    return { x: side, y: (i % 2 ? -1 : 1) * lift, r: tilt, s: 0.25 };
  });
  const wt = $('.wk-title'), wtG = $('#wtG'), wtN = $('#wtN');
  let curP = -1;
  const swap = (box, text) => {
    const old = $('span:not(.out)', box); if (old && old.textContent === text) return;
    const n = document.createElement('span'); n.textContent = text; n.className = 'in'; box.appendChild(n);
    if (old) { old.classList.add('out'); setTimeout(() => old.remove(), 750); }
    requestAnimationFrame(() => requestAnimationFrame(() => n.classList.remove('in')));
  };
  const setProject = i => {
    if (i === curP || !projects[i]) return; curP = i;
    swap(wtG, projects[i].client || S.group); swap(wtN, projects[i].title || S.title);
  };
  let inStage = false;
  function frame() {
    heroFx();
    const r = stage.getBoundingClientRect(), scrolled = -r.top;
    const g = reduce ? 1 : clamp((scrolled + innerHeight * LEAD) / gatherLen, 0, 1);
    const e = 1 - Math.pow(1 - g, 3), k = 1 - e;
    const pan = reduce ? 0 : clamp((scrolled - gatherLen + innerHeight * LEAD) / (panMax * 1.15 || 1), 0, 1);
    const sx = Math.max(innerWidth, 640) * 0.4;
    items.forEach((el, i) => {
      const sd = seeds[i];
      el.style.transform = k < 0.001 ? '' : `translate(${(sd.x * sx * k).toFixed(1)}px, ${(sd.y * innerHeight * k).toFixed(1)}px) rotate(${(sd.r * k).toFixed(2)}deg) scale(${(1 - sd.s * k).toFixed(3)})`;
    });
    row.style.transform = `translateX(${(-pan * panMax).toFixed(1)}px)`;
    inStage = r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.7;
    wt.style.opacity = inStage ? 1 : 0;
    // title = the project taking up most of the screen
    const cover = projects.map(() => 0);
    blks.forEach(b => { const br = b.getBoundingClientRect(); cover[+b.dataset.p] += Math.max(0, Math.min(br.right, innerWidth) - Math.max(br.left, 0)); });
    setProject(cover.indexOf(Math.max(...cover)));
    videoCheck();
  }

  /* ---------- Clip playback: loops play while on screen; "once" clips play with sound when they arrive ---------- */
  const vids = $$('.it.vid', row);
  vids.forEach(it => {
    const v = $('video', it), snd = $('.snd', it), rep = $('.replay', it);
    it._state = 'idle';
    const setSnd = on => { v.muted = !on; if (snd) { snd.innerHTML = svg(on ? ICON.sound : ICON.muted) + `<span>${on ? 'Sound on' : 'Sound'}</span>`; snd.setAttribute('aria-label', on ? 'Mute' : 'Turn sound on'); } };
    it._setSnd = setSnd;
    if (snd) snd.addEventListener('click', e => { e.stopPropagation(); setSnd(v.muted); if (v.paused) v.play().catch(() => {}); });
    v.addEventListener('ended', () => { if (it.hasAttribute('data-once')) { it.classList.add('ended'); it._state = 'done'; } });
    if (rep) rep.addEventListener('click', () => { it.classList.remove('ended'); v.currentTime = 0; setSnd(true); v.play().catch(() => { setSnd(false); v.play(); }); });
  });
  function videoCheck() {
    vids.forEach(it => {
      const v = $('video', it), r = it.getBoundingClientRect();
      const visW = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) / r.width;
      const visH = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / r.height;
      const vis = visW * visH;
      if (vis > 0.05 && !v.src) { v.src = it.dataset.src; v.preload = 'auto'; }
      if (reduce) return;
      if (it.hasAttribute('data-once')) {
        if (it._state === 'idle' && inStage && vis > 0.6) {
          it._state = 'playing'; v.currentTime = 0;
          if (activated()) it._setSnd(true);
          v.play().catch(() => { it._setSnd(false); v.play().catch(() => {}); });
        } else if (it._state === 'playing' && vis < 0.2) { v.pause(); it._state = 'paused'; }
        else if (it._state === 'paused' && vis > 0.6) { v.play().catch(() => {}); it._state = 'playing'; }
      } else {
        if (vis > 0.1 && v.paused) v.play().catch(() => {});
        else if (vis <= 0.1 && !v.paused) v.pause();
      }
    });
  }

  /* ---------- Click a clip to watch it large, with sound ---------- */
  const lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Video');
  lb.innerHTML = `<button type="button" class="lb-x" aria-label="Close">${svg('M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z')}</button>
    <div class="lb-box"><video playsinline preload="auto"></video>
      <div class="pc lb-pc"><button type="button" class="lb-play" aria-label="Pause">${svg(ICON.pause)}</button>
        <div class="bar lb-bar" role="slider" aria-label="Seek" tabindex="0"><i></i><b></b><s></s></div>
        <span class="tm lb-tm">0:00 / 0:00</span>
        <button type="button" class="lb-mute" aria-label="Mute">${svg(ICON.sound)}</button></div></div>`;
  document.body.appendChild(lb);
  const lv = $('video', lb), lPlay = $('.lb-play', lb), lMute = $('.lb-mute', lb), lBar = $('.lb-bar', lb), lFill = $('b', lBar), lKnob = $('s', lBar), lTm = $('.lb-tm', lb);
  let resume = [], lastFocus = null, lDrag = false;
  const lShow = () => { const p = lv.duration ? lv.currentTime / lv.duration : 0; lFill.style.width = lKnob.style.left = (p * 100) + '%'; lTm.textContent = `${fmt(lv.currentTime)} / ${fmt(lv.duration)}`; };
  lv.addEventListener('timeupdate', () => { if (!lDrag) lShow(); });
  lv.addEventListener('loadedmetadata', () => { lb.classList.toggle('wide', lv.videoWidth > lv.videoHeight); lShow(); });
  lv.addEventListener('play', () => $('path', lPlay).setAttribute('d', ICON.pause));
  lv.addEventListener('pause', () => $('path', lPlay).setAttribute('d', ICON.play));
  lv.addEventListener('ended', () => { lv.currentTime = 0; lv.play(); });
  lPlay.onclick = () => lv.paused ? lv.play() : lv.pause();
  lMute.onclick = () => { lv.muted = !lv.muted; $('path', lMute).setAttribute('d', lv.muted ? ICON.muted : ICON.sound); lMute.setAttribute('aria-label', lv.muted ? 'Turn sound on' : 'Mute'); };
  const lSeek = x => { const r = lBar.getBoundingClientRect(); const t = clamp((x - r.left) / r.width, 0, 1) * (lv.duration || 0); lv.currentTime = t; lShow(); };
  lBar.addEventListener('pointerdown', e => { lDrag = true; lBar.classList.add('drag'); lBar.setPointerCapture(e.pointerId); lSeek(e.clientX); });
  lBar.addEventListener('pointermove', e => { if (lDrag) lSeek(e.clientX); });
  lBar.addEventListener('pointerup', () => { lDrag = false; lBar.classList.remove('drag'); });
  const openLB = it => {
    const src = it.dataset.src; if (!src) return;
    lastFocus = document.activeElement;
    resume = vids.filter(x => !$('video', x).paused); resume.forEach(x => $('video', x).pause());
    const t = $('video', it); lv.src = src; lv.poster = t.poster || '';
    lv.currentTime = 0; lv.muted = false; $('path', lMute).setAttribute('d', ICON.sound);
    document.body.classList.add('lb-open'); lb.classList.add('open');
    lv.play().catch(() => { lv.muted = true; $('path', lMute).setAttribute('d', ICON.muted); lv.play().catch(() => {}); });
    $('.lb-x', lb).focus();
  };
  const closeLB = () => {
    if (!lb.classList.contains('open')) return;
    lv.pause(); lb.classList.remove('open'); document.body.classList.remove('lb-open');
    setTimeout(() => { if (!lb.classList.contains('open')) lv.removeAttribute('src'); }, 400);
    resume.forEach(x => $('video', x).play().catch(() => {})); resume = [];
    if (lastFocus) lastFocus.focus?.();
  };
  $('.lb-x', lb).onclick = closeLB;
  lb.addEventListener('click', e => { if (!e.target.closest('.lb-box') || e.target === $('.lb-box', lb)) closeLB(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
  vids.forEach(it => {
    it.setAttribute('tabindex', '0'); it.setAttribute('role', 'button'); it.setAttribute('aria-label', 'Play this clip larger, with sound');
    it.addEventListener('click', e => { if (e.target.closest('.snd, .replay')) return; openLB(it); });
    it.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLB(it); } });
  });

  addEventListener('scroll', frame, { passive: true });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layout, 100); });
  setProject(0);
  layout();
})();
