# Fælles React-arbejdsrum

Komplet, selvstændig React-startpakke til to udviklere. Bruger samme mappestruktur som aftalt: `components/`, `pages/`, `hooks/`, `services/`, `lib/` og `assets/`.

## Start

Forudsætning: Node.js 20.19+ eller 22.12+.

```bash
npm install
npm run dev
```

Åbn den lokale URL fra terminalen (typisk `http://localhost:5173`).

Kontrollér grundstrukturen og lav produktionsbuild:

```bash
npm run check
npm run build
```

## Hvad kan demoen?

- Dashboard og navigation med React Router.
- Se, søg, opret og slet demo-projekter.
- Skift status på et projekt.
- Gem data med `localStorage` i den enkelte browser.
- Responsivt layout til mobil og desktop.

**Vigtigt:** Dette er et frontend-starterprojekt, ikke jeres eksisterende app. Data deles **ikke** mellem brugere. Til reelt samarbejde om data skal I tilføje backend, autentifikation og database.

## Mappeoversigt

```text
src/
  globals.css                 Design og styling
  components/
    layout/AppLayout.jsx      Layout og navigation
    projects/                Projektkomponenter
    ui/                      Genbrugelige UI-komponenter
  hooks/                     React-hooks og browser-state
  lib/                       Rene hjælpefunktioner
  pages/                     Sider
  services/                  Datakilde (foreløbig demo/localStorage)
  App.jsx                    Alle ruter
  main.jsx
```

## Tilføj til eksisterende repo

Sammenlign filerne med jeres eksisterende app, og flyt kun det, I vil genbruge. **Overskriv ikke `src/` eller `package.json` ukritisk.**

## ChatGPT + Codex

- `AGENTS.md`: kodeassistent-instruktioner i repositoryet.
- `docs/`: projektbeskrivelse, arkitektur, teknologistak, beslutninger og workflow.
- `CHATGPT_PROJECT_INSTRUCTIONS.md`: kopiér indholdet til projektinstruktionerne i jeres delte ChatGPT-projekt, og udfyld repo-linket.
- Vigtige aftaler gemmes som commits i `docs/DECISIONS.md`.
