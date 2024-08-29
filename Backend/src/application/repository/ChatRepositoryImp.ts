import path from "path";
import Chat from "../../entities/interfaces/ChatInterface";
import MessageInterface from "../../entities/interfaces/MessageInterface";
import chatModel from "../../frameworks/database/models/chatModel";
import messageModel from "../../frameworks/database/models/messageSchema";
import { generateRandomString } from "../functions/commonFunctions";
import { ChatRepository } from "../interfaces/repository/ChatRepository";
import { getSocketInstance } from "../../frameworks/server/socket";

export class ChatRepositoryImp implements ChatRepository {
  async sendMessageRepository(roomId: string, senderId: string, message: string): Promise<{ message: string; status: number; chatMessage: MessageInterface | null; }> {
    try {
      const newMessage = new messageModel({
        roomId,
        senderId,
        message,
      });
      await newMessage.save();
      const updatedChat = await chatModel.findOneAndUpdate(
        {roomId:roomId},
        { lastMessage: message },
        { new: true }
      );
      // getSocketInstance()?.to(roomId).emit("newMessage",newMessage);
      return {
        message: "Message sent successfully",
        status: 200,
        chatMessage: newMessage,
      };
    } catch (error) {
      console.error(error);
      return {
        message: "Internal Server Error",
        status: 500,
        chatMessage: null,
      };
    }
  }
  async getMessagesRepository(
    roomId: string,role:string
  ): Promise<{
    message: string;
    status: number;
    messages: MessageInterface[] | null;
  }> {
    try {
      const messages = await messageModel.find({roomId: roomId}).sort({createdAt: 1})
        return{
            message: "Messages found successfully",
            status: 200,
            messages: messages,
        }
    } catch (error) {
        console.error(error);
      return {
        message: "Internal Server Error",
        status: 500,
        messages: null,
      }
    }
  }
  async getConversationsRepository(
    Id: string,role:string
  ): Promise<{ message: string; status: number; chat: Chat[] | null }> {
    try {
      let conversations: Chat[] = [];
      if(role==="rider"){
        conversations = await chatModel
        .find({
          user: Id,
        })
        .populate({
          path: "driver",
          select: "name profile email",
        }).populate({
          path:"user",
          select: "_id name profile email",
        })
        .sort({ updatedAt: -1 });
      }else if(role === "host"){
        conversations = await chatModel
        .find({
          driver: Id,
        })
        .populate({
          path: "driver",
          select: "name profile email",
        }).populate({
          path:"user",
          select: "_id name profile email",
        })
        .sort({ updatedAt: -1 });
      }
      
      return {
        message: "Conversations found successfully",
        status: 200,
        chat: conversations,
      };
    } catch (error) {
      console.error(error);
      return {
        message: "Internal Server Error",
        status: 500,
        chat: null,
      };
    }
  }
  async getChatRepository(
    userId: string,
    driverId: string
  ): Promise<{ message: string; status: number; chat: Chat | null }> {
    try {
      let chat = await chatModel.findOne({ user: userId, driver: driverId });
      if (!chat) {
        let roomId = generateRandomString(16);
        chat = new chatModel({
          user: userId,
          driver: driverId,
          roomId: roomId,
        });
        await chat.save();
      }
      return {
        message: "Chat found successfully",
        status: 200,
        chat,
      };
    } catch (error) {
      return {
        message: "Internal Server Error",
        status: 500,
        chat: null,
      };
    }
  }
}
