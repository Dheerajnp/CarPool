import { RequestHandler } from "express";
import { UserInteractor } from "../../application/interfaces/usecases/userInteractor";

export class userController{
    constructor(private readonly interactor:UserInteractor){}

    uploadDocument:RequestHandler = async(req,res,next)=>{
        const { userId } = req.params;
        const { documentUrl,documentType } = req.body;
        try{
          const { message,status } = await this.interactor.uploadDocumentInteractor({userId,documentUrl,documentType});
          return res.status(status).json({ message,status });
          
        }catch(error){
          return res.status(500).json({message  : "Internal server error",status:500});
        }
      }

      getUserDetails:RequestHandler = async(req,res,next)=>{
        const { userId } = req.params;
        try{
          const { user,message,status } = await this.interactor.getUserDetailsInteractor(userId);
          return res.status(status).json({ message, user, status });
          
        }catch(error){
          return res.status(500).json({message  : "Internal server error",status:500});
        }
      }

      editDocument:RequestHandler = async(req,res,next)=>{
        const { userId } = req.params;
        const { url,type } =req.body;
        try {
          const result = await this.interactor.editDocumentInteractor(userId,type,url);
          return res.status(result.status).json(result);
        } catch (error) {
          return {
            message: "Internal server error",
            status: 500
          }
        }
      }

      userInfoEdit:RequestHandler = async(req,res,next)=>{
        const {name, phone } = req.body;
        const { userId } = req.params;

        try{
          const { message, status } = await this.interactor.editUserInfoInteractor(userId,name,phone);
          return res.status(status).json({ message,status }); 
        }catch (error) {
        return res.status(500).json({message  : "Internal server error",status:500});
        }
      }

      getRides:RequestHandler = async(req,res,next)=>{
        const fromName = req.query.fromName as string ?? '';
        const fromCoordinates = req.query.fromCoordinates as [] ?? [];
        const toName = req.query.toName as string ?? '';
        const toCoordinates = req.query.toCoordinates  as [] ?? [];
        const date = new Date(req.query.date as string) ;

        try {
            const result  = await this.interactor.getRidesInteractor({ fromName, fromCoordinates, toName, toCoordinates,date });
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({message  : "Internal server error",status:500});
        }
    }

    getRideDetails:RequestHandler = async (req, res) => {
      const { rideId } = req.params;
      try {
        const result = await this.interactor.getRideDetailsInteractor(rideId);
        return res.status(result.status).json(result);
      } catch (error) {
        return res.status(500).json({ message: "Internal server error", status: 500 });
      }
    }

    getUserNotifications:RequestHandler = async(req,res)=>{
      const { userId } = req.query;
      try {
        const notification = await this.interactor.getUserNotificationInteractor(userId as string);
        return res.status(notification.status).json(notification);
      } catch (error) {
        return res.status(500).json({message: "Internal server error",status:500});
      }
    }

    createPayment:RequestHandler = async (req,res)=>{
      const { name, amount, email,rideId } = req.body;
      const  userId  = req.userId;
      console.log(userId,name,amount,email,rideId);
      try {
        const result = await this.interactor.createPaymentInteractor(name, amount, email, userId as string,rideId);;
        return res.status(result.status).json({
          message: result.message,
          sessionId: result.sessionId,
          status: result.status
        });
      } catch (error) {
        return res.status(500).json({ message: "Internal server error", status: 500 });
      }
    }
}
