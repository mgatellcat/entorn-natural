/* ============================================================
   ACTIVITATS · Coneixement de l'entorn natural
   ------------------------------------------------------------
   Cada activitat:
     codi     LE-01 (bloc + número)
     bloc     le | co | jo | es
     titol    nom visible
     tipus    associa | llegeix | lletra | inicial | sillabes | omple |
              classifica | relaciona | memory | intrus | escolta |
              sino | endevinalla
     tema     hort | estacions | ...
     nivell   1 (fàcil) · 2 (mitjà) · 3 (difícil)
     origen   "fitxa" (digitalització d'una fitxa en paper) o "ampliacio"
     font     nom del PDF original (si n'hi ha)
     paraules llista de paraules del VOCABULARI   o bé
     tags     etiquetes del vocabulari per triar paraules
   Per afegir una activitat nova: copia un bloc i canvia'l.
   ============================================================ */

window.BLOCS = [
  { id: "le", nom: "Lectura i escriptura", icones: ["llegir", "escriure"], color: "le",
    desc: "Llegir paraules, posar noms, lletres i síl·labes" },
  { id: "co", nom: "Continguts", icones: ["natura"], color: "co",
    desc: "L'hort, les estacions, classificar i relacionar" },
  { id: "jo", nom: "Jocs educatius", icones: ["jugar"], color: "jo",
    desc: "Memory, troba l'intrús i parelles" },
  { id: "es", nom: "Escolta i comprensió", icones: ["escoltar"], color: "es",
    desc: "Escoltar, respondre sí o no i endevinalles" }
];

window.TIPUS = {
  associa: "Picto → paraula",
  llegeix: "Paraula → picto",
  lletra: "Lletra que falta",
  inicial: "Primera lletra",
  sillabes: "Ordena síl·labes",
  omple: "Omple la graella",
  classifica: "Classifica",
  relaciona: "Relaciona",
  memory: "Memory",
  intrus: "Troba l'intrús",
  escolta: "Escolta i tria",
  sino: "Sí o no",
  endevinalla: "Endevinalla"
};

const HORT_AMPLI = ["HORT", "ENCIAM", "CEBA", "BLEDA", "MADUIXA", "ALL", "FLOR", "ESPINACS",
  "PASTANAGA", "JULIVERT", "TOMÀQUET", "PATATA", "PEBROT", "COGOMBRE", "ALBERGÍNIA", "CARXOFA",
  "COL", "COLIFLOR", "PORRO", "REGADORA", "AIXADA", "PALA", "RASCLET", "CISTELLA", "CARRETÓ",
  "LLAVOR", "PLANTA", "TERRA", "AIGUA", "PLANTAR", "REGAR", "SEMBRAR", "COLLIR", "CAVAR"];

const ESTACIONS_AMPLI = ["HIVERN", "ESTIU", "TARDOR", "PRIMAVERA", "GUANTS", "BUFANDA", "ABRIC",
  "GORRO", "BOTES", "NEU", "NEVAR", "ESQUIAR", "BANYADOR", "GELAT", "PLATJA", "GORRA", "PISCINA",
  "VENTALL", "CASTANYES", "BOLET", "PARAIGUA", "PANELLETS", "ESQUIROL", "CARBASSA", "PAPALLONA",
  "FLORS", "ABELLA", "MARIETA", "ORENETA", "CIRERES", "SÍNDRIA", "TARONJA", "MAGRANA", "RAÏM"];

const COLORS_ESTACIO = { HIVERN: "#1f3fd1", ESTIU: "#d81b1b", TARDOR: "#8a3a0c", PRIMAVERA: "#1b7a1b" };

