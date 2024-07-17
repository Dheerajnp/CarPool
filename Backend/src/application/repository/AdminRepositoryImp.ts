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
export class AdminRepositoryImp implements AdminRepository{
async licenseStatusRepository(id: string, licenseStatus: string): Promise<{ message: string; status: number; }> {
        try{
            let user = await userModel.findById(id);
            if(!user){
                return{
                    message:"User not found",
                    status:401
                }
            }
            if(licenseStatus==='approved'){
                await userModel.findByIdAndUpdate(id, { licenseStatus: licenseStatus,verified:true });
            return {
                message:"license status updated",
                status:200
            }
            }else{
                await userModel.findByIdAndUpdate(id, { licenseStatus: licenseStatus });
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
  async userBlockUnblock(id: string, block: string): Promise<{ users: User | null; message: string; status: number; }> {
        try {
            let user;
            if(block=='false'){
                user = await userModel.findByIdAndUpdate(id,{blocked: true},{new:true});
            }else{
                user = await userModel.findByIdAndUpdate(id,{blocked: false},{new:true});
            }
            return { users: user, message: 'User status updated successfully', status: 200 };
        } catch (error) {
            console.log(error);
            return{users:null,message:"Error in updating",status:500}
        }
    }
    async findAllUsers(query: any, page: number, limit: number): Promise<{ users: User[];usertotal:number,drivers:DriverType[];drivertotal:number }> {
        try {
            let users =await userModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
            let total = await userModel.countDocuments(query);
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