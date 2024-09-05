import Driver from "../../entities/interfaces/DriverInterface";
import driverModel from "../../frameworks/database/models/driverSchema";
import Notification from "../../frameworks/database/models/notificationSchema";
import { DriverRepository } from "../interfaces/repository/DriverRepository";
import { RideInterface } from "../interfaces/usecases/driverInteractor";
import Ride from "../../frameworks/database/models/rideSchema";
import { IRide } from "../../entities/interfaces/RideInterface";
import { getSocketInstance } from "../../frameworks/server/socket";
import { generateRideOtp } from "../functions/commonFunctions";

export class driverRepositoryImp implements DriverRepository {
  async updateRideStatusRepository(rideId: string,status:string): Promise<{ status: number; message: string; rideDetails: IRide | null; }> {
    try {
      const ride = await Ride.findByIdAndUpdate(
        rideId,
        { status: status },
        { new: true }
      ).populate("driver", "_id name")
       .populate("passengers.rider", "name id")
       .exec();

      if (!ride) {
        return {
          status: 404,
          message: "Ride not found",
          rideDetails: null,
        };
      }
      return {
        status: 200,
        message: "Ride status updated successfully",
        rideDetails: ride,
      };
    }catch (e) {
      console.error("Error updating ride status", e);
      return {
        status: 500,
        message: "Internal server error",
        rideDetails: null,
      };
    }
  }
  async requestAcceptRepository(rideId: string,passengerId:string): Promise<{ status: number; message: string; rideDetails: IRide | null; }> {
    try {
      const ride = await Ride.findById(rideId);
  
      if (!ride) {
        return {
          status: 404,
          message: "Ride not found",
          rideDetails: null,
        };
      }
  
      const passenger = ride.passengers.find(
        (p) => p.rider.toString() === passengerId
      );
  
      if (!passenger) {
        return {
          status: 404,
          message: "Passenger not found in ride",
          rideDetails: null,
        };
      }
  
      if (passenger.status === "accepted") {
        return {
          status: 400,
          message: "Passenger already accepted",
          rideDetails: null,
        };
      }
  
      if (ride.availableSeats < passenger.numberOfPassengers) {
        return {
          status: 400,
          message: "Not enough available seats",
          rideDetails: null,
        };
      }
  
      // Accept the ride request
      passenger.status = "accepted";
      ride.availableSeats -= passenger.numberOfPassengers;
      passenger.otp = generateRideOtp();
      // Save the updated ride details
      await ride.save();
  
      // Create a notification for the user
      const notification = new Notification({
        recipient: passenger.rider,
        sender: ride.driver,
        message: `Your request to join the ride from ${ride.origin.name} to ${ride.destination.name} has been accepted.`,
        rideId: ride._id,
        status: "unread",
      });
      await notification.save();
  
      getSocketInstance()?.to(passengerId).emit("requestnotification",notification);
      return {
        status: 200,
        message: "Ride request accepted",
        rideDetails: ride,
      };
    } catch (error) {
      console.error("Error accepting ride request:", error);
      return {
        status: 500,
        message: "Internal server error",
        rideDetails: null,
      };
    }
  }
  async requestDenyRepository(rideId: string, passengerId: string): Promise<{ status: number; message: string; rideDetails: IRide | null; }> {
    try {
      const ride = await Ride.findById(rideId);
  
      if (!ride) {
        return {
          status: 404,
          message: "Ride not found",
          rideDetails: null,
        };
      }
  
      const passenger = ride.passengers.find(
        (p) => p.rider.toString() === passengerId
      );
  
      if (!passenger) {
        return {
          status: 404,
          message: "Passenger not found in ride",
          rideDetails: null,
        };
      }
  
      if (passenger.status === "rejected") {
        return {
          status: 400,
          message: "Passenger already rejected",
          rideDetails: null,
        };
      }
  
      // Deny the ride request
      passenger.status = "rejected";
  
      // Save the updated ride details
      await ride.save();
  
      // Create a notification for the user
      const notification = new Notification({
        recipient: passenger.rider,
        sender: ride.driver,
        message: `Your request to join the ride from ${ride.origin.name} to ${ride.destination.name} has been denied.`,
        rideId: ride._id,
        status: "unread",
      });
      await notification.save();
  
      // Emit notification via socket
      getSocketInstance()?.to(passengerId).emit("requestnotification", notification);
  
      return {
        status: 200,
        message: "Ride request denied",
        rideDetails: ride,
      };
    } catch (error) {
      console.error("Error denying ride request:", error);
      return {
        status: 500,
        message: "Internal server error",
        rideDetails: null,
      };
    }
  }
  