window.ACTIVITATS = [
  /* ================= LECTURA I ESCRIPTURA ================= */
  { codi: "LE-01", mini: ["HORT", "ENCIAM"], bloc: "le", titol: "L'hort: posa el nom", tipus: "associa", tema: "hort", nivell: 1,
    origen: "fitxa", font: "FITXA_1.pdf", tags: ["fitxa1"], opcions: 3,
    enunciat: "Mira el pictograma. Tria la paraula correcta." },
  { codi: "LE-02", mini: ["PASTANAGA", "REGADORA"], bloc: "le", titol: "L'hort: llegeix i tria", tipus: "llegeix", tema: "hort", nivell: 1,
    origen: "ampliacio", paraules: HORT_AMPLI, opcions: 3,
    enunciat: "Llegeix la paraula. Tria el pictograma." },
  { codi: "LE-03", mini: ["TOMÀQUET", "PATATA"], bloc: "le", titol: "L'hort: primera lletra", tipus: "inicial", tema: "hort", nivell: 1,
    origen: "ampliacio", paraules: HORT_AMPLI, opcions: 3,
    enunciat: "Per quina lletra comença?" },
  { codi: "LE-04", mini: ["CEBA", "ALL"], bloc: "le", titol: "L'hort: quina lletra falta?", tipus: "lletra", tema: "hort", nivell: 2,
    origen: "ampliacio", paraules: HORT_AMPLI, opcions: 3,
    enunciat: "Quina lletra falta?" },
  { codi: "LE-05", mini: ["PLANTA", "LLAVOR"], bloc: "le", titol: "L'hort: ordena les síl·labes", tipus: "sillabes", tema: "hort", nivell: 2,
    origen: "ampliacio", paraules: HORT_AMPLI,
    enunciat: "Ordena les síl·labes i escriu la paraula." },
  { codi: "LE-06", mini: ["BUFANDA", "GELAT"], bloc: "le", titol: "Les estacions: posa el nom", tipus: "associa", tema: "estacions", nivell: 1,
    origen: "ampliacio", paraules: ESTACIONS_AMPLI, opcions: 3,
    enunciat: "Mira el pictograma. Tria la paraula correcta." },
  { codi: "LE-07", mini: ["PAPALLONA", "BOLET"], bloc: "le", titol: "Les estacions: quina lletra falta?", tipus: "lletra", tema: "estacions", nivell: 2,
    origen: "ampliacio", paraules: ESTACIONS_AMPLI, opcions: 3,
    enunciat: "Quina lletra falta?" },
  { codi: "LE-08", mini: ["PARAIGUA", "ABELLA"], bloc: "le", titol: "Les estacions: ordena les síl·labes", tipus: "sillabes", tema: "estacions", nivell: 2,
    origen: "ampliacio", paraules: ESTACIONS_AMPLI,
    enunciat: "Ordena les síl·labes i escriu la paraula." },

  /* ================= CONTINGUTS ================= */
  { codi: "CO-01", bloc: "co", titol: "L'hivern", tipus: "omple", tema: "estacions", nivell: 1,
    origen: "fitxa", font: "les_4_estacions.pdf",
    graelles: [{ nom: "HIVERN", color: COLORS_ESTACIO.HIVERN, bons: "fitxa-hivern",
                 dolents: ["fitxa-estiu", "fitxa-tardor", "fitxa-primavera"] }] },
  { codi: "CO-02", bloc: "co", titol: "L'estiu", tipus: "omple", tema: "estacions", nivell: 1,
    origen: "fitxa", font: "les_4_estacions.pdf",
    graelles: [{ nom: "ESTIU", color: COLORS_ESTACIO.ESTIU, bons: "fitxa-estiu",
                 dolents: ["fitxa-hivern", "fitxa-tardor", "fitxa-primavera"] }] },
  { codi: "CO-03", bloc: "co", titol: "La tardor", tipus: "omple", tema: "estacions", nivell: 1,
    origen: "fitxa", font: "les_4_estacions.pdf",
    graelles: [{ nom: "TARDOR", color: COLORS_ESTACIO.TARDOR, bons: "fitxa-tardor",
                 dolents: ["fitxa-hivern", "fitxa-estiu", "fitxa-primavera"] }] },
  { codi: "CO-04", bloc: "co", titol: "La primavera", tipus: "omple", tema: "estacions", nivell: 1,
    origen: "fitxa", font: "les_4_estacions.pdf",
    graelles: [{ nom: "PRIMAVERA", color: COLORS_ESTACIO.PRIMAVERA, bons: "fitxa-primavera",
                 dolents: ["fitxa-hivern", "fitxa-estiu", "fitxa-tardor"] }] },
  { codi: "CO-05", bloc: "co", titol: "Les 4 estacions: més coses", tipus: "omple", tema: "estacions", nivell: 2,
    origen: "ampliacio", nouVocab: true,
    graelles: ["HIVERN", "ESTIU", "TARDOR", "PRIMAVERA"].map(e => ({
      nom: e, color: COLORS_ESTACIO[e], bons: e.toLowerCase(),
      dolents: ["hivern", "estiu", "tardor", "primavera"].filter(x => x !== e.toLowerCase()) })) },
  { codi: "CO-06", bloc: "co", titol: "De quina estació és?", tipus: "classifica", tema: "estacions", nivell: 2,
    origen: "ampliacio",
    categories: [
      { paraula: "HIVERN", tag: "hivern", color: COLORS_ESTACIO.HIVERN },
      { paraula: "PRIMAVERA", tag: "primavera", color: COLORS_ESTACIO.PRIMAVERA },
      { paraula: "ESTIU", tag: "estiu", color: COLORS_ESTACIO.ESTIU },
      { paraula: "TARDOR", tag: "tardor", color: COLORS_ESTACIO.TARDOR }],
    pregunta: "De quina estació és?" },
  { codi: "CO-07", bloc: "co", titol: "Roba per al fred o per a la calor", tipus: "classifica", tema: "estacions", nivell: 1,
    origen: "ampliacio",
    categories: [
      { paraula: "FRED", tag: "roba-fred", color: COLORS_ESTACIO.HIVERN },
      { paraula: "CALOR", tag: "roba-calor", color: COLORS_ESTACIO.ESTIU }],
    pregunta: "Ho portem quan fa fred o quan fa calor?" },
  { codi: "CO-08", bloc: "co", titol: "Fruita o verdura?", tipus: "classifica", tema: "hort", nivell: 1,
    origen: "ampliacio",
    categories: [
      { paraula: "FRUITA", tag: "fruita", color: "#c2410c" },
      { paraula: "VERDURA", tag: "verdura", color: "#15803d" }],
    pregunta: "És una fruita o una verdura?" },
  { codi: "CO-09", bloc: "co", titol: "Què fem a l'hort?", tipus: "relaciona", tema: "hort", nivell: 2,
    origen: "ampliacio", opcionsTag: "accio", opcions: 3,
    parelles: [
      { p: "REGADORA", r: "REGAR" }, { p: "LLAVOR", r: "SEMBRAR" }, { p: "AIXADA", r: "CAVAR" },
      { p: "CISTELLA", r: "COLLIR" }, { p: "PLANTA", r: "PLANTAR" }, { p: "PALA", r: "CAVAR" },
      { p: "AIGUA", r: "REGAR" }, { p: "MADUIXA", r: "COLLIR" }],
    pregunta: "Què fas amb {art} {p}?" },
  { codi: "CO-10", bloc: "co", titol: "Quin temps fa?", tipus: "relaciona", tema: "estacions", nivell: 2,
    origen: "ampliacio", opcions: 4, opcionsLlista: ["NEVAT", "ASSOLELLAT", "VENTÓS", "PLUJÓS"],
    parelles: [
      { p: "HIVERN", r: "NEVAT" }, { p: "ESTIU", r: "ASSOLELLAT" },
      { p: "TARDOR", r: "VENTÓS" }, { p: "PRIMAVERA", r: "PLUJÓS" }],
    pregunta: "Quin temps fa sovint {a} {p}?" },

  /* ================= JOCS EDUCATIUS ================= */
  { codi: "JO-01", mini: ["MADUIXA", "REGADORA"], bloc: "jo", titol: "Memory de l'hort", tipus: "memory", tema: "hort", nivell: 1,
    origen: "fitxa", font: "memory ARActivities", tags: ["memory1"], parelles: 6,
    enunciat: "Troba les parelles iguals." },
  { codi: "JO-02", mini: ["NINOT DE NEU", "PLATJA"], bloc: "jo", titol: "Memory de les estacions", tipus: "memory", tema: "estacions", nivell: 1,
    origen: "ampliacio", tags: ["fitxa-hivern", "fitxa-estiu", "fitxa-tardor", "fitxa-primavera"], parelles: 6,
    enunciat: "Troba les parelles iguals." },
  { codi: "JO-03", mini: ["FLOR", "BLEDA"], bloc: "jo", titol: "Memory: picto i paraula", tipus: "memory", tema: "hort", nivell: 2,
    origen: "ampliacio", tags: ["fitxa1"], parelles: 6, modeParaula: true,
    enunciat: "Troba cada pictograma amb la seva paraula." },
  { codi: "JO-04", mini: ["PEBROT", "AIXADA"], bloc: "jo", titol: "Troba l'intrús: l'hort", tipus: "intrus", tema: "hort", nivell: 1,
    origen: "ampliacio",
    grups: [
      { tag: "verdura", frase: "Quin no és una verdura?" },
      { tag: "fruita", frase: "Quin no és una fruita?" },
      { tag: "eina", frase: "Quin no és una eina de l'hort?" },
      { tag: "accio", frase: "Quin no és una acció?" }] },
  { codi: "JO-05", mini: ["CASTANYES", "ORENETA"], bloc: "jo", titol: "Troba l'intrús: les estacions", tipus: "intrus", tema: "estacions", nivell: 2,
    origen: "ampliacio",
    grups: [
      { tag: "hivern", frase: "Quin no és de l'hivern?" },
      { tag: "estiu", frase: "Quin no és de l'estiu?" },
      { tag: "tardor", frase: "Quin no és de la tardor?" },
      { tag: "primavera", frase: "Quin no és de la primavera?" }],
    excloure: ["estacio"] },
  { codi: "JO-06", mini: ["GUANTS", "GORRA"], bloc: "jo", titol: "Troba l'intrús: la roba", tipus: "intrus", tema: "estacions", nivell: 1,
    origen: "ampliacio",
    grups: [
      { tag: "roba-fred", frase: "Quin no és roba per al fred?" },
      { tag: "roba-calor", frase: "Quin no és per a la calor?" }] },

  /* ================= ESCOLTA I COMPRENSIÓ ================= */
  { codi: "ES-01", mini: ["COGOMBRE", "CARXOFA"], bloc: "es", titol: "Escolta i tria: l'hort", tipus: "escolta", tema: "hort", nivell: 1,
    origen: "ampliacio", paraules: HORT_AMPLI, opcions: 4 },
  { codi: "ES-02", mini: ["ESQUIROL", "PISCINA"], bloc: "es", titol: "Escolta i tria: les estacions", tipus: "escolta", tema: "estacions", nivell: 1,
    origen: "ampliacio", paraules: ESTACIONS_AMPLI, opcions: 4 },
  { codi: "ES-03", bloc: "es", titol: "Sí o no? Les estacions", tipus: "sino", tema: "estacions", nivell: 1,
    origen: "ampliacio",
    preguntes: [
      { q: "A l'hivern fa fred?", p: ["HIVERN", "FRED"], r: true },
      { q: "A l'estiu anem a la platja?", p: ["ESTIU", "PLATJA"], r: true },
      { q: "A l'hivern ens posem el banyador?", p: ["HIVERN", "BANYADOR"], r: false },
      { q: "A la tardor cauen les fulles?", p: ["TARDOR", "FULLA SECA"], r: true },
      { q: "A la primavera surten les flors?", p: ["PRIMAVERA", "FLORS"], r: true },
      { q: "A l'estiu fem un ninot de neu?", p: ["ESTIU", "NINOT DE NEU"], r: false },
      { q: "A la tardor mengem castanyes?", p: ["TARDOR", "CASTANYES"], r: true },
      { q: "A l'estiu ens posem la bufanda?", p: ["ESTIU", "BUFANDA"], r: false },
      { q: "A la primavera veiem papallones?", p: ["PRIMAVERA", "PAPALLONA"], r: true },
      { q: "A l'hivern fa molta calor?", p: ["HIVERN", "CALOR"], r: false },
      { q: "A l'estiu mengem gelats?", p: ["ESTIU", "GELAT"], r: true },
      { q: "A la primavera mengem panellets?", p: ["PRIMAVERA", "PANELLETS"], r: false },
      { q: "Quan plou, obrim el paraigua?", p: ["PLUJA", "PARAIGUA"], r: true },
      { q: "A l'estiu ens posem els guants?", p: ["ESTIU", "GUANTS"], r: false }] },
  { codi: "ES-04", bloc: "es", titol: "Sí o no? L'hort", tipus: "sino", tema: "hort", nivell: 1,
    origen: "ampliacio",
    preguntes: [
      { q: "La pastanaga és una verdura?", p: ["PASTANAGA", "VERDURA"], r: true },
      { q: "La maduixa és una fruita?", p: ["MADUIXA", "FRUITA"], r: true },
      { q: "Amb la regadora reguem les plantes?", p: ["REGADORA", "REGAR"], r: true },
      { q: "Amb la cistella cavem la terra?", p: ["CISTELLA", "CAVAR"], r: false },
      { q: "L'enciam és una eina?", p: ["ENCIAM", "EINES"], r: false },
      { q: "Les plantes necessiten aigua?", p: ["PLANTA", "AIGUA"], r: true },
      { q: "La ceba creix a dins de la terra?", p: ["CEBA", "TERRA"], r: true },
      { q: "El tomàquet és una eina?", p: ["TOMÀQUET", "EINES"], r: false },
      { q: "Sembrem les llavors a la terra?", p: ["LLAVOR", "SEMBRAR"], r: true },
      { q: "L'all és una fruita?", p: ["ALL", "FRUITA"], r: false },
      { q: "Amb l'aixada cavem la terra?", p: ["AIXADA", "CAVAR"], r: true },
      { q: "Les flors necessiten sol?", p: ["FLOR", "SOL"], r: true }] },
  { codi: "ES-05", bloc: "es", titol: "Endevinalles de la natura", tipus: "endevinalla", tema: "hort i estacions", nivell: 2,
    origen: "ampliacio",
    endevinalles: [
      { q: "Soc vermella i petita, i tinc puntets per fora. Qui soc?", r: "MADUIXA", o: ["MADUIXA", "TOMÀQUET", "CEBA"] },
      { q: "Soc taronja i allargada, i als conills els agrado molt. Qui soc?", r: "PASTANAGA", o: ["PASTANAGA", "ENCIAM", "PATATA"] },
      { q: "Tinc moltes capes i, quan em talles, et faig plorar. Qui soc?", r: "CEBA", o: ["CEBA", "MADUIXA", "PEBROT"] },
      { q: "Soc blanca i freda, i a l'hivern cobreixo les muntanyes. Qui soc?", r: "NEU", o: ["NEU", "PLATJA", "FLORS"] },
      { q: "Em fas amb neu, i tinc un barret i una bufanda. Qui soc?", r: "NINOT DE NEU", o: ["NINOT DE NEU", "ESPANTAOCELLS", "PAGÈS"] },
      { q: "Em poses al coll quan fa fred. Qui soc?", r: "BUFANDA", o: ["BUFANDA", "BANYADOR", "GORRA"] },
      { q: "M'obres quan plou per no mullar-te. Qui soc?", r: "PARAIGUA", o: ["PARAIGUA", "VENTALL", "CISTELLA"] },
      { q: "Soc dolç i fred, i em menges a l'estiu. Qui soc?", r: "GELAT", o: ["GELAT", "CASTANYES", "CEBA"] },
      { q: "Tinc ales de colors i volo de flor en flor. Qui soc?", r: "PAPALLONA", o: ["PAPALLONA", "ESQUIROL", "CUC"] },
      { q: "Faig mel i volo per les flors. Qui soc?", r: "ABELLA", o: ["ABELLA", "MARIETA", "ORENETA"] },
      { q: "Em menges torrada a la tardor, per la castanyada. Qui soc?", r: "CASTANYES", o: ["CASTANYES", "SÍNDRIA", "MADUIXA"] },
      { q: "Soc verda per fora, vermella per dins i tinc pinyols negres. Qui soc?", r: "SÍNDRIA", o: ["SÍNDRIA", "TARONJA", "PERA"] },
      { q: "Amb mi portes aigua per regar les plantes. Qui soc?", r: "REGADORA", o: ["REGADORA", "PALA", "CARRETÓ"] },
      { q: "Soc vermell i rodó, i em poses a l'amanida. Qui soc?", r: "TOMÀQUET", o: ["TOMÀQUET", "PATATA", "CARXOFA"] },
      { q: "Em poses a la pell a la platja per no cremar-te amb el sol. Qui soc?", r: "CREMA SOLAR", o: ["CREMA SOLAR", "GUANTS", "PARAIGUA"] },
      { q: "Surto al cel quan plou i fa sol, i tinc molts colors. Qui soc?", r: "ARC DE SANT MARTÍ", o: ["ARC DE SANT MARTÍ", "NEU", "VENT"] }] }
];
