import { existsSync } from 'node:fs';
const paths = ['src/main.jsx','src/App.jsx','src/components/layout/AppLayout.jsx','src/hooks/useProjects.js','src/services/projectService.js','src/lib/formatDate.js','src/pages/HomePage.jsx','AGENTS.md','docs/ARCHITECTURE.md'];
const missing = paths.filter(path => !existsSync(path));
if (missing.length) { console.error('Manglende filer:', missing.join(', ')); process.exit(1); }
console.log('Struktur kontrolleret: alle centrale filer findes.');
