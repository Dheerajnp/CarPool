import { Document, ObjectId } from "mongoose";

export default interface Driver extends Document {
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
    licenseStatus?:string;
    licenseBackUrl?:string;
    licenseFrontUrl?:string;
    vehicles?: Array<{
        brand: string;
        model: string;
        rcDocumentUrl: string;
        status: string;
    }>;
}
