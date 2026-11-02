# Arkitektur

## App-flow
`src/main.jsx` opretter React-root og `BrowserRouter`. `src/App.jsx` indeholder alle ruter direkte med `<Routes>` og `<Route>`. `AppLayout` giver navigation og et `<Outlet />` til sider.

Ruterne er `/` (overblik), `/projekter` (projektliste), `/projekter/:projectId` (`DetailPage`) og `/indstillinger`. Ukendte adresser viser `NotFoundPage` i samme layout. Den aktuelle styling ligger i `src/globals.css`, som importeres i `main.jsx`.

## Ansvar
- **pages:** komponerer hele sider.
- **components/layout:** navigation og fælles layout.
- **components/projects:** projekt-relateret UI.
- **components/ui:** små genbrugelige byggeklodser.
- **hooks:** genbrugelig React-state, fx `useProjects`.
- **services:** datakilde og domænefunktioner; senere API-integration.
- **lib:** rene hjælpefunktioner.
- **assets:** CSS og grafiske assets.

## Dataflow nu
En side kalder `useProjects`, som bruger `useLocalStorage`. `projectService` leverer demo-data og oprettelse af dataobjekter. Alt gemmes lokalt i browseren; en anden bruger ser ikke ændringerne.

## Fremtidig backend
Når der etableres fælles data: vælg backend, autentifikation, API-kontrakt, fejl- og loading-states, og erstat localStorage-laget via services/hooks. Tag en eksplicit arkitekturbeslutning før implementering.
