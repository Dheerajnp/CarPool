import axiosApiGateway from "../../../functions/axios"
import axios from 'axios'
import * as interfaces from './interfaces'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.baseURL = API_BASE_URL;
// axios.defaults.withCredentials = true;

export const register: Function = async (data:interfaces.RegisterCredentials) => {
    try {
        const response = await axios.post('/register', data, {
            withCredentials: true
        })
        return response.data
    } catch (e) {
        return {
            errors: [],
            message: 'Internal Server Error',
            status: 500
        }
    }
}


export const verifyOtp: Function = async (userId: string, otp: string) => {
  try {
    const response = await axios.post(`/verifyotp/${userId}`, { otp }, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return {
        errors: [],
        message: error.response.data.message,
        status: error.response.status
      };
    } else {
      return {
        errors: [],
        message: 'Internal Server Error',
        status: 500
      };
    }
  }
};

export const login:Function =async (data:interfaces.LoginCredentials):Promise<interfaces.LoginResponse>=>{
    try {
        const response = await axios.post('/login',data,{
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

export const VerifyUserAuth=async(data:interfaces.AuthVerifyUser):Promise<interfaces.AuthVerifyUserResponse>=>{
    try {
        const response = await axiosApiGateway.get(`/user/verify`, {
            withCredentials: true,
        headers: {
                Authorization: `Bearer ${data.token}`
            }
        });
        return <interfaces.AuthVerifyUserResponse>response.data;
    } catch (e) {
        console.error(e);
        return <interfaces.AuthVerifyUserResponse>{
            message: 'Internal Server Error'
        };
    }
}

export const ForgotPassword:Function = async(data:interfaces.ForgotPasswordCredentials): Promise<interfaces.AuthVerifyUserResponse>=>{
    try {
      const response = await axios.post(`/forgotpassword`,data,{
        withCredentials: true
      })
      
      return <interfaces.ForgotPasswordResponse> response.data
    } catch (error) {
      console.error(error);
      return <interfaces.ForgotPasswordResponse>{
          message: 'Internal Server Error'
      };
    }
}

export const verifyOtpForgotPassword:Function = async(data:interfaces.OtpForgotPwd)=>{
  try {
    const response = await axios.post('/forgot-password/otp',data,{
      withCredentials: true
    })
    return <interfaces.OtpForgotPwdResponse> response.data
  } catch (error) {
    console.error(error);
      return <interfaces.OtpForgotPwdResponse>{
          message: 'Internal Server Error'
      };
  }
}

export const resetPassword:Function = async(data:interfaces.ResetPasswordCredentials)=>{
  try {
      const response = await axios.post('/reset-password',data,{
        withCredentials: true
      })
      return <interfaces.ResetPasswordResponse> response.data
  } catch (error) {
    console.log(error);
    return <interfaces.ResetPasswordResponse>{
        message: 'Internal Server Error',
        status:500
    };
  }
}

export const googleSignup:Function = async(credentials:interfaces.GoogleSignUpCredentials)=>{
  try {
    const response = await axios.post('/google-signup',credentials,{
      withCredentials: true
    })
    return <interfaces.GoogleSignUpResponse> response.data
  } catch (error) {
    console.log(error);
    return <interfaces.GoogleSignUpResponse>{
        message: 'Internal Server Error',
        status:500
    };
  }
}

export const licenseUpload:Function = async({userId, licenseFrontUrl, licenseBackUrl}:interfaces.UploadLicenseCredentials)=>{
  try {
    const response = await axiosApiGateway.put(
      `/user/profile/upload-license/${userId}`,
      { licenseFrontUrl, licenseBackUrl },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return {
      message: 'Internal Server Error',
      status: 500
    }
  }
}