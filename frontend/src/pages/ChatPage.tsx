import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { api } from '../api/client';

interface Message {
  id: string;
  content: string;
  fromUserId: string;
}

export function ChatPage() {
  const { token } = useAuth();
  const socket = useSocket(token);
  const [roomId, setRoomId] = useState('general');
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [online, setOnline] = useState<string[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    api.get(`/chat/${roomId}`).then((res) => setMessages(res.data));
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('room:join', roomId);
    socket.on('message:new', (message) => setMessages((prev) => [...prev, message]));
    socket.on('presence:update', setOnline);
    socket.on('notification', (payload) => setNotice(payload.content));
    return () => {
      socket.off('message:new');
      socket.off('presence:update');
      socket.off('notification');
    };
  }, [socket, roomId]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    socket?.emit('message:send', { roomId, content, relationType: 'STUDIES_WITH' });
    setContent('');
  };

  return (
    <section className="card">
      <h2>Real-time chat</h2>
      <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Room ID" />
      <form onSubmit={send} className="row">
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Say something" />
        <button>Send</button>
      </form>
      {notice && <p>{notice}</p>}
      <p>Online users: {online.length}</p>
      <div className="chat-box">{messages.map((message) => <p key={message.id}><b>{message.fromUserId}:</b> {message.content}</p>)}</div>
    </section>
  );
}
