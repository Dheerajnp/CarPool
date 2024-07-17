export interface UserInteractor{
    uploadDocumentInteractor(data:{userId:string,documentUrl:string,documentType:string}):Promise<{message:string,status:number}>
}