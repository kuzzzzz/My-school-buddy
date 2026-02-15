import { randomUUID } from 'crypto';
import { pgPool } from '../config/db';
import { StudentProfile, TimeBlock } from '../types/domain';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  department?: string;
  strengths: string[];
  weakSubjects: string[];
  skills: string[];
  interests: string[];
  availability: TimeBlock[];
}

const memoryUsers: StoredUser[] = [];

export const userRepository = {
  async init() {
    if (!pgPool) {
      return;
    }
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        department TEXT,
        strengths TEXT[] DEFAULT '{}',
        weak_subjects TEXT[] DEFAULT '{}',
        skills TEXT[] DEFAULT '{}',
        interests TEXT[] DEFAULT '{}',
        availability JSONB DEFAULT '[]'::jsonb
      );
    `);
  },

  async createAuthUser(name: string, email: string, passwordHash: string) {
    const id = randomUUID();
    if (!pgPool) {
      const user: StoredUser = {
        id,
        name,
        email,
        passwordHash,
        strengths: [],
        weakSubjects: [],
        skills: [],
        interests: [],
        availability: []
      };
      memoryUsers.push(user);
      return user;
    }

    const result = await pgPool.query(
      `INSERT INTO students(id, name, email, password_hash)
       VALUES($1, $2, $3, $4)
       RETURNING *`,
      [id, name, email, passwordHash]
    );
    return normalize(result.rows[0]);
  },

  async findByEmail(email: string) {
    if (!pgPool) {
      return memoryUsers.find((u) => u.email === email) ?? null;
    }
    const result = await pgPool.query(`SELECT * FROM students WHERE email = $1`, [email]);
    return result.rows[0] ? normalize(result.rows[0]) : null;
  },

  async findById(id: string) {
    if (!pgPool) {
      return memoryUsers.find((u) => u.id === id) ?? null;
    }
    const result = await pgPool.query(`SELECT * FROM students WHERE id = $1`, [id]);
    return result.rows[0] ? normalize(result.rows[0]) : null;
  },

  async updateProfile(id: string, profile: Omit<StudentProfile, 'id' | 'email'>) {
    if (!pgPool) {
      const found = memoryUsers.find((u) => u.id === id);
      if (!found) {
        throw new Error('User not found');
      }
      Object.assign(found, profile);
      return found;
    }

    const result = await pgPool.query(
      `UPDATE students
       SET name=$2, department=$3, strengths=$4, weak_subjects=$5, skills=$6, interests=$7, availability=$8
       WHERE id=$1 RETURNING *`,
      [id, profile.name, profile.department, profile.strengths, profile.weakSubjects, profile.skills, profile.interests, JSON.stringify(profile.availability)]
    );
    return normalize(result.rows[0]);
  },

  async listOthers(id: string) {
    if (!pgPool) {
      return memoryUsers.filter((u) => u.id !== id);
    }
    const result = await pgPool.query(`SELECT * FROM students WHERE id <> $1`, [id]);
    return result.rows.map(normalize);
  }
};

function normalize(row: any): StoredUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash ?? row.passwordHash,
    department: row.department,
    strengths: row.strengths ?? [],
    weakSubjects: row.weak_subjects ?? row.weakSubjects ?? [],
    skills: row.skills ?? [],
    interests: row.interests ?? [],
    availability: row.availability ?? []
  };
}

export type { StoredUser };
