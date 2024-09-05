import { IRide } from "../../../entities/interfaces/RideInterface"

export interface RideRepository{
    requestRideRepository(passengerId:string,rideId:string,totalPassengers:number):Promise<{message:string,status:number}>
    getRidesDriverRepository(driverId:string):Promise<{message:string,status:number,rides:IRide[]|null}>
    getRidesUserRepository(userId:string):Promise<{message:string,status:number,rides:IRide[]|null}>
    getRideDetailsRepository(rideId:string):Promise<{message:string,status:number,rideDetails:IRide|null}>
    userRideOnboardRepository(rideId:string,userId:string):Promise<{message:string,status:number,rideDetails:IRide|null}>
}