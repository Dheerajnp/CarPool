import { model,Schema,Types } from "mongoose";
 import User from "../../../entities/interfaces/UserInterface";

const userSchema = new Schema<User>({
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
    profile: {
        type: String,
    },
    role:{
        type:String,
        enum:['rider','host']
    },
    otp:{
        type:String
    },
    blocked:{
        type:Boolean,
        default:false
    },
    documents:{
        url: {
            type: String,
        },
        type: {
            type: String,
        },
        status:{
            type: String,
            enum:["pending","verified","rejected"]
        }
    }
});

const userModel =  model<User>("User", userSchema);
export default userModel;