import mongoose from "mongoose";


export interface IRide extends Document {
    driver: mongoose.Schema.Types.ObjectId;
    vehicle: {
      _id: string;
      brand: string;
      model: string;
      rcDocumentUrl: string;
      number: string;
    };
    origin: {
      address: string;
      coordinates: { lat: number; lng: number };
    };
    destination: {
      address: string;
      coordinates: { lat: number; lng: number };
    };
    rideDate: Date;
    availableSeats: number;
    totalSeats: number;
    price: number;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    passengers: {
      rider: mongoose.Schema.Types.ObjectId;
      status: 'pending' | 'accepted' | 'rejected';
    }[];
    distance: number;
    minutes: number;
  }
  