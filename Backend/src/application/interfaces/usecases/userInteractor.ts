import { IRide } from "../../../entities/interfaces/RideInterface"
import User from "../../../entities/interfaces/UserInterface"

export interface UserInteractor{
    uploadDocumentInteractor(data:{userId:string,documentUrl:string,documentType:string}):Promise<{message:string,status:number}>
    getUserDetailsInteractor(userId:string):Promise<{message:string,status:number,user:User|null}>
    editDocumentInteractor(userId:string,type:string,url:string):Promise<{message:string,status:number}>
    editUserInfoInteractor(userId:string,name:string,phone:string):Promise<{message:string,status:number}>
    getRidesInteractor(data:{fromName:string,fromCoordinates:number[],toName:string,toCoordinates:number[],date:Date|undefined}):Promise<{message:string,status:number,rides:IRide[]}>
    getRideDetailsInteractor(rideId:string):Promise<{message:string,status:number,ride:IRide|null}>
    getUserNotificationInteractor(userId:string):Promise<{status:number,message:string,notifications:any[]}>
    createPaymentInteractor(name:string, amount:number, email:string, userId:string,rideId:string):Promise<{message:string,status:number,sessionId:string}>
    
}