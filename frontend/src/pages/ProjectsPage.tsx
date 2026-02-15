import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';

interface Project {
  id: string;
  name: string;
  description: string;
  requiredSkills: string[];
  maxMembers: number;
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({ name: '', description: '', requiredSkills: '', maxMembers: 4 });
  const [suggestions, setSuggestions] = useState<Record<string, any[]>>({});

  const load = () => api.get('/projects').then((res) => setProjects(res.data));
  useEffect(() => { load(); }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    await api.post('/projects', {
      ...form,
      requiredSkills: form.requiredSkills.split(',').map((x) => x.trim()).filter(Boolean),
      maxMembers: Number(form.maxMembers)
    });
    setForm({ name: '', description: '', requiredSkills: '', maxMembers: 4 });
    await load();
  };

  const suggest = async (projectId: string) => {
    const res = await api.get(`/projects/${projectId}/suggestions`);
    setSuggestions((prev) => ({ ...prev, [projectId]: res.data }));
  };

  return (
    <section>
      <h2>Project groups</h2>
      <form onSubmit={create} className="card grid">
        <input placeholder="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Required skills" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} />
        <input type="number" value={form.maxMembers} onChange={(e) => setForm({ ...form, maxMembers: Number(e.target.value) })} />
        <button>Create Project</button>
      </form>

      {projects.map((project) => (
        <article key={project.id} className="card">
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <p>Skills: {project.requiredSkills.join(', ')}</p>
          <button onClick={() => suggest(project.id)}>Suggest candidates</button>
          <ul>{(suggestions[project.id] ?? []).map((candidate) => <li key={candidate.userId}>{candidate.name} - {(candidate.score * 100).toFixed(1)}%</li>)}</ul>
        </article>
      ))}
    </section>
  );
}
