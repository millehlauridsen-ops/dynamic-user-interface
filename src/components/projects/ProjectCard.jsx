import { Link } from 'react-router';
import { formatDate } from '../../lib/formatDate.js';

export default function ProjectCard({ project }) {
  return (
    <Link className="project-card" to={`/projekter/${project.id}`}>
      <div className="project-card-head"><span className="project-icon">{project.name.slice(0, 1).toUpperCase()}</span><span className="chip">{project.status}</span></div>
      <h3>{project.name}</h3>
      <p>{project.description || 'Ingen beskrivelse endnu.'}</p>
      <div className="project-card-foot"><span>Opdateret {formatDate(project.updatedAt)}</span><span aria-hidden="true">↗</span></div>
    </Link>
  );
}
