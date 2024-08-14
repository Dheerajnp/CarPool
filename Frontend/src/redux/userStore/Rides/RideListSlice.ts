import { createSlice } from '@reduxjs/toolkit';

interface Location {
  name: string;
  coordinates: [number, number];
}

export interface IRide {
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
  origin: Location;
  destination: Location;
  rideDate: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  passengers: {
    rider: string;
    status: 'pending' | 'accepted' | 'rejected';
  }[];
  distance: number;
  duration: number;
  passengerCount: number;
}

export interface RideListState {
  rides: IRide[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  message: string;
}

const initialState: RideListState = {
  rides: [],
  status: 'idle',
  error: null,
  message:""
};

const rideSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    fetchRidesRequest: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    fetchRidesSuccess: (state, action) => {
      state.status = 'succeeded';
      state.rides = action.payload.rides;
      state.message = action.payload.message;
    },
    fetchRidesFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { fetchRidesRequest, fetchRidesSuccess, fetchRidesFailure } = rideSlice.actions;
export default rideSlice.reducer;
