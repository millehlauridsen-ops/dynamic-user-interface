// Demo-data. Erstat med et API-kald, når I har en backend.
export const initialProjects = [
  { id: 'demo-1', name: 'Frontend & design', description: 'Komponenter, designprincipper og brugeroplevelse.', status: 'I gang', updatedAt: '2026-10-28T10:00:00.000Z' },
  { id: 'demo-2', name: 'API & data', description: 'Endpoints, datamodeller og integrationer.', status: 'Planlagt', updatedAt: '2026-10-25T10:00:00.000Z' },
  { id: 'demo-3', name: 'Dokumentation', description: 'Hold arkitektur, beslutninger og AI-instruktioner opdateret.', status: 'I gang', updatedAt: '2026-10-30T10:00:00.000Z' },
];

export function createProject({ name, description }) {
  return { id: crypto.randomUUID(), name, description, status: 'Planlagt', updatedAt: new Date().toISOString() };
}
