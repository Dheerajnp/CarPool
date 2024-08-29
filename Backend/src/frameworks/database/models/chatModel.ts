import { model, Schema, Document } from "mongoose";
import Chat from "../../../entities/interfaces/ChatInterface";

const chatSchema = new Schema<Chat>(
    {
        roomId:{
            type: String,
            required:true
        },
        user:{
            type: Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        driver:{
            type: Schema.Types.ObjectId,
            ref:'Driver',
            required:true
        },
        lastMessage:{
            type: String,
        }
    },
    {timestamps:true}
)

const chatModel = model('chat',chatSchema);
export default chatModel;