import { log } from "console";
import Driver from "../../entities/interfaces/DriverInterface";
import driverModel from "../../frameworks/database/models/driverSchema";
import { DriverRepository } from "../interfaces/repository/DriverRepository";
import { RideInterface } from "../interfaces/usecases/driverInteractor";
import Ride from "../../frameworks/database/models/rideSchema";
import {formatISO} from 'date-fns';
export class driverRepositoryImp implements DriverRepository {
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
            const endDate = new Date(startDate.getTime() + (duration/60) * 60000); // duration is in minutes
            console.log(endDate);
            console.log(startDate);
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
                  { eta: { $gte: startDate, $lte: endDate } }
                ]
              });
          
              return overlappingRides.length > 0
                
            };
        
            const overlap = await isRideOverlap(driverId, startDate, endDate);
            if (overlap) {
              return {
                message: "Ride overlaps with existing rides",
                status: 409,
                ride: null,
              };
            }
 
            // console.log(startDate.toLocaleString());
            // Create the ride if no overlap
            const newRide = new Ride({
              origin:source,
              destination,
              rideDate:startDate,
              price,
              passengers:{},
              totalSeats:passengers,
              availableSeats:passengers,
              eta:endDate,
              distance,
              duration,
              vehicle:{
                ...vehicle,
                id:vehicle._id
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
      console.log("driverdeleterepo", driverId);
      const driver = await driverModel.findById(driverId);
      console.log("driver", driver);
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
      console.log("udated vehicles", updatedVehicles);
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
      console.log("add vehicle");
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
      console.log("edit driver info");
      console.log(driver);
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
      console.log("here", data.driverId);

      const driver = await driverModel.findOne({ email: data.driverId });
      console.log(driver);
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
    console.log("upload repositiiorysdbvjvdnv", data);
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
