/* Home page: the opening frame of the Field Map — a line-drawn globe, turning, with live weather.
   Loaded only when the Field Map section comes near (see main.js). Uses data.js, d3, topojson,
   fieldmap/geo.js and fieldmap/sky.js. */
(() => {
  const box = document.getElementById('fmGlobe'); if (!box) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RAD = Math.PI / 180, clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // headline numbers, straight from the credits board
  const words = n => { const a = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'], t = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']; return n < 20 ? a[n] : t[Math.floor(n / 10)] + (n % 10 ? '-' + a[n % 10] : ''); };
  const countries = new Set(); DIARY.forEach(r => (PLACES[r.dest] || []).forEach(p => countries.add(p[1])));
  const boardRange = rows => {   // first and last month on the credits board, e.g. "Mar 2021 – Oct 2026"
    const M = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Sept: 8, Oct: 9, Nov: 10, Dec: 11 }, nm = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let lo = 1e9, hi = 0;
    rows.forEach(r => { const yrs = [...r.dates.matchAll(/\d{4}/g)].map(x => +x[0]); [...r.dates.matchAll(/([A-Z][a-z]+)\s*(\d{4})?/g)].forEach(m => { if (!(m[1] in M) || !yrs.length) return; const v = (m[2] ? +m[2] : yrs[yrs.length - 1]) * 12 + M[m[1]]; lo = Math.min(lo, v); hi = Math.max(hi, v); }); });
    return hi ? `${nm[lo % 12]} ${Math.floor(lo / 12)} – ${nm[hi % 12]} ${Math.floor(hi / 12)}` : '';
  };
  const rg = document.getElementById('fmRange'); if (rg) rg.textContent = boardRange(DIARY);
  const ns = document.getElementById('fmShoots'), nc = document.getElementById('fmCountries');

  const land = topojson.merge(TOPO110, TOPO110.objects.countries.geometries), grat = d3.geoGraticule10();
  const ND = DOTS.length / 2, dLon = new Float32Array(ND), dCos = new Float32Array(ND), dSin = new Float32Array(ND);
  for (let i = 0; i < ND; i++) { dLon[i] = DOTS[2 * i] / 10 * RAD; const la = DOTS[2 * i + 1] / 10 * RAD; dCos[i] = Math.cos(la); dSin[i] = Math.sin(la); }

  const cv = document.createElement('canvas'), glc = document.createElement('canvas');
  [cv, glc].forEach(c => { c.setAttribute('aria-hidden', 'true'); box.appendChild(c); });
  const ctx = cv.getContext('2d'), sky = typeof makeSky === 'function' ? makeSky(glc, null) : null;
  const P = d3.geoOrthographic().clipAngle(90).precision(.5), path = d3.geoPath(P, ctx);
  let W = 0, H = 0, S = 0, DPR = 1, GLS = 1;
  // the canvases reach well beyond the globe's box, so its halo can fade all the way out into the page
  const resize = () => { DPR = Math.min(devicePixelRatio || 1, 1.75); W = cv.clientWidth; H = cv.clientHeight; S = Math.min(box.clientWidth, box.clientHeight); cv.width = W * DPR; cv.height = H * DPR; GLS = Math.min(DPR, W < 500 ? 1.5 : 1.25); glc.width = W * GLS; glc.height = H * GLS; };
  addEventListener('resize', resize); resize();

  const lat0 = 16, t0 = performance.now(); let lon0 = 22, last = t0, running = false, reveal = reduce ? 1 : 0;
  new IntersectionObserver(es => { running = es[0].isIntersecting; if (running) { last = performance.now(); requestAnimationFrame(frame); } }, { rootMargin: '100px' }).observe(box);

  function frame(now) {
    if (!running) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!reduce) { lon0 += dt * 5; reveal = Math.min(1, reveal + dt / 2.4); }
    const cx = W / 2, cy = H / 2, R = S * .46, sp0 = Math.sin(lat0 * RAD), cp0 = Math.cos(lat0 * RAD);
    P.rotate([-lon0, -lat0]).scale(R).translate([cx, cy]);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
    // atmosphere + ocean
    const glow = ctx.createRadialGradient(cx, cy, R * .96, cx, cy, R * 1.5);
    glow.addColorStop(0, 'rgba(150,180,190,.22)'); glow.addColorStop(.18, 'rgba(130,160,170,.11)'); glow.addColorStop(.5, 'rgba(110,140,150,.035)'); glow.addColorStop(1, 'rgba(110,140,150,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, R * 1.5, 0, 7); ctx.fill();
    const sea = ctx.createRadialGradient(cx - R * .35, cy - R * .4, R * .1, cx, cy, R);
    sea.addColorStop(0, '#18201d'); sea.addColorStop(.7, '#111614'); sea.addColorStop(1, '#0b0e0d');
    ctx.fillStyle = sea; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
    ctx.strokeStyle = `rgba(238,235,228,${.07 * reveal})`; ctx.lineWidth = .6; ctx.beginPath(); path(grat); ctx.stroke();
    // dot-matrix land, drawn in from the centre outwards
    const cut = reveal >= 1 ? -1 : Math.cos(reveal * Math.PI * .5 + 1e-3), rr = clamp(R / 520, .55, 1.4), cl0 = lon0 * RAD;
    ctx.fillStyle = '#eeebe4';
    for (let i = 0; i < ND; i++) {
      const l = dLon[i] - cl0, c = Math.cos(l), z = sp0 * dSin[i] + cp0 * dCos[i] * c;
      if (z <= 0 || z < cut) continue;
      const x = dCos[i] * Math.sin(l), y = cp0 * dSin[i] - sp0 * dCos[i] * c, s = rr * (.55 + .45 * z);
      ctx.globalAlpha = .16 + .62 * z; ctx.fillRect(cx + x * R - s, cy - y * R - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = `rgba(238,235,228,${.16 * reveal})`; ctx.lineWidth = .7; ctx.beginPath(); path(land); ctx.stroke();
    ctx.restore();
    const sh = ctx.createRadialGradient(cx - R * .3, cy - R * .35, R * .2, cx, cy, R * 1.02);
    sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(.75, 'rgba(0,0,0,.12)'); sh.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(190,210,215,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    if (sky) sky.render({ cx, cy, R, lon: lon0 * RAD, lat: lat0 * RAD, k: 1, sat: 0, cloud: .5 * reveal, cover: .55, time: reduce ? 40 : (now - t0) / 1000, dive: 0, diveZ: 0, part: 0 }, GLS);
    requestAnimationFrame(frame);
  }
})();
