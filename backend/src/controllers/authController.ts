import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { loginSchema, registerSchema } from '../utils/validators';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const parsed = registerSchema.parse(req.body);
      const response = await authService.register(parsed.name, parsed.email, parsed.password);
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.parse(req.body);
      const response = await authService.login(parsed.email, parsed.password);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
};
