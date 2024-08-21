import { model, Schema, Document } from "mongoose";

const messageSchema = new Schema({
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