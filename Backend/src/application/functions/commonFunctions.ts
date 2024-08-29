import { hash } from 'bcryptjs';
import jwt from "jsonwebtoken"
import { configuredKeys } from '../../config/config';

export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


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
    return jwt.sign(payload, configuredKeys.JWT_SECRET_KEY, { expiresIn: "7d" });
  };

  export const jwtGenerateAdminToken = (adminID: string): string => {
    const payload = {
      adminID: adminID,
    };
    return jwt.sign(payload, configuredKeys.JWT_SECRET_KEY, { expiresIn: "14d" });
  };

  export const jwtGenerateAdminRefreshToken = (adminID: string): string => {
    const payload = {
      adminID: adminID,
    };
    return jwt.sign(payload, configuredKeys.JWT_SECRET_KEY, { expiresIn: "7h" });
  }

  export const jwtGenerateRefreshToken = (userID: string,userRole:string): string => {
    const payload = {
      userID: userID,
      role: userRole,
    };
    return jwt.sign(payload, configuredKeys.JWT_SECRET_KEY, { expiresIn: "14h" });
  };

  export const jwtVerifyToken = {}