import mongoose, { Schema } from "mongoose";
import { IRide } from "../../../entities/interfaces/RideInterface";
const rideSchema = new mongoose.Schema<IRide>({
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    vehicle: {
      id: { type:String, required: true },
      brand: { type: String, required: true },
      model: { type: String, required: true },
      rcDocumentUrl: { type: String, required: true },
      number: { type: String, required: true },
    },
    origin: {
      type:{ type: String, required: true, default:"Point"},
      name: { type: String, required: true },
      coordinates: Array,
    },
    destination: {
      type:{ type: String, required: true, default:"Point"},
      name: { type: String, required: true },
      coordinates: Array,
    },
    rideDate: { type: Date, required: true },
    availableSeats: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' },
    passengers: [
      {
        rider: { type: Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
      },
    ],
    distance: { type: Number, required: true },
    duration: { type: Number, required: true },
    eta: { type: Date, required: true },
  });

  rideSchema.index({origin:"2dsphere"});
  rideSchema.index({destination:"2dsphere"});
  
 const Ride = mongoose.model<IRide>('Ride', rideSchema);
 export default Ride;