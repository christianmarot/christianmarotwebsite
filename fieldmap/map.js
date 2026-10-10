(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const RAD = Math.PI / 180, DEG = 180 / Math.PI, EARTH = 6371;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const bell = (x, c, w) => Math.exp(-((x - c) * (x - c)) / (2 * w * w));
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const lonWrap = l => ((l + 540) % 360) - 180;
  const mulberry = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  /* ================= Data ================= */
  const ROWS = DIARY;
  const NOTES = typeof CV_NOTES !== 'undefined' ? CV_NOTES : {};
  const scls = s => /nda/i.test(s) ? 'nda' : /released/i.test(s) ? 'rel' : /production/i.test(s) ? 'prod' : 'soon';
  const SCOL = { rel: '#8fd19e', prod: '#9cc3e6', nda: '#e9918a', soon: '#f0c35a' };   // released green · in production blue · coming soon amber · NDA red
  const SNAME = { rel: 'Released', prod: 'In production', soon: 'Coming soon', nda: 'Under NDA' };
  const home = { name: HOME[0], country: HOME[1], lon: HOME[2], lat: HOME[3] };
  const dist = (a, b) => d3.geoDistance([a.lon, a.lat], [b.lon, b.lat]);

  // pins: one per place, holding every shoot there (newest first, as on the board)
  const pinMap = new Map();
  ROWS.forEach((r, ri) => (PLACES[r.dest] || []).forEach(([name, country, lon, lat]) => {
    const key = lon + ',' + lat;
    if (!pinMap.has(key)) pinMap.set(key, { key, name, country, lon, lat, rows: [], order: ri, appear: -1 });
    pinMap.get(key).rows.push(r);
  }));
  const pins = [...pinMap.values()];
  pins.forEach(p => { p.cls = scls(p.rows[0].status); p.isHome = dist(p, home) < 0.004; });

  // stops: the board read oldest → newest
  const stops = ROWS.slice().reverse().map(r => {
    const locs = (PLACES[r.dest] || []).map(([name, country, lon, lat]) => ({ name, country, lon, lat, pin: pinMap.get(lon + ',' + lat) }));
    if (!locs.length) return null;
    const c = locs.length > 1 ? d3.geoInterpolate([locs[0].lon, locs[0].lat], [locs[1].lon, locs[1].lat])(.5) : [locs[0].lon, locs[0].lat];
    const far = Math.max(...locs.map(l => dist(l, home)));
    const spread = locs.length > 1 ? dist(locs[0], locs[1]) : 0;
    return { r, locs, lon: c[0], lat: clamp(c[1], -60, 70), k: clamp(1.75 - far * 0.32 - spread * 0.35, 1.08, 1.75), km: locs.reduce((a, l) => a + dist(l, home) * EARTH * 2, 0) };
  }).filter(Boolean);
  const N = stops.length;
  { // running totals for the counters
    const seen = new Set(); let km = 0;
    stops.forEach((s, i) => { s.locs.forEach(l => seen.add(l.country)); km += s.km; s.cum = { shoots: i + 1, countries: seen.size, km }; });
  }
  pins.forEach(pn => { pn.first = stops.findIndex(s => s.locs.some(l => l.pin === pn)); });   // the first shoot that went there
  const allCountries = new Set(pins.map(p => p.country));

  // flight lines: home → every place, one per stop
  const arcs = [];
  stops.forEach((s, si) => s.locs.forEach(l => {
    const d = dist(home, l); if (d < 0.004) return;
    const ip = d3.geoInterpolate([home.lon, home.lat], [l.lon, l.lat]), n = Math.max(12, Math.round(d * 40));
    const pts = []; for (let i = 0; i <= n; i++) { const t = i / n, q = ip(t); pts.push([q[0], q[1], Math.sin(Math.PI * t) * Math.min(.34, .03 + d * .12)]); }
    arcs.push({ si, pin: l.pin, pts, len: d });
  }));

  const words = n => { const a = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'], t = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']; return n < 20 ? a[n] : t[Math.floor(n / 10)] + (n % 10 ? '-' + a[n % 10] : ''); };
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const boardRange = rows => {   // first and last month on the credits board, e.g. "Mar 2021 – Oct 2026"
    const M = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Sept: 8, Oct: 9, Nov: 10, Dec: 11 }, nm = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let lo = 1e9, hi = 0;
    rows.forEach(r => { const yrs = [...r.dates.matchAll(/\d{4}/g)].map(x => +x[0]); [...r.dates.matchAll(/([A-Z][a-z]+)\s*(\d{4})?/g)].forEach(m => { if (!(m[1] in M) || !yrs.length) return; const v = (m[2] ? +m[2] : yrs[yrs.length - 1]) * 12 + M[m[1]]; lo = Math.min(lo, v); hi = Math.max(hi, v); }); });
    return hi ? `${nm[lo % 12]} ${Math.floor(lo / 12)} – ${nm[hi % 12]} ${Math.floor(hi / 12)}` : '';
  };
  $('#nRange').textContent = boardRange(ROWS);
  $('#nShoots').textContent = ROWS.length;
  $('#nCountries').textContent = allCountries.size;

  /* ================= Geography ================= */
  const land110 = topojson.merge(TOPO110, TOPO110.objects.countries.geometries);
  const borders110 = topojson.mesh(TOPO110, TOPO110.objects.countries, (a, b) => a !== b);
  const land50 = topojson.feature(LAND50, LAND50.objects.land);
  const grat = d3.geoGraticule10();
  const sphere = { type: 'Sphere' };
  const ND = DOTS.length / 2, dLon = new Float32Array(ND), dCos = new Float32Array(ND), dSin = new Float32Array(ND);
  for (let i = 0; i < ND; i++) { dLon[i] = DOTS[2 * i] / 10 * RAD; const la = DOTS[2 * i + 1] / 10 * RAD; dCos[i] = Math.cos(la); dSin[i] = Math.sin(la); }

  /* ================= Clouds (painted once, offscreen) ================= */
  const makeCloud = (seed, w, h) => {
    const rnd = mulberry(seed), c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
    const puff = (x, y, r, a) => { const gr = g.createRadialGradient(x, y - r * .25, r * .05, x, y, r); gr.addColorStop(0, `rgba(255,255,255,${a})`); gr.addColorStop(.5, `rgba(255,255,255,${a * .55})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
    const tall = .55 + rnd() * .45;
    for (let i = 0; i < 46; i++) {                    // the body: overlapping billows, tallest in the middle
      const u = .14 + .72 * rnd(), body = Math.pow(Math.sin(Math.PI * u), .8);
      const r = h * (.09 + .15 * rnd()) * (.5 + .8 * body);
      puff(w * u, h * (.7 - .36 * body * tall * rnd()) - r * .15, r, .32 + .3 * rnd());
    }
    for (let i = 0; i < 26; i++) {                    // wisps trailing off the base and ends
      const u = rnd(), r = h * (.05 + .08 * rnd());
      puff(w * (.05 + .9 * u), h * (.66 + (rnd() - .3) * .16), r, .08 + .1 * rnd());
    }
    g.globalCompositeOperation = 'source-atop';       // shade the underside
    const lg = g.createLinearGradient(0, h * .15, 0, h * .82);
    lg.addColorStop(0, 'rgba(255,252,246,.25)'); lg.addColorStop(.5, 'rgba(176,184,190,.18)'); lg.addColorStop(1, 'rgba(96,108,118,.62)');
    g.fillStyle = lg; g.fillRect(0, 0, w, h);
    const s = document.createElement('canvas'); s.width = w; s.height = h; const sg = s.getContext('2d');   // matching shadow
    sg.drawImage(c, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = '#000'; sg.fillRect(0, 0, w, h);
    return { c, s };
  };
  const SPR = Array.from({ length: 8 }, (_, i) => makeCloud(11 + i * 97, 480, 290));
  const crand = mulberry(7);
  const skyClouds = Array.from({ length: 54 }, (_, i) => {   // weather sitting on the globe
    const band = crand();
    const lat = band < .45 ? lerp(30, 66, crand()) : band < .7 ? lerp(-12, 14, crand()) : band < .9 ? lerp(-58, -30, crand()) : lerp(-25, 28, crand());
    return { lon: lerp(-180, 180, crand()), lat, size: lerp(3.2, 9.5, crand()), spr: i % SPR.length, drift: lerp(.35, 1.1, crand()) * (lat > 25 || lat < -25 ? 1 : -.6), a: lerp(.55, 1, crand()), rot: (crand() - .5) * .5 };
  });
  const diveClouds = Array.from({ length: 120 }, (_, i) => ({ x: (crand() - .5) * 3.6, y: (crand() - .5) * 2.2, z: lerp(.25, 3.1, crand()), s: lerp(.7, 1.5, crand()), spr: i % SPR.length, flip: crand() < .5 })).sort((a, b) => b.z - a.z);
  const stars = Array.from({ length: 260 }, () => ({ u: crand(), v: crand(), r: crand() < .9 ? .6 : 1.2, a: lerp(.08, .45, crand()) }));

  /* ================= Canvas + camera ================= */
  const stage = $('#stage'), track = $('#track'), cv = $('#globe'), ctx = cv.getContext('2d');
  const glc = $('#gl'), over = $('#over'), octx = over.getContext('2d');
  const sky = makeSky(glc, SAT_JPG);
  let GLS = 1;
  let W = 0, H = 0, DPR = 1, mobile = false;
  const resize = () => {
    DPR = Math.min(devicePixelRatio || 1, 1.75); W = stage.clientWidth; H = stage.clientHeight; mobile = W < 760;
    cv.width = over.width = Math.round(W * DPR); cv.height = over.height = Math.round(H * DPR);
    GLS = mobile ? Math.min(DPR, 1.5) : Math.min(DPR, 1.35); { const q = +new URLSearchParams(location.search).get('gls'); if (q) GLS = q; } glc.width = Math.round(W * GLS); glc.height = Math.round(H * GLS);
  };
  addEventListener('resize', resize); resize();

  const P = d3.geoOrthographic().clipAngle(90).precision(.45);
  const path = d3.geoPath(P, ctx);
  const cam = { lon: -20, lat: 18, k: 1, cx: 0, cy: 0, R: 100 };
  let sp0 = 0, cp0 = 1;
  const setCam = () => { sp0 = Math.sin(cam.lat * RAD); cp0 = Math.cos(cam.lat * RAD); P.rotate([-cam.lon, -cam.lat]).scale(cam.R).translate([cam.cx, cam.cy]); };
  const xyz = (lon, lat) => { // unit sphere → view space (x right, y up, z towards viewer)
    const l = (lon - cam.lon) * RAD, p = lat * RAD, cpp = Math.cos(p), sp = Math.sin(p), cl = Math.cos(l);
    return [cpp * Math.sin(l), cp0 * sp - sp0 * cpp * cl, sp0 * sp + cp0 * cpp * cl];
  };
  const screen = (lon, lat, lift = 0) => { const [x, y, z] = xyz(lon, lat), m = cam.R * (1 + lift); return { x: cam.cx + x * m, y: cam.cy - y * m, z, vis: z >= 0 || (x * x + y * y) * (1 + lift) * (1 + lift) > 1 }; };

  /* ================= Scroll timeline ================= */
  const CH = [0, .1, .38, .92];             // intro · shoots (the burst) · clouds · explore
  const J0 = CH[1], J1 = CH[2], C1 = CH[3];
  let progress = 0;
  const readScroll = () => { const r = track.getBoundingClientRect(); progress = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
  addEventListener('scroll', readScroll, { passive: true }); readScroll();
  const goTo = (i, instant) => {
    const r = track.getBoundingClientRect(), top = scrollY + r.top, span = r.height - innerHeight;
    const at = [0, J0 + .01, J1 + (C1 - J1) * .38, C1 + .01][i];
    scrollTo({ top: top + span * at, behavior: instant || reduce ? 'instant' : 'smooth' });
  };
  // an eased scroll of our own, so the break-through always takes the same unhurried time
  let glideId = 0;
  const glide = (i, ms, at) => {
    const r = track.getBoundingClientRect(), top0 = scrollY, span = r.height - innerHeight;
    const to = scrollY + r.top + span * (at ?? CH[i] + .012), id = ++glideId, t0g = performance.now();
    const stepG = now => { if (id !== glideId) return; const t = clamp((now - t0g) / ms, 0, 1); scrollTo(0, lerp(top0, to, ease(t))); if (t < 1) requestAnimationFrame(stepG); };
    requestAnimationFrame(stepG);
  };
  addEventListener('wheel', () => glideId++, { passive: true }); addEventListener('touchstart', () => glideId++, { passive: true });
  $$('[data-go]').forEach(b => b.addEventListener('click', () => goTo(+b.dataset.go, b.closest('.intro'))));

  /* ================= Explore camera (user-driven) ================= */
  const XP = { lon: 12, lat: 40, k: 3.4 };
  // the burst: the globe turns from the Atlantic (London, the Americas) round to the Indian Ocean while every route fires
  const B0 = { lon: -38, lat: 27, k: 1.06 }, B1 = { lon: 52, lat: 20, k: 1.2 };
  const BSPREAD = 1.6, BDUR = .85;                   // seconds: the last route sets off 1.6 s after the first, each takes 0.85 s
  const user = { lon: XP.lon, lat: XP.lat, k: XP.k, tl: XP.lon, tb: XP.lat, tk: XP.k, vx: 0, vy: 0, fresh: true };
  const flyTo = (lon, lat, k) => { user.tl = lon; user.tb = clamp(lat, -70, 78); if (k) user.tk = clamp(k, .9, 7); user.vx = user.vy = 0; };

  /* ================= The journey, replayed inside explore ================= */
  // plays the credits board in order, shoot to shoot, in about 25 seconds; pause, scrub or close at any time
  const SPS = .66;                                   // seconds per shoot
  const replay = { on: false, t: 0, paused: false, from: null, lay: 0 };
  const rpCtl = $('#rpCtl'), rpPlay = $('#rpPlay'), playJ = $('#playJ');
  const setRpBtn = () => {
    const st = replay.t >= N ? 'again' : replay.paused ? 'play' : 'pause';
    rpPlay.dataset.s = st; rpPlay.querySelector('b').textContent = { again: 'Play again', play: 'Play', pause: 'Pause' }[st];
  };
  const startReplay = () => {
    closePop(); toggleList(false);
    Object.assign(replay, { on: true, t: 0, paused: false, from: { lon: cam.lon, lat: cam.lat, k: cam.k } });
    cardIdx = -1; setRpBtn(); rpPlay.focus({ preventScroll: true });
  };
  const endReplay = () => {
    if (!replay.on) return; replay.on = false;
    // carry on exploring from wherever the journey left the camera
    user.lon = user.tl = lonWrap(cam.lon); user.lat = user.tb = clamp(cam.lat, -70, 78); user.k = user.tk = clamp(cam.k, .9, 7); user.vx = user.vy = 0;
    $('#tip').hidden = true;
  };
  playJ.addEventListener('click', startReplay);
  rpPlay.addEventListener('click', () => {
    if (replay.t >= N) { replay.from = { lon: cam.lon, lat: cam.lat, k: cam.k }; replay.t = 0; replay.paused = false; cardIdx = -1; } else replay.paused = !replay.paused;
    setRpBtn();
  });
  $('#rpX').addEventListener('click', () => { endReplay(); playJ.focus({ preventScroll: true }); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && replay.on) endReplay(); });

  /* ================= HUD ================= */
  const ov = { intro: $('#intro'), tl: $('#timeline'), card: $('#card'), stats: $('#stats'), dive: $('#dive'), xp: $('#xpTop'), idx: $('#index'), zoom: $('#zoom') };
  const show = (el, on) => el.classList.toggle('off', !on);
  // timeline ticks
  { const tl = ov.tl; let lastY = '';
    stops.forEach((s, i) => {
      const x = (i / (N - 1)) * 100, tk = document.createElement('i'); tk.className = 'tk'; tk.style.left = x + '%'; tl.appendChild(tk); s.tick = tk;
      const y = (s.r.dates.match(/(\d{4})(?!.*\d{4})/) || [])[1] || '';
      if (y && y !== lastY && (i === 0 || x - (tl._lx ?? -99) > 11)) { const yl = document.createElement('span'); yl.className = 'yr'; yl.style.left = x + '%'; yl.textContent = y; tl.appendChild(yl); tl._lx = x; }
      lastY = y;
    });
    const mk = document.createElement('i'); mk.className = 'mk'; tl.appendChild(mk); tl._mk = mk;
    // drag (or click) along the timeline to jump between shoots
    tl.setAttribute('aria-valuemax', N);
    const toStop = i => { replay.t = clamp(i, 0, N - 1) + .55; if (replay.t >= N) replay.t = N - .01; setRpBtn(); };
    const at = x => { const r = tl.getBoundingClientRect(); return Math.round(clamp((x - r.left) / r.width, 0, 1) * (N - 1)); };
    const tip = $('#tip');
    const tipAt = (x, i) => { const r = tl.getBoundingClientRect(), sr = stage.getBoundingClientRect(), st = stops[i]; tip.textContent = `${st.r.dates} · ${st.r.project}`; tip.style.left = clamp(r.left - sr.left + (i / (N - 1)) * r.width, 90, W - 90) + 'px'; tip.style.top = (r.bottom - sr.top + 42) + 'px'; tip.hidden = false; };
    tl.addEventListener('pointerdown', e => { tl.setPointerCapture(e.pointerId); tl.classList.add('drag'); const i = at(e.clientX); toStop(i); tipAt(e.clientX, i); });
    tl.addEventListener('pointermove', e => { const i = at(e.clientX); if (tl.classList.contains('drag')) toStop(i); if (e.pointerType === 'mouse' || tl.classList.contains('drag')) tipAt(e.clientX, i); });
    const stopDrag = () => { tl.classList.remove('drag'); tip.hidden = true; };
    tl.addEventListener('pointerup', stopDrag); tl.addEventListener('pointercancel', stopDrag); tl.addEventListener('pointerleave', () => { if (!tl.classList.contains('drag')) tip.hidden = true; });
    tl.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); toStop(Math.max(0, cardIdx) + (e.key === 'ArrowRight' ? 1 : -1)); } });
  }
  // split-flap text, like the credits board
  const CHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/–';
  const flap = (el, text) => {
    if (el._t === text) return; el._t = text;
    if (reduce) { el.textContent = text; return; }
    const id = (el._id = (el._id || 0) + 1), t0 = performance.now(), dur = 520 + text.length * 18;
    const tick = now => {
      if (el._id !== id) return; const t = (now - t0) / dur;
      el.textContent = [...text].map((ch, i) => (ch === ' ' || t > (i + 1) / text.length) ? ch : CHS[Math.floor(Math.random() * CHS.length)]).join('');
      if (t < 1.02) requestAnimationFrame(tick); else el.textContent = text;
    };
    requestAnimationFrame(tick);
  };
  let cardIdx = -1;
  const setCard = i => {
    if (i === cardIdx) return; cardIdx = i; const s = stops[i], r = s.r, c = scls(r.status);
    flap($('#cDates'), r.dates.toUpperCase()); $('#cNum').textContent = `${String(i + 1).padStart(2, '0')} / ${N}`;
    const h = $('#cProject'); h.style.opacity = 0; setTimeout(() => { h.textContent = r.project; h.style.transition = 'opacity .45s'; h.style.opacity = 1; }, reduce ? 0 : 140);
    flap($('#cDest'), r.dest.toUpperCase()); flap($('#cFor'), r.for.toUpperCase()); flap($('#cRole'), r.role.toUpperCase());
    const st = $('#cStatus'); st.className = 'badge s-' + c; st.textContent = r.status;
  };
  const disp = { shoots: 0, countries: 0, km: 0 };
  const fmt = n => Math.round(n).toLocaleString('en-GB');

  // explore: filters + list
  let filter = 'all';
  const counts = { all: ROWS.length }; ROWS.forEach(r => { const c = scls(r.status); counts[c] = (counts[c] || 0) + 1; });
  $('#chips').innerHTML = [['all', 'All shoots'], ['rel', 'Released'], ['prod', 'In production'], ['soon', 'Coming soon'], ['nda', 'Under NDA']]
    .filter(([k]) => counts[k]).map(([k, l]) => `<button type="button" class="chip" data-f="${k}" aria-pressed="${k === 'all'}">${k === 'all' ? '' : `<span class="dot" style="color:${SCOL[k]}"></span>`}${l}<span class="c">${counts[k]}</span></button>`).join('');
  const pinOn = p => filter === 'all' || p.rows.some(r => scls(r.status) === filter);
  const sortedPins = pins.slice().sort((a, b) => a.order - b.order);
  $('#locCount').textContent = `${pins.length} places`;
  $('#locList').innerHTML = sortedPins.map(p => `<li data-k="${esc(p.key)}"><button type="button"><span class="pl">${esc(p.name)}<small>${esc(p.country === p.name ? p.rows[0].project : p.country + ' · ' + p.rows[0].project)}</small></span><span class="ct">${p.rows.length > 1 ? '×' + p.rows.length : ''}</span></button></li>`).join('');
  const applyFilter = () => {
    $$('#chips .chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.f === filter));
    $$('#locList li').forEach(li => li.classList.toggle('dim', !pinOn(pinMap.get(li.dataset.k))));
  };
  $('#chips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; filter = b.dataset.f; applyFilter(); if (openPin && !pinOn(openPin)) closePop(); });
  $('#locList').addEventListener('click', e => { const li = e.target.closest('li'); if (!li) return; const p = pinMap.get(li.dataset.k); openPop(p); if (mobile) toggleList(false); });
  const listBtn = $('#listBtn');
  const toggleList = o => { ov.idx.classList.toggle('open', o); listBtn.setAttribute('aria-expanded', o); listBtn.textContent = o ? 'Hide locations' : 'All locations'; };
  listBtn.addEventListener('click', () => toggleList(!ov.idx.classList.contains('open')));

  // pin popover
  const pop = $('#pop'); let openPin = null;
  const openPop = p => {
    openPin = p; flyTo(p.lon, p.lat - (mobile ? 6 / Math.max(1, user.tk) : 0), Math.max(user.tk, p.isHome ? 4.2 : 2.8));
    $('#popTitle').textContent = p.name;
    $('#popSub').textContent = `${p.country !== p.name ? p.country + ' · ' : ''}${p.rows.length} shoot${p.rows.length > 1 ? 's' : ''}${p.isHome ? ' · home' : ` · ${fmt(dist(p, home) * EARTH)} km from London`}`;
    const seen = new Set();
    $('#popList').innerHTML = p.rows.map(r => {
      const nda = /nda/i.test(r.status), note = nda ? '' : (NOTES[r.project + ' — ' + r.dest] || NOTES[r.project] || '');
      const show = note && !seen.has(note); if (note) seen.add(note);
      return `<li><div class="d">${esc(r.dates)}</div><div class="p">${esc(r.project)}</div><div class="m">${esc(r.for)}<br>${esc(r.role)}</div><div><span class="badge s-${scls(r.status)}" style="font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase">${esc(r.status)}</span></div>${show ? `<p class="note">${esc(note)}</p>` : nda && !seen.has('nda') ? (seen.add('nda'), '<p class="note nda">Details under NDA until release</p>') : ''}</li>`;
    }).join('');
    $('#popList').scrollTop = 0;
    pop.hidden = false; $$('#locList li button').forEach(b => b.classList.toggle('on', b.parentElement.dataset.k === p.key));
  };
  const closePop = () => { openPin = null; pop.hidden = true; $$('#locList li button.on').forEach(b => b.classList.remove('on')); };
  $('#popX').addEventListener('click', closePop);
  addEventListener('keydown', e => { if (e.key === 'Escape') closePop(); });
  $('#zIn').onclick = () => flyTo(user.tl, user.tb, user.tk * 1.6);
  $('#zOut').onclick = () => flyTo(user.tl, user.tb, user.tk / 1.6);
  $('#zHome').onclick = () => { closePop(); flyTo(home.lon, home.lat, 5); };

  /* ================= Breath: blow into the mic (or press and hold) to clear the clouds ================= */
  const wind = { level: 0, push: 0, clear: 0, broke: false, x: 0, y: 0, hold: 0, mic: null, floor: .004, lastMouse: -1e9, mx: 0, my: 0 };
  const blowBtn = $('#blow'), blowLbl = $('#blowLbl');
  const setBlow = (state, text) => { blowBtn.dataset.state = state; blowLbl.textContent = text; };
  const startMic = async () => {
    if (wind.mic) { wind.mic.stream.getTracks().forEach(t => t.stop()); wind.mic.ctx.close(); wind.mic = null; setBlow('idle', 'Blow the clouds away'); return; }
    if (!navigator.mediaDevices?.getUserMedia) { setBlow('nomic', 'No mic here · press and hold the clouds'); return; }
    setBlow('asking', 'Allow the microphone…');
    try {
      // wind noise filters off: they are built to remove exactly the sound of blowing
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      const ctxA = new (window.AudioContext || window.webkitAudioContext)();
      const an = ctxA.createAnalyser(); an.fftSize = 2048; an.smoothingTimeConstant = .25;
      ctxA.createMediaStreamSource(stream).connect(an);
      wind.mic = { stream, ctx: ctxA, an, td: new Float32Array(an.fftSize), fd: new Float32Array(an.frequencyBinCount), hz: ctxA.sampleRate / an.fftSize };
      setBlow('on', 'Listening · blow into your mic');
    } catch (e) { setBlow('nomic', 'Mic blocked · press and hold the clouds instead'); }
  };
  blowBtn.addEventListener('click', startMic);
  // how hard is someone blowing? loud, broadband, low-heavy noise — not the tonal peaks of a voice
  const readMic = () => {
    const m = wind.mic; if (!m) return 0;
    m.an.getFloatTimeDomainData(m.td); let sq = 0; for (let i = 0; i < m.td.length; i++) sq += m.td[i] * m.td[i];
    const rms = Math.sqrt(sq / m.td.length);
    m.an.getFloatFrequencyData(m.fd);
    const i0 = Math.max(1, Math.round(80 / m.hz)), i1 = Math.round(4000 / m.hz), iL = Math.round(700 / m.hz);
    let sum = 0, logSum = 0, low = 0, n = 0;
    for (let i = i0; i < i1; i++) { const p = Math.pow(10, m.fd[i] / 10) + 1e-12; sum += p; logSum += Math.log(p); if (i < iL) low += p; n++; }
    const flat = Math.exp(logSum / n) / (sum / n), lowShare = low / sum;
    if (rms < wind.floor * 2) wind.floor = lerp(wind.floor, rms, .02);           // learn the room's background level
    const loud = smooth(wind.floor * 3 + .008, wind.floor * 3 + .11, rms);
    const breathy = Math.max(smooth(.1, .32, flat), smooth(.62, .85, lowShare) * .85);
    const lvl = loud * (.3 + .7 * breathy);
    return lvl;
  };
  const updateWind = dt => {
    const target = Math.max(readMic(), wind.hold ? .9 : 0);
    blowBtn.style.setProperty('--lvl', target.toFixed(3));
    wind.level += (target - wind.level) * (1 - Math.exp(-dt * (target > wind.level ? 14 : 2.4)));
    wind.push = clamp(wind.push + wind.level * dt * 1.5, 0, 1.7) * Math.exp(-dt * (wind.level > .08 ? .08 : .4));
    // keep blowing and the whole sky clears (about a second and a half of a good blow); it drifts back slowly
    if (wind.level > .22) wind.clear = Math.min(1, wind.clear + (wind.level - .15) * dt * .9);
    else wind.clear = Math.max(0, wind.clear - dt * .09);
    blowBtn.style.setProperty('--fill', wind.clear.toFixed(3));
    if (!wind.hold) {   // where the breath comes from: the pointer if it's over the map, else where the mic sits
      const recent = performance.now() - wind.lastMouse < 4000;
      const tx = recent ? wind.mx : W / 2, ty = recent ? wind.my : (mobile ? H * .94 : H * .58);
      if (wind.push < .02) { wind.x = tx; wind.y = ty; } else { wind.x = lerp(wind.x, tx, .04); wind.y = lerp(wind.y, ty, .04); }
    }
  };
  let holdT = 0;
  const beginHold = (x, y) => { clearTimeout(holdT); holdT = setTimeout(() => { wind.hold = 1; wind.x = x; wind.y = y; stage.classList.add('blowing'); }, 240); };
  const endHold = () => { clearTimeout(holdT); const was = wind.hold; wind.hold = 0; stage.classList.remove('blowing'); return was; };

  /* ================= Pointer: drag, pinch, tap ================= */
  let exploring = false, dragging = null, hoverPin = null;
  const ptrs = new Map();
  const pinAt = (x, y) => { let best = null, bd = 22 * 22; screenPins.forEach(sp => { if (!sp.on) return; const d = (sp.x - x) ** 2 + (sp.y - y) ** 2; if (d < bd) { bd = d; best = sp.p; } }); return best; };
  let screenPins = [];
  over.addEventListener('pointerdown', e => {
    const rect0 = over.getBoundingClientRect();
    if (blowable) beginHold(e.clientX - rect0.left, e.clientY - rect0.top);
    if (!exploring) { if (blowable) try { over.setPointerCapture(e.pointerId); } catch (_) {} return; }
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 1) { dragging = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t: performance.now(), moved: 0, touch: e.pointerType === 'touch' }; user.vx = user.vy = 0; }
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; dragging = { pinch: Math.hypot(a.x - b.x, a.y - b.y), k: user.tk }; }
    try { over.setPointerCapture(e.pointerId); } catch (_) {}
  });
  over.addEventListener('pointermove', e => {
    const rect = over.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top;
    if (e.pointerType === 'mouse') { wind.mx = x; wind.my = y; wind.lastMouse = performance.now(); }
    if (wind.hold) { wind.x = x; wind.y = y; }
    if (exploring && !dragging && e.pointerType === 'mouse') {
      hoverPin = pinAt(x, y); over.style.cursor = hoverPin ? 'pointer' : 'grab';
    }
    if (!dragging || !ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (dragging.pinch && ptrs.size === 2) { const [a, b] = [...ptrs.values()]; const k = clamp(dragging.k * Math.hypot(a.x - b.x, a.y - b.y) / dragging.pinch, .9, 7); user.k = user.tk = k; return; }
    if (dragging.pinch) return;
    const dx = e.clientX - dragging.x, dy = e.clientY - dragging.y; dragging.x = e.clientX; dragging.y = e.clientY;
    dragging.moved += Math.abs(dx) + Math.abs(dy);
    if (dragging.moved > 4) { stage.classList.add('dragging'); if (!wind.hold) clearTimeout(holdT); }
    if (wind.hold) return;
    const f = DEG / cam.R;
    const dl = -dx * f, db = dy * f;
    user.lon = user.tl = lonWrap(user.lon + dl); user.lat = user.tb = clamp(user.lat + db, -70, 78);
    const now = performance.now(), dt = Math.max(8, now - dragging.t); dragging.t = now;
    user.vx = lerp(user.vx, dl / dt * 16, .5); user.vy = lerp(user.vy, db / dt * 16, .5);
  });
  const endPtr = e => {
    const blew = endHold();
    if (!ptrs.has(e.pointerId)) return; ptrs.delete(e.pointerId);
    if (blew) { dragging = null; stage.classList.remove('dragging'); return; }
    if (ptrs.size) return;
    const d = dragging; dragging = null; stage.classList.remove('dragging');
    if (d && !d.pinch && d.moved < 6 && e.type === 'pointerup') {
      const rect = over.getBoundingClientRect(), p = pinAt(e.clientX - rect.left, e.clientY - rect.top);
      if (p) openPop(p); else if (!pop.hidden) closePop();
    }
  };
  over.addEventListener('pointerup', endPtr); over.addEventListener('pointercancel', e => { endHold(); ptrs.delete(e.pointerId); dragging = null; stage.classList.remove('dragging'); });
  over.addEventListener('pointerleave', () => { hoverPin = null; });
  over.addEventListener('dblclick', e => {
    if (!exploring) return; const rect = over.getBoundingClientRect(), ll = P.invert([e.clientX - rect.left, e.clientY - rect.top]);
    if (ll && !isNaN(ll[0])) flyTo(ll[0], ll[1], user.tk * 1.8);
  });
  addEventListener('keydown', e => {
    if (!exploring || e.target.closest('input,textarea')) return;
    const st = 12 / user.tk;
    if (e.key === 'ArrowLeft') flyTo(user.tl - st, user.tb); else if (e.key === 'ArrowRight') flyTo(user.tl + st, user.tb);
    else if (e.key === '+' || e.key === '=') flyTo(user.tl, user.tb, user.tk * 1.4); else if (e.key === '-') flyTo(user.tl, user.tb, user.tk / 1.4);
  });

  /* ================= Drawing ================= */
  const COAST = 'rgba(238,235,228,', AMBER = 'rgba(240,195,90,';
  const drawStars = () => {
    ctx.fillStyle = '#eeebe4';
    const sh = cam.lon * 1.6, shv = cam.lat * 1.2;
    stars.forEach(s => { const x = ((s.u * W - sh) % W + W) % W, y = ((s.v * H + shv) % H + H) % H; ctx.globalAlpha = s.a; ctx.fillRect(x, y, s.r, s.r); });
    ctx.globalAlpha = 1;
  };
  const drawGlobeBase = () => {
    const { cx, cy, R } = cam;
    const glow = ctx.createRadialGradient(cx, cy, R * .96, cx, cy, R * 1.28);       // atmosphere
    glow.addColorStop(0, 'rgba(150,180,190,.20)'); glow.addColorStop(.35, 'rgba(110,140,150,.07)'); glow.addColorStop(1, 'rgba(110,140,150,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, R * 1.28, 0, 7); ctx.fill();
    const sea = ctx.createRadialGradient(cx - R * .35, cy - R * .4, R * .1, cx, cy, R);  // ocean, lit from the upper left
    sea.addColorStop(0, '#18201d'); sea.addColorStop(.7, '#111614'); sea.addColorStop(1, '#0b0e0d');
    ctx.fillStyle = sea; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
  };
  const drawLand = (reveal, now) => {
    const { k, R, cx, cy } = cam;
    const fill = smooth(1.9, 3.1, k);
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
    // graticule
    ctx.strokeStyle = COAST + (.07 * (1 - fill * .5) * reveal) + ')'; ctx.lineWidth = .6; ctx.beginPath(); path(grat); ctx.stroke();
    // filled land when close
    if (fill > .01) { ctx.globalAlpha = fill; ctx.fillStyle = '#1a221e'; ctx.beginPath(); path(k > 2.2 ? land50 : land110); ctx.fill(); ctx.globalAlpha = 1; }
    // dot matrix
    if (fill < .99) {
      const rr = clamp(R / 520, .55, 1.7), cutoff = reveal >= 1 ? -1 : Math.cos(reveal * Math.PI * .5 + 1e-3), base = (1 - fill);
      ctx.fillStyle = '#eeebe4';
      const cl0 = cam.lon * RAD;
      for (let i = 0; i < ND; i++) {
        const l = dLon[i] - cl0, cl = Math.cos(l), z = sp0 * dSin[i] + cp0 * dCos[i] * cl;
        if (z <= 0) continue;
        if (z < cutoff) continue;
        const x = dCos[i] * Math.sin(l), y = cp0 * dSin[i] - sp0 * dCos[i] * cl;
        ctx.globalAlpha = base * (.16 + .62 * z);
        const s = rr * (.55 + .45 * z);
        ctx.fillRect(cx + x * R - s, cy - y * R - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1;
    }
    // coastline — the line drawing
    ctx.strokeStyle = COAST + ((.16 + .3 * fill) * reveal) + ')'; ctx.lineWidth = .7 + fill * .3;
    ctx.beginPath(); path(k > 2.2 ? land50 : land110); ctx.stroke();
    if (k > 1.7) { ctx.strokeStyle = COAST + (.12 * smooth(1.7, 2.6, k)) + ')'; ctx.lineWidth = .6; ctx.setLineDash([2, 3]); ctx.beginPath(); path(borders110); ctx.stroke(); ctx.setLineDash([]); }
    ctx.restore();
  };
  const drawShade = () => {   // sphere shading over the land
    const { cx, cy, R } = cam;
    const sh = ctx.createRadialGradient(cx - R * .3, cy - R * .35, R * .2, cx, cy, R * 1.02);
    sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(.75, 'rgba(0,0,0,.12)'); sh.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(190,210,215,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
  };
  const drawSkyClouds = (alpha, dt) => {
    if (alpha < .01) return;
    const { R } = cam, lift = .018;
    const sunx = R * .010, suny = R * .016;
    const vis = [];
    skyClouds.forEach(c => {
      if (!reduce) c.lon = lonWrap(c.lon + c.drift * dt);
      const [x, y, z] = xyz(c.lon, c.lat); if (z < .02) return;
      vis.push({ c, x, y, z });
    });
    vis.sort((a, b) => a.z - b.z);
    for (const pass of [0, 1]) vis.forEach(({ c, x, y, z }) => {
      const m = R * (1 + lift * (pass ? 1 : 0)), sx = cam.cx + x * m + (pass ? 0 : sunx), sy = cam.cy - y * m + (pass ? 0 : suny);
      const w = R * Math.sin(c.size * RAD) * 2.6, h = w * .61;
      ctx.save(); ctx.translate(sx, sy);
      const ang = Math.atan2(-y, x); ctx.rotate(ang); ctx.scale(Math.max(.12, z), 1); ctx.rotate(-ang + c.rot);
      ctx.globalAlpha = alpha * c.a * smooth(.02, .3, z) * (pass ? .78 : .32);
      const s = SPR[c.spr]; ctx.drawImage(pass ? s.c : s.s, -w / 2, -h / 2, w, h);
      ctx.restore();
    });
    ctx.globalAlpha = 1;
  };
  const drawArc = (a, prog, hot) => {
    if (prog <= 0) return;
    const n = a.pts.length - 1, upto = prog * n;
    octx.beginPath(); let pen = false, head = null;
    for (let i = 0; i <= Math.ceil(upto); i++) {
      let q = a.pts[Math.min(i, n)];
      if (i > upto) { const q0 = a.pts[i - 1], f = upto - (i - 1); q = [lerp(q0[0], q[0], f), lerp(q0[1], q[1], f), lerp(q0[2], q[2], f)]; }
      const s = screen(q[0], q[1], q[2]);
      if (!s.vis) { pen = false; continue; }
      if (!pen) { octx.moveTo(s.x, s.y); pen = true; } else octx.lineTo(s.x, s.y);
      head = s;
    }
    octx.stroke();
    if (hot && head && prog < 1) { octx.save(); octx.fillStyle = '#fff6dc'; octx.shadowColor = '#f0c35a'; octx.shadowBlur = 14; octx.beginPath(); octx.arc(head.x, head.y, 2.6, 0, 7); octx.fill(); octx.restore(); }
  };
  const label = (x, y, text, sub, col, right) => {
    octx.save(); octx.font = '500 11px "IBM Plex Mono", monospace'; octx.textBaseline = 'middle';
    const tw = octx.measureText(text).width, dx = right ? -16 : 16, tx = x + dx + (right ? -tw : 0);
    octx.strokeStyle = 'rgba(238,235,228,.35)'; octx.lineWidth = 1; octx.beginPath(); octx.moveTo(x + (right ? -6 : 6), y); octx.lineTo(x + dx * .8, y); octx.stroke();
    octx.fillStyle = 'rgba(7,8,8,.72)'; octx.fillRect(tx - 6, y - 10, tw + 12, sub ? 34 : 20);
    octx.fillStyle = col || '#eeebe4'; octx.fillText(text, tx, y);
    if (sub) { octx.fillStyle = '#858b84'; octx.font = '400 10px "IBM Plex Mono", monospace'; octx.fillText(sub, tx, y + 14); }
    octx.restore();
  };
  const drawPins = (now, mode, curPins) => {
    screenPins = [];
    const showAllLabels = mode === 'x' && cam.k > 3.4;
    pins.forEach(p => {
      if (p.appear < 0) return;
      const s = screen(p.lon, p.lat); if (s.z < .02) return;
      const on = mode !== 'x' || pinOn(p), age = (now - p.appear) / 900;
      const pop = reduce ? 1 : easeOut(clamp(age, 0, 1)), fade = smooth(.02, .22, s.z) * (on ? 1 : .22);
      const col = SCOL[p.cls], r = (2.4 + Math.sqrt(p.rows.length) * 1.3) * (mobile ? .9 : 1) * pop;
      octx.globalAlpha = fade;
      if (age < 1.6 && !reduce) { const t = clamp(age / 1.6, 0, 1); octx.strokeStyle = col; octx.globalAlpha = fade * (1 - t); octx.lineWidth = 1.2; octx.beginPath(); octx.arc(s.x, s.y, r + t * 26, 0, 7); octx.stroke(); octx.globalAlpha = fade; }
      const hot = p === hoverPin || p === openPin || curPins.has(p);
      if (hot) { octx.strokeStyle = col; octx.lineWidth = 1; octx.beginPath(); octx.arc(s.x, s.y, r + 5 + Math.sin(now / 300) * 1.5, 0, 7); octx.stroke(); }
      octx.fillStyle = 'rgba(7,8,8,.85)'; octx.beginPath(); octx.arc(s.x, s.y, r + 1.6, 0, 7); octx.fill();
      octx.fillStyle = col; octx.beginPath(); octx.arc(s.x, s.y, r, 0, 7); octx.fill();
      octx.globalAlpha = 1;
      screenPins.push({ p, x: s.x, y: s.y, on: on && s.z > .12 });
      if ((hot || (showAllLabels && on)) && s.z > .2 && !(mode === 'x' && p === openPin && !mobile)) {
        const right = s.x > cam.cx + cam.R * .25 && s.x > W * .62;
        label(s.x, s.y, p.name.toUpperCase(), mode === 'x' ? `${p.rows.length} SHOOT${p.rows.length > 1 ? 'S' : ''}` : null, col, right);
      }
    });
    // home marker
    const h = screen(home.lon, home.lat);
    if (h.z > .05) { octx.globalAlpha = smooth(.05, .25, h.z); octx.strokeStyle = '#eeebe4'; octx.lineWidth = 1.2; octx.strokeRect(h.x - 4.5, h.y - 4.5, 9, 9); octx.globalAlpha = 1; }
  };
  const drawDive = c => {
    if (c <= 0 || c >= 1) return;
    const f = Math.min(W, H) * .55, cx = W / 2, cy = H / 2, travel = c * 3.15;
    diveClouds.forEach(d => {
      const zz = d.z - travel; if (zz < .03) return;
      const a = smooth(.03, .32, zz) * (1 - smooth(1.5, 2.7, zz)); if (a < .01) return;
      const w = f * 1.25 * d.s / zz, h = w * .61, x = cx + d.x * f / zz, y = cy + d.y * f / zz;
      if (x + w / 2 < 0 || x - w / 2 > W || y + h / 2 < 0 || y - h / 2 > H) return;
      octx.globalAlpha = a * .9; octx.save(); octx.translate(x, y); if (d.flip) octx.scale(-1, 1);
      octx.drawImage(SPR[d.spr].c, -w / 2, -h / 2, w, h); octx.restore();
    });
    octx.globalAlpha = 1;
    const veil = .92 * bell(c, .5, .13);   // the white-out at the heart of the cloud
    if (veil > .01) { const g = octx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * .75); g.addColorStop(0, `rgba(236,238,236,${veil})`); g.addColorStop(1, `rgba(206,212,214,${veil * .92})`); octx.fillStyle = g; octx.fillRect(0, 0, W, H); }
  };

  /* ================= Frame ================= */
  const STILL = new URLSearchParams(location.search).has('still');
  const perf = { ema: 1 / 60, n: 0, max: GLS };
  let blowable = false;
  let burst0 = -1, last = performance.now(), t0 = last, spin = 22, running = true, satMix = 0, satPref = true;
  const vSw = $('#vSw'), vSatL = $('#vSatL'), vLineL = $('#vLineL');
  const setView = sat => { satPref = sat; vSw.setAttribute('aria-checked', !sat); vSatL.classList.toggle('on', sat); vLineL.classList.toggle('on', !sat); };
  if (!sky) { $('#viewsw').hidden = true; satPref = false; }
  vSw.onclick = () => setView(!satPref); vSatL.onclick = () => setView(true); vLineL.onclick = () => setView(false); setView(satPref);
  new IntersectionObserver(es => { running = es[0].isIntersecting; if (running && !STILL) { last = performance.now(); requestAnimationFrame(frame); } }).observe(track);

  function frame(now) {
    if (!running) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    // keep it smooth: if frames run long while the clouds are busy, render the cloud layer at a lower resolution
    if (sky && !STILL) { perf.ema = lerp(perf.ema, dt, .05); if (++perf.n > 90) { perf.n = 0; if (perf.ema > .026 && GLS > .55) { GLS *= .85; glc.width = Math.round(W * GLS); glc.height = Math.round(H * GLS); } else if (perf.ema < .0175 && GLS < perf.max) { GLS = Math.min(perf.max, GLS * 1.08); glc.width = Math.round(W * GLS); glc.height = Math.round(H * GLS); } } }
    const p = progress;
    // ---- layout of the globe on screen for each chapter
    const base = mobile ? Math.min(W * .47, H * .3) : Math.min(W, H) * .39;
    const layout = ph => mobile ? [W / 2, H * [.40, .40, .5, .56][ph]] : [W * [.64, .6, .5, .5][ph], H * [.5, .52, .5, .52][ph]];

    let mode, reveal = 1, skyA, curStop = -1, arcState = null, dive = 0, bt = Infinity;
    const U = { cloud: 0, cover: .6, dive: 0, diveZ: 0, part: 0 };
    const curPins = new Set();
    if (p < C1 - .002 && replay.on) endReplay();
    exploring = p >= C1 - .002 && !replay.on;
    if (p >= J0 && p < C1) { if (burst0 < 0) burst0 = now; bt = reduce ? Infinity : (now - burst0) / 1000; }
    if (p < J0) {                                   // ---- 1 · the intro: the globe turns
      mode = 'a'; burst0 = -1; const a = ease(p / J0);
      if (!reduce) spin += dt * 5;
      cam.lon = lerp(lonWrap(spin), B0.lon, a); cam.lat = lerp(16, B0.lat, a); cam.k = lerp(1, B0.k, a);
      const [x0, y0] = layout(0), [x1, y1] = layout(1); cam.cx = lerp(x0, x1, a); cam.cy = lerp(y0, y1, a);
      reveal = reduce ? 1 : easeOut(clamp((now - t0) / 2600, 0, 1));
      skyA = .3 * reveal; U.cloud = .5 * reveal; U.cover = .55;
    } else if (p < J1) {                            // ---- 2 · every route fires out from London at once
      mode = 'b'; const a = ease((p - J0) / (J1 - J0));
      const c = d3.geoInterpolate([B0.lon, B0.lat], [B1.lon, B1.lat])(a);
      cam.lon = c[0]; cam.lat = c[1]; cam.k = lerp(B0.k, B1.k, a); [cam.cx, cam.cy] = layout(1);
      skyA = .34; U.cloud = .5; U.cover = .55;
    } else if (p < C1) {                            // ---- 3 · down through the clouds
      // first the long zoom in over the line-drawn globe; the weather only closes in once you're near,
      // white-out, then the clouds part over the satellite view and you keep sinking
      mode = 'c'; dive = (p - J1) / (C1 - J1); const L = B1;
      const a1 = ease(clamp(dive / .58, 0, 1)), a2 = easeOut(clamp((dive - .6) / .4, 0, 1));
      const c = d3.geoInterpolate([L.lon, L.lat], [XP.lon, XP.lat])(a1);
      cam.lon = c[0]; cam.lat = c[1]; cam.k = lerp(lerp(L.k, 2.7, a1), XP.k, a2);
      const [x1, y1] = layout(1), [x3, y3] = layout(3); cam.cx = lerp(x1, x3, a1); cam.cy = lerp(y1, y3, a1);
      skyA = .5 + .4 * smooth(.2, .6, dive);
      U.cloud = lerp(.5, .95, smooth(.18, .5, dive)); U.cover = lerp(.55, .5, smooth(.2, .55, dive)) + .06 * smooth(.7, 1, dive);
      U.dive = smooth(.36, .6, dive) * (1 - smooth(.93, 1, dive)); U.diveZ = dive; U.part = smooth(.64, .97, dive);
      user.lon = user.tl = XP.lon; user.lat = user.tb = XP.lat; user.k = user.tk = XP.k; user.fresh = true; user.sx = 0;
    } else if (replay.on) {                         // ---- 4b · explore, replaying the journey shoot by shoot
      mode = 'x';
      if (!replay.paused && !ov.tl.classList.contains('drag') && replay.t < N) { replay.t = Math.min(N, replay.t + dt / SPS); if (replay.t >= N) setRpBtn(); }
      const s = replay.t, i = Math.min(N - 1, Math.floor(s)), t = i === N - 1 ? Math.min(1, s - i) : s - i;
      const prev = i === 0 ? replay.from : stops[i - 1], cur = stops[i];
      const tr = ease(clamp(t / .5, 0, 1)), hop = d3.geoDistance([prev.lon, prev.lat], [cur.lon, cur.lat]);
      const c = d3.geoInterpolate([prev.lon, prev.lat], [cur.lon, cur.lat])(tr);
      cam.lon = c[0]; cam.lat = c[1]; cam.k = lerp(prev.k, cur.k, tr) - Math.sin(Math.PI * tr) * .38 * Math.min(1, hop / 2.2);
      curStop = i; arcState = { i, prog: clamp((t - .28) / .5, 0, 1) };
      cur.locs.forEach(l => curPins.add(l.pin));
      skyA = .5; U.cloud = .6; U.cover = .55;
    } else {                                        // ---- 4 · explore
      mode = 'x'; user.fresh = false;
      if (!dragging) {
        if (Math.abs(user.vx) > .001 || Math.abs(user.vy) > .001) { user.tl = lonWrap(user.tl + user.vx); user.tb = clamp(user.tb + user.vy, -70, 78); user.vx *= .93; user.vy *= .93; }
        const f = 1 - Math.exp(-dt * 5);
        let dl = lonWrap(user.tl - user.lon); user.lon = lonWrap(user.lon + dl * f); user.lat += (user.tb - user.lat) * f;
        user.k *= Math.pow(user.tk / user.k, f);
      }
      cam.lon = user.lon; cam.lat = user.lat; cam.k = user.k;
      skyA = .9 * (1 - smooth(4, 7, cam.k) * .6);
      U.cloud = .9 * (1 - smooth(4.5, 7, cam.k) * .45); U.cover = .56;
    }
    const jr = mode === 'x' && replay.on;
    if (mode === 'x') {   // explore sits centre stage; the replay slides the globe over, as the journey did
      replay.lay += ((jr ? 1 : 0) - replay.lay) * (1 - Math.exp(-dt * 4));
      const [x1, y1] = layout(1), [x3, y3] = layout(3);
      user.sx = lerp(user.sx || 0, openPin && !mobile ? -W * .17 : 0, 1 - Math.exp(-dt * 5));
      cam.cx = lerp(x3, x1, replay.lay) + user.sx; cam.cy = lerp(y3, y1, replay.lay);
    } else replay.lay = 0;
    cam.R = base * cam.k; setCam();
    blowable = !!sky && ((mode === 'c' && dive > .4) || (mode === 'x' && !jr));
    if (mode !== 'c' && mode !== 'x') wind.broke = false;
    if (mode === 'c' && !wind.broke && dive > .42 && dive < .8 && wind.clear > .55) { wind.broke = true; glide(3, 1900); }
    if (!blowable && wind.hold) endHold();
    updateWind(dt);
    const satWant = sky && ((mode === 'c' && (dive > .6 || (wind.broke && dive > .42))) || (mode === 'x' && satPref)) ? 1 : 0;
    satMix = mode === 'c' && !wind.broke ? satWant : satMix + (satWant - satMix) * (1 - Math.exp(-dt * 4));
    if (satMix < .002) satMix = 0; if (satMix > .998) satMix = 1;

    // which pins have appeared
    // (in the burst, each shoot's route sets off a little after the one before; its pins pop up as the routes land)
    const reached = mode === 'a' ? -1 : jr ? curStop - (arcState.prog >= .98 ? 0 : 1)
      : mode === 'x' ? N - 1 : clamp(Math.floor((bt - BDUR * .98) / BSPREAD * (N - 1)), -1, N - 1);
    const live = jr || mode === 'b' || mode === 'c';
    pins.forEach(pn => {
      const should = pn.first <= reached;
      if (should && pn.appear < 0) pn.appear = live ? now : now - 2000; else if (!should) pn.appear = -1;
    });

    // ---- paint
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = '#0d0f0e'; ctx.fillRect(0, 0, W, H);
    drawStars();
    drawGlobeBase();
    if (satMix < 1) { drawLand(reveal, now); if (!sky) drawSkyClouds(skyA, dt); drawShade(); }
    if (sky) sky.render({ cx: cam.cx, cy: cam.cy, R: cam.R, lon: cam.lon * RAD, lat: cam.lat * RAD, k: cam.k, sat: satMix, cloud: reduce ? U.cloud * .8 : U.cloud, cover: U.cover, time: reduce ? 40 : (now - t0) / 1000, dive: U.dive, diveZ: U.diveZ, part: U.part, wx: wind.x, wy: wind.y, push: wind.push, wind: wind.level, clear: wind.clear }, GLS);
    // flight lines + pins on the top layer
    octx.setTransform(DPR, 0, 0, DPR, 0, 0); octx.clearRect(0, 0, W, H);
    over.style.opacity = mode === 'c' ? (1 - smooth(.4, .58, dive) * (1 - smooth(.72, .95, dive))).toFixed(3) : 1;
    octx.lineCap = 'round';
    arcs.forEach(a => {
      let prog = 0, hot = false;
      if (jr) { if (a.si < arcState.i) prog = 1; else if (a.si === arcState.i) { prog = ease(arcState.prog); hot = true; } }
      else if (mode === 'b' || mode === 'c') { const q = clamp((bt - a.si / (N - 1) * BSPREAD) / BDUR, 0, 1); prog = ease(q); hot = q > 0 && q < 1; }
      else if (mode === 'x') prog = 1;
      if (!prog) return;
      const on = mode !== 'x' || jr || pinOn(a.pin);
      octx.strokeStyle = AMBER + (hot ? .95 : on ? (satMix > .5 ? .55 : mode === 'x' && !jr ? .26 : .3) : .06) + ')'; octx.lineWidth = hot ? 1.7 : (satMix > .5 ? 1.2 : 1);
      drawArc(a, prog, hot);
    });
    drawPins(now, jr ? 'r' : mode, curPins);
    if (!sky) drawDive(mode === 'c' ? dive : 0);

    // ---- HUD
    show(ov.intro, mode === 'a' && p < J0 * .75);
    show(ov.tl, jr); show(rpCtl, jr); show(ov.card, jr); show(ov.stats, jr || mode === 'b' || (mode === 'c' && dive < .38) || (!mobile && mode === 'a' && p > J0 * .6));
    show(ov.dive, mode === 'c' && dive > .5 && dive < .7 && !wind.broke);
    $('#diveHint').textContent = wind.mic ? 'Blow to break through, or keep scrolling' : 'Press and hold, blow into your mic, or keep scrolling';
    const xu = mode === 'x' && !jr; show(ov.xp, xu); show(ov.zoom, xu); show($('#viewsw'), xu); show(ov.idx, xu); show(playJ, xu);
    $$('.rail button').forEach((b, i) => b.classList.toggle('on', i === ({ a: 0, b: 1, c: 2, x: 3 })[mode]));
    show($('.rail'), mode !== 'x');
    show(blowBtn, blowable);
    stage.classList.toggle('explore', mode === 'x');   // in explore, a finger turns the globe every way (the page stops scrolling under it)
    if (mode !== 'x' && !pop.hidden) closePop();
    if (jr) {
      setCard(curStop);
      const s = replay.t / N; ov.tl._mk.style.left = (clamp(s * N - .5, 0, N - 1) / (N - 1) * 100) + '%'; ov.tl.setAttribute('aria-valuenow', curStop + 1); ov.tl.setAttribute('aria-valuetext', `${stops[curStop].r.dates}, ${stops[curStop].r.project}`);
      stops.forEach((st, i) => st.tick.classList.toggle('done', i <= curStop));
    }
    const tgt = reached < 0 ? { shoots: 0, countries: 0, km: 0 } : stops[reached].cum;
    const kf = 1 - Math.exp(-dt * 7);
    for (const k in disp) disp[k] += (tgt[k] - disp[k]) * kf;
    $('#sShoots').textContent = Math.round(disp.shoots); $('#sCountries').textContent = Math.round(disp.countries); $('#sKm').textContent = fmt(disp.km);
    // keep the popover beside its pin
    if (openPin && !pop.hidden && !mobile) {
      const s = screen(openPin.lon, openPin.lat), pw = pop.offsetWidth, ph = pop.offsetHeight;
      let x = s.x + 26, y = s.y - ph * .35;
      if (x + pw > W - 16) x = s.x - pw - 26;
      pop.style.left = clamp(x, 16, W - pw - 16) + 'px'; pop.style.top = clamp(y, 76, H - ph - 16) + 'px';
      pop.style.opacity = s.z > .05 ? 1 : .0;
    }
    if (!STILL) requestAnimationFrame(frame);
  }
  applyFilter();
  if (STILL) window.__draw = t => frame(t ?? performance.now()); else requestAnimationFrame(frame);
})();
