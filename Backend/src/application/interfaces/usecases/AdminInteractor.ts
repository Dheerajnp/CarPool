
import User from "../../../entities/interfaces/UserInterface";
import { AdminType } from "../../../presentation/interfaces/AdminInterface";
import { DriverType } from "../../../presentation/interfaces/DriverInterface";

export interface AdminInteractor{
    AdminLogin(credentials:{email:string, password:string}) : Promise<{message: string|null , status: number, user?:AdminType|null, token:string | null, refreshToken:string | null } >
    AdminVerifyInteractor(adminToken:string):Promise<{user?:AdminType|null,message:string|null,status:number}>
    FindAllUsersInteractor(page: number, limit: number, searchQuery: string): Promise<{ users: User[] ;usertotal:number;pagesUser:number,pagesDriver:number,drivers:DriverType[] }>
    actionInteractor(id : string , block : string):Promise<{users : User | null , message : string, status:number}>
    licenseStatusInteractor(id:string,licenseStatus:string):Promise<{message:string,status:number}>
}