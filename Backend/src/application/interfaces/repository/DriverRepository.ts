import Driver from "../../../entities/interfaces/DriverInterface"

export interface DriverRepository{
    licenseUpload(data:{userId:string,licenseFrontUrl:string,licenseBackUrl:string,vehicleBrand:string,vehiceModel:string,vehicleNumber:string,rcDocumentUrl:string}):Promise<{message:string,status:number}>
    getDriverRepository(data:{driverId:string}):Promise<{user:Driver|null,message:string,status:number}>
    saveLicenseInfoRepository(data:{driverId:string,licenseBackUrl:string,licenseFrontUrl:string}):Promise<{message:string,status:number,driver:Driver|null}>
} 