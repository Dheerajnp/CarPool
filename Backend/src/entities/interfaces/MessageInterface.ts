import mongoose, { Document } from "mongoose";

export default interface MessageInterface extends Document{
    roomId: string;
    senderId:mongoose.Schema.Types.ObjectId;
    message:string;
    seen:boolean;
}