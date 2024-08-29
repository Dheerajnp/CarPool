import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export default function useSocket(recieverId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const connect = io(import.meta.env.VITE_SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    setSocket(connect);
    connect.emit("joinRoom", recieverId);

    return () => {
      connect.disconnect();
    };
  }, [recieverId]);

  return socket;
}
