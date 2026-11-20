# Regler for kodeassistenter

- Svar på dansk som udgangspunkt.
- Brug React med JavaScript/JSX og Vite.
- Definér routes direkte i `src/App.jsx`; importér fra `react-router`.
- `BrowserRouter` ligger i `src/main.jsx`, og global CSS i `src/globals.css`.
- Brug `src/pages/`, `src/components/`, `src/services/`, `src/lib/` og `src/assets/` efter behov.
- Bevar den tomme template; tilføj kun indhold, som teamet beder om.
- Introducér ikke nye libraries eller backend uden godkendelse.
- Gem aldrig hemmeligheder i frontend eller Git.
- Kør `npm run build` efter kodeændringer, og oplys resultatet.
- Fortæl hvilke filer, der ændres, og hvorfor.

## CSS og responsivt design

- Brug CSS Modules til styling af sider og komponenter.
- Navngiv CSS Modules som `ComponentName.module.css`.
- Importér CSS Modules med `import styles from "./ComponentName.module.css"`.
- Brug `className={styles.className}` i JSX.
- Brug `src/globals.css` til globale basisregler og Default-temaets CSS-variabler. Undtagelsen er temavariabler i `src/themes/*.css`.
- Brug almindelig CSS uden nye styling-biblioteker.

## Appens størrelse og layout

- Appen udvikles med mobile-first som udgangspunkt.
- På computerskærme vises appen centreret.
- Brug iPhone 17 som reference med 402px bredde og 874px højde.
- På skærme med en bredde på 1024px eller mindre skal appen fylde hele den tilgængelige skærm.
- Brug responsive CSS-regler, så layoutet tilpasser sig forskellige skærmstørrelser.
- Brug `100dvh` til appens højde på mobile enheder.
- Bundnavigationen skal være placeret nederst inde i appens layout.
- Undgå vandret scrolling.

## Temaer

- Default-temaets variabler ligger i `src/globals.css`.
- Temaoverrides ligger i `src/themes/rave.css`, `pokemon.css`, `habbo.css` og `dark.css`. De importeres i `src/main.jsx` efter `globals.css`.
- Genbrug eksisterende CSS-variabelnavne fra `globals.css`; temaer må kun redefinere relevante variabler, ikke kopiere komponenters CSS.
- Tema vælges med `data-theme="default|rave|pokemon|habbo"` på `document.documentElement`. Default er udgangspunktet, også når attributten mangler.
- Mørk tilstand er kun en variant af Default og bruger `data-theme="default"` sammen med `data-mode="dark"`.
- Primær tekst, der fremstår sort i Default, skal anvende `var(--text__primary)`; sekundær tekst beholder `--text__muted`, og rute-/ikonfarver beholder egne semantiske variabler.
- Behold komponenternes CSS Modules til layout og styling. CSS-variabler bruges til temafarver og eventuelle fremtidige temaafhængige designværdier.
- Temaskift i React og vedvarende valg er ikke implementeret endnu; CSS-filerne forbereder det næste trin.
