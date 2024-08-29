import { Server as SocketIOServer, Socket, Server } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../../config/config";

let io: SocketIOServer | undefined;


interface SocketUsersType {
  userId: string;
  socketId: string;
}
const initializeSocketServer = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: env.VITE_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });


  let users: SocketUsersType[] = [];
  const addUser = (userId: string, socketId: string) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };

  const removeUser = (socketId: string) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (socketId: string) => {
    return users.find((user) => user.socketId === socketId);
  };
  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);


    socket.on("addUser", (userId) => {
      console.log(userId)
      addUser(userId, socket.id);
      io?.emit("getUsers", users);
    });
    console.log(users)

    socket.on("joinRoom", (recieverId) => {
      socket.join(recieverId);
    });

    socket.on("newMessage", (message) => {
      io?.to(message.roomId).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log(`Socket disconnected: ${socket.id}`);
      io?.emit("getUsers", users);
    });
  });
};
const getSocketInstance = (): SocketIOServer | undefined => io;

export { initializeSocketServer, getSocketInstance };