  async getRideDetailsRepository(
    rideId: string
  ): Promise<{ status: number; message: string; rideDetails: IRide | null }> {
    try {
      let rideDetails = await Ride.findById(rideId).populate({
        path: "passengers.rider",
        select: "name email",
      });
      if (!rideDetails) {
        return {
          status: 404,
          message: "Ride not found",
          rideDetails: null,
        };
      }
      return {
        status: 200,
        message: "Get ride details",
        rideDetails,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: "Internal server error",
        rideDetails: null,
      };
    }
  }
  async getDriverNotificationRepository(
    driverId: string
  ): Promise<{ status: number; message: string; notifications: any[] }> {
    try {
      const driver = await driverModel.findById(driverId);
      if (!driver) {
        return {
          status: 404,
          message: "Driver not found",
          notifications: [],
        };
        
      }
      // const notifications = await Notification.find({recipient:driverId}).sort({createdAt: -1});
      const notifications = await Notification.aggregate([
        {
          $match: { recipient: driver._id },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            pipeline: [
              {
                $project: { name: 1, email: 1 },
              },
            ],
            as: "user",
          },
        },
        {
          $project:{
            _id: 1,
            sender: 1,
            recipient: 1,
            message: 1,
            status:1,
            seen:1,
            createdAt: 1,
            user: { $arrayElemAt: ["$user", 0] },
            senderName:{ $arrayElemAt: ["$user.name", 0] },
            rideId:1,
          }
        }
      ]);
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

  async createRideRepository(
    data: RideInterface,
    driverId: string
  ): Promise<{ status: number; message: string; ride: any }> {
    const {
      source,
      destination,
      date,
      time,
      price,
      passengers,
      distance,
      duration,
      vehicle,
    } = data;

    try {
      const driver = await driverModel.findById(driverId);
      if (!driver) {
        return {
          message: "Driver not found",
          status: 404,
          ride: null,
        };
      }

      const startDate = new Date(date); // This will be in UTC
      const endDate = new Date(startDate.getTime() + (duration / 60) * 60000); // duration is in minutes
      const isRideOverlap = async (
        driverId: string,
        startDate: Date,
        endDate: Date
      ) => {
        // Find overlapping rides
        const overlappingRides = await Ride.find({
          driver: driverId,
          $or: [
            { rideDate: { $gte: startDate, $lte: endDate } },
            { eta: { $gte: startDate, $lte: endDate } },
          ],
        });

        return overlappingRides.length > 0;
      };

      const overlap = await isRideOverlap(driverId, startDate, endDate);
      if (overlap) {
        return {
          message: "Ride overlaps with existing rides",
          status: 409,
          ride: null,
        };
      }

      // Create the ride if no overlap
      const newRide = new Ride({
        origin: source,
        destination,
        rideDate: startDate,
        price,
        passengers:[],
        totalSeats: passengers,
        availableSeats: passengers,
        eta: endDate,
        distance,
        duration,
        vehicle: {
          ...vehicle,
          id: vehicle._id,
        },
        driver: driverId,
      });
      await newRide.save();

      return {
        message: "Ride created successfully",
        status: 201,
        ride: newRide,
      };
    } catch (error) {
      console.error(error);
      return {
        message: "An error occurred while creating the ride",
        status: 500,
        ride: null,
      };
    }
  }

  async getVehiclesRepository(
    driverId: string
  ): Promise<{ message: string; status: number; vehicles: any }> {
    try {
      const driver = await driverModel.findById(driverId);
      if (!driver) {
        return {
          message: "Driver not found",
          status: 404,
          vehicles: null,
        };
      }
      const vehicles = driver?.vehicles;
      if (!vehicles) {
        return {
          message: "Add atleast one vehicle before creating ride",
          status: 200,
          vehicles: null,
        };
      }
      const approvedVehicles = vehicles?.filter(
        (vehicle) => vehicle.status === "approved"
      );
      return {
        message: "Vehicles found successfully",
        status: 200,
        vehicles: approvedVehicles,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Internal Server Error",
        status: 500,
        vehicles: null,
      };
    }
  }
  async deleteVehicleRepository(
    vehicleId: string,
    driverId: string
  ): Promise<{ message: string; status: number }> {
    try {
      // Fetch the driver by their ID
      const driver = await driverModel.findById(driverId);
      if (!driver) {
        return { message: "Driver not found", status: 402 };
      }

      // Filter out the vehicle to be deleted
      const updatedVehicles = driver.vehicles?.filter(
        (vehicle) => vehicle._id.toString() !== vehicleId
      );
      if (updatedVehicles?.length === driver.vehicles?.length) {
        return { message: "Vehicle not found", status: 402 };
      }

      // Update the driver's vehicle list
      driver.vehicles = updatedVehicles;
      // Save the updated driver profile
      await driver.save();

      return { message: "Vehicle deleted successfully", status: 200 };
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      return {
        message: "Failed to delete vehicle. Please try again.",
        status: 500,
      };
    }
  }
  async addVehicleRepository(data: {
    brand: string;
    model: string;
    driverId: string;
    rcDocumentUrl: string;
    vehicleNumber: string;
  }): Promise<{ status: number; message: string; driver: Driver | null }> {
    const { brand, model, driverId, rcDocumentUrl, vehicleNumber } = data;
    try {
      const driver = await driverModel.findByIdAndUpdate(
        driverId,
        {
          $push: {
            vehicles: {
              brand: brand,
              model: model,
              rcDocumentUrl: rcDocumentUrl,
              number: vehicleNumber,
            },
          },
        },
        { new: true }
      );
      if (!driver) {
        return {
          message: "Driver not found",
          status: 404,
          driver: null,
        };
      }
      console.log(driver);
      return {
        message: "Vehicle added successfully",
        status: 200,
        driver: driver,
      };
    } catch (error) {
      return {
        message: "Internal Server Error",
        status: 500,
        driver: null,
      };
    }
  }
  async editDriverInfoRepository(data: {
    name: string;
    phone: string;
    driverId: string;
  }): Promise<{ message: string; status: number }> {
    const { name, phone, driverId } = data;
    try {
      const driver = await driverModel.findByIdAndUpdate(
        driverId,
        { name, phone },
        { new: true }
      );
      if (!driver) {
        return {
          message: "Driver not found",
          status: 404,
        };
      }
      return {
        message: "Driver info updated successfully",
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
  async saveLicenseInfoRepository(data: {
    driverId: string;
    licenseBackUrl: string;
    licenseFrontUrl: string;
  }): Promise<{ message: string; status: number; driver: Driver | null }> {
    const { driverId, licenseBackUrl, licenseFrontUrl } = data;
    try {
      const driver = await driverModel.findByIdAndUpdate(
        driverId,
        {
          licenseBackUrl,
          licenseFrontUrl,
          licenseStatus: "pending",
          verified: false,
        },
        { new: true }
      );
      if (!driver) {
        return {
          message: "Driver not found",
          status: 404,
          driver: null,
        };
      }
      return {
        message: "License info updated successfully",
        status: 200,
        driver,
      };
    } catch (error) {
      return {
        message: "Internal Server Error",
        status: 500,
        driver: null,
      };
    }
  }

  async getDriverRepository(data: {
    driverId: string;
  }): Promise<{ user: Driver | null; message: string; status: number }> {
    try {

      const driver = await driverModel.findOne({ email: data.driverId });
      if (!driver) {
        return {
          user: null,
          message: "Driver not found",
          status: 404,
        };
      }
      return {
        user: driver,
        message: "Driver found successfully",
        status: 200,
      };
    } catch (error) {
      return {
        user: null,
        message: "Internal Server Error",
        status: 500,
      };
    }
  }
  async licenseUpload(data: {
    userId: string;
    licenseFrontUrl: string;
    licenseBackUrl: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleNumber: string;
    rcDocumentUrl: string;
  }): Promise<{ message: string; status: number }> {
    const {
      licenseFrontUrl,
      licenseBackUrl,
      vehicleBrand,
      vehicleModel,
      vehicleNumber,
      rcDocumentUrl,
      userId,
    } = data;
    try {
      const driver = await driverModel.findById(userId);
      if (!driver) {
        return {
          message: "User not found",
          status: 404,
        };
      }
      await driverModel.findByIdAndUpdate(userId, {
        licenseStatus: "pending",
        licenseBackUrl: licenseBackUrl,
        licenseFrontUrl: licenseFrontUrl,
        $push: {
          vehicles: {
            brand: vehicleBrand,
            model: vehicleModel,
            number: vehicleNumber,
            rcDocumentUrl: rcDocumentUrl,
          },
        },
      });
      return {
        message: "License and vehicle details updated successfully",
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
