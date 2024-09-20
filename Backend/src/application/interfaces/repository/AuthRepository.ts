import Driver from "../../../entities/interfaces/DriverInterface";
import TempUser from "../../../entities/interfaces/tempUserInterface";
import User from "../../../entities/interfaces/UserInterface";

export interface AuthRepository{
    userSave(userInfo:{  name: string, password: string, email: string,role:string}):Promise<{message:string,user:TempUser|null,status:number}>;
    verifyOtp(tempId: string, enteredOtp: string): Promise<{user:User|Driver|null,message:string,status:number}>;
    findByCredentials(userCredentials: {email: string, password: string, role:string}): Promise<{user :User | Driver | null,message:string | null,token:string | null, refreshToken:string | null}>;
    googleCredentialsCreate(credentials:{email:string,name:string,password:string,role:string}):Promise<{message:string,status:number,user:User|null,token:string|null,refreshToken:string|null}>
    
    userForgotPassword(email: string,role:string): Promise<{ message: string; user: Driver | User | null; status: number; }>
    verifyOtpforgotPassword(data: { email: string; otp: string;role:string; }): Promise<{ message: string; status: number; user: Driver | User | null }>
    resetPasswordRepository(data: { email: string; password: string; role:string; }): Promise<{ message: string; status: number; }>
}