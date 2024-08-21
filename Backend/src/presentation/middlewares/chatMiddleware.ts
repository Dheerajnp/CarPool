import { RequestHandler } from "express"
import chatModel from "../../frameworks/database/models/chatModel";
import { generateRandomString } from '../../application/functions/commonFunctions'

export const getChat:RequestHandler = async(req,res)=>{
    const { userId } = req.params;
    const { driverId } = req.query;
    try {
        let chat = await chatModel.findOne({user:userId,driver:driverId});
        console.log(chat)
        if(!chat){
            let roomId = generateRandomString(16)
            chat = new chatModel({user:userId,driver:driverId,roomId:roomId});
            await chat.save();
        }
        return res.status(200).json({chat});
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"})
    }
}