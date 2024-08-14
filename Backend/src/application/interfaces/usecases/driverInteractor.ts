import Driver from "../../../entities/interfaces/DriverInterface";
import { IRide } from "../../../entities/interfaces/RideInterface";
import Vehicle from "../../../entities/interfaces/VehicleInterface";

interface Location {
    name: string;
    coordinates: [number, number];
  }

export interface RideInterface{
    driverId:string,
    source:Location;
    destination: Location;
    date: Date;
    time: string;
    price:number;
    passengers:number;
    distance:number;
    duration:number;
    vehicle:{
        _id:string;
        brand: string;
        model: string;
        rcDocumentUrl: string;
        number: string;
        status: string;
    }
}

export interface DriverInteractor{
    licenseUploadInteractor(data:{userId:string,licenseFrontUrl:string,licenseBackUrl:string,vehicleBrand:string,vehicleModel:string,vehicleNumber:string,rcDocumentUrl:string}):Promise<{message:string,status:number}>
    getDriverInteractor(data: { driverId: string; }): Promise<{ user: Driver | null; message: string; status: number; }>
    saveLicenseInfoInteractor(data: { driverId: string; licenseBackUrl: string; licenseFrontUrl: string; }): Promise<{ message: string; status: number; driver: Driver | null; }>
    editDriverInfoInteractor(data:{name:string,phone:string,driverId:string}):Promise<{message:string;status:number}>
    addVehicleInteractor(data:{brand:string,model:string,driverId:string,rcDocumentUrl:string,vehicleNumber:string}):Promise<{status:number,message:string,driver:Driver|null}>
    deleteVehicleInteractor(vehicleId:string, driverId:string):Promise<{message:string,status:number}>
    getVehiclesInteractor(driverId:string):Promise<{message:string,status:number,vehicles:Vehicle[]}>
    createRideIntercator(data:RideInterface,driverId:string):Promise<{status:number,message:string,ride:any}>
    getDriverNotificationInteractor(driverId:string):Promise<{status:number,message:string,notifications:any[]}>
    getRideDetailsIntercator(rideId:string):Promise<{status:number,message:string,rideDetails:IRide | null}>
    requestAcceptInteractor(rideId:string,passengerId:string):Promise<{status:number,message:string,rideDetails:IRide|null}>
    requestDenyInteractor(rideId:string,passengerId:string):Promise<{status:number,message:string,rideDetails:IRide|null}>
}