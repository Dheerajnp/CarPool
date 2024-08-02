import { UserRepository } from "../interfaces/repository/UserRepository";
import userModel from "../../frameworks/database/models/userSchema"
import moment from 'moment';
import User from "../../entities/interfaces/UserInterface";
import { IRide } from "../../entities/interfaces/RideInterface";
import Ride from "../../frameworks/database/models/rideSchema";
export class userRepositoryImp implements UserRepository{
    async getRidesRepository(data: { fromName: string; fromCoordinates: number[]; toName: string; toCoordinates: number[]; date: Date|undefined; }): Promise<{ message: string; status: number; rides: IRide[]; }> {
        const { fromName, fromCoordinates, toName, toCoordinates,date } = data;
        try{

            const startOfDay = moment(date).add(1,'day').startOf('day').toDate(); // Start of the day
            const endOfDay = moment(date).add(2,'day').startOf('day').toDate(); // Start of the next day
            console.log(startOfDay);
            console.log(endOfDay);
            if(date!==undefined){
                console.log(new Date(date))
                const rides = await Ride.find(
                    {
                        "rideDate": {
                          "$gte": startOfDay,
                          "$lte": endOfDay
                        },
                        "$and": [
                          {
                            "origin.coordinates": {
                              "$geoWithin": {
                                "$centerSphere": [[fromCoordinates[0], fromCoordinates[1]], 10 / 6378.1]
                              }
                            }
                          },
                          {
                            "destination.coordinates": {
                              "$geoWithin": {
                                "$centerSphere": [[toCoordinates[0], toCoordinates[1]], 10 / 6378.1]
                              }
                            }
                          }
                        ]
                      }
                ).populate("driver");

                console.log("chdjbjdbjbjaebhkv")
                console.log(rides)
                return{
                    message: 'Rides found successfully',
                    status: 200,
                    rides: rides
                }
            }
            return{
                message: 'No rides found',
                status: 200,
                rides: []
            }
            
        }catch(error){
            console.log(error)
            return{
                message: 'Internal Server Error',
                status: 500,
                rides: []
            }
        }
    }
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