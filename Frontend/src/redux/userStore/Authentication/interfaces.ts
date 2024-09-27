export interface User {
    id:string;
    _id:string;
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
        url?:string;
        type?: string;
        status?:string
    };
}

export interface Driver{
    id:string;
    _id:string;
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
    vehicles?:[Vehicle]
}

export interface Vehicle{
    _id: string;
    brand: string;
    model: string;
    rcDocumentUrl:string;
    number:string;
    status:string;
}
export interface  RegisterCredentials{
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface RegisterResponse {
    message: string;
    user:User|Driver;
    status:boolean;
}

export interface AuthState {
    user: User | null | Driver;
    loading: boolean;
    error: string[];
    message: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    role: string;
}

export interface LoginResponse {
    message: string,
    status: number;
    user?: any;
    token?:string;
}

export interface AuthVerifyUserResponse {
    message: string;
    user?: any;
    status: number;
}

export interface AuthVerifyUser {
    token: string;
}

export interface ForgotPasswordResponse {
    message: string;
    user?: any;
    status: number;    
}

export interface ForgotPasswordCredentials {
    email:string;
    role:string;
}

export interface OtpForgotPwd {
    otp:string;
    email:string;   
    role:string;   
}

export interface OtpForgotPwdResponse {
    message:string;
    status:number;
    user:User | null | Driver;
}

export interface ResetPasswordResponse {
    message:string;
    status:number;
    role:string;
}

export interface ResetPasswordCredentials {
    password:string;
    email:string;
    role:string;
}

export interface GoogleSignUpCredentials{
    name:string;
    email:string;
    password:string;    
    role:string;
}

export interface GoogleSignUpResponse{
    message:string;
    status:number;
    user:User|Driver;
    token:string|null;
    refreshToken:string|null;
}

export interface UploadLicenseCredentials {
    userId:string;
    licenseFrontUrl:string;
    licenseBackUrl:string;
}

export interface UploadLicenseResponse {
    message: string;
    user:Driver;
    status:number;
}
export interface VerifyOtpResponse{
    message: string;
    user?: any;
    status: number;
    token:string;
    refreshToken:string;
}

export interface VerifyOtpCredentials{
    otp: string;
    savedId: string;      
}