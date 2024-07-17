import { UserRepository } from "../interfaces/repository/UserRepository";
import userModel from "../../frameworks/database/models/userSchema"
import { url } from "inspector";
export class userRepositoryImp implements UserRepository{
    async uploadDocumentRepo(data: { userId: string; documentUrl: string; documentType: string; }): Promise<{ message: string; status: number; }> {
        const {userId, documentUrl, documentType } = data;
        try {
            const user = userModel.findById(userId);
            if(!user) {
                return {
                    message: 'User not found',
                    status: 404
                }
            }
            await userModel.findByIdAndUpdate(userId, {
                documents: {
                  url: documentUrl,
                  type: documentType,
                },
              });
            return{
                message: "Document uploaded successfully",
                status: 200,
            }
        } catch (error) {
            return {
                message: 'Internal Server Error',
                status: 500
            }
        }
    }

}