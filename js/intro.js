/* ============================================================
   INTRODUCCIÓ ANIMADA
   El logotip d'AREMI salta per l'hort de palets adaptats i pel
   jardí sensorial; les plantes creixen quan hi passa. Després surt
   el títol amb el pictograma d'ARASAAC i es passa a triar l'alumne.
   Música i sons generats amb el navegador (cap fitxer d'àudio).
   ============================================================ */
window.Intro = (() => {
  "use strict";
  const TARONJA = "#EA6B22", BLAU = "#20386D";

  /* ---------- cara del logotip (traçada sobre l'original) ---------- */
  function cara(cls = "") {
    return `<svg class="cara ${cls}" viewBox="360 219 462 428" aria-hidden="true">
      <path fill="${TARONJA}" d="M591 225C716 225 816 305 816 433C816 561 716 641 591 641C466 641 366 561 366 433C366 305 466 225 591 225Z"/>
      <g class="ull"><ellipse cx="603.5" cy="367.5" rx="174" ry="93" fill="#fff"/><rect x="599" y="300" width="146" height="134" rx="66" ry="62" fill="${BLAU}"/></g>
      <path class="boca" fill="#fff" d="M561 527H707C707 570 672 595 634 595C596 595 561 570 561 527Z"/>
    </svg>`;
  }

  /* ---------- peces del dibuix ---------- */
  const FUSTA = "#d7a565", FUSTA2 = "#b9824a", FUSTA3 = "#8f5f33";
  // taula de cultiu feta amb palets, alçada perquè s'hi pugui acostar una cadira de rodes
  function palet(cx) {
    const x = cx - 118;
    let s = `<g>`;
    s += `<rect x="${x + 20}" y="640" width="14" height="118" fill="${FUSTA3}"/><rect x="${x + 202}" y="640" width="14" height="118" fill="${FUSTA3}"/>`; // potes del darrere
    s += `<rect x="${x + 4}" y="640" width="20" height="130" rx="3" fill="${FUSTA2}"/><rect x="${x + 212}" y="640" width="20" height="130" rx="3" fill="${FUSTA2}"/>`;
    s += `<rect x="${x + 20}" y="700" width="196" height="12" rx="3" fill="${FUSTA2}"/>`; // travesser
    [x, cx - 13, x + 210].forEach(bx => { s += `<rect x="${bx}" y="560" width="26" height="92" fill="${FUSTA3}"/>`; }); // tacs del palet
    [562, 593, 624].forEach(y => { s += `<rect x="${x - 6}" y="${y}" width="248" height="24" rx="4" fill="${FUSTA}" stroke="${FUSTA2}" stroke-width="2"/>`
      + `<circle cx="${x + 8}" cy="${y + 12}" r="2.5" fill="${FUSTA3}"/><circle cx="${x + 228}" cy="${y + 12}" r="2.5" fill="${FUSTA3}"/>`; });
    s += `<ellipse cx="${cx}" cy="560" rx="120" ry="13" fill="#5b3a21"/><ellipse cx="${cx}" cy="557" rx="108" ry="8" fill="#75492a"/>`;
    return s + `</g>`;
  }
  const pl = (d, inner) => `<g class="planta" style="--d:${d}s">${inner}</g>`;
  const enciam = x => `<ellipse cx="${x}" cy="544" rx="37" ry="22" fill="#4c9a2a"/><ellipse cx="${x - 15}" cy="538" rx="19" ry="15" fill="#6dbb3a"/>`
    + `<ellipse cx="${x + 15}" cy="538" rx="19" ry="15" fill="#6dbb3a"/><ellipse cx="${x}" cy="531" rx="17" ry="13" fill="#a3dc5a"/>`;
  const tomaquera = x => `<rect x="${x - 3}" y="418" width="6" height="142" rx="3" fill="${FUSTA2}"/>`
    + `<path d="M${x} 560C${x - 10} 520 ${x + 12} 480 ${x} 432" fill="none" stroke="#3f8f2a" stroke-width="7" stroke-linecap="round"/>`
    + [[-24, 528, -25], [24, 505, 25], [-22, 478, -20], [20, 452, 20]].map(([dx, y, r]) => `<ellipse cx="${x + dx}" cy="${y}" rx="21" ry="10" fill="#57a834" transform="rotate(${r} ${x + dx} ${y})"/>`).join("")
    + [[-15, 508], [16, 484], [-12, 458], [15, 530]].map(([dx, y]) => `<circle cx="${x + dx}" cy="${y}" r="12" fill="#e2352b"/><circle cx="${x + dx - 4}" cy="${y - 4}" r="3.5" fill="#ff8f7d"/>`).join("");
  const pastanaga = x => `<path d="M${x - 11} 556Q${x} 540 ${x + 11} 556Z" fill="#f08a1c"/>`
    + [-22, -8, 6, 20].map(r => `<path d="M${x} 550C${x + r * .4} 530 ${x + r} 512 ${x + r * 1.5} 494" fill="none" stroke="#3f9a2f" stroke-width="6" stroke-linecap="round"/>`).join("");
  const maduixera = x => [[-20, -18], [0, 0], [20, 18]].map(([dx, r]) => `<ellipse cx="${x + dx}" cy="540" rx="19" ry="11" fill="#3f9a2f" transform="rotate(${r} ${x + dx} 540)"/>`).join("")
    + [[-18, 552], [14, 550]].map(([dx, y]) => `<path d="M${x + dx - 9} ${y - 6}Q${x + dx} ${y - 12} ${x + dx + 9} ${y - 6}Q${x + dx + 8} ${y + 8} ${x + dx} ${y + 13}Q${x + dx - 8} ${y + 8} ${x + dx - 9} ${y - 6}Z" fill="#e2283a"/>`).join("");
  const lavanda = x => [-34, -22, -10, 0, 12, 24, 36].map((dx, i) => { const tx = x + dx * 1.5, ty = 598 + Math.abs(dx) * .9 - (i % 2) * 10;
    return `<path d="M${x + dx * .3} 706Q${x + dx * .8} 660 ${tx} ${ty + 26}" fill="none" stroke="#5f9a4a" stroke-width="4" stroke-linecap="round"/>`
      + `<ellipse cx="${tx}" cy="${ty + 6}" rx="8" ry="24" fill="#8e5fd0" transform="rotate(${dx * .5} ${tx} ${ty + 6})"/><ellipse cx="${tx}" cy="${ty - 4}" rx="5" ry="12" fill="#b08af0" transform="rotate(${dx * .5} ${tx} ${ty})"/>`; }).join("");
  const molinet = x => `<rect x="${x - 3}" y="560" width="6" height="146" rx="3" fill="#8b6b4a"/><g class="aspes" style="transform-origin:${x}px 560px">`
    + ["#ff5d73", "#ffc23d", "#3fc1c9", "#7a6ff0"].map((c, i) => `<path d="M${x} 560L${x + 46} 560Q${x + 40} 530 ${x + 14} 532Z" fill="${c}" transform="rotate(${i * 90} ${x} 560)"/>`).join("")
    + `</g><circle cx="${x}" cy="560" r="6" fill="#fff" stroke="#8b6b4a" stroke-width="3"/>`;
  const gira_sol = (x, top) => `<path d="M${x} 706C${x - 8} 640 ${x + 8} ${top + 80} ${x} ${top + 20}" fill="none" stroke="#3f8f2a" stroke-width="9" stroke-linecap="round"/>`
    + `<ellipse cx="${x - 26}" cy="${top + 120}" rx="27" ry="12" fill="#57a834" transform="rotate(-28 ${x - 26} ${top + 120})"/><ellipse cx="${x + 26}" cy="${top + 160}" rx="27" ry="12" fill="#57a834" transform="rotate(28 ${x + 26} ${top + 160})"/>`
    + Array.from({ length: 14 }, (_, i) => `<ellipse cx="${x}" cy="${top - 34}" rx="10" ry="22" fill="#ffc81f" transform="rotate(${i * 25.7} ${x} ${top})"/>`).join("")
    + `<circle cx="${x}" cy="${top}" r="25" fill="#7a4a1e"/><circle cx="${x}" cy="${top}" r="15" fill="#5d3613"/>`;
  const tulipa = (x, top, c) => `<path d="M${x} 706Q${x - 6} ${top + 60} ${x} ${top + 16}" fill="none" stroke="#3f8f2a" stroke-width="6" stroke-linecap="round"/>`
    + `<path d="M${x} 700Q${x + 26} 670 ${x + 20} 640" fill="none" stroke="#57a834" stroke-width="9" stroke-linecap="round"/>`
    + `<path d="M${x - 17} ${top - 14}Q${x - 9} ${top} ${x} ${top - 16}Q${x + 9} ${top} ${x + 17} ${top - 14}Q${x + 22} ${top + 26} ${x} ${top + 30}Q${x - 22} ${top + 26} ${x - 17} ${top - 14}Z" fill="${c}"/>`;
  const herba = x => [-26, -12, 0, 14, 28].map((dx, i) => `<path d="M${x + dx * .4} 708Q${x + dx} ${640 - i * 6} ${x + dx * 2.2} ${590 + Math.abs(dx)}" fill="none" stroke="${i % 2 ? "#7cbf3f" : "#4f9d35"}" stroke-width="7" stroke-linecap="round"/>`).join("");
  const papallona = (x, y, c, cls) => `<g class="papallona ${cls}" style="transform-origin:${x}px ${y}px"><g class="ales" style="transform-origin:${x}px ${y}px">`
    + `<ellipse cx="${x - 13}" cy="${y - 6}" rx="13" ry="10" fill="${c}"/><ellipse cx="${x + 13}" cy="${y - 6}" rx="13" ry="10" fill="${c}"/>`
    + `<ellipse cx="${x - 9}" cy="${y + 8}" rx="9" ry="7" fill="${c}" opacity=".8"/><ellipse cx="${x + 9}" cy="${y + 8}" rx="9" ry="7" fill="${c}" opacity=".8"/></g>`
    + `<rect x="${x - 2}" y="${y - 12}" width="4" height="24" rx="2" fill="#3b2a20"/></g>`;
  const retol = (x, y, w, txt) => `<rect x="${x + w / 2 - 5}" y="${y + 30}" width="10" height="${Math.max(40, 770 - y - 30)}" fill="${FUSTA3}"/>`
    + `<rect x="${x}" y="${y}" width="${w}" height="46" rx="8" fill="#fff8e7" stroke="${FUSTA2}" stroke-width="5"/>`
    + `<text x="${x + w / 2}" y="${y + 32}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="23" fill="#4a3320">${txt}</text>`;
  const nuvol = (x, y, s, cls) => `<g class="nuvol ${cls}" fill="#fff" opacity=".95" transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="62" ry="30"/><ellipse cx="-46" cy="12" rx="40" ry="22"/><ellipse cx="50" cy="12" rx="44" ry="24"/><ellipse cx="10" cy="-22" rx="36" ry="26"/></g>`;

  function escena() {
    return `<svg class="intro-escena" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <g class="sol" style="transform-origin:1390px 150px"><g class="raigs" style="transform-origin:1390px 150px">${Array.from({ length: 12 }, (_, i) => `<rect x="1385" y="46" width="10" height="34" rx="5" fill="#ffd34d" transform="rotate(${i * 30} 1390 150)"/>`).join("")}</g><circle cx="1390" cy="150" r="62" fill="#ffd34d"/><circle cx="1390" cy="150" r="48" fill="#ffe27a"/></g>
      ${nuvol(260, 150, 1.2, "n1")}${nuvol(860, 90, .9, "n2")}${nuvol(1180, 250, .7, "n3")}
      <ellipse cx="380" cy="700" rx="760" ry="170" fill="#a9d98a"/><ellipse cx="1320" cy="720" rx="820" ry="190" fill="#97cf7c"/>
      <rect x="-3000" y="650" width="7600" height="400" fill="#7cc163"/>
      <path d="M-3000 800Q800 760 4600 800V1000H-3000Z" fill="#ecd9a8"/><path d="M-3000 800Q800 760 4600 800" fill="none" stroke="#d9c38a" stroke-width="6"/>
      ${retol(8, 610, 96, "HORT")}
      ${palet(250)}${palet(540)}${palet(830)}
      <g class="grup" data-g="0">${pl(0, enciam(190))}${pl(.12, enciam(250))}${pl(.24, enciam(312))}</g>
      <g class="grup" data-g="1">${pl(0, tomaquera(480))}${pl(.15, tomaquera(545))}${pl(.3, tomaquera(606))}</g>
      <g class="grup" data-g="2">${pl(0, pastanaga(760))}${pl(.1, pastanaga(800))}${pl(.2, maduixera(858))}${pl(.3, pastanaga(905))}</g>
      <ellipse cx="1300" cy="716" rx="330" ry="36" fill="#6a4426"/><ellipse cx="1300" cy="710" rx="316" ry="28" fill="#7f5230"/>
      ${[990, 1040, 1100, 1170, 1250, 1340, 1430, 1510, 1570, 1610].map((x, i) => `<ellipse cx="${x}" cy="${744 - Math.abs(i - 4.5) * 3.2}" rx="20" ry="11" fill="${i % 2 ? "#cfd3d8" : "#b3b9c1"}"/>`).join("")}
      <g class="grup" data-g="3">${pl(0, lavanda(1075))}${pl(.2, molinet(1168))}</g>
      <g class="grup" data-g="4">${pl(0, gira_sol(1255, 520))}${pl(.2, gira_sol(1335, 470))}</g>
      <g class="grup" data-g="5">${pl(0, tulipa(1410, 610, "#ff4d6d"))}${pl(.1, tulipa(1455, 580, "#ffb703"))}${pl(.2, tulipa(1498, 620, "#c45bf0"))}${pl(.3, herba(1560))}
        ${papallona(1380, 480, "#ff7eb6", "p1")}${papallona(1120, 500, "#5cc8ff", "p2")}</g>
      ${retol(1004, 742, 236, "JARDÍ SENSORIAL")}
      ${[[1010, 842, "#c9b08a"], [1130, 852, "#9aa7b3"], [1250, 846, "#b98a5e"], [1370, 854, "#8fbf6a"], [1490, 846, "#d8c7a0"]].map(([x, y, c], i) => `<ellipse cx="${x}" cy="${y}" rx="46" ry="19" fill="${c}"/>`
        + (i % 2 ? [-20, 0, 20].map(d => `<circle cx="${x + d}" cy="${y}" r="5" fill="rgba(0,0,0,.14)"/>`).join("") : `<ellipse cx="${x}" cy="${y}" rx="28" ry="10" fill="none" stroke="rgba(0,0,0,.14)" stroke-width="4"/>`)).join("")}
    </svg>`;
  }

  /* ---------- música i sons (Web Audio) ---------- */
  function creaSo() {
    let ctx, master, eco, pad = [], viu = false;
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
    eco = ctx.createDelay(1); eco.delayTime.value = 0.3;
    const ret = ctx.createGain(); ret.gain.value = 0.28; eco.connect(ret); ret.connect(eco); ret.connect(master);
    const nota = (f, vol = 0.2, dur = 1.4, quan = 0) => {
      if (!viu) return; const t = ctx.currentTime + quan;
      [[1, 1], [2, .28], [3, .08]].forEach(([m, v]) => {
        const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = f * m;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * v, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur / m);
        o.connect(g); g.connect(master); g.connect(eco); o.start(t); o.stop(t + dur / m + .05);
      });
    };
    const ocell = () => {
      if (!viu) return; const f0 = 2300 + Math.random() * 1300, n = 2 + (Math.random() * 3 | 0);
      for (let i = 0; i < n; i++) {
        const t = ctx.currentTime + i * 0.13, o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine";
        o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 1.35, t + 0.05); o.frequency.exponentialRampToValueAtTime(f0 * 1.1, t + 0.09);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.045, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.12);
      }
    };
    const fulles = () => {
      if (!viu) return; const d = 0.45, buf = ctx.createBuffer(1, ctx.sampleRate * d, ctx.sampleRate), ch = buf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), t = ctx.currentTime;
      s.buffer = buf; f.type = "bandpass"; f.frequency.setValueAtTime(1800, t); f.frequency.exponentialRampToValueAtTime(4200, t + d); f.Q.value = 0.9;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      s.connect(f); f.connect(g); g.connect(master); s.start(t);
    };
    const engega = () => {
      if (viu || ctx.state !== "running") return; viu = true;
      [130.81, 196, 329.63].forEach(f => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 1.6); o.connect(g); g.connect(master); o.start(); pad.push(o); });
    };
    const atura = () => { try { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5); setTimeout(() => { try { ctx.close(); } catch (e) {} }, 700); } catch (e) {} viu = false; };
    return { ctx, nota, ocell, fulles, engega, atura, get viu() { return viu; } };
  }

  /* ---------- animació ---------- */
  const SALTS = [ // on aterra el logotip (coordenades de l'escena) · grup de plantes · nota
    { x: 250, y: 548, f: 261.63 }, { x: 540, y: 548, f: 329.63 }, { x: 830, y: 548, f: 392 },
    { x: 1110, y: 700, f: 440 }, { x: 1290, y: 700, f: 523.25 }, { x: 1455, y: 700, f: 587.33 }
  ];
  const T0 = 0.35, PAS = 0.85, T_TITOL = T0 + 0.75 + PAS * 5 + 1.05, T_FI = T_TITOL + 4.2;

  function play(opts, fet) {
    opts = opts || {};
    const redu = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = document.createElement("div");
    el.id = "intro"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Benvinguda");
    el.innerHTML = `${escena()}
      <div class="intro-logo"><div class="intro-logo-in">${cara()}</div><div class="intro-bafarada" hidden></div></div>
      <div class="intro-card">
        ${opts.picto || ""}
        <div class="intro-txt"><p>Benvinguts i benvingudes a les</p><h1>ACTIVITATS DE CONEIXEMENT DE L'ENTORN NATURAL</h1>
          <img src="img/aremi-nom.png" alt="AREMI, Centre d'Educació Especial"></div>
      </div>
      <button class="intro-so" hidden>🔊 Activa la música</button>
      <button class="intro-salta">Salta ›</button>`;
    document.body.appendChild(el);
    const svg = el.querySelector(".intro-escena"), logo = el.querySelector(".intro-logo"), dins = el.querySelector(".intro-logo-in"),
      svgCara = el.querySelector(".cara"), card = el.querySelector(".intro-card"), baf = el.querySelector(".intro-bafarada"), btnSo = el.querySelector(".intro-so");
    const so = opts.musica === false ? null : creaSo();
    if (so) {
      const mira = () => { if (so.ctx.state === "running") { so.engega(); btnSo.hidden = true; } else btnSo.hidden = false; };
      so.ctx.onstatechange = mira; setTimeout(mira, 250);
      btnSo.addEventListener("click", e => { e.stopPropagation(); so.ctx.resume().then(mira).catch(() => {}); });
    }

    let acabat = false, raf = 0;
    const acaba = () => {
      if (acabat) return; acabat = true; cancelAnimationFrame(raf);
      document.removeEventListener("keydown", tecla); if (so) so.atura();
      el.classList.add("surt"); setTimeout(() => { el.remove(); }, 450);
      if (fet) fet();
    };
    const tecla = e => { if (["Escape", "Enter", " "].includes(e.key)) { e.preventDefault(); acaba(); } };
    document.addEventListener("keydown", tecla);
    el.addEventListener("click", acaba);

    const creix = g => { const x = svg.querySelector(`.grup[data-g="${g}"]`); if (x) x.classList.add("creix"); };
    const ullet = ms => { svgCara.classList.add("ullet"); setTimeout(() => svgCara.classList.remove("ullet"), ms); };
    const diu = t => { baf.textContent = t; baf.hidden = !t; };

    // esdeveniments de la línia de temps
    const ev = [];
    SALTS.forEach((s, i) => {
      const t = T0 + 0.75 + PAS * i;
      ev.push({ t, f: () => { creix(i); if (so) { so.nota(s.f, .22); so.fulles(); } } });
      ev.push({ t: t + PAS / 2, f: () => so && so.nota([196, 220, 261.63, 293.66, 329.63, 392][i], .09, .9) });
    });
    ev.push({ t: T0 + 0.75, f: () => diu("HOLA!") }, { t: T0 + 0.75 + PAS * 1.4, f: () => ullet(420) },
      { t: T0 + 0.75 + PAS * 3, f: () => diu("BENVINGUTS!") }, { t: T0 + 0.75 + PAS * 5 + 0.2, f: () => diu("") },
      { t: T_TITOL, f: () => { card.classList.add("surt-titol"); if (so) [261.63, 329.63, 392, 523.25, 659.25, 783.99].forEach((f, i) => so.nota(f, .16, 1.8, i * 0.13)); } },
      { t: T_TITOL + 0.5, f: () => ullet(520) }, { t: T_TITOL + 2.6, f: () => ullet(420) });
    [659.25, 587.33, 523.25, 392].forEach((f, i) => ev.push({ t: T_TITOL + 1.5 + i * 0.6, f: () => so && so.nota(f, .1, 1.6) }));
    for (let t = 0.6; t < T_FI; t += 1.1 + Math.random() * 0.9) ev.push({ t, f: () => so && so.ocell() });
    ev.sort((a, b) => a.t - b.t);

    if (redu) { // sense moviment: escena feta i títol quiet
      SALTS.forEach((s, i) => creix(i)); card.classList.add("surt-titol"); logo.classList.add("quiet");
      setTimeout(acaba, 4500); return;
    }

    const aPantalla = (x, y) => { const m = svg.getScreenCTM(), r = el.getBoundingClientRect(); return { x: m.a * x + m.e - r.left, y: m.d * y + m.f - r.top, k: m.a }; };
    const inici = performance.now(); let iEv = 0;
    function pas(ara) {
      if (acabat) return;
      const t = (ara - inici) / 1000;
      while (iEv < ev.length && ev[iEv].t <= t) ev[iEv++].f();
      // posició del logotip
      const k = aPantalla(0, 0).k, mida = Math.max(64, 150 * k), alt = mida * 0.926;
      const punts = [{ x: -160, y: 250 }, ...SALTS].map(p => { const q = aPantalla(p.x, p.y); return { x: q.x, y: q.y - alt / 2 }; });
      const cr = card.getBoundingClientRect(), er = el.getBoundingClientRect();
      const fi = { x: er.width / 2, y: cr.top - er.top - alt * 1.3 * 0.36 };
      const temps = [T0, ...SALTS.map((s, i) => T0 + 0.75 + PAS * i), T_TITOL - 0.1];
      punts.push(fi);
      let x, y, esc = 1, sx = 1, sy = 1, gir = 0;
      if (t <= temps[0]) { x = punts[0].x; y = punts[0].y; }
      else if (t >= temps[temps.length - 1]) {
        x = fi.x; y = fi.y + Math.sin((t - T_TITOL) * 2.2) * alt * 0.05; esc = 1.3;
      } else {
        let i = 0; while (t > temps[i + 1]) i++;
        const u = (t - temps[i]) / (temps[i + 1] - temps[i]), A = punts[i], B = punts[i + 1], ultim = i === punts.length - 2;
        const h = (ultim ? 0.2 : i === 0 ? 0.05 : 0.9) * alt + Math.abs(B.y - A.y) * 0.25;
        x = A.x + (B.x - A.x) * u; y = A.y + (B.y - A.y) * u - 4 * h * u * (1 - u);
        gir = (u - 0.5) * (ultim ? 0 : 16); if (ultim) esc = 1 + 0.3 * u;
        const dt = t - temps[i]; if (i > 0 && dt < 0.11) { const q = 1 - dt / 0.11; sx = 1 + 0.2 * q; sy = 1 - 0.24 * q; }
      }
      logo.classList.toggle("dreta", x > er.width * 0.62);
      logo.style.width = mida + "px";
      logo.style.transform = `translate(${x - mida / 2}px, ${y - alt / 2}px) scale(${esc})`;
      dins.style.transform = `rotate(${gir}deg) scale(${sx}, ${sy})`;
      if (t >= T_FI) return acaba();
      raf = requestAnimationFrame(pas);
    }
    raf = requestAnimationFrame(pas);
  }

  /* ---------- pantalla d'inici: cal un toc perquè el navegador deixi sonar la música ---------- */
  function inici(opts, fet) {
    opts = opts || {};
    const el = document.createElement("div");
    el.id = "inici"; el.setAttribute("role", "button"); el.tabIndex = 0; el.setAttribute("aria-label", "Toca per començar");
    el.innerHTML = `<div class="intro-card fixa">
        <span class="inici-cara">${cara("parpelleja")}</span>
        ${opts.picto || ""}
        <div class="intro-txt"><p>Benvinguts i benvingudes a les</p><h1>ACTIVITATS DE CONEIXEMENT DE L'ENTORN NATURAL</h1>
          <img src="img/aremi-nom.png" alt="AREMI, Centre d'Educació Especial"></div>
        <span class="inici-boto"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>Toca per començar</span>
      </div>`;
    document.body.appendChild(el);
    let fetJa = false;
    const va = () => {
      if (fetJa) return; fetJa = true;
      document.removeEventListener("keydown", tecla);
      play(opts, fet);                       // dins del toc: la música pot sonar de seguida
      el.classList.add("surt"); setTimeout(() => el.remove(), 450);
    };
    const tecla = e => { if (["Enter", " "].includes(e.key)) { e.preventDefault(); va(); } };
    el.addEventListener("click", va);
    document.addEventListener("keydown", tecla);
    try { el.focus({ preventScroll: true }); } catch (e) {}
  }

  return { play, inici, cara };
})();
