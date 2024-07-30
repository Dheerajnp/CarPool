import mongoose, { Schema } from "mongoose";
import { IRide } from "../../../entities/interfaces/RideInterface";
const rideSchema = new mongoose.Schema<IRide>({
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    vehicle: {
      id: { type: Schema.Types.ObjectId, required: true },
      brand: { type: String, required: true },
      model: { type: String, required: true },
      rcDocumentUrl: { type: String, required: true },
      number: { type: String, required: true },
    },
    origin: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    destination: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    rideDate: { type: Date, required: true },
    availableSeats: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' },
    passengers: [
      {
        rider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
      },
    ],
    distance: { type: Number, required: true },
    minutes: { type: Number, required: true },
  });
  
  export const Ride = mongoose.model<IRide>('Ride', rideSchema);