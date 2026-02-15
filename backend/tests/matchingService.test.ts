import { describe, expect, it } from 'vitest';
import { rankMatches } from '../src/services/matchingService';
import { StoredUser } from '../src/repositories/userRepository';

const user = {
  id: 'u1',
  name: 'User',
  email: 'u1@test.dev',
  passwordHash: 'x',
  strengths: ['Math'],
  weakSubjects: ['Design'],
  skills: ['TypeScript'],
  interests: ['AI', 'Chess'],
  availability: [{ day: 'Mon', startHour: 10, endHour: 14 }]
} satisfies StoredUser;

describe('matching engine', () => {
  it('ranks users and returns top 5', async () => {
    const candidates: StoredUser[] = [
      {
        id: 'u2',
        name: 'Candidate 1',
        email: 'u2@test.dev',
        passwordHash: 'x',
        strengths: ['Design'],
        weakSubjects: ['Math'],
        skills: ['TypeScript'],
        interests: ['AI'],
        availability: [{ day: 'Mon', startHour: 11, endHour: 13 }]
      },
      {
        id: 'u3',
        name: 'Candidate 2',
        email: 'u3@test.dev',
        passwordHash: 'x',
        strengths: ['History'],
        weakSubjects: ['Physics'],
        skills: ['Writing'],
        interests: ['Art'],
        availability: [{ day: 'Tue', startHour: 9, endHour: 11 }]
      }
    ];

    const result = await rankMatches(user, candidates);

    expect(result).toHaveLength(2);
    expect(result[0].studentId).toBe('u2');
    expect(result[0].score).toBeGreaterThan(result[1].score);
  });
});
