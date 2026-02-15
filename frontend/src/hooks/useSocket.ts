import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) return;
    const base = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api').replace('/api', '');
    const socketClient = io(base, { auth: { token } });
    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
      setSocket(null);
    };
  }, [token]);

  return socket;
}
