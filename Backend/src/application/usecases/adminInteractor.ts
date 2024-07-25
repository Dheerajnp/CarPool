import Driver from "../../entities/interfaces/DriverInterface";
import User from "../../entities/interfaces/UserInterface";
import { AdminType } from "../../presentation/interfaces/AdminInterface";
import { DriverType } from "../../presentation/interfaces/DriverInterface";
import { UserType } from "../../presentation/interfaces/UserInterface";
import { AdminRepository } from "../interfaces/repository/AdminRepository";
import {AdminInteractor} from "../interfaces/usecases/AdminInteractor"


export class adminInteractorImp implements AdminInteractor{
    constructor (private readonly repository: AdminRepository){}
    async acceptDocumentInteractor(userId: string): Promise<{ status: number; message: string; }> {
        try{
            const { message,status } = await this.repository.acceptDocumentRepo(userId);
            return {
                status,
                message
            }
        }catch(error){
            console.log(error);
            return{
                status:500,
                message:"Internal server Error!"
            }
        }
    }
    async rejectDocumentInteractor(userId: string): Promise<{ status: number; message: string; }> {
        try{
            const { message,status } = await this.repository.rejectDocumentRepo(userId);
            return {
                status,
                message
            }
        }catch(error){
            console.log(error);
            return{
                status:500,
                message:"Internal server Error!"
            }
        }
    }
    async rejectVehicleInteractor(driverId: string, vehicleId: string): Promise<{ status: number; message: string; }> {
        try{
            const { message,status } = await this.repository.rejectVehicleRepo(driverId,vehicleId);
            return {
                status,
                message
            }
        }catch(error){
            console.log(error);
            return{
                status:500,
                message:"Internal server Error!"
            }
        }
    }
    async approveVehicleInteractor(driverId: string, vehicleId: string): Promise<{ status: number; message: string; }> {
        try{
            const { message,status } = await this.repository.approveVehicleRepo(driverId,vehicleId);
            return {
                status,
                message
            }
        }catch(error){
            console.log(error);
            return{
                status:500,
                message:"Internal server Error!"
            }
        }
    }
    async getPendingVehiclesInteractor(query: any, page: number, limit: number): Promise<{ status: number; driver: Driver[] | null; driverPage: number; }> {
        try {
            const searchQuery = query ? {
                $or: [
                  { name: new RegExp(query, 'i') },
                  { email: new RegExp(query, 'i') },
                ],
              } : {};
            const result = await this.repository.getPendingVehicleRepo(searchQuery, page, limit);
            return result;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
   async FindAllPendingDriversInteractor(page: number, limit: number, searchQuery: string): Promise<{ drivers: Driver[]; drivertotal: number; pagesDriver: number; }> {
        try {
            let query = searchQuery ? {name: new RegExp(searchQuery,'i'),email:new RegExp(searchQuery,'i')}: {};
            const result = await this.repository.FindAllPendingDriversRepo(page,limit,query);
            
            return result;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
    async pendingUserDocsInteractor(query: any, page: number, limit: number): Promise<{ status:number;user:User[]|null,userPage:number }> {
        try {
            const searchQuery = query ? { name: new RegExp(query, 'i') } : {};
            const result = await this.repository.getUsersPending(searchQuery, page, limit);
            
            return result;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
   
    async licenseStatusInteractor(id: string, licenseStatus: string): Promise<{ message: string; status: number; }> {
        try {
            const { message,status } = await this.repository.licenseStatusRepository(id, licenseStatus);
            return {
                message,
                status
            }
        } catch (error) {
            console.log(error);
            return{
                message:"Internal server error",
                status:500
            }
        }
    }
    async actionInteractor(id: string, block: string,role:string): Promise<{ users: User | null; message: string; status: number; }> {
        console.log("User Actions interactor");
        try {
            const { users, message, status } = await this.repository.userBlockUnblock(
                id,
                block,
                role
              );
              return { users, message,status };
        } catch (error) {
            console.log(error);
            return{
                users:null,
                status:500,
                message:"Error updating the user"
            }
        }
    }
    async FindAllUsersInteractor(page: number, limit: number, searchQuery: string): Promise<{ users: User[] ;usertotal:number;pagesUser:number,pagesDriver:number,drivers:DriverType[] }> {
        try {
            const query = searchQuery ? { name: new RegExp(searchQuery, 'i') } : {};
            const { users,drivers,drivertotal,usertotal } = await this.repository.findAllUsers(query,page,limit);
            const pagesUser = Math.ceil(usertotal/limit);
            const pagesDriver = Math.ceil(drivertotal/limit);
            return{
                usertotal,
                users,
                pagesUser,
                pagesDriver,
                drivers
            }
        } catch (error:any) {
            console.log(error);
            throw new Error(`Failed to get user list: ${error.message}`)
        }
    }
   async AdminVerifyInteractor(adminToken: string): Promise<{ user?: AdminType | null | undefined; message: string | null; status: number; }> {
        try{
            console.log("AdminVerifyInteractor",adminToken)
            const {message,status,user} = await this.repository.adminVerify(adminToken)
            if (status === 200) {
                return { user, message: 'Admin verified successfully', status: 200 };
              } else {
                // If the admin verification fails, return a null user, an error message, and the corresponding status code
                return { user: null, message, status };
              }
            } catch (error) {
              console.error(error);
              // If an error occurs during the verification process, return a null user, an error message, and a 500 status code
              return { user: null, message: 'An error occurred while verifying the admin', status: 500 };
            }
    }
    async AdminLogin(credentials: { email: string; password: string; }): Promise<{ message: string|null; status: number; user: AdminType | undefined | null; token: string | null;refreshToken : string | null}> {
        try{
            const {user,message,token,status,refreshToken} = await this.repository.findAdminByCredentials(credentials);
            if(!user){
                return{
                    user:null,
                    message:message,
                    token,
                    refreshToken,
                    status:402
                }
            
            }
            return {
                user,
                message,
                token,
                status:200,
                refreshToken
            }
        }catch(error){
            console.log(error);
            throw error;
        }
    }
}