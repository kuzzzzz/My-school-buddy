import { StoredUser } from '../repositories/userRepository';
import { graphService } from './graphService';
import { MatchScore, TimeBlock } from '../types/domain';

const WEIGHTS = {
  skillComplement: 0.4,
  scheduleOverlap: 0.3,
  sharedInterests: 0.2,
  graphProximity: 0.1
};

export async function rankMatches(current: StoredUser, candidates: StoredUser[]): Promise<MatchScore[]> {
  const scored = await Promise.all(
    candidates.map(async (candidate) => {
      const skillComplement = complementScore(current, candidate);
      const scheduleOverlap = overlapScore(current.availability, candidate.availability);
      const sharedInterests = jaccard(current.interests, candidate.interests);
      const distance = await graphService.shortestPathDistance(current.id, candidate.id);
      const graphProximity = Math.max(0, 1 - distance / 5);

      const score =
        skillComplement * WEIGHTS.skillComplement +
        scheduleOverlap * WEIGHTS.scheduleOverlap +
        sharedInterests * WEIGHTS.sharedInterests +
        graphProximity * WEIGHTS.graphProximity;

      return {
        studentId: candidate.id,
        score: Number(score.toFixed(4)),
        breakdown: {
          skillComplement: Number(skillComplement.toFixed(4)),
          scheduleOverlap: Number(scheduleOverlap.toFixed(4)),
          sharedInterests: Number(sharedInterests.toFixed(4)),
          graphProximity: Number(graphProximity.toFixed(4))
        }
      };
    })
  );

  return scored.sort((a, b) => b.score - a.score).slice(0, 5);
}

function complementScore(a: StoredUser, b: StoredUser): number {
  const aStrongToBWeak = intersection(a.strengths, b.weakSubjects).length;
  const bStrongToAWeak = intersection(b.strengths, a.weakSubjects).length;
  const skillFit = intersection(a.skills, b.skills).length;
  const denominator = Math.max(1, a.strengths.length + b.strengths.length + a.skills.length + b.skills.length);
  return Math.min(1, (aStrongToBWeak + bStrongToAWeak + 0.5 * skillFit) / denominator * 4);
}

function overlapScore(a: TimeBlock[], b: TimeBlock[]): number {
  let overlap = 0;
  let total = 0;
  for (const x of a) {
    total += Math.max(0, x.endHour - x.startHour);
    for (const y of b.filter((time) => time.day === x.day)) {
      overlap += Math.max(0, Math.min(x.endHour, y.endHour) - Math.max(x.startHour, y.startHour));
    }
  }
  return total ? Math.min(1, overlap / total) : 0;
}

function jaccard(a: string[], b: string[]): number {
  const union = new Set([...a, ...b]);
  if (!union.size) {
    return 0;
  }
  return intersection(a, b).length / union.size;
}

function intersection(a: string[], b: string[]) {
  const bSet = new Set(b.map((v) => v.toLowerCase()));
  return a.filter((v) => bSet.has(v.toLowerCase()));
}

export const matchingWeights = WEIGHTS;
