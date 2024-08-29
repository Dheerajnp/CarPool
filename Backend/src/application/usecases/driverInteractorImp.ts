import Driver from "../../entities/interfaces/DriverInterface";
import { IRide } from "../../entities/interfaces/RideInterface";
import { DriverRepository } from "../interfaces/repository/DriverRepository";
import { DriverInteractor, RideInterface } from "../interfaces/usecases/driverInteractor";

export class driverInteractorImp implements DriverInteractor{
    constructor(private readonly repository: DriverRepository){}
    async requestDenyInteractor(rideId: string,passengerId:string): Promise<{ status: number; message: string;rideDetails:IRide|null }> {
        try {
            const response = await this.repository.requestDenyRepository(rideId,passengerId);
            return response;
        } catch (error) {
            console.log(error);
            return {
                status: 400,
                message: 'Something went wrong',
                rideDetails:null
            }
        }
    }
    async requestAcceptInteractor(rideId: string,passengerId:string): Promise<{ status: number; message: string;rideDetails:IRide|null }> {
        try {
            const response = await this.repository.requestAcceptRepository(rideId,passengerId);
            return response;
        } catch (error) {
            console.log(error);
            return {
                status: 400,
                message: 'Something went wrong',
                rideDetails: null
            }
        }
    }
    async getRideDetailsIntercator(rideId: string): Promise<{ status: number; message: string; rideDetails: IRide | null; }> {
        try {
            const result = await this.repository.getRideDetailsRepository(rideId);
            return result;
        } catch (error) {
            console.log(error);
            return {
                message: 'Internal Server Error',
                status: 500,
                rideDetails: null
            }
        }
    }
    async getDriverNotificationInteractor(driverId: string): Promise<{ status: number; message: string; notifications: any[]; }> {
        try {
            const result = await this.repository.getDriverNotificationRepository(driverId);
            return result;
        } catch (error) {
            console.log(error);
            return {
                message: 'Internal Server Error',
                status: 500,
                notifications: []
            }
        }
    }
    
    async createRideIntercator(data: RideInterface,driverId:string): Promise<{ status: number; message: string; ride: any; }> {
        try {
            const result = await this.repository.createRideRepository(data,driverId);
            return result;
        } catch (error) {
            console.log(error);
            return {
                message: 'Internal Server Error',
                status: 500,
                ride: null
            }
        }
    }
    async getVehiclesInteractor(driverId: string): Promise<{ message: string; status: number; vehicles: any; }> {
        try{
            const result = await this.repository.getVehiclesRepository(driverId);
            return result;
        }catch (error) {
            return {
                message: 'Internal Server Error',
                status: 500,
                vehicles:[]
            }
        }
    }
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