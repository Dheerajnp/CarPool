import Driver from "../../entities/interfaces/DriverInterface";
import { DriverRepository } from "../interfaces/repository/DriverRepository";
import { DriverInteractor } from "../interfaces/usecases/driverInteractor";

export class driverInteractorImp implements DriverInteractor{
    constructor(private readonly repository: DriverRepository){}
    async deleteVehicleInteractor(vehicleId: string, driverId: string): Promise<{ message: string; status: number; }> {
        try {
            const result = await this.repository.deleteVehicleRepository(vehicleId, driverId);
            return result;
        } catch (error) {
            console.log(error);
            return {
                message: 'Internal Server Error',
                status: 500
            }
        }
    }
    async addVehicleInteractor(data: { brand: string; model: string; driverId: string; rcDocumentUrl: string; vehicleNumber: string; }): Promise<{ status: number; message: string;driver:Driver|null }> {
        try {
            const result = await this.repository.addVehicleRepository(data);
            return result;
        } catch (error) {
            return {
                message: 'Internal Server Error',
                status: 500,
                driver: null
            }
        }
    }
    async editDriverInfoInteractor(data: { name: string; phone: string; driverId: string; }): Promise<{ message: string; status: number; }> {
        try {
            const result = await this.repository.editDriverInfoRepository(data);
            return result;
        } catch (error) {
            return {
                message: 'Internal Server Error',
                status: 500
            }
        }
    }
    async saveLicenseInfoInteractor(data: { driverId: string; licenseBackUrl: string; licenseFrontUrl: string; }): Promise<{ message: string; status: number; driver: Driver | null; }> {
        try {
            const result = await this.repository.saveLicenseInfoRepository(data);
            return result;
        } catch (error) {
            return {
                message: 'Internal Server Error',
                status: 500,
                driver:null
            }
        }
    }
   async getDriverInteractor(data: { driverId: string; }): Promise<{ user: Driver | null; message: string; status: number; }> {
       try {
        console.log("interactor")
            const result = await this.repository.getDriverRepository(data);
            return result;
       } catch (error) {
            return {
                user:null,
                message: 'Internal Server Error',
                status: 500
            }
       }
    }
   async licenseUploadInteractor(data: { userId: string; licenseFrontUrl: string; licenseBackUrl: string; vehicleBrand: string; vehicleModel: string; vehicleNumber:string; rcDocumentUrl: string; }): Promise<{ message: string; status: number; }> {
    console.log("licenseUploadInteractor",data)
    try {
            const result = await this.repository.licenseUpload(data);
            return result;
        } catch (error) {
            return {
                message: 'Internal Server Error',
                status: 500
            }
        }
    }
    
}