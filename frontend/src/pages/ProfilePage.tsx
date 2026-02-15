import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { Profile } from '../types';

const blank: Profile = { name: '', department: '', strengths: [], weakSubjects: [], skills: [], interests: [], availability: [] };

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(blank);
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/profile/me').then((res) => setProfile(res.data)).catch(() => undefined);
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await api.put('/profile', profile);
    setStatus('Profile saved');
  };

  return (
    <section className="card">
      <h2>Profile setup</h2>
      <form onSubmit={submit} className="grid">
        <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Name" />
        <input value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} placeholder="Department" />
        <input value={profile.strengths.join(',')} onChange={(e) => setProfile({ ...profile, strengths: split(e.target.value) })} placeholder="Strengths (comma separated)" />
        <input value={profile.weakSubjects.join(',')} onChange={(e) => setProfile({ ...profile, weakSubjects: split(e.target.value) })} placeholder="Weak subjects" />
        <input value={profile.skills.join(',')} onChange={(e) => setProfile({ ...profile, skills: split(e.target.value) })} placeholder="Skills" />
        <input value={profile.interests.join(',')} onChange={(e) => setProfile({ ...profile, interests: split(e.target.value) })} placeholder="Interests" />
        <input
          value={profile.availability.map((a) => `${a.day}:${a.startHour}-${a.endHour}`).join(',')}
          onChange={(e) => setProfile({ ...profile, availability: parseAvailability(e.target.value) })}
          placeholder="Availability e.g Mon:10-14,Tue:9-12"
        />
        <button>Save profile</button>
      </form>
      {status && <p>{status}</p>}
    </section>
  );
}

function split(value: string) {
  return value.split(',').map((x) => x.trim()).filter(Boolean);
}

function parseAvailability(input: string) {
  return input
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [day, range] = entry.split(':');
      const [startHour, endHour] = range.split('-').map((x) => Number(x));
      return { day, startHour, endHour };
    });
}
