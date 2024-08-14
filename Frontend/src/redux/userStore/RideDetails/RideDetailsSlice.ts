import { createSlice } from "@reduxjs/toolkit";
import { RideDetailsListState  } from "./RideDetailsInterface";

const initialState:RideDetailsListState = {
    ride: null,
    status: 'idle',
    error: null,
    message: "",
}

const rideDetailsSlice = createSlice({
    name:'rideDetails',
    initialState,
    reducers:{
        fetchRideDetailsRequest: (state) => {
            state.status = 'loading';
        },
        fetchRideDetailsSuccess: (state, action) => {
            state.ride = action.payload.ride;
            state.status ='succeeded';
            state.error = null;
            state.message = action.payload.message;
        },
        fetchRideDetailsFailure: (state, action) => {
            state.status = 'failed';
            state.error = action.payload.message;
            state.message = "";
        },
        resetRideDetailsState: (state) => {
            Object.assign(state, initialState);
        }
    }
})

export const { fetchRideDetailsRequest,fetchRideDetailsSuccess,fetchRideDetailsFailure } = rideDetailsSlice.actions;
export default rideDetailsSlice.reducer;