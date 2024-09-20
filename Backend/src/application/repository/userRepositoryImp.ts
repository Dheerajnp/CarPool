import { UserRepository } from "../interfaces/repository/UserRepository";
import userModel from "../../frameworks/database/models/userSchema";
import moment from "moment";
import User from "../../entities/interfaces/UserInterface";
import { IRide } from "../../entities/interfaces/RideInterface";
import Ride from "../../frameworks/database/models/rideSchema";
import Notification from "../../frameworks/database/models/notificationSchema";
import { createPaymentIntent } from "../../frameworks/payment/stripePaymentService";
import mongoose from "mongoose";
export class userRepositoryImp implements UserRepository {
  async createPaymentRepository(name: string, amount: number, email: string, userId: string, rideId: string): Promise<{ message: string; status: number; sessionId: string; }> {
    try {
      console.log("createPaymentInteractor")
      console.log(userId)
      if(userId){
        console.log("hbshbsh")
        const ride = await Ride.findById(rideId);
        console.log(ride)
        if(!ride){
          return {
            message: 'Ride not found',
            status: 404,
            sessionId: ''
          }
        }
       
        let selectedRide = ride.passengers.find(p => p.rider.toString() === userId);
        if(!selectedRide){
          return{
            message: 'User not found in the ride',
            status: 404,
            sessionId: ''
          }
        }
        const session = await createPaymentIntent(
          {name,email},
          amount,
          rideId
        )
        console.log(session)
        selectedRide.payment = {
          amount:amount * selectedRide.numberOfPassengers,
          status:'paid',
          transactionId: session.id,
          paymentMethod: 'card',
          paymentDate: new Date()
        }
        
        console.log(selectedRide.payment)
        await ride.save();
        return {
          message: 'Payment successful',
          status: 200,
          sessionId: session.id
        };
      }
      return {
        message: 'User id not found',
        status: 404,
        sessionId: ''
      }
    } catch (error) {
      console.log(error)
      return{
        message: 'Internal Server Error',
        status: 500,
        sessionId: ''
      }
    }
  }
  async getUserNotificationRepository(
    userId: string
  ): Promise<{ status: number; message: string; notifications: any[] }> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return {
          status: 404,
          message: "User not found",
          notifications: [],
        };
      }

      const notifications = await Notification.find({ recipient: userId }).sort(
        { createdAt: -1 }
      );
      return {
        status: 200,
        message: "Get driver notifications",
        notifications,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: "Internal server error",
        notifications: [],
      };
    }
  }
  async getRideDetailsRepository(
    rideId: string
  ): Promise<{ message: string; status: number; ride: IRide | null }> {
    try {
      const rideDetails = await Ride.findById(rideId).populate("driver");
      if (!rideDetails) {
        return {
          message: "Ride not found",
          status: 404,
          ride: null,
        };
      }
      return {
        message: "Success",
        status: 200,
        ride: rideDetails,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Internal Server Error",
        status: 500,
        ride: null,
      };
    }
  }
  async getRidesRepository(data: {
    fromName: string;
    fromCoordinates: number[];
    toName: string;
    toCoordinates: number[];
    date: Date | undefined;
  }): Promise<{ message: string; status: number; rides: IRide[] }> {
    const { fromName, fromCoordinates, toName, toCoordinates, date } = data;
    try {
      const startOfDay = moment(date).startOf("day").toDate(); // Start of the day
      const endOfDay = moment(date).add(1, "day").startOf("day").toDate(); // Start of the next day
      if (date !== undefined) {
        const rides = await Ride.find({
          rideDate: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
          $and: [
            {
              "origin.coordinates": {
                $geoWithin: {
                  $centerSphere: [
                    [fromCoordinates[0], fromCoordinates[1]],
                    10 / 6378.1,
                  ],
                },
              },
            },
            {
              "destination.coordinates": {
                $geoWithin: {
                  $centerSphere: [
                    [toCoordinates[0], toCoordinates[1]],
                    10 / 6378.1,
                  ],
                },
              },
            },
          ],
        }).populate("driver");
        return {
          message: "Rides found successfully",
          status: 200,
          rides: rides,
        };
      }
      return {
        message: "No rides found",
        status: 200,
        rides: [],
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Internal Server Error",
        status: 500,
        rides: [],
      };
    }
  }
  async editUserInfoRepository(
    userId: string,
    name: string,
    phone: string
  ): Promise<{ message: string; status: number }> {
    try {
      const user = await userModel.findByIdAndUpdate(
        userId,
        {
          name: name,
          phone: phone,
        },
        { new: true }
      );
      if (!user) {
        return {
          message: "User not found",
          status: 404,
        };
      }
      return {
        message: "User info updated successfully",
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Internal Server Error",
        status: 500,
      };
    }
  }
  async editDocumentRepository(
    userId: string,
    type: string,
    url: string
  ): Promise<{ message: string; status: number }> {
    try {
      const user = await userModel.findByIdAndUpdate(
        userId,
        {
          verified: false,
          documents: {
            url: url,
            type: type,
            status: "pending",
          },
        },
        { new: true }
      );
      if (!user) {
        return {
          message: "User not found",
          status: 404,
        };
      }
      return {
        message: "Document updated successfully",
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Internal Server Error",
        status: 500,
      };
    }
  }
  async getUserDetailsRepository(
    userId: string
  ): Promise<{ message: string; status: number; user: User | null }> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return {
          message: "User not found",
          status: 404,
          user: null,
        };
      }
      return {
        message: "User found successfully",
        status: 200,
        user: user,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Internal Server Error",
        status: 500,
        user: null,
      };
    }
  }
  async uploadDocumentRepo(data: {
    userId: string;
    documentUrl: string;
    documentType: string;
  }): Promise<{ message: string; status: number }> {
    const { userId, documentUrl, documentType } = data;
    try {
      const user = userModel.findById(userId);
      if (!user) {
        return {
          message: "User not found",
          status: 404,
        };
      }
      await userModel.findByIdAndUpdate(userId, {
        documents: {
          url: documentUrl,
          type: documentType,
          status: "pending",
        },
      });
      return {
        message: "Document uploaded successfully",
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
