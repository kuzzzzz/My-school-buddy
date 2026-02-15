import express from 'express';
import http from 'http';
import cors from 'cors';
import { env } from './config/env';
import { apiRouter } from './routes';
import { setupSocket } from './sockets/socketServer';
import { userRepository } from './repositories/userRepository';

async function bootstrap() {
  await userRepository.init();

  const app = express();
  app.use(cors({ origin: env.clientUrl }));
  app.use(express.json());

  app.get('/health', (_, res) => res.json({ ok: true }));
  app.use('/api', apiRouter);

  const server = http.createServer(app);
  setupSocket(server);

  server.listen(env.port, () => {
    console.log(`UCC backend running on ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap', error);
  process.exit(1);
});
