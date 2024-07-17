import { Document, ObjectId } from "mongoose";

export default interface User extends Document {
    name?: string;
    email?: string;
    phone?:string;
    password?:string;
    verified?: boolean;
    created_at?:Date;
    updated_at?:Date;
    profile?:string;
    role?:string;
    otp?:string;
    blocked?:boolean;
    documents?:{
        url:string;
        type: string;
    };
}
