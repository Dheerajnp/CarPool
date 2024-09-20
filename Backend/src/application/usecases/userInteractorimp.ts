import { IRide } from "../../entities/interfaces/RideInterface";
import User from "../../entities/interfaces/UserInterface";
import { UserRepository } from "../interfaces/repository/UserRepository";
import { UserInteractor } from "../interfaces/usecases/userInteractor";
import {createPaymentIntent} from "../../frameworks/payment/stripePaymentService"

export class userInteractorImp implements UserInteractor {
    constructor(private readonly repository: UserRepository) {}
  async createPaymentInteractor(name: string, amount: number, email: string, userId: string,rideId:string): Promise<{ message: string; status: number; sessionId: string; }> {
    try {
      const {message, status, sessionId} = await this.repository.createPaymentRepository(name, amount,email,userId,rideId);
      console.log("bbbbbbbbbbbbbbbbbbbbbb",message, status, sessionId)
      return {
        message,
        status,
        sessionId
      };
    } catch (error) {
      return{
        message: 'Internal Server Error',
        status: 500,
        sessionId: ''
      }
    }
  }
  async getUserNotificationInteractor(userId: string): Promise<{ status: number; message: string; notifications: any[]; }> {
    try {
      const result = await this.repository.getUserNotificationRepository(userId);
      return result;
  } catch (error) {
      console.log(error);
      return {
          message: 'Internal Server Error',
          status: 500,
          notifications: []
      }
  }
  }
  async getRideDetailsInteractor(rideId: string): Promise<{ message: string; status: number; ride: IRide | null; }> {
    try {
      const result = await this.repository.getRideDetailsRepository(rideId);
      return result;
    } catch (error) {
      console.error(error);
      return {
        message: 'Internal Server Error',
        status: 500,
        ride: null
      };
    }
  }
  async getRidesInteractor(data: { fromName: string; fromCoordinates: number[]; toName: string; toCoordinates: number[]; date: Date|undefined; }): Promise<{ message: string; status: number; rides: IRide[]; }> {
    try {
      const result = await this.repository.getRidesRepository(data);
      return result;
    } catch (error) {
      console.error(error);
      return {
        message: 'Internal Server Error',
        status: 500,
        rides: []
      };
    }
  }
  async editUserInfoInteractor(userId: string, name: string, phone: string): Promise<{ message: string; status: number; }> {
    try {
      const result = await this.repository.editUserInfoRepository(userId,name,phone);
      return result;
    } catch (error) {
      console.error(error);
      return {
        message: 'Internal Server Error',
        status: 500
      };
    }
  }
  async editDocumentInteractor(userId: string,type:string,url:string): Promise<{ message: string; status: number; }> {
    try {
      const result = await this.repository.editDocumentRepository(userId,type,url);
      return result;
    } catch (error) {
      console.error(error);
      return {
        message: 'Internal Server Error',
        status: 500
      };
    }
  }
  async getUserDetailsInteractor(userId: string): Promise<{ message: string; status: number; user: User|null; }> {
    try {
      const result = await this.repository.getUserDetailsRepository(userId);
      return result;
    } catch (error) {
      console.error(error);
      return {
        message: 'Internal Server Error',
        status: 500,
        user: null
      };
    }
  }
    async uploadDocumentInteractor(data: { userId: string; documentUrl: string; documentType: string; }): Promise<{ message: string; status: number; }> {
         try {
            const result = await this.repository.uploadDocumentRepo(data);
            return result
          } catch (error) {
            console.error(error);
            return {
              message: 'Internal Server Error',
              status: 500
            }
          }
    }
    

}