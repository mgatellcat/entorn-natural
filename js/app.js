/* ============================================================
   Coneixement de l'entorn natural · motor de l'aplicació
   Accés tàctil i amb la mirada (fixació amb cercle de rellotge)
   ============================================================ */
(() => {
  "use strict";
  const V = window.VOCAB, ACTS = window.ACTIVITATS, BLOCS = window.BLOCS, TIPUS = window.TIPUS, ICONES = window.ICONES;
  const app = document.getElementById("app");
  const punter = document.getElementById("punter");

  /* ---------------- configuració ---------------- */
  const DEF = {
    mirada: true,        // mostra el punt i fa el cercle de rellotge
    activa: "app",       // "app": l'app fa el clic en acabar el cercle · "extern": el clic el fa TD Control
    temps: 1.0,          // segons de fixació (0,5 – 2)
    punt: 44,            // mida del punt (px)
    rondes: 8,
    so: true,
    motor: "sistema",    // "sistema" | "ona"
    veuSistema: "",
    velocitat: 0.95,
    volum: 1,
    onaModel: "ca_ES-upc_ona-medium"
  };
  let C = { ...DEF };
  try { Object.assign(C, JSON.parse(localStorage.getItem("entorn-config") || "{}")); } catch (e) {}
  const desa = () => { try { localStorage.setItem("entorn-config", JSON.stringify(C)); } catch (e) {} };

  /* ---------------- utilitats ---------------- */
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const pick = a => a[Math.random() * a.length | 0];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const src = id => `pictos/${id}.png`;
  const low = w => w.toLowerCase();
  const amb = w => { const a = (V[w] && V[w].art) || ""; return a === "l'" ? "l'" + low(w) : a ? a + " " + low(w) : low(w); };
  const aLa = w => { const a = (V[w] && V[w].art) || ""; return a === "l'" ? "a l'" + low(w) : a === "la" ? "a la " + low(w) : a === "el" ? "al " + low(w) : "a " + low(w); };
  const perTags = (tags, excl = []) => Object.keys(V).filter(w => tags.some(t => V[w].tags.includes(t)) && !excl.some(t => V[w].tags.includes(t)));
  const paraulesDe = act => act.paraules ? act.paraules.filter(w => V[w]) : perTags(act.tags || []);
  const unaParaula = w => !w.includes(" ");
  let token = 0; // invalida temporitzadors en canviar de pantalla
  const espera = ms => { const t = token; return new Promise((res, rej) => setTimeout(() => t === token ? res() : rej("cancel"), ms)); };

  const ICO = {
    casa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
    enrere: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    endavant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    altaveu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 010 7"/><path d="M19 6a8.5 8.5 0 010 12"/></svg>',
    config: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>',
    llibre: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z"/><path d="M4 19a2 2 0 012-2h13"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    repetir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0115.5-6.2L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-15.5 6.2L3 16"/><path d="M3 21v-5h5"/></svg>',
    estrella: '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="#f5b400" stroke="#b07f00" stroke-width="1"/></svg>',
    estrellaBuida: '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".35"/></svg>'
  };

  /* ---------------- pictograma ---------------- */
  // mida de lletra (en % de l'amplada del requadre) segons la longitud de la paraula
  function midaLletra(w) {
    const parts = w.split(" ");
    let linies = [w];
    if (w.length > 11 && parts.length > 1) { // parteix en dues línies equilibrades
      let millor = null;
      for (let i = 1; i < parts.length; i++) {
        const a = parts.slice(0, i).join(" "), b = parts.slice(i).join(" ");
        const m = Math.max(a.length, b.length);
        if (!millor || m < millor.m) millor = { m, l: [a, b] };
      }
      linies = millor.l;
    }
    const llarg = Math.max(...linies.map(l => l.length));
    return { fs: Math.min(16, 118 / Math.max(llarg, 1)), html: linies.map(esc).join("<br>") };
  }
  function picto(w, etiqueta = true) {
    const v = V[w];
    if (!v) return `<div class="picto"><div class="pin">?</div></div>`;
    const m = midaLletra(w);
    return `<div class="picto fz${v.t}"><div class="pin">${etiqueta ? `<span class="ptx" style="--fs:${m.fs.toFixed(2)}">${m.html}</span>` : ""}<img src="${src(v.id)}" alt="${esc(low(w))}" draggable="false"></div></div>`;
  }

  /* ---------------- veu ---------------- */
  const Veu = {
    seq: 0, audio: new Audio(), cache: new Map(), mod: null, onaLlesta: false,
    async carregaOna() {
      if (!this.mod) this.mod = await import("./vendor/vits-web.js");
      return this.mod;
    },
    async comprovaOna() {
      try { const m = await this.carregaOna(); const s = await m.stored(); this.onaLlesta = s.includes(C.onaModel); }
      catch (e) { this.onaLlesta = false; }
      return this.onaLlesta;
    },
    atura() { this.seq++; try { speechSynthesis.cancel(); } catch (e) {} try { this.audio.pause(); } catch (e) {} },
    async parla(text) {
      this.atura();
      const n = this.seq;
      if (!text) return;
      if (C.motor === "ona" && this.onaLlesta) {
        try {
          let url = this.cache.get(text);
          if (!url) {
            const m = await this.carregaOna();
            const wav = await m.predict({ text, voiceId: C.onaModel });
            url = URL.createObjectURL(wav); this.cache.set(text, url);
          }
          if (n !== this.seq) return;
          this.audio.src = url; this.audio.playbackRate = C.velocitat; this.audio.volume = C.volum;
          await new Promise(res => { this.audio.onended = res; this.audio.onerror = res; this.audio.play().catch(res); setTimeout(res, 12000); });
          return;
        } catch (e) { console.warn("Ona no disponible, faig servir la veu del sistema", e); }
      }
      if (!("speechSynthesis" in window)) return;
      await new Promise(res => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "ca-ES"; u.rate = C.velocitat; u.volume = C.volum;
        const veu = triaVeuSistema(); if (veu) { u.voice = veu; u.lang = veu.lang; }
        u.onend = res; u.onerror = res; setTimeout(res, 2000 + text.length * 120);
        speechSynthesis.speak(u);
      });
    },
    // genera per avançat les frases més freqüents amb Ona
    async preescalfa(frases) {
      if (C.motor !== "ona" || !this.onaLlesta) return;
      for (const f of frases) { if (this.cache.has(f)) continue;
        try { const m = await this.carregaOna(); const w = await m.predict({ text: f, voiceId: C.onaModel }); this.cache.set(f, URL.createObjectURL(w)); } catch (e) { return; } }
    }
  };
  function veusSistema() { try { return speechSynthesis.getVoices(); } catch (e) { return []; } }
  function triaVeuSistema() {
    const vs = veusSistema();
    return vs.find(v => v.voiceURI === C.veuSistema) || vs.find(v => /^ca/i.test(v.lang)) || null;
  }
  try { speechSynthesis.onvoiceschanged = () => { if (location.hash === "#configuracio") pintaConfig(); }; } catch (e) {}

  /* ---------------- sons de reforç ---------------- */
  let actx = null;
  function so(tipus) {
    if (!C.so) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const notes = tipus === "be" ? [[784, 0], [988, .1], [1319, .2]] : [[220, 0], [196, .14]];
      notes.forEach(([f, t]) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = tipus === "be" ? "sine" : "triangle"; o.frequency.value = f;
        const t0 = actx.currentTime + t;
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(tipus === "be" ? .25 : .18, t0 + .02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + .35);
        o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + .4);
      });
    } catch (e) {}
  }

  /* ---------------- accés amb la mirada ---------------- */
  const M = { el: null, t0: 0, bloquejat: null, pausaFins: 0, raf: 0, ultimDwell: { el: null, t: 0 } };
  function aplicaMirada() {
    document.documentElement.classList.toggle("mirada", !!C.mirada);
    punter.style.setProperty("--pd", C.punt + "px"); punter.style.setProperty("--pdb", C.punt + "px");
  }
  function objectiu(node) {
    const el = node && node.closest ? node.closest(".sel") : null;
    if (!el || el.disabled || el.getAttribute("aria-disabled") === "true") return null;
    return el;
  }
  function reiniciaDwell() {
    if (M.el) M.el.classList.remove("mirant");
    M.el = null; punter.classList.remove("carrega"); punter.style.setProperty("--p", 0);
  }
  document.addEventListener("pointermove", e => {
    if (!C.mirada || e.pointerType === "touch") return;
    punter.classList.add("actiu");
    punter.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    const el = objectiu(e.target);
    if (M.bloquejat && el !== M.bloquejat) M.bloquejat = null; // ha sortit de la casella
    if (el === M.el) return;
    reiniciaDwell();
    if (el && el !== M.bloquejat) { M.el = el; M.t0 = performance.now(); el.classList.add("mirant"); punter.classList.add("carrega"); }
  }, { passive: true });
  document.addEventListener("pointerleave", () => { reiniciaDwell(); punter.classList.remove("actiu"); });
  window.addEventListener("blur", reiniciaDwell);
  function bucleDwell(now) {
    M.raf = requestAnimationFrame(bucleDwell);
    if (!M.el) return;
    if (!document.body.contains(M.el) || M.el.disabled) { reiniciaDwell(); return; }
    if (now < M.pausaFins) { M.t0 = now; punter.style.setProperty("--p", 0); return; }
    const p = Math.min(1, (now - M.t0) / (C.temps * 1000));
    punter.style.setProperty("--p", p.toFixed(3));
    if (p >= 1) {
      const el = M.el; reiniciaDwell(); M.bloquejat = el; M.pausaFins = now + 700;
      if (C.activa === "app") { M.ultimDwell = { el, t: now }; el.click(); }
    }
  }
  requestAnimationFrame(bucleDwell);
  // evita el doble clic si TD Control també fa clic just després de la fixació
  document.addEventListener("click", e => {
    if (!e.isTrusted || C.activa !== "app" || !C.mirada) return;
    const el = objectiu(e.target);
    if (el && el === M.ultimDwell.el && performance.now() - M.ultimDwell.t < 1500) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  /* ---------------- reforç visual ---------------- */
  const LLOANCES = ["Molt bé!", "Molt bona feina!", "Fantàstic!", "Ben fet!", "Perfecte!", "Genial!", "Així m'agrada!"];
  function mostraReforc(text) {
    const d = document.createElement("div");
    d.className = "reforc";
    d.innerHTML = `<div class="rod">${ICO.ok}<b>${esc(text.toUpperCase())}</b></div>`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 1400);
  }

  /* ---------------- navegació ---------------- */
  function vesA(h) { if (location.hash === "#" + h) ruta(); else location.hash = h; }
  window.addEventListener("hashchange", ruta);
  function ruta() {
    token++; Veu.atura(); reiniciaDwell(); M.pausaFins = performance.now() + 600;
    const h = location.hash.slice(1);
    if (h.startsWith("bloc-")) return pintaBloc(h.slice(5), 0);
    if (h.startsWith("act-")) { const a = ACTS.find(x => x.codi.toLowerCase() === h.slice(4).toLowerCase()); if (a) return comenca(a); }
    if (h === "configuracio") return pintaConfig();
    if (h === "vocabulari") return pintaVocab();
    pintaPortada();
  }
  function on(sel, fn, arrel = app) { arrel.querySelectorAll(sel).forEach(el => el.addEventListener("click", fn)); }

  /* ---------------- portada ---------------- */
  function pintaPortada() {
    app.innerHTML = `<section class="pantalla">
      <header class="portada-cap">
        <div class="titol"><div class="eyebrow">Aula de grans · CEE</div><h1>Coneixement de l'entorn natural</h1></div>
        <div class="eines">
          <button class="btn-ico sel" data-go="vocabulari" aria-label="Vocabulari">${ICO.llibre}</button>
          <button class="btn-ico sel" data-go="configuracio" aria-label="Configuració">${ICO.config}</button>
        </div>
      </header>
      <nav class="blocs">${BLOCS.map(b => {
        const n = ACTS.filter(a => a.bloc === b.id).length;
        return `<button class="bloc sel ${b.color}" data-go="bloc-${b.id}">
          <span class="icones ${b.icones.length > 1 ? "dues" : ""}">${b.icones.map(i => `<img src="${src(ICONES[i])}" alt="">`).join("")}</span>
          <span><span class="nom">${esc(b.nom)}</span><span class="desc">${esc(b.desc)}</span>
          <span class="num">${n} activitats</span></span></button>`;
      }).join("")}</nav>
      <div class="peu">Pictogrames: Sergio Palao · ARASAAC (arasaac.org) · CC BY-NC-SA · Govern d'Aragó</div>
    </section>`;
    on("[data-go]", e => { const g = e.currentTarget.dataset.go; const b = BLOCS.find(x => "bloc-" + x.id === g); if (b) Veu.parla(b.nom); vesA(g); });
  }

  /* ---------------- bloc ---------------- */
  const PER_PAG = 8;
  function miniatures(a) {
    let ws = [];
    if (a.mini) ws = a.mini;
    else if (a.tipus === "omple") ws = [a.graelles[0].nom];
    else if (a.tipus === "classifica") ws = a.categories.map(c => c.paraula).slice(0, 2);
    else if (a.tipus === "relaciona") ws = [a.parelles[0].p, a.parelles[0].r];
    else if (a.tipus === "sino") ws = a.preguntes[0].p;
    else if (a.tipus === "endevinalla") ws = [a.endevinalles[0].r];
    else ws = paraulesDe(a).slice(0, 2);
    return ws.filter(w => V[w]).slice(0, 2).map(w => `<img src="${src(V[w].id)}" alt="">`).join("");
  }
  function pintaBloc(id, pag) {
    const b = BLOCS.find(x => x.id === id); if (!b) return pintaPortada();
    const llista = ACTS.filter(a => a.bloc === id);
    const pags = Math.max(1, Math.ceil(llista.length / PER_PAG));
    pag = Math.min(Math.max(0, pag), pags - 1);
    const vis = llista.slice(pag * PER_PAG, pag * PER_PAG + PER_PAG);
    app.innerHTML = `<section class="pantalla bloc-${id}">
      <header class="cap">
        <button class="btn-ico gran sel" data-go="inici" aria-label="Inici">${ICO.casa}</button>
        <div class="titol"><h2>${esc(b.nom)}</h2><span class="sub">${llista.length} activitats · Coneixement de l'entorn natural</span></div>
        ${pags > 1 ? `<div class="pagina"><button class="btn-ico sel" data-pag="${pag - 1}" ${pag === 0 ? "disabled" : ""} aria-label="Anterior">${ICO.enrere}</button>
          <span>${pag + 1} / ${pags}</span><button class="btn-ico sel" data-pag="${pag + 1}" ${pag === pags - 1 ? "disabled" : ""} aria-label="Següent">${ICO.endavant}</button></div>` : ""}
      </header>
      <div class="acts">${vis.map(a => `<button class="act sel" data-act="${a.codi}">
          <span class="fila1"><span class="codi">${a.codi}</span><span class="nivell" title="Nivell ${a.nivell}">${[1, 2, 3].map(n => `<i class="${n <= a.nivell ? "on" : ""}"></i>`).join("")}</span></span>
          <span class="mini">${miniatures(a)}</span>
          <span class="t">${esc(a.titol)}</span>
          <span class="xips"><span class="xip">${esc(TIPUS[a.tipus])}</span>${a.origen === "fitxa" ? `<span class="xip fitxa" title="${esc(a.font || "")}">Fitxa original</span>` : `<span class="xip">Ampliació</span>`}</span>
        </button>`).join("")}</div>
    </section>`;
    on("[data-go]", () => vesA("inici"));
    on("[data-pag]", e => pintaBloc(id, +e.currentTarget.dataset.pag));
    on("[data-act]", e => vesA("act-" + e.currentTarget.dataset.act));
  }

  /* ================================================================
     MOTOR D'ACTIVITATS
     Cada tipus: rondes(act) -> [ronda]; pinta(ronda, escenari, api)
     ================================================================ */
  const T = {};

  function opcionsAmb(correcta, pool, n) {
    const altres = sample(pool.filter(w => w !== correcta), n - 1);
    return shuffle([correcta, ...altres]);
  }

  /* --- associa: picto sense paraula -> tria la paraula --- */
  T.associa = {
    rondes: a => { const ws = paraulesDe(a); return sample(ws, C.rondes).map(w => ({ w, ops: opcionsAmb(w, ws, a.opcions || 3) })); },
    pinta(r, e, api) {
      e.innerHTML = `<div class="dos"><div><div class="zona"><div class="ajust">${picto(r.w, false)}</div></div></div>
        <div class="paraules">${r.ops.map(o => `<button class="paraula opc sel fz${V[o].t}" data-w="${esc(o)}"><span>${esc(o)}</span></button>`).join("")}</div></div>`;
      api.opcions(e, o => o === r.w, r.w);
    }
  };
  /* --- llegeix: paraula -> tria el picto (sense paraula) --- */
  T.llegeix = {
    rondes: a => { const ws = paraulesDe(a); return sample(ws, C.rondes).map(w => ({ w, ops: opcionsAmb(w, ws, a.opcions || 3) })); },
    pinta(r, e, api) {
      e.innerHTML = `<div class="paraula-gran fz${V[r.w].t}"><span>${esc(r.w)}</span></div>
        <div class="zona"><div class="ajust" style="--cols:${r.ops.length}">${r.ops.map(o => `<button class="opc sel" data-w="${esc(o)}">${picto(o, false)}</button>`).join("")}</div></div>`;
      api.opcions(e, o => o === r.w, r.w);
    }
  };
  /* --- lletra / inicial --- */
  const LLETRES = "ABCDEFGILMNOPRSTUV".split("");
  const NOM_LLETRA = { A: "a", B: "be", C: "ce", D: "de", E: "e", F: "efa", G: "ge", H: "hac", I: "i", J: "jota", L: "ela", M: "ema", N: "ena", O: "o", P: "pe", Q: "cu", R: "erra", S: "essa", T: "te", U: "u", V: "ve", X: "ics", Z: "zeta" };
  function rondesLletra(a, inicial) {
    const ws = paraulesDe(a).filter(w => unaParaula(w) && w.length >= 3 && w.length <= 10);
    return sample(ws, C.rondes).map(w => {
      const pos = inicial ? 0 : pick([...w].map((c, i) => i).filter(i => i > 0 && /[A-Z]/.test(w[i])));
      const l = w[pos];
      return { w, pos, l, ops: shuffle([l, ...sample(LLETRES.filter(x => x !== l), (a.opcions || 3) - 1)]) };
    });
  }
  function pintaLletra(r, e, api) {
    e.innerHTML = `<div class="dos"><div><div class="zona"><div class="ajust">${picto(r.w, false)}</div></div></div>
      <div><div class="mot">${[...r.w].map((c, i) => `<b class="${i === r.pos ? "forat" : ""}">${i === r.pos ? "?" : esc(c)}</b>`).join("")}</div>
      <div class="lletres">${r.ops.map(o => `<button class="lletra-b opc sel" data-w="${o}">${o}</button>`).join("")}</div></div></div>`;
    api.opcions(e, o => o === r.l, r.w, {
      dirMalament: o => `${NOM_LLETRA[o] || o.toLowerCase()}. Torna-ho a provar.`,
      enEncert: () => { const f = e.querySelector(".forat"); f.textContent = r.l; f.className = "ple"; }
    });
  }
  T.lletra = { rondes: a => rondesLletra(a, false), pinta: pintaLletra };
  T.inicial = { rondes: a => rondesLletra(a, true), pinta: pintaLletra };

  /* --- síl·labes --- */
  T.sillabes = {
    rondes: a => sample(paraulesDe(a).filter(w => V[w].sil && V[w].sil.includes("-")), C.rondes).map(w => ({ w, sil: V[w].sil.split("-") })),
    pinta(r, e, api) {
      let seg = 0;
      const fitxes = shuffle(r.sil.map((s, i) => ({ s, i })));
      e.innerHTML = `<div class="dos"><div><div class="zona"><div class="ajust">${picto(r.w, false)}</div></div></div>
        <div><div class="slots">${r.sil.map((s, i) => `<b class="${i === 0 ? "ara" : ""}">&nbsp;</b>`).join("")}</div>
        <div class="lletres">${fitxes.map(f => `<button class="lletra-b sil opc sel" data-i="${f.i}" data-s="${esc(f.s)}">${esc(f.s)}</button>`).join("")}</div></div></div>`;
      const slots = e.querySelectorAll(".slots b");
      e.querySelectorAll(".opc").forEach(b => b.addEventListener("click", () => {
        if (api.ocupat()) return;
        const s = b.dataset.s;
        if (s === r.sil[seg]) { // pot haver-hi síl·labes repetides (PA-TA-TA)
          slots[seg].textContent = s; slots[seg].className = "ple"; b.disabled = true; b.style.visibility = "hidden";
          seg++; if (slots[seg]) slots[seg].className = "ara";
          if (seg === r.sil.length) api.encert(null, low(r.w)); else { so("be"); Veu.parla(low(s)); }
        } else api.error(b, `${low(s)}. Torna-ho a provar.`, false);
      }));
    }
  };

  /* --- omple la graella (fitxa de les estacions) --- */
  T.omple = {
    rondes: a => a.graelles.map(g => {
      let bons = perTags([g.bons], ["estacio"]);
      if (a.nouVocab) { const nous = bons.filter(w => !V[w].tags.some(t => t.startsWith("fitxa"))); if (nous.length >= 4) bons = nous; }
      bons = sample(bons, 4);
      const dolents = sample(perTags(g.dolents, ["estacio", g.bons]), 4);
      return { g, bons, pool: shuffle([...bons, ...dolents]) };
    }),
    enunciat: r => `Tria les 4 coses ${r.g.nom === "HIVERN" || r.g.nom === "ESTIU" ? "de l'" : "de la "}${low(r.g.nom)}.`,
    pinta(r, e, api) {
      let n = 0;
      e.innerHTML = `<div class="graella" style="--c:${r.g.color}"><h3>${esc(r.g.nom)}</h3><div class="cel">${"<div></div>".repeat(4)}</div></div>
        <div class="zona"><div class="ajust" style="--cols:8">${r.pool.map(w => `<button class="opc sel" data-w="${esc(w)}">${picto(w)}</button>`).join("")}</div></div>`;
      const cel = e.querySelectorAll(".cel > div");
      const zona = e.querySelector(".zona .ajust");
      const ajusta = () => { const amp = zona.parentElement.clientWidth, alt = zona.parentElement.clientHeight; zona.style.setProperty("--cols", amp / alt > 3.2 ? 8 : 4); zona.style.setProperty("--rows", amp / alt > 3.2 ? 1 : 2); };
      ajusta();
      e.querySelectorAll(".opc").forEach(b => b.addEventListener("click", () => {
        if (api.ocupat()) return;
        const w = b.dataset.w;
        if (r.bons.includes(w)) {
          cel[n++].innerHTML = picto(w); b.disabled = true; b.style.visibility = "hidden";
          if (n === 4) api.encert(null, `Molt bé! Has trobat les coses ${r.g.nom === "HIVERN" || r.g.nom === "ESTIU" ? "de l'" : "de la "}${low(r.g.nom)}.`, true);
          else { so("be"); Veu.parla(amb(w)); }
        } else api.error(b, `${low(w)}. No és ${r.g.nom === "HIVERN" || r.g.nom === "ESTIU" ? "de l'" : "de la "}${low(r.g.nom)}. Torna-ho a provar.`, false);
      }));
    }
  };

  /* --- classifica --- */
  T.classifica = {
    rondes: a => {
      const tags = a.categories.map(c => c.tag);
      const items = Object.keys(V).filter(w => !V[w].tags.includes("estacio") && !V[w].tags.includes("categoria") && tags.filter(t => V[w].tags.includes(t)).length === 1);
      return sample(items, C.rondes).map(w => ({ w, cat: a.categories.find(c => V[w].tags.includes(c.tag)) }));
    },
    enunciat: (r, a) => `${a.pregunta.replace("?", "")}: ${r.w}?`,
    diu: (r, a) => `${a.pregunta.replace("?", "")}: ${amb(r.w)}?`,
    pinta(r, e, api, a, estat) {
      estat.caixes = estat.caixes || {};
      e.innerHTML = `<div class="zona" style="flex:.85"><div class="ajust">${picto(r.w)}</div></div>
        <div class="caixes" style="--n:${a.categories.length}">${a.categories.map(c => `<button class="caixa opc sel" style="--c:${c.color}" data-w="${c.paraula}">
          <span class="cc"><img src="${src(V[c.paraula].id)}" alt=""><b>${esc(c.paraula)}</b></span>
          <span class="dins">${(estat.caixes[c.paraula] || []).map(w => `<img src="${src(V[w].id)}" alt="${esc(low(w))}">`).join("")}</span></button>`).join("")}</div>`;
      api.opcions(e, o => o === r.cat.paraula, null, {
        dirBe: () => `${amb(r.w)}: ${low(r.cat.paraula)}.`,
        enEncert: () => { (estat.caixes[r.cat.paraula] = estat.caixes[r.cat.paraula] || []).push(r.w);
          e.querySelector(`.caixa[data-w="${r.cat.paraula}"] .dins`).insertAdjacentHTML("beforeend", `<img src="${src(V[r.w].id)}" alt="">`); }
      });
    }
  };

  /* --- relaciona --- */
  T.relaciona = {
    rondes: a => {
      const pool = a.opcionsLlista || perTags([a.opcionsTag]);
      return sample(a.parelles, Math.min(C.rondes, a.parelles.length)).map(p => ({ ...p, ops: opcionsAmb(p.r, pool, a.opcions || 3) }));
    },
    enunciat: (r, a) => a.pregunta.replace("{art} {p}", amb(r.p)).replace("{a} {p}", aLa(r.p)).replace(/^./, c => c.toUpperCase()),
    pinta(r, e, api) {
      e.innerHTML = `<div class="zona" style="flex:.8"><div class="ajust">${picto(r.p)}</div></div>
        <div class="zona"><div class="ajust" style="--cols:${r.ops.length}">${r.ops.map(o => `<button class="opc sel" data-w="${esc(o)}">${picto(o)}</button>`).join("")}</div></div>`;
      api.opcions(e, o => o === r.r, r.r);
    }
  };

  /* --- intrús --- */
  T.intrus = {
    rondes: a => {
      const rs = [];
      for (let i = 0; i < C.rondes; i++) {
        const g = a.grups[i % a.grups.length];
        const excl = a.excloure || [];
        const del = sample(perTags([g.tag], excl), 3);
        const altresTags = a.grups.filter(x => x !== g).map(x => x.tag);
        const intr = pick(perTags(altresTags, [g.tag, ...excl]));
        rs.push({ g, intr, ops: shuffle([...del, intr]) });
      }
      return shuffle(rs);
    },
    enunciat: r => `Troba l'intrús. ${r.g.frase}`,
    pinta(r, e, api) {
      e.innerHTML = `<div class="zona"><div class="ajust" style="--cols:4">${r.ops.map(o => `<button class="opc sel" data-w="${esc(o)}">${picto(o)}</button>`).join("")}</div></div>`;
      api.opcions(e, o => o === r.intr, r.intr);
    }
  };

  /* --- escolta i tria --- */
  T.escolta = {
    rondes: a => { const ws = paraulesDe(a); return sample(ws, C.rondes).map(w => ({ w, ops: opcionsAmb(w, ws, a.opcions || 4) })); },
    enunciat: () => "Escolta i tria el pictograma.",
    diu: r => V[r.w].t === 3 ? `On és ${low(r.w)}?` : `On és ${amb(r.w)}?`,
    pinta(r, e, api) {
      e.innerHTML = `<button class="altaveu sel" data-repetir>${ICO.altaveu}<span>Torna a escoltar</span></button>
        <div class="zona"><div class="ajust" style="--cols:${r.ops.length}">${r.ops.map(o => `<button class="opc sel" data-w="${esc(o)}">${picto(o)}</button>`).join("")}</div></div>`;
      e.querySelector("[data-repetir]").addEventListener("click", () => Veu.parla(T.escolta.diu(r)));
      api.opcions(e, o => o === r.w, r.w);
    }
  };

  /* --- sí o no --- */
  T.sino = {
    rondes: a => sample(a.preguntes, C.rondes),
    enunciat: r => r.q,
    pinta(r, e, api) {
      e.innerHTML = `<div class="zona" style="flex:.9"><div class="ajust" style="--cols:${r.p.length}">${r.p.map(w => picto(w)).join("")}</div></div>
        <div class="zona sino"><div class="ajust" style="--cols:2">${["SÍ", "NO"].map(o => `<button class="opc sel" data-w="${o}">${picto(o)}</button>`).join("")}</div></div>`;
      api.opcions(e, o => (o === "SÍ") === r.r, null, { dirBe: () => (r.r ? "Sí" : "No") });
    }
  };

  /* --- endevinalla --- */
  T.endevinalla = {
    rondes: a => sample(a.endevinalles, C.rondes).map(x => ({ ...x, ops: shuffle(x.o) })),
    enunciat: () => "Endevina qui soc.",
    diu: r => r.q,
    pinta(r, e, api) {
      e.innerHTML = `<p class="endev">${esc(r.q)}</p>
        <div class="zona"><div class="ajust" style="--cols:${r.ops.length}">${r.ops.map(o => `<button class="opc sel" data-w="${esc(o)}">${picto(o)}</button>`).join("")}</div></div>`;
      api.opcions(e, o => o === r.r, r.r);
    }
  };

  /* --- memory --- */
  T.memory = {
    rondes: a => [{ ws: sample(paraulesDe(a), a.parelles || 6) }],
    enunciat: (r, a) => a.enunciat,
    pinta(r, e, api, a) {
      const cartes = shuffle(r.ws.flatMap(w => [{ w, k: "p" }, { w, k: a.modeParaula ? "t" : "p" }]));
      const n = cartes.length, amp = e.clientWidth || 1000, alt = e.clientHeight || 600;
      let millor = { cols: 4, sz: 0 };
      for (let cols = 2; cols <= n; cols++) { const rows = Math.ceil(n / cols); const sz = Math.min(amp / cols, alt / rows); if (sz > millor.sz) millor = { cols, rows, sz }; }
      e.innerHTML = `<div class="zona"><div class="ajust" style="--cols:${millor.cols};--rows:${millor.rows}">${cartes.map((c, i) => {
        const m = midaLletra(c.w);
        const cara = c.k === "p" ? picto(c.w) : `<div class="picto fz${V[c.w].t}"><div class="paraula-carta" style="--fs:${(m.fs * 1.15).toFixed(2)}"><span>${m.html}</span></div></div>`;
        return `<button class="carta opc sel" data-i="${i}" data-w="${esc(c.w)}"><div class="cos"><div class="dors"><span>?</span></div><div class="cara">${cara}</div></div></button>`;
      }).join("")}</div></div>`;
      let oberta = null, trobades = 0, bloc = false;
      e.querySelectorAll(".carta").forEach(b => b.addEventListener("click", async () => {
        if (bloc || b.classList.contains("girada") || b.classList.contains("trobada")) return;
        b.classList.add("girada"); b.disabled = true;
        Veu.parla(low(b.dataset.w));
        if (!oberta) { oberta = b; return; }
        const x = oberta; oberta = null;
        if (x.dataset.w === b.dataset.w) {
          x.classList.add("trobada"); b.classList.add("trobada"); trobades++;
          if (trobades === r.ws.length) { api.encert(null, "Has trobat totes les parelles!", true); }
          else { so("be"); await espera(250).catch(() => {}); Veu.parla(`${low(b.dataset.w)}. ${pick(LLOANCES)}`); }
        } else {
          bloc = true; api.comptaError(); so("malament");
          try { await espera(1500); } catch (err) { return; }
          x.classList.remove("girada"); b.classList.remove("girada"); x.disabled = false; b.disabled = false; bloc = false;
          Veu.parla("No són iguals. Torna-ho a provar.");
        }
      }));
    }
  };

  /* ---------------- execució d'una activitat ---------------- */
  function comenca(a) {
    const tipus = T[a.tipus];
    const rondes = tipus.rondes(a);
    const estat = { i: 0, encertsPrimera: 0, errorsRonda: 0, ocupat: false };
    const meu = token;

    const textEnunciat = r => (tipus.enunciat ? tipus.enunciat(r, a) : a.enunciat);
    const textDiu = r => (tipus.diu ? tipus.diu(r, a) : textEnunciat(r));

    function ronda() {
      if (meu !== token) return;
      if (estat.i >= rondes.length) return final();
      const r = rondes[estat.i];
      estat.errorsRonda = 0; estat.ocupat = false; M.pausaFins = performance.now() + 700;
      app.innerHTML = `<section class="pantalla">
        <header class="cap">
          <button class="btn-ico gran sel" data-tornar aria-label="Tornar a ${esc(BLOCS.find(b => b.id === a.bloc).nom)}">${ICO.enrere}</button>
          <div class="titol"><span class="sub"><span class="codi">${a.codi}</span> &nbsp;${esc(TIPUS[a.tipus])}</span><h2>${esc(a.titol)}</h2></div>
          ${rondes.length > 1 ? `<div class="progres" aria-label="Pregunta ${estat.i + 1} de ${rondes.length}">${rondes.map((x, k) => `<i class="${k < estat.i ? "fet" : k === estat.i ? "ara" : ""}"></i>`).join("")}</div>` : ""}
        </header>
        <div class="enunciat"><p>${esc(textEnunciat(r))}</p><button class="btn-ico gran sel" data-escolta aria-label="Escolta l'enunciat">${ICO.altaveu}</button></div>
        <div class="escenari"></div>
      </section>`;
      app.querySelector("[data-tornar]").addEventListener("click", () => vesA("bloc-" + a.bloc));
      app.querySelector("[data-escolta]").addEventListener("click", () => Veu.parla(textDiu(r)));
      const esc_ = app.querySelector(".escenari");
      tipus.pinta(r, esc_, api, a, estat);
      Veu.parla(textDiu(r));
    }

    const api = {
      ocupat: () => estat.ocupat,
      comptaError: () => { estat.errorsRonda++; },
      // connecta les opcions .opc: correcta(w) -> bool
      opcions(e, correcta, paraulaBe, extra = {}) {
        e.querySelectorAll(".opc").forEach(b => b.addEventListener("click", () => {
          if (estat.ocupat || b.disabled) return;
          const w = b.dataset.w;
          if (correcta(w)) {
            b.classList.add("be");
            if (extra.enEncert) extra.enEncert(w);
            api.encert(b, extra.dirBe ? extra.dirBe(w) : paraulaBe ? low(paraulaBe) : null);
          } else {
            api.error(b, extra.dirMalament ? extra.dirMalament(w) : `${low(w)}. Torna-ho a provar.`, true);
          }
        }));
      },
      async encert(b, dir, complet) {
        estat.ocupat = true;
        if (estat.errorsRonda === 0) estat.encertsPrimera++;
        const ll = pick(LLOANCES);
        so("be"); mostraReforc(ll);
        e_bloqueja();
        const frase = complet ? dir : (dir ? `${dir}. ${ll}` : ll);
        const t0 = performance.now();
        await Veu.parla(frase.replace(/\.\./g, "."));
        const resta = 1300 - (performance.now() - t0);
        try { if (resta > 0) await espera(resta); else await espera(150); } catch (err) { return; }
        if (meu !== token) return;
        estat.i++; ronda();
      },
      error(b, dir, marca) {
        estat.errorsRonda++;
        so("malament");
        if (b) { b.classList.remove("malament"); void b.offsetWidth; b.classList.add("malament");
          if (marca) { b.classList.add("provat"); b.disabled = true; } }
        Veu.parla(dir);
      }
    };
    function e_bloqueja() { app.querySelectorAll(".escenari .opc").forEach(x => { x.disabled = true; }); }

    function final() {
      const total = a.tipus === "memory" ? 1 : rondes.length;
      const pct = total ? estat.encertsPrimera / total : 1;
      const est = a.tipus === "memory" ? 3 : pct >= .85 ? 3 : pct >= .5 ? 2 : 1;
      app.innerHTML = `<section class="pantalla"><div class="final">
        <div class="estrelles">${[1, 2, 3].map(k => k <= est ? ICO.estrella : ICO.estrellaBuida).join("")}</div>
        <h2>Activitat acabada!</h2>
        <p>${a.tipus === "memory" ? "Has trobat totes les parelles." : `Encerts a la primera: ${estat.encertsPrimera} de ${total}`}</p>
        <div class="accions">
          <button class="btn-txt prim sel" data-r>${ICO.repetir} Tornar a fer</button>
          <button class="btn-txt sel" data-b>${ICO.enrere} Altres activitats</button>
          <button class="btn-txt sel" data-i>${ICO.casa} Inici</button>
        </div></div></section>`;
      app.querySelector("[data-r]").addEventListener("click", () => { token++; comenca(a); });
      app.querySelector("[data-b]").addEventListener("click", () => vesA("bloc-" + a.bloc));
      app.querySelector("[data-i]").addEventListener("click", () => vesA("inici"));
      Veu.parla("Has acabat l'activitat. Molt bona feina!");
    }
    ronda();
  }

  /* ---------------- configuració ---------------- */
  function pintaConfig() {
    const vs = veusSistema();
    const ca = vs.filter(v => /^ca/i.test(v.lang)), altres = vs.filter(v => !/^ca/i.test(v.lang) && /^(es|en|fr)/i.test(v.lang));
    const fmt = n => n.toFixed(1).replace(".", ",");
    const seg = (clau, ops) => `<div class="seg">${ops.map(([v, t]) => `<button class="sel ${C[clau] === v ? "on" : ""}" data-set="${clau}" data-v='${JSON.stringify(v)}'>${t}</button>`).join("")}</div>`;
    app.innerHTML = `<section class="pantalla scroll">
      <header class="cap"><button class="btn-ico gran sel" data-go aria-label="Inici">${ICO.casa}</button>
        <div class="titol"><h2>Configuració</h2><span class="sub">Es desa en aquest navegador</span></div></header>
      <div class="config">
        <section class="seccio"><h3>Accés amb la mirada</h3>
          <div class="opcio"><span class="lbl">Punt i cercle de rellotge</span>${seg("mirada", [[true, "Activat"], [false, "Desactivat"]])}</div>
          <div class="opcio"><span class="lbl">Qui fa el clic?</span>${seg("activa", [["app", "L'app, en acabar el cercle"], ["extern", "TD Control"]])}</div>
          <div class="opcio"><span class="lbl">Temps de fixació</span><span class="pas"><button class="sel" data-pas="temps" data-d="-0.1" aria-label="Menys temps">−</button><output>${fmt(C.temps)} s</output><button class="sel" data-pas="temps" data-d="0.1" aria-label="Més temps">+</button></span></div>
          <div class="opcio"><span class="lbl">Mida del punt</span><span class="pas"><button class="sel" data-pas="punt" data-d="-6" aria-label="Més petit">−</button><output>${C.punt} px</output><button class="sel" data-pas="punt" data-d="6" aria-label="Més gran">+</button></span></div>
          <p class="nota">Amb el Tobii i TD Control el ratolí es mou amb la mirada. El punt rodó segueix la mirada i, quan entra en una casella, dibuixa el cercle de rellotge durant el temps triat (de 0,5 a 2 segons). Si TD Control ja fa el clic, tria «TD Control» perquè no es faci dues vegades.</p>
        </section>
        <section class="seccio"><h3>Veu</h3>
          <div class="opcio"><span class="lbl">Veu que llegeix</span>${seg("motor", [["sistema", "Veu del sistema"], ["ona", "Ona"]])}</div>
          <div class="seccio" style="padding:14px;gap:10px;background:var(--bg)">
            <b>Veu Ona (català)</b>
            <div class="opcio"><span class="lbl">Qualitat</span>${seg("onaModel", [["ca_ES-upc_ona-medium", "Alta · 63 MB"], ["ca_ES-upc_ona-x_low", "Lleugera · 20 MB"]])}</div>
            <div class="estat" id="ona-estat">Comprovant…</div>
            <div class="barra" id="ona-barra" hidden><i></i></div>
            <div class="opcio"><button class="btn-txt prim sel" data-ona="baixa">Descarrega la veu Ona</button><button class="btn-txt sel" data-ona="esborra">Esborra-la</button></div>
            <p class="nota">Es descarrega una sola vegada i queda guardada en aquest navegador. Després funciona sense internet. Veu Ona del projecte FestCat (UPC), model Piper.</p>
          </div>
          <div class="lbl" style="font-weight:700">Veus del sistema</div>
          <div class="veus">${ca.length ? "" : `<p class="nota">No hi ha cap veu catalana instal·lada al sistema. Fes servir l'Ona.</p>`}
            ${[...ca, ...altres].map(v => `<button class="sel ${triaVeuSistema() === v ? "on" : ""}" data-veu="${esc(v.voiceURI)}">${esc(v.name)} · ${esc(v.lang)}</button>`).join("")}</div>
          <div class="opcio"><span class="lbl">Velocitat</span><span class="pas"><button class="sel" data-pas="velocitat" data-d="-0.05" aria-label="Més lenta">−</button><output>${Math.round(C.velocitat * 100)} %</output><button class="sel" data-pas="velocitat" data-d="0.05" aria-label="Més ràpida">+</button></span></div>
          <div class="opcio"><button class="btn-txt sel" data-prova>${ICO.altaveu} Prova la veu</button></div>
        </section>
        <section class="seccio"><h3>Activitats</h3>
          <div class="opcio"><span class="lbl">Preguntes per activitat</span>${seg("rondes", [[5, "5"], [8, "8"], [10, "10"], [12, "12"]])}</div>
          <div class="opcio"><span class="lbl">So de reforç</span>${seg("so", [[true, "Sí"], [false, "No"]])}</div>
          <p class="nota">Quan l'alumne encerta: so, missatge i veu de reforç positiu. Quan s'equivoca: la veu diu el pictograma o la paraula triada i «Torna-ho a provar».</p>
        </section>
      </div></section>`;
    on("[data-go]", () => vesA("inici"));
    on("[data-set]", e => { const b = e.currentTarget; C[b.dataset.set] = JSON.parse(b.dataset.v); desa(); aplicaMirada();
      if (b.dataset.set === "onaModel") Veu.cache.clear();
      pintaConfig(); if (b.dataset.set === "motor" && C.motor === "ona" && !Veu.onaLlesta) Veu.parla("Primer has de descarregar la veu Ona."); });
    on("[data-pas]", e => { const b = e.currentTarget, k = b.dataset.pas, d = +b.dataset.d;
      const lim = { temps: [0.5, 2], punt: [20, 110], velocitat: [0.5, 1.5] }[k];
      C[k] = Math.round(Math.min(lim[1], Math.max(lim[0], C[k] + d)) * 100) / 100; desa(); aplicaMirada(); pintaConfig(); });
    on("[data-veu]", e => { C.veuSistema = e.currentTarget.dataset.veu; C.motor = "sistema"; desa(); pintaConfig(); Veu.parla("Hola! Aquesta és la meva veu."); });
    on("[data-prova]", () => Veu.parla("Hola! Som a l'hort. Mira la ceba i la maduixa."));
    estatOna();
    on("[data-ona]", async e => {
      const acc = e.currentTarget.dataset.ona, est = document.getElementById("ona-estat"), barra = document.getElementById("ona-barra");
      try {
        const m = await Veu.carregaOna();
        if (acc === "esborra") { await m.remove(C.onaModel); Veu.onaLlesta = false; Veu.cache.clear(); if (C.motor === "ona") { C.motor = "sistema"; desa(); } return pintaConfig(); }
        barra.hidden = false; est.className = "estat"; est.textContent = "Descarregant…";
        await m.download(C.onaModel, p => { if (p.total) { const pc = Math.round(p.loaded * 100 / p.total); barra.firstElementChild.style.width = pc + "%"; est.textContent = `Descarregant… ${pc} %`; } });
        est.textContent = "Preparant la veu…";
        await new Promise(r => setTimeout(r, 1200));
        await Veu.comprovaOna();
        if (Veu.onaLlesta) { C.motor = "ona"; desa(); pintaConfig(); Veu.parla("Hola! Soc l'Ona. Ja puc llegir els enunciats."); }
        else { est.className = "estat ko"; est.textContent = "No s'ha pogut desar la veu. Torna-ho a provar."; }
      } catch (err) {
        console.error(err);
        est.className = "estat ko"; est.textContent = "No s'ha pogut descarregar. Cal connexió a internet i obrir l'app des de l'adreça web (GitHub Pages).";
      }
    });
  }
  async function estatOna() {
    const est = document.getElementById("ona-estat"); if (!est) return;
    const ok = await Veu.comprovaOna();
    const e2 = document.getElementById("ona-estat"); if (!e2) return;
    e2.className = "estat " + (ok ? "ok" : "");
    e2.textContent = ok ? "Instal·lada en aquest navegador ✓" : "No instal·lada";
  }

  /* ---------------- vocabulari ---------------- */
  function pintaVocab() {
    const temes = [["L'hort", w => V[w].tags.includes("hort")], ["Fruites", w => V[w].tags.includes("fruita") && !V[w].tags.includes("hort")],
      ["Les estacions", w => ["estacio", "hivern", "estiu", "tardor", "primavera"].some(t => V[w].tags.includes(t)) && !V[w].tags.includes("fruita")],
      ["Altres", w => ["natura", "categoria", "resposta"].some(t => V[w].tags.includes(t))]];
    app.innerHTML = `<section class="pantalla scroll">
      <header class="cap"><button class="btn-ico gran sel" data-go aria-label="Inici">${ICO.casa}</button>
        <div class="titol"><h2>Vocabulari</h2><span class="sub">${Object.keys(V).length} paraules · toca un pictograma per escoltar-lo</span></div></header>
      ${temes.map(([t, f]) => `<h3 class="tema-tit">${t}</h3><div class="vocab-grid">${Object.keys(V).filter(f).map(w => `<button class="sel" data-w="${esc(w)}">${picto(w)}</button>`).join("")}</div>`).join("")}
    </section>`;
    on("[data-go]", () => vesA("inici"));
    on("[data-w]", e => Veu.parla(amb(e.currentTarget.dataset.w)));
  }

  /* ---------------- inici ---------------- */
  aplicaMirada();
  const portada = document.getElementById("inici-so");
  const arrenca = () => {
    portada.remove();
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); } catch (e) {}
    Veu.parla("Coneixement de l'entorn natural");
  };
  portada.addEventListener("click", arrenca);
  document.addEventListener("keydown", e => { if (document.getElementById("inici-so") && (e.key === "Enter" || e.key === " ")) arrenca(); });
  ruta();
  Veu.comprovaOna().then(ok => { if (ok) Veu.preescalfa([...LLOANCES, "Torna-ho a provar."]); });
})();
