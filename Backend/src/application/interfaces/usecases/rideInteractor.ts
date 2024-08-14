import { IRide } from "../../../entities/interfaces/RideInterface"

export interface RideIntercator{
    requestRideInteractor(passengerId:string,rideId:string,totalPassengers:number):Promise<{message:string,status:number}>
    getRidesDriverInteractor(driverId:string):Promise<{message:string,status:number,rides:IRide[]|null}>
}