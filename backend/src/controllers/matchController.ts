import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { userRepository } from '../repositories/userRepository';
import { rankMatches } from '../services/matchingService';
import { graphService } from '../services/graphService';

export const matchController = {
  async suggest(req: AuthenticatedRequest, res: Response) {
    const current = await userRepository.findById(req.user!.id);
    if (!current) {
      return res.status(404).json({ message: 'User not found' });
    }
    const others = await userRepository.listOthers(current.id);
    const ranked = await rankMatches(current, others);
    res.json(ranked);
  },
  async insights(req: AuthenticatedRequest, res: Response) {
    const me = req.user!.id;
    const others = await userRepository.listOthers(me);
    const graph = await Promise.all(
      others.map(async (other) => ({
        userId: other.id,
        degreeCentrality: await graphService.degreeCentrality(other.id),
        shortestPath: await graphService.shortestPathDistance(me, other.id),
        commonNeighbors: await graphService.commonNeighbors(me, other.id)
      }))
    );
    res.json(graph);
  }
};
