/* ============================================================
   VOCABULARI · Coneixement de l'entorn natural
   Cada paraula: id ARASAAC, tipus Fitzgerald (ARASAAC), article,
   síl·labes i etiquetes (temes/grups) per generar activitats.
   Tipus: 1 persones (groc) · 2 noms (taronja) · 3 verbs (verd)
          4 descriptius (blau) · 5 social (rosa) · 6 miscel·lània (blanc)
   Per afegir una paraula: copia una línia i canvia-la.
   ============================================================ */
window.VOCAB = {
  /* ---------- L'HORT · fitxa 1 (original) ---------- */
  HORT:        { id: 37576, t: 2, art: "l'",  sil: "HORT", tags: ["hort", "fitxa1"] },
  ENCIAM:      { id: 2446,  t: 2, art: "l'",  sil: "EN-CIAM", tags: ["hort", "verdura", "fitxa1"] },
  CEBA:        { id: 2323,  t: 2, art: "la",  sil: "CE-BA", tags: ["hort", "verdura", "fitxa1"] },
  PLANTAR:     { id: 2828,  t: 3, art: "",    sil: "PLAN-TAR", tags: ["hort", "accio", "fitxa1"] },
  REGAR:       { id: 22082, t: 3, art: "",    sil: "RE-GAR", tags: ["hort", "accio", "fitxa1"] },
  BLEDA:       { id: 2981,  t: 2, art: "la",  sil: "BLE-DA", tags: ["hort", "verdura", "fitxa1"] },
  MADUIXA:     { id: 2400,  t: 2, art: "la",  sil: "MA-DUI-XA", tags: ["hort", "fruita", "primavera", "fitxa1"] },
  ALL:         { id: 2641,  t: 2, art: "l'",  sil: "ALL", tags: ["hort", "verdura", "fitxa1"] },
  FLOR:        { id: 7104,  t: 2, art: "la",  sil: "FLOR", tags: ["hort", "planta", "fitxa1"] },
  ESPINACS:    { id: 5460,  t: 2, art: "els", sil: "ES-PI-NACS", tags: ["hort", "verdura", "fitxa1"] },

  /* ---------- L'HORT · ampliació ---------- */
  PASTANAGA:   { id: 2619,  t: 2, art: "la",  sil: "PAS-TA-NA-GA", tags: ["hort", "verdura", "memory1"] },
  JULIVERT:    { id: 11334, t: 2, art: "el",  sil: "JU-LI-VERT", tags: ["hort", "verdura", "memory1"] },
  "TOMÀQUET":  { id: 2594,  t: 2, art: "el",  sil: "TO-MÀ-QUET", tags: ["hort", "verdura"] },
  PATATA:      { id: 2503,  t: 2, art: "la",  sil: "PA-TA-TA", tags: ["hort", "verdura"] },
  PEBROT:      { id: 2839,  t: 2, art: "el",  sil: "PE-BROT", tags: ["hort", "verdura"] },
  COGOMBRE:    { id: 2847,  t: 2, art: "el",  sil: "CO-GOM-BRE", tags: ["hort", "verdura"] },
  "ALBERGÍNIA":{ id: 2660,  t: 2, art: "l'",  sil: "AL-BER-GÍ-NI-A", tags: ["hort", "verdura"] },
  CARXOFA:     { id: 5370,  t: 2, art: "la",  sil: "CAR-XO-FA", tags: ["hort", "verdura"] },
  COL:         { id: 2708,  t: 2, art: "la",  sil: "COL", tags: ["hort", "verdura"] },
  COLIFLOR:    { id: 23953, t: 2, art: "la",  sil: "CO-LI-FLOR", tags: ["hort", "verdura"] },
  PORRO:       { id: 3378,  t: 2, art: "el",  sil: "POR-RO", tags: ["hort", "verdura"] },
  "PÈSOLS":    { id: 23847, t: 2, art: "els", sil: "PÈ-SOLS", tags: ["hort", "verdura"] },
  /* eines */
  REGADORA:    { id: 2817,  t: 2, art: "la",  sil: "RE-GA-DO-RA", tags: ["hort", "eina", "memory1"] },
  AIXADA:      { id: 2651,  t: 2, art: "l'",  sil: "AI-XA-DA", tags: ["hort", "eina"] },
  PALA:        { id: 2867,  t: 2, art: "la",  sil: "PA-LA", tags: ["hort", "eina"] },
  RASCLET:     { id: 6200,  t: 2, art: "el",  sil: "RAS-CLET", tags: ["hort", "eina"] },
  CISTELLA:    { id: 3012,  t: 2, art: "la",  sil: "CIS-TE-LLA", tags: ["hort", "eina"] },
  "CARRETÓ":   { id: 5947,  t: 2, art: "el",  sil: "CAR-RE-TÓ", tags: ["hort", "eina"] },
  /* accions */
  SEMBRAR:     { id: 7245,  t: 3, art: "",    sil: "SEM-BRAR", tags: ["hort", "accio"] },
  COLLIR:      { id: 9043,  t: 3, art: "",    sil: "CO-LLIR", tags: ["hort", "accio"] },
  CAVAR:       { id: 5952,  t: 3, art: "",    sil: "CA-VAR", tags: ["hort", "accio"] },
  /* altres */
  LLAVOR:      { id: 8689,  t: 2, art: "la",  sil: "LLA-VOR", tags: ["hort"] },
  PLANTA:      { id: 3143,  t: 2, art: "la",  sil: "PLAN-TA", tags: ["hort", "planta"] },
  ARREL:       { id: 3148,  t: 2, art: "l'",  sil: "AR-REL", tags: ["hort", "planta"] },
  TERRA:       { id: 3160,  t: 2, art: "la",  sil: "TER-RA", tags: ["hort"] },
  AIGUA:       { id: 6889,  t: 2, art: "l'",  sil: "AI-GUA", tags: ["hort", "memory1"] },
  SOL:         { id: 7252,  t: 2, art: "el",  sil: "SOL", tags: ["hort", "temps", "memory1"] },
  PLUJA:       { id: 3123,  t: 2, art: "la",  sil: "PLU-JA", tags: ["hort", "temps", "memory1"] },
  CUC:         { id: 2935,  t: 2, art: "el",  sil: "CUC", tags: ["hort", "animal"] },
  ESPANTAOCELLS:{ id: 8571, t: 2, art: "l'",  sil: "ES-PAN-TA-O-CELLS", tags: ["hort"] },
  "PAGÈS":     { id: 2982,  t: 2, art: "el",  sil: "PA-GÈS", tags: ["hort"] },
  ARBRE:       { id: 2256,  t: 2, art: "l'",  sil: "AR-BRE", tags: ["natura", "memory1"] },
  "JARDÍ":     { id: 2434,  t: 2, art: "el",  sil: "JAR-DÍ", tags: ["natura", "memory1"] },
  PARC:        { id: 2859,  t: 2, art: "el",  sil: "PARC", tags: ["natura", "memory1"] },
  CARRER:      { id: 2299,  t: 2, art: "el",  sil: "CAR-RER", tags: ["natura", "memory1"] },

  /* ---------- FRUITES ---------- */
  POMA:        { id: 2462,  t: 2, art: "la",  sil: "PO-MA", tags: ["fruita"] },
  PERA:        { id: 2561,  t: 2, art: "la",  sil: "PE-RA", tags: ["fruita"] },
  TARONJA:     { id: 2483,  t: 2, art: "la",  sil: "TA-RON-JA", tags: ["fruita", "hivern"] },
  MANDARINA:   { id: 11298, t: 2, art: "la",  sil: "MAN-DA-RI-NA", tags: ["fruita", "hivern"] },
  LLIMONA:     { id: 3022,  t: 2, art: "la",  sil: "LLI-MO-NA", tags: ["fruita"] },
  "SÍNDRIA":   { id: 2557,  t: 2, art: "la",  sil: "SÍN-DRI-A", tags: ["fruita", "estiu"] },
  "MELÓ":      { id: 2469,  t: 2, art: "el",  sil: "ME-LÓ", tags: ["fruita", "estiu"] },
  "PRÉSSEC":   { id: 2468,  t: 2, art: "el",  sil: "PRÉS-SEC", tags: ["fruita", "estiu"] },
  CIRERES:     { id: 2329,  t: 2, art: "les", sil: "CI-RE-RES", tags: ["fruita", "primavera"] },
  "RAÏM":      { id: 3247,  t: 2, art: "el",  sil: "RA-ÏM", tags: ["fruita", "tardor"] },
  MAGRANA:     { id: 8594,  t: 2, art: "la",  sil: "MA-GRA-NA", tags: ["fruita", "tardor"] },

  /* ---------- LES 4 ESTACIONS ---------- */
  HIVERN:      { id: 5493,  t: 2, art: "l'",  sil: "HI-VERN", tags: ["estacio"] },
  ESTIU:       { id: 5604,  t: 2, art: "l'",  sil: "ES-TIU", tags: ["estacio"] },
  TARDOR:      { id: 5531,  t: 2, art: "la",  sil: "TAR-DOR", tags: ["estacio"] },
  PRIMAVERA:   { id: 5553,  t: 2, art: "la",  sil: "PRI-MA-VE-RA", tags: ["estacio"] },

  /* hivern · fitxa (original) */
  "NINOT DE NEU": { id: 3131, t: 2, art: "el", tags: ["hivern", "fitxa-hivern"] },
  FRED:        { id: 35557, t: 4, art: "",    sil: "FRED", tags: ["hivern", "fitxa-hivern"] },
  GUANTS:      { id: 7123,  t: 2, art: "els", sil: "GUANTS", tags: ["hivern", "roba-fred", "fitxa-hivern"] },
  NEVAT:       { id: 2884,  t: 4, art: "",    sil: "NE-VAT", tags: ["hivern", "temps", "fitxa-hivern"] },
  /* hivern · ampliació */
  BUFANDA:     { id: 2290,  t: 2, art: "la",  sil: "BU-FAN-DA", tags: ["hivern", "roba-fred"] },
  ABRIC:       { id: 2242,  t: 2, art: "l'",  sil: "A-BRIC", tags: ["hivern", "roba-fred"] },
  GORRO:       { id: 2412,  t: 2, art: "el",  sil: "GOR-RO", tags: ["hivern", "roba-fred"] },
  BOTES:       { id: 2287,  t: 2, art: "les", sil: "BO-TES", tags: ["hivern", "roba-fred"] },
  NEU:         { id: 3135,  t: 2, art: "la",  sil: "NEU", tags: ["hivern"] },
  NEVAR:       { id: 7172,  t: 3, art: "",    sil: "NE-VAR", tags: ["hivern", "temps"] },
  ESQUIAR:     { id: 16701, t: 3, art: "",    sil: "ES-QUI-AR", tags: ["hivern"] },
  "ARBRE D'HIVERN": { id: 5062, t: 2, art: "l'", tags: ["hivern"] },

  /* estiu · fitxa (original) */
  BANYADOR:    { id: 2601,  t: 2, art: "el",  sil: "BA-NYA-DOR", tags: ["estiu", "roba-calor", "fitxa-estiu"] },
  CALOR:       { id: 35561, t: 2, art: "la",  sil: "CA-LOR", tags: ["estiu", "fitxa-estiu"] },
  GELAT:       { id: 35209, t: 2, art: "el",  sil: "GE-LAT", tags: ["estiu", "fitxa-estiu"] },
  PLATJA:      { id: 2826,  t: 2, art: "la",  sil: "PLAT-JA", tags: ["estiu", "fitxa-estiu"] },
  /* estiu · ampliació */
  "ULLERES DE SOL": { id: 3330, t: 2, art: "les", tags: ["estiu", "roba-calor"] },
  GORRA:       { id: 2411,  t: 2, art: "la",  sil: "GOR-RA", tags: ["estiu", "roba-calor"] },
  "CREMA SOLAR": { id: 21568, t: 2, art: "la", tags: ["estiu"] },
  PISCINA:     { id: 3142,  t: 2, art: "la",  sil: "PIS-CI-NA", tags: ["estiu"] },
  VENTALL:     { id: 6871,  t: 2, art: "el",  sil: "VEN-TALL", tags: ["estiu"] },
  ASSOLELLAT:  { id: 2796,  t: 4, art: "",    sil: "AS-SO-LE-LLAT", tags: ["estiu", "temps"] },

  /* tardor · fitxa (original) */
  "FULLA SECA":{ id: 5076,  t: 2, art: "la",  tags: ["tardor", "fitxa-tardor"] },
  "ARBRE DE TARDOR": { id: 5063, t: 2, art: "l'", tags: ["tardor", "fitxa-tardor"] },
  CASTANYES:   { id: 3183,  t: 2, art: "les", sil: "CAS-TA-NYES", tags: ["tardor", "fitxa-tardor", "memory1"] },
  "VENTÓS":    { id: 2779,  t: 4, art: "",    sil: "VEN-TÓS", tags: ["tardor", "temps", "fitxa-tardor"] },
  /* tardor · ampliació */
  BOLET:       { id: 8328,  t: 2, art: "el",  sil: "BO-LET", tags: ["tardor"] },
  PARAIGUA:    { id: 2500,  t: 2, art: "el",  sil: "PA-RA-I-GUA", tags: ["tardor"] },
  PANELLETS:   { id: 12299, t: 2, art: "els", sil: "PA-NE-LLETS", tags: ["tardor"] },
  ESQUIROL:    { id: 25815, t: 2, art: "l'",  sil: "ES-QUI-ROL", tags: ["tardor", "animal"] },
  CARBASSA:    { id: 6951,  t: 2, art: "la",  sil: "CAR-BAS-SA", tags: ["tardor"] },
  VENT:        { id: 7259,  t: 2, art: "el",  sil: "VENT", tags: ["tardor", "temps"] },

  /* primavera · fitxa (original) */
  PAPALLONA:   { id: 26200, t: 2, art: "la",  sil: "PA-PA-LLO-NA", tags: ["primavera", "animal", "fitxa-primavera"] },
  "ARBRE DE PRIMAVERA": { id: 24537, t: 2, art: "l'", tags: ["primavera", "fitxa-primavera"] },
  FLORS:       { id: 7105,  t: 2, art: "les", sil: "FLORS", tags: ["primavera", "fitxa-primavera"] },
  "PLUJÓS":    { id: 2936,  t: 4, art: "",    sil: "PLU-JÓS", tags: ["primavera", "temps", "fitxa-primavera"] },
  /* primavera · ampliació */
  ABELLA:      { id: 24823, t: 2, art: "l'",  sil: "A-BE-LLA", tags: ["primavera", "animal"] },
  MARIETA:     { id: 2924,  t: 2, art: "la",  sil: "MA-RI-E-TA", tags: ["primavera", "animal"] },
  ORENETA:     { id: 3336,  t: 2, art: "l'",  sil: "O-RE-NE-TA", tags: ["primavera", "animal"] },
  NIU:         { id: 7173,  t: 2, art: "el",  sil: "NIU", tags: ["primavera"] },
  "ARC DE SANT MARTÍ": { id: 2986, t: 2, art: "l'", tags: ["primavera", "temps"] },

  /* ---------- CATEGORIES ---------- */
  FRUITA:      { id: 28339, t: 2, art: "la",  sil: "FRUI-TA", tags: ["categoria"] },
  VERDURA:     { id: 28343, t: 2, art: "la",  sil: "VER-DU-RA", tags: ["categoria"] },
  EINES:       { id: 7127,  t: 2, art: "les", sil: "EI-NES", tags: ["categoria"] },

  /* ---------- RESPOSTES ---------- */
  "SÍ":        { id: 5584,  t: 4, art: "",    tags: ["resposta"] },
  NO:          { id: 5526,  t: 4, art: "",    tags: ["resposta"] }
};

/* Icones dels blocs (pictogrames ARASAAC) */
window.ICONES = { llegir: 7141, escriure: 2380, natura: 20389, jugar: 2439, escoltar: 2381, endevinalla: 24829 };
