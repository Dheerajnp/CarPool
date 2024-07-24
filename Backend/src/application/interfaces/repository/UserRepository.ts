import User from "../../../entities/interfaces/UserInterface"

export interface UserRepository{
    uploadDocumentRepo(data:{userId:string,documentUrl:string,documentType:string}):Promise<{message:string,status:number}>
    getUserDetailsRepository(userId:string):Promise<{message:string,status:number,user:User|null}>
    editDocumentRepository(userId:string,type:string,url:string):Promise<{message:string,status:number}>
    editUserInfoRepository(userId:string,name:string,phone:string):Promise<{message:string,status:number}>
}