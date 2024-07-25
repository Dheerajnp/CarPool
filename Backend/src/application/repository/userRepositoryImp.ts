import { UserRepository } from "../interfaces/repository/UserRepository";
import userModel from "../../frameworks/database/models/userSchema"
import { url } from "inspector";
import User from "../../entities/interfaces/UserInterface";
export class userRepositoryImp implements UserRepository{
    async editUserInfoRepository(userId: string, name: string, phone: string): Promise<{ message: string; status: number; }> {
        try {
            const user = await userModel.findByIdAndUpdate(userId, {
                name: name,
                phone: phone
            }, { new: true });
            if (!user) {
                return {
                    message: 'User not found',
                    status: 404
                }
            }
            return {
                message: 'User info updated successfully',
                status: 200
            }
        } catch (error) {
            console.log(error)
            return{
                message: 'Internal Server Error',
                status: 500
            }
        }
    }
    async editDocumentRepository(userId: string,type:string,url:string): Promise<{ message: string; status: number; }> {
        try {
            const user = await userModel.findByIdAndUpdate(userId, {
                verified:false,
                documents: {
                  url: url,
                  type: type,
                  status: 'pending'
                }
            }, { new: true });
            if (!user) {
                return {
                    message: 'User not found',
                    status: 404
                }
            }
            return {
                message: 'Document updated successfully',
                status: 200
            }
        } catch (error) {
            console.log(error);
            return {
                message: 'Internal Server Error',
                status: 500
            }
        }
    }
    async getUserDetailsRepository(userId: string): Promise<{ message: string; status: number; user: User | null; }> {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                return {
                    message: 'User not found',
                    status: 404,
                    user: null
                }
            }
            return {
                message: 'User found successfully',
                status: 200,
                user:user
            }
        } catch (error) {
            console.log(error);
            return {
                message: 'Internal Server Error',
                status: 500,
                user: null
            }
        }
    }
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
                  status: 'pending'
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