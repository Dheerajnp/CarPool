import { hash } from 'bcryptjs';
import jwt from "jsonwebtoken"
import { configuredKeys } from '../../config/config';



export const HashPassword:Function = async(password:string)=>{
    return await hash(password,10);
}

export const otpGenerator:Function = ():string => {
    const otp = Math.floor(10000+Math.random()*900000);
    return otp.toString();
}


export const otpHash:Function = async(otp:string)=>{
    return await hash(otp,8);
}


export const jwtGenerateToken = (userID: string,userRole:string): string => {
    const payload = {
      userID: userID,
      role: userRole,
    };
    return jwt.sign(payload, configuredKeys.JWT_SECRET_KEY, { expiresIn: "1h" });
  };

  export const jwtGenerateAdminToken = (adminID: string): string => {
    const payload = {
      adminID: adminID,
    };
    return jwt.sign(payload, configuredKeys.JWT_SECRET_KEY, { expiresIn: "1h" });
  };

  export const jwtGenerateAdminRefreshToken = (adminID: string): string => {
    const payload = {
      adminID: adminID,
    };
    return jwt.sign(payload, configuredKeys.JWT_SECRET_KEY, { expiresIn: "10h" });
  }

  export const jwtGenerateRefreshToken = (userID: string,userRole:string): string => {
    const payload = {
      userID: userID,
      role: userRole,
    };
    return jwt.sign(payload, configuredKeys.JWT_SECRET_KEY, { expiresIn: "10h" });
  };

  export const jwtVerifyToken = {}