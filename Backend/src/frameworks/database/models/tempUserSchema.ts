import { model,Schema,Types } from "mongoose";
 import TempUser from "../../../entities/interfaces/tempUserInterface";

const tempUserSchema = new Schema<TempUser>({
    name: {
        type: String,
       
    },
    email: {
        type: String,
       
    },
    phone: {
        type: Number,
       
    },
    password: {
        type: String,
       
    },
    verified: {
        type: Boolean,
        default:false
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
    otp:{
        type:String,
        default:""
    },
    role:{
        type:String,
        enum:['rider','host']
    }
});

const tempUserModel =  model<TempUser>("TempUser", tempUserSchema);
export default tempUserModel;