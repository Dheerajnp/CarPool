import { createSlice,createAsyncThunk  } from "@reduxjs/toolkit";
import { Driver } from "../userStore/Authentication/interfaces";
import axios from "axios";
import * as interfaces from "./interfaces";
import { AppDispatch, RootState } from "../store";





const initialState: interfaces.DriverStoreState = {
  driver: null,
  loading: false,
  error:[],
  message: ""
}

interface AsyncThunkConfig {
    state: RootState;
    dispatch: AppDispatch;
    extra?: unknown;
    rejectValue: {
      message: string;
      errors: string[];
    };
  }

export const saveLicenseInfo = createAsyncThunk<interfaces.SaveLicenseInfoResponse,interfaces.SaveLicenseInfoPayload,AsyncThunkConfig>(
    "driver/saveLicenseInfo",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await axios.post("/driver/saveLicenseInfo", payload, {
          withCredentials: true,
        });
        return <interfaces.SaveLicenseInfoResponse> response.data ;
      } catch (error:any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveLicenseInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveLicenseInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.driver = action.payload.driver;
      })
  },
});

export default driverSlice.reducer;
