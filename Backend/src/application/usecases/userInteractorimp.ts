import User from "../../entities/interfaces/UserInterface";
import { UserRepository } from "../interfaces/repository/UserRepository";
import { UserInteractor } from "../interfaces/usecases/userInteractor";

export class userInteractorImp implements UserInteractor {
    constructor(private readonly repository: UserRepository) {}
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