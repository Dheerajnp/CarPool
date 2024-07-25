import { RequestHandler } from "express";
import { AdminInteractor } from "../../application/interfaces/usecases/AdminInteractor";

export class adminController{
    constructor(private readonly interactor : AdminInteractor){}

    adminLogin:RequestHandler = async(req,res)=>{
        const { email , password } = req.body;
        console.log(req.body)
        try {
            const { user,message,token,status} = await this.interactor.AdminLogin({email,password});
            if (!user) {
                return res.status(status).json({ message, token: null, user: null });
              }
              console.log(`message: ${message} `);
              console.log(`token:   ${token}`);
              console.log(`ref:  ${status} `);
              console.log(`user: ${user}`);
            return res.status(200).json({ message,admin:user, token})
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    adminVerifyController:RequestHandler = async(req,res,next)=>{
        try {
            const adminToken = req.headers.authorization;
            console.log("adminVerifyController",adminToken)
            const result = await this.interactor.AdminVerifyInteractor(adminToken as string)
            if (result.status === 200) {
                // req.result = result
                return res.status(result.status).json(result)
            }
            return res.status(result.status).json(result)
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }
    
    getAllUsers:RequestHandler = async(req,res,next)=>{
       try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchQuery = req.query.searchQuery as string || '';
        const result = await this.interactor.FindAllUsersInteractor(page,limit,searchQuery);
        res.json(result);
        
       } catch (error) {
        console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' })
       }
    }

    getPendingDrivers:RequestHandler = async(req,res,next)=>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const searchQuery = req.query.searchQuery as string || "";
            const result = await this.interactor.FindAllPendingDriversInteractor(page,limit,searchQuery);
            res.json(result);;
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    userActions:RequestHandler = async(req,res,next)=>{
        console.log("userActions controller");
        const { id,block } = req.params;
        const { role } = req.body;
        try {
            const { message,users,status } = await this.interactor.actionInteractor(id,block,role);
            return res.status(status).json({ message , users , status})
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' })
            
        }
    }

    licenseApproval:RequestHandler = async(req,res,next)=>{
        console.log("licenseApproval controller");
        const { userId } = req.params;
        const { licenseStatus } = req.body;
        console.log(userId, licenseStatus)
        try{
            const { message , status } = await this.interactor.licenseStatusInteractor(userId,licenseStatus);
            return res.status(status).json({ message, status })
        }catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    pendingUserDocs:RequestHandler = async(req, res) => {
        
        console.log('pendingUserDocs controller');
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const searchQuery = req.query.searchQuery as string || '';
            const result = await this.interactor.pendingUserDocsInteractor(searchQuery,page,limit);
            res.json(result);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    getPendingVehicles:RequestHandler = async(req,res,next)=>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const searchQuery = req.query.searchQuery as string || '';
            const result = await this.interactor.getPendingVehiclesInteractor(searchQuery,page,limit);
            console.log("wdddcd",result)
            res.status(200).json({result})
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    approveVehicle:RequestHandler =async(req,res,next)=>{
        const {driverId,vehicleId} = req.params;
        try {
            const result = await this.interactor.approveVehicleInteractor(driverId,vehicleId);
            res.status(result.status).json({result})
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    rejectVehicle:RequestHandler =async(req,res,next)=>{
        const {driverId,vehicleId} = req.params;
        try {
            const result = await this.interactor.rejectVehicleInteractor(driverId,vehicleId);
            res.status(result.status).json({result})
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    rejectDocument:RequestHandler = async(req,res,next)=>{
       const {userId} = req.params;
        try {
            const result = await this.interactor.rejectDocumentInteractor(userId);
            res.status(result.status).json({result})
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    acceptDocument:RequestHandler = async(req,res,next)=>{
        const {userId} = req.params;
        console.log("user",userId)
         try {
             const result = await this.interactor.acceptDocumentInteractor(userId);
             res.status(result.status).json({result})
         } catch (error) {
             console.log(error);
             throw error;
         }
     }
}