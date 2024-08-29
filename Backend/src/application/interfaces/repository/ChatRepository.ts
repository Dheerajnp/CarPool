import Chat from "../../../entities/interfaces/ChatInterface";
import MessageInterface from "../../../entities/interfaces/MessageInterface";

export interface ChatRepository{
    getChatRepository(userId: string, driverId: string):Promise<{message:string,status:number,chat:Chat|null}>
    getConversationsRepository(Id:string,role:string):Promise<{message:string,status:number,chat:Chat[]|null}>
    getMessagesRepository(roomId:string,role:string):Promise<{message:string,status:number,messages:MessageInterface[]|null}>
    sendMessageRepository(roomId:string,senderId:string,message:string):Promise<{message:string,status:number,chatMessage:MessageInterface|null}>
}