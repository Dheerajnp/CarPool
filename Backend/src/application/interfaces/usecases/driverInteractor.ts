import Driver from "../../../entities/interfaces/DriverInterface";

export interface DriverInteractor{
    licenseUploadInteractor(data:{userId:string,licenseFrontUrl:string,licenseBackUrl:string,vehicleBrand:string,vehiceModel:string,vehicleNumber:string,rcDocumentUrl:string}):Promise<{message:string,status:number}>
    getDriverInteractor(data: { driverId: string; }): Promise<{ user: Driver | null; message: string; status: number; }>
    saveLicenseInfoInteractor(data: { driverId: string; licenseBackUrl: string; licenseFrontUrl: string; }): Promise<{ message: string; status: number; driver: Driver | null; }>
    editDriverInfoInteractor(data:{name:string,phone:string,driverId:string}):Promise<{message:string;status:number}>
}