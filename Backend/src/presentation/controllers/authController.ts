import { authInteractor } from "../../application/interfaces/usecases/authInteractor";
import {Request, Response,NextFunction,RequestHandler } from 'express'

export class authController{
    constructor(private readonly interactor:authInteractor){}

    register:RequestHandler = async(req,res,next)=>{
        const {name, email, password,role} = req.body;
        console.log("register",name,email,password)
       try {
      const user = { name, email, password, role };
      const result = await this.interactor.createUser(user);
      res.status(result.status).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating user" });
    }
        
    }

    
    verifyOTP:RequestHandler = async (req, res) => {
      try {

        const tempId = req.params.userId;
        const {otp} = req.body;
        const enteredOtp = otp;
        const result = await this.interactor.verifyOtpAndSave(enteredOtp, tempId);

        if(result.user!==null) {
          return res.status(200).json({ message: result.message,user: result.user});
        }
       return res.status(result.status).json(result);
        
      } catch (error:any) {
        console.log(error);
        return res.status(400).json({ message:error.message ,user:null});
      }
    }

    login:RequestHandler = async (req, res) => {
      const { email, password, role } = req.body;
      console.log(email,password,role)
      try {
        const { user, token, message, refreshToken } =
        await this.interactor.loginInteractor({ email, password, role });
        let userData = {
          id:user?.id,
          name: user?.name,
          email: user?.email,
          role: user?.role,
        }
      if (!user) {
        return res.status(401).json({ message, token: null });
      }
      return res.status(200).json({ message, user:userData, token, refreshToken });
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    forgotPassword:RequestHandler = async (req, res) => {
      try {
        const { email,role } = req.body;
        const result = await this.interactor.forgotPasswordInteractor(email,role);
        console.log(result);
        return res.status(result.status).json(result);
      } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error'});
      }
    }

    forgotPasswordConfirmation:RequestHandler = async (req, res) => {
      try {
        const { email,otp,role } = req.body;
        const result = await this.interactor.verifyOtpforgotPasswordInteractor(email,otp,role);
        console.log(result);
        return res.status(result.status).json(result);
      } catch (error) {
        return res.status(500).json({ message: 'Internal Server'});
      }
    }

    resetPassword:RequestHandler = async(req,res)=>{
      console.log(req.body);  
      try {
        const { email,password,role } = req.body;
        console.log(email,password)
        const result = await this.interactor.resetPasswordInteractor(email,password,role)
        console.log("successsssssssss",result);
        return res.status(result.status).json(result)
      } catch (error) {
        return res.status(500).json({message:'Internal Server error'})
      }
    }



}