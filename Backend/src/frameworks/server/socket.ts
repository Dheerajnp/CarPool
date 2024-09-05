import { Server as SocketIOServer, Socket, Server } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../../config/config";
import Notification from "../database/models/notificationSchema";
import messageModel from "../database/models/messageSchema";
import { Types } from "mongoose";

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
      addUser(userId, socket.id);
      io?.emit("getUsers", users);
    });

    socket.on('notificationSeen',async(notificationId)=>{
      const notification = await Notification.findByIdAndUpdate(notificationId,{seen:"true",status:"read"});
      socket.emit('changeNotification',notification);
    });

    socket.on('unseenMessage',async(roomId:string[],userId)=>{
      const response = await messageModel.aggregate([
        {
          $match:{roomId:{$in:roomId},senderId:{$ne:new Types.ObjectId(userId)},seen:false}
        },
        {
          $group:{
            _id:"$roomId",
            unreadCount:{$sum:1},
          }
        }
      ])
      return socket.emit("UnseenCount",response)
    })

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
    socket.on("seenMessage",async (roomId,userId)=>{
      await messageModel.updateMany({roomId:roomId,senderId:{$ne:new Types.ObjectId(userId)}},{$set:{seen:true}})
    })
  });
};
const getSocketInstance = (): SocketIOServer | undefined => io;

export { initializeSocketServer, getSocketInstance };
