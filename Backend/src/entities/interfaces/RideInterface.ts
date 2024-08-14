import mongoose from "mongoose";


export interface IRide extends Document {
    driver: mongoose.Schema.Types.ObjectId;
    vehicle: {
      id: string;
      brand: string;
      model: string;
      rcDocumentUrl: string;
      number: string;
    };
    origin: {
      type: string;
      name: string;
      coordinates: [];
    };
    destination: {
      type: string;
      name: string;
      coordinates: [];
    };
    rideDate: Date;
    availableSeats: number;
    totalSeats: number;
    price: number;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    passengers: {
      rider: mongoose.Schema.Types.ObjectId;
      status: 'pending' | 'accepted' | 'rejected';
      numberOfPassengers:number;
    }[];
    distance: number;
    duration: number;
    eta:Date;
  }
  