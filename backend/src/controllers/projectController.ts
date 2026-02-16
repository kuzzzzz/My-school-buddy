import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { projectRepository } from '../repositories/projectRepository';
import { projectSchema } from '../utils/validators';
import { userRepository } from '../repositories/userRepository';
import { graphService } from '../services/graphService';

export const projectController = {
  create(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = projectSchema.parse(req.body);
      
      // Ensure required fields are present
      if (!parsed.name || !parsed.description) {
        return res.status(400).json({ message: 'Name and description are required' });
      }
      
      // Create project data with required fields
      const projectData = {
        ownerId: req.user!.id,
        name: parsed.name,
        description: parsed.description,
        requiredSkills: parsed.requiredSkills || [],
        maxMembers: parsed.maxMembers || 10
      };
      
      const project = projectRepository.create(projectData);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  list(req: AuthenticatedRequest, res: Response) {
    res.json(projectRepository.list());
  },
  async suggestions(req: AuthenticatedRequest, res: Response) {
    const project = projectRepository.list().find((p) => p.id === req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const users = await userRepository.listOthers(req.user!.id);
    const ranked = await Promise.all(
      users.map(async (user) => {
        const skillMatch = project.requiredSkills.length
          ? project.requiredSkills.filter((skill) => user.skills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())).length /
            project.requiredSkills.length
          : 0;
        const centrality = await graphService.degreeCentrality(user.id);
        return {
          userId: user.id,
          name: user.name,
          score: Number((skillMatch * 0.7 + Math.min(1, centrality / 10) * 0.3).toFixed(4))
        };
      })
    );
    res.json(ranked.sort((a, b) => b.score - a.score).slice(0, 5));
  }
};