
import Driver from "../../../entities/interfaces/DriverInterface";
import User from "../../../entities/interfaces/UserInterface";
import { AdminType } from "../../../presentation/interfaces/AdminInterface";
import { DriverType } from "../../../presentation/interfaces/DriverInterface";

export interface AdminInteractor{
    AdminLogin(credentials:{email:string, password:string}) : Promise<{message: string|null , status: number, user?:AdminType|null, token:string | null, refreshToken:string | null } >
    AdminVerifyInteractor(adminToken:string):Promise<{user?:AdminType|null,message:string|null,status:number}>
    FindAllUsersInteractor(page: number, limit: number, searchQuery: string): Promise<{ users: User[] ;usertotal:number;pagesUser:number,pagesDriver:number,drivers:DriverType[] }>
    FindAllPendingDriversInteractor(page:number, limit: number, searchQuery: string): Promise<{drivers:Driver[];drivertotal:number;pagesDriver:number}>
    actionInteractor(id : string , block : string,role:string):Promise<{users : User | null , message : string, status:number}>
    licenseStatusInteractor(id:string,licenseStatus:string):Promise<{message:string,status:number}>
    pendingUserDocsInteractor(query: any, page: number, limit: number):Promise<{status:number;user:User[]|null,userPage:number}>
    getPendingVehiclesInteractor(query: any, page: number, limit: number):Promise<{status:number;driver:Driver[]|null,driverPage:number}>
    approveVehicleInteractor(driverId:string,vehicleId:string):Promise<{status:number,message:string}>
    rejectVehicleInteractor(driverId:string,vehicleId:string):Promise<{status:number,message:string}>
    rejectDocumentInteractor(userId:string):Promise<{status:number,message:string}>
    acceptDocumentInteractor(userId:string):Promise<{status:number,message:string}>
}