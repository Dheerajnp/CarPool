import User from "../../../entities/interfaces/UserInterface";
import { AdminType } from "../../../presentation/interfaces/AdminInterface";
import { DriverType } from "../../../presentation/interfaces/DriverInterface";
export interface AdminRepository{
    findAdminByCredentials(credentials:{email:string, password:string}):Promise<{user:AdminType|null,message:string|null,status:number|null,token:string|null,refreshToken:string|null}>
    adminVerify(adminToken:string):Promise<{user: AdminType|null ,message:string|null,status:number}>
    findAllUsers(query: any, page: number, limit: number): Promise<{ users: User[];usertotal:number,drivers:DriverType[];drivertotal:number }> 
    userBlockUnblock(id : string , block : string):Promise<{users : User | null,message:string,status:number}>
    licenseStatusRepository(id: string, licenseStatus: string): Promise<{ message: string; status: number; }>
}