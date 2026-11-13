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
    intro: true,         // animació d'entrada amb el logotip
    musica: true,        // música i sons de l'animació d'entrada
    motor: "sistema",    // "sistema" | "ona"
    veuSistema: "",
    velocitat: 0.95,
    volum: 1,
    onaModel: "ca_ES-upc_ona-medium"
  };
  let C = { ...DEF };
  try { Object.assign(C, JSON.parse(localStorage.getItem("entorn-config") || "{}")); } catch (e) {}
  C.mirada = false; // el programa comença sempre amb la mirada desactivada
  const desa = () => { try { localStorage.setItem("entorn-config", JSON.stringify(C)); } catch (e) {} };

  /* ---------------- alumnes i seguiment (només en aquest navegador) ---------------- */
  const D = { alumnes: [], registres: [], pin: null };
  try { Object.assign(D, JSON.parse(localStorage.getItem("entorn-dades") || "{}")); } catch (e) {}
  const desaD = () => { try { localStorage.setItem("entorn-dades", JSON.stringify(D)); return true; } catch (e) { return false; } };
  const norm = s => s.trim().replace(/\s+/g, " ").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  let alumne = null;
  try { const id = sessionStorage.getItem("entorn-alumne"); alumne = D.alumnes.find(x => x.id === id) || null; } catch (e) {}
  const entra = al => { alumne = al; try { al ? sessionStorage.setItem("entorn-alumne", al.id) : sessionStorage.removeItem("entorn-alumne"); } catch (e) {} };
  let profOk = false;  // PIN validat en aquesta sessió
  let actual = null;   // activitat en curs (per desar-la si es deixa a mitges)

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
    fulla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19l8-8"/></svg>',
    persona: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>',
    ull: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    baixa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 21h16"/></svg>',
    esborra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    repetir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0115.5-6.2L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-15.5 6.2L3 16"/><path d="M3 21v-5h5"/></svg>',
    estrella: '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="#f5b400" stroke="#b07f00" stroke-width="1"/></svg>',
    estrellaBuida: '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".35"/></svg>'
  };

  /* ---------------- pictograma ---------------- */
  // amplada real del text en Arial negreta (en "em"), per fer-lo cabre sempre en una sola línia
  const mesura = (() => {
    const ctx = document.createElement("canvas").getContext("2d"), cau = {};
    return t => { if (!(t in cau)) { ctx.font = "700 100px Arial, Helvetica, 'Liberation Sans', sans-serif"; cau[t] = ctx.measureText(t).width / 100; } return cau[t]; };
  })();
  // mida de lletra (en % de l'amplada disponible) perquè el text hi càpiga en una línia
  const ajusta = (t, disp, max) => Math.min(max, disp / Math.max(mesura(t), 0.5));
  // mida de la paraula dins el requadre del pictograma: una línia; si és llarga, lletra més petita
  function midaLletra(w) {
    return { fs: ajusta(w, 80, 15), html: esc(w) };
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
  const ZONA_PROF = ["seguiment", "gestio-alumnes", "configuracio"];
  function ruta() {
    if (actual && !actual.desat) actual.desa(false); // activitat deixada a mitges
    actual = null;
    token++; Veu.atura(); reiniciaDwell(); M.pausaFins = performance.now() + 600;
    document.querySelectorAll(".reforc").forEach(x => x.remove());
    const h = location.hash.slice(1);
    if (ZONA_PROF.includes(h)) {
      if (!profOk) return pintaPin(h);
      if (h === "seguiment") return pintaSeguiment();
      if (h === "gestio-alumnes") return pintaGestio();
      return pintaConfig();
    }
    if (h === "nou-alumne") return pintaNouAlumne();
    if (!alumne) return pintaEntrada();
    if (h.startsWith("bloc-")) return pintaBloc(h.slice(5), 0);
    if (h.startsWith("act-")) { const a = ACTS.find(x => x.codi.toLowerCase() === h.slice(4).toLowerCase()); if (a) return comenca(a); }
    if (h === "vocabulari") return pintaVocab();
    pintaPortada();
  }
  function on(sel, fn, arrel = app) { arrel.querySelectorAll(sel).forEach(el => el.addEventListener("click", fn)); }

  const CREDITS = `Creat per <b>Miquel Gatell</b> amb Claude (Anthropic) · Pictogrames: Sergio Palao · ARASAAC (arasaac.org) · CC BY-NC-SA · Govern d'Aragó`;

  /* ---------------- portada ---------------- */
  const fetesDe = (bloc) => new Set(D.registres.filter(r => alumne && r.alumne === alumne.id && r.acabada && r.bloc === bloc).map(r => r.codi));
  function pintaPortada() {
    app.innerHTML = `<section class="pantalla portada">
      <header class="top">
        <div class="marca"><span class="marca-logo">${window.Intro.cara()}</span><span>AREMI · Coneixement de l'entorn natural</span></div>
        <div class="eines">
          <button class="btn-ico sel" data-go="vocabulari" aria-label="Vocabulari">${ICO.llibre}</button>
          <button class="btn-ico sel" data-go="seguiment" aria-label="Zona del professional">${ICO.config}</button>
        </div>
      </header>
      <div class="hola">
        ${avatar(alumne.nom)}
        <div class="hola-txt"><h1>Hola, ${esc(alumne.nom)}!</h1><p>Què vols fer avui?</p></div>
        <button class="btn-txt sel" data-canvia>${ICO.persona} Canvia d'alumne</button>
      </div>
      <nav class="blocs">${BLOCS.map(b => {
        const acts = ACTS.filter(a => a.bloc === b.id), n = acts.length;
        const fetes = acts.filter(a => fetesDe(b.id).has(a.codi)).length;
        return `<button class="bloc sel ${b.color}" data-go="bloc-${b.id}">
          <span class="bloc-txt">
            <span class="nom">${esc(b.nom)}</span>
            <span class="desc">${esc(b.desc)}</span>
            <span class="prog"><span class="barra-b"><i style="width:${n ? fetes * 100 / n : 0}%"></i></span><span>${fetes} de ${n} ${n === 1 ? "feta" : "fetes"}</span></span>
          </span>
          <span class="icones ${b.icones.length > 1 ? "dues" : ""}">${b.icones.map(i => `<img src="${src(ICONES[i])}" alt="">`).join("")}</span>
        </button>`;
      }).join("")}</nav>
      <div class="peu">${CREDITS}</div>
    </section>`;
    on("[data-go]", e => { const g = e.currentTarget.dataset.go; const b = BLOCS.find(x => "bloc-" + x.id === g); if (b) Veu.parla(b.nom); vesA(g); });
    on("[data-canvia]", () => { entra(null); vesA("entrar"); });
  }

  /* ---------------- entrada d'alumnes ---------------- */
  function avatar(nom) {
    let h = 0; for (const c of nom) h = (h * 31 + c.charCodeAt(0)) % 360;
    return `<span class="avatar" style="--h:${h}">${esc(nom.trim()[0] || "?").toUpperCase()}</span>`;
  }
  function botoMirada() {
    return `<button class="btn-txt sel ${C.mirada ? "prim" : ""}" data-mirada>${ICO.ull} Mirada: ${C.mirada ? "activada" : "desactivada"}</button>`;
  }
  function connectaMirada(repinta) {
    on("[data-mirada]", () => { C.mirada = !C.mirada; aplicaMirada(); repinta(); });
  }
  const COLORS_AL = ["#4a57d6", "#0e9a72", "#f0663a", "#a245cf", "#e23e74", "#0b86b0", "#c27803", "#5a67d8"];
  function pintaEntrada() {
    const llista = D.alumnes.slice().sort((a, b) => a.nom.localeCompare(b.nom, "ca"));
    app.innerHTML = `<section class="pantalla scroll entrada">
      <header class="entrada-hero">
        <span class="hero-logo">${window.Intro.cara("parpelleja")}</span>
        <div class="hero-txt"><span class="hero-sub">AREMI · Coneixement de l'entorn natural</span><h1>Hola! Qui ets?</h1><p>Toca el teu nom per començar.</p></div>
        <div class="eines">${botoMirada()}
          <button class="btn-ico sel" data-go="seguiment" aria-label="Zona del professional">${ICO.config}</button></div>
      </header>
      <div class="alumnes">
        ${llista.map((a, k) => `<button class="alumne sel" data-id="${a.id}" style="--c:${COLORS_AL[k % COLORS_AL.length]}"><span class="inicial">${esc(a.nom.trim()[0] || "?").toUpperCase()}</span><span class="nom-al">${esc(a.nom)}</span></button>`).join("")}
        <button class="alumne nou sel" data-nou><span class="inicial">+</span><span class="nom-al">Alumne nou</span></button>
      </div>
      ${llista.length ? "" : `<p class="nota-buida">Encara no hi ha cap alumne. Toca «Alumne nou» per crear-ne un.</p>`}
      <div class="peu peu-entrada">${CREDITS}</div>
    </section>`;
    connectaMirada(pintaEntrada);
    on("[data-go]", () => vesA("seguiment"));
    on("[data-nou]", () => vesA("nou-alumne"));
    on("[data-id]", e => {
      const al = D.alumnes.find(x => x.id === e.currentTarget.dataset.id); if (!al) return;
      entra(al); Veu.parla(`Hola, ${al.nom}!`); vesA("inici");
    });
  }
  function pintaNouAlumne() {
    app.innerHTML = `<section class="pantalla scroll">
      <header class="cap"><button class="btn-ico gran sel" data-tornar aria-label="Tornar">${ICO.enrere}</button>
        <div class="titol"><h2>Alumne nou</h2><span class="sub">El nom es guarda només en aquest ordinador</span></div></header>
      <form class="form-nom" id="form-nom" autocomplete="off">
        <label for="nom-alumne">Nom de l'alumne</label>
        <input id="nom-alumne" maxlength="30" placeholder="Per exemple: Marta" autocomplete="off">
        <p class="avis" id="avis-nom" role="alert" hidden></p>
        <div class="accions-form"><button type="submit" class="btn-txt prim sel">${ICO.ok} Crea i entra</button>
          <button type="button" class="btn-txt sel" data-tornar>Cancel·la</button></div>
      </form>
    </section>`;
    const inp = document.getElementById("nom-alumne"), avis = document.getElementById("avis-nom");
    setTimeout(() => inp.focus(), 50);
    inp.addEventListener("input", () => { avis.hidden = true; });
    on("[data-tornar]", () => vesA("entrar"));
    document.getElementById("form-nom").addEventListener("submit", e => {
      e.preventDefault();
      const nom = inp.value.trim().replace(/\s+/g, " ");
      if (!nom) { avis.textContent = "Escriu el nom de l'alumne."; avis.hidden = false; return; }
      const igual = D.alumnes.find(x => norm(x.nom) === norm(nom));
      if (igual) {
        avis.textContent = `Ja hi ha un alumne que es diu «${igual.nom}». Tria'l a la llista o escriu un altre nom.`;
        avis.hidden = false; Veu.parla("Aquest nom ja existeix."); inp.focus(); return;
      }
      const al = { id: "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), nom, creat: new Date().toISOString() };
      D.alumnes.push(al);
      if (!desaD()) { avis.textContent = "No s'ha pogut desar. Aquest navegador no permet guardar dades."; avis.hidden = false; return; }
      entra(al); Veu.parla(`Hola, ${nom}!`); vesA("inici");
    });
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
    const fetes = fetesDe(id);
    app.innerHTML = `<section class="pantalla bloc-${id}">
      <header class="cap">
        <button class="btn-ico gran sel" data-go="inici" aria-label="Inici">${ICO.casa}</button>
        <span class="xapa ${b.color}"><img src="${src(ICONES[b.icones[0]])}" alt=""></span>
        <div class="titol"><h2>${esc(b.nom)}</h2><span class="sub">${fetes.size} de ${llista.length} ${llista.length === 1 ? "activitat feta" : "activitats fetes"} · ${esc(alumne.nom)}</span></div>
        ${pags > 1 ? `<div class="pagina"><button class="btn-ico sel" data-pag="${pag - 1}" ${pag === 0 ? "disabled" : ""} aria-label="Anterior">${ICO.enrere}</button>
          <span>${pag + 1} / ${pags}</span><button class="btn-ico sel" data-pag="${pag + 1}" ${pag === pags - 1 ? "disabled" : ""} aria-label="Següent">${ICO.endavant}</button></div>` : ""}
      </header>
      <div class="acts">${vis.map(a => `<button class="act sel" data-act="${a.codi}">
          <span class="fila1"><span class="codi">${a.codi}</span>${fetes.has(a.codi) ? `<span class="feta">${ICO.ok} Feta</span>` : ""}<span class="nivell" title="Nivell ${a.nivell}">${[1, 2, 3].map(n => `<i class="${n <= a.nivell ? "on" : ""}"></i>`).join("")}</span></span>
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
        <div class="paraules">${r.ops.map(o => `<button class="paraula opc sel" data-w="${esc(o)}"><span style="font-size:min(48cqh, ${ajusta(o, 92, 11).toFixed(2)}cqw, 90px)">${esc(o)}</span></button>`).join("")}</div></div>`;
      api.opcions(e, o => o === r.w, r.w);
    }
  };
  /* --- llegeix: paraula -> tria el picto (sense paraula) --- */
  T.llegeix = {
    rondes: a => { const ws = paraulesDe(a); return sample(ws, C.rondes).map(w => ({ w, ops: opcionsAmb(w, ws, a.opcions || 3) })); },
    pinta(r, e, api) {
      e.innerHTML = `<div class="paraula-gran"><span style="font-size:min(clamp(40px, 9vmin, 120px), ${ajusta(r.w, 92, 60).toFixed(2)}cqw)">${esc(r.w)}</span></div>
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
      <div class="col-dreta"><div class="mot" style="--n:${r.w.length}">${[...r.w].map((c, i) => `<b class="${i === r.pos ? "forat" : ""}">${i === r.pos ? "?" : esc(c)}</b>`).join("")}</div>
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
      // amplada (en em) de les caselles i de les fitxes, per mantenir-ho tot en una línia
      const ampSlots = r.sil.reduce((t, s) => t + Math.max(2.2, mesura(s) + 0.7), 0) + 0.25 * (r.sil.length - 1);
      const ampFitxes = r.sil.reduce((t, s) => t + mesura(s) + 1.2, 0) + 0.35 * (r.sil.length - 1);
      e.innerHTML = `<div class="dos"><div><div class="zona"><div class="ajust">${picto(r.w, false)}</div></div></div>
        <div class="col-dreta"><div class="slots" style="font-size:min(clamp(40px, 10vmin, 110px), ${(96 / ampSlots).toFixed(2)}cqw)">${r.sil.map((s, i) => `<b class="${i === 0 ? "ara" : ""}">&nbsp;</b>`).join("")}</div>
        <div class="lletres sils" style="font-size:min(clamp(36px, 8vmin, 96px), ${(94 / ampFitxes).toFixed(2)}cqw)">${fitxes.map(f => `<button class="lletra-b sil opc sel" data-i="${f.i}" data-s="${esc(f.s)}">${esc(f.s)}</button>`).join("")}</div></div></div>`;
      const slots = e.querySelectorAll(".slots b");
      e.querySelectorAll(".opc").forEach(b => b.addEventListener("click", () => {
        if (api.ocupat()) return;
        const s = b.dataset.s;
        if (s === r.sil[seg]) { // pot haver-hi síl·labes repetides (PA-TA-TA)
          slots[seg].textContent = s; slots[seg].className = "ple"; b.disabled = true; b.style.visibility = "hidden";
          seg++; if (slots[seg]) slots[seg].className = "ara";
          if (seg === r.sil.length) {
            // paraula acabada: es mostra tota junta, sense caselles
            const caixa = e.querySelector(".slots");
            caixa.outerHTML = `<div class="paraula-feta" style="font-size:min(clamp(44px, 11vmin, 130px), ${ajusta(r.w, 88, 60).toFixed(2)}cqw)">${esc(r.w)}</div>`;
            api.encert(null, low(r.w));
          } else { so("be"); Veu.parla(low(s)); }
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
          if (n === 4) api.encert(null, `Has trobat les coses ${r.g.nom === "HIVERN" || r.g.nom === "ESTIU" ? "de l'" : "de la "}${low(r.g.nom)}.`, true);
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
          <span class="cc"><img src="${src(V[c.paraula].id)}" alt=""><b style="font-size:min(clamp(22px, 4vmin, 48px), ${ajusta(c.paraula, 60, 40).toFixed(2)}cqw)">${esc(c.paraula)}</b></span>
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
        const cara = c.k === "p" ? picto(c.w) : `<div class="picto"><div class="paraula-carta" style="--fs:${ajusta(c.w, 80, 18).toFixed(2)}"><span>${m.html}</span></div></div>`;
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
          if (trobades === r.ws.length) { api.encert(null, "Has trobat totes les parelles.", true); }
          else { so("be"); }
        } else {
          bloc = true; api.comptaError(x.dataset.w, b.dataset.w); so("malament");
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
    const estat = { i: 0, encertsPrimera: 0, errorsRonda: 0, errors: 0, fallades: [], objectiu: "", ocupat: false };
    const meu = token;
    const t0 = Date.now();
    // registre per al seguiment del professional
    actual = {
      desat: false,
      desa(acabada) {
        this.desat = true;
        if (!alumne || (!acabada && estat.i === 0 && estat.errors === 0)) return;
        const total = a.tipus === "memory" ? 1 : rondes.length;
        D.registres.push({ alumne: alumne.id, codi: a.codi, tipus: a.tipus, titol: a.titol, bloc: a.bloc, data: new Date(t0).toISOString(),
          durada: Math.round((Date.now() - t0) / 1000), preguntes: total, fetes: acabada ? total : estat.i,
          encertsPrimera: estat.encertsPrimera, errors: estat.errors, fallades: estat.fallades.slice(0, 40), acabada });
        desaD();
      }
    };
    const objectiuDe = r => r.w || (typeof r.r === "string" ? r.r : "") || r.intr || (r.cat && r.cat.paraula) || (r.g && r.g.nom) || (r.q ? (r.r ? "SÍ" : "NO") : "");

    const textEnunciat = r => (tipus.enunciat ? tipus.enunciat(r, a) : a.enunciat);
    const textDiu = r => (tipus.diu ? tipus.diu(r, a) : textEnunciat(r));

    function ronda() {
      if (meu !== token) return;
      if (estat.i >= rondes.length) return final();
      const r = rondes[estat.i];
      estat.errorsRonda = 0; estat.ocupat = false; estat.objectiu = objectiuDe(r); M.pausaFins = performance.now() + 700;
      app.innerHTML = `<section class="pantalla bloc-${a.bloc}">
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
      comptaError: (objectiu, triat) => { estat.errorsRonda++; estat.errors++; estat.fallades.push({ o: objectiu, t: triat }); },
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
      // encert: so + casella verda + la paraula (la felicitació es reserva per al final)
      async encert(b, dir) {
        estat.ocupat = true;
        if (estat.errorsRonda === 0) estat.encertsPrimera++;
        so("be");
        e_bloqueja();
        const ti = performance.now();
        if (dir) await Veu.parla(dir.replace(/\.\./g, "."));
        const resta = 1000 - (performance.now() - ti);
        try { if (resta > 0) await espera(resta); else await espera(150); } catch (err) { return; }
        if (meu !== token) return;
        estat.i++; ronda();
      },
      error(b, dir, marca) {
        estat.errorsRonda++; estat.errors++;
        if (b) estat.fallades.push({ o: estat.objectiu, t: b.dataset.w || b.dataset.s || "" });
        so("malament");
        if (b) { b.classList.remove("malament"); void b.offsetWidth; b.classList.add("malament");
          if (marca) { b.classList.add("provat"); b.disabled = true; } }
        Veu.parla(dir);
      }
    };
    function e_bloqueja() { app.querySelectorAll(".escenari .opc").forEach(x => { x.disabled = true; }); }

    function final() {
      actual.desa(true);
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
      app.querySelector("[data-r]").addEventListener("click", () => { token++; document.querySelectorAll(".reforc").forEach(x => x.remove()); comenca(a); });
      app.querySelector("[data-b]").addEventListener("click", () => vesA("bloc-" + a.bloc));
      app.querySelector("[data-i]").addEventListener("click", () => vesA("inici"));
      const ll = pick(LLOANCES);
      mostraReforc(ll);
      Veu.parla(`${ll} Has acabat l'activitat, ${alumne ? alumne.nom : ""}.`);
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
      ${capProf("configuracio")}
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
          <div class="opcio"><span class="lbl">Animació d'entrada</span>${seg("intro", [[true, "Sí"], [false, "No"]])}</div>
          <div class="opcio"><span class="lbl">Música de l'animació</span>${seg("musica", [[true, "Sí"], [false, "No"]])}</div>
          <div class="opcio"><button class="btn-txt sel" data-veu-intro>Torna a veure l'animació</button></div>
          <p class="nota">Quan l'alumne encerta: so curt, la casella es posa verda i la veu diu la paraula. La felicitació surt en acabar l'activitat. Quan s'equivoca: la veu diu el pictograma o la paraula triada i «Torna-ho a provar».</p>
        </section>
        <section class="seccio"><h3>Codi PIN</h3>
          <p class="nota">El PIN protegeix el seguiment, els alumnes i la configuració.</p>
          <div class="opcio"><button class="btn-txt sel" data-canvia-pin>Canvia el PIN</button></div>
        </section>
      </div></section>`;
    connectaProf();
    on("[data-veu-intro]", () => fesIntro(() => {}));
    on("[data-canvia-pin]", () => { D.pin = null; desaD(); profOk = false; vesA("configuracio"); });
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

  /* ================================================================
     ZONA DEL PROFESSIONAL (protegida amb PIN)
     ================================================================ */
  function capProf(actiu) {
    const pest = [["seguiment", "Seguiment"], ["gestio-alumnes", "Alumnes"], ["configuracio", "Configuració"]];
    return `<header class="cap">
      <button class="btn-ico gran sel" data-surt aria-label="Surt de la zona del professional">${ICO.casa}</button>
      <div class="titol"><h2>Zona del professional</h2><span class="sub">Les dades es guarden només en aquest navegador</span></div>
    </header>
    <nav class="pestanyes">${pest.map(([h, t]) => `<button class="sel ${h === actiu ? "on" : ""}" data-pest="${h}">${t}</button>`).join("")}</nav>`;
  }
  function connectaProf() {
    on("[data-surt]", () => { profOk = false; vesA(alumne ? "inici" : "entrar"); });
    on("[data-pest]", e => vesA(e.currentTarget.dataset.pest));
  }

  function pintaPin(desti) {
    const crea = !D.pin;
    let codi = "", primer = null;
    const pinta = (msg, error) => {
      app.innerHTML = `<section class="pantalla scroll">
        <header class="cap"><button class="btn-ico gran sel" data-surt aria-label="Tornar">${ICO.enrere}</button>
          <div class="titol"><h2>Zona del professional</h2><span class="sub">${crea ? "Primer cal crear un codi PIN" : "Escriu el codi PIN"}</span></div></header>
        <div class="pin">
          <p class="pin-msg ${error ? "ko" : ""}" role="status">${esc(msg)}</p>
          <div class="pin-punts">${[0, 1, 2, 3].map(i => `<i class="${i < codi.length ? "ple" : ""}"></i>`).join("")}</div>
          <div class="teclat">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="sel" data-n="${n}">${n}</button>`).join("")}
            <button class="sel" data-esb aria-label="Esborra">⌫</button><button class="sel" data-n="0">0</button><span></span></div>
          ${crea ? "" : `<button class="enllac sel" data-oblit>He oblidat el PIN</button>`}
        </div></section>`;
      on("[data-surt]", () => vesA(alumne ? "inici" : "entrar"));
      on("[data-n]", e => tecla(e.currentTarget.dataset.n));
      on("[data-esb]", () => { codi = codi.slice(0, -1); pinta(msgActual); });
      on("[data-oblit]", oblit);
    };
    let msgActual = crea ? "Tria un PIN de 4 xifres." : "Escriu el PIN de 4 xifres.";
    const tecla = n => {
      if (codi.length >= 4) return;
      codi += n;
      if (codi.length < 4) return pinta(msgActual);
      if (crea && primer === null) { primer = codi; codi = ""; msgActual = "Torna a escriure el PIN per confirmar-lo."; return pinta(msgActual); }
      if (crea) {
        if (codi !== primer) { primer = null; codi = ""; msgActual = "Tria un PIN de 4 xifres."; return pinta("Els dos PIN no coincideixen. Torna-ho a provar.", true); }
        D.pin = codi; desaD(); profOk = true; return vesA(desti);
      }
      if (codi === D.pin) { profOk = true; return vesA(desti); }
      codi = ""; pinta("PIN incorrecte. Torna-ho a provar.", true);
    };
    const oblit = () => {
      app.querySelector(".pin").innerHTML = `<div class="confirma">
        <p><b>Per seguretat, el PIN només es pot recuperar esborrant totes les dades de seguiment</b> (els alumnes i el seu historial). La configuració es manté.</p>
        <div class="accions-form"><button class="btn-txt sel ko" data-si>${ICO.esborra} Esborra les dades i crea un PIN nou</button>
        <button class="btn-txt sel" data-no>No, torna enrere</button></div></div>`;
      on("[data-no]", () => pinta(msgActual));
      on("[data-si]", () => { D.alumnes = []; D.registres = []; D.pin = null; desaD(); entra(null); pintaPin(desti); });
    };
    document.onkeydown = e => {
      if (!document.querySelector(".teclat")) { document.onkeydown = null; return; }
      if (/^[0-9]$/.test(e.key)) tecla(e.key);
      else if (e.key === "Backspace") { codi = codi.slice(0, -1); pinta(msgActual); }
    };
    pinta(msgActual);
  }

  // --- càlculs de seguiment ---
  const fmtData = iso => new Date(iso).toLocaleDateString("ca-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  const fmtHora = iso => new Date(iso).toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" });
  const fmtTemps = s => s < 60 ? `${s} s` : s < 3600 ? `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s` : `${Math.floor(s / 3600)} h ${Math.floor(s % 3600 / 60)} min`;
  const pct = (a, b) => b ? Math.round(a * 100 / b) : 0;
  const nomAlumne = id => (D.alumnes.find(x => x.id === id) || { nom: "(esborrat)" }).nom;
  let filtreAl = null;

  function pintaSeguiment() {
    if (filtreAl && !D.alumnes.some(x => x.id === filtreAl)) filtreAl = null;
    if (!filtreAl && D.alumnes.length) filtreAl = D.alumnes.slice().sort((a, b) => a.nom.localeCompare(b.nom, "ca"))[0].id;
    const regs = D.registres.filter(r => r.alumne === filtreAl).sort((a, b) => b.data.localeCompare(a.data));
    const acab = regs.filter(r => r.acabada);
    const totP = acab.reduce((t, r) => t + (r.tipus === "memory" ? 0 : r.preguntes), 0);
    const totE = acab.reduce((t, r) => t + (r.tipus === "memory" ? 0 : r.encertsPrimera), 0);
    const temps = regs.reduce((t, r) => t + r.durada, 0);
    // per activitat
    const perAct = {};
    regs.slice().reverse().forEach(r => {
      const x = perAct[r.codi] = perAct[r.codi] || { codi: r.codi, titol: r.titol, vegades: 0, acabades: 0, ultim: null, millor: -1, data: r.data };
      x.vegades++; x.data = r.data;
      if (r.acabada) { x.acabades++; const p = pct(r.encertsPrimera, r.preguntes); x.ultim = p; x.millor = Math.max(x.millor, p); }
    });
    // paraules amb més errors
    const err = {};
    regs.forEach(r => (r.fallades || []).forEach(f => { if (!f.o) return; const k = f.o; err[k] = err[k] || { n: 0, amb: {} }; err[k].n++; if (f.t) err[k].amb[f.t] = (err[k].amb[f.t] || 0) + 1; }));
    const topErr = Object.entries(err).sort((a, b) => b[1].n - a[1].n).slice(0, 12);
    const llista = D.alumnes.slice().sort((a, b) => a.nom.localeCompare(b.nom, "ca"));

    app.innerHTML = `<section class="pantalla scroll">
      ${capProf("seguiment")}
      ${!llista.length ? `<p class="nota-buida">Encara no hi ha alumnes. Es creen a la pantalla d'entrada amb «Alumne nou».</p>` : `
      <div class="filtre">${llista.map(a => `<button class="sel ${a.id === filtreAl ? "on" : ""}" data-al="${a.id}">${avatar(a.nom)}${esc(a.nom)}</button>`).join("")}</div>
      <div class="resum">
        <div><span>Activitats fetes</span><b>${regs.length}</b></div>
        <div><span>Acabades</span><b>${acab.length}</b></div>
        <div><span>Encerts a la primera</span><b>${totP ? pct(totE, totP) + " %" : "—"}</b></div>
        <div><span>Temps total</span><b>${fmtTemps(temps)}</b></div>
        <div><span>Última vegada</span><b>${regs[0] ? fmtData(regs[0].data) : "—"}</b></div>
      </div>
      <div class="accions-form"><button class="btn-txt sel" data-csv="un">${ICO.baixa} Descarrega l'Excel d'aquest alumne</button>
        <button class="btn-txt sel" data-csv="tots">${ICO.baixa} Descarrega l'Excel de tots</button></div>
      <div class="dues-col">
        <section class="seccio"><h3>Per activitat</h3>
          ${Object.keys(perAct).length ? `<div class="taula-wrap"><table class="taula"><thead><tr><th>Codi</th><th>Activitat</th><th class="n">Vegades</th><th class="n">Últim</th><th class="n">Millor</th></tr></thead><tbody>
          ${Object.values(perAct).sort((a, b) => a.codi.localeCompare(b.codi)).map(x => `<tr><td><span class="codi">${x.codi}</span></td><td>${esc(x.titol)}</td><td class="n">${x.vegades}</td>
            <td class="n">${x.ultim === null ? "—" : barra(x.ultim)}</td><td class="n">${x.millor < 0 ? "—" : x.millor + " %"}</td></tr>`).join("")}
          </tbody></table></div><p class="nota">«Últim» i «Millor»: percentatge d'encerts a la primera en les activitats acabades.</p>` : `<p class="nota">Encara no ha fet cap activitat.</p>`}
        </section>
        <section class="seccio"><h3>Paraules amb més errors</h3>
          ${topErr.length ? `<div class="taula-wrap"><table class="taula"><thead><tr><th>Paraula</th><th class="n">Errors</th><th>Ha triat</th></tr></thead><tbody>
          ${topErr.map(([w, x]) => `<tr><td><span class="pw">${V[w] ? `<img src="${src(V[w].id)}" alt="">` : ""}${esc(w)}</span></td><td class="n">${x.n}</td>
            <td>${Object.entries(x.amb).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t, n]) => esc(t) + (n > 1 ? ` (${n})` : "")).join(", ")}</td></tr>`).join("")}
          </tbody></table></div>` : `<p class="nota">Cap error registrat.</p>`}
        </section>
      </div>
      <section class="seccio"><h3>Historial</h3>
        ${regs.length ? `<div class="taula-wrap"><table class="taula"><thead><tr><th>Data</th><th>Hora</th><th>Codi</th><th>Activitat</th><th class="n">Encerts a la 1a</th><th class="n">Errors</th><th class="n">Temps</th><th>Estat</th></tr></thead><tbody>
        ${regs.map(r => `<tr><td>${fmtData(r.data)}</td><td>${fmtHora(r.data)}</td><td><span class="codi">${r.codi}</span></td><td>${esc(r.titol)}</td>
          <td class="n">${r.tipus === "memory" ? "—" : `${r.encertsPrimera} de ${r.acabada ? r.preguntes : r.fetes}`}</td><td class="n">${r.errors}</td><td class="n">${fmtTemps(r.durada)}</td>
          <td>${r.acabada ? `<span class="xip ok">Acabada</span>` : `<span class="xip">Deixada (${r.fetes}/${r.preguntes})</span>`}</td></tr>`).join("")}
        </tbody></table></div>` : `<p class="nota">Encara no hi ha cap registre.</p>`}
      </section>`}
    </section>`;
    connectaProf();
    on("[data-al]", e => { filtreAl = e.currentTarget.dataset.al; pintaSeguiment(); });
    on("[data-csv]", e => baixaCSV(e.currentTarget.dataset.csv === "un" ? filtreAl : null));
  }
  const barra = p => `<span class="minibarra"><i style="width:${p}%"></i></span>${p} %`;

  function baixaCSV(id) {
    const regs = D.registres.filter(r => !id || r.alumne === id).sort((a, b) => a.data.localeCompare(b.data));
    const cols = ["Alumne", "Data", "Hora", "Codi", "Activitat", "Bloc", "Preguntes", "Fetes", "Encerts a la primera", "% encerts", "Errors", "Temps (s)", "Estat", "Errors (paraula > triada)"];
    const q = v => { const s = String(v ?? ""); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const files = regs.map(r => [nomAlumne(r.alumne), fmtData(r.data), fmtHora(r.data), r.codi, r.titol, (BLOCS.find(b => b.id === r.bloc) || {}).nom || r.bloc,
      r.preguntes, r.fetes, r.encertsPrimera, r.acabada ? pct(r.encertsPrimera, r.preguntes) : "", r.errors, r.durada, r.acabada ? "Acabada" : "Deixada",
      (r.fallades || []).map(f => `${f.o} > ${f.t}`).join(", ")].map(q).join(";"));
    const csv = "﻿" + [cols.join(";"), ...files].join("\r\n");
    const nom = id ? nomAlumne(id).replace(/[^\p{L}\p{N}]+/gu, "_") : "tots";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `seguiment_${nom}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function pintaGestio() {
    const llista = D.alumnes.slice().sort((a, b) => a.nom.localeCompare(b.nom, "ca"));
    app.innerHTML = `<section class="pantalla scroll">
      ${capProf("gestio-alumnes")}
      <section class="seccio"><h3>Alumnes (${llista.length})</h3>
        ${llista.length ? `<div class="taula-wrap"><table class="taula"><thead><tr><th>Nom</th><th>Creat</th><th class="n">Activitats</th><th></th></tr></thead><tbody>
        ${llista.map(a => `<tr data-fila="${a.id}"><td><span class="pw">${avatar(a.nom)}${esc(a.nom)}</span></td><td>${fmtData(a.creat)}</td>
          <td class="n">${D.registres.filter(r => r.alumne === a.id).length}</td>
          <td class="accions-fila"><button class="btn-txt sel" data-renom="${a.id}">Canvia el nom</button><button class="btn-txt sel ko" data-esb="${a.id}">${ICO.esborra} Esborra</button></td></tr>`).join("")}
        </tbody></table></div>` : `<p class="nota">Encara no hi ha alumnes. Es creen a la pantalla d'entrada amb «Alumne nou».</p>`}
        <div id="gestio-panell"></div>
      </section>
    </section>`;
    connectaProf();
    const panell = document.getElementById("gestio-panell");
    on("[data-renom]", e => {
      const al = D.alumnes.find(x => x.id === e.currentTarget.dataset.renom);
      panell.innerHTML = `<form class="form-nom" id="form-renom"><label for="renom">Nou nom per a ${esc(al.nom)}</label>
        <input id="renom" maxlength="30" value="${esc(al.nom)}"><p class="avis" id="avis-renom" role="alert" hidden></p>
        <div class="accions-form"><button type="submit" class="btn-txt prim sel">Desa</button><button type="button" class="btn-txt sel" data-cancel>Cancel·la</button></div></form>`;
      document.getElementById("renom").focus();
      on("[data-cancel]", () => { panell.innerHTML = ""; }, panell);
      document.getElementById("form-renom").addEventListener("submit", ev => {
        ev.preventDefault();
        const nom = document.getElementById("renom").value.trim().replace(/\s+/g, " "), avis = document.getElementById("avis-renom");
        if (!nom) { avis.textContent = "Escriu un nom."; avis.hidden = false; return; }
        if (D.alumnes.some(x => x !== al && norm(x.nom) === norm(nom))) { avis.textContent = `Ja hi ha un alumne que es diu «${nom}».`; avis.hidden = false; return; }
        al.nom = nom; desaD(); pintaGestio();
      });
    });
    on("[data-esb]", e => {
      const al = D.alumnes.find(x => x.id === e.currentTarget.dataset.esb);
      const n = D.registres.filter(r => r.alumne === al.id).length;
      panell.innerHTML = `<div class="confirma"><p>Segur que vols esborrar <b>${esc(al.nom)}</b> i els seus ${n} registres? No es pot desfer.</p>
        <div class="accions-form"><button class="btn-txt sel ko" data-si>${ICO.esborra} Sí, esborra</button><button class="btn-txt sel" data-no>No</button></div></div>`;
      on("[data-no]", () => { panell.innerHTML = ""; }, panell);
      on("[data-si]", () => { D.alumnes = D.alumnes.filter(x => x !== al); D.registres = D.registres.filter(r => r.alumne !== al.id);
        if (alumne && alumne.id === al.id) entra(null); desaD(); pintaGestio(); }, panell);
    });
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
  // el primer toc real (triar l'alumne) desbloqueja el so del navegador
  document.addEventListener("pointerdown", () => {
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); } catch (e) {}
  }, { once: true });
  if (!alumne && location.hash && !["#nou-alumne", "#seguiment", "#gestio-alumnes", "#configuracio"].includes(location.hash)) history.replaceState(null, "", "#entrar");
  // animació d'entrada: el pictograma del títol porta la clau Fitzgerald com la resta
  function fesIntro(fet) {
    const nom = "CONEIXEMENT DEL MEDI";
    const pic = `<div class="picto fz2 intro-picto"><div class="pin"><span class="ptx" style="--fs:${ajusta(nom, 80, 15).toFixed(2)}">${nom}</span><img src="pictos/32542.png" alt="" draggable="false"></div></div>`;
    window.Intro.play({ picto: pic, musica: C.musica }, fet);
  }
  ruta();
  if (C.intro) fesIntro(() => {});
  Veu.comprovaOna().then(ok => { if (ok) Veu.preescalfa([...LLOANCES, "Torna-ho a provar."]); });
})();
