# Coneixement de l'entorn natural

Activitats digitals amb pictogrames ARASAAC per a l'aula de grans (CEE, 14–21 anys).
Accés tàctil i amb la mirada (Tobii + TD Control).

## Com publicar-ho a GitHub Pages

1. Crea un repositori nou a GitHub (per exemple `entorn-natural`).
2. Puja-hi **tot el contingut** d'aquesta carpeta (`index.html`, `css/`, `js/`, `pictos/`).
3. Ves a **Settings → Pages**, a «Branch» tria `main` i la carpeta `/ (root)` i desa.
4. Al cap d'un minut l'app és a `https://<el-teu-usuari>.github.io/entorn-natural/`.

## Estructura

| Fitxer | Què hi ha |
|---|---|
| `index.html` | Pàgina principal |
| `css/estil.css` | Estils (clau Fitzgerald, mides, punt de mirada) |
| `js/vocabulari.js` | **Vocabulari**: paraula → pictograma ARASAAC, tipus Fitzgerald, article, síl·labes, temes |
| `js/activitats.js` | **Activitats**: codi, bloc, títol, tipus, tema, nivell, origen |
| `js/app.js` | Motor de l'app (no cal tocar-lo per afegir activitats) |
| `js/vendor/` | Biblioteca de la veu Ona (Piper, llicència MIT) |
| `pictos/` | Pictogrames ARASAAC descarregats (funcionen sense internet) |

## Codis de les activitats

`BLOC-NÚMERO`: **LE** lectura i escriptura · **CO** continguts · **JO** jocs educatius · **ES** escolta i comprensió.
Cada activitat indica si ve d'una **fitxa original** (PDF en paper) o és una **ampliació**.

## Tipus d'activitat disponibles

`associa` (picto → paraula) · `llegeix` (paraula → picto) · `inicial` · `lletra` · `sillabes` · `omple` (graella) ·
`classifica` · `relaciona` · `memory` · `intrus` · `escolta` · `sino` · `endevinalla`

## Alumnes i seguiment

- En obrir l'app surt «Qui ets?»: es tria el nom de l'alumne o es crea amb «Alumne nou» (no deixa repetir noms).
- La mirada comença sempre **desactivada**; s'activa amb el botó «Mirada» de la pantalla d'entrada.
- Cada activitat que es fa (acabada o deixada a mitges) es registra: data, encerts a la primera, errors, temps i quines paraules ha fallat.
- **Zona del professional** (roda dentada, protegida amb PIN de 4 xifres): seguiment per alumne, historial,
  paraules amb més errors, descàrrega en Excel (CSV), gestió d'alumnes i configuració.
- Les dades es guarden **només en el navegador de l'ordinador** on es fan servir.

## Veu

- **Veu del sistema**: fa servir les veus instal·lades a l'ordinador (busca'n una de catalana).
- **Ona**: a *Configuració → Veu* hi ha el botó «Descarrega la veu Ona». Es baixa una vegada (63 MB o 20 MB)
  i queda guardada al navegador. Cal obrir l'app des de l'adreça de GitHub Pages (no amb doble clic a l'arxiu).

## Mirada

*Configuració → Accés amb la mirada*: temps de fixació de 0,5 a 2 s, mida del punt, i qui fa el clic
(l'app en acabar el cercle, o TD Control).

## Crèdits

Pictogrames: Sergio Palao. Origen: ARASAAC (https://arasaac.org). Llicència: CC BY-NC-SA. Propietari: Govern d'Aragó.
Veu Ona: projecte FestCat (UPC), model Piper.
