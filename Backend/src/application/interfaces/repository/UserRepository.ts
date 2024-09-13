import { IRide } from "../../../entities/interfaces/RideInterface"
import User from "../../../entities/interfaces/UserInterface"

export interface UserRepository{
    uploadDocumentRepo(data:{userId:string,documentUrl:string,documentType:string}):Promise<{message:string,status:number}>
    getUserDetailsRepository(userId:string):Promise<{message:string,status:number,user:User|null}>
    editDocumentRepository(userId:string,type:string,url:string):Promise<{message:string,status:number}>
    editUserInfoRepository(userId:string,name:string,phone:string):Promise<{message:string,status:number}>
    getRidesRepository(data:{fromName:string,fromCoordinates:number[],toName:string,toCoordinates:number[],date:Date|undefined}):Promise<{message:string,status:number,rides:IRide[]}>
    getRideDetailsRepository(rideId:string):Promise<{message:string,status:number,ride:IRide|null}>
    getUserNotificationRepository(userId:string):Promise<{status:number,message:string,notifications:any[]}>
    createPaymentRepository(name:string, amount:number, email:string, userId:string,rideId:string):Promise<{message:string,status:number,sessionId:string}>
}