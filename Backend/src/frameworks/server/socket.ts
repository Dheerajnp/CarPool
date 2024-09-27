import { Server as SocketIOServer, Socket, Server } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../../config/config";
import Notification from "../database/models/notificationSchema";
import messageModel from "../database/models/messageSchema";
import { Types } from "mongoose";
import chatModel from "../database/models/chatModel";

let io: SocketIOServer | undefined;

interface SocketUsersType {
  userId: string;
  socketId: string;
}

let users: SocketUsersType[] = [];
const addUser = (userId: string, socketId: string) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId: string) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: string) => {
  return users.find((user) => user.userId == userId);
};

const initializeSocketServer = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: env.VITE_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on("joinRoom", (recieverId) => {
      socket.join(recieverId);
      console.log("reccsid", recieverId);
      addUser(recieverId, socket.id);
    });

    socket.on("getUsers", (user: string[]) => {
      console.log("usert", user);
      io?.emit(
        "getUsers",
        users
          .filter((usr) => user.includes(usr.userId))
          .map((usr) => usr.userId)
      );
    });

    socket.on("sendonline", async (userId, role) => {
      const conversations = await chatModel.find({
        $or: [
          {
            user: userId,
          },
          {
            driver: userId,
          },
        ],
      });
      conversations.forEach((conversation) => {
        if (role === "rider") {
          socket.to(conversation.driver.toString()).emit("online", userId);
        } else {
          socket.to(conversation.user.toString()).emit("online", userId);
        }
      });
    });

    socket.on('notificationSeen',async(notificationId)=>{
      console.log("NotificationSeen", notificationId)
      const notification = await Notification.findByIdAndUpdate(notificationId,{seen:"true",status:"read"});
      socket.emit('changeNotification',notification);
    });

    socket.on("newMessage", ({ message, recieverId }) => {
      console.log(`New Message: ${recieverId}`, message);
      socket?.to(recieverId).emit("newMessage", message);
    });

    socket.on("unseenMessage", async (roomId: string[], userId) => {
      const response = await messageModel.aggregate([
        {
          $match: {
            roomId: { $in: roomId },
            senderId: { $ne: new Types.ObjectId(userId) },
            seen: false,
          },
        },
        {
          $group: {
            _id: "$roomId",
            unreadCount: { $sum: 1 },
          },
        },
      ]);
      return socket.emit("UnseenCount", response);
    });

    socket.on("seenMessage", async (roomId, userId) => {
      await messageModel.updateMany(
        { roomId: roomId, senderId: { $ne: new Types.ObjectId(userId) } },
        { $set: { seen: true } }
      );
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
