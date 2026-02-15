import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { profileController } from '../controllers/profileController';
import { matchController } from '../controllers/matchController';
import { projectController } from '../controllers/projectController';
import { chatController } from '../controllers/chatController';

export const apiRouter = Router();

apiRouter.post('/auth/register', authController.register);
apiRouter.post('/auth/login', authController.login);

apiRouter.get('/profile/me', authMiddleware, profileController.me);
apiRouter.put('/profile', authMiddleware, profileController.save);

apiRouter.get('/matches', authMiddleware, matchController.suggest);
apiRouter.get('/graph/insights', authMiddleware, matchController.insights);

apiRouter.post('/projects', authMiddleware, projectController.create);
apiRouter.get('/projects', authMiddleware, projectController.list);
apiRouter.get('/projects/:projectId/suggestions', authMiddleware, projectController.suggestions);

apiRouter.get('/chat/:roomId', authMiddleware, chatController.history);
