import { RequestHandler } from "express";
import { UserInteractor } from "../../application/interfaces/usecases/userInteractor";

export class userController{
    constructor(private readonly interactor:UserInteractor){}

    uploadDocument:RequestHandler = async(req,res,next)=>{
        const { userId } = req.params;
        const { documentUrl,documentType } = req.body;
        console.log("uploaddocument");
        try{
          const { message,status } = await this.interactor.uploadDocumentInteractor({userId,documentUrl,documentType});
          return res.status(status).json({ message,status });
          
        }catch(error){
          return res.status(500).json({message  : "Internal server error",status:500});
        }
      }
}