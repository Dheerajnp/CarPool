import Chat from "../../entities/interfaces/ChatInterface";
import MessageInterface from "../../entities/interfaces/MessageInterface";
import { ChatRepository } from "../interfaces/repository/ChatRepository";
import { ChatIntercator } from "../interfaces/usecases/ChatInteractor";

export class chatInteractorImp implements ChatIntercator{
    constructor(private readonly repository: ChatRepository){}
    async sendMessageInteractor(roomId: string, senderId: string, message: string): Promise<{ message: string; status: number; chatMessage: MessageInterface|null; }> {
        try{
            const result = await this.repository.sendMessageRepository(roomId,senderId,message)
            return result;
        }catch(error){
            console.log(error);
            return{
                message:"Internal Server Error",
                status:500,
                chatMessage:null
            }
        }
    }
    async getMessagesInteractor(roomId: string,role:string): Promise<{ message: string; status: number; messages: MessageInterface[] | null; }> {
        try {
            const messages = await this.repository.getMessagesRepository(roomId,role);
            return messages;
        } catch (error) {
            console.log(error);
            return {
                message: 'Internal Server Error',
                status: 500,
                messages: null
            }
        }   
    }
    async getConversationsInteracator(Id: string,role:string): Promise<{ message: string; status: number; chat: Chat []| null; }> {
        
        try {
            const chat = await this.repository.getConversationsRepository(Id,role);
            return chat;
        } catch (error) {
            console.log(error);
            return {
                message: 'Internal Server Error',
                status: 500,
                chat: null
            }
        }
    }
    async getChatInteractor(userId: string, driverId: string): Promise<{ message: string; status: number; chat: Chat|null; }> {
        try {
            const chat = await this.repository.getChatRepository(userId, driverId);
            return chat;
        } catch (error) {
            console.log(error);
            return {
                message: 'Internal Server Error',
                status: 500,
                chat: null
            }
        }
    }
}