import Driver from "../../entities/interfaces/DriverInterface";
import TempUser from "../../entities/interfaces/tempUserInterface";
import User from "../../entities/interfaces/UserInterface";
import { AuthRepository } from "../interfaces/repository/AuthRepository";
import { authInteractor } from "../interfaces/usecases/authInteractor";

export class authInteractorImp implements authInteractor{
    constructor(private readonly repository:AuthRepository){}

    async resetPasswordInteractor(email: string, password: string,role:string): Promise<{ message: string; status: number; }> {
      try {
        const result = await this.repository.resetPasswordRepository({email, password,role});
        return result
      } catch (error) {
        return{
          message: 'Internal Server Error',
          status: 500,
        }
        
      }
    }
  async verifyOtpforgotPasswordInteractor(email: string, otp: string,role:string): Promise<{ user: User | null | Driver; message: string; status: number; }> {
    try {
      
      const result = await this.repository.verifyOtpforgotPassword({email, otp,role});
      return result;
      
    } catch (error:any) {
      console.log(error.message);
      return{
        message: 'Internal Server Error',
        status: 500,
        user:null
      }
    }
  }
  async forgotPasswordInteractor(email: string,role:string): Promise<{ message: string; user: Driver | null | User; status: number; }> {
    try {
      const result = await this.repository.userForgotPassword(email,role);
      return result;
  } catch (error) {
    console.log(error);
    return {
      message: 'Internal Server Error',
      status: 500,
      user: null
    }
  }
  }
  async loginInteractor(credentials: { email: string; password: string; role: string; }): Promise<{ user: User | Driver | null; message: string | null; token: string | null; refreshToken: string | null; }> {
    try {
      const { user,message,refreshToken,token } = await this.repository.findByCredentials(credentials);
      return { user,message,refreshToken,token }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async verifyOtpAndSave(enteredOtp: string, tempId: string): Promise<{ user: User | Driver | null; message: string; status: number; }> {
    try {
      
      
      const { user, message, status} = await this.repository.verifyOtp(
        tempId,
        enteredOtp
      );
      return { user: user, message: message,status: status };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
   async createUser(userData: { email: string; password: string; name: string; role: string; }): Promise<{ message: string; status: number; user: TempUser | null; }> {
        try {
            console.log(userData);
      
            const newUser: {
              name: string;
              password: string;
              email: string;
              role: string;
            } = {
              name: userData.name,
              email: userData.email,
              password: userData.password,
              role: userData.role,
            };
      
            const { message, user, status } = await this.repository.userSave(newUser);
            
            return {
              message: message,
              user: user,
              status: status,
            }
          } catch (error) {
            console.error("Error during signup:", error);
            throw error;
          }
    }
}