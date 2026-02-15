import { useEffect, useState } from 'react';
import { api } from '../api/client';

interface Insight {
  userId: string;
  degreeCentrality: number;
  shortestPath: number;
  commonNeighbors: number;
}

export function InsightsPage() {
  const [data, setData] = useState<Insight[]>([]);

  useEffect(() => {
    api.get('/graph/insights').then((res) => setData(res.data));
  }, []);

  return (
    <section className="card">
      <h2>Graph insights</h2>
      <svg width="100%" height="220" viewBox="0 0 400 220">
        <circle cx="200" cy="100" r="24" fill="#4f46e5" />
        <text x="188" y="105" fill="white">You</text>
        {data.map((item, i) => {
          const angle = (i / Math.max(1, data.length)) * Math.PI * 2;
          const x = 200 + Math.cos(angle) * 100;
          const y = 100 + Math.sin(angle) * 70;
          return (
            <g key={item.userId}>
              <line x1="200" y1="100" x2={x} y2={y} stroke="#94a3b8" />
              <circle cx={x} cy={y} r={16} fill="#0ea5e9" />
            </g>
          );
        })}
      </svg>
      {data.map((item) => (
        <p key={item.userId}>{item.userId}: degree {item.degreeCentrality}, shortest path {item.shortestPath}, common neighbors {item.commonNeighbors}</p>
      ))}
    </section>
  );
}
