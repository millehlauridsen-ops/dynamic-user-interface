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
- Brug kun `src/globals.css` til globale CSS-regler.
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
