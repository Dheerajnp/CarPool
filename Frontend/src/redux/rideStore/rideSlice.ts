import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Location {
  name: string;
  coordinates: [number, number];
}

export interface RideState {
  source: Location | null;
  destination: Location | null;
  date: Date | undefined;
  time: string;
  passengers: number;
  price?: string | null;
}

const initialState: RideState = {
  source: null,
  destination: null,
  date: undefined as Date | undefined,
  time: "",
  passengers: 1,
  price: null,
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setRideDetails(state, action: PayloadAction<RideState>) {
      state.source = action.payload.source;
      state.destination = action.payload.destination;
      state.date = action.payload.date;
      state.time = action.payload.time;
      state.passengers = action.payload.passengers;
      state.price = action.payload.price;
    },
  },
});

export const { setRideDetails } = rideSlice.actions;
export default rideSlice.reducer;
