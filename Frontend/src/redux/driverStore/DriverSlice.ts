import { createSlice,createAsyncThunk  } from "@reduxjs/toolkit";
import axios from "axios";
import * as interfaces from "./interfaces";
import { AppDispatch, RootState } from "../store";
import axiosApiGateway from "../../functions/axios";





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

  export const driverLogin = createAsyncThunk<interfaces.DriverLoginResponse,interfaces.DriverLoginCredentials,AsyncThunkConfig>(
    "driver/login",
    async (credentials) => {
      try {
        const response = await axios.post('/login',credentials,{
            withCredentials:true
        })
        return response.data;
    } catch (error: any) {
        if (error.response) {
          return {
            message: error.response.data.message,
            status: error.response.status
          };
        } else {
          return {
            message: 'Internal Server Error',
            status: 500
          };
        }
      }
    }
  )

export const saveLicenseInfo = createAsyncThunk<interfaces.SaveLicenseInfoResponse,interfaces.SaveLicenseInfoPayload,AsyncThunkConfig>(
    "driver/saveLicenseInfo",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await axiosApiGateway.post("/driver/saveLicenseInfo", payload, {
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
      .addCase(driverLogin.pending, (state, action:any) => {
        state.loading = false;
        state.message = action.payload?.message ?? "";
        state.driver = action.payload?.user;
      })
  },
});

export default driverSlice.reducer;
