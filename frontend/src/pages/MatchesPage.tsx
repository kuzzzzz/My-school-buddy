import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Match } from '../types';

export function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    api.get('/matches').then((res) => setMatches(res.data));
  }, []);

  return (
    <section>
      <h2>Smart match suggestions</h2>
      <div className="list">
        {matches.map((match) => (
          <article key={match.studentId} className="card">
            <h3>{match.studentId}</h3>
            <p>Overall score: {(match.score * 100).toFixed(1)}%</p>
            <small>
              skill {pct(match.breakdown.skillComplement)} · schedule {pct(match.breakdown.scheduleOverlap)} · interests {pct(match.breakdown.sharedInterests)} · graph {pct(match.breakdown.graphProximity)}
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}

const pct = (value: number) => `${(value * 100).toFixed(0)}%`;
