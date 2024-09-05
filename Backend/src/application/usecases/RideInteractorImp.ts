import { IRide } from "../../entities/interfaces/RideInterface";
import { RideRepository } from "../interfaces/repository/RideRepository";
import { RideIntercator } from "../interfaces/usecases/rideInteractor";

export class RideIntercatorImp implements RideIntercator{
    constructor(public readonly repository: RideRepository){}
    async userRideOnboardInteractor(rideId: string, userId: string): Promise<{ message: string; status: number; rideDetails: IRide | null; }> {
        try {
            const result = await this.repository.userRideOnboardRepository(rideId, userId);
            return result;
        } catch (error) {
            console.log(error);
            return{
                message: 'Internal Server Error',
                status: 500,
                rideDetails: null
            }
        }
    }
    async getRideDetailsInteractor(rideId: string): Promise<{ message: string; status: number; rideDetails: IRide|null; }> {
        try {
            const result = await this.repository.getRideDetailsRepository(rideId);
            return result;
        } catch (error) {
            console.log(error);
            return{
                message: 'Internal Server Error',
                status: 500,
                rideDetails: null
            }
        }
    }
    async getRidesUserInteractor(userId: string): Promise<{ message: string; status: number; rides: IRide[] | null; }> {
        try {
            const result = await this.repository.getRidesUserRepository(userId);
            return result;
        } catch (error) {
            console.log(error);
            return{
                message: 'Internal Server Error',
                status: 500,
                rides: null
            }
        }
    }
    async getRidesDriverInteractor(driverId: string): Promise<{ message: string; status: number; rides: IRide[] | null; }> {
        try {
            const result = await this.repository.getRidesDriverRepository(driverId);
            return result;
        } catch (error) {
            console.log(error);
            return{
                message: 'Internal Server Error',
                status: 500,
                rides: null
            }
        }
    }
    async requestRideInteractor(passengerId: string, rideId: string,totalPassengers:number): Promise<{ message: string; status: number; }> {
        try {
            const result = await this.repository.requestRideRepository(passengerId, rideId,totalPassengers);
            return result;
        } catch (error) {
            console.log(error);
            return{
                message: 'Internal Server Error',
                status: 500
            }
        }
    }

    
}