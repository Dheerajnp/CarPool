import User from "../../../entities/interfaces/UserInterface"

export interface UserInteractor{
    uploadDocumentInteractor(data:{userId:string,documentUrl:string,documentType:string}):Promise<{message:string,status:number}>
    getUserDetailsInteractor(userId:string):Promise<{message:string,status:number,user:User|null}>
    editDocumentInteractor(userId:string,type:string,url:string):Promise<{message:string,status:number}>
    editUserInfoInteractor(userId:string,name:string,phone:string):Promise<{message:string,status:number}>
}