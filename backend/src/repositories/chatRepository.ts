import { randomUUID } from 'crypto';

export interface Message {
  id: string;
  roomId: string;
  fromUserId: string;
  content: string;
  createdAt: string;
}

const messages: Message[] = [];

export const chatRepository = {
  create(roomId: string, fromUserId: string, content: string) {
    const message: Message = {
      id: randomUUID(),
      roomId,
      fromUserId,
      content,
      createdAt: new Date().toISOString()
    };
    messages.push(message);
    return message;
  },
  list(roomId: string) {
    return messages.filter((m) => m.roomId === roomId);
  }
};
