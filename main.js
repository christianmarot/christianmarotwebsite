/* Behaviour for index.html and work.html. Content lives in data.js. */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const has = name => { try { return typeof eval(name) !== 'undefined'; } catch { return false; } };
  const fmt = t => { t = Math.max(0, Math.floor(t || 0)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
  // [muted?, volume] of a Vimeo player (older players lack getMuted)
  const vimMuted = pl => Promise.all([pl.getMuted ? pl.getMuted() : Promise.resolve(false), pl.getVolume ? pl.getVolume() : Promise.resolve(1)]);
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
      pl.on('volumechange', () => vimMuted(pl).then(([m, v]) => { muted = m || v === 0; muteI.setAttribute('d', muted ? ICON.muted : ICON.sound); $('.rp-mute', pc).setAttribute('aria-label', muted ? 'Turn sound on' : 'Mute'); }).catch(() => {}));
      // phones: a tap on the film while its controls are hidden just brings them back (a second tap plays / pauses)
      let wasIdle = false; frame.addEventListener('pointerdown', () => { wasIdle = frame.classList.contains('idle'); }, { capture: true, passive: true });
      btn.addEventListener('click', e => { if (wasIdle && matchMedia('(hover: none)').matches) { e.stopImmediatePropagation(); wasIdle = false; } }, { capture: true });
      const toggle = () => { if (playing) pl.pause(); else { if (!muted) pl.setVolume(1).catch(() => {}); pl.play().catch(() => {}); } };
      btn.addEventListener('click', toggle); $('.rp-play', pc).addEventListener('click', toggle);
      $('.rp-mute', pc).addEventListener('click', () => { muted = !muted; pl.setMuted(muted).catch(() => {}); if (!muted) pl.setVolume(1).catch(() => {}); muteI.setAttribute('d', muted ? ICON.muted : ICON.sound); $('.rp-mute', pc).setAttribute('aria-label', muted ? 'Turn sound on' : 'Mute'); });
      const seekTo = x => { const r = bar.getBoundingClientRect(), t = clamp((x - r.left) / r.width, 0, 1) * dur; show(t); return t; };
      bar.addEventListener('pointerdown', e => { dragging = true; bar.classList.add('drag'); bar.setPointerCapture(e.pointerId); seekTo(e.clientX); });
      bar.addEventListener('pointermove', e => { if (dragging) seekTo(e.clientX); });
      bar.addEventListener('pointerup', e => { if (!dragging) return; dragging = false; bar.classList.remove('drag'); pl.setCurrentTime(seekTo(e.clientX)).catch(() => {}); });
      bar.addEventListener('pointercancel', () => { dragging = false; bar.classList.remove('drag'); });
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
    $$('.subl a', li).forEach((a, i) => a.style.transitionDelay = o ? `0ms, ${110 + i * 35}ms, ${110 + i * 35}ms` : '0ms');
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
    const p = Math.round(clamp((scrollY - start) / (innerHeight * 0.85), 0, 1) * 400) / 400;
    if (p === heroFx.last) return; heroFx.last = p;
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
    if (!reduce) {
      // an odometer: each digit is a reel that spins up to the total, with motion blur while it moves,
      // a little mechanical overshoot as it lands, then a warm flash
      const digits = String(nC).length;
      fmC.textContent = ''; fmC.classList.add('reel-n'); fmC.setAttribute('aria-label', nC); fmC.setAttribute('role', 'img');
      const strips = Array.from({ length: digits }, () => {
        const c = document.createElement('span'); c.className = 'rc'; c.setAttribute('aria-hidden', 'true');
        const st = document.createElement('span'); st.className = 'rs';
        st.innerHTML = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => `<i>${d}</i>`).join('');
        c.appendChild(st); fmC.appendChild(c); return st;
      });
      // where each reel sits for a running value v (odometer carry: a column only turns while the one to its right goes 9 → 0)
      const place = v => strips.map((_, i) => {
        const p = Math.pow(10, digits - 1 - i), lo = (v / p) % 10;
        if (p === 1) return lo;
        const below = (v % p) / p * 10, carry = Math.max(0, below - 9);   // 0 → 1 while the reel to the right rolls over
        return (Math.floor(v / p) % 10) + carry;
      });
      const draw = (pos, vel) => strips.forEach((st, i) => {
        const y = pos[i] % 10, sp = Math.abs(vel[i]);                  // reels per second
        const a = Math.min(.22, sp * .018);                           // length of the blur trail, in em
        st.style.transformOrigin = `50% ${(y * 1.3 + .65).toFixed(3)}em`;            // stretch about the digit in view
        st.style.transform = `translateY(${(-y * 1.3).toFixed(4)}em) scaleY(${1 + Math.min(.16, sp * .011)})`;
        st.style.filter = sp > .4 ? `blur(${Math.min(1.4, sp * .05).toFixed(2)}px)` : '';
        // the streak: a run of faint copies trailing behind the direction of travel, fading out
        st.style.textShadow = a > .01 ? [1, 2, 3, 4, 5, 6].map(k => `0 ${(a * k / 6 * Math.sign(vel[i] || 1)).toFixed(3)}em ${(a * 6).toFixed(2)}px rgba(240,195,90,${(.32 * (1 - k / 7)).toFixed(2)})`).join(', ') : '';
      });
      draw(place(0), place(0).map(() => 0));
      // counts one number at a time like before (quick at first, easing off towards the total), but each step is a
      // short roll of the reel, blurred while it moves; the leading zero stays hidden until the tens reel is needed
      const steps = []; let at = 0;
      for (let k = 1; k <= nC; k++) { const d = k === 1 ? 60 : 40 + 380 * Math.pow(k / nC, 4); at += d; steps.push({ t: at, f: k / nC }); }
      // each roll lasts until the next one starts, so the slow final numbers glide from one to the next instead of
      // snapping and waiting; early rolls are brisk, later ones ease in and out softly, and the last one settles gently
      steps.forEach((s0, k) => { const nx = steps[k + 1]; s0.d = nx ? nx.t - s0.t : 620; });
      const easeOut = u => 1 - Math.pow(1 - u, 3), easeInOut = u => .5 - .5 * Math.cos(Math.PI * u), settle = u => 1 - Math.pow(1 - u, 2.2);
      const ease = (u, f, last) => last ? settle(u) : easeOut(u) * (1 - f * f) + easeInOut(u) * f * f;
      const valueAt = ms => {
        let v = 0;
        for (let k = 0; k < steps.length; k++) { const s0 = steps[k]; if (ms < s0.t) break; v = k + ease(Math.min(1, (ms - s0.t) / s0.d), s0.f, k === steps.length - 1); }
        return v;
      };
      const lead = strips.length > 1 ? strips[0].parentElement : null;
      const run = () => {
        const t0 = performance.now(), end = steps[steps.length - 1].t + steps[steps.length - 1].d;
        let lastPos = place(0), lastT = t0;
        const frame = now => {
          const ms = now - t0, v = valueAt(ms), pos = place(v);
          const dt = Math.max(1, now - lastT) / 1000, vel = pos.map((p, i) => { let d = p - lastPos[i]; if (d < -5) d += 10; if (d > 5) d -= 10; return d / dt; });
          draw(pos, vel); lastPos = pos; lastT = now;
          if (lead) lead.style.opacity = Math.min(1, Math.max(0, v - 9)).toFixed(3);
          if (ms < end) requestAnimationFrame(frame); else { draw(place(nC), place(nC).map(() => 0)); if (lead) lead.style.opacity = ''; }
        };
        requestAnimationFrame(frame);
      };
      if (lead && nC >= 10) lead.style.opacity = '0';
      const co = new IntersectionObserver(es => { if (es[0].isIntersecting) { co.disconnect(); setTimeout(run, 250); } }, { threshold: .6 });
      co.observe(fmC.closest('h2'));
    }
  }

  /* ---------- Field Map: load the turning globe only as its section comes near ---------- */
  const fmBox = $('#fmGlobe');
  if (fmBox) {
    const FMV = '20261014m';
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
        const muteIcon = () => { muteI.setAttribute('d', muted ? ICON.muted : ICON.sound); muteB.setAttribute('aria-label', muted ? 'Turn sound on' : 'Mute'); };
        muteB.onclick = () => { muted = !muted; heroPlayer.setMuted(muted).catch(() => {}); if (!muted) heroPlayer.setVolume(1).catch(() => {}); muteIcon(); };
        // the sound button always shows what the film is really doing (phones can silence a film on their own)
        const syncSnd = () => vimMuted(heroPlayer).then(([m, v]) => { muted = m || v === 0; muteIcon(); }).catch(() => {});
        heroPlayer.on('volumechange', syncSnd); heroPlayer.on('play', syncSnd);
        const playSafe = () => heroPlayer.play().catch(() => { muted = true; muteIcon(); heroPlayer.setMuted(true).then(() => heroPlayer.play()).catch(() => {}); });
        const seekTo = x => { const r = bar.getBoundingClientRect(); const p = clamp((x - r.left) / r.width, 0, 1); show(p * dur); return p * dur; };
        bar.addEventListener('pointerdown', e => { dragging = true; bar.classList.add('drag'); bar.setPointerCapture(e.pointerId); seekTo(e.clientX); });
        bar.addEventListener('pointermove', e => { if (dragging) seekTo(e.clientX); });
        bar.addEventListener('pointerup', e => { if (!dragging) return; dragging = false; bar.classList.remove('drag'); heroPlayer.setCurrentTime(seekTo(e.clientX)).catch(() => {}); });
        bar.addEventListener('pointercancel', () => { dragging = false; bar.classList.remove('drag'); });
        bar.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') heroPlayer.getCurrentTime().then(t => heroPlayer.setCurrentTime(clamp(t + (e.key === 'ArrowRight' ? 5 : -5), 0, dur))); });
        // pause the film (and its sound) once you scroll into the page, resume when you come back
        new IntersectionObserver(es => { const v = es[0].intersectionRatio; if (v < 0.35) heroPlayer.pause(); else if (!paused || v > 0.9) playSafe(); }, { threshold: [0, 0.35, 0.9] }).observe(heroEl);
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
    } else if (S.slides && S.slides.length) {
      // a slideshow of the work: random order, never two from the same project in a row; the label follows along
      const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
      const order = list => {   // re-arrange so neighbours (and the wrap-around) come from different projects where possible
        const left = shuffle(list), out = [];
        while (left.length) {
          const prev = out[out.length - 1];
          let k = left.findIndex(s => !prev || s.project !== prev.project);
          if (k < 0) k = 0; out.push(left.splice(k, 1)[0]);
        }
        return out;
      };
      let seq = order(S.slides), si = 0;
      const a = document.createElement('img'), b = document.createElement('img');
      [a, b].forEach(im => { im.alt = ''; im.className = 'sl'; hbg.appendChild(im); });
      let cur = a;
      const label = s => { if (!fv) return; fv.classList.add('swap'); setTimeout(() => { fv.textContent = `Featured project: ${s.project}`; fv.classList.remove('swap'); }, 350); };
      const show = s => {
        const nx = cur === a ? b : a, im = new Image(); im.src = s.image;
        const go = () => { nx.src = s.image; nx.classList.remove('on'); void nx.offsetWidth; nx.classList.add('on'); cur.classList.remove('on'); cur = nx; label(s); };
        im.decode ? im.decode().then(go, go) : (im.onload = go);
      };
      cur.src = seq[0].image; cur.classList.add('on');
      if (fv) { fv.textContent = `Featured project: ${seq[0].project}`; fv.hidden = false; }
      if (!reduce) setInterval(() => {
        if (document.hidden || heroEl.getBoundingClientRect().bottom < 0) return;
        si++; if (si >= seq.length) { const last = seq[seq.length - 1]; seq = order(S.slides); if (seq[0].project === last.project) seq.push(seq.shift()); si = 0; }
        show(seq[si]);
      }, 5500);
    } else hbg.innerHTML = `<img src="${esc(S.cover)}" alt="">`;
  }

  /* ---------- Build the blocks ---------- */
  const projects = S.projects || [{ client: S.group, title: S.title, blocks: [{ type: 'grid', items: S.tiles || [] }] }];
  const row = document.createElement('div'); row.className = 'wk-row' + (S.midText ? ' mid' : ''); pin.appendChild(row);
  const mkVideo = (v, extra = '') => v.video
    ? `<div class="it vid${extra}" data-src="${esc(v.video)}" ${v.start ? `data-start="${+v.start}"` : ''} ${v.endFrame != null ? `data-end="${+v.endFrame}"` : ''} ${v.cut ? `data-cut="${+v.cut}"` : ''} ${v.audio ? 'data-audio' : ''} ${v.once ? 'data-once' : ''}><video muted playsinline preload="none" ${v.once ? '' : 'loop'} ${v.poster ? `poster="${esc(v.poster)}"` : ''}></video>
        ${v.audio ? `<div class="vc"><button type="button" class="snd" aria-label="Turn sound on">${svg(ICON.muted)}<span>Sound</span></button></div>` : ''}
        ${v.once ? `<button type="button" class="replay" aria-label="Replay">${'<span>' + svg(ICON.replay) + 'Replay</span>'}</button>` : ''}</div>`
    : `<div class="it ph"><div class="ph" style="height:100%">[ ${esc(v.note || '9:16 clip to come')} ]</div></div>`;
  const galleries = [];
  const blocksHTML = (p, pi) => { let pgi = -1; const pgal = () => pgi >= 0 ? pgi : (pgi = galleries.push({ dir: '', photos: [], title: p.title }) - 1); return p.blocks.map(b => {
    const pa = `data-p="${pi}"`;
    switch (b.type) {
      case 'feature': return `<div class="blk feat big" ${pa}>${mkVideo(b)}</div>`;
      case 'secondary': return `<div class="blk b2x2" ${pa}>${(b.videos || []).slice(0, 4).map(v => mkVideo(v)).join('')}</div>`;
      case 'photo': {
        // every photo opens large; it shares a viewer with the project's other photos, so you can swipe on through them
        const m = b.image.match(/^(.*)\/l\/([^/]+)\.webp$/);
        if (!m) return `<div class="blk np" ${pa} data-ar="${+b.ratio || 1.5}"><div class="it"><img src="${esc(b.image)}" alt="" loading="lazy" decoding="async"></div></div>`;
        const gi = pgal(), j = galleries[gi].photos.push({ dir: m[1], file: m[2], ratio: +b.ratio || 1.5, title: b.title }) - 1;
        return `<div class="blk np" ${pa} data-ar="${+b.ratio || 1.5}"><button type="button" class="it gi" data-g="${gi}" data-i="${j}" aria-label="View ${esc(b.title || 'this photo')} larger"><img src="${esc(b.image)}" alt="" loading="lazy" decoding="async"></button></div>`;
      }
      case 'textdetail': {
        // text at the top, two detail photos with a caption at the bottom — one column the height of the photos beside it
        const gi = galleries.push({ dir: b.dir, photos: (b.photos || []).map(x => ({ ...x, title: x.title || b.caption })), title: p.title }) - 1;
        return `<div class="blk tdx it" ${pa}><div class="td-t">${(b.text || []).map(t => `<p>${esc(t)}</p>`).join('')}</div>
          <div class="td-d"><div class="td-pair">${(b.photos || []).map((x, j) => `<button type="button" class="gi" data-g="${gi}" data-i="${j}" aria-label="View detail ${j + 1} larger"><img src="${esc(b.dir)}/m/${esc(x.file)}.webp" alt="" loading="lazy" decoding="async"></button>`).join('')}</div>${b.caption ? `<div class="td-c">${esc(b.caption)}</div>` : ''}</div></div>`;
      }
      case 'tiled': {
        const gi = pgal(), base = galleries[gi].photos.length; galleries[gi].photos.push(...(b.photos || []).map(x => ({ ...x, dir: b.dir })));
        return `<div class="blk gal" ${pa} data-rows="${+b.rows || 2}" ${b.h ? `data-h="${+b.h}"` : ''}>${(b.photos || []).map((ph, j) => `<button type="button" class="it gi" data-g="${gi}" data-i="${base + j}" data-r="${+ph.ratio || 1.5}" aria-label="View photo ${j + 1} of ${b.photos.length} larger"><img src="${esc(b.dir)}/m/${esc(ph.file)}.webp" alt="" loading="lazy" decoding="async"></button>`).join('')}</div>`;
      }
      case 'tiles12': return `<div class="blk t12" ${pa}>${(b.videos || []).slice(0, 12).map(v => mkVideo(v)).join('')}</div>`;
      case 'vimeo': return `<div class="blk vim" ${pa} data-ar="${+b.ratio || 16 / 9}"><div class="it vm" data-vimeo="${esc(b.vimeo)}" ${b.once ? 'data-once' : ''} tabindex="0" role="button" aria-label="Watch this film larger, with sound">
          <img class="vm-poster" alt="" ${b.poster ? `src="${esc(b.poster)}"` : ''} decoding="async"><div class="vm-f"></div><span class="vm-hint" aria-hidden="true">${svg(ICON.play)}<span>Tap to watch</span></span><div class="vc"><button type="button" class="snd" aria-label="Turn sound on">${svg(ICON.muted)}<span>Sound</span></button></div>
          ${b.once ? `<button type="button" class="replay" aria-label="Replay"><span>${svg(ICON.replay)}Replay</span></button>` : ''}</div></div>`;
      case 'hvideo': return `<div class="blk hv" ${pa}>${mkVideo(b)}</div>`;
      case 'hphoto': return `<div class="blk hp" ${pa}><div class="it"><img src="${esc(b.image)}" alt="" loading="lazy"></div></div>`;
      case 'fphoto': return `<div class="blk fp" ${pa}><div class="it"><img src="${esc(b.image)}" alt="" loading="lazy"></div></div>`;
      case 'sphoto': return `<div class="blk sph" ${pa}>${(b.images || []).slice(0, 4).map(i => `<div class="it"><img src="${esc(i)}" alt="" loading="lazy"></div>`).join('')}</div>`;
      case 'strip': return `<div class="blk strip" ${pa} data-ar="${+b.ratio || 10}"><div class="it"><img src="${esc(b.image)}" alt="" loading="lazy" decoding="async"></div>${b.caption ? `<div class="cap">${esc(b.caption)}</div>` : ''}</div>`;
      case 'text': case 'titletext': {
        // mtext: a shorter line used on phones in place of text (title cards)
        const ps = b.mtext ? (b.text || []).map(t => `<p class="d-only">${esc(t)}</p>`).join('') + b.mtext.map(t => `<p class="m-only">${esc(t)}</p>`).join('') : (b.text || []).map(t => `<p>${esc(t)}</p>`).join('');
        return `<div class="blk txt it${b.type === 'titletext' ? ' tt' : ''}" ${pa} style="background:none">${b.type === 'titletext' ? `<div class="k">${esc(b.k || p.client || S.group)}</div><h2>${esc(b.title || p.title)}</h2>` : ''}${ps}${b.type === 'text' ? '<button type="button" class="wrm">Read more +</button>' : ''}</div>`;
      }
      case 'gallery': {
        // a single preview block; the full gallery opens on click
        const gi = galleries.push({ dir: b.dir, photos: b.photos || [], title: p.title, cols: +b.cols || 0 }) - 1, ph = b.photos || [], more = Math.max(0, ph.length - 3);
        const pv = (b.preview && b.preview.length ? b.preview : ph.slice(0, 3).map(x => x.file));
        const im = j => pv[j] ? `<img src="${esc(b.dir)}/m/${esc(pv[j])}.webp" alt="" loading="lazy" decoding="async">` : '';
        return `<div class="blk galh${b.join ? ' join' : ''}" ${pa}><button type="button" class="it gh" data-g="${gi}" aria-label="Open the photo gallery, ${ph.length} photos">
          <span class="gh-a">${im(0)}</span><span class="gh-b">${im(1)}</span><span class="gh-c">${im(2)}${more ? `<i>+${more}</i>` : ''}</span>
          <span class="gh-l"><b>${esc(b.label || 'Photo gallery')}</b><small>${ph.length} photos · View all</small></span></button></div>`;
      }
      case 'grid': { const items = [...b.items]; while (items.length < 12) items.push({}); return items.map(t => `<div class="blk feat" ${pa}>${t.image ? `<div class="it"><img src="${esc(t.image)}" alt="" loading="lazy"></div>` : mkVideo(t)}</div>`).join(''); }
    }
    return '';
  }).join(''); };
  // dividers: numbered in order, skipping any part marked noMarker; marker: replaces the title on the divider
  let sepN = 0;
  const sepHTML = p => p.sub
    ? `<div class="sep sub" aria-hidden="true"><span>${esc(p.marker || p.title)}</span></div>`    // a part within a project: smaller, unnumbered
    : `<div class="sep" aria-hidden="true"><span>${String(++sepN).padStart(2, '0')} — ${esc(p.marker || p.title)}</span></div>`;
  row.innerHTML = projects.map((p, i) => ((projects.length > 1 || S.markers) && !p.noMarker ? sepHTML(p) : '') + blocksHTML(p, i)).join('');
  const blks = $$('.blk', row), items = $$('.it, .sep', row);
  const firstTxt = $('.blk.txt', row);
  // text blocks that sit side by side start level with each other instead of each centring on its own
  $$('.blk.txt:not(.tt)', row).forEach(b => { const n = b.nextElementSibling, p = b.previousElementSibling, t = e => e && e.matches('.blk.txt:not(.tt)'); if (t(n) || t(p)) b.classList.add('pair'); });

  // sizes: featured 9:16 fills from under the menu to above the title; secondary = 2×2 of the same width
  let H = 0, panMax = 0, gatherLen = 0, rowTop = 200; const LEAD = 0.75;
  const stage = $('#wkStage');
  // phones: the screen height changes as the browser's address bar slides in and out while you scroll.
  // Everything here is measured against a steady height (only re-measured when the width changes, e.g. turning
  // the phone), so the row and its title don't jump or jitter as the bar comes and goes
  const touchUI = matchMedia('(hover: none) and (pointer: coarse)').matches;
  let VH = innerHeight, VW = innerWidth, blkPos = [];
  const layout = () => {
    if (!touchUI || innerWidth !== VW || !H) VH = innerHeight; VW = innerWidth;
    const hdr = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr')) || 92;
    const top = hdr + 8, bottom = innerWidth < 760 ? 120 : 150;
    H = Math.max(260, VH - top - bottom);
    const fw = Math.round(H * 9 / 16), gap = innerWidth < 760 ? 16 : (S.gap || 16);
    rowTop = top;     row.style.top = top + 'px'; row.style.gap = gap + 'px';
    $$('.sep', row).forEach(s => s.style.height = H + 'px');
    blks.forEach((b, i) => {
      b.style.height = H + 'px';
      if (b.classList.contains('feat')) b.style.width = fw + 'px';
      else if (b.classList.contains('t12')) { const ch = (H - 12) / 2, cw = Math.round(ch * 9 / 16); b.style.width = (cw * 6 + 12 * 5) + 'px'; b.style.gap = '12px'; }
      else if (b.classList.contains('vim') || b.classList.contains('np')) b.style.width = Math.round(H * +b.dataset.ar) + 'px';
      else if (b.classList.contains('strip')) { const sh = Math.round(H * (innerWidth < 760 ? .3 : .4)); b.style.width = Math.round(sh * +b.dataset.ar) + 'px'; b.style.setProperty('--sh', sh + 'px'); }
      else if (b.classList.contains('gal')) {
        // tiled gallery: photos packed into rows of equal height, each row stretched to the same length
        // data-h: the rows use only that share of the height, centred (artworks sit smaller than a full-height opener)
        const n = +b.dataset.rows || 2, gp = innerWidth < 760 ? 6 : (S.tileGap || 10), gh = H * (+b.dataset.h || 1), y0 = (H - gh) / 2, rh = (gh - gp * (n - 1)) / n;
        const tiles = $$('.gi', b), rows = Array.from({ length: n }, () => ({ w: 0, t: [] }));
        tiles.forEach(t => { const r = rows.reduce((a, c) => c.w < a.w ? c : a); r.t.push(t); r.w += (r.t.length > 1 ? gp : 0) + rh * +t.dataset.r; });
        const len = Math.max(...rows.map(r => r.w));
        rows.forEach((r, ri) => {
          const sum = r.t.reduce((a, t) => a + rh * +t.dataset.r, 0), k = (len - gp * (r.t.length - 1)) / sum; let x = 0;
          r.t.forEach(t => { const w = rh * +t.dataset.r * k; Object.assign(t.style, { left: x + 'px', top: y0 + ri * (rh + gp) + 'px', width: w + 'px', height: rh + 'px' }); x += w + gp; });
        });
        b.style.width = Math.round(len) + 'px';
      }
      else if (b.classList.contains('b2x2') || b.classList.contains('sph')) { const ch = (H - 12) / 2, cw = Math.round(ch * (b.classList.contains('b2x2') ? 9 / 16 : 4 / 5)); b.style.width = (cw * 2 + 12) + 'px'; b.style.gap = '12px'; }
      else if (b.classList.contains('hv') || b.classList.contains('hp')) b.style.width = Math.round(H * 16 / 9) + 'px';
      else if (b.classList.contains('fp')) b.style.width = Math.round(H * 4 / 5) + 'px';
      else if (b.classList.contains('txt')) {
        // as narrow as possible while the text still fits the height of the video beside it
        const cs0 = getComputedStyle(b), pad = parseFloat(cs0.paddingLeft) + parseFloat(cs0.paddingRight), tr = b.style.transform; b.style.transform = '';
        const ps = $$('p', b); let fs = 15; ps.forEach(q => q.style.fontSize = ''); b.classList.remove('clip');
        let w, wMax = Math.min(620, innerWidth * 0.82);
        if (innerWidth < 760) {
          // phones: fill the screen width; the opening block must sit fully on screen beside its divider
          const gut = parseFloat(getComputedStyle(row).paddingLeft) || 24;
          w = wMax = (b === firstTxt && (!b.previousElementSibling || b.previousElementSibling.classList.contains('sep')) ? innerWidth - gut - b.offsetLeft : innerWidth - gut * 2) - pad;
        } else w = Math.max(260, Math.min(360, innerWidth * 0.24));
        b.style.width = (w + pad) + 'px';
        while (b.scrollHeight > H + 2 && w < wMax) { w += 20; b.style.width = (w + pad) + 'px'; }
        // phones: every block keeps the same size of type; a long one is cut short with a Read more instead
        if (innerWidth < 760 && !b.classList.contains('tt')) { if (b.scrollHeight > H + 2) b.classList.add('clip'); }
        else while (b.scrollHeight > H + 2 && fs > 12) { fs -= 0.5; ps.forEach(q => q.style.fontSize = fs + 'px'); }
        if (S.midText && b.classList.contains('tt')) {
          // title cards: trim to the width the words actually take, so the gap after them matches the gap before
          const range = document.createRange(), x0 = b.getBoundingClientRect().left; let right = 0;
          [...b.children].filter(c => c.offsetParent).forEach(c => { range.selectNodeContents(c); [...range.getClientRects()].forEach(r => { right = Math.max(right, r.right); }); });
          if (right > x0) b.style.width = Math.ceil(right - x0) + 'px';
        }
        b.style.transform = tr;
      }
      else if (b.classList.contains('tdx')) {
        const tr = b.style.transform; b.style.transform = '';
        const ps = $$('p', b), gap = 10; let fs = 15; ps.forEach(q => q.style.fontSize = '');
        let w = innerWidth < 760 ? innerWidth - 2 * (parseFloat(getComputedStyle(row).paddingLeft) || 24) : Math.max(380, Math.min(480, innerWidth * .3)), wMax = innerWidth < 760 ? w : Math.min(680, innerWidth * .5);
        const fits = () => { b.style.width = w + 'px'; const sq = (w - gap) / 2; $$('.gi', b).forEach(g => { g.style.width = g.style.height = sq + 'px'; }); return $('.td-t', b).scrollHeight + sq + 40 + 36 <= H; };
        while (!fits() && w < wMax) w += 20;
        // phones: same size of type as the other blocks; the detail photos shrink to make room instead
        if (innerWidth < 760) { let sq = (w - gap) / 2; const need = () => $('.td-t', b).offsetHeight + $('.td-d', b).offsetHeight + (parseFloat(getComputedStyle(b).rowGap) || 36) + 8; while (need() > H && sq > 80) { sq -= 6; $$('.gi', b).forEach(g => { g.style.width = g.style.height = sq + 'px'; }); } }
        else while (!fits() && fs > 12) { fs -= 0.5; ps.forEach(q => q.style.fontSize = fs + 'px'); }
        b.style.transform = tr;
      }
      else if (b.classList.contains('galh')) b.style.width = Math.round(H * (innerWidth < 760 ? .62 : .9)) + 'px';
    });
    $$('.blk.feat .it, .blk.vim .it, .blk.np .it, .blk.hv .it, .blk.hp .it, .blk.fp .it', row).forEach(it => it.style.height = '100%');
    // fine art: title cards and the text-with-details column sit with the same space on their left and right
    if (S.midText) {
      const edgeR = e => e.classList.contains('sep') ? e.offsetLeft + e.offsetWidth / 2 : e.offsetLeft + e.offsetWidth;
      const edgeL = e => e.classList.contains('sep') ? e.offsetLeft + e.offsetWidth / 2 : e.offsetLeft;
      $$('.blk.tt, .blk.tdx', row).forEach(b => { b.style.marginLeft = b.style.marginRight = ''; });
      $$('.blk.tt, .blk.tdx', row).forEach(b => {
        const pv = b.previousElementSibling, nx = b.nextElementSibling; if (!pv || !nx) return;
        const cs = getComputedStyle(b), pl = parseFloat(cs.paddingLeft), pr = parseFloat(cs.paddingRight);
        const gl = b.offsetLeft + pl - edgeR(pv), gr = edgeL(nx) - (b.offsetLeft + b.offsetWidth - pr), t = Math.max(gl, gr, Math.min(64, innerWidth * .045));
        b.style.marginLeft = (parseFloat(cs.marginLeft) + t - gl) + 'px'; b.style.marginRight = (parseFloat(cs.marginRight) + t - gr) + 'px';
      });
    }
    panMax = Math.max(0, row.scrollWidth - innerWidth);
    gatherLen = VH * (innerWidth < 760 ? 1.6 : 1.3);
    stage.style.height = (gatherLen - VH * LEAD + panMax * 1.15 + VH * 1.3) + 'px';
    blkPos = blks.map(b => [b.offsetLeft, b.offsetWidth, +b.dataset.p]);
    // phones: the project title sits a fixed distance under the row, not against the (moving) bottom of the screen
    if (touchUI || innerWidth < 760) Object.assign(wt.style, { top: (top + H + 22) + 'px', bottom: 'auto' }); else wt.style.top = wt.style.bottom = '';
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
    if (blk.classList.contains('b2x2') || blk.classList.contains('sph') || blk.classList.contains('t12')) {
      const top = [...blk.children].indexOf(el) < (blk.classList.contains('t12') ? 6 : 2);
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
  let inStage = false, lastK = -1, lastX = null, lastVC = 0, vcT, gS = null, pS = null, tPrev = 0;
  function frame() {
    heroFx();
    const r = stage.getBoundingClientRect(), scrolled = -r.top;
    const gT = reduce ? 1 : clamp((scrolled + VH * LEAD) / gatherLen, 0, 1);
    const pT = reduce ? 0 : clamp((scrolled - gatherLen + VH * LEAD) / (panMax * 1.15 || 1), 0, 1);
    // the scattered pieces (and, on phones, the sideways pan) glide towards where the scroll says they should be,
    // rather than stepping with each scroll event — this takes out the judder as they fly in
    const now0 = performance.now(), dt = Math.min(64, now0 - (tPrev || now0 - 16)); tPrev = now0;
    const ease = (cur, tgt, rate) => cur == null || Math.abs(tgt - cur) < 0.0004 ? tgt : cur + (tgt - cur) * Math.min(1, dt * rate / 1000);
    gS = ease(gS, gT, 9); pS = touchUI ? ease(pS, pT, 16) : pT;
    if (gS !== gT || pS !== pT) frameSoon(); else tPrev = 0;
    const g = gS, pan = pS;
    const e = 1 - Math.pow(1 - g, 3), k = Math.round((1 - e) * 4000) / 4000;
    row.classList.toggle('gathering', k >= 0.001);
    const sx = Math.max(innerWidth, 640) * 0.4;
    // only touch the styles that actually changed (less work per frame = smoother on phones)
    if (k !== lastK && !(k < 0.001 && lastK < 0.001 && lastK >= 0)) items.forEach((el, i) => {
      const sd = seeds[i];
      el.style.transform = k < 0.001 ? '' : `translate3d(${(sd.x * sx * k).toFixed(2)}px, ${(sd.y * VH * k).toFixed(2)}px, 0) rotate(${(sd.r * k).toFixed(3)}deg) scale(${(1 - sd.s * k).toFixed(4)})`;
    });
    lastK = k;
    const x = Math.round(-pan * panMax * 2) / 2;
    if (x !== lastX) { row.style.transform = `translate3d(${x}px,0,0)`; lastX = x; }
    inStage = r.top < VH * 0.5 && r.bottom > VH * 0.7;
    const op = inStage ? '1' : '0'; if (wt.style.opacity !== op) wt.style.opacity = op;
    // title = the project taking up most of the screen (worked out from the stored block positions, no measuring)
    const cover = projects.map(() => 0);
    blkPos.forEach(([l, w, pi]) => { const L = l + x; cover[pi] += Math.max(0, Math.min(L + w, innerWidth) - Math.max(L, 0)); });
    setProject(cover.indexOf(Math.max(...cover)));
    // which clips should be playing: checked a few times a second while scrolling, and once more when it stops
    const now = performance.now();
    if (now - lastVC > 120) { lastVC = now; videoCheck(); }
    clearTimeout(vcT); vcT = setTimeout(videoCheck, 160);
  }
  var fq = 0; function frameSoon() { if (!fq) fq = requestAnimationFrame(() => { fq = 0; frame(); }); }

  /* ---------- Clip playback: loops play while on screen; "once" clips play with sound when they arrive ---------- */
  const vids = $$('.it.vid', row);
  vids.forEach(it => {
    const v = $('video', it), snd = $('.snd', it), rep = $('.replay', it);
    it._state = 'idle';
    const sndIcon = () => { if (!snd) return; const on = !v.muted && v.volume > 0; snd.innerHTML = svg(on ? ICON.sound : ICON.muted) + `<span>${on ? 'Sound on' : 'Sound'}</span>`; snd.setAttribute('aria-label', on ? 'Mute' : 'Turn sound on'); };
    const setSnd = on => { v.muted = !on; sndIcon(); };
    v.addEventListener('volumechange', sndIcon);   // the button follows the clip's real state
    it._setSnd = setSnd;
    if (snd) snd.addEventListener('click', e => { e.stopPropagation(); setSnd(v.muted); if (v.paused) v.play().catch(() => {}); });
    v.addEventListener('ended', () => {
      if (!it.hasAttribute('data-once')) return;
      it.classList.add('ended'); it._state = 'done';
      if (it.dataset.end) v.currentTime = +it.dataset.end;   // rest on a chosen frame behind the Replay button
    });
    if (rep) rep.addEventListener('click', () => { it.classList.remove('ended'); v.currentTime = 0; setSnd(true); v.play().catch(() => { setSnd(false); v.play(); }); });
    // cut: on the page the clip loops before its end card (logo / black); played large it runs in full
    if (it.dataset.cut) {
      const cut = +it.dataset.cut;
      const watch = () => { if (v.currentTime >= cut - 0.03) v.currentTime = 0; if (!v.paused) v.requestVideoFrameCallback ? v.requestVideoFrameCallback(watch) : requestAnimationFrame(watch); };
      v.addEventListener('play', watch);
    }
  });
  // play-once films (with sound) take turns: one waits until the one playing has finished or left the screen
  const otherPlaying = it => vids.concat(vims).some(x => x !== it && x._state === 'playing' && x.hasAttribute('data-once'));
  function videoCheck() {
    vims.forEach(vimCheck);
    vids.forEach(it => {
      const v = $('video', it), r = it.getBoundingClientRect();
      const visW = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) / r.width;
      const visH = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / r.height;
      const vis = visW * visH;
      if (vis > 0.05 && !v.src) {
        v.src = it.dataset.src; v.preload = 'auto';
        if (it.dataset.start) v.addEventListener('loadedmetadata', () => { v.currentTime = +it.dataset.start; }, { once: true });   // first play starts part-way in
      }
      if (reduce) return;
      if (it.hasAttribute('data-once')) {
        if (it._state === 'idle' && inStage && vis > 0.6 && !otherPlaying(it)) {
          it._state = 'playing'; v.currentTime = 0;
          if (activated()) it._setSnd(true);
          v.play().catch(() => { it._setSnd(false); v.play().catch(() => {}); });
        } else if (it._state === 'playing' && vis < 0.2) { v.pause(); it._state = 'paused'; }
        else if (it._state === 'paused' && vis > 0.6 && !otherPlaying(it)) { v.play().catch(() => {}); it._state = 'playing'; }
      } else {
        if (vis > 0.1 && v.paused && !it._tryP) { it._tryP = true; v.play().catch(() => { if (!v.muted) { it._setSnd(false); v.play().catch(() => {}); } }).finally(() => { it._tryP = false; }); }
        else if (vis <= 0.1 && !v.paused) v.pause();
      }
    });
  }

  /* ---------- Vimeo films in the row: silent loop in place, a sound button, click to watch large ---------- */
  const vims = $$('.it.vm', row);
  const vimSrc = (id, o) => `https://player.vimeo.com/video/${id}?controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1&autopause=0${o}`;
  vims.forEach(it => {
    const snd = $('.snd', it);
    it._muted = true;
    it._setSnd = on => { it._muted = !on; if (it._p) { it._p.setMuted(!on); if (on) it._p.setVolume(1); } snd.innerHTML = svg(on ? ICON.sound : ICON.muted) + `<span>${on ? 'Sound on' : 'Sound'}</span>`; snd.setAttribute('aria-label', on ? 'Mute' : 'Turn sound on'); };
    snd.addEventListener('click', e => { e.stopPropagation(); it._setSnd(it._muted); if (it._p && it._state !== 'done') it._p.play().catch(() => {}); });
    it._state = 'idle';
    const rp = $('.replay', it);
    if (rp) rp.addEventListener('click', e => {
      e.stopPropagation(); if (!it._p) return;
      it.classList.remove('ended'); it._state = 'playing'; it._setSnd(true);
      it._p.setCurrentTime(0).then(() => it._p.play()).catch(() => { it._setSnd(false); it._p.play().catch(() => {}); });
    });
  });
  // holding image: Vimeo's own thumbnail (unless a poster was given), which also tells us the film's shape early
  vims.forEach(it => {
    const img = $('.vm-poster', it), blk = it.parentElement;
    fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent('https://vimeo.com/' + it.dataset.vimeo)}&width=1920`)
      .then(r => r.ok ? r.json() : null).then(d => {
        if (!d) return;
        if (!img.getAttribute('src') && d.thumbnail_url) img.src = d.thumbnail_url;
        const ar = d.width && d.height ? d.width / d.height : 0;
        if (ar && Math.abs(ar - +blk.dataset.ar) > 0.01) { blk.dataset.ar = ar; layout(); }
      }).catch(() => {});
  });
  function vimCheck(it) {
    const r = it.getBoundingClientRect();
    const vis = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) / r.width * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / r.height;
    // start loading the player well before it arrives, so it's ready by the time it's on screen
    const near = r.left < innerWidth * 1.6 && r.right > -innerWidth * 0.6 && r.top < innerHeight * 1.5 && r.bottom > -innerHeight * 0.5;
    if (near && !it._p && window.Vimeo && Vimeo.Player) {
      const f = document.createElement('iframe');
      f.src = vimSrc(it.dataset.vimeo, it.hasAttribute('data-once') ? '&muted=1&loop=0&autoplay=0' : '&muted=1&loop=1&autoplay=0'); f.allow = 'autoplay; fullscreen; picture-in-picture'; f.title = 'Film';
      $('.vm-f', it).appendChild(f);
      const p = it._p = new Vimeo.Player(f);
      // size the block to the film's own shape (once it's known)
      Promise.all([p.getVideoWidth(), p.getVideoHeight()]).then(([w, h]) => {
        const blk = it.parentElement, ar = w && h ? w / h : 0;
        if (ar && Math.abs(ar - +blk.dataset.ar) > 0.01) { blk.dataset.ar = ar; layout(); }
      }).catch(() => {});
      p.on('play', () => it.classList.add('on'));
      // phones may start a film silently even when sound was asked for: the button shows what is really happening
      const sync = () => vimMuted(p).then(([m, v]) => { const on = !m && v > 0; if (on === !it._muted) return; it._muted = !on; snd.innerHTML = svg(on ? ICON.sound : ICON.muted) + `<span>${on ? 'Sound on' : 'Sound'}</span>`; snd.setAttribute('aria-label', on ? 'Mute' : 'Turn sound on'); }).catch(() => {});
      const snd = $('.snd', it); p.on('volumechange', sync); p.on('play', sync);
      p.on('ended', () => { if (it.hasAttribute('data-once')) { it.classList.add('ended'); it._state = 'done'; } });
      it._playing = false;
    }
    if (!it._p || reduce || lbOpenVim) return;
    if (it.hasAttribute('data-once')) {
      // like the featured clips: plays once with sound (if the browser allows it) as it arrives, pauses when it leaves
      // (leaving includes scrolling back up to the film at the top of the page)
      const away = vis < 0.2 || !inStage;
      if (it._state === 'idle' && inStage && vis > 0.6 && !otherPlaying(it)) {
        it._state = 'playing'; it._setSnd(activated());
        it._p.play().catch(() => { it._setSnd(false); it._p.play().catch(() => {}); });
      } else if (it._state === 'playing' && away) { it._state = 'paused'; it._p.pause().catch(() => {}); }
      else if (it._state === 'paused' && inStage && vis > 0.6 && !otherPlaying(it)) { it._state = 'playing'; it._p.play().catch(() => {}); }
      // Vimeo can ignore a pause or play sent while it is still starting up, so check it actually did what was asked
      const now = performance.now();
      if ((it._state === 'paused' || it._state === 'playing') && now - (it._sync || 0) > 600) {
        it._sync = now;
        it._p.getPaused().then(pz => {
          if (it._state === 'paused' && !pz) it._p.pause().catch(() => {});
          else if (it._state === 'playing' && pz) it._p.getEnded().then(e => { if (!e && it._state === 'playing') it._p.play().catch(() => {}); }).catch(() => {});
        }).catch(() => {});
      }
      return;
    }
    if (vis > 0.1 && !it._playing && inStage) { it._playing = true; it._p.play().catch(() => { it._playing = false; }); }
    else if ((vis <= 0.1 || !inStage) && it._playing) { it._playing = false; it._p.pause().catch(() => {}); }
  }
  if (vims.length) setInterval(() => vims.forEach(vimCheck), 700);   // keeps checking even when the page is still
  // the large viewer: its own player with sound, and the bespoke controls, which fade after a few seconds of stillness
  let lbOpenVim = null;
  const vlb = document.createElement('div');
  vlb.className = 'lb vlb'; vlb.setAttribute('role', 'dialog'); vlb.setAttribute('aria-modal', 'true'); vlb.setAttribute('aria-label', 'Film');
  vlb.innerHTML = `<button type="button" class="lb-x" aria-label="Close">${svg('M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z')}</button>
    <div class="lb-box vlb-box"><div class="vlb-f"></div><div class="vlb-tap" aria-hidden="true"></div>
      <div class="pc vlb-pc"><button type="button" class="v-play" aria-label="Pause">${svg(ICON.pause)}</button>
        <div class="bar v-bar" role="slider" aria-label="Seek" tabindex="0"><i></i><b></b><s></s></div>
        <span class="tm v-tm">0:00 / 0:00</span>
        <button type="button" class="v-mute" aria-label="Mute">${svg(ICON.sound)}</button></div></div>`;
  document.body.appendChild(vlb);
  // phones: the close button sits inside the top corner of the film itself, in front of it
  const xHome = (box, wrap) => { const x = $('.lb-x', wrap), m = matchMedia('(max-width: 760px)'); const put = () => (m.matches ? box : wrap).insertBefore(x, (m.matches ? box : wrap).firstChild); put(); m.addEventListener?.('change', put); };
  xHome($('.vlb-box', vlb), vlb);
  const vBox = $('.vlb-box', vlb), vF = $('.vlb-f', vlb), vPlay = $('.v-play', vlb), vMute = $('.v-mute', vlb), vBar = $('.v-bar', vlb), vFill = $('b', vBar), vKnob = $('s', vBar), vTm = $('.v-tm', vlb);
  let vP = null, vDur = 0, vDrag = false, vMuted = false, vIdle, vFocus = null;
  const vShow = t => { const q = vDur ? t / vDur : 0; vFill.style.width = vKnob.style.left = (q * 100) + '%'; vTm.textContent = `${fmt(t)} / ${fmt(vDur)}`; vBar.setAttribute('aria-valuenow', Math.round(q * 100)); };
  const vWake = () => { vlb.classList.remove('idle'); clearTimeout(vIdle); vIdle = setTimeout(() => { if (!vDrag) vlb.classList.add('idle'); }, 3000); };
  // phones: the film itself takes no taps, so a layer over it does — a tap brings the controls back, another hides them
  let vWasIdle = false;
  vlb.addEventListener('pointerdown', () => { vWasIdle = vlb.classList.contains('idle'); }, { capture: true, passive: true });
  ['mousemove', 'pointerdown', 'touchstart', 'keydown'].forEach(ev => vlb.addEventListener(ev, vWake, { passive: true }));
  $('.vlb-tap', vlb).addEventListener('click', e => { e.stopPropagation(); if (vWasIdle) return; vP && vP.getPaused().then(pz => { if (!pz) { clearTimeout(vIdle); vlb.classList.add('idle'); } }).catch(() => {}); });
  const vSize = ar => {   // as large as the screen allows, in the film's own shape
    const w = Math.min(innerWidth * 0.9, innerHeight * 0.82 * ar); vF.style.width = w + 'px'; vF.style.height = (w / ar) + 'px';
  };
  addEventListener('resize', () => { if (lbOpenVim) vSize(+lbOpenVim.parentElement.dataset.ar); });
  const openVim = it => {
    if (!window.Vimeo || !Vimeo.Player) return;
    vFocus = document.activeElement; lbOpenVim = it;
    resume = vids.filter(x => !$('video', x).paused); resume.forEach(x => $('video', x).pause());
    const from = it._p ? it._p.getCurrentTime() : Promise.resolve(0);
    if (it._p) it._p.pause().catch(() => {}); it._playing = false; if (it._state === 'playing') it._state = 'paused';
    vSize(+it.parentElement.dataset.ar);
    const f = document.createElement('iframe');
    f.src = vimSrc(it.dataset.vimeo, '&autoplay=1&muted=0'); f.allow = 'autoplay; fullscreen; picture-in-picture'; f.title = 'Film';
    vF.innerHTML = ''; vF.appendChild(f);
    vP = new Vimeo.Player(f); vDur = 0; vMuted = false; $('path', vMute).setAttribute('d', ICON.sound);
    vP.getDuration().then(d => { vDur = d; }).catch(() => {});
    vP.on('timeupdate', d => { vDur = d.duration || vDur; if (!vDrag) vShow(d.seconds); });
    vP.on('play', () => { $('path', vPlay).setAttribute('d', ICON.pause); vPlay.setAttribute('aria-label', 'Pause'); });
    vP.on('pause', () => { $('path', vPlay).setAttribute('d', ICON.play); vPlay.setAttribute('aria-label', 'Play'); vlb.classList.remove('idle'); });
    vP.on('ended', () => vlb.classList.remove('idle'));
    const vSync = () => vP && vimMuted(vP).then(([m, v]) => { vMuted = m || v === 0; $('path', vMute).setAttribute('d', vMuted ? ICON.muted : ICON.sound); vMute.setAttribute('aria-label', vMuted ? 'Turn sound on' : 'Mute'); }).catch(() => {});
    vP.on('volumechange', vSync); vP.on('play', vSync);
    from.then(t => { if (t > 1) vP.setCurrentTime(t).catch(() => {}); vP.play().catch(() => { vMuted = true; vP.setMuted(true); $('path', vMute).setAttribute('d', ICON.muted); vP.play().catch(() => {}); }); });
    document.body.classList.add('lb-open'); vlb.classList.add('open'); vWake(); $('.lb-x', vlb).focus();
  };
  const closeVim = () => {
    if (!lbOpenVim) return;
    const it = lbOpenVim; lbOpenVim = null;
    const at = vP ? vP.getCurrentTime() : Promise.resolve(0);
    at.then(t => { if (it._p && t) it._p.setCurrentTime(t).catch(() => {}); }).catch(() => {});
    vlb.classList.remove('open'); document.body.classList.remove('lb-open');
    setTimeout(() => { if (!lbOpenVim) { if (vP) vP.destroy().catch(() => {}); vP = null; vF.innerHTML = ''; } }, 400);
    resume.forEach(x => $('video', x).play().catch(() => {})); resume = [];
    vFocus?.focus?.({ preventScroll: true }); videoCheck();
  };
  vPlay.onclick = () => vP && vP.getPaused().then(pz => pz ? vP.play() : vP.pause());
  vMute.onclick = () => { if (!vP) return; vMuted = !vMuted; vP.setMuted(vMuted); if (!vMuted) vP.setVolume(1); $('path', vMute).setAttribute('d', vMuted ? ICON.muted : ICON.sound); vMute.setAttribute('aria-label', vMuted ? 'Turn sound on' : 'Mute'); };
  const vSeek = x => { const r = vBar.getBoundingClientRect(), t = clamp((x - r.left) / r.width, 0, 1) * vDur; vShow(t); return t; };
  vBar.addEventListener('pointerdown', e => { vDrag = true; vBar.classList.add('drag'); vBar.setPointerCapture(e.pointerId); vSeek(e.clientX); });
  vBar.addEventListener('pointermove', e => { if (vDrag) vSeek(e.clientX); });
  vBar.addEventListener('pointerup', e => { if (!vDrag) return; vDrag = false; vBar.classList.remove('drag'); if (vP) vP.setCurrentTime(vSeek(e.clientX)).catch(() => {}); vWake(); });
  vBar.addEventListener('pointercancel', () => { vDrag = false; vBar.classList.remove('drag'); vWake(); });
  vBar.addEventListener('keydown', e => { if (vP && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) vP.getCurrentTime().then(t => vP.setCurrentTime(clamp(t + (e.key === 'ArrowRight' ? 5 : -5), 0, vDur))); });
  $('.lb-x', vlb).onclick = closeVim;
  vlb.addEventListener('click', e => { if (e.target === vlb || e.target === vBox) closeVim(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeVim(); });
  vims.forEach(it => {
    it.addEventListener('click', e => { if (e.target.closest('.snd')) return; openVim(it); });
    it.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVim(it); } });
  });

  /* ---------- Click a clip to watch it large, with sound ---------- */
  const lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Video');
  lb.innerHTML = `<button type="button" class="lb-x" aria-label="Close">${svg('M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z')}</button>
    <div class="lb-box"><video playsinline preload="auto"></video>
      <div class="pc lb-pc"><button type="button" class="lb-play" aria-label="Pause">${svg(ICON.pause)}</button>
        <div class="bar lb-bar" role="slider" aria-label="Seek" tabindex="0"><i></i><b></b><s></s></div>
        <span class="tm lb-tm">0:00 / 0:00</span>
        <button type="button" class="lb-mute" aria-label="Mute">${svg(ICON.sound)}</button></div></div>`;
  document.body.appendChild(lb); xHome($('.lb-box', lb), lb);
  const lv = $('video', lb), lPlay = $('.lb-play', lb), lMute = $('.lb-mute', lb), lBar = $('.lb-bar', lb), lFill = $('b', lBar), lKnob = $('s', lBar), lTm = $('.lb-tm', lb);
  let resume = [], lastFocus = null, lDrag = false;
  const lShow = () => { const p = lv.duration ? lv.currentTime / lv.duration : 0; lFill.style.width = lKnob.style.left = (p * 100) + '%'; lTm.textContent = `${fmt(lv.currentTime)} / ${fmt(lv.duration)}`; };
  lv.addEventListener('timeupdate', () => { if (!lDrag) lShow(); });
  lv.addEventListener('loadedmetadata', () => { lb.classList.toggle('wide', lv.videoWidth > lv.videoHeight); lShow(); });
  lv.addEventListener('play', () => $('path', lPlay).setAttribute('d', ICON.pause));
  lv.addEventListener('pause', () => $('path', lPlay).setAttribute('d', ICON.play));
  lv.addEventListener('ended', () => { lv.currentTime = 0; lv.play(); });
  lPlay.onclick = () => lv.paused ? lv.play() : lv.pause();
  const lIcon = () => { const m = lv.muted || lv.volume === 0; $('path', lMute).setAttribute('d', m ? ICON.muted : ICON.sound); lMute.setAttribute('aria-label', m ? 'Turn sound on' : 'Mute'); };
  lv.addEventListener('volumechange', lIcon);
  lMute.onclick = () => { lv.muted = !lv.muted; if (!lv.muted) lv.volume = 1; lIcon(); };
  const lSeek = x => { const r = lBar.getBoundingClientRect(); const t = clamp((x - r.left) / r.width, 0, 1) * (lv.duration || 0); lv.currentTime = t; lShow(); };
  lBar.addEventListener('pointerdown', e => { lDrag = true; lBar.classList.add('drag'); lBar.setPointerCapture(e.pointerId); lSeek(e.clientX); });
  lBar.addEventListener('pointermove', e => { if (lDrag) lSeek(e.clientX); });
  lBar.addEventListener('pointerup', () => { lDrag = false; lBar.classList.remove('drag'); });
  lBar.addEventListener('pointercancel', () => { lDrag = false; lBar.classList.remove('drag'); });
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

  /* ---------- Phones: a text block cut short opens in full, over the page ---------- */
  const txo = document.createElement('div');
  txo.className = 'txo'; txo.setAttribute('role', 'dialog'); txo.setAttribute('aria-modal', 'true'); txo.setAttribute('aria-label', 'Text');
  txo.innerHTML = `<button type="button" class="lb-x" aria-label="Close">${svg('M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z')}</button><div class="txo-in"><div class="k"></div><h2></h2><div class="txo-t"></div></div>`;
  document.body.appendChild(txo);
  let txFocus = null;
  const closeTx = () => { if (!txo.classList.contains('open')) return; txo.classList.remove('open'); document.body.classList.remove('lb-open'); txFocus?.focus?.({ preventScroll: true }); };
  $$('.wrm', row).forEach(bt => bt.addEventListener('click', e => {
    e.stopPropagation(); txFocus = bt;
    const pr = projects[+bt.closest('.blk').dataset.p] || {};
    $('.k', txo).textContent = pr.client || S.group; $('h2', txo).textContent = pr.title || S.title;
    $('.txo-t', txo).innerHTML = $$('p', bt.closest('.blk')).map(q => `<p>${esc(q.textContent)}</p>`).join('');
    $('.txo-in', txo).scrollTop = 0; document.body.classList.add('lb-open'); txo.classList.add('open'); $('.lb-x', txo).focus({ preventScroll: true });
  }));
  $('.lb-x', txo).onclick = closeTx;
  addEventListener('keydown', e => { if (e.key === 'Escape') closeTx(); });

  /* ---------- Gallery: the preview opens a full-screen grid of every photo; click one to see it large ---------- */
  if (galleries.length) {
    const X = svg('M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z');
    const pg = document.createElement('div');
    pg.className = 'pgrid'; pg.setAttribute('role', 'dialog'); pg.setAttribute('aria-modal', 'true'); pg.setAttribute('aria-label', 'Photo gallery');
    pg.innerHTML = `<div class="pg-hd"><div><div class="k">Photo gallery</div><h2></h2></div><button type="button" class="lb-x pg-x" aria-label="Close the gallery">${X}</button></div><div class="pg-body"><div class="pg-rows"></div></div>`;
    const pb = document.createElement('div');
    pb.className = 'plb'; pb.setAttribute('role', 'dialog'); pb.setAttribute('aria-modal', 'true'); pb.setAttribute('aria-label', 'Photo');
    pb.innerHTML = `<button type="button" class="lb-x" aria-label="Close">${X}</button>
      <button type="button" class="plb-nav prev" aria-label="Previous photo">${svg('M15.4 5.4 14 4l-8 8 8 8 1.4-1.4L8.8 12z')}</button>
      <figure class="plb-fig"><img alt=""><figcaption><span class="plb-t"></span><span class="plb-n"></span></figcaption></figure>
      <button type="button" class="plb-nav next" aria-label="Next photo">${svg('M8.6 5.4 10 4l8 8-8 8-1.4-1.4 6.6-6.6z')}</button>`;
    document.body.append(pg, pb);
    const pImg = $('img', pb), pN = $('.plb-n', pb), pT = $('.plb-t', pb), rowsEl = $('.pg-rows', pg);
    let G = null, at = 0, gFocus = null;
    const big = i => `${G.photos[i].dir || G.dir}/l/${G.photos[i].file}.webp`;
    const showP = i => {
      const n = G.photos.length; at = (i + n) % n;
      pb.classList.add('swap'); const src = big(at), im = new Image(); im.src = src;
      const go = () => { if (big(at) === src) { pImg.src = src; pb.classList.remove('swap'); } };
      im.decode ? im.decode().then(go, go) : (im.onload = go);
      pN.textContent = `${String(at + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
      pT.textContent = G.photos[at].title || ''; pT.hidden = !G.photos[at].title; pN.hidden = n < 2;
      [1, -1].forEach(d => { const x = new Image(); x.src = big((at + d + n) % n); });   // have the neighbours ready
    };
    const openGrid = gi => {
      G = galleries[gi]; gFocus = document.activeElement;
      $('h2', pg).textContent = G.title;
      // justified rows: each photo grows in proportion to its width, so every row lines up at both edges
      rowsEl.innerHTML = G.photos.map((ph, i) => `<button type="button" class="pg-it" data-i="${i}" aria-label="Photo ${i + 1} of ${G.photos.length}"><img src="${ph.dir || G.dir}/m/${ph.file}.webp" alt="" loading="lazy" decoding="async"></button>`).join('');
      $('.pg-body', pg).scrollTop = 0; justify();
      document.body.classList.add('lb-open'); pg.classList.add('open'); $('.pg-x', pg).focus();
    };
    // justified rows: photos are added to a row until it would be too wide, then the row is scaled to fit exactly
    const justify = () => {
      if (!G) return;
      const W = rowsEl.clientWidth, gap = innerWidth < 760 ? 5 : 8, target = innerWidth < 760 ? 210 : Math.max(240, Math.min(380, innerHeight * .36));
      const its = $$('.pg-it', rowsEl); let row = [], sum = 0;
      const flush = last => {
        const h = last ? Math.min(target, (W - gap * (row.length - 1)) / sum) : (W - gap * (row.length - 1)) / sum;
        row.forEach(([el, r]) => { el.style.width = (r * h) + 'px'; el.style.height = h + 'px'; }); row = []; sum = 0;
      };
      const cols = innerWidth >= 760 && G.cols;   // a set number per row, e.g. three across
      its.forEach((el, i) => { const r = +G.photos[i].ratio || 1.5; row.push([el, r]); sum += r; if (cols ? row.length === cols : sum * target + gap * (row.length - 1) >= W) flush(false); });
      if (row.length) flush(true);
    };
    addEventListener('resize', () => { if (pg.classList.contains('open')) justify(); });
    const closeGrid = () => { pg.classList.remove('open'); document.body.classList.remove('lb-open'); gFocus?.focus?.({ preventScroll: true }); };
    let direct = null;   // the tile a photo was opened from, when it wasn't opened from the full-screen grid
    const openP = i => { pImg.removeAttribute('src'); pb.classList.toggle('one', G.photos.length < 2); showP(i); pb.classList.add('open'); $('.lb-x', pb).focus(); };
    const closeP = () => {
      pb.classList.remove('open');
      if (direct) { document.body.classList.remove('lb-open'); direct.focus({ preventScroll: true }); direct = null; }
      else $(`.pg-it[data-i="${at}"]`, pg)?.focus({ preventScroll: true });
    };
    $$('.gi', row).forEach(t => t.addEventListener('click', () => { G = galleries[+t.dataset.g]; direct = t; document.body.classList.add('lb-open'); openP(+t.dataset.i); }));
    $('.pg-x', pg).onclick = closeGrid;
    rowsEl.addEventListener('click', e => { const t = e.target.closest('.pg-it'); if (t) openP(+t.dataset.i); });
    $('.lb-x', pb).onclick = closeP;
    $('.prev', pb).onclick = () => showP(at - 1); $('.next', pb).onclick = () => showP(at + 1);
    pb.addEventListener('click', e => { if (e.target === pb || e.target.classList.contains('plb-fig')) closeP(); });
    addEventListener('keydown', e => {
      if (pb.classList.contains('open')) { if (e.key === 'Escape') closeP(); else if (e.key === 'ArrowRight') showP(at + 1); else if (e.key === 'ArrowLeft') showP(at - 1); }
      else if (pg.classList.contains('open') && e.key === 'Escape') closeGrid();
    });
    let sx0 = null;
    pb.addEventListener('pointerdown', e => { sx0 = e.clientX; });
    pb.addEventListener('pointerup', e => { if (sx0 == null) return; const dx = e.clientX - sx0; sx0 = null; if (Math.abs(dx) > 50) showP(at + (dx < 0 ? 1 : -1)); });
    $$('.gh', row).forEach(t => t.addEventListener('click', () => openGrid(+t.dataset.g)));
  }

  addEventListener('scroll', frameSoon, { passive: true });
  // phones: a change of height alone is just the address bar moving — nothing needs laying out again
  let rt; addEventListener('resize', () => { if (touchUI && innerWidth === VW) return frameSoon(); clearTimeout(rt); rt = setTimeout(layout, 100); });
  setProject(0);
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);   // measure again once the type has loaded
})();

/* ---------- Email links: still open the mail app, and also copy the address, with a small "Copied" note ---------- */
(() => {
  let tip, tt;
  const copy = txt => {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt);
    return new Promise((ok, no) => {
      const t = document.createElement('textarea'); t.value = txt; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy') ? ok() : no(); } catch (e) { no(e); } t.remove();
    });
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="mailto:"]'); if (!a) return;
    const addr = decodeURIComponent(a.getAttribute('href').slice(7).split('?')[0]);
    copy(addr).then(() => {
      if (!tip) { tip = document.createElement('div'); tip.className = 'copied-tip'; tip.setAttribute('role', 'status'); document.body.appendChild(tip); }
      tip.textContent = 'Copied';
      const r = a.getBoundingClientRect();
      tip.style.left = Math.min(innerWidth - 60, Math.max(60, r.left + r.width / 2)) + 'px';
      tip.style.top = Math.max(12, r.top - 12) + 'px';
      tip.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => tip.classList.remove('on'), 1600);
    }).catch(() => {});
  });
})();
