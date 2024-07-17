export interface UserRepository{
    uploadDocumentRepo(data:{userId:string,documentUrl:string,documentType:string}):Promise<{message:string,status:number}>
}