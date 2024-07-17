import { UserRepository } from "../interfaces/repository/UserRepository";
import { UserInteractor } from "../interfaces/usecases/userInteractor";

export class userInteractorImp implements UserInteractor {
    constructor(private readonly repository: UserRepository) {}
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