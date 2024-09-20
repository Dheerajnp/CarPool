import TempUser from "../../../entities/interfaces/tempUserInterface";
import User from "../../../entities/interfaces/UserInterface";
import Driver from "../../../entities/interfaces/DriverInterface"
    

export interface authInteractor{
    createUser(userData:{email:string,password:string,name:string,role:string}):Promise<{message: string , status: number, user:TempUser|null}>
    verifyOtpAndSave(enteredOtp:string,tempId:string):Promise<{user:User|Driver|null,message:string,status:number}>;
    loginInteractor(credentials:{email:string,password:string,role:string}): Promise<{user :User | Driver | null,message:string | null,token:string | null, refreshToken:string | null}>;
    googleLoginInteractor(credentials:{email:string,name:string,password:string,role:string}):Promise<{message:string,status:number,user:User|null,token:string|null,refreshToken:string|null}>

    forgotPasswordInteractor(email:string,role:string):Promise<{message:string;user:Driver | null |User,status:number}>;
    verifyOtpforgotPasswordInteractor(email:string,otp:string,role:string):Promise<{user:User|null|Driver, message: string, status: number }>;
    resetPasswordInteractor(email:string,password:string,role:string):Promise<{message:string,status:number}>;
}