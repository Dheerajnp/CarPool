
export interface Admin{
    name: string;
    email: string;
    password: string;
    _id:string;
    profile?:string;
}

export interface AdminAuthState{
    admin: Admin|null;
    loading: boolean;
    error:string[];
    message:string;
}

export interface AdminLoginCredentials{
    email: string;
    password: string;
}

export interface AdminLoginResponse{
    message: string;
    status: number;
    admin?: any;
    token?:string;
}

export interface AdminAuthVerifyData { 
    adminToken:string;
}

export interface AdminAuthVerifyResponse {
    user?:any;
    status:number;
    message:string;
}

