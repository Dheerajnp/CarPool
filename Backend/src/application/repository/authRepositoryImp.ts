import TempUser from "../../entities/interfaces/tempUserInterface";
import userModel from "../../frameworks/database/models/userSchema";
import { AuthRepository } from "../interfaces/repository/AuthRepository";
import * as CommonFunctions from "../functions/commonFunctions";
import * as sendMail from "../functions/sendMail";
import tempUserModel from "../../frameworks/database/models/tempUserSchema";
import Driver from "../../entities/interfaces/DriverInterface";
import User from "../../entities/interfaces/UserInterface";
import driverModel from "../../frameworks/database/models/driverSchema";
import bcrypt from "bcryptjs";

export class AuthRepositoryImp implements AuthRepository {

  async resetPasswordRepository(data: { email: string; password: string; role:string}): Promise<{ message: string; status: number; }> {
    try {
        const { email, password,role } = data;
      let foundUser = null;
      if(role === "rider"){
        foundUser = await userModel.findOne({email:email});
      }else if(role === "host"){
        foundUser = await driverModel.findOne({email:email});
      }

        if (!foundUser) {
            return {
                message: 'Invalid User',
                status: 401
            };
        }

        const encPassword = await CommonFunctions.HashPassword(password);

        // Update the password in the correct model based on which one contains the email
        if (role === "rider") {
            await userModel.findOneAndUpdate({ email: email }, { $set: { password: encPassword } });
        } else if (role === "driver") {
            await driverModel.findOneAndUpdate({ email: email }, { $set: { password: encPassword } });
        }

        return {
            message: 'Password reset successfully',
            status: 200
        };
    } catch (error) {
        console.error(error);
        return {
            message: 'Internal Server Error',
            status: 500
        };
    }
}


    async verifyOtpforgotPassword(data: { email: string; otp: string; role:string }): Promise<{ message: string; status: number; user: Driver | User | null }> {
        try {
            const { email, otp,role } = data;
           let foundUser=null;
            if(role === "rider"){
              foundUser = await userModel.findOne({email:email})
            }else if(role ==="host"){
              foundUser = await driverModel.findOne({email:email})
            }
            if (!foundUser) {
                return {
                    message: 'Invalid User',
                    status: 401,
                    user: null
                };
            }
    
            if (foundUser.otp !== otp) {
                return {
                    message: 'Invalid OTP',
                    status: 401,
                    user: null
                };
            }
    
            // Update the correct model based on which one contains the email
            if (role === "rider") {
                await userModel.findOneAndUpdate({ email: email }, { $set: { otp: null } });
            } else if (role === "host") {
                await driverModel.findOneAndUpdate({ email: email }, { $set: { otp: null } });
            }
    
            return {
                message: `OTP verified of the ${role} `,
                status: 200,
                user: foundUser,
            };
        } catch (error) {
            console.error(error);
            return {
                message: 'Internal Server Error',
                status: 500,
                user: null
            };
        }
    }
    

    async userForgotPassword(email: string,role:string): Promise<{ message: string; user: Driver | User | null; status: number; }> {
        try {
          let foundUser;
            if(role ==="rider"){
               foundUser = await userModel.findOne({email:email})
            }else if(role ==="host"){
              foundUser = await driverModel.findOne({email:email})
            }
            if (!foundUser) {
                return {
                    message: 'User not found',
                    status: 401,
                    user: null
                };
            }
    
            const otp = CommonFunctions.otpGenerator();
            sendMail.forgotPasswordOtpMail(otp, email);
            if (foundUser.role === "rider") {
                await userModel.findOneAndUpdate({ email: email }, { $set: { otp: otp } });
            } else if (foundUser.role === "host") {
                await driverModel.findOneAndUpdate({ email: email }, { $set: { otp: otp } });
            }
    
            return {
                message: `OTP sent to mail of the ${role}`,
                status: 200,
                user: foundUser ,
            };
        } catch (error) {
            console.error(error);
            return {
                message: 'Internal Server Error',
                status: 500,
                user: null
            };
        }
    }
  async findByCredentials(userCredentials: {
    email: string;
    password: string;
    role: string;
  }): Promise<{
    user: User | Driver | null;
    message: string | null;
    token: string | null;
    refreshToken: string | null;
  }> {
    const { role, email, password } = userCredentials;
    let token: string | null = null;
    let refreshToken: string | null = null;
    try {
      let userData;
      if (role === "host") {
        userData = await driverModel.findOne({ email: email });
      } else if (role === "rider") {
        userData = await userModel.findOne({ email: email });
      }
      if (!userData) {
        return {
          user: null,
          message: `No User found with this email`,
          token: null,
          refreshToken: null,
        };
      }
      if (userData.password) {
        const isMatch = await bcrypt.compare(password, userData.password);

        if (!isMatch) {
          return {
            user: null,
            message: "Incorrect password",
            token: null,
            refreshToken: null,
          };
        }

        token = CommonFunctions.jwtGenerateToken(
          userData._id as string,
          userData.role as string
        );
        refreshToken = CommonFunctions.jwtGenerateRefreshToken(
          userData._id as string,
          userData.role as string
        );
        return {
            user: userData,
            message: "User authenticated successfully",
            token: token,
            refreshToken: refreshToken,
          };
      }
      return{
        user: null,
        message: "Password not set for this user",
        token: null,
        refreshToken: null,
      }
      
    } catch (error) {
      console.error(error);
      throw new Error("Internal server error");
    }
  }
  async verifyOtp(
    tempId: string,
    enteredOtp: string
  ): Promise<{ user: User | Driver | null; message: string; status: number }> {
    try {
      const userData: TempUser | null = await tempUserModel.findById(tempId);

      if (!userData) {
        return {
          user: null,
          message: "User not found",
          status: 404,
        };
      }

      if (userData.otp !== enteredOtp) {
        return {
          user: null,
          message: "Invalid OTP",
          status: 401,
        };
      }

      let existingUser: User | Driver | null = null;

      if (userData.role === "host") {
        existingUser = await driverModel.findOne({ email: userData.email });
      } else if (userData.role === "rider") {
        existingUser = await userModel.findOne({ email: userData.email });
      } else {
        return {
          user: null,
          message: "Invalid role",
          status: 400,
        };
      }

      if (existingUser) {
        return {
          user: null,
          message: `${
            userData.role.charAt(0).toUpperCase() + userData.role.slice(1)
          } already exists`,
          status: 409,
        };
      }

      let newUser: User | Driver;

      if (userData.role === "host") {
        newUser = new driverModel({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          role: userData.role,
        });
      } else {
        newUser = new userModel({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          role: userData.role,
        });
      }

      await newUser.save();
      await tempUserModel.deleteOne({ _id: tempId });

      return {
        user: newUser,
        message: "User verified",
        status: 200,
      };
    } catch (error) {
      console.error("Error during OTP verification:", error);
      throw new Error("Internal Server Error");
    }
  }
  async userSave(userInfo: {
    name: string;
    password: string;
    email: string;
    role: string;
  }): Promise<{ message: string; user: TempUser | null; status: number }> {
    let { name, email, password, role } = userInfo;
    try {
      const userData = await userModel.findOne({ email: email });
      if (userData) {
        return {
          user: null,
          message: "User already exists",
          status: 409,
        };
      }
      password = await CommonFunctions.HashPassword(password);
      const otp = CommonFunctions.otpGenerator();
      tempUserModel.collection.createIndex(
        { created_at: 1 },
        { expireAfterSeconds: 900 }
      );
      const newUser: TempUser = new tempUserModel({
        name: name,
        email: email,
        password: password,
        role: role,
        otp: otp,
        created_at: Date.now(),
      });

      await sendMail.sendOtpMail(email, otp);
      const savedUser: TempUser = await newUser.save();
      return {
        user: newUser,
        message: "OTP sent to mail",
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return { message: "Error creating user", status: 500, user: null };
    }
  }
}
