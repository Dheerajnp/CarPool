import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as interfaces from './interfaces'
import * as adminAuthService from './AdminAuthService'
import { AppDispatch, RootState } from "../../store";
// import Cookies from "js-cookie"

type AsyncThunkConfig = {
    state: RootState;
    dispatch: AppDispatch;
    extra?: unknown;
    rejectValue: {
      message: string;
      errors: string[];
    };
  };
export const adminLogin = createAsyncThunk<interfaces.AdminLoginResponse,interfaces.AdminLoginCredentials,AsyncThunkConfig>(
    'admin/login',
    async (credentials,{ rejectWithValue })=>{
        try {
            const data = await adminAuthService.adminLogin(credentials)
            return data;
        } catch (error) {
            return rejectWithValue({
                message: 'Internal Server Error',
                errors: [],
            });
        }
    }

)

export const adminVerify = createAsyncThunk<interfaces.AdminAuthVerifyResponse,interfaces.AdminAuthVerifyData,AsyncThunkConfig>(
    'admin/verify',
    async(data,{ rejectWithValue })=>{
        try {
            const result = await adminAuthService.adminVerify(data);
            return result;
        } catch (error) {
            return rejectWithValue({
                message: 'Internal Server Error',
                errors:[]
            })
        }
    }
)
const initialState:interfaces.AdminAuthState = {
    admin:null,
    loading:false,
    error:[],
    message:''
}

const authSliceAdmin = createSlice({
    name:'authAdmin',
    initialState,
    reducers:{
        resetAdminState: (state) => {
            Object.assign(state, initialState);
        },
        setAdmin: (state, action) => {
            state.admin = action.payload;
        }
    },
    extraReducers(builder) {
        builder
        .addCase(adminLogin.pending,(state)=>{
            state.loading = true;
            state.error = []
        })
        .addCase(adminLogin.fulfilled,(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
            state.admin = action.payload.admin;
            // Cookies.set('adminToken',action.payload.token as string);
        })
        .addCase(adminVerify.pending,(state)=>{
            state.loading = true;
            state.error = []
        })
        .addCase(adminVerify.fulfilled,(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
            state.admin = action.payload.user;
        })
    },
})

 export const { resetAdminState,setAdmin } = authSliceAdmin.actions;
 export default authSliceAdmin.reducer;