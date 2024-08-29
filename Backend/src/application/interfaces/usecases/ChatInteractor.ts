import Chat from '../../../entities/interfaces/ChatInterface'
import MessageInterface from '../../../entities/interfaces/MessageInterface'
export interface ChatIntercator{
    getChatInteractor(userId:string,driverId:string):Promise<{message:string,status:number,chat:Chat|null}>
    getConversationsInteracator(Id:string,role:string):Promise<{message:string,status:number,chat:Chat[]|null}>
    getMessagesInteractor(roomId:string,role:string):Promise<{message:string,status:number,messages:MessageInterface[]|null}>
    sendMessageInteractor(roomId:string,senderId:string,message:string):Promise<{message:string,status:number,chatMessage:MessageInterface|null}>
}