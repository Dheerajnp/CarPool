import mongoose, { Document } from "mongoose";


export default interface Chat extends Document{
    roomId: string;
    user:mongoose.Schema.Types.ObjectId;
    driver: mongoose.Schema.Types.ObjectId;
    lastMessage:string;
}