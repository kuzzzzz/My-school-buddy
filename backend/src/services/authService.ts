import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { userRepository } from '../repositories/userRepository';
import { graphService } from './graphService';

export const authService = {
  async register(name: string, email: string, password: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email already in use');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await userRepository.createAuthUser(name, email, hash);
    await graphService.createStudentNode(user.id, user.name, user.department);
    return buildToken(user.id, user.email);
  },
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    return buildToken(user.id, user.email);
  }
};

function buildToken(id: string, email: string) {
  const token = jwt.sign({ sub: id, email }, env.jwtSecret, { expiresIn: '7d' });
  return { token };
}
