import { ChatIntercator } from "../../application/interfaces/usecases/ChatInteractor";
import { RequestHandler } from "express"

export class chatController{
    constructor(private readonly interactor:ChatIntercator){}

    getChat:RequestHandler = async(req,res)=>{
        const { userId } = req.params;
        const { driverId } = req.query;
        try {
            const result = await this.interactor.getChatInteractor(userId,driverId as string);
            return res.status(result.status).json({result});
        } catch (error) {
            return res.status(500).json({error});
        }
    }

    getConversations:RequestHandler = async(req,res)=>{
        const { Id } = req.params;
        const  role  = req.role;
        console.log(role)
        try {
            const result = await this.interactor.getConversationsInteracator(Id,role as string);
            return res.status(result.status).json({result});
        } catch (error) {
            return res.status(500).json({error});
        }
    }

    getMessages:RequestHandler = async(req,res)=>{
        const { roomId } = req.params;
        const role = req.role;
        try {
            const result = await this.interactor.getMessagesInteractor(roomId,role as string);
            return res.status(result.status).json({result});
        } catch (error) {
            return res.status(500).json({error});
        }
    }

    sendMessage:RequestHandler = async(req,res)=>{
        const { senderId } = req.params;
        const { roomId,message } = req.body;
        try {
            const result = await this.interactor.sendMessageInteractor(roomId,senderId,message);
            return res.status(result.status).json({result});
        } catch (error) {
            return res.status(500).json({error});
        }
    }
}