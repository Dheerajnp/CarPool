import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export default function useSocket(recieverId: string) {
    const [socket,setSocket] = useState<Socket|null>(null)
  useEffect(() => {
    const connect = io(import.meta.env.VITE_SOCKET_URL);
    setSocket(connect)
    connect.emit('joinRoom', recieverId);
    connect.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    return () => {
        connect.disconnect();
    };
  }, []);
  
  return socket;
}
