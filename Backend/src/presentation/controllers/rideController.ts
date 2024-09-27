import { RequestHandler } from "express";
import { RideIntercator } from "../../application/interfaces/usecases/rideInteractor";
import Ride from "../../frameworks/database/models/rideSchema";

export class RideController {
  constructor(public readonly interactor: RideIntercator) {}

  getRidestats: RequestHandler = async (req, res) => {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    try {
     
      const currentDate = new Date();
      const lastSunday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())); // Sunday of this week
      const previousSunday = new Date(lastSunday.setDate(lastSunday.getDate() - 7)); // Sunday of last week
  
      const rides = await Ride.aggregate([
        {
          $match: {
            status: "completed",  // Only completed rides
            rideDate: {
              $gte: previousSunday,  // From the previous Sunday
              $lt: lastSunday,       // To this week's Sunday
            },
          },
        },
        // Convert rideDate to Indian Standard Time (IST) and get the day of the week
        {
          $addFields: {
            rideDateIST: {
              $dateToParts: {
                date: { $add: ["$rideDate", 19800000] }, // Adding 5 hours 30 minutes (IST offset)
                timezone: "Asia/Kolkata",
              },
            },
          },
        },
        // Group by day of the week (1=Sunday, 2=Monday, ..., 7=Saturday)
        {
          $group: {
            _id: { dayOfWeek: "$rideDateIST.dayOfWeek" },
            totalRevenue: { $sum: "$totalPrice" }, // Sum the totalPrice for each day
          },
        },
        // Sort by day of the week
        {
          $sort: { "_id.dayOfWeek": 1 },
        },
        // Project the day names and total revenue
        {
          $project: {
            _id: 0,
            day: {
              $switch: {
                branches: [
                  { case: { $eq: ["$_id.dayOfWeek", 1] }, then: "Sunday" },
                  { case: { $eq: ["$_id.dayOfWeek", 2] }, then: "Monday" },
                  { case: { $eq: ["$_id.dayOfWeek", 3] }, then: "Tuesday" },
                  { case: { $eq: ["$_id.dayOfWeek", 4] }, then: "Wednesday" },
                  { case: { $eq: ["$_id.dayOfWeek", 5] }, then: "Thursday" },
                  { case: { $eq: ["$_id.dayOfWeek", 6] }, then: "Friday" },
                  { case: { $eq: ["$_id.dayOfWeek", 7] }, then: "Saturday" },
                ],
                default: "Unknown Day",
              },
            },
            totalRevenue: 1,
          },
        },
      ]); 
      console.log(rides)
      res.json(rides);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching ride stats", error: err });
    }
  };

  requestRide: RequestHandler = async (req, res) => {
    const { rideId } = req.params;
    const { userId, totalPassengers } = req.body;
    try {
      const { message, status } = await this.interactor.requestRideInteractor(
        userId,
        rideId,
        totalPassengers
      );
      return res.status(status).json({ message, status });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", status: 500 });
    }
  };

  getRidesDriver: RequestHandler = async (req, res) => {
    const { driverId } = req.params;
    try {
      const result = await this.interactor.getRidesDriverInteractor(driverId);
      return res.status(result.status).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", status: 500 });
    }
  };

  getUserRides: RequestHandler = async (req, res) => {
    const { userId } = req.params;
    try {
      const result = await this.interactor.getRidesUserInteractor(userId);
      return res.status(result.status).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", status: 500 });
    }
  };

  getRideDetails: RequestHandler = async (req, res) => {
    const { rideId } = req.params;
    try {
      const result = await this.interactor.getRideDetailsInteractor(rideId);
      return res.status(result.status).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", status: 500 });
    }
  };

  userOnboardRide: RequestHandler = async (req, res) => {
    const { rideId } = req.params;
    const { userId } = req.body;

    try {
      const result = await this.interactor.userRideOnboardInteractor(
        rideId,
        userId
      );
      return res.status(result.status).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", status: 500 });
    }
  };
}
