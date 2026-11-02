import { Link, useNavigate, useParams } from 'react-router';
import Button from '../components/ui/Button.jsx';
import { useProjects } from '../hooks/useProjects.js';
import { formatDate } from '../lib/formatDate.js';

const statuses = ['Planlagt', 'I gang', 'Afsluttet'];
export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, changeStatus, removeProject } = useProjects();
  const project = projects.find(p => p.id === projectId);
  if (!project) return <div className="panel"><h1>Projektet blev ikke fundet</h1><p>Det kan være slettet eller tilhøre en anden browser.</p><Link className="text-link" to="/projekter">← Tilbage til projekter</Link></div>;
  function handleDelete() { if (window.confirm(`Vil du slette “${project.name}”?`)) { removeProject(projectId); navigate('/projekter'); } }
  return <>
    <Link to="/projekter" className="back-link">← Alle projekter</Link>
    <div className="page-heading"><div><span className="eyebrow">PROJEKTDETALJER</span><h1>{project.name}</h1><p>{project.description || 'Ingen beskrivelse endnu.'}</p></div><span className="chip">{project.status}</span></div>
    <div className="detail-grid"><section className="panel"><h2>Projektstatus</h2><p>Opdatér projektets status, når arbejdet skrider frem.</p><label htmlFor="status">Status</label><select id="status" value={project.status} onChange={e => changeStatus(projectId, e.target.value)}>{statuses.map(status => <option key={status}>{status}</option>)}</select></section><section className="panel"><h2>Detaljer</h2><dl className="details"><div><dt>ID</dt><dd>{project.id}</dd></div><div><dt>Senest ændret</dt><dd>{formatDate(project.updatedAt)}</dd></div><div><dt>Datalagring</dt><dd>Kun lokalt i denne browser</dd></div></dl></section></div>
    <div className="danger-zone"><div><strong>Slet projekt</strong><p>Fjerner projektet fra denne browser. Kan ikke fortrydes.</p></div><Button variant="danger" onClick={handleDelete}>Slet projekt</Button></div>
  </>;
}
