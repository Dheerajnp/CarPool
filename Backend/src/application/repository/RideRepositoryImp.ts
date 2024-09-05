import Ride from "../../frameworks/database/models/rideSchema";
import userModel from "../../frameworks/database/models/userSchema";
import Notification from "../../frameworks/database/models/notificationSchema";
import {
  getSocketInstance,
  initializeSocketServer,
} from "../../frameworks/server/socket";
import { RideRepository } from "../interfaces/repository/RideRepository";
import { IRide } from "../../entities/interfaces/RideInterface";
import { Types,Schema, Mongoose } from "mongoose";


export class RideRepositoryImp implements RideRepository {
  async userRideOnboardRepository(rideId: string, userId: string): Promise<{ message: string; status: number; rideDetails: IRide | null; }> {
    try {
      const ride = await Ride.findById(rideId);
      if(!ride){
        return {
          message: "Ride not found",
          status: 404,
          rideDetails: null,
        };
      }
      
      const passenger = ride?.passengers.find(p =>String(p.rider) == userId)
      if(!passenger){
        return {
          message: "User not found in the ride",
          status: 404,
          rideDetails: null,
        };
      }
      passenger.passengerRideStatus = "ongoing";

      await ride.save();

      return {
        message: "User added successfully to the ride",
        status: 200,
        rideDetails: ride,
      }
    } catch (error) {
      throw "skvbs"
    }
  }
  async getRideDetailsRepository(rideId: string): Promise<{ message: string; status: number; rideDetails: IRide | null; }> {
    try {
      const ride = await Ride.findById(rideId).populate("driver", "_id name")
       .populate("passengers.rider", "name id")
       .exec();
      if (!ride) {
        return {
          message: "Ride not found",
          status: 404,
          rideDetails: null,
        };
      }
      return {
        message: "Ride found successfully",
        status: 200,
        rideDetails: ride,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Internal Server Error",
        status: 500,
        rideDetails: null,
      };
    }
  }
  async getRidesUserRepository(userId: string): Promise<{ message: string; status: number; rides: IRide[] | null; }> {
    try {
        const ride = await Ride.find({ "passengers.rider": userId })
    .populate("driver", "name") 
    .populate("passengers.rider", "name id") 
      if (!ride) {
        return {
          message: "Rides not found",
          status: 404,
          rides: null,
        };
      }

      return {
        message: "Rides found successfully",
        status: 200,
        rides: ride,
      };
    } catch (error) {
        console.log(error);
      return {
        message: "Internal Server Error",
        status: 500,
        rides: null,
      };
    }
    
  }
  async getRidesDriverRepository(
    driverId: string
  ): Promise<{ message: string; status: number; rides: IRide[] | null }> {
    try {
      const ride = await Ride.find({ driver: driverId })
      if (!ride) {
        return {
          message: "Rides not found",
          status: 404,
          rides: null,
        };
      }
      return {
        message: "Rides found successfully",
        status: 200,
        rides: ride,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Internal Server Error",
        status: 500,
        rides: null,
      };
    }
  }
  async requestRideRepository(
    passengerId: string,
    rideId: string,
    totalPassengers: number
  ): Promise<{ message: string; status: number }> {
    try {
      const user = await userModel.findById(passengerId);
      if (!user) {
        return {
          message: "User not found",
          status: 404,
        };
      }
      const ride = await Ride.findById(rideId);
      if (!ride) {
        return {
          message: "Ride not found",
          status: 404,
        };
      }

      if (ride.availableSeats < totalPassengers) {
        return {
          message: "Not enough available seats",
          status: 404,
        };
      }

      const existingRequest = await Ride.findOne({_id:ride._id,"passengers.rider":user._id});
      if(existingRequest){
        return{
            message:"Request already exists",
            status:400
          }
      }
      
     const rider = await Ride.findByIdAndUpdate(
        rideId,
        {
          $push: {
            passengers: {
              rider: passengerId,
              status: "pending",
              numberOfPassengers: totalPassengers,
            },
          },
        },
        { new: true } // To return the updated document
      );
      console.log(rider)

      const driverId = ride.driver;

      const notification = new Notification({
        recipient: driverId,
        sender: passengerId,
        message: `Ride request has been received from ${user.name}`,
        rideId:ride._id,
        notificationType:'request'
      });
      await notification.save();

      getSocketInstance()
        ?.to(driverId.toString())
        .emit("notification", notification,user.name );
      return {
        message: "Request sent successfully",
        status: 200,
      };
    } catch (error) {
      return {
        message: "Internal Server Error",
        status: 500,
      };
    }
  }
}
