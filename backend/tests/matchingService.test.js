"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const matchingService_1 = require("../src/services/matchingService");
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
};
(0, vitest_1.describe)('matching engine', () => {
    (0, vitest_1.it)('ranks users and returns top 5', async () => {
        const candidates = [
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
        const result = await (0, matchingService_1.rankMatches)(user, candidates);
        (0, vitest_1.expect)(result).toHaveLength(2);
        (0, vitest_1.expect)(result[0].studentId).toBe('u2');
        (0, vitest_1.expect)(result[0].score).toBeGreaterThan(result[1].score);
    });
});
