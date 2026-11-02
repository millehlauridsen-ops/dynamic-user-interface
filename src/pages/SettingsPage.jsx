import Button from '../components/ui/Button.jsx';
import { useProjects } from '../hooks/useProjects.js';

export default function SettingsPage() {
  const { resetProjects } = useProjects();
  function reset() { if (window.confirm('Erstat alle lokale projekter med demo-data?')) { resetProjects(); window.location.reload(); } }
  return <>
    <div className="page-heading"><div><span className="eyebrow">TILPAS ARBEJDSRUMMET</span><h1>Indstillinger</h1><p>Overblik over startpakkens opsætning.</p></div></div>
    <div className="detail-grid"><section className="panel"><h2>Teknologistak</h2><p>React + Vite + React Router. Se <code>docs/TECH_STACK.md</code>.</p><div className="tag-row"><span className="chip">React</span><span className="chip">Vite</span><span className="chip">React Router</span></div></section><section className="panel"><h2>Demo-data</h2><p>Gendan de tre eksempelprojekter. Eksisterende lokale ændringer overskrives.</p><Button variant="secondary" onClick={reset}>Gendan demo-data</Button></section></div>
    <div className="tip"><div className="tip-icon">i</div><div><strong>Vigtigt om samarbejde</strong><p>Oprettede projekter ligger kun i den aktuelle browsers localStorage. De synkroniseres ikke mellem dig og Mathilde. Til ægte fælles data skal I tilslutte en backend og database.</p></div></div>
  </>;
}
