import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { chatRepository } from '../repositories/chatRepository';

export const chatController = {
  history(req: AuthenticatedRequest, res: Response) {
    const roomId = req.params.roomId;
    res.json(chatRepository.list(roomId));
  }
};
