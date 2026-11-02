export default function EmptyState({ title, description, children }) {
  return <div className="empty-state"><div className="empty-icon" aria-hidden="true">◇</div><h3>{title}</h3><p>{description}</p>{children}</div>;
}
