import { useState } from 'react';
import { useNavigate } from 'react-router';
import ProjectCard from '../components/projects/ProjectCard.jsx';
import ProjectForm from '../components/projects/ProjectForm.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import { useProjects } from '../hooks/useProjects.js';

export default function ProjectsPage() {
  const { projects, addProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const filtered = projects.filter(p => `${p.name} ${p.description}`.toLowerCase().includes(search.trim().toLowerCase()));
  function handleCreate(data) { const project = addProject(data); navigate(`/projekter/${project.id}`); }
  return <>
    <div className="page-heading"><div><span className="eyebrow">ORGANISÉR JERES ARBEJDE</span><h1>Projekter</h1><p>Hold styr på det, I bygger sammen.</p></div><Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Luk formular' : '+ Nyt projekt'}</Button></div>
    {showForm && <div className="panel"><h2>Opret projekt</h2><ProjectForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} /></div>}
    <div className="toolbar"><label className="search-wrap"><span className="sr-only">Søg efter projekter</span><span aria-hidden="true">⌕</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Søg i projekter ..." /></label><span>{filtered.length} {filtered.length === 1 ? 'projekt' : 'projekter'}</span></div>
    {filtered.length ? <div className="project-grid">{filtered.map(project => <ProjectCard key={project.id} project={project} />)}</div> : <EmptyState title="Ingen projekter fundet" description="Prøv en anden søgning, eller opret et nyt projekt."><Button onClick={() => {setSearch(''); setShowForm(true);}}>Opret et projekt</Button></EmptyState>}
  </>;
}
