import { model, Schema, Document } from "mongoose";
import MessageInterface from "../../../entities/interfaces/MessageInterface";

const messageSchema = new Schema<MessageInterface>({
    roomId:{
        type:String
    },
    senderId:{
        type: Schema.Types.ObjectId,
        required:true
    },
    message:{
        type:String,
    },
    seen:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

const messageModel = model('message',messageSchema);
export default messageModel;