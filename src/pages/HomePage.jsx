import { Link } from 'react-router';
import ProjectCard from '../components/projects/ProjectCard.jsx';
import { useProjects } from '../hooks/useProjects.js';

export default function HomePage() {
  const { projects } = useProjects();
  const active = projects.filter(project => project.status === 'I gang').length;
  return <>
    <div className="eyebrow">VELKOMMEN TIL JERES ARBEJDSRUM</div>
    <section className="hero"><div><span className="hero-label">✦ GODT OVERBLIK. BEDRE SAMARBEJDE.</span><h1>Ét sted til jeres<br /><em>næste store idé.</em></h1><p>En ren React-startstruktur med plads til både produktudvikling, fælles beslutninger og nye funktioner.</p><Link to="/projekter" className="button button--primary">Se alle projekter <span>→</span></Link></div><div className="hero-orb" aria-hidden="true"><div className="orb-small">✳</div><div className="orb-center">F</div><div className="orb-caption">BUILD · ITERATE · SHIP</div></div></section>
    <section className="stats" aria-label="Projektstatistik"><div className="stat"><span>PROJEKTER I ALT</span><strong>{projects.length.toString().padStart(2, '0')}</strong><small>På tværs af arbejdsrummet</small></div><div className="stat"><span>IGANGVÆRENDE</span><strong>{active.toString().padStart(2, '0')}</strong><small>Aktive fokusområder</small></div><div className="stat"><span>TEKNOLOGI</span><strong className="stat-tech">React</strong><small>Vite + React Router</small></div></section>
    <div className="section-header"><div><span className="eyebrow">JERES ARBEJDE</span><h2>Seneste projekter</h2></div><Link to="/projekter" className="text-link">Se alle <span>→</span></Link></div>
    <div className="project-grid">{projects.slice(0, 3).map(project => <ProjectCard key={project.id} project={project} />)}</div>
    <div className="tip"><div className="tip-icon">✦</div><div><strong>Byg videre på strukturen</strong><p>Du finder sider i <code>src/pages/</code>, genbrugelige komponenter i <code>src/components/</code> og udviklingsregler i <code>AGENTS.md</code>.</p></div></div>
  </>;
}
