import { model,Schema,Types } from "mongoose";
import User from "../../../entities/interfaces/UserInterface";
import path from "path";

const defaultProfilePicPath = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=740&t=st=1727417465~exp=1727418065~hmac=f5612e9180ed0edf5119919a1c14bb10eafca2b4275724390805024c73119b51";

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
        default: defaultProfilePicPath,
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
            enum:["pending","verified","rejected"],
        }
    }
});

const userModel =  model<User>("User", userSchema);
export default userModel;