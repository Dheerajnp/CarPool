import { model, Schema, Document } from "mongoose";

const chatSchema = new Schema(
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
        }
    },
    {timestamps:true}
)

const chatModel = model('chat',chatSchema);
export default chatModel;