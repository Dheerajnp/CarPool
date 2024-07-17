import { Document, ObjectId } from "mongoose";

export default interface TempUser extends Document {
    name?: string;
    email?: string;
    phone?:string;
    password?:string;
    created_at?:Date;
    updated_at?:Date;
    otp?:string;
    expiresAt?:Date;
    role?:string;
    verified?:boolean;
}

