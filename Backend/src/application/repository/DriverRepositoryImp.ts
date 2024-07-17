import Driver from "../../entities/interfaces/DriverInterface";
import driverModel from "../../frameworks/database/models/driverSchema";
import { DriverRepository } from "../interfaces/repository/DriverRepository";

export class driverRepositoryImp implements DriverRepository{
   async saveLicenseInfoRepository(data: { driverId: string; licenseBackUrl: string; licenseFrontUrl: string; }): Promise<{ message: string; status: number; driver: Driver | null; }> {
    const { driverId, licenseBackUrl, licenseFrontUrl} = data;
    try { 
         const driver = await driverModel.findByIdAndUpdate(driverId, { licenseBackUrl, licenseFrontUrl,licenseStatus:"pending",verified:false }, {new: true});
         if(!driver) {
             return{    
                 message: "Driver not found",
                 status: 404,
                 driver:null
             }
         }
         return {
             message: 'License info updated successfully',
             status: 200,
             driver
         }
    
   } catch (error) {
        return {
            message: 'Internal Server Error',
            status: 500,
            driver:null
        }
   }
   }
   
   async getDriverRepository(data: { driverId: string; }): Promise<{ user: Driver | null; message: string; status: number; }> {
       try {
        console.log("here",data.driverId)

         const driver = await driverModel.findOne({email:data.driverId});
         console.log(driver)
         if(!driver) {
             return{
                user:null,
                 message: "Driver not found",
                 status: 404
             }
         }
         return {
             user: driver,
             message: 'Driver found successfully',
             status: 200
         }
       } catch (error) {
            return {
                user: null,
                message: 'Internal Server Error',
                status: 500
            }
       }
   }
   async licenseUpload(data: { userId: string; licenseFrontUrl: string; licenseBackUrl: string; vehicleBrand: string; vehiceModel: string;vehicleNumber:string; rcDocumentUrl: string; }): Promise<{ message: string; status: number; }> {
        const { licenseFrontUrl, licenseBackUrl, vehicleBrand, vehiceModel, vehicleNumber, rcDocumentUrl,userId} = data;
        try {
            const driver = await driverModel.findById(userId);
            if(!driver) {
                return{
                    message: "User not found",
                    status: 404
                }
            }
            await driverModel.findByIdAndUpdate(userId,{
                licenseStatus:"pending",
                licenseBackUrl: licenseBackUrl,
                licenseFrontUrl: licenseFrontUrl,
                $push:{
                    vehicles:{
                        brand:vehicleBrand,
                        model:vehiceModel,
                        number:vehicleNumber,
                        rcDocumentUrl:rcDocumentUrl
                    }
                }
            })
            return {
                message: 'License and vehicle details updated successfully',
                status:200
            }
        } catch (error) {
            return {
                message: 'Internal Server Error',
                status: 500
            }
        }
    }

}