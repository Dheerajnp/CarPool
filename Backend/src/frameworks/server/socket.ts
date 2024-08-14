import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
// import socketRoutes from '../../controllers/Socket/Sockets'
import { env } from "../../config/config";
import { disconnect } from "process";

let io: SocketIOServer | undefined;

const initializeSocketServer = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: env.VITE_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  // socketRoutes(io)
  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on('joinRoom', (recieverId) => {
      socket.join(recieverId);
    });
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

}; 
const getSocketInstance = (): SocketIOServer | undefined => io;

export { initializeSocketServer, getSocketInstance };
