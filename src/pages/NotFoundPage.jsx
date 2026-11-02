import { Link } from 'react-router';

export default function NotFoundPage() {
  return <div className="not-found"><div className="not-found-number">404</div><h1>Siden findes ikke</h1><p>Linket er muligvis ændret eller fjernet.</p><Link to="/" className="button button--primary">Tilbage til forsiden →</Link></div>;
}
