
export interface LocationInterface {
    name: string;
    coordinates: [number, number];
  }

export interface IRideDetails {
    _id: string;
  driver: {
    name: string;
    email: string;
    _id: string;
    profile: string;
  };
  vehicle: {
    id: string;
    brand: string;
    model: string;
    rcDocumentUrl: string;
    number: string;
  };
  origin: LocationInterface;
  destination: LocationInterface;
  rideDate: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  passengers: {
    rider: {
      name: string;
      email: string;
      _id: string;
      id:string;
      // profile: string;
    };
    status: 'pending' | 'accepted' | 'rejected';
    numberOfPassengers: number;
  }[];
  distance: number;
  duration: number;
  passengerCount: number;
}

export interface RideDetailsListState {
  ride: IRideDetails|null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  message: string;
}