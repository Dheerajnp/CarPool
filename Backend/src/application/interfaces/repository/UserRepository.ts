import { IRide } from "../../../entities/interfaces/RideInterface"
import User from "../../../entities/interfaces/UserInterface"

export interface UserRepository{
    uploadDocumentRepo(data:{userId:string,documentUrl:string,documentType:string}):Promise<{message:string,status:number}>
    getUserDetailsRepository(userId:string):Promise<{message:string,status:number,user:User|null}>
    editDocumentRepository(userId:string,type:string,url:string):Promise<{message:string,status:number}>
    editUserInfoRepository(userId:string,name:string,phone:string):Promise<{message:string,status:number}>
    getRidesRepository(data:{fromName:string,fromCoordinates:number[],toName:string,toCoordinates:number[],date:Date|undefined}):Promise<{message:string,status:number,rides:IRide[]}>
}