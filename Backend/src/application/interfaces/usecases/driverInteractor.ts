import Driver from "../../../entities/interfaces/DriverInterface";

export interface DriverInteractor{
    licenseUploadInteractor(data:{userId:string,licenseFrontUrl:string,licenseBackUrl:string,vehicleBrand:string,vehicleModel:string,vehicleNumber:string,rcDocumentUrl:string}):Promise<{message:string,status:number}>
    getDriverInteractor(data: { driverId: string; }): Promise<{ user: Driver | null; message: string; status: number; }>
    saveLicenseInfoInteractor(data: { driverId: string; licenseBackUrl: string; licenseFrontUrl: string; }): Promise<{ message: string; status: number; driver: Driver | null; }>
    editDriverInfoInteractor(data:{name:string,phone:string,driverId:string}):Promise<{message:string;status:number}>
    addVehicleInteractor(data:{brand:string,model:string,driverId:string,rcDocumentUrl:string,vehicleNumber:string}):Promise<{status:number,message:string}>
    deleteVehicleInteractor(vehicleId:string, driverId:string):Promise<{message:string,status:number}>
}