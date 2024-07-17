import { Document } from "mongodb";

export default interface Admin extends Document{
    name:string;
    email:string;
    password:string;
    phone:string;
    profile:string;
}