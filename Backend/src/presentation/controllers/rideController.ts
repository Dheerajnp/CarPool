import { RequestHandler } from "express";
import { RideIntercator } from "../../application/interfaces/usecases/rideInteractor";



export class RideController{
    constructor(public readonly interactor:RideIntercator){}
    requestRide:RequestHandler = async (req, res) => {
        const { rideId } = req.params;
        const { userId,totalPassengers } = req.body;
        try {
          const { message, status } = await this.interactor.requestRideInteractor(userId, rideId, totalPassengers);
            return res.status(status).json({ message,status });
        } catch (error) {
          return res.status(500).json({message  : "Internal server error",status:500});
        }
      }

      getRidesDriver:RequestHandler = async(req,res)=>{
        const { driverId } = req.params;
        try {
          const result = await this.interactor.getRidesDriverInteractor(driverId);
          return res.status(result.status).json({result});
        } catch (error) {
          return res.status(500).json({message  : "Internal server error",status:500});
        }
      }

      getUserRides:RequestHandler = async(req,res)=>{
        const { userId } = req.params;
        try {
          const result = await this.interactor.getRidesUserInteractor(userId);
          return res.status(result.status).json({result});
        } catch (error) {
          return res.status(500).json({message  : "Internal server error",status:500});
        }
      }

      getRideDetails:RequestHandler = async(req,res)=>{
        const { rideId } = req.params;
        try {
          const result = await this.interactor.getRideDetailsInteractor(rideId);
          return res.status(result.status).json({result});
        } catch (error) {
          return res.status(500).json({message  : "Internal server error",status:500});
        }
      }


      userOnboardRide:RequestHandler = async(req,res)=>{
        const { rideId } = req.params;
        const {userId} = req.body;

        try {
          const result = await this.interactor.userRideOnboardInteractor(rideId, userId);
          return res.status(result.status).json({result});
        } catch (error) {
          return res.status(500).json({message  : "Internal server error",status:500});
        }
      }

}