import { NextFunction, Request, Response,RequestHandler} from "express";
import  jwt, { JwtPayload }  from "jsonwebtoken";
import { configuredKeys } from "../../config/config";
import userModel from "../../frameworks/database/models/userSchema"
import Cookie from "js-cookie"
import { jwtGenerateToken } from "../../application/functions/commonFunctions"



declare global {
    namespace Express{

        interface Request {
            userId?: string;
            role?: string;
        }
    }
}
export const authMiddleware:RequestHandler = async(req:Request, res:Response, next:NextFunction)=>{
   try {
        const token = req.headers["authorization"];
        const accessToken = token?.split(" ")[1];
        const decodedToken = jwt.verify(accessToken as string ,configuredKeys.JWT_SECRET_KEY) as JwtPayload;
        if(!decodedToken){
            return res.status(401).json({message:"Invalid token", status:403});
        }
        req.role = decodedToken.role;
        req.userId = decodedToken.userID;
        next();
   } catch (error) {
        console.log(error);
        return res.status(401).json({message:"Invalid token", status:403});
   }
    
}



/**
 * Checking user already existed
 * @param email - email for checking
 * @returns if exist return exist message otherwise next()
 */

export const userBlocked = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
      const {email} = req.body;
    try {
      console.log(req.body)
      const user = await userModel.findOne({email : email});
      console.log(user);
      if(user && user.blocked){
          return res.status(401).json({message : "User Blocked"});
      }
      next();
    } catch (error) {
      res.status(400).json({ message: "Internal server error", token: null });
      console.log("Oops Error in userExists middleware ", error);
    }
  };


  export const userExistsGoogle = async( req:Request, res:Response, next:NextFunction )=>{
    try {
        const { email } = req.body;
        const user = await userModel.findOne({email:email});
        if(user){
            const role = user.role;
            const token = jwtGenerateToken(user._id as string, user.role as string);
            Cookie.set("token",token);
            return res.status(200).json({message:"Successfull..",status:200,user:user})
        }
        
        next();
    } catch (error) {
        res.status(400).json({ message: "Internal server error", status:400, user:null});
        console.log("Oops Error in userExists middleware ", error);
    }
}
