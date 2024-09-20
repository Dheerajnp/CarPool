
import * as interfaces from './interfaces'
import * as authService from './AuthService'
import { CalculateTime } from "../../../functions/CalculateTime";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';

type AsyncThunkConfig = {
    state: RootState;
    dispatch: AppDispatch;
    extra?: unknown;
    rejectValue: {
      message: string;
      errors: string[];
    };
  };
  

export const register = createAsyncThunk<interfaces.RegisterResponse, interfaces.RegisterCredentials,AsyncThunkConfig>(
    'user/register',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.register(credentials);
            const userId = data.user._id;
            localStorage.setItem('registeredUserId', userId);
            localStorage.setItem('expiryOtp', CalculateTime(5));
            return data;
        } catch (error) {
            return rejectWithValue({
                message: 'Internal Server Error',
                errors: [],
            });
        }
    }
);



export const verifyOtpThunk = createAsyncThunk<interfaces.VerifyOtpResponse,interfaces.VerifyOtpCredentials,AsyncThunkConfig>(
    'user/verifyotp',
    async (data,{rejectWithValue}) => {
        try {
            const response = await authService.verifyOtp(data.savedId,data.otp);
           return response;
        } catch (error) {
            return rejectWithValue({
                message: 'Internal Server Error',
                errors: [],
            });
        }
      
    }
  );


export const login = createAsyncThunk<interfaces.LoginResponse, interfaces.LoginCredentials,AsyncThunkConfig>(
    'user/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.login(credentials);
            return data;
        } catch (error) {
            return rejectWithValue({
                message: 'Internal Server Error',
                errors: [],
            });
        }
    }
);

export const AuthUser = createAsyncThunk<interfaces.AuthVerifyUserResponse, interfaces.AuthVerifyUser,AsyncThunkConfig>(
    'user/verify',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.VerifyUserAuth(credentials);
            return data;
        } catch (error) {
            return rejectWithValue({
                message: 'Internal Server Error',
                errors: [],
            });
        }
    }
);

export const ForgotPassword = createAsyncThunk<interfaces.ForgotPasswordResponse, interfaces.ForgotPasswordCredentials,AsyncThunkConfig>(
    'user/forgot-password',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.ForgotPassword(credentials);
            return data;
        } catch (error) {
            return rejectWithValue({
                message: 'Internal Server Error',
                errors: [],
            });
        }
    }
);

export const verifyOtpForgotPassword = createAsyncThunk<interfaces.OtpForgotPwdResponse, interfaces.OtpForgotPwd,AsyncThunkConfig>(
    'user/forgot-password/otp',
    async (data, { rejectWithValue }) => {
        try {
            const result = await authService.verifyOtpForgotPassword(data);
            return result;
        } catch (error) {
            return rejectWithValue({
                message: 'Internal Server Error',
                errors: [],
            });
        }
    }
);

export const resetPassword = createAsyncThunk<interfaces.ResetPasswordResponse, interfaces.ResetPasswordCredentials,AsyncThunkConfig>(
    'user/reset-password',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.resetPassword(credentials);
            return data;
        } catch (error) {
            return rejectWithValue({
                message: 'Internal Server Error',
                errors: [],
            });
        }
    }
);

export const googleLogin = createAsyncThunk<interfaces.GoogleSignUpResponse, interfaces.GoogleSignUpCredentials,AsyncThunkConfig>(
    'user/google-signup',
    async (credentials, { rejectWithValue }) => {
        try {
            console.log(credentials)
            const data = await authService.googleSignup(credentials);
            // const userId = data.user._id;
            // localStorage.setItem('registeredUserId', userId);
            // localStorage.setItem('expiryOtp', CalculateTime(5));
            return data;
        } catch (error) {
            return rejectWithValue({
                message: 'Internal Server Error',
                errors: [],
            });
        }
    }
);

export const licenseUpload = createAsyncThunk<interfaces.UploadLicenseResponse, interfaces.UploadLicenseCredentials,AsyncThunkConfig>(
    'user/profile/upload-license',
    async ({ userId, licenseFrontUrl, licenseBackUrl }, { rejectWithValue }) => {
        try {
            const data = await authService.licenseUpload({ userId, licenseFrontUrl, licenseBackUrl });
            return data;
        } catch (error) {
            return rejectWithValue({
                message: 'Internal Server Error',
                errors: [],
            });
        }
    }
);


const initialState:interfaces.AuthState = {
    user:null,
    loading:false,
    error:[],
    message:''
}

const authSlice = createSlice({
    name:'auth',
    initialState:initialState,
    reducers:{
        resetState: (state) => {
            Object.assign(state, initialState);
        },
        setUser:(state,action) => {
            state.user = action.payload;
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(register.pending,(state)=>{
                state.loading = true;
                state.error = [];
            })
            .addCase(register.fulfilled,(state,action)=>{
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(verifyOtpThunk.pending,(state)=>{
                state.loading = true
                state.message = 'Verifying Account Please Wait'

            })
            .addCase(verifyOtpThunk.fulfilled,(state,action)=>{
                state.loading = false;
                state.message = action.payload.message;
                state.user = action.payload.user;
            })
            .addCase(login.pending,(state)=>{
                state.loading = true;
                state.error = [];
            })
            .addCase(login.fulfilled,(state,action)=>{
                state.loading = false;
                state.message = action.payload.message;
                state.user = action.payload.user;
            })
            .addCase(AuthUser.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(AuthUser.fulfilled, (state, action) => {
                // if (action.payload.status !== 200) {
                //     toast.error(action.payload.message, {
                //         position: 'top-right',
                //         duration: 2000,
                //     });
                //     Cookies.remove('token')
                // }
                state.message = action.payload.message;
                state.loading = false
                if (action.payload.status === 200) {
                    state.user = action.payload.user
                }
            })
            .addCase(ForgotPassword.pending,(state)=>{
                state.loading = true;
                state.error = []
            })
            .addCase(ForgotPassword.fulfilled,(state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.user = action.payload?.user;
            })
            .addCase(verifyOtpForgotPassword.pending,(state)=>{
                state.loading = true;
                state.error = []
            })
            .addCase(verifyOtpForgotPassword.fulfilled,(state,action)=>{
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(resetPassword.pending,(state)=>{
                state.loading = true;
                state.error =[]
            })
            .addCase(resetPassword.fulfilled,(state,action)=>{
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(googleLogin.pending,(state)=>{
                state.loading = true;
                state.error = []
            })
            .addCase(googleLogin.fulfilled,(state,action)=>{
                state.loading = false;
                state.message = action.payload.message;
                state.user = action.payload.user;
            })

    }
})

export const { resetState,setUser } = authSlice.actions;
export default authSlice.reducer;