import axios from 'axios'
import * as interfaces from './interfaces'

export const adminLogin:Function = async(credentials:interfaces.AdminLoginCredentials):Promise<interfaces.AdminLoginResponse>=>{
    try {
        const response = await axios.post('/admin/login',credentials,{
            withCredentials:true
        });
        return response.data
    } catch (error:any) {
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

export const adminVerify:Function = async(data:interfaces.AdminAuthVerifyData): Promise<interfaces.AdminAuthVerifyResponse> =>{
  try {
    const response = await axios.get('/admin/verify',{
      withCredentials:true,
      headers:{
        Authorization: `Bearer ${data.adminToken}`
      }
    });
    console.log("response.data=",response.data)
    return <interfaces.AdminAuthVerifyResponse> response.data;
  } catch (error) {
    console.error(error);
        return <interfaces.AdminAuthVerifyResponse>{
            message: 'Internal Server Error'
        };
  }
}