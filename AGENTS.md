# AGENTS.md — fælles regler for kodeassistenter

Dette er et React-projekt, hvor to udviklere samarbejder. Koden i repoet er den faktiske sandhed. Læs `README.md`, `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/TECH_STACK.md` og `docs/DECISIONS.md`, før større ændringer.

## Teknologi
- React med JavaScript og JSX, bygget med Vite.
- Brug kun React Router til routing. Importér fra `react-router`.
- Styling ligger foreløbig i `src/assets/styles.css`; genbrug eksisterende klasser.
- Introducér ikke nye libraries eller backend uden godkendelse.

## Placering af kode
- `src/pages/`: sider for ruter.
- `src/routes/`: routerkonfiguration.
- `src/components/`: genbrugelige og domænespecifikke komponenter.
- `src/hooks/`: React-hooks, der deler logik.
- `src/services/`: håndtering af datakilder og fremtidige API-kald.
- `src/lib/`: rene utilities.
- `src/assets/`: styles og lokale assets.

## Kvalitet
- Skriv små, læsbare komponenter og tilgængelig HTML.
- Gør status, tomme tilstande og fejl tydelige for brugeren.
- Gem aldrig hemmeligheder i frontend eller Git.
- Inden afslutning: kør `npm run check` og `npm run build` hvis muligt, og oplys om de reelt blev kørt.
- Opdatér dokumentationen ved væsentlige beslutninger. Skeln mellem aftalt og foreslået teknologi.

## Data
- Demoen bruger browserens localStorage. Det er **ikke** synkroniseret mellem brugere. Beskriv ikke løsningen som multi-user uden en backend.

## Samarbejde
- Svar på dansk som udgangspunkt.
- Fortæl hvilke filer, der ændres, og hvorfor.
- Følg dokumenterede beslutninger og gør opmærksom på uoverensstemmelser med koden.
