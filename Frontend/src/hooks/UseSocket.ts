import { useSocketContext } from "../lib/context/SocketContext";

export default function useSocket() {
  const { socket } = useSocketContext();
  return socket;
}
