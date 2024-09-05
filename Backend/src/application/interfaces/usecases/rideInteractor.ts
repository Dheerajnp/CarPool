import { IRide } from "../../../entities/interfaces/RideInterface"

export interface RideIntercator{
    requestRideInteractor(passengerId:string,rideId:string,totalPassengers:number):Promise<{message:string,status:number}>
    getRidesDriverInteractor(driverId:string):Promise<{message:string,status:number,rides:IRide[]|null}>
    getRidesUserInteractor(userId:string):Promise<{message:string,status:number,rides:IRide[]|null}>
    getRideDetailsInteractor(rideId:string):Promise<{message:string,status:number,rideDetails:IRide|null}>
    userRideOnboardInteractor(rideId:string,userId:string):Promise<{message:string,status:number,rideDetails:IRide|null}>

}