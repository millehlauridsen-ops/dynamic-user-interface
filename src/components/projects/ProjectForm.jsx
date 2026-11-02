import { useState } from 'react';
import Button from '../ui/Button.jsx';

export default function ProjectForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim() });
    setName(''); setDescription('');
  }
  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <label htmlFor="project-name">Projektnavn</label>
      <input id="project-name" value={name} onChange={e => setName(e.target.value)} required maxLength={70} placeholder="Fx Kundeside" autoFocus />
      <label htmlFor="project-description">Beskrivelse</label>
      <textarea id="project-description" value={description} onChange={e => setDescription(e.target.value)} maxLength={300} rows="3" placeholder="Hvad skal projektet bruges til?" />
      <div className="form-actions"><Button type="button" variant="secondary" onClick={onCancel}>Annuller</Button><Button type="submit">Opret projekt</Button></div>
    </form>
  );
}
