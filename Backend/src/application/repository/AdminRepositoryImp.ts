import AdminModel from "../../frameworks/database/models/adminSchema";
import { AdminType } from "../../presentation/interfaces/AdminInterface";
import * as CommonFunctions from "../functions/commonFunctions"
import bcrypt from "bcryptjs"
import { configuredKeys } from "../../config/config";
import jwt, { TokenExpiredError }from 'jsonwebtoken'
import userModel from "../../frameworks/database/models/userSchema";
import driverModel from "../../frameworks/database/models/driverSchema"
import { AdminRepository } from "../interfaces/repository/AdminRepository";
import User from "../../entities/interfaces/UserInterface";
import { DriverType } from "../../presentation/interfaces/DriverInterface";
import Driver from "../../entities/interfaces/DriverInterface";
export class AdminRepositoryImp implements AdminRepository{
    async acceptDocumentRepo(userId: string): Promise<{ status: number; message: string; }> {
        try {
            const user = await userModel.findById(userId);
            if(!user) {
                return{
                    status:402,
                    message:"No User Found"
                }
            }

            if(user.documents){
                user.documents.status = 'verified'
                user.verified = true;
            }

            await user.save();

            return{
                status:200,
                message:"Document Rejected"
            }
        } catch (error) {
            console.error('Error rejecting vehicle:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
    async rejectDocumentRepo(userId: string): Promise<{ status: number; message: string; }> {
        try {
            const user = await userModel.findById(userId);
            if(!user) {
                return{
                    status:402,
                    message:"No User Found"
                }
            }

            if(user.documents){
                user.documents.status = 'rejected'
            }

            await user.save();

            return{
                status:200,
                message:"Document Rejected"
            }
        } catch (error) {
            console.error('Error rejecting vehicle:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
    async rejectVehicleRepo(driverId: string, vehicleId: string): Promise<{ status: number; message: string; }> {
        try{
            const driver = await driverModel.findById(driverId);
            if (!driver) {
                return{
                    status:404,
                    message:"Driver not found"
                }
            }

            const vehicle = driver.vehicles?.find((v: any) => v._id.toString() === vehicleId);
            if (!vehicle) {
              return { status: 404, message: 'Vehicle not found' };
            }
            // Update the vehicle status to 'approved'
            vehicle.status = 'rejected';
        
            // Save the driver document with the updated vehicle status
            await driver.save();
        
            return { status: 200, message: 'Vehicle rejected successfully' };
        }catch(error){
            console.error('Error rejecting vehicle:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
    async approveVehicleRepo(driverId: string, vehicleId: string): Promise<{ status: number; message: string; }> {
        try{
            const driver = await driverModel.findById(driverId);
            if (!driver) {
                return{
                    status:404,
                    message:"Driver not found"
                }
            }

            const vehicle = driver.vehicles?.find((v: any) => v._id.toString() === vehicleId);
            if (!vehicle) {
              return { status: 404, message: 'Vehicle not found' };
            }
            // Update the vehicle status to 'approved'
            vehicle.status = 'approved';
        
            // Save the driver document with the updated vehicle status
            await driver.save();
        
            return { status: 200, message: 'Vehicle approved successfully' };
        }catch(error){
            console.error('Error approving vehicle:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
    async getPendingVehicleRepo(query: any, page: number, limit: number): Promise<{ status: number; driver: Driver[] | null; driverPage: number; }> {
        try {
            const drivers = await driverModel
            .find({
              ...query,
              'vehicles.status': 'pending',
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(); // Convert Mongoose documents to plain JavaScript objects
      
          // Calculate total number of pages
          const totalDrivers = await driverModel.countDocuments({
            ...query,
            'vehicles.status': 'pending',
          });
          const driverPage = Math.ceil(totalDrivers / limit);

          return{
            status:200,
            driver:drivers,
            driverPage
          }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async FindAllPendingDriversRepo(page: number, limit: number, searchQuery: any): Promise<{ drivers: Driver[]; drivertotal: number; pagesDriver: number; }> {
        try {
            const drivers = await driverModel
            .find({
              ...searchQuery,
              licenseStatus:'pending',
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(); // Convert Mongoose documents to plain JavaScript objects
      
          // Calculate total number of pages
          const totalDrivers = await driverModel.countDocuments({
            ...searchQuery,
              licenseStatus:'pending',
          });
          const driverPage = Math.ceil(totalDrivers / limit);

          return{
            drivertotal:totalDrivers,
            drivers:drivers,
            pagesDriver: driverPage
          }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getUsersPending(query: any, page: number, limit: number): Promise<{ status:number;user:User[]|null,userPage:number }> {
        try{
            console.log(query,page,limit);
            const updatedQuery = {
                ...query,
                'documents.status': 'pending'
              };
          
            let users = await userModel.find(updatedQuery)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

                let total = await userModel.countDocuments(updatedQuery);    
                const pagesUser = Math.ceil(total/limit); 
                console.log("asdfghj",pagesUser)
          return {
                user:users,
                userPage:pagesUser,
                status:200
            }
        }catch(error){
            console.log(error);
            throw error;
        }
    }
async licenseStatusRepository(id: string, licenseStatus: string): Promise<{ message: string; status: number; }> {
        try{

            let user = await driverModel.findById(id);
            if(!user){
                return{
                    message:"User not found",
                    status:401
                }
            }
            if(licenseStatus==='approved'){
                await driverModel.findByIdAndUpdate(id, { licenseStatus: licenseStatus,verified:true });
            return {
                message:"license status updated",
                status:200
            }
            }else{
                await driverModel.findByIdAndUpdate(id, { licenseStatus: licenseStatus });
            return {
                message:"license status updated",
                status:200
            }
            }
            
        }catch(error){
            console.log(error);
            return{
                message:"Something wrong with updation",
                status:500
            }
        }
    }
    async  userBlockUnblock(id: string, block: string, role: string): Promise<{ users: User | null; message: string; status: number; }> {
        try {
            let user;
            const isBlocked = block === 'false';
            const update = { blocked: isBlocked };
    
            if (role === 'rider') {
                user = await userModel.findByIdAndUpdate(id, update, { new: true });
            } else if (role === 'host') {
                user = await driverModel.findByIdAndUpdate(id, update, { new: true });
            } else {
                return { users: null, message: 'Invalid role specified', status: 400 };
            }
    
            return { users: user, message: 'User status updated successfully', status: 200 };
        } catch (error) {
            console.log(error);
            return { users: null, message: 'Error in updating', status: 500 };
        }
    }
    
    async findAllUsers(query: any, page: number, limit: number): Promise<{ users: User[];usertotal:number,drivers:DriverType[];drivertotal:number }> {
        try {
            const userQuery = { ...query, 'documents.status': 'pending' };

            let users =await userModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
            let total = await userModel.countDocuments(query);
            const driverQuery = { ...query, licenseStatus: 'pending' };

            let drivers = await driverModel.find(query).skip((page -1)* limit)
            .limit(limit)
            .exec();
            let drivertotal = await driverModel.countDocuments(query);
            return{
                users,
                usertotal:total,
                drivers,
                drivertotal
            }
        } catch (error) {
          console.error(error);
          throw Error
        }
      }
   async adminVerify(adminToken: string): Promise<{ user: AdminType | null; message: string | null; status: number; }> {
        try {
            let splitToken = adminToken.split(" ")[1];
            const decodedToken = jwt.verify(splitToken,configuredKeys.JWT_SECRET_KEY) as {
                adminID: string
            }
            console.log(decodedToken)
            const admin_id = decodedToken.adminID
            const admin = await AdminModel.findById(admin_id);
            if(!admin){
                return{
                    message:"Invalid token or User",
                    status:403,
                    user:null
                } 
            }
            return{
                message: 'Verified Succesfully',
                status: 200,
                user: admin
            }
        } catch (error) {
            console.error(`Error verifying token: ${error}`);
        if (error instanceof TokenExpiredError) {
            return {
                user:null,
                status:401,
                message:"Token Expired"
            };
        } else {
            return {
                status: 500,
                user: null,
                message:'Internal server error'
            };
        }
        }
    }
    async  findAdminByCredentials(credentials: { email: string, password: string; }): Promise<{ user: AdminType | null; message: string | null; status: number | null; token: string | null; refreshToken : string | null}> {
        try {
            const { email, password } = credentials;
            const admin =await AdminModel.findOne({ email:email});
            let token = '';
            let  message = '';
            let refreshToken = '';
            if(!admin){
                message = "Admin credentials not found";
            }else{
                const isMatch = await bcrypt.compare(password,admin.password);
                console.log("isssssssssssssmatch",isMatch)
                if(!isMatch){
                    console.log("incorrect password.........................")
                    message = "Incorrect password"
                }else{
                    token =  CommonFunctions.jwtGenerateAdminToken(admin._id.toString());
                     refreshToken = CommonFunctions.jwtGenerateAdminRefreshToken(admin._id.toString())
                    return {user:admin,token,message:"Login successfull",status:200 , refreshToken}
                }
            }
            return{user:null ,message,token,status:400,refreshToken }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}