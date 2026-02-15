import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { chatRepository } from '../repositories/chatRepository';
import { graphService } from '../services/graphService';

const onlineUsers = new Map<string, string>();

export function setupSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) {
      return next(new Error('Unauthorized'));
    }
    try {
      const payload = jwt.verify(token, env.jwtSecret) as { sub: string };
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId as string;
    onlineUsers.set(userId, socket.id);
    io.emit('presence:update', [...onlineUsers.keys()]);

    socket.on('room:join', (roomId: string) => {
      socket.join(roomId);
    });

    socket.on('message:send', async ({ roomId, content, toUserId, relationType }) => {
      const message = chatRepository.create(roomId, userId, content);
      io.to(roomId).emit('message:new', message);
      if (toUserId && relationType) {
        await graphService.connectStudents(userId, toUserId, relationType);
      }
      if (toUserId && onlineUsers.has(toUserId)) {
        io.to(onlineUsers.get(toUserId)!).emit('notification', {
          type: 'message',
          from: userId,
          content: `New message in ${roomId}`
        });
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('presence:update', [...onlineUsers.keys()]);
    });
  });

  return io;
}
