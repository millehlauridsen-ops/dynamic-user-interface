# Beslutningslog

Brug denne fil som fælles kilde til vedtagne tekniske valg. Opdatér ved ændringer.

## 2026-11-02 — Starterarkitektur
**Status:** Implementeret i denne skabelon, skal godkendes til jeres faktiske produkt.

- React + JSX og Vite.
- React Router til routing.
- Opdeling i `pages`, `routes`, `components`, `hooks`, `services`, `lib` og `assets`.
- CSS uden ekstra UI-framework.
- `localStorage` kun til demonstration.

**Begrundelse:** Minimal og let udvidelig kodebase uden backendkrav.

## 2026-11-02 — Ruter direkte i App.jsx
**Status:** Aftalt med teamet; erstatter starterens separate `routes`-mappe.

- Alle ruter defineres i `src/App.jsx` med React Routers `Routes` og `Route`.
- `BrowserRouter` bliver i `src/main.jsx`.
- Det fælles `AppLayout` bruges som layout-route med `Outlet`.

**Begrundelse:** Følger teamets vante struktur og routingopdelingen i [referenceprojektet](https://github.com/millehlauridsen-ops/millehlauridsen-ops.github.io/blob/main/src/App.jsx).

## Åbne valg
- Produktets faktiske funktionalitet og datamodel.
- Backend og database.
- Autentifikation.
- Testværktøj og CI.
- Hosting.
