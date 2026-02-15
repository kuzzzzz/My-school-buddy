import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { userRepository } from '../repositories/userRepository';
import { profileSchema } from '../utils/validators';
import { graphService } from '../services/graphService';

export const profileController = {
  async save(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const parsed = profileSchema.parse(req.body);
      const updated = await userRepository.updateProfile(userId, parsed);
      await graphService.createStudentNode(updated.id, updated.name, updated.department);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async me(req: AuthenticatedRequest, res: Response) {
    const me = await userRepository.findById(req.user!.id);
    if (!me) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(me);
  }
};
