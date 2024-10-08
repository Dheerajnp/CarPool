import Driver from "../../../entities/interfaces/DriverInterface"
import { IRide } from "../../../entities/interfaces/RideInterface"
import { RideInterface } from "../usecases/driverInteractor"

export interface DriverRepository{
    licenseUpload(data:{userId:string,licenseFrontUrl:string,licenseBackUrl:string,vehicleBrand:string,vehicleModel:string,vehicleNumber:string,rcDocumentUrl:string}):Promise<{message:string,status:number}>
    getDriverRepository(data:{driverId:string}):Promise<{user:Driver|null,message:string,status:number}>
    updateDriverProfilePictureRepository(driverId:string,profilePictureUrl:string): Promise<{ message: string; status: number; driver: Driver|null}>
    saveLicenseInfoRepository(data:{driverId:string,licenseBackUrl:string,licenseFrontUrl:string}):Promise<{message:string,status:number,driver:Driver|null}>
    editDriverInfoRepository(data:{name:string,phone:string,driverId:string}):Promise<{message:string;status:number}>
    addVehicleRepository(data:{brand:string,model:string,driverId:string,rcDocumentUrl:string,vehicleNumber:string}):Promise<{status:number,message:string,driver:Driver|null}>
    deleteVehicleRepository(vehicleId:string, driverId:string):Promise<{message:string,status:number}>
    getVehiclesRepository(driverId:string):Promise<{message:string,status:number,vehicles:any}>
    createRideRepository(data:RideInterface,driverId:string):Promise<{status:number,message:string,ride:any}>
    getDriverNotificationRepository(driverId:string):Promise<{status:number,message:string,notifications:any[]}>
    getRideDetailsRepository(rideId:string):Promise<{status:number,message:string,rideDetails:IRide|null}>
    requestAcceptRepository(rideId:string,passengerId:string):Promise<{status:number,message:string,rideDetails:IRide|null}>
    requestDenyRepository(rideId:string,passengerId:string):Promise<{status:number,message:string,rideDetails:IRide|null}>
    updateRideStatusRepository(rideId:string,status:string):Promise<{status:number,message:string,rideDetails:IRide|null}>
} 