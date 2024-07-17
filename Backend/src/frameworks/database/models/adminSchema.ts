

import { Schema,model } from "mongoose";
import Admin from "../../../entities/interfaces/adminInterface";

const AdminSchema = new Schema<Admin>({
    name: {
        type: String,
       
    },
    email: {
        type: String,
       
    },
    password: {
        type: String,
       
    },
    phone: {
        type: String,
       
    },
    profile:{
        type:String,
        default:''
    }
});

const AdminModel = model<Admin>('Admin',AdminSchema);
export default AdminModel;